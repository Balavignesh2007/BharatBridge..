// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title BharatBridgeAccessControl
 * @notice Role-Based Access Control for BharatBridge Remittance & Settlement Platform
 * @dev Implements OpenZeppelin v5 AccessControl
 */
contract BharatBridgeAccessControl is AccessControl {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    event RoleGrantedCustom(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevokedCustom(bytes32 indexed role, address indexed account, address indexed sender);

    constructor(address rootAdmin) {
        _grantRole(DEFAULT_ADMIN_ROLE, rootAdmin);
        _grantRole(OPERATOR_ROLE, rootAdmin);
        _grantRole(COMPLIANCE_ROLE, rootAdmin);
        _grantRole(ORACLE_ROLE, rootAdmin);
    }

    function isOperator(address account) external view returns (bool) {
        return hasRole(OPERATOR_ROLE, account);
    }

    function isComplianceOfficer(address account) external view returns (bool) {
        return hasRole(COMPLIANCE_ROLE, account);
    }
}
