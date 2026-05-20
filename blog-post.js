/* ══════════════════════════════════════════════════════════════
   blog-post.js  —  Kisah Anda Blog Post Reader
   • Auth   : pakai sbAuth & window.currentUser dari auth-modal.js
   • Data   : ambil artikel dari Supabase berdasarkan ?slug= di URL
   ══════════════════════════════════════════════════════════════ */

/* ── SUPABASE — gunakan instance dari auth-modal.js bila tersedia ── */
const SUPABASE_URL_POST      = "https://fvyjlwwurapxbddakdpq.supabase.co";
const SUPABASE_ANON_KEY_POST = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eWpsd3d1cmFweGJkZGFrZHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNjkxMjUsImV4cCI6MjA5NDY0NTEyNX0.76JVhpxtplY4B0dY7VhBmh2XP_Mzooi84yPA6-vNtb0";

const sb = (typeof sbAuth !== 'undefined')
  ? sbAuth
  : supabase.createClient(SUPABASE_URL_POST, SUPABASE_ANON_KEY_POST);

let currentPost = null;

/* ── HELPERS ── */
function escapeHTML(str = '') {
  return String(str).replace(/[&<>'"]/g, t =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[t] || t)
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

function estimateReadTime(text = '') {
  const words = text.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} menit baca`;
}

function showToast(msg, type = '') {
  const el = document.getElementById('toastBlog');
  if (!el) return;
  el.textContent = msg;
  el.className   = `toast-blog show${type ? ' ' + type : ''}`;
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.className = 'toast-blog'; }, 3000);
}

function getCategoryLabel(cat) {
  return { destinasi: 'Destinasi', kuliner: 'Kuliner', tips: 'Tips' }[cat] || cat;
}

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'KA';
}

/* ══════════════════════════════════════
   AUTH NAV — diurus sepenuhnya oleh auth-modal.js.
   Fungsi ini hanya tampilkan badge admin jika perlu.
   ══════════════════════════════════════ */
async function checkAuth() {
  const { data } = await sb.auth.getSession();
  const user = data?.session?.user || window.currentUser || null;
  if (!user) return;

  const isAdmin = user.user_metadata?.role === 'admin';
  if (isAdmin) {
    const badge = document.getElementById('adminBadge');
    if (badge) badge.classList.add('visible');
  }
}

/* ══════════════════════════════════════
   FETCH & RENDER POST
   ══════════════════════════════════════ */
async function loadPost() {
  const params = new URLSearchParams(window.location.search);
  const slug   = params.get('slug');

  if (!slug) { renderError('Artikel tidak ditemukan.', 'Tidak ada slug di URL.'); return; }

  const { data: post, error } = await sb
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !post) {
    renderError('Artikel tidak ditemukan.', 'Mungkin artikel telah dihapus atau URL salah.');
    return;
  }

  currentPost = post;

  /* Page title */
  document.getElementById('pageTitle').textContent = `${post.title} – Kisah Anda`;

  /* Hero */
  const hero = document.getElementById('postHero');
  if (post.img_url) hero.style.backgroundImage = `url('${post.img_url}')`;

  document.getElementById('postHeroContent').innerHTML = `
    <span class="post-hero-badge">${getCategoryLabel(post.category)}</span>
    <h1 class="post-hero-title">${escapeHTML(post.title)}</h1>
    <div class="post-hero-meta">
      <span><i class="far fa-user"></i> ${escapeHTML(post.author_name || 'Tim Kisah Anda')}</span>
      <span><i class="far fa-calendar-alt"></i> ${formatDate(post.published_at)}</span>
      <span><i class="fas fa-clock"></i> ${estimateReadTime(post.content || '')}</span>
    </div>`;

  /* Breadcrumb */
  document.getElementById('bcCategory').textContent = getCategoryLabel(post.category);
  const bcTitle = document.getElementById('bcTitle');
  bcTitle.textContent = post.title.length > 40 ? post.title.slice(0, 40) + '…' : post.title;

  /* Sidebar */
  const author = post.author_name || 'Tim Kisah Anda';
  document.getElementById('sidebarAuthor').textContent   = author;
  document.getElementById('sidebarAvatar').textContent   = getInitials(author);
  document.getElementById('sidebarDate').textContent     = formatDate(post.published_at);
  document.getElementById('sidebarCategory').textContent = getCategoryLabel(post.category);
  document.getElementById('sidebarReadTime').textContent = estimateReadTime(post.content || '');

  /* Content */
  const skeleton = document.getElementById('postSkeleton');
  const content  = document.getElementById('postContent');
  if (skeleton) skeleton.style.display = 'none';
  if (content) {
    content.style.display = 'block';
    content.innerHTML = `<div class="prose-body">${post.content || '<p>Belum ada konten.</p>'}</div>`;
    content.style.opacity   = '0';
    content.style.transform = 'translateY(16px)';
    content.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    requestAnimationFrame(() => {
      content.style.opacity   = '1';
      content.style.transform = 'translateY(0)';
    });
  }

  loadRelated(post.id, post.category);
}

/* ══════════════════════════════════════
   RELATED POSTS
   ══════════════════════════════════════ */
async function loadRelated(currentId, category) {
  const container = document.getElementById('relatedPosts');
  if (!container) return;

  let { data: posts } = await sb
    .from('blog_posts')
    .select('id, slug, title, img_url, category')
    .neq('id', currentId)
    .eq('category', category)
    .limit(3);

  if (!posts || posts.length === 0) {
    const { data: fallback } = await sb
      .from('blog_posts')
      .select('id, slug, title, img_url, category')
      .neq('id', currentId)
      .limit(3);
    posts = fallback || [];
  }

  if (posts.length === 0) {
    container.innerHTML = `<p style="font-family:'DM Sans',sans-serif;font-size:13px;color:#bbb;padding:8px 0">Belum ada artikel lainnya.</p>`;
    return;
  }

  container.innerHTML = posts.map(p => `
    <a class="related-item" href="blog-post.html?slug=${encodeURIComponent(p.slug)}">
      <img class="related-thumb"
           src="${escapeHTML(p.img_url || 'https://placehold.co/60x50/d4e9f0/2c6e7a?text=KA')}"
           alt="${escapeHTML(p.title)}"
           onerror="this.src='https://placehold.co/60x50/d4e9f0/2c6e7a?text=KA'">
      <div class="related-info">
        <span class="related-cat">${getCategoryLabel(p.category)}</span>
        <span class="related-title">${escapeHTML(p.title)}</span>
      </div>
    </a>`).join('');
}

/* ══════════════════════════════════════
   ERROR STATE
   ══════════════════════════════════════ */
function renderError(title, desc) {
  const skeleton = document.getElementById('postSkeleton');
  const content  = document.getElementById('postContent');
  const hero     = document.getElementById('postHero');

  if (skeleton) skeleton.style.display = 'none';
  if (hero) hero.style.minHeight = '180px';
  if (content) {
    content.style.display = 'block';
    content.innerHTML = `
      <div class="post-error">
        <div class="error-icon">🗺️</div>
        <h2>${escapeHTML(title)}</h2>
        <p>${escapeHTML(desc)}</p>
        <a href="Blog.html" class="btn-back"><i class="fas fa-arrow-left"></i> Kembali ke Blog</a>
      </div>`;
  }
}

/* ══════════════════════════════════════
   SHARE
   ══════════════════════════════════════ */
function sharePost(platform) {
  const url   = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(currentPost?.title || 'Artikel Kisah Anda');

  if (platform === 'whatsapp') {
    window.open(`https://wa.me/?text=${title}%20${url}`, '_blank');
  } else if (platform === 'twitter') {
    window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, '_blank');
  } else if (platform === 'copy') {
    navigator.clipboard.writeText(window.location.href).then(() => {
      const btn = document.getElementById('copyBtn');
      if (btn) {
        btn.classList.add('copied');
        btn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = '<i class="fas fa-link"></i>';
        }, 2000);
      }
      showToast('Tautan berhasil disalin!');
    });
  }
}

/* ══════════════════════════════════════
   PROGRESS BAR
   ══════════════════════════════════════ */
function initProgressBar() {
  const bar = document.createElement('div');
  bar.className = 'read-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = docH > 0 ? Math.min((window.scrollY / docH) * 100, 100) + '%' : '0%';
  }, { passive: true });
}

/* ══════════════════════════════════════
   NAVBAR SCROLL
   ══════════════════════════════════════ */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  let lastY = 0, ticking = false;
  nav.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1), background 0.4s, backdrop-filter 0.4s';
  const handle = () => {
    const y    = window.scrollY;
    const down = y > lastY;
    nav.style.transform      = (down && y > 80) ? 'translateY(-100%)' : 'translateY(0)';
    nav.style.background     = y > 60 ? 'rgba(34,34,37,0.9)' : 'transparent';
    nav.style.backdropFilter = y > 60 ? 'blur(12px)' : 'none';
    lastY = y; ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(handle); ticking = true; }
  }, { passive: true });
  handle();
}

/* ══════════════════════════════════════
   OVERLAY MENU (GSAP)
   ══════════════════════════════════════ */
function initMenu() {
  const navToggle     = document.getElementById('navToggle');
  const menu          = document.getElementById('menu');
  const menuBg        = document.getElementById('menu-path');
  const menuLinks     = document.querySelectorAll('.block-btn');
  const menuInfoItems = document.querySelectorAll('.menu-col-info p, .menu-col-info h3, .menu-col-info h6');
  const pickNeeds     = document.querySelector('.pick-needs');
  const menuBrand     = document.querySelector('.menu-brand');

  if (!navToggle || !menu || typeof gsap === 'undefined') return;

  let isOpen = false, isAnimating = false;
  const W = 1131, H = 861, CX = W / 2, midY = H * 0.20;
  const HIDDEN = `M0,${H} L${W},${H} L${W},${H} Q${CX},${H} 0,${H} Z`;
  const BULGE  = `M0,${H} L${W},${H} L${W},${midY+150} Q${CX},50 0,${midY+150} Z`;
  const FULL   = `M0,${H} L${W},${H} L${W},${midY} Q${CX},${midY} 0,${midY} Z`;
  const CBULGE = `M0,${H} L${W},${H} L${W},${midY-50} Q${CX},${H-100} 0,${midY-50} Z`;

  gsap.set(menuBg, { attr: { d: HIDDEN } });
  gsap.set(menuLinks, { opacity: 0, y: 20 });
  gsap.set(menuInfoItems, { opacity: 0, y: 50 });
  if (pickNeeds) gsap.set(pickNeeds, { opacity: 0, y: 20 });
  if (menuBrand) gsap.set(menuBrand, { opacity: 0, x: -20 });

  navToggle.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;
    isOpen = !isOpen;
    navToggle.classList.toggle('active', isOpen);
    isOpen ? openMenu() : closeMenu();
  });

  function openMenu() {
    menu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const tl = gsap.timeline({ onComplete: () => { isAnimating = false; } });
    tl.to(menuBg, { duration: 0.4, attr: { d: BULGE }, ease: 'power4.in' })
      .to(menuBg, { duration: 0.4, attr: { d: FULL  }, ease: 'power4.out' })
      .to(menuBrand, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }, '-=0.3')
      .to([pickNeeds, ...menuInfoItems], { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 }, '-=0.35')
      .to(menuLinks, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.4)' }, '-=0.4');
  }

  function closeMenu() {
    const tl = gsap.timeline({ onComplete: () => {
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
      isAnimating = false;
      gsap.set(menuLinks, { opacity: 0, y: 20 });
      if (pickNeeds) gsap.set(pickNeeds, { opacity: 0, y: 20 });
      gsap.set(menuInfoItems, { opacity: 0, y: 50 });
      if (menuBrand) gsap.set(menuBrand, { opacity: 0, x: -20 });
    }});
    tl.to([pickNeeds, menuInfoItems, menuLinks, menuBrand], { opacity: 0, duration: 0.2, stagger: 0.03 })
      .to(menuBg, { duration: 0.4, attr: { d: CBULGE }, ease: 'power3.in' })
      .to(menuBg, { duration: 0.4, attr: { d: HIDDEN }, ease: 'power3.out' });
  }

  menu.addEventListener('click', e => {
    if (e.target === menu && isOpen && !isAnimating) {
      isAnimating = true; isOpen = false;
      navToggle.classList.remove('active');
      closeMenu();
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen && !isAnimating) {
      isAnimating = true; isOpen = false;
      navToggle.classList.remove('active');
      closeMenu();
    }
  });
}

/* ══════════════════════════════════════
   BFCACHE FIX
   ══════════════════════════════════════ */
window.addEventListener('pageshow', e => {
  if (e.persisted) window.location.reload();
});

/* ══════════════════════════════════════
   INIT
   ══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  initProgressBar();
  await checkAuth();
  await loadPost();
  initMenu();
  initNavScroll();
});