// Service configuration with environment variables
const services = [
  {
    url: import.meta.env.VITE_DIGITAL_URL || '/digital/',
    domain: 'digital.ooo.engineering',
    titleJa: '自社開発wooowアプリ',
    titleEn: 'In-house developed wooow app'
  },
  {
    url: import.meta.env.VITE_ATELIER_URL || '/atelier/',
    domain: 'atelier.ooo.engineering',
    titleJa: 'あなたのためのBespokeの革製品を',
    titleEn: 'Bespoke leather goods crafted for you'
  },
  {
    url: import.meta.env.VITE_EDU_URL || '/edu/',
    domain: 'edu.ooo.engineering',
    titleJa: '次世代ITクリエイター育成',
    titleEn: 'Nurturing next-generation IT creators'
  }
];

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
  // Generate service links
  const servicesGrid = document.getElementById('servicesGrid');
  const linkTarget = import.meta.env.VITE_LINK_TARGET || '_self';
  
  if (servicesGrid) {
    services.forEach(service => {
      const serviceLink = document.createElement('a');
      serviceLink.href = service.url;
      serviceLink.className = 'service-item service-link';
      
      if (linkTarget === '_blank') {
        serviceLink.target = '_blank';
        serviceLink.rel = 'noopener noreferrer';
      }
      
      serviceLink.innerHTML = `
        <h3>${service.domain}</h3>
        <p data-ja="${service.titleJa}" data-en="${service.titleEn}">
          ${service.titleJa}
        </p>
      `;
      
      servicesGrid.appendChild(serviceLink);
    });
  }
  // Language switching functionality
  let currentLang = 'ja';
  
  const langSwitch = document.getElementById('langSwitch');
  const htmlElement = document.documentElement;
  
  // Initialize Vanta.js
  if (typeof VANTA !== 'undefined') {
    VANTA.DOTS({
      el: "#body",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0xc3c3c3,
      color2: 0x0,
      backgroundColor: 0xffffff,
      spacing: 31.00,
      showLines: false
    });
  }
  
  function switchToEnglish() {
    currentLang = 'en';
    htmlElement.lang = 'en';
    document.body.classList.add('lang-en');
    
    // Update all text content including dynamically generated ones
    document.querySelectorAll('[data-en]').forEach(element => {
      element.textContent = element.getAttribute('data-en');
    });
    
    // Save preference
    localStorage.setItem('preferred-language', 'en');
  }
  
  function switchToJapanese() {
    currentLang = 'ja';
    htmlElement.lang = 'ja';
    document.body.classList.remove('lang-en');
    
    // Update all text content including dynamically generated ones
    document.querySelectorAll('[data-ja]').forEach(element => {
      element.textContent = element.getAttribute('data-ja');
    });
    
    // Save preference
    localStorage.setItem('preferred-language', 'ja');
  }
  
  // Load saved language preference
  const savedLang = localStorage.getItem('preferred-language');
  if (savedLang && (savedLang === 'ja' || savedLang === 'en')) {
    currentLang = savedLang;
    if (currentLang === 'en') {
      switchToEnglish();
    }
  }
  
  // Language switch handler
  if (langSwitch) {
    langSwitch.addEventListener('click', () => {
      if (currentLang === 'ja') {
        switchToEnglish();
      } else {
        switchToJapanese();
      }
    });
  }
  
  // Smooth scrolling for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});