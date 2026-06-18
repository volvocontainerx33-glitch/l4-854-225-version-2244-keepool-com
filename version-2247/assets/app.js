(function () {
    var toggle = document.querySelector('.mobile-toggle');
    var panel = document.querySelector('.mobile-panel');
    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            var open = panel.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            panel.setAttribute('aria-hidden', open ? 'false' : 'true');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var current = 0;
    function showSlide(index) {
        if (!slides.length) return;
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('is-active', i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('is-active', i === current);
        });
    }
    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            showSlide(i);
        });
    });
    if (slides.length > 1) {
        setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var filterInput = document.querySelector('[data-filter-input]');
    var regionSelect = document.querySelector('[data-filter-region]');
    var typeSelect = document.querySelector('[data-filter-type]');
    var yearSelect = document.querySelector('[data-filter-year]');
    var empty = document.querySelector('.search-empty');
    function filterCards() {
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
        var q = filterInput ? filterInput.value.trim().toLowerCase() : '';
        var region = regionSelect ? regionSelect.value : '';
        var type = typeSelect ? typeSelect.value : '';
        var year = yearSelect ? yearSelect.value : '';
        var visible = 0;
        cards.forEach(function (card) {
            var hay = [card.dataset.title, card.dataset.genre, card.dataset.region, card.dataset.type, card.dataset.year].join(' ').toLowerCase();
            var ok = (!q || hay.indexOf(q) !== -1) && (!region || card.dataset.region === region) && (!type || card.dataset.type === type) && (!year || card.dataset.year === year);
            card.style.display = ok ? '' : 'none';
            if (ok) visible += 1;
        });
        if (empty) empty.classList.toggle('is-visible', visible === 0);
    }
    [filterInput, regionSelect, typeSelect, yearSelect].forEach(function (node) {
        if (node) node.addEventListener('input', filterCards);
        if (node) node.addEventListener('change', filterCards);
    });
    var params = new URLSearchParams(window.location.search);
    if (filterInput && params.get('q')) {
        filterInput.value = params.get('q');
        filterCards();
    }

    var top = document.querySelector('.to-top');
    if (top) {
        window.addEventListener('scroll', function () {
            top.classList.toggle('is-visible', window.scrollY > 500);
        });
        top.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
})();
