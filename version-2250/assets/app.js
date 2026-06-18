(() => {
    const selectAll = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const normalize = (value) => String(value || "").trim().toLowerCase();

    const redirectSearch = (form) => {
        const input = form.querySelector("input[name='q']");
        const value = input ? input.value.trim() : "";
        const target = value ? `search.html?q=${encodeURIComponent(value)}` : "search.html";
        window.location.href = target;
    };

    selectAll(".site-search-form").forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            redirectSearch(form);
        });
    });

    const menuButton = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (menuButton && mobileMenu) {
        menuButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("open");
        });
    }

    const slides = selectAll(".hero-slide");
    const dots = selectAll(".hero-dot");
    let activeSlide = 0;

    const setSlide = (index) => {
        if (!slides.length) {
            return;
        }
        activeSlide = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle("active", slideIndex === activeSlide);
        });
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle("active", dotIndex === activeSlide);
        });
    };

    if (slides.length) {
        setSlide(0);
        selectAll("[data-hero-next]").forEach((button) => {
            button.addEventListener("click", () => setSlide(activeSlide + 1));
        });
        selectAll("[data-hero-prev]").forEach((button) => {
            button.addEventListener("click", () => setSlide(activeSlide - 1));
        });
        dots.forEach((dot, dotIndex) => {
            dot.addEventListener("click", () => setSlide(dotIndex));
        });
        window.setInterval(() => setSlide(activeSlide + 1), 5200);
    }

    const applyCardFilter = (input) => {
        const group = input.closest("[data-filter-scope]") || document;
        const query = normalize(input.value);
        const cards = selectAll("[data-filter-item]", group);
        let visible = 0;
        cards.forEach((card) => {
            const haystack = normalize(card.getAttribute("data-search"));
            const matched = !query || haystack.includes(query);
            card.style.display = matched ? "" : "none";
            if (matched) {
                visible += 1;
            }
        });
        const empty = group.querySelector(".empty-state");
        if (empty) {
            empty.style.display = visible ? "none" : "block";
        }
    };

    selectAll(".inline-search").forEach((input) => {
        input.addEventListener("input", () => applyCardFilter(input));
        const params = new URLSearchParams(window.location.search);
        const query = params.get("q");
        if (query && input.hasAttribute("data-use-query")) {
            input.value = query;
        }
        applyCardFilter(input);
    });

    const initializePlayer = (video) => {
        if (!video || video.dataset.ready === "1") {
            return;
        }
        const stream = video.getAttribute("data-hls");
        if (!stream) {
            return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
            const hls = new window.Hls({
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(stream);
            hls.attachMedia(video);
            video._hls = hls;
        } else {
            video.src = stream;
        }
        video.dataset.ready = "1";
    };

    const startPlayer = (shell) => {
        const video = shell.querySelector(".video-player");
        const overlay = shell.querySelector(".player-overlay");
        initializePlayer(video);
        if (overlay) {
            overlay.classList.add("hidden");
        }
        const played = video.play();
        if (played && typeof played.catch === "function") {
            played.catch(() => {
                if (overlay) {
                    overlay.classList.remove("hidden");
                }
            });
        }
    };

    selectAll(".video-shell").forEach((shell) => {
        const video = shell.querySelector(".video-player");
        const overlay = shell.querySelector(".player-overlay");
        const button = shell.querySelector(".big-play");
        if (overlay) {
            overlay.addEventListener("click", () => startPlayer(shell));
        }
        if (button) {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                startPlayer(shell);
            });
        }
        if (video) {
            video.addEventListener("click", () => {
                if (video.dataset.ready !== "1") {
                    startPlayer(shell);
                }
            });
        }
    });
})();
