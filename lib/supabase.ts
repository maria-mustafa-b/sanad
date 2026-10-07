import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uarzykpuurrkicyzuwbp.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_2y5p2fKtaM5f-vNnfpaKTA_nveMkvj7';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getServiceRoleClient = () => {
  // Never fall back to a committed key: the service-role secret must come from
  // the environment (Vercel env var / local .env.local only).
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }
  return createClient(supabaseUrl, serviceRoleKey);
};
