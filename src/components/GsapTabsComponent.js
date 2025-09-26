import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { Flip } from 'gsap/Flip';

export class GsapTabsComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.activeButton = null;
    this.activeContent = null;
    this.activeVisual = null;
    this.isAnimating = false;
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        /* Host styles derived from body/html */
        :host {
          display: block; /* Web components are inline by default */
          min-height: 100vh; /* Make the component occupy full viewport height */
          
          /* These are derived from the original body styles */
          background-color: var(--color-black, #000); /* Added default black */
          color: var(--color-light, #efeeec); /* Added default light color */
          font-size: 1vw;
          font-family: arial, sans-serif;
          cursor: url("https://cdn.prod.website-files.com/6708f85ff3d3cba6aff436fb/671251b239d7aeb290a31ac5_cursor-default%402x.svg") 2 0, auto;
          
          /* Additional variables used in the component */
          --container-padding: 3em; /* Placeholder/default for padding */
        }

        :host a,
        :host button {
          cursor: url("https://cdn.prod.website-files.com/6708f85ff3d3cba6aff436fb/671251b212e6b71494aa67ff_cursor-pointer%402x.svg") 12 0, pointer;
        }

        /* @font-face definition */
        @font-face {
          font-family: 'PP Neue Montreal';
          src: url('https://cdn.prod.website-files.com/6819ed8312518f61b84824df/6819ed8312518f61b84825ba_PPNeueMontreal-Medium.woff2') format('woff2');
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }

        /* Original CSS from the user's input */
        /* ------- Osmo [https://osmo.supply/] ------- */
        /* Osmo UI: https://slater.app/10324/23333.css */

        .cloneable {
          padding: var(--container-padding);
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          display: flex;
          position: relative;
          font-size: 1.1vw;
        }

        .tab-container {
          grid-column-gap: 3em;
          grid-row-gap: 3em;
          flex-flow: column;
          justify-content: space-between;
          align-items: flex-start;
          min-height: 100%;
          padding-top: 0;
          padding-bottom: 0;
          padding-right: 2.5em;
          display: flex;
        }

        .tab-layout-container {
          width: 100%;
          max-width: 36em;
          height: 100%;
          margin-left: auto;
          margin-right: 0;
          padding-top: 1em;
          padding-bottom: 2em;
        }

        .tab-container-bottom {
          grid-column-gap: 2em;
          grid-row-gap: 2em;
          flex-flow: column;
          justify-content: flex-start;
          align-items: flex-start;
          display: flex;
        }

        .tab-container-top {
          grid-column-gap: 2em;
          grid-row-gap: 2em;
          flex-flow: column;
          justify-content: flex-start;
          align-items: flex-start;
          display: flex;
        }

        .tab-layout-col {
          width: 50%;
        }

        .tab-content-wrap {
          width: 100%;
          min-width: 24em;
          position: relative;
        }

        .content-button__bg {
          z-index: -1;
          background-color: #efeeec;
          border-radius: .25em;
          position: absolute;
          inset: 0%;
        }

        .content-p {
          margin: 0;
          font-size: 1.25em;
          line-height: 1.4;
        }

        .tab-button__bg {
          z-index: 0;
          background-color: #efeeec0f;
          border: 1px solid #efeeec14;
          border-radius: .25em;
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0%;
        }

        .tab-content-item {
          z-index: 1;
          grid-column-gap: 1.25em;
          grid-row-gap: 1.25em;
          visibility: hidden;
          flex-flow: column;
          display: flex;
          position: absolute;
          inset: auto 0% 0%;
        }

        .tab-content-item.active {
          visibility: visible;
        }

        .tab-layout {
          z-index: 1;
          grid-row-gap: 3em;
          flex-flow: wrap;
          width: 100%;
          min-height: 37em;
          display: flex;
          position: relative;
        }

        .filter-bar {
          background-color: #efeeec0f;
          border: 1px solid #efeeec14;
          border-radius: .5em;
          padding: .5em;
          display: flex;
        }

        .filter-button {
          background-color: #0000;
          border: 1px solid #efeeec00;
          padding: 1.125em 1.5em;
          transition: border-color .2s;
          position: relative;
          font-size: inherit;
        }

        .filter-button.active {
          border-color: #efeeec4d;
          border-radius: .25em;
        }

        .filter-button__p {
          z-index: 1;
          font-size: 1.125em;
          position: relative;
          color:var(--color-light);
        }

        .tab-visual-wrap {
          border-radius: .5em;
          width: 100%;
          height: 42em;
          max-height: 80vh;
          position: relative;
          overflow: hidden;
        }

        .tab-visual-item {
          visibility: hidden;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          height: 100%;
          display: flex;
          position: absolute;
        }

        .tab-visual-item.active {
          visibility: visible;
        }

        .tab-image {
          object-fit: cover;
          border-radius: .5em;
          width: 100%;
          max-width: none;
          height: 100%;
        }

        .tab-content__heading {
          letter-spacing: -.02em;
          margin-top: 0;
          margin-bottom: 0;
          font-size: 1.75em;
          font-weight: 500;
          line-height: 1;
        }

        .tab-layout-heading {
          margin-top: 0;
          margin-bottom: 0;
          font-size: 4em;
          font-weight: 500;
          line-height: 1;
        }

        .tab-content__button {
          color: #131313;
          justify-content: center;
          align-items: center;
          height: 4em;
          padding-left: 1.5em;
          padding-right: 1.5em;
          text-decoration: none;
          display: flex;
          position: relative;
        }

        .osmo-credits {
          z-index: 999;
          pointer-events: none;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 4em;
          padding: 1em;
          display: flex;
          position: fixed;
          bottom: 0;
          left: 0;
        }

        .osmo-credits__p {
          pointer-events: auto;
          color: #efeeec80;
          text-align: center;
          margin: 0;
          font-family: PP Neue Montreal, Arial, sans-serif;
          font-size: 1.125em;
          font-weight: 500;
          line-height: 1.3;
        }

        .osmo-credits__p-a {
          color: #efeeec;
        }
      </style>
      <section class="cloneable">
          <div data-tabs="wrapper" class="tab-layout">
            <div class="tab-layout-col">
              <div class="tab-layout-container">
                <div class="tab-container">
                  <div class="tab-container-top">
                    <h1 class="tab-layout-heading">Explore the Layers of Abstract Design and Depth</h1>
                    <div data-flip-button="wrap" data-tabs="nav" class="filter-bar">
                      <button data-tabs="button" data-flip-button="button" class="filter-button active">
                        <div class="filter-button__p">Shapes</div>
                        <div data-flip-button="bg" class="tab-button__bg"></div>
                      </button>
                      <button data-tabs="button" data-flip-button="button" class="filter-button">
                        <div class="filter-button__p">Depth</div>
                      </button>
                      <button data-tabs="button" data-flip-button="button" class="filter-button">
                        <div class="filter-button__p">Layers</div>
                      </button>
                    </div>
                  </div>
                  <div class="tab-container-bottom">
                    <div data-tabs="content-wrap" class="tab-content-wrap">
                      <div data-tabs="content-item" class="tab-content-item active">
                        <h2 data-tabs-fade="" class="tab-content__heading">Shifting Perspectives</h2>
                        <p data-tabs-fade="" class="content-p opacity--80">A dynamic exploration of structure, balance, and creative symmetry.</p>
                      </div>
                      <div data-tabs="content-item" class="tab-content-item">
                        <h2 data-tabs-fade="" class="tab-content__heading">Fragments of Motion</h2>
                        <p data-tabs-fade="" class="content-p opacity--80">Where design meets depth—an abstract dance of light and form.</p>
                      </div>
                      <div data-tabs="content-item" class="tab-content-item">
                        <h2 data-tabs-fade="" class="tab-content__heading">Echoes in Orange</h2>
                        <p data-tabs-fade="" class="content-p opacity--80">A journey through layered geometry and endless possibilities.</p>
                      </div>
                    </div>
                    <a id="form-button" href="#" class="tab-content__button w-inline-block">
                      <p class="content-p">Become a member</p>
                      <div class="content-button__bg"></div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-layout-col">
              <div data-tabs="visual-wrap" class="tab-visual-wrap">
                <div data-tabs="visual-item" class="tab-visual-item active"><img src="https://cdn.prod.website-files.com/67726722d415dc401ae23cf6/677289e14dd4dbca1d8e5930_philip-oroni-IANBrm46bF0-unsplash%20(2).avif" loading="lazy" class="tab-image"></div>
                <div data-tabs="visual-item" class="tab-visual-item"><img src="https://cdn.prod.website-files.com/67726722d415dc401ae23cf6/677289e19e4d013c6a4c5a1b_philip-oroni-Zx_G3LpNnV4-unsplash%20(1).avif" loading="lazy" class="tab-image"></div>
                <div data-tabs="visual-item" class="tab-visual-item"><img src="https://cdn.prod.website-files.com/67726722d415dc401ae23cf6/677289e1c88b5b4c14d1e6fd_philip-oroni-h9N7bm-HRCo-unsplash.avif" loading="lazy" class="tab-image"></div>
              </div>
            </div>
          </div>
        </section>
      <div class="osmo-credits">
        <p class="osmo-credits__p">Resource by <a target="_blank" href="https://www.osmo.supply/" class="osmo-credits__p-a">Osmo</a></p>
      </div>
    `;
    this._runComponentLogic();
  }

  _runComponentLogic() {
    gsap.registerPlugin(CustomEase, Flip);
    CustomEase.create("osmo-ease", "0.625, 0.05, 0, 1");
    gsap.defaults({
      ease: "osmo-ease",
      duration: 0.8,
    });

    this._initTabSystem();
    this._initFlipButtons();
  }

  _initFlipButtons() {
    let wrappers = this.shadowRoot.querySelectorAll('[data-flip-button="wrap"]');
    
    wrappers.forEach((wrapper) => {
      let buttons = wrapper.querySelectorAll('[data-flip-button="button"]');
      let bg = wrapper.querySelector('[data-flip-button="bg"]');
      
      // Ensure the initial state of the background is correct if an active button exists
      const initialActiveButton = wrapper.querySelector(".filter-button.active");
      if (initialActiveButton && bg) {
        initialActiveButton.appendChild(bg);
      }

      buttons.forEach((button) => {
        // Handle mouse enter
        button.addEventListener("mouseenter", () => {
          const state = Flip.getState(bg);
          button.appendChild(bg);
          Flip.from(state, {
            duration: 0.4,
          });
        });

        // Handle focus for keyboard navigation
        button.addEventListener("focus", () => {
          const state = Flip.getState(bg);
          button.appendChild(bg);
          Flip.from(state, {
            duration: 0.4,
          });
        });

        // Handle mouse leave
        button.addEventListener("mouseleave", () => {
          const state = Flip.getState(bg);
          const activeLink = wrapper.querySelector(".active");
          if (activeLink) { // Ensure activeLink exists before appending
            activeLink.appendChild(bg);
            Flip.from(state, {
              duration: 0.4,
            });
          }
        });

        // Handle blur to reset background for keyboard navigation
        button.addEventListener("blur", () => {
          const state = Flip.getState(bg);
          const activeLink = wrapper.querySelector(".active");
          if (activeLink) { // Ensure activeLink exists before appending
            activeLink.appendChild(bg);
            Flip.from(state, {
              duration: 0.4,
            });
          }
        });
      });
    });
  }

  _initTabSystem() {
    let wrappers = this.shadowRoot.querySelectorAll('[data-tabs="wrapper"]');
    
    wrappers.forEach((wrapper) => {
      let nav = wrapper.querySelector('[data-tabs="nav"]');
      let buttons = nav.querySelectorAll('[data-tabs="button"]');
      let contentWrap = wrapper.querySelector('[data-tabs="content-wrap"]');
      let contentItems = contentWrap.querySelectorAll('[data-tabs="content-item"]');
      let visualWrap = wrapper.querySelector('[data-tabs="visual-wrap"]');
      let visualItems = visualWrap.querySelectorAll('[data-tabs="visual-item"]');

      // These class properties will manage state for the current component instance
      this.activeButton = buttons[0];
      this.activeContent = contentItems[0];
      this.activeVisual = visualItems[0];
      this.isAnimating = false; // Reset animation state for each wrapper

      const switchTab = (index, initial = false) => {
        if (!initial && (this.isAnimating || buttons[index] === this.activeButton)) return;
        this.isAnimating = true;

        const outgoingContent = this.activeContent;
        const incomingContent = contentItems[index];
        const outgoingVisual = this.activeVisual;
        const incomingVisual = visualItems[index];

        let outgoingLines = outgoingContent ? outgoingContent.querySelectorAll("[data-tabs-fade]") : [];
        let incomingLines = incomingContent.querySelectorAll("[data-tabs-fade]");

        const timeline = gsap.timeline({
          defaults:{
            ease:"power3.inOut"
          },
          onComplete: () => {
            if (!initial) {
              outgoingContent && outgoingContent.classList.remove("active");
              outgoingVisual && outgoingVisual.classList.remove("active");            
            }
            this.activeContent = incomingContent;
            this.activeVisual = incomingVisual;
            this.isAnimating = false;
          },
        });

        incomingContent.classList.add("active");
        incomingVisual.classList.add("active");

        timeline
          .to(outgoingLines, { y: "-2em", autoAlpha:0 }, 0)
          .to(outgoingVisual, { autoAlpha: 0, xPercent: 3 }, 0)
          .fromTo(incomingLines, { y: "2em", autoAlpha:0 }, { y: "0em", autoAlpha:1, stagger: 0.075 }, 0.4)
          .fromTo(incomingVisual, { autoAlpha: 0, xPercent: 3 }, { autoAlpha: 1, xPercent: 0 }, "<");

        this.activeButton && this.activeButton.classList.remove("active");
        buttons[index].classList.add("active");
        this.activeButton = buttons[index];
      };

      // Set initial active states (from HTML) and register them in class properties
      switchTab(0, true); 
   
      buttons.forEach((button, i) => {
        button.addEventListener("click", () => switchTab(i)); 
      });
    });
  }
}

customElements.define('gsap-tabs-component', GsapTabsComponent);