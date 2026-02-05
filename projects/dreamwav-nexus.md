# Dreamwav NEXUS - Product Requirements

**Core Concept:** A high-end, proprietary platform for music pitching and operations.

## The Workflow: "Pitch Capsule"
Instead of sending raw links, we send a curated "Drop" experience.

### 1. Delivery Format
*   **Preview Reel:** 10-20s video. Kinetic lyrics. Premium visual. (Goal: Stop the scroll).
*   **Pitch Card:** One-sheet style. Facts only.
*   **Listening Room:** Private, secure link. Full audio + Instrumentals. Download toggle.

### 2. Bi-Weekly Pitch Cycle
*   **Monday:** Intake & Priority. (Genre, BPM, Key, Territory, Artist Target).
*   **Targeting:** Custom pitch angle. Why this artist? Why now?
*   **Pitch Day:** Send via Email/DM. Log immediately.
*   **Reporting:** Weekly report. (Holds, Interest, Passes).

### 3. Architecture Ideas
*   **Frontend:** Next.js (React) + Tailwind CSS + Framer Motion (for premium feel).
*   **Backend:** Supabase (Auth, Database, Realtime).
*   **Media:** Vercel Blob or AWS S3 for audio/video hosting.
*   **Video Gen:** Remotion (for generating the Preview Reels programmatically).

## Features
*   **Catalog Management:** Source of truth for all songs (Splits, Metadata, Files).
*   **Contact CRM:** Tiers A/B/C. Cadence tracking.
*   **Analytics:** Who opened the capsule? Who listened?
*   **Security:** Password protection for high-value drops.
