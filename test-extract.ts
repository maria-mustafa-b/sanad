import { extractSituationFacts } from './lib/actions/extract.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

extractSituationFacts('Meri job chali gayi hai').then(console.log).catch(console.error);
