// Navbar mobile toggle
document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  const dropdownToggle = document.querySelector('.nav-dropdown-toggle');
  const dropdown = document.querySelector('.nav-dropdown');

  if (navToggle && navbar) {
    navToggle.addEventListener('click', () => {
      navbar.classList.toggle('mobile-open');
    });
  }

  // Close mobile menu when clicking a link
  if (navLinksContainer && navbar) {
    navLinksContainer.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        navbar.classList.remove('mobile-open');
      }
    });
  }

  // Dropdown toggle (especially for mobile)
  if (dropdownToggle && dropdown) {
    dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    document.addEventListener('click', () => {
      dropdown.classList.remove('open');
    });
  }

  // Highlight active nav link based on current page
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-links a[href]');

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Set current year in footer (for all elements with class js-year)
  const yearSpans = document.querySelectorAll('.js-year');
  const currentYear = new Date().getFullYear();
  yearSpans.forEach((span) => {
    span.textContent = currentYear;
  });

  // Contact form handling (only on contact page)
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = contactForm.querySelector('input[name="name"]');
      const email = contactForm.querySelector('input[name="email"]');
      const subject = contactForm.querySelector('input[name="subject"]');
      const message = contactForm.querySelector('textarea[name="message"]');

      if (!name.value.trim() || !email.value.trim() || !subject.value.trim() || !message.value.trim()) {
        showToast('Te rog completează toate câmpurile înainte să trimiți.');
        return;
      }

      // Fake "sending"
      showToast('Trimitem mesajul către Open Focșani… (simulare)');

      setTimeout(() => {
        showToast('Mulțumim! În versiunea live mesajul tău va ajunge direct la echipa Open Focșani.');
        contactForm.reset();
      }, 1300);
    });
  }
});

// Simple toast
let toastTimeout;
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3800);
}

  // About slider (Despre noi)
  const aboutSlides = document.querySelectorAll('.about-slide');
  const aboutDots = document.querySelectorAll('.about-dot');
  const aboutPrev = document.querySelector('.about-slider-control.prev');
  const aboutNext = document.querySelector('.about-slider-control.next');

  if (aboutSlides.length > 0) {
    let currentSlide = 0;

    function showSlide(index) {
      aboutSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
      aboutDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      currentSlide = index;
    }

    function nextSlide(delta) {
      const total = aboutSlides.length;
      let next = (currentSlide + delta + total) % total;
      showSlide(next);
    }

    if (aboutPrev && aboutNext) {
      aboutPrev.addEventListener('click', () => nextSlide(-1));
      aboutNext.addEventListener('click', () => nextSlide(1));
    }

    aboutDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'), 10);
        showSlide(index);
      });
    });
  }