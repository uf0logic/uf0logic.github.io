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
<<<<<<< HEAD
});

// Scroll-based logo animation
(function() {
	// Development mode flag - set to false in production
	const DEV_MODE = false; // Change to false to disable console logs
	
	// Dynamic frame counts based on resolution
	const FRAME_COUNTS = {
		'Logo1920': 181, // Logo0000.png to Logo0180.png
		'Logo1366': 181, // Logo0000.png to Logo0180.png
		'Logo768': 121,  // Logo0000.png to Logo0120.png
		'Logo320': 73    // Logo0000.png to Logo0072.png
	};

	// Configuration constants
	const MAX_CACHE_SIZE = 500; // Maximum number of cached frames
	const MAX_RETRY_ATTEMPTS = 5; // Maximum retry attempts for failed image loads
	const MAX_INIT_RETRIES = 50; // Maximum initialization retries (5 seconds)
	const PRELOAD_THROTTLE_DELAY = 200; // Throttle preloading to every 200ms
	const IMAGE_RETRY_DELAY = 1000; // Delay before retrying failed image load

	let heroBg = null;
	let servicesBg = null;

	let lastScrollY = window.scrollY;
	let currentFrame = 0;
	let scrollDirection = 1; // 1 for down, -1 for up
	let imageCache = {}; // Cache loaded images to prevent flickering
	let currentResolution = null;
	let totalFrames = 181; // Default fallback
	let initRetryCount = 0; // Track initialization retry attempts
	let lastPreloadTime = 0; // Track last preload operation time
	let scrollHandler = null; // Store scroll handler for cleanup
	let resizeHandler = null; // Store resize handler for cleanup
	let scrollTimeout = null; // Store scroll timeout for cleanup
	let resizeTimeout = null; // Store resize timeout for cleanup
	let frameSequence = 0; // Track frame sequence to prevent race conditions
	let failedFrames = {}; // Track failed frame loads with retry counts
	
	// Resolution breakpoints matching the folder structure
	function getResolutionFolder() {
		const width = window.innerWidth;
		if (width >= 1920) return 'Logo1920';
		if (width >= 1366) return 'Logo1366';
		if (width >= 768) return 'Logo768';
		return 'Logo320';
	}
	
	// Format frame number with leading zeros (e.g., 0 -> "0000", 180 -> "0180")
	function formatFrameNumber(frame) {
		return String(frame).padStart(4, '0');
	}

	// Get total frames for current resolution
	function getTotalFrames() {
		const folder = getResolutionFolder();
		return FRAME_COUNTS[folder] || 181; // Fallback to 181
	}

	// Update resolution and total frames
	function updateResolution() {
		const newResolution = getResolutionFolder();
		if (newResolution !== currentResolution) {
			currentResolution = newResolution;
			totalFrames = getTotalFrames();
			if (DEV_MODE) {
				console.log('Resolution changed to:', currentResolution, 'with', totalFrames, 'frames');
			}
			return true;
		}
		return false;
	}
	
	// Clean up image cache to prevent memory leaks
	function cleanupImageCache() {
		const cacheKeys = Object.keys(imageCache);
		if (cacheKeys.length > MAX_CACHE_SIZE) {
			// Remove oldest entries (simple FIFO approach)
			const keysToRemove = cacheKeys.slice(0, cacheKeys.length - MAX_CACHE_SIZE);
			keysToRemove.forEach(key => {
				delete imageCache[key];
			});
			if (DEV_MODE) {
				console.log('Cleaned up', keysToRemove.length, 'cached frames');
			}
		}
	}

	// Get frame path
	function getFramePath(frame) {
		const folder = getResolutionFolder();
		const frameNum = formatFrameNumber(frame);
		// Updated folder path without spaces
		return `assets/Logo/${folder}/Logo${frameNum}.png`;
	}
	
	// Preload a single frame image with retry logic
	function preloadFrame(frame, retryCount = 0) {
		if (imageCache[frame]) {
			return; // Already cached
		}
		
		// Skip if frame has exceeded max retry attempts
		if (failedFrames[frame] && failedFrames[frame] >= MAX_RETRY_ATTEMPTS) {
			return;
		}
		
		const framePath = getFramePath(frame);
		const img = new Image();
		const frameSeq = ++frameSequence; // Track sequence to prevent race conditions
		
		img.onload = () => {
			// Only cache if this is still the latest request for this frame
			if (frameSeq >= (failedFrames[frame + '_seq'] || 0)) {
				imageCache[frame] = framePath;
				delete failedFrames[frame];
				delete failedFrames[frame + '_seq'];
				cleanupImageCache(); // Prevent memory leaks
			}
		};
		
		img.onerror = () => {
			if (DEV_MODE) {
				console.warn('Failed to preload frame:', frame, framePath, 'Retry:', retryCount);
			}
			
			// Track failed attempts
			failedFrames[frame] = (failedFrames[frame] || 0) + 1;
			failedFrames[frame + '_seq'] = frameSeq;
			
			// Retry if under max attempts
			if (failedFrames[frame] < MAX_RETRY_ATTEMPTS) {
				setTimeout(() => {
					preloadFrame(frame, failedFrames[frame]);
				}, IMAGE_RETRY_DELAY * (failedFrames[frame] || 1));
			}
		};
		
		img.src = framePath;
	}
	
	// Aggressive preloading to ensure smooth experience (throttled)
	function preloadAdjacentFrames(centerFrame) {
		// Throttle preloading to avoid excessive operations
		const now = Date.now();
		if (now - lastPreloadTime < PRELOAD_THROTTLE_DELAY) {
			return;
		}
		lastPreloadTime = now;

		// Validate totalFrames to prevent division by zero
		if (totalFrames <= 0) {
			return;
		}

		const directionMultiplier = scrollDirection > 0 ? 1 : -1;
		const aheadRange = 15; // Preload more frames ahead
		const behindRange = 5;  // Fewer frames behind

		// Preload frames ahead (in scroll direction)
		for (let i = 0; i <= aheadRange; i++) {
			let frameToPreload = centerFrame + (i * directionMultiplier);

			// Handle wrapping
			if (frameToPreload < 0) {
				frameToPreload = totalFrames + frameToPreload;
			} else if (frameToPreload >= totalFrames) {
				frameToPreload = frameToPreload % totalFrames;
			}

			if (!imageCache[frameToPreload]) {
				preloadFrame(frameToPreload);
			}
		}

		// Preload frames behind (opposite direction)
		for (let i = 1; i <= behindRange; i++) {
			let frameToPreload = centerFrame - (i * directionMultiplier);

			// Handle wrapping
			if (frameToPreload < 0) {
				frameToPreload = totalFrames + frameToPreload;
			} else if (frameToPreload >= totalFrames) {
				frameToPreload = frameToPreload % totalFrames;
			}

			if (!imageCache[frameToPreload]) {
				preloadFrame(frameToPreload);
			}
		}
	}
	
	// Update background images with fallback handling and race condition prevention
	function updateBackgrounds(frame) {
		if (!heroBg || !servicesBg) {
			return;
		}

		// Validate frame is within bounds
		if (frame < 0 || frame >= totalFrames) {
			return;
		}

		const framePath = getFramePath(frame);
		const frameSeq = ++frameSequence; // Track sequence to prevent race conditions

		// Check if image is cached and loaded
		if (imageCache[frame]) {
			// Image is ready, update immediately
			const bgValue = `url("${framePath}")`;
			heroBg.style.backgroundImage = bgValue;
			servicesBg.style.backgroundImage = bgValue;
		} else {
			// Image not cached yet - start loading and show fallback
			const img = new Image();
			img.onload = () => {
				// Only update if this is still the current frame and latest request
				if (currentFrame === frame && frameSeq >= (failedFrames[frame + '_seq'] || 0)) {
					imageCache[frame] = framePath;
					const bgValue = `url("${framePath}")`;
					heroBg.style.backgroundImage = bgValue;
					servicesBg.style.backgroundImage = bgValue;
					delete failedFrames[frame];
					delete failedFrames[frame + '_seq'];
					cleanupImageCache();
				}
			};
			img.onerror = () => {
				if (DEV_MODE) {
					console.warn('Failed to load frame:', frame, framePath);
				}
				
				// Track failed attempts
				failedFrames[frame] = (failedFrames[frame] || 0) + 1;
				failedFrames[frame + '_seq'] = frameSeq;
				
				// Retry if under max attempts
				if (failedFrames[frame] < MAX_RETRY_ATTEMPTS) {
					setTimeout(() => {
						if (currentFrame === frame) {
							updateBackgrounds(frame);
						}
					}, IMAGE_RETRY_DELAY * (failedFrames[frame] || 1));
				}
			};
			img.src = framePath;
		}

		// Aggressive preloading for smooth experience (throttled)
		preloadAdjacentFrames(frame);
	}
	
	// Calculate frame based on scroll position with smooth interpolation
	function calculateFrame(scrollY) {
		// Validate totalFrames to prevent division by zero
		if (totalFrames <= 0) {
			return 0;
		}

		// Get the total scrollable height
		const documentHeight = document.documentElement.scrollHeight;
		const windowHeight = window.innerHeight;
		const scrollableHeight = documentHeight - windowHeight;

		if (scrollableHeight <= 0) return 0;

		// Map scroll position to frame with smooth progression
		const scrollProgress = Math.max(0, Math.min(1, scrollY / scrollableHeight));
		const rawFrame = scrollProgress * (totalFrames - 1);

		// Use smooth frame transition instead of floor
		// This gives us better control over frame changes
		return Math.round(rawFrame);
	}

	// Smooth frame transition logic
	function getSmoothFrame(currentScrollY, lastScrollY) {
		const frameFromCurrent = calculateFrame(currentScrollY);

		// Detect direction and adjust frame calculation
		if (currentScrollY > lastScrollY) {
			// Scrolling down - normal progression
			scrollDirection = 1;
			return frameFromCurrent;
		} else if (currentScrollY < lastScrollY) {
			// Scrolling up - reverse the sequence
			scrollDirection = -1;
			return frameFromCurrent;
		} else {
			// No scroll change, keep current frame
			return currentFrame;
		}
	}

	// Enhanced scroll handler with better frame management
	function handleScroll() {
		if (!heroBg || !servicesBg) return;

		const currentScrollY = window.scrollY;

		// Get the target frame based on scroll direction
		let targetFrame = getSmoothFrame(currentScrollY, lastScrollY);

		// Ensure frame is within bounds for current resolution
		targetFrame = Math.max(0, Math.min(totalFrames - 1, targetFrame));

		// Update frame if it changed significantly (prevent jittering)
		const frameDifference = Math.abs(targetFrame - currentFrame);
		if (frameDifference > 0) { // Changed from > 0 to allow any change
			currentFrame = targetFrame;
			updateBackgrounds(currentFrame);
		}

		lastScrollY = currentScrollY;
	}
	
	// Preload initial frames for immediate display
	function preloadFrames() {
		// Preload frames based on current resolution
		const initialPreloadCount = Math.min(20, Math.floor(totalFrames / 10));

		// Preload first frames
		for (let i = 0; i < initialPreloadCount; i++) {
			preloadFrame(i);
		}

		// Preload last frames
		for (let i = totalFrames - initialPreloadCount; i < totalFrames; i++) {
			preloadFrame(i);
		}

		// Preload frames around the middle for bidirectional scrolling
		const middleFrame = Math.floor(totalFrames / 2);
		const middleRange = Math.min(10, Math.floor(totalFrames / 20));
		for (let i = middleFrame - middleRange; i <= middleFrame + middleRange; i++) {
			if (i >= 0 && i < totalFrames) {
				preloadFrame(i);
			}
		}

		if (DEV_MODE) {
			console.log('Initial frames preloaded for', currentResolution, ':', totalFrames, 'total frames');
		}
	}
	
	// Initialize
	function init() {
		if (DEV_MODE) {
			console.log('Initializing logo animation...');
		}
		
		// Get elements - they should exist now
		heroBg = document.getElementById('hero-bg-animated');
		servicesBg = document.getElementById('services-bg-animated');
		
		// Check if elements exist
		if (!heroBg || !servicesBg) {
			initRetryCount++;
			
			if (initRetryCount >= MAX_INIT_RETRIES) {
				if (DEV_MODE) {
					console.error('Animation elements not found after', MAX_INIT_RETRIES, 'attempts. Giving up.');
				}
				return; // Stop retrying to prevent infinite loop
			}
			
			if (DEV_MODE) {
				console.warn('Animation elements not found, retrying in 100ms... (Attempt', initRetryCount, '/', MAX_INIT_RETRIES, ')');
			}
			// Retry after a short delay if elements aren't ready
			setTimeout(init, 100);
			return;
		}
		
		// Reset retry count on success
		initRetryCount = 0;
		
		if (DEV_MODE) {
			console.log('Elements found:', { heroBg, servicesBg });
		}

		// Update resolution and frame count FIRST
		updateResolution();

		// Set initial frame based on current scroll position
		currentFrame = calculateFrame(window.scrollY);
		currentFrame = Math.max(0, Math.min(totalFrames - 1, currentFrame));

		// Update backgrounds immediately (will use cached image or load on demand)
		updateBackgrounds(currentFrame);

		// Preload frames aggressively for smooth experience
		preloadFrames();

		if (DEV_MODE) {
			console.log('Logo animation initialized successfully:', {
				frame: currentFrame,
				path: getFramePath(currentFrame),
				resolution: getResolutionFolder(),
				windowWidth: window.innerWidth,
				scrollY: window.scrollY,
				cachedFrames: Object.keys(imageCache).length
			});
		}
		
		// Handle scroll events with optimized throttling
		let lastScrollTime = 0;
		const scrollThrottleDelay = 16; // ~60fps

		scrollHandler = () => {
			const now = Date.now();
			if (now - lastScrollTime >= scrollThrottleDelay) {
				lastScrollTime = now;
				handleScroll();
			} else {
				// If we're scrolling too fast, clear any pending timeout and schedule a new one
				if (scrollTimeout) clearTimeout(scrollTimeout);
				scrollTimeout = setTimeout(handleScroll, scrollThrottleDelay - (now - lastScrollTime));
			}
		};

		window.addEventListener('scroll', scrollHandler, { passive: true });
		
		// Handle window resize to update resolution folder
		resizeHandler = () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				// Clear cache on resize since resolution might change
				imageCache = {};
				failedFrames = {}; // Reset failed frames on resolution change
				if (heroBg && servicesBg) {
					// Update resolution first
					updateResolution();
					// Recalculate current frame for new resolution (ensures it's within bounds)
					currentFrame = calculateFrame(window.scrollY);
					currentFrame = Math.max(0, Math.min(totalFrames - 1, currentFrame));
					updateBackgrounds(currentFrame);
					// Re-preload frames for new resolution
					preloadFrames();
				}
			}, 200);
		};

		window.addEventListener('resize', resizeHandler);
		
		// Test: manually trigger a scroll update after a short delay
		setTimeout(() => {
			handleScroll();
		}, 500);
	}
	
	// Cleanup function to remove event listeners and clear timeouts
	function cleanup() {
		if (scrollHandler) {
			window.removeEventListener('scroll', scrollHandler);
			scrollHandler = null;
		}
		if (resizeHandler) {
			window.removeEventListener('resize', resizeHandler);
			resizeHandler = null;
		}
		if (scrollTimeout) {
			clearTimeout(scrollTimeout);
			scrollTimeout = null;
		}
		if (resizeTimeout) {
			clearTimeout(resizeTimeout);
			resizeTimeout = null;
		}
	}
	
	// Cleanup on page unload
	window.addEventListener('beforeunload', cleanup);
	
	// Start when DOM is ready
	function startAnimation() {
		if (DEV_MODE) {
			console.log('Starting animation, readyState:', document.readyState);
		}
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => {
				if (DEV_MODE) {
					console.log('DOMContentLoaded fired');
				}
				setTimeout(init, 50);
			});
		} else {
			// DOM is already ready, but give it a moment for elements to render
			if (DEV_MODE) {
				console.log('DOM already ready, initializing...');
			}
			setTimeout(init, 50);
		}
	}
	
	startAnimation();
})();

// Contact Form Handling
(function() {
	"use strict";
	
	const contactForm = document.getElementById("contactForm");
	
	if (!contactForm) return;
	
	// Form field inputs styling
	const formInputs = contactForm.querySelectorAll(".form-field-input");
	
	formInputs.forEach(input => {
		// Add active class on focus
		input.addEventListener("focus", function() {
			this.classList.add("active");
			const label = this.closest(".form-field")?.querySelector(".form-field-label");
			if (label) label.classList.add("active");
		});
		
		// Remove active class on blur if empty
		input.addEventListener("blur", function() {
			if (!this.value.trim()) {
				this.classList.remove("active");
				const label = this.closest(".form-field")?.querySelector(".form-field-label");
				if (label) label.classList.remove("active");
			}
		});
		
		// Check initial state
		if (input.value.trim()) {
			input.classList.add("active");
			const label = input.closest(".form-field")?.querySelector(".form-field-label");
			if (label) label.classList.add("active");
		}
	});
	
	// Form submission
	contactForm.addEventListener("submit", function(e) {
		e.preventDefault();
		
		// Get form data
		const formData = new FormData(contactForm);
		const data = Object.fromEntries(formData);
		
		// Basic validation
		if (!data.name || !data.email) {
			alert("Пожалуйста, заполните обязательные поля (Имя и E-mail)");
			return;
		}
		
		if (!data.privacy) {
			alert("Необходимо согласие на обработку персональных данных");
			return;
		}
		
		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(data.email)) {
			alert("Пожалуйста, введите корректный email адрес");
			return;
		}
		
		// Here you would typically send the data to a server
		// For now, we'll just log it and show a success message
		console.log("Form submitted:", data);
		alert("Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.");
		
		// Reset form
		contactForm.reset();
		formInputs.forEach(input => {
			input.classList.remove("active");
			const label = input.closest(".form-field")?.querySelector(".form-field-label");
			if (label) label.classList.remove("active");
		});
	});
})();

// Cookie Banner
(function() {
	"use strict";
	
	const cookieBanner = document.getElementById("cookieBanner");
	const cookieAccept = document.getElementById("cookieAccept");
	
	if (!cookieBanner || !cookieAccept) return;
	
	// Check if user has already accepted cookies
	const cookiesAccepted = localStorage.getItem("cookiesAccepted");
	
	if (cookiesAccepted === "true") {
		cookieBanner.style.display = "none";
		return;
	}
	
	// Show banner after a short delay
	setTimeout(() => {
		cookieBanner.style.display = "block";
	}, 1000);
	
	// Handle accept button
	cookieAccept.addEventListener("click", function() {
		localStorage.setItem("cookiesAccepted", "true");
		cookieBanner.style.opacity = "0";
		cookieBanner.style.visibility = "hidden";
		cookieBanner.style.transition = "opacity 0.3s, visibility 0.3s";
		
		setTimeout(() => {
			cookieBanner.style.display = "none";
		}, 300);
	});
})();
=======
});
>>>>>>> 8bd2327579776c3adb1092d2155a59ce5ebe150a
