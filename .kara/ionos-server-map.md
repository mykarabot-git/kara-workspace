# Ionos Server Map

**Updated:** 2026-02-07 (Fixed)
**SFTP Access:** access-5019100086.webspace-host.com (user: a173078)

---

## ✅ CORRECT Domain → Folder Mapping

| Domain | Serves Folder | Status | Purpose |
|--------|--------------|--------|---------|
| `mykarabot.info` | `/dashboard/` | ✅ Ready | KARA Command Dashboard |
| `mykarabot.online` | `/techtips/` | ✅ Ready | Tech Tips by Melody |
| `mykarabot.org` | `/knowledge/` | ✅ Ready | Knowledge Base |
| `shop.mykarabot.online` | `/store/` | ✅ Ready | Digital Products Shop |

---

## Folder Structure

```
/ (SFTP Root) - Keep clean, no index files here
├── logs/
│
├── dashboard/           ← mykarabot.info (KARA Command)
│   ├── index.html       ← Main dashboard (NEW version with usage tracker)
│   ├── shift-output.html ← Shift Output review page
│   ├── shift-output.js
│   ├── usage.json       ← Model usage data
│   ├── kanban.html      ← Kanban board
│   ├── vault.html       ← Secure vault
│   ├── api.php          ← Backend API
│   ├── app.js
│   ├── style.css
│   ├── data.json        ← Kanban data
│   └── ...
│
├── techtips/            ← mykarabot.online (Tech Tips)
│   ├── index.html       ← Tech Tips homepage
│   ├── style.css
│   ├── shop.html
│   ├── about.html
│   ├── tools.html
│   └── blog/
│
├── store/               ← shop.mykarabot.online
│   ├── index.html       ← Shop homepage
│   ├── style.css
│   └── favicon.svg
│
└── knowledge/           ← mykarabot.org
    └── index.html       ← Knowledge base placeholder
```

---

## Deployment Rules

**NEVER put files in root (/).** Always deploy to correct subfolder:

| What You're Deploying | Destination Folder |
|----------------------|-------------------|
| Dashboard updates | `/dashboard/` |
| Shift Output page | `/dashboard/` |
| Tech Tips content | `/techtips/` |
| Shop products | `/store/` |
| Knowledge articles | `/knowledge/` |

---

## Deployment Commands

```bash
# Dashboard files
put index.html dashboard/
put shift-output.html dashboard/
put shift-output.js dashboard/
put usage.json dashboard/

# Tech Tips
put techtips/index.html techtips/
put techtips/style.css techtips/

# Shop
put store/index.html store/
```

---

## Current Files (Verified 2026-02-07)

| File | Location | Size | Status |
|------|----------|------|--------|
| index.html | /dashboard/ | 17,232 bytes | ✅ NEW dashboard |
| index.html | /techtips/ | 5,294 bytes | ✅ Tech Tips |
| index.html | /store/ | 5,877 bytes | ✅ Shop placeholder |
| index.html | /knowledge/ | 884 bytes | ✅ Knowledge placeholder |

---

## Credentials
- SFTP + Database: `.kara/credentials.json`
- This map: `.kara/ionos-server-map.md`
