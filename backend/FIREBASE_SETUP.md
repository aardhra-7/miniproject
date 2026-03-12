# 🔥 Firebase Setup Guide for StaySphere

## Step 1 – Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click **"Add project"** → Enter name: `staysphere`
3. Disable Google Analytics (optional) → Click **"Create project"**

---

## Step 2 – Enable Firestore Database

1. In Firebase Console → Left sidebar → **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a region (e.g., `asia-south1` for India) → Click **"Enable"**

---

## Step 3 – Get Service Account Key

1. Firebase Console → ⚙️ **Project Settings** (gear icon top-left)
2. Click **"Service accounts"** tab
3. Click **"Generate new private key"** → Confirm
4. A `serviceAccountKey.json` file will download
5. **Place this file inside the `backend/` folder**

```
staysphere/
  backend/
    serviceAccountKey.json   ← place here
    server.js
    ...
```

> ⚠️ IMPORTANT: Never commit `serviceAccountKey.json` to Git!
> Add it to `.gitignore`

---

## Step 4 – Configure .env

Open `backend/.env` and set your Firebase Project ID:

```env
FIREBASE_PROJECT_ID=your-actual-project-id
```

The project ID is visible in Firebase Console → Project Settings → General tab.

---

## Step 5 – Set Firestore Security Rules (Production)

In Firebase Console → Firestore → **Rules** tab, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only allow server-side Admin SDK (backend) access
    // Frontend accesses go through your Express API
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Step 6 – Install & Run Backend

```bash
cd backend
npm install
npm run dev
```

## Step 7 – Seed Initial Data

After server starts, run once:

```bash
curl -X POST http://localhost:5000/api/auth/seed
```

This creates all demo users and student profiles in Firestore.

---

## Firestore Collections Created

After seeding, these collections will appear in Firebase Console:

| Collection     | Description                    |
|---------------|--------------------------------|
| `users`        | Login credentials + roles      |
| `students`     | Student profiles               |
| `attendance`   | Daily attendance records       |
| `messCuts`     | Mess cut requests              |
| `outgoings`    | Outgoing entries with GPS      |
| `homeGoings`   | Home going requests with GPS   |
| `notifications`| System announcements           |

---

## Firestore vs MongoDB Comparison

| Feature         | MongoDB Atlas      | Firebase Firestore         |
|----------------|-------------------|---------------------------|
| Document DB    | ✅                 | ✅                         |
| Real-time      | ❌ (polling)       | ✅ (live listeners)        |
| Free tier      | 512MB              | 1GB + 50K reads/day       |
| Hosting        | Cloud Atlas        | Google Cloud               |
| Admin SDK      | Mongoose           | firebase-admin             |
| Schema         | Mongoose models    | Schema-less (see schema.js)|

