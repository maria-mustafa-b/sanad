"use client";
import { GrievanceCategory, LanguageCode, SupportOrganization } from '../types';
import { supportOrganizations } from '../data/mockData';

export interface MatchExplanation {
  organization: SupportOrganization;
  matchScore: 'High' | 'Medium';
  matchedReasons: string[];
}

export const matchSupportOrganizations = (
  category: GrievanceCategory,
  userLanguage: LanguageCode
): MatchExplanation[] => {
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
};
