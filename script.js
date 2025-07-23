document.addEventListener('DOMContentLoaded', function() {
    // --- Элементы DOM ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const headerContent = document.querySelector('.header-content');
    const navLinksAll = document.querySelectorAll('.nav-links a');
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    const header = document.getElementById('header');
    const backToTopBtn = document.querySelector('.back-to-top');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    const contactForm = document.getElementById('quartz-form');
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    const statsNumbers = document.querySelectorAll('.stat-number .counter'); // Обновлено для выбора span.counter
    const statsSection = document.querySelector('.stats');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const productTypes = document.querySelectorAll('.product-type');
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const quickOrderForm = document.getElementById('quick-order-form');
    const aboutProductSvg = document.querySelector('.about-product-svg');

    // --- Инициализация AOS ---
    AOS.init({
        duration: 800, // Продолжительность анимации
        once: true, // Анимация срабатывает только один раз
        offset: 100, // Смещение для запуска анимации
    });

    // --- Анимация для SVG в секции "О нашем продукте" ---
    if (aboutProductSvg) {
        const sandParticles = aboutProductSvg.querySelectorAll('.sand-particles-large circle, .sand-particles-small circle');
        const molecule = aboutProductSvg.querySelector('.molecule');
        
        // Добавляем интерактивность при наведении
        aboutProductSvg.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left; // x позиция внутри элемента
            const y = e.clientY - rect.top;  // y позиция внутри элемента
            
            // Создаем эффект параллакса для частиц песка
            sandParticles.forEach((particle, index) => {
                const speed = index % 3 === 0 ? 2 : index % 2 === 0 ? 1.5 : 1;
                const cx = parseFloat(particle.getAttribute('cx'));
                const cy = parseFloat(particle.getAttribute('cy'));
                
                // Смещаем частицы в зависимости от положения курсора
                particle.style.transform = `translate(${(x - rect.width/2) / speed * 0.05}px, ${(y - rect.height/2) / speed * 0.05}px)`;
            });
            
            // Эффект следования для молекулы
            if (molecule) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const moveX = (x - centerX) * 0.01;
                const moveY = (y - centerY) * 0.01;
                
                molecule.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });
        
        // Сброс трансформаций при уходе курсора
        aboutProductSvg.addEventListener('mouseleave', function() {
            sandParticles.forEach(particle => {
                particle.style.transform = 'translate(0, 0)';
            });
            
            if (molecule) {
                molecule.style.transform = 'translate(0, 0)';
            }
        });
    }

    // --- Мобильное меню ---
    if (mobileMenuBtn && headerContent) {
        mobileMenuBtn.addEventListener('click', () => {
            headerContent.classList.toggle('show');
            document.body.classList.toggle('menu-open');
        });
    }

    // Закрытие мобильного меню при клике на ссылку
    navLinksAll.forEach(link => {
        link.addEventListener('click', () => {
            if (headerContent && headerContent.classList.contains('show')) {
                headerContent.classList.remove('show');
                document.body.classList.remove('menu-open');
            }
        });
    });

    // Закрытие мобильного меню при клике вне меню
    document.addEventListener('click', function(event) {
        if (headerContent && mobileMenuBtn) {
            const isClickInsideMenu = headerContent.contains(event.target);
            const isClickOnMenuBtn = mobileMenuBtn.contains(event.target);

            if (!isClickInsideMenu && !isClickOnMenuBtn && headerContent.classList.contains('show')) {
                headerContent.classList.remove('show');
                document.body.classList.remove('menu-open');
            }
        }
    });

    // --- Плавная прокрутка ---
    smoothScrollLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = header ? header.offsetHeight : 80; // Учитываем высоту шапки
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Изменение шапки и кнопки "Наверх" при прокрутке ---
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        if (header) {
            if (scrollPosition > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        if (backToTopBtn) {
            if (scrollPosition > 300) { // Показываем кнопку после 300px прокрутки
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    });

    // Кнопка "Наверх"
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Анимация статистики ---
    let statsAnimated = false;
    function animateStats() {
        if (!statsSection || statsAnimated) return;

        const statsSectionTop = statsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (statsSectionTop < windowHeight * 0.8) { // Запускаем анимацию, когда секция видна на 80%
            statsNumbers.forEach(stat => {
                const targetValue = parseInt(stat.closest('.stat-number').dataset.value || stat.textContent); // Получаем значение из data-атрибута
                if (isNaN(targetValue)) return;

                let currentValue = 0;
                const duration = 2000; // 2 секунды
                const steps = 50; // Количество шагов
                const increment = targetValue / steps;
                const stepTime = duration / steps;

                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= targetValue) {
                        stat.textContent = targetValue.toLocaleString('ru-RU') + (stat.closest('.stat-number').textContent.includes('+') ? '+' : ''); // Форматируем число и добавляем '+' если был
                        clearInterval(counter);
                    } else {
                        stat.textContent = Math.floor(currentValue).toLocaleString('ru-RU');
                    }
                }, stepTime);
            });
            statsAnimated = true;
        }
    }
    window.addEventListener('scroll', animateStats);
    animateStats(); // Первоначальная проверка

     // --- Фильтрация продуктов ---
    if (filterBtns.length > 0 && productCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filterValue = btn.getAttribute('data-filter');

                // Показываем/скрываем блоки с марками песка
                productTypes.forEach(type => {
                    if (filterValue === 'all' || type.id === filterValue + '-type') {
                        type.classList.add('active');
                    } else {
                        type.classList.remove('active');
                    }
                });
                // Фильтруем карточки
                productCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.style.display = 'block';
                        // Можно добавить анимацию появления, если используется AOS
                        // card.classList.add('aos-animate');
                    } else {
                        card.style.display = 'none';
                        // card.classList.remove('aos-animate');
                    }
                });
            });
        });
        // Активируем первый фильтр по умолчанию
        if (document.querySelector('.filter-btn[data-filter="all"]')) {
            document.querySelector('.filter-btn[data-filter="all"]').click();
        }
    }

    // --- Табы --- 
    if (tabButtons.length > 0 && tabPanes.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                const targetPane = document.getElementById(tabId);
                if (targetPane) {
                     targetPane.classList.add('active');
                     // Переинициализация AOS для анимирования контента в табах
                     AOS.refreshHard(); 
                }
            });
        });
        // Активируем первый таб по умолчанию
        if(tabButtons[0]) tabButtons[0].click();
    }

    // --- Слайдер отзывов ---
    let currentSlide = 0;
    if (testimonials.length > 0 && dots.length > 0) {
        function showSlide(index) {
            // Скрываем все слайды и деактивируем точки
            testimonials.forEach((slide, i) => {
                slide.style.display = 'none';
                slide.style.opacity = '0';
                slide.style.transform = 'translateX(50px)';
                dots[i].classList.remove('active');
            });
            
            // Показываем активный слайд и активируем соответствующую точку
            testimonials[index].style.display = 'block';
            dots[index].classList.add('active');
            
            // Добавляем небольшую задержку перед анимацией для плавности
            setTimeout(() => {
                testimonials[index].style.opacity = '1';
                testimonials[index].style.transform = 'translateX(0)';
            }, 50);
            
            currentSlide = index;
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showSlide((currentSlide + 1) % testimonials.length);
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showSlide((currentSlide - 1 + testimonials.length) % testimonials.length);
            });
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });

        // Устанавливаем индексы для звездочек для анимации с задержкой
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.style.setProperty('--i', index % 5);
        });

        showSlide(0); // Показать первый слайд
        
        // Автопрокрутка (опционально)
        const autoplayInterval = 7000; // 7 секунд между слайдами
        let slideInterval = setInterval(() => {
            showSlide((currentSlide + 1) % testimonials.length);
        }, autoplayInterval);
        
        // Останавливаем автопрокрутку при наведении на слайдер
        const sliderContainer = document.querySelector('.testimonials-slider');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            sliderContainer.addEventListener('mouseleave', () => {
                slideInterval = setInterval(() => {
                    showSlide((currentSlide + 1) % testimonials.length);
                }, autoplayInterval);
            });
        }
    }

    // --- Модальные окна ---
     function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.classList.add('modal-open');
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('show');
            // Проверяем, есть ли еще открытые модальные окна
            const anyModalOpen = document.querySelector('.modal.show');
            if (!anyModalOpen) {
                document.body.classList.remove('modal-open');
            }
        }
    }

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            
            // Специальная логика для кнопки "Подробнее" о продукте
            if (modalId === 'product-details') {
                const card = this.closest('.product-card');
                if (card) {
                    const productName = card.querySelector('h3').textContent;
                    const productDescription = card.querySelector('p').textContent;
                    const specsContainer = document.querySelector('#product-details .specs-content');
                    
                    if (specsContainer) {
                        specsContainer.innerHTML = `
                            <h3>${productName}</h3>
                            <p>${productDescription}</p>
                            <h4>Характеристики:</h4>
                            <ul>
                                ${[...card.querySelectorAll('.spec')].map(spec => `<li>${spec.innerHTML}</li>`).join('')}
                            </ul>
                            <p><i>Полные технические характеристики предоставляются по запросу.</i></p>
                        `;
                    }
                }
            }

            openModal(modalId);
        });
    });

    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeModal(this.closest('.modal'));
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            // Закрываем при клике на фон (но не на контент внутри)
            if (e.target === this) {
                closeModal(this);
            }
        });
    });

    // Закрытие модального окна по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });

    // --- Маска для телефона ---
    phoneInputs.forEach(input => {
        // Простая маска (можно заменить на более сложную библиотеку)
        input.addEventListener('input', (e) => {
            let value = input.value.replace(/\D/g, '');
            let formattedValue = '';
            if (value.length > 0) {
                formattedValue += '+';
                if (value.length > 1) formattedValue += value.substring(0, 1);
                if (value.length > 1) formattedValue += ' (' + value.substring(1, 4);
                if (value.length > 4) formattedValue += ') ' + value.substring(4, 7);
                if (value.length > 7) formattedValue += '-' + value.substring(7, 9);
                if (value.length > 9) formattedValue += '-' + value.substring(9, 11);
            }
            input.value = formattedValue.substring(0, 18); // Ограничение длины
        });
         // Добавляем +7 при фокусе, если поле пустое
         input.addEventListener('focus', () => {
             if (input.value === '') {
                 input.value = '+7 (';
             }
         });
         // Можно добавить блюр для удаления +7, если ничего не введено
         input.addEventListener('blur', () => {
            if (input.value === '+7 (' || input.value === '+') { 
                input.value = '';
            }
        });
    });

    // --- Валидация форм и имитация отправки ---
    function handleFormSubmit(formElement) {
        if (!formElement) return;

        formElement.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            const requiredFields = formElement.querySelectorAll('[required]');
            const submitButton = formElement.querySelector('[type="submit"]');
            const originalButtonText = submitButton.textContent;

            // Сброс предыдущих ошибок
            formElement.querySelectorAll('.error-message').forEach(el => el.remove());
            requiredFields.forEach(field => field.classList.remove('error'));

            requiredFields.forEach(field => {
                if (!field.value.trim() || (field.type === 'email' && !/\S+@\S+\.\S+/.test(field.value)) || (field.type === 'tel' && field.value.replace(/\D/g, '').length < 11)) {
                    field.classList.add('error');
                    isValid = false;
                }
            });

            if (isValid) {
                submitButton.textContent = 'Отправка...';
                submitButton.disabled = true;

                // Собираем данные формы
                const formData = new FormData(formElement);
                formData.append('recipient_email', 'yuventaas@mail.ru'); // Добавляем email получателя
                
                // Создаем объект для хранения данных формы
                const formDataObj = {};
                formData.forEach((value, key) => { 
                    formDataObj[key] = value;
                });
                
                // Для формы быстрого заказа добавляем имена полей
                if (formElement.id === 'quick-order-form') {
                    const inputs = formElement.querySelectorAll('input, select');
                    if (!formDataObj['name'] && inputs[0].value) {
                        formDataObj['name'] = inputs[0].value;
                    }
                    if (!formDataObj['phone'] && inputs[1].value) {
                        formDataObj['phone'] = inputs[1].value;
                    }
                    if (!formDataObj['product'] && inputs[2].value) {
                        formDataObj['product'] = inputs[2].value;
                    }
                }
                
                // Преобразуем в JSON
                const jsonData = JSON.stringify(formDataObj);
                
                // Отправляем данные на сервер
                fetch('https://formsubmit.co/ajax/yuventaas@mail.ru', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: jsonData
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка сети');
                    }
                    return response.json();
                })
                .then(data => {
                    formElement.reset();
                    submitButton.textContent = 'Отправлено!';
                    submitButton.style.backgroundColor = 'var(--success-color)';

                    const successMessage = document.createElement('div');
                    successMessage.className = 'form-message success';
                    successMessage.textContent = 'Ваша заявка успешно отправлена!';
                    formElement.appendChild(successMessage);

                    setTimeout(() => {
                        submitButton.textContent = originalButtonText;
                        submitButton.disabled = false;
                        submitButton.style.backgroundColor = ''; // Возвращаем исходный цвет
                        successMessage.remove();
                    }, 3000);
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                    
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                    
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'form-message error';
                    errorMessage.textContent = 'Произошла ошибка при отправке. Пожалуйста, попробуйте позже.';
                    formElement.appendChild(errorMessage);
                    
                    setTimeout(() => errorMessage.remove(), 4000);
                });
            } else {
                 const errorMessage = document.createElement('div');
                 errorMessage.className = 'form-message error';
                 errorMessage.textContent = 'Пожалуйста, проверьте правильность заполнения полей.';
                 // Вставляем сообщение перед кнопкой
                 submitButton.parentNode.insertBefore(errorMessage, submitButton);
                 setTimeout(() => errorMessage.remove(), 4000);
            }
        });
    }

    handleFormSubmit(contactForm);
    handleFormSubmit(quickOrderForm);

    // --- Автовоспроизведение видео в фоне ---
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        heroVideo.play().catch(error => {
            console.warn('Автовоспроизведение фонового видео заблокировано браузером:', error);
            // Можно добавить кнопку Play/Pause для пользователя
        });
    }

    // Устанавливаем текущий год в копирайте
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
    
    // Управление кнопкой "Вернуться наверх"
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        // Показываем кнопку при скролле вниз
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Обработчик клика по кнопке
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});