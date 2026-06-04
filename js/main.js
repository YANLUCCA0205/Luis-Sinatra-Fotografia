/**
 * ============================================================
 * Luis Sinatra Fotografia — Main JavaScript
 * Premium Photography Landing Page
 * Vanilla JS · ES6+ · No frameworks or libraries
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // ──────────────────────────────────────────────
  // Utility: Throttle via requestAnimationFrame
  // ──────────────────────────────────────────────
  const rafThrottle = (callback) => {
    let ticking = false;
    return (...args) => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          callback(...args);
          ticking = false;
        });
      }
    };
  };

  // ──────────────────────────────────────────────
  // Cache frequently used DOM elements
  // ──────────────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const hero = document.querySelector('.hero');
  const ctaBanner = document.querySelector('.cta-banner');
  const reserveBanner = document.querySelector('.reserve-banner');
  const whatsappFloat = document.querySelector('.whatsapp-float');
  const NAVBAR_HEIGHT = 70;
  const WHATSAPP_NUMBER = '5534999860384';

  // ──────────────────────────────────────────────
  // 2. Navbar Scroll Effect
  // ──────────────────────────────────────────────
  const handleNavbarScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // ──────────────────────────────────────────────
  // 14. WhatsApp Float Button – show/hide on scroll
  // ──────────────────────────────────────────────
  const handleWhatsappVisibility = () => {
    if (!whatsappFloat) return;
    if (window.scrollY > 300) {
      whatsappFloat.classList.add('visible');
    } else {
      whatsappFloat.classList.remove('visible');
    }
  };

  // Set WhatsApp float link
  if (whatsappFloat) {
    const defaultMsg = encodeURIComponent(
      'Olá! Vim pelo site e gostaria de mais informações sobre os serviços de fotografia.'
    );
    const waLink = whatsappFloat.querySelector('a') || whatsappFloat;
    if (waLink.tagName === 'A') {
      waLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${defaultMsg}`;
      waLink.target = '_blank';
      waLink.rel = 'noopener noreferrer';
    } else {
      whatsappFloat.addEventListener('click', () => {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${defaultMsg}`, '_blank');
      });
    }
  }

  // ──────────────────────────────────────────────
  // Combined throttled scroll handler
  // ──────────────────────────────────────────────
  const onScroll = rafThrottle(() => {
    handleNavbarScroll();
    handleWhatsappVisibility();
  });

  window.addEventListener('scroll', onScroll, { passive: true });

  // Fire once on load to set initial state
  handleNavbarScroll();
  handleWhatsappVisibility();

  // ──────────────────────────────────────────────
  // 3. Active Section Indicator (IntersectionObserver)
  // ──────────────────────────────────────────────
  const sectionIds = [
    'inicio', 'sobre', 'portfolio', 'servicos',
    'depoimentos', 'processo', 'faq', 'contato'
  ];

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const activateNavLink = (id) => {
    navAnchors.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activateNavLink(entry.target.id);
        }
      });
    },
    {
      rootMargin: `-${NAVBAR_HEIGHT}px 0px -40% 0px`,
      threshold: 0.1,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // ──────────────────────────────────────────────
  // 4. Smooth Scroll with Offset
  // ──────────────────────────────────────────────
  const smoothScrollTo = (targetEl) => {
    if (!targetEl) return;
    const top =
      targetEl.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  // Handle ALL anchor links that start with #
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) smoothScrollTo(target);

      // Close mobile menu if open
      if (menuToggle && navLinks) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  });

  // Scroll indicator → scroll to #sobre
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', (e) => {
      e.preventDefault();
      const sobre = document.getElementById('sobre');
      if (sobre) smoothScrollTo(sobre);
    });
  }

  // ──────────────────────────────────────────────
  // 16. Back to Top – logo & 'Início' link
  // ──────────────────────────────────────────────
  const logo = document.querySelector('.navbar .logo, .navbar .logo-link');
  if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ──────────────────────────────────────────────
  // 5. Mobile Menu Toggle
  // ──────────────────────────────────────────────
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.classList.toggle('menu-open', isOpen);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        navLinks.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }

  // ──────────────────────────────────────────────
  // 6. Scroll Reveal Animations
  // ──────────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay, 10) || 0;

          setTimeout(() => {
            el.classList.add('active');
          }, delay);

          observer.unobserve(el); // Animate only once
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ──────────────────────────────────────────────
  // 8. Animated Counters
  // ──────────────────────────────────────────────
  const countersSection = document.querySelector('.counters');
  const counterValues = document.querySelectorAll('.counter-value');
  let countersAnimated = false;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const easeOutQuad = (t) => t * (2 - t); // ease-out easing

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);
      const currentValue = Math.floor(easedProgress * target);

      el.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + '+';
      }
    };

    requestAnimationFrame(step);
  };

  if (countersSection && counterValues.length) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            counterValues.forEach((cv) => animateCounter(cv));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    counterObserver.observe(countersSection);
  }

  // ──────────────────────────────────────────────
  // 9. Portfolio Filter
  // ──────────────────────────────────────────────
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach((item) => {
        const category = item.dataset.category;
        const shouldShow = filter === 'all' || category === filter;

        if (shouldShow) {
          item.classList.remove('hide');
          // Small delay to trigger CSS transition after display change
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          // Wait for transition before hiding
          setTimeout(() => {
            item.classList.add('hide');
          }, 300);
        }
      });
    });
  });

  // ──────────────────────────────────────────────
  // 10. Lightbox Gallery
  // ──────────────────────────────────────────────
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg =
    lightbox && (lightbox.querySelector('.lightbox-img') || lightbox.querySelector('img'));
  const lightboxClose = lightbox && lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox && lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox && lightbox.querySelector('.lightbox-next');
  const lightboxCounter = lightbox && lightbox.querySelector('.lightbox-counter');
  let lightboxCurrentIndex = 0;

  /** Returns only currently visible (not filtered-out) portfolio items */
  const getVisiblePortfolioItems = () => {
    return Array.from(portfolioItems).filter(
      (item) => !item.classList.contains('hide')
    );
  };

  const openLightbox = (index) => {
    if (!lightbox || !lightboxImg) return;
    const visibleItems = getVisiblePortfolioItems();
    if (index < 0 || index >= visibleItems.length) return;

    lightboxCurrentIndex = index;
    const item = visibleItems[index];
    const img = item.querySelector('img');
    if (!img) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
    lightbox.classList.add('active');
    document.body.classList.add('lightbox-open');
    updateLightboxCounter();
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.classList.remove('lightbox-open');
  };

  const navigateLightbox = (direction) => {
    const visibleItems = getVisiblePortfolioItems();
    if (!visibleItems.length) return;

    lightboxCurrentIndex =
      (lightboxCurrentIndex + direction + visibleItems.length) %
      visibleItems.length;

    const item = visibleItems[lightboxCurrentIndex];
    const img = item.querySelector('img');
    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';
    }
    updateLightboxCounter();
  };

  const updateLightboxCounter = () => {
    if (!lightboxCounter) return;
    const total = getVisiblePortfolioItems().length;
    lightboxCounter.textContent = `${lightboxCurrentIndex + 1} / ${total}`;
  };

  // Portfolio item clicks → open lightbox
  portfolioItems.forEach((item) => {
    item.addEventListener('click', () => {
      const visibleItems = getVisiblePortfolioItems();
      const index = visibleItems.indexOf(item);
      if (index !== -1) openLightbox(index);
    });
  });

  // Close lightbox
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  // Click backdrop to close
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Navigation arrows
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(-1);
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(1);
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        navigateLightbox(-1);
        break;
      case 'ArrowRight':
        navigateLightbox(1);
        break;
    }
  });

  // Touch / swipe support for lightbox
  if (lightbox) {
    let touchStartX = 0;
    let touchEndX = 0;
    const SWIPE_THRESHOLD = 50;

    lightbox.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    lightbox.addEventListener(
      'touchend',
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > SWIPE_THRESHOLD) {
          if (diff > 0) {
            navigateLightbox(1); // Swipe left → next
          } else {
            navigateLightbox(-1); // Swipe right → prev
          }
        }
      },
      { passive: true }
    );
  }

  // ──────────────────────────────────────────────
  // 11. Testimonials Carousel
  // ──────────────────────────────────────────────
  const testimonialsTrack = document.querySelector('.testimonials-track');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const carouselPrev = document.querySelector('.carousel-btn.prev');
  const carouselNext = document.querySelector('.carousel-btn.next');
  const carouselDots = document.querySelectorAll('.carousel-dot');
  let carouselIndex = 0;
  let carouselAutoPlay = null;
  const AUTOPLAY_INTERVAL = 5000;

  const updateCarousel = () => {
    if (!testimonialsTrack || !testimonialCards.length) return;

    // Slide the track
    testimonialsTrack.style.transform = `translateX(-${carouselIndex * 100}%)`;

    // Update dots
    carouselDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === carouselIndex);
    });
  };

  const goToSlide = (index) => {
    if (!testimonialCards.length) return;
    carouselIndex =
      ((index % testimonialCards.length) + testimonialCards.length) %
      testimonialCards.length;
    updateCarousel();
  };

  const nextSlide = () => goToSlide(carouselIndex + 1);
  const prevSlide = () => goToSlide(carouselIndex - 1);

  const startAutoPlay = () => {
    stopAutoPlay();
    carouselAutoPlay = setInterval(nextSlide, AUTOPLAY_INTERVAL);
  };

  const stopAutoPlay = () => {
    if (carouselAutoPlay) {
      clearInterval(carouselAutoPlay);
      carouselAutoPlay = null;
    }
  };

  if (testimonialsTrack && testimonialCards.length) {
    // Arrow buttons
    if (carouselNext) {
      carouselNext.addEventListener('click', () => {
        nextSlide();
        startAutoPlay(); // Reset timer on manual interaction
      });
    }
    if (carouselPrev) {
      carouselPrev.addEventListener('click', () => {
        prevSlide();
        startAutoPlay();
      });
    }

    // Dot navigation
    carouselDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goToSlide(i);
        startAutoPlay();
      });
    });

    // Pause on hover
    const carouselContainer =
      testimonialsTrack.closest('.testimonials-carousel') ||
      testimonialsTrack.parentElement;

    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', stopAutoPlay);
      carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // Touch / swipe for carousel
    let carouselTouchStartX = 0;
    let carouselTouchEndX = 0;

    testimonialsTrack.addEventListener(
      'touchstart',
      (e) => {
        carouselTouchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
      },
      { passive: true }
    );

    testimonialsTrack.addEventListener(
      'touchend',
      (e) => {
        carouselTouchEndX = e.changedTouches[0].screenX;
        const diff = carouselTouchStartX - carouselTouchEndX;

        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
        startAutoPlay();
      },
      { passive: true }
    );

    // Initial state & auto-play
    updateCarousel();
    startAutoPlay();
  }

  // ──────────────────────────────────────────────
  // 12. FAQ Accordion
  // ──────────────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items first
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) {
            otherAnswer.style.maxHeight = null;
          }
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ──────────────────────────────────────────────
  // 13. Contact Form Handling + WhatsApp Integration
  // ──────────────────────────────────────────────
  const contactForm = document.querySelector('.contact-form');

  /**
   * Shows an inline error message below a field.
   * Creates the element if it doesn't exist yet.
   */
  const showError = (field, message) => {
    field.classList.add('error');
    let errorEl = field.parentElement.querySelector('.error-message');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.classList.add('error-message');
      field.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  };

  /** Clears the error state from a field */
  const clearError = (field) => {
    field.classList.remove('error');
    const errorEl = field.parentElement.querySelector('.error-message');
    if (errorEl) {
      errorEl.style.display = 'none';
      errorEl.textContent = '';
    }
  };

  /** Simple email regex */
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Gather fields
      const nameField = contactForm.querySelector('[name="name"], [name="nome"]');
      const emailField = contactForm.querySelector('[name="email"]');
      const phoneField = contactForm.querySelector('[name="phone"], [name="telefone"]');
      const serviceField = contactForm.querySelector('[name="service"], [name="servico"]');
      const messageField = contactForm.querySelector('[name="message"], [name="mensagem"]');

      // ── Validate Name ──
      if (nameField) {
        const nameVal = nameField.value.trim();
        if (!nameVal || nameVal.length < 3) {
          showError(nameField, 'Por favor, insira seu nome (mínimo 3 caracteres).');
          isValid = false;
        } else {
          clearError(nameField);
        }
      }

      // ── Validate Email ──
      if (emailField) {
        const emailVal = emailField.value.trim();
        if (!emailVal || !isValidEmail(emailVal)) {
          showError(emailField, 'Por favor, insira um e-mail válido.');
          isValid = false;
        } else {
          clearError(emailField);
        }
      }

      // ── Validate Phone ──
      if (phoneField) {
        const phoneVal = phoneField.value.trim();
        if (!phoneVal || phoneVal.length < 10) {
          showError(phoneField, 'Por favor, insira um telefone válido (mínimo 10 dígitos).');
          isValid = false;
        } else {
          clearError(phoneField);
        }
      }

      // ── Validate Service ──
      if (serviceField) {
        const serviceVal = serviceField.value;
        if (!serviceVal || serviceVal === '') {
          showError(serviceField, 'Por favor, selecione um tipo de serviço.');
          isValid = false;
        } else {
          clearError(serviceField);
        }
      }

      // ── Validate Message ──
      if (messageField) {
        const msgVal = messageField.value.trim();
        if (!msgVal || msgVal.length < 10) {
          showError(messageField, 'Por favor, insira uma mensagem (mínimo 10 caracteres).');
          isValid = false;
        } else {
          clearError(messageField);
        }
      }

      // ── If valid → build WhatsApp message & open ──
      if (isValid) {
        const name = nameField ? nameField.value.trim() : '';
        const email = emailField ? emailField.value.trim() : '';
        const phone = phoneField ? phoneField.value.trim() : '';
        const service = serviceField
          ? serviceField.options[serviceField.selectedIndex].text
          : '';
        const message = messageField ? messageField.value.trim() : '';

        const waMessage = [
          '🎥 *Nova mensagem do site — Luis Sinatra Fotografia*',
          '',
          `👤 *Nome:* ${name}`,
          `📧 *E-mail:* ${email}`,
          `📱 *Telefone:* ${phone}`,
          `📋 *Serviço:* ${service}`,
          '',
          `💬 *Mensagem:*`,
          message,
        ].join('\n');

        const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;
        window.open(waUrl, '_blank');

        // Success state
        contactForm.classList.add('submitted');
        contactForm.reset();

        // Remove error states
        contactForm.querySelectorAll('.error').forEach((el) => {
          el.classList.remove('error');
        });
        contactForm.querySelectorAll('.error-message').forEach((el) => {
          el.style.display = 'none';
        });

        // Optional: show success feedback
        let successEl = contactForm.querySelector('.form-success');
        if (!successEl) {
          successEl = document.createElement('div');
          successEl.classList.add('form-success');
          successEl.textContent =
            '✅ Mensagem enviada com sucesso! Entraremos em contato em breve.';
          contactForm.appendChild(successEl);
        }
        successEl.style.display = 'block';

        // Hide success message after 5 seconds
        setTimeout(() => {
          successEl.style.display = 'none';
          contactForm.classList.remove('submitted');
        }, 5000);
      }
    });

    // Clear errors on input
    contactForm.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('input', () => clearError(field));
      field.addEventListener('change', () => clearError(field));
    });
  }

  // ──────────────────────────────────────────────
  // 15. Lazy Load Images – IntersectionObserver Fallback
  // ──────────────────────────────────────────────
  if (!('loading' in HTMLImageElement.prototype)) {
    // Browser doesn't support native lazy loading — use IO fallback
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    const lazyObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '200px' }
    );

    lazyImages.forEach((img) => lazyObserver.observe(img));
  }

  // ──────────────────────────────────────────────
  // End of DOMContentLoaded
  // ──────────────────────────────────────────────
});
