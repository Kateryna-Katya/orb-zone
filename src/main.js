document.addEventListener('DOMContentLoaded', () => {
  // 1. Инициализация иконок Lucide
  lucide.createIcons();

  // 2. Мобильное меню
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

  const toggleMenu = () => {
      burger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  };

  if (burger) {
      burger.addEventListener('click', toggleMenu);
  }

  mobileLinks.forEach(link => {
      link.addEventListener('click', toggleMenu);
  });

  // 3. Липкий хедер
  window.addEventListener('scroll', () => {
      const header = document.querySelector('.header');
      if (window.scrollY > 50) {
          header.style.padding = '12px 0';
          header.style.background = 'rgba(255, 255, 255, 0.95)';
          header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
      } else {
          header.style.padding = '20px 0';
          header.style.background = 'rgba(255, 255, 255, 0.8)';
          header.style.boxShadow = 'none';
      }
  });

  // 4. GSAP & ScrollTrigger Анимации
  gsap.registerPlugin(ScrollTrigger);

  // Hero Section
  const titleText = new SplitType('.title-anim', { types: 'words, chars' });
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl.from(titleText.chars, { opacity: 0, y: 50, rotateX: -90, stagger: 0.02, duration: 1 })
        .from('.fade-anim', { opacity: 0, y: 30, stagger: 0.2, duration: 0.8 }, '-=0.6')
        .from('.hero__visual', { opacity: 0, scale: 0.9, duration: 1.2 }, '-=1');

  gsap.to('.floating-anim', { y: -20, rotation: 2, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  // Универсальное появление при скролле (fade-up)
  const fadeElements = document.querySelectorAll('.fade-up');
  fadeElements.forEach(el => {
      gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%" },
          opacity: 0, y: 40, duration: 1, ease: "power3.out"
      });
  });

  // Анимация счетчиков в секции преимуществ
  const counters = document.querySelectorAll('.counter-box__number');
  counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const updateCount = () => {
          const count = +counter.innerText;
          const inc = target / 150;
          if (count < target) {
              counter.innerText = Math.ceil(count + inc);
              setTimeout(updateCount, 15);
          } else { counter.innerText = target; }
      };
      ScrollTrigger.create({ trigger: counter, start: "top 90%", onEnter: updateCount });
  });

  // 5. Контактная форма & Капча
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const phoneInput = document.getElementById('phone');
  const captchaLabel = document.getElementById('captcha-question');
  const captchaInput = document.getElementById('captcha-answer');

  if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/[^\d+()-\s]/g, '');
      });
  }

  let num1 = Math.floor(Math.random() * 10) + 1;
  let num2 = Math.floor(Math.random() * 10) + 1;
  let correctAnswer = num1 + num2;
  if (captchaLabel) captchaLabel.innerText = `${num1} + ${num2} = ?`;

  if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
          e.preventDefault();
          if (parseInt(captchaInput.value) !== correctAnswer) {
              alert('Ошибка капчи. Попробуйте снова.');
              return;
          }
          const btn = document.getElementById('submitBtn');
          btn.disabled = true;
          btn.innerHTML = 'Отправка...';

          setTimeout(() => {
              gsap.to(contactForm, { opacity: 0, y: -20, duration: 0.5, onComplete: () => {
                  contactForm.style.display = 'none';
                  formSuccess.style.display = 'block';
                  gsap.from(formSuccess, { opacity: 0, y: 20, duration: 0.5 });
              }});
          }, 1500);
      });
  }

  // 6. Cookie Popup Logic
  const cookiePopup = document.getElementById('cookie-popup');
  const cookieAccept = document.getElementById('cookie-accept');

  if (!localStorage.getItem('cookies-accepted')) {
      setTimeout(() => {
          cookiePopup.classList.add('show');
      }, 2000);
  }

  if (cookieAccept) {
      cookieAccept.addEventListener('click', () => {
          localStorage.setItem('cookies-accepted', 'true');
          cookiePopup.classList.remove('show');
      });
  }

  console.log('Orb-Zone Ecosystem fully loaded.');
});

// Глобальная функция сброса формы
window.resetFormUI = () => {
  location.hash = "#contact";
  location.reload(); // Простой способ сбросить все состояния для демо
};