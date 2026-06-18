(function () {
    function boot(box) {
        var video = box.querySelector('video');
        var cover = box.querySelector('.player-cover');
        var source = video ? video.getAttribute('data-stream') : '';
        var started = false;
        function attach() {
            if (!video || !source) return;
            if (started) return;
            started = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        }
        function start() {
            attach();
            if (cover) cover.classList.add('is-hidden');
            var play = video.play();
            if (play && play.catch) play.catch(function () {});
        }
        if (cover) cover.addEventListener('click', start);
        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) start();
            });
        }
    }
    Array.prototype.slice.call(document.querySelectorAll('.player-box')).forEach(boot);
})();
