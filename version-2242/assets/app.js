(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }

    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  function initHero() {
    var carousel = document.querySelector('[data-hero-carousel]');
    if (!carousel) {
      return;
    }

    var slides = selectAll('[data-hero-slide]', carousel);
    var dots = selectAll('[data-hero-dot]', carousel);
    var prev = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    show(0);
    restart();
  }

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function initFilters() {
    selectAll('[data-filter-scope]').forEach(function (scope) {
      var input = scope.querySelector('[data-page-filter]');
      var cards = selectAll('[data-movie-card]', scope);
      var count = scope.querySelector('[data-filter-count]');
      var chips = selectAll('[data-filter-chip]', scope);

      function apply(value) {
        var keyword = normalize(value);
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-tags'),
            card.getAttribute('data-year'),
            card.textContent
          ].join(' '));
          var match = !keyword || haystack.indexOf(keyword) !== -1;
          card.classList.toggle('is-filtered-out', !match);
          if (match) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = visible + ' 部影片';
        }
      }

      if (scope.hasAttribute('data-search-page')) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        if (input) {
          input.value = query;
        }
        apply(query);
      }

      if (input) {
        input.addEventListener('input', function () {
          apply(input.value);
        });
      }

      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          var value = chip.getAttribute('data-filter-chip') || '';
          if (input) {
            input.value = value;
          }
          apply(value);
        });
      });
    });
  }

  function initPlayers() {
    selectAll('[data-hls-player]').forEach(function (player) {
      var video = player.querySelector('video');
      var start = player.querySelector('[data-video-start]');
      var status = player.querySelector('[data-video-status]');
      var src = player.getAttribute('data-video-src');
      var ready = false;

      function setStatus(text) {
        if (status) {
          status.textContent = text;
        }
      }

      function loadAndPlay() {
        if (!video || !src) {
          setStatus('播放源暂不可用');
          return;
        }

        if (!ready) {
          if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            ready = true;
          } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({ enableWorker: true });
            hls.loadSource(src);
            hls.attachMedia(video);
            ready = true;
          } else {
            video.src = src;
            ready = true;
          }
        }

        if (start) {
          start.classList.add('is-hidden');
        }

        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {
            setStatus('请在播放器控件中再次点击播放');
          });
        }
        setStatus('正在加载高清播放源');
      }

      if (start) {
        start.addEventListener('click', loadAndPlay);
      }

      if (video) {
        video.addEventListener('play', function () {
          if (start) {
            start.classList.add('is-hidden');
          }
        });
      }
    });
  }

  function initImageFallback() {
    selectAll('img').forEach(function (img) {
      img.addEventListener('error', function () {
        img.classList.add('is-missing');
        var parent = img.parentElement;
        if (parent) {
          parent.classList.add('image-missing');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHero();
    initFilters();
    initPlayers();
    initImageFallback();
  });
})();
