---
name: repurpose-video
description: Turn one video into native posts for TikTok, YouTube Shorts, Instagram Reels, Facebook, LinkedIn, X and Pinterest with Reelspan, each with its own caption and settings. Use when the user has a video (file or link) and wants it published or scheduled across several networks, or wants captions written for each network from the video.
---

# Repurpose one video everywhere

## Steps

1. **Check the video.** Note duration, aspect ratio and size (for a local file:
   `ffprobe -v error -show_entries stream=width,height:format=duration,size -of json clip.mp4`).
   - 9:16 and up to 60 s: fits TikTok, Shorts, Reels, Facebook Reels, X, LinkedIn, Pinterest, Bluesky.
   - 16:9: YouTube (not a Short), LinkedIn, X, Facebook. Ask before cropping for vertical networks.
   - Over 100 MB: Bluesky needs `bluesky_compress=true`. Over about 90 MB, upload it once first (`POST
     /v1/media/upload`, or the large upload flow) and post with `video_media_id`.
2. **Upload once, reuse.** `POST /v1/media/upload` with the file returns a `media_id`; use it for captions and for the
   post, so the video is sent only once.
3. **Captions per network.** Write them yourself, or let Reelspan read the video:
   `POST /v1/ai/adapt-captions` with `{"media_id": "…", "platforms": [...], "notes": "what the user wants said"}`
   (one AI credit) returns a caption per network. Shape them:
   - TikTok: a hook in the first line, 3-5 hashtags, under 150 characters works best.
   - YouTube: `youtube_title` (under 70 characters, searchable) and `youtube_description` with links.
   - Instagram: a hook, short paragraphs, hashtags at the end.
   - LinkedIn: a first line that earns the "see more", no walls of hashtags.
   - X: one sentence, under 280 characters.
4. **Show the plan** (networks, each caption, the time) and get a yes.
5. **Publish once for all networks** with per-network fields:

```bash
curl -s "$API/posts/video" -H "$AUTH" -H "Idempotency-Key: repurpose-$(date +%s)" \
  -F user=acme -F video_media_id=MEDIA \
  -F 'platform[]=tiktok' -F 'platform[]=youtube' -F 'platform[]=instagram' -F 'platform[]=linkedin' \
  -F title="Default caption" -F tiktok_title="…" -F youtube_title="…" -F youtube_description="…" \
  -F instagram_title="…" -F linkedin_title="…" -F privacy_level=PUBLIC_TO_EVERYONE -F async_upload=true
```

6. **Poll status** and give the user every link; retry failures with the `fix-failed-posts` skill.
