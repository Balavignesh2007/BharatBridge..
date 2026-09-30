// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IXcmPrecompile.sol";
import "./FXOracle.sol";

/**
 * @title BharatBridge
 * @notice India-First Cross-Border Remittance & Settlement Platform on Polkadot PVM
 */
contract BharatBridge is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // --- State ---

    FXOracle public oracle;

    IXcmPrecompile public constant XCM_PRECOMPILE =
        IXcmPrecompile(0x0000000000000000000000000000000000000803);

    mapping(address => bool) public supportedTokens;
    address[] public tokenList;

    mapping(address => string) public tokenSymbol;

    struct Remittance {
        uint256 id;
        address sender;
        address recipient;
        address tokenIn;
        uint256 amountIn;
        uint256 amountOut;
        uint256 fee;
        uint32 destChainId;
        string destCurrency;
        uint256 timestamp;
        RemittanceStatus status;
    }

    enum RemittanceStatus {
        Pending,
        Completed,
        CrossChainSent,
        Failed
    }

    mapping(uint256 => Remittance) public remittances;
    uint256 public nextRemittanceId;

    mapping(address => uint256[]) public userRemittances;
    mapping(address => uint256) public liquidityPool;

    uint256 public totalVolumeUSD;
    uint256 public totalFeesCollected;
    uint256 public totalRemittances;

    // --- Events ---

    event RemittanceSent(
        uint256 indexed id,
        address indexed sender,
        address indexed recipient,
        address tokenIn,
        uint256 amountIn,
        uint256 amountOut,
        uint256 fee,
        uint32 destChainId
    );

    event RemittanceCompleted(uint256 indexed id);

    event CrossChainTransferInitiated(
        uint256 indexed remittanceId,
        uint32 indexed destChainId,
        bytes xcmMessage
    );

    event RemittanceRefunded(uint256 indexed remittanceId, address indexed sender, uint256 amount);
    event LiquidityAdded(address indexed token, address indexed provider, uint256 amount);
    event LiquidityRemoved(address indexed token, address indexed provider, uint256 amount);
    event TokenAdded(address indexed token, string symbol);

    // --- Constructor ---

    constructor(address _oracle) Ownable(msg.sender) {
        require(_oracle != address(0), "BharatBridge: zero oracle");
        oracle = FXOracle(_oracle);
    }

    // --- Core Functions ---

    function sendRemittance(
        address tokenIn,
        uint256 amount,
        address recipient,
        string calldata destCurrency
    ) external nonReentrant returns (uint256 remittanceId) {
        require(supportedTokens[tokenIn], "BharatBridge: token not supported");
        require(amount > 0, "BharatBridge: zero amount");
        require(recipient != address(0), "BharatBridge: zero recipient");

        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amount);

        string memory fromSymbol = tokenSymbol[tokenIn];
        (uint256 amountOut, uint256 fee) = oracle.convert(fromSymbol, destCurrency, amount);
        require(amount > fee, "BharatBridge: amount lower than fee");

        remittanceId = nextRemittanceId++;
        remittances[remittanceId] = Remittance({
            id: remittanceId,
            sender: msg.sender,
            recipient: recipient,
            tokenIn: tokenIn,
            amountIn: amount,
            amountOut: amountOut,
            fee: fee,
            destChainId: 0,
            destCurrency: destCurrency,
            timestamp: block.timestamp,
            status: RemittanceStatus.Completed
        });

        userRemittances[msg.sender].push(remittanceId);

        uint256 transferAmount = amount - fee;
        IERC20(tokenIn).safeTransfer(recipient, transferAmount);

        liquidityPool[tokenIn] += fee;
        totalFeesCollected += fee;
        totalVolumeUSD += amount;
        totalRemittances++;

        emit RemittanceSent(remittanceId, msg.sender, recipient, tokenIn, amount, amountOut, fee, 0);
        emit RemittanceCompleted(remittanceId);
    }

    function sendCrossChainRemittance(
        address tokenIn,
        uint256 amount,
        address recipient,
        uint32 destChainId,
        string calldata destCurrency
    ) external nonReentrant returns (uint256 remittanceId) {
        require(supportedTokens[tokenIn], "BharatBridge: token not supported");
        require(amount > 0, "BharatBridge: zero amount");
        require(recipient != address(0), "BharatBridge: zero recipient");
        require(destChainId > 0, "BharatBridge: invalid chain ID");

        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amount);

        string memory fromSymbol = tokenSymbol[tokenIn];
        (uint256 amountOut, uint256 fee) = oracle.convert(fromSymbol, destCurrency, amount);
        require(amount > fee, "BharatBridge: amount lower than fee");

        remittanceId = nextRemittanceId++;
        remittances[remittanceId] = Remittance({
            id: remittanceId,
            sender: msg.sender,
            recipient: recipient,
            tokenIn: tokenIn,
            amountIn: amount,
            amountOut: amountOut,
            fee: fee,
            destChainId: destChainId,
            destCurrency: destCurrency,
            timestamp: block.timestamp,
            status: RemittanceStatus.CrossChainSent
        });

        userRemittances[msg.sender].push(remittanceId);

        bytes memory xcmMessage = _buildXcmTransferMessage(tokenIn, amount - fee, recipient, destChainId);
        bytes memory dest = _encodeParachainDest(destChainId);

        bool xcmSuccess = false;

        try XCM_PRECOMPILE.send(dest, xcmMessage) returns (bool success) {
            xcmSuccess = success;
        } catch {
            xcmSuccess = false;
        }

        if (!xcmSuccess) {
            // Revert state and refund sender if XCM execution fails
            remittances[remittanceId].status = RemittanceStatus.Failed;
            IERC20(tokenIn).safeTransfer(msg.sender, amount);
            emit RemittanceRefunded(remittanceId, msg.sender, amount);
            return remittanceId;
        }

        liquidityPool[tokenIn] += fee;
        totalFeesCollected += fee;
        totalVolumeUSD += amount;
        totalRemittances++;

        emit RemittanceSent(remittanceId, msg.sender, recipient, tokenIn, amount, amountOut, fee, destChainId);
        emit CrossChainTransferInitiated(remittanceId, destChainId, xcmMessage);
    }

    function addLiquidity(address token, uint256 amount) external nonReentrant {
        require(supportedTokens[token], "BharatBridge: token not supported");
        require(amount > 0, "BharatBridge: zero amount");
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        liquidityPool[token] += amount;
        emit LiquidityAdded(token, msg.sender, amount);
    }

    function removeLiquidity(address token, uint256 amount) external onlyOwner nonReentrant {
        require(liquidityPool[token] >= amount, "BharatBridge: insufficient liquidity");
        liquidityPool[token] -= amount;
        IERC20(token).safeTransfer(msg.sender, amount);
        emit LiquidityRemoved(token, msg.sender, amount);
    }

    // --- View Functions ---

    function getRemittance(uint256 id) external view returns (Remittance memory) {
        return remittances[id];
    }

    function getUserRemittances(address user) external view returns (uint256[] memory) {
        return userRemittances[user];
    }

    function getUserRemittanceCount(address user) external view returns (uint256) {
        return userRemittances[user].length;
    }

    function estimateRemittance(
        address tokenIn,
        uint256 amount,
        string calldata destCurrency
    ) external view returns (uint256 amountOut, uint256 fee) {
        string memory fromSymbol = tokenSymbol[tokenIn];
        return oracle.convert(fromSymbol, destCurrency, amount);
    }

    function getStats() external view returns (
        uint256 volume, uint256 fees, uint256 remittanceCount, uint256 supportedTokenCount
    ) {
        return (totalVolumeUSD, totalFeesCollected, totalRemittances, tokenList.length);
    }

    function getSupportedTokens() external view returns (address[] memory) {
        return tokenList;
    }

    // --- Admin ---

    function addToken(address token, string calldata symbol) external onlyOwner {
        require(token != address(0), "BharatBridge: zero address");
        require(!supportedTokens[token], "BharatBridge: token already added");
        supportedTokens[token] = true;
        tokenSymbol[token] = symbol;
        tokenList.push(token);
        emit TokenAdded(token, symbol);
    }

    function setOracle(address _oracle) external onlyOwner {
        require(_oracle != address(0), "BharatBridge: zero address");
        oracle = FXOracle(_oracle);
    }

    // --- Internal XCM Helpers ---

    function _buildXcmTransferMessage(
        address token, uint256 amount, address recipient, uint32 destChainId
    ) internal pure returns (bytes memory) {
        return abi.encode("XCM_TRANSFER", token, amount, recipient, destChainId);
    }

    function _encodeParachainDest(uint32 parachainId) internal pure returns (bytes memory) {
        return abi.encode("PARACHAIN", parachainId);
    }
}