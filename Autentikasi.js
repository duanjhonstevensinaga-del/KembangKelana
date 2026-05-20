// ── auth.js ─────────────────────────────────────────────
// Autentikasi dengan Supabase Auth (tanpa Laravel)
// ─────────────────────────────────────────────────────────

const SUPABASE_URL      = "https://fvyjlwwurapxbddakdpq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eWpsd3d1cmFweGJkZGFrZHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNjkxMjUsImV4cCI6MjA5NDY0NTEyNX0.76JVhpxtplY4B0dY7VhBmh2XP_Mzooi84yPA6-vNtb0";

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── REDIRECT JIKA SUDAH LOGIN ──
sb.auth.getSession().then(({ data }) => {
    if (data.session) {
        // Sudah login → langsung ke destinasi
        window.location.href = "destinasi.html";
    }
});

// ── SWITCH TAB ──
function switchTab(tab) {
    document.getElementById("tabLogin").classList.toggle("active", tab === "login");
    document.getElementById("tabRegister").classList.toggle("active", tab === "register");
    document.getElementById("loginForm").classList.toggle("hidden", tab !== "login");
    document.getElementById("registerForm").classList.toggle("hidden", tab !== "register");
    clearMsg();
}

// ── SHOW MESSAGE ──
function showMsg(text, type = "error") {
    const el = document.getElementById("authMsg");
    el.textContent = text;
    el.className   = `auth-msg show ${type}`;
}

function clearMsg() {
    const el = document.getElementById("authMsg");
    el.className = "auth-msg";
    el.textContent = "";
}

// ── LOGIN ──
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMsg();

    const email    = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const btn      = document.getElementById("btnLogin");

    btn.disabled    = true;
    btn.textContent = "Masuk...";

    const { data, error } = await sb.auth.signInWithPassword({ email, password });

    btn.disabled    = false;
    btn.textContent = "Masuk";

    if (error) {
        showMsg("❌ " + (error.message === "Invalid login credentials"
            ? "Email atau password salah."
            : error.message));
        return;
    }

    // Cek apakah admin
    const role = data.user?.user_metadata?.role;
    showMsg("✅ Berhasil masuk! Mengalihkan...", "success");

    setTimeout(() => {
        window.location.href = "destinasi.html";
    }, 900);
});

// ── REGISTER ──
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMsg();

    const name     = document.getElementById("regName").value.trim();
    const email    = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirm  = document.getElementById("regPasswordConfirm").value;
    const btn      = document.getElementById("btnRegister");

    if (password !== confirm) {
        showMsg("❌ Password dan konfirmasi password tidak cocok.");
        return;
    }

    btn.disabled    = true;
    btn.textContent = "Membuat akun...";

    const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: name, role: "user" }  // default role: user
        }
    });

    btn.disabled    = false;
    btn.textContent = "Buat Akun";

    if (error) {
        showMsg("❌ " + error.message);
        return;
    }

    // Sembunyikan form, tampilkan success state
    document.getElementById("registerForm").classList.add("hidden");
    document.getElementById("authMsg").className = "auth-msg";

    const successState = document.getElementById("successState");
    successState.classList.add("show");

    // Jika email confirmation dinonaktifkan di Supabase, user langsung aktif
    if (data.session) {
        document.getElementById("successSubtext").textContent =
            "Akun kamu langsung aktif. Selamat jelajahi Bandung!";
    }
});