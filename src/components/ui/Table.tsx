import React from 'react';

export const Table: React.FC<{
  columns: { key: string; label: string; className?: string }[];
  rows: Record<string, React.ReactNode>[];
  className?: string;
}> = ({ columns, rows, className = '' }) => (
  <>
    {/* Desktop table */}
    <div className={`hidden md:block overflow-x-auto rounded-md border border-border ${className}`}>
      <table className="w-full text-[13px] text-left">
        <thead className="bg-surface-container text-ink-secondary">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={`px-4 py-2.5 font-semibold tracking-wide text-[11px] uppercase ${c.className || ''}`}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-border bg-card hover:bg-brand-soft/50">
              {columns.map((c) => (
                <td key={c.key} className={`px-4 py-3 text-ink ${c.className || ''}`}>
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile stacked cards */}
    <div className={`md:hidden space-y-3 ${className}`}>
      {rows.map((row, i) => (
        <div key={i} className="bg-card border border-border rounded-lg p-4 space-y-2 shadow-card">
          {columns.map((c) => (
            <div key={c.key} className="flex justify-between gap-3 text-sm">
              <span className="text-ink-muted font-medium">{c.label}</span>
              <span className="text-ink text-right">{row[c.key]}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  </>
);
