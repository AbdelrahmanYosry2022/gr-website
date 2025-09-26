// Dependencies: npm install three gsap imagesloaded
// Place the following @import in your global stylesheet (e.g., src/style.css) for the fonts to work correctly:
// @import url("https://use.typekit.net/euz1eqv.css");

import * as THREE from 'three';
import { gsap } from 'gsap';
import styles from './WebGLDistortionSlider.css?inline'; // استيراد CSS كـ CSS Module

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

  ${styles}

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
      <div class="slider-overlay"></div>
      <div class="slider-inner">
        <div id="slider-content">
          <h2 id="slide-title">شريكك الصناعي المتكامل</h2>
          <span data-slide-title="0">شريكك الصناعي المتكامل</span>
          <span data-slide-title="1">توريد المعدات وخطوط الإنتاج</span>
          <span data-slide-title="2">تشغيل وتدريب الفرق</span>
          <span data-slide-title="3">تطوير المنتجات والمواد الخام</span>
          <div id="slide-status" class="subtitle">من دراسة الجدوى حتى التشغيل وتحقيق الربحية.</div>
          <span data-slide-status="0">من دراسة الجدوى حتى التشغيل وتحقيق الربحية.</span>
          <span data-slide-status="1">حلول Kaya Steel لمصانع بمعايير عالمية.</span>
          <span data-slide-status="2">نرفع الكفاءة ونبني فرق قوية لتحقيق الجودة.</span>
          <span data-slide-status="3">Ricatto لتطوير النكهات وتوريد الخامات.</span>
          <button id="slide-cta" class="cta">اطلب استشارة</button>
          <span data-slide-cta="0">اطلب استشارة</span>
          <span data-slide-cta="1">اكتشف الحلول</span>
          <span data-slide-cta="2">ابدأ الآن</span>
          <span data-slide-cta="3">تواصل معنا</span>
        </div>
      </div>

      <img src="/photos/WebGLDistortionSlider/licensed-image.jpeg" alt="صورة 1"/>
      <img src="/photos/WebGLDistortionSlider/licensed-image (1).jpeg" alt="صورة 2"/>
      <img src="/photos/WebGLDistortionSlider/licensed-image (2).jpeg" alt="صورة 3"/>
      <img src="/photos/WebGLDistortionSlider/unnamed (1).png" alt="صورة 4"/>

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
        const slideCtaEl = this.shadowRoot.querySelector('#slide-cta');
        const nextSlideTitle = this.shadowRoot.querySelector(`[data-slide-title="${slideId}"]`).innerHTML;
        const nextSlideStatus = this.shadowRoot.querySelector(`[data-slide-status="${slideId}"]`).innerHTML;
        const nextSlideCta = this.shadowRoot.querySelector(`[data-slide-cta="${slideId}"]`).innerHTML;

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

        gsap.fromTo(slideCtaEl, { autoAlpha: 1, y: 0 }, {
          autoAlpha: 0,
          y: 20,
          duration: 0.4,
          ease: 'expo.in',
          onComplete: () => {
            slideCtaEl.textContent = nextSlideCta;
            gsap.to(slideCtaEl, { autoAlpha: 1, y: 0, duration: 0.4, delay: 0.05 });
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