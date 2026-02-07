# Session Logging Protocol

**Purpose:** Prevent information loss on memory compaction/restart  
**Trigger:** Write every 15 minutes during active work, or after significant actions  

---

## Log Locations

```
logs/
├── activity/
│   └── YYYY-MM-DD.md (daily summary, human readable)
├── sessions/
│   └── YYYY-MM-DD-HH-MM.session (current session state)
└── recovery/
    └── latest-state.json (machine-readable, quick restore)
```

---

## What Gets Logged

### Every 15 Minutes (Auto)
- Current task in progress
- Files being edited
- Deployment status
- Errors encountered
- User instructions pending

### After Significant Actions (Immediate)
- Git commits
- Deployments
- File deletions
- Configuration changes
- New project creation

### On User Instruction (Immediate)
- Explicit tasks assigned
- Decisions made
- Context provided
- Warnings given

---

## Format

### Session Files (.session)
```markdown
# Session Log - 2026-02-07 11:15 PST

## Current Task
Investigating login system architecture for dashboard security

## Active Files
- /projects/dashboard/index.html (editing)
- /AUTH_SYSTEM_PLAN.md (writing)

## User Context
- Concerned about multi-brand privacy (Dreamwav/Magic Shop/Tech Tips)
- Wants real authentication, not client-side JS lock
- Also wants better session logging (this system!)

## Pending Actions
- [ ] Get approval on auth system plan
- [ ] Start building if approved
- [ ] Update blog index if needed

## Blockers
- Need user decision on auth approach

## Last User Message
"Since we are going to be handling sensitive projects... we should probably create an actual login system"
```

### Recovery Files (.json)
```json
{
  "timestamp": "2026-02-07T11:15:00-08:00",
  "current_task": "Planning login system",
  "edited_files": ["..."],
  "user_context_summary": "Wants real auth + better logging",
  "pending_decisions": ["Which auth option?"],
  "last_5_messages": ["..."]
}
```

---

## Recovery Procedure

If reset/compacted:

1. **Read** `logs/activity/YYYY-MM-DD.md` for daily context
2. **Read** `logs/sessions/latest.session` for immediate state  
3. **Check** `logs/recovery/latest-state.json` for machine-readable data
4. **Verify** with user what was lost
5. **Resume** from last logged checkpoint

---

## Automation

This should be automatic via:
- Cron job every 15 min during active hours
- Post-action hooks on git commit, deployment, etc.
- Explicit call when user gives complex instructions

---

**STATUS:** Protocol defined, awaiting implementation approval
