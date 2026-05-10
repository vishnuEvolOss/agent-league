// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AgentProfileNFT
 * @notice NFT representing an agent's profile and performance card
 * @dev Each agent gets an NFT that updates with performance metrics
 */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./AgentRegistry.sol";

contract AgentProfileNFT is ERC721URIStorage, Ownable {
    
    AgentRegistry public agentRegistry;
    
    mapping(address => uint256) public agentToTokenId; // agent address to NFT token ID
    mapping(uint256 => address) public tokenIdToAgent; // NFT token ID to agent address
    
    uint256 private tokenIdCounter = 1;

    event AgentProfileMinted(address indexed agent, uint256 indexed tokenId);
    event AgentProfileUpdated(address indexed agent, uint256 indexed tokenId, string newURI);

    constructor(address _agentRegistry) ERC721("Agent League Profile", "ALP") {
        agentRegistry = AgentRegistry(_agentRegistry);
    }

    /**
     * @notice Mint profile NFT for a registered agent
     * @param _agentAddress Agent address
     * @param _metadataURI IPFS URI containing agent profile metadata
     */
    function mintAgentProfile(
        address _agentAddress,
        string calldata _metadataURI
    ) external onlyOwner {
        require(
            agentRegistry.getAgent(_agentAddress).agentAddress != address(0),
            "Agent not registered"
        );
        require(agentToTokenId[_agentAddress] == 0, "Agent already has profile NFT");

        uint256 tokenId = tokenIdCounter;
        tokenIdCounter += 1;
        
        _safeMint(_agentAddress, tokenId);
        _setTokenURI(tokenId, _metadataURI);
        
        agentToTokenId[_agentAddress] = tokenId;
        tokenIdToAgent[tokenId] = _agentAddress;

        emit AgentProfileMinted(_agentAddress, tokenId);
    }

    /**
     * @notice Update agent profile metadata (e.g., new performance data)
     * @param _agentAddress Agent to update
     * @param _newMetadataURI New IPFS URI with updated stats
     */
    function updateProfileMetadata(
        address _agentAddress,
        string calldata _newMetadataURI
    ) external onlyOwner {
        require(agentToTokenId[_agentAddress] != 0, "No profile NFT for agent");

        uint256 tokenId = agentToTokenId[_agentAddress];
        _setTokenURI(tokenId, _newMetadataURI);

        emit AgentProfileUpdated(_agentAddress, tokenId, _newMetadataURI);
    }

    /**
     * @notice Get token ID for an agent
     * @param _agentAddress Agent address
     */
    function getAgentTokenId(address _agentAddress) external view returns (uint256) {
        return agentToTokenId[_agentAddress];
    }

    /**
     * @notice Get agent address for a token
     * @param _tokenId Token ID
     */
    function getTokenAgent(uint256 _tokenId) external view returns (address) {
        return tokenIdToAgent[_tokenId];
    }
}
