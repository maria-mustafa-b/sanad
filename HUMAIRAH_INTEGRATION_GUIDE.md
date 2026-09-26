# SANAD 2.0 Backend Integration Guide

Hi Humairah! 👋 Your UI looks incredible. 

The backend (Gemini AI, Vision OCR, Polygon Blockchain, and government services) is **100% built and running**. 
Since you built a beautiful React/Vite SPA and we are serving it through Next.js, all you need to do is replace the dummy mock data in your components with real `fetch()` calls to our Next.js API routes.

Here is exactly how to wire up each of your beautiful screens:

---

## 1. Chat & Voice Intake (`src/screens/ChatPage.tsx` / `VoicePage.tsx`)

**Goal:** Send the worker's story to Gemini AI to structure it into a legal claim.

Currently, the app uses dummy data or just shows a nice UI. You need to send the text to `/api/ai/understand`.

**How to wire it:**
```typescript
// When the user finishes speaking or typing:
const analyzeSituation = async (text: string) => {
  setIsLoading(true);
  try {
    const res = await fetch('/api/ai/understand', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text,
        context: { platform: "web", language: "ur" }
      })
    });
    
    const data = await res.json();
    
    // 'data' contains the structured Gemini output!
    // Example: { category: "Unpaid Wages", severity: "high", summary: "..." }
    // Save this to your AppContext so the Dashboard and Situation page can show it!
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

**How to wire it:**
```typescript
// When a user selects a file from <input type="file" />
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
  // Display this in the UI!
};
```

---

## 3. UAE Government Services (`src/screens/ServicesPage.tsx`)

**Goal:** Fetch the real database of 28 mapped MOHRE / UAE Pass services instead of hardcoding them.

**How to wire it:**
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

**How to wire it:**
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

## Summary
You don't need to write any backend code or setup Prisma/Supabase/ethers.js! Just use native `fetch()` calls to these endpoints in your components where you currently have `setTimeout` or hardcoded variables.

When you're done, commit it to this branch (`humairah-backend-integration`) and we will merge it!
