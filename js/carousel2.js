document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("carousel2");
  if (!root) return;

  const track = root.querySelector(".carousel2__track");
  const slides = Array.from(root.querySelectorAll(".carousel2__slide"));
  const viewport = root.querySelector(".carousel2__viewport");
  const dotsWrap = root.querySelector(".carousel2__dots");

  let index = 0;
  let timer = null;
  const interval = 4500;

  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "carousel2__dot" + (i === 0 ? " is-active" : "");
    b.setAttribute("aria-label", `Ir para slide ${i + 1}`);
    b.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(b);
    return b;
  });

  function update(){
  // marca o slide atual como "saindo"
  slides.forEach((s,i)=>{
    if (i === index) return;
    s.classList.remove("is-active");
    s.classList.remove("is-leaving");
  });

  // aplica saída no slide anterior (se existir)
  const prev = root.querySelector(".carousel2__slide.is-active");
  if (prev) {
    prev.classList.add("is-leaving");
    // remove a classe depois da animação
    setTimeout(() => prev.classList.remove("is-leaving"), 550);
  }

  // move o track
  track.style.transform = `translateX(-${index * 100}%)`;

  // ativa o slide atual (entrada)
  slides[index].classList.add("is-active");

  // dots
  dots.forEach((d,i)=> d.classList.toggle("is-active", i === index));
}


  function goTo(i, userAction = false){
    index = (i + slides.length) % slides.length;
    update();
    if (userAction) restart();
  }

  function next(){ goTo(index + 1); }

  function start(){
    stop();
    timer = setInterval(next, interval);
  }

  function stop(){
    if (timer) clearInterval(timer);
    timer = null;
  }

  function restart(){
    stop();
    start();
  }

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);

  let startX = 0, currentX = 0, dragging = false;

  viewport.addEventListener("touchstart", (e) => {
    dragging = true;
    startX = e.touches[0].clientX;
    currentX = startX;
    stop();
  }, { passive: true });

  viewport.addEventListener("touchmove", (e) => {
    if (!dragging) return;
    currentX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener("touchend", () => {
    if (!dragging) return;
    dragging = false;

    const dx = currentX - startX;
    const threshold = 40;

    if (dx > threshold) goTo(index - 1, true);
    else if (dx < -threshold) goTo(index + 1, true);

    start();
  });

  update();
  start();
});
