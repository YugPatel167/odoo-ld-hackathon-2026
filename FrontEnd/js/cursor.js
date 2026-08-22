// Sidebar (vertical nav) open/close + scroll-reveal for sections
(function () {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  const close = document.getElementById('sidebar-close');
  const backdrop = document.getElementById('sidebar-backdrop');

  function openSidebar() {
    sidebar.classList.add('open');
    document.body.classList.add('sidebar-open');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    document.body.classList.remove('sidebar-open');
  }

  if (toggle) toggle.addEventListener('click', openSidebar);
  if (close) close.addEventListener('click', closeSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);

  // Close the drawer after picking a link on mobile
  document.querySelectorAll('.sidebar-nav a').forEach(function (a) {
    a.addEventListener('click', closeSidebar);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSidebar();
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }
})();