/**
 * DHruv Portfolio - Main JavaScript
 * World-class interactions and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules with error safety
    const inits = [
        initPreloader,
        initCustomCursor,
        initHeader,
        initMobileMenu,
        initSmoothScroll,
        initHeroCanvas,
        initScrollReveal,
        initTiltEffect,
        initMagneticButtons,
        initCounters,
        initTestimonialsSlider,
        initContactForm,
        initBackToTop,
        initParallax
    ];

    inits.forEach(fn => {
        try {
            fn();
        } catch (err) {
            console.warn('Init error:', fn.name, err);
        }
    });
});

/* ============================================
   PRELOADER
   ============================================ */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('progressBar');
    const counter = document.getElementById('counter');
    const glitch = document.getElementById('glitch');

    let progress = 0;
    const duration = 2500;
    const interval = 30;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
        progress += increment + Math.random() * 2;
        if (progress >= 100) {
            progress = 100;
            clearInterval(timer);

            // Glitch effect before hiding
            if (glitch) glitch.classList.add('active');

            setTimeout(() => {
                if (preloader) preloader.classList.add('hidden');
                document.body.style.overflow = '';

                // Trigger hero animations
                document.querySelectorAll('.hero .title-word').forEach((word, i) => {
                    word.style.animationDelay = `${0.2 + i * 0.1}s`;
                });
            }, 400);
        }

        if (progressBar) progressBar.style.width = `${progress}%`;
        if (counter) counter.textContent = `${Math.floor(progress)}%`;
    }, interval);

    document.body.style.overflow = 'hidden';
}

/* ============================================
   CUSTOM CURSOR
   ============================================ */
function initCustomCursor() {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = document.getElementById('cursorDot');
    const circle = document.getElementById('cursorCircle');
    const trail = document.getElementById('cursorTrail');

    if (!dot || !circle || !trail) return;

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let circleX = 0, circleY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Hover states
    const hoverElements = 'a, button, [data-magnetic], .work-card, .service-item, .testimonial-btn, .dot';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverElements)) {
            circle.classList.add('hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverElements)) {
            circle.classList.remove('hover');
        }
    });

    document.addEventListener('mousedown', () => {
        circle.classList.add('click');
        dot.style.transform = 'translate(-50%, -50%) scale(0.5)';
    });

    document.addEventListener('mouseup', () => {
        circle.classList.remove('click');
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // Animation loop
    function animateCursor() {
        // Dot follows immediately
        dotX += (mouseX - dotX) * 0.5;
        dotY += (mouseY - dotY) * 0.5;
        dot.style.left = `${dotX}px`;
        dot.style.top = `${dotY}px`;

        // Circle follows with delay
        circleX += (mouseX - circleX) * 0.15;
        circleY += (mouseY - circleY) * 0.15;
        circle.style.left = `${circleX}px`;
        circle.style.top = `${circleY}px`;

        // Trail follows with more delay
        trailX += (mouseX - trailX) * 0.08;
        trailY += (mouseY - trailY) * 0.08;
        trail.style.left = `${trailX}px`;
        trail.style.top = `${trailY}px`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();
}

/* ============================================
   HEADER SCROLL EFFECT
   ============================================ */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!menuToggle || !mobileMenu) return;

    const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   HERO CANVAS (Three.js Particles)
   ============================================ */
function initHeroCanvas() {
    try {
        const container = document.getElementById('heroCanvas');
        if (!container) return;

        // Check for WebGL support
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            container.style.background = 'radial-gradient(ellipse at 30% 50%, rgba(0, 212, 255, 0.1), transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(255, 107, 53, 0.1), transparent 50%)';
            return;
        }

        // Check if THREE loaded
        if (typeof THREE === 'undefined') {
            console.warn('Three.js not loaded - using CSS fallback');
            container.style.background = 'radial-gradient(ellipse at 30% 50%, rgba(0, 212, 255, 0.1), transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(255, 107, 53, 0.1), transparent 50%)';
            return;
        }

        // Three.js Scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Particles
        const particleCount = 150;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const color1 = new THREE.Color(0x00d4ff);
        const color2 = new THREE.Color(0xff6b35);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            const mixedColor = color1.clone().lerp(color2, Math.random());
            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;

            sizes[i] = Math.random() * 3 + 1;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Mouse interaction
        let mouseX = 0, mouseY = 0;
        let targetMouseX = 0, targetMouseY = 0;

        document.addEventListener('mousemove', (e) => {
            targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
            targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        camera.position.z = 8;

        // Animation
        let time = 0;

        function animate() {
            requestAnimationFrame(animate);
            time += 0.001;

            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            particles.rotation.y += 0.0005;
            particles.rotation.x = mouseY * 0.1;
            particles.rotation.y += mouseX * 0.1;

            const posArray = particles.geometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                posArray[i3 + 1] += Math.sin(time + i) * 0.002;
            }
            particles.geometry.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
        }

        animate();

        // Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    } catch (err) {
        console.warn('Hero canvas error:', err);
        const container = document.getElementById('heroCanvas');
        if (container) {
            container.style.background = 'radial-gradient(ellipse at 30% 50%, rgba(0, 212, 255, 0.1), transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(255, 107, 53, 0.1), transparent 50%)';
        }
    }
}

/* ============================================
   SCROLL REVEAL
   ============================================ */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/* ============================================
   TILT EFFECT (3D Card Hover)
   ============================================ */
function initTiltEffect() {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * -10;
            const rotateY = (x - centerX) / centerX * 10;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            el.style.transition = 'transform 0.5s';
        });

        el.addEventListener('mouseenter', () => {
            el.style.transition = 'transform 0.1s';
        });
    });
}

/* ============================================
   MAGNETIC BUTTONS
   ============================================ */
function initMagneticButtons() {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const magneticElements = document.querySelectorAll('[data-magnetic]');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
            el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });

        el.addEventListener('mouseenter', () => {
            el.style.transition = 'transform 0.1s';
        });
    });
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                const duration = 2000;
                const start = performance.now();
                const startValue = 0;

                function updateCounter(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);

                    // Easing function
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    const current = Math.floor(startValue + (target - startValue) * easeOutQuart);

                    entry.target.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.textContent = target;
                    }
                }

                requestAnimationFrame(updateCounter);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

/* ============================================
   TESTIMONIALS SLIDER
   ============================================ */
function initTestimonialsSlider() {
    const slider = document.getElementById('testimonialsSlider');
    if (!slider) return;

    const track = slider.querySelector('.testimonials-track');
    const cards = slider.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = slider.querySelectorAll('.dot');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    const totalSlides = cards.length;

    function getSlidesPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function updateSlider() {
        const slidesPerView = getSlidesPerView();
        const slideWidth = 100 / slidesPerView;
        const gapOffset = currentIndex * (slideWidth + 2); // 2% for gap

        track.style.transform = `translateX(-${gapOffset}%)`;

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = currentIndex > 0 ? currentIndex - 1 : totalSlides - getSlidesPerView();
            updateSlider();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const slidesPerView = getSlidesPerView();
            currentIndex = currentIndex < totalSlides - slidesPerView ? currentIndex + 1 : 0;
            updateSlider();
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateSlider();
        });
    });

    // Auto-play
    let autoPlay = setInterval(() => {
        const slidesPerView = getSlidesPerView();
        currentIndex = currentIndex < totalSlides - slidesPerView ? currentIndex + 1 : 0;
        updateSlider();
    }, 5000);

    slider.addEventListener('mouseenter', () => clearInterval(autoPlay));
    slider.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => {
            const slidesPerView = getSlidesPerView();
            currentIndex = currentIndex < totalSlides - slidesPerView ? currentIndex + 1 : 0;
            updateSlider();
        }, 5000);
    });

    window.addEventListener('resize', updateSlider);
}

/* ============================================
   CONTACT FORM
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const toast = document.getElementById('toast');
    const submitBtn = form.querySelector('.btn-submit');

    if (!submitBtn) return;

    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show loading state
        if (btnText) btnText.style.opacity = '0';
        if (btnIcon) btnIcon.style.opacity = '0';
        if (btnLoader) btnLoader.classList.add('active');
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            // Reset button
            if (btnText) btnText.style.opacity = '1';
            if (btnIcon) btnIcon.style.opacity = '1';
            if (btnLoader) btnLoader.classList.remove('active');
            submitBtn.disabled = false;

            // Show toast
            if (toast) toast.classList.add('show');

            // Reset form
            form.reset();

            // Hide toast after 4 seconds
            setTimeout(() => {
                if (toast) toast.classList.remove('show');
            }, 4000);
        }, 2000);
    });
}

/* ============================================
   BACK TO TOP
   ============================================ */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ============================================
   PARALLAX EFFECT
   ============================================ */
function initParallax() {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const parallaxElements = document.querySelectorAll('[data-parallax]');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }, { passive: true });
}

/* ============================================
   MARQUEE SPEED ON SCROLL
   ============================================ */
let scrollSpeed = 1;
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const scrollDelta = Math.abs(currentScrollY - lastScrollY);
    scrollSpeed = 1 + scrollDelta * 0.01;

    const tracks = document.querySelectorAll('.marquee-track');
    tracks.forEach(track => {
        const currentDuration = parseFloat(getComputedStyle(track).animationDuration);
        track.style.animationDuration = `${40 / scrollSpeed}s`;
    });

    lastScrollY = currentScrollY;
}, { passive: true });

// Reset speed when scroll stops
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        scrollSpeed = 1;
        const tracks = document.querySelectorAll('.marquee-track');
        tracks.forEach(track => {
            track.style.animationDuration = '40s';
        });
    }, 150);
}, { passive: true });

/* ============================================
   TEXT SCRAMBLE EFFECT
   ============================================ */
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];

            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }

        this.el.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Apply scramble effect to hero title on load
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const words = heroTitle.querySelectorAll('.title-word-gradient');
        words.forEach(word => {
            const originalText = word.textContent;
            const scrambler = new TextScramble(word);

            word.addEventListener('mouseenter', () => {
                scrambler.setText(originalText);
            });
        });
    }
});

/* ============================================
   GLITCH EFFECT ON HOVER
   ============================================ */
function initGlitchEffect() {
    const glitchElements = document.querySelectorAll('[data-glitch]');

    glitchElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.animation = 'glitchEffect 0.3s ease';
            setTimeout(() => {
                el.style.animation = '';
            }, 300);
        });
    });
}

/* ============================================
   SMOOTH SCROLL PROGRESS BAR
   ============================================ */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 2px;
        background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
        z-index: 10001;
        transition: width 0.1s;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    }, { passive: true });
}

// Initialize scroll progress
initScrollProgress();

/* ============================================
   INTERSECTION OBSERVER FOR SECTIONS
   ============================================ */
function initSectionObserver() {
    const sections = document.querySelectorAll('section[id]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Update active nav link
                const id = entry.target.getAttribute('id');
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));
}

initSectionObserver();

/* ============================================
   KEYBOARD NAVIGATION
   ============================================ */
document.addEventListener('keydown', (e) => {
    // Escape to close mobile menu
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobileMenu');
        const menuToggle = document.getElementById('menuToggle');

        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

/* ============================================
   PREFERS REDUCED MOTION
   ============================================ */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable complex animations
    document.querySelectorAll('.marquee-track').forEach(track => {
        track.style.animation = 'none';
    });
}

/* ============================================
   CONSOLE EASTER EGG
   ============================================ */
console.log('%c🔥 DHruv Portfolio 🔥', 'font-size: 24px; font-weight: bold; color: #00d4ff;');
console.log('%cBuilt with passion and lots of coffee ☕', 'font-size: 14px; color: #ff6b35;');
console.log('%cContact: dxruxx@gmail.com', 'font-size: 12px; color: #94a3b8;');
