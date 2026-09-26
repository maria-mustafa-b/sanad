const fs = require('fs');
let content = fs.readFileSync('src/views/DocumentReaderView.tsx', 'utf8');

// Add file input reference and handler
const replacement = `  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setFile(e.target.files[0]);
    setIsProcessing(true);
    setOcrResult(null);
    try {
      // 1. Upload to backend
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      const upRes = await fetch('/api/documents', { method: 'POST', body: formData });
      if (!upRes.ok) throw new Error('Upload failed');
      const upJson = await upRes.json();
      const docId = upJson.data.id;

      // 2. Trigger AI Analysis
      const analyzeRes = await fetch(\`/api/documents/\${docId}/analyze\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent: true })
      });
      if (!analyzeRes.ok) throw new Error('Analysis failed');
      const analyzeJson = await analyzeRes.json();
      const extraction = analyzeJson.data.extraction;
      
      // Map back to Humairahs UI format
      setOcrResult({
        documentType: extraction.document_type === 'salary document' ? 'salary_slip' : 'contract',
        confidence: 0.95,
        summary: \`AI detected: \${extraction.document_type}. \${extraction.employer_name ? 'Employer: ' + extraction.employer_name + '.' : ''}\`,
        extractedFields: {
          'Detected Type': extraction.document_type || 'Unknown',
          'Employer / Issuer': extraction.employer_name || 'Not Found',
          'Applicable Date/Period': extraction.salary_period || extraction.date || 'Not Found',
        },
        prohibitedClauses: []
      });
      setSelectedDocType(extraction.document_type === 'salary document' ? 'salary' : 'contract');
    } catch (err) {
      console.error(err);
      alert('Failed to analyze document. Ensure API key is set and file is supported.');
    } finally {
      setIsProcessing(false);
    }
  };`;

content = content.replace(/const handleRunOcr = async [\s\S]*?setIsProcessing\(false\);\n    \}\n  \};/, replacement);

const inputUI = `<div className="p-4 rounded-xl bg-surface hover:bg-surface-container-high transition-all border border-dashed border-primary/40 text-center cursor-pointer relative flex flex-col justify-between">
                <input type="file" accept=".pdf,image/png,image/jpeg" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                <span className="material-symbols-outlined text-2xl mb-2 text-primary">cloud_upload</span>
                <div>
                  <strong className="text-xs block font-bold text-on-surface">Upload Real File</strong>
                  <span className="text-[10px] text-on-surface-variant">PDF, PNG, JPG (Uses Gemini Vision)</span>
                </div>
              </div>`;

content = content.replace(/<div className="grid grid-cols-2 gap-3">/, '<div className="grid grid-cols-3 gap-3">\n              ' + inputUI);

fs.writeFileSync('src/views/DocumentReaderView.tsx', content);
