// Dependencies: npm install gsap  // الخيار: استخدم CDN بدلاً من التثبيت المحلي إذا أردت خفة وسهولة تحديث
// Place the following @import in your global stylesheet (e.g., src/style.css) for normalize.css to work correctly: // خيار: يمكن الاستغناء عن normalize والاكتفاء بإعادة تعيين بسيطة
// @import url('https://unpkg.com/normalize.css');

import { gsap } from 'gsap'; // مكتبة التحريك الأساسية // خيار: Anime.js أو Motion One بدائل
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // ملحق للتمرير // خيار: ScrollTimeline CSS إن كان مدعومًا
import styles from './LayeredScrollGallery.css?inline'; // استيراد CSS كـ CSS Module

gsap.registerPlugin(ScrollTrigger); // تسجيل الملحق للعمل مع GSAP

const template = document.createElement('template'); // عنصر Template لتغليف الـ Shadow DOM
template.innerHTML = `

    <style>
          ${styles} 
    </style>

  <div class="content-wrap"> <!-- غلاف القسم ذو الخلفية الداكنة -->
    <header> <!-- رأس القسم: عنوان رئيسي + عنوان فرعي -->
      <h1 class="fluid">حلول صناعية متكاملة للأغذية</h1>
      <p class="subheadline">من التخطيط وحتى التشغيل، شريكك المتكامل لنجاح مصانع الأغذية بمعايير جودة عالمية.</p>
    </header>
    <main>
      <section> <!-- مشهد الجاليري المكدّس بالطبقات -->
        <div class="content"> <!-- يثبّت الشبكة أثناء التمرير -->
          <div class="grid"> <!-- الشبكة المكونة من 3 طبقات + صورة مركزية -->
            <div class="layer"> <!-- الطبقة الأولى: 6 بطاقات -->
              <div><img src="/public/photos/LayeredScrollGallery/Kaya/licensed-image (2).jpeg" alt="Gallery" /></div>
              <div><img src="/public/photos/LayeredScrollGallery/Kaya/licensed-image.jpeg" alt="Gallery" /></div>
              <div><img src="/photos/LayeredScrollGallery/Whisk_1f198bfff5c74d9a66c47306b2f78147dr.jpeg" alt="Gallery" /></div>
              <div><img src="/photos/LayeredScrollGallery/Whisk_4f255331ef2175eb7f1470c03de3a5b1dr.jpeg" alt="Gallery" /></div>
              <div><img src="/photos/LayeredScrollGallery/Whisk_5ff84aad3741e4b8a3c44fba9e7def41dr.jpeg" alt="Gallery" /></div>
              <div><img src="/photos/LayeredScrollGallery/Whisk_21a48c36ab0d870acfc4c2abaac9bc1adr.jpeg" alt="Gallery" /></div>
            </div>
            <div class="layer"> <!-- الطبقة الثانية: 6 بطاقات -->
              <div><img src="/public/photos/LayeredScrollGallery/Kaya/Whisk_ef02a30e32df01998ea4e2828eacac05dr.jpeg" alt="Gallery" /></div>
              <div><img src="/public/photos/LayeredScrollGallery/Kaya/1758922450.png" alt="Gallery" /></div>
              <div><img src="/public/photos/LayeredScrollGallery/Growth Roots/1758922232.png" alt="Gallery" /></div>
              <div><img src="/public/photos/LayeredScrollGallery/Growth Roots/1758922389.png" alt="Gallery" /></div>
              <div><img src="/photos/LayeredScrollGallery/Ricetto/Whisk_01a838a423a54e09821409a86a1d535bdr.jpeg" alt="Gallery" /></div>
              <div><img src="/photos/LayeredScrollGallery/Ricetto/Whisk_abd6e13f24f0788b34848f65ec42bbf9dr.jpeg" alt="Gallery" /></div>
            </div>
            <div class="layer"> <!-- الطبقة الثالثة: لوجوز -->
              <div><img src="/photos/LayeredScrollGallery/Kaya Logo.png" alt="Gallery" /></div>
              <div><img src="/photos/LayeredScrollGallery/Ricetto Logo.png" alt="Gallery" /></div>
            </div>
            <div class="scaler"> <!-- الصورة المركزية -->
              <img src="photos/LayeredScrollGallery/GR Design.png" alt="Hero" />
            </div>
          </div>
        </div>
      </section>
      <section class="gap-section"> <!-- سكشن فارغ للاحتفاظ بالمساحة/السكورلينج (اختياري) --></section>
    </main>
  </div>
`;

class LayeredScrollGallery extends HTMLElement { // مكوّن ويب مخصص لعرض جاليري بطبقات وانيميشن تمرير
  constructor() {
    super(); // استدعاء مُنشئ HTMLElement
    this.attachShadow({ mode: 'open' }); // إنشاء Shadow DOM // خيار: closed لمنع الوصول من الخارج
    this.shadowRoot.appendChild(template.content.cloneNode(true)); // إرفاق القالب بالمكوّن
  }

  connectedCallback() {
    this._applySettings(); // تطبيق إعدادات البيانات الافتراضية (data-attributes)
    
    const hasNativeScrollSupport = CSS.supports('(animation-timeline: view()) and (animation-range: 0 100%)');
    // خيار: إن كان المتصفح يدعم CSS Scroll-Driven Animations سيُستخدم CSS فقط
    if (!hasNativeScrollSupport) {
      console.info('Native scroll-driven animations not supported. Falling back to GSAP ScrollTrigger.');
      this._setupGsapAnimations(); // تفعيل مسارات GSAP البديلة
    }
  }
  
  disconnectedCallback() {
    if (this.gsapContext) { // تنظيف GSAP عند إزالة المكوّن
      this.gsapContext.revert();
    }
  }

  _applySettings() {
    // Hardcoded settings as requested // خيارات: يمكن ربطها بخصائص المكوّن أو Attributes
    this.dataset.enhanced = 'true'; // فعّل التحسينات البصرية
    this.dataset.center = 'true'; // تحريك الصورة المركزية
    this.dataset.layers = 'true'; // تحريك الطبقات
    this.dataset.stagger = 'range'; // أسلوب التدرّج في التوقيت
    this.dataset.stick = 'true'; // تثبيت المحتوى أثناء التمرير
    this.dataset.theme = 'dark'; // ثيم داكن (للاستخدام المستقبلي)
  }

  _setupGsapAnimations() {
    this.gsapContext = gsap.context(() => {
      // Center scaler animation // خيارات: تعديل المدد، منحنيات ease، ونطاقات ScrollTrigger
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

      // Layers animation with range-based stagger // خيار: تغيير start/end أو إضافة parallax بسيط
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
        .from(layer, { opacity: 0, ease: 'sine.out' }, 0) // خيار: استخدام ease أبطأ
        .from(layer, { scale: 0, ease: 'power1.inOut' }, 0); // خيار: scale: 0.7 كبداية أقل درامية
      });

    }, this.shadowRoot); // IMPORTANT: scope the context to the shadowRoot
  }
}

customElements.define('layered-scroll-gallery', LayeredScrollGallery);