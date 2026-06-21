(function(){
"use strict";
var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var GS = typeof window.gsap !== 'undefined';
if (GS) gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
var $ = function(id){ return document.getElementById(id); };

/* ============ HERO VIDEO ============ */
var heroVideo = $('heroVideo');
(function bootVideo(){
  if (!heroVideo) return;
  if (REDUCE){ heroVideo.remove(); return; }
  var portrait = window.matchMedia('(max-aspect-ratio: 9/10)').matches;
  var src = portrait ? 'https://d8j0ntlcm91z4.cloudfront.net/user_3ABnaz0TeLmqfEY2AkB4r4dev3h/hf_20260612_012635_5572dbbe-8e77-47d3-8a07-0586f011d6eb.mp4' : 'https://d8j0ntlcm91z4.cloudfront.net/user_3ABnaz0TeLmqfEY2AkB4r4dev3h/hf_20260612_015244_ab2d98a8-3854-48d3-847f-15682116415e.mp4';
  if (src.indexOf('http') !== 0){ heroVideo.remove(); return; } // not injected -> photo fallback
  heroVideo.src = src;
  heroVideo.addEventListener('loadeddata', function(){
    heroVideo.classList.add('live');                         // 1o frame visivel, congelado
    setTimeout(function(){ heroVideo.play().catch(function(){}); }, 2500); // solta em loop apos 2,5s
  }, { once: true });
  heroVideo.addEventListener('error', function(){ heroVideo.remove(); });
})();

/* ============ DUST PARTICLES ============ */
(function dust(){
  var c = $('dust');
  if (!c) return;
  if (REDUCE || window.matchMedia('(max-width: 640px)').matches){ c.remove(); return; }
  var ctx = c.getContext && c.getContext('2d');
  if (!ctx){ c.remove(); return; }
  var W, H, P = [], running = true;
  function size(){
    W = c.width = c.offsetWidth * devicePixelRatio;
    H = c.height = c.offsetHeight * devicePixelRatio;
  }
  size(); window.addEventListener('resize', size);
  for (var i = 0; i < 34; i++){
    P.push({x: Math.random(), y: Math.random(), r: .6 + Math.random()*1.7,
            vy: .00012 + Math.random()*.00028, sway: Math.random()*6.28,
            sa: .0035 + Math.random()*.006, a: .12 + Math.random()*.3});
  }
  function frame(){
    if (running){
      ctx.clearRect(0,0,W,H);
      for (var i = 0; i < P.length; i++){
        var p = P[i];
        p.y -= p.vy; p.sway += p.sa;
        if (p.y < -.02){ p.y = 1.02; p.x = Math.random(); }
        var tw = p.a * (.65 + .35*Math.sin(p.sway*2.3));
        ctx.beginPath();
        ctx.arc((p.x + Math.sin(p.sway)*.012)*W, p.y*H, p.r*devicePixelRatio, 0, 6.2832);
        ctx.fillStyle = 'rgba(186,214,240,' + tw + ')';
        ctx.fill();
      }
    }
    requestAnimationFrame(frame);
  }
  frame();
  if ('IntersectionObserver' in window){
    new IntersectionObserver(function(en){ running = en[0].isIntersecting; }).observe(c);
  }
})();

/* ============ NAV ============ */
var nav = $('nav');
var themedSections = Array.prototype.slice.call(document.querySelectorAll('[data-theme]'));
function navState(){
  nav.classList.toggle('scrolled', window.scrollY > 24);
  var probe = 40, theme = 'dark';
  for (var i = 0; i < themedSections.length; i++){
    var r = themedSections[i].getBoundingClientRect();
    if (r.top <= probe && r.bottom > probe){ theme = themedSections[i].getAttribute('data-theme'); break; }
  }
  nav.classList.toggle('on-light', theme === 'light');
}
window.addEventListener('scroll', navState, {passive: true});
navState();
var burger = $('burger'), navMobile = $('navMobile');
burger.addEventListener('click', function(){
  burger.setAttribute('aria-expanded', navMobile.classList.toggle('open'));
});
navMobile.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ navMobile.classList.remove('open'); }); });

/* ============ MARQUEE ============ */
var mt = $('marqueeTrack');
mt.innerHTML += mt.innerHTML;

/* ============ HERO CINEMATIC INTRO ============ */
var stage = $('stage'), stageTilt = $('stageTilt'), roomCard = $('roomCard');
var imgAfter = $('imgAfter'), catalogCard = $('catalogCard'), flySofa = $('flySofa');
var heroScan = $('heroScan'), heroScanLine = $('heroScanLine'), heroDone = $('heroDone');
var heroChip = $('heroChip'), ccActive = $('ccActive'), heroPhoto = $('heroPhoto');

var heroRevealed = false;
var heroSwapToken = 0;
function heroSelect(item){
  var items = Array.prototype.slice.call(catalogCard.querySelectorAll('.cc-item'));
  items.forEach(function(it){ it.classList.toggle('active', it === item); });
  if (!heroRevealed) return; /* the intro reveals the first selection with the scan; after that, plain swaps */
  var url = item.getAttribute('data-sim');
  if (!url || imgAfter.getAttribute('src') === url) return;
  var token = ++heroSwapToken;
  var apply = function(){
    if (token !== heroSwapToken) return;
    var show = function(){ if (token === heroSwapToken){
      if (GS && !REDUCE) gsap.to(imgAfter, {opacity: 1, duration: .4, ease: 'power2.out'});
      else imgAfter.style.opacity = 1;
    }};
    imgAfter.src = url;
    if (imgAfter.decode){ imgAfter.decode().then(show).catch(show); }
    else { setTimeout(show, 120); }
  };
  if (GS && !REDUCE) gsap.to(imgAfter, {opacity: 0, duration: .3, ease: 'power2.in', onComplete: apply});
  else { imgAfter.style.opacity = 0; setTimeout(apply, 60); }
}
Array.prototype.slice.call(document.querySelectorAll('#catalogCard .cc-item')).forEach(function(it){
  it.addEventListener('click', function(){ heroSelect(it); });
});

function showHeroFinal(){
  heroRevealed = true;
  document.querySelectorAll('.hw,.rv-hero').forEach(function(e){ e.style.opacity = 1; e.style.transform = 'none'; });
  stage.style.opacity = 1; stage.style.transform = 'none';
  catalogCard.style.opacity = 1; catalogCard.style.transform = 'none';
  imgAfter.style.opacity = 1;
  heroChip.style.opacity = 1;
  heroDone.style.opacity = 1; heroDone.style.transform = 'translate(-50%,0)';
}

if (!GS || REDUCE){
  showHeroFinal();
  document.querySelectorAll('.rv,.bub').forEach(function(e){ e.style.opacity = 1; e.style.transform = 'none'; });
} else {
  gsap.set('.hw', {yPercent: 112, opacity: 0});
  gsap.set('.rv-hero', {y: 24, opacity: 0});
  gsap.set(stage, {y: 100, opacity: 0});
  gsap.set(stageTilt, {rotationX: 16, transformPerspective: 1500, transformOrigin: '50% 100%'});
  gsap.set(catalogCard, {x: 46, opacity: 0});
  gsap.set(heroChip, {y: -10, opacity: 0});
  gsap.set(heroPhoto, {scale: 1.12});
  gsap.set(flySofa, {opacity: 0});
  gsap.set(heroScan, {opacity: 0});

  var tl = gsap.timeline({defaults: {ease: 'power3.out'}, delay: .15});
  tl.to(heroPhoto, {scale: 1, duration: 2.6, ease: 'power2.out'}, 0)
    .to('.hw', {yPercent: 0, opacity: 1, duration: 1.05, stagger: .09, ease: 'power4.out'}, .1)
    .to('.rv-hero', {y: 0, opacity: 1, duration: .9, stagger: .08}, .55)
    .to(stage, {y: 0, opacity: 1, duration: 1.2, ease: 'power4.out'}, .8)
    .to(stageTilt, {rotationX: 5, duration: 1.2}, .8)
    .to(heroChip, {y: 0, opacity: 1, duration: .6}, 1.5)
    .to(catalogCard, {x: 0, opacity: 1, duration: .9, ease: 'back.out(1.4)'}, 1.7);

  /* demo (scan -> voa sofa -> revela na chegada): dispara quando ~20% do room card aparece */
  var heroDemoRan = false;
  function runHeroDemo(){
    if (heroDemoRan) return; heroDemoRan = true;
    var dtl = gsap.timeline();
    /* 1) escaneia primeiro */
    dtl.to(heroScan, {opacity: 1, duration: .35})
       .fromTo(heroScanLine, {top: '6%'}, {top: '88%', duration: .85, ease: 'power1.inOut'})
       .to(heroScanLine, {top: '34%', duration: .6, ease: 'power1.inOut'})
       .to(heroScan, {opacity: 0, duration: .4})
    /* 2) animacao de selecao no catalogo */
       .to(ccActive, {scale: 1.04, duration: .28, yoyo: true, repeat: 1, ease: 'power2.inOut'}, '>-.05')
    /* 3) a foto com o sofa aparece */
       .to(imgAfter, {opacity: 1, duration: .9, ease: 'power2.inOut'}, '-=.05')
    /* 4) chip final */
       .fromTo(heroDone, {opacity: 0, y: 16}, {opacity: 1, y: 0, duration: .7, ease: 'back.out(1.7)',
          onStart: function(){ heroDone.style.transform = 'translate(-50%,0)'; },
          onUpdate: function(){ heroDone.style.transform = 'translate(-50%,' + gsap.getProperty(heroDone, 'y') + 'px)'; },
          onComplete: function(){ heroDone.style.transform = 'translate(-50%,0)'; heroRevealed = true; }
        }, '-=.3');
  }
  ScrollTrigger.create({ trigger: roomCard, start: '20% bottom', once: true, onEnter: runHeroDemo });

  /* (idle float removed: it fought the scroll parallax on the same axis and made the card jitter) */

  /* hero scroll parallax: one composited transform on the bg container, smoothed scrub */
  gsap.to('#heroBg', {scrollTrigger: {trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7}, yPercent: 7, scale: 1.07, ease: 'none', force3D: true});
  gsap.to('.hero-grid', {scrollTrigger: {trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5}, y: -70, ease: 'none', force3D: true});
  gsap.to(stageTilt, {scrollTrigger: {trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8}, y: -36, ease: 'none'});
  gsap.to(catalogCard, {scrollTrigger: {trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7}, y: -90, ease: 'none'});

  /* mouse parallax */
  if (window.matchMedia('(pointer:fine)').matches){
    var hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', function(e){
      var r = hero.getBoundingClientRect();
      var mx = (e.clientX - r.left)/r.width - .5, my = (e.clientY - r.top)/r.height - .5;
      gsap.to('#heroBg', {xPercent: mx*-1.2, duration: 1.2, ease: 'power2.out'});
      gsap.to(stageTilt, {rotationY: mx*3.4, duration: .9, ease: 'power2.out'});
    });
  }
}

/* ============ HOW IT WORKS: scroll-scrubbed transformation ============ */
var howStage = $('howStage'), howAfter = $('howAfter');
var steps = Array.prototype.slice.call(document.querySelectorAll('#steps .step'));
var hsChip1 = $('hsChip1'), hsFrame = $('hsFrame'), hsCat = $('hsCat'), hsScan = $('hsScan'), hsScanLine = $('hsScanLine'), hsWapp = $('hsWapp');
var hsMeasures = Array.prototype.slice.call(hsScan.querySelectorAll('.hs-measure'));
var howState = -1, howAutoTimer = null, mobileHow = false;

hsMeasures.forEach(function(m){ m.style.opacity = 0; m.style.transition = 'opacity .4s, transform .4s'; m.style.transform = 'scale(.85)'; });

function setHowState(n){
  if (n === howState) return;
  howState = n;
  steps.forEach(function(s, i){ s.classList.toggle('active', i === n); });
  hsChip1.classList.toggle('show', n <= 1);
  hsFrame.style.opacity = (n <= 1) ? 1 : 0;
  hsCat.classList.toggle('show', n === 1);
  hsScan.classList.toggle('show', n === 2);
  hsScan.classList.toggle('autoplay', n === 2);
  if (n === 2) hsScanLine.style.top = '';
  hsWapp.classList.toggle('show', n === 3);
  if (mobileHow){
    howAfter.style.transition = 'opacity 1s var(--ease)';
    howAfter.style.opacity = (n >= 3) ? 1 : 0;
    hsMeasures.forEach(function(m){ m.style.opacity = (n === 2) ? 1 : 0; m.style.transform = (n === 2) ? 'scale(1)' : 'scale(.85)'; });
  }
}
setHowState(0);

steps.forEach(function(s){
  s.addEventListener('click', function(){
    if (howAutoTimer){ clearInterval(howAutoTimer); howAutoTimer = null; }
    mobileHow = true;
    setHowState(parseInt(s.getAttribute('data-step'), 10));
  });
});

function clamp01(v){ return Math.max(0, Math.min(1, v)); }

if (GS && !REDUCE){
  gsap.matchMedia().add('(min-width: 1021px)', function(){
    mobileHow = false;
    var st = ScrollTrigger.create({
      trigger: '#howPin',
      start: 'center center',
      end: '+=2300',
      pin: true,
      anticipatePin: 1,
      scrub: true,
      onUpdate: function(self){
        var p = self.progress;
        setHowState(Math.max(0, Math.min(3, Math.floor(p * 4))));
        /* scan line rides the scroll inside step 3 */
        var sp = clamp01((p - .5) / .22);
        /* the scan line sweeps on its own (CSS animation); chips pop with the scroll */
        hsMeasures.forEach(function(m, i){
          var on = sp > .25 + i * .2;
          m.style.opacity = on ? 1 : 0;
          m.style.transform = on ? 'scale(1)' : 'scale(.85)';
        });
        /* the transformation itself is scrubbed by the wheel */
        howAfter.style.transition = 'none';
        howAfter.style.opacity = clamp01((p - .72) / .14);
      }
    });
    return function(){ st.kill(); };
  });
  gsap.matchMedia().add('(max-width: 1020px)', function(){
    mobileHow = true;
    var st = ScrollTrigger.create({
      trigger: '#howStage', start: 'top 75%', once: true,
      onEnter: function(){
        var n = 0;
        howAutoTimer = setInterval(function(){
          n++;
          if (n > 3){ clearInterval(howAutoTimer); howAutoTimer = null; return; }
          setHowState(n);
        }, 2300);
      }
    });
    return function(){ st.kill(); if (howAutoTimer){ clearInterval(howAutoTimer); howAutoTimer = null; } };
  });
} else {
  mobileHow = true;
}

/* ============ BEFORE / AFTER ============ */
var baFrame = $('baFrame'), baAfter = $('baAfter'), baHandle = $('baHandle'), baRange = $('baRange');
var baBefore = $('baBefore'), baAfterImg = $('baAfterImg');
var baLblBefore = $('baLblBefore'), baLblAfter = $('baLblAfter'), baCaption = $('baCaption');
var baSeg = $('baSeg'), baSegDesc = $('baSegDesc');
function setBA(v){
  v = Math.max(4, Math.min(96, v));
  baAfter.style.clipPath = 'inset(0 0 0 ' + v + '%)';
  baHandle.style.left = v + '%';
  baRange.value = v;
}
setBA(50);
function baFromEvent(e){
  var r = baFrame.getBoundingClientRect();
  setBA(((e.touches ? e.touches[0].clientX : e.clientX) - r.left) / r.width * 100);
}
var baDrag = false;
baFrame.addEventListener('pointerdown', function(e){
  if (e.target === baRange) return;
  baDrag = true; baFrame.setPointerCapture(e.pointerId); baFromEvent(e);
});
baFrame.addEventListener('pointermove', function(e){ if (baDrag) baFromEvent(e); });
baFrame.addEventListener('pointerup', function(){ baDrag = false; });
baFrame.addEventListener('pointercancel', function(){ baDrag = false; });
baRange.addEventListener('input', function(){ setBA(parseFloat(baRange.value)); });

/* auto-sweep: demonstra sozinho a comparacao (didatico) */
function baSweep(){
  if (!(GS && !REDUCE)) return;
  var o = {v: 50}; setBA(50);
  gsap.timeline({delay: .25})
    .to(o, {v: 78, duration: 1.1, ease: 'power2.inOut', onUpdate: function(){ if (!baDrag) setBA(o.v); }})
    .to(o, {v: 34, duration: 1.2, ease: 'power2.inOut', onUpdate: function(){ if (!baDrag) setBA(o.v); }}, '+=.25')
    .to(o, {v: 56, duration: .9, ease: 'power2.out', onUpdate: function(){ if (!baDrag) setBA(o.v); }}, '+=.1');
}

/* dois modos: preencher sala vazia x substituir um movel existente */
var BA_MODES = {
  vazio: {
    before: 'https://d8j0ntlcm91z4.cloudfront.net/user_3ABnaz0TeLmqfEY2AkB4r4dev3h/hf_20260611_194657_8d243167-b030-4d99-8aad-8e2220435b21.png',
    after: 'https://d8j0ntlcm91z4.cloudfront.net/user_3ABnaz0TeLmqfEY2AkB4r4dev3h/hf_20260612_010754_10a88c18-3d37-4320-a610-eb775ec6a5ef.png',
    lblBefore: 'Antes · Foto do cliente',
    lblAfter: 'Depois · Simulação Mobil.IA',
    caption: '// sofá class 3 lugares · azul royal · com composição de ambiente na foto original do cliente',
    desc: 'Preencha um ambiente vazio com produtos do catálogo.'
  },
  troca: {
    before: 'assets/antes_troca.png',
    after: 'assets/depois_troca.png',
    lblBefore: 'Antes · Sofá atual do cliente',
    lblAfter: 'Depois · Novo sofá da Mobil.IA',
    caption: '// troca de cena · trocamos o sofá de couro por um modelo em bouclê, no mesmo ambiente',
    desc: 'Troque um móvel que o cliente já tem por outro completamente diferente.'
  }
};
var baModeBtns = Array.prototype.slice.call(document.querySelectorAll('.ba-seg-btn'));
var baMode = 'vazio';
function setBAMode(key, animate){
  if (!BA_MODES[key] || (key === baMode && animate)) return;
  baMode = key;
  var m = BA_MODES[key];
  if (baSeg) baSeg.setAttribute('data-mode', key);
  baModeBtns.forEach(function(b){
    var on = b.getAttribute('data-mode') === key;
    b.classList.toggle('on', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  if (baSegDesc) baSegDesc.textContent = m.desc;
  var apply = function(){
    baBefore.src = m.before; baAfterImg.src = m.after;
    baLblBefore.textContent = m.lblBefore;
    baLblAfter.textContent = m.lblAfter;
    baCaption.textContent = m.caption;
  };
  if (GS && !REDUCE && animate){
    gsap.to(baFrame, {opacity: 0, scale: .985, duration: .3, ease: 'power2.in', onComplete: function(){
      apply();
      var dec = function(im){ return im.decode ? im.decode().catch(function(){}) : Promise.resolve(); };
      Promise.all([dec(baBefore), dec(baAfterImg)]).then(function(){
        gsap.to(baFrame, {opacity: 1, scale: 1, duration: .4, ease: 'power2.out'});
        baSweep();
      });
    }});
  } else {
    apply();
  }
}
baModeBtns.forEach(function(b){
  b.addEventListener('click', function(){ setBAMode(b.getAttribute('data-mode'), true); });
});

if (GS && !REDUCE){
  ScrollTrigger.create({ trigger: baFrame, start: 'top 70%', once: true, onEnter: baSweep });
}

/* ============ INNER PHOTO PARALLAX (depth on scroll) ============ */
if (GS && !REDUCE){
  gsap.utils.toArray('.mode-visual .ph').forEach(function(img){
    gsap.fromTo(img, {yPercent: -4}, {yPercent: 4, ease: 'none',
      scrollTrigger: {trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true}});
  });
  gsap.utils.toArray('.own-bg img, .final-bg img').forEach(function(img){
    gsap.fromTo(img, {yPercent: -5}, {yPercent: 5, ease: 'none',
      scrollTrigger: {trigger: img.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true}});
  });
}

/* ============ CATALOG APP ============ */
var typedEl = $('typed');
var TYPE_STRINGS = ['sofá 3 lugares azul', 'poltrona giratória', 'mesa de centro madeira', 'rack até 1,80 m'];
if (REDUCE){
  typedEl.textContent = TYPE_STRINGS[0];
} else {
  (function typeLoop(){
    var si = 0, ci = 0, del = false;
    function tick(){
      var s = TYPE_STRINGS[si];
      if (!del){
        ci++; typedEl.textContent = s.slice(0, ci);
        if (ci === s.length){ del = true; return setTimeout(tick, 1700); }
        return setTimeout(tick, 55 + Math.random()*70);
      }
      ci--; typedEl.textContent = s.slice(0, ci);
      if (ci === 0){ del = false; si = (si+1) % TYPE_STRINGS.length; return setTimeout(tick, 450); }
      return setTimeout(tick, 28);
    }
    setTimeout(tick, 1200);
  })();
}

var fchips = Array.prototype.slice.call(document.querySelectorAll('.fchip'));
var prows = Array.prototype.slice.call(document.querySelectorAll('#catProducts .prow'));
var selCount = $('selCount'), selTotal = $('selTotal'), catHint = $('catHint');
var csEmpty = $('csEmpty'), csResultImg = $('csResultImg');
var SIM_MAP = {"sofa": "https://d8j0ntlcm91z4.cloudfront.net/user_3ABnaz0TeLmqfEY2AkB4r4dev3h/hf_20260612_194330_af293fcb-954b-45e7-a54b-dcc5a29c1b47.png", "poltrona": "https://d8j0ntlcm91z4.cloudfront.net/user_3ABnaz0TeLmqfEY2AkB4r4dev3h/hf_20260612_194339_9122c3a8-083e-4486-be28-3d333e755e24.png", "mesa": "https://d8j0ntlcm91z4.cloudfront.net/user_3ABnaz0TeLmqfEY2AkB4r4dev3h/hf_20260612_194347_69334335-1d95-43c0-84ab-609596a3eae2.png", "rack": "https://d8j0ntlcm91z4.cloudfront.net/user_3ABnaz0TeLmqfEY2AkB4r4dev3h/hf_20260612_194359_9c2b000b-6794-467d-87d4-e85729b3a64c.png", "poltrona+sofa": "https://d8j0ntlcm91z4.cloudfront.net/user_3ABnaz0TeLmqfEY2AkB4r4dev3h/hf_20260612_194407_e8c14417-1fcb-4ac8-9f91-007ba72e3546.png", "mesa+sofa": "https://d8j0ntlcm91z4.cloudfront.net/user_3ABnaz0TeLmqfEY2AkB4r4dev3h/hf_20260612_194416_b5d17fd0-eeac-45b1-9cf5-e87acb4251d9.jpeg", "rack+sofa": "https://d8j0ntlcm91z4.cloudfront.net/user_3ABnaz0TeLmqfEY2AkB4r4dev3h/hf_20260612_194426_738321f8-bc14-42b8-af63-2c119800dfe3.png", "mesa+poltrona": "https://d8j0ntlcm91z4.cloudfront.net/user_3ABnaz0TeLmqfEY2AkB4r4dev3h/hf_20260612_194435_06fd6743-ca09-4b08-9fdb-ab38f3ea0794.png", "poltrona+rack": "https://d8j0ntlcm91z4.cloudfront.net/user_3ABnaz0TeLmqfEY2AkB4r4dev3h/hf_20260612_194445_1cce72d9-8e92-4ac6-8fd7-8f3369254c6b.png", "mesa+rack": "assets/hf_20260614_201043_30b435ad-a278-4f3e-8ea4-9c8297e3a0b1.png", "mesa+poltrona+sofa": "https://d8j0ntlcm91z4.cloudfront.net/user_3ABnaz0TeLmqfEY2AkB4r4dev3h/hf_20260612_194504_0312930d-2892-4241-bf05-6d56e939e0d1.png", "poltrona+rack+sofa": "https://d8j0ntlcm91z4.cloudfront.net/user_3ABnaz0TeLmqfEY2AkB4r4dev3h/hf_20260612_194511_02cf66b3-d5c3-488b-8688-69c346e22854.png", "mesa+rack+sofa": "https://d8j0ntlcm91z4.cloudfront.net/user_3ABnaz0TeLmqfEY2AkB4r4dev3h/hf_20260612_194520_e8e6e832-9f14-4cbd-be1d-3fd18d9a3a90.jpeg", "mesa+poltrona+rack": "https://d8j0ntlcm91z4.cloudfront.net/user_3ABnaz0TeLmqfEY2AkB4r4dev3h/hf_20260612_194528_f0eede06-50a7-4f40-b185-77703a0b662a.png", "mesa+poltrona+rack+sofa": "https://d8j0ntlcm91z4.cloudfront.net/user_3ABnaz0TeLmqfEY2AkB4r4dev3h/hf_20260612_194159_3bdeafb8-3ab9-48ae-bff1-dc9de60b89d1.png"};
var csScan = $('csScan'), csScanLine = $('csScanLine');
var csStatus = $('csStatus'), csSub = $('csSub'), csWhats = $('csWhats');
var catGo = $('catGo'), catGoHTML = catGo.innerHTML, catBusy = false, lastResult = null;

fchips.forEach(function(ch){
  ch.addEventListener('click', function(){
    fchips.forEach(function(c){ c.classList.toggle('on', c === ch); });
    var f = ch.getAttribute('data-f');
    prows.forEach(function(p, i){
      var show = (f === 'all' || p.getAttribute('data-cat') === f);
      if (show && p.style.display === 'none' && GS && !REDUCE){
        p.style.display = '';
        gsap.fromTo(p, {opacity: 0, x: -10}, {opacity: 1, x: 0, duration: .35, delay: i * .04, ease: 'power2.out'});
      } else {
        p.style.display = show ? '' : 'none';
      }
    });
  });
});

function fmtBRL(n){ return 'R$ ' + n.toLocaleString('pt-BR'); }
function selection(){ return prows.filter(function(p){ return p.classList.contains('sel'); }); }

function updateSelSummary(){
  var sel = selection();
  selCount.textContent = sel.length;
  selCount.parentNode.childNodes.forEach(function(nd){
    if (nd.nodeType === 3) nd.textContent = sel.length === 1 ? ' produto selecionado' : ' produtos selecionados';
  });
  var total = sel.reduce(function(a, p){ return a + parseInt(p.getAttribute('data-price'), 10); }, 0);
  selTotal.textContent = fmtBRL(total);
  if (lastResult && !catBusy){
    csStatus.textContent = 'Seleção alterada';
    csSub.textContent = 'clique em Gerar simulação para atualizar o ambiente';
  }
}

prows.forEach(function(p){
  p.addEventListener('click', function(){
    p.classList.toggle('sel');
    updateSelSummary();
    if (GS && !REDUCE) gsap.fromTo(p, {scale: .98}, {scale: 1, duration: .35, ease: 'back.out(2.5)'});
  });
});
updateSelSummary();

function setStageResult(url){ /* null | image url */
  lastResult = url;
  if (!url){ csResultImg.style.opacity = 0; return; }
  var show = function(){ if (lastResult === url) csResultImg.style.opacity = 1; };
  if (csResultImg.getAttribute('src') === url){ show(); return; }
  /* the image is invisible here (faded out at click), so the swap can't flash */
  csResultImg.src = url;
  if (csResultImg.decode){ csResultImg.decode().then(show).catch(show); }
  else if (csResultImg.complete){ show(); }
  else { csResultImg.onload = show; setTimeout(show, 250); }
}

function runSimulation(){
  if (catBusy) return;
  var sel = selection();
  if (!sel.length){
    catHint.textContent = 'Selecione ao menos um produto para gerar';
    catHint.classList.add('warn');
    if (GS && !REDUCE) gsap.fromTo(catGo, {x: 0}, {x: 7, duration: .07, repeat: 5, yoyo: true, ease: 'power1.inOut', clearProps: 'x'});
    setTimeout(function(){ catHint.classList.remove('warn'); catHint.textContent = 'A simulação aparece no ambiente ao lado'; }, 2600);
    return;
  }
  catBusy = true;
  csWhats.classList.remove('show');
  var key = sel.map(function(p){ return p.getAttribute('data-cat'); }).sort().join('+');
  var target = SIM_MAP[key];
  var names = sel.map(function(p){ return p.querySelector('.prow-name').textContent; });
  /* warm the cache during the scan without touching the visible element */
  if (target){ var pre = new Image(); pre.src = target; }

  catGo.setAttribute('data-state', 'busy');
  catGo.innerHTML = 'Gerando simulação<span class="dots"></span>';
  csStatus.textContent = 'Analisando o ambiente';
  csSub.textContent = 'perspectiva, escala e luz da foto';
  setStageResult(null);

  var finish = function(){
    setStageResult(target);
    csStatus.textContent = 'Simulação pronta em 4,2 s';
    csSub.textContent = names.join(' + ') + ' · ' + selTotal.textContent;
    csWhats.classList.add('show');
    if (GS && !REDUCE) gsap.fromTo(csWhats, {scale: .8, opacity: 0}, {scale: 1, opacity: 1, duration: .5, ease: 'back.out(2)'});
    catGo.setAttribute('data-state', 'done');
    catGo.innerHTML = 'Simulação pronta ✓';
    setTimeout(function(){
      catGo.removeAttribute('data-state');
      catGo.innerHTML = catGoHTML;
      catBusy = false;
    }, 1600);
  };

  if (GS && !REDUCE){
    var stl = gsap.timeline();
    stl.to(csScan, {opacity: 1, duration: .3})
       .fromTo(csScanLine, {top: '6%'}, {top: '88%', duration: .8, ease: 'power1.inOut'})
       .to(csScanLine, {top: '30%', duration: .6, ease: 'power1.inOut'})
       .to(csScan, {opacity: 0, duration: .4, onComplete: finish});
  } else {
    csScan.style.opacity = 1;
    setTimeout(function(){ csScan.style.opacity = 0; finish(); }, 1200);
  }
}
catGo.addEventListener('click', runSimulation);

csWhats.addEventListener('click', function(){
  csStatus.textContent = 'Enviado para Ana ✓';
  csSub.textContent = 'a simulação entrou na conversa do WhatsApp';
  if (GS && !REDUCE) gsap.fromTo('#csResult', {scale: .985}, {scale: 1, duration: .4, ease: 'back.out(2)'});
});

/* ============ WORKFLOW TIMELINE ============ */
(function flowTimeline(){
  var wrap = $('flowSteps'); if (!wrap) return;
  var fsteps = Array.prototype.slice.call(wrap.querySelectorAll('.fstep'));
  var beam = $('flowBeam'), clock = $('flowClock');
  var DUR = [10, 20, 5, 5];
  var vertical = window.matchMedia('(max-width: 900px)').matches;
  window.matchMedia('(max-width: 900px)').addEventListener('change', function(e){ vertical = e.matches; setFlow(active, true); });
  var active = 0, timer = null, started = false;

  function fmt(s){ var m = Math.floor(s/60), r = Math.round(s%60); return (m<10?'0':'')+m+':'+(r<10?'0':'')+r; }

  function setFlow(n, silent){
    active = n;
    fsteps.forEach(function(s, i){ s.classList.toggle('on', i === n); s.classList.toggle('done', i < n); });
    var pct = fsteps.length > 1 ? (n / (fsteps.length - 1)) * 100 : 100;
    if (vertical){ beam.style.height = pct + '%'; beam.style.width = '100%'; }
    else { beam.style.width = pct + '%'; beam.style.height = '100%'; }
    var elapsed = 0; for (var k = 0; k <= n; k++) elapsed += DUR[k];
    if (!silent && clock && GS && !REDUCE){
      var obj = {v: elapsed - DUR[n]};
      gsap.to(obj, {v: elapsed, duration: .8, ease: 'power1.out', onUpdate: function(){ clock.textContent = fmt(obj.v); }});
    } else if (clock){ clock.textContent = fmt(elapsed); }
  }

  function advance(){
    timer = setTimeout(function step(){
      active = (active + 1) % fsteps.length;
      setFlow(active);
      timer = setTimeout(step, active === 0 ? 2600 : 2100);
    }, 2100);
  }
  function stopAuto(){ if (timer){ clearTimeout(timer); timer = null; } }

  fsteps.forEach(function(s){
    s.addEventListener('click', function(){ stopAuto(); setFlow(parseInt(s.getAttribute('data-i'), 10)); });
  });

  setFlow(0, true);
  if (GS && !REDUCE){
    ScrollTrigger.create({trigger: '.flow-rail', start: 'top 72%', once: true,
      onEnter: function(){ if (!started){ started = true; setFlow(0); advance(); } }});
  } else {
    fsteps.forEach(function(s){ s.classList.add('done'); s.classList.remove('on'); });
    if (clock) clock.textContent = '00:40';
  }
})();

/* ============ WHATSAPP PHONE ============ */
var bubs = Array.prototype.slice.call(document.querySelectorAll('#phChat .bub'));
if (GS && !REDUCE){
  ScrollTrigger.create({
    trigger: '#phone', start: 'top 72%', once: true,
    onEnter: function(){ gsap.to(bubs, {opacity: 1, y: 0, duration: .6, ease: 'power3.out', stagger: .55}); }
  });
  gsap.fromTo('#phone', {rotationY: -12, rotationX: 3}, {rotationY: 7, rotationX: -2, ease: 'none', transformPerspective: 1300,
    scrollTrigger: {trigger: '.phone-wrap', start: 'top bottom', end: 'bottom top', scrub: .6}});
} else {
  bubs.forEach(function(b){ b.style.opacity = 1; b.style.transform = 'none'; });
}

/* ============ GENERIC REVEALS ============ */
if (GS && !REDUCE){
  gsap.utils.toArray('.rv').forEach(function(el){
    gsap.to(el, {scrollTrigger: {trigger: el, start: 'top 88%', once: true},
      opacity: 1, y: 0, duration: .9, ease: 'power3.out'});
  });
  window.addEventListener('load', function(){ ScrollTrigger.refresh(); });
}

})();