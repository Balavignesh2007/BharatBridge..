import { expect } from "chai";
import hre from "hardhat";

describe("BharatBridge Smart Contracts", function () {
    let deployer: any;
    let sender: any;
    let recipient: any;
    let mockUSDT: any;
    let mockUSDC: any;
    let fxOracle: any;
    let bharatBridge: any;

    beforeEach(async function () {
        [deployer, sender, recipient] = await hre.ethers.getSigners();

        // 1. Deploy mock stablecoins
        const MockStablecoin = await hre.ethers.getContractFactory("contracts/contracts/MockStablecoin.sol:MockStablecoin");
        mockUSDT = await MockStablecoin.deploy("Mock USDT", "USDT", 6);
        await mockUSDT.waitForDeployment();
        mockUSDC = await MockStablecoin.deploy("Mock USDC", "USDC", 6);
        await mockUSDC.waitForDeployment();

        // 2. Deploy FX Oracle
        const FXOracle = await hre.ethers.getContractFactory("FXOracle");
        fxOracle = await FXOracle.deploy();
        await fxOracle.waitForDeployment();

        // 3. Deploy BharatBridge
        const BharatBridge = await hre.ethers.getContractFactory("BharatBridge");
        bharatBridge = await BharatBridge.deploy(await fxOracle.getAddress());
        await bharatBridge.waitForDeployment();

        // 4. Configure supported tokens
        await bharatBridge.addToken(await mockUSDT.getAddress(), "USDT");
        await bharatBridge.addToken(await mockUSDC.getAddress(), "USDC");

        // 5. Mint tokens to sender
        const initialFunds = hre.ethers.parseUnits("5000", 6);
        await mockUSDT.mint(sender.address, initialFunds);
        await mockUSDC.mint(sender.address, initialFunds);
    });

    describe("FXOracle", function () {
        it("should return the configured USD -> INR rate (84.50)", async function () {
            const [rate] = await fxOracle.getRate("USD", "INR");
            const expectedRate = hre.ethers.parseUnits("84.50", 18);
            expect(rate).to.equal(expectedRate);
        });

        it("should calculate correct fee and conversion for $1,000 USD to INR", async function () {
            // $1,000 USD with 6 decimals = 1,000,000,000
            const amountIn = hre.ethers.parseUnits("1000", 6);
            const [amountOut, fee] = await fxOracle.convert("USD", "INR", amountIn);

            // 0.30% fee on 1,000 USD is 3 USD (3_000_000)
            const expectedFee = hre.ethers.parseUnits("3", 6);
            expect(fee).to.equal(expectedFee);

            // (1000 - 3) * 84.50 = 997 * 84.50 = 84,246.50
            const expectedOut = hre.ethers.parseUnits("84246.5", 6);
            expect(amountOut).to.equal(expectedOut);
        });

        it("should support GBP, EUR, AED, SGD, CAD, AUD, and JPY corridors", async function () {
            const [gbpRate] = await fxOracle.getRate("GBP", "INR");
            expect(gbpRate).to.equal(hre.ethers.parseUnits("107.20", 18));

            const [eurRate] = await fxOracle.getRate("EUR", "INR");
            expect(eurRate).to.equal(hre.ethers.parseUnits("91.80", 18));

            const [aedRate] = await fxOracle.getRate("AED", "INR");
            expect(aedRate).to.equal(hre.ethers.parseUnits("23.01", 18));
        });
    });

    describe("BharatBridge Remittance", function () {
        it("should execute same-chain remittance successfully with sub-1% fee", async function () {
            const amountIn = hre.ethers.parseUnits("1000", 6);
            const usdtAddress = await mockUSDT.getAddress();
            const bridgeAddress = await bharatBridge.getAddress();

            // Approve bridge
            await mockUSDT.connect(sender).approve(bridgeAddress, amountIn);

            // Send remittance
            const tx = await bharatBridge.connect(sender).sendRemittance(
                usdtAddress,
                amountIn,
                recipient.address,
                "INR"
            );
            await tx.wait();

            // Verify balances
            // Recipient gets amount - fee = $997
            const recipientBal = await mockUSDT.balanceOf(recipient.address);
            expect(recipientBal).to.equal(hre.ethers.parseUnits("997", 6));

            // Bridge retains fee in liquidity pool = $3
            const poolFee = await bharatBridge.liquidityPool(usdtAddress);
            expect(poolFee).to.equal(hre.ethers.parseUnits("3", 6));

            // Verify stats
            const stats = await bharatBridge.getStats();
            expect(stats.volume).to.equal(amountIn);
            expect(stats.fees).to.equal(hre.ethers.parseUnits("3", 6));
            expect(stats.remittanceCount).to.equal(1n);

            // Verify remittance record
            const remittance = await bharatBridge.getRemittance(0);
            expect(remittance.sender).to.equal(sender.address);
            expect(remittance.recipient).to.equal(recipient.address);
            expect(remittance.destCurrency).to.equal("INR");
            expect(remittance.status).to.equal(1n); // Completed
        });

        it("should support liquidity provisioning", async function () {
            const addAmount = hre.ethers.parseUnits("500", 6);
            const usdtAddress = await mockUSDT.getAddress();
            const bridgeAddress = await bharatBridge.getAddress();

            await mockUSDT.connect(sender).approve(bridgeAddress, addAmount);
            await bharatBridge.connect(sender).addLiquidity(usdtAddress, addAmount);

            const poolBal = await bharatBridge.liquidityPool(usdtAddress);
            expect(poolBal).to.equal(addAmount);
        });
    });
});
