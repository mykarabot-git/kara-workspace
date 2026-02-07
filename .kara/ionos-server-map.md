# Ionos Server Map

**Updated:** 2026-02-07
**SFTP Access:** access-5019100086.webspace-host.com (user: a173078)

---

## Domain → Folder Mapping

| Domain | Should Serve | Current Status | Root Folder |
|--------|-------------|----------------|-------------|
| `mykarabot.info` | Dashboard/Command Center | ❌ WRONG (shows Tech Tips) | `/` or `/dashboard/` |
| `mykarabot.online` | Tech Tips Content | ✅ OK | `/techtips/` |
| `shop.mykarabot.online` | Digital Products | ❓ Unverified | `/store/` |

---

## Folder Structure

```
/ (SFTP Root)
├── index.html           ← KARA Command dashboard (currently NOT served)
├── shift-output.html    ← Shift Output page (accessible at /shift-output.html)
├── shift-output.js      ← Shift Output functionality
├── usage.json           ← Model usage tracking
├── kanban.html          ← Kanban board
├── vault.html           ← Secure vault
├── style.css            ← Dashboard styles
├── app.js               ← Dashboard JS
├── api.php              ← Backend API
├── data.json            ← Kanban data
├── logs/                ← System logs
│
├── dashboard/           ← Old dashboard folder (404 via web)
│   ├── .htaccess
│   ├── index.html       ← OLD version
│   └── ...
│
├── techtips/            ← Tech Tips website (currently served for BOTH domains)
│   ├── index.html       ← Tech Tips homepage
│   ├── style.css
│   ├── shop.html
│   ├── about.html
│   ├── tools.html
│   └── blog/
│
├── store/               ← Shop placeholder
│
└── knowledge/           ← Knowledge base placeholder
```

---

## The Problem

**mykarabot.info** domain is configured to serve `/techtips/` folder instead of root (`/`).

- ✅ `https://mykarabot.info/shift-output.html` works (explicit file path)
- ❌ `https://mykarabot.info/` shows Tech Tips (wrong folder)
- ❌ `https://mykarabot.info/dashboard/` returns 404

---

## Fix Options

### Option 1: Ionos Control Panel (RECOMMENDED)
Change domain mapping in Ionos:
- `mykarabot.info` → Serve from `/` (root)
- `mykarabot.online` → Serve from `/techtips/` (keep as-is)

### Option 2: Move Files to /techtips/
If both domains must share one folder:
- Rename `/techtips/index.html` → `/techtips/techtips-index.html`
- Copy KARA Command dashboard to `/techtips/index.html`
- Tech Tips site becomes accessible at `/techtips/techtips-index.html`

### Option 3: Use shift-output as landing
- Create `/shift.html` as main dashboard landing
- Link from everywhere else

---

## Deployment Scripts

When deploying dashboard updates:
```bash
# Dashboard files go to ROOT /
put index.html /
put shift-output.html /
put shift-output.js /
put usage.json /

# Tech Tips files go to /techtips/
put techtips/index.html /techtips/
put techtips/style.css /techtips/
```

---

## Credentials Location
- SFTP + Database: `.kara/credentials.json`
- This map: `.kara/ionos-server-map.md`
