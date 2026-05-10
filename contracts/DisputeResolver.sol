// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DisputeResolver
 * @notice Governance mechanism for resolving disputes about agent performance or misconduct
 * @dev Community voting on agent accountability
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./AgentRegistry.sol";

contract DisputeResolver is Ownable, ReentrancyGuard {
    
    enum DisputeStatus { OPEN, VOTING, RESOLVED, DISMISSED }
    enum VoteType { UPHOLD_AGENT, PENALIZE_AGENT, ABSTAIN }

    struct Dispute {
        uint256 disputeId;
        address agentAddress;
        address reporter;
        string evidence; // IPFS hash of evidence
        DisputeStatus status;
        uint256 createdAt;
        uint256 votingEndTime;
        uint256 upvotes;
        uint256 downvotes;
        uint256 abstentions;
        DisputeStatus resolution;
    }

    struct Vote {
        address voter;
        VoteType voteType;
        uint256 votedAt;
    }

    AgentRegistry public agentRegistry;
    
    mapping(uint256 => Dispute) public disputes;
    mapping(uint256 => Vote[]) public disputeVotes;
    mapping(uint256 => mapping(address => bool)) public hasVoted; // disputeId => voter => voted
    
    uint256 public disputeCounter;
    uint256 public votingPeriodDuration = 7 days;
    uint256 public minimumVotersRequired = 10;
    
    uint256 public constant PENALTY_SUSPENSION_DAYS = 30;

    event DisputeCreated(uint256 indexed disputeId, address indexed agent, address indexed reporter);
    event VoteCasted(uint256 indexed disputeId, address indexed voter, VoteType voteType);
    event DisputeResolved(uint256 indexed disputeId, DisputeStatus resolution);

    constructor(address _agentRegistry) {
        agentRegistry = AgentRegistry(_agentRegistry);
    }

    /**
     * @notice Create a dispute against an agent
     * @param _agentAddress Agent being disputed
     * @param _evidenceIPFS IPFS hash of evidence
     */
    function createDispute(
        address _agentAddress,
        string calldata _evidenceIPFS
    ) external {
        require(agentRegistry.getAgent(_agentAddress).agentAddress != address(0), "Agent not found");
        require(bytes(_evidenceIPFS).length > 0, "Evidence required");

        uint256 disputeId = disputeCounter++;
        
        disputes[disputeId] = Dispute({
            disputeId: disputeId,
            agentAddress: _agentAddress,
            reporter: msg.sender,
            evidence: _evidenceIPFS,
            status: DisputeStatus.OPEN,
            createdAt: block.timestamp,
            votingEndTime: block.timestamp + votingPeriodDuration,
            upvotes: 0,
            downvotes: 0,
            abstentions: 0,
            resolution: DisputeStatus.OPEN
        });

        emit DisputeCreated(disputeId, _agentAddress, msg.sender);
    }

    /**
     * @notice Cast a vote on an open dispute
     * @param _disputeId Dispute ID
     * @param _voteType Vote: uphold agent (true) or penalize (false)
     */
    function castVote(uint256 _disputeId, VoteType _voteType) external nonReentrant {
        Dispute storage dispute = disputes[_disputeId];
        
        require(dispute.status == DisputeStatus.OPEN, "Dispute not open for voting");
        require(block.timestamp < dispute.votingEndTime, "Voting period ended");
        require(!hasVoted[_disputeId][msg.sender], "Already voted");

        hasVoted[_disputeId][msg.sender] = true;

        if (_voteType == VoteType.UPHOLD_AGENT) {
            dispute.upvotes++;
        } else if (_voteType == VoteType.PENALIZE_AGENT) {
            dispute.downvotes++;
        } else {
            dispute.abstentions++;
        }

        disputeVotes[_disputeId].push(Vote({
            voter: msg.sender,
            voteType: _voteType,
            votedAt: block.timestamp
        }));

        emit VoteCasted(_disputeId, msg.sender, _voteType);
    }

    /**
     * @notice Finalize dispute voting and resolve
     * @param _disputeId Dispute ID to resolve
     */
    function resolveDispute(uint256 _disputeId) external nonReentrant {
        Dispute storage dispute = disputes[_disputeId];
        
        require(dispute.status == DisputeStatus.OPEN, "Not open for resolution");
        require(block.timestamp >= dispute.votingEndTime, "Voting still ongoing");

        uint256 totalVotes = dispute.upvotes + dispute.downvotes + dispute.abstentions;
        require(totalVotes >= minimumVotersRequired, "Insufficient votes");

        // Majority vote determines resolution
        if (dispute.downvotes > dispute.upvotes) {
            dispute.resolution = DisputeStatus.RESOLVED; // Agent penalized
            // Would trigger suspension/reputation penalty in real implementation
        } else {
            dispute.resolution = DisputeStatus.DISMISSED; // Agent upheld
        }

        dispute.status = DisputeStatus.RESOLVED;

        emit DisputeResolved(_disputeId, dispute.resolution);
    }

    /**
     * @notice Get dispute details
     * @param _disputeId Dispute ID
     */
    function getDispute(uint256 _disputeId) external view returns (Dispute memory) {
        return disputes[_disputeId];
    }

    /**
     * @notice Get votes for a dispute
     * @param _disputeId Dispute ID
     */
    function getDisputeVotes(uint256 _disputeId) external view returns (Vote[] memory) {
        return disputeVotes[_disputeId];
    }

    /**
     * @notice Get all disputes for an agent
     * @param _agentAddress Agent address
     */
    function getDisputesForAgent(address _agentAddress) external view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](disputeCounter);
        uint256 count = 0;
        
        for (uint256 i = 0; i < disputeCounter; i++) {
            if (disputes[i].agentAddress == _agentAddress) {
                result[count] = i;
                count++;
            }
        }

        // Resize array to actual count
        uint256[] memory resized = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            resized[i] = result[i];
        }
        
        return resized;
    }

    /**
     * @notice Set voting period duration
     * @param _newDuration Duration in seconds
     */
    function setVotingDuration(uint256 _newDuration) external onlyOwner {
        require(_newDuration >= 1 days && _newDuration <= 30 days, "Invalid duration");
        votingPeriodDuration = _newDuration;
    }

    /**
     * @notice Set minimum voters required
     * @param _minVoters Minimum number of voters
     */
    function setMinimumVoters(uint256 _minVoters) external onlyOwner {
        require(_minVoters > 0, "Must be greater than 0");
        minimumVotersRequired = _minVoters;
    }
}
