/**
 * SP Intelligence — app.js (static site, no dependencies)
 *
 * Client-side replacement for the PHP includes/ layer:
 *  - UI strings copied exactly from includes/lang (Bengali primary,
 *    English secondary). News content itself is always Bengali — it comes
 *    from data/*.json, exactly as on the PHP site.
 *  - Language: ?lang=bn|en wins, then localStorage, then Bengali default.
 *  - Renders news cards, daily briefing cards, freshness strips, "next
 *    update" times and empty states from Firebase Realtime Database
 *    (public read on /news), mirroring includes/cards and
 *    includes/functions exactly (same markup, same Bengali date format,
 *    same freshness wording). Local data/*.json files are kept as
 *    backup only — the live site never fetches them.
 *  - All times are Asia/Dhaka (UTC+6).
 */
(function () {
    'use strict';

    // ------------------------------------------------------------------
    // UI strings — exact copy of includes/lang, plus the few strings
    // that lived inline in the PHP pages (marked with a comment).
    // ------------------------------------------------------------------
    var STRINGS = {
        bn: {
            site_name: 'এসপি ইন্টেলিজেন্স',
            site_tagline: 'বাংলাদেশ ও বিশ্বের খবর — যাচাই করা, সময়মতো, সহজ বাংলায়',
            skip_to_content: 'মূল বিষয়বস্তুতে যান',
            home: 'হোম',
            menu: 'মেনু',
            section_10h: '১০ ঘণ্টার আপডেট',
            section_4h: '৪ ঘণ্টার আপডেট',
            section_2h: '২ ঘণ্টার আপডেট',
            section_daily: 'দৈনিক ব্রিফিং',
            archive: 'আর্কাইভ',
            language: 'ভাষা',
            hero_badge: 'যাচাই করা খবর · সহজ বাংলায়',
            hero_title: 'বাংলাদেশ ও বিশ্বের গুরুত্বপূর্ণ খবর, সময়মতো।',
            hero_title_gradient: 'যাচাই করা খবর, সহজ বাংলায়।',
            hero_subtitle: 'প্রতি ১০ ঘণ্টা ও প্রতি ৪ ঘণ্টায় নতুন আপডেট, আর প্রতিদিন সকাল ১০টায় দৈনিক ব্রিফিং। প্রতিটি খবরের সঙ্গে তার সূত্র দেওয়া থাকে — কোনো বানানো খবর নয়, কোনো গুজব নয়।',
            dash_kicker: 'সকালের ড্যাশবোর্ড',
            dash_title: 'একনজরে আজকের সব খবর',
            dash_subtitle: 'প্রতি ২, ৪ ও ১০ ঘণ্টায় নতুন আপডেট, আর প্রতিদিন সকাল ১০টায় দৈনিক ব্রিফিং। প্রতিটি খবরের সঙ্গে তার সূত্র দেওয়া থাকে — কোনো বানানো খবর নয়, কোনো গুজব নয়।',
            stat_top5: 'টি বিশেষ আপডেট',
            chart_title: 'প্রতি সেকশনে খবরের সংখ্যা',
            chart_note: 'সর্বশেষ আপডেটের তথ্য থেকে গণনা করা — কোনো অনুমান নয়।',
            chart_empty: 'এই মুহূর্তে কোনো সেকশনে নতুন খবর নেই।',
            recent_updates: 'সাম্প্রতিক আপডেট',
            no_recent: 'এখনো কোনো সাম্প্রতিক আপডেট নেই।',
            widget_weather: 'আবহাওয়া',
            widget_markets: 'ডলার ও বাজার',
            widget_soon: 'শীঘ্রই আসছে',
            widget_weather_text: 'ঢাকার আবহাওয়া ও তাপমাত্রা এখানে দেখা যাবে।',
            widget_markets_text: 'ডলারের হার ও বাজারের তথ্য এখানে দেখা যাবে।',
            hijri_approx: 'আনুমানিক',
            last_updated: 'সর্বশেষ আপডেট',
            next_update: 'পরের আপডেট',
            next_briefing: 'পরের ব্রিফিং',
            window_label: 'সময়সীমা',
            view_all: 'সব দেখুন',
            view_section: 'এই সেকশনের সব খবর',
            why_it_matters: 'কেন গুরুত্বপূর্ণ',
            source: 'সূত্র',
            published: 'প্রকাশ',
            top_5: 'আজকের বিশেষ ৫টি আপডেট',
            summary: 'সারসংক্ষেপ',
            upcoming_dates: 'সামনে যেসব তারিখ গুরুত্বপূর্ণ',
            islamic_note: 'ইসলামিক জ্ঞান',
            honesty_title: 'আমাদের প্রতিশ্রুতি',
            honesty_text: 'এই সাইটে কোনো বানানো খবর, ভুয়া তথ্য বা গুজব প্রকাশ করা হয় না। কোনো বিষয়ে নতুন তথ্য না থাকলে সেটি স্পষ্টভাবে জানানো হয়। প্রতিটি গুরুত্বপূর্ণ খবরের সঙ্গে প্রকাশের তারিখ ও মূল সূত্রের লিংক থাকে।',
            no_entries: 'এই মুহূর্তে এই সেকশনে কোনো নতুন তথ্য নেই। পরের আপডেটের সময় আবার দেখুন।',
            no_briefings: 'এখনো কোনো দৈনিক ব্রিফিং প্রকাশ হয়নি। প্রথম ব্রিফিং সকাল ১০টায় আসবে।',
            back_to_top: 'উপরে যান',
            footer_about: 'এসপি ইন্টেলিজেন্স একটি ব্যক্তিগত সংবাদ ও তথ্য সাইট। বাংলাদেশ ও বিশ্বের গুরুত্বপূর্ণ খবর সহজ বাংলায়, যাচাই করে প্রকাশ করা হয়।',
            footer_sections: 'সেকশন',
            footer_note: 'সব সময় বাংলাদেশ সময় (UTC+6) অনুযায়ী।',
            entries_count: 'টি খবর',
            briefings_count: 'টি ব্রিফিং',
            all_sections: 'সব সেকশন',
            dhaka_time: 'ঢাকার সময়',
            // Inline strings from the PHP pages (the PHP pages)
            section_10h_intro: 'গত ১০ ঘণ্টার গুরুত্বপূর্ণ খবর — প্রতিটি খবরের সঙ্গে তার সূত্র ও প্রকাশের সময় দেওয়া আছে।',
            section_4h_intro: 'দ্রুত আপডেট — গত ৪ ঘণ্টার সংক্ষিপ্ত খবর।',
            section_2h_intro: 'সবচেয়ে দ্রুত আপডেট — গত ২ ঘণ্টার সংক্ষিপ্ত খবর।',
            section_daily_intro: 'প্রতিদিন সকাল ১০টায় — দিনের সবচেয়ে গুরুত্বপূর্ণ ৫টি খবর, সারসংক্ষেপ ও সামনের তারিখ।',
            page_10h_intro: 'প্রতি ১০ ঘণ্টা পর এই সেকশন নতুন তথ্য দিয়ে আপডেট হয়। প্রতিটি খবরে শুধু তার আগের ১০ ঘণ্টার তথ্য থাকে।',
            page_4h_intro: 'প্রতি ৪ ঘণ্টা পর এই সেকশন নতুন তথ্য দিয়ে আপডেট হয়। সংক্ষিপ্ত খবর — প্রতিটি খবরে শুধু তার আগের ৪ ঘণ্টার তথ্য থাকে।',
            page_2h_intro: 'প্রতি ২ ঘণ্টা পর এই সেকশন নতুন তথ্য দিয়ে আপডেট হয়। সংক্ষিপ্ত খবর — প্রতিটি খবরে শুধু তার আগের ২ ঘণ্টার তথ্য থাকে।',
            page_daily_intro: 'প্রতিদিন সকাল ১০টায় প্রকাশিত ব্রিফিং — দিনের সবচেয়ে গুরুত্বপূর্ণ ৫টি খবর, সারসংক্ষেপ, সামনের গুরুত্বপূর্ণ তারিখ ও একটি ইসলামিক জ্ঞান।',
            page_archive_intro: 'আগের সব আপডেট এখানে তারিখ অনুযায়ী সাজানো আছে। নতুন আপডেট এলে পুরোনো তথ্য এখানেই থেকে যায়।',
            earlier_briefings: 'আগের ব্রিফিং',
            loading: 'লোড হচ্ছে…',
            page_desc_home: 'বাংলাদেশ ও বিশ্বের খবর — যাচাই করা, সময়মতো, সহজ বাংলায়',
            page_desc_10h: 'গত ১০ ঘণ্টার গুরুত্বপূর্ণ খবর — যাচাই করা, সূত্রসহ।',
            page_desc_4h: 'গত ৪ ঘণ্টার সংক্ষিপ্ত খবর — দ্রুত আপডেট।',
            page_desc_2h: 'গত ২ ঘণ্টার সংক্ষিপ্ত খবর — সবচেয়ে দ্রুত আপডেট।',
            page_desc_daily: 'প্রতিদিন সকাল ১০টায় দৈনিক ব্রিফিং — বিশেষ ৫টি খবর, সারসংক্ষেপ ও সামনের তারিখ।',
            page_desc_archive: 'আগের সব আপডেট ও ব্রিফিং — তারিখ অনুযায়ী সাজানো।'
        },
        en: {
            site_name: 'SP Intelligence',
            site_tagline: 'Bangladesh & world news — verified, on time, in simple Bengali',
            skip_to_content: 'Skip to main content',
            home: 'Home',
            menu: 'Menu',
            section_10h: '10-hour updates',
            section_4h: '4-hour updates',
            section_2h: '2-hour updates',
            section_daily: 'Daily briefing',
            archive: 'Archive',
            language: 'Language',
            hero_badge: 'Verified news · In simple Bengali',
            hero_title: 'Important news from Bangladesh and the world, on time.',
            hero_title_gradient: 'Verified news, in simple Bengali.',
            hero_subtitle: 'New updates every 10 hours and every 4 hours, plus a daily briefing at 10am. Every story carries its source — no invented news, no rumours.',
            dash_kicker: 'Morning dashboard',
            dash_title: 'Everything today, at a glance',
            dash_subtitle: 'New updates every 2, 4 and 10 hours, plus a daily briefing at 10am. Every story carries its source — no invented news, no rumours.',
            stat_top5: 'top updates',
            chart_title: 'Stories per section',
            chart_note: 'Counted live from the latest updates — no estimates.',
            chart_empty: 'No stories in any section right now.',
            recent_updates: 'Recent updates',
            no_recent: 'No recent updates yet.',
            widget_weather: 'Weather',
            widget_markets: 'Dollar & markets',
            widget_soon: 'Coming soon',
            widget_weather_text: 'Dhaka weather and temperature will appear here.',
            widget_markets_text: 'Dollar rate and market information will appear here.',
            hijri_approx: 'approx.',
            last_updated: 'Last updated',
            next_update: 'Next update',
            next_briefing: 'Next briefing',
            window_label: 'Window',
            view_all: 'View all',
            view_section: 'All news in this section',
            why_it_matters: 'Why it matters',
            source: 'Source',
            published: 'Published',
            top_5: 'Top 5 must-know updates',
            summary: 'Summary',
            upcoming_dates: 'Upcoming important dates',
            islamic_note: 'Islamic knowledge',
            honesty_title: 'Our promise',
            honesty_text: 'No invented news, false information or rumours are published here. When there is no new information on a topic, that is stated clearly. Every important story carries its publication date and a link to the original source.',
            no_entries: 'There is no new information in this section right now. Please check again at the next update.',
            no_briefings: 'No daily briefing has been published yet. The first briefing arrives at 10am.',
            back_to_top: 'Back to top',
            footer_about: 'SP Intelligence is a personal news and information site. Important news from Bangladesh and the world is published in simple Bengali, after verification.',
            footer_sections: 'Sections',
            footer_note: 'All times are Bangladesh time (UTC+6).',
            entries_count: 'stories',
            briefings_count: 'briefings',
            all_sections: 'All sections',
            dhaka_time: 'Dhaka time',
            section_10h_intro: 'The important news of the last 10 hours — every story with its source and publication time.',
            section_4h_intro: 'Fast updates — short news from the last 4 hours.',
            section_2h_intro: 'Fastest updates — short news from the last 2 hours.',
            section_daily_intro: 'Every day at 10am — the 5 most important stories, a summary and upcoming dates.',
            page_10h_intro: 'This section is updated with new information every 10 hours. Each story covers only the previous 10 hours.',
            page_4h_intro: 'This section is updated with new information every 4 hours. Short stories — each covers only the previous 4 hours.',
            page_2h_intro: 'This section is updated with new information every 2 hours. Short stories — each covers only the previous 2 hours.',
            page_daily_intro: 'Briefing published every day at 10am — the 5 most important stories, a summary, upcoming dates and one piece of Islamic knowledge.',
            page_archive_intro: 'All earlier updates are grouped here by date. When a new update arrives, the older information stays here.',
            earlier_briefings: 'Earlier briefings',
            loading: 'Loading…',
            page_desc_home: 'Bangladesh & world news — verified, on time, in simple Bengali',
            page_desc_10h: 'Important news of the last 10 hours — verified, with sources.',
            page_desc_4h: 'Short news from the last 4 hours — fast updates.',
            page_desc_2h: 'Short news from the last 2 hours — the fastest updates.',
            page_desc_daily: 'Daily briefing every day at 10am — top 5 stories, summary and upcoming dates.',
            page_desc_archive: 'All earlier updates and briefings — grouped by date.'
        }
    };

    // Page titles / descriptions, mirroring what each PHP page set.
    var PAGE_META = {
        home:    { titleKey: 'home',          descKey: 'page_desc_home' },
        '10h':   { titleKey: 'section_10h',   descKey: 'page_desc_10h' },
        '4h':    { titleKey: 'section_4h',    descKey: 'page_desc_4h' },
        '2h':    { titleKey: 'section_2h',    descKey: 'page_desc_2h' },
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
        // Page title + meta description (mirrors header).
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
        // Footer year (PHP used date('Y')).
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
    // Bengali dates / times — exact port of functions.
    // All times are Asia/Dhaka.
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
    // (PHP freshness_bn — Bengali wording in both languages, as on the PHP site.)
    function freshness(iso) {
        var ts = new Date(iso).getTime();
        if (isNaN(ts)) { return ''; }
        var diff = Math.floor((Date.now() - ts) / 1000);
        if (diff < 60) { return 'এইমাত্র'; }
        if (diff < 3600) { return bnDigits(Math.max(1, Math.floor(diff / 60))) + ' মিনিট আগে'; }
        if (diff < 86400) { return bnDigits(Math.floor(diff / 3600)) + ' ঘণ্টা আগে'; }
        return bnDigits(Math.floor(diff / 86400)) + ' দিন আগে';
    }

    // Next update for an interval feed: last_updated + interval hours.
    function nextUpdate(meta) {
        var last = meta.last_updated || '';
        var hours = parseInt(meta.interval_hours || 0, 10);
        if (!last || hours <= 0) { return ''; }
        var ts = new Date(last).getTime();
        if (isNaN(ts)) { return ''; }
        return bnDatetime(new Date(ts + hours * 3600 * 1000).toISOString());
    }

    // Next daily briefing: today 10:00 Dhaka if it has not passed, else tomorrow 10:00.
    function nextDaily() {
        var now = dhakaParts(new Date());
        var pad = function (n) { return (n < 10 ? '0' : '') + n; };
        var base = now.year + '-' + pad(now.month) + '-' + pad(now.day);
        var today10 = new Date(base + 'T10:00:00+06:00').getTime();
        var target = Date.now() < today10 ? today10 : today10 + 86400 * 1000;
        return bnDatetime(new Date(target).toISOString());
    }

    // ------------------------------------------------------------------
    // Escaping + card renderers — exact port of includes/cards.
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

    function entryCard(e) {
        var html = '<article class="card news-card"><div class="card-top">';
        html += '<span class="badge badge-blue">' + ICON_LIST + esc(e.category || '') + '</span>';
        if (e.window) {
            html += '<span class="badge badge-soft">' + ICON_CLOCK + esc(e.window) + '</span>';
        }
        html += '</div><h3>' + esc(e.title || '') + '</h3>';
        if (e.summary) { html += '<p>' + esc(e.summary) + '</p>'; }
        if (e.why_it_matters) {
            html += '<p class="why-box"><strong>' + esc(t('why_it_matters')) + ':</strong> ' + esc(e.why_it_matters) + '</p>';
        }
        html += '<p class="card-meta">';
        if (e.published_at) {
            html += '<span>' + ICON_CAL + ' ' + esc(bnDatetime(e.published_at)) +
                ' <span class="freshness">(' + esc(freshness(e.published_at)) + ')</span></span>';
        } else if (e.published_date) {
            html += '<span>' + esc(t('published')) + ': ' + esc(bnDate(e.published_date)) + '</span>';
        }
        if (e.source_name && e.source_url) {
            html += '<span class="source">' + esc(t('source')) + ': <a href="' + esc(e.source_url) +
                '" target="_blank" rel="noopener">' + esc(e.source_name) + '</a></span>';
        } else if (e.source_name) {
            html += '<span class="source">' + esc(t('source')) + ': ' + esc(e.source_name) + '</span>';
        }
        html += '</p></article>';
        return html;
    }

    function dailyCard(b, full) {
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
            html += '<h3>' + esc(t('top_5')) + '</h3><ol class="top5-list">';
            top5.forEach(function (item) {
                html += '<li><strong>' + esc(item.title || '') + '</strong>';
                if (item.summary) { html += '<span>' + esc(item.summary) + '</span>'; }
                html += '</li>';
            });
            html += '</ol>';
        }
        if (full && b.summary) {
            html += '<h3>' + esc(t('summary')) + '</h3><p>' + esc(b.summary) + '</p>';
        }
        var upcoming = Array.isArray(b.upcoming) ? b.upcoming : [];
        if (full && upcoming.length) {
            html += '<h3>' + esc(t('upcoming_dates')) + '</h3><ul class="upcoming-list">';
            upcoming.forEach(function (u) {
                html += '<li>';
                if (u.date) { html += '<strong>' + esc(bnDate(u.date)) + ':</strong> '; }
                html += esc(u.text || '') + '</li>';
            });
            html += '</ul>';
        }
        if (full && b.islamic_note) {
            html += '<h3>' + esc(t('islamic_note')) + '</h3><p class="islamic-note">' + esc(b.islamic_note) + '</p>';
        }
        html += '</article>';
        return html;
    }

    function freshnessStrip(meta, nextLabelKey) {
        var last = meta.last_updated || '';
        var next = nextUpdate(meta);
        var html = '<p class="freshness-strip" role="status"><span>' + ICON_CLOCK.replace('width="14" height="14"', 'width="16" height="16"') +
            ' <strong>' + esc(t('last_updated')) + ':</strong> ' +
            (last ? esc(bnDatetime(last)) + ' (' + esc(freshness(last)) + ')' : '—') + '</span>';
        if (meta.window_start && meta.window_end) {
            html += '<span><strong>' + esc(t('window_label')) + ':</strong> ' +
                esc(bnDatetime(meta.window_start)) + ' – ' + esc(bnDatetime(meta.window_end)) + '</span>';
        }
        if (next) {
            html += '<span><strong>' + esc(t(nextLabelKey)) + ':</strong> ' + esc(next) + '</span>';
        }
        html += '</p>';
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
    // Data loading (mirrors load_feed() / load_daily() in functions).
    // Live source is Firebase Realtime Database, public read on /news:
    //   <databaseURL>/news/10h.json, /news/4h.json, /news/2h.json,
    //   /news/daily.json  (REST endpoints, no auth needed for reading)
    // ------------------------------------------------------------------
    var FB_BASE = 'https://sp-intelligence-fbbf9-default-rtdb.asia-southeast1.firebasedatabase.app/news';

    function loadJSON(url) {
        return fetch(url, { cache: 'no-cache' }).then(function (res) {
            if (!res.ok) { throw new Error('HTTP ' + res.status + ' for ' + url); }
            return res.json();
        });
    }

    function loadFeed(file) {
        return loadJSON(FB_BASE + '/' + file).then(function (data) {
            var meta = (data && data.meta) || {};
            var entries = Array.isArray(data.entries) ? data.entries.slice() : [];
            entries.sort(function (a, b) {
                return String(b.published_at || '').localeCompare(String(a.published_at || ''));
            });
            return { meta: meta, entries: entries };
        }).catch(function (err) {
            if (window.console) { console.warn(err); }
            return { meta: {}, entries: [] };
        });
    }

    function loadDaily() {
        return loadJSON(FB_BASE + '/daily.json').then(function (data) {
            var meta = (data && data.meta) || {};
            var briefings = Array.isArray(data.briefings) ? data.briefings.slice() : [];
            briefings.sort(function (a, b) {
                return String(b.date || '').localeCompare(String(a.date || ''));
            });
            return { meta: meta, briefings: briefings };
        }).catch(function (err) {
            if (window.console) { console.warn(err); }
            return { meta: {}, briefings: [] };
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
    // Dashboard helpers — stat cards, date line, rail panels.
    // ------------------------------------------------------------------
    var ICON_BOLT = '<svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>';
    var ICON_CLOCK_BIG = '<svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 10.6 4.2 2.5-.8 1.3L11 13.5V7h2z"/></svg>';
    var ICON_STOPWATCH = '<svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 4a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7zm1-3h-2v2h2zm4.2 1.6-1.4 1.4 1.4 1.4 1.4-1.4zM11 7h2v6l4.2 2.5-.9 1.5L11 14z"/></svg>';
    var ICON_CAL_BIG = '<svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2zm12 8v10H5V10z"/></svg>';

    // One gradient stat card per sector: big count + last / next update.
    // count + unit are passed in so the daily card can count top-5 items.
    function statCard(opts) {
        var html = '<a class="stat-card ' + esc(opts.tone) + '" href="' + esc(opts.href) + '">';
        html += '<span class="stat-icon" aria-hidden="true">' + opts.icon + '</span>';
        html += '<span class="stat-label">' + esc(opts.label) + '</span>';
        html += '<span class="stat-num">' + esc(bnDigits(opts.count)) + ' <span class="stat-unit">' + esc(opts.unit) + '</span></span>';
        html += '<span class="stat-meta">' + esc(t('last_updated')) + ': ' +
            (opts.last ? esc(bnDatetime(opts.last)) + ' (' + esc(freshness(opts.last)) + ')' : '—') + '</span>';
        if (opts.next) {
            html += '<span class="stat-meta">' + esc(t('next_update')) + ': ' + esc(opts.next) + '</span>';
        }
        html += '</a>';
        return html;
    }

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

    // ------------------------------------------------------------------
    // Homepage chart + activity feed + simple sector lists.
    // All numbers come from the real Firebase data — nothing invented.
    // ------------------------------------------------------------------

    // Story counts per section, straight from the loaded feeds.
    // Daily counts the latest briefing's top-5 items (same as its stat card).
    function chartCounts(feed10, feed4, feed2, latest) {
        return [
            { key: '10h', label: t('section_10h'), count: feed10.entries.length, tone: 'blue', href: '10-ghonta.html' },
            { key: '4h', label: t('section_4h'), count: feed4.entries.length, tone: 'orange', href: '4-ghonta.html' },
            { key: '2h', label: t('section_2h'), count: feed2.entries.length, tone: 'violet', href: '2-ghonta.html' },
            { key: 'daily', label: t('section_daily'), count: latest ? (latest.top5 || []).length : 0, tone: 'green', href: 'daily.html' }
        ];
    }

    // Simple horizontal bar chart: one bar per section, labelled with its
    // real count. Bar width is relative to the largest section.
    function renderChart(counts) {
        var max = 0;
        counts.forEach(function (c) { if (c.count > max) { max = c.count; } });
        if (max <= 0) { return emptyState('chart_empty'); }
        var html = '<ul class="chart-rows">';
        counts.forEach(function (c) {
            var pct = Math.round((c.count / max) * 100);
            html += '<li><div class="chart-row-label"><span>' + esc(c.label) + '</span>' +
                '<span class="chart-value">' + esc(bnDigits(c.count)) + '</span></div>' +
                '<div class="chart-track"><div class="chart-fill chart-fill-' + esc(c.tone) +
                '" style="width:' + pct + '%"></div></div></li>';
        });
        return html + '</ul>';
    }

    // Newest items across all four sections, newest first (max 8).
    // Feed entries carry their own published_at; daily top-5 items share
    // their briefing's published_at. Each item links to its source.
    function collectActivity(feed10, feed4, feed2, latest) {
        var items = [];
        var feeds = [
            { feed: feed10, label: t('section_10h'), href: '10-ghonta.html', tone: 'blue' },
            { feed: feed4, label: t('section_4h'), href: '4-ghonta.html', tone: 'orange' },
            { feed: feed2, label: t('section_2h'), href: '2-ghonta.html', tone: 'violet' }
        ];
        feeds.forEach(function (f) {
            f.feed.entries.forEach(function (e) {
                items.push({ title: e.title || '', url: e.source_url || f.href,
                    source: e.source_name || '', section: f.label,
                    time: e.published_at || '', tone: f.tone });
            });
        });
        if (latest) {
            var top5 = Array.isArray(latest.top5) ? latest.top5 : [];
            top5.forEach(function (item) {
                items.push({ title: item.title || '', url: 'daily.html', source: '',
                    section: t('section_daily'), time: latest.published_at || '', tone: 'green' });
            });
        }
        items.sort(function (a, b) {
            return String(b.time || '').localeCompare(String(a.time || ''));
        });
        return items.slice(0, 8);
    }

    function renderActivity(items) {
        if (!items.length) {
            return '<li class="activity-empty">' + esc(t('no_recent')) + '</li>';
        }
        return items.map(function (item) {
            var meta = [];
            if (item.source) { meta.push(esc(item.source)); }
            meta.push(esc(item.section));
            if (item.time) { meta.push(esc(freshness(item.time))); }
            var ext = item.url.indexOf('://') !== -1 ? ' target="_blank" rel="noopener"' : '';
            return '<li><span class="activity-dot activity-dot-' + esc(item.tone) +
                '" aria-hidden="true"></span><span class="activity-body"><a href="' +
                esc(item.url) + '"' + ext + '>' + esc(item.title) + '</a>' +
                '<span class="activity-meta">' + meta.join(' · ') + '</span></span></li>';
        }).join('');
    }

    // Homepage sector panel: latest 3 items, title + time only.
    function simpleFeedList(entries, href) {
        var list = (entries || []).slice(0, 3);
        if (!list.length) {
            return '<li class="sector-empty">' + esc(t('no_entries')) + '</li>';
        }
        return list.map(function (e) {
            var url = e.source_url || href;
            var ext = url.indexOf('://') !== -1 ? ' target="_blank" rel="noopener"' : '';
            var when = e.published_at
                ? esc(bnDatetime(e.published_at)) + ' (' + esc(freshness(e.published_at)) + ')'
                : '';
            return '<li><a href="' + esc(url) + '"' + ext + '>' + esc(e.title || '') + '</a>' +
                '<span class="sector-time">' + when + '</span></li>';
        }).join('');
    }

    // Daily panel: latest briefing's top-5 titles + briefing time.
    function simpleDailyList(latest) {
        if (!latest) {
            return '<li class="sector-empty">' + esc(t('no_briefings')) + '</li>';
        }
        var top5 = Array.isArray(latest.top5) ? latest.top5 : [];
        if (!top5.length) {
            return '<li class="sector-empty">' + esc(t('no_briefings')) + '</li>';
        }
        var when = latest.published_at ? bnDatetime(latest.published_at)
            : (latest.date ? bnDate(latest.date) : '');
        return top5.map(function (item) {
            return '<li><a href="daily.html">' + esc(item.title || '') + '</a>' +
                '<span class="sector-time">' + esc(when) + '</span></li>';
        }).join('');
    }

    // ------------------------------------------------------------------
    // Page drivers.
    // ------------------------------------------------------------------
    function renderHome() {
        renderDashDate();
        Promise.all([loadFeed('10h.json'), loadFeed('4h.json'), loadFeed('2h.json'), loadDaily()]).then(function (res) {
            var feed10 = res[0], feed4 = res[1], feed2 = res[2], daily = res[3];
            var latest = daily.briefings[0] || null;
            // Stat cards — one per sector, newest count + last/next update.
            setHTML('stat-grid', [
                statCard({ tone: 'stat-blue', href: '10-ghonta.html', icon: ICON_CLOCK_BIG,
                    label: t('section_10h'), count: feed10.entries.length, unit: t('entries_count'),
                    last: feed10.meta.last_updated || '', next: nextUpdate(feed10.meta) }),
                statCard({ tone: 'stat-orange', href: '4-ghonta.html', icon: ICON_BOLT,
                    label: t('section_4h'), count: feed4.entries.length, unit: t('entries_count'),
                    last: feed4.meta.last_updated || '', next: nextUpdate(feed4.meta) }),
                statCard({ tone: 'stat-violet', href: '2-ghonta.html', icon: ICON_STOPWATCH,
                    label: t('section_2h'), count: feed2.entries.length, unit: t('entries_count'),
                    last: feed2.meta.last_updated || '', next: nextUpdate(feed2.meta) }),
                statCard({ tone: 'stat-green', href: 'daily.html', icon: ICON_CAL_BIG,
                    label: t('section_daily'), count: latest ? (latest.top5 || []).length : 0, unit: t('stat_top5'),
                    last: latest ? (latest.published_at || '') : '', next: nextDaily() })
            ].join(''));
            // Chart (real counts) + activity feed (newest first).
            setHTML('chart-bars', renderChart(chartCounts(feed10, feed4, feed2, latest)));
            setHTML('activity-list', renderActivity(collectActivity(feed10, feed4, feed2, latest)));
            // Four sector panels — latest 3 items, title + time only.
            setHTML('list-10h', simpleFeedList(feed10.entries, '10-ghonta.html'));
            setHTML('list-4h', simpleFeedList(feed4.entries, '4-ghonta.html'));
            setHTML('list-2h', simpleFeedList(feed2.entries, '2-ghonta.html'));
            setHTML('list-daily', simpleDailyList(latest));
        });
    }

    function renderFeedPage(file, sectionKey) {
        loadFeed(file).then(function (feed) {
            setHTML('strip-feed', freshnessStrip(feed.meta, 'next_update'));
            var count = document.getElementById('count-chip');
            if (count) {
                count.textContent = bnDigits(feed.entries.length) + ' ' + t('entries_count');
            }
            setHTML('grid-feed', feed.entries.length
                ? '<div class="news-grid">' + feed.entries.map(entryCard).join('') + '</div>'
                : emptyState('no_entries'));
        });
    }

    function renderDailyPage() {
        loadDaily().then(function (daily) {
            var briefings = daily.briefings;
            var latest = briefings[0] || null;
            var older = briefings.slice(1);
            setHTML('strip-daily', dailyStrip(latest));
            setHTML('latest-briefing', latest ? dailyCard(latest, true) : emptyState('no_briefings'));
            var wrap = document.getElementById('older-wrap');
            if (older.length) {
                setHTML('older-briefings', older.map(function (b) { return dailyCard(b, false); }).join(''));
                if (wrap) { wrap.hidden = false; }
            } else if (wrap) {
                wrap.hidden = true;
            }
        });
    }

    function renderArchive() {
        var section = '10h';
        try {
            var s = new URLSearchParams(window.location.search).get('section');
            if (s === '4h' || s === '2h' || s === 'daily') { section = s; }
        } catch (e) { /* default 10h */ }
        document.querySelectorAll('[data-archive-tab]').forEach(function (tab) {
            if (tab.getAttribute('data-archive-tab') === section) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        var mount = document.getElementById('archive-content');
        if (!mount) { return; }
        if (section === 'daily') {
            loadDaily().then(function (daily) {
                if (!daily.briefings.length) { mount.innerHTML = emptyState('no_briefings'); return; }
                var grouped = {};
                daily.briefings.forEach(function (b) {
                    var k = b.date || '';
                    (grouped[k] = grouped[k] || []).push(b);
                });
                mount.innerHTML = Object.keys(grouped).sort().reverse().map(function (date) {
                    var items = grouped[date];
                    return '<h3 class="archive-date">' + esc(bnDate(date)) + ' — ' +
                        esc(bnDigits(items.length)) + ' ' + esc(t('briefings_count')) + '</h3>' +
                        '<div class="news-grid">' + items.map(function (b) { return dailyCard(b, false); }).join('') + '</div>';
                }).join('');
            });
        } else {
            var feedFiles = { '10h': '10h.json', '4h': '4h.json', '2h': '2h.json' };
            loadFeed(feedFiles[section] || '10h.json').then(function (feed) {
                if (!feed.entries.length) { mount.innerHTML = emptyState('no_entries'); return; }
                var grouped = {};
                feed.entries.forEach(function (e) {
                    var k = e.published_date || String(e.published_at || '').slice(0, 10);
                    (grouped[k] = grouped[k] || []).push(e);
                });
                mount.innerHTML = Object.keys(grouped).sort().reverse().map(function (date) {
                    var items = grouped[date];
                    return '<h3 class="archive-date">' + esc(bnDate(date)) + ' — ' +
                        esc(bnDigits(items.length)) + ' ' + esc(t('entries_count')) + '</h3>' +
                        '<div class="news-grid">' + items.map(entryCard).join('') + '</div>';
                }).join('');
            });
        }
    }

    // ------------------------------------------------------------------
    // Boot.
    // ------------------------------------------------------------------
    applyLanguage();
    var page = (document.body && document.body.getAttribute('data-page')) || 'home';
    if (page === 'home') { renderHome(); }
    else if (page === '10h') { renderFeedPage('10h.json', '10h'); }
    else if (page === '4h') { renderFeedPage('4h.json', '4h'); }
    else if (page === '2h') { renderFeedPage('2h.json', '2h'); }
    else if (page === 'daily') { renderDailyPage(); }
    else if (page === 'archive') { renderArchive(); }

    // Expose the pure helpers for local testing (window.SPIntel).
    window.SPIntel = {
        t: t, bnDatetime: bnDatetime, bnDate: bnDate, freshness: freshness,
        nextUpdate: nextUpdate, nextDaily: nextDaily,
        entryCard: entryCard, dailyCard: dailyCard,
        freshnessStrip: freshnessStrip, dailyStrip: dailyStrip,
        statCard: statCard, dashDateText: dashDateText,
        chartCounts: chartCounts, renderChart: renderChart,
        collectActivity: collectActivity, renderActivity: renderActivity,
        simpleFeedList: simpleFeedList, simpleDailyList: simpleDailyList
    };
})();
