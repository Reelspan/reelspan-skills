# Reelspan skills and plugin

Agent skills for [Reelspan](https://reelspan.com): publish, schedule and track posts on TikTok, YouTube, Instagram,
Facebook, X, Threads, LinkedIn, Pinterest, Bluesky, Reddit and 12 more networks from Claude Code, Claude, Codex,
Cursor, Gemini CLI or any agent that reads `SKILL.md` files.

This one repository is:

- an **Agent Skills** bundle (`skills/`), for any agent that supports the open SKILL.md format;
- a **Claude Code plugin** with its own marketplace: the skills, two subagents, and Reelspan's hosted MCP server;
- a **Gemini CLI extension** with the same MCP server.

## Install

### Claude Code (plugin: skills + agents + MCP)

```text
/plugin marketplace add Reelspan/reelspan-skills
/plugin install reelspan@reelspan
```

The plugin connects Reelspan's MCP server (`https://api.reelspan.com/mcp`); Claude Code asks you to sign in to
Reelspan the first time a tool runs. Prefer an API key? Skip the sign-in and export `REELSPAN_API_KEY`: the skills
fall back to the REST API.

### Skills only (any agent)

```bash
npx skills add Reelspan/reelspan-skills
```

Or copy the folders in `skills/` into your agent's skills directory (`~/.claude/skills/`, `.claude/skills/`,
`~/.codex/skills/`…). Set `REELSPAN_API_KEY` (dashboard → **API keys**).

### Gemini CLI

```bash
gemini extensions install https://github.com/Reelspan/reelspan-skills
```

## What's inside

| Skill | Use it to |
|---|---|
| [`reelspan`](skills/reelspan/SKILL.md) | Publish video, photos, text or PDFs; check status; history; scheduled posts. Networks reference and error guide included |
| [`schedule-campaign`](skills/schedule-campaign/SKILL.md) | Turn a plan into scheduled posts at the profile's best times or in its queue |
| [`repurpose-video`](skills/repurpose-video/SKILL.md) | One video to TikTok, Shorts, Reels, LinkedIn, X… with captions written for each |
| [`analyze-performance`](skills/analyze-performance/SKILL.md) | A short report from the profile's own analytics, with three next actions |
| [`fix-failed-posts`](skills/fix-failed-posts/SKILL.md) | Find why networks failed and retry only those, with fixes |
| [`client-onboarding`](skills/client-onboarding/SKILL.md) | Agencies: a profile per client, a connect link, approvals |
| [`announce-release`](skills/announce-release/SKILL.md) | Announce a release or changelog on every network |

| Agent | |
|---|---|
| [`content-strategist`](agents/content-strategist.md) | Plans content from the profile's analytics and drafts a two-week calendar |
| [`post-debugger`](agents/post-debugger.md) | Investigates failed posts and proposes the exact retry, changing nothing |

Every skill asks before it publishes, schedules or cancels anything.

## Try

- *"Post clip.mp4 to TikTok, Reels and Shorts for acme tomorrow at 9am Berlin time, with a caption for each."*
- *"How did acme's posts do this month? What should we post more of?"*
- *"Why did yesterday's post fail on Instagram? Fix it."*
- *"Plan two weeks of LinkedIn and X posts from our changelog and schedule them at our best times."*

## Develop

```bash
node scripts/validate.mjs   # frontmatter, names, links, manifests
```

Links: [API reference](https://reelspan.com/docs) · [MCP server](https://github.com/Reelspan/reelspan-mcp) ·
[CLI](https://github.com/Reelspan/reelspan-cli)

MIT licensed. Security reports: see [SECURITY.md](SECURITY.md).
