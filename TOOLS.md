# TOOLS.md - Local Notes

## Browser Access (CRITICAL)
**I HAVE FULL BROWSER ACCESS.**
- **Internal Browser**: `profile="openclaw"` (Use this for local file testing, checking docs, taking snapshots).
- **External Relay**: `profile="chrome"` (Use this if the user asks to control their active Chrome window).
- **Never ask if I can browse.** I can. Just do it.

## AI Models

### Primary
- **Opus 4.5** (`anthropic/claude-opus-4-5-20251101`): Default. Deep reasoning, complex tasks.
- **Sonnet 4.5** (`anthropic/claude-sonnet-4-5-20250929`): Fast, smart, reliable.

### Specialized Use Cases
- **Coding**: `openrouter/openai/gpt-5.1-codex` (alias: Codex) — Use for all coding tasks
- **Web Search**: `google-antigravity/gemini-3-pro-high` (alias: Gemini Pro High)
- **Social Search**: `openrouter/x-ai/grok-4` (alias: Grok) — Use for X/Twitter and social context

### Fallbacks (via Antigravity)
- `google-antigravity/gemini-3-pro-high` ✅
- `google-antigravity/gemini-3-pro-low` ✅
- `google-antigravity/gemini-3-flash` ✅ (also used for heartbeats)

### Via OpenRouter
- `openrouter/openai/gpt-5.2-codex` (Codex 5.2) ✅
- `openrouter/x-ai/grok-4-fast` (Grok Fast) ✅

## Cameras & Environment
- (None currently paired)

## Workspace
- Root: `/home/kara/.openclaw/workspace`
- Projects: `projects/`
- Dashboard: https://mykarabot-git.github.io/kara-workspace/dashboard/
- Blog: https://mykarabot-git.github.io/kara-workspace/projects/tech-tips/blog/
