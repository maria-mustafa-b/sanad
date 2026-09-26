import { GrievanceCategory, LanguageCode, SupportOrganization } from '../types';

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
    // Fallback if backend fails
    return [];
  }
};
