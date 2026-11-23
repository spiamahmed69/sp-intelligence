/**
 * SP Intelligence — app.js (static site, no dependencies)
 *
 * Daily briefing only.
 *  - UI strings in Bengali (primary) and English (secondary). News content
 *    itself is always Bengali — it comes from data/daily.json, exactly as
 *    published.
 *  - Language: ?lang=bn|en wins, then localStorage, then Bengali default.
 *  - Renders the daily briefing (top-5 list, summary, upcoming dates,
 *    Islamic note), the dashboard stat cards / chart / donuts / activity
 *    feed and the archive from Firebase Realtime Database (public read
 *    on /news/daily only). Local data/daily.json is the backup fallback.
 *  - All times are Asia/Dhaka (UTC+6). The daily briefing is published
 *    every morning at 08:00 Dhaka time.
 */
(function () {
    'use strict';

    // ------------------------------------------------------------------
    // UI strings.
    // ------------------------------------------------------------------
    var STRINGS = {
        bn: {
            site_name: 'এসপি ইন্টেলিজেন্স',
            site_tagline: 'বাংলাদেশ ও বিশ্বের খবর — সহজ বাংলায়, প্রতিদিন সকাল ৮টায়',
            skip_to_content: 'মূল বিষয়বস্তুতে যান',
            home: 'হোম',
            menu: 'মেনু',
            admin: 'অ্যাডমিন',
            section_daily: 'দৈনিক ব্রিফিং',
            archive: 'আর্কাইভ',
            language: 'ভাষা',
            hero_badge: 'প্রতিদিন সকাল ৮টায়',
            dash_kicker: 'দৈনিক ব্রিফিং',
            dash_title: 'একনজরে আজকের সব খবর',
            dash_subtitle: 'প্রতিদিন সকাল ৮টায় দৈনিক ব্রিফিং',
            stat_news: 'আজকের খবর',
            stat_sources: 'ব্রিফিংয়ে সূত্র',
            stat_latest: 'সর্বশেষ আপডেট',
            stat_news_unit: 'টি খবর',
            stat_sources_unit: 'টি সূত্র',
            chart_title: 'সূত্র অনুযায়ী খবর',
            chart_title_category: 'বিভাগ অনুযায়ী খবর',
            chart_note: 'সর্বশেষ ব্রিফিংয়ের তথ্য থেকে গণনা করা।',
            chart_empty: 'এই মুহূর্তে কোনো খবর নেই।',
            donut_sources_title: 'সূত্র অনুযায়ী ভাগ',
            donut_sources_title_category: 'বিভাগ অনুযায়ী ভাগ',
            donut_dates_title: 'প্রকাশের তারিখ অনুযায়ী ভাগ',
            donut_today: 'আজ',
            donut_earlier: 'আগে',
            recent_updates: 'সাম্প্রতিক আপডেট',
            no_recent: 'এখনো কোনো সাম্প্রতিক আপডেট নেই।',
            briefing_preview: 'আজকের বিশেষ ৫টি খবর',
            view_full_briefing: 'পুরো ব্রিফিং পড়ুন',
            hijri_approx: 'আনুমানিক',
            last_updated: 'সর্বশেষ আপডেট',
            next_briefing: 'পরের ব্রিফিং',
            view_all: 'সব দেখুন',
            source: 'সূত্র',
            published: 'প্রকাশ',
            top_5: 'আজকের বিশেষ ৫টি আপডেট',
            summary: 'সারসংক্ষেপ',
            upcoming_dates: 'সামনে যেসব তারিখ গুরুত্বপূর্ণ',
            islamic_note: 'ইসলামিক জ্ঞান',
            no_briefings: 'এখনো কোনো দৈনিক ব্রিফিং প্রকাশ হয়নি। প্রথম ব্রিফিং সকাল ৮টায় আসবে।',
            back_to_top: 'উপরে যান',
            footer_note: 'সব সময় বাংলাদেশ সময় (UTC+6) অনুযায়ী।',
            briefings_count: 'টি ব্রিফিং',
            dhaka_time: 'ঢাকার সময়',
            section_daily_intro: 'প্রতিদিন সকাল ৮টায় — দিনের সবচেয়ে গুরুত্বপূর্ণ ৫টি খবর, সারসংক্ষেপ ও সামনের তারিখ।',
            page_daily_intro: 'প্রতিদিন সকাল ৮টায় প্রকাশিত ব্রিফিং — দিনের সবচেয়ে গুরুত্বপূর্ণ ৫টি খবর, সারসংক্ষেপ, সামনের গুরুত্বপূর্ণ তারিখ ও একটি ইসলামিক জ্ঞান।',
            page_archive_intro: 'আগের সব দৈনিক ব্রিফিং এখানে তারিখ অনুযায়ী সাজানো আছে।',
            earlier_briefings: 'আগের ব্রিফিং',
            loading: 'লোড হচ্ছে…',
            load_failed: 'খবর লোড করা যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।',
            load_failed_backup: 'সর্বশেষ আপডেট পাওয়া যায়নি — সর্বশেষ সংরক্ষিত খবর দেখানো হচ্ছে।',
            retry: 'আবার চেষ্টা করুন',
            page_desc_home: 'বাংলাদেশ ও বিশ্বের খবর — সহজ বাংলায়, প্রতিদিন সকাল ৮টায় দৈনিক ব্রিফিং',
            page_desc_daily: 'প্রতিদিন সকাল ৮টায় দৈনিক ব্রিফিং — বিশেষ ৫টি খবর, সারসংক্ষেপ ও সামনের তারিখ।',
            page_desc_archive: 'আগের সব দৈনিক ব্রিফিং — তারিখ অনুযায়ী সাজানো।'
        },
        en: {
            site_name: 'SP Intelligence',
            site_tagline: 'Bangladesh & world news — in simple Bengali, every morning at 8:00',
            skip_to_content: 'Skip to main content',
            home: 'Home',
            menu: 'Menu',
            admin: 'Admin',
            section_daily: 'Daily briefing',
            archive: 'Archive',
            language: 'Language',
            hero_badge: 'Every morning at 8:00',
            dash_kicker: 'Daily briefing',
            dash_title: 'Everything today, at a glance',
            dash_subtitle: 'Daily briefing every morning at 8:00 AM',
            stat_news: "Today's news",
            stat_sources: 'Sources in briefing',
            stat_latest: 'Latest update',
            stat_news_unit: 'stories',
            stat_sources_unit: 'sources',
            chart_title: 'Stories by source',
            chart_title_category: 'Stories by category',
            chart_note: 'Counted from the latest briefing.',
            chart_empty: 'No stories right now.',
            donut_sources_title: 'Share by source',
            donut_sources_title_category: 'Share by category',
            donut_dates_title: 'Share by publication date',
            donut_today: 'Today',
            donut_earlier: 'Earlier',
            recent_updates: 'Recent updates',
            no_recent: 'No recent updates yet.',
            briefing_preview: 'Top 5 must-know stories',
            view_full_briefing: 'Read the full briefing',
            hijri_approx: 'approx.',
            last_updated: 'Last updated',
            next_briefing: 'Next briefing',
            view_all: 'View all',
            source: 'Source',
            published: 'Published',
            top_5: 'Top 5 must-know updates',
            summary: 'Summary',
            upcoming_dates: 'Upcoming important dates',
            islamic_note: 'Islamic knowledge',
            no_briefings: 'No daily briefing has been published yet. The first briefing arrives at 8am.',
            back_to_top: 'Back to top',
            footer_note: 'All times are Bangladesh time (UTC+6).',
            briefings_count: 'briefings',
            dhaka_time: 'Dhaka time',
            section_daily_intro: 'Every morning at 8am — the 5 most important stories, a summary and upcoming dates.',
            page_daily_intro: 'Briefing published every day at 8am — the 5 most important stories, a summary, upcoming dates and one piece of Islamic knowledge.',
            page_archive_intro: 'All earlier daily briefings are grouped here by date.',
            earlier_briefings: 'Earlier briefings',
            loading: 'Loading…',
            load_failed: 'The news could not be loaded. Please check your internet connection and try again.',
            load_failed_backup: 'The latest update could not be reached — showing the last saved news.',
            retry: 'Try again',
            page_desc_home: 'Bangladesh & world news — in simple Bengali, daily briefing every morning at 8:00',
            page_desc_daily: 'Daily briefing every morning at 8am — top 5 stories, summary and upcoming dates.',
            page_desc_archive: 'All earlier daily briefings — grouped by date.'
        }
    };

    // Page titles / descriptions.
    var PAGE_META = {
        home:    { titleKey: 'home',          descKey: 'page_desc_home' },
        daily:   { titleKey: 'section_daily', descKey: 'page_desc_daily' },
        archive: { titleKey: 'archive',       descKey: 'page_desc_archive' }
    };

    // ------------------------------------------------------------------
    // Language — ?lang=bn|en wins, then localStorage, then Bengali.
    // ------------------------------------------------------------------
    var lang = 'bn';
    try {
        var params = new URLSearchParams(window.location.search);
        var qLang = params.get('lang');
        if (qLang === 'bn' || qLang === 'en') {
            lang = qLang;
            try { window.localStorage.setItem('sp-intel-lang', lang); } catch (e) { /* private mode */ }
        } else {
            var saved = null;
            try { saved = window.localStorage.getItem('sp-intel-lang'); } catch (e) { /* private mode */ }
            if (saved === 'bn' || saved === 'en') { lang = saved; }
        }
    } catch (e) { /* URLSearchParams unavailable — stay Bengali */ }

    function t(key) {
        if (STRINGS[lang] && STRINGS[lang][key] !== undefined) { return STRINGS[lang][key]; }
        if (STRINGS.bn[key] !== undefined) { return STRINGS.bn[key]; }
        return key;
    }

    // Apply the language to every static chrome string on the page.
    function applyLanguage() {
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            el.textContent = t(el.getAttribute('data-i18n'));
        });
        document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
            el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
        });
        // Page title + meta description.
        var page = (document.body && document.body.getAttribute('data-page')) || 'home';
        var meta = PAGE_META[page] || PAGE_META.home;
        document.title = t(meta.titleKey) + ' — ' + t('site_name');
        var descEl = document.querySelector('meta[name="description"]');
        if (descEl) { descEl.setAttribute('content', t(meta.descKey)); }
        // Language switch links: same page, other language, keeping other params.
        document.querySelectorAll('[data-lang-switch]').forEach(function (el) {
            var url = new URL(window.location.href);
            url.searchParams.set('lang', el.getAttribute('data-lang-switch'));
            el.setAttribute('href', url.pathname + url.search + url.hash);
            if (el.getAttribute('data-lang-switch') === lang) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
        // Footer year.
        var yearEl = document.getElementById('footer-year');
        if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }
        // Keep the language on every internal link, like PHP lang_url().
        document.querySelectorAll('a[href]').forEach(function (a) {
            var href = a.getAttribute('href');
            if (!href || href.charAt(0) === '#' || href.indexOf('://') !== -1 ||
                href.indexOf('mailto:') === 0 || href.indexOf('.html') === -1) { return; }
            try {
                var u = new URL(href, window.location.href);
                if (u.origin !== window.location.origin) { return; }
                u.searchParams.set('lang', lang);
                a.setAttribute('href', u.pathname + u.search + u.hash);
            } catch (e) { /* leave the link alone */ }
        });
    }

    // ------------------------------------------------------------------
    // Bengali dates / times. All times are Asia/Dhaka.
    // ------------------------------------------------------------------
    var BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    var BN_MONTHS = ['', 'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
        'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

    function bnDigits(s) {
        return String(s).replace(/[0-9]/g, function (d) { return BN_DIGITS[+d]; });
    }

    function bnDaypart(hour) {
        if (hour < 4) { return 'রাত'; }
        if (hour < 6) { return 'ভোর'; }
        if (hour < 12) { return 'সকাল'; }
        if (hour < 16) { return 'দুপুর'; }
        if (hour < 18) { return 'বিকেল'; }
        if (hour < 20) { return 'সন্ধ্যা'; }
        return 'রাত';
    }

    // Dhaka wall-clock parts for a Date. (Intl hour12:false can return 24.)
    function dhakaParts(date) {
        var fmt = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Dhaka', year: 'numeric', month: 'numeric',
            day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: false
        });
        var parts = {};
        fmt.formatToParts(date).forEach(function (p) { parts[p.type] = p.value; });
        var hour = parseInt(parts.hour, 10) % 24;
        return {
            year: parseInt(parts.year, 10),
            month: parseInt(parts.month, 10),
            day: parseInt(parts.day, 10),
            hour: hour,
            minute: parts.minute
        };
    }

    // "2026-11-22T23:22:00+06:00" -> "২২ নভেম্বর ২০২৬, রাত ১১:২২"
    function bnDatetime(iso) {
        var d = new Date(iso);
        if (isNaN(d.getTime())) { return iso; }
        var p = dhakaParts(d);
        var h12 = p.hour % 12;
        if (h12 === 0) { h12 = 12; }
        return bnDigits(p.day) + ' ' + BN_MONTHS[p.month] + ' ' + bnDigits(p.year) +
            ', ' + bnDaypart(p.hour) + ' ' + bnDigits(h12) + ':' + bnDigits(p.minute);
    }

    // "2026-11-22" -> "২২ নভেম্বর ২০২৬"
    function bnDate(dateStr) {
        var d = new Date(dateStr);
        if (isNaN(d.getTime())) { return dateStr; }
        var p = dhakaParts(d);
        return bnDigits(p.day) + ' ' + BN_MONTHS[p.month] + ' ' + bnDigits(p.year);
    }

    // "2026-11-22T23:22:00+06:00" -> "২৩ মিনিট আগে" / "৩ ঘণ্টা আগে" / "২ দিন আগে"
    function freshness(iso) {
        var ts = new Date(iso).getTime();
        if (isNaN(ts)) { return ''; }
        var diff = Math.floor((Date.now() - ts) / 1000);
        if (diff < 60) { return 'এইমাত্র'; }
        if (diff < 3600) { return bnDigits(Math.max(1, Math.floor(diff / 60))) + ' মিনিট আগে'; }
        if (diff < 86400) { return bnDigits(Math.floor(diff / 3600)) + ' ঘণ্টা আগে'; }
        return bnDigits(Math.floor(diff / 86400)) + ' দিন আগে';
    }

    // Next daily briefing: today 08:00 Dhaka if it has not passed, else tomorrow 08:00.
    function nextDaily() {
        var now = dhakaParts(new Date());
        var pad = function (n) { return (n < 10 ? '0' : '') + n; };
        var base = now.year + '-' + pad(now.month) + '-' + pad(now.day);
        var today8 = new Date(base + 'T08:00:00+06:00').getTime();
        var target = Date.now() < today8 ? today8 : today8 + 86400 * 1000;
        return bnDatetime(new Date(target).toISOString());
    }

    // ------------------------------------------------------------------
    // Escaping + renderers.
    // ------------------------------------------------------------------
    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    var ICON_LIST = '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M4 4h16v2H4zm0 4h16v2H4zm0 4h10v2H4zm0 4h16v2H4z"/></svg>';
    var ICON_CLOCK = '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 10.6 4.2 2.5-.8 1.3L11 13.5V7h2z"/></svg>';
    var ICON_CAL = '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2zm12 8v10H5V10z"/></svg>';
    var ICON_STAR = '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M12 2 15 8.5 22 9.3 17 14.1 18.5 21 12 17.8 5.5 21 7 14.1 2 9.3 9 8.5z"/></svg>';
    var ICON_GLOBE = '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm7 6h-3.1A15 15 0 0 0 14.4 4 8 8 0 0 1 19 8zM12 4a13 13 0 0 1 1.9 4h-3.8A13 13 0 0 1 12 4zM4.3 14H7a15 15 0 0 0 1.5 4A8 8 0 0 1 4.3 14zM4.3 10A8 8 0 0 1 8.5 6 15 15 0 0 0 7 10zm6.3 8a13 13 0 0 1-1.9-4h3.8a13 13 0 0 1-1.9 4zm2.1-6H9.3A15 15 0 0 1 8.7 10h6.6a15 15 0 0 1-.6 2zm.8 6a15 15 0 0 0 1.5-4h2.7a8 8 0 0 1-4.2 4zM17 10a15 15 0 0 0-1.5-4A8 8 0 0 1 19.7 10z"/></svg>';

    // One top-5 item as a numbered row: number, title, summary,
    // publication date + source link. Used on the homepage preview and
    // on the full daily page.
    function top5ItemHTML(item, n) {
        var html = '<li><span class="brief-num" aria-hidden="true">' + esc(bnDigits(n)) + '</span>';
        html += '<div class="brief-body"><h3>' + esc(item.title || '') + '</h3>';
        if (item.summary) { html += '<p>' + esc(item.summary) + '</p>'; }
        html += '<p class="brief-meta">';
        if (item.published_date) {
            html += '<span>' + ICON_CAL + ' ' + esc(bnDate(item.published_date)) + '</span>';
        }
        if (item.source_name && item.source_url) {
            html += '<span class="source">' + esc(t('source')) + ': <a href="' + esc(item.source_url) +
                '" target="_blank" rel="noopener">' + esc(item.source_name) + '</a></span>';
        } else if (item.source_name) {
            html += '<span class="source">' + esc(t('source')) + ': ' + esc(item.source_name) + '</span>';
        }
        html += '</p></div></li>';
        return html;
    }

    function top5ListHTML(top5) {
        var html = '<ol class="brief-list">';
        top5.forEach(function (item, i) {
            html += top5ItemHTML(item, i + 1);
        });
        return html + '</ol>';
    }

    // Full latest briefing: numbered top-5, summary, upcoming dates,
    // Islamic note. Category icons are inline SVG (Lucide-style), no emoji.
    function dailyCard(b) {
        var html = '<article class="card daily-card"><div class="card-top">';
        html += '<span class="badge badge-amber">' + ICON_STAR +
            (b.date ? esc(bnDate(b.date)) : esc(t('section_daily'))) + '</span>';
        if (b.published_at) {
            html += '<span class="freshness">' + esc(bnDatetime(b.published_at)) +
                ' (' + esc(freshness(b.published_at)) + ')</span>';
        }
        html += '</div>';
        var top5 = Array.isArray(b.top5) ? b.top5 : [];
        if (top5.length) {
            html += '<h3>' + esc(t('top_5')) + '</h3>' + top5ListHTML(top5);
        }
        if (b.summary) {
            html += '<h3>' + esc(t('summary')) + '</h3><p>' + esc(b.summary) + '</p>';
        }
        var upcoming = Array.isArray(b.upcoming) ? b.upcoming : [];
        if (upcoming.length) {
            html += '<h3>' + esc(t('upcoming_dates')) + '</h3><ul class="upcoming-list">';
            upcoming.forEach(function (u) {
                html += '<li>';
                if (u.date) { html += '<strong>' + esc(bnDate(u.date)) + ':</strong> '; }
                html += esc(u.text || '') + '</li>';
            });
            html += '</ul>';
        }
        if (b.islamic_note) {
            html += '<h3>' + esc(t('islamic_note')) + '</h3><p class="islamic-note">' + esc(b.islamic_note) + '</p>';
        }
        html += '</article>';
        return html;
    }

    // Archive card: briefing date + its top-5 titles (numbered, no summary).
    function archiveCard(b) {
        var html = '<article class="card daily-card"><div class="card-top">';
        html += '<span class="badge badge-amber">' + ICON_STAR +
            (b.date ? esc(bnDate(b.date)) : esc(t('section_daily'))) + '</span>';
        if (b.published_at) {
            html += '<span class="freshness">' + esc(bnDatetime(b.published_at)) +
                ' (' + esc(freshness(b.published_at)) + ')</span>';
        }
        html += '</div>';
        var top5 = Array.isArray(b.top5) ? b.top5 : [];
        if (top5.length) {
            html += '<ol class="brief-list brief-list-compact">';
            top5.forEach(function (item, i) {
                html += '<li><span class="brief-num" aria-hidden="true">' + esc(bnDigits(i + 1)) + '</span>' +
                    '<div class="brief-body"><h3>' + esc(item.title || '') + '</h3></div></li>';
            });
            html += '</ol>';
        }
        html += '</article>';
        return html;
    }

    function dailyStrip(latest) {
        var html = '<p class="freshness-strip" role="status"><span><strong>' +
            esc(t('next_briefing')) + ':</strong> ' + esc(nextDaily()) + '</span>';
        if (latest && latest.published_at) {
            html += '<span><strong>' + esc(t('last_updated')) + ':</strong> ' +
                esc(bnDatetime(latest.published_at)) + ' (' + esc(freshness(latest.published_at)) + ')</span>';
        }
        html += '</p>';
        return html;
    }

    // ------------------------------------------------------------------
    // Data loading. Live source is Firebase Realtime Database, public
    // read on /news/daily only:
    //   <databaseURL>/news/daily.json  (REST endpoint, no auth needed)
    // ------------------------------------------------------------------
    var FB_BASE = 'https://sp-intelligence-fbbf9-default-rtdb.asia-southeast1.firebasedatabase.app/news';

    // Every network request gets a hard timeout (~8s). A stalled request
    // used to hang forever (bare fetch, no AbortController), freezing the
    // "লোড হচ্ছে…" placeholders with no error shown. Now it rejects
    // instead, so callers can fall back or show an error + retry.
    var FETCH_TIMEOUT_MS = 8000;

    function fetchWithTimeout(url, options) {
        var controller = null;
        var timer = null;
        var opts = options || {};
        try {
            controller = new AbortController();
            opts.signal = controller.signal;
            timer = setTimeout(function () { controller.abort(); }, FETCH_TIMEOUT_MS);
        } catch (e) {
            // AbortController unavailable (very old browser) — plain fetch.
            controller = null;
        }
        return fetch(url, opts).then(function (res) {
            if (timer) { clearTimeout(timer); }
            return res;
        }, function (err) {
            if (timer) { clearTimeout(timer); }
            throw err;
        });
    }

    function loadJSON(url) {
        return fetchWithTimeout(url, { cache: 'no-cache' }).then(function (res) {
            if (!res.ok) { throw new Error('HTTP ' + res.status + ' for ' + url); }
            return res.json();
        });
    }

    // Local backup file (data/daily.json) — same shape as the Firebase
    // node. It holds the last-known real news, never demo data.
    function loadLocalDaily() {
        return loadJSON('data/daily.json');
    }

    function normaliseDaily(data) {
        var meta = (data && data.meta) || {};
        var briefings = Array.isArray(data.briefings) ? data.briefings.slice() : [];
        briefings.sort(function (a, b) {
            return String(b.date || '').localeCompare(String(a.date || ''));
        });
        return { meta: meta, briefings: briefings };
    }

    // Firebase first; on failure/timeout, fall back to the local backup.
    // The promise always settles (never hangs, never rejects):
    //   { ..., fromBackup: true/false, failed: true/false }
    // failed=true only when BOTH sources failed — then the caller must
    // show an error + retry instead of leaving placeholders up.
    function loadDaily() {
        return loadJSON(FB_BASE + '/daily.json').then(function (data) {
            var out = normaliseDaily(data);
            out.fromBackup = false;
            out.failed = false;
            return out;
        }).catch(function (err) {
            if (window.console) { console.warn('Firebase failed for daily, trying local backup:', err); }
            return loadLocalDaily().then(function (data) {
                var out = normaliseDaily(data);
                out.fromBackup = true;
                out.failed = false;
                return out;
            }).catch(function (err2) {
                if (window.console) { console.warn('Local backup also failed for daily:', err2); }
                return { meta: {}, briefings: [], fromBackup: false, failed: true };
            });
        });
    }

    function setHTML(id, html) {
        var el = document.getElementById(id);
        if (el) { el.innerHTML = html; }
    }

    function emptyState(key) {
        return '<p class="empty-state">' + esc(t(key)) + '</p>';
    }

    // ------------------------------------------------------------------
    // Load-error banner — one banner per page, at the top of <main>.
    // Shown when a section failed outright (error) or fell back to the
    // local backup (info). Always carries an "আবার চেষ্টা করুন" button
    // that reloads the page and re-runs the loads. Never leaves the
    // "লোড হচ্ছে…" placeholders up indefinitely.
    // ------------------------------------------------------------------
    function showLoadBanner(kind, message) {
        var main = document.getElementById('main-content');
        if (!main) { return; }
        var banner = document.getElementById('load-error-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'load-error-banner';
            banner.className = 'load-error-banner';
            banner.setAttribute('role', 'alert');
            if (main.firstChild) { main.insertBefore(banner, main.firstChild); }
            else { main.appendChild(banner); }
        }
        banner.className = 'load-error-banner load-error-' + (kind === 'info' ? 'info' : 'error');
        banner.innerHTML = '';
        var msg = document.createElement('p');
        msg.textContent = message;
        banner.appendChild(msg);
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-primary btn-small load-retry-btn';
        btn.textContent = t('retry');
        btn.addEventListener('click', function () { window.location.reload(); });
        banner.appendChild(btn);
    }

    function clearLoadBanner() {
        var banner = document.getElementById('load-error-banner');
        if (banner && banner.parentNode) { banner.parentNode.removeChild(banner); }
    }

    // Summarise a set of section results into one banner:
    // outright failure wins over backup; backup wins over all-live.
    function updateLoadBanner(results) {
        var anyFailed = results.some(function (r) { return r && r.failed; });
        var anyBackup = results.some(function (r) { return r && r.fromBackup; });
        if (anyFailed) { showLoadBanner('error', t('load_failed')); }
        else if (anyBackup) { showLoadBanner('info', t('load_failed_backup')); }
        else { clearLoadBanner(); }
    }

    // ------------------------------------------------------------------
    // Dashboard helpers — stat cards, date line, chart, donuts, feed.
    // All numbers come from the real daily data — nothing invented.
    // ------------------------------------------------------------------
    var ICON_NEWS_BIG = '<svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M4 4h16v2H4zm0 4h16v2H4zm0 4h10v2H4zm0 4h16v2H4z"/></svg>';
    var ICON_CLOCK_BIG = '<svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 10.6 4.2 2.5-.8 1.3L11 13.5V7h2z"/></svg>';
    var ICON_GLOBE_BIG = '<svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm7 6h-3.1A15 15 0 0 0 14.4 4 8 8 0 0 1 19 8zM12 4a13 13 0 0 1 1.9 4h-3.8A13 13 0 0 1 12 4zM4.3 14H7a15 15 0 0 0 1.5 4A8 8 0 0 1 4.3 14zM4.3 10A8 8 0 0 1 8.5 6 15 15 0 0 0 7 10zm6.3 8a13 13 0 0 1-1.9-4h3.8a13 13 0 0 1-1.9 4zm2.1-6H9.3A15 15 0 0 1 8.7 10h6.6a15 15 0 0 1-.6 2zm.8 6a15 15 0 0 0 1.5-4h2.7a8 8 0 0 1-4.2 4zM17 10a15 15 0 0 0-1.5-4A8 8 0 0 1 19.7 10z"/></svg>';

    // "সোমবার, ২৩ নভেম্বর ২০২৬ · হিজরি ১১ জমাদিউস সানি ১৪৪৮ (আনুমানিক)"
    function dashDateText() {
        var now = new Date();
        var bangla = '';
        try {
            bangla = new Intl.DateTimeFormat('bn-BD', {
                timeZone: 'Asia/Dhaka', weekday: 'long', day: 'numeric',
                month: 'long', year: 'numeric'
            }).format(now);
        } catch (e) { bangla = ''; }
        var hijri = '';
        try {
            hijri = new Intl.DateTimeFormat('bn-BD-u-ca-islamic', {
                timeZone: 'Asia/Dhaka', day: 'numeric', month: 'long', year: 'numeric'
            }).format(now);
            // Drop the trailing era word ("যুগ") the Bengali locale appends.
            hijri = hijri.replace(/ যুগ$/, '');
        } catch (e) { hijri = ''; }
        var out = bangla;
        if (hijri) { out += ' · ' + hijri + ' (' + t('hijri_approx') + ')'; }
        return out || bnDate(new Date().toISOString().slice(0, 10));
    }

    function renderDashDate() {
        var el = document.getElementById('dash-date');
        if (el) { el.textContent = dashDateText(); }
    }

    // Group the latest briefing's top-5 by real category when the items
    // carry one, otherwise by source_name (labelled honestly as sources).
    // Returns { mode: 'category'|'source', groups: [{label, count}] }.
    function groupTop5(top5) {
        var hasCategory = top5.some(function (item) { return item.category; });
        var key = hasCategory ? 'category' : 'source_name';
        var counts = {};
        var order = [];
        top5.forEach(function (item) {
            var label = item[key] || '';
            if (!label) { return; }
            if (!counts[label]) { counts[label] = 0; order.push(label); }
            counts[label] += 1;
        });
        return {
            mode: hasCategory ? 'category' : 'source',
            groups: order.map(function (label) { return { label: label, count: counts[label] }; })
        };
    }

    var DONUT_COLORS = ['#2563EB', '#C2410C', '#047857', '#6D28D9', '#0891B2', '#B45309'];
    var BAR_TONES = ['blue', 'orange', 'green', 'violet'];

    // Simple horizontal bar chart: one bar per group, labelled with its
    // real count. Bar width is relative to the largest group.
    function renderChart(grouping) {
        var groups = grouping.groups;
        if (!groups.length) { return emptyState('chart_empty'); }
        var max = 0;
        groups.forEach(function (g) { if (g.count > max) { max = g.count; } });
        var html = '<ul class="chart-rows">';
        groups.forEach(function (g, i) {
            var pct = Math.round((g.count / max) * 100);
            html += '<li><div class="chart-row-label"><span>' + esc(g.label) + '</span>' +
                '<span class="chart-value">' + esc(bnDigits(g.count)) + '</span></div>' +
                '<div class="chart-track"><div class="chart-fill chart-fill-' + BAR_TONES[i % BAR_TONES.length] +
                '" style="width:' + pct + '%"></div></div></li>';
        });
        return html + '</ul>';
    }

    // Donut chart (SVG): one segment per group + a legend with real
    // counts and shares. Colours are backed by the legend text, never
    // by colour alone.
    function renderDonut(grouping) {
        var groups = grouping.groups;
        if (!groups.length) { return emptyState('chart_empty'); }
        var total = 0;
        groups.forEach(function (g) { total += g.count; });
        if (total <= 0) { return emptyState('chart_empty'); }
        var r = 70;
        var circ = 2 * Math.PI * r;
        var offset = 0;
        var segments = '';
        groups.forEach(function (g, i) {
            var len = (g.count / total) * circ;
            segments += '<circle cx="90" cy="90" r="' + r + '" fill="none" stroke="' +
                DONUT_COLORS[i % DONUT_COLORS.length] + '" stroke-width="26" stroke-dasharray="' +
                len.toFixed(1) + ' ' + (circ - len).toFixed(1) + '" stroke-dashoffset="' +
                (-offset).toFixed(1) + '" transform="rotate(-90 90 90)"/>';
            offset += len;
        });
        var html = '<div class="donut-wrap"><svg class="donut-svg" viewBox="0 0 180 180" width="180" height="180" role="img" aria-label="' +
            esc(t('donut_sources_title')) + '">' + segments +
            '<text x="90" y="86" text-anchor="middle" class="donut-total-num">' + esc(bnDigits(total)) + '</text>' +
            '<text x="90" y="108" text-anchor="middle" class="donut-total-label">' + esc(t('stat_news_unit')) + '</text></svg>';
        html += '<ul class="donut-legend">';
        groups.forEach(function (g, i) {
            var share = Math.round((g.count / total) * 100);
            html += '<li><span class="legend-dot" style="background:' + DONUT_COLORS[i % DONUT_COLORS.length] +
                '" aria-hidden="true"></span><span>' + esc(g.label) + '</span>' +
                '<span class="legend-count">' + esc(bnDigits(g.count)) + ' · ' + esc(bnDigits(share)) + '%</span></li>';
        });
        return html + '</ul></div>';
    }

    // Publication-date distribution of the top-5: items published on the
    // briefing's own date ("আজ") vs earlier ones. Returns null when every
    // item shares one date (a one-slice donut would say nothing).
    function dateDistribution(top5, briefingDate) {
        var today = 0;
        var earlier = 0;
        top5.forEach(function (item) {
            if (!item.published_date) { return; }
            if (String(item.published_date).slice(0, 10) === String(briefingDate || '').slice(0, 10)) { today += 1; }
            else { earlier += 1; }
        });
        if (today === 0 || earlier === 0) { return null; }
        return {
            mode: 'date',
            groups: [
                { label: t('donut_today'), count: today },
                { label: t('donut_earlier'), count: earlier }
            ]
        };
    }

    // Upcoming-dates panel (used in place of the second donut when the
    // date distribution would be a single slice).
    function renderUpcoming(latest) {
        var upcoming = Array.isArray(latest.upcoming) ? latest.upcoming : [];
        if (!upcoming.length) { return emptyState('chart_empty'); }
        var html = '<ul class="upcoming-list">';
        upcoming.forEach(function (u) {
            html += '<li>';
            if (u.date) { html += '<strong>' + esc(bnDate(u.date)) + ':</strong> '; }
            html += esc(u.text || '') + '</li>';
        });
        return html + '</ul>';
    }

    // Activity feed: the latest briefing's top-5, newest first by
    // published_date, title + relative time + source link.
    function collectActivity(latest) {
        var top5 = Array.isArray(latest.top5) ? latest.top5 : [];
        var items = top5.map(function (item) {
            return {
                title: item.title || '',
                url: item.source_url || 'daily.html',
                source: item.source_name || '',
                time: item.published_date || latest.published_at || ''
            };
        });
        items.sort(function (a, b) {
            return String(b.time || '').localeCompare(String(a.time || ''));
        });
        return items.slice(0, 5);
    }

    function renderActivity(items) {
        if (!items.length) {
            return '<li class="activity-empty">' + esc(t('no_recent')) + '</li>';
        }
        return items.map(function (item) {
            var meta = [];
            if (item.source) { meta.push(esc(item.source)); }
            if (item.time) {
                var rel = freshness(item.time.length <= 10 ? item.time + 'T12:00:00+06:00' : item.time);
                meta.push(esc(bnDate(item.time.slice(0, 10))) + (rel ? ' (' + esc(rel) + ')' : ''));
            }
            var ext = item.url.indexOf('://') !== -1 ? ' target="_blank" rel="noopener"' : '';
            return '<li><span class="activity-dot activity-dot-green" aria-hidden="true"></span>' +
                '<span class="activity-body"><a href="' + esc(item.url) + '"' + ext + '>' + esc(item.title) + '</a>' +
                '<span class="activity-meta">' + meta.join(' · ') + '</span></span></li>';
        }).join('');
    }

    // ------------------------------------------------------------------
    // Page drivers. Each panel renders from the single daily load; a
    // failed load shows an error + retry banner and empty states in
    // every panel instead of leaving placeholders up forever.
    // ------------------------------------------------------------------
    function renderHome() {
        renderDashDate();
        loadDaily().then(function (daily) {
            updateLoadBanner([daily]);
            var latest = daily.briefings[0] || null;
            var grid = document.getElementById('stat-grid');
            if (daily.failed || !latest) {
                if (grid) {
                    grid.innerHTML = '<div class="stat-card stat-blue"><p><span>' + esc(t('load_failed')) + '</span></p></div>' +
                        '<div class="stat-card stat-orange"><p><span>' + esc(t('load_failed')) + '</span></p></div>' +
                        '<div class="stat-card stat-green"><p><span>' + esc(t('load_failed')) + '</span></p></div>';
                }
                setHTML('chart-bars', emptyState('load_failed'));
                setHTML('activity-list', '<li class="activity-empty">' + esc(t('load_failed')) + '</li>');
                setHTML('donut-sources', emptyState('load_failed'));
                setHTML('donut-dates', emptyState('load_failed'));
                setHTML('briefing-preview', emptyState('load_failed'));
                return;
            }
            var top5 = Array.isArray(latest.top5) ? latest.top5 : [];
            var grouping = groupTop5(top5);
            var sources = {};
            top5.forEach(function (item) {
                if (item.source_name) { sources[item.source_name] = true; }
            });
            var sourceCount = Object.keys(sources).length;

            // 3 gradient stat cards (blue / orange / green), live numbers.
            if (grid) {
                var cards = '';
                cards += '<a class="stat-card stat-blue" href="daily.html">' +
                    '<span class="stat-icon" aria-hidden="true">' + ICON_NEWS_BIG + '</span>' +
                    '<span class="stat-label">' + esc(t('stat_news')) + '</span>' +
                    '<span class="stat-num">' + esc(bnDigits(top5.length)) + ' <span class="stat-unit">' + esc(t('stat_news_unit')) + '</span></span>' +
                    '<span class="stat-meta">' + (latest.date ? esc(bnDate(latest.date)) : '') + '</span></a>';
                cards += '<a class="stat-card stat-orange" href="daily.html">' +
                    '<span class="stat-icon" aria-hidden="true">' + ICON_GLOBE_BIG + '</span>' +
                    '<span class="stat-label">' + esc(t('stat_sources')) + '</span>' +
                    '<span class="stat-num">' + esc(bnDigits(sourceCount)) + ' <span class="stat-unit">' + esc(t('stat_sources_unit')) + '</span></span>' +
                    '<span class="stat-meta">' + esc(t('last_updated')) + ': ' +
                    (latest.published_at ? esc(bnDatetime(latest.published_at)) + ' (' + esc(freshness(latest.published_at)) + ')' : '—') + '</span></a>';
                cards += '<a class="stat-card stat-green" href="daily.html">' +
                    '<span class="stat-icon" aria-hidden="true">' + ICON_CLOCK_BIG + '</span>' +
                    '<span class="stat-label">' + esc(t('stat_latest')) + '</span>' +
                    '<span class="stat-time">' + (latest.published_at ? esc(bnDatetime(latest.published_at)) : '—') + '</span>' +
                    '<span class="stat-meta">' + esc(t('next_briefing')) + ': ' + esc(nextDaily()) + '</span></a>';
                grid.innerHTML = cards;
            }

            // Chart title follows the grouping (category vs source).
            var chartTitle = document.getElementById('chart-title');
            if (chartTitle) {
                chartTitle.textContent = t(grouping.mode === 'category' ? 'chart_title_category' : 'chart_title');
            }
            var donutTitle = document.getElementById('donut-sources-title');
            if (donutTitle) {
                donutTitle.textContent = t(grouping.mode === 'category' ? 'donut_sources_title_category' : 'donut_sources_title');
            }
            setHTML('chart-bars', renderChart(grouping));
            setHTML('activity-list', renderActivity(collectActivity(latest)));
            setHTML('donut-sources', renderDonut(grouping));
            var dates = dateDistribution(top5, latest.date);
            if (dates) {
                setHTML('donut-dates', renderDonut(dates));
            } else {
                // A one-slice donut would say nothing — show upcoming dates.
                var donut2Title = document.getElementById('donut-dates-title');
                if (donut2Title) { donut2Title.textContent = t('upcoming_dates'); }
                setHTML('donut-dates', renderUpcoming(latest));
            }
            setHTML('briefing-preview', top5.length ? top5ListHTML(top5) : emptyState('no_briefings'));
        }).catch(function () {
            // loadDaily never rejects; this is a last-resort guard.
            updateLoadBanner([{ failed: true }]);
            setHTML('briefing-preview', emptyState('load_failed'));
        });
    }

    function renderDailyPage() {
        loadDaily().then(function (daily) {
            updateLoadBanner([daily]);
            var latest = daily.briefings[0] || null;
            setHTML('strip-daily', daily.failed ? emptyState('load_failed') : dailyStrip(latest));
            setHTML('latest-briefing', daily.failed ? emptyState('load_failed')
                : (latest ? dailyCard(latest) : emptyState('no_briefings')));
        }).catch(function () {
            updateLoadBanner([{ failed: true }]);
            setHTML('latest-briefing', emptyState('load_failed'));
        });
    }

    function renderArchive() {
        loadDaily().then(function (daily) {
            updateLoadBanner([daily]);
            var mount = document.getElementById('archive-content');
            if (!mount) { return; }
            if (daily.failed) { mount.innerHTML = emptyState('load_failed'); return; }
            if (!daily.briefings.length) { mount.innerHTML = emptyState('no_briefings'); return; }
            // Newest first (normaliseDaily already sorts by date desc).
            mount.innerHTML = '<div class="news-grid">' +
                daily.briefings.map(function (b) { return archiveCard(b); }).join('') + '</div>';
        }).catch(function () {
            updateLoadBanner([{ failed: true }]);
            var mount = document.getElementById('archive-content');
            if (mount) { mount.innerHTML = emptyState('load_failed'); }
        });
    }

    // ------------------------------------------------------------------
    // Boot.
    // ------------------------------------------------------------------
    applyLanguage();
    var page = (document.body && document.body.getAttribute('data-page')) || 'home';
    if (page === 'home') { renderHome(); }
    else if (page === 'daily') { renderDailyPage(); }
    else if (page === 'archive') { renderArchive(); }

    // Expose the pure helpers for local testing (window.SPIntel).
    window.SPIntel = {
        t: t, bnDatetime: bnDatetime, bnDate: bnDate, freshness: freshness,
        nextDaily: nextDaily,
        dailyCard: dailyCard, archiveCard: archiveCard,
        dailyStrip: dailyStrip,
        dashDateText: dashDateText,
        groupTop5: groupTop5, renderChart: renderChart, renderDonut: renderDonut,
        dateDistribution: dateDistribution, renderUpcoming: renderUpcoming,
        collectActivity: collectActivity, renderActivity: renderActivity,
        top5ListHTML: top5ListHTML,
        loadDaily: loadDaily,
        fetchWithTimeout: fetchWithTimeout, FETCH_TIMEOUT_MS: FETCH_TIMEOUT_MS
    };
})();
