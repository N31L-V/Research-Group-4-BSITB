// src/blockchain/Service.js
import { ethers } from 'ethers';

// This is the ABI (interface). For now, we define the receiveBatch function.
const ABI = [
  "function receiveBatch(uint256 _batchId, string _gps) public"
];

const CONTRACT_ADDRESS = "0xYOUR_CONTRACT_ADDRESS_HERE";

export const getContract = async () => {
    if (!window.ethereum) throw new Error("Please install MetaMask");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
};