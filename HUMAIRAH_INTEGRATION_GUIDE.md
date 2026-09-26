# SANAD 2.0 Full Feature Integration Guide

Hi Humairah! 👋 Your UI looks incredible. The backend (Gemini AI, Vision OCR, Polygon Blockchain, and government services) is **100% built and running**.

To make this a fully working product (no fake buttons, no simulated mock data), you need to replace the dummy data in your components with real `fetch()` calls to our Next.js API routes.

**Live backend:** `https://sanad-ebon.vercel.app`

**Important path corrections vs early draft:**
| Guide draft | Actual backend route |
|---|---|
| `POST /api/ai/understand` | `POST /api/ai/analyze` body `{ text }` |
| `POST /api/ai/understand` (voice) | `POST /api/ai/analyze-voice` body `{ transcript }` |
| Verify `{ hash }` | `POST /api/verify` body `{ credentialId }` (UUID) |
| Credentials `{ claimId, credentialType }` | `POST /api/credentials/issue` body `{ claimId }` |
| Document analyze | `POST /api/documents/:id/analyze` body `{ consent: true }` |

All success responses are shaped: `{ success: true, data: ... }`

---

## 1. Chat & Voice Intake
```typescript
const res = await fetch('/api/ai/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text }),
});
const json = await res.json();
// json.data = { analysis: { intent, confidence, facts, ... }, method }
```

## 2. Document OCR
```typescript
const formData = new FormData();
formData.append('file', file);
const uploadRes = await fetch('/api/documents', { method: 'POST', body: formData, credentials: 'include' });
const uploadedDoc = (await uploadRes.json()).data;
const analyzeRes = await fetch(`/api/documents/${uploadedDoc.id}/analyze`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ consent: true }),
});
```

## 3. Services
```typescript
const res = await fetch('/api/services');
const json = await res.json();
setServices(json.data);
```

## 4. Credentials
```typescript
await fetch('/api/credentials/issue', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ claimId }),
});
```

## 5. Dashboard claims
```typescript
const res = await fetch('/api/claims', { credentials: 'include' });
const json = await res.json();
setClaims(json.data);
```

## 6. Verify
```typescript
await fetch('/api/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ credentialId }),
});
```

## 7. Auth
```typescript
await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email, password }),
});
// Or demo session: POST /api/auth/demo
```
