document.addEventListener('DOMContentLoaded', function() {
  // Color Blindness Toggle
  const colorBlindToggle = document.getElementById('color-blind-toggle');
  
  colorBlindToggle.addEventListener('click', () => {
      document.body.classList.toggle('color-blind-mode');
  });

  // Voice Command Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
          const command = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();

          if (command.includes('scroll up')) {
              window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
          } else if (command.includes('scroll down')) {
              window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
          } else if (command.includes('blind')) {
              document.body.classList.toggle('color-blind-mode');
          }
      };

      recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
      };

      try {
          recognition.start();
      } catch (error) {
          console.warn('Speech recognition could not start:', error);
      }
  } else {
      console.warn('Speech Recognition API not supported in this browser.');
  }

  // Smooth Scrolling
  function smoothScrollToSection(sectionId) {
      const targetSection = document.getElementById(sectionId);
      if (!targetSection) return;
    
      const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 1000;
      let startTime = null;
    
      function animation(currentTime) {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const run = ease(timeElapsed, startPosition, distance, duration);
          window.scrollTo(0, run);
          if (timeElapsed < duration) requestAnimationFrame(animation);
      }
    
      function ease(t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t + b;
          t--;
          return -c / 2 * (t * (t - 2) - 1) + b;
      }
    
      requestAnimationFrame(animation);
  }

  // Navigation Link Event Listeners
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href').substring(1);
          smoothScrollToSection(targetId);
      });
  });

  // Active Navigation Link Highlighting
  const sections = document.querySelectorAll('section');
  let ticking = false;

  function highlightNavLink() {
      let scrollPosition = window.scrollY;

      if (scrollPosition < sections[1].offsetTop - 100) {
          navLinks.forEach(link => link.classList.remove('active'));
          document.querySelector('#nav-home').classList.add('active');
          return;
      }

      for (let i = 1; i < sections.length; i++) {
          const section = sections[i];
          const navLink = navLinks[i - 1];
          
          const sectionTop = section.offsetTop - 100;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
              navLinks.forEach(link => link.classList.remove('active'));
              navLink.classList.add('active');
              return;
          }
      }
  }

  function onScroll() {
      if (!ticking) {
          window.requestAnimationFrame(() => {
              highlightNavLink();
              ticking = false;
          });
          ticking = true;
      }
  }

  window.addEventListener('scroll', onScroll);
  highlightNavLink();

  // Font Size Adjustment
  const increaseFontButton = document.getElementById('increase-font');
  const decreaseFontButton = document.getElementById('decrease-font');
  let fontSize = 16; // Default base font size

  function adjustFontSize(increment) {
      fontSize = Math.min(Math.max(fontSize + increment, 12), 24); // Clamp between 12 and 24
      document.body.style.fontSize = `${fontSize}px`;
  }

  increaseFontButton.addEventListener('click', () => adjustFontSize(2));
  decreaseFontButton.addEventListener('click', () => adjustFontSize(-2));
});
