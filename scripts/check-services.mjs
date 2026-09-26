import { createClient } from '@supabase/supabase-js';
import { loadEnvFile } from 'node:process';
import { existsSync } from 'node:fs';

if (existsSync('.env.local')) loadEnvFile('.env.local');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function check() {
  const res = await fetch(`${supabaseUrl}/rest/v1/`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  });
  console.log(await res.json());
}

check();
