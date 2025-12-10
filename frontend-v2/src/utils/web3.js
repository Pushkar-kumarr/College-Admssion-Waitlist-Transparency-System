import { ethers } from "ethers";
import contractABI from "./abi.json";

const CONTRACT_ADDRESS = "0xc147349cB867de61e6C641dde624a83B996f0232"; // your deployed contract

export async function getContract(provider) {
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
}
