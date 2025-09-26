// distort-slider.js

// Dependencies: npm install three gsap imagesloaded
// Place the following @import in your global stylesheet for the fonts to work correctly:
// @import url("https://use.typekit.net/euz1eqv.css");

import * as THREE from 'three';
import { gsap } from 'gsap';
import imagesLoaded from 'imagesloaded';

const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D currentImage;
    uniform sampler2D nextImage;
    uniform float dispFactor;
    uniform float intensity;

    void main() {
        vec2 uv = vUv;
        vec4 orig1 = texture2D(currentImage, uv);
        vec4 orig2 = texture2D(nextImage, uv);
        
        vec4 currentImageTexture = texture2D(currentImage, vec2(uv.x, uv.y + dispFactor * (orig2 * intensity)));
        vec4 nextImageTexture = texture2D(nextImage, vec2(uv.x, uv.y + (1.0 - dispFactor) * (orig1 * intensity)));

        vec4 finalTexture = mix(currentImageTexture, nextImageTexture, dispFactor);
        gl_FragColor = finalTexture;
    }
`;

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      /* 1. Encapsulation & Structure Rules */
      display: block;
      position: relative;
      isolation: isolate;
      contain: layout paint;

      /* 2. Theming via CSS Custom Properties */
      /* General */
      --background-color: #23272A;
      --max-width: 1200px;
      --inner-max-width: 1060px;
      --main-font: "Arial", sans-serif;
      --title-font: "acta-display", serif;

      /* Text Colors */
      --title-color: #ffffff;
      --status-color: #ffffff;
      --meta-label-color: #88888a;

      /* Font Sizes */
      --title-font-size-mobile: 30px;
      --title-line-height-mobile: 1;
      --title-font-size-desktop: 110px;
      --title-line-height-desktop: 0.9;
      --status-font-size-mobile: 18px;
      --status-font-size-desktop: 34px;
      --meta-font-size-mobile: 11px;
      --meta-font-size-desktop: 13px;

      /* Spacing */
      --title-margin: 20px 0 60px;
      --status-margin-top: 10px;
      --pagination-button-margin: 30px 0;
      
      /* Pagination */
      --pagination-button-size: 16px;
      --pagination-button-color: #FFFFFF;
      --pagination-right-offset: 30px;
      --pagination-opacity: 0.2;
      --pagination-opacity-hover: 0.5;
      --pagination-opacity-active: 1;
      --pagination-active-border-color: rgba(255, 255, 255, 0.2);

      /* Animation */
      --transition-duration-fast: 0.2s;
      --transition-duration-medium: 0.4s;
      --webgl-transition-duration: 1s;

      /* Loader */
      --loader-background-color: black;
      --loader-dot-color: white;
      --loader-animation-duration: 0.7s;
    }

    .slider-container {
      position: relative;
      width: 100%;
      height: 100vh;
      background-color: var(--background-color);
    }
    
    #slider {
      width: 100%;
      max-width: var(--max-width);
      height: 100%;
      margin: 0 auto;
      position: relative;
    }

    #slider canvas {
      width: 150%;
      height: 150%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
    }

    .slider-inner {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      max-width: var(--inner-max-width);
      height: 100%;
      margin: 0 auto;
      z-index: 5;
    }

    #slider-content { padding: 0 10px; }

    #slide-title {
      font-family: var(--title-font);
      font-weight: 400;
      font-size: var(--title-font-size-mobile);
      line-height: var(--title-line-height-mobile);
      letter-spacing: -1px;
      color: var(--title-color);
      margin: var(--title-margin);
    }
    
    .meta {
      display: inline-block;
      font-family: var(--main-font);
      font-size: var(--meta-font-size-mobile);
      letter-spacing: 5px;
      color: var(--meta-label-color);
      text-transform: uppercase;
      position: relative;
    }

    #slide-status {
      margin-top: var(--status-margin-top);
      font-family: var(--title-font);
      font-weight: 400;
      font-size: var(--status-font-size-mobile);
      color: var(--status-color);
    }

    #pagination {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: var(--pagination-right-offset);
      z-index: 6;
    }

    #pagination button {
      display: block;
      appearance: none;
      border: 0;
      width: var(--pagination-button-size);
      height: var(--pagination-button-size);
      background-color: var(--pagination-button-color);
      border-radius: 100%;
      padding: 0;
      margin: var(--pagination-button-margin);
      cursor: pointer;
      position: relative;
      opacity: var(--pagination-opacity);
      transition: opacity var(--transition-duration-fast) ease-in-out;
      outline: none;
    }

    #pagination button:hover { opacity: var(--pagination-opacity-hover); }
    #pagination button.active { opacity: var(--pagination-opacity-active); }

    #pagination button.active::before {
      width: 300%;
      height: 300%;
      opacity: 1;
    }

    #pagination button::before {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      border-radius: 100%;
      border: 1px solid var(--pagination-active-border-color);
      opacity: 0;
      transition: opacity var(--transition-duration-medium) ease-in-out, width var(--transition-duration-medium) ease-in-out, height var(--transition-duration-medium) ease-in-out;
    }

    :host(.loading) .loader-scrim {
      content: "";
      position: absolute;
      z-index: 1000;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--loader-background-color);
    }
    :host(.loading) .loader-dot {
      content: "";
      position: absolute;
      z-index: 1001;
      top: 50%;
      left: 50%;
      width: 60px;
      height: 60px;
      margin: -30px 0 0 -30px;
      pointer-events: none;
      border-radius: 50%;
      opacity: 0.4;
      background: var(--loader-dot-color);
      animation: loaderAnim var(--loader-animation-duration) linear infinite alternate forwards;
    }

    @keyframes loaderAnim {
      to {
        opacity: 1;
        transform: scale3d(0.5, 0.5, 1);
      }
    }
    
    @media screen and (min-width: 800px) {
      #slide-title {
        font-size: var(--title-font-size-desktop);
        line-height: var(--title-line-height-desktop);
      }
      .meta {
        font-size: var(--meta-font-size-desktop);
      }
      #slide-status {
        font-size: var(--status-font-size-desktop);
      }
    }
  </style>
  
  <div class="slider-container">
    <div class="loader-scrim"></div>
    <div class="loader-dot"></div>
    
    <div id="slider">
      <div class="slider-inner">
        <div id="slider-content">
          <div class="meta">
            <slot name="meta-label-1">Species</slot>
          </div>
          <h2 id="slide-title"></h2>
          <div class="meta">
            <slot name="meta-label-2">Status</slot>
          </div>
          <div id="slide-status"></div>
        </div>
      </div>

      <div id="pagination"></div>
      
      <div style="display: none;">
        <slot></slot>
      </div>
    </div>
  </div>
`;

class DistortSlider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.isAnimating = false;
    this.slideData = [];
  }

  connectedCallback() {
    this.classList.add('loading');
    
    // Defer initialization until the next frame to allow slots to populate
    requestAnimationFrame(() => {
      this._initialize();
    });
  }
  
  _initialize() {
    const imageSlot = this.shadowRoot.querySelector('slot:not([name])');
    const slottedImages = imageSlot.assignedElements({ flatten: true });

    if (slottedImages.length === 0) {
      console.error('<distort-slider>: No images provided in the default slot.');
      this.classList.remove('loading');
      return;
    }
    
    slottedImages.forEach((img, index) => {
      this.slideData.push({
        index: index,
        src: img.src,
        title: img.dataset.title || `Slide ${index + 1}`,
        status: img.dataset.status || ''
      });
    });

    imagesLoaded(slottedImages, () => {
      this._setupWebGL(slottedImages);
      this.classList.remove('loading');
    });
  }
  
  _setupWebGL(images) {
    this.sliderElement = this.shadowRoot.querySelector('#slider');
    this.titleElement = this.shadowRoot.querySelector('#slide-title');
    this.statusElement = this.shadowRoot.querySelector('#slide-status');
    this.paginationElement = this.shadowRoot.querySelector('#pagination');

    this._populateInitialContent();

    const renderWidth = this.sliderElement.clientWidth;
    const renderHeight = this.sliderElement.clientHeight;

    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(renderWidth, renderHeight);
    this.sliderElement.appendChild(this.renderer.domElement);
    
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    this.textures = images.map(img => loader.load(img.src));

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(renderWidth / -2, renderWidth / 2, renderHeight / 2, renderHeight / -2, 1, 1000);
    this.camera.position.z = 1;

    // 4. Data via Attributes
    const intensity = parseFloat(this.getAttribute('distortion-intensity')) || 0.3;
    const transitionDuration = `var(--webgl-transition-duration, 1s)`;
    this.gsapDuration = parseFloat(getComputedStyle(this).getPropertyValue('--webgl-transition-duration')) || 1;

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        dispFactor: { value: 0.0 },
        currentImage: { value: this.textures[0] },
        nextImage: { value: this.textures[1] },
        intensity: { value: intensity }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });
    
    const geometry = new THREE.PlaneBufferGeometry(renderWidth, renderHeight, 1);
    const object = new THREE.Mesh(geometry, this.material);
    this.scene.add(object);

    this._addEventListeners();
    this._animate();

    const resizeObserver = new ResizeObserver(() => {
        const newWidth = this.sliderElement.clientWidth;
        const newHeight = this.sliderElement.clientHeight;
        this.renderer.setSize(newWidth, newHeight);
        this.camera.left = newWidth / -2;
        this.camera.right = newWidth / 2;
        this.camera.top = newHeight / 2;
        this.camera.bottom = newHeight / -2;
        this.camera.updateProjectionMatrix();
    });
    resizeObserver.observe(this.sliderElement);
  }

  _populateInitialContent() {
    this.titleElement.innerHTML = this.slideData[0].title;
    this.statusElement.innerHTML = this.slideData[0].status;
    
    this.slideData.forEach(slide => {
      const button = document.createElement('button');
      button.dataset.slide = slide.index;
      if (slide.index === 0) button.classList.add('active');
      this.paginationElement.appendChild(button);
    });
  }

  _addEventListeners() {
    const pagButtons = this.shadowRoot.querySelectorAll('#pagination button');
    pagButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (this.isAnimating) return;

        const slideId = parseInt(button.dataset.slide, 10);
        const currentActive = this.shadowRoot.querySelector('#pagination .active');
        const currentIndex = parseInt(currentActive.dataset.slide, 10);

        if (slideId === currentIndex) return;

        this.isAnimating = true;
        currentActive.classList.remove('active');
        button.classList.add('active');

        this._transitionToSlide(slideId);
      });
    });
  }

  _transitionToSlide(slideId) {
    const nextSlide = this.slideData[slideId];
    this.material.uniforms.nextImage.value = this.textures[slideId];

    gsap.to(this.material.uniforms.dispFactor, {
      value: 1,
      duration: this.gsapDuration,
      ease: 'expo.inOut',
      onComplete: () => {
        this.material.uniforms.currentImage.value = this.textures[slideId];
        this.material.uniforms.dispFactor.value = 0.0;
        this.isAnimating = false;
      }
    });

    gsap.to(this.titleElement, { autoAlpha: 0, y: 20, duration: this.gsapDuration / 2, ease: 'expo.in', onComplete: () => {
      this.titleElement.innerHTML = nextSlide.title;
      gsap.to(this.titleElement, { autoAlpha: 1, y: 0, duration: this.gsapDuration / 2 });
    }});

    gsap.to(this.statusElement, { autoAlpha: 0, y: 20, duration: this.gsapDuration / 2, ease: 'expo.in', onComplete: () => {
      this.statusElement.innerHTML = nextSlide.status;
      gsap.to(this.statusElement, { autoAlpha: 1, y: 0, duration: this.gsapDuration / 2, delay: 0.1 });
    }});

    // 5. Dispatching Custom Events
    this.dispatchEvent(new CustomEvent('slideChange', {
      bubbles: true,
      composed: true,
      detail: {
        newIndex: slideId,
        title: nextSlide.title,
        status: nextSlide.status
      }
    }));
  }

  _animate() {
    requestAnimationFrame(this._animate.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

customElements.define('distort-slider', DistortSlider);