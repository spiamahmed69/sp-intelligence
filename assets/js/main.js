/**
 * SP Intelligence — main.js (no dependencies)
 * Mobile menu, back-to-top, live Dhaka clock (Asia/Dhaka).
 */
(function () {
    'use strict';

    // --- Mobile menu -------------------------------------------------------
    var toggle = document.getElementById('menu-toggle');
    var menu = document.getElementById('mobile-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            var open = menu.hasAttribute('hidden');
            if (open) {
                menu.removeAttribute('hidden');
                toggle.setAttribute('aria-expanded', 'true');
            } else {
                menu.setAttribute('hidden', '');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
        menu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                menu.setAttribute('hidden', '');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !menu.hasAttribute('hidden')) {
                menu.setAttribute('hidden', '');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.focus();
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
