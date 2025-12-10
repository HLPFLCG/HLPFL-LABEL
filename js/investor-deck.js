// Investor Presentation Deck JavaScript

class InvestorDeck {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 14;
        this.isFullscreen = false;
        this.isPlaying = false;
        this.autoplayInterval = null;
        this.init();
    }

    init() {
        this.updateSlideIndicator();
        this.setupKeyboardControls();
        this.setupTouchControls();
        this.loadProgress();
        this.preloadImages();
        
        // Add smooth transitions
        this.addTransitions();
    }

    // Navigation functions
    changeSlide(direction) {
        const newSlide = this.currentSlide + direction;
        
        if (newSlide >= 1 && newSlide <= this.totalSlides) {
            this.hideSlide(this.currentSlide);
            this.currentSlide = newSlide;
            this.showSlide(this.currentSlide);
            this.updateSlideIndicator();
            this.saveProgress();
            
            // Add transition effect
            this.addSlideAnimation();
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
            this.hideSlide(this.currentSlide);
            this.currentSlide = slideNumber;
            this.showSlide(this.currentSlide);
            this.updateSlideIndicator();
            this.saveProgress();
        }
    }

    showSlide(slideNumber) {
        const slide = document.querySelector(`[data-slide="${slideNumber}"]`);
        if (slide) {
            slide.classList.add('active');
            this.animateSlideContent(slide);
        }
    }

    hideSlide(slideNumber) {
        const slide = document.querySelector(`[data-slide="${slideNumber}"]`);
        if (slide) {
            slide.classList.remove('active');
        }
    }

    // Animation functions
    animateSlideContent(slide) {
        const elements = slide.querySelectorAll('.slide-content > *');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    addSlideAnimation() {
        const activeSlide = document.querySelector('.slide.active');
        if (activeSlide) {
            activeSlide.style.animation = 'slideIn 0.5s ease';
        }
    }

    addTransitions() {
        const slides = document.querySelectorAll('.slide');
        slides.forEach(slide => {
            slide.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
        });
    }

    // Keyboard controls
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    this.changeSlide(1);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.changeSlide(-1);
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
                case 'Escape':
                    if (this.isFullscreen) {
                        this.toggleFullscreen();
                    }
                    break;
                case 'f':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'p':
                    e.preventDefault();
                    this.togglePresentation();
                    break;
            }
        });
    }

    // Touch controls for mobile
    setupTouchControls() {
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        this.handleSwipe = () => {
            if (touchEndX < touchStartX - 50) {
                this.changeSlide(1); // Swipe left - next slide
            }
            if (touchEndX > touchStartX + 50) {
                this.changeSlide(-1); // Swipe right - previous slide
            }
        };
    }

    // UI Updates
    updateSlideIndicator() {
        const currentSlideElement = document.getElementById('current-slide');
        const totalSlidesElement = document.getElementById('total-slides');
        
        if (currentSlideElement) {
            currentSlideElement.textContent = this.currentSlide;
        }
        if (totalSlidesElement) {
            totalSlidesElement.textContent = this.totalSlides;
        }
    }

    // Fullscreen functionality
    toggleFullscreen() {
        const container = document.querySelector('.presentation-container');
        
        if (!this.isFullscreen) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            }
            document.body.classList.add('fullscreen');
            this.isFullscreen = true;
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            document.body.classList.remove('fullscreen');
            this.isFullscreen = false;
        }
    }

    // Autoplay functionality
    togglePresentation() {
        const playButton = document.querySelector('.control-btn i.fa-play, .control-btn i.fa-pause');
        
        if (this.isPlaying) {
            this.stopAutoplay();
            if (playButton) {
                playButton.classList.remove('fa-pause');
                playButton.classList.add('fa-play');
            }
        } else {
            this.startAutoplay();
            if (playButton) {
                playButton.classList.remove('fa-play');
                playButton.classList.add('fa-pause');
            }
        }
    }

    startAutoplay() {
        this.isPlaying = true;
        this.autoplayInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides) {
                this.changeSlide(1);
            } else {
                this.goToSlide(1); // Loop back to first slide
            }
        }, 5000); // 5 seconds per slide
    }

    stopAutoplay() {
        this.isPlaying = false;
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    // Progress tracking
    saveProgress() {
        localStorage.setItem('investorDeckProgress', this.currentSlide);
    }

    loadProgress() {
        const savedProgress = localStorage.getItem('investorDeckProgress');
        if (savedProgress) {
            this.goToSlide(parseInt(savedProgress));
        }
    }

    // Image preloading
    preloadImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            const preloadImg = new Image();
            preloadImg.src = img.src;
        });
    }

    // PDF generation
    downloadPDF() {
        // This would typically use a library like jsPDF or html2canvas
        // For now, we'll create a simple text outline
        const slideContent = this.extractSlideContent();
        const blob = new Blob([slideContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'HLPFL-Investor-Presentation-Outline.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    extractSlideContent() {
        let content = 'HLPFL Record Label - Investor Presentation\n';
        content += '=' .repeat(50) + '\n\n';
        
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            const slideNumber = index + 1;
            const slideTitle = slide.querySelector('h1')?.textContent || `Slide ${slideNumber}`;
            const slideContent = slide.querySelector('.slide-content')?.textContent || '';
            
            content += `Slide ${slideNumber}: ${slideTitle}\n`;
            content += '-'.repeat(30) + '\n';
            content += slideContent.trim() + '\n\n';
        });
        
        return content;
    }

    // Speaker notes
    showSpeakerNotes() {
        const activeSlide = document.querySelector('.slide.active');
        const notes = activeSlide?.querySelector('.speaker-notes');
        
        if (notes) {
            notes.style.display = notes.style.display === 'none' ? 'block' : 'none';
        }
    }

    // Export functionality
    exportPresentation() {
        const presentationData = {
            title: 'HLPFL Record Label Investor Presentation',
            date: new Date().toISOString(),
            currentSlide: this.currentSlide,
            totalSlides: this.totalSlides,
            slides: this.extractSlidesData()
        };
        
        const blob = new Blob([JSON.stringify(presentationData, null, 2)], { 
            type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'HLPFL-Investor-Deck.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    extractSlidesData() {
        const slides = [];
        document.querySelectorAll('.slide').forEach((slide, index) => {
            slides.push({
                number: index + 1,
                title: slide.querySelector('h1')?.textContent || '',
                content: slide.querySelector('.slide-content')?.innerHTML || ''
            });
        });
        return slides;
    }
}

// Initialize the deck when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.investorDeck = new InvestorDeck();
});

// Global functions for button onclick handlers
function changeSlide(direction) {
    window.investorDeck.changeSlide(direction);
}

function toggleFullscreen() {
    window.investorDeck.toggleFullscreen();
}

function togglePresentation() {
    window.investorDeck.togglePresentation();
}

function downloadPDF() {
    window.investorDeck.downloadPDF();
}

// Add some additional utility functions
function printPresentation() {
    window.print();
}

function sharePresentation() {
    if (navigator.share) {
        navigator.share({
            title: 'HLPFL Record Label Investor Presentation',
            text: 'Check out this investment opportunity in the music industry',
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Presentation link copied to clipboard!');
    }
}

// Add keyboard shortcuts help
function showHelp() {
    const helpText = `
Keyboard Shortcuts:
→ or Space: Next slide
←: Previous slide
Home: First slide
End: Last slide
F: Toggle fullscreen
P: Play/Pause autoplay
ESC: Exit fullscreen

Touch Controls:
Swipe Left: Next slide
Swipe Right: Previous slide
    `;
    alert(helpText);
}

// Performance optimization
function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('*').forEach(el => {
            el.style.transition = 'none';
        });
    }
}

// Initialize optimizations
document.addEventListener('DOMContentLoaded', optimizePerformance);

// Analytics tracking (placeholder)
function trackSlideView(slideNumber) {
    // This would typically send data to analytics service
    console.log(`Viewed slide ${slideNumber}`);
    
    // Example: Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'slide_view', {
            'slide_number': slideNumber,
            'presentation': 'HLPFL_Investor_Deck'
        });
    }
}

// Track slide changes
const originalChangeSlide = window.investorDeck?.changeSlide;
if (originalChangeSlide) {
    window.investorDeck.changeSlide = function(direction) {
        originalChangeSlide.call(this, direction);
        trackSlideView(this.currentSlide);
    };
}