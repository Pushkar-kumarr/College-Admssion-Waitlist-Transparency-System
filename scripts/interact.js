const { ethers } = require("ethers");
require("dotenv").config({ path: "./contract/.env" });

async function main() {
  const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log("Using account:", wallet.address);

  const contractAddress = "0x29B57d9e076B20421d235b449d0c11f3e3cF4C1f";
  const artifact = require("../contract/artifacts/contract/contracts/Admission.sol/AdmissionPBFTLite.json");
  const contract = new ethers.Contract(contractAddress, artifact.abi, wallet);

  console.log("Connected to contract at:", contractAddress);

  const studentId = 1;
  const dataHash = ethers.keccak256(ethers.toUtf8Bytes("StudentData1"));
  console.log("Applying for admission...");

  const tx = await contract.applyForAdmission(studentId, dataHash);
  await tx.wait();

  console.log("✅ Transaction successful:", tx.hash);
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
