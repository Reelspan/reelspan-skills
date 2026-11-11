# API reference (summary)

Base URL `https://api.reelspan.com`, auth `Authorization: Bearer <API key>`. Full spec: `https://api.reelspan.com/openapi.json`.

| Method | Path | What it does |
|---|---|---|
| GET | `/v1/me` | Check the API key and read the account plan and usage |
| GET | `/v1/webhook` | Read the account webhook settings |
| POST | `/v1/webhook` | Set the account webhook |
| DELETE | `/v1/webhook` | Remove the account webhook |
| POST | `/v1/webhook/secret` | Rotate the account webhook signing secret |
| POST | `/v1/webhook/test` | Send a test event to the account webhook |
| GET | `/v1/profile-webhook` | Read a profile’s own webhook |
| POST | `/v1/profile-webhook` | Set a profile’s own webhook (sent in addition to the account webhook) |
| DELETE | `/v1/profile-webhook` | Remove a profile’s webhook |
| GET | `/v1/webhook/deliveries` | Recent webhook deliveries with their status |
| POST | `/v1/webhook/deliveries/{id}/redeliver` | Send a delivery again |
| POST | `/v1/connect-links` | Create a hosted connect link for a profile |
| GET | `/v1/connect-links/validate` | Check a connect token (send it as Bearer) |
| POST | `/v1/oauth/{platform}/start` | Start an OAuth connection (Connect API) |
| POST | `/v1/profiles` | Create a profile |
| GET | `/v1/profiles` | List profiles and their connected accounts |
| DELETE | `/v1/profiles` | Delete a profile and disconnect all its accounts |
| GET | `/v1/profiles/{username}` | Get one profile |
| PATCH | `/v1/profiles/{username}` | Change a profile’s display name |
| POST | `/v1/accounts/{platform}` | Connect a network with credentials |
| DELETE | `/v1/accounts` | Disconnect one network from a profile |
| GET | `/v1/posts/status` | Status of a publish request, per platform |
| GET | `/v1/posts` | Upload history, one row per platform post |
| GET | `/v1/scheduled` | List scheduled posts |
| GET | `/v1/scheduled/{job_id}` | Get a scheduled post |
| PATCH | `/v1/scheduled/{job_id}` | Reschedule or edit a scheduled post |
| DELETE | `/v1/scheduled/{job_id}` | Cancel a scheduled post and refund its upload credits |
| GET | `/v1/queue/settings` | Read a profile’s queue: posting slots, days and capacity |
| POST | `/v1/queue/settings` | Set a profile’s queue |
| GET | `/v1/queue/preview` | Upcoming queue slots and how full they are |
| GET | `/v1/queue/next-slot` | The next slot with room |
| POST | `/v1/queue/slot-full` | Mark a slot as full |
| DELETE | `/v1/queue/slot-full` | Open a slot that was marked full |
| POST | `/v1/posts/retry` | Retry the platforms that failed |
| GET | `/v1/facebook/pages` | Facebook Pages connected to a profile |
| GET | `/v1/pinterest/boards` | Pinterest boards of a profile’s account |
| POST | `/v1/pinterest/boards` | Create a Pinterest board on a profile’s account |
| GET | `/v1/tiktok/creator-info` | What a TikTok account may post: privacy levels, interactions and its longest video |
| GET | `/v1/linkedin/pages` | LinkedIn company pages a profile can post as |
| POST | `/v1/ai/adapt-captions` | Write captions for each network from whatever the post has |
| POST | `/v1/ai/rewrite-captions` | Adapt existing captions to each network |
| GET | `/v1/library` | The media library, newest first |
| POST | `/v1/library` | Keep uploaded media in the library |
| POST | `/v1/library/import` | Import a file into the library from a link |
| DELETE | `/v1/library/{media_id}` | Take media out of the library |
| GET | `/v1/library/{media_id}/file` | Download a library file (redirects to a short-lived link) |
| POST | `/v1/approval-links` | Send scheduled posts to a client for approval |
| GET | `/v1/approval-links` | Approval links, newest first, with how many posts are approved |
| DELETE | `/v1/approval-links/{id}` | Delete a link: its posts stop waiting and publish as scheduled |
| GET | `/v1/reports/{profile_username}` | A period’s report: posts, interactions, follower growth and top posts |
| GET | `/v1/best-times/{profile_username}` | Best hours and weekdays to post, from your own results |
| GET | `/v1/analytics/{profile_username}` | Account totals per network (followers, views, posts…) |
| GET | `/v1/analytics/{profile_username}/history` | Account numbers per day (followers, views…) |
| GET | `/v1/post-analytics/{request_id}` | Stats for the posts of one publish request |
| POST | `/v1/posts/photos` | Publish one photo or a carousel |
| POST | `/v1/posts/document` | Publish a PDF document to LinkedIn |
| POST | `/v1/posts/text` | Publish a text-only post |
| POST | `/v1/media/uploads` | Start a large upload straight to storage (files over 100 MB) |
| POST | `/v1/media/uploads/{media_id}/complete` | Finish a large upload; the stored file is checked (size, type) before it can be used |
| POST | `/v1/media/upload` | Upload a video or photo once, to publish or write captions from later |
| POST | `/v1/posts/video` | Publish a video to one or more networks |
