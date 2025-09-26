// Dependencies: npm install gsap
// Place the following @import in your global stylesheet (e.g., src/style.css) for normalize.css to work correctly:
// @import url('https://unpkg.com/normalize.css');

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const template = document.createElement('template');
template.innerHTML = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap');
    /*
      The following properties have been applied to :host to ensure proper encapsulation and behavior.
      Base styles from the original 'html' and 'body' have been migrated here.
    */
    :host {
      display: block;
      position: relative;
      isolation: isolate;
      contain: layout paint;
      
      /* Migrated from 'html' and 'body' */
      color-scheme: dark only;
      background: #000;
      font-family: 'SF Pro Text', 'SF Pro Icons', 'AOS Icons', 'Helvetica Neue', Helvetica, Arial, sans-serif, system-ui;

      /* Root variables for calculations */
      --container-width: 1600px;
      --gap: clamp(10px, 7.35vw, 80px);
      --gutter: 2rem;
      --font-size-min: 16;
      --font-size-max: 20;
      --font-ratio-min: 1.2;
      --font-ratio-max: 1.33;
      --font-width-min: 375;
      --font-width-max: 1500;
      --power-1-out: linear(0 0%, 0.0027 3.64%, 0.0106 7.29%, 0.0425 14.58%, 0.0957 21.87%, 0.1701 29.16%, 0.2477 35.19%, 0.3401 41.23%, 0.5982 55.18%, 0.7044 61.56%, 0.7987 68.28%, 0.875 75%, 0.9297 81.25%, 0.9687 87.5%, 0.9922 93.75%, 1 100%);
      --power-2-out: linear(0 0%, 0.0036 9.62%, 0.0185 16.66%, 0.0489 23.03%, 0.0962 28.86%, 0.1705 34.93%, 0.269 40.66%, 0.3867 45.89%, 0.5833 52.95%, 0.683 57.05%, 0.7829 62.14%, 0.8621 67.46%, 0.8991 70.68%, 0.9299 74.03%, 0.9545 77.52%, 0.9735 81.21%, 0.9865 85%, 0.9949 89.15%, 1 100%);
      --power-3-out: linear(0 0%, 0.0029 13.8%, 0.0184 21.9%, 0.0339 25.51%, 0.0551 28.81%, 0.0827 31.88%, 0.1168 34.76%, 0.1962 39.57%, 0.3005 44.02%, 0.4084 47.53%, 0.6242 53.45%, 0.7493 57.93%, 0.8495 62.97%, 0.8888 65.67%, 0.9213 68.51%, 0.9629 73.9%, 0.9876 80.16%, 0.998 87.5%, 1 100%);
      --power-4-out: linear(0 0%, 0.0012 14.95%, 0.0089 22.36%, 0.0297 28.43%, 0.0668 33.43%, 0.0979 36.08%, 0.1363 38.55%, 0.2373 43.07%, 0.3675 47.01%, 0.5984 52.15%, 0.7121 55.23%, 0.8192 59.21%, 0.898 63.62%, 0.9297 66.23%, 0.9546 69.06%, 0.9733 72.17%, 0.9864 75.67%, 0.9982 83.73%, 1 100%);
      --sine: linear(0 0%, 0.2861 18.47%, 0.4829 32.08%, 0.6437 44.52%, 0.7712 56.07%, 0.8722 67.47%, 0.9115 73.02%, 0.9434 78.49%, 0.9682 83.91%, 0.9859 89.3%, 0.9965 94.66%, 1 100%);
    }

    @media (max-width: 600px) {
      :host {
        --gutter: 1rem;
      }
    }

    *, *::after, *::before {
      box-sizing: border-box;
    }

    .content-wrap {
      overflow: clip;
      background: #000;
      color: #fff;
      z-index: 2;
    }

    .content-wrap::before {
      --size: 45px;
      --line: color-mix(in lch, canvasText, transparent 70%);
      content: '';
      height: 100vh;
      width: 100vw;
      position: fixed;
      background: 
        linear-gradient(90deg, var(--line) 1px, transparent 1px var(--size)) 50% 50% / var(--size) var(--size),
        linear-gradient(var(--line) 1px, transparent 1px var(--size)) 50% 50% / var(--size) var(--size);
      mask: linear-gradient(-20deg, transparent 50%, white);
      top: 0;
      transform-style: flat;
      pointer-events: none;
    }

    /* Typography */
    .fluid {
      --fluid-min: calc(var(--font-size-min) * pow(var(--font-ratio-min), var(--font-level, 0)));
      --fluid-max: calc(var(--font-size-max) * pow(var(--font-ratio-max), var(--font-level, 0)));
      --fluid-preferred: calc((var(--fluid-max) - var(--fluid-min)) / (var(--font-width-max) - var(--font-width-min)));
      --fluid-type: clamp(
        (var(--fluid-min) / 16) * 1rem,
        ((var(--fluid-min) / 16) * 1rem) - (((var(--fluid-preferred) * var(--font-width-min)) / 16) * 1rem) + (var(--fluid-preferred) * var(--variable-unit, 100vi)),
        (var(--fluid-max) / 16) * 1rem
      );
      font-size: 6rem;
    }
    h1 { --font-level: 8; line-height: 0.6; }
    h2 { --font-level: 4; }

    /* Layout */
    header {
      width: 80vw;
      
      min-height: 100vh;
      display: flex;
      margin: 0 auto;
      padding: 0 0 0 40vw;
      max-width: 80vw;
      justify-content: center;
      align-items: center;
      text-align: right;
      
    }
    header h1 { font-family: 'Cairo', sans-serif; }
    main, section {
    max-width: 100%;
    
    }
    section {
      min-height: 100vh;
    }
    .content {
      min-height: 100vh;
      width: 100vw;
      display: flex;
      place-items: center;
      align-content: center;
      position: sticky;
      top: 0;
      overflow: hidden;
    }
    main section:last-of-type {
      display: grid;
      place-items: center;
    }
    footer {
      padding: 4rem 2rem;
      text-align: center;
      position: sticky;
      bottom: 0;
      background: #000;
      color: #fff;
      width: 100%;
      z-index: -1;
      background: radial-gradient(hsl(0 0% 0% / 0.1) 2px, #0000 0) 50% 50% / 40px 40px, #000;
    }

    /* Grid */
    .grid {
      --offset: 0;
      width: var(--container-width);
      max-width: calc(100% - (2 * var(--gutter)));
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: repeat(3, auto);
      gap: var(--gap);
      margin: 0 auto;
      align-content: center;
      position: absolute;
      top: 50%;
      left: 50%;
      translate: -50% -50%;
    }
    @media (max-width: 600px) {
      .grid {
        grid-template-columns: repeat(3, 1fr);
        --offset: -1;
      }
      .grid > div:nth-of-type(1) {
        display: none;
      }
    }
    .grid > .layer {
      display: grid;
      grid-column: 1 / -1;
      grid-row: 1 / -1;
      grid-template-columns: subgrid;
      grid-template-rows: subgrid;
    }
    .grid > div:nth-of-type(1) div:nth-of-type(odd) { grid-column: 1; }
    .grid > div:nth-of-type(1) div:nth-of-type(even) { grid-column: -2; }
    .grid > div:nth-of-type(2) div:nth-of-type(odd) { grid-column: calc(2 + var(--offset)); }
    .grid > div:nth-of-type(2) div:nth-of-type(even) { grid-column: calc(-3 - var(--offset)); }
    .grid > div:nth-of-type(3) div { grid-column: calc(3 + var(--offset)); }
    .grid > div:nth-of-type(3) div:last-of-type { grid-row: -1; }
    .grid .scaler {
      position: relative;
      grid-area: 2 / calc(3 + var(--offset));
    }
    .grid img {
      width: 100%;
      aspect-ratio: 4 / 5;
      object-fit: cover;
      border-radius: 1rem;
    }

    /* Scaler */
    .scaler {
      z-index: 2;
      width: 100%;
      height: 100%;
      position: relative;
    }
    .scaler img {
      position: absolute;
      top: 50%;
      left: 50%;
      translate: -50% -50%;
      object-fit: cover;
      border-radius: 1rem;
      width: 100%;
      height: 100%;
    }

    /* Scroll Animations */
    @keyframes fade { 0%, 55% { opacity: 0; } }
    @keyframes reveal { 0%, 30% { scale: 0; } }
    @keyframes scale-x { 0%, 10% { width: calc(100vw - (2 * var(--gutter))); } }
    @keyframes scale-y { 0%, 10% { height: calc(100vh - (2 * var(--gutter))); } }

    @media (prefers-reduced-motion: no-preference) {
      :host([data-enhanced='true']) main section:first-of-type {
        min-height: 240vh;
      }

      @supports (animation-timeline: scroll()) and (animation-range: 0 100%) {
        :host([data-enhanced='true']) main section:first-of-type {
          view-timeline: --runner;
        }
        :host([data-center='true']) .scaler img {
          animation-name: scale-x, scale-y;
          animation-fill-mode: both;
          animation-timing-function: var(--power-2-out), var(--power-1-out);
          animation-timeline: --runner, --runner;
          animation-range: entry 100% exit -20%;
        }
        :host([data-layers='true']) .grid .layer {
          animation-name: fade, reveal;
          animation-fill-mode: both;
          animation-timeline: --runner, --runner;
          animation-timing-function: var(--sine), var(--power-1-out);
          animation-range: entry 100% exit 0%;
        }
        :host([data-stagger='range'][data-layers='true']) .grid .layer:nth-of-type(1) { animation-range: entry 100% exit 0%; }
        :host([data-stagger='range'][data-layers='true']) .grid .layer:nth-of-type(2) { animation-range: entry 100% exit -10%; }
        :host([data-stagger='range'][data-layers='true']) .grid .layer:nth-of-type(3) { animation-range: entry 100% exit -20%; }
      }
    }
    
    /* Novelty Footer Animation */
    @property --flip { syntax: '<number>'; inherits: true; initial-value: 0; }
    @keyframes flip { to { --flip: 1; } }

    @media (prefers-reduced-motion: no-preference) {
      @supports (animation-timeline: scroll()) and (animation-range: 0 100%) {
        :host([data-enhanced='true']) footer > span {
          animation: flip both steps(1, end);
          animation-timeline: scroll(root);
        }
        :host([data-enhanced='true']) footer .arm { opacity: var(--flip); }
        :host([data-enhanced='true']) footer .table {
          display: inline-block;
          transform-origin: 0 50%;
          rotate: calc((-180 + (var(--flip) * 180)) * 1deg);
          translate: calc(16% + (var(--flip) * -16%)) calc(var(--flip) * -45%);
          transform: translateY(calc(var(--flip) * 90%));
          transition-property: translate, rotate, transform;
          transition-duration: 0.2s, 0.24s, 0.5s;
        }
        :host([data-enhanced='true']) .spring span {
          rotate: calc(-180deg + (var(--flip) * 180deg));
          display: inline-block;
          transform-origin: 50% 150%;
          transition: rotate 0.24s;
        }
      }
    }
  </style>

  <div class="content-wrap">
    <header>
      <h1 class="fluid">حلول صناعية متكاملة للأغذية</h1>
    </header>
    <main>
      <section>
        <div class="content">
          <div class="grid">
            <div class="layer">
              <div><img src="/public/photos/LayeredScrollGallery/Kaya/licensed-image (2).jpeg" alt="Gallery" /></div>
              <div><img src="/public/photos/LayeredScrollGallery/Kaya/licensed-image.jpeg" alt="Gallery" /></div>
              <div><img src="/photos/LayeredScrollGallery/Whisk_1f198bfff5c74d9a66c47306b2f78147dr.jpeg" alt="Gallery" /></div>
              <div><img src="/photos/LayeredScrollGallery/Whisk_4f255331ef2175eb7f1470c03de3a5b1dr.jpeg" alt="Gallery" /></div>
              <div><img src="/photos/LayeredScrollGallery/Whisk_5ff84aad3741e4b8a3c44fba9e7def41dr.jpeg" alt="Gallery" /></div>
              <div><img src="/photos/LayeredScrollGallery/Whisk_21a48c36ab0d870acfc4c2abaac9bc1adr.jpeg" alt="Gallery" /></div>
            </div>
            <div class="layer">
              <div><img src="/public/photos/LayeredScrollGallery/Kaya/Whisk_ef02a30e32df01998ea4e2828eacac05dr.jpeg" alt="Gallery" /></div>
              <div><img src="/public/photos/LayeredScrollGallery/Kaya/1758922450.png" alt="Gallery" /></div>
              <div><img src="/public/photos/LayeredScrollGallery/Growth Roots/1758922232.png" alt="Gallery" /></div>
              <div><img src="/public/photos/LayeredScrollGallery/Growth Roots/1758922389.png" alt="Gallery" /></div>
              <div><img src="/photos/LayeredScrollGallery/Ricetto/Whisk_01a838a423a54e09821409a86a1d535bdr.jpeg" alt="Gallery" /></div>
              <div><img src="/photos/LayeredScrollGallery/Ricetto/Whisk_abd6e13f24f0788b34848f65ec42bbf9dr.jpeg" alt="Gallery" /></div>
            </div>
            <div class="layer">
              <div><img src="/photos/LayeredScrollGallery/Kaya Logo.png" alt="Gallery" /></div>
              <div><img src="/photos/LayeredScrollGallery/Ricetto Logo.png" alt="Gallery" /></div>
            </div>
            <div class="scaler">
              <img src="photos/LayeredScrollGallery/GR Design.png" alt="Hero" />
            </div>
          </div>
        </div>
      </section>
      <section>
        <h2 class="fluid">fin.</h2>
      </section>
    </main>
  </div>
  <footer>
    <span aria-hidden="true">
      ʕ<span class="arm">ノ</span>•ᴥ•ʔ<span class="arm">ノ</span>
      <span class="spring"><span>︵</span></span>
      <span class="table">┻━┻</span>
    </span>
    &nbsp;&copy; jhey '24
  </footer>
`;

class LayeredScrollGallery extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this._applySettings();
    
    const hasNativeScrollSupport = CSS.supports('(animation-timeline: view()) and (animation-range: 0 100%)');
    
    if (!hasNativeScrollSupport) {
      console.info('Native scroll-driven animations not supported. Falling back to GSAP ScrollTrigger.');
      this._setupGsapAnimations();
    }
  }
  
  disconnectedCallback() {
    if (this.gsapContext) {
      this.gsapContext.revert();
    }
  }

  _applySettings() {
    // Hardcoded settings as requested
    this.dataset.enhanced = 'true';
    this.dataset.center = 'true';
    this.dataset.layers = 'true';
    this.dataset.stagger = 'range';
    this.dataset.stick = 'true';
    this.dataset.theme = 'dark';
  }

  _setupGsapAnimations() {
    this.gsapContext = gsap.context(() => {
      // Center scaler animation
      gsap.timeline({
        scrollTrigger: {
          trigger: 'main section:first-of-type',
          start: 'top -10%',
          end: 'bottom 80%',
          scrub: true
        }
      })
      .from('.scaler img', { height: 'calc(100vh - 2 * var(--gutter))', ease: 'power1.inOut' }, 0)
      .from('.scaler img', { width: 'calc(100vw - 2 * var(--gutter))', ease: 'power2.inOut' }, 0);

      // Layers animation with range-based stagger
      const layers = gsap.utils.toArray('.layer');
      layers.forEach((layer, index) => {
        gsap.timeline({
            scrollTrigger: {
                trigger: 'main section:first-of-type',
                start: `top -${40 + index * 5}%`, // Stagger the start
                end: `bottom ${100 - index * 10}%`, // Stagger the end
                scrub: true
            }
        })
        .from(layer, { opacity: 0, ease: 'sine.out' }, 0)
        .from(layer, { scale: 0, ease: 'power1.inOut' }, 0);
      });

    }, this.shadowRoot); // IMPORTANT: scope the context to the shadowRoot
  }
}

customElements.define('layered-scroll-gallery', LayeredScrollGallery);