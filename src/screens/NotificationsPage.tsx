"use client";
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppShell } from '../layouts/AppShell';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/ChatBubble';
import { Badge } from '../components/ui/Badge';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, navigate } = useApp();
  const [filter, setFilter] = useState('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'updates') return n.category === 'security' || n.category === 'system';
    if (filter === 'applications') return n.category === 'case_update';
    if (filter === 'credentials') return n.category === 'security';
    return true;
  });

  const iconFor = (cat: string) => {
    if (cat === 'case_update') return 'assignment';
    if (cat === 'security') return 'verified_user';
    return 'info';
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-ink">Notifications</h1>
          <button
            onClick={markAllNotificationsRead}
            className="text-sm font-semibold text-brand cursor-pointer"
          >
            Mark all read
          </button>
        </div>

        <Tabs
          tabs={[
            { id: 'all', label: 'All' },
            { id: 'updates', label: 'Updates' },
            { id: 'applications', label: 'Applications' },
            { id: 'credentials', label: 'Credentials' },
          ]}
          active={filter}
          onChange={setFilter}
        />

        <div className="space-y-2">
          {filtered.map((n) => (
            <Card
              key={n.id}
              className={`!p-4 flex gap-3 cursor-pointer ${!n.read ? 'border-brand/30 bg-brand-soft/40' : ''}`}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.relatedRoute) navigate(n.relatedRoute);
              }}
            >
              <div className="w-10 h-10 rounded-full bg-brand-muted text-brand flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">{iconFor(n.category)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-ink truncate">{n.title}</h3>
                  {!n.read && <Badge tone="danger">New</Badge>}
                </div>
                <p className="text-sm text-ink-secondary mt-0.5 line-clamp-2">{n.message}</p>
                <div className="text-xs text-ink-muted mt-1">{n.timestamp}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
};
