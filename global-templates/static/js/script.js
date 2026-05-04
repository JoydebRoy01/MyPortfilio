// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const cursorGlow = document.getElementById('cursorGlow');
const particleCanvas = document.getElementById('particleCanvas');
const typedText = document.getElementById('typedText');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

// ===== Typing Animation =====
const roles = ['Python Developer', 'Django Expert', 'Backend Engineer', 'API Architect'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeRole() {
  const currentRole = roles[roleIndex];
  
  if (!isDeleting) {
    typedText.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    
    if (charIndex === currentRole.length) {
      setTimeout(() => { isDeleting = true; }, 2000);
    }
  } else {
    typedText.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  
  const speed = isDeleting ? 50 : 100;
  setTimeout(typeRole, speed);
}

// ===== Particle Animation =====
function initParticles() {
  if (!particleCanvas) return;
  
  const ctx = particleCanvas.getContext('2d');
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
  
  const particles = [];
  const colors = ['#00d4ff', '#7c3aed', '#00ff88'];
  const particleCount = 80;
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * particleCanvas.width,
      y: Math.random() * particleCanvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
  
  function animate() {
    ctx.fillStyle = 'rgba(5, 5, 16, 0.1)';
    ctx.fillRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    particles.forEach((p, i) => {
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      
      // Bounce off edges
      if (p.x < 0 || p.x > particleCanvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > particleCanvas.height) p.vy *= -1;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      
      // Draw connections
      particles.slice(i + 1).forEach(p2 => {
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - dist / 150)})`;
          ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Handle resize
  window.addEventListener('resize', () => {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  });
}

// ===== Cursor Glow Effect =====
function initCursorGlow() {
  if (!cursorGlow || window.innerWidth < 768) return;
  
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    cursorGlow.style.opacity = '1';
  });
  
  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
  });
}

// ===== Navbar Scroll Effect =====
function handleScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  // Update active nav link based on scroll position
  const sections = document.querySelectorAll('section[id]');
  let currentSection = 'home';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 200;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

// ===== Mobile Menu Toggle =====
function toggleMobileMenu() {
  navMenu.classList.toggle('active');
  const icon = navToggle.querySelector('i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-times');
}

// ===== Close mobile menu on link click =====
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
      toggleMobileMenu();
    }
  });
});

// ===== Scroll Animations =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Animate skill bars when visible
        if (entry.target.classList.contains('skill-category')) {
          const progressBars = entry.target.querySelectorAll('.skill-progress');
          progressBars.forEach(bar => {
            bar.style.animationPlayState = 'running';
          });
        }
      }
    });
  }, observerOptions);
  
  // Observe elements
  document.querySelectorAll('.skill-category, .project-card, .timeline-item, .service-card, .about-grid, .contact-grid').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
}

// ===== Contact Form Handler =====
function handleFormSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  
  // Simulate form submission
  formStatus.textContent = 'Sending...';
  formStatus.className = 'form-status';
  
  setTimeout(() => {
    formStatus.textContent = '✓ Message sent successfully!';
    formStatus.className = 'form-status success';
    contactForm.reset();
    
    setTimeout(() => {
      formStatus.textContent = '';
    }, 3000);
  }, 1500);
}

// ===== Smooth Scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
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

// ===== Set current year in footer =====
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ===== Add SVG gradient for circular skills =====
function addSVGGradient() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.innerHTML = `
    <defs>
      <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#00d4ff" />
        <stop offset="50%" stop-color="#7c3aed" />
        <stop offset="100%" stop-color="#00ff88" />
      </linearGradient>
    </defs>
  `;
  document.body.appendChild(svg);
}

// ===== 3D Card Tilt Effect =====
function init3DCards() {
  const cards = document.querySelectorAll('.project-card.featured');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
  // Start typing animation
  typeRole();
  
  // Initialize particle background
  initParticles();
  
  // Initialize cursor glow
  initCursorGlow();
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);
  
  // Mobile menu toggle
  navToggle.addEventListener('click', toggleMobileMenu);
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Contact form handler
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
  
  // Add SVG gradient
  addSVGGradient();
  
  // Initialize 3D card effects
  init3DCards();
  
  // Initial scroll check
  handleScroll();
});

