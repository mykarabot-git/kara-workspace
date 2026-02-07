# Login System Architecture Plan

**Status:** Draft - Pending Approval  
**Priority:** CRITICAL (blocks sensitive project handling)  
**Estimated Build Time:** 2-3 hours

---

## Why We Need This

User handles **3+ distinct brands/personas**:
1. **Tech Tips by Melody** — Public educator, AI tutorials
2. **Magic Shop Made** — ARMY community store (BTS/ARMY culture)  
3. **Dreamwav** — Professional creative (separate entity)

**Risk:** If someone connects these brands to the same person:
- Professional credibility compromised
- Community trust broken (ARMY space values authenticity)
- Business compartmentalization fails

---

## Requirements

### Functional
- [ ] Real password authentication (hashed, not plaintext)
- [ ] Session management (tokens, expiration)
- [ ] Different access levels (admin vs read-only)
- [ ] Audit log (who logged in, when, what they accessed)
- [ ] Password reset capability

### Security
- [ ] Bcrypt password hashing (industry standard)
- [ ] HTTPS only (Ionos already has this)
- [ ] Session timeout (auto-logout after inactivity)
- [ ] Rate limiting (prevent brute force)
- [ ] No sensitive data in client-side JS

### UX
- [ ] Clean login page (matches dashboard aesthetic)
- [ ] "Remember me" option (optional)
- [ ] Clear error messages (but not too specific for security)
- [ ] Redirect to requested page after login

---

## Technical Architecture

### Option A: Ionos Database (Simple)
```
Ionos MySQL Database
├── users table (id, username, password_hash, role, created_at)
├── sessions table (token, user_id, expires_at, ip_address)
└── audit_log table (user_id, action, timestamp, ip)

PHP Backend
├── login.php (authenticate, create session)
├── logout.php (destroy session)
├── auth_check.php (verify token on every request)
└── dashboard/index.php (protected, requires auth)
```

Pros: No external services, all in Ionos  
Cons: PHP coding, maintaining database

### Option B: Supabase Auth (Modern)
```
Supabase (PostgreSQL + Auth)
├── Built-in user management
├── JWT tokens
├── Row-level security
└── Audit logs

Frontend
├── login.html (Supabase auth)
├── dashboard/ (protected routes)
└── Middleware checks token on every page
```

Pros: Industry-standard, less code, built-in security  
Cons: External dependency (but Supabase is reliable)

### Option C: Cloudflare Access (Zero Code)
```
Cloudflare Access policies
├── Identity provider (Google, GitHub, etc.)
├── Access rules by email domain or specific users
└── Zero code changes to dashboard
```

Pros: Zero build time, enterprise-grade  
Cons: Requires Cloudflare, might be overkill

---

## Recommendation

**Option B: Supabase Auth**

Reasons:
1. You already know Supabase (mentioned in USER.md)
2. Built-in auth = less code to write/maintain
3. Row-level security = can restrict what different users see
4. JWT tokens = stateless, easy to validate
5. Free tier should handle this workload

**Build Plan:**
1. Create Supabase project
2. Set up auth schema
3. Build login page
4. Add auth guards to dashboard
5. Create user account for Melody
6. Deploy

---

## Privacy Considerations

**Multi-Brand Isolation:**
- Tech Tips blog: Public, no auth needed
- Dashboard: Requires auth (private command center)
- Future: Role-based access (Dreamwav team vs Magic Shop team)

**IP/Access Logging:**
- Log but don't expose in UI
- Review periodically for unauthorized access
- Alert on suspicious patterns

---

## Questions for Melody

1. **Which option** do you prefer? (Supabase recommended)
2. **Who needs access?** Just you, or will others use the dashboard?
3. **Password preference:** Memorable phrase or random generated?
4. **2FA?** (Probably overkill for now, but worth asking)

**APPROVAL NEEDED BEFORE BUILDING**
