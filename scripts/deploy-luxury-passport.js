const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying LuxuryProductPassport...");

  const Contract = await ethers.getContractFactory("LuxuryProductPassport");
  const contract = await Contract.deploy();

  console.log("Waiting for deployment transaction confirmation...");
  await contract.waitForDeployment();

  console.log("LuxuryProductPassport deployed at:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});