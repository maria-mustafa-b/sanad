import { createClient } from '@supabase/supabase-js';
import { loadEnvFile } from 'node:process';
import { existsSync } from 'node:fs';

if (existsSync('.env.local')) loadEnvFile('.env.local');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const services = [
  {
    name: 'MOHRE - Wage Protection System (WPS)',
    description: 'If your employer has not paid your salary on time, you can file a formal complaint through the Ministry of Human Resources and Emiratisation. The WPS ensures that workers are paid their wages via registered financial institutions.',
    category: 'Employment & Labor',
    official_url: 'https://www.mohre.gov.ae/en/services/wage-protection-system.aspx',
    requirements: { documents: ['Emirates ID', 'Employment Contract', 'Bank Statement'] }
  },
  {
    name: 'Dubai Courts - Labor Case Registration',
    description: 'For severe labor disputes regarding end-of-service benefits, unfair dismissal, or unpaid wages exceeding amicable settlement. You must first obtain an NOC from MOHRE before filing.',
    category: 'Legal Support',
    official_url: 'https://www.dc.gov.ae/',
    requirements: { documents: ['MOHRE NOC', 'Emirates ID', 'Employment Contract', 'Passport Copy'] }
  },
  {
    name: 'GDRFA - Residency Status & Overstay Support',
    description: 'If you have lost your job and your visa has been cancelled, you have a grace period. Use this service to check your status, apply for extensions, or resolve overstay fines.',
    category: 'Residency & Visa',
    official_url: 'https://www.gdrfad.gov.ae/',
    requirements: { documents: ['Passport', 'Old Visa Copy'] }
  },
  {
    name: 'Pro Bono Legal Clinic - DIFC Courts',
    description: 'Free legal advice for individuals who cannot afford lawyers. Accessible for workers dealing with severe contract breaches or needing guidance on filing a case.',
    category: 'Pro Bono Legal',
    official_url: 'https://www.difccourts.ae/pro-bono',
    requirements: { documents: ['Proof of income (low income)', 'Case summary'] }
  }
];

async function seed() {
  console.log("Seeding services into Supabase...");
  
  for(const service of services) {
    const { data, error } = await supabase.from('services').insert([service]);
    if (error) console.error("Error inserting service:", error.message);
  }
  
  console.log(`Successfully seeded services!`);
}

seed();
