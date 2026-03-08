document.addEventListener('DOMContentLoaded', () => {

    // --- Initialize Lenis Smooth Scrolling ---
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 0.9, // Lower duration makes it feel more responsive/snappy while remaining smooth
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2, // Standard responsive touch scrolling
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // Integrate Lenis with GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        if (lenis) {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }

        // --- Horizontal Scrollytelling (About Section) ---
        const hWrapper = document.querySelector('.about-horizontal-wrapper');
        const hContainer = document.querySelector('.about-horizontal-container');
        
        if (hWrapper && hContainer) {
            let scrollWidth = hContainer.scrollWidth - window.innerWidth;
            
            gsap.to(hContainer, {
                x: () => -scrollWidth,
                ease: "none",
                scrollTrigger: {
                    trigger: hWrapper,
                    pin: true,
                    scrub: 1, // Smooth scrubbing
                    end: () => "+=" + scrollWidth, // Pin duration matches width
                    invalidateOnRefresh: true
                }
            });

            // Animate Horizontal Progress Bar
            const progressBar = document.querySelector('.horizontal-scroll-progress');
            if (progressBar) {
                gsap.to(progressBar, {
                    scaleX: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: hWrapper,
                        start: "top top",
                        end: () => "+=" + scrollWidth,
                        scrub: 1,
                    }
                });
            }
        }

        // --- Hero Entrance Animation (Sand Theme Redesign) ---
        const initHeroAnimation = () => {
            const tl = gsap.timeline();
            
            // Initial states
            gsap.set('.navbar', { y: -30, opacity: 0 });
            gsap.set('.hero-center-portrait img', { scale: 1.1, opacity: 0 });
            gsap.set('.huge-display-title', { x: -50, opacity: 0 });
            gsap.set('.hero-left-column > p, .hero-left-column > a, .hero-bottom-info', { y: 20, opacity: 0 });
            gsap.set('.stat-blurb', { x: 30, opacity: 0 });
            gsap.set('.hero-bottom-marquee', { y: 20, opacity: 0 });

            tl.to('.navbar', { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' })
              .to('.hero-center-portrait img', { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' }, "-=0.3")
              .to('.huge-display-title', { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, "-=0.7")
              .to('.hero-left-column > p, .hero-left-column > a, .hero-bottom-info', { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, "-=0.5")
              .to('.stat-blurb', { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, "-=0.6")
              .to('.hero-bottom-marquee', { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, "-=0.4");
        };
        
        // Run hero animation
        initHeroAnimation();
    }

    // --- Custom Cursor Implementation ---
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    // Elements that trigger cursor hover effect
    const interactiveElements = document.querySelectorAll('a, button, .btn, .hobby-card, .glass-card');
    
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let cursorX = mouseX, cursorY = mouseY;
    let followerX = mouseX, followerY = mouseY;

    // Detect if device supports hover (not a touch device)
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (canHover && cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const loop = () => {
            // Cursor moves instantly or with very slight lerp
            cursorX += (mouseX - cursorX) * 0.8;
            cursorY += (mouseY - cursorY) * 0.8;
            
            // Follower uses a larger easing delay for the "trailing" effect
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
            
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering');
            });
        });

        const viewElements = document.querySelectorAll('.project-card, .bento-item, .exp-panel');
        const cursorText = document.querySelector('.cursor-text');
        
        viewElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('view-mode');
                if(cursorText) cursorText.innerText = 'View';
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('view-mode');
                if(cursorText) cursorText.innerText = '';
            });
        });
    } else {
        // Fallback for touch devices or if elements don't exist
        if (cursor) cursor.style.display = 'none';
        if (follower) follower.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    // --- Navbar Styling on Scroll ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- GSAP Parallax Effects ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        const parallaxBgs = gsap.utils.toArray('.parallax-bg');
        const parallaxFgs = gsap.utils.toArray('.parallax-fg');

        parallaxBgs.forEach(bg => {
            gsap.to(bg, {
                yPercent: 30, // Move down by 30% of its height
                ease: "none",
                scrollTrigger: {
                    trigger: bg.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        parallaxFgs.forEach(fg => {
            gsap.to(fg, {
                yPercent: -15, // Move up by 15% of its height
                ease: "none",
                scrollTrigger: {
                    trigger: fg.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });
    }

    // --- Intersection Observer for Fade-in Animations ---
    const animatedElements = document.querySelectorAll('.fade-target');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animating to let it stay visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        elementObserver.observe(el);
    });

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Interactive Map Initialization (Leaflet.js) ---
    const mapElement = document.getElementById('world-map');
    if (mapElement && typeof L !== 'undefined') {
        // Initialize map centered on a global view
        const map = L.map('world-map', {
            zoomControl: true,
            scrollWheelZoom: false // Disable scrolling to zoom to prevent trap
        }).setView([20.0, 10.0], 2);

        // Add Dark-themed CartoDB Dark Matter tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Define Locations based on user request
        const locations = [
            { name: "United Kingdom", coords: [51.5074, -0.1278], desc: "Major Operations & Placements" },
            { name: "Spain", coords: [40.4168, -3.7038], desc: "Consultant Placements" },
            { name: "Belgium", coords: [50.8503, 4.3517], desc: "Consultant Placements" },
            { name: "France", coords: [48.8566, 2.3522], desc: "Consultant Placements" },
            { name: "Netherlands", coords: [52.3676, 4.9041], desc: "Consultant Placements" },
            { name: "Poland", coords: [52.2297, 21.0122], desc: "Consultant Placements" },
            { name: "Romania", coords: [44.4268, 26.1025], desc: "Consultant Placements" },
            { name: "Czech Republic", coords: [50.0755, 14.4378], desc: "Consultant Placements" },
            { name: "Germany", coords: [52.5200, 13.4050], desc: "Consultant Placements" },
            { name: "Italy", coords: [41.9028, 12.4964], desc: "Consultant Placements" },
            { name: "Dubai, UAE", coords: [25.2048, 55.2708], desc: "Historical Placements & Operations" },
            { name: "Sharjah, UAE", coords: [25.3573, 55.3900], desc: "Consultant Placements" },
            { name: "Abu Dhabi, UAE", coords: [24.4539, 54.3773], desc: "Consultant Placements" },
            { name: "Oman", coords: [23.5859, 58.4059], desc: "Consultant Placements" },
            { name: "Riyadh, Saudi Arabia", coords: [24.7136, 46.6753], desc: "Consultant Placements" },
            { name: "Nigeria", coords: [9.0820, 8.6753], desc: "Consultant Placements" },
            { name: "India", coords: [23.2599, 77.4126], desc: "Delivery Hub & Operations" }
        ];

        // Custom marker style to match theme
        const customIcon = L.divIcon({
            className: 'custom-map-marker',
            html: `<div style="background-color: #1e293b; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
            iconSize: [15, 15],
            iconAnchor: [7, 7]
        });

        locations.forEach(loc => {
            const marker = L.marker(loc.coords, { icon: customIcon }).addTo(map);
            marker.bindPopup(`<b>${loc.name}</b><br>${loc.desc}`);
        });

        // Small delay to ensure map renders correctly in hidden sections or after animations
        setTimeout(() => { map.invalidateSize(); }, 500);
    }

    // --- Case Study Modals Logic ---
    const modalOpenBtns = document.querySelectorAll('.btn-case-study');
    const modalCloseBtns = document.querySelectorAll('.close-modal');
    const modals = document.querySelectorAll('.modal-overlay');

    modalOpenBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = btn.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });

    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // --- Contact Form Submission Hook ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
        // Allow the default mailto behavior, but log for feedback visual
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Opening Email Client...';
        setTimeout(() => {
            submitBtn.innerText = originalText;
            contactForm.reset();
        }, 3000);
    });
    }

    // --- Testimonials Carousel Grab-to-Scroll ---
    const carousel = document.querySelector('.testimonials-carousel');
    let isDown = false;
    let startX;
    let scrollLeft;

    if (carousel) {
        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            carousel.classList.add('active');
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });
        carousel.addEventListener('mouseleave', () => {
            isDown = false;
            carousel.classList.remove('active');
        });
        carousel.addEventListener('mouseup', () => {
            isDown = false;
            carousel.classList.remove('active');
        });
        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2; // Scroll fast
            carousel.scrollLeft = scrollLeft - walk;
        });
    }

    // --- Tabbed Experience Section Logic ---
    const expTabs = document.querySelectorAll('.exp-tab');
    const expPanels = document.querySelectorAll('.exp-panel');

    if(expTabs.length > 0) {
        expTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and panels
                expTabs.forEach(t => t.classList.remove('active'));
                expPanels.forEach(p => p.classList.remove('active'));

                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding panel
                const targetId = tab.getAttribute('data-target');
                document.getElementById(targetId).classList.add('active');
            });
        });
    }

});
