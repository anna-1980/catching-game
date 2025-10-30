// scripts/generate-config.js
const fs = require("fs");
const path = require("path");

const cfg = {
  firebase: {
    apiKey: process.env.NG_APP_FIREBASE_API_KEY,
    authDomain: process.env.NG_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NG_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NG_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NG_APP_FIREBASE_APP_ID,
  },
  // add other public runtime config here if needed
};

// fail fast if something is missing (optional but helpful)
const missing = Object.entries(cfg.firebase)
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missing.length) {
  console.error("❌ Missing Netlify env vars:", missing.join(", "));
  process.exit(1);
}

const outDir = path.join(__dirname, "..", "public");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "config.json"),
  JSON.stringify(cfg, null, 2),
  "utf-8"
);

console.log("✅ Wrote public/config.json from Netlify env");
