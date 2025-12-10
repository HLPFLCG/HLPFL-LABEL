// Animation Utilities
// Helper functions for animations and transitions

export class AnimationUtils {
    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    static fadeOut(element, duration = 300) {
        let start = null;
        const initialOpacity = parseFloat(window.getComputedStyle(element).opacity);
        
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            
            element.style.opacity = initialOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    }

    static slideIn(element, direction = 'up', duration = 400) {
        const transforms = {
            up: 'translateY(100px)',
            down: 'translateY(-100px)',
            left: 'translateX(100px)',
            right: 'translateX(-100px)'
        };
        
        element.style.transform = transforms[direction];
        element.style.opacity = '0';
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.transition = `all ${duration}ms ease`;
            element.style.transform = 'translate(0)';
            element.style.opacity = '1';
            
            setTimeout(() => {
                element.style.transition = '';
            }, duration);
        }, 10);
    }

    static staggeredAnimation(elements, delay = 100, animationClass = 'fade-in-up') {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add(animationClass, 'animate');
            }, index * delay);
        });
    }

    static observeElements(selector, callback, options = {}) {
        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observerOptions = { ...defaultOptions, ...options };
        const observer = new IntersectionObserver(callback, observerOptions);
        
        document.querySelectorAll(selector).forEach(element => {
            observer.observe(element);
        });
        
        return observer;
    }

    static typingEffect(element, text, speed = 50) {
        element.textContent = '';
        let index = 0;
        
        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }

    static countUp(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    }

    static parallaxEffect(elements, speed = 0.5) {
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            
            elements.forEach(element => {
                const rate = scrolled * -speed;
                element.style.transform = `translateY(${rate}px)`;
            });
        };
        
        window.addEventListener('scroll', updateParallax);
        updateParallax();
    }

    static smoothScroll(target, duration = 800) {
        const startPosition = window.pageYOffset;
        const targetPosition = target.offsetTop - 100;
        const distance = targetPosition - startPosition;
        let start = null;
        
        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };
        
        const easeInOutQuad = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };
        
        requestAnimationFrame(animation);
    }
}

// Loading animation
export class LoadingAnimation {
    static show(message = 'Loading...') {
        const existingLoader = document.querySelector('.global-loader');
        if (existingLoader) {
            existingLoader.remove();
        }
        
        const loader = document.createElement('div');
        loader.className = 'global-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        
        const content = loader.querySelector('.loader-content');
        content.style.cssText = `
            text-align: center;
            color: white;
        `;
        
        const spinner = loader.querySelector('.loader-spinner');
        spinner.style.cssText = `
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid var(--color-gold, #c87941);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        `;
        
        document.body.appendChild(loader);
        return loader;
    }

    static hide() {
        const loader = document.querySelector('.global-loader');
        if (loader) {
            AnimationUtils.fadeOut(loader, 300);
            setTimeout(() => {
                loader.remove();
            }, 300);
        }
    }
}