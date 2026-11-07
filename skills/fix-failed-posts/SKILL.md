---
name: fix-failed-posts
description: Find out why a Reelspan post failed on some networks, fix it, and retry only those networks. Use when a post shows failed networks, the user says a post didn't go out, a status shows errors, or history has failed rows.
---

# Fix failed posts

1. **Find what failed.** With a request id: `GET /v1/posts/status?request_id=…`. Without one:
   `GET /v1/posts?status=failed&limit=20` (add `profile_username`). Group the failures by `error_code`.
2. **Read the cause** from `error` / `error_code` and the table in the `reelspan` skill's
   [errors reference](../reelspan/references/errors.md). The usual ones:
   - not connected, or the token expired: the user reconnects that network (send a connect link if it is a client's
     account: `POST /v1/connect-links`);
   - the media doesn't fit (ratio, size, duration): re-export it; for Bluesky over 100 MB set `bluesky_compress=true`;
   - the caption is too long, or a duplicate: shorten or vary it for that network;
   - a required setting is missing (Pinterest board, subreddit, a TikTok privacy level the account allows).
3. **Explain it in one line per network**, with the fix you propose. Ask before changing the caption or media.
4. **Retry only those networks**, with the changed fields:

```bash
curl -s "$API/posts/retry" -H "$AUTH" -H 'Content-Type: application/json' \
  -d '{"request_id":"REQ","platforms":["instagram","pinterest"],"fields":{"instagram_title":"Shorter caption","pinterest_board_id":"123"}}'
```

5. **Poll status** again and report the result. If the same error comes back, stop and say what the user needs to do
   (reconnect, add a scope, change the media); don't loop.

A failure that needs the network's own app review or a missing permission can't be fixed by retrying: say so plainly.
