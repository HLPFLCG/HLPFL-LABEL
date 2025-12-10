/**
 * Main JavaScript for website animations and interactions
 */
document.addEventListener('DOMContentLoaded', () => {
  // Check if required libraries are loaded
  const requiredLibraries = ['gsap', 'ScrollTrigger', 'LocomotiveScroll', 'SplitType', 'THREE'];
  const missingLibraries = requiredLibraries.filter(lib => !window[lib]);
  
  if (missingLibraries.length > 0) {
    console.error(`Missing required libraries: ${missingLibraries.join(', ')}`);
    return;
  }
  
  // Start with preloader
  initPreloader();
});

function initPreloader() {
  const preloader = document.querySelector('.preloader');
  
  // If no preloader element exists, move directly to animations
  if (!preloader) {
    console.log('No preloader found, initializing animations directly');
    initMainAnimations();
    return;
  }
  
  // Example preloader animation - customize as needed
  gsap.to(preloader, {
    opacity: 0,
    duration: 1,
    onComplete: () => {
      preloader.style.display = 'none';
      initMainAnimations();
    }
  });
}

function initMainAnimations() {
  // Initialize Locomotive Scroll
  const scrollContainer = document.querySelector('[data-scroll-container]');
  if (!scrollContainer) {
    console.error('Scroll container not found');
    return;
  }
  
  const scroll = new LocomotiveScroll({
    el: scrollContainer,
    smooth: true,
    lerp: 0.08,
    smartphone: { smooth: true },
    tablet: { smooth: true }
  });
  
  // Setup ScrollTrigger integration
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.scrollerProxy('[data-scroll-container]', {
    scrollTop(value) {
      return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: scrollContainer.style.transform ? 'transform' : 'fixed'
  });
  
  // Update ScrollTrigger when scroll updates
  scroll.on('scroll', ScrollTrigger.update);
  ScrollTrigger.addEventListener('refresh', () => scroll.update());
  ScrollTrigger.defaults({ scroller: '[data-scroll-container]' });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    setTimeout(() => scroll.update(), 300);
    ScrollTrigger.refresh();
  });
  
  // Initialize all components
  initCustomCursor();
  init3DElements();
  initTextAnimations();
  initScrollAnimations();
  initNavigation(scroll);
  
  // Final refresh of ScrollTrigger
  ScrollTrigger.refresh();
}

function initCustomCursor() {
  const cursor = document.querySelector('.cursor');
  if (!cursor) return;
  
  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1
    });
  });
  
  // Add hover effect for interactive elements
  document.querySelectorAll('a, button, .hoverable').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

function init3DElements() {
  const canvases = document.querySelectorAll('.three-canvas');
  if (!canvases.length) return;
  
  canvases.forEach(canvas => {
    // Basic THREE.js setup - customize as needed
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    camera.position.z = 5;
    
    // Add a simple mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
  });
}

function initTextAnimations() {
  // Using SplitType for text animations
  const textElements = document.querySelectorAll('.animate-text');
  if (!textElements.length) return;
  
  textElements.forEach(element => {
    const split = new SplitType(element, { types: 'chars, words' });
    
    gsap.from(split.chars, {
      opacity: 0,
      y: 20,
      stagger: 0.02,
      duration: 0.8,
      ease: 'back.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%'
      }
    });
  });
}

function initScrollAnimations() {
  // Fade-in animations
  gsap.utils.toArray('.fade-in').forEach(element => {
    gsap.from(element, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      scrollTrigger: {
        trigger: element,
        start: 'top 85%'
      }
    });
  });
  
  // Parallax elements
  gsap.utils.toArray('.parallax').forEach(element => {
    const speed = element.dataset.speed || 0.2;
    
    gsap.to(element, {
      y: () => -100 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}

// Disable heavy animations on mobile
const isMobile = window.matchMedia('(max-width: 768px)').matches;
if (isMobile) {
  // Simpler animations for mobile
  document.body.classList.add('reduce-motion');
}

function initNavigation(scroll) {
  const toggle = document.querySelector('.nav__toggle');
  const navList = document.querySelector('.nav__list');
  
  // Mobile menu toggle
  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      navList.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }
  
  // Smooth scrolling using event delegation
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-scroll-to]');
    if (!link) return;
    
    e.preventDefault();
    
    // Extract target from href (handle both #id and full URL formats)
    const href = link.getAttribute('href');
    const targetId = href.includes('#') ? href.substring(href.indexOf('#')) : href;
    
    // Scroll to target
    if (scroll) {
      scroll.scrollTo(targetId);
    }
    
    // Close mobile menu if open
    if (toggle && navList) {
      toggle.classList.remove('active');
      navList.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
  
  // Highlight active section in navigation
  if (scroll) {
    scroll.on('scroll', () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = scroll.scroll.instance.scroll.y;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          const id = section.getAttribute('id');
          document.querySelectorAll('.nav__link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    });
  }
}
