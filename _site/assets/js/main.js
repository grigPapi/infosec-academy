/**
 * InfoSec Academy - Основной JavaScript файл
 * Содержит общие функции для всего сайта
 */

document.addEventListener('DOMContentLoaded', function() {
  // Инициализация всех модулей
  initMobileMenu();
  initSmoothScroll();
  initTopicAccordions();
  initThemeToggle();
  
  // Инициализация страницы урока, если она загружена
  if (document.querySelector('.lesson-content')) {
    initTOCHighlight();
    initScrollTop();
  }
  
  // Инициализация страницы курсов, если она загружена
  if (document.querySelector('.course-grid')) {
    initCourseAnimations();
  }
});

/**
 * Мобильное меню
 */
function initMobileMenu() {
  const menuButton = document.createElement('button');
  menuButton.textContent = '☰';
  menuButton.className = 'mobile-menu-toggle';
  menuButton.setAttribute('aria-label', 'Открыть меню');
  
  const headerContent = document.querySelector('.header-content');
  const nav = document.querySelector('nav');
  
  if (headerContent && nav) {
    headerContent.insertBefore(menuButton, nav);
    
    menuButton.addEventListener('click', function() {
      menuButton.classList.toggle('active');
      nav.classList.toggle('active');
      
      if (nav.classList.contains('active')) {
        menuButton.setAttribute('aria-expanded', 'true');
        menuButton.setAttribute('aria-label', 'Закрыть меню');
      } else {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Открыть меню');
      }
    });
    
    // Закрыть меню при клике вне его
    document.addEventListener('click', function(event) {
      if (!event.target.closest('nav') && !event.target.classList.contains('mobile-menu-toggle') && nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuButton.classList.remove('active');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Открыть меню');
      }
    });
    
    // Обновить состояние меню при изменении размера окна
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768 && nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuButton.classList.remove('active');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/**
 * Плавная прокрутка для якорных ссылок
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: 'smooth'
        });
        
        // Обновление URL без перезагрузки страницы
        history.pushState(null, null, targetId);
      }
    });
  });
}

/**
 * Инициализация аккордеонов для топиков
 */
function initTopicAccordions() {
  const topicHeaders = document.querySelectorAll('.topic-header, .js-toggle-topic');
  
  topicHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const isActive = content.classList.contains('active');
      const toggleIcon = this.querySelector('.topic-toggle');
      
      // Закрыть все активные секции
      document.querySelectorAll('.topic-content, .topic-item .active').forEach(item => {
        item.classList.remove('active');
      });
      
      document.querySelectorAll('.topic-toggle').forEach(icon => {
        icon.textContent = '+';
      });
      
      // Если раздел не был активен, открыть его
      if (!isActive) {
        content.classList.add('active');
        if (toggleIcon) {
          toggleIcon.textContent = '−';
        }
      }
    });
  });
  
  // Также обрабатываем FAQ аккордеоны
  const faqQuestions = document.querySelectorAll('.faq-question, .js-toggle-faq');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const isActive = answer.classList.contains('active');
      const toggleIcon = this.querySelector('.faq-toggle');
      
      // Если ответ не активен, открыть его
      answer.classList.toggle('active');
      
      if (toggleIcon) {
        toggleIcon.textContent = isActive ? '+' : '−';
      }
    });
  });
}

/**
 * Подсветка активного раздела в оглавлении урока
 */
function initTOCHighlight() {
  const tocLinks = document.querySelectorAll('.toc-menu a');
  const sections = document.querySelectorAll('.lesson-section');
  
  if (tocLinks.length && sections.length) {
    function highlightActiveTOCItem() {
      const scrollPosition = window.scrollY;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          const id = section.getAttribute('id');
          
          tocLinks.forEach(link => {
            link.classList.remove('active');
            
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }
    
    window.addEventListener('scroll', highlightActiveTOCItem);
    highlightActiveTOCItem(); // Вызов при загрузке страницы
  }
}

/**
 * Кнопка "Наверх"
 */
function initScrollTop() {
  const scrollTopButton = document.createElement('button');
  scrollTopButton.textContent = '↑';
  scrollTopButton.className = 'scroll-top-button';
  scrollTopButton.setAttribute('aria-label', 'Прокрутить наверх');
  
  document.body.appendChild(scrollTopButton);
  
  scrollTopButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      scrollTopButton.classList.add('visible');
    } else {
      scrollTopButton.classList.remove('visible');
    }
  });
}

/**
 * Анимация карточек курсов при прокрутке
 */
function initCourseAnimations() {
  const cards = document.querySelectorAll('.course-card');
  
  // Инициализация стилей
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
  });
  
  function animateOnScroll() {
    cards.forEach(card => {
      const cardPosition = card.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;
      
      if (cardPosition < screenPosition) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }
    });
  }
  
  window.addEventListener('scroll', animateOnScroll);
  window.addEventListener('load', animateOnScroll);
  animateOnScroll(); // Вызов при загрузке
}

/**
 * Переключение светлой/темной темы
 */
function initThemeToggle() {
  // Проверить сохраненную тему в localStorage или системные настройки
  let darkTheme = localStorage.getItem('darkTheme');
  
  if (darkTheme === null) {
    // Если тема не задана, проверить системные настройки
    darkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } else {
    darkTheme = darkTheme === 'true';
  }
  
  // Создать кнопку переключения темы
  const themeToggleButton = document.createElement('button');
  themeToggleButton.className = 'theme-toggle';
  themeToggleButton.textContent = darkTheme ? '☀️' : '🌙';
  themeToggleButton.setAttribute('aria-label', darkTheme ? 'Включить светлую тему' : 'Включить темную тему');
  
  // Добавить кнопку в навигацию
  const nav = document.querySelector('nav ul');
  
  if (nav) {
    const themeToggleLi = document.createElement('li');
    themeToggleLi.className = 'theme-toggle-li';
    themeToggleLi.appendChild(themeToggleButton);
    nav.appendChild(themeToggleLi);
    
    // Применить начальное состояние
    applyTheme(darkTheme);
    
    // Обработчик переключения темы
    themeToggleButton.addEventListener('click', function() {
      darkTheme = !darkTheme;
      applyTheme(darkTheme);
      localStorage.setItem('darkTheme', darkTheme);
    });
  }
  
  // Функция применения темы
  function applyTheme(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggleButton.textContent = isDark ? '☀️' : '🌙';
    themeToggleButton.setAttribute('aria-label', isDark ? 'Включить светлую тему' : 'Включить темную тему');
  }
}