import fs from 'fs';
import path from 'path';

// 1️⃣ Collect Firebase values from Netlify environment variables
const firebase = {
  apiKey: process.env.NG_APP_FIREBASE_API_KEY,
  authDomain: process.env.NG_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NG_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NG_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NG_APP_FIREBASE_APP_ID,
};

// 2️⃣ Build your config.json structure
const config = { firebase };

// 3️⃣ Ensure the assets folder exists
const filePath = path.resolve('src/assets/config.json');
fs.mkdirSync(path.dirname(filePath), { recursive: true });

// 4️⃣ Write the config file
fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
console.log('✅ Firebase config.json created at:', filePath);
console.log('🔥 Config values injected from Netlify environment:');
console.log(JSON.stringify(firebase, null, 2));
