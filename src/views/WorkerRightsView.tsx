"use client";
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { rightsArticles } from '../data/mockData';
import { speakText } from '../services/speechService';
import { RightsArticle } from '../types';

export const WorkerRightsView: React.FC = () => {
  const { t, language, navigate } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<RightsArticle | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const categories = ['All', 'Wages & Severance', 'Personal Freedom', 'Workplace Safety', 'Contracts & Visas'];

  const filteredArticles = rightsArticles.filter(art => {
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch = !search || 
      art.title.toLowerCase().includes(search.toLowerCase()) || 
      art.summary.toLowerCase().includes(search.toLowerCase()) ||
      art.keyPoints.some(p => p.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleReadAloud = (article: RightsArticle) => {
    const speech = `${article.title}. ${article.summary}. Key points: ${article.keyPoints.join('. ')}`;
    speakText(speech, language);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[16px] text-tertiary">gavel</span>
            <span>Plain-Language Statutory Protections</span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl text-on-surface font-bold tracking-tight">
            {t.rights.title}
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant mt-1 max-w-2xl">
            {t.rights.subtitle}
          </p>
        </div>

        <button
          onClick={() => navigate('/tell-sanad')}
          className="px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:opacity-95 transition-opacity cursor-pointer flex items-center gap-1.5 self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-base">mic</span>
          <span>Report a Violation</span>
        </button>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="bg-surface-container rounded-2xl p-4 shadow-sm space-y-3 border border-surface-container-high/60">
        <div className="flex items-center gap-2 bg-surface px-3 py-2 rounded-xl text-xs">
          <span className="material-symbols-outlined text-outline text-[18px]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.rights.searchPlaceholder}
            className="w-full bg-transparent text-on-surface placeholder:text-outline focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-outline-variant hover:text-on-surface cursor-pointer">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface hover:bg-surface-container-high text-on-surface'
              }`}
            >
              {cat === 'All' ? t.rights.allCategories : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Articles Grid or Detail Modal */}
      {selectedArticle ? (
        <div className="bg-surface-container-low rounded-2xl p-6 sm:p-8 shadow-sm border border-surface-container-high/60 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-surface-container-high/60">
            <button
              onClick={() => setSelectedArticle(null)}
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              <span>Back to Topics</span>
            </button>

            <button
              onClick={() => handleReadAloud(selectedArticle)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-container text-xs font-bold text-on-surface transition-colors cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-base text-primary">volume_up</span>
              <span>Read Aloud</span>
            </button>
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-bold text-tertiary tracking-wider">
              {selectedArticle.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface">
              {selectedArticle.title}
            </h2>
            {selectedArticle.arabicTitle && (
              <p className="text-sm text-outline font-semibold" dir="rtl">
                {selectedArticle.arabicTitle}
              </p>
            )}
            <p className="text-sm text-on-surface-variant leading-relaxed pt-1">
              {selectedArticle.summary}
            </p>
          </div>

          {/* Key statutory protections */}
          <div className="p-5 rounded-xl bg-surface space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
              Guaranteed Legal Principles:
            </h3>
            <ul className="space-y-2.5 text-xs text-on-surface">
              {selectedArticle.keyPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary text-base mt-0.5">verified</span>
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2 text-[11px] text-outline font-mono border-t border-surface-container">
              Legal Reference: {selectedArticle.legalReference}
            </div>
          </div>

          {/* Expandable FAQs */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-secondary">
              Frequently Asked Questions:
            </h3>
            <div className="space-y-2">
              {selectedArticle.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="rounded-xl bg-surface overflow-hidden border border-surface-container-high/60">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left p-4 flex items-center justify-between text-xs font-bold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <span className={`material-symbols-outlined text-base transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-1 text-xs text-on-surface-variant leading-relaxed border-t border-surface-container">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-surface-container-high/60">
            <span className="text-xs text-on-surface-variant">Facing a violation described here?</span>
            <button
              onClick={() => navigate('/tell-sanad')}
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-sm hover:opacity-95 transition-opacity cursor-pointer flex items-center gap-1.5"
            >
              <span>Record Your Case with SANAD</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="bg-surface-container-low hover:bg-surface-container rounded-2xl p-6 shadow-sm transition-all duration-300 flex flex-col justify-between group border border-surface-container-high/60"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                    {art.category}
                  </span>
                  <button
                    onClick={() => handleReadAloud(art)}
                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    title="Read Aloud"
                  >
                    <span className="material-symbols-outlined text-[18px]">volume_up</span>
                  </button>
                </div>

                <h3 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors">
                  {art.title}
                </h3>
                {art.arabicTitle && (
                  <p className="text-xs text-outline font-medium -mt-1" dir="rtl">
                    {art.arabicTitle}
                  </p>
                )}
                <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                  {art.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-surface-container-high/60 flex items-center justify-between text-xs">
                <span className="text-outline text-[11px]">{art.faqs.length} FAQs included</span>
                <button
                  onClick={() => setSelectedArticle(art)}
                  className="font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>{t.rights.readArticle}</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
