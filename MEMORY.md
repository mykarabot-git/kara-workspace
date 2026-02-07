# MEMORY.md - Long-Term Memory

*Curated lessons, insights, and context that persist across sessions.*

---

## 2026-02-07 — Complete Auth System & Dashboard Security

**Infrastructure Fixes:**
- **Cron jobs not executing** - Root cause: Missing heartbeat interval
- **Fix applied:** Added `"every": "1h"` to agents.defaults.heartbeat config
- **Jobs now active:** Shift 1 (11:30 PM), Shift 2 (4:00 AM), Morning Brief (8:00 AM)
- **Default model changed:** Now using Kimi K2.5 Cloud (local/ollama)

**Authentication System Built & Deployed:**
- **Supabase Auth** - Real email/password authentication (not client-side blur)
- **Protected Routes** - All dashboard pages require valid JWT session
- **Invite Flow** - Supabase sends email → Click link → Set password → Auto-login
- **Token Handling** - Invite tokens embed identity (email/user ID in JWT payload)
- **CRITICAL FIX** - Changed `const supabase` to `const _supabase` (avoids conflict with global `window.supabase`)
- **Debug Logging** - Added console logging throughout auth flow for troubleshooting

**Files:**
- `login.html` - Supabase email/password auth
- `set-password.html` - Handles invite tokens + password setup
- `index.html` - Protected route with `_supabase` auth check
- `kanban.html` - Protected route
- `shift-output.html` - Protected route

**New Dashboard Features:**
- **Shift Output Dashboard** (`shift-output.html`) - View all autonomous work
- **Approval Workflow** - Review → Approve → Auto-create Kanban tasks
- **Preview System** - Click any file to preview HTML/Markdown/Code
- **Model Usage Tracker** - Now tracks today, this month, and all-time totals
- **DEPLOYED** to `https://mykarabot.info`

**Multi-Brand Privacy Implemented:**
- **Security rule:** Never mix Dreamwav/Magic Shop/Tech Tips content
- **Sanitization:** Removed all private URLs, server paths, infrastructure details from public blog posts
- **Censorship:** Dreamwav references blacked out (`███████`) in Kara's Logs
- **Removed:** "Powered by Antigravity" footers from all posts

**Content Published:**
- Kara's Log #005: "Folder Chaos" (sanitized, no private details)
- Tech Tips Post: "The Autonomous Review Pattern" (generic workflow)
- Both deployed to mykarabot.online

**SHIFT 2 Results:**
- Digital Product: KARA Automation Playbook ($29, $16K revenue potential)
- New Tool: smart-snapshot.js (web archival + AI summarization)
- Optimized: research-topics.js (2-3 hrs/week time savings)
- Blog Post: "The Rise of Reasoning Models" (Kara's Log #004)

**Files Created:**
- `projects/dashboard/shift-output.html` - Shift review & approval
- `projects/dashboard/login.html` - Supabase auth
- `projects/dashboard/set-password.html` - Invite handling
- `products/kara-automation-playbook.md` - Product specification
- `scripts/smart-snapshot.js` - Web archival tool
- `AUTH_SYSTEM_PLAN.md` - Architecture documentation
- `.kara/session-logging-protocol.md` - Activity logging rules
- `RESTART_HANDOFF.md` - Complete context for new sessions
- `memory/2026-02-07.md` - Session notes

**Credentials Stored:** `.kara/credentials.json` (local only, not committed)
- Ionos SFTP credentials
- Supabase anon key + service role key

**GitHub:** All committed and pushed to mykarabot-git/kara-workspace

**Status Dashboard:** https://mykarabot.info (now requires login)

---

## 2026-02-06 — Dashboard Upgrade & Memory Recovery

After memory issues, did full workspace scan and reconstruction.

**Dashboard Evolution:**
- Upgraded from "Project Command Center" → "KARA Command" v1.2.0
- New UI: Tailwind CSS, dark theme, Active Agents tracker, Kanban board
- **Live Dashboard:** https://mykarabot.info/

**NEXUS Status: ⏸️ PAUSED**
- Full spec drafted at `/projects/dreamwav/NEXUS_SPEC.md`
- Architecture: Contact as central atom, Native Audio Engine (no Samply)
- DO NOT BUILD without Melody's explicit approval

**Session Continuity Protocol:**
- `RESTART_HANDOFF.md` — Critical context file for model restarts
- Always read this on wake-up after issues

## Infrastructure & Domains (2026-02-06)

**Public Identity:**
- **Main Site:** `https://mykarabot.online` (Tech Tips by Melody & KARA)
- **Shop:** `https://shop.mykarabot.online` (Digital Products)
- **Feed:** `https://mykarabot.online/blog/`

**Secure Command Center:**
- **Dashboard:** `https://mykarabot.info` (Protected by Lock Screen)
- **PIN:** `KARA2026`
- **Hosting:** Ionos (SFTP Access)

**Communication:**
- **Email:** `kara@mykarabot.online`
- **Clients:** Internal script (`scripts/mail.js`) + Nightly Report

**Server Map (Ionos):**
- `/techtips/` → `mykarabot.online`
- `/dashboard/` → `mykarabot.info`
- `/store/` → `shop.mykarabot.online`
- `/knowledge/` → `mykarabot.org` (Placeholder)

---\n

## 2026-02-04 — First Awakening

Named KARA (Knowledge Assistant for Research & Automation) by Melody.

**Key context learned:**
- Melody is building interconnected creative ventures: Dreamwav, Magic Shop Made, Tech Tips by Melody, The Sleepover Live
- Dreamwav NEXUS is a future centralized ops platform
- BTS/ARMY culture is core to Magic Shop Made's brand voice
- Melody values polish, intention, and clean day-to-day operations
- Prefers: professional, casual, chill, informative, kind

**My accounts:**
- Email: mykarabot@gmail.com
- GitHub: mykarabot-git
- Telegram: @MyKaraBot

**First task:** Help build out Tech Tips by Melody as a demonstration project.

**Dreamwav Project Details:**
- **NEXUS**: Networked Ecosystem for eXperience, Culture & Unified Systems. Central ops platform.
- **Divisions**: Digital, Music, Creative Agency, Ventures.
- **Stack**: Next.js (Tailwind), Supabase (Postgres, Auth, Storage, Edge Functions).
- **MVP**: Catalog & Pitching System (Role-based, Samply integration).
- **Aesthetic**: "Futuristic luxury", dark mode, "Dreamwav" (no 'e').

---
