---
name: analyze-performance
description: Analyze how a profile's social posts performed with Reelspan analytics and turn it into a short report - what to post more of, when to post, and what to drop. Use when the user asks how their posts or accounts are doing, which posts worked best, follower growth, the best time to post, or for a weekly or monthly social media report.
---

# Analyze performance

## Gather

| Question | Call |
|---|---|
| Totals per network (followers, views, posts) | `GET /v1/analytics/{profile}` |
| Day by day (growth, spikes) | `GET /v1/analytics/{profile}/history?days=30` |
| A period's report: posts, interactions, follower growth, top posts | `GET /v1/reports/{profile}?days=30` |
| One post's numbers | `GET /v1/post-analytics/{request_id}` |
| What was posted | `GET /v1/posts?profile_username={profile}&limit=100` |
| When to post | `GET /v1/best-times/{profile}?timezone=…` |

## Write the report

Keep it short and specific to their numbers:

1. **Headline**: the one change that matters most (e.g. "TikTok views up 40% in 30 days, driven by 3 tutorial clips").
2. **Per network**: followers and the change, views or reach, engagement rate (interactions ÷ views) where both exist.
3. **Top 3 and bottom 3 posts** and what each group has in common (format, length, hook, topic, time of day).
4. **Best times** from `best-times`, in the user's timezone.
5. **Three actions** for the next period, each tied to a number above.

Rules: say when a network has too little data to judge (fewer than 5 posts, or a day of history). Compare each network
with its own past, not networks with each other by raw views. Never invent numbers; if a call fails, say which part is
missing.

Offer to turn the actions into a schedule with the `schedule-campaign` skill.
