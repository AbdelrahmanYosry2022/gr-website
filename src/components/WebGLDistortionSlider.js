// Dependencies: npm install three gsap imagesloaded
// Place the following @import in your global stylesheet (e.g., src/style.css) for the fonts to work correctly:
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

    void main() {
        vec2 uv = vUv;
        vec4 _currentImage;
        vec4 _nextImage;
        float intensity = 0.3;

        vec4 orig1 = texture2D(currentImage, uv);
        vec4 orig2 = texture2D(nextImage, uv);
        // derive scalar displacement from red channel (could also use luminance)
        float disp1 = orig2.r * intensity;
        float disp2 = orig1.r * intensity;
        
        _currentImage = texture2D(currentImage, vec2(uv.x, uv.y + dispFactor * disp1));
        _nextImage = texture2D(nextImage, vec2(uv.x, uv.y + (1.0 - dispFactor) * disp2));

        vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);
        gl_FragColor = finalTexture;
    }
`;

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      position: relative;
      isolation: isolate;
      contain: layout paint;
      background-color: #23272A;
      overflow: hidden;
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      font-family: sans-serif;
    }
    
    :host(.loading)::before {
      content: "";
      position: fixed;
      z-index: 100000;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: black;
    }

    :host(.loading)::after {
      content: "";
      position: fixed;
      z-index: 100000;
      top: 50%;
      left: 50%;
      width: 60px;
      height: 60px;
      margin: -30px 0 0 -30px;
      pointer-events: none;
      border-radius: 50%;
      opacity: 0.4;
      background: white;
      animation: loaderAnim 0.7s linear infinite alternate forwards;
    }

    @keyframes loaderAnim {
      to {
        opacity: 1;
        transform: scale3d(0.5, 0.5, 1);
      }
    }
    
    *,
    *::after,
    *::before {
      box-sizing: border-box;
    }

    ::selection {
      background-color: grey;
      color: white;
    }

    ::-moz-selection {
      background-color: grey;
      color: white;
    }

    img {
      border: 0;
      max-width: 100%;
    }
    
    button {
      font-family: inherit;
      font-size: 100%;
      margin: 0;
      line-height: normal;
      text-transform: none;
      -webkit-appearance: button;
      cursor: pointer;
    }

    button::-moz-focus-inner {
      border: 0;
      padding: 0;
    }
    
    header {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 115px;
      z-index: 10;
      background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/123024/menutexture.png);
      background-position: center top;
      background-size: auto 200px;
      background-repeat: repeat-x;
    }
    header .inner {
      max-width: 1060px;
      margin: 0 auto;
      display: flex;
      height: 70px;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    header .logo {
      display: block;
      width: 76px;
      height: 90px;
      position: absolute;
      top: 0;
      left: 0;
      background-color: white;
      text-align: center;
    }
    header .logo img {
      width: 45px;
      margin-top: 10px;
    }
    header nav {
      display: none;
    }
    header nav a {
      font-family: "Arial", serif;
      font-size: 12px;
      color: #8c8c8e;
      text-transform: uppercase;
      letter-spacing: 3px;
      text-decoration: none;
      margin: 0 18px;
    }
    header nav a.active, header nav a:hover {
      color: white;
    }
    @media screen and (min-width: 800px) {
      header nav {
        display: block;
      }
    }
    header .burger {
      display: block;
      position: relative;
      top: -6px;
      padding-left: 30px;
    }
    header .burger:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 30px;
      height: 2px;
      background: white;
      box-shadow: 0 12px 0 0 white, 0 6px 0 0 white;
    }
    @media screen and (min-width: 800px) {
      header .burger {
        display: none;
      }
    }
    header .donate-link {
      width: 72px;
      text-align: center;
      position: absolute;
      right: 10px;
      top: 27px;
      font-family: "Arial", sans-serif;
      font-size: 12px;
      color: white;
      text-transform: uppercase;
      letter-spacing: 3px;
      text-decoration: none;
      padding-bottom: 6px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.3);
    }

    main {
      position: relative;
      width: 100%;
      height: 100vh;
    }

    #slider {
      width: 100%;
      max-width: 1200px;
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
      z-index: 2;
    }
    #slider img {
      display: none; /* Hide original images */
      width: 100%;
      position: relative;
      z-index: 0;
    }

    .slider-inner {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 1060px;
      height: 100%;
      margin: 0 auto;
      z-index: 5;
    }

    #slider-content {
      padding: 0 10px;
    }
    #slider-content h2 {
      font-family: "acta-display", serif;
      font-weight: 400;
      font-size: 30px;
      letter-spacing: -1px;
      color: white;
      line-height: 30px;
      margin: 20px 0 60px;
    }
    @media screen and (min-width: 800px) {
      #slider-content h2 {
        font-size: 110px;
        line-height: 100px;
      }
    }
    #slider-content span {
      display: none;
    }
    #slider-content .meta {
      display: inline-block;
      font-family: "Arial", sans-serif;
      font-size: 11px;
      letter-spacing: 5px;
      color: #88888a;
      text-transform: uppercase;
      position: relative;
    }
    @media screen and (min-width: 800px) {
      #slider-content .meta {
        font-size: 13px;
      }
    }
    #slider-content .meta:after {
      content: "";
      display: block;
      position: absolute;
      top: 5px;
      right: -55px;
      width: 45px;
      height: 2px;
      background-color: #393d40;
    }
    #slider-content #slide-status {
      margin-top: 10px;
      font-family: "acta-display", serif;
      font-weight: 400;
      font-size: 18px;
      color: white;
    }
    @media screen and (min-width: 800px) {
      #slider-content #slide-status {
        font-size: 34px;
      }
    }

    #pagination {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 30px;
      z-index: 6;
    }
    #pagination button {
      display: block;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      border: 0;
      width: 16px;
      height: 16px;
      background-color: #FFFFFF;
      border-radius: 100%;
      padding: 0;
      margin: 30px 0;
      cursor: pointer;
      position: relative;
      opacity: 0.2;
      transition: opacity 0.2s ease-in-out;
      outline: none;
    }
    #pagination button:hover {
      opacity: 0.5;
    }
    #pagination button.active {
      opacity: 1;
    }
    #pagination button.active:before {
      width: 300%;
      height: 300%;
      opacity: 1;
    }
    #pagination button:before {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      border-radius: 100%;
      border: 1px solid rgba(255, 255, 255, 0.2);
      opacity: 0;
      transition: opacity 0.4s ease-in-out, width 0.4s ease-in-out, height 0.4s ease-in-out;
    }
  </style>
  
  <header>
    <div class="inner">
      <div class="logo"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/123024/wwf-logo.png" alt="Logo"></div>
      <div class="burger"></div>
      <nav>
        <a class="active" href="#">Species</a>
        <a href="#">About Us</a>
        <a href="#">Our Work</a>
        <a href="#">Get Involved</a>
      </nav>
      <a href="#" class="donate-link">Donate</a>
    </div>
  </header>

  <main>
    <div id="slider">
      <div class="slider-inner">
        <div id="slider-content">
          <div class="meta">Species</div>
          <h2 id="slide-title">Amur <br>Leopard</h2>
          <span data-slide-title="0">Amur <br>Leopard</span>
          <span data-slide-title="1">Asiatic <br>Lion</span>
          <span data-slide-title="2">Siberian <br>Tiger</span>
          <span data-slide-title="3">Brown <br>Bear</span>
          <div class="meta">Status</div>
          <div id="slide-status">Critically Endangered</div>
          <span data-slide-status="0">Critically Endangered</span>
          <span data-slide-status="1">Endangered</span>
          <span data-slide-status="2">Endangered</span>
          <span data-slide-status="3">Least Concern</span>
        </div>
      </div>

      <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/123024/leopard2.jpg" alt="Amur Leopard"/>
      <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/123024/lion2.jpg" alt="Asiatic Lion"/>
      <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/123024/tiger2.jpg" alt="Siberian Tiger"/>
      <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/123024/bear2.jpg" alt="Brown Bear"/>

      <div id="pagination">
        <button class="active" data-slide="0"></button>
        <button data-slide="1"></button>
        <button data-slide="2"></button>
        <button data-slide="3"></button>
      </div>
    </div>
  </main>
`;

class WebGLDistortionSlider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.isAnimating = false;
  }

  connectedCallback() {
    this.classList.add('loading');
    this._init();
  }
  
  _init() {
    this.sliderElement = this.shadowRoot.querySelector('#slider');
    const images = Array.from(this.sliderElement.querySelectorAll('img'));

    // Do NOT rely on hidden <img> sizes; use the container dimensions
    const renderW = this.sliderElement.clientWidth || this.sliderElement.offsetWidth || window.innerWidth;
    const renderH = this.sliderElement.clientHeight || this.sliderElement.offsetHeight || window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x23272A, 1.0);
    this.renderer.setSize(renderW, renderH);
    this.sliderElement.appendChild(this.renderer.domElement);

    // Use LoadingManager to know when all textures are ready
    const manager = new THREE.LoadingManager();
    manager.onLoad = () => {
      // textures finished loading
      this.classList.remove('loading');
    };
    manager.onError = () => {
      // in case of an error, remove loader to avoid blocking the UI
      this.classList.remove('loading');
    };
    // Fallback: ensure we don't get stuck in loading more than 8s
    setTimeout(() => this.classList.remove('loading'), 8000);

    const loader = new THREE.TextureLoader(manager);
    loader.crossOrigin = "anonymous";
    this.sliderImages = images.map(img => {
      const texture = loader.load(img.src + '?v=' + Date.now());
      texture.magFilter = texture.minFilter = THREE.LinearFilter;
      texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      return texture;
    });

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x23272A);
    
    this.camera = new THREE.OrthographicCamera(renderW / -2, renderW / 2, renderH / 2, renderH / -2, 1, 1000);
    this.camera.position.z = 1;

    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        dispFactor: { type: "f", value: 0.0 },
        currentImage: { type: "t", value: this.sliderImages[0] },
        nextImage: { type: "t", value: this.sliderImages[1] },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      opacity: 1.0,
    });
    
    // Use PlaneGeometry (Buffer variants are removed in newer three.js)
    this.geometry = new THREE.PlaneGeometry(renderW, renderH, 1, 1);
    this.plane = new THREE.Mesh(this.geometry, this.mat);
    this.plane.position.set(0, 0, 0);
    this.scene.add(this.plane);
    
    this._addEvents(renderW, renderH);
    
    this._animate();
  }

  _addEvents(renderW, renderH) {
    const pagButtons = this.shadowRoot.querySelectorAll('#pagination button');
    
    pagButtons.forEach(el => {
      el.addEventListener('click', () => {
        if (this.isAnimating) return;
        this.isAnimating = true;

        this.shadowRoot.querySelector('#pagination .active').classList.remove('active');
        el.classList.add('active');

        const slideId = parseInt(el.dataset.slide, 10);
        
        this.mat.uniforms.nextImage.value = this.sliderImages[slideId];
        this.mat.uniforms.nextImage.needsUpdate = true;

        gsap.to(this.mat.uniforms.dispFactor, {
          value: 1,
          duration: 1,
          ease: 'expo.inOut',
          onComplete: () => {
            this.mat.uniforms.currentImage.value = this.sliderImages[slideId];
            this.mat.uniforms.currentImage.needsUpdate = true;
            this.mat.uniforms.dispFactor.value = 0.0;
            this.isAnimating = false;
          }
        });

        const slideTitleEl = this.shadowRoot.querySelector('#slide-title');
        const slideStatusEl = this.shadowRoot.querySelector('#slide-status');
        const nextSlideTitle = this.shadowRoot.querySelector(`[data-slide-title="${slideId}"]`).innerHTML;
        const nextSlideStatus = this.shadowRoot.querySelector(`[data-slide-status="${slideId}"]`).innerHTML;

        gsap.fromTo(slideTitleEl, { autoAlpha: 1, y: 0 }, {
          autoAlpha: 0,
          y: 20,
          duration: 0.5,
          ease: 'expo.in',
          onComplete: () => {
            slideTitleEl.innerHTML = nextSlideTitle;
            gsap.to(slideTitleEl, { autoAlpha: 1, y: 0, duration: 0.5 });
          }
        });

        gsap.fromTo(slideStatusEl, { autoAlpha: 1, y: 0 }, {
          autoAlpha: 0,
          y: 20,
          duration: 0.5,
          ease: 'expo.in',
          onComplete: () => {
            slideStatusEl.innerHTML = nextSlideStatus;
            gsap.to(slideStatusEl, { autoAlpha: 1, y: 0, duration: 0.5, delay: 0.1 });
          }
        });
      });
    });
    
    window.addEventListener('resize', () => {
      const w = this.sliderElement.clientWidth || this.sliderElement.offsetWidth || window.innerWidth;
      const h = this.sliderElement.clientHeight || this.sliderElement.offsetHeight || window.innerHeight;
      this.renderer.setSize(w, h);
      // update camera
      this.camera.left = -w / 2;
      this.camera.right = w / 2;
      this.camera.top = h / 2;
      this.camera.bottom = -h / 2;
      this.camera.updateProjectionMatrix();
      // update plane geometry to fit container
      this.plane.geometry.dispose();
      this.plane.geometry = new THREE.PlaneGeometry(w, h, 1, 1);
    });
  }

  _animate() {
    requestAnimationFrame(this._animate.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

customElements.define('webgl-distortion-slider', WebGLDistortionSlider);