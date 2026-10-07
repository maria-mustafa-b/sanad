import { NextResponse } from 'next/server';
import { actor } from '@/lib/auth/session';
import { AppError } from '@/lib/api/errors';
import { issue, onchainId } from '@/lib/blockchain/chain';

const isBytes32 = (value: string) => /^0x[0-9a-fA-F]{64}$/.test(value);

export async function POST(request: Request) {
  try {
    // Issuance is an authenticated action on the user's own claim.
    await actor();

    const { claimId, claimDataHash } = await request.json();

    if (!claimId || !claimDataHash) {
      return NextResponse.json({ error: 'claimId and claimDataHash are required' }, { status: 400 });
    }

    // The deployed SANADCredential contract exposes issue(bytes32 id, bytes32 recordHash).
    // Reuse the audited chain helper so the ABI, id mapping and mock/real mode stay in sync.
    const recordHash = isBytes32(claimDataHash) ? claimDataHash : onchainId(claimDataHash);
    const result = await issue(claimId, recordHash);

    return NextResponse.json({
      success: true,
      mode: result.mode,
      transactionHash: result.transaction_hash,
      credentialId: claimId,
      network: result.mode === 'real' ? 'Polygon Amoy testnet (80002)' : 'mock'
    });

  } catch (error: any) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.code, message: error.message }, { status: error.status });
    }
    console.error('Blockchain Issuance Error:', error);
    return NextResponse.json({
      error: 'Failed to issue credential on blockchain',
      details: error.message
    }, { status: 500 });
  }
}
