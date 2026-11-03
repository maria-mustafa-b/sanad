import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { onchainId } from '@/lib/blockchain/chain';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Credential ID is required' }, { status: 400 });
  }
  // The id is interpolated into a PostgREST filter, so allow only plain id characters.
  if (!/^[A-Za-z0-9-]{1,80}$/.test(id)) {
    return NextResponse.json(
      { verified: false, error: 'CREDENTIAL_NOT_FOUND', message: 'No record found with this Credential ID on the SANAD registry.' },
      { status: 404 },
    );
  }

  try {
    // 1. Query Supabase for claim record matching id
    const { data: claim, error } = await supabase
      .from('claims')
      .select('*')
      .or(`id.eq.${id},claim_number.eq.${id}`)
      .single();

    if (claim) {
      let parsedIntent: any = {};
      try {
        parsedIntent = typeof claim.intent === 'string' ? JSON.parse(claim.intent) : claim.intent;
      } catch (e) {}

      return NextResponse.json({
        verified: true,
        source: 'database',
        credential: {
          id: claim.claim_number || claim.id,
          situation: parsedIntent.category || parsedIntent.intent || 'Employment Situation',
          summary: parsedIntent.summary || 'Formal record on SANAD registry',
          issuedAt: claim.created_at,
          blockchain: 'Polygon Amoy (Chain ID: 80002)',
          integrityHash: onchainId(claim.id),
          status: 'Valid'
        }
      });
    }

    // Only records that actually exist verify. No pattern-based approvals.
    return NextResponse.json({
      verified: false,
      error: 'CREDENTIAL_NOT_FOUND',
      message: 'No record found with this Credential ID on the SANAD registry.'
    }, { status: 404 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
