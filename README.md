# SP Intelligence — Static (Netlify) version

Static HTML + JavaScript version of the SP Intelligence news site, built
for Netlify hosting. Converted from the PHP version in
`~/workspace/sp-intelligence/` (PHP 8+ + JSON on InfinityFree) — the PHP
source is untouched; this folder is a separate, self-contained static site.

## How it works

- **No server, no build step.** Netlify publishes this folder as-is
  (`netlify.toml` sets the publish directory to the folder root).
- **All rendering is client-side.** `assets/js/app.js` fetches the live
  news from Firebase Realtime Database (public read on `/news`:
  `news/10h`, `news/4h`, `news/2h`, `news/daily`) and renders the news
  cards, daily briefing cards, freshness strips, "next update" times and
  empty states — the same markup and Bengali date format the PHP
  `includes/cards.php` / `includes/functions.php` produced. The local
  `data/*.json` files are backup only; the live site never fetches them.
- **Admin page** — `admin.html` (Firebase Auth login, email/password)
  lets the admin add, edit and delete news in every section and change
  the admin password. It writes straight to the same `/news` nodes.
- **Bengali primary, English toggle** (`?lang=en`) works client-side;
  the UI strings in `app.js` are an exact copy of the PHP
  `includes/lang.php`. News content itself is always Bengali (it comes
  from the JSON files).
- **Design** is the same glassmorphism (lavender `#F4F5FF`, Hind
  Siliguri) — `assets/css/style.css` and `assets/js/main.js` are copied
  from the PHP site and extended for the dashboard layout.

## Dashboard shell (all pages)

Every page uses the same clean admin-dashboard shell (modelled on the
reference dashboard screenshot):

- **Left sidebar** — brand + nav (হোম, ১০ / ৪ / ২ ঘণ্টা, দৈনিক ব্রিফিং,
  আর্কাইভ) with the active page highlighted. Fixed on desktop
  (≥1024px); below that it hides and opens as a slide-in drawer from
  the top-bar hamburger (Escape / backdrop click closes it).
- **Slim top bar** — hamburger (mobile/tablet only), site name, live
  Dhaka clock/date, language toggle.
- **Mobile bottom nav** (5 items) stays as before.
- **Slim footer** — one quiet line: © year + site name, the single
  honesty line, and the "বাংলাদেশ সময় (UTC+6)" note. No footer
  columns, no repeated sections.

The old sticky header + top nav + hamburger mobile menu are gone
(this also removed a duplicated ২-ঘণ্টা link that the old header had
on the feed pages).

## Dashboard homepage (`index.html`)

Decluttered morning dashboard — one idea per screen area, lots of
whitespace:

- **Heading** — "সকালের ড্যাশবোর্ড" with today's date in Bengali plus
  the Hijri date (labelled আনুমানিক).
- **4 gradient stat cards** — one per sector (১০ ঘণ্টা blue, ৪ ঘণ্টা
  orange, ২ ঘণ্টা violet, দৈনিক ব্রিফিং green), each showing the item
  count and the last/next update time, read live from the JSON files.
  Each card links to its full section page.
- **Chart + activity row** (like the reference: chart panel left,
  activity feed right):
  - **Chart** — a simple horizontal bar chart of খবরের সংখ্যা per
    section (১০ / ২ / ৩ / ৫ in the current data), computed live from
    `data/*.json` — no invented numbers, no fake trends. Daily counts
    the latest briefing's top-5 items, same as its stat card.
  - **সাম্প্রতিক আপডেট** — the newest items across all four sections
    (max 8), sorted newest-first by `published_at` with relative time
    (e.g. "৭ মিনিট আগে"), each linking to its source. Daily top-5
    items use their briefing's `published_at` and link to `daily.html`.
- **4 sector panels** — one per sector, simplified: latest 3 items
  only, title + time, generous spacing, no freshness strips, no full
  news cards. "সব দেখুন →" links to the full section page.
- **2 small widget slots** at the bottom (আবহাওয়া, ডলার ও বাজার —
  "শীঘ্রই আসছে", no fake data).

Removed from the homepage: the right rail (আজকের বিশেষ ৫টি + সামনে
যা আছে — that content lives on `daily.html` only, in the full
briefing card), the how-it-works block, the separate honesty section
(one line in the footer now), and the hero action buttons (the stat
cards already link to the sections).

## Sectors

| Sector | Page | Data file | Update interval |
|---|---|---|---|
| ১০ ঘণ্টার আপডেট | `10-ghonta.html` | `data/10h.json` | every 10 hours |
| ৪ ঘণ্টার আপডেট | `4-ghonta.html` | `data/4h.json` | every 4 hours |
| ২ ঘণ্টার আপডেট | `2-ghonta.html` | `data/2h.json` | every 2 hours |
| দৈনিক ব্রিফিং | `daily.html` | `data/daily.json` | daily 10:00 |

The 2-hour section was added 2026-11-23 at the user's request and
fills the old 4th-section placeholder, which has been removed. `data/2h.json` uses the exact same entry
format as `data/4h.json` (`meta.section` `"2h"`, `interval_hours` 2).
Seeded 2026-11-23 08:49 with 3 verified items from the 06:49–08:49
window (Dawn live blog on the Iran war; Dawn's PKT times converted
to Dhaka time — see the file's `note_bn`).

## Pages

| Page | What it shows |
|---|---|
| `index.html` | Dashboard: stat cards, chart + recent-activity feed, 4 simplified sector panels (latest 3, title + time), 2 small widget slots |
| `10-ghonta.html` | Full 10-hour feed + count + freshness strip |
| `4-ghonta.html` | Full 4-hour feed + count + freshness strip |
| `2-ghonta.html` | Full 2-hour feed + count + freshness strip |
| `daily.html` | Latest briefing in full + earlier briefings |
| `archive.html` | `?section=10h` (default) / `4h` / `2h` / `daily` — entries grouped by date, newest first |

## Data files

`data/10h.json`, `data/4h.json`, `data/2h.json`, `data/daily.json`
are **backup copies only** — the live site reads from Firebase
Realtime Database (`/news/<section>`, same content, same entry
format — see the PHP site's README for the contract). They are kept
in sync by the update jobs and by `fb_put.py`, so the site can be
restored from them if needed. Unlike the PHP site, the JSON files
are publicly fetchable here — there is no `data/.htaccess` blocking
them and no `data/index.php` redirect.

## Updating the news

The live data lives in Firebase Realtime Database (project
`sp-intelligence-fbbf9`, public read on `/news`, write only when
signed in as the admin). The scheduled update jobs write there with
`~/workspace/sp-intelligence-private/fb_put.py <section> <file>`
(the helper reads the database URL + secret from the private
`firebase.json` at run time — the secret is never printed and never
goes into any file in this folder). The local `data/*.json` files are
updated first as backup, then published to Firebase. No GitHub push
is needed for a news update. Or edit the news by hand in `admin.html`.
Each sector has its own update job: 10h / 4h / 2h publish only their
own node; the daily job prepends a briefing to the `daily` node
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

## Future widget slots

The homepage has 2 small, dashed, clearly labelled slots at the
bottom (আবহাওয়া, ডলার ও বাজার) with no data in them. To fill one
later: replace the `.widget-slot` block in `index.html` with a real
panel and add its data/rendering in `app.js`. Do not put invented
numbers in them.

## Local test

```bash
cd ~/workspace/sp-intelligence-netlify
python3 -m http.server 8000
# then open http://localhost:8000/
```
