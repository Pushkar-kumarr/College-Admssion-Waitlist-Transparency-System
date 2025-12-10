import { ethers } from "ethers";
import contractABI from "./abi.json";

const CONTRACT_ADDRESS = "0x29B57d9e076B20421d235b449d0c11f3e3cF4C1f";

export async function getContract(provider) {
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
}
