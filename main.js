import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Image sequence scroll scrub logic
const canvas = document.getElementById('hero-canvas');
const context = canvas?.getContext('2d');
const transparentSections = document.querySelector('.transparent-sections');

const frameCount = 288;
const currentFrame = index => (
  `/sequ24fps/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
);

const images = [];
const sequence = {
  frame: 0
};

if (canvas && context && transparentSections) {
  // Set canvas size
  canvas.width = 1920;
  canvas.height = 1080;

  // Preload images
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }

  // Draw first frame once it's loaded
  images[0].onload = render;

  function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[sequence.frame], 0, 0, canvas.width, canvas.height);
  }

  // GSAP ScrollTrigger to scrub through the image sequence
  ScrollTrigger.create({
    trigger: transparentSections,
    start: "top top",
    end: "bottom top",
    scrub: 0.5, // added a little bit of smoothing
    onUpdate: (self) => {
      // Calculate the frame index based on scroll progress
      const progress = self.progress;
      let targetFrame = Math.floor(progress * (frameCount - 1));
      
      // Ensure target frame is within bounds
      targetFrame = Math.max(0, Math.min(targetFrame, frameCount - 1));
      
      if (sequence.frame !== targetFrame) {
        sequence.frame = targetFrame;
        // Only render if the image is loaded
        if (images[sequence.frame].complete) {
            requestAnimationFrame(render);
        }
      }
    }
  });
}
// Change pill nav styling based on scroll position (dark/light transitions)
const nav = document.querySelector('.pill-nav');
const logo = document.querySelector('.brand-logo');
const themeSections = document.querySelectorAll('.light-section, .dark-portfolio, .start-section');

themeSections.forEach((section, index) => {
  const isLight = section.classList.contains('light-section');
  
  ScrollTrigger.create({
    trigger: section,
    start: "top 5%",
    end: "bottom 5%",
    onEnter: () => {
      if (isLight) {
        if (nav) nav.classList.add('scrolled-light');
        if (logo) logo.classList.add('scrolled-light');
      } else {
        if (nav) nav.classList.remove('scrolled-light');
        if (logo) logo.classList.remove('scrolled-light');
      }
    },
    onEnterBack: () => {
      if (isLight) {
        if (nav) nav.classList.add('scrolled-light');
        if (logo) logo.classList.add('scrolled-light');
      } else {
        if (nav) nav.classList.remove('scrolled-light');
        if (logo) logo.classList.remove('scrolled-light');
      }
    },
    onLeaveBack: () => {
      // If we scroll back up past the first section, revert to dark theme
      if (index === 0 && isLight) {
        if (nav) nav.classList.remove('scrolled-light');
        if (logo) logo.classList.remove('scrolled-light');
      }
    }
  });
});

// Parallax for hero title
gsap.to(".hero-content", {
  y: "15vh",
  ease: "none",
  scrollTrigger: {
    trigger: ".hero-transparent",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});

// Slide up animations for cards and content
const slideUps = document.querySelectorAll('.slide-up');

slideUps.forEach((element) => {
  gsap.fromTo(element, 
    { 
      y: 60, 
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    }
  );
});

// Staggered slide up animation for service cards
gsap.fromTo(".services-grid .service-card",
  {
    y: 150, // Start further down for a marked effect
    opacity: 0
  },
  {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.2, // Sequential appearance
    scrollTrigger: {
      trigger: ".services-grid",
      start: "top 85%", // Trigger when the grid enters the viewport
      toggleActions: "play none none reverse"
    }
  }
);

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-btn, .btn-primary').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId.startsWith('#')) {
      e.preventDefault();
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  });
});

// Image sequence scroll scrub logic for the final start section
const startCanvas = document.getElementById('start-canvas');
const startContext = startCanvas?.getContext('2d');
const startSection = document.getElementById('start');

const startFrameCount = 240;
const startCurrentFrame = index => (
  `/sequ_axoA/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
);

const startImages = [];
const startSequence = {
  frame: 0
};

if (startCanvas && startContext && startSection) {
  startCanvas.width = 1920;
  startCanvas.height = 1080;

  for (let i = 0; i < startFrameCount; i++) {
    const img = new Image();
    img.src = startCurrentFrame(i);
    startImages.push(img);
  }

  startImages[0].onload = renderStart;

  function renderStart() {
    startContext.clearRect(0, 0, startCanvas.width, startCanvas.height);
    startContext.drawImage(startImages[startSequence.frame], 0, 0, startCanvas.width, startCanvas.height);
  }

  ScrollTrigger.create({
    trigger: startSection,
    start: "top bottom", // Start when the top of the section hits the bottom of the viewport
    end: "bottom top",   // End when the bottom of the section hits the top of the viewport
    scrub: 0.5,
    onUpdate: (self) => {
      const progress = self.progress;
      let targetFrame = Math.floor(progress * (startFrameCount - 1));
      
      targetFrame = Math.max(0, Math.min(targetFrame, startFrameCount - 1));
      
      if (startSequence.frame !== targetFrame) {
        startSequence.frame = targetFrame;
        if (startImages[startSequence.frame].complete) {
            requestAnimationFrame(renderStart);
        }
      }
    }
  });
}

