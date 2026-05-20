/* ══════════════════════════════════════════════════════════
   script_patch.js — Paket Voyager: Bronze / Silver / Gold
   Admin WA: 0838-6547-3781
   Admin Email: KembangKelana@gmail.com
   ══════════════════════════════════════════════════════════ */

const ADMIN_WA    = "6283865473781";
const ADMIN_EMAIL = "KembangKelana@gmail.com";

/* ── State paket yang sudah dibeli (simpan di sessionStorage) ── */
let activePaket = sessionStorage.getItem("activePaket") || null; // "bronze"|"silver"|"gold"|null

/* ── Definisi paket ── */
const PAKETS = {
    bronze: {
        nama: "Bronze",
        harga: 5000,
        warna: "#cd7f32",
        gradien: "linear-gradient(135deg,#f5deb3 0%,#cd7f32 100%)",
        emoji: "🥉",
        fitur: [
            "📅 Jadwal Perjalanan (Timeline pagi – malam)",
            "⏱️ Estimasi Durasi Wisata per tempat",
            "🏘️ Rekomendasi Kawasan Menginap",
        ],
        tidakAda: [
            "🗺️ Peta & Rute Teroptimasi",
            "🚦 Prediksi Macet & Jam Sibuk",
            "🔗 Link Google Maps & Info Tiket",
            "☀️ Perkiraan Cuaca & Alternatif",
            "🍜 Kuliner Hidden Gems & Tips Lokal",
        ],
        punya_peta: false,
    },
    silver: {
        nama: "Silver",
        harga: 10000,
        warna: "#8aa3b0",
        gradien: "linear-gradient(135deg,#e0ecf0 0%,#8aa3b0 100%)",
        emoji: "🥈",
        fitur: [
            "📅 Jadwal Perjalanan (Timeline pagi – malam)",
            "⏱️ Estimasi Durasi Wisata per tempat",
            "🗺️ Rute Teroptimasi (Anti-Muter)",
            "🚦 Prediksi Macet & Jam Sibuk",
            "🔗 Link Google Maps & Info Tiket",
            "🏨 Rekomendasi Hotel & Homestay Pilihan",
        ],
        tidakAda: [
            "☀️ Perkiraan Cuaca & Wisata Alternatif",
            "🍜 Kuliner Hidden Gems & Tips Lokal",
            "🏅 Premium & Custom Accommodation",
        ],
        punya_peta: true,
    },
    gold: {
        nama: "Gold",
        harga: 15000,
        warna: "#c5a21a",
        gradien: "linear-gradient(135deg,#fff3b0 0%,#c5a21a 100%)",
        emoji: "🥇",
        fitur: [
            "📅 Jadwal Perjalanan (Timeline pagi – malam)",
            "⏱️ Estimasi Durasi Wisata per tempat",
            "🗺️ Rute Teroptimasi (Anti-Muter)",
            "🚦 Prediksi Macet & Jam Sibuk",
            "🔗 Link Google Maps & Info Tiket",
            "☀️ Perkiraan Cuaca & Wisata Alternatif",
            "🍜 Kuliner Hidden Gems & Tips Lokal",
            "🏅 Premium & Custom Accommodation",
        ],
        tidakAda: [],
        punya_peta: true,
    }
};

/* ══════════════════════════════════════════════════════════
   Helper: format rupiah
   ══════════════════════════════════════════════════════════ */
const fmtRp = n => "Rp " + new Intl.NumberFormat("id-ID").format(n);

/* ══════════════════════════════════════════════════════════
   1. MODAL PILIH PAKET
   ══════════════════════════════════════════════════════════ */
function openPackageModal() {
    document.getElementById("pkg-modal")?.remove();

    const modal = document.createElement("div");
    modal.id = "pkg-modal";
    modal.style.cssText = `
        position:fixed;inset:0;z-index:99999;
        display:flex;align-items:center;justify-content:center;
        background:rgba(0,0,0,0.55);backdrop-filter:blur(6px);
        font-family:'DM Sans',sans-serif;padding:1rem;
    `;

    modal.innerHTML = `
    <div id="pkg-card" style="
        background:#fff;border-radius:24px;padding:32px 28px 28px;
        max-width:820px;width:100%;box-shadow:0 24px 80px rgba(0,0,0,0.22);
        position:relative;max-height:90vh;overflow-y:auto;
    ">
        <button id="pkg-close" style="position:absolute;top:16px;right:20px;background:none;border:none;cursor:pointer;font-size:22px;color:#aaa;line-height:1;">✕</button>
        <div style="text-align:center;margin-bottom:24px;">
            <div style="font-size:11px;font-weight:800;letter-spacing:1.5px;color:#75a9b3;text-transform:uppercase;margin-bottom:4px;">Voyager</div>
            <h2 style="font-size:22px;font-weight:800;color:#222225;margin:0 0 6px;">Pilih Paket Itinerary Kamu ✈️</h2>
            <p style="font-size:13px;color:#999;margin:0;">Setelah bayar, kamu akan dikonfirmasi via email & bisa langsung akses paket.</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
            ${Object.entries(PAKETS).map(([key, p]) => `
            <div class="pkg-item" data-pkg="${key}" style="
                border:2px solid ${activePaket===key ? p.warna : '#eee'};
                border-radius:18px;padding:20px 16px;cursor:pointer;
                transition:border-color 0.2s,box-shadow 0.2s;
                background:${activePaket===key ? '#fafeff' : '#fff'};
                position:relative;
            ">
                ${activePaket===key ? `<div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:${p.warna};color:#fff;font-size:10px;font-weight:800;padding:2px 12px;border-radius:20px;white-space:nowrap;">✓ AKTIF</div>` : ''}
                <div style="font-size:28px;margin-bottom:6px;text-align:center;">${p.emoji}</div>
                <div style="text-align:center;margin-bottom:12px;">
                    <div style="font-size:18px;font-weight:800;color:${p.warna};">${p.nama}</div>
                    <div style="font-size:22px;font-weight:800;color:#222225;">${fmtRp(p.harga)}</div>
                    <div style="font-size:10px;color:#bbb;">sekali bayar</div>
                </div>
                <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px;">
                    ${p.fitur.map(f=>`<div style="font-size:11px;color:#444;display:flex;gap:6px;align-items:flex-start;"><span style="flex-shrink:0;">${f.split(' ')[0]}</span><span>${f.split(' ').slice(1).join(' ')}</span></div>`).join('')}
                    ${p.tidakAda.map(f=>`<div style="font-size:11px;color:#ccc;text-decoration:line-through;display:flex;gap:6px;"><span style="flex-shrink:0;">${f.split(' ')[0]}</span><span>${f.split(' ').slice(1).join(' ')}</span></div>`).join('')}
                </div>
                ${activePaket===key
                    ? `<button onclick="openWhatsApp('${key}')" style="width:100%;padding:10px;border-radius:10px;border:none;background:#25d366;color:#fff;font-size:12px;font-weight:800;cursor:pointer;">💬 Chat Admin WA</button>`
                    : `<button class="pkg-buy-btn" data-pkg="${key}" style="width:100%;padding:10px;border-radius:10px;border:none;background:${p.warna};color:#fff;font-size:13px;font-weight:800;cursor:pointer;transition:opacity 0.2s;">Beli Sekarang</button>`
                }
            </div>`).join('')}
        </div>
        <p style="text-align:center;font-size:10px;color:#ccc;margin-top:16px;">
            Setelah klik "Beli Sekarang", kamu akan diarahkan kirim bukti bayar ke email admin.<br>
            Admin akan konfirmasi & kamu bisa akses paket yang dibeli.
        </p>
    </div>`;

    document.body.appendChild(modal);

    /* Animasi masuk */
    if (typeof gsap !== "undefined") {
        gsap.fromTo("#pkg-card", {opacity:0,y:30,scale:0.96},{opacity:1,y:0,scale:1,duration:0.4,ease:"back.out(1.7)"});
    }

    /* Tombol tutup */
    modal.querySelector("#pkg-close").addEventListener("click", closePkgModal);
    modal.addEventListener("click", e => { if (e.target === modal) closePkgModal(); });

    /* Tombol beli */
    modal.querySelectorAll(".pkg-buy-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            e.stopPropagation();
            openPaymentModal(btn.dataset.pkg);
        });
    });
}

function closePkgModal() {
    const modal = document.getElementById("pkg-modal");
    if (!modal) return;
    if (typeof gsap !== "undefined") {
        gsap.to("#pkg-card", {opacity:0,y:20,scale:0.95,duration:0.25,onComplete:()=>modal.remove()});
    } else {
        modal.remove();
    }
}

/* ══════════════════════════════════════════════════════════
   2. MODAL PEMBAYARAN — dengan tab Transfer & QR Code
   ══════════════════════════════════════════════════════════ */

/* ── Path QR per paket. Admin cukup taruh file di folder qr/
      dengan nama qr-bronze.png / qr-silver.png / qr-gold.png  ── */
const QR_PATHS = {
    bronze : "qr/qr-bronze.png",
    silver : "qr/qr-silver.png",
    gold   : "qr/qr-gold.png",
};

/* ── Style khusus modal pembayaran (inject sekali) ── */
(function injectPayStyles() {
    if (document.getElementById("pay-style")) return;
    const s = document.createElement("style");
    s.id = "pay-style";
    s.textContent = `
    /* ── Tab Pembayaran ── */
    .pay-method-tabs {
        display:flex; gap:6px;
        background:#f4f8f9; border-radius:10px; padding:4px;
        margin-bottom:18px;
    }
    .pay-method-tab {
        flex:1; text-align:center; padding:9px 8px;
        border-radius:8px; font-size:12px; font-weight:700;
        color:#8aabb3; cursor:pointer;
        transition:all .2s; user-select:none;
        font-family:'DM Sans',sans-serif;
        border:none; background:transparent;
    }
    .pay-method-tab.pmt-active {
        background:#fff; color:#2c6e7a;
        box-shadow:0 2px 10px rgba(44,110,122,.14);
    }
    .pay-panel { display:none; }
    .pay-panel.pmt-show { display:block; }

    /* ── QR area ── */
    .qr-box {
        display:flex; flex-direction:column; align-items:center;
        gap:12px; padding:20px 16px;
        background:linear-gradient(145deg,#f0f8fa,#e6f2f5);
        border-radius:16px; border:1.5px dashed #b4d8e0;
        margin-bottom:16px;
    }
    .qr-img-wrap {
        width:180px; height:180px;
        border-radius:14px; overflow:hidden;
        background:#fff;
        box-shadow:0 4px 24px rgba(44,110,122,.15);
        display:flex; align-items:center; justify-content:center;
        position:relative;
    }
    .qr-img-wrap img {
        width:100%; height:100%; object-fit:contain;
        padding:10px;
    }
    .qr-placeholder {
        display:flex; flex-direction:column; align-items:center;
        gap:8px; color:#aac8d0; font-family:'DM Sans',sans-serif;
        font-size:12px; text-align:center; padding:16px;
    }
    .qr-placeholder svg { opacity:.5; }
    .qr-label {
        font-size:11px; font-weight:700; color:#75a9b3;
        letter-spacing:.5px; text-transform:uppercase;
        font-family:'DM Sans',sans-serif;
    }
    .qr-nominal {
        font-size:22px; font-weight:800; color:#222225;
        font-family:'DM Sans',sans-serif; letter-spacing:-.3px;
    }
    .qr-note {
        font-size:11px; color:#9abcc4;
        font-family:'DM Sans',sans-serif; text-align:center;
        line-height:1.5;
    }
    .qr-scan-badge {
        display:inline-flex; align-items:center; gap:5px;
        background:#2c6e7a; color:#fff; border-radius:20px;
        padding:5px 12px; font-size:11px; font-weight:700;
        font-family:'DM Sans',sans-serif;
        animation: qrPulse 2s infinite;
    }
    @keyframes qrPulse {
        0%,100% { box-shadow:0 0 0 0 rgba(44,110,122,.35); }
        50%      { box-shadow:0 0 0 7px rgba(44,110,122,0); }
    }

    /* ── Transfer info box ── */
    .transfer-info-box {
        background:#fff; border:1px solid #e2eff2;
        border-radius:10px; padding:10px 14px;
        display:flex; justify-content:space-between; align-items:center;
        margin-bottom:8px;
    }
    .tib-label { font-size:11px; color:#9abcc4; font-family:'DM Sans',sans-serif; }
    .tib-value { font-size:13px; font-weight:800; color:#1a3a40; font-family:'DM Sans',sans-serif; }
    .copy-btn {
        background:#e8f4f7; border:none; border-radius:6px;
        padding:4px 9px; font-size:10px; font-weight:700;
        color:#2c6e7a; cursor:pointer; font-family:'DM Sans',sans-serif;
        transition:background .15s;
    }
    .copy-btn:hover { background:#d0eaf0; }
    .copy-btn.copied { background:#d0f0de; color:#1e7e4e; }
    `;
    document.head.appendChild(s);
})();

function openPaymentModal(pkgKey) {
    closePkgModal();
    const p = PAKETS[pkgKey];
    document.getElementById("pay-modal")?.remove();

    const qrPath     = QR_PATHS[pkgKey] || "";
    const emailBody  = encodeURIComponent(
        `Halo Admin,\n\nSaya ingin membeli Paket ${p.nama} (${fmtRp(p.harga)}).\n\nNama  :\nNo. HP:\n\nTerlampir bukti transfer/screenshot QR.\n\nTerima kasih.`
    );
    const mailtoHref = `mailto:${ADMIN_EMAIL}?subject=Pembayaran%20Paket%20${encodeURIComponent(p.nama)}%20Voyager%20Kisah%20Anda&body=${emailBody}`;

    const modal = document.createElement("div");
    modal.id = "pay-modal";
    modal.style.cssText = `
        position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;
        background:rgba(0,0,0,.55);backdrop-filter:blur(6px);
        font-family:'DM Sans',sans-serif;padding:1rem;
    `;

    modal.innerHTML = `
    <div id="pay-card" style="
        background:#fff;border-radius:24px;padding:28px 26px 24px;
        max-width:430px;width:100%;
        box-shadow:0 24px 80px rgba(0,0,0,.22);position:relative;
        max-height:92vh;overflow-y:auto;
    ">
        <button id="pay-close" style="position:absolute;top:14px;right:16px;background:none;border:none;cursor:pointer;font-size:20px;color:#bbb;line-height:1;">✕</button>

        <!-- Header paket -->
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;padding-bottom:18px;border-bottom:1.5px solid #f0f7f9;">
            <div style="font-size:40px;line-height:1;">${p.emoji}</div>
            <div>
                <div style="font-size:10px;font-weight:800;letter-spacing:2px;color:${p.warna};text-transform:uppercase;margin-bottom:2px;">Paket ${p.nama}</div>
                <div style="font-size:24px;font-weight:900;color:#222225;line-height:1;">${fmtRp(p.harga)}</div>
                <div style="font-size:10px;color:#aaa;margin-top:2px;">sekali bayar · akses selamanya</div>
            </div>
        </div>

        <!-- Tab pilih metode -->
        <div style="font-size:11px;font-weight:800;color:#75a9b3;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;">Pilih Metode Pembayaran</div>
        <div class="pay-method-tabs">
            <button class="pay-method-tab pmt-active" id="pmtTabQR" onclick="payTabSwitch('qr')">
                <span style="font-size:16px;">📱</span><br>Scan QR Code
            </button>
            <button class="pay-method-tab" id="pmtTabTransfer" onclick="payTabSwitch('transfer')">
                <span style="font-size:16px;">🏦</span><br>Transfer Bank
            </button>
        </div>

        <!-- ═══ PANEL QR ═══ -->
        <div class="pay-panel pmt-show" id="payPanelQR">
            <div class="qr-box">
                <div class="qr-label">Scan & Bayar Langsung</div>
                <div class="qr-img-wrap" id="qrImgWrap">
                    <!-- QR diisi JS saat load -->
                    <div class="qr-placeholder" id="qrPlaceholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#b0cfd8" stroke-width="1.5">
                            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                            <rect x="3" y="14" width="7" height="7" rx="1"/>
                            <rect x="14" y="14" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/>
                            <rect x="14" y="18" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/>
                        </svg>
                        <span>Memuat QR Code...</span>
                    </div>
                </div>
                <div class="qr-nominal">${fmtRp(p.harga)}</div>
                <div class="qr-scan-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    Scan dengan aplikasi bank / dompet digital
                </div>
                <div class="qr-note">QRIS · GoPay · OVO · Dana · ShopeePay · M-Banking<br>Pastikan nominal sesuai sebelum konfirmasi.</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;">
                <a href="${mailtoHref}" style="display:flex;align-items:center;justify-content:center;gap:8px;background:#1a73e8;color:#fff;border-radius:12px;padding:12px;font-size:13px;font-weight:800;text-decoration:none;transition:background .2s;" onmouseover="this.style.background='#1558b0'" onmouseout="this.style.background='#1a73e8'">
                    ✉️ Kirim Screenshot Bukti ke Admin
                </a>
                <button onclick="simulatePaymentConfirm('${pkgKey}')" style="background:#f5f5f5;color:#777;border:none;border-radius:12px;padding:10px;font-size:12px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;">
                    ✅ Saya sudah bayar — Konfirmasi (Demo)
                </button>
            </div>
        </div>

        <!-- ═══ PANEL TRANSFER ═══ -->
        <div class="pay-panel" id="payPanelTransfer">
            <div style="background:#f7fbfc;border-radius:14px;padding:16px;margin-bottom:16px;">
                <div style="font-size:10px;font-weight:800;color:#75a9b3;text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px;">Rekening Tujuan</div>

                <div class="transfer-info-box">
                    <div><div class="tib-label">Bank</div><div class="tib-value">BCA</div></div>
                </div>
                <div class="transfer-info-box">
                    <div><div class="tib-label">No. Rekening</div><div class="tib-value" id="tib-norek">1234567890</div></div>
                    <button class="copy-btn" onclick="copyText('tib-norek', this)">Salin</button>
                </div>
                <div class="transfer-info-box">
                    <div><div class="tib-label">Atas Nama</div><div class="tib-value">Kisah Anda Bandung</div></div>
                </div>
                <div class="transfer-info-box">
                    <div><div class="tib-label">Jumlah Transfer</div><div class="tib-value" id="tib-nominal">${fmtRp(p.harga)}</div></div>
                    <button class="copy-btn" onclick="copyText('tib-nominal', this)">Salin</button>
                </div>
            </div>

            <div style="background:#fff9ee;border:1.5px solid #fce18a;border-radius:10px;padding:10px 14px;margin-bottom:14px;">
                <div style="font-size:11px;font-weight:700;color:#b8860b;margin-bottom:4px;">⚠️ Penting</div>
                <div style="font-size:11px;color:#8a6d1a;line-height:1.6;">
                    Transfer tepat sesuai nominal. Kirim bukti transfer ke email admin beserta nama dan nomor HP kamu.
                </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:8px;">
                <a href="${mailtoHref}" style="display:flex;align-items:center;justify-content:center;gap:8px;background:#1a73e8;color:#fff;border-radius:12px;padding:12px;font-size:13px;font-weight:800;text-decoration:none;transition:background .2s;" onmouseover="this.style.background='#1558b0'" onmouseout="this.style.background='#1a73e8'">
                    ✉️ Kirim Bukti Transfer ke Admin
                </a>
                <button onclick="openWhatsApp('${pkgKey}')" style="display:flex;align-items:center;justify-content:center;gap:6px;width:100%;background:#25d366;color:#fff;border:none;border-radius:12px;padding:12px;font-size:13px;font-weight:800;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background .2s;" onmouseover="this.style.background='#1da953'" onmouseout="this.style.background='#25d366'">
                    💬 Konfirmasi via WhatsApp Admin
                </button>
                <button onclick="simulatePaymentConfirm('${pkgKey}')" style="background:#f5f5f5;color:#777;border:none;border-radius:12px;padding:10px;font-size:12px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;">
                    ✅ Saya sudah bayar — Konfirmasi (Demo)
                </button>
            </div>
        </div>

        <p style="text-align:center;font-size:10px;color:#ccc;margin-top:14px;">
            *Akses paket dibuka setelah admin konfirmasi pembayaran.
        </p>
    </div>`;

    document.body.appendChild(modal);

    /* Animasi masuk */
    if (typeof gsap !== "undefined") {
        gsap.fromTo("#pay-card",{opacity:0,y:30,scale:.96},{opacity:1,y:0,scale:1,duration:.4,ease:"back.out(1.7)"});
    }

    modal.querySelector("#pay-close").addEventListener("click", ()=>closeModal("pay-modal"));
    modal.addEventListener("click", e=>{ if(e.target===modal) closeModal("pay-modal"); });

    /* Load gambar QR */
    loadQRImage(pkgKey);
}

/* ── Switch tab metode bayar ── */
window.payTabSwitch = function(tab) {
    document.getElementById("pmtTabQR").classList.toggle("pmt-active",       tab==="qr");
    document.getElementById("pmtTabTransfer").classList.toggle("pmt-active",  tab==="transfer");
    document.getElementById("payPanelQR").classList.toggle("pmt-show",       tab==="qr");
    document.getElementById("payPanelTransfer").classList.toggle("pmt-show", tab==="transfer");
};

/* ── Load QR image; tampilkan placeholder jika belum ada ── */
function loadQRImage(pkgKey) {
    const wrap = document.getElementById("qrImgWrap");
    const placeholder = document.getElementById("qrPlaceholder");
    if (!wrap) return;

    const img = new Image();
    img.onload = () => {
        if (placeholder) placeholder.remove();
        img.style.cssText = "width:100%;height:100%;object-fit:contain;padding:10px;";
        wrap.appendChild(img);
    };
    img.onerror = () => {
        if (placeholder) {
            placeholder.innerHTML = `
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#c0d8de" stroke-width="1.5">
                    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/>
                    <rect x="14" y="18" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/>
                </svg>
                <span style="font-size:11px;color:#aac8d0;font-family:'DM Sans',sans-serif;text-align:center;line-height:1.5;">
                    QR belum dipasang admin.<br>
                    <a href="qr-template.html" target="_blank" style="color:#75a9b3;font-weight:700;">Pasang QR →</a>
                </span>`;
        }
    };
    img.src = QR_PATHS[pkgKey] || "";
    img.alt = `QR Paket ${pkgKey}`;
}

/* ── Salin teks ke clipboard ── */
window.copyText = function(elId, btn) {
    const el = document.getElementById(elId);
    if (!el) return;
    navigator.clipboard.writeText(el.textContent.replace(/[^\d]/g,"") || el.textContent).then(() => {
        btn.textContent = "✓ Disalin";
        btn.classList.add("copied");
        setTimeout(()=>{ btn.textContent="Salin"; btn.classList.remove("copied"); }, 2000);
    });
};

/* ══════════════════════════════════════════════════════════
   3. SIMULASI KONFIRMASI PEMBAYARAN (demo)
   ══════════════════════════════════════════════════════════ */
window.simulatePaymentConfirm = function(pkgKey) {
    closeModal("pay-modal");
    activePaket = pkgKey;
    sessionStorage.setItem("activePaket", pkgKey);

    /* Tampilkan peta jika silver/gold */
    refreshMapLock();

    /* Tampilkan badge + tombol "My Paket" di voyager */
    showActivePaketBadge();
    injectMyPaketButton();

    /* Modal sukses dengan detail hak paket */
    showSuccessWithBenefits(pkgKey);

    /* ── Setelah konfirmasi, kirim pesan WA ke admin beserta detail voyager ── */
    setTimeout(() => openWhatsApp(pkgKey), 800);
};

/* ── Modal Sukses + Detail Hak Paket ── */
function showSuccessWithBenefits(pkgKey) {
    document.getElementById("success-modal")?.remove();
    const p = PAKETS[pkgKey];

    /* Warna tema per paket */
    const tema = {
        bronze: { bg:"#fdf6ec", border:"#e8c98a", header:"linear-gradient(135deg,#f5deb3,#cd7f32)", badgeBg:"#cd7f32" },
        silver: { bg:"#f0f7fa", border:"#a8c8d8", header:"linear-gradient(135deg,#daeaf2,#8aa3b0)", badgeBg:"#8aa3b0" },
        gold:   { bg:"#fffbee", border:"#e8d06a", header:"linear-gradient(135deg,#fff3a0,#c5a21a)", badgeBg:"#c5a21a" },
    }[pkgKey];

    /* Semua hak paket dengan detail deskripsi */
    const HAK_DETAIL = {
        bronze: [
            { icon:"📅", judul:"Jadwal Perjalanan", desc:"Timeline kasaran dari pagi sampai malam — kamu tahu harus ke mana & kapan." },
            { icon:"⏱️", judul:"Estimasi Durasi Wisata", desc:"Info standar berapa lama waktu ideal di tiap tempat supaya nggak keburu-buru." },
            { icon:"🏘️", judul:"Rekomendasi Kawasan Menginap", desc:"Saran kawasan strategis di Bandung yang dekat destinasi wisata pilihanmu." },
            { icon:"💬", judul:"Chat Admin WhatsApp", desc:"Langsung terhubung ke admin buat tanya-jawab seputar perjalananmu." },
        ],
        silver: [
            { icon:"📅", judul:"Jadwal Perjalanan", desc:"Timeline kasaran dari pagi sampai malam — kamu tahu harus ke mana & kapan." },
            { icon:"⏱️", judul:"Estimasi Durasi Wisata", desc:"Info standar berapa lama waktu ideal di tiap tempat." },
            { icon:"🗺️", judul:"Rute Teroptimasi (Anti-Muter)", desc:"Sistem otomatis mengurutkan destinasi berdasarkan jarak terdekat. Hemat waktu & bensin!" },
            { icon:"🚦", judul:"Prediksi Macet & Jam Sibuk", desc:"Info jalur macet di jam tertentu & perkiraan waktu tempuh antar lokasi." },
            { icon:"🔗", judul:"Link Navigasi Maps & Info Tiket", desc:"Link langsung ke Google Maps + info harga tiket masuk terbaru tiap tempat." },
            { icon:"🏨", judul:"Rekomendasi Hotel & Homestay Pilihan", desc:"Daftar hotel & homestay terpilih yang nyaman & sesuai budget." },
            { icon:"💬", judul:"Chat Admin WhatsApp", desc:"Langsung terhubung ke admin buat tanya-jawab seputar perjalananmu." },
        ],
        gold: [
            { icon:"📅", judul:"Jadwal Perjalanan", desc:"Timeline kasaran dari pagi sampai malam — kamu tahu harus ke mana & kapan." },
            { icon:"⏱️", judul:"Estimasi Durasi Wisata", desc:"Info standar berapa lama waktu ideal di tiap tempat." },
            { icon:"🗺️", judul:"Rute Teroptimasi (Anti-Muter)", desc:"Sistem otomatis mengurutkan destinasi berdasarkan jarak terdekat." },
            { icon:"🚦", judul:"Prediksi Macet & Jam Sibuk", desc:"Info jalur macet di jam tertentu & perkiraan waktu tempuh antar lokasi." },
            { icon:"🔗", judul:"Link Navigasi Maps & Info Tiket", desc:"Link langsung ke Google Maps + info harga tiket masuk terbaru." },
            { icon:"☀️", judul:"Perkiraan Cuaca & Wisata Alternatif", desc:"Info cuaca harian + otomatis ngasih opsi tempat indoor jika hujan atau macet parah." },
            { icon:"🍜", judul:"Kuliner Hidden Gems & Tips Lokal", desc:"Rekomendasi makanan hits terdekat + tips penting dari warga lokal Bandung." },
            { icon:"🏅", judul:"Premium & Custom Accommodation", desc:"Rekomendasi hotel bintang 5 & akomodasi premium yang bisa dikustomisasi." },
            { icon:"💬", judul:"Chat Admin WhatsApp", desc:"Prioritas respon dari admin untuk semua kebutuhanmu." },
        ],
    };

    const hakList = HAK_DETAIL[pkgKey] || [];

    const modal = document.createElement("div");
    modal.id = "success-modal";
    modal.style.cssText = `
        position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;
        background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);font-family:'DM Sans',sans-serif;padding:1rem;
    `;

    modal.innerHTML = `
    <div id="success-card" style="
        background:${tema.bg};border-radius:24px;padding:0;
        max-width:480px;width:100%;box-shadow:0 28px 90px rgba(0,0,0,0.25);
        position:relative;max-height:90vh;overflow:hidden;display:flex;flex-direction:column;
    ">
        <!-- HEADER GRADIENT -->
        <div style="background:${tema.header};padding:28px 28px 22px;position:relative;flex-shrink:0;">
            <button id="success-close-x" style="
                position:absolute;top:14px;right:16px;background:rgba(255,255,255,0.35);
                border:none;cursor:pointer;font-size:16px;color:#fff;line-height:1;
                width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;
            ">✕</button>
            <div style="display:flex;align-items:center;gap:14px;">
                <div style="font-size:52px;line-height:1;">${p.emoji}</div>
                <div>
                    <div style="font-size:10px;font-weight:800;letter-spacing:2px;color:rgba(255,255,255,0.8);text-transform:uppercase;margin-bottom:3px;">Pembayaran Berhasil ✓</div>
                    <div style="font-size:22px;font-weight:900;color:#fff;line-height:1.1;">Paket ${p.nama} Aktif!</div>
                    <div style="font-size:12px;color:rgba(255,255,255,0.75);margin-top:4px;">${fmtRp(p.harga)} · sekali bayar</div>
                </div>
            </div>
            <!-- Progress bar animasi -->
            <div style="margin-top:16px;background:rgba(255,255,255,0.25);border-radius:20px;height:5px;overflow:hidden;">
                <div id="success-progress-bar" style="height:100%;width:0%;background:#fff;border-radius:20px;transition:width 1.2s ease;"></div>
            </div>
        </div>

        <!-- SCROLLABLE BODY -->
        <div style="overflow-y:auto;padding:20px 24px 24px;flex:1;">
            <!-- Judul hak -->
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
                <div style="width:3px;height:18px;background:${tema.badgeBg};border-radius:3px;flex-shrink:0;"></div>
                <div style="font-size:13px;font-weight:800;color:#222225;letter-spacing:0.3px;">Hak yang Kamu Dapatkan</div>
                <div style="flex:1;height:1px;background:#eee;margin-left:4px;"></div>
                <div style="background:${tema.badgeBg};color:#fff;font-size:10px;font-weight:800;padding:2px 10px;border-radius:20px;">${hakList.length} Fitur</div>
            </div>

            <!-- Daftar hak -->
            <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px;">
                ${hakList.map((h, i) => `
                <div class="benefit-row" style="
                    display:flex;gap:12px;align-items:flex-start;
                    background:#fff;border-radius:12px;padding:12px 14px;
                    border:1.5px solid ${tema.border};
                    opacity:0;transform:translateX(-12px);
                    transition:opacity 0.3s ease ${i * 60}ms, transform 0.3s ease ${i * 60}ms;
                ">
                    <div style="
                        width:34px;height:34px;border-radius:10px;flex-shrink:0;
                        background:${tema.bg};border:1.5px solid ${tema.border};
                        display:flex;align-items:center;justify-content:center;font-size:16px;
                    ">${h.icon}</div>
                    <div style="flex:1;min-width:0;">
                        <div style="font-size:12px;font-weight:800;color:#222225;margin-bottom:2px;">${h.judul}</div>
                        <div style="font-size:11px;color:#888;line-height:1.5;">${h.desc}</div>
                    </div>
                    <div style="color:${tema.badgeBg};font-size:14px;flex-shrink:0;margin-top:2px;">✓</div>
                </div>`).join('')}
            </div>

            <!-- CTA Buttons -->
            <div style="display:flex;flex-direction:column;gap:10px;">
                <button onclick="openWhatsApp('${pkgKey}')" style="
                    width:100%;padding:13px;border-radius:12px;border:none;
                    background:#25d366;color:#fff;font-size:14px;font-weight:800;cursor:pointer;
                    display:flex;align-items:center;justify-content:center;gap:8px;
                    transition:background 0.2s;font-family:'DM Sans',sans-serif;
                " onmouseover="this.style.background='#1da953'" onmouseout="this.style.background='#25d366'">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.856L0 24l6.335-1.509C8.05 23.447 9.987 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.896 0-3.67-.507-5.2-1.393l-.373-.222-3.862.921.938-3.77-.244-.388C2.507 15.56 2 13.843 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                    💬 Chat Admin WhatsApp Sekarang
                </button>
                <button onclick="openMyPaketPanel()" id="lihat-hak-btn" style="
                    width:100%;padding:11px;border-radius:12px;border:1.5px solid ${tema.border};
                    background:#fff;color:#555;font-size:13px;font-weight:700;cursor:pointer;
                    font-family:'DM Sans',sans-serif;transition:background 0.2s;
                " onmouseover="this.style.background='${tema.bg}'" onmouseout="this.style.background='#fff'">
                    📋 Lihat Semua Hak Paket Saya
                </button>
                <button id="success-close" style="
                    width:100%;padding:10px;border-radius:12px;border:none;
                    background:transparent;color:#bbb;font-size:12px;font-weight:600;cursor:pointer;
                    font-family:'DM Sans',sans-serif;
                ">Tutup & Mulai Rencanakan Perjalanan →</button>
            </div>
        </div>
    </div>`;

    document.body.appendChild(modal);

    if (typeof gsap !== "undefined") {
        gsap.fromTo("#success-card",{opacity:0,scale:0.88,y:24},{opacity:1,scale:1,y:0,duration:0.5,ease:"back.out(2)"});
    }

    /* Animasi progress bar */
    setTimeout(() => {
        const bar = document.getElementById("success-progress-bar");
        if (bar) bar.style.width = "100%";
    }, 100);

    /* Animasi baris benefit satu per satu */
    setTimeout(() => {
        modal.querySelectorAll(".benefit-row").forEach(row => {
            row.style.opacity = "1";
            row.style.transform = "translateX(0)";
        });
    }, 200);

    modal.querySelector("#success-close-x").addEventListener("click", ()=>closeModal("success-modal"));
    modal.querySelector("#success-close").addEventListener("click",   ()=>closeModal("success-modal"));
    modal.addEventListener("click", e=>{ if(e.target===modal) closeModal("success-modal"); });
}

/* ══════════════════════════════════════════════════════════
   3b. PANEL "MY PAKET" — bisa dibuka ulang kapan saja
   ══════════════════════════════════════════════════════════ */
window.openMyPaketPanel = function() {
    document.getElementById("success-modal")?.remove();
    document.getElementById("mypkt-modal")?.remove();
    if (!activePaket) { openPackageModal(); return; }

    const p = PAKETS[activePaket];
    const tema = {
        bronze: { bg:"#fdf6ec", border:"#e8c98a", header:"linear-gradient(135deg,#f5deb3,#cd7f32)", badgeBg:"#cd7f32" },
        silver: { bg:"#f0f7fa", border:"#a8c8d8", header:"linear-gradient(135deg,#daeaf2,#8aa3b0)", badgeBg:"#8aa3b0" },
        gold:   { bg:"#fffbee", border:"#e8d06a", header:"linear-gradient(135deg,#fff3a0,#c5a21a)", badgeBg:"#c5a21a" },
    }[activePaket];

    const HAK_SINGKAT = {
        bronze: [
            { icon:"📅", judul:"Jadwal Perjalanan", desc:"Timeline pagi – malam (kasaran)" },
            { icon:"⏱️", judul:"Estimasi Durasi Wisata", desc:"Waktu ideal di tiap tempat" },
            { icon:"🏘️", judul:"Rekomendasi Kawasan Menginap", desc:"Kawasan strategis di Bandung" },
            { icon:"💬", judul:"Chat Admin WhatsApp", desc:"Kontak langsung ke admin" },
        ],
        silver: [
            { icon:"📅", judul:"Jadwal Perjalanan", desc:"Timeline pagi – malam" },
            { icon:"⏱️", judul:"Estimasi Durasi Wisata", desc:"Waktu ideal di tiap tempat" },
            { icon:"🗺️", judul:"Rute Teroptimasi", desc:"Anti-muter, efisien & hemat waktu" },
            { icon:"🚦", judul:"Prediksi Macet", desc:"Info jalur & jam sibuk Bandung" },
            { icon:"🔗", judul:"Link Maps & Info Tiket", desc:"Google Maps + harga tiket terbaru" },
            { icon:"🏨", judul:"Rekomendasi Hotel & Homestay", desc:"Pilihan terbaik sesuai budget" },
            { icon:"💬", judul:"Chat Admin WhatsApp", desc:"Kontak langsung ke admin" },
        ],
        gold: [
            { icon:"📅", judul:"Jadwal Perjalanan", desc:"Timeline pagi – malam" },
            { icon:"⏱️", judul:"Estimasi Durasi Wisata", desc:"Waktu ideal di tiap tempat" },
            { icon:"🗺️", judul:"Rute Teroptimasi", desc:"Anti-muter, efisien & hemat waktu" },
            { icon:"🚦", judul:"Prediksi Macet", desc:"Info jalur & jam sibuk Bandung" },
            { icon:"🔗", judul:"Link Maps & Info Tiket", desc:"Google Maps + harga tiket terbaru" },
            { icon:"☀️", judul:"Cuaca & Alternatif Indoor", desc:"Info cuaca + opsi hujan/macet" },
            { icon:"🍜", judul:"Kuliner Hidden Gems", desc:"Makanan hits + tips warga lokal" },
            { icon:"🏅", judul:"Premium Accommodation", desc:"Hotel bintang 5 & custom stay" },
            { icon:"💬", judul:"Chat Admin Prioritas", desc:"Respon prioritas dari admin" },
        ],
    };

    const hakList = HAK_SINGKAT[activePaket] || [];

    const modal = document.createElement("div");
    modal.id = "mypkt-modal";
    modal.style.cssText = `
        position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;
        background:rgba(0,0,0,0.55);backdrop-filter:blur(7px);font-family:'DM Sans',sans-serif;padding:1rem;
    `;

    modal.innerHTML = `
    <div id="mypkt-card" style="
        background:${tema.bg};border-radius:24px;padding:0;
        max-width:440px;width:100%;box-shadow:0 28px 90px rgba(0,0,0,0.22);
        position:relative;max-height:88vh;overflow:hidden;display:flex;flex-direction:column;
    ">
        <!-- Header -->
        <div style="background:${tema.header};padding:22px 24px 18px;flex-shrink:0;position:relative;">
            <button id="mypkt-close-x" style="
                position:absolute;top:12px;right:14px;background:rgba(255,255,255,0.3);
                border:none;cursor:pointer;font-size:15px;color:#fff;line-height:1;
                width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;
            ">✕</button>
            <div style="display:flex;align-items:center;gap:12px;">
                <div style="font-size:40px;line-height:1;">${p.emoji}</div>
                <div>
                    <div style="font-size:9px;font-weight:800;letter-spacing:2px;color:rgba(255,255,255,0.75);text-transform:uppercase;">Paket Aktif Milikmu</div>
                    <div style="font-size:20px;font-weight:900;color:#fff;">Paket ${p.nama}</div>
                    <div style="font-size:11px;color:rgba(255,255,255,0.7);">${fmtRp(p.harga)} · ${hakList.length} fitur aktif</div>
                </div>
            </div>
        </div>

        <!-- Body -->
        <div style="overflow-y:auto;padding:18px 20px 22px;flex:1;">
            <div style="font-size:11px;font-weight:800;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">✓ Hak & Akses Kamu</div>
            <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:18px;">
                ${hakList.map(h => `
                <div style="
                    display:flex;align-items:center;gap:10px;
                    background:#fff;border-radius:10px;padding:10px 12px;
                    border:1.5px solid ${tema.border};
                ">
                    <div style="
                        width:30px;height:30px;border-radius:8px;flex-shrink:0;
                        background:${tema.bg};border:1px solid ${tema.border};
                        display:flex;align-items:center;justify-content:center;font-size:14px;
                    ">${h.icon}</div>
                    <div style="flex:1;min-width:0;">
                        <div style="font-size:12px;font-weight:800;color:#222225;">${h.judul}</div>
                        <div style="font-size:10px;color:#aaa;">${h.desc}</div>
                    </div>
                    <div style="color:${tema.badgeBg};font-weight:800;font-size:13px;flex-shrink:0;">✓</div>
                </div>`).join('')}
            </div>

            <!-- Fitur terkunci (tidakAda) -->
            ${p.tidakAda.length ? `
            <div style="font-size:11px;font-weight:800;color:#ccc;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">🔒 Tersedia di Paket Lebih Tinggi</div>
            <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:18px;">
                ${p.tidakAda.map(f => `
                <div style="
                    display:flex;align-items:center;gap:10px;
                    background:#fafafa;border-radius:10px;padding:9px 12px;
                    border:1.5px dashed #eee;opacity:0.65;
                ">
                    <div style="font-size:14px;">${f.split(' ')[0]}</div>
                    <div style="font-size:11px;color:#ccc;text-decoration:line-through;flex:1;">${f.split(' ').slice(1).join(' ')}</div>
                    <div style="font-size:10px;color:#ddd;">🔒</div>
                </div>`).join('')}
            </div>
            <button onclick="openPackageModal()" style="
                width:100%;padding:10px;border-radius:10px;border:1.5px solid #eee;
                background:#fafafa;color:#888;font-size:12px;font-weight:700;cursor:pointer;
                margin-bottom:12px;font-family:'DM Sans',sans-serif;transition:background 0.2s;
            " onmouseover="this.style.background='#f0f0f0'" onmouseout="this.style.background='#fafafa'">
                ⬆️ Upgrade ke Paket Lebih Tinggi
            </button>` : `
            <div style="background:#fff9ee;border-radius:10px;padding:10px 14px;border:1.5px solid #e8d06a;margin-bottom:16px;text-align:center;">
                <div style="font-size:13px;font-weight:800;color:#c5a21a;">🥇 Kamu punya paket terlengkap!</div>
                <div style="font-size:11px;color:#aaa;margin-top:3px;">Semua fitur sudah aktif untuk kamu.</div>
            </div>`}

            <button onclick="openWhatsApp('${activePaket}')" style="
                width:100%;padding:12px;border-radius:12px;border:none;
                background:#25d366;color:#fff;font-size:13px;font-weight:800;cursor:pointer;
                font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px;
            " onmouseover="this.style.background='#1da953'" onmouseout="this.style.background='#25d366'">
                💬 Chat Admin WhatsApp
            </button>
        </div>
    </div>`;

    document.body.appendChild(modal);
    if (typeof gsap !== "undefined") {
        gsap.fromTo("#mypkt-card",{opacity:0,y:28,scale:0.95},{opacity:1,y:0,scale:1,duration:0.4,ease:"back.out(1.7)"});
    }
    modal.querySelector("#mypkt-close-x").addEventListener("click", ()=>closeModal("mypkt-modal"));
    modal.addEventListener("click", e=>{ if(e.target===modal) closeModal("mypkt-modal"); });
};

/* ══════════════════════════════════════════════════════════
   4. BUKA WHATSAPP KE ADMIN
   ══════════════════════════════════════════════════════════ */

/* ── Helper: kumpulkan data voyager dari form & voyagerState ── */
function getVoyagerSummary() {
    // Lokasi: dari voyagerState atau langsung dari input
    const vbarInput = document.querySelector(".vbar-input");
    const lokasi = (typeof voyagerState !== "undefined" && voyagerState.location)
        ? voyagerState.location
        : (vbarInput ? vbarInput.value.trim() : "");

    // Place Details: dari voyagerState atau dari chip yang di-check
    let placeDetails = [];
    if (typeof voyagerState !== "undefined" && voyagerState.placeDetails && voyagerState.placeDetails.length) {
        placeDetails = voyagerState.placeDetails;
    } else {
        placeDetails = [...document.querySelectorAll(".vbar-chip.checked")].map(c => c.dataset.value || "");
    }

    // Route Optimization
    const routeEl = document.getElementById("vbarRouteDate");
    const route = (typeof voyagerState !== "undefined" && voyagerState.routeOptimization)
        ? voyagerState.routeOptimization
        : (routeEl ? routeEl.textContent.trim() : "Belum dipilih");

    // Stay & Duration dari voyagerState atau selector text
    const stayEl  = document.getElementById("staySelector");
    const durEl   = document.getElementById("durationSelector");
    const stay = (typeof voyagerState !== "undefined" && voyagerState.stay)
        ? voyagerState.stay
        : (stayEl ? stayEl.childNodes[0]?.textContent?.trim() : "Menginap");
    const duration = (typeof voyagerState !== "undefined" && voyagerState.duration)
        ? voyagerState.duration
        : (durEl ? durEl.childNodes[0]?.textContent?.trim() : "3 hari");

    return { lokasi, placeDetails, route, stay, duration };
}

window.openWhatsApp = function(pkgKey) {
    const p   = PAKETS[pkgKey];
    const vs  = getVoyagerSummary();

    const lokasiLine      = vs.lokasi       ? vs.lokasi                       : "Belum diisi";
    const placeDetailLine = vs.placeDetails.length ? vs.placeDetails.join(", ") : "Belum dipilih";
    const routeLine       = (vs.route && vs.route !== "Klik untuk pilih")     ? vs.route : "Belum dipilih";
    const stayLine        = vs.stay     || "Belum dipilih";
    const durationLine    = vs.duration || "Belum dipilih";

    const msg = encodeURIComponent(
`Halo Admin Kisah Anda! 👋

Saya sudah membeli Paket *${p.nama}* (${fmtRp(p.harga)}) untuk Voyager Itinerary.

📋 *Detail Perjalanan Saya:*
📍 Lokasi Asal      : ${lokasiLine}
🏷️ Place Details    : ${placeDetailLine}
🛤️ Route Optimization: ${routeLine}
🏨 Menginap         : ${stayLine}
📅 Durasi           : ${durationLine}

Mohon bantuannya untuk konfirmasi dan info itinerary lebih lanjut. Terima kasih! 🙏`
    );
    window.open(`https://wa.me/${ADMIN_WA}?text=${msg}`, "_blank");
};

/* ══════════════════════════════════════════════════════════
   5. REFRESH TAMPILAN MAP LOCK
   ══════════════════════════════════════════════════════════ */
function refreshMapLock() {
    const mapRow   = document.getElementById("vcardMapRow");
    const lockRow  = document.getElementById("vcardMapLock");
    if (!mapRow || !lockRow) return;

    const hasPeta = activePaket && PAKETS[activePaket]?.punya_peta;
    mapRow.style.display  = hasPeta ? "" : "none";
    lockRow.style.display = hasPeta ? "none" : "";
}

/* ══════════════════════════════════════════════════════════
   6. HELPER CLOSE MODAL
   ══════════════════════════════════════════════════════════ */
function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    const cardId = id.replace("-modal","-card");
    if (typeof gsap !== "undefined") {
        gsap.to("#"+cardId, {opacity:0,y:20,scale:0.95,duration:0.25,onComplete:()=>modal.remove()});
    } else {
        modal.remove();
    }
}

/* ══════════════════════════════════════════════════════════
   7. INJECT STYLES untuk map-lock box
   ══════════════════════════════════════════════════════════ */
const patchStyle = document.createElement("style");
patchStyle.textContent = `
.map-lock-box {
    display:flex;align-items:center;gap:8px;
    background:linear-gradient(135deg,#eef5f7 0%,#ddeef2 100%);
    border:1.5px dashed #b0cfd8;border-radius:10px;
    padding:10px 12px;width:100%;
}
.map-lock-icon { font-size:22px;flex-shrink:0; }
.map-lock-text { flex:1;font-size:11px;font-family:'DM Sans',sans-serif;font-weight:600;color:#6a9aaa;line-height:1.4; }
.map-lock-text span { font-size:10px;font-weight:400;color:#9ec5ce; }
.map-lock-btn {
    flex-shrink:0;background:#75a9b3;color:#fff;border:none;border-radius:8px;
    padding:6px 10px;font-size:10px;font-weight:800;cursor:pointer;
    font-family:'League Spartan',sans-serif;transition:background 0.2s;white-space:nowrap;
}
.map-lock-btn:hover { background:#5e98a2; }
`;
document.head.appendChild(patchStyle);

/* ══════════════════════════════════════════════════════════
   8. EVENT LISTENERS
   ══════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
    /* Tombol "Lihat Paket" di voyager card */
    const openPkgBtn = document.getElementById("openPackageBtn");
    if (openPkgBtn) openPkgBtn.addEventListener("click", openPackageModal);

    /* Tombol "Generate Itinerary" di voyager — buka paket dulu jika belum punya */
    const genBtn = document.querySelector(".gen-btn");
    if (genBtn) {
        const origClick = genBtn.onclick;
        genBtn.addEventListener("click", e => {
            if (!activePaket) {
                e.stopImmediatePropagation();
                openPackageModal();
            }
        }, true);
    }

    /* Refresh tampilan saat load (jika sudah punya paket di session) */
    refreshMapLock();

    /* Badge paket aktif di tab Voyager */
    if (activePaket) { showActivePaketBadge(); injectMyPaketButton(); }
});

function showActivePaketBadge() {
    const p = PAKETS[activePaket];
    if (!p) return;
    const voyagerTitle = document.querySelector(".voyager-title");
    if (!voyagerTitle) return;
    if (document.getElementById("paket-badge")) return;
    const badge = document.createElement("span");
    badge.id = "paket-badge";
    badge.style.cssText = `cursor:pointer;
        display:inline-flex;align-items:center;gap:4px;
        background:${p.warna};color:#fff;
        font-size:10px;font-weight:800;padding:3px 10px;border-radius:20px;
        margin-left:8px;vertical-align:middle;
    `;
    badge.textContent = `${p.emoji} ${p.nama}`;
    voyagerTitle.appendChild(badge);
}

/* ── Inject "Lihat Hak Paket" button into voyager-left ── */
function injectMyPaketButton() {
    if (document.getElementById("my-paket-btn")) return;
    const p = PAKETS[activePaket];
    if (!p) return;
    const container = document.querySelector(".voyager-left");
    if (!container) return;
    const btn = document.createElement("button");
    btn.id = "my-paket-btn";
    btn.style.cssText = `
        margin-top:4px;border:1.5px solid ${p.warna};background:transparent;color:${p.warna};
        border-radius:20px;padding:7px 16px;font-family:'League Spartan',sans-serif;
        font-size:12px;font-weight:800;cursor:pointer;width:fit-content;
        display:flex;align-items:center;gap:6px;transition:background 0.2s,color 0.2s;
    `;
    btn.innerHTML = `${p.emoji} Lihat Hak Paket ${p.nama} Saya`;
    btn.addEventListener("mouseenter", () => { btn.style.background = p.warna; btn.style.color = "#fff"; });
    btn.addEventListener("mouseleave", () => { btn.style.background = "transparent"; btn.style.color = p.warna; });
    btn.addEventListener("click", () => openMyPaketPanel());
    container.appendChild(btn);
}