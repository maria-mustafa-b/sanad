import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppShell } from '../layouts/AppShell';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { HumanHelpCard } from '../components/HumanHelpCard';
import { ApiError, analyzeDocument, uploadDocument } from '../services/sanadApi';

const CHECKLIST = [
  { id: 'slip', label: 'Salary slip or bank screenshot', hint: 'August or any unpaid month' },
  { id: 'msg', label: 'Message from employer', hint: 'Optional — if you have one' },
  { id: 'proof', label: 'SANAD Digital Proof', hint: 'Already confirmed information' },
  { id: 'notes', label: 'Short note about when the job ended', hint: 'Optional' },
];

export const DocumentsPage: React.FC = () => {
  const { navigate, documents, credentials, addDocument } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({
    proof: Boolean(credentials[0]),
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [extracted, setExtracted] = useState<{ label: string; value: string }[] | null>(null);
  const [notice, setNotice] = useState('');

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setError('');
    setNotice('');
    setExtracted(null);
    try {
      const uploaded = await uploadDocument(file);
      const analysis = await analyzeDocument(uploaded.id);
      const ext = analysis.extraction || {};
      const rows = [
        { label: 'Type', value: ext.document_type || analysis.documentType || file.type || 'Document' },
        { label: 'Date', value: ext.date || 'Not found' },
        { label: 'Employer', value: ext.employer_name || 'Not found' },
        { label: 'Period', value: ext.salary_period || 'Not found' },
      ];
      setExtracted(rows);
      setChecked((c) => ({ ...c, slip: true }));
      addDocument({
        id: uploaded.id,
        name: uploaded.file_name || uploaded.name || file.name,
        type: 'salary_slip',
        sha256: uploaded.id,
        uploadDate: new Date().toISOString(),
        fileSize: `${Math.round(file.size / 1024)} KB`,
        ocrExtractedData: Object.fromEntries(rows.map((r) => [r.label, r.value])),
        status: 'verified',
      });
      setNotice('Document uploaded and analysed.');
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.code === 'UNAUTHORIZED'
            ? 'Sign in to upload documents to the server. Showing a local preview instead.'
            : e.message
          : 'Upload failed.';
      setError(msg);
      // Local preview so the journey never dead-ends
      setExtracted([
        { label: 'File', value: file.name },
        { label: 'Size', value: `${Math.round(file.size / 1024)} KB` },
        { label: 'Status', value: 'Stored on this device only (sign in for cloud OCR)' },
      ]);
      setChecked((c) => ({ ...c, slip: true }));
      addDocument({
        id: `local-${Date.now()}`,
        name: file.name,
        type: 'other',
        sha256: 'local',
        uploadDate: new Date().toISOString(),
        fileSize: `${Math.round(file.size / 1024)} KB`,
        status: 'unverified',
      });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-3xl pb-8">
        <div>
          <p className="text-label text-brand mb-1">Evidence checklist</p>
          <h1 className="text-2xl font-bold text-ink tracking-[-0.03em]">Documents</h1>
          <p className="text-ink-secondary text-sm mt-1 leading-relaxed">
            Only what helps your wage case. Missing papers is OK — you can still apply.
          </p>
        </div>

        <Card>
          <CardHeader title="Simple checklist" />
          <ul className="space-y-3">
            {CHECKLIST.map((item) => (
              <li key={item.id}>
                <label className="flex items-start gap-3 cursor-pointer min-h-touch">
                  <input
                    type="checkbox"
                    className="mt-1 w-5 h-5 accent-brand"
                    checked={Boolean(checked[item.id])}
                    onChange={() => setChecked((c) => ({ ...c, [item.id]: !c[item.id] }))}
                  />
                  <span>
                    <span className="block text-sm font-semibold text-ink">{item.label}</span>
                    <span className="block text-xs text-ink-muted">{item.hint}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="border-dashed border-2 border-border-strong bg-surface text-center py-10">
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,image/*,application/pdf"
            className="hidden"
            onChange={(e) => void handleFile(e.target.files?.[0] || null)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full cursor-pointer"
            disabled={uploading}
          >
            <span className="material-symbols-outlined text-4xl text-brand mb-3">cloud_upload</span>
            <div className="font-semibold text-ink">Add a photo or file</div>
            <p className="text-sm text-ink-muted mt-1">PDF, JPG, PNG — tap to browse</p>
          </button>
          <Button className="mt-5" loading={uploading} onClick={() => fileRef.current?.click()}>
            {uploading ? 'Uploading & reading…' : 'Select file'}
          </Button>
          {notice && <p className="mt-3 text-sm text-success-fg">{notice}</p>}
          {error && <p className="mt-3 text-sm text-warning-fg px-4">{error}</p>}
        </Card>

        {(extracted || documents.length > 0) && (
          <Card>
            <CardHeader title="What we found" action={<Badge tone="success">Ready</Badge>} />
            <p className="text-sm text-ink-secondary mb-4">
              You can correct this later. Nothing is shared until you apply.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(extracted || []).map((row) => (
                <div key={row.label} className="rounded-lg bg-surface p-3">
                  <div className="text-xs text-ink-muted font-medium">{row.label}</div>
                  <div className="text-sm font-semibold text-ink mt-0.5">{row.value}</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" fullWidth onClick={() => navigate('/services')}>
            Back to support
          </Button>
          <Button fullWidth onClick={() => navigate('/applications/submit')}>
            Continue to apply
          </Button>
        </div>
        <HumanHelpCard compact />
      </div>
    </AppShell>
  );
};
