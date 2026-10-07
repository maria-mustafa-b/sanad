import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { seedServices } from '@/lib/services/catalog';

// The reviewed catalog of official UAE government resources (29 entries with
// verified official URLs) is the single fallback source, keeping the live demo
// path aligned with the full catalog instead of a short ad-hoc list.
const FALLBACK_SERVICES = seedServices.map((service, index) => ({
  id: String(index + 1),
  name: service.title,
  description: service.description,
  category: service.category,
  official_url: service.url,
  supported_situations: [...service.situations],
}));

export async function GET() {
  try {
    const { data: services, error } = await getServiceRoleClient()
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !services || services.length === 0) {
      console.error('Supabase error or empty services, returning reviewed official catalog:', error?.message);
      return NextResponse.json({ data: FALLBACK_SERVICES, source: 'official_catalog_fallback' });
    }

    return NextResponse.json({ data: services, source: 'database' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ data: FALLBACK_SERVICES, source: 'official_catalog_fallback' });
  }
}
