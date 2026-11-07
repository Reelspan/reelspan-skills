---
name: schedule-campaign
description: Plan and schedule a series of social posts with Reelspan (a launch week, a month of content, a recurring tip) at the profile's best times or in its queue. Use when the user wants several posts spread over days or weeks, a content calendar turned into scheduled posts, or a weekly/monthly repeating post.
---

# Schedule a campaign

Turns a plan into scheduled Reelspan posts, at times that work for this audience. Uses the `reelspan` skill for the
calls (MCP tools if connected, otherwise curl with `REELSPAN_API_KEY`).

## Steps

1. **Profile and networks.** List profiles; pick the one the user means. Use only connected networks.
2. **When.** Ask for the timezone if you don't know it. Then pick times, best first:
   - `GET /v1/best-times/{profile}?timezone=…` gives the hours and weekdays that did best for this profile. Use them
     when it has enough history.
   - Otherwise the profile's queue: `GET /v1/queue/preview?profile_username=…&count=N` shows the next free slots;
     posting with `add_to_queue=true` takes the next one.
   - Otherwise sensible defaults: weekdays 9:00-11:00 and 18:00-20:00 local, never two posts on one network within 3 h.
3. **Draft the calendar** as a table (date, time, networks, caption, media) and show it to the user. Vary the hook of
   each post; don't repeat a caption word for word on X or Threads (they refuse duplicates).
4. **On approval, schedule each post** with `scheduled_date` + `timezone` (one call per post; each answers 202 with a
   `job_id`). Send an `Idempotency-Key` per post, e.g. `campaign-<name>-<n>`, so a rerun never doubles them.
5. **The same post on repeat** (a weekly tip): one call with `repeat_every=week` and `repeat_times=N` (2-30).
6. **Report** the job ids and times; `GET /v1/scheduled?profile_username=…` shows them all.

## Changing the plan later

- Move one: `PATCH /v1/scheduled/{job_id}` with `scheduled_date` (and `timezone`), or a new `title`.
- Drop one: `DELETE /v1/scheduled/{job_id}`; add `?series=rest` to drop the rest of a repeating series.
- A client must sign off first? Create an approval link: `POST /v1/approval-links` with the `job_ids`; posts wait
  until approved (see `client-onboarding`).

Confirm the whole calendar with the user before scheduling anything.
