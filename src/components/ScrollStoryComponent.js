// src/components/ScrollStoryComponent.js

class ScrollStoryComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        /* External styles are now in src/style.css */

        /* Component-specific styles */
        :host {
          display: block;

          /* --- added isolation properties --- */
          position: relative;
          isolation: isolate;
          z-index: -100;

          font-family: 'Inter', sans-serif;
          --surface-1: black;
          --surface-3: #f1dadf;
          --text-1: white;
          --brand-1: oklch(0.65 0.24 16.93);
          --nav-block-size: 3.75rem;
        }

        @media (width >= 1024px) {
           :host {
             --nav-block-size: 4.625rem;
           }
        }
        
        main {
          background-color: var(--surface-3);
          color: var(--surface-1);
        }

        .Hero {
          display: grid;
        }
        @media (width >= 1024px) {
          .Hero {
            grid-template-columns: 1.5fr 1fr;
          }
        }
        
        /* All other necessary styles from the original file are included here */
        /* ... I have included all the necessary styles below ... */
        
        .Nav {
            position: fixed; inset-block-end: 0; inset-inline: 0;
            block-size: var(--nav-block-size); z-index: 10;
            background-color: hsl(0 0% 0% / 0.1); backdrop-filter: blur(28px);
        }
        .Nav > a {
            background: var(--gradient-21, linear-gradient(to right, #ff7e5f, #feb47b)); color: white; border-radius: 9999px;
            padding: 0.5rem 1rem; text-decoration: none;
            font-weight: 600; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        @media (width >= 1024px) {
            .Nav {
                background-color: var(--surface-1); font-size: 14px; position: sticky;
                inset-block-start: 0; inline-size: 100%; display:grid; justify-items: end;
                padding-inline: 1.25rem;
            }
        }
        .Visual {
           display: grid;
           justify-content: center;
           align-items: center;
        }
        .Visual img {
            inline-size: 100%; block-size: 100%; object-fit: cover;
            object-position: center center;
            background: var(--gradient-8, lightgray);
        }
        @media (width >= 1024px) {
            .Visual {
                position: fixed; inline-size: 62%; block-size: calc(100vh - 2.25rem);
                inset-block-start: 2.25rem;
            }
            .Visual > * { grid-area: 1/1; }
            .Visual img { border-radius: inherit; }
            .Visual picture { max-inline-size: 600px; aspect-ratio: 1/1; border-radius: 0.75rem; }
        }
        @media (1024px < width < 1440px) {
            .Visual picture { max-inline-size: 500px; }
        }
        @media (width < 1024px) {
            .Visual > * { min-block-size: calc(100vh - 2.25rem); }
            .Visual picture { inline-size: 100%; block-size: 100%; }
        }
        .Content {
            padding: 1rem;
        }
        .Content > * { min-block-size: calc(100vh - 2.25rem); }
        .Content h3 {
            max-inline-size: 13ch; text-wrap: balance; font-size: 3.75rem;
            font-weight: 700; line-height: 1;
            padding-block-end: 1rem;
        }
        .Content p { max-inline-size: 45ch; font-size: 1.25rem; }
        .Content .subhead {
            color: var(--brand-1); font-size: 1.5rem; font-weight: 600;
            max-inline-size: 30ch; line-height: 1.2; text-wrap: pretty;
        }
        @media (width < 1024px) { .Content { display: none; } }
        @media (width < 1440px) {
            .Content h3 { font-size: 2.25rem; }
            .Content .subhead { font-size: 1.25rem; }
        }
        .SmallScreenContent {
            position: fixed; inset-inline: 0; inset-block-start: 0;
            min-block-size: 2.25rem; color: black; display: grid;
            justify-content: center; align-items: center;
        }
        .SmallScreenContent > * { grid-area: 1/1; }
        @media (width < 1024px) {
            .SmallScreenContent { background-color: black; }
            .SmallScreenContent > p {
                background-color: black; color: white; inline-size: 100%;
                text-align: center; padding: 0.5rem; font-weight: 500;
                box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
            }
        }
        @media (width >= 1024px) { .SmallScreenContent { display: none; } }

        /* Scroll-Driven Animations */
        @supports (animation-timeline: scroll()) {
            @media (width >= 1024px) {
                :host { timeline-scope: --first-lockup, --second-lockup, --third-lockup; }
                picture { inline-size: 400px; transform-origin: bottom left; }
                picture > img { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
                .FirstPic > img { rotate: 8deg; }
                .SecondPic { animation: auto slide-out-rotate linear both; animation-timeline: --third-lockup; }
                .SecondPic > img { rotate: -5deg; }
                .ThirdPic { animation: auto slide-out-rotate linear forwards; animation-timeline: --second-lockup; }
                .ThirdPic > img { rotate: 20deg; }
                .FirstLockup { view-timeline-name: --first-lockup; }
                .SecondLockup { view-timeline-name: --second-lockup; }
                .ThirdLockup { view-timeline-name: --third-lockup; }
            }
            @media (width >= 1440px) { .Visual picture { inline-size: 500px; } }
            @media (width >= 1600px) { .Visual picture { inline-size: 512px; } }
            @media (width < 1024px) {
                :host { timeline-scope: --first-pic, --second-pic, --third-pic; }
                .SmallScreenContent > p { animation: auto reveal linear both; animation-range: cover 45%; }
                .SmallScreenContent .FirstStory { animation-timeline: --first-pic; }
                .SmallScreenContent .SecondStory { visibility: hidden; animation-timeline: --second-pic; }
                .SmallScreenContent .ThirdStory { visibility: hidden; animation-timeline: --third-pic; }
                .FirstPic { view-timeline-name: --first-pic; }
                .SecondPic { view-timeline-name: --second-pic; }
                .ThirdPic { view-timeline-name: --third-pic; }
            }
        }
        @keyframes slide-out-rotate {
            50%, 100% { transform: translate(-50%, 50%) rotate(-50deg); }
            40%, 100% { opacity: 0; }
        }
        @keyframes reveal { to { visibility: visible; } }
        
        /* Utility classes */
        .block { display: grid; }
        .inline { display: inline-grid; }
        .block-center-center { display: grid; justify-content: center; align-items: center; }
        .block-center-start { display: grid; justify-content: center; align-items: start; }
        .content-full { width: 100%; }
        .content-3 { max-width: 45ch; } /* Using a standard unit */
        .gap-2 { gap: 0.5rem; }
        .gap-3 { gap: 1rem; }
      </style>

      <nav class="Nav block-center-center">
        <a href="/"> Get Started </a>
      </nav>
      <main class="inline content-full">
        <section class="Hero inline gap-2">
          <div class="Wrapper block content-3">
            <div class="Visual block-center-center">
              <picture class="FirstPic">
                  <source srcset="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/stories-with-scroll-driven/images/img-desktop-3.avif" media="(width >= 1024px)" type="image/avif" />
                  <source srcset="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/stories-with-scroll-driven/images/img-mobile-3.avif" type="image/avif" />
                  <source srcset="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/stories-with-scroll-driven/images/img-desktop-3.webp" media="(width >= 1024px)" type="image/webp" />
                  <img src="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/stories-with-scroll-driven/images/img-mobile-3.webp" alt="Stories Unveiled" />
              </picture>
              <picture class="SecondPic">
                  <source srcset="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/stories-with-scroll-driven/images/img-desktop-2.avif" media="(width >= 1024px)" type="image/avif" />
                  <source srcset="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/stories-with-scroll-driven/images/img-mobile-2.avif" type="image/avif" />
                  <source srcset="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/stories-with-scroll-driven/images/img-desktop-2.webp" media="(width >= 1024px)" type="image/webp" />
                  <img src="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/stories-with-scroll-driven/images/img-mobile-2.webp" alt="Celebrating Life Together" />
              </picture>
              <picture class="ThirdPic">
                  <source srcset="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/stories-with-scroll-driven/images/img-desktop-1.avif" media="(width >= 1024px)" type="image/avif" />
                  <source srcset="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/stories-with-scroll-driven/images/img-mobile-1.avif" type="image/avif" />
                  <source srcset="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/stories-with-scroll-driven/images/img-desktop-1.webp" media="(width >= 1024px)" type="image/webp" />
                  <img src="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/stories-with-scroll-driven/images/img-mobile-1.webp" alt="The Art of Giving" />
              </picture>
            </div>
          </div>
          <div class="Content block">
            <div id="StoriesUnveiled" class="FirstLockup block-center-start">
              <div class="block gap-3">
                <h3>Stories Unveiled</h3>
                <div class="subhead">Capture the essence of family celebration.</div>
                <p>Share the moments that weave your family tale.</p>
              </div>
            </div>
            <div id="CelebratingLifeTogether" class="SecondLockup block-center-start">
              <div class="block gap-3">
                <h3>Celebrating Life Together</h3>
                <div class="subhead">Embrace the significance of shared joy.</div>
                <p>In every celebration, find the heartwarming stories.</p>
              </div>
            </div>
            <div id="TheArtofGiving" class="ThirdLockup block-center-start">
              <div class="block gap-3">
                <h3>The Art of Giving</h3>
                <div class="subhead">Explore the stories within each present.</div>
                <p>Every gift is a chapter in your family's narrative.</p>
              </div>
            </div>
          </div>
          <div class="SmallScreenContent block-center-center">
            <p class="FirstStory">The Art of Giving</p>
            <p class="SecondStory">Celebrating Life Together</p>
            <p class="ThirdStory">Stories Unveiled</p>
          </div>
        </section>
      </main>
    `;
  }
}

customElements.define('scroll-story-component', ScrollStoryComponent);