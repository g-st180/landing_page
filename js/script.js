// Testimonials Carousel
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.testimonials-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.testimonial-slide');
    let currentIndex = 0;
    let autoSlideInterval;
    
    // Create navigation dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    dotsContainer.style.cssText = 'display: flex; justify-content: center; gap: 0.5rem; margin-top: 2rem;';
    
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.style.cssText = 'width: 12px; height: 12px; border-radius: 50%; border: none; background: #e5e7eb; cursor: pointer; transition: background 0.3s;';
        if (index === 0) {
            dot.style.background = '#2e7d32';
        }
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    carousel.parentElement.appendChild(dotsContainer);
    
    // Create navigation arrows
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-prev';
    prevBtn.innerHTML = '‹';
    prevBtn.setAttribute('aria-label', 'Previous slide');
    prevBtn.style.cssText = 'position: absolute; left: -50px; top: 50%; transform: translateY(-50%); background: #2e7d32; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 24px; display: flex; align-items: center; justify-content: center;';
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-next';
    nextBtn.innerHTML = '›';
    nextBtn.setAttribute('aria-label', 'Next slide');
    nextBtn.style.cssText = 'position: absolute; right: -50px; top: 50%; transform: translateY(-50%); background: #2e7d32; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 24px; display: flex; align-items: center; justify-content: center;';
    
    const carouselWrapper = document.createElement('div');
    carouselWrapper.style.cssText = 'position: relative;';
    carousel.parentElement.insertBefore(carouselWrapper, carousel);
    carouselWrapper.appendChild(carousel);
    carouselWrapper.appendChild(prevBtn);
    carouselWrapper.appendChild(nextBtn);
    
    // Cache mobile state to avoid forced reflows
    let isMobileView = window.innerWidth <= 768;
    
    // Check if mobile view (cached)
    function isMobile() {
        return isMobileView;
    }
    
    function updateCarousel() {
        const slidesPerView = isMobile() ? 1 : 2;
        
        // Batch all DOM writes together to avoid forced reflows
        // First, collect all style changes
        const slideChanges = [];
        slides.forEach((slide, index) => {
            const shouldShow = index >= currentIndex && index < currentIndex + slidesPerView;
            slideChanges.push({ slide, display: shouldShow ? 'block' : 'none' });
        });
        
        // Apply all slide changes at once
        slideChanges.forEach(({ slide, display }) => {
            slide.style.display = display;
        });
        
        // Then update dots
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        const dotIndex = isMobile() ? currentIndex : Math.floor(currentIndex / 2);
        dots.forEach((dot, index) => {
            dot.style.background = index === dotIndex ? '#2e7d32' : '#e5e7eb';
        });
    }
    
    function goToSlide(index) {
        if (isMobile()) {
            currentIndex = index;
        } else {
            currentIndex = index * 2;
            if (currentIndex >= slides.length) {
                currentIndex = slides.length - 2;
            }
        }
        updateCarousel();
        resetAutoSlide();
    }
    
    function nextSlide() {
        const slidesPerView = isMobile() ? 1 : 2;
        currentIndex += slidesPerView;
        if (currentIndex >= slides.length) {
            currentIndex = 0;
        }
        updateCarousel();
        resetAutoSlide();
    }
    
    function prevSlide() {
        const slidesPerView = isMobile() ? 1 : 2;
        currentIndex -= slidesPerView;
        if (currentIndex < 0) {
            currentIndex = slides.length - slidesPerView;
        }
        updateCarousel();
        resetAutoSlide();
    }
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Initialize
    updateCarousel();
    startAutoSlide();
    
    // Debounced resize handler to avoid forced reflows
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const wasMobile = isMobileView;
            isMobileView = window.innerWidth <= 768;
            // Only update if mobile state changed
            if (wasMobile !== isMobileView) {
                updateCarousel();
            }
        }, 150);
    });
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handler
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        // Here you would typically send the email to your backend
        alert('Thank you for subscribing! (This is a demo - form submission is not connected)');
        this.reset();
    });
}

// Add scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation - batch style writes to avoid forced reflows
const elementsToAnimate = document.querySelectorAll('.benefit-card, .feature-item, .testimonial-slide');
requestAnimationFrame(() => {
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

