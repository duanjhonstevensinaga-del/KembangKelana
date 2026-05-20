/* ══════════════════════════════════════════════════════════
   auth-modal.js — Modal Login/Daftar terintegrasi Supabase
   Digunakan di: index.html, destinasi.html, dan halaman lain
   ══════════════════════════════════════════════════════════ */

const SUPABASE_URL      = "https://fvyjlwwurapxbddakdpq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eWpsd3d1cmFweGJkZGFrZHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNjkxMjUsImV4cCI6MjA5NDY0NTEyNX0.76JVhpxtplY4B0dY7VhBmh2XP_Mzooi84yPA6-vNtb0";

// Pastikan supabase sudah di-load sebelum file ini
const sbAuth = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ── State global sesi ── */
window.currentUser = null;

/* ── Callback setelah login berhasil ── */
let _onLoginSuccess = null;

/* ══════════════════════════════════════════════════════════
   INJECT STYLES MODAL
   ══════════════════════════════════════════════════════════ */
(function injectAuthModalStyles() {
    if (document.getElementById("auth-modal-style")) return;
    const style = document.createElement("style");
    style.id = "auth-modal-style";
    style.textContent = `
    /* ── Auth Modal Overlay ── */
    #auth-modal-overlay {
        position: fixed; inset: 0; z-index: 999999;
        display: flex; align-items: center; justify-content: center;
        background: rgba(10, 30, 35, 0.6);
        backdrop-filter: blur(8px);
        padding: 1rem;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
        font-family: 'DM Sans', sans-serif;
    }
    #auth-modal-overlay.am-show {
        opacity: 1;
        pointer-events: all;
    }

    #auth-modal-card {
        background: rgba(255,255,255,0.97);
        border-radius: 24px;
        padding: 36px 32px 32px;
        max-width: 420px; width: 100%;
        box-shadow: 0 24px 80px rgba(44,110,122,0.22);
        border: 1px solid rgba(255,255,255,0.9);
        position: relative;
        transform: translateY(20px) scale(0.97);
        transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
    }
    #auth-modal-overlay.am-show #auth-modal-card {
        transform: translateY(0) scale(1);
    }

    .am-close {
        position: absolute; top: 16px; right: 18px;
        background: none; border: none; cursor: pointer;
        font-size: 20px; color: #aaa; line-height: 1;
        width: 28px; height: 28px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.15s, color 0.15s;
    }
    .am-close:hover { background: #f0f0f0; color: #444; }

    .am-brand {
        text-align: center; margin-bottom: 24px;
    }
    .am-brand-name {
        font-family: 'Playfair Display', serif;
        font-size: 20px; color: #2c6e7a;
        letter-spacing: 0.5px; margin-top: 4px;
    }
    .am-brand-sub {
        font-size: 12px; color: #9abcc4; margin-top: 3px;
    }

    /* Tabs */
    .am-tabs {
        display: flex; gap: 4px;
        background: #f0f7f9;
        border-radius: 10px; padding: 4px;
        margin-bottom: 24px;
    }
    .am-tab {
        flex: 1; text-align: center;
        padding: 9px 12px; border-radius: 8px;
        font-size: 13px; font-weight: 700;
        color: #7a9da5; cursor: pointer;
        transition: all 0.2s; user-select: none;
        font-family: 'DM Sans', sans-serif;
    }
    .am-tab.am-active {
        background: #2c6e7a; color: #fff;
        box-shadow: 0 2px 8px rgba(44,110,122,0.3);
    }

    /* Form */
    .am-form { display: flex; flex-direction: column; gap: 14px; }
    .am-form.am-hidden { display: none; }

    .am-group { display: flex; flex-direction: column; gap: 5px; }
    .am-label {
        font-size: 12px; font-weight: 700; color: #4a6e78;
        font-family: 'DM Sans', sans-serif;
    }
    .am-input {
        padding: 11px 14px;
        border: 1.5px solid #d8edf2;
        border-radius: 10px;
        font-size: 14px;
        font-family: 'DM Sans', sans-serif;
        color: #1a3a40;
        background: #f8fcfd;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
        width: 100%;
    }
    .am-input:focus {
        border-color: #2c6e7a;
        box-shadow: 0 0 0 3px rgba(44,110,122,0.1);
        background: #fff;
    }

    .am-btn {
        padding: 13px; background: #2c6e7a;
        color: #fff; border: none; border-radius: 10px;
        font-size: 15px; font-weight: 700;
        font-family: 'DM Sans', sans-serif;
        cursor: pointer;
        transition: background 0.2s, transform 0.1s;
        margin-top: 2px;
    }
    .am-btn:hover { background: #1e5460; }
    .am-btn:active { transform: scale(0.98); }
    .am-btn:disabled { background: #a0c4cc; cursor: not-allowed; }

    /* Message */
    .am-msg {
        padding: 10px 14px; border-radius: 8px;
        font-size: 12px; font-weight: 600;
        display: none; font-family: 'DM Sans', sans-serif;
    }
    .am-msg.am-show { display: block; }
    .am-msg.am-error   { background: #fde8e8; color: #c0392b; border: 1px solid #f5c0c0; }
    .am-msg.am-success { background: #e8f8f0; color: #1e7e4e; border: 1px solid #b0e0c8; }

    .am-divider {
        display: flex; align-items: center; gap: 10px;
        color: #9abcc4; font-size: 11px;
        font-family: 'DM Sans', sans-serif;
    }
    .am-divider::before, .am-divider::after {
        content: ''; flex: 1; height: 1px; background: #d8edf2;
    }

    /* Nav auth button */
    #navAuthBtn {
        display: flex; align-items: center; gap: 6px;
        background: rgba(255,255,255,0.15);
        border: 1.5px solid rgba(255,255,255,0.4);
        border-radius: 20px;
        padding: 6px 14px;
        color: #fff;
        font-size: 12px; font-weight: 700;
        cursor: pointer;
        font-family: 'League Spartan', sans-serif;
        letter-spacing: 0.3px;
        transition: background 0.2s, border-color 0.2s;
        backdrop-filter: blur(4px);
    }
    #navAuthBtn:hover {
        background: rgba(255,255,255,0.25);
        border-color: rgba(255,255,255,0.7);
    }
    #navAuthBtn .nav-user-avatar {
        width: 22px; height: 22px; border-radius: 50%;
        background: #75a9b3;
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; font-weight: 800; color: #fff;
        flex-shrink: 0;
    }

    /* User dropdown */
    #navUserDropdown {
        position: absolute; top: calc(100% + 10px); right: 0;
        background: #fff; border-radius: 14px;
        box-shadow: 0 8px 32px rgba(44,110,122,0.18);
        border: 1px solid #e0eff2;
        padding: 8px;
        min-width: 180px;
        z-index: 999;
        display: none;
        font-family: 'DM Sans', sans-serif;
    }
    #navUserDropdown.dd-show { display: block; }
    .dd-user-info {
        padding: 8px 10px 12px;
        border-bottom: 1px solid #f0f7f9;
        margin-bottom: 6px;
    }
    .dd-user-name { font-size: 13px; font-weight: 700; color: #1a3a40; }
    .dd-user-email { font-size: 11px; color: #9abcc4; margin-top: 1px; }
    .dd-item {
        display: flex; align-items: center; gap: 8px;
        padding: 9px 10px; border-radius: 8px;
        font-size: 12px; font-weight: 600; color: #444;
        cursor: pointer;
        transition: background 0.15s;
    }
    .dd-item:hover { background: #f0f7f9; }
    .dd-item.dd-logout { color: #e05a5a; }
    .dd-item.dd-logout:hover { background: #fde8e8; }
    .dd-nav-wrap { position: relative; }

    /* Success state dalam modal */
    .am-success-state {
        text-align: center; padding: 16px 0;
    }
    .am-success-icon { font-size: 44px; margin-bottom: 10px; }
    .am-success-title {
        font-family: 'Playfair Display', serif;
        font-size: 18px; color: #2c6e7a; margin-bottom: 6px;
    }
    .am-success-sub { font-size: 12px; color: #7a9da5; margin-bottom: 18px; }
    .am-continue-btn {
        display: inline-block; padding: 11px 24px;
        background: #2c6e7a; color: #fff;
        border-radius: 10px; font-weight: 700;
        font-size: 13px; border: none; cursor: pointer;
        font-family: 'DM Sans', sans-serif;
        transition: background 0.2s;
    }
    .am-continue-btn:hover { background: #1e5460; }

    /* Login required banner */
    .am-login-required-hint {
        background: linear-gradient(135deg, #eef7f9, #d8edf2);
        border: 1px solid #b8dde6;
        border-radius: 10px; padding: 10px 14px;
        font-size: 12px; color: #2c6e7a;
        font-family: 'DM Sans', sans-serif;
        text-align: center; margin-bottom: 4px;
    }
    .am-login-required-hint strong { font-weight: 700; }
    `;
    document.head.appendChild(style);
})();

/* ══════════════════════════════════════════════════════════
   BUAT MODAL DOM
   ══════════════════════════════════════════════════════════ */
function createAuthModal() {
    if (document.getElementById("auth-modal-overlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "auth-modal-overlay";
    overlay.innerHTML = `
    <div id="auth-modal-card">
        <button class="am-close" id="amClose">✕</button>

        <div class="am-brand">
            <img src="Simple KS Letter Logo (Kisah Anda) (2).svg" alt="Kisah Anda"
                 style="height:44px;width:auto;" onerror="this.style.display='none'" />
            <div class="am-brand-name">Kisah Anda</div>
            <div class="am-brand-sub">Jelajahi Bandung bersama kami</div>
        </div>

        <!-- Hint login-required (hidden by default) -->
        <div class="am-login-required-hint" id="amLoginHint" style="display:none;"></div>

        <!-- Tabs -->
        <div class="am-tabs">
            <div class="am-tab am-active" id="amTabLogin" onclick="amSwitchTab('login')">Masuk</div>
            <div class="am-tab" id="amTabRegister" onclick="amSwitchTab('register')">Daftar</div>
        </div>

        <!-- Message -->
        <div class="am-msg" id="amMsg"></div>

        <!-- SUCCESS STATE -->
        <div class="am-success-state" id="amSuccessState" style="display:none;">
            <div class="am-success-icon">✅</div>
            <div class="am-success-title">Berhasil!</div>
            <div class="am-success-sub" id="amSuccessSub">Akun kamu sudah aktif.</div>
            <button class="am-continue-btn" id="amContinueBtn">Lanjutkan</button>
        </div>

        <!-- LOGIN FORM -->
        <form class="am-form" id="amLoginForm">
            <div class="am-group">
                <label class="am-label" for="amLoginEmail">Email</label>
                <input type="email" id="amLoginEmail" class="am-input" placeholder="email@kamu.com" required autocomplete="email" />
            </div>
            <div class="am-group">
                <label class="am-label" for="amLoginPass">Password</label>
                <input type="password" id="amLoginPass" class="am-input" placeholder="Masukkan password..." required autocomplete="current-password" />
            </div>
            <button type="submit" class="am-btn" id="amBtnLogin">Masuk</button>
            <div class="am-divider">belum punya akun?</div>
            <button type="button" class="am-btn" style="background:transparent;color:#2c6e7a;border:1.5px solid #2c6e7a;" onclick="amSwitchTab('register')">Daftar Sekarang</button>
        </form>

        <!-- REGISTER FORM -->
        <form class="am-form am-hidden" id="amRegisterForm">
            <div class="am-group">
                <label class="am-label" for="amRegName">Nama Lengkap</label>
                <input type="text" id="amRegName" class="am-input" placeholder="Nama kamu..." required />
            </div>
            <div class="am-group">
                <label class="am-label" for="amRegEmail">Email</label>
                <input type="email" id="amRegEmail" class="am-input" placeholder="email@kamu.com" required autocomplete="email" />
            </div>
            <div class="am-group">
                <label class="am-label" for="amRegPass">Password</label>
                <input type="password" id="amRegPass" class="am-input" placeholder="Min. 6 karakter..." required minlength="6" autocomplete="new-password" />
            </div>
            <div class="am-group">
                <label class="am-label" for="amRegPassConfirm">Konfirmasi Password</label>
                <input type="password" id="amRegPassConfirm" class="am-input" placeholder="Ulangi password..." required autocomplete="new-password" />
            </div>
            <button type="submit" class="am-btn" id="amBtnRegister">Buat Akun</button>
            <div class="am-divider">sudah punya akun?</div>
            <button type="button" class="am-btn" style="background:transparent;color:#2c6e7a;border:1.5px solid #2c6e7a;" onclick="amSwitchTab('login')">Masuk</button>
        </form>
    </div>`;

    document.body.appendChild(overlay);

    /* Tutup modal */
    document.getElementById("amClose").addEventListener("click", closeAuthModal);
    overlay.addEventListener("click", e => { if (e.target === overlay) closeAuthModal(); });

    /* Login form submit */
    document.getElementById("amLoginForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        amClearMsg();

        const email    = document.getElementById("amLoginEmail").value.trim();
        const password = document.getElementById("amLoginPass").value;
        const btn      = document.getElementById("amBtnLogin");

        btn.disabled    = true;
        btn.textContent = "Masuk...";

        const { data, error } = await sbAuth.auth.signInWithPassword({ email, password });

        btn.disabled    = false;
        btn.textContent = "Masuk";

        if (error) {
            amShowMsg("❌ " + (error.message === "Invalid login credentials"
                ? "Email atau password salah."
                : error.message), "error");
            return;
        }

        window.currentUser = data.user;
        updateNavAuth(data.user);

        /* Callback jika ada (misal: buka paket setelah login) */
        if (typeof _onLoginSuccess === "function") {
            const cb = _onLoginSuccess;
            _onLoginSuccess = null;
            closeAuthModal();
            setTimeout(cb, 200);
        } else {
            /* Tunjukkan success state lalu tutup */
            showAmSuccess("Selamat datang kembali! Kamu berhasil masuk.", () => closeAuthModal());
        }
    });

    /* Register form submit */
    document.getElementById("amRegisterForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        amClearMsg();

        const name    = document.getElementById("amRegName").value.trim();
        const email   = document.getElementById("amRegEmail").value.trim();
        const pass    = document.getElementById("amRegPass").value;
        const confirm = document.getElementById("amRegPassConfirm").value;
        const btn     = document.getElementById("amBtnRegister");

        if (pass !== confirm) {
            amShowMsg("❌ Password dan konfirmasi tidak cocok.", "error");
            return;
        }

        btn.disabled    = true;
        btn.textContent = "Membuat akun...";

        const { data, error } = await sbAuth.auth.signUp({
            email, password: pass,
            options: { data: { full_name: name, role: "user" } }
        });

        btn.disabled    = false;
        btn.textContent = "Buat Akun";

        if (error) {
            amShowMsg("❌ " + error.message, "error");
            return;
        }

        const subText = data.session
            ? "Akun kamu langsung aktif. Selamat menjelajahi Bandung!"
            : "Cek email kamu untuk verifikasi, lalu masuk ke akun.";

        if (data.session) {
            window.currentUser = data.user;
            updateNavAuth(data.user);
        }

        showAmSuccess(subText, () => {
            if (data.session && typeof _onLoginSuccess === "function") {
                const cb = _onLoginSuccess;
                _onLoginSuccess = null;
                closeAuthModal();
                setTimeout(cb, 200);
            } else {
                closeAuthModal();
            }
        });
    });
}

/* ══════════════════════════════════════════════════════════
   HELPERS MODAL
   ══════════════════════════════════════════════════════════ */
function amSwitchTab(tab) {
    document.getElementById("amTabLogin").classList.toggle("am-active", tab === "login");
    document.getElementById("amTabRegister").classList.toggle("am-active", tab === "register");
    document.getElementById("amLoginForm").classList.toggle("am-hidden", tab !== "login");
    document.getElementById("amRegisterForm").classList.toggle("am-hidden", tab !== "register");
    document.getElementById("amSuccessState").style.display = "none";
    amClearMsg();
}
window.amSwitchTab = amSwitchTab;

function amShowMsg(text, type = "error") {
    const el = document.getElementById("amMsg");
    el.textContent = text;
    el.className   = `am-msg am-show am-${type}`;
}

function amClearMsg() {
    const el = document.getElementById("amMsg");
    if (el) { el.className = "am-msg"; el.textContent = ""; }
}

function showAmSuccess(subText, onContinue) {
    document.getElementById("amLoginForm").classList.add("am-hidden");
    document.getElementById("amRegisterForm").classList.add("am-hidden");
    document.getElementById("amMsg").className = "am-msg";
    document.getElementById("amSuccessSub").textContent = subText;

    const ss = document.getElementById("amSuccessState");
    ss.style.display = "block";

    document.getElementById("amContinueBtn").onclick = () => {
        if (typeof onContinue === "function") onContinue();
    };
}

/* ══════════════════════════════════════════════════════════
   BUKA / TUTUP MODAL
   ══════════════════════════════════════════════════════════ */
window.openAuthModal = function(opts = {}) {
    createAuthModal();

    const overlay = document.getElementById("auth-modal-overlay");

    /* Reset state */
    amSwitchTab(opts.tab || "login");
    amClearMsg();
    document.getElementById("amSuccessState").style.display = "none";
    document.getElementById("amLoginForm").classList.remove("am-hidden");
    document.getElementById("amRegisterForm").classList.add("am-hidden");
    if (opts.tab === "register") {
        document.getElementById("amLoginForm").classList.add("am-hidden");
        document.getElementById("amRegisterForm").classList.remove("am-hidden");
        document.getElementById("amTabLogin").classList.remove("am-active");
        document.getElementById("amTabRegister").classList.add("am-active");
    }

    /* Hint text (misal: "Login dulu untuk beli paket") */
    const hint = document.getElementById("amLoginHint");
    if (opts.hint) {
        hint.innerHTML = opts.hint;
        hint.style.display = "block";
    } else {
        hint.style.display = "none";
    }

    /* Callback setelah login */
    _onLoginSuccess = opts.onSuccess || null;

    /* Tampilkan */
    overlay.classList.add("am-show");
    document.body.style.overflow = "hidden";
};

window.closeAuthModal = function() {
    const overlay = document.getElementById("auth-modal-overlay");
    if (!overlay) return;
    overlay.classList.remove("am-show");
    document.body.style.overflow = "";
    _onLoginSuccess = null;
};

/* ══════════════════════════════════════════════════════════
   UPDATE NAVBAR AUTH BUTTON
   ══════════════════════════════════════════════════════════ */
function updateNavAuth(user) {
    const btn = document.getElementById("navAuthBtn");
    if (!btn) return;

    if (user) {
        const name  = user.user_metadata?.full_name || user.email;
        const initial = name.charAt(0).toUpperCase();
        btn.innerHTML = `
            <div class="nav-user-avatar">${initial}</div>
            <span>${name.split(' ')[0]}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        `;
        btn.title = "Profil & Logout";
    } else {
        btn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Masuk</span>
        `;
        btn.title = "Login / Daftar";
    }
}

/* ── Dropdown user ── */
function toggleUserDropdown(user) {
    let dd = document.getElementById("navUserDropdown");
    if (dd) { dd.classList.toggle("dd-show"); return; }

    dd = document.createElement("div");
    dd.id = "navUserDropdown";
    const name  = user.user_metadata?.full_name || user.email;
    const email = user.email;
    dd.innerHTML = `
        <div class="dd-user-info">
            <div class="dd-user-name">${name}</div>
            <div class="dd-user-email">${email}</div>
        </div>
        <div class="dd-item" onclick="window.location.href='destinasi.html'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            Destinasi
        </div>
        <div class="dd-item" onclick="window.location.href='wishlist.html'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            Wishlist Saya
        </div>
        <div class="dd-item dd-logout" id="ddLogoutBtn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Keluar
        </div>
    `;
    /* Posisi relatif terhadap tombol */
    const wrap = document.querySelector(".dd-nav-wrap");
    if (wrap) {
        wrap.appendChild(dd);
    } else {
        document.body.appendChild(dd);
    }
    setTimeout(() => dd.classList.add("dd-show"), 10);

    document.getElementById("ddLogoutBtn").addEventListener("click", async () => {
        await sbAuth.auth.signOut();
        window.currentUser = null;
        dd.remove();
        updateNavAuth(null);
        sessionStorage.removeItem("activePaket");
    });

    /* Tutup dropdown kalau klik di luar */
    setTimeout(() => {
        document.addEventListener("click", function closeDD(ev) {
            if (!dd.contains(ev.target) && ev.target !== document.getElementById("navAuthBtn")) {
                dd.classList.remove("dd-show");
                document.removeEventListener("click", closeDD);
            }
        });
    }, 50);
}

/* ══════════════════════════════════════════════════════════
   INJECT TOMBOL AUTH DI NAVBAR
   ══════════════════════════════════════════════════════════ */
function injectNavAuthButton() {
    const navRight = document.querySelector(".nav-right");
    if (!navRight || document.getElementById("navAuthBtn")) return;

    /* Bungkus dalam div relatif untuk dropdown */
    const wrap = document.createElement("div");
    wrap.className = "dd-nav-wrap";
    wrap.style.position = "relative";

    const btn = document.createElement("button");
    btn.id = "navAuthBtn";
    btn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Masuk</span>
    `;
    btn.title = "Login / Daftar";

    btn.addEventListener("click", () => {
        if (window.currentUser) {
            toggleUserDropdown(window.currentUser);
        } else {
            openAuthModal();
        }
    });

    wrap.appendChild(btn);

    /* Sisipkan sebelum navToggle agar urutan tetap bagus */
    const toggle = document.getElementById("navToggle");
    if (toggle) {
        navRight.insertBefore(wrap, toggle);
    } else {
        navRight.appendChild(wrap);
    }
}

/* ══════════════════════════════════════════════════════════
   GATE PAKET: cek login sebelum beli paket
   ══════════════════════════════════════════════════════════ */
window.requireLoginForPaket = function(pkgAction) {
    if (window.currentUser) {
        pkgAction();
    } else {
        openAuthModal({
            hint: '<strong>🔐 Perlu Login</strong> — Masuk atau daftar dulu untuk membeli paket Voyager.',
            onSuccess: pkgAction,
        });
    }
};

/* ══════════════════════════════════════════════════════════
   INIT: cek sesi aktif saat halaman load
   ══════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", async () => {
    injectNavAuthButton();

    const { data } = await sbAuth.auth.getSession();
    if (data.session) {
        window.currentUser = data.session.user;
        updateNavAuth(data.session.user);
    }

    /* Listen perubahan auth (login/logout dari tab lain, dll) */
    sbAuth.auth.onAuthStateChange((_event, session) => {
        window.currentUser = session?.user || null;
        updateNavAuth(window.currentUser);
    });
});