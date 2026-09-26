import { Contract, Wallet, JsonRpcProvider } from 'ethers';
import { onchainId } from './lib/blockchain/chain.ts';

async function main() {
  const rpc = 'https://polygon-amoy-bor-rpc.publicnode.com';
  const provider = new JsonRpcProvider(rpc, 80002);
  const signer = new Wallet('0xd661ec2d1c261f0be8317056444ef2e79332214ea263bdeb664801ac8ba283d0', provider);
  
  const abi = ['function issue(bytes32 id, bytes32 recordHash) external'];
  const contract = new Contract('0x13798285e9fa1aCd15930e8D510A34BB983F1484', abi, signer);
  
  const testId = onchainId('test-claim-' + Date.now());
  const testHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
  
  try {
    console.log('Sending transaction...');
    const tx = await contract.issue(testId, testHash);
    console.log('Tx sent! Hash:', tx.hash);
    const receipt = await tx.wait(1);
    console.log('Tx confirmed! Status:', receipt.status);
    console.log('View on Explorer: https://amoy.polygonscan.com/tx/' + tx.hash);
  } catch (err) {
    console.error('Detailed Error:', err.shortMessage || err.message || err);
  }
}

main();
