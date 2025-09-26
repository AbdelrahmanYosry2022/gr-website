import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

class Caac extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.lenis = null;
    this.mainTimeline = null;
    this.mbTimeline = null;
    this.resizeTimeout = null;

    // Background colors for sections
    // Initial background color for :host is set in CSS variable --caac-bg-color
    // These colors are for subsequent sections
    this.bgColors = ["#EDF9FF", "#FFECF2", "#FFE8DB"];

    this.debouncedHandleMobileLayout = this.debouncedHandleMobileLayout.bind(this);
    this.raf = this.raf.bind(this);

    this.shadowRoot.innerHTML = `
      <style>
        @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@400;800&display=swap");

        :host {
          display: block; /* Web Components are inline by default */
          color: #121212;
          font-family: "Outfit", sans-serif;
          background-color: var(--caac-bg-color, #f9ffe7); /* Initial background color */
        }
        .container {
          max-width: 1440px;
          padding: 2rem;
        }

        .spacer {
          width: 100%;
          height: 30vh;
        }

        .arch {
          display: flex;
          gap: 60px;
          justify-content: space-between;
          max-width: 1100px;
          margin-inline: auto;
        }

        .arch__left {
          display: flex;
          flex-direction: column;
          min-width: 300px;
        }

        .arch__left .arch__info {
          max-width: 356px;
          height: 100vh;
          display: grid;
          place-items: center;
        }

        .arch__left .arch__info h2.header {
          font-family: Outfit;
          font-size: 42px;
          font-weight: 800;
          letter-spacing: -0.84px;
        }

        .arch__left .arch__info p.desc {
          color: rgba(18, 18, 18, 0.8);
          font-size: 18px;
          letter-spacing: -0.54px;
          margin-block: 6px 28px;
          line-height: normal;
        }

        .arch__left .arch__info a.link {
          text-decoration: none;
          padding: 16px 18px;
          color: inherit;
          border-radius: 40px;
          display: flex;
          gap: 4px;
          width: fit-content;
          align-items: center;
        }

        .arch__right {
          flex-shrink: 1;
          height: 100vh;
          width: 100%;
          max-width: 540px;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .arch__right .img-wrapper {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          height: 400px;
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
        }

        .arch__right .img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        @media (max-width: 900px) {
          .arch {
            gap: 30px;
          }
        }

        @media (max-width: 768px) {
          .arch {
            flex-direction: column;
            gap: 20px;
          }

          .arch__left,
          .arch__right {
            display: contents;
          }

          .arch__right {
            height: auto;
            max-width: 100%;
          }

          .arch__right .img-wrapper {
            position: static;
            transform: none;
            height: 360px;
            width: 100%;
            margin-bottom: 20px;
          }

          .arch__left .arch__info {
            height: auto;
            padding: 20px 0;
          }
        }

        @media (max-width: 560px) {
          .arch {
            gap: 12px;
          }

          .container {
            padding: 10px;
          }

          .arch__right .img-wrapper {
            border-radius: 10px;
            height: 280px;
          }
        }
      </style>
      <div class="container">
        <div class="spacer"></div>

        <div class="arch">
          <div class="arch__left">
            <div class="arch__info" id="green-arch">
              <div class="content">
                <h2 class="header">Green Cityscape</h2>
                <p class="desc">Vibrant streets with vertical gardens and solar buildings. This oasis thrives on renewable energy, smart transport, and green spaces for biodiversity.</p>
                <a class="link" href="#" style="background-color: #D5FF37">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none">
                    <path fill="#121212" d="M5 2c0 1.105-1.895 2-3 2a2 2 0 1 1 0-4c1.105 0 3 .895 3 2ZM11 3.5c0 1.105-.895 3-2 3s-2-1.895-2-3a2 2 0 1 1 4 0ZM6 9a2 2 0 1 1-4 0c0-1.105.895-3 2-3s2 1.895 2 3Z" />
                  </svg> <span>Learn More</span></a>
              </div>
            </div>

            <div class="arch__info" id="blue-arch">
              <div class="content">
                <h2 class="header">Blue Urban Oasis</h2>
                <p class="desc">Avenues with azure facades and eco-structures. This hub uses clean energy, smart transit, and parks for urban wildlife.</p>
                <a class="link" href="#" style="background-color: #7DD6FF">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none">
                    <path fill="#121212" d="M5 2c0 1.105-1.895 2-3 2a2 2 0 1 1 0-4c1.105 0 3 .895 3 2ZM11 3.5c0 1.105-.895 3-2 3s-2-1.895-2-3a2 2 0 1 1 4 0ZM6 9a2 2 0 1 1-4 0c0-1.105.895-3 2-3s2 1.895 2 3Z" />
                  </svg> <span>Learn More</span></a>
              </div>
            </div>

            <div class="arch__info" id="pink-arch">
              <div class="content">
                <h2 class="header">Fluid Architecture</h2>
                <p class="desc">Desert refuge with fluid architecture and glowing interiors. This sanctuary harnesses solar power, sustainable design, and natural harmony for resilient living.</p>
                <a class="link" href="#" style="background-color: #FFA0B0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none">
                    <path fill="#121212" d="M5 2c0 1.105-1.895 2-3 2a2 2 0 1 1 0-4c1.105 0 3 .895 3 2ZM11 3.5c0 1.105-.895 3-2 3s-2-1.895-2-3a2 2 0 1 1 4 0ZM6 9a2 2 0 1 1-4 0c0-1.105.895-3 2-3s2 1.895 2 3Z" />
                  </svg> <span>Learn More</span></a>
              </div>
            </div>

            <div class="arch__info" id="orange-arch">
              <div class="content">
                <h2 class="header">Martian Arches</h2>
                <p class="desc">Ethereal structures arc over tranquil waters, bathed in the glow of a setting Martian sun. This desolate beauty showcases the stark, captivating landscape of the red planet.</p>
                <a class="link" href="#" style="background-color: #FFA17B">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none">
                    <path fill="#121212" d="M5 2c0 1.105-1.895 2-3 2a2 2 0 1 1 0-4c1.105 0 3 .895 3 2ZM11 3.5c0 1.105-.895 3-2 3s-2-1.895-2-3a2 2 0 1 1 4 0ZM6 9a2 2 0 1 1-4 0c0-1.105.895-3 2-3s2 1.895 2 3Z" />
                  </svg> <span>Learn More</span></a>
              </div>
            </div>
          </div>

          <div class="arch__right">
            <div class="img-wrapper" data-index="4">
              <img src="https://res.cloudinary.com/dbsuruevi/image/upload/v1757093052/cu8978xjlsjjpjk52ta0.webp" alt="Green Architecture">
            </div>

            <div class="img-wrapper" data-index="3">
              <img src="https://res.cloudinary.com/dbsuruevi/image/upload/v1757093053/trh7c8ufv1dqfrofdytd.webp" alt="Blue Architecture">
            </div>

            <div class="img-wrapper" data-index="2">
              <img src="https://res.cloudinary.com/dbsuruevi/image/upload/v1757093052/aw6qwur0pggp5r03whjq.webp" alt="Pink Architecture">
            </div>

            <div class="img-wrapper" data-index="1">
              <img src="https://res.cloudinary.com/dbsuruevi/image/upload/v1757093053/sqwn8u84zd1besgl0zpd.webp" alt="Orange Architecture">
            </div>

          </div>
        </div>

        <div class="spacer"></div>

      </div>
    `;
  }

  connectedCallback() {
    this.initializeLenisAndGsap();
    this.setInitialImageZIndexes();
    this.handleMobileLayout(); // Run on initial load
    window.addEventListener("resize", this.debouncedHandleMobileLayout);
    requestAnimationFrame(this.raf);
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.debouncedHandleMobileLayout);
    this.lenis?.destroy();
    this.mainTimeline?.kill();
    this.mbTimeline?.kill();
    // ScrollTrigger.getAll().forEach(st => st.kill()); // Kills ALL scrolltriggers, may affect other components
    // If multiple components, it's better to store and kill component-specific ScrollTriggers.
  }

  initializeLenisAndGsap() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      gestureDirection: "vertical",
      smoothTouch: true,
      touchMultiplier: 2
    });

    // Ensure ScrollTrigger updates with Lenis scroll position
    // If Lenis is applied to a specific scroller element, ScrollTrigger needs to be configured:
    // ScrollTrigger.defaults({ scroller: this.lenis.wrapper });
    // In this case, Lenis defaults to window, and ScrollTrigger also defaults to window, so it works.
  }

  raf(time) {
    this.lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(this.raf);
  }

  setInitialImageZIndexes() {
    this.shadowRoot.querySelectorAll(".arch__right .img-wrapper").forEach((element) => {
      const order = element.getAttribute("data-index");
      if (order !== null) {
        element.style.zIndex = order;
      }
    });
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

  debouncedHandleMobileLayout() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => this.handleMobileLayout(), 100);
  }

  runComponentLogic() {
    const imgs = gsap.utils.toArray(".img-wrapper img", this.shadowRoot);
    const archElement = this.shadowRoot.querySelector(".arch");

    // GSAP Animation with Media Query
    ScrollTrigger.matchMedia({
      "(min-width: 769px)": () => {
        this.mainTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: archElement,
            start: "top top",
            end: "bottom bottom",
            pin: this.shadowRoot.querySelector(".arch__right"),
            scrub: true
          }
        });

        gsap.set(imgs, {
          clipPath: "inset(0)",
          objectPosition: "0px 0%"
        });

        imgs.forEach((_, index) => {
          const currentImage = imgs[index];
          const nextImage = imgs[index + 1] ? imgs[index + 1] : null;

          const sectionTimeline = gsap.timeline();

          // Only animate background color if there's a next section,
          // as bgColors array matches the transition to the *next* section's theme.
          // The last image (index 3) does not trigger a background change to a new color.
          if (index < this.bgColors.length) {
            sectionTimeline.to(
              this, // Animate the host element
              {
                '--caac-bg-color': this.bgColors[index],
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
                  objectPosition: "0px 60%",
                  duration: 1.5,
                  ease: "none"
                },
                0
              )
              .to(
                nextImage,
                {
                  objectPosition: "0px 40%",
                  duration: 1.5,
                  ease: "none"
                },
                0
              );
          }

          this.mainTimeline.add(sectionTimeline);
        });
      },
      "(max-width: 768px)": () => {
        this.mbTimeline = gsap.timeline(); // Create a parent timeline to manage child triggers

        gsap.set(imgs, {
          objectPosition: "0px 60%"
        });

        imgs.forEach((image, index) => {
          const innerTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: image, // `image` is already a direct element reference from shadowRoot
              start: "top-=70% top+=50%",
              end: "bottom+=200% bottom",
              scrub: true
            }
          });

          innerTimeline
            .to(image, {
              objectPosition: "0px 30%",
              duration: 5,
              ease: "none"
            });

          // Animate background color only if there's a corresponding color in the array
          if (index < this.bgColors.length) {
            innerTimeline.to(
              this, // Animate the host element
              {
                '--caac-bg-color': this.bgColors[index],
                duration: 1.5,
                ease: "power2.inOut"
              },
              "<" // Start at the same time as the previous tween
            );
          }

          this.mbTimeline.add(innerTimeline);
        });
      },
      // All other media queries (none defined, so default to desktop)
      "all": function () {
        // Any logic that should run on all screen sizes, or to revert media-query specific setups
        // For example, to revert mobile-specific styling changes
        gsap.set(imgs, { clearProps: "clipPath,objectPosition" });
        const leftItems = gsap.utils.toArray(".arch__left .arch__info", this.shadowRoot);
        const rightItems = gsap.utils.toArray(".arch__right .img-wrapper", this.shadowRoot);
        leftItems.forEach((item) => {
          item.style.order = "";
        });
        rightItems.forEach((item) => {
          item.style.order = "";
        });
      }
    });
  }

  // Call main logic after connection
  // Using a timeout to ensure all assets are potentially loaded and DOM is ready
  // Alternatively, observe images or use requestAnimationFrame if precise timing is needed
  // For this case, simple connectedCallback call is sufficient, assuming images are lazy loaded or small.
  // The ScrollTrigger.matchMedia will be reverted and re-created on resize, which is handled by GSAP.
  // Initial call is needed to set up animations.
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-initialized' && newValue === 'true' && !oldValue) {
      this.runComponentLogic();
    }
  }

  static get observedAttributes() {
    return ['data-initialized'];
  }

  // Add this to ensure runComponentLogic is called once the element is added to the DOM and rendered.
  // This is a common pattern for complex components requiring layout info.
  // It's manually called from connectedCallback initially, and can be used for re-initialization.
  set dataInitialized(value) {
    if (value) {
      this.setAttribute('data-initialized', 'true');
    } else {
      this.removeAttribute('data-initialized');
    }
  }

  get dataInitialized() {
    return this.hasAttribute('data-initialized');
  }

  // Call runComponentLogic after the first render cycle in connectedCallback
  // This ensures the shadow DOM is fully attached and styles applied for correct element measurements.
  _onReady() {
    if (!this.dataInitialized) {
      this.runComponentLogic();
      this.dataInitialized = true;
    }
  }

  connectedCallback() {
    this.initializeLenisAndGsap();
    this.setInitialImageZIndexes();
    this.handleMobileLayout(); // Run on initial load
    window.addEventListener("resize", this.debouncedHandleMobileLayout);
    requestAnimationFrame(this.raf);
    // Defer complex logic to ensure DOM is ready and styles are applied
    requestAnimationFrame(() => this._onReady());
  }
}

customElements.define('caac-component', Caac);