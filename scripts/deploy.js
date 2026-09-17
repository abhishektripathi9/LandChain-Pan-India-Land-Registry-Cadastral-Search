/**
 * Hardhat / Ethers Deployment Script for LandRegistry Smart Contract
 * 
 * Usage:
 *   npx hardhat run scripts/deploy.js --network sepolia
 *   npx hardhat run scripts/deploy.js --network localhost
 */
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("--------------------------------------------------");
  console.log("Deploying LandRegistry smart contract...");

  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployer account: ${deployer.address}`);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log(`Account balance: ${hre.ethers.formatEther(balance)} ETH`);

  const LandRegistry = await hre.ethers.getContractFactory("LandRegistry");
  const landRegistry = await LandRegistry.deploy();
  await landRegistry.waitForDeployment();

  const contractAddress = await landRegistry.getAddress();
  console.log(`✅ LandRegistry successfully deployed to: ${contractAddress}`);
  console.log(`Admin / Default Authority: ${deployer.address}`);

  // Automatically update frontend contractConfig.js
  const configPath = path.join(__dirname, "../src/contracts/contractConfig.js");
  console.log(`Updating frontend contract address in: ${configPath}`);
  
  const network = await hre.ethers.provider.getNetwork();
  console.log(`Target Network: ${network.name} (Chain ID: ${network.chainId})`);
  console.log("--------------------------------------------------");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
