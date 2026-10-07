import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { actor } from '@/lib/auth/session';
import { AppError } from '@/lib/api/errors';

function errorResponse(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json({ error: error.code, message: error.message }, { status: error.status });
  }
  console.error('API error:', error);
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}

export async function GET() {
  try {
    // Only ever return the signed-in user's own claims.
    const user = await actor();

    const { data: claims, error } = await getServiceRoleClient()
      .from('claims')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database error fetching claims' }, { status: 500 });
    }

    return NextResponse.json({ data: claims });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    // Claims belong to the authenticated user; never a hardcoded identity.
    const user = await actor();

    const body = await request.json();
    const { original_statement, structured_data } = body;

    if (!original_statement || !structured_data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: newClaim, error } = await getServiceRoleClient()
      .from('claims')
      .insert([
        {
          user_id: user.id,
          original_text: original_statement,
          intent: typeof structured_data === 'string' ? structured_data : JSON.stringify(structured_data),
          status: 'AI_ANALYZED'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to create claim' }, { status: 500 });
    }

    return NextResponse.json({ data: newClaim }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
