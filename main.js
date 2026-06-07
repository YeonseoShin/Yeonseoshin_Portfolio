// ── 오버레이 & 네비 전환 ─────────────────────────────────────────
const overlay = document.getElementById('overlay');
const nav     = document.getElementById('nav');
const heroEl  = document.getElementById('hero');

function onScroll() {
  const heroH = heroEl.offsetHeight;
  const y = window.scrollY;
  const fadeS = heroH * .75, fadeE = heroH;
  overlay.style.opacity = (y >= fadeS && y <= fadeE)
    ? (Math.sin((y - fadeS) / (fadeE - fadeS) * Math.PI) * .45).toString()
    : '0';
  if (y > heroH * .7) { nav.classList.replace('dark-nav','light-nav'); }
  else                  { nav.classList.replace('light-nav','dark-nav'); }
  // nav active
  let cur = '';
  ['hero','about','activity','projects'].forEach(id => {
    const el = document.getElementById(id);
    if (el && y >= el.offsetTop - 160) cur = id;
  });
  document.querySelectorAll('.nav-links a').forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
}
window.addEventListener('scroll', onScroll, { passive: true });
setTimeout(() => { overlay.style.transition = 'opacity .3s ease'; onScroll(); }, 60);

// ── Reveal ───────────────────────────────────────────────────────
const obs = new IntersectionObserver(
  es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: .07, rootMargin: '0px 0px -30px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
const actObs = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const i = [...document.querySelectorAll('.activity-item')].indexOf(e.target);
  e.target.style.transitionDelay = `${i * .06}s`;
  e.target.classList.add('visible');
}), { threshold: .05 });
document.querySelectorAll('.activity-item').forEach(el => actObs.observe(el));

// ── 패널 토글 ────────────────────────────────────────────────────
function togglePanel(id, btn) {
  const panel = document.getElementById(id);
  if (!panel) return;
  const isOpen = panel.classList.contains('open');
  document.querySelectorAll('.panel.open').forEach(p => p.classList.remove('open'));
  document.querySelectorAll('.abtn-preview.open').forEach(b => {
    b.classList.remove('open'); b.textContent = b.textContent.replace('▼','▶');
  });
  if (!isOpen) {
    panel.classList.add('open');
    if (btn) { btn.classList.add('open'); btn.textContent = btn.textContent.replace('▶','▼'); }
    setTimeout(() => panel.scrollIntoView({ behavior:'smooth', block:'nearest' }), 60);
  }
}

// ── Three.js 히어로 파티클 ───────────────────────────────────────
(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, .1, 1000);
  camera.position.z = 3;
  const N = 2000;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N*3), col = new Float32Array(N*3);
  for (let i=0; i<N; i++) {
    pos[i*3]=(Math.random()-.5)*16; pos[i*3+1]=(Math.random()-.5)*11; pos[i*3+2]=(Math.random()-.5)*6;
    const t=Math.random();
    if(t<.45){col[i*3]=.38;col[i*3+1]=.4;col[i*3+2]=.98;}
    else if(t<.7){col[i*3]=.05;col[i*3+1]=.58;col[i*3+2]=.72;}
    else{col[i*3]=.22;col[i*3+1]=.22;col[i*3+2]=.42;}
  }
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({size:.025,vertexColors:true,transparent:true,opacity:.8}));
  scene.add(pts);
  const lp=[];let lc=0;
  for(let i=0;i<N&&lc<450;i++)for(let j=i+1;j<N&&lc<450;j++){
    const dx=pos[i*3]-pos[j*3],dy=pos[i*3+1]-pos[j*3+1],dz=pos[i*3+2]-pos[j*3+2];
    if(Math.sqrt(dx*dx+dy*dy+dz*dz)<1.9){lp.push(pos[i*3],pos[i*3+1],pos[i*3+2],pos[j*3],pos[j*3+1],pos[j*3+2]);lc++;}
  }
  const lg=new THREE.BufferGeometry();
  lg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(lp),3));
  scene.add(new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:0x4f46e5,transparent:true,opacity:.07})));
  let mx=0,my=0,frame=0;
  window.addEventListener('mousemove',e=>{mx=(e.clientX/window.innerWidth-.5)*.35;my=-(e.clientY/window.innerHeight-.5)*.25;});
  (function animate(){requestAnimationFrame(animate);frame++;pts.rotation.y=frame*.00025+mx*.5;pts.rotation.x=frame*.0001+my*.3;renderer.render(scene,camera);})();
  window.addEventListener('resize',()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);});
})();
