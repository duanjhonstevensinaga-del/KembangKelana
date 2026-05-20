/* ══════════════════════════════════════════════════════════════
   blog.js  —  Kisah Anda Blog
   • Auth    : pakai sbAuth & window.currentUser dari auth-modal.js
   • Data    : load blog dari tabel `blog_posts` via Supabase
   • Admin   : tambah / edit / hapus artikel
   • Guest   : baca artikel, filter kategori
   ══════════════════════════════════════════════════════════════

   ── SUPABASE TABLE yang dibutuhkan ──────────────────────────
   Jalankan SQL berikut di Supabase SQL Editor:

   CREATE TABLE IF NOT EXISTS blog_posts (
     id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     slug        TEXT UNIQUE NOT NULL,
     title       TEXT NOT NULL,
     excerpt     TEXT,
     content     TEXT,
     img_url     TEXT,
     category    TEXT NOT NULL DEFAULT 'destinasi',
     author_name TEXT DEFAULT 'Tim Kisah Anda',
     published_at TIMESTAMPTZ DEFAULT NOW(),
     created_at  TIMESTAMPTZ DEFAULT NOW()
   );
   ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Public read"   ON blog_posts FOR SELECT USING (true);
   CREATE POLICY "Admin insert"  ON blog_posts FOR INSERT WITH CHECK
     ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
   CREATE POLICY "Admin update"  ON blog_posts FOR UPDATE USING
     ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
   CREATE POLICY "Admin delete"  ON blog_posts FOR DELETE USING
     ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
   ── END SQL ────────────────────────────────────────────────── */

/* ══════════════════════════════════════
   SUPABASE — gunakan instance dari auth-modal.js (sbAuth)
   Jika auth-modal.js belum load, buat instance sendiri sebagai fallback
   ══════════════════════════════════════ */
const SUPABASE_URL_BLOG      = "https://fvyjlwwurapxbddakdpq.supabase.co";
const SUPABASE_ANON_KEY_BLOG = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eWpsd3d1cmFweGJkZGFrZHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNjkxMjUsImV4cCI6MjA5NDY0NTEyNX0.76JVhpxtplY4B0dY7VhBmh2XP_Mzooi84yPA6-vNtb0";

// Pakai sbAuth dari auth-modal.js bila tersedia, fallback ke instance baru
const sb = (typeof sbAuth !== 'undefined')
  ? sbAuth
  : supabase.createClient(SUPABASE_URL_BLOG, SUPABASE_ANON_KEY_BLOG);

let isAdmin = false;

/* ══════════════════════════════════════
   HELPERS
   ══════════════════════════════════════ */
function escapeHTML(str = '') {
  return String(str).replace(/[&<>'"]/g, t =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[t] || t)
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

function showToast(msg, type = '') {
  const el = document.getElementById('toastBlog');
  if (!el) return;
  el.textContent = msg;
  el.className   = `toast-blog show${type ? ' ' + type : ''}`;
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.className = 'toast-blog'; }, 3200);
}

function setModalMsg(msg, type) {
  const el = document.getElementById('blogModalMsg');
  if (!el) return;
  el.textContent = msg;
  el.className   = `modal-msg show ${type}`;
}

/* ══════════════════════════════════════
   AUTH CHECK & UI UPDATE
   ══════════════════════════════════════ */
async function checkAuth() {
  // auth-modal.js sudah handle sesi dan inject tombol navbar.
  // Di sini kita hanya cek role admin untuk tampilkan FAB & info bar.
  const { data } = await sb.auth.getSession();
  const user = data.session?.user || window.currentUser || null;

  if (user) {
    const role = user.user_metadata?.role;
    isAdmin = role === 'admin';

    if (isAdmin) {
      // Tampilkan FAB tambah artikel
      const adminFab = document.getElementById('adminFab');
      if (adminFab) adminFab.classList.add('visible');

      // Tampilkan info bar admin
      const infoBar = document.getElementById('adminInfoBar');
      if (infoBar) {
        infoBar.classList.add('visible');
        const nameEl = document.getElementById('adminInfoName');
        if (nameEl) {
          nameEl.textContent = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin';
        }
      }
    }
  }
}

/* ══════════════════════════════════════
   LOAD BLOG POSTS
   ══════════════════════════════════════ */
async function loadBlogs(filterCategory = 'all') {
  const grid = document.getElementById('blogGrid');
  grid.innerHTML = `
    <div class="blog-loading">
      <div class="spinner"></div>
      <p>Memuat artikel...</p>
    </div>`;

  let query = sb.from('blog_posts')
    .select('id, slug, title, excerpt, img_url, category, author_name, published_at')
    .order('published_at', { ascending: false });

  if (filterCategory !== 'all') {
    query = query.eq('category', filterCategory);
  }

  const { data, error } = await query;

  if (error) {
    grid.innerHTML = `<div class="blog-empty"><p>❌ Gagal memuat artikel: ${escapeHTML(error.message)}</p></div>`;
    return;
  }

  if (!data || data.length === 0) {
    grid.innerHTML = `<div class="blog-empty"><p>Belum ada artikel${filterCategory !== 'all' ? ' di kategori ini' : ''} 📝</p></div>`;
    return;
  }

  grid.innerHTML = data.map(post => renderCard(post)).join('');

  // Animate cards in
  grid.querySelectorAll('.blog-card').forEach((card, i) => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms`;
    requestAnimationFrame(() => {
      card.style.opacity   = '1';
      card.style.transform = 'translateY(0)';
    });
  });

  // Footer scroll reveal
  const revealEls = document.querySelectorAll('.footer-brand, .footer-links, .footer-contact');
  revealEls.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity   = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => obs.observe(el));
}

function renderCard(post) {
  const img      = escapeHTML(post.img_url || 'https://placehold.co/400x250/d4e9f0/2c6e7a?text=Blog');
  const cat      = escapeHTML(post.category || 'destinasi');
  const catLabel = { destinasi: 'Destinasi', kuliner: 'Kuliner', tips: 'Tips' }[post.category] || post.category;
  const date     = formatDate(post.published_at);

  const adminActions = isAdmin ? `
    <div class="card-admin-actions">
      <button class="card-admin-btn edit" onclick="openBlogModal('edit','${escapeHTML(post.id)}')" title="Edit">✏️</button>
      <button class="card-admin-btn del"  onclick="deleteBlogPost('${escapeHTML(post.id)}','${escapeHTML(post.title)}')" title="Hapus">🗑️</button>
    </div>` : '';

  return `
    <article class="blog-card" data-category="${cat}" data-id="${escapeHTML(post.id)}">
      <div class="card-img">
        <img src="${img}" alt="${escapeHTML(post.title)}"
             onerror="this.src='https://placehold.co/400x250/d4e9f0/2c6e7a?text=Kisah+Anda'" />
        <span class="card-badge">${catLabel}</span>
        ${adminActions}
      </div>
      <div class="card-content">
        <span class="card-date"><i class="far fa-calendar"></i> ${date}</span>
        <h3>${escapeHTML(post.title)}</h3>
        <p>${escapeHTML(post.excerpt || '')}</p>
        <a href="blog-post.html?slug=${encodeURIComponent(post.slug)}" class="read-more">
          Baca Selengkapnya <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </article>`;
}

/* ══════════════════════════════════════
   FILTER
   ══════════════════════════════════════ */
let activeFilter = 'all';

function initFilter() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      loadBlogs(activeFilter);
    });
  });
}

/* ══════════════════════════════════════
   BLOG MODAL (Add / Edit) — hanya untuk admin
   ══════════════════════════════════════ */
function openBlogModal(mode, id = '') {
  if (!isAdmin) {
    // Buka modal login jika bukan admin
    openAuthModal({ hint: '<strong>🔐 Akses Admin</strong> — Fitur ini hanya untuk admin.' });
    return;
  }

  document.getElementById('blogModalMode').value = mode;
  document.getElementById('blogModalId').value   = id;

  const isEdit = mode === 'edit';
  document.getElementById('blogModalTitle').textContent = isEdit ? '✏️ Edit Artikel' : '✍️ Tulis Blog Baru';
  document.getElementById('blogModalSub').textContent   = isEdit ? 'Ubah detail artikel ini.' : 'Isi detail artikel blog baru.';

  const msg = document.getElementById('blogModalMsg');
  if (msg) { msg.textContent = ''; msg.className = 'modal-msg'; }

  if (mode === 'add') {
    document.getElementById('bTitle').value    = '';
    document.getElementById('bExcerpt').value  = '';
    document.getElementById('bImg').value      = '';
    document.getElementById('bContent').value  = '';
    document.getElementById('bCategory').value = 'destinasi';
    document.getElementById('bDate').value     = new Date().toISOString().slice(0, 10);
    document.getElementById('bImgPreview').className = 'img-preview';
  } else {
    loadBlogForEdit(id);
  }

  document.getElementById('blogModalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

async function loadBlogForEdit(id) {
  const { data, error } = await sb.from('blog_posts').select('*').eq('id', id).single();
  if (error || !data) { showToast('Gagal memuat data artikel.', 'error'); return; }

  document.getElementById('bTitle').value    = data.title    || '';
  document.getElementById('bExcerpt').value  = data.excerpt  || '';
  document.getElementById('bImg').value      = data.img_url  || '';
  document.getElementById('bContent').value  = data.content  || '';
  document.getElementById('bCategory').value = data.category || 'destinasi';
  document.getElementById('bDate').value     = data.published_at ? data.published_at.slice(0, 10) : '';
  previewBlogImg();
}

function closeBlogModal() {
  document.getElementById('blogModalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function previewBlogImg() {
  const url     = document.getElementById('bImg').value.trim();
  const preview = document.getElementById('bImgPreview');
  if (url) {
    preview.src = url;
    preview.className = 'img-preview show';
  } else {
    preview.className = 'img-preview';
  }
}

async function saveBlog() {
  if (!isAdmin) { showToast('Akses admin diperlukan.', 'error'); return; }

  const mode     = document.getElementById('blogModalMode').value;
  const id       = document.getElementById('blogModalId').value;
  const title    = document.getElementById('bTitle').value.trim();
  const excerpt  = document.getElementById('bExcerpt').value.trim();
  const imgUrl   = document.getElementById('bImg').value.trim();
  const content  = document.getElementById('bContent').value.trim();
  const category = document.getElementById('bCategory').value;
  const dateVal  = document.getElementById('bDate').value;
  const btn      = document.getElementById('btnSaveBlog');

  if (!title) { setModalMsg('Judul artikel wajib diisi!', 'error'); return; }

  const slug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);

  btn.disabled    = true;
  btn.textContent = 'Menyimpan...';

  const payload = {
    title, excerpt, img_url: imgUrl, content, category, slug,
    published_at: dateVal ? new Date(dateVal).toISOString() : new Date().toISOString()
  };

  let error;
  if (mode === 'add') {
    ({ error } = await sb.from('blog_posts').insert([payload]));
  } else {
    ({ error } = await sb.from('blog_posts').update(payload).eq('id', id));
  }

  btn.disabled    = false;
  btn.textContent = 'Simpan Artikel';

  if (error) { setModalMsg('Gagal menyimpan: ' + error.message, 'error'); return; }

  closeBlogModal();
  showToast(mode === 'add' ? '✅ Artikel berhasil dipublikasikan!' : '✅ Artikel berhasil diperbarui!', 'success');
  loadBlogs(activeFilter);
}

/* ══════════════════════════════════════
   DELETE
   ══════════════════════════════════════ */
async function deleteBlogPost(id, title) {
  if (!isAdmin) return;
  if (!confirm(`Hapus artikel "${title}"? Tindakan ini tidak bisa dibatalkan.`)) return;

  const { error } = await sb.from('blog_posts').delete().eq('id', id);
  if (error) { showToast('Gagal menghapus: ' + error.message, 'error'); return; }
  showToast('Artikel dihapus.', '');
  loadBlogs(activeFilter);
}

/* ══════════════════════════════════════
   OVERLAY MENU (GSAP) — identik dengan index
   ══════════════════════════════════════ */
function initMenu() {
  const navToggle        = document.getElementById('navToggle');
  const menu             = document.getElementById('menu');
  const menuBg           = document.getElementById('menu-path');
  const menuInfoItems    = document.querySelectorAll('.menu-col-info p, .menu-col-info h3, .menu-col-info h6');
  const menuBrandLogo    = document.querySelector('.menu-brand-logo');
  const menuBrandLogoBox = document.querySelector('.menu-brand-logo-box');
  const menuBrandName    = document.querySelector('.menu-brand-name');
  const menuInfoBox      = document.querySelector('.menu-col-info-box');
  const menuBrandTextBox = document.querySelector('.menu-brand-text-box');

  if (!navToggle || !menu || typeof gsap === 'undefined') return;

  let isOpen = false, isAnimating = false;

  const W = 1131, H = 861, CX = W / 2;
  const midY   = H * 0.20;
  const HIDDEN = `M0,${H} L${W},${H} L${W},${H} Q${CX},${H} 0,${H} Z`;
  const BULGE  = `M0,${H} L${W},${H} L${W},${midY+150} Q${CX},50 0,${midY+150} Z`;
  const FULL   = `M0,${H} L${W},${H} L${W},${midY} Q${CX},${midY} 0,${midY} Z`;
  const CBULGE = `M0,${H} L${W},${H} L${W},${midY-50} Q${CX},${H-100} 0,${midY-50} Z`;

  gsap.set(menuBg, { attr: { d: HIDDEN } });

  // SplitText per karakter — identik index
  const brandSplit = (typeof SplitText !== 'undefined' && menuBrandName)
    ? new SplitText(menuBrandName, { type: 'chars', charsClass: 'char' })
    : null;

  if (brandSplit)      gsap.set(brandSplit.chars, { opacity: 0, x: 50 });
  if (menuBrandLogo)    gsap.set(menuBrandLogo,    { opacity: 0, scale: 0.8 });
  if (menuBrandLogoBox) gsap.set(menuBrandLogoBox, { opacity: 0, scale: 0.85, y: 16 });
  if (menuInfoBox)      gsap.set(menuInfoBox,      { opacity: 0, y: 20, scale: 0.97 });
  if (menuBrandTextBox) gsap.set(menuBrandTextBox, { opacity: 0, y: 14, scale: 0.96 });
  gsap.set(menuInfoItems, { opacity: 0, y: 50 });

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
      .to(menuBg, { duration: 0.4, attr: { d: FULL  }, ease: 'power4.out' });
    if (menuBrandLogoBox)
      tl.to(menuBrandLogoBox, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.7)' }, '-=0.25');
    if (menuBrandLogo)
      tl.to(menuBrandLogo,    { opacity: 1, scale: 1, duration: 0.4,  ease: 'back.out(1.8)' }, '-=0.35');
    if (menuBrandTextBox)
      tl.to(menuBrandTextBox, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.6)' }, '-=0.3');
    if (brandSplit)
      tl.to(brandSplit.chars, { x: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: 'elastic.out(1, 0.5)' }, '-=0.35');
    if (menuInfoBox)
      tl.to(menuInfoBox,      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.6)' }, '-=0.5');
    tl.to([...menuInfoItems], { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 }, '-=0.4');
  }

  function closeMenu() {
    gsap.set(menuBg, { attr: { d: FULL } });
    const tl = gsap.timeline({ onComplete: () => {
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
      isAnimating = false;
      if (brandSplit)      gsap.set(brandSplit.chars, { opacity: 0, x: 50 });
      if (menuBrandLogo)    gsap.set(menuBrandLogo,    { opacity: 0, scale: 0.8 });
      if (menuBrandLogoBox) gsap.set(menuBrandLogoBox, { opacity: 0, scale: 0.85, y: 16 });
      if (menuInfoBox)      gsap.set(menuInfoBox,      { opacity: 0, y: 20, scale: 0.97 });
      if (menuBrandTextBox) gsap.set(menuBrandTextBox, { opacity: 0, y: 14, scale: 0.96 });
      gsap.set(menuInfoItems, { opacity: 0, y: 50 });
    }});
    const fadeTargets = [
      ...(menuBrandLogoBox ? [menuBrandLogoBox] : []),
      ...(menuBrandLogo    ? [menuBrandLogo]    : []),
      ...(menuBrandTextBox ? [menuBrandTextBox] : []),
      ...(menuInfoBox      ? [menuInfoBox]      : []),
      ...(brandSplit       ? brandSplit.chars   : []),
      ...menuInfoItems
    ];
    tl.to(fadeTargets, { opacity: 0, duration: 0.18, stagger: 0.015 })
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
   NAVBAR SCROLL
   ══════════════════════════════════════ */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  let lastScrollY = window.scrollY, ticking = false;
  nav.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1), background 0.4s, backdrop-filter 0.4s';
  const handle = () => {
    const y    = window.scrollY;
    const down = y > lastScrollY;
    nav.style.transform      = (down && y > 80) ? 'translateY(-100%)' : 'translateY(0)';
    nav.style.background     = y > 60 ? 'rgba(34,34,37,0.9)' : 'transparent';
    nav.style.backdropFilter = y > 60 ? 'blur(12px)' : 'none';
    lastScrollY = y;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(handle); ticking = true; }
  }, { passive: true });
  handle();
}

/* ══════════════════════════════════════
   HERO PARALLAX
   ══════════════════════════════════════ */
function initParallax() {
  const hero = document.querySelector('.blog-hero');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    hero.style.backgroundPositionY = `calc(50% + ${window.scrollY * 0.35}px)`;
  }, { passive: true });
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
  await checkAuth();
  await loadBlogs();
  initFilter();
  initMenu();
  initNavScroll();
  initParallax();
});