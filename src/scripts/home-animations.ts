import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function runHomeAnimations(): void {
  // Hero reveal
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  const heroTitle = document.querySelector<HTMLElement>("[data-hero-title]");
  const heroSub = document.querySelector<HTMLElement>("[data-hero-sub]");
  const heroImg = document.querySelector<HTMLElement>("[data-hero-img]");

  if (hero) {
    gsap.fromTo(
      hero,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" }
    );
  }
  if (heroTitle) {
    gsap.from(heroTitle, {
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
    });
  }
  if (heroSub) {
    gsap.from(heroSub, {
      y: 30,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.1,
    });
  }
  if (heroImg) {
    gsap.from(heroImg, {
      scale: 0.9,
      rotate: 2,
      opacity: 0,
      duration: 1.1,
      ease: "elastic.out(1, 0.8)",
      delay: 0.15,
    });
  }

  // Social proof counters
  document.querySelectorAll<HTMLElement>("[data-counter]").forEach((el) => {
    const end = Number(el.dataset.end || "0");
    const obj = { value: 0 } as { value: number };
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          value: end,
          duration: 1.2,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = end >= 1000
              ? "+" + Math.floor(obj.value).toLocaleString("ar-EG")
              : "+" + Math.floor(obj.value);
          },
        });
      },
    });
  });

  // Philosophy quote underline sweep
  const quote = document.querySelector<HTMLElement>("[data-quote]");
  if (quote) {
    const underline = document.createElement("span");
    underline.style.display = "block";
    underline.style.height = "3px";
    underline.style.background = "#0ea5e9";
    underline.style.borderRadius = "9999px";
    underline.style.transformOrigin = "right center";
    underline.style.transform = "scaleX(0)";
    underline.style.marginInline = "auto";
    underline.style.marginTop = "8px";
    underline.style.width = "min(420px, 80%)";
    quote.appendChild(underline);
    ScrollTrigger.create({
      trigger: quote,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(underline, { scaleX: 1, duration: 0.8, ease: "power2.out" });
      },
    });
  }

  // Project cards stagger on scroll
  const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-project-card]"));
  if (cards.length) {
    gsap.set(cards, { y: 30, opacity: 0 });
    ScrollTrigger.batch(cards, {
      start: "top 85%",
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
        }),
      once: true,
    });
  }
}

// Auto-run when on homepage
if (typeof window !== "undefined") {
  if (document.documentElement.lang === "ar") {
    // small delay to ensure DOM is ready in Astro islands
    requestAnimationFrame(() => runHomeAnimations());
  }
}

