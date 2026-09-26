"use client";
import React from 'react';
import { AppShell } from '../layouts/AppShell';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';

const KPIS = [
  { label: 'Total Users', value: '12,480', tone: 'brand' as const },
  { label: 'Credentials', value: '8,214', tone: 'success' as const },
  { label: 'Applications', value: '3,902', tone: 'info' as const },
  { label: 'Escalations', value: '47', tone: 'danger' as const },
];

const ACTIVITY = [
  { title: 'Credential issued', meta: 'SANAD-VC-01992 Â· 2m ago', tone: 'success' as const },
  { title: 'Application submitted', meta: 'APP-2026-9912 Â· 14m ago', tone: 'info' as const },
  { title: 'Escalation opened', meta: 'Shelter request Â· 31m ago', tone: 'danger' as const },
  { title: 'Verification check', meta: 'Public portal Â· 1h ago', tone: 'neutral' as const },
];

const BAR = [42, 58, 35, 70, 48, 62, 55];
const DONUT = [
  { label: 'Wages', pct: 42, color: '#0E4A45' },
  { label: 'Passport', pct: 28, color: '#1A7A6E' },
  { label: 'Contract', pct: 18, color: '#C47A12' },
  { label: 'Other', pct: 12, color: '#2B6CB0' },
];

const SECTION_COPY: Record<string, { title: string; blurb: string }> = {
  '/admin': {
    title: 'Admin dashboard',
    blurb: 'Platform health for the last 30 days',
  },
  '/admin/users': {
    title: 'Users',
    blurb: 'Registered workers and guest sessions',
  },
  '/admin/applications': {
    title: 'Applications',
    blurb: 'Intake pipeline across partner organizations',
  },
  '/admin/credentials': {
    title: 'Credentials',
    blurb: 'Issued, revoked, and expired attestations',
  },
  '/admin/escalations': {
    title: 'Escalations',
    blurb: 'Urgent cases requiring human follow-up',
  },
};

export const AdminDashboardPage: React.FC = () => {
  const { currentRoute, navigate } = useApp();
  const section = SECTION_COPY[currentRoute] || SECTION_COPY['/admin'];
  const isOverview = currentRoute === '/admin';

  const donutBg = `conic-gradient(${DONUT.map((d, i) => {
    const start = DONUT.slice(0, i).reduce((a, x) => a + x.pct, 0);
    return `${d.color} ${start}% ${start + d.pct}%`;
  }).join(', ')})`;

  return (
    <AppShell mode="admin">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-ink">{section.title}</h1>
            <p className="text-sm text-ink-secondary mt-1">{section.blurb}</p>
          </div>
          {!isOverview && (
            <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
              Back to overview
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {KPIS.map((k) => (
            <Card key={k.label} className="!p-4">
              <div className="text-xs font-medium text-ink-muted">{k.label}</div>
              <div className="text-2xl font-bold text-ink mt-1">{k.value}</div>
              <Badge tone={k.tone === 'brand' ? 'brand' : k.tone} className="mt-2">
                Live
              </Badge>
            </Card>
          ))}
        </div>

        {isOverview && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Card className="lg:col-span-2">
              <CardHeader title="Applications (Last 30 Days)" />
              <div className="flex items-end gap-2 h-40">
                {BAR.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div
                      className="w-full rounded-t-md bg-brand hover:bg-brand-mid transition-colors"
                      style={{ height: `${h}%` }}
                      title={`${h}`}
                    />
                    <span className="text-[10px] text-ink-muted">W{i + 1}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="Service usage" />
              <div className="flex flex-col items-center gap-4">
                <div
                  className="w-36 h-36 rounded-full"
                  style={{
                    background: donutBg,
                    maskImage: 'radial-gradient(transparent 48%, black 50%)',
                    WebkitMaskImage: 'radial-gradient(transparent 48%, black 50%)',
                  }}
                  role="img"
                  aria-label="Service usage chart"
                />
                <ul className="w-full space-y-1.5 text-sm">
                  {DONUT.map((d) => (
                    <li key={d.label} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-ink-secondary">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                        {d.label}
                      </span>
                      <span className="font-semibold text-ink">{d.pct}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader title="Recent activity" />
            <ul className="space-y-3">
              {ACTIVITY.map((a) => (
                <li key={a.title} className="flex items-start gap-3">
                  <Badge tone={a.tone}>{a.tone}</Badge>
                  <div>
                    <div className="text-sm font-semibold text-ink">{a.title}</div>
                    <div className="text-xs text-ink-muted">{a.meta}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card padding="none" className="overflow-hidden">
            <div className="p-5 pb-0">
              <CardHeader
                title={
                  currentRoute === '/admin/escalations'
                    ? 'Open escalations'
                    : currentRoute === '/admin/users'
                    ? 'Recent users'
                    : currentRoute === '/admin/credentials'
                    ? 'Recent credentials'
                    : 'Open applications'
                }
              />
            </div>
            <div className="px-5 pb-5">
              <Table
                columns={[
                  { key: 'id', label: 'ID' },
                  { key: 'service', label: 'Item' },
                  { key: 'status', label: 'Status' },
                ]}
                rows={
                  currentRoute === '/admin/escalations'
                    ? [
                        {
                          id: 'ESC-047',
                          service: 'Shelter request',
                          status: <Badge tone="danger">Urgent</Badge>,
                        },
                        {
                          id: 'ESC-046',
                          service: 'Passport retention',
                          status: <Badge tone="warning">Queued</Badge>,
                        },
                      ]
                    : currentRoute === '/admin/users'
                    ? [
                        {
                          id: 'USR-1201',
                          service: 'Rashid K. (guest)',
                          status: <Badge tone="brand">Active</Badge>,
                        },
                        {
                          id: 'USR-1198',
                          service: 'Amina S.',
                          status: <Badge tone="success">Verified</Badge>,
                        },
                      ]
                    : currentRoute === '/admin/credentials'
                    ? [
                        {
                          id: 'SANAD-VC-01992',
                          service: 'Unpaid wages',
                          status: <Badge tone="success">Valid</Badge>,
                        },
                        {
                          id: 'SANAD-VC-01980',
                          service: 'Contract dispute',
                          status: <Badge tone="warning">Expired</Badge>,
                        },
                      ]
                    : [
                        {
                          id: 'APP-9912',
                          service: 'Unpaid wages',
                          status: <Badge tone="warning">Review</Badge>,
                        },
                        {
                          id: 'APP-9901',
                          service: 'Passport help',
                          status: <Badge tone="info">Submitted</Badge>,
                        },
                        {
                          id: 'APP-9888',
                          service: 'Shelter',
                          status: <Badge tone="danger">Escalated</Badge>,
                        },
                      ]
                }
              />
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
};
