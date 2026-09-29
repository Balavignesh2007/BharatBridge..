export { XCM_PRECOMPILE_ABI } from './xcmPrecompile';

export const BHARATBRIDGE_ABI = [
    'function remit(address tokenIn, uint256 amountIn, uint32 destChainId, string calldata destCurrency, address recipient) external returns (uint256 remittanceId)',
    'function getRemittance(uint256 id) external view returns (tuple(uint256 id, address sender, address recipient, address tokenIn, uint256 amountIn, uint256 amountOut, uint256 fee, uint32 destChainId, string destCurrency, uint256 timestamp, uint8 status))',
    'function oracle() external view returns (address)',
    'function supportedTokens(address) external view returns (bool)',
];

export const FX_ORACLE_ABI = [
    'function getRate(string calldata pair) external view returns (uint256 rate, uint8 decimals, uint256 lastUpdated)',
    'function convert(string calldata fromCurrency, string calldata toCurrency, uint256 amountIn) external view returns (uint256 amountOut, uint256 fee, uint256 rate)',
];
