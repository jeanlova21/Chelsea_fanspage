// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = menuToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }); 
    // ===== LIVE CLOCK =====
    function updateClock() {
        const clockElement = document.getElementById('liveClock');
        if (clockElement) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            clockElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }
    // Update clock setiap detik
    updateClock();
    setInterval(updateClock, 1000);
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const fadeElements = document.querySelectorAll('.player-card, .trophy-card, .stat-item, .history-text, .history-image');
    fadeElements.forEach(element => {
        element.classList.add('fade-in-section');
        observer.observe(element);
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });

    // Animated counter for statistics
    function animateCounter(element, target, duration) {
        let start = 0;
        const increment = target / (duration / 16); // 60fps
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + (element.textContent.includes('+') ? '+' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '');
            }
        }, 16);
    }

    // Trigger counter animation when stats come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statItems = entry.target.querySelectorAll('.stat-item h4');
                statItems.forEach((item, index) => {
                    const text = item.textContent;
                    const hasPlus = text.includes('+');
                    const hasK = text.includes('K');
                    let number = parseInt(text.replace(/\D/g, ''));
                    
                    if (hasK) {
                        number = number * 1000;
                    }
                    
                    setTimeout(() => {
                        item.textContent = '0';
                        animateCounter(item, number, 2000);
                        
                        // Add suffix back after animation
                        setTimeout(() => {
                            let finalText = item.textContent;
                            if (hasK) {
                                finalText = (parseInt(finalText) / 1000) + 'K';
                            }
                            if (hasPlus) {
                                finalText += '+';
                            }
                            item.textContent = finalText;
                        }, 2000);
                    }, index * 200);
                });
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const historyStats = document.querySelector('.history-stats');
    if (historyStats) {
        statsObserver.observe(historyStats);
    }

    // Player card hover effect - 3D tilt
    const playerCards = document.querySelectorAll('.player-card');
    
    playerCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // Trophy cards stagger animation
    const trophyCards = document.querySelectorAll('.trophy-card');
    const trophyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 100);
                
                trophyObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    trophyCards.forEach(card => {
        trophyObserver.observe(card);
    });

    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const input = this.querySelector('input[type="email"]');
        const button = this.querySelector('button');
        const email = input.value;
        
        // Animate button
        button.textContent = 'Subscribing...';
        button.disabled = true;
        
        // Simulate subscription (replace with actual API call)
        setTimeout(() => {
            button.textContent = '✓ Subscribed!';
            button.style.background = '#10b981';
            input.value = '';
            
            // Show success message
            const successMsg = document.createElement('p');
            successMsg.textContent = `Terima kasih! Kami akan mengirim update ke ${email}`;
            successMsg.style.cssText = 'margin-top: 1rem; color: #10b981; font-weight: bold; animation: fadeInUp 0.5s ease;';
            this.appendChild(successMsg);
            
            // Reset button after 3 seconds
            setTimeout(() => {
                button.textContent = 'Subscribe';
                button.style.background = '';
                button.disabled = false;
                successMsg.remove();
            }, 3000);
        }, 1500);
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Cursor trail effect (optional - can be removed if too heavy)
    let cursorTrail = [];
    const maxTrailLength = 20;
    
    document.addEventListener('mousemove', function(e) {
        if (window.innerWidth > 768) { // Only on desktop
            const trail = document.createElement('div');
            trail.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: rgba(30, 144, 255, 0.5);
                border-radius: 50%;
                pointer-events: none;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                transform: translate(-50%, -50%);
                z-index: 9999;
                animation: fadeOut 0.5s ease-out forwards;
            `;
            
            document.body.appendChild(trail);
            cursorTrail.push(trail);
            
            if (cursorTrail.length > maxTrailLength) {
                const oldTrail = cursorTrail.shift();
                oldTrail.remove();
            }
            
            setTimeout(() => trail.remove(), 500);
        }
    });

    // Add fadeOut animation for cursor trail
    const trailStyle = document.createElement('style');
    trailStyle.textContent = `
        @keyframes fadeOut {
            to {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0);
            }
        }
    `;
    document.head.appendChild(trailStyle);

    // Loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });

    // Add active state to nav links based on scroll position
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - navbar.offsetHeight - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    console.log('Chelsea FC Website Loaded Successfully! 💙');
});