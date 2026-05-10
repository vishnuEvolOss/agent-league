// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AgentRegistry
 * @notice Central registry for AI agents competing in the Performance League
 * @dev Tracks agent metadata, performance history, and delegation capabilities
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AgentRegistry is Ownable, ReentrancyGuard {
    
    struct Agent {
        address agentAddress;
        string name;
        string description;
        uint256 createdAt;
        uint256 totalCapitalManaged;
        uint256 activeDelegations;
        bool isActive;
        string ipfsProfileURI;
        address manager; // human owner/manager of the agent
    }

    struct AgentStats {
        uint256 totalTrades;
        uint256 winningTrades;
        uint256 totalROI; // in basis points (10000 = 100%)
        int256 sharpeRatio; // scaled by 1e18
        uint256 maxDrawdown; // in basis points
        uint256 lastUpdateTimestamp;
        uint256 averageTradeSize;
    }

    struct PerformanceRecord {
        uint256 timestamp;
        int256 pnl; // Profit/Loss in wei
        uint256 tradeCount;
        uint256 roi; // ROI at this point in basis points
    }

    mapping(address => Agent) public agents;
    mapping(address => AgentStats) public agentStats;
    mapping(address => PerformanceRecord[]) public performanceHistory;
    mapping(address => address[]) public agentDelegators; // delegators to an agent
    
    address[] public activeAgents;
    address public delegationContract;
    
    uint256 public constant MAX_BASIS_POINTS = 10000;
    
    event AgentRegistered(address indexed agentAddress, address indexed manager, string name);
    event AgentStatsUpdated(address indexed agentAddress, uint256 roi, int256 sharpeRatio, uint256 maxDrawdown);
    event PerformanceRecorded(address indexed agentAddress, int256 pnl, uint256 timestamp);
    event DelegatorAdded(address indexed agentAddress, address indexed delegator);
    event DelegatorRemoved(address indexed agentAddress, address indexed delegator);
    event AgentDeactivated(address indexed agentAddress);

    /**
     * @notice Register a new AI agent
     * @param _agentAddress Unique address/identifier for the agent
     * @param _name Human-readable name
     * @param _description Agent strategy description
     * @param _ipfsProfileURI IPFS URI pointing to agent profile metadata
     */
    function registerAgent(
        address _agentAddress,
        string calldata _name,
        string calldata _description,
        string calldata _ipfsProfileURI
    ) external onlyOwner {
        require(_agentAddress != address(0), "Invalid agent address");
        require(agents[_agentAddress].agentAddress == address(0), "Agent already registered");
        require(bytes(_name).length > 0, "Name required");

        agents[_agentAddress] = Agent({
            agentAddress: _agentAddress,
            name: _name,
            description: _description,
            createdAt: block.timestamp,
            totalCapitalManaged: 0,
            activeDelegations: 0,
            isActive: true,
            ipfsProfileURI: _ipfsProfileURI,
            manager: msg.sender
        });

        activeAgents.push(_agentAddress);
        emit AgentRegistered(_agentAddress, msg.sender, _name);
    }

    /**
     * @notice Update agent performance metrics (called by oracle/backend)
     * @param _agentAddress Agent to update
     * @param _totalROI Total ROI in basis points
     * @param _sharpeRatio Sharpe ratio scaled by 1e18
     * @param _maxDrawdown Maximum drawdown in basis points
     * @param _totalTrades Total number of trades
     * @param _winningTrades Number of winning trades
     */
    function updateStats(
        address _agentAddress,
        uint256 _totalROI,
        int256 _sharpeRatio,
        uint256 _maxDrawdown,
        uint256 _totalTrades,
        uint256 _winningTrades,
        uint256 _averageTradeSize
    ) external onlyOwner {
        require(agents[_agentAddress].agentAddress != address(0), "Agent not found");
        require(_maxDrawdown <= MAX_BASIS_POINTS, "Invalid drawdown");

        agentStats[_agentAddress] = AgentStats({
            totalTrades: _totalTrades,
            winningTrades: _winningTrades,
            totalROI: _totalROI,
            sharpeRatio: _sharpeRatio,
            maxDrawdown: _maxDrawdown,
            lastUpdateTimestamp: block.timestamp,
            averageTradeSize: _averageTradeSize
        });

        emit AgentStatsUpdated(_agentAddress, _totalROI, _sharpeRatio, _maxDrawdown);
    }

    /**
     * @notice Record a performance snapshot for historical tracking
     * @param _agentAddress Agent performing the trade
     * @param _pnl Profit/Loss amount
     * @param _tradeCount Total trades at this point
     * @param _roi Current ROI in basis points
     */
    function recordPerformance(
        address _agentAddress,
        int256 _pnl,
        uint256 _tradeCount,
        uint256 _roi
    ) external onlyOwner {
        require(agents[_agentAddress].agentAddress != address(0), "Agent not found");

        performanceHistory[_agentAddress].push(PerformanceRecord({
            timestamp: block.timestamp,
            pnl: _pnl,
            tradeCount: _tradeCount,
            roi: _roi
        }));

        emit PerformanceRecorded(_agentAddress, _pnl, block.timestamp);
    }

    /**
     * @notice Add a delegator relationship
     * @param _agentAddress Agent receiving delegation
     * @param _delegator User delegating to agent
     * @param _capitalAmount Amount being delegated
     */
    function addDelegator(
        address _agentAddress,
        address _delegator,
        uint256 _capitalAmount
    ) external nonReentrant {
        require(msg.sender == delegationContract || msg.sender == owner(), "Unauthorized");
        require(agents[_agentAddress].isActive, "Agent not active");
        require(_delegator != address(0), "Invalid delegator");

        Agent storage agent = agents[_agentAddress];
        agent.activeDelegations += 1;
        agent.totalCapitalManaged += _capitalAmount;

        agentDelegators[_agentAddress].push(_delegator);
        emit DelegatorAdded(_agentAddress, _delegator);
    }

    /**
     * @notice Remove a delegator relationship
     * @param _agentAddress Agent losing delegation
     * @param _delegator User removing delegation
     * @param _capitalAmount Amount being undeployed
     */
    function removeDelegator(
        address _agentAddress,
        address _delegator,
        uint256 _capitalAmount
    ) external onlyOwner nonReentrant {
        require(agents[_agentAddress].activeDelegations > 0, "No active delegations");

        Agent storage agent = agents[_agentAddress];
        agent.activeDelegations -= 1;
        agent.totalCapitalManaged = agent.totalCapitalManaged > _capitalAmount 
            ? agent.totalCapitalManaged - _capitalAmount 
            : 0;

        emit DelegatorRemoved(_agentAddress, _delegator);
    }

    /**
     * @notice Deactivate an agent (remove from active competition)
     * @param _agentAddress Agent to deactivate
     */
    function deactivateAgent(address _agentAddress) external onlyOwner {
        require(agents[_agentAddress].isActive, "Agent already inactive");
        agents[_agentAddress].isActive = false;
        emit AgentDeactivated(_agentAddress);
    }

    function setDelegationContract(address _delegationContract) external onlyOwner {
        delegationContract = _delegationContract;
    }

    // View Functions

    function getAgent(address _agentAddress) external view returns (Agent memory) {
        return agents[_agentAddress];
    }

    function getStats(address _agentAddress) external view returns (AgentStats memory) {
        return agentStats[_agentAddress];
    }

    function getPerformanceHistory(address _agentAddress) external view returns (PerformanceRecord[] memory) {
        return performanceHistory[_agentAddress];
    }

    function getPerformanceHistoryLength(address _agentAddress) external view returns (uint256) {
        return performanceHistory[_agentAddress].length;
    }

    function getDelegators(address _agentAddress) external view returns (address[] memory) {
        return agentDelegators[_agentAddress];
    }

    function getActiveAgentsCount() external view returns (uint256) {
        return activeAgents.length;
    }

    function getActiveAgentAtIndex(uint256 _index) external view returns (address) {
        require(_index < activeAgents.length, "Index out of bounds");
        return activeAgents[_index];
    }

    function getWinRate(address _agentAddress) external view returns (uint256) {
        AgentStats memory stats = agentStats[_agentAddress];
        if (stats.totalTrades == 0) return 0;
        return (stats.winningTrades * MAX_BASIS_POINTS) / stats.totalTrades;
    }

    /**
     * @notice Get agent manager address
     * @param _agentAddress Agent address
     * @return Manager address of the agent
     */
    function getAgentManager(address _agentAddress) external view returns (address) {
        return agents[_agentAddress].manager;
    }

    /**
     * @notice Check if agent is active
     * @param _agentAddress Agent address
     * @return True if agent is active
     */
    function isAgentActive(address _agentAddress) external view returns (bool) {
        return agents[_agentAddress].isActive;
    }
}
