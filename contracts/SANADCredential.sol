// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
/// @notice Issuer-controlled, PII-free registry for opaque credential IDs and hashes.
contract SANADCredential {
    address public immutable issuer;
    struct Credential { bytes32 recordHash; address issuedBy; uint64 issuedAt; bool revoked; }
    mapping(bytes32 => Credential) private records;
    event Issued(bytes32 indexed id, bytes32 indexed recordHash, address indexed issuer);
    event Revoked(bytes32 indexed id);
    error NotIssuer(); error AlreadyIssued(); error NotIssued(); error AlreadyRevoked();
    modifier onlyIssuer() { if (msg.sender != issuer) revert NotIssuer(); _; }
    constructor() { issuer = msg.sender; }
    function issue(bytes32 id, bytes32 recordHash) external onlyIssuer {
        if (records[id].issuedAt != 0) revert AlreadyIssued();
        records[id] = Credential(recordHash, msg.sender, uint64(block.timestamp), false);
        emit Issued(id, recordHash, msg.sender);
    }
    function revoke(bytes32 id) external onlyIssuer {
        Credential storage entry = records[id];
        if (entry.issuedAt == 0) revert NotIssued();
        if (entry.revoked) revert AlreadyRevoked();
        entry.revoked = true;
        emit Revoked(id);
    }
    function status(bytes32 id) external view returns (bytes32 recordHash, address issuedBy, uint64 issuedAt, bool revoked) {
        Credential storage entry = records[id];
        return (entry.recordHash, entry.issuedBy, entry.issuedAt, entry.revoked);
    }
}
