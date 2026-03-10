// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LuxuryProductPassport
 * @dev ERC721 NFT contract for Luxury Product Digital Passport (Polygon compatible)
 */
contract LuxuryProductPassport is ERC721, ERC721URIStorage, Ownable {

    uint256 private _nextTokenId;

    event ProductEvent(
        uint256 indexed tokenId,
        string eventType,
        string data
    );

    constructor() ERC721("LuxuryProductPassport", "LPP") {}

    /**
     * Mint a new NFT passport
     */
    function mint(address to, string memory metadataURI)
        external
        onlyOwner
    {
        uint256 tokenId = _nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
    }

    /**
     * Record lifecycle event of a product
     * Example: manufactured, shipped, sold, repaired
     */
    function recordEvent(
        uint256 tokenId,
        string memory eventType,
        string memory data
    ) external {

        require(
            _ownerOf(tokenId) == msg.sender || owner() == msg.sender,
            "Not authorized"
        );

        emit ProductEvent(tokenId, eventType, data);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}