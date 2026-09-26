import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // In a real app with Auth, we would verify the user session here
    // For now, we return all claims (or mock a user ID if auth isn't fully wired)
    const { data: claims, error } = await supabase
      .from('claims')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database error fetching claims' }, { status: 500 });
    }

    return NextResponse.json({ data: claims });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { original_statement, structured_data } = body;

    if (!original_statement || !structured_data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: newClaim, error } = await supabase
      .from('claims')
      .insert([
        { 
          original_statement, 
          structured_data,
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
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
