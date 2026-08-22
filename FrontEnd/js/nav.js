/* ==========================================================================
   GlobeTrotter — Dynamic Navigation & Route Guard
   Checks authentication state, updates navbar/sidebar UI dynamically,
   and guards protected routes.
   ========================================================================== */

(function () {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  const close = document.getElementById('sidebar-close');
  const backdrop = document.getElementById('sidebar-backdrop');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    document.body.classList.add('sidebar-open');
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    document.body.classList.remove('sidebar-open');
  }

  if (toggle) toggle.addEventListener('click', openSidebar);
  if (close) close.addEventListener('click', closeSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);

  // Close drawer on link selection on mobile
  document.querySelectorAll('.sidebar-nav a').forEach(function (a) {
    a.addEventListener('click', closeSidebar);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSidebar();
  });

  // Scroll reveal observer
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

  // ---------------------------------------------------------------------------
  // Route Guard & Auth Navigation Sync
  // ---------------------------------------------------------------------------
  function syncAuthNavigation() {
    if (typeof Api === 'undefined') return;

    const isAuthed = Api.isAuthenticated();
    const currentUser = Api.getCurrentUser() || {};
    const currentPath = window.location.pathname.split('/').pop().toLowerCase();

    // 1. Protected Pages Guard
    const protectedPages = [
      'dashboard.html',
      'create-trip.html',
      'my-trips.html',
      'profile.html'
    ];

    if (protectedPages.includes(currentPath) && !isAuthed) {
      // If user is accessing protected page without token, redirect to login
      console.warn(`[RouteGuard] Access to ${currentPath} requires authentication. Redirecting to login.html...`);
      window.location.href = `login.html?redirect=${encodeURIComponent(currentPath)}`;
      return;
    }

    // 2. Dynamic Sidebar / Navbar User Section
    const sidebarUserContainers = document.querySelectorAll('.sidebar-user');
    sidebarUserContainers.forEach(container => {
      if (isAuthed) {
        const userName = currentUser.name || currentUser.email || 'Traveler';
        const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'GT';

        container.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px; padding: 4px 6px; margin-bottom: 8px;">
            <div class="avatar" style="width: 34px; height: 34px; font-size: 0.85rem; flex-shrink: 0; background: var(--brass); color: var(--void); font-weight: 700;">
              ${initials}
            </div>
            <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <span style="display: block; font-size: 0.88rem; font-weight: 600; color: var(--ink);">${userName}</span>
              <span class="muted" style="font-size: 0.75rem;">Active Session</span>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <a href="profile.html" class="btn btn-ghost btn-sm" style="flex: 1; justify-content: center; font-size: 0.8rem; padding: 6px 8px;">Profile</a>
            <button type="button" id="btn-nav-logout" class="btn btn-ghost btn-sm" style="color: var(--rust); font-size: 0.8rem; padding: 6px 8px;" title="Log out">Logout</button>
          </div>
        `;

        const logoutBtn = container.querySelector('#btn-nav-logout');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', () => {
            Api.logout();
          });
        }
      } else {
        container.innerHTML = `
          <a href="login.html" class="btn btn-ghost btn-sm">Log in</a>
          <a href="login.html?tab=signup" class="btn btn-primary btn-sm">Sign up</a>
        `;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncAuthNavigation);
  } else {
    syncAuthNavigation();
  }
})();