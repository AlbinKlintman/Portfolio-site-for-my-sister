// ---------- i18n ----------

const translations = {
    "nav.home": { sv: "Hem", en: "Home" },
    "nav.film": { sv: "Film", en: "Film" },
    "nav.gallery": { sv: "Galleri", en: "Gallery" },
    "nav.contact": { sv: "Kontakt", en: "Contact" },

    "home.subtitle": { sv: "Skådespelare · Dansare · Modell", en: "Actor · Dancer · Model" },
    "home.intro": {
        sv: "Olivia Klintman är skådespelare, dansare och modell. Hon spelar huvudrollen i kortfilmen “Blodet vi delar”, i regi av Ida Olsson.",
        en: "Olivia Klintman is an actor, dancer and model. She plays the lead role in the short film “Blodet vi delar” (The Blood We Share), directed by Ida Olsson."
    },
    "home.cta.film": { sv: "Se filmen", en: "Watch the film" },
    "home.cta.gallery": { sv: "Bakom kulisserna", en: "Behind the scenes" },

    "film.eyebrow": { sv: "Kortfilm", en: "Short Film" },
    "film.title": { sv: "Blodet vi delar", en: "Blodet vi delar" },
    "film.lead": { sv: "Olivia Klintman i huvudrollen", en: "Olivia Klintman in the lead role" },
    "film.section.film": { sv: "Filmen", en: "The Film" },
    "film.section.credits": { sv: "Team", en: "Credits" },

    "gallery.eyebrow": { sv: "Galleri", en: "Gallery" },
    "gallery.title": { sv: "Bakom kulisserna", en: "Behind the Scenes" },
    "gallery.credit": { sv: "Foto: Teodor Lundblad, från inspelningen av “Blodet vi delar”", en: "Photography: Teodor Lundblad, from the set of “Blodet vi delar”" },

    "contact.eyebrow": { sv: "Kontakt", en: "Contact" },
    "contact.title": { sv: "Kom i kontakt", en: "Get in touch" },
    "contact.intro": { sv: "För bokningar och samarbeten, hör av dig via e-post eller Instagram.", en: "For bookings and collaborations, reach out via email or Instagram." },
    "contact.label.email": { sv: "E-post", en: "Email" },
    "contact.label.instagram": { sv: "Instagram", en: "Instagram" },

    "footer.text": { sv: "Olivia Klintman", en: "Olivia Klintman" }
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

// ---------- Lightbox (gallery page) ----------

function initLightbox() {
    const grid = document.querySelector(".gallery-grid");
    if (!grid) return;

    const items = Array.from(grid.querySelectorAll("button[data-full]"));
    const lightbox = document.querySelector(".lightbox");
    const lightboxImg = lightbox.querySelector("img");
    const closeBtn = lightbox.querySelector(".lightbox-close");
    const prevBtn = lightbox.querySelector(".lightbox-prev");
    const nextBtn = lightbox.querySelector(".lightbox-next");

    let currentIndex = 0;

    function show(index) {
        currentIndex = (index + items.length) % items.length;
        const item = items[currentIndex];
        lightboxImg.src = item.dataset.full;
        lightboxImg.alt = item.querySelector("img").alt;
    }

    function open(index) {
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

    items.forEach((item, index) => {
        item.addEventListener("click", () => open(index));
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

document.addEventListener("DOMContentLoaded", () => {
    initLangToggle();
    initLightbox();
});
