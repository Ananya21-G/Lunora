$(document).ready(function() {
    'use strict';
    
    // Initialize all components
    initPreloader();
    initThemeToggle();
    initNavigation();
    initScrollAnimations();
    initCarousel();
    initRippleEffect();
    initParallax();
    initPopup();
    initSmoothScrolling();
    initContactForm();
    
    // Preloader functionality
    function initPreloader() {
        $(window).on('load', function() {
            setTimeout(function() {
                $('#preloader').fadeOut(300);
            }, 800);
        });
    }
    
    // Theme toggle functionality
    function initThemeToggle() {
        const themeToggle = $('#theme-toggle');
        const toggleText = themeToggle.find('.toggle-text');
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        // Set initial theme
        if (currentTheme === 'dark') {
            $('body').attr('data-theme', 'dark');
            themeToggle.find('i').removeClass('fa-moon').addClass('fa-sun');
            toggleText.text('Light');
        }
        
        // Theme toggle click handler
        themeToggle.on('click', function() {
            const currentTheme = $('body').attr('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            $('body').attr('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icon and text
            const icon = themeToggle.find('i');
            if (newTheme === 'dark') {
                icon.removeClass('fa-moon').addClass('fa-sun');
                toggleText.text('Light');
            } else {
                icon.removeClass('fa-sun').addClass('fa-moon');
                toggleText.text('Dark');
            }
            
            // Add animation effect
            themeToggle.addClass('animate');
            setTimeout(() => themeToggle.removeClass('animate'), 300);
        });
    }
    
    // Navigation functionality
    function initNavigation() {
        const navbar = $('.navbar');
        
        // Navbar scroll effect
        $(window).on('scroll', function() {
            if ($(window).scrollTop() > 50) {
                navbar.addClass('scrolled');
            } else {
                navbar.removeClass('scrolled');
            }
        });
        
        // Active nav link highlighting
        $(window).on('scroll', function() {
            const scrollPos = $(window).scrollTop() + 100;
            
            $('.navbar-nav .nav-link').each(function() {
                const link = $(this);
                const section = $(link.attr('href'));
                
                if (section.length && 
                    section.offset().top <= scrollPos && 
                    section.offset().top + section.height() > scrollPos) {
                    $('.navbar-nav .nav-link').removeClass('active');
                    link.addClass('active');
                }
            });
        });
        
        // Mobile menu close on link click
        $('.navbar-nav .nav-link').on('click', function() {
            $('.navbar-collapse').collapse('hide');
        });
    }
    
    // Scroll animations
    function initScrollAnimations() {
        function checkAnimation() {
            const elements = $('.fade-in-up, .fade-in-left, .fade-in-right');
            
            elements.each(function() {
                const element = $(this);
                const elementTop = element.offset().top;
                const elementBottom = elementTop + element.outerHeight();
                const viewportTop = $(window).scrollTop();
                const viewportBottom = viewportTop + $(window).height();
                
                if (elementBottom > viewportTop && elementTop < viewportBottom) {
                    element.addClass('animate');
                }
            });
        }
        
        $(window).on('scroll resize', checkAnimation);
        checkAnimation(); // Check on page load
    }
    
    // Carousel functionality
    function initCarousel() {
        let currentSlide = 0;
        const slides = $('.portfolio-item');
        const totalSlides = slides.length;
        const track = $('.carousel-track');
        
        function updateCarousel() {
            const translateX = -currentSlide * 100;
            track.css('transform', `translateX(${translateX}%)`);
            
            // Update indicators
            $('.indicator').removeClass('active');
            $(`.indicator[data-slide="${currentSlide}"]`).addClass('active');
        }
        
        // Next button
        $('.carousel-next').on('click', function() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        });
        
        // Previous button
        $('.carousel-prev').on('click', function() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });
        
        // Indicator clicks
        $('.indicator').on('click', function() {
            currentSlide = parseInt($(this).attr('data-slide'));
            updateCarousel();
        });
        
        // Auto-play carousel
        setInterval(function() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }, 5000);
        
        // Touch/swipe support for mobile
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        $('.carousel-container').on('touchstart mousedown', function(e) {
            startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            isDragging = true;
        });
        
        $('.carousel-container').on('touchmove mousemove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        });
        
        $('.carousel-container').on('touchend mouseup mouseleave', function() {
            if (!isDragging) return;
            isDragging = false;
            
            const diffX = startX - currentX;
            const threshold = 50;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    // Swipe left - next slide
                    currentSlide = (currentSlide + 1) % totalSlides;
                } else {
                    // Swipe right - previous slide
                    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                }
                updateCarousel();
            }
        });
    }
    
    // Ripple effect
    function initRippleEffect() {
        $('.ripple-effect').on('click', function(e) {
            const button = $(this);
            const ripple = $('<span class="ripple"></span>');
            
            const buttonRect = button[0].getBoundingClientRect();
            const size = Math.max(buttonRect.width, buttonRect.height);
            const x = e.clientX - buttonRect.left - size / 2;
            const y = e.clientY - buttonRect.top - size / 2;
            
            ripple.css({
                width: size + 'px',
                height: size + 'px',
                left: x + 'px',
                top: y + 'px',
                position: 'absolute',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.3)',
                transform: 'scale(0)',
                animation: 'ripple-animation 0.6s linear',
                pointerEvents: 'none'
            });
            
            button.append(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Add ripple animation CSS
        if (!$('#ripple-style').length) {
            $('<style id="ripple-style">').text(`
                @keyframes ripple-animation {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `).appendTo('head');
        }
    }
    
    // Parallax scrolling effect
    function initParallax() {
        $(window).on('scroll', function() {
            const scrolled = $(window).scrollTop();
            const rate = scrolled * -0.5;
            
            $('.hero-background').css('transform', `translateY(${rate}px)`);
            
            // Floating elements parallax
            $('.floating-element').each(function(index) {
                const speed = 0.5 + (index * 0.2);
                const yPos = -(scrolled * speed);
                $(this).css('transform', `translateY(${yPos}px)`);
            });
        });
    }
    
    // Popup functionality
    function initPopup() {
        // Show popup after 3 seconds
        setTimeout(function() {
            $('#popup-modal').addClass('show');
        }, 3000);
        
        // Close popup
        $('.popup-close, .popup-modal').on('click', function(e) {
            if (e.target === this) {
                closePopup();
            }
        });
        
        // Close popup with Escape key
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape') {
                closePopup();
            }
        });
    }
    
    // Close popup function (global)
    window.closePopup = function() {
        $('#popup-modal').removeClass('show');
    };
    
    // Smooth scrolling
    function initSmoothScrolling() {
        $('a[href^="#"], .btn[data-target]').on('click', function(e) {
            e.preventDefault();
            
            const target = $(this).attr('href') || $(this).attr('data-target');
            const targetElement = $(target);
            
            if (targetElement.length) {
                const offsetTop = targetElement.offset().top - 80; // Account for fixed navbar
                
                $('html, body').animate({
                    scrollTop: offsetTop
                }, 800, 'swing');
            }
        });
    }
    
    // Contact form functionality
    function initContactForm() {
        $('#contactForm').on('submit', function(e) {
            e.preventDefault();
            
            const form = $(this);
            const submitBtn = form.find('button[type="submit"]');
            const originalText = submitBtn.html();
            
            // Show loading state
            submitBtn.html('<i class="fas fa-spinner fa-spin me-2"></i>Sending...')
                     .prop('disabled', true);
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(function() {
                // Show success message
                showNotification('Message sent successfully!', 'success');
                
                // Reset form
                form[0].reset();
                
                // Reset button
                submitBtn.html(originalText).prop('disabled', false);
            }, 2000);
        });
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        const notification = $(`
            <div class="notification notification-${type}">
                <div class="notification-content">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
                    ${message}
                </div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `);
        
        // Add notification styles if not exists
        if (!$('#notification-style').length) {
            $('<style id="notification-style">').text(`
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--bg-card);
                    color: var(--text-primary);
                    padding: 1rem 1.5rem;
                    border-radius: 10px;
                    box-shadow: var(--shadow-hover);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    max-width: 300px;
                    border-left: 4px solid var(--primary-color);
                }
                .notification-success {
                    border-left-color: #28a745;
                }
                .notification.show {
                    transform: translateX(0);
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    padding: 0;
                    font-size: 1rem;
                }
                .notification-close:hover {
                    color: var(--text-primary);
                }
            `).appendTo('head');
        }
        
        $('body').append(notification);
        
        // Show notification
        setTimeout(() => notification.addClass('show'), 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.removeClass('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Manual close
        notification.find('.notification-close').on('click', function() {
            notification.removeClass('show');
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    // Utility functions
    
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Performance optimizations
    const debouncedResize = debounce(function() {
        // Handle resize events
        initScrollAnimations();
    }, 250);
    
    const throttledScroll = throttle(function() {
        // Handle scroll events efficiently
    }, 16); // ~60fps
    
    $(window).on('resize', debouncedResize);
    $(window).on('scroll', throttledScroll);
    
    // Accessibility improvements
    
    // Skip to main content
    $('<a href="#home" class="skip-link">Skip to main content</a>')
        .prependTo('body')
        .css({
            position: 'absolute',
            top: '-40px',
            left: '6px',
            background: 'var(--primary-color)',
            color: 'white',
            padding: '8px',
            textDecoration: 'none',
            zIndex: '10000',
            borderRadius: '4px'
        })
        .on('focus', function() {
            $(this).css('top', '6px');
        })
        .on('blur', function() {
            $(this).css('top', '-40px');
        });
    
    // Keyboard navigation for carousel
    $(document).on('keydown', function(e) {
        if ($('.portfolio-carousel:hover').length) {
            if (e.key === 'ArrowLeft') {
                $('.carousel-prev').click();
            } else if (e.key === 'ArrowRight') {
                $('.carousel-next').click();
            }
        }
    });
    
    // Focus management for modal
    $('#popup-modal').on('show', function() {
        $('body').css('overflow', 'hidden');
        $(this).find('.popup-close').focus();
    });
    
    $('#popup-modal').on('hide', function() {
        $('body').css('overflow', '');
    });
    
    // Reduced motion support
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        $('*').css({
            'animation-duration': '0.01ms !important',
            'animation-iteration-count': '1 !important',
            'transition-duration': '0.01ms !important'
        });
    }
    
    // Performance monitoring
    function logPerformance() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        }
    }
    
    $(window).on('load', function() {
        setTimeout(logPerformance, 0);
    });
    
    // Service worker registration for PWA features
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            // Uncomment below to enable service worker
            // navigator.serviceWorker.register('/sw.js')
            //     .then(function(registration) {
            //         console.log('SW registered: ', registration);
            //     })
            //     .catch(function(registrationError) {
            //         console.log('SW registration failed: ', registrationError);
            //     });
        });
    }
    
    console.log('🚀 Lunora initialized successfully!');
});

// Global utility functions
window.Lunora = {
    // Smooth scroll to element
    scrollTo: function(target, offset = 80) {
        const targetElement = $(target);
        if (targetElement.length) {
            const offsetTop = targetElement.offset().top - offset;
            $('html, body').animate({
                scrollTop: offsetTop
            }, 800, 'swing');
        }
    },
    
    // Toggle theme programmatically
    toggleTheme: function() {
        $('#theme-toggle').click();
    },
    
    // Show notification
    showNotification: function(message, type = 'info') {
        // Use the internal notification function
        showNotification(message, type);
    },
    
    // Get current theme
    getTheme: function() {
        return $('body').attr('data-theme') || 'light';
    },
    
    // Animate element
    animateElement: function(element, animation = 'fadeInUp') {
        $(element).addClass(`animate__animated animate__${animation}`);
    }
};
