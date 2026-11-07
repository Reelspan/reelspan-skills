# Errors and what to do

Errors answer with `{ "success": false, "message": "…", "error_code": "…" }`. Per-network failures inside a post
appear in `results` with `success: false`, `error` and `error_code`; the other networks still publish.

| HTTP | Meaning | Do |
|---|---|---|
| 400 | A field is missing or wrong (`message` says which) | Fix the field and send again |
| 401 | The API key is missing, wrong or revoked | Ask the user to check `REELSPAN_API_KEY`; never guess a key |
| 403 | The key lacks a scope, or the plan lacks the feature | Say which; the user changes the key or plan |
| 404 | No such profile, request or job | List profiles / history to find the right id |
| 409 | The same idempotency key is still being processed | Wait a few seconds and poll status |
| 413 | File too big for one request | Use the large upload flow (references/networks.md) |
| 429 | Rate or monthly upload limit | Wait `Retry-After` seconds; if it is the monthly limit, say so |
| 5xx | Reelspan or a network had a problem | Retry with the same `Idempotency-Key` |

## Common per-network failures

| What the error says | Fix |
|---|---|
| Account not connected / token expired | The user reconnects that network in the dashboard (or send a connect link: `POST /v1/connect-links`) |
| Aspect ratio / size / duration | Re-export the media to fit (references/networks.md); retry only that network |
| Caption or title too long | Shorten it for that network and retry with `fields: {"<network>_title": "…"}` |
| TikTok privacy level not allowed | Read `GET /v1/tiktok/creator-info` and use one of its `privacy_level_options` |
| Pinterest board missing | Pass `pinterest_board_id` (list or create boards) |
| Reddit subreddit missing or rule broken | Pass `reddit_subreddit`; check the subreddit's rules on flair and title |
| Duplicate content (X, Threads) | Change the text a little; networks refuse exact repeats |

Retry only what failed:

```bash
curl -s "$API/posts/retry" -H "$AUTH" -H 'Content-Type: application/json' \
  -d '{"request_id":"REQ","platforms":["instagram"],"fields":{"instagram_title":"Shorter caption"}}'
```
