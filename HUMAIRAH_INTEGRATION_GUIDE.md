# SANAD 2.0 Full Feature Integration Guide

Hi Humairah! 👋 Your UI looks incredible. The backend (Gemini AI, Vision OCR, Polygon Blockchain, and government services) is **100% built and running**. 

To make this a fully working product (no fake buttons, no simulated mock data), you need to replace the dummy data in your components with real `fetch()` calls to our Next.js API routes.

Here are the exact code snippets to wire up **ALL** the core features:

---

## 1. Chat & Voice Intake (`src/screens/ChatPage.tsx`)
**Goal:** Send the worker's story to Gemini AI to structure it into a legal claim.

```typescript
const analyzeSituation = async (text: string) => {
  setIsLoading(true);
  try {
    const res = await fetch('/api/ai/understand', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text,
        context: { platform: "web", language: "ur" } // change language dynamically if possible
      })
    });
    
    const data = await res.json();
    // 'data' contains the structured Gemini output: { category, severity, summary, missingInformation }
    // Save this to AppContext to display on the Dashboard and Situation screens!
    setSituation(data);
  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 2. Document OCR (`src/screens/DocumentsPage.tsx`)
**Goal:** Read Arabic/English passports, visas, or contracts using Gemini Vision.

```typescript
const uploadAndAnalyzeDocument = async (file: File) => {
  // 1. Upload file (FormData)
  const formData = new FormData();
  formData.append('file', file);
  
  const uploadRes = await fetch('/api/documents', {
    method: 'POST',
    body: formData
  });
  const uploadedDoc = await uploadRes.json();
  
  // 2. Trigger Gemini Vision OCR on the uploaded document
  const analyzeRes = await fetch(`/api/documents/${uploadedDoc.id}/analyze`, {
    method: 'POST'
  });
  
  const analysis = await analyzeRes.json();
  // analysis contains { extractedText, confidence, documentType: 'PASSPORT', flags: [] }
  // Display this in the UI to warn users of illegal clauses or show extracted info!
};
```

---

## 3. UAE Government Services (`src/screens/ServicesPage.tsx`)
**Goal:** Fetch the real database of 28 mapped MOHRE / UAE Pass services instead of hardcoding them.

```typescript
useEffect(() => {
  const fetchServices = async () => {
    const res = await fetch('/api/services');
    const json = await res.json();
    // json.data is an array of real UAE government services
    setServices(json.data);
  };
  fetchServices();
}, []);
```

---

## 4. Blockchain Verifiable Credentials (`src/screens/CredentialsPages/VaultPage.tsx`)
**Goal:** Issue a real Polygon smart contract credential.

```typescript
const issueCredential = async (claimId: string) => {
  const res = await fetch(`/api/credentials/issue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      claimId,
      credentialType: 'EMPLOYMENT_DISPUTE'
    })
  });
  
  const cred = await res.json();
  // cred contains { hash, contractAddress, transactionUrl }
  // Show this in the Vault!
};
```

---

## 5. Dashboard Data (`src/screens/DashboardPage.tsx`)
**Goal:** Show real claims and applications for the user.

```typescript
useEffect(() => {
  const fetchDashboard = async () => {
    const res = await fetch('/api/claims');
    const json = await res.json();
    // Use json.data to populate the Dashboard cards instead of mockData.ts
    setClaims(json.data);
  };
  fetchDashboard();
}, []);
```

---

## 6. Real Verification Portal (`/verify` page)
**Goal:** Public QR code verification of credentials against the blockchain.

```typescript
const verifyCredential = async (hash: string) => {
  const res = await fetch(`/api/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hash })
  });
  
  const result = await res.json();
  // result contains { valid: true/false, timestamp, issuer }
  // Display green checkmark if valid!
};
```

---

## 7. Real Authentication & Sessions (`src/screens/AuthPage.tsx`)
**Goal:** Real sign in/up endpoints.

```typescript
const handleLogin = async (email, password) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok) {
     navigate('/dashboard');
  }
};
```

---

### Summary
No backend code (Prisma/ethers.js) needed on your end. Just wire up these `fetch()` calls wherever you currently have `setTimeout` or hardcoded mock variables, and the app will be 100% functional end-to-end!
