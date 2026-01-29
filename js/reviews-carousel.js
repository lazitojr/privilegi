document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("reviewsCarousel");
  if (!root) return;

  const viewport = root.querySelector(".reviews-viewport");
  const track = root.querySelector(".reviews-track");
  const prevBtn = document.querySelector(".reviews-btn.prev");
  const nextBtn = document.querySelector(".reviews-btn.next");

  const interval = 3200;
  let timer = null;
  let isAnimating = false;

  function visibleCount(){
    const w = window.innerWidth;
    if (w <= 520) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  function cardStep(){
    const first = track.querySelector(".review-card");
    if (!first) return 0;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "0");
    return first.getBoundingClientRect().width + gap;
  }

  // Loop infinito "real": clona os primeiros N e joga pro final
  function primeLoop(){
    const n = visibleCount();
    const cards = Array.from(track.children);
    for (let i = 0; i < Math.min(n, cards.length); i++){
      track.appendChild(cards[i].cloneNode(true));
    }
  }

  primeLoop();

  function slideNext(){
    if (isAnimating) return;
    isAnimating = true;

    const step = cardStep();
    track.style.transition = "transform .55s cubic-bezier(.22,.61,.36,1)";
    track.style.transform = `translateX(-${step}px)`;

    track.addEventListener("transitionend", function onEnd(){
      track.removeEventListener("transitionend", onEnd);

      // move o primeiro card pro final (loop)
      track.style.transition = "none";
      track.appendChild(track.firstElementChild);
      track.style.transform = "translateX(0)";

      // força reflow
      track.getBoundingClientRect();

      isAnimating = false;
    });
  }

  function slidePrev(){
    if (isAnimating) return;
    isAnimating = true;

    const step = cardStep();

    // joga o último card pro começo sem animação
    track.style.transition = "none";
    track.insertBefore(track.lastElementChild, track.firstElementChild);
    track.style.transform = `translateX(-${step}px)`;

    // força reflow
    track.getBoundingClientRect();

    // anima de volta pro 0
    track.style.transition = "transform .55s cubic-bezier(.22,.61,.36,1)";
    track.style.transform = "translateX(0)";

    track.addEventListener("transitionend", function onEnd(){
      track.removeEventListener("transitionend", onEnd);
      isAnimating = false;
    });
  }

  function start(){
    stop();
    timer = setInterval(slideNext, interval);
  }

  function stop(){
    if (timer) clearInterval(timer);
    timer = null;
  }

  nextBtn?.addEventListener("click", () => { slideNext(); start(); });
  prevBtn?.addEventListener("click", () => { slidePrev(); start(); });

  // pausa no hover
  viewport.addEventListener("mouseenter", stop);
  viewport.addEventListener("mouseleave", start);

  // se mudar o tamanho, reseta pra evitar passo errado
  window.addEventListener("resize", () => {
    track.style.transition = "none";
    track.style.transform = "translateX(0)";
  });

  start();
});
