(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        mobileNav.classList.toggle('open');
      });
    }

    var slider = document.querySelector('[data-hero-slider]');
    if (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) return;
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('active', i === current);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('active', i === current);
        });
      }

      function restart() {
        if (timer) window.clearInterval(timer);
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5000);
      }

      var prev = slider.querySelector('[data-hero-prev]');
      var next = slider.querySelector('[data-hero-next]');
      if (prev) {
        prev.addEventListener('click', function () {
          show(current - 1);
          restart();
        });
      }
      if (next) {
        next.addEventListener('click', function () {
          show(current + 1);
          restart();
        });
      }
      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          show(Number(dot.getAttribute('data-hero-dot')) || 0);
          restart();
        });
      });
      show(0);
      restart();
    }

    var searchInput = document.querySelector('[data-search-input]');
    var yearFilter = document.querySelector('[data-year-filter]');
    var typeFilter = document.querySelector('[data-type-filter]');
    var regionFilter = document.querySelector('[data-region-filter]');
    var countTarget = document.querySelector('[data-filter-count]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

    function applyFilters() {
      if (!cards.length) return;
      var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var year = yearFilter ? yearFilter.value : '';
      var type = typeFilter ? typeFilter.value : '';
      var region = regionFilter ? regionFilter.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var search = card.getAttribute('data-search') || '';
        var cardYear = card.getAttribute('data-year') || '';
        var cardType = card.getAttribute('data-type') || '';
        var cardRegion = card.getAttribute('data-region') || '';
        var matchQuery = !query || search.indexOf(query) !== -1;
        var matchYear = !year || cardYear.indexOf(year) !== -1;
        var matchType = !type || cardType.indexOf(type) !== -1 || search.indexOf(type.toLowerCase()) !== -1;
        var matchRegion = !region || cardRegion.indexOf(region) !== -1 || search.indexOf(region.toLowerCase()) !== -1;
        var matched = matchQuery && matchYear && matchType && matchRegion;
        card.classList.toggle('is-hidden', !matched);
        if (matched) visible += 1;
      });

      if (countTarget) {
        countTarget.textContent = '当前显示 ' + visible + ' / ' + cards.length + ' 部影片';
      }
    }

    [searchInput, yearFilter, typeFilter, regionFilter].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });
    applyFilters();
  });
})();
