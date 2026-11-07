---
name: announce-release
description: Announce a software release, changelog or product update on social networks with Reelspan - X, LinkedIn, Bluesky, Threads, Mastodon, Discord, Slack, Dev.to and more - with a post written for each. Use when the user ships a version, publishes release notes or a blog post, and wants it announced.
---

# Announce a release

1. **Read the source**: the release notes, the changelog section, the merged PRs or the blog post. Pull out the one
   change users care about most, then two or three more.
2. **Write for each network** (show all drafts together for approval):
   - X, Bluesky, Threads: the headline change and the link; a short thread only if there is a real story.
   - LinkedIn: why it matters to the reader's work, 3-5 short lines, the link last.
   - Mastodon: like X, with 1-3 hashtags (people follow tags there).
   - Discord, Slack, Telegram: a friendly note with bullet points and the link.
   - Dev.to, Hashnode: a full article only if the user wants one (`title` + Markdown body in `description`).
   - A demo video or screenshots? Use a video or photo post instead of text on X, LinkedIn and Bluesky.
3. **Publish** with one text call for the text networks (`POST /v1/posts/text`) and an `Idempotency-Key` like
   `release-v2.4.0`, so it can't be announced twice. Set `external_id` to the version to find it later.
4. **Report the links** from the status. Offer a follow-up post a few days later with `schedule-campaign`.

To announce every GitHub release automatically, the
[Reelspan GitHub Action](https://github.com/Reelspan/reelspan-action) does this from a workflow.
