import { chromium } from 'playwright-core';
const EXE = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const B = 'http://localhost:3111';
const shots = [
  ['/', 'shot_landing', 1280, 800],
  ['/chat', 'shot_chat', 1280, 900],
  ['/dashboard', 'shot_dashboard', 1280, 900],
  ['/services', 'shot_services', 1280, 900],
  ['/verify', 'shot_verify', 1280, 820],
];
const browser = await chromium.launch({ executablePath: EXE, headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
for (const [path, name, w, h] of shots) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(B + path, { waitUntil: 'networkidle', timeout: 30000 }).catch(e => console.log('nav warn', path, e.message));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `paper/${name}.png` });
  console.log('shot', name);
}
await browser.close();
