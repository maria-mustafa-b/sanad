import { NextResponse } from 'next/server';
import { JsonRpcProvider, Wallet, Contract } from 'ethers';
import { compileRegistry } from '@/scripts/amoy-shared.mjs';

export async function POST(request: Request) {
  try {
    const { claimId, claimDataHash } = await request.json();

    if (!claimId || !claimDataHash) {
      return NextResponse.json({ error: 'claimId and claimDataHash are required' }, { status: 400 });
    }

    const rpc = process.env.POLYGON_AMOY_RPC_URL;
    const key = process.env.BLOCKCHAIN_PRIVATE_KEY;
    const contractAddress = process.env.SANAD_CONTRACT_ADDRESS;

    if (!rpc || !key || !contractAddress) {
      return NextResponse.json({ error: 'Blockchain configuration missing in environment' }, { status: 500 });
    }

    const provider = new JsonRpcProvider(rpc);
    const wallet = new Wallet(key, provider);

    // Dynamic compilation so we don't need to hardcode ABI
    const { abi } = await compileRegistry();
    const contract = new Contract(contractAddress, abi, wallet);

    // Execute the real smart contract transaction!
    // function issueCredential(string memory credentialId, string memory dataHash)
    const tx = await contract.issueCredential(claimId, claimDataHash);
    
    // Wait for 1 confirmation
    const receipt = await tx.wait(1);

    return NextResponse.json({
      success: true,
      transactionHash: receipt.hash,
      credentialId: claimId,
      network: "Polygon Amoy"
    });

  } catch (error: any) {
    console.error('Blockchain Issuance Error:', error);
    return NextResponse.json({ 
      error: 'Failed to issue credential on blockchain', 
      details: error.message 
    }, { status: 500 });
  }
}
