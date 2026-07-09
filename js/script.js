/* ==========================================================================
   DevOps Portfolio JavaScript - Ravindu Senevirathne
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initHeaderScroll();
    initMobileNav();
    initHeroCanvas();
    initTypewriter();
    initScrollReveal();
    initStatsCounter();
    initProjectTilt();
    initCarousel();
    initContactForm();
});

/* --- 1. Custom Cursor Glow Tracking --- */
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;

    window.addEventListener('mousemove', (e) => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
    });
}

/* --- 2. Header Scroll & Back to Top Toggle --- */
function initHeaderScroll() {
    const header = document.getElementById('header');
    const backToTop = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        
        // Header class
        if (scrollPos > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Back to top button
        if (scrollPos > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
}

/* --- 3. Mobile Navigation Drawer --- */
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    if (!hamburger || !navMenu) return;

    // Toggle menu
    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is active
        if (!isExpanded) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        });
    });
}

/* --- 4. Interactive Hero Canvas Background --- */
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };

    // Resize canvas
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initParticles();
    }

    // Particle blueprint
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1; // particle thickness
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.color = '#00f2fe';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce check boundaries
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Mouse reaction (subtle push away)
            if (mouse.x !== null && mouse.y !== null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    let directionX = dx / distance;
                    let directionY = dy / distance;
                    this.x += directionX * force * 1.5;
                    this.y += directionY * force * 1.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Initialize particle array based on canvas dimensions
    function initParticles() {
        particles = [];
        const count = Math.floor((canvas.width * canvas.height) / 11000); // Dynamic count density
        const particleLimit = Math.min(count, 120); // Cap for performance
        for (let i = 0; i < particleLimit; i++) {
            particles.push(new Particle());
        }
    }

    // Connect close nodes
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                const maxDist = 120;
                if (distance < maxDist) {
                    // Line opacity increases when particles are closer
                    let opacity = 1 - (distance / maxDist);
                    ctx.strokeStyle = `rgba(79, 172, 254, ${opacity * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        drawConnections();
        requestAnimationFrame(animate);
    }

    // Event Listeners
    window.addEventListener('resize', resizeCanvas);
    
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Boot
    resizeCanvas();
    animate();
}

/* --- 5. Hero Typewriter Effect --- */
function initTypewriter() {
    const target = document.getElementById('typing-tagline');
    if (!target) return;

    const phrases = [
        "Building reliable networks today, automating the cloud tomorrow.",
        "kubectl apply -f ravindu-career.yaml",
        "python automated_deploy.py --env production",
        "git commit -m 'ready to scale infrastructure'"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            target.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 30; // Delete speed is faster
        } else {
            target.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 70; // Standard typing speed
        }

        // State changes
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before starting new word
        }

        setTimeout(type, typingSpeed);
    }

    // Start
    setTimeout(type, 1000);
}

/* --- 6. Scroll Reveal Observer (Intersection Observer) --- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    const skillBars = document.querySelectorAll('.skill-bar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // 6a. Reveal Items
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 6b. Skill Bars Animate on Scroll
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
                skillsObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.2 });

    skillBars.forEach(bar => skillsObserver.observe(bar));

    // 6c. Active Section Highlighting in Header
    const activeSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-30% 0px -60% 0px' // Adjust active trigger point
    });

    sections.forEach(sec => activeSectionObserver.observe(sec));
}

/* --- 7. Statistics Increment Count-Up --- */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-num');
    
    const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const targetVal = parseFloat(stat.getAttribute('data-val'));
                const isFloat = targetVal % 1 !== 0;
                let currentVal = 0;
                
                const duration = 2000; // Animation duration in ms
                const start = performance.now();
                
                function updateCount(timestamp) {
                    const elapsed = timestamp - start;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Ease-out cubic calculation
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    currentVal = easeProgress * targetVal;
                    
                    if (isFloat) {
                        stat.textContent = currentVal.toFixed(1);
                    } else {
                        stat.textContent = Math.floor(currentVal);
                    }
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        // Ensure final values are precise
                        stat.textContent = isFloat ? targetVal.toFixed(1) : targetVal;
                    }
                }
                
                requestAnimationFrame(updateCount);
                observer.unobserve(stat); // Run count up only once
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => countObserver.observe(stat));
}

/* --- 8. Project Card 3D Tilt & Glow Effects --- */
function initProjectTilt() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        // Capture mouse movement coordinates relative to card for glow layout
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            // 3D Tilt calculation
            const width = rect.width;
            const height = rect.height;
            
            const rotateX = -((y - height / 2) / height) * 8; // Max tilt 8 deg
            const rotateY = ((x - width / 2) / width) * 8;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        
        // Reset transforms on exit
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });
}

/* --- 9. Photography Slider Carousel --- */
function initCarousel() {
    const track = document.getElementById('slider-track');
    const slides = Array.from(document.querySelectorAll('.slide'));
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dotsContainer = document.getElementById('slider-dots');
    
    if (!track || slides.length === 0) return;
    
    let currentIndex = 0;
    let autoPlayInterval;
    
    // Create dots dynamic indicator matching slide elements
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.setAttribute('data-index', idx);
        dotsContainer.appendChild(dot);
    });
    
    const dots = Array.from(dotsContainer.querySelectorAll('.dot'));
    
    function updateSlider(index) {
        // Boundary limits loops
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        currentIndex = index;
        
        // Translate slider track
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Toggle active status for visual CSS effects
        slides.forEach((slide, idx) => {
            if (idx === currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Highlight active dots
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Slide advancement
    function nextSlide() {
        updateSlider(currentIndex + 1);
    }
    
    function prevSlide() {
        updateSlider(currentIndex - 1);
    }
    
    // Setup controls
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });
    
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            updateSlider(index);
            resetAutoPlay();
        });
    });
    
    // Touch Navigation Support for Mobiles
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const threshold = 50; // swipe length minimum
        if (touchStartX - touchEndX > threshold) {
            nextSlide();
            resetAutoPlay();
        }
        if (touchEndX - touchStartX > threshold) {
            prevSlide();
            resetAutoPlay();
        }
    }
    
    // Auto advance rotation timer
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 6000); // 6s duration
    }
    
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }
    
    // Initiate rotation
    startAutoPlay();
}

/* --- 10. Contact Form Submission mock logic --- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('btn-submit');
    const alertBox = document.getElementById('form-success-alert');
    
    if (!form || !submitBtn) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Extract inputs
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        // Simple form validation check
        if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
            return;
        }
        
        // Set loading state UI
        submitBtn.classList.add('loading');
        
        // Mock API Network Latency delay
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            
            // Slide transition alert overlay container
            setTimeout(() => {
                if (alertBox) {
                    alertBox.classList.add('active');
                }
                
                // Clear fields
                form.reset();
            }, 500);
            
            // Revert state button after message display
            setTimeout(() => {
                submitBtn.classList.remove('success');
                if (alertBox) {
                    alertBox.classList.remove('active');
                }
            }, 6000);
            
        }, 2200);
    });
}
