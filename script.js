/*
 * OPTIMIZED BIZMATE CHAT INTEGRATION
 * ==================================
 * Performance optimizations applied to reduce lag and improve user experience
 */

// Throttle function to limit event frequency
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
    }
}

// Debounce function for expensive operations
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

// Smooth scroll functions - optimized
function scrollToSolutions() {
    const element = document.getElementById('solutions');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function scrollToAbout() {
    const element = document.getElementById('about');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function openDemoChat() {
    showChatDialog('Bizmate Bot');
}

// Optimized carousel functionality
let currentSlide = 0;
let slides, dots;
let carouselInterval;
let isCarouselInitialized = false;

function initializeCarousel() {
    if (isCarouselInitialized) return;
    
    slides = document.querySelectorAll('.agent-slide');
    dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0 || dots.length === 0) {
        // Retry only 3 times, then give up
        if (initializeCarousel.retryCount < 3) {
            initializeCarousel.retryCount = (initializeCarousel.retryCount || 0) + 1;
            setTimeout(initializeCarousel, 100);
        }
        return;
    }

    isCarouselInitialized = true;
    
    // Clear any existing interval
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }

    showSlide(0);

    // Add event listeners with passive option
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index), { passive: true });
    });

    // Reduce carousel frequency to improve performance
    carouselInterval = setInterval(nextSlide, 8000); // Increased from 5s to 8s
}

function showSlide(index) {
    if (!slides || !dots || slides.length === 0) return;
    
    // Use requestAnimationFrame for smoother animations
    requestAnimationFrame(() => {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.style.display = 'flex';
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
                slide.style.display = 'none';
            }
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
        
        // Debounced button text update
        debouncedUpdateChatButtonText();
    });
}

const debouncedUpdateChatButtonText = debounce(updateChatButtonText, 150);

function updateChatButtonText() {
    const chatBtn = document.querySelector('#chatNowBtn .btn-text');
    if (!chatBtn) return;
    
    const activeSlide = document.querySelector('.agent-slide.active');
    if (!activeSlide) return;
    
    const agentType = activeSlide.getAttribute('data-agent');
    
    const agentMap = {
        'sales': { name: 'אלכס', occupation: 'מומחה מכירות' },
        'utils': { name: 'מקס', occupation: 'מנהל תפעול' },
        'support': { name: 'נואה', occupation: 'מומחה תמיכה' }
    };
    
    const agent = agentMap[agentType] || agentMap.sales;
    chatBtn.textContent = `התחל צ'אט עם ${agent.name} - ${agent.occupation}`;
}

function nextSlide() {
    if (!slides || slides.length === 0) return;
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Optimized reviews carousel
let currentReview = 0;
let reviewSlides, reviewDots;
let reviewInterval;
let isReviewCarouselInitialized = false;

function initializeReviewsCarousel() {
    if (isReviewCarouselInitialized) return;
    
    reviewSlides = document.querySelectorAll('.review-slide');
    reviewDots = document.querySelectorAll('.review-dot');
    
    if (reviewSlides.length === 0 || reviewDots.length === 0) {
        if (initializeReviewsCarousel.retryCount < 3) {
            initializeReviewsCarousel.retryCount = (initializeReviewsCarousel.retryCount || 0) + 1;
            setTimeout(initializeReviewsCarousel, 100);
        }
        return;
    }

    isReviewCarouselInitialized = true;
    
    if (reviewInterval) {
        clearInterval(reviewInterval);
    }

    showReviewSlide(0);

    reviewDots.forEach((dot, index) => {
        dot.addEventListener('click', () => showReviewSlide(index), { passive: true });
    });

    reviewInterval = setInterval(nextReviewSlide, 10000); // Increased interval
}

function showReviewSlide(index) {
    if (!reviewSlides || !reviewDots || reviewSlides.length === 0) return;
    
    requestAnimationFrame(() => {
        reviewSlides.forEach((slide, i) => {
            if (i === index) {
                slide.style.display = 'flex';
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
                slide.style.display = 'none';
            }
        });
        
        reviewDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentReview = index;
    });
}

function nextReviewSlide() {
    if (!reviewSlides || reviewSlides.length === 0) return;
    currentReview = (currentReview + 1) % reviewSlides.length;
    showReviewSlide(currentReview);
}

// Optimized stats animation with Intersection Observer
let statsAnimated = false;

function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;
    
    const statNumbers = document.querySelectorAll('.stat-number');
    const statItems = document.querySelectorAll('.stat-item');
    
    statItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate');
        }, index * 100); // Reduced stagger time
    });
    
    setTimeout(() => {
        statNumbers.forEach((stat, index) => {
            setTimeout(() => {
                const target = parseInt(stat.getAttribute('data-target'));
                let current = 0;
                const increment = target / 30; // Faster animation
                
                const updateStat = () => {
                    if (current < target) {
                        current = Math.min(current + increment, target);
                        
                        const statLabel = stat.parentElement.querySelector('.stat-label')?.textContent || '';
                        
                        if (statLabel.includes('לקוחות')) {
                            stat.textContent = Math.floor(current) + '+';
                        } else if (statLabel.includes('שביעות')) {
                            stat.textContent = Math.floor(current) + '%';
                        } else if (statLabel.includes('תמיכה')) {
                            stat.textContent = Math.floor(current) + '/7';
                        } else if (statLabel.includes('שיפור')) {
                            stat.textContent = Math.floor(current) + 'x';
                        }
                        
                        if (current < target) {
                            requestAnimationFrame(updateStat);
                        }
                    }
                };
                
                updateStat();
            }, index * 200);
        });
    }, 200);
}

// Intersection Observer for stats animation
function initStatsAnimation() {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}

// Optimized mouse interaction - heavily throttled
const throttledMouseMove = throttle(function(e) {
    // Only apply effect on desktop to improve mobile performance
    if (window.innerWidth <= 768) return;
    
    const robots = document.querySelectorAll('.ai-robot');
    robots.forEach(robot => {
        if (!robot.closest('.agent-slide.active')) return;
        
        const rect = robot.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        const maxRadius = 120; // Reduced radius
        
        if (distance < maxRadius) {
            const intensity = 1 - (distance / maxRadius);
            const maxPush = 20; // Reduced push distance
            
            const pushX = -(deltaX / distance) * intensity * maxPush;
            const pushY = -(deltaY / distance) * intensity * maxPush;
            
            const maxTilt = 5; // Reduced tilt
            const tiltX = (pushY / maxPush) * maxTilt;
            const tiltY = (pushX / maxPush) * maxTilt;
            
            robot.style.transform = `translate3d(${pushX}px, ${pushY}px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${1 - intensity * 0.05})`;
        } else {
            robot.style.transform = 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(1)';
        }
    });
}, 16); // ~60fps limit

// Event listeners - optimized
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components with small delays to prevent blocking
    setTimeout(initializeCarousel, 50);
    setTimeout(initializeReviewsCarousel, 100);
    setTimeout(initStatsAnimation, 150);
    setTimeout(debouncedUpdateChatButtonText, 200);
});

// Add mouse move listener only on desktop
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', throttledMouseMove, { passive: true });
}

// Click handlers - optimized with event delegation
document.addEventListener('click', function(e) {
    // Handle floating message clicks
    if (e.target.classList.contains('floating-message') && e.target.classList.contains('msg-0')) {
        const nameText = e.target.textContent;
        
        e.target.style.transform = 'translateX(-50%) translateY(-5px) scale(0.95)';
        setTimeout(() => {
            e.target.style.transform = 'translateX(-50%) translateY(-5px) scale(1.05)';
        }, 150);
        
        showChatDialog(nameText);
    }
    
    // Handle chat button clicks
    if (e.target.id === 'chatNowBtn' || e.target.closest('#chatNowBtn')) {
        const activeSlide = document.querySelector('.agent-slide.active');
        const agentType = activeSlide?.getAttribute('data-agent') || 'sales';
        
        const agentNames = {
            'sales': 'אלכס - מומחה מכירות',
            'utils': 'מקס - מנהל תפעול',
            'support': 'נואה - מומחה תמיכה'
        };
        
        showChatDialog(agentNames[agentType] || 'הסוכן החכם שלנו');
    }
}, { passive: false });

// Optimized chat dialog function
function showChatDialog(agentName) {
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chatContainer';
    chatContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(6px);
    `;
    
    chatContainer.innerHTML = `
        <div class="chat-dialog" style="
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0c4a6e 100%);
            border-radius: 20px;
            width: 95%;
            max-width: 600px;
            height: calc(100vh - 40px);
            max-height: calc(100vh - 40px);
            border: 2px solid rgba(6, 182, 212, 0.3);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
            will-change: transform;
        ">
            <div class="chat-header" style="
                padding: 15px 20px;
                border-bottom: 1px solid rgba(6, 182, 212, 0.3);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(6, 182, 212, 0.1);
                flex-shrink: 0;
                min-height: 70px;
                box-sizing: border-box;
            ">
                <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
                    <div style="
                        width: 40px;
                        height: 40px;
                        background: linear-gradient(45deg, #06b6d4, #10b981);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.5rem;
                        flex-shrink: 0;
                    ">🤖</div>
                    <div style="min-width: 0; flex: 1;">
                        <h3 style="color: white; font-size: 1.1rem; margin: 0; font-family: 'Huninn', sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${agentName}</h3>
                        <p style="color: #06b6d4; font-size: 0.85rem; margin: 0; font-family: 'Huninn', sans-serif;">מקוון עכשיו</p>
                    </div>
                </div>
                <button onclick="closeChatDialog()" style="
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    margin-right: -5px;
                ">×</button>
            </div>
            
            <div id="chatMessages" style="
                flex: 1;
                padding: 20px 15px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 15px;
                min-height: 0;
                -webkit-overflow-scrolling: touch;
            ">
                <div class="message agent-message" style="
                    background: rgba(6, 182, 212, 0.1);
                    padding: 12px 16px;
                    border-radius: 15px 15px 15px 5px;
                    border-right: 3px solid #06b6d4;
                    color: white;
                    font-family: 'Huninn', sans-serif;
                    max-width: 85%;
                    align-self: flex-start;
                    line-height: 1.5;
                    font-size: 0.95rem;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                ">
                    שלום! אני ${agentName.split(' - ')[0]} ואני כאן כדי לעזור לך לשפר את העסק שלך. איך אני יכול לעזור לך היום?
                </div>
            </div>
            
            <div class="chat-input-container" style="
                padding: 12px 15px;
                border-top: 1px solid rgba(6, 182, 212, 0.3);
                display: flex;
                gap: 10px;
                align-items: center;
                flex-shrink: 0;
                min-height: 64px;
                box-sizing: border-box;
                background: rgba(0, 0, 0, 0.2);
                padding-bottom: max(12px, env(safe-area-inset-bottom));
            ">
                <input type="text" id="chatInput" placeholder="הקלד הודעה..." style="
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid rgba(6, 182, 212, 0.5);
                    border-radius: 22px;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    font-family: 'Huninn', sans-serif;
                    font-size: 16px;
                    outline: none;
                    box-sizing: border-box;
                    height: 44px;
                    min-width: 0;
                " />
                <button onclick="sendMessage()" id="sendBtn" style="
                    background: linear-gradient(45deg, #06b6d4, #10b981);
                    color: white;
                    border: none;
                    padding: 0;
                    border-radius: 50%;
                    font-size: 1.1rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 44px;
                    height: 44px;
                    flex-shrink: 0;
                    box-sizing: border-box;
                    box-shadow: 0 2px 8px rgba(6, 182, 212, 0.4);
                "><i class='fas fa-paper-plane'></i></button>
            </div>
        </div>
    `;
    
    // Optimized mobile styles - only create once
    if (!document.getElementById('mobile-chat-styles')) {
        const mobileStyle = document.createElement('style');
        mobileStyle.id = 'mobile-chat-styles';
        mobileStyle.textContent = `
            @media (max-width: 768px) {
                .chat-dialog {
                    width: 100% !important;
                    height: 100vh !important;
                    max-height: 100vh !important;
                    border-radius: 0 !important;
                    border: none !important;
                }
                .chat-header { padding: 12px 16px !important; min-height: 60px !important; }
                .chat-header h3 { font-size: 1rem !important; }
                .chat-header p { font-size: 0.8rem !important; }
                #chatMessages { padding: 16px 12px !important; gap: 12px !important; }
                .message { padding: 10px 14px !important; font-size: 0.9rem !important; max-width: 90% !important; }
                .chat-input-container { padding: 10px 12px !important; min-height: 56px !important; gap: 8px !important; }
                #chatInput { padding: 10px 14px !important; height: 40px !important; border-radius: 20px !important; }
                #sendBtn { width: 40px !important; height: 40px !important; }
            }
        `;
        document.head.appendChild(mobileStyle);
    }
    
    document.body.appendChild(chatContainer);
    
    // Optimized click outside to close
    chatContainer.addEventListener('click', function(e) {
        if (e.target === chatContainer) {
            closeChatDialog();
        }
    }, { passive: true });


    // Hide accessibility button on mobile when chat opens
    if (window.innerWidth <= 768) {
        function hideAccessibilityWidget() {
            const accessibilityWidget = document.querySelector('#sienna-widget') || 
                                      document.querySelector('[data-sienna]') || 
                                      document.querySelector('.sienna-widget') ||
                                      document.querySelector('.accessibility-widget') ||
                                      document.querySelector('iframe[src*="sienna"]') ||
                                      document.querySelector('div[id*="sienna"]') ||
                                      document.querySelector('div[class*="sienna"]') ||
                                      document.querySelector('[class*="widget"]') ||
                                      document.querySelector('div[style*="position: fixed"]');
            
            if (accessibilityWidget) {
                const currentDisplay = window.getComputedStyle(accessibilityWidget).display;
                accessibilityWidget.setAttribute('data-original-display', currentDisplay);
                accessibilityWidget.style.display = 'none';
                // Store reference for later restoration
                window.hiddenAccessibilityWidget = accessibilityWidget;
                return true;
            }
            return false;
        }
        
        // Try immediately
        if (!hideAccessibilityWidget()) {
            // If not found, try again after a short delay
            setTimeout(hideAccessibilityWidget, 100);
            setTimeout(hideAccessibilityWidget, 500);
            setTimeout(hideAccessibilityWidget, 1000);
        }
    }
    
    
    // Focus input after small delay
    setTimeout(() => {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.focus();
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            }, { passive: false });
        }
    }, 100);
}

function closeChatDialog() {
    const chatContainer = document.getElementById('chatContainer');
    if (chatContainer) {
        chatContainer.remove();
    }

    if (window.innerWidth <= 768) {
        // First try to restore from stored reference
        if (window.hiddenAccessibilityWidget) {
            const originalDisplay = window.hiddenAccessibilityWidget.getAttribute('data-original-display') || 'block';
            window.hiddenAccessibilityWidget.style.display = originalDisplay;
            window.hiddenAccessibilityWidget.removeAttribute('data-original-display');
            window.hiddenAccessibilityWidget = null;
        } else {
            // Fallback: search for the widget again and force it to show
            const accessibilityWidget = document.querySelector('#sienna-widget') || 
                                      document.querySelector('[data-sienna]') || 
                                      document.querySelector('.sienna-widget') ||
                                      document.querySelector('.accessibility-widget') ||
                                      document.querySelector('iframe[src*="sienna"]') ||
                                      document.querySelector('div[id*="sienna"]') ||
                                      document.querySelector('div[class*="sienna"]') ||
                                      document.querySelector('[class*="widget"]') ||
                                      document.querySelector('div[style*="position: fixed"]');
            
            if (accessibilityWidget) {
                const originalDisplay = accessibilityWidget.getAttribute('data-original-display') || 'block';
                accessibilityWidget.style.display = originalDisplay;
                accessibilityWidget.removeAttribute('data-original-display');
                // Force visibility
                accessibilityWidget.style.visibility = 'visible';
                accessibilityWidget.style.opacity = '1';
            }
        }
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const messagesContainer = document.getElementById('chatMessages');
    const message = input?.value?.trim();
    
    if (!message || !messagesContainer) return;
    
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.style.cssText = `
        background: linear-gradient(45deg, #06b6d4, #10b981);
        padding: 15px;
        border-radius: 15px 15px 5px 15px;
        color: white;
        font-family: 'Huninn', sans-serif;
        max-width: 80%;
        align-self: flex-end;
        margin-left: auto;
    `;
    userMessage.textContent = message;
    messagesContainer.appendChild(userMessage);
    
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Simplified response simulation
    setTimeout(() => {
        const agentMessage = document.createElement('div');
        agentMessage.className = 'message agent-message';
        agentMessage.style.cssText = `
            background: rgba(6, 182, 212, 0.1);
            padding: 15px;
            border-radius: 15px 15px 15px 5px;
            border-right: 3px solid #06b6d4;
            color: white;
            font-family: 'Huninn', sans-serif;
            max-width: 80%;
            align-self: flex-start;
        `;
        agentMessage.textContent = "תודה על ההודעה! אני אחזור אליך בהקדם עם הפרטים המלאים.";
        messagesContainer.appendChild(agentMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
}

// Optimized button click effects - use event delegation
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        e.preventDefault();
        
        // Simple click effect without heavy DOM manipulation
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 150);
    }
}, { passive: false });

// Performance monitoring (optional - remove in production)
if (typeof performance !== 'undefined') {
    console.log('JavaScript optimizations loaded');
}

// Contact Page Specific JavaScript
// ================================

// FAQ Accordion functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active', !isActive);
            });
        }
    });
}

// Contact form validation and handling
function initializeContactForms() {
    // Handle phone number clicks
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Track phone click for analytics (optional)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_click', {
                    'event_category': 'contact',
                    'event_label': 'header_phone'
                });
            }
        });
    });
    
    // Handle email clicks
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Track email click for analytics (optional)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'email_click', {
                    'event_category': 'contact',
                    'event_label': 'contact_email'
                });
            }
        });
    });
    
    // Handle WhatsApp clicks
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Track WhatsApp click for analytics (optional)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    'event_category': 'contact',
                    'event_label': 'whatsapp_contact'
                });
            }
        });
    });
}

// Contact method hover effects
function initializeContactMethodEffects() {
    const contactMethods = document.querySelectorAll('.contact-method');
    
    contactMethods.forEach(method => {
        method.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        method.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Business hours dynamic status
function updateBusinessHoursStatus() {
    const hourItems = document.querySelectorAll('.hour-item');
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
    
    hourItems.forEach(item => {
        const dayText = item.querySelector('span:first-child').textContent;
        const timeText = item.querySelector('span:last-child').textContent;
        
        let isCurrentPeriod = false;
        
        // Check if this is the current day/time period
        if (dayText === 'ימים א\'-ה\'' && currentDay >= 1 && currentDay <= 5) {
            if (currentHour >= 8 && currentHour < 20) {
                isCurrentPeriod = true;
            }
        } else if (dayText === 'יום ו\'' && currentDay === 6) {
            if (currentHour >= 8 && currentHour < 14) {
                isCurrentPeriod = true;
            }
        } else if (dayText === 'שבת' && currentDay === 0) {
            isCurrentPeriod = true;
        } else if (dayText === 'תמיכה חירום') {
            isCurrentPeriod = true;
        }
        
        if (isCurrentPeriod) {
            item.style.background = 'rgba(16, 185, 129, 0.1)';
            item.style.border = '1px solid rgba(16, 185, 129, 0.3)';
            item.querySelector('span:last-child').style.color = '#10b981';
        }
    });
}

// Smooth scroll for internal links
function initializeSmoothScrolling() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Contact page animations on scroll
function initializeContactAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('contact-method')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                } else if (entry.target.classList.contains('faq-item')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, observerOptions);
    
    // Observe contact methods
    const contactMethods = document.querySelectorAll('.contact-method');
    contactMethods.forEach((method, index) => {
        method.style.opacity = '0';
        method.style.transform = 'translateY(30px)';
        method.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(method);
    });
    
    // Observe FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        observer.observe(item);
    });
}

// Copy contact information to clipboard
function initializeContactCopyFeatures() {
    const phoneNumber = document.querySelector('a[href^="tel:"]');
    const emailAddress = document.querySelector('a[href^="mailto:"]');
    
    // Add copy functionality to phone number
    if (phoneNumber) {
        phoneNumber.addEventListener('dblclick', function(e) {
            e.preventDefault();
            const phone = this.textContent.trim();
            navigator.clipboard.writeText(phone).then(() => {
                showCopyNotification('מספר הטלפון הועתק');
            });
        });
    }
    
    // Add copy functionality to email
    if (emailAddress) {
        emailAddress.addEventListener('dblclick', function(e) {
            e.preventDefault();
            const email = this.textContent.trim();
            navigator.clipboard.writeText(email).then(() => {
                showCopyNotification('כתובת האימייל הועתקה');
            });
        });
    }
}

// Show copy notification
function showCopyNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: linear-gradient(45deg, #10b981, #06b6d4);
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        font-family: 'Huninn', sans-serif;
        font-size: 0.9rem;
        font-weight: 500;
        z-index: 9999;
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        transform: translateY(100px);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}



// Initialize contact page on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all contact page functionality
    setTimeout(initializeFAQ, 100);
    setTimeout(initializeContactForms, 150);
    setTimeout(initializeContactMethodEffects, 200);
    setTimeout(updateBusinessHoursStatus, 250);
    setTimeout(initializeSmoothScrolling, 300);
    setTimeout(initializeContactAnimations, 350);
    setTimeout(initializeContactCopyFeatures, 400);
    setTimeout(initializeEnhancedWhatsApp, 450);
});

// Handle mobile navigation for contact page
function initializeMobileContactNav() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-active');
            this.classList.toggle('active');
        });
        
        // Close mobile menu when clicking nav link
        const navLinkItems = document.querySelectorAll('.nav-links a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('mobile-active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }
}

// Update business hours every minute
setInterval(updateBusinessHoursStatus, 60000);

console.log('Contact page JavaScript loaded successfully');