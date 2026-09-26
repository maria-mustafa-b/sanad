import { GrievanceCategory, LanguageCode, SupportOrganization } from '../types';
import { supportOrganizations } from '../data/mockData';

export interface MatchExplanation {
  organization: SupportOrganization;
  matchScore: 'High' | 'Medium';
  matchedReasons: string[];
}

export const matchSupportOrganizations = async (
  category: GrievanceCategory,
  userLanguage: LanguageCode
): Promise<MatchExplanation[]> => {
  try {
    const res = await fetch('/api/services');
    if (!res.ok) throw new Error('Failed to fetch');
    const json = await res.json();
    const services = json.data || [];
    
    // If backend database is completely empty (e.g. running in local demo mode without seeds),
    // fallback to the rich mock dataset so the UI is not empty.
    if (services.length === 0) {
      throw new Error('Database empty, fallback to mock');
    }
    
    return services.map((s: any) => ({
      organization: {
        id: s.id,
        name: s.title,
        type: 'ngo',
        supportedCategories: [s.category as GrievanceCategory],
        languages: ['en', 'hi', 'ar', 'ur', 'bn'],
        region: 'UAE-wide',
        hotline: s.details?.official_url || 'Website Only',
        turnaroundTime: 'Standard',
        feePolicy: 'Official',
        description: s.description,
      },
      matchScore: s.category === category ? 'High' : 'Medium',
      matchedReasons: [s.eligibility_guidance || 'General Support', ...(s.steps ? s.steps.slice(0, 2) : [])],
    })).sort((a: MatchExplanation, b: MatchExplanation) => (a.matchScore === 'High' ? -1 : 1));
  } catch (err) {
    // Fallback to local hardcoded database
    return supportOrganizations.map(org => {
      const matchedReasons: string[] = [];
      let score: 'High' | 'Medium' = 'Medium';
  
      if (org.supportedCategories.includes(category)) {
        matchedReasons.push(`Directly handles ${category.replace('_', ' ')} claims`);
        score = 'High';
      }
  
      if (org.languages.includes(userLanguage)) {
        matchedReasons.push(`Provides full case advocacy in your preferred language (${userLanguage.toUpperCase()})`);
      }
  
      matchedReasons.push(`${org.feePolicy} policy guarantees zero cost`);
  
      return {
        organization: org,
        matchScore: score,
        matchedReasons,
      };
    }).sort((a, b) => (a.matchScore === 'High' ? -1 : 1));
  }
};
