# Ionos Server Map

**Updated:** 2026-02-07 (FIXED - Single Source of Truth)
**SFTP Access:** access-5019100086.webspace-host.com (user: a173078)

---

## Domain → Folder Mapping

| Domain | Serves Folder | Status | Purpose |
|--------|--------------|--------|---------|
| `mykarabot.info` | `/dashboard/` | ✅ **FIXED** | KARA Command Dashboard |
| `mykarabot.online` | `/techtips/` | ✅ OK | Tech Tips by Melody |
| `mykarabot.org` | `/knowledge/` | ✅ OK | Knowledge Base |
| `shop.mykarabot.online` | `/store/` | ✅ OK | Digital Products Shop |

---

## ⚠️ SINGLE SOURCE OF TRUTH

After cleanup, dashboard has **ONE** local location:

- ✅ **`/projects/dashboard/`** — Main dashboard files (v1.1.0, inline styles/JS)
- ❌ ~~`/dashboard/`~~ — **DELETED** (was old v1.2.0 with lock screen)

**NEVER create `/dashboard/` at root again.**

---

## Current /dashboard/ Contents (Server)

```
/dashboard/
├── .htaccess           (rewrite rules)
├── index.html          ← Main dashboard (v1.1.0, 17,232 bytes)
├── shift-output.html   ← Shift Output page (43,241 bytes)
├── shift-output.js     ← Shift Output functionality (7,268 bytes)
├── usage.json          ← Model usage data (550 bytes)
├── kanban.html         ← Kanban board
├── vault.html          ← Secure vault
├── favicon.svg         
├── data.json           ← Kanban data
├── data.json.bak       
├── TAG_GUIDE.md
└── api.php             ← Backend API
```

**Note:** New dashboard is self-contained (inline Tailwind + JS). No separate CSS/JS files needed.

---

## Deploying Dashboard Updates

```bash
# ONLY from /projects/dashboard/  
put index.html dashboard/
put shift-output.html dashboard/
put shift-output.js dashboard/
put usage.json dashboard/
```

**Wrong paths (DO NOT USE):**
- ~~`put index.html /`~~ 
- ~~`put dashboard/index.html dashboard/`~~ (extra folder)

---

## Local → Server Mapping

| Local File | Deploys To | Purpose |
|------------|-----------|---------|
| `/projects/dashboard/index.html` | `/dashboard/index.html` | Main dashboard |
| `/projects/dashboard/shift-output.html` | `/dashboard/shift-output.html` | Shift work review |
| `/projects/dashboard/shift-output.js` | `/dashboard/shift-output.js` | Shift functionality |
| `/dashboard/usage.json` | `/dashboard/usage.json` | Usage data (generated) |

---

## Version History

| Version | Location | Features | Status |
|---------|----------|----------|--------|
| v1.2.0 | ~~`/dashboard/`~~ | Lock screen, separate JS/CSS | ❌ DELETED |
| v1.1.0 | `/projects/dashboard/` | Usage tracker, Shift Output, inline | ✅ CURRENT |

---

## Credentials
- SFTP + Database: `.kara/credentials.json`
- This map: `.kara/ionos-server-map.md`
