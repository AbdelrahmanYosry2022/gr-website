import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ArchComponent.css?inline';

gsap.registerPlugin(ScrollTrigger);

class ArchComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.lenis = null;
    this.animationFrameId = null;
    this.resizeTimeout = null;

    // Bind event handlers to the component instance
    this.raf = this.raf.bind(this);
    this.handleMobileLayout = this.handleMobileLayout.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>

      ${styles}

      </style>
      <div class="container">
        <div class="spacer"></div>

        <div class="arch">
          <div class="arch__left">
            <div class="arch__info" id="green-arch">
              <div class="content">
                <h2 class="header">جروث روتس — شريكك من الألف إلى الياء</h2>
                <p class="desc">نقدّم خدمات متكاملة لتأسيس وتشغيل مصانع الأغذية: دراسات جدوى، توريد معدات، إدارة تشغيل، وتطوير منتجات تحت علامة Ricatto.</p>
                <a class="link" href="#" style="background-color: #D5FF37"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none"><path fill="#121212" d="M5 2c0 1.105-1.895 2-3 2a2 2 0 1 1 0-4c1.105 0 3 .895 3 2ZM11 3.5c0 1.105-.895 3-2 3s-2-1.895-2-3a2 2 0 1 1 4 0ZM6 9a2 2 0 1 1-4 0c0-1.105.895-3 2-3s2 1.895 2 3Z" /></svg> <span>تواصل معنا</span></a>
              </div>
            </div>

            <div class="arch__info" id="blue-arch">
              <div class="content">
                <h2 class="header">توريد المعدات وKaya Steel</h2>
                <p class="desc">شراكاتنا تضمن توريد خطوط ومعدات عالية الجودة مع دعم فني ومواصفات تتوافق مع احتياجات مشروعك.</p>
                <a class="link" href="#" style="background-color: #7DD6FF"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none"><path fill="#121212" d="M5 2c0 1.105-1.895 2-3 2a2 2 0 1 1 0-4c1.105 0 3 .895 3 2ZM11 3.5c0 1.105-.895 3-2 3s-2-1.895-2-3a2 2 0 1 1 4 0ZM6 9a2 2 0 1 1-4 0c0-1.105.895-3 2-3s2 1.895 2 3Z" /></svg> <span>اطلب كتالوج</span></a>
              </div>
            </div>

            <div class="arch__info" id="pink-arch">
              <div class="content">
                <h2 class="header">إدارة التشغيل والتدريب</h2>
                <p class="desc">نقدّم برامج تشغيل مخصّصة وتدريبًا عمليًا لفرق العمل لرفع كفاءة الإنتاج وتقليل الفاقد.</p>
                <a class="link" href="#" style="background-color: #FFA0B0"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none"><path fill="#121212" d="M5 2c0 1.105-1.895 2-3 2a2 2 0 1 1 0-4c1.105 0 3 .895 3 2ZM11 3.5c0 1.105-.895 3-2 3s-2-1.895-2-3a2 2 0 1 1 4 0ZM6 9a2 2 0 1 1-4 0c0-1.105.895-3 2-3s2 1.895 2 3Z" /></svg> <span>اطلب خدمة تشغيل</span></a>
              </div>
            </div>

            <div class="arch__info" id="orange-arch">
              <div class="content">
                <h2 class="header">تطوير المنتجات — Ricatto</h2>
                <p class="desc">نطوّر وصفات ومنتجات جاهزة للاعتماد تحت علامة Ricatto، مع دعم للتغليف والمعايير الغذائية.</p>
                <a class="link" href="#" style="background-color: #FFA17B"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none"><path fill="#121212" d="M5 2c0 1.105-1.895 2-3 2a2 2 0 1 1 0-4c1.105 0 3 .895 3 2ZM11 3.5c0 1.105-.895 3-2 3s-2-1.895-2-3a2 2 0 1 1 4 0ZM6 9a2 2 0 1 1-4 0c0-1.105.895-3 2-3s2 1.895 2 3Z" /></svg> <span>عرض منتجات Ricatto</span></a>
              </div>
            </div>
          </div>

          <div class="arch__right">
            <div class="img-wrapper" data-index="4">
              <img src="/photos/LayeredScrollGallery/GR Logo.png" alt="Growth Roots Design">
            </div>

            <div class="img-wrapper" data-index="3">
              <img src="/photos/LayeredScrollGallery/Kaya Logo.png" alt="Kaya Steel">
            </div>

            <div class="img-wrapper" data-index="2">
              <img src="/photos/LayeredScrollGallery/Ricetto Logo.png" alt="Ricatto Products">
            </div>

            <div class="img-wrapper" data-index="1">
              <img src="/photos/LayeredScrollGallery/GR Logo.png" alt="Growth Roots Logo">
            </div>

          </div>
        </div>

        <div class="spacer"></div>
      </div>
    `;
    this.runComponentLogic();
    window.addEventListener("resize", this.onResize);
  }

  disconnectedCallback() {
    if (this.lenis) {
      this.lenis.destroy();
    }
    // Kill all ScrollTriggers created within this component
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    window.removeEventListener("resize", this.onResize);
    cancelAnimationFrame(this.animationFrameId);
    clearTimeout(this.resizeTimeout);
  }

  raf(time) {
    if (this.lenis) {
      this.lenis.raf(time);
    }
    ScrollTrigger.update();
    this.animationFrameId = requestAnimationFrame(this.raf);
  }

  handleMobileLayout() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const leftItems = gsap.utils.toArray(".arch__left .arch__info", this.shadowRoot);
    const rightItems = gsap.utils.toArray(".arch__right .img-wrapper", this.shadowRoot);

    if (isMobile) {
      // Interleave items using order
      leftItems.forEach((item, i) => {
        item.style.order = i * 2;
      });
      rightItems.forEach((item, i) => {
        item.style.order = i * 2 + 1;
      });
    } else {
      // Clear order for desktop
      leftItems.forEach((item) => {
        item.style.order = "";
      });
      rightItems.forEach((item) => {
        item.style.order = "";
      });
    }
  }

  onResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(this.handleMobileLayout, 100);
  }

  runComponentLogic() {
    // Initialize Lenis smooth scroll
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      gestureDirection: "vertical",
      smoothTouch: true,
      touchMultiplier: 2
    });

    this.animationFrameId = requestAnimationFrame(this.raf);

    // Set z-index for images
    this.shadowRoot.querySelectorAll(".arch__right .img-wrapper").forEach((element) => {
      const order = element.getAttribute("data-index");
      if (order !== null) {
        element.style.zIndex = order;
      }
    });

    // Run on initial load
    this.handleMobileLayout();

    const imgs = gsap.utils.toArray(".img-wrapper img", this.shadowRoot);
    // bgColors will map to the background color for the state after the corresponding image
    // has started to appear / is prominent. There are 4 images, but only 3 colors provided
    // in the original, implying the last image retains the last color.
    const bgColors = ["#EDF9FF", "#FFECF2", "#FFE8DB"];

    // GSAP Animation with Media Query
    ScrollTrigger.matchMedia({
      "(min-width: 769px)": () => {
        // Kill existing ScrollTriggers on re-match (important for media queries)
        // ScrollTrigger.getAll().forEach(trigger => trigger.kill());

        const mainTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: this.shadowRoot.querySelector(".arch"),
            start: "top top",
            end: "bottom bottom",
            pin: this.shadowRoot.querySelector(".arch__right"),
            scrub: true
          }
        });

        gsap.set(imgs, {
          clipPath: "inset(0)",
          objectPosition: "0px 50%"
        });

        imgs.forEach((_, index) => {
          const currentImage = imgs[index];
          const nextImage = imgs[index + 1] ? imgs[index + 1] : null;

          const sectionTimeline = gsap.timeline();

          // Animate the host's background color
          // If bgColors[index] is defined, use it. Otherwise, the background
          // will retain its previous state (or initial if it's the first section).
          if (bgColors[index] !== undefined) {
            sectionTimeline.to(
              this, // Target the host element for background color change
              {
                backgroundColor: bgColors[index],
                duration: 1.5,
                ease: "power2.inOut"
              },
              0
            );
          }

          if (nextImage) {
            sectionTimeline
              .to(
                currentImage,
                {
                  clipPath: "inset(0px 0px 100%)",
                  objectPosition: "0px 100%",
                  duration: 1.5,
                  ease: "none"
                },
                0
              )
              .to(
                nextImage,
                {
                  objectPosition: "0px 50%",
                  duration: 1.5,
                  ease: "none"
                },
                0
              );
          }

          mainTimeline.add(sectionTimeline);
        });
      },
      "(max-width: 768px)": () => {
        // Kill existing ScrollTriggers on re-match
        // ScrollTrigger.getAll().forEach(trigger => trigger.kill());

        // This timeline acts as a container, individual image animations are inside
        const mbTimeline = gsap.timeline();
        gsap.set(imgs, {
          objectPosition: "0px 60%"
        });

        imgs.forEach((image, index) => {
          const innerTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: image, // Each image itself acts as a trigger
              start: "top-=70% top+=50%",
              end: "bottom+=200% bottom",
              scrub: true
            }
          });

          innerTimeline.to(image, {
            objectPosition: "0px 30%",
            duration: 5,
            ease: "none"
          });

          // Animate the host's background color for mobile
          if (bgColors[index] !== undefined) {
            innerTimeline.to(this, { // Target the host element
              backgroundColor: bgColors[index],
              duration: 1.5,
              ease: "power2.inOut"
            }, "<"); // Animate background concurrently with image position
          }

          mbTimeline.add(innerTimeline);
        });
      },
      // When the media query doesn't match, this function runs.
      // This is crucial for cleanup when switching between desktop/mobile layouts.
      revert: () => {
        // Reset properties that were set by GSAP or logic for the previous media query
        gsap.set(imgs, { clearProps: "clipPath,objectPosition" });
        // Clear background color that was set by GSAP animations, revert to CSS default
        gsap.set(this, { clearProps: "background-color" });
        this.shadowRoot.querySelectorAll(".arch__left .arch__info").forEach(item => item.style.order = "");
        this.shadowRoot.querySelectorAll(".arch__right .img-wrapper").forEach(item => item.style.order = "");
        // Kill all associated ScrollTriggers for the unmatched media query
        // ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
    });
  }
}

customElements.define('arch-component', ArchComponent);