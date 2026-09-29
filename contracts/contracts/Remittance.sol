// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../BharatBridge.sol";

/**
 * @title Remittance
 * @notice Cross-Border Remittance Engine on Polkadot PVM
 * @dev Direct alias contract extending BharatBridge
 */
contract Remittance is BharatBridge {
    constructor(address _oracle) BharatBridge(_oracle) {}
}
