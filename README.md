# SP Intelligence — Static (Netlify) version

Static HTML + JavaScript version of the SP Intelligence news site, built
for Netlify hosting. Converted from the PHP version in
`~/workspace/sp-intelligence/` (PHP 8+ + JSON on InfinityFree) — the PHP
source is untouched; this folder is a separate, self-contained static site.

## How it works

- **No server, no build step.** Netlify publishes this folder as-is
  (`netlify.toml` sets the publish directory to the folder root).
- **Daily briefing only.** The site publishes one thing: a daily briefing
  every morning at **08:00 Dhaka time** (Asia/Dhaka, UTC+6). There are no
  10-hour / 4-hour / 2-hour sections any more — the old
  `10-ghonta.html`, `4-ghonta.html` and `2-ghonta.html` pages are minimal
  redirect pages pointing to `daily.html`.
- **All rendering is client-side.** `assets/js/app.js` fetches the live
  briefing from Firebase Realtime Database (public read on `/news/daily`
  only:
  `https://sp-intelligence-fbbf9-default-rtdb.asia-southeast1.firebasedatabase.app/news/daily.json`,
  REST endpoint, no auth needed for reading) and renders the dashboard,
  the full briefing and the archive. The local `data/daily.json` file is
  backup only — the live site fetches it only when Firebase fails, and
  shows an error banner with a retry button when both fail. Every fetch
  has an ~8s timeout (AbortController), so a stalled request never leaves
  the "লোড হচ্ছে…" placeholders up forever.
- **Admin page** — `admin.html` (Firebase Auth login, email/password)
  lets the admin add, edit and delete daily briefings and change the
  admin password. It writes straight to the same `/news/daily` node.
- **Bengali primary, English toggle** (`?lang=en`) works client-side;
  the UI strings live in `app.js`. News content itself is always Bengali
  (it comes from the briefing data).
- **Design** is the clean dashboard layout from the reference screenshot:
  glassmorphism (lavender `#F4F5FF`, Hind Siliguri), left sidebar with a
  blue brand header, slim sticky top bar with a live Dhaka clock and the
  language toggle, 3 gradient stat cards (blue / orange / green), bar
  chart + activity feed, two donut panels, numbered briefing list.
  `assets/css/style.css` and `assets/js/main.js` carry the shell;
  `assets/js/app.js` carries the data rendering.

## Dashboard shell (all pages)

Every public page uses the same dashboard shell:

- **Left sidebar** — brand + nav (হোম, দৈনিক ব্রিফিং, আর্কাইভ,
  অ্যাডমিন) with the active page highlighted. Fixed on desktop
  (≥1024px); below that it hides and opens as a slide-in drawer from
  the top-bar hamburger (Escape / backdrop click closes it).
- **Slim top bar** — hamburger (mobile/tablet only), site name, live
  Dhaka clock/date, বাংলা/English toggle.
- **Mobile bottom nav** (হোম, দৈনিক ব্রিফিং, আর্কাইভ, অ্যাডমিন).
- **Slim footer** — one quiet line: © year + site name + the
  "বাংলাদেশ সময় (UTC+6)" note.

## Dashboard homepage (`index.html`)

Decluttered morning dashboard — one idea per screen area, lots of
whitespace:

- **Heading** — "একনজরে আজকের সব খবর" with today's date in Bengali
  plus the Hijri date (labelled আনুমানিক), and the schedule line
  "প্রতিদিন সকাল ৮টায় দৈনিক ব্রিফিং".
- **3 gradient stat cards**, all computed live from the latest briefing:
  আজকের খবর (top-5 item count, blue), ব্রিফিংয়ে সূত্র (distinct
  `source_name` values in the top-5, orange), সর্বশেষ আপডেট (the latest
  briefing's published time + next briefing at 08:00, green). Each card
  links to `daily.html`.
- **Chart + activity row** (like the reference: chart panel left,
  activity feed right):
  - **Chart** — a simple horizontal bar chart of the latest briefing's
    top-5 grouped by real `category` when the items carry one, otherwise
    by `source_name` (labelled as sources) — no invented numbers.
  - **সাম্প্রতিক আপডেট** — the latest briefing's top-5, newest first by
    `published_date`, title + relative time + source link.
- **Two donut panels** — (1) the same grouping as the chart, by share;
  (2) the top-5's publication-date distribution (আজ vs আগে). When the
  date distribution would be a single slice, panel 2 shows the
  upcoming-dates list instead.
- **Briefing preview** — the latest briefing's top-5 as a numbered list
  (1–5: title + short summary + date + source link), with a link to the
  full briefing on `daily.html`.

## Pages

| Page | What it shows |
|---|---|
| `index.html` | Dashboard: 3 stat cards, chart + recent-activity feed, 2 donut panels, numbered briefing preview |
| `daily.html` | The full latest briefing: numbered top-5 (title, summary, publication date + source link each), summary, upcoming dates, Islamic note |
| `archive.html` | All past briefings from the `/news/daily` briefings array, newest first (date + top-5 titles each) |
| `10-ghonta.html`, `4-ghonta.html`, `2-ghonta.html` | Redirect pages (meta refresh + JS + plain link) to `daily.html` — kept only so old links do not 404 |
| `admin.html` | Admin editor for the daily briefing (Firebase Auth) |

## Data file

`data/daily.json` is a **backup copy only** — the live site reads from
Firebase Realtime Database (`/news/daily`, same content, same format).
It is kept in sync by the update jobs and by `fb_put.py`, so the site
can be restored from it if needed. Unlike the PHP site, the JSON file
is publicly fetchable here — there is no `data/.htaccess` blocking it
and no `data/index.php` redirect.

Shape: `{ meta: {...}, briefings: [ { id, date, published_at,
top5: [ { title, summary, source_name, source_url, published_date } x5 ],
summary, upcoming: [ { date, text } ], islamic_note } ] }`, newest
briefing first. `meta.publish_time` is `"08:00"` and `meta.next_briefing`
is the next 08:00 Dhaka time.

The old `data/10h.json`, `data/4h.json` and `data/2h.json` backup files
are still in the folder but nothing reads them any more.

## Updating the news

The live data lives in Firebase Realtime Database (project
`sp-intelligence-fbbf9`, public read on `/news`, write only when
signed in as the admin). The scheduled daily job writes there with
`~/workspace/sp-intelligence-private/fb_put.py daily <file>`
(the helper reads the database URL + secret from the private
`firebase.json` at run time — the secret is never printed and never
goes into any file in this folder). The local `data/daily.json` file is
updated first as backup, then published to Firebase. No GitHub push
is needed for a news update. Or edit the briefing by hand in
`admin.html`. The daily job prepends a briefing to the `daily` node
(reading the live node first, so admin edits are never lost).

## Deploy

The same folder deploys from the GitHub repo **spiamahmed69/sp-intelligence**
to two hosts (both auto-deploy on push to `main`, no build step):

- **Vercel (primary)** — project `sp-intelligence`, Framework "Other",
  no build command, output directory `.`:
  https://sp-intelligence-five.vercel.app
- **Netlify (backup)** — project `stunning-sprite-417203`:
  https://stunning-sprite-417203.netlify.app

Code changes (HTML/CSS/JS, `admin.html`) go out by pushing to the
GitHub repo. News updates do NOT need a push — they go straight to
Firebase and appear on the live site immediately.

## Local test

```bash
cd ~/workspace/sp-intelligence-netlify
node --check assets/js/app.js && node --check assets/js/main.js
python3 -m http.server 8000
# then open http://localhost:8000/
```
