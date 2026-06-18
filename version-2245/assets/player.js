(function () {
  function startPlayer(shell) {
    var video = shell.querySelector('video');
    var overlay = shell.querySelector('.player-overlay');
    if (!video || shell.getAttribute('data-started') === '1') return;
    var source = video.getAttribute('data-source');
    if (!source) return;
    shell.setAttribute('data-started', '1');
    if (overlay) overlay.classList.add('is-hidden');

    function play() {
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      play();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, play);
      return;
    }

    video.src = source;
    play();
  }

  function init() {
    Array.prototype.slice.call(document.querySelectorAll('.player-shell')).forEach(function (shell) {
      var overlay = shell.querySelector('.player-overlay');
      var video = shell.querySelector('video');
      if (overlay) {
        overlay.addEventListener('click', function () {
          startPlayer(shell);
        });
      }
      if (video) {
        video.addEventListener('click', function () {
          if (shell.getAttribute('data-started') !== '1') {
            startPlayer(shell);
          }
        });
      }
    });
  }

  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
