# SP Intelligence — Static (Netlify) version

Static HTML + JavaScript version of the SP Intelligence news site, built
for Netlify hosting. Converted from the PHP version in
`~/workspace/sp-intelligence/` (PHP 8+ + JSON on InfinityFree) — the PHP
source is untouched; this folder is a separate, self-contained static site.

## How it works

- **No server, no build step.** Netlify publishes this folder as-is
  (`netlify.toml` sets the publish directory to the folder root).
- **All rendering is client-side.** `assets/js/app.js` fetches
  `data/10h.json`, `data/4h.json` and `data/daily.json` and renders the
  news cards, daily briefing cards, freshness strips, "next update"
  times and empty states — the same markup and Bengali date format the
  PHP `includes/cards.php` / `includes/functions.php` produced.
- **Bengali primary, English toggle** (`?lang=en`) works client-side;
  the UI strings in `app.js` are an exact copy of the PHP
  `includes/lang.php`. News content itself is always Bengali (it comes
  from the JSON files).
- **Design** is the same glassmorphism (lavender `#F4F5FF`, Hind
  Siliguri) — `assets/css/style.css` and `assets/js/main.js` are copied
  unchanged from the PHP site.

## Pages

| Page | What it shows |
|---|---|
| `index.html` | Hero, latest 5 of the 10-hour feed, latest 5 of the 4-hour feed, latest daily briefing, **4th-section placeholder** (`id="section-4-placeholder"`), how-it-works, honesty note |
| `10-ghonta.html` | Full 10-hour feed + count + freshness strip |
| `4-ghonta.html` | Full 4-hour feed + count + freshness strip |
| `daily.html` | Latest briefing in full + earlier briefings |
| `archive.html` | `?section=10h` (default) / `4h` / `daily` — entries grouped by date, newest first |

## Data files

`data/10h.json`, `data/4h.json`, `data/daily.json` are copied as-is from
the PHP site (same content, same entry format — see the PHP site's
README for the contract). Unlike the PHP site, the JSON files are
**publicly fetchable** here — there is no `data/.htaccess` blocking
them and no `data/index.php` redirect; the JavaScript must be able to
fetch them.

## Updating the news

Replace the JSON file(s) in `data/` (same format as before) and
redeploy — push to the GitHub repo and Netlify auto-deploys. No PHP
file ever needs changing, no database, no cache to clear.

## The 4th section

Still unknown — the user's message was cut off ("আর শ..."), so the
homepage keeps the clearly marked empty placeholder
(`id="section-4-placeholder"`, `SECTION-4-PLACEHOLDER` comment in
`index.html`). Nothing is invented. To add it later: create
`data/<name>.json` in the same entry format, replace the placeholder
block with a real section, add a nav link and a string in `app.js`.

## Local test

```bash
cd ~/workspace/sp-intelligence-netlify
python3 -m http.server 8000
# then open http://localhost:8000/
```
