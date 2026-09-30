// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FXOracle
 * @notice Foreign exchange rate oracle for BharatBridge remittance calculations
 * PVM Track 2 Category: PVM-experiments (Rust/C++ from Solidity)
 *
 * ARCHITECTURE NOTE:
 * In the full production version, this contract calls a Rust-based FX oracle
 * library compiled to PVM via the RISC-V toolchain. The Rust library provides:
 * - Manipulation-resistant FX rate aggregation from multiple data sources
 * - Optimal routing path calculation using graph algorithms (Dijkstra/Bellman-Ford)
 * - Statistical outlier detection for rate feed integrity
 *
 * For the hackathon MVP, the FX logic is implemented in Solidity to demonstrate
 * the contract interface and data flow. The Rust integration points are marked
 * with "PVM-RUST-CALL" comments throughout the code.
 *
 * Rust library signature (PVM):
 *    fn get_exchange_rate(from: &str, to: &str) -> u64
 *    fn calculate_optimal_route(input: u64, path: &[u8]) -> u64
 */
contract FXOracle is Ownable {
    /// @notice Exchange rate with 18 decimal precision
    struct Rate {
        uint256 rate;        // Rate with 18 decimals (1e18 = 1:1)
        uint256 updatedAt;   // Timestamp of last update
        bool active;         // Whether this pair is active
    }

    /// @notice Route for multi-hop transfers
    struct Route {
        address[] path;         // Token addresses in order
        uint256[] rates;        // FX rates for each hop
        uint256 estimatedOutput; // Estimated output amount
        uint256 totalFee;       // Total fee in basis points
    }

    /// @notice Maximum allowed period before a rate feed is considered stale (1 hour)
    uint256 public constant MAX_STALE_PERIOD = 1 hours;

    /// @notice Currency pair key => Rate data
    mapping(bytes32 => Rate) public rates;

    /// @notice Supported currency pairs
    bytes32[] public supportedPairs;

    /// @notice Base fee in basis points (1 bp = 0.01%)
    uint256 public baseFee = 30; // 0.30% default

    /// @notice Events
    event RateUpdated(string indexed fromCurrency, string indexed toCurrency, uint256 rate);
    event BaseFeeUpdated(uint256 oldFee, uint256 newFee);

    constructor() Ownable(msg.sender) {
        // Initialize with BharatBridge India-First remittance corridors
        // PVM-RUST-CALL: In production, these are fetched from the Rust oracle library
        _setRate("USD", "INR", 84_500000000000000000);   // 1 USD = 84.50 INR (Primary Hackathon Demo)
        _setRate("GBP", "INR", 107_200000000000000000);  // 1 GBP = 107.20 INR
        _setRate("EUR", "INR", 91_800000000000000000);   // 1 EUR = 91.80 INR
        _setRate("AED", "INR", 23_010000000000000000);   // 1 AED = 23.01 INR
        _setRate("SGD", "INR", 62_800000000000000000);   // 1 SGD = 62.80 INR
        _setRate("CAD", "INR", 61_500000000000000000);   // 1 CAD = 61.50 INR
        _setRate("AUD", "INR", 54_900000000000000000);   // 1 AUD = 54.90 INR
        _setRate("JPY", "INR", 560000000000000000);     // 1 JPY = 0.56 INR

        // Reverse corridors (India to Global)
        _setRate("INR", "USD", 11834000000000000);      // 1 INR = ~0.011834 USD
        _setRate("INR", "GBP", 9328000000000000);       // 1 INR = ~0.009328 GBP
        _setRate("INR", "EUR", 10893000000000000);      // 1 INR = ~0.010893 EUR
        _setRate("INR", "AED", 43459000000000000);      // 1 INR = ~0.043459 AED
        _setRate("INR", "SGD", 15923000000000000);      // 1 INR = ~0.015923 SGD
        _setRate("INR", "CAD", 16260000000000000);      // 1 INR = ~0.016260 CAD
        _setRate("INR", "AUD", 18214000000000000);      // 1 INR = ~0.018214 AUD
        _setRate("INR", "JPY", 1_785714000000000000);   // 1 INR = ~1.7857 JPY

        // Stablecoin pairs & token aliases
        _setRate("USDT", "INR", 84_500000000000000000);  // 1 USDT = 84.50 INR
        _setRate("USDC", "INR", 84_500000000000000000);  // 1 USDC = 84.50 INR
        _setRate("USDT", "USD", 1_000000000000000000);   // 1:1 USD peg
        _setRate("USDC", "USD", 1_000000000000000000);   // 1:1 USD peg
        _setRate("USDT", "USDC", 1_000000000000000000);  // 1:1 stablecoin peg
        _setRate("USDC", "USDT", 1_000000000000000000);  // 1:1 stablecoin peg
    }

    /**
     * @notice Get the exchange rate for a currency pair
     * @dev PVM-RUST-CALL: In production, this calls the Rust FX library
     * @param from Source currency code (e.g., "USD")
     * @param to Destination currency code (e.g., "INR")
     * @return rate Exchange rate with 18 decimals
     * @return updatedAt Timestamp of last rate update
     */
    function getRate(
        string calldata from,
        string calldata to
    ) external view returns (uint256 rate, uint256 updatedAt) {
        bytes32 key = _pairKey(from, to);
        Rate storage r = rates[key];
        require(r.active, "FXOracle: pair not supported");
        return (r.rate, r.updatedAt);
    }

    /**
     * @notice Calculate the output amount for a given input
     * @dev PVM-RUST-CALL: In production, the optimal route calculation
     *      uses a Rust Dijkstra implementation on PVM for performance
     * @param from Source currency code
     * @param to Destination currency code
     * @param amountIn Input amount (in source token smallest unit)
     * @return amountOut Output amount after conversion
     * @return fee Fee amount in source token units
     */
    function convert(
        string calldata from,
        string calldata to,
        uint256 amountIn
    ) external view returns (uint256 amountOut, uint256 fee) {
        bytes32 key = _pairKey(from, to);
        Rate storage r = rates[key];
        require(r.active, "FXOracle: pair not supported");
        
        // AUDIT FIX: Verify rate is not stale
        require(block.timestamp - r.updatedAt <= MAX_STALE_PERIOD, "FXOracle: rate is stale");

        // Calculate fee
        fee = (amountIn * baseFee) / 10_000;
        uint256 amountAfterFee = amountIn - fee;

        // Apply exchange rate
        // PVM-RUST-CALL: In production, this calculation happens in the Rust library
        // with higher precision fixed-point arithmetic
        amountOut = (amountAfterFee * r.rate) / 1e18;
    }

    /**
     * @notice Get the transfer fee for a given amount
     * @param amount Transfer amount
     * @return fee Fee in the same denomination
     * @return feeBps Fee in basis points
     */
    function calculateFee(uint256 amount) external view returns (uint256 fee, uint256 feeBps) {
        feeBps = baseFee;
        fee = (amount * baseFee) / 10_000;
    }

    /**
     * @notice Update an exchange rate (owner only)
     * @param from Source currency code
     * @param to Destination currency code
     * @param rate New rate with 18 decimals
     */
    function setRate(
        string calldata from,
        string calldata to,
        uint256 rate
    ) external onlyOwner {
        _setRate(from, to, rate);
    }

    /**
     * @notice Update the base fee
     * @param newFee New fee in basis points
     */
    function setBaseFee(uint256 newFee) external onlyOwner {
        require(newFee <= 100, "FXOracle: fee too high"); // Max 1%
        emit BaseFeeUpdated(baseFee, newFee);
        baseFee = newFee;
    }

    /**
     * @notice Get all supported currency pairs
     * @return pairs Array of pair keys
     */
    function getSupportedPairs() external view returns (bytes32[] memory) {
        return supportedPairs;
    }

    /**
     * @notice Get number of supported pairs
     */
    function pairCount() external view returns (uint256) {
        return supportedPairs.length;
    }

    // --- Internal ---

    function _setRate(string memory from, string memory to, uint256 rate) internal {
        bytes32 key = _pairKey(from, to);
        bool isNew = !rates[key].active;

        rates[key] = Rate({
            rate: rate,
            updatedAt: block.timestamp,
            active: true
        });

        if (isNew) {
            supportedPairs.push(key);
        }

        emit RateUpdated(from, to, rate);
    }

    function _pairKey(string memory from, string memory to) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(from, "/", to));
    }
}