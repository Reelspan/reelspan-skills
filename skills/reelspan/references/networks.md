# Networks: what each takes

Network ids: `tiktok`, `youtube`, `instagram`, `facebook`, `x`, `threads`, `linkedin`, `pinterest`, `bluesky`,
`reddit`, `google_business`, `telegram`, `discord`, `slack`, `mastodon`, `nostr`, `lemmy`, `devto`, `hashnode`,
`wordpress`, `whop`, `listmonk`, and `sandbox` (accepts everything, publishes nothing).

`GET https://api.reelspan.com/platforms` (no key needed) lists every network, whether it is open, and what it takes.

## Video networks

| Network | Media | Useful fields |
|---|---|---|
| TikTok | 9:16 video, 3 s to 10 min | `privacy_level` (`PUBLIC_TO_EVERYONE`, `MUTUAL_FOLLOW_FRIENDS`, `FOLLOWER_OF_CREATOR`, `SELF_ONLY`), `post_mode=MEDIA_UPLOAD` (send to the TikTok inbox to finish in the app), `cover_url` / `cover_media_id`, `tiktok_title`. `GET /v1/tiktok/creator-info?profile_username=…` says what the account may post. Photo posts: `photo_cover_index`, `auto_add_music`, `tiktok_description` |
| YouTube | Any video; Shorts are vertical and up to 3 min | `title` is required (100 characters); `youtube_title`, `youtube_description`, `tags[]`, `privacyStatus` (`public`, `unlisted`, `private`), `thumbnail_url` / `thumbnail_media_id` |
| Instagram | Reels 9:16; photos 4:5 to 1.91:1; carousels up to 10 | `media_type` (`REELS` default, or `STORIES`), `instagram_title`. Photos and videos can mix in a carousel |
| Facebook | Page posts, Reels and Stories | `facebook_media_type` (Reel by default, or `STORIES`), `facebook_title`, `facebook_link` for text posts |
| X | Video up to 2:20, 4 photos | `x_title`. Text over 280 characters becomes a thread |
| Threads | 500 characters per post; carousels up to 20 | Long text becomes a thread |
| LinkedIn | Video, photos, text, PDF documents | Company pages: `GET /v1/linkedin/pages?profile_username=…` |
| Pinterest | Video or photos, one shape per carousel | `pinterest_board_id` (from `GET /v1/pinterest/boards?profile_username=…`, or create one with `POST /v1/pinterest/boards`), `pinterest_link`, `description` (500 characters) |
| Bluesky | Video up to 100 MB, 4 photos, 300 characters per post | `bluesky_compress=true` shrinks a bigger video. Long text becomes a thread |
| Reddit | Video, photos, text | `reddit_subreddit` (required), `reddit_flair_id`, `title` |
| Google Business | Photos and text updates | `google_business_location_id` when the account has several |

## Text and community networks

| Network | Notes |
|---|---|
| Mastodon, Nostr, Lemmy | Text, photos, video; Lemmy posts to the community set when it was connected (`lemmy_title`, `lemmy_nsfw`) |
| Discord, Slack, Telegram | Posts to the connected channel or chat; Telegram takes PDFs too |
| Dev.to, Hashnode, WordPress | Articles: `title` is the headline, `description` the body (Markdown); Hashnode keeps up to 5 tags |
| Whop, Listmonk | Community post and newsletter campaign |

## Per-network overrides

Most fields take a network prefix to override the shared one for that network only:
`tiktok_title`, `instagram_title`, `x_title`, `youtube_title`, `linkedin_title`, `{platform}_first_comment`,
`{platform}_alt_text`, `pinterest_photos[]` (a different crop for Pinterest), `instagram_photo_media_ids[]`.

## Big files

Files under about 90 MB can go in the post itself. Bigger ones: `POST /v1/media/uploads` returns signed part URLs; PUT
each part, then `POST /v1/media/uploads/{media_id}/complete` with the ETags, and post with `video_media_id`. The
official SDKs (`npm install reelspan`, `pip install reelspan`) do this for you.
