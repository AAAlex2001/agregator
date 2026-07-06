let locks = 0;
let savedScrollY = 0;

const pinTop = () => {
  if (window.scrollY !== 0) window.scrollTo(0, 0);
};

export function lockDocument() {
  locks += 1;
  if (locks > 1) return;
  savedScrollY = window.scrollY;
  const body = document.body;
  body.style.position = "fixed";
  body.style.top = `-${savedScrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  window.addEventListener("scroll", pinTop);
}

export function unlockDocument() {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  window.removeEventListener("scroll", pinTop);
  const body = document.body;
  body.style.position = "";
  body.style.top = "";
  body.style.left = "";
  body.style.right = "";
  body.style.width = "";
  window.scrollTo(0, savedScrollY);
}
