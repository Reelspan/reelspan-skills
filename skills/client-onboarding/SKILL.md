---
name: client-onboarding
description: Set up a new client or brand in Reelspan for an agency - create the profile, send a branded link where the client connects their own social accounts, and send posts to the client for approval. Use when the user manages social media for clients and wants to add one, get their accounts connected without sharing passwords, or have a client approve posts before they go out.
---

# Onboard a client

1. **Create the profile** (one per client or brand): `POST /v1/profiles` with
   `{"username": "acme", "display_name": "Acme Inc"}`. The username can't change later: use letters, digits, `-`, `_`.
2. **Send a connect link.** `POST /v1/connect-links` with `{"username": "acme"}` returns `access_url`, valid 48 hours.
   The client opens it, signs in to each network and connects it: no Reelspan login, no shared passwords.
   Optional: `platforms` (show only these), `redirect_url`, `language`, and on a white-label plan `logo_image`,
   `connect_title`, `connect_description`. Draft the message to the client for the user to send; don't send it
   yourself.
3. **Check what's connected:** `GET /v1/profiles/acme` shows `social_accounts` per network. Networks that use
   credentials (Telegram, Discord, Slack, Mastodon, WordPress, Dev.to, Hashnode, Bluesky…) can be connected with
   `POST /v1/accounts/{platform}` instead.
4. **Approvals.** Schedule the posts, then `POST /v1/approval-links` with
   `{"profile_username": "acme", "job_ids": [...], "title": "December posts", "expires_in_days": 7}`. The client
   approves or asks for changes on a hosted page; approved posts publish on time. `GET /v1/approval-links` shows how
   many are approved.
5. **Their own webhook** (optional): `POST /v1/profile-webhook` sends this profile's post results to the client's URL.

Keep each client's work on their own profile, and never post to a client's networks without the user's go-ahead.
