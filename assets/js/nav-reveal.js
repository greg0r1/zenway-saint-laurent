/* ============================================================
   NAV-REVEAL — état de la nav au scroll, menu burger, animations
   d'apparition au défilement
   ============================================================ */

// Nav scroll state + bouton retour en haut
const nav = document.getElementById('nav');
const toTop = document.getElementById('toTop');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  if (toTop) toTop.classList.toggle('show', window.scrollY > 600);
};
window.addEventListener('scroll', onScroll); onScroll();

// Burger menu
const burger = document.getElementById('burger');
const links = document.getElementById('navlinks');
burger.addEventListener('click', () => {
  links.classList.remove('no-transition');
  links.classList.toggle('open');
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.add('no-transition');
  links.classList.remove('open');
}));

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .14 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
