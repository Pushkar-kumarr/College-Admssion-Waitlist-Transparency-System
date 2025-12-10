// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying AdmissionPBFTLite Contract...");

  // Validator addresses
  const validators = [
    "0xc1f9ed242a8d0fdaefaa091f24d684a3e937679d", // Admin wallet
    "0x40f8d680fbd859c1eaa390f1f91e60c23ec1a2da",
    "0x484ae2369c86c6003ace4d1581382b9e4e9ce32e",
    "0x62c825619a26dd9a4ad3acdaff860f20f3e30e78"
  ];

  // Get contract factory
  const AdmissionPBFTEnhanced = await hre.ethers.getContractFactory("AdmissionPBFTLite");

  // Deploy contract
  const contract = await AdmissionPBFTEnhanced.deploy(validators);

  // Wait for deployment
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ Contract deployed to:", address);
  console.log("🔗 Validators:", validators);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
