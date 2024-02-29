import { ethers } from 'ethers';
import {blockchainChainId, blockchainContractAddress, blockchainNode, blockchainPrivateKey} from "../../config/props";

const provider = new ethers.JsonRpcProvider(
    blockchainNode,
    blockchainChainId,
);
const wallet = new ethers.Wallet(blockchainPrivateKey, provider);
const contractAddress = blockchainContractAddress;
const proofMarketAbi = [
    "function deposit() public payable",
    "function balanceOf(address user) public view returns (uint256)",
    "function withdraw(address payable user, uint256 amount) public",
    "function transfer(address from, address to, uint256 amount) public",
    "event Deposit(address indexed user, uint256 amount)",
    "event Withdraw(address indexed user, uint256 amount)",
    "event Transfer(address indexed from, address indexed to, uint256 amount)"
];
const proofMarket = new ethers.Contract(contractAddress, proofMarketAbi, wallet);

export async function deposit(amount: ethers.BigNumberish) {
    const transactionResponse = await proofMarket.deposit({ value: amount });
    await transactionResponse.wait();
    console.log('Deposit successful');
}

export async function getBalance(userAddress: string): Promise<number> {
    const balance = await proofMarket.balanceOf(userAddress);
    console.log(`Balance of ${userAddress}: ${ethers.formatEther(balance)} ETH`);
    return balance;
}

export async function withdraw(userAddress: string, amount: ethers.BigNumberish) {
    const transactionResponse = await proofMarket.withdraw(userAddress, amount);
    await transactionResponse.wait();
    console.log('Withdrawal successful');
}

export async function transfer(fromAddress: string, toAddress: string, amount: ethers.BigNumberish) {
    const transactionResponse = await proofMarket.transfer(fromAddress, toAddress, amount);
    await transactionResponse.wait();
    console.log('Transfer successful');
}
