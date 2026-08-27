// ---------- i18n ----------

const translations = {
    "nav.home": { sv: "Hem", en: "Home" },
    "nav.film": { sv: "Film", en: "Film" },
    "nav.model": { sv: "Modell", en: "Model" },
    "nav.ugc": { sv: "UGC", en: "UGC" },
    "nav.contact": { sv: "Kontakt", en: "Contact" },

    "home.subtitle": { sv: "Skådespelare · Dansare · Modell", en: "Actor · Dancer · Model" },
    "home.intro": {
        sv: "Olivia Klintman är skådespelare, dansare och modell. Hon spelar huvudrollen i kortfilmen “Blodet vi delar”, i regi av Ida Olsson.",
        en: "Olivia Klintman is an actor, dancer and model. She plays the lead role in the short film “Blodet vi delar” (The Blood We Share), directed by Ida Olsson."
    },
    "home.cta.film": { sv: "Se filmen", en: "Watch the film" },

    "film.eyebrow": { sv: "Kortfilmer", en: "Short Films" },
    "film.title": { sv: "Film", en: "Film" },
    "film.lead": { sv: "Olivia Klintman i huvudrollen", en: "Olivia Klintman in the lead role" },
    "film.section.credits": { sv: "Team", en: "Credits" },
    "film.cta.bts": { sv: "Bakom kulisserna", en: "Behind the Scenes" },

    "gallery.eyebrow": { sv: "Galleri", en: "Gallery" },
    "gallery.title": { sv: "Bakom kulisserna", en: "Behind the Scenes" },
    "gallery.credit": { sv: "Foto: Teodor Lundblad, från inspelningen av “Blodet vi delar”", en: "Photography: Teodor Lundblad, from the set of “Blodet vi delar”" },

    "model.eyebrow": { sv: "Portfolio", en: "Portfolio" },
    "model.title": { sv: "Modell", en: "Model" },
    "model.order-note": {
        sv: "Kategorierna är sorterade efter datum, senaste överst",
        en: "Categories are sorted by date, newest first"
    },
    "model.date.opencall": { sv: "4 juli 2026", en: "4 July 2026" },
    "model.credit.mhs": {
        sv: "Foto: Model House Sweden — 14 juni 2026",
        en: "Photography: Model House Sweden — 14 June 2026"
    },
    "model.credit.hjort": { sv: "Foto: Johannes Hjort", en: "Photography: Johannes Hjort" },
    "model.date.hjort.couture-photos": { sv: "12 februari 2026", en: "12 February 2026" },
    "model.date.hjort.couture-polaroids": { sv: "12 februari 2026", en: "12 February 2026" },
    "model.date.hjort.kejsaren": { sv: "15 november 2025", en: "15 November 2025" },

    "ugc.eyebrow": { sv: "Portfolio", en: "Portfolio" },
    "ugc.title": { sv: "UGC Creator", en: "UGC Creator" },
    "ugc.views": { sv: "visningar", en: "views" },
    "ugc.play": { sv: "Spela upp video", en: "Play video" },

    "stranden.eyebrow": { sv: "Kommande kortfilm", en: "Upcoming Short Film" },
    "stranden.title": { sv: "Stranden", en: "Stranden" },
    "stranden.blurb": {
        sv: "En kommande kortfilm i regi av Sixten Degerman.",
        en: "An upcoming short film directed by Sixten Degerman."
    },
    "stranden.credit": {
        sv: "Bakom kulisserna, från inspelningen av kortfilmen “Stranden”, regisserad av Sixten Degerman",
        en: "Behind the scenes, from the set of the short film “Stranden”, directed by Sixten Degerman"
    },

    "contact.eyebrow": { sv: "Kontakt", en: "Contact" },
    "contact.title": { sv: "Kom i kontakt", en: "Get in touch" },
    "contact.intro": { sv: "För bokningar och samarbeten, hör av dig via e-post eller Instagram.", en: "For bookings and collaborations, reach out via email or Instagram." },
    "contact.label.email": { sv: "E-post", en: "Email" },
    "contact.label.instagram": { sv: "Instagram", en: "Instagram" }
};

const LANG_KEY = "olivia-lang";

function getLang() {
    return localStorage.getItem(LANG_KEY) || "sv";
}

function applyTranslations(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const entry = translations[key];
        if (entry && entry[lang]) {
            el.textContent = entry[lang];
        }
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
        const key = el.getAttribute("data-i18n-aria");
        const entry = translations[key];
        if (entry && entry[lang]) {
            el.setAttribute("aria-label", entry[lang]);
        }
    });
    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
        btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
    });
}

function initLangToggle() {
    const lang = getLang();
    applyTranslations(lang);

    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
        btn.addEventListener("click", () => {
            const newLang = btn.dataset.lang;
            localStorage.setItem(LANG_KEY, newLang);
            applyTranslations(newLang);
        });
    });
}

// ---------- Mobile nav toggle ----------

function initNavToggle() {
    const toggle = document.querySelector(".nav-toggle");
    const controls = document.querySelector(".nav-controls");
    if (!toggle || !controls) return;

    const closeMenu = () => {
        controls.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
        const isOpen = controls.classList.toggle("is-open");
        toggle.classList.toggle("is-open", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
    });

    controls.querySelectorAll("a, button").forEach((el) => {
        el.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (e) => {
        if (!controls.classList.contains("is-open")) return;
        if (controls.contains(e.target) || toggle.contains(e.target)) return;
        closeMenu();
    });
}

// ---------- Lightbox (gallery page) ----------

function initLightbox() {
    const grids = Array.from(document.querySelectorAll(".gallery-grid"));
    if (grids.length === 0) return;

    const lightbox = document.querySelector(".lightbox");
    const lightboxImg = lightbox.querySelector("img");
    const closeBtn = lightbox.querySelector(".lightbox-close");
    const prevBtn = lightbox.querySelector(".lightbox-prev");
    const nextBtn = lightbox.querySelector(".lightbox-next");

    let items = [];
    let currentIndex = 0;

    function show(index) {
        currentIndex = (index + items.length) % items.length;
        const item = items[currentIndex];
        lightboxImg.src = item.dataset.full;
        lightboxImg.alt = item.querySelector("img").alt;
    }

    function open(gridItems, index) {
        items = gridItems;
        show(index);
        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";
    }

    function close() {
        lightbox.classList.remove("is-open");
        lightbox.classList.remove("controls-hidden");
        lightboxImg.src = "";
        document.body.style.overflow = "";
    }

    grids.forEach((grid) => {
        const gridItems = Array.from(grid.querySelectorAll("button[data-full]"));
        gridItems.forEach((item, index) => {
            item.addEventListener("click", () => open(gridItems, index));
        });
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", () => show(currentIndex - 1));
    nextBtn.addEventListener("click", () => show(currentIndex + 1));

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) close();
    });

    let touchStartX = 0;
    let touchStartY = 0;
    let touchMoved = false;
    const SWIPE_THRESHOLD = 40;

    lightboxImg.addEventListener("touchstart", (e) => {
        const t = e.changedTouches[0];
        touchStartX = t.clientX;
        touchStartY = t.clientY;
        touchMoved = false;
    }, { passive: true });

    lightboxImg.addEventListener("touchmove", () => {
        touchMoved = true;
    }, { passive: true });

    lightboxImg.addEventListener("touchend", (e) => {
        const t = e.changedTouches[0];
        const dx = t.clientX - touchStartX;
        const dy = t.clientY - touchStartY;

        if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
            e.preventDefault();
            if (dx < 0) show(currentIndex + 1);
            else show(currentIndex - 1);
        } else if (!touchMoved) {
            e.preventDefault();
            lightbox.classList.toggle("controls-hidden");
        }
    }, { passive: false });

    lightboxImg.addEventListener("click", () => {
        lightbox.classList.toggle("controls-hidden");
    });

    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("is-open")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") show(currentIndex - 1);
        if (e.key === "ArrowRight") show(currentIndex + 1);
    });
}

// ---------- Page table of contents (scroll spy) ----------

function initPageToc() {
    const tocs = Array.from(document.querySelectorAll(".page-toc, .page-toc-mobile"));
    if (tocs.length === 0) return;

    const links = tocs.flatMap((toc) => Array.from(toc.querySelectorAll("a")));
    const hrefs = Array.from(new Set(links.map((link) => link.getAttribute("href"))));
    const sections = hrefs.map((href) => document.querySelector(href)).filter(Boolean);

    if (sections.length === 0) return;

    const setActive = (id) => {
        links.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) setActive(entry.target.id);
            });
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
}

// ---------- Back to top ----------

function initBackToTop() {
    const btn = document.querySelector(".back-to-top");
    if (!btn) return;

    const toggle = () => {
        btn.classList.toggle("is-visible", window.scrollY > 600);
    };

    window.addEventListener("scroll", toggle, { passive: true });
    toggle();

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// ---------- TikTok embeds (UGC page) ----------
// Every card shows a static thumbnail with a play button. Nothing from
// TikTok loads until that button is clicked. On click, each video gets
// its own iframe pointed at ugc-embed.html?id=...&author=..., a small
// standalone page that mounts TikTok's official blockquote + embed.js
// widget. Loading it as a real page (not srcdoc, which gives the iframe
// an opaque "null" origin some third-party scripts don't handle well)
// keeps each video in its own fresh browsing context — a genuine
// first-time execution as far as TikTok's script is concerned, with no
// state shared between videos to race against.

function initUgcEmbeds() {
    document.querySelectorAll(".ugc-play").forEach((btn) => {
        btn.addEventListener("click", () => {
            const videoId = btn.dataset.videoId;
            const author = btn.dataset.author;
            if (!videoId || !author) return;

            const iframe = document.createElement("iframe");
            iframe.className = "ugc-iframe";
            iframe.allow = "autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen";
            iframe.allowFullscreen = true;
            iframe.src = `ugc-embed.html?id=${encodeURIComponent(videoId)}&author=${encodeURIComponent(author)}`;

            btn.replaceWith(iframe);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initLangToggle();
    initNavToggle();
    initLightbox();
    initPageToc();
    initBackToTop();
    initUgcEmbeds();
});
