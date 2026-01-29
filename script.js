// Ano no rodapé
document.getElementById("year").textContent = new Date().getFullYear();

// Menu mobile
const toggle = document.querySelector(".nav__toggle");
const links = document.querySelector(".nav__links");
toggle?.addEventListener("click", () => links.classList.toggle("is-open"));
links?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => links.classList.remove("is-open")));

// Reveal on scroll (IntersectionObserver)
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("is-visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => obs.observe(el));

// Botão WhatsApp (troque número e mensagem)
const phone = "5500000000000"; // ex: 55 + DDD + número
const msg = encodeURIComponent("Olá! Quero um orçamento de comunicação visual. 👍");
const wa = `https://wa.me/${phone}?text=${msg}`;
document.getElementById("whatsBtn").href = wa;

// Background animado (particles simples no canvas)
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

let w, h, particles;
function resize(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  particles = Array.from({length: Math.min(90, Math.floor(w/14))}, () => ({
    x: Math.random()*w,
    y: Math.random()*h,
    r: 1 + Math.random()*2.2,
    vx: (-0.35 + Math.random()*0.7),
    vy: (-0.2 + Math.random()*0.4),
    a: 0.25 + Math.random()*0.45
  }));
}
window.addEventListener("resize", resize);
resize();

function tick(){
  ctx.clearRect(0,0,w,h);

  // pontos
  for(const p of particles){
    p.x += p.vx; p.y += p.vy;
    if(p.x < -20) p.x = w+20;
    if(p.x > w+20) p.x = -20;
    if(p.y < -20) p.y = h+20;
    if(p.y > h+20) p.y = -20;

    ctx.globalAlpha = p.a;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  }

  // linhas
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const a = particles[i], b = particles[j];
      const dx = a.x-b.x, dy = a.y-b.y;
      const d = Math.hypot(dx,dy);
      if(d < 120){
        ctx.globalAlpha = (1 - d/120) * 0.14;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x,a.y);
        ctx.lineTo(b.x,b.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(tick);
}
tick();











