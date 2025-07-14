// Language switching functionality
document.addEventListener('DOMContentLoaded', () => {
  let currentLang = 'ja';
  
  const langSwitch = document.getElementById('langSwitch');
  const htmlElement = document.documentElement;
  
  // Spline is loaded automatically via the spline-viewer web component
  
  // Beta button TestFlight link
  const betaButton = document.getElementById('betaButton');
  if (betaButton) {
    // TestFlight URL for wooow app beta
    const testFlightURL = 'https://testflight.apple.com/join/gpZNNSzn';
    
    betaButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(testFlightURL, '_blank');
    });
  }
  
  function switchToEnglish() {
    currentLang = 'en';
    htmlElement.lang = 'en';
    document.body.classList.add('lang-en');
    
    document.querySelectorAll('[data-en]').forEach(element => {
      if (element.tagName === 'SPAN' || element.tagName === 'DIV' || element.tagName === 'P' || element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3' || element.tagName === 'A' || element.tagName === 'DT' || element.tagName === 'DD' || element.tagName === 'LI') {
        element.textContent = element.getAttribute('data-en');
      }
    });
    
    localStorage.setItem('preferred-language', 'en');
  }
  
  function switchToJapanese() {
    currentLang = 'ja';
    htmlElement.lang = 'ja';
    document.body.classList.remove('lang-en');
    
    document.querySelectorAll('[data-ja]').forEach(element => {
      if (element.tagName === 'SPAN' || element.tagName === 'DIV' || element.tagName === 'P' || element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3' || element.tagName === 'A' || element.tagName === 'DT' || element.tagName === 'DD' || element.tagName === 'LI') {
        element.textContent = element.getAttribute('data-ja');
      }
    });
    
    localStorage.setItem('preferred-language', 'ja');
  }
  
  const savedLang = localStorage.getItem('preferred-language');
  if (savedLang && (savedLang === 'ja' || savedLang === 'en')) {
    currentLang = savedLang;
    if (currentLang === 'en') {
      switchToEnglish();
    }
  }
  
  if (langSwitch) {
    langSwitch.addEventListener('click', () => {
      if (currentLang === 'ja') {
        switchToEnglish();
      } else {
        switchToJapanese();
      }
    });
  }
});