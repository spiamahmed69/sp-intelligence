/**
 * SP Intelligence — main.js (no dependencies)
 * Mobile menu, back-to-top, live Dhaka clock (Asia/Dhaka).
 */
(function () {
    'use strict';

    // --- Sidebar drawer (mobile / tablet) ----------------------------------
    // On desktop (>=1024px) the sidebar is always visible; below that the
    // top-bar button opens it as an overlay drawer.
    var sidebarToggle = document.getElementById('sidebar-toggle');
    var sidebar = document.getElementById('sidebar');
    var backdrop = document.getElementById('sidebar-backdrop');
    function closeSidebar() {
        document.body.classList.remove('sidebar-open');
        if (backdrop) { backdrop.hidden = true; }
        if (sidebarToggle) { sidebarToggle.setAttribute('aria-expanded', 'false'); }
    }
    function openSidebar() {
        document.body.classList.add('sidebar-open');
        if (backdrop) { backdrop.hidden = false; }
        if (sidebarToggle) { sidebarToggle.setAttribute('aria-expanded', 'true'); }
    }
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function () {
            if (document.body.classList.contains('sidebar-open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
        if (backdrop) {
            backdrop.addEventListener('click', closeSidebar);
        }
        sidebar.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeSidebar);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && document.body.classList.contains('sidebar-open')) {
                closeSidebar();
                sidebarToggle.focus();
            }
        });
    }

    // --- Back to top -------------------------------------------------------
    var topBtn = document.getElementById('back-to-top');
    if (topBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                topBtn.removeAttribute('hidden');
            } else {
                topBtn.setAttribute('hidden', '');
            }
        }, { passive: true });
        topBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Live Dhaka clock (top bar) ---------------------------------------
    var clock = document.getElementById('dhaka-clock');
    function tickClock() {
        if (!clock) {
            return;
        }
        try {
            var fmt = new Intl.DateTimeFormat('bn-BD', {
                timeZone: 'Asia/Dhaka',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                weekday: 'short',
                day: 'numeric',
                month: 'short'
            });
            clock.textContent = fmt.format(new Date());
        } catch (e) {
            clock.textContent = new Date().toLocaleString();
        }
    }
    if (clock) {
        tickClock();
        setInterval(tickClock, 30000);
    }
})();
