---
name: reelspan
description: Publish, schedule and track social media posts with the Reelspan API (TikTok, YouTube, Instagram, Facebook, X, Threads, LinkedIn, Pinterest, Bluesky, Reddit and more). Use when the user wants to post or schedule a video, photos, a carousel, text or a PDF to social networks, check whether a post went out, retry a failed post, see scheduled posts or post history, or read social analytics through Reelspan.
---

# Reelspan

Reelspan publishes one post to many networks with one call, then reports each network's result. A **profile**
(the `user` field) is one brand or client with its own connected accounts.

## Pick the route

1. **Reelspan MCP tools available** (names like `upload_video`, `list_profiles`, `upload_status`)? Use them. They
   take the same fields as the API below.
2. Otherwise call the REST API with `curl`, using `REELSPAN_API_KEY` from the environment. Never print the key and
   never ask the user to paste it into the chat; if it is missing, tell them to create one in the dashboard
   (**API keys**) and export it.

```bash
API=https://api.reelspan.com/v1
AUTH="Authorization: Bearer $REELSPAN_API_KEY"
curl -s "$API/me" -H "$AUTH"            # check the key: plan and usage
curl -s "$API/profiles" -H "$AUTH"      # profiles and their connected networks
```

## The flow

1. **Find the profile.** List profiles; use the one the user named, or ask if there are several. Post only to
   networks that profile has connected.
2. **Check the media fits** each network (see [references/networks.md](references/networks.md)): TikTok and Reels
   want 9:16 video; Instagram photos 4:5 to 1.91:1; YouTube needs a title; X text is 280 characters per post (longer
   becomes a thread).
3. **Publish** with `async_upload=true`, so the call returns a `request_id` at once.
4. **Poll** `GET /v1/posts/status?request_id=…` every 5 seconds until `status` is `completed`, `failed` or
   `cancelled`. Report each network's link, and each failure with its `error_code`.
5. **Fix failures** with `POST /v1/posts/retry` (only the failed networks are sent again, with the media Reelspan
   already has), changing fields if the error says so. See the `fix-failed-posts` skill.

## Publish

```bash
# a video (local file or a public URL; Drive and Dropbox share links work)
curl -s "$API/posts/video" -H "$AUTH" -H "Idempotency-Key: $(uuidgen)" \
  -F user=acme -F 'platform[]=tiktok' -F 'platform[]=youtube' -F 'platform[]=instagram' \
  -F title="How we make it, in 30 seconds" -F video=@clip.mp4 -F async_upload=true

# photos or a carousel, in order, with alt text
curl -s "$API/posts/photos" -H "$AUTH" -F user=acme -F 'platform[]=instagram' -F 'platform[]=linkedin' \
  -F title="Before and after" -F 'photos[]=@before.jpg' -F 'photos[]=@after.jpg' \
  -F 'alt_text[]=The old kitchen' -F 'alt_text[]=The new kitchen' -F async_upload=true

# text (JSON); long text becomes a thread on X and Bluesky
curl -s "$API/posts/text" -H "$AUTH" -H 'Content-Type: application/json' \
  -d '{"user":"acme","platform":["x","threads","bluesky","linkedin"],"title":"We shipped dark mode.","async_upload":true}'

# a PDF to LinkedIn as a swipeable document
curl -s "$API/posts/document" -H "$AUTH" -F user=acme -F 'platform[]=linkedin' -F title="Q3 in 10 slides" -F document=@deck.pdf
```

Always send an `Idempotency-Key` header (any unique string) on posts: repeating the call with the same key never
publishes twice.

### Common fields

| Field | |
|---|---|
| `title` | The caption (and the YouTube title). Per network: `tiktok_title`, `instagram_title`, `x_title`, `youtube_title`… |
| `description` | Longer text where the network has one (YouTube, Pinterest, Reddit) |
| `scheduled_date` + `timezone` | Publish later: `2026-12-01T09:00` + `America/New_York`. Answers 202 with a `job_id` |
| `add_to_queue=true` | Take the profile's next free queue slot instead of a time |
| `first_comment` | Posted right after the post (a reply on X, Bluesky and Threads) |
| `repeat_every` + `repeat_times` | The same post every day, week or month, 2-30 times |
| `external_id` | Your own id, echoed in webhooks and history |

Network settings (TikTok privacy, Pinterest board, subreddit…) are in [references/networks.md](references/networks.md).
Upload-Post field names are accepted too.

## After posting

```bash
curl -s "$API/posts/status?request_id=REQ" -H "$AUTH"                     # per network results
curl -s "$API/posts?limit=20&status=failed" -H "$AUTH"                     # history
curl -s "$API/scheduled?profile_username=acme" -H "$AUTH"                  # scheduled posts
curl -s -X PATCH "$API/scheduled/JOB" -H "$AUTH" -H 'Content-Type: application/json' -d '{"scheduled_date":"2026-12-02T10:00:00Z"}'
curl -s -X DELETE "$API/scheduled/JOB" -H "$AUTH"                          # cancel (refunds the upload credits)
curl -s "$API/post-analytics/REQ" -H "$AUTH"                               # how one post did
curl -s "$API/analytics/acme" -H "$AUTH"                                   # account totals per network
curl -s "$API/best-times/acme?timezone=Europe/Berlin" -H "$AUTH"           # best hours, from their own results
```

Errors and what to do about each: [references/errors.md](references/errors.md). Every endpoint:
[references/api.md](references/api.md) or `https://api.reelspan.com/openapi.json`.

## Rules

- Confirm with the user before publishing or cancelling anything, showing the profile, networks, caption, media and
  time. Scheduling counts as publishing.
- Write each network's caption in its own voice when the user asks for it (or use `POST /v1/ai/adapt-captions`).
- Never invent links or results: report what the status endpoint returned.
- Use the `sandbox` network to test a flow without publishing anything.
