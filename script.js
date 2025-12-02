// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function () {
	const toggle = document.querySelector('.nav-toggle');
	const nav = document.getElementById('main-navigation');
	const closeButton = document.querySelector('.mobile-menu-close');

	if (!toggle || !nav) return;

	// Toggle menu
	toggle.addEventListener('click', function () {
		const expanded = this.getAttribute('aria-expanded') === 'true';
		this.setAttribute('aria-expanded', String(!expanded));
		nav.classList.toggle('mobile-open');
		document.body.style.overflow = !expanded ? 'hidden' : '';
	});

	// Close button
	if (closeButton) {
		closeButton.addEventListener('click', function () {
			nav.classList.remove('mobile-open');
			toggle.setAttribute('aria-expanded', 'false');
			document.body.style.overflow = '';
		});
	}

	// Close mobile nav when a link is clicked
	nav.addEventListener('click', function (e) {
		if (e.target.tagName === 'A') {
			nav.classList.remove('mobile-open');
			toggle.setAttribute('aria-expanded', 'false');
			document.body.style.overflow = '';
		}
	});
  
	// Close mobile nav with Escape key and allow toggle with keyboard
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') {
			if (nav.classList.contains('mobile-open')) {
				nav.classList.remove('mobile-open');
				toggle.setAttribute('aria-expanded', 'false');
				document.body.style.overflow = '';
				toggle.focus();
			}
		}
	});

	// Focus trap for mobile nav when opened: keep Tab inside the nav
	let focusableInNav = [];
	let firstFocusable = null;
	let lastFocusable = null;

	function updateFocusable() {
		const selectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
		focusableInNav = Array.from(nav.querySelectorAll(selectors)).filter(el => el.offsetParent !== null);
		firstFocusable = focusableInNav[0] || null;
		lastFocusable = focusableInNav[focusableInNav.length - 1] || null;
	}

	// Watch for toggle changes to enable/disable trap
	const observer = new MutationObserver(() => {
		const opened = nav.classList.contains('mobile-open');
		if (opened) {
			// update list and move focus to first element
			updateFocusable();
			if (firstFocusable) firstFocusable.focus();
			nav.setAttribute('aria-hidden', 'false');
			document.body.style.overflow = 'hidden';
		} else {
			nav.setAttribute('aria-hidden', 'true');
			document.body.style.overflow = '';
		}
	});
	observer.observe(nav, { attributes: true, attributeFilter: ['class'] });

	// Trap tabbing inside nav
	document.addEventListener('keydown', function (e) {
		if (!nav.classList.contains('mobile-open')) return;
		if (e.key !== 'Tab') return;

		updateFocusable();
		if (!firstFocusable || !lastFocusable) return;

		if (e.shiftKey) {
			// Shift + Tab
			if (document.activeElement === firstFocusable) {
				e.preventDefault();
				lastFocusable.focus();
			}
		} else {
			// Tab
			if (document.activeElement === lastFocusable) {
				e.preventDefault();
				firstFocusable.focus();
			}
		}
	});
});