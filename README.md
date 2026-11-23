# SP Intelligence — Static (Netlify) version

Static HTML + JavaScript version of the SP Intelligence news site, built
for Netlify hosting. Converted from the PHP version in
`~/workspace/sp-intelligence/` (PHP 8+ + JSON on InfinityFree) — the PHP
source is untouched; this folder is a separate, self-contained static site.

## How it works

- **No server, no build step.** Netlify publishes this folder as-is
  (`netlify.toml` sets the publish directory to the folder root).
- **All rendering is client-side.** `assets/js/app.js` fetches the JSON
  files in `data/` and renders the news cards, daily briefing cards,
  freshness strips, "next update" times and empty states — the same
  markup and Bengali date format the PHP `includes/cards.php` /
  `includes/functions.php` produced.
- **Bengali primary, English toggle** (`?lang=en`) works client-side;
  the UI strings in `app.js` are an exact copy of the PHP
  `includes/lang.php`. News content itself is always Bengali (it comes
  from the JSON files).
- **Design** is the same glassmorphism (lavender `#F4F5FF`, Hind
  Siliguri) — `assets/css/style.css` and `assets/js/main.js` are copied
  from the PHP site and extended for the dashboard layout.

## Dashboard homepage (`index.html`)

The homepage is a morning at-a-glance dashboard (modelled on the admin
dashboard screenshot the user supplied):

- **Top bar** — site name, live Dhaka clock, language toggle.
- **Dashboard header** — "সকালের ড্যাশবোর্ড" with today's date in
  Bengali plus the Hijri date (labelled আনুমানিক).
- **4 gradient stat cards** — one per sector (১০ ঘণ্টা blue, ৪ ঘণ্টা
  orange, ২ ঘণ্টা violet, দৈনিক ব্রিফিং green), each showing the item
  count and the last/next update time, read live from the JSON files.
  Each card links to its full section page.
- **Sector panels** — one panel per sector (১০ / ৪ / ২ ঘণ্টা) with the
  latest 3 items, freshness strip and "সব দেখুন →" link.
- **Right rail** — "আজকের বিশেষ ৫টি" (compact top-5 list from
  `daily.json`) and "সামনে যা আছে" (upcoming dates), plus **2 clearly
  marked empty widget slots** (আবহাওয়া, ডলার ও বাজার — "শীঘ্রই
  আসছে", no fake data) for future additions.
- **Daily briefing** section below (latest briefing card), then
  how-it-works and the honesty note.
- On desktop (≥1024px) the sectors sit in a main column with the rail
  on the right; on mobile everything stacks. Bottom nav has 5 items
  (হোম, ১০ ঘণ্টা, ৪ ঘণ্টা, ২ ঘণ্টা, দৈনিক).

## Sectors

| Sector | Page | Data file | Update interval |
|---|---|---|---|
| ১০ ঘণ্টার আপডেট | `10-ghonta.html` | `data/10h.json` | every 10 hours |
| ৪ ঘণ্টার আপডেট | `4-ghonta.html` | `data/4h.json` | every 4 hours |
| ২ ঘণ্টার আপডেট | `2-ghonta.html` | `data/2h.json` | every 2 hours |
| দৈনিক ব্রিফিং | `daily.html` | `data/daily.json` | daily 10:00 |

The 2-hour section was added 2026-11-23 at the user's request and
fills the old 4th-section placeholder (`id="section-4-placeholder"`),
which has been removed. `data/2h.json` uses the exact same entry
format as `data/4h.json` (`meta.section` `"2h"`, `interval_hours` 2).
Seeded 2026-11-23 08:49 with 3 verified items from the 06:49–08:49
window (Dawn live blog on the Iran war; Dawn's PKT times converted
to Dhaka time — see the file's `note_bn`).

## Pages

| Page | What it shows |
|---|---|
| `index.html` | Dashboard: stat cards, 3 sector panels, right rail (top 5 + upcoming + 2 future widget slots), daily briefing, how-it-works, honesty note |
| `10-ghonta.html` | Full 10-hour feed + count + freshness strip |
| `4-ghonta.html` | Full 4-hour feed + count + freshness strip |
| `2-ghonta.html` | Full 2-hour feed + count + freshness strip |
| `daily.html` | Latest briefing in full + earlier briefings |
| `archive.html` | `?section=10h` (default) / `4h` / `2h` / `daily` — entries grouped by date, newest first |

## Data files

`data/10h.json`, `data/4h.json`, `data/2h.json`, `data/daily.json`
are copied as-is from the PHP site (same content, same entry format —
see the PHP site's README for the contract). Unlike the PHP site, the
JSON files are **publicly fetchable** here — there is no
`data/.htaccess` blocking them and no `data/index.php` redirect; the
JavaScript must be able to fetch them.

## Deploy

The same folder deploys from the GitHub repo **spiamahmed69/sp-intelligence**
to two hosts (both auto-deploy on push to `main`, no build step):

- **Vercel (primary)** — project `sp-intelligence`, Framework "Other",
  no build command, output directory `.`:
  https://sp-intelligence-five.vercel.app
- **Netlify (backup)** — project `stunning-sprite-417203`:
  https://stunning-sprite-417203.netlify.app

## Updating the news

Replace the JSON file(s) in `data/` (same format as before) and
redeploy — push to the GitHub repo and Netlify auto-deploys. No PHP
file ever needs changing, no database, no cache to clear. Each sector
has its own update job: 10h / 4h / 2h push only their own JSON file;
the daily job prepends a briefing to `data/daily.json`.

## Future widget slots

The homepage rail has 2 dashed, clearly labelled slots (আবহাওয়া,
ডলার ও বাজার) with no data in them. To fill one later: replace the
`.widget-slot` block in `index.html` with a real panel and add its
data/rendering in `app.js`. Do not put invented numbers in them.

## Local test

```bash
cd ~/workspace/sp-intelligence-netlify
python3 -m http.server 8000
# then open http://localhost:8000/
```
