const fs = require('fs');
let content = fs.readFileSync('src/services/aiService.ts', 'utf8');

const replacement = `
function getEmpatheticResponse(userLanguage: LanguageCode) {
  const responsesByLang = {
    en: {
      nativeText: "We have securely structured your statement into verifiable legal facts.",
      englishSynopsis: "AI Advocate has processed your statement."
    },
    hi: {
      nativeText: "हमने आपके बयान का विश्लेषण किया है और इसे कानूनी तथ्यों में सुरक्षित रूप से संरचित किया है। SANAD आपके साथ खड़ा है।",
      englishSynopsis: "AI Advocate has processed your statement."
    },
    ar: {
      nativeText: "لقد قمنا بتحليل إفادتك وهيكلتها بشكل آمن في حقائق قانونية يمكن التحقق منها.",
      englishSynopsis: "AI Advocate has processed your statement."
    },
    ur: {
      nativeText: "ہم نے آپ کے بیان کا تجزیہ کیا ہے اور اسے قانونی حقائق میں محفوظ طریقے سے ترتیب دیا ہے۔",
      englishSynopsis: "AI Advocate has processed your statement."
    },
    bn: {
      nativeText: "আমরা আপনার বিবৃতি বিশ্লেষণ করেছি এবং আইনি তথ্যে নিরাপদে গঠন করেছি।",
      englishSynopsis: "AI Advocate has processed your statement."
    }
  };
  // @ts-ignore
  return responsesByLang[userLanguage] || responsesByLang.en;
}`;

content = content.replace(/function getEmpatheticResponse[\s\S]*/, replacement);
fs.writeFileSync('src/services/aiService.ts', content);
