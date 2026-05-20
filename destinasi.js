/* ══════════════════════════════════════ SUPABASE SETUP ══════════════════════════════════════ */
const SUPABASE_URL      = "https://fvyjlwwurapxbddakdpq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eWpsd3d1cmFweGJkZGFrZHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNjkxMjUsImV4cCI6MjA5NDY0NTEyNX0.76JVhpxtplY4B0dY7VhBmh2XP_Mzooi84yPA6-vNtb0";
const supabaseClient    = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ══════════════════════════════════════ ✅ FIX UTAMA: BFCACHE HANDLER ══════════════════════════════════════ */
// Saat browser memulihkan halaman dari Back-Forward Cache (bfcache),
// Supabase auth state menjadi stale → paksa reload halaman agar fresh
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    // Halaman dipulihkan dari bfcache → reload agar auth state segar
    window.location.reload();
  }
});

/* ══════════════════════════════════════ HELPER: FORMAT RUPIAH ══════════════════════════════════════ */
function formatRp(val) {
  if (val >= 1000000) return `Rp ${(val/1000000).toFixed(1).replace('.0','')} jt`;
  if (val >= 1000)    return `Rp ${(val/1000).toFixed(0)}.000`;
  return val === 0    ? 'Gratis' : `Rp ${val}`;
}

/* ══════════════════════════════════════ HELPER: ESCAPE HTML ══════════════════════════════════════ */
function escapeHTML(str = '') {
  return String(str).replace(/[&<>'"]/g, t => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[t]||t));
}

/* ══════════════════════════════════════ UPLOAD FOTO KE SUPABASE STORAGE ══════════════════════════════════════ */
// Attach file input listener via JS (lebih reliable dari onchange di HTML)
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('dImgFile');
  if (fileInput) {
    fileInput.addEventListener('change', function() {
      previewDestImg(this);
    });
  }
});

function previewDestImg(input) {
  const file = input.files[0];
  if (!file) return;
  const preview = document.getElementById('dImgPreview');
  const wrap    = document.getElementById('dImgPreviewWrap');
  const btnText = document.getElementById('dImgBtnText');
  preview.src = URL.createObjectURL(file);
  wrap.style.display  = 'flex';
  if (btnText) btnText.textContent = 'Ganti Foto';
}

function clearDestImg() {
  const fileInput = document.getElementById('dImgFile');
  const preview   = document.getElementById('dImgPreview');
  const wrap      = document.getElementById('dImgPreviewWrap');
  const btnText   = document.getElementById('dImgBtnText');
  if (fileInput) fileInput.value = '';
  document.getElementById('dImg').value = '';
  if (preview)  { preview.src = ''; }
  if (wrap)     { wrap.style.display = 'none'; }
  if (btnText)  { btnText.textContent = 'Pilih Foto'; }
}

async function uploadDestImg(file) {
  const ext      = file.name.split('.').pop();
  const fileName = `dest-${Date.now()}.${ext}`;
  const { data, error } = await supabaseClient.storage
    .from('destinasi-photos')
    .upload(fileName, file, { upsert: true, contentType: file.type });
  if (error) throw new Error('Upload foto gagal: ' + error.message);
  const { data: { publicUrl } } = supabaseClient.storage
    .from('destinasi-photos')
    .getPublicUrl(fileName);
  return publicUrl;
}

function showToast(msg, type = '') {
  const el = document.getElementById('toastDest');
  if (!el) return;
  el.textContent = msg;
  el.className   = `toast-dest show ${type}`;
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.className = 'toast-dest'; }, 3000);
}

/* ══════════════════════════════════════ GLOBAL RANGE HARGA ══════════════════════════════════════ */
const navRangeBtn = document.getElementById('navRangeHarga');
const globalPanel = document.getElementById('globalRangePanel');
const rangeMinEl  = document.getElementById('rangeMin');
const rangeMaxEl  = document.getElementById('rangeMax');
const rangeValEl  = document.getElementById('globalRangeValue');

function updateGlobalRangeLabel() {
  const min = parseInt(rangeMinEl.value);
  const max = parseInt(rangeMaxEl.value);
  rangeValEl.textContent = `${formatRp(min)} – ${formatRp(max)}`;
}

function applyGlobalRange() {
  const min = parseInt(rangeMinEl.value);
  const max = parseInt(rangeMaxEl.value);
  document.querySelectorAll('.dest-card').forEach(card => {
    const cost = parseInt(card.dataset.cost) || 0;
    card.classList.toggle('range-hidden', cost < min || cost > max);
  });
  document.querySelectorAll('.category-section').forEach(sec => {
    // ✅ BENAR
    const visible = sec.querySelectorAll('.dest-card:not(.range-hidden):not(.jarak-hidden)').length > 0;
    sec.classList.toggle('hidden', !visible);
  });
}

if (navRangeBtn && globalPanel) {
  navRangeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    globalPanel.classList.toggle('open');
  });
  document.getElementById('btnCloseRange')?.addEventListener('click', () => {
    globalPanel.classList.remove('open');
    rangeMinEl.value = 0;
    rangeMaxEl.value = 300000;
    updateGlobalRangeLabel();
    document.querySelectorAll('.dest-card').forEach(c => c.classList.remove('range-hidden'));
    document.querySelectorAll('.category-section').forEach(s => s.classList.remove('hidden'));
  });
  [rangeMinEl, rangeMaxEl].forEach(inp => {
    inp?.addEventListener('input', () => {
      let min = parseInt(rangeMinEl.value), max = parseInt(rangeMaxEl.value);
      if (min > max) { rangeMinEl.value = max; rangeMaxEl.value = min; }
      updateGlobalRangeLabel();
      applyGlobalRange();
    });
  });
}

/* ══════════════════════════════════════
   GLOBAL RANGE JARAK
══════════════════════════════════════ */
const navJarakBtn  = document.getElementById('navRangeJarak');
const jarakPanel   = document.getElementById('globalJarakPanel');
const jarakMinEl   = document.getElementById('jarakMin');
const jarakMaxEl   = document.getElementById('jarakMax');
const jarakValEl   = document.getElementById('globalJarakValue');

function formatKm(val) {
  return val >= 50 ? '50 km+' : `${val} km`;
}

function updateGlobalJarakLabel() {
  const min = parseInt(jarakMinEl.value);
  const max = parseInt(jarakMaxEl.value);
  jarakValEl.textContent = `${formatKm(min)} – ${formatKm(max)}`;
}

function applyGlobalJarak() {
  const min = parseInt(jarakMinEl.value);
  const max = parseInt(jarakMaxEl.value);

  document.querySelectorAll('.dest-card').forEach(card => {
    const dist = parseFloat(card.dataset.distance);
    // Kalau data-distance tidak ada / null, jangan sembunyikan
    if (isNaN(dist)) {
      card.classList.remove('jarak-hidden');
      return;
    }
    // Jika max = 50 (batas slider), anggap sebagai "50 km ke atas" — tampilkan semua ≥ min
    const overMax = max >= 50 ? false : dist > max;
    card.classList.toggle('jarak-hidden', dist < min || overMax);
  });

  document.querySelectorAll('.category-section').forEach(sec => {
    const visible = sec.querySelectorAll('.dest-card:not(.range-hidden):not(.jarak-hidden)').length > 0;
    sec.classList.toggle('hidden', !visible);
  });
}

if (navJarakBtn && jarakPanel) {
  navJarakBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Tutup panel harga kalau terbuka
    globalPanel?.classList.remove('open');
    jarakPanel.classList.toggle('open');
  });

  // Tutup panel jarak kalau panel harga dibuka
  navRangeBtn?.addEventListener('click', () => {
    jarakPanel.classList.remove('open');
  });

  document.getElementById('btnCloseJarak')?.addEventListener('click', () => {
    jarakPanel.classList.remove('open');
    jarakMinEl.value = 0;
    jarakMaxEl.value = 50;
    updateGlobalJarakLabel();
    document.querySelectorAll('.dest-card').forEach(c => c.classList.remove('jarak-hidden'));
    document.querySelectorAll('.category-section').forEach(s => s.classList.remove('hidden'));
  });

  [jarakMinEl, jarakMaxEl].forEach(inp => {
    inp?.addEventListener('input', () => {
      let min = parseInt(jarakMinEl.value),
          max = parseInt(jarakMaxEl.value);
      if (min > max) {
        jarakMinEl.value = max;
        jarakMaxEl.value = min;
      }
      updateGlobalJarakLabel();
      applyGlobalJarak();
    });
  });
}

/* ══════════════════════════════════════ CATEGORY FILTER CHIPS ══════════════════════════════════════ */
const filterChips = document.querySelectorAll('.filter-chip');
const sections    = document.querySelectorAll('.category-section');

filterChips.forEach(chip => {
  chip.addEventListener('click', () => {
    filterChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const filter = chip.dataset.filter;
    sections.forEach(sec => {
      const match = filter === 'all' || sec.dataset.category === filter;
      sec.classList.toggle('hidden', !match);
    });
  });
});

/* ══════════════════════════════════════ WISHLIST BADGE ══════════════════════════════════════ */
(async function initWishlistBadge() {
  const sb      = supabaseClient; //gunakan client global, bukan buat baru
  const badge   = document.getElementById('wishlistBadge');
  const navLink = document.getElementById('navWishlistLink');

  function updateBadge(count) {
    if (!badge) return;
    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.classList.add('visible', 'pop');
      navLink?.classList.add('has-items');
      setTimeout(() => badge.classList.remove('pop'), 350);
    } else {
      badge.textContent = '';
      badge.classList.remove('visible');
      navLink?.classList.remove('has-items');
    }
  }

  async function loadCount() {
    const { data: { session } } = await sb.auth.getSession();
    if (session?.user) {
      const { count } = await sb
        .from('wishlists')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);
      updateBadge(count || 0);
    } else {
      try {
        const saved = JSON.parse(localStorage.getItem('kisahanda_wishlist')) || [];
        updateBadge(saved.length);
      } catch { updateBadge(0); }
    }
  }

  await loadCount();
  sb.auth.onAuthStateChange(async () => { await loadCount(); });
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') await loadCount();
  });
  window._updateWishlistBadge = loadCount;
})();

/* ══════════════════════════════════════ SECTION RANGE HARGA PANEL ══════════════════════════════════════ */
function toggleSectionRange(linkEl, section) {
  const panel   = document.getElementById(`range-${section}`);
  const reviews = document.getElementById(`reviews-${section}`);
  if (!panel) return;
  const isOpen = panel.classList.contains('visible');
  linkEl.closest('.section-header-right').querySelectorAll('.filter-link').forEach(l => l.classList.remove('active'));
  if (!isOpen) {
    panel.classList.add('visible');
    reviews?.classList.remove('visible');
    linkEl.classList.add('active');
  } else {
    panel.classList.remove('visible');
  }
}

document.querySelectorAll('.section-range').forEach(slider => {
  slider.addEventListener('input', () => {
    const sec    = slider.dataset.section;
    const maxVal = parseInt(slider.value);
    const label  = document.getElementById(`rangeVal-${sec}`);
    if (label) label.textContent = `Rp 0 – ${formatRp(maxVal)}`;
    document.querySelectorAll(`#grid-${sec} .dest-card`).forEach(card => {
      const cost = parseInt(card.dataset.cost) || 0;
      card.classList.toggle('range-hidden', cost > maxVal);
    });
  });
});

/* ══════════════════════════════════════ SECTION REVIEWS PANEL ══════════════════════════════════════ */
const loadedSections = new Set();

function toggleSectionReviews(linkEl, section) {
  const panel = document.getElementById(`reviews-${section}`);
  const range = document.getElementById(`range-${section}`);
  if (!panel) return;
  const isOpen = panel.classList.contains('visible');
  linkEl.closest('.section-header-right').querySelectorAll('.filter-link').forEach(l => l.classList.remove('active'));
  if (!isOpen) {
    panel.classList.add('visible');
    range?.classList.remove('visible');
    linkEl.classList.add('active');
    if (!loadedSections.has(section)) {
      loadedSections.add(section);
      loadSectionReviews(section);
    }
  } else {
    panel.classList.remove('visible');
  }
}

async function loadSectionReviews(section) {
  const list = document.getElementById(`reviewList-${section}`);
  if (!list) return;
  const { data, error } = await supabaseClient
    .from('reviews')
    .select('*')
    .in('dest_id', [...document.querySelectorAll(`[data-category="${section}"] .dest-card`)].map(c => c.dataset.id))
    .order('created_at', { ascending: false })
    .limit(5);
  if (error || !data || data.length === 0) {
    list.innerHTML = `<p class="section-reviews-loading">Belum ada ulasan untuk kategori ini.</p>`;
    return;
  }
  list.innerHTML = data.map(r => {
    const date = new Date(r.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
    return `<div class="review-item">
      <h4>${escapeHTML(r.name)}<span>${'⭐'.repeat(Math.min(Number(r.rating)||0,5))}</span></h4>
      <p>${escapeHTML(r.text)}</p>
      <span class="review-date">${date}</span>
    </div>`;
  }).join('');
}

/* ══════════════════════════════════════ DEST CARD CLICK ══════════════════════════════════════ */
document.querySelectorAll('.dest-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('.admin-card-actions') || e.target.closest('.fav-btn')) return;
    const id = card.dataset.id;
    if (id) window.location.href = `detaildestinasi.html?id=${id}`;
  });
});

/* ══════════════════════════════════════ WISHLIST ══════════════════════════════════════ */
let wishlistIds = [];

async function fetchWishlist() {
  if (!currentUser) {
    try { wishlistIds = JSON.parse(localStorage.getItem('kisahanda_wishlist')) || []; }
    catch { wishlistIds = []; }
    return;
  }
  const { data } = await supabaseClient
    .from('wishlists').select('dest_id').eq('user_id', currentUser.id);
  wishlistIds = data ? data.map(r => r.dest_id) : [];
}

async function toggleWishlistItem(destId, btn) {
  const isIn = wishlistIds.includes(destId);
  if (!currentUser) {
    if (isIn) {
      wishlistIds = wishlistIds.filter(x => x !== destId);
      btn.classList.remove('active');
      showToast('Dihapus dari wishlist', '');
    } else {
      wishlistIds.push(destId);
      btn.classList.add('active');
      showToast('Ditambahkan ke wishlist ❤️ (Login untuk sinkronisasi)', 'success');
    }
    localStorage.setItem('kisahanda_wishlist', JSON.stringify(wishlistIds));
    return;
  }
  if (isIn) {
    await supabaseClient.from('wishlists').delete().eq('user_id', currentUser.id).eq('dest_id', destId);
    wishlistIds = wishlistIds.filter(x => x !== destId);
    btn.classList.remove('active');
    showToast('Dihapus dari wishlist', '');
  } else {
    await supabaseClient.from('wishlists').insert([{ user_id: currentUser.id, dest_id: destId }]);
    wishlistIds.push(destId);
    btn.classList.add('active');
    showToast('Disimpan ke wishlist ❤️', 'success');
  }
}

function applyWishlistUI() {
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const id = btn.dataset.id;
    btn.classList.toggle('active', wishlistIds.includes(id));
  });
}

async function initWishlist() {
  await fetchWishlist();
  applyWishlistUI();
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);
    const id = fresh.dataset.id;
    fresh.classList.toggle('active', wishlistIds.includes(id));
    fresh.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlistItem(id, fresh);
    });
  });
}

/* ══════════════════════════════════════ VIEW ALL CLICK ══════════════════════════════════════ */
document.querySelectorAll('.view-all-card').forEach(card => {
  card.addEventListener('click', () => {
    const cat = card.dataset.category;
    filterChips.forEach(c => c.classList.toggle('active', c.dataset.filter === cat));
    sections.forEach(sec => sec.classList.toggle('hidden', sec.dataset.category !== cat));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* ══════════════════════════════════════ AUTO-FILTER FROM URL PARAMS ══════════════════════════════════════ */
(function applyDiscoveryFilters() {
  const params   = new URLSearchParams(window.location.search);
  const budget   = params.get('budget');
  const kategori = params.get('kategori');
  if (!budget && !kategori) return;
  const kategoriMap = {
    'Wisata Alam':'nature','Kuliner Lokal':'culinary',
    'Sejarah & Budaya':'cultural','Tempat Santai':'cozy',
    'Hidden Gems':'all','Spot Foto Keren':'all'
  };
  if (kategori && kategoriMap[kategori] && kategoriMap[kategori] !== 'all') {
    const tf = kategoriMap[kategori];
    filterChips.forEach(c => c.classList.toggle('active', c.dataset.filter === tf));
    sections.forEach(s => s.classList.toggle('hidden', s.dataset.category !== tf));
  }
  if (budget) {
    let min = 0, max = Infinity;
    if (budget.includes('+')) { min = parseInt(budget); }
    else { const p = budget.split('-'); min = parseInt(p[0]); max = parseInt(p[1]); }
    document.querySelectorAll('.dest-card').forEach(card => {
      const cost = parseInt(card.dataset.cost) || 0;
      card.classList.toggle('range-hidden', cost < min || cost > max);
    });
    sections.forEach(sec => {
      const vis = sec.querySelectorAll('.dest-card:not(.range-hidden)').length > 0;
      if (!vis) sec.classList.add('hidden');
    });
  }
})();

/* ══════════════════════════════════════ AUTH ══════════════════════════════════════ */
let currentUser   = null;
let isAdmin       = false;
const ADMIN_EMAIL = 'admin@kisahanda.co';

/* ── Helper: reset semua state & UI ke kondisi guest ── */
function _resetToGuest() {
  currentUser = null;
  isAdmin     = false;
  wishlistIds = [];
  const bar = document.getElementById('authBar');
  if (bar) bar.style.display = 'none';
  // Sembunyikan semua admin-only element
  document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
  // Sembunyikan admin-card-actions di kartu
  document.querySelectorAll('.admin-card-actions').forEach(el => el.remove());
  applyWishlistUI();
  renderLoginBtn();
  _loadingDestinations = false;
  loadDestinationsFromDB();
}

async function checkAuth() {
  _loadingDestinations = false; // ← reset guard di sini
    const hasLogoutFlag = localStorage.getItem('kisahanda_logout')
        || new URLSearchParams(location.search).get('logout');

    if (hasLogoutFlag) {
        localStorage.removeItem('kisahanda_logout');
        Object.keys(localStorage).forEach(k => {
            if (k.startsWith('sb-') || k.includes('supabase')) localStorage.removeItem(k);
        });
        try { await supabaseClient.auth.signOut({ scope: 'local' }); } catch (_) {}
        history.replaceState(null, '', location.pathname +
            (location.search.replace(/[?&]logout=1/, '') || ''));
        _resetToGuest();
        return;
    }

    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session?.user) {
        currentUser = session.user;
        isAdmin     = currentUser.email === ADMIN_EMAIL || currentUser.user_metadata?.role === 'admin';
        await renderAuthUI(); // sudah memanggil loadDestinationsFromDB() di dalamnya
        await initWishlist();
    } else {
        renderLoginBtn();
        await loadDestinationsFromDB(); // ← TAMBAHKAN INI
    }
}

/* ── Render auth UI untuk user yang login ── */
async function renderAuthUI() {
  const area  = document.getElementById('navAuthArea');
  const bar   = document.getElementById('authBar');
  const email = document.getElementById('authBarEmail');
  const badge = document.getElementById('authBarBadge');

  const displayName = currentUser.user_metadata?.full_name
    || currentUser.user_metadata?.name
    || currentUser.email.split('@')[0];
  const initials = displayName.slice(0, 2).toUpperCase();

  if (area) area.innerHTML = `
    <div class="nav-user-avatar" onclick="openAuthModal()" title="${escapeHTML(displayName)}">
      ${escapeHTML(initials)}
    </div>`;

  if (bar)   bar.style.display   = 'flex';
  if (email) email.textContent   = displayName;
  if (badge) badge.style.display = isAdmin ? 'inline-flex' : 'none';
  if (isAdmin) showAdminControls();
  _loadingDestinations = false; // reset sebelum load
  await loadDestinationsFromDB();
}

function renderLoginBtn() {
  const area = document.getElementById('navAuthArea');
  if (!area) return;
  area.innerHTML = `<button class="nav-login-btn" onclick="openAuthModal()">Masuk / Daftar</button>`;
}

function showAdminControls() {
  document.querySelectorAll('.admin-only').forEach(el => el.style.display = '');
}

/* ══════════════════════════════════════ ✅ FIX UTAMA: LOGOUT HANDLER ══════════════════════════════════════ */
document.body.addEventListener('click', (e) => {
  if (!e.target.closest('#btnLogout')) return;

  // Tutup semua modal
  document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));

  // ✅ FIX: Bersihkan localStorage DULU, LALU redirect — TIDAK menunggu signOut()
  // signOut() dijalankan fire-and-forget di background agar tidak memblokir redirect
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith('sb-') || k.includes('supabase') || k.includes('kisahanda'))
      localStorage.removeItem(k);
  });
  sessionStorage.clear();

  // Fire and forget — jangan await, biarkan jalan di background
  supabaseClient.auth.signOut({ scope: 'global' }).catch(() => {});

  // Langsung reset UI tanpa menunggu network
  _resetToGuest();

  showToast('Berhasil keluar. Sampai jumpa! 👋', '');

  // Redirect setelah toast tampil sebentar
  setTimeout(() => {
    location.href = location.pathname + '?logout=1';
  }, 900);
});

/* ── Tutup modal saat klik backdrop ── */
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

/* ── Auth state change listener ── */
// SESUDAH
supabaseClient.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_OUT') {
    _resetToGuest();
    return;
  }
  // Jangan panggil renderAuthUI() di sini,
  // biarkan checkAuth() yang handle saat pertama load
  // onAuthStateChange hanya untuk update UI ringan saja
});

/* ══════════════════════════════════════ SYNC KARTU DARI SUPABASE ══════════════════════════════════════ */
/* ══════════════════════════════════════
   LOAD DESTINATIONS FROM SUPABASE (menggantikan hardcoded cards)
══════════════════════════════════════ */
let _loadingDestinations = false;
async function loadDestinationsFromDB() {
  if (_loadingDestinations) return;   // ← guard
  _loadingDestinations = true;
  const { data, error } = await supabaseClient
    .from('destinations')
    .select('id, name, category, cost, img_url, distance')
    .order('name', { ascending: true });

  if (error || !data) {
    console.error('Gagal load destinations:', error?.message);
    return;
  }

  // Kosongkan semua grid dulu (hapus hardcoded cards, tapi jaga .view-all-card)
  document.querySelectorAll('.dest-grid').forEach(grid => {
    grid.querySelectorAll('.dest-card:not(.view-all-card)').forEach(c => c.remove());
  });

  data.forEach(dest => {
    injectCard({
      id       : dest.id,
      name     : dest.name,
      category : dest.category,
      cost     : dest.cost || 0,
      img      : dest.img_url || '',
      distance : dest.distance ?? '',
    });
  });

  // Re-attach card click listeners
  document.querySelectorAll('.dest-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.admin-card-actions') || e.target.closest('.fav-btn')) return;
      const id = card.dataset.id;
      if (id) window.location.href = `detaildestinasi.html?id=${id}`;
    });
  });

  // Tampilkan admin controls kalau sudah login sebagai admin
  if (isAdmin) showAdminControls();

  // Reset guard agar bisa dipanggil lagi nanti (misal setelah simpan destinasi)
  _loadingDestinations = false;
}

/* ── Re-check auth saat kembali ke tab ── */
document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState !== 'visible') return;
  if (localStorage.getItem('kisahanda_logout')) {
    localStorage.removeItem('kisahanda_logout');
    try { await supabaseClient.auth.signOut({ scope: 'local' }); } catch (_) {}
    _resetToGuest();
    return;
  }
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session && currentUser) {
    _resetToGuest();
    return;
  }
  _loadingDestinations = false;   // ← TAMBAHKAN INI
  await loadDestinationsFromDB();
});

/* ══════════════════════════════════════ AUTH MODAL ══════════════════════════════════════ */
function openAuthModal(tab = 'login') {
  const modal = document.getElementById('authModal');
  if (!modal) return;
  modal.classList.add('open');
  switchAuthTab(tab);
}

function closeAuthModal() {
  document.getElementById('authModal')?.classList.remove('open');
  ['loginMsg','registerMsg'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.className = 'modal-msg'; }
  });
}

function switchAuthTab(tab) {
  document.getElementById('panelLogin').style.display    = tab === 'login'    ? '' : 'none';
  document.getElementById('panelRegister').style.display = tab === 'register' ? '' : 'none';
  document.getElementById('tabLogin').classList.toggle('active',    tab === 'login');
  document.getElementById('tabRegister').classList.toggle('active', tab === 'register');
}

function togglePwd(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  const isText = inp.type === 'text';
  inp.type = isText ? 'password' : 'text';
  btn.textContent = isText ? '👁' : '🙈';
}

/* ── LOGIN ── */
async function doLogin() {
  const email    = document.getElementById('loginEmail')?.value.trim();
  const password = document.getElementById('loginPassword')?.value;
  const msg      = document.getElementById('loginMsg');
  const btn      = document.getElementById('btnLogin');
  if (!email || !password) { setModalMsg(msg, 'Isi email dan password dulu ya!', 'error'); return; }
  btn.disabled = true; btn.textContent = 'Masuk...';
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  btn.disabled = false; btn.textContent = 'Masuk';
  if (error) { setModalMsg(msg, 'Login gagal: ' + (error.message || 'Periksa email & password'), 'error'); return; }
  currentUser = data.user;
  isAdmin     = currentUser.email === ADMIN_EMAIL || currentUser.user_metadata?.role === 'admin';
  closeAuthModal();
  await renderAuthUI();
  await initWishlist();
  const name = currentUser.user_metadata?.full_name || currentUser.email.split('@')[0];
  showToast(isAdmin ? `Selamat datang Admin, ${name}! 👑` : `Halo ${name}! Selamat datang 👋`, 'success');
}

/* ── REGISTER ── */
async function doRegister() {
  const name     = document.getElementById('regName')?.value.trim();
  const username = document.getElementById('regUsername')?.value.trim();
  const email    = document.getElementById('regEmail')?.value.trim();
  const pwd      = document.getElementById('regPassword')?.value;
  const pwdConf  = document.getElementById('regPasswordConfirm')?.value;
  const msg      = document.getElementById('registerMsg');
  const btn      = document.getElementById('btnRegister');
  if (!name || !email || !pwd) { setModalMsg(msg, 'Nama, email, dan password wajib diisi!', 'error'); return; }
  if (pwd.length < 6)          { setModalMsg(msg, 'Password minimal 6 karakter.', 'error'); return; }
  if (pwd !== pwdConf)         { setModalMsg(msg, 'Password dan konfirmasi tidak sama!', 'error'); return; }
  btn.disabled = true; btn.textContent = 'Mendaftar...';
  const { data, error } = await supabaseClient.auth.signUp({
    email, password: pwd,
    options: { data: { full_name: name, username: username || null, role: 'user' } }
  });
  btn.disabled = false; btn.textContent = 'Buat Akun';
  if (error) { setModalMsg(msg, 'Daftar gagal: ' + error.message, 'error'); return; }
  if (data.user && data.session) {
    currentUser = data.user;
    isAdmin     = false;
    closeAuthModal();
    await renderAuthUI();
    await initWishlist();
    showToast(`Akun berhasil dibuat! Halo ${name} 🎉`, 'success');
  } else {
    setModalMsg(msg, `Akun berhasil dibuat! Cek email ${email} untuk konfirmasi.`, 'success');
  }
}

/* ══════════════════════════════════════ ADD / EDIT DESTINASI MODAL ══════════════════════════════════════ */
function openAddModal(category) {
  if (!isAdmin) { showToast('Akses admin diperlukan.', 'error'); return; }
  setDestModal({ mode:'add', category });
  document.getElementById('destModal')?.classList.add('open');
}

async function openEditModal(e, id) {
  e.stopPropagation();
  if (!isAdmin) { showToast('Akses admin diperlukan.', 'error'); return; }
  const card = document.querySelector(`.dest-card[data-id="${id}"]`);
  if (!card) return;
  const { data: destData } = await supabaseClient
    .from('destinations').select('*').eq('id', id).single();
  setDestModal({
    mode     : 'edit',
    oldId    : id,
    name     : destData?.name     || card.querySelector('.dest-label')?.textContent || '',
    slug     : id,
    category : destData?.category || card.dataset.category,
    cost     : destData?.cost     || card.dataset.cost,
    img      : destData?.img_url  || card.querySelector('img')?.getAttribute('src') || '',
    desc     : destData?.description || '',
    tagline  : destData?.tagline  || '',
    rating   : destData?.rating   || '',
    distance : destData?.distance || '',
    mapsq    : destData?.maps_query || '',
  });
  document.getElementById('destModal')?.classList.add('open');
}

function setDestModal({ mode, category = '', oldId='', name='', slug='', cost='', img='', desc='', tagline='', rating='', distance='', mapsq='' }) {
  document.getElementById('destModalMode').value  = mode;
  document.getElementById('destModalOldId').value = oldId;
  document.getElementById('dName').value          = name;
  document.getElementById('dSlug').value          = slug;
  document.getElementById('dCost').value          = cost;
  document.getElementById('dImg').value           = img;
  document.getElementById('dImgFile').value = '';
  if (img) {
    document.getElementById('dImgPreview').src              = img;
    document.getElementById('dImgPreviewWrap').style.display = 'flex';
    const btnText = document.getElementById('dImgBtnText');
    if (btnText) btnText.textContent = 'Ganti Foto';
  } else { clearDestImg(); }
  if (document.getElementById('dDesc'))     document.getElementById('dDesc').value     = desc;
  if (document.getElementById('dTagline'))  document.getElementById('dTagline').value  = tagline;
  if (document.getElementById('dRating'))   document.getElementById('dRating').value   = rating;
  if (document.getElementById('dDistance')) document.getElementById('dDistance').value = distance;
  if (document.getElementById('dMaps'))     document.getElementById('dMaps').value     = mapsq;
  if (category) document.getElementById('dCategory').value = category;
  const isEdit = mode === 'edit';
  document.getElementById('destModalTitle').textContent = isEdit ? '✏️ Edit Destinasi' : 'Tambah Destinasi Baru';
  document.getElementById('destModalSub').textContent   = isEdit ? 'Ubah detail destinasi.' : 'Isi detail destinasi baru.';
  const msg = document.getElementById('destModalMsg');
  if (msg) { msg.textContent = ''; msg.className = 'modal-msg'; }
}

function closeDestModal() {
  document.getElementById('destModal')?.classList.remove('open');
  // Pastikan tombol simpan selalu kembali aktif saat modal ditutup
  const btn = document.getElementById('btnSaveDest');
  if (btn) { btn.disabled = false; btn.textContent = 'Simpan Destinasi'; }
}

async function saveDest() {
  if (!isAdmin) { showToast('Akses admin diperlukan.', 'error'); return; }
  const mode     = document.getElementById('destModalMode').value;
  const oldId    = document.getElementById('destModalOldId').value;
  const name     = document.getElementById('dName').value.trim();
  const slug     = document.getElementById('dSlug').value.trim().toLowerCase().replace(/\s+/g,'-');
  const category = document.getElementById('dCategory').value;
  const cost     = parseInt(document.getElementById('dCost').value) || 0;
  const img      = document.getElementById('dImg').value.trim();
  const desc     = document.getElementById('dDesc')?.value.trim() || '';
  const tagline  = document.getElementById('dTagline')?.value.trim() || '';
  const rating   = parseFloat(document.getElementById('dRating')?.value) || null;
  const distance = parseFloat(document.getElementById('dDistance')?.value) || null;
  const mapsq    = document.getElementById('dMaps')?.value.trim() || '';
  const msg      = document.getElementById('destModalMsg');
  const btn      = document.getElementById('btnSaveDest');
  if (!name || !slug) { setModalMsg(msg, 'Nama dan ID wajib diisi!', 'error'); return; }
  btn.disabled = true; btn.textContent = 'Menyimpan...';
  const fileInput = document.getElementById('dImgFile');
  const file      = fileInput?.files[0];
  let   imgUrl    = document.getElementById('dImg').value;
  try {
    if (file) {
      btn.textContent = 'Mengupload foto...';
      imgUrl = await uploadDestImg(file);
      document.getElementById('dImg').value = imgUrl;
    }

    const payload = {
      id: slug, name, category, cost,
      img_url: imgUrl, description: desc,
      tagline, rating, distance, maps_query: mapsq
    };

    const timeout = new Promise((_, rej) =>
      setTimeout(() => rej(new Error('Request timeout, coba lagi.')), 15000)
    );

    btn.textContent = 'Menyimpan...';
    let error;
    if (mode === 'add') {
      ({ error } = await Promise.race([
        supabaseClient.from('destinations').insert([payload]),
        timeout
      ]));
    } else {
      const updatePayload = {
        name, category, cost, img_url: imgUrl,
        description: desc, tagline, rating, distance, maps_query: mapsq
      };
      if (slug !== oldId) updatePayload.id = slug;
      ({ error } = await Promise.race([
        supabaseClient.from('destinations').update(updatePayload).eq('id', oldId),
        timeout
      ]));
    }

    if (error) {
      setModalMsg(msg, 'Gagal menyimpan: ' + error.message, 'error');
      btn.disabled = false; btn.textContent = 'Simpan Destinasi';
      return;
    }

  } catch (err) {
    btn.disabled = false; btn.textContent = 'Simpan Destinasi';
    setModalMsg(msg, '⚠️ ' + err.message, 'error');
    return;
  }

  btn.disabled = false; btn.textContent = 'Simpan Destinasi';
  closeDestModal();
  showToast(mode === 'add' ? 'Destinasi berhasil ditambahkan! ✅' : 'Destinasi berhasil diperbarui! ✅', 'success');

  // Reload ulang dari DB agar data sinkron dan tombol bisa dipakai lagi
  _loadingDestinations = false;
  await loadDestinationsFromDB();
}

/* ══════════════════════════════════════ DELETE CARD ══════════════════════════════════════ */
async function deleteCard(e, id) {
  e.stopPropagation();
  if (!isAdmin) { showToast('Akses admin diperlukan.', 'error'); return; }
  if (!confirm(`Hapus destinasi "${id}"? Tindakan ini tidak bisa dibatalkan.`)) return;
  const { error } = await supabaseClient.from('destinations').delete().eq('id', id);
  if (error) { showToast('Gagal menghapus: ' + error.message, 'error'); return; }
  document.querySelector(`.dest-card[data-id="${id}"]`)?.remove();
  showToast('Destinasi dihapus.', '');
}

/* ══════════════════════════════════════ INJECT CARD (tambah kartu baru ke DOM) ══════════════════════════════════════ */
function injectCard({ id, name, category, cost, img, distance = '' }) {
  const grid = document.getElementById(`grid-${category}`);
  if (!grid) return;
  const costFmt = cost ? `Rp ${cost.toLocaleString('id-ID')}` : 'Gratis';
  const html = `
    <div class="dest-card" data-id="${id}" data-category="${category}" data-cost="${cost}" data-distance="${distance}">
      <div class="dest-img-wrap">
        <img src="${escapeHTML(img)}" alt="${escapeHTML(name)}"
          onerror="this.src='https://placehold.co/200x140/ccc/fff?text=${encodeURIComponent(name)}'" />
        <button class="fav-btn wishlist-btn" data-id="${id}" aria-label="Wishlist">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
        ${isAdmin ? `
        <div class="admin-card-actions">
          <button class="admin-edit-btn" onclick="openEditModal(event,'${id}')">✏️</button>
          <button class="admin-del-btn" onclick="deleteCard(event,'${id}')">🗑️</button>
        </div>` : ''}
      </div>
      <div class="dest-label">${escapeHTML(name)}</div>
      <div class="dest-cost">${costFmt}</div>
    </div>`;
  const viewAll = grid.querySelector('.view-all-card');
  viewAll
    ? viewAll.insertAdjacentHTML('beforebegin', html)
    : grid.insertAdjacentHTML('beforeend', html);

  const newCard = grid.querySelector(`.dest-card[data-id="${id}"]`);
  newCard?.addEventListener('click', (e) => {
    if (e.target.closest('.admin-card-actions') || e.target.closest('.fav-btn')) return;
    window.location.href = `detaildestinasi.html?id=${id}`;
  });
  newCard?.querySelector('.wishlist-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleWishlistItem(id, e.currentTarget);
  });
}

/* ══════════════════════════════════════ MODAL MSG HELPER ══════════════════════════════════════ */
function setModalMsg(el, msg, type) {
  if (!el) return;
  el.textContent = msg;
  el.className   = `modal-msg ${type}`;
}

/* ══════════════════════════════════════ LOAD LATEST REVIEWS ══════════════════════════════════════ */
async function loadLatestReviewsForIndex() {
  const container = document.getElementById('latestReviewsIndex');
  if (!container) return;
  const { data, error } = await supabaseClient
    .from('reviews').select('*')
    .order('created_at', { ascending: false }).limit(3);
  if (!error && data) {
    container.innerHTML = data.map(r => `
      <div class="review-item">
        <h4>${escapeHTML(r.name)} di <strong>${escapeHTML(r.dest_id.replace(/-/g,' '))}</strong></h4>
        <p>"${escapeHTML(r.text)}"</p>
      </div>`).join('');
  }
}
loadLatestReviewsForIndex();

/* ══════════════════════════════════════ MOBILE BOTTOM NAV TOGGLE ══════════════════════════════════════ */
function mbnToggleRange(type) {
  const hargaPanel = document.getElementById('globalRangePanel');
  const jarakPanel = document.getElementById('globalJarakPanel');
  const mbnHarga   = document.getElementById('mbnRangeHarga');
  const mbnJarak   = document.getElementById('mbnRangeJarak');
  if (type === 'harga') {
    const isOpen = hargaPanel.classList.contains('open');
    jarakPanel.classList.remove('open');
    mbnJarak?.classList.remove('active');
    hargaPanel.classList.toggle('open', !isOpen);
    mbnHarga?.classList.toggle('active', !isOpen);
  } else {
    const isOpen = jarakPanel.classList.contains('open');
    hargaPanel.classList.remove('open');
    mbnHarga?.classList.remove('active');
    jarakPanel.classList.toggle('open', !isOpen);
    mbnJarak?.classList.toggle('active', !isOpen);
  }
}

/* ══════════════════════════════════════ INIT ══════════════════════════════════════ */
checkAuth();