document.addEventListener('DOMContentLoaded', function() {

    // --- Функція для ініціалізації всіх скриптів ---
    function initializePageScripts() {
        
        // 1. Анімація логотипа в шапці
        const slotMachine = document.querySelector('.logo .slot-machine');
        if (slotMachine && !slotMachine.hasAttribute('data-animated')) {
            const digits = slotMachine.querySelectorAll('span');

            function spinOnce() {
                digits.forEach((d, i) => {
                    setTimeout(() => {
                        d.classList.add('spin');
                        setTimeout(() => d.classList.remove('spin'), 600);
                    }, i * 200);
                });
            }

            spinOnce();
            setInterval(spinOnce, 10000);
            slotMachine.setAttribute('data-animated', 'true');
        }
        
        // 2. Плавна прокрутка для якорних посилань
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                if(this.parentElement.classList.contains('form-tabs')) return;
                e.preventDefault();
                const targetElement = document.querySelector(this.getAttribute('href'));
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // 3. Анімація лічильників
        const statsSection = document.getElementById('stats');
        if (statsSection) {
            const counters = document.querySelectorAll('.stat-value');
            const speed = 200;

            const animateCounters = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        counters.forEach(counter => {
                            const updateCount = () => {
                                const lang = document.documentElement.lang === 'ru' ? 'ru-RU' : 'en-US';
                                const target = +counter.getAttribute('data-target');
                                const count = +counter.innerText.replace(/,|\s/g, '');
                                const increment = target / speed;

                                if (count < target) {
                                    counter.innerText = Math.ceil(count + increment).toLocaleString(lang);
                                    setTimeout(updateCount, 15);
                                } else {
                                    counter.innerText = target.toLocaleString(lang);
                                }
                            };
                            updateCount();
                        });
                        observer.unobserve(statsSection);
                    }
                });
            };
            const observer = new IntersectionObserver(animateCounters, { threshold: 0.5 });
            observer.observe(statsSection);
        }

        // 4. Логіка перемикання табів на формі
        const tabLinks = document.querySelectorAll('.tab-link');
        const tabContents = document.querySelectorAll('.tab-content');
        tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                const tabId = link.getAttribute('data-tab');
                tabLinks.forEach(item => item.classList.remove('active'));
                tabContents.forEach(item => item.classList.remove('active'));
                link.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });

        // 5. Ініціалізація каруселі SwiperJS
        if (typeof Swiper !== 'undefined') {
            const swiper = new Swiper('.swiper-container', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                pagination: { el: '.swiper-pagination', clickable: true },
                breakpoints: {
                    992: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                      loop: false,
                      allowTouchMove: false,
                      pagination: { el: null }
                    }
                }
            });
        }
        
        // 6. Ініціалізація інтерактивних графіків
        const chartsSection = document.getElementById('charts');
        if (chartsSection && typeof Chart !== 'undefined') {
             const createCharts = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        drawAllCharts();
                        observer.unobserve(chartsSection); // Малюємо графіки один раз
                    }
                });
            };
            const observer = new IntersectionObserver(createCharts, { threshold: 0.1 });
            observer.observe(chartsSection);
        }
    }
    
    // --- Функція для малювання графіків ---
    function drawAllCharts() {
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 46, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#e0e0e0',
                    borderColor: 'rgba(123, 44, 191, 0.5)',
                    borderWidth: 1,
                }
            },
            scales: {
                x: {
                    ticks: { color: 'rgba(160, 160, 192, 0.7)' },
                    grid: { color: 'rgba(58, 58, 94, 0.3)' }
                },
                y: {
                    ticks: { color: 'rgba(160, 160, 192, 0.7)' },
                    grid: { color: 'rgba(58, 58, 94, 0.3)' }
                }
            }
        };
        
        const langCode = document.documentElement.lang || 'ru';
        const monthLabels = langCode === 'ru'
            ? ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн']
            : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const campaignLabels = langCode === 'ru'
            ? ['Камп. 1', 'Камп. 2', 'Камп. 3', 'Камп. 4', 'Камп. 5']
            : ['Campaign 1', 'Campaign 2', 'Campaign 3', 'Campaign 4', 'Campaign 5'];
        const dayLabels = langCode === 'ru'
            ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
            : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const labels = monthLabels;
        const depositsLabel = langCode === 'ru' ? 'Количество депозитов' : 'Deposits Count';
        const pointStyle = {
            pointBackgroundColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointHoverBorderWidth: 2
        };

        // GGR Chart
        new Chart(document.getElementById('ggrChart'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'GGR',
                    data: [65000, 72000, 85000, 78000, 95000, 110000],
                    borderColor: 'rgb(0, 255, 171)',
                    backgroundColor: 'rgba(0, 255, 171, 0.1)',
                    fill: true,
                    tension: 0.4,
                    ...pointStyle,
                    pointBorderColor: 'rgb(0, 255, 171)',
                    pointHoverBackgroundColor: 'rgb(0, 255, 171)'
                }]
            },
            options: commonOptions
        });

        // LTV Chart
        new Chart(document.getElementById('ltvChart'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'LTV',
                    data: [120, 135, 140, 165, 155, 180],
                    borderColor: 'rgb(123, 44, 191)',
                    backgroundColor: 'rgba(123, 44, 191, 0.1)',
                    fill: true,
                    tension: 0.4,
                    ...pointStyle,
                    pointBorderColor: 'rgb(123, 44, 191)',
                    pointHoverBackgroundColor: 'rgb(123, 44, 191)'
                }]
            },
            options: commonOptions
        });
        
        // MAU Chart
        new Chart(document.getElementById('mauChart'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'MAU',
                    data: [12500, 14000, 18000, 21000, 25000, 28000],
                    backgroundColor: 'rgba(0, 255, 171, 0.6)',
                    borderColor: 'rgb(0, 255, 171)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(0, 255, 171, 0.8)'
                }]
            },
            options: commonOptions
        });
        
        // ROI Chart
        new Chart(document.getElementById('roiChart'), {
            type: 'line',
            data: {
                labels: campaignLabels,
                datasets: [{
                    label: 'ROI',
                    data: [150, 220, 180, 250, 310],
                    borderColor: 'rgb(123, 44, 191)',
                    ...pointStyle,
                    pointBorderColor: 'rgb(123, 44, 191)',
                    pointHoverBackgroundColor: 'rgb(123, 44, 191)'
                }]
            },
            options: commonOptions
        });

        // DAU Chart
        new Chart(document.getElementById('dauChart'), {
            type: 'line',
            data: {
                labels: dayLabels,
                datasets: [{
                    label: 'DAU',
                    data: [1200, 1300, 1500, 1450, 1800, 2500, 2200],
                    borderColor: 'rgb(0, 255, 171)',
                    backgroundColor: 'rgba(0, 255, 171, 0.1)',
                    fill: true,
                    ...pointStyle,
                    pointBorderColor: 'rgb(0, 255, 171)',
                    pointHoverBackgroundColor: 'rgb(0, 255, 171)'
                }]
            },
            options: commonOptions
        });

        // Deposits Chart
        new Chart(document.getElementById('depositsChart'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: depositsLabel,
                    data: [450, 500, 620, 580, 710, 850],
                    backgroundColor: 'rgba(123, 44, 191, 0.6)',
                    borderColor: 'rgb(123, 44, 191)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(123, 44, 191, 0.8)'
                }]
            },
            options: commonOptions
        });
    }

    // Запускаємо ініціалізацію
    initializePageScripts();
});
