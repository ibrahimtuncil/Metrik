document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor Tracking
    const cursor = document.getElementById('customCursor');
    const cursorLabel = document.getElementById('cursorLabel');
    
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            cursor.style.left = `${x}px`;
            cursor.style.top = `${y}px`;
            
            // Show dynamic coordinate values in the cursor label
            cursorLabel.textContent = `VERI / X:${x} Y:${y}`;
        });

        // Add hover effects for interactive elements
        const hoverElements = document.querySelectorAll('a, button, input, textarea, [type="range"]');
        hoverElements.forEach(elem => {
            elem.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            elem.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // 2. Mobile Menu Toggle
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu on click of nav link
        document.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // 3. Interactive Budget Simulator
    const slider = document.getElementById('budgetSlider');
    const displayVal = document.getElementById('budgetValue');
    
    const tradLoss = document.getElementById('tradLoss');
    const tradLossVal = document.getElementById('tradLossVal');
    const optGain = document.getElementById('optGain');
    const optGainVal = document.getElementById('optGainVal');
    
    const tradGraph = document.getElementById('tradGraph');
    const optGraph = document.getElementById('optGraph');

    function formatCurrency(num) {
        return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(num) + ' TL';
    }

    // Standard pseudo-random generator based on a seed (budget value) for reproducible volatile lines
    function seededRandom(seed) {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    function drawCharts(budget) {
        // Render traditional chaotic graph path
        // Draw standard volatile curves
        let tradPath = `M 0 ${40 + seededRandom(budget) * 30}`;
        for (let i = 1; i <= 6; i++) {
            const x = (200 / 6) * i;
            const y = 10 + seededRandom(budget + i) * 60; // high volatility
            tradPath += ` L ${x} ${y}`;
        }
        
        // Render optimized clean upward trajectory graph path
        let optPath = `M 0 70`;
        const segments = [
            { x: 33, y: 55 },
            { x: 66, y: 48 },
            { x: 100, y: 32 },
            { x: 133, y: 24 },
            { x: 166, y: 15 },
            { x: 200, y: 8 }
        ];
        
        // Add tiny stable fluctuations to optimized graph
        segments.forEach((seg, i) => {
            const dev = (seededRandom(budget + i * 2) - 0.5) * 4; // very small deviations
            optPath += ` L ${seg.x} ${seg.y + dev}`;
        });

        // Update SVGs
        const tradPathElem = tradGraph.querySelector('path');
        const optPathElem = optGraph.querySelector('path');
        
        if (tradPathElem) tradPathElem.setAttribute('d', tradPath);
        if (optPathElem) optPathElem.setAttribute('d', optPath);
    }

    function updateSimulator() {
        if (!slider) return;
        
        const budget = parseInt(slider.value);
        displayVal.textContent = formatCurrency(budget);
        
        // Calculations
        // Traditional loses ~65% of campaign budget due to blind algorithms, invalid reach, bloated CPM fees
        const lossPercent = 65;
        const lossAmount = budget * (lossPercent / 100);
        
        // VERI / INFLUENCE optimizes and directs ~95% of bütçe to high-precision demographic overlap
        const gainPercent = 95;
        const gainAmount = budget * (gainPercent / 100);
        
        // Update labels
        tradLoss.textContent = `%${lossPercent} Kayıp`;
        tradLossVal.textContent = formatCurrency(lossAmount);
        
        optGain.textContent = `%${gainPercent} Aktif`;
        optGainVal.textContent = formatCurrency(gainAmount);
        
        // Re-draw graphs
        drawCharts(budget);
    }

    if (slider) {
        slider.addEventListener('input', updateSimulator);
        // Initial call
        updateSimulator();
    }

    // 4. Contact Form Validation and Mock Submission
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Display submitting state
            formStatus.className = 'form-status';
            formStatus.style.display = 'block';
            formStatus.textContent = '// İLETİM BAŞLADI: VERİ HAVUZUNA BAĞLANILIYOR...';
            
            // Mock network latency
            setTimeout(() => {
                const nameInput = document.getElementById('name').value;
                
                // Form success status styling
                formStatus.className = 'form-status success';
                formStatus.innerHTML = `
                    <strong>BAŞARILI // VERİ ALINDI</strong><br>
                    Sayın ${nameInput}, analiz talebiniz finansal sistemimize kaydedilmiştir.<br>
                    E-ticaret siteniz için 48 saat içinde özel bütçe dağılım raporu gönderilecektir.
                `;
                
                // Reset form values
                contactForm.reset();
                if (slider) {
                    slider.value = 150000;
                    updateSimulator();
                }
            }, 1500);
        });
    }
});
