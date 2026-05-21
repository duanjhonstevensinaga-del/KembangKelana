gsap.registerPlugin(SplitText);

const navToggle     = document.getElementById("navToggle");
const menu          = document.getElementById("menu");
const menuBg        = document.getElementById("menu-path");
const menuInfoItems    = document.querySelectorAll(".menu-col-info p, .menu-col-info h3, .menu-col-info h6");
const menuBrandLogo    = document.querySelector(".menu-brand-logo");
const menuBrandLogoBox = document.querySelector(".menu-brand-logo-box");
const menuBrandName    = document.querySelector(".menu-brand-name");
const menuInfoBox      = document.querySelector(".menu-col-info-box");
const menuBrandTextBox = document.querySelector(".menu-brand-text-box");

let isOpen = false;
let isAnimating = false;

const W = 1131, H = 861, CX = W / 2;
const midY = H * 0.20;
const HIDDEN = `M0,${H} L${W},${H} L${W},${H} Q${CX},${H} 0,${H} Z`;
const BULGE  = `M0,${H} L${W},${H} L${W},${midY+150} Q${CX},50 0,${midY+150} Z`;
const FULL   = `M0,${H} L${W},${H} L${W},${midY} Q${CX},${midY} 0,${midY} Z`;
const CBULGE = `M0,${H} L${W},${H} L${W},${midY-50} Q${CX},${H-100} 0,${midY-50} Z`;

gsap.set(menuBg, { attr: { d: HIDDEN } });

const brandSplit = menuBrandName
    ? new SplitText(menuBrandName, { type: "chars", charsClass: "char" })
    : null;

if (brandSplit) gsap.set(brandSplit.chars, { opacity: 0, x: 50 });
if (menuBrandLogo) gsap.set(menuBrandLogo, { opacity: 0, scale: 0.8 });
if (menuBrandLogoBox) gsap.set(menuBrandLogoBox, { opacity: 0, scale: 0.85, y: 16 });
if (menuInfoBox) gsap.set(menuInfoBox, { opacity: 0, y: 20, scale: 0.97 });
if (menuBrandTextBox) gsap.set(menuBrandTextBox, { opacity: 0, y: 14, scale: 0.96 });
gsap.set(menuInfoItems, { opacity: 0, y: 50 });

navToggle.addEventListener("click", () => {
    if (isAnimating) return;
    isAnimating = true;
    isOpen = !isOpen;
    navToggle.classList.toggle("active", isOpen);
    isOpen ? openMenu() : closeMenu();
});

function openMenu() {
    menu.classList.add("is-open");
    const tl = gsap.timeline({ onComplete: () => { isAnimating = false; } });
    tl.to(menuBg, { duration: 0.4, attr: { d: BULGE }, ease: "power4.in" })
      .to(menuBg, { duration: 0.4, attr: { d: FULL },  ease: "power4.out" });
    if (menuBrandLogoBox) {
        tl.to(menuBrandLogoBox, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "back.out(1.7)" }, "-=0.25");
    }
    if (menuBrandLogo) {
        tl.to(menuBrandLogo, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.8)" }, "-=0.35");
    }
    if (menuBrandTextBox) {
        tl.to(menuBrandTextBox, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.6)" }, "-=0.3");
    }
    if (brandSplit) {
        tl.to(brandSplit.chars, { x: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "elastic.out(1, 0.5)" }, "-=0.35");
    }
    if (menuInfoBox) {
        tl.to(menuInfoBox, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.6)" }, "-=0.5");
    }
    tl.to([...menuInfoItems], { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 }, "-=0.4");
}

function closeMenu() {
    gsap.set(menuBg, { attr: { d: FULL } });
    const tl = gsap.timeline({
        onComplete: () => {
            menu.classList.remove("is-open");
            isAnimating = false;
            if (brandSplit) gsap.set(brandSplit.chars, { opacity: 0, x: 50 });
            if (menuBrandLogo) gsap.set(menuBrandLogo, { opacity: 0, scale: 0.8 });
            if (menuBrandLogoBox) gsap.set(menuBrandLogoBox, { opacity: 0, scale: 0.85, y: 16 });
            if (menuInfoBox) gsap.set(menuInfoBox, { opacity: 0, y: 20, scale: 0.97 });
            if (menuBrandTextBox) gsap.set(menuBrandTextBox, { opacity: 0, y: 14, scale: 0.96 });
            gsap.set(menuInfoItems, { opacity: 0, y: 50 });
        }
    });
    const fadeTargets = [
        ...(menuBrandLogoBox ? [menuBrandLogoBox] : []),
        ...(menuBrandLogo    ? [menuBrandLogo]    : []),
        ...(menuBrandTextBox ? [menuBrandTextBox] : []),
        ...(menuInfoBox      ? [menuInfoBox]      : []),
        ...(brandSplit       ? brandSplit.chars   : []),
        ...menuInfoItems
    ];
    tl.to(fadeTargets, { opacity: 0, duration: 0.18, stagger: 0.015 })
      .to(menuBg, { duration: 0.4, attr: { d: CBULGE }, ease: "power3.in" })
      .to(menuBg, { duration: 0.4, attr: { d: HIDDEN }, ease: "power3.out" });
}

function closeMenuAndToggle() {
    if (!isOpen) return;
    isAnimating = true;
    isOpen = false;
    navToggle.classList.remove("active");
    closeMenu();
}

// ── TABS ──
const tabs   = document.querySelectorAll(".tab[data-tab]");
const panels = document.querySelectorAll(".tab-panel");

tabs.forEach(tab => tab.addEventListener("click", () => switchTab(tab.dataset.tab)));

function switchTab(tabName) {
    tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === tabName));
    panels.forEach(panel => {
        const isTarget = panel.id === `panel-${tabName}`;
        panel.classList.toggle("hidden", !isTarget);
    });
    const card = document.querySelector(".search-card");
    card.classList.toggle("voyager-mode", tabName === "voyager");
    const hero = document.querySelector(".hero");
    if (hero) hero.classList.toggle("hero-voyager", tabName === "voyager");

    const tabOptions = document.querySelectorAll(".tab-option");
    tabOptions.forEach(opt => opt.style.display = tabName === "voyager" ? "none" : "");

    if (tabName === "discovery") fillDiscoveryDates();
    else if (tabName === "voyager") fillVoyagerDates();
}

// ══════════════════════════════════════════════════════════
// ── DATA DESTINASI BANDUNG ──
// ══════════════════════════════════════════════════════════

const destinasiBandung = [
    { nama: "Museum Sribaduga",     kategori: ["Cultural"],   deskripsi: "Museum di Bandung yang memamerkan berbagai koleksi benda bersejarah, seni, dan warisan budaya masyarakat Jawa Barat" },
    { nama: "Saung Angklung Udjo",  kategori: ["Cultural"],   deskripsi: "Pusat pelestarian budaya Sunda di Bandung yang terkenal dengan pertunjukan musik angklung interaktif dan workshop kerajinan bambu" },
    { nama: "The Great Asia Africa",kategori: ["Cultural"],   deskripsi: "Taman wisata di Lembang yang menghadirkan miniatur arsitektur, budaya, dan kuliner khas dari berbagai negara di Asia dan Afrika" },
    { nama: "Deli Bakes",           kategori: ["Cozy"],       deskripsi: "Kafe dan toko roti estetik di Bandung yang terkenal dengan berbagai pilihan kue premium, pastry, serta suasana tempatnya yang nyaman untuk bersantai" },
    { nama: "Sudut Pandang Cafe",   kategori: ["Cozy"],       deskripsi: "Kafe populer di kawasan Punclut dengan arsitektur modern unik yang menawarkan pemandangan alam Bandung serta ruang instalasi seni interaktif" },
    { nama: "Nara Park",            kategori: ["Cozy"],       deskripsi: "Kawasan kuliner outdoor di Bandung yang menggabungkan beberapa restoran dan kafe dalam satu area taman hijau luas yang ramah keluarga" },
    { nama: "Peach Of Cake",        kategori: ["Cozy"],       deskripsi: "Toko kue dan kafe estetik di Bandung yang terkenal dengan spesialisasi cake berdesain cantik, bernuansa pastel, serta suasana tempatnya yang instagramable" },
    { nama: "Orchid Forest",        kategori: ["Cozy"],       deskripsi: "Taman wisata alam di tengah hutan pinus Lembang yang mengoleksi ratusan jenis anggrek serta menawarkan wahana jembatan gantung dan lampu estetik di malam hari" },
    { nama: "Situ Patenggang",      kategori: ["Nature"],     deskripsi: "Danau alam eksotis di Ciwidey yang dikelilingi hamparan kebun teh hijau, terkenal dengan kisah romantis Batu Cinta dan Pulau Asmara" },
    { nama: "Kawah Putih",          kategori: ["Nature"],     deskripsi: "Danau kawah vulkanik eksotis di Ciwidey dengan air berwarna putih kehijauan yang unik serta dikelilingi suasana hutan mati yang magis" },
    { nama: "Gunung Putri",         kategori: ["Nature"],     deskripsi: "Bukit tempat berkemah yang populer di Lembang, menawarkan pemandangan matahari terbit yang indah serta panorama lampu kota Bandung di malam hari" },
    { nama: "Ranca Upas",           kategori: ["Nature"],     deskripsi: "Kawasan wisata alam dan berkemah di Ciwidey yang terkenal dengan penangkaran rusa, pemandian air panas, serta suasana alamnya yang sejuk" },
    { nama: "Taman Hutan Raya",     kategori: ["Nature"],     deskripsi: "Kawasan konservasi alam dan hutan raya di Bandung yang memiliki jalur trekking sejuk, air terjun, serta situs bersejarah Goa Jepang dan Goa Belanda" },
    { nama: "Warung Nasi Ibu Imas", kategori: ["Culinary"],   deskripsi: "Rumah makan Sunda legendaris di Bandung yang terkenal dengan sambal dadak super pedas, karedok, dan beragam pilihan lauk khas yang menggugah selera" },
    { nama: "Geger Kalong Girang",  kategori: ["Culinary"],   deskripsi: "Kawasan kuliner di dekat kampus UPI Bandung yang berburu aneka jajanan pasar, camilan tradisional, hingga makanan berat dengan harga ramah kantong mahasiswa" },
    { nama: "Kampung Kecil",        kategori: ["Culinary"],   deskripsi: "Restoran keluarga dengan konsep saung tradisional Sunda di atas kolam air yang menyajikan aneka hidangan khas Nusantara dalam suasana pedesaan yang asri" },
];

// ══════════════════════════════════════════════════════════
// ── EKSPLORE TAB ──
// ══════════════════════════════════════════════════════════

const locationInput      = document.getElementById("locationInput");
const routeStatus        = document.getElementById("routeStatus");
const placeChipsExplore  = document.querySelectorAll("#panel-eksplore .place-chip");

const eksploreState = {
    location: "",
    categories: [],
    routeReady: false,
    selectedDestinasi: null
};

const dropdown = document.createElement("div");
dropdown.className = "location-dropdown";
dropdown.style.cssText = `
    position: absolute;
    bottom: calc(100% + 6px);
    left: 0;
    width: 300px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 -4px 28px rgba(0,0,0,0.14);
    z-index: 9999;
    overflow: hidden;
    display: none;
    max-height: 220px;
    overflow-y: auto;
`;
locationInput.parentElement.style.position = "relative";
locationInput.parentElement.appendChild(dropdown);

function renderDropdown(query) {
    const q = query.toLowerCase().trim();
    const filtered = q
        ? destinasiBandung.filter(d => d.nama.toLowerCase().includes(q))
        : destinasiBandung;
    if (!filtered.length) { dropdown.style.display = "none"; return; }
    dropdown.innerHTML = filtered.map(d => `
        <div class="dropdown-item" data-nama="${d.nama}" style="padding:10px 14px;cursor:pointer;border-bottom:1px solid #f5f5f5;transition:background 0.15s;">
            <div style="font-size:13px;font-weight:700;color:#222225;">${d.nama}</div>
            <div style="font-size:11px;color:#aaa;margin-top:1px;font-weight:400;">${d.deskripsi}</div>
            <div style="display:flex;gap:4px;margin-top:4px;flex-wrap:wrap;">
                ${d.kategori.map(k => `<span style="font-size:10px;font-weight:700;background:#e8f5f7;color:#75a9b3;padding:2px 8px;border-radius:10px;">${k}</span>`).join("")}
            </div>
        </div>
    `).join("");
    dropdown.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("mouseenter", () => item.style.background = "#f7fcfd");
        item.addEventListener("mouseleave", () => item.style.background = "");
        item.addEventListener("click", () => {
            const dest = destinasiBandung.find(d => d.nama === item.dataset.nama);
            selectDestinasi(dest);
        });
    });
    dropdown.style.display = "block";
    gsap.fromTo(dropdown, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" });
}

function selectDestinasi(dest) {
    if (!dest) return;
    locationInput.value = dest.nama;
    eksploreState.location = dest.nama;
    eksploreState.selectedDestinasi = dest;
    const anyChecked = [...placeChipsExplore].some(c => c.classList.contains("checked"));
    if (!anyChecked) {
        placeChipsExplore.forEach(chip => {
            const chipVal = chip.dataset.value || chip.querySelector("input")?.value || "";
            chip.classList.toggle("checked", dest.kategori.includes(chipVal));
        });
    }
    dropdown.style.display = "none";
    checkRouteReady();
    pulseElement(locationInput.parentElement);
}

locationInput.addEventListener("input", () => {
    eksploreState.selectedDestinasi = null;
    renderDropdown(locationInput.value);
    checkRouteReady();
});
locationInput.addEventListener("focus", () => renderDropdown(locationInput.value));

document.addEventListener("click", (e) => {
    const chipsArea = document.querySelector("#panel-eksplore .place-options");
    if (!locationInput.parentElement.contains(e.target) && !chipsArea?.contains(e.target)) {
        dropdown.style.display = "none";
    }
});

placeChipsExplore.forEach(chip => {
    chip.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        chip.classList.toggle("checked");
        const activeCategories = [...placeChipsExplore]
            .filter(c => c.classList.contains("checked"))
            .map(c => c.dataset.value || c.querySelector("input")?.value || "");
        if (!eksploreState.selectedDestinasi) {
            if (activeCategories.length === 0) {
                locationInput.placeholder = "Tujuan Destinasi";
                dropdown.style.display = "none";
                eksploreState.location = "";
            } else {
                locationInput.value = "";
                eksploreState.location = "";
                renderDropdownByCategory(activeCategories);
            }
        }
        checkRouteReady();
    });
});

function renderDropdownByCategory(activeCategories) {
    if (!activeCategories.length) { dropdown.style.display = "none"; return; }
    const filtered = destinasiBandung.filter(d =>
        activeCategories.some(cat => d.kategori.includes(cat))
    );
    if (!filtered.length) { dropdown.style.display = "none"; return; }
    dropdown.innerHTML = `
        <div style="padding:8px 14px;font-size:10px;font-weight:800;color:#75a9b3;background:#f7fcfd;border-bottom:1px solid #eee;letter-spacing:0.5px;">
            DESTINASI SESUAI KATEGORI
        </div>
        ${filtered.map(d => `
            <div class="dropdown-item" data-nama="${d.nama}" style="padding:10px 14px;cursor:pointer;border-bottom:1px solid #f5f5f5;transition:background 0.15s;">
                <div style="font-size:13px;font-weight:700;color:#222225;">${d.nama}</div>
                <div style="font-size:11px;color:#aaa;margin-top:1px;font-weight:400;">${d.deskripsi}</div>
                <div style="display:flex;gap:4px;margin-top:4px;flex-wrap:wrap;">
                    ${d.kategori.map(k => `<span style="font-size:10px;font-weight:700;background:#e8f5f7;color:#75a9b3;padding:2px 8px;border-radius:10px;">${k}</span>`).join("")}
                </div>
            </div>
        `).join("")}
    `;
    dropdown.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("mouseenter", () => item.style.background = "#f7fcfd");
        item.addEventListener("mouseleave", () => item.style.background = "");
        item.addEventListener("click", () => {
            const dest = destinasiBandung.find(d => d.nama === item.dataset.nama);
            selectDestinasi(dest);
        });
    });
    dropdown.style.display = "block";
    gsap.fromTo(dropdown, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" });
}

function openGoogleMaps(destinasiNama) {
    const encoded = encodeURIComponent(destinasiNama + ", Bandung, Jawa Barat, Indonesia");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude: lat, longitude: lng } = pos.coords;
                const url = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${encoded}&travelmode=driving`;
                window.open(url, "_blank");
            },
            () => {
                const url = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
                window.open(url, "_blank");
            },
            { enableHighAccuracy: true, timeout: 6000 }
        );
    } else {
        const url = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
        window.open(url, "_blank");
    }
}

function checkRouteReady() {
    eksploreState.location = locationInput?.value.trim() || "";
    eksploreState.categories = [...placeChipsExplore]
        .filter(chip => chip.classList.contains("checked"))
        .map(chip => chip.dataset.value || chip.querySelector("input")?.value || chip.textContent.trim());
    const hasLocation = eksploreState.location.length > 0;
    const hasCategory = eksploreState.categories.length > 0;
    if (hasLocation && hasCategory) {
        routeStatus.innerHTML = `
            <span style="cursor:pointer;color:#1a73e8;font-weight:700;display:inline-flex;align-items:center;gap:6px;" id="openMapsBtn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                Rute perjalananmu sudah siap! Buka Google Maps →
            </span>`;
        routeStatus.classList.add("ready");
        eksploreState.routeReady = true;
        document.getElementById("openMapsBtn")?.addEventListener("click", () => {
            openGoogleMaps(eksploreState.location);
        });
        gsap.fromTo(routeStatus, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
    } else if (hasLocation && !hasCategory) {
        routeStatus.textContent = "Pilih minimal 1 kategori tempat";
        routeStatus.classList.remove("ready");
        eksploreState.routeReady = false;
    } else if (!hasLocation && hasCategory) {
        routeStatus.textContent = "Masukkan lokasi tujuanmu";
        routeStatus.classList.remove("ready");
        eksploreState.routeReady = false;
    } else {
        routeStatus.textContent = "Isi location & pilih kategori dulu";
        routeStatus.classList.remove("ready");
        eksploreState.routeReady = false;
    }
}

const eksploreCariBtn = document.querySelector("#panel-eksplore .cari-btn");
eksploreCariBtn?.addEventListener("click", () => {
    if (!eksploreState.routeReady) {
        shakeElement(eksploreCariBtn);
        if (!eksploreState.location) showTooltip(locationInput, "Masukkan lokasi tujuan dulu!");
        else showTooltip(document.querySelector("#panel-eksplore .place-chip"), "Pilih minimal 1 kategori!");
        return;
    }
    openGoogleMaps(eksploreState.location);
});

// ══════════════════════════════════════════════════════════
// ── DISCOVERY+ TAB ──
// ══════════════════════════════════════════════════════════

const discoveryState = { location: "", selectedDest: null, picks: [], costRange: "" };
const discPanel = document.getElementById("panel-discovery");
const discLocationInput = discPanel?.querySelector(".field-input[type='text']");
const discPickSelect = discPanel?.querySelectorAll(".field-select")[0];
const discCostSelect = discPanel?.querySelectorAll(".field-select")[1];

const picksMap = {
    "Wisata Alam":      { kategori: "Nature",   filter: "nature" },
    "Kuliner Lokal":    { kategori: "Culinary", filter: "culinary" },
    "Sejarah & Budaya": { kategori: "Cultural", filter: "cultural" },
    "Tempat Santai":    { kategori: "Cozy",     filter: "cozy" },
    "Hidden Gems":      { kategori: null,        filter: "all" },
    "Spot Foto Keren":  { kategori: "Nature",   filter: "nature" },
};
const costMap = {
    "Gratis – Rp 50.000":   { min: 0,      max: 50000,   label: "budget" },
    "Rp 50.000 – 150.000":  { min: 50000,  max: 150000,  label: "mid" },
    "Rp 150.000 – 300.000": { min: 150000, max: 300000,  label: "mid-high" },
    "Rp 300.000+":          { min: 300000, max: Infinity, label: "premium" },
};

const discDropdown = document.createElement("div");
discDropdown.className = "location-dropdown disc-dropdown";
discDropdown.style.cssText = `
    position:absolute; bottom:calc(100% + 6px); left:0; width:300px;
    background:#fff; border-radius:12px; box-shadow:0 -4px 28px rgba(0,0,0,0.14);
    z-index:9999; overflow:hidden; display:none; max-height:220px; overflow-y:auto;
`;
if (discLocationInput) {
    discLocationInput.parentElement.style.position = "relative";
    discLocationInput.parentElement.appendChild(discDropdown);
}

discPickSelect?.addEventListener("change", () => {
    const val = discPickSelect.value;
    discoveryState.picks = val ? [val] : [];
    if (!discoveryState.location && val) {
        const kat = picksMap[val]?.kategori;
        const rekom = kat ? destinasiBandung.filter(d => d.kategori.includes(kat)) : destinasiBandung;
        if (rekom.length) renderDiscDropdownByKat(rekom);
    }
    if (discLocationInput.value.trim()) renderDiscDropdown(discLocationInput.value);
});

discCostSelect?.addEventListener("change", () => {
    const valMap = {
        "0-50000": "Gratis – Rp 50.000",
        "50000-150000": "Rp 50.000 – 150.000",
        "150000-300000": "Rp 150.000 – 300.000",
        "300000+": "Rp 300.000+",
    };
    discoveryState.costRange = valMap[discCostSelect.value] || "";
});

function renderDiscDropdown(query) {
    const q = query.toLowerCase().trim();
    const activePick = discoveryState.picks[0] || "";
    const activeKat = activePick ? picksMap[activePick]?.kategori : null;
    let filtered = destinasiBandung;
    if (activeKat) filtered = filtered.filter(d => d.kategori.includes(activeKat));
    if (q) filtered = filtered.filter(d => d.nama.toLowerCase().includes(q));
    if (!filtered.length) { discDropdown.style.display = "none"; return; }
    discDropdown.innerHTML = filtered.map(d => `
        <div class="dropdown-item" data-nama="${d.nama}" style="padding:10px 14px;cursor:pointer;border-bottom:1px solid #f5f5f5;transition:background 0.15s;">
            <div style="font-size:13px;font-weight:700;color:#222225;">${d.nama}</div>
            <div style="font-size:11px;color:#aaa;margin-top:1px;">${d.deskripsi}</div>
            <div style="display:flex;gap:4px;margin-top:4px;flex-wrap:wrap;">
                ${d.kategori.map(k => `<span style="font-size:10px;font-weight:700;background:#e8f5f7;color:#75a9b3;padding:2px 8px;border-radius:10px;">${k}</span>`).join("")}
            </div>
        </div>`).join("");
    discDropdown.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("mouseenter", () => item.style.background = "#f7fcfd");
        item.addEventListener("mouseleave", () => item.style.background = "");
        item.addEventListener("click", () => {
            const dest = destinasiBandung.find(d => d.nama === item.dataset.nama);
            if (!dest) return;
            discLocationInput.value = dest.nama;
            discoveryState.location = dest.nama;
            discoveryState.selectedDest = dest;
            discDropdown.style.display = "none";
            autoSetDiscPicks(dest.kategori[0]);
            pulseElement(discLocationInput.parentElement);
        });
    });
    discDropdown.style.display = "block";
    gsap.fromTo(discDropdown, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" });
}

function renderDiscDropdownByKat(filtered) {
    discDropdown.innerHTML = `
        <div style="padding:7px 14px;font-size:10px;font-weight:800;color:#75a9b3;background:#f7fcfd;border-bottom:1px solid #eee;letter-spacing:0.5px;">
            DESTINASI REKOMENDASI
        </div>
        ${filtered.map(d => `
            <div class="dropdown-item" data-nama="${d.nama}" style="padding:10px 14px;cursor:pointer;border-bottom:1px solid #f5f5f5;transition:background 0.15s;">
                <div style="font-size:13px;font-weight:700;color:#222225;">${d.nama}</div>
                <div style="font-size:11px;color:#aaa;margin-top:1px;">${d.deskripsi}</div>
            </div>`).join("")}`;
    discDropdown.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("mouseenter", () => item.style.background = "#f7fcfd");
        item.addEventListener("mouseleave", () => item.style.background = "");
        item.addEventListener("click", () => {
            const dest = destinasiBandung.find(d => d.nama === item.dataset.nama);
            if (!dest) return;
            discLocationInput.value = dest.nama;
            discoveryState.location = dest.nama;
            discoveryState.selectedDest = dest;
            discDropdown.style.display = "none";
            autoSetDiscPicks(dest.kategori[0]);
            pulseElement(discLocationInput.parentElement);
        });
    });
    discDropdown.style.display = "block";
    gsap.fromTo(discDropdown, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" });
}

function autoSetDiscPicks(kategori) {
    const pickKey = Object.keys(picksMap).find(k => picksMap[k].kategori === kategori);
    if (!pickKey || !discPickSelect) return;
    const option = Array.from(discPickSelect.options).find(o => o.value === pickKey);
    if (option) { discPickSelect.value = pickKey; discoveryState.picks = [pickKey]; }
}

discLocationInput?.addEventListener("input", () => {
    discoveryState.location = discLocationInput.value.trim();
    discoveryState.selectedDest = null;
    renderDiscDropdown(discLocationInput.value);
});
discLocationInput?.addEventListener("focus", () => renderDiscDropdown(discLocationInput.value));
document.addEventListener("click", (e) => {
    if (discLocationInput && !discLocationInput.parentElement.contains(e.target)) {
        discDropdown.style.display = "none";
    }
});

// ── Tombol Cari Discovery+ (satu deklarasi, tidak duplikat) ──
const discoveryCariBtn = discPanel?.querySelector(".cari-btn");
discoveryCariBtn?.addEventListener("click", () => {
    const loc = discoveryState.location || discLocationInput?.value.trim();
    const hasPick = discoveryState.picks.length > 0;
    const hasCost = !!discoveryState.costRange;

    if (!loc && !hasPick) {
        shakeElement(discoveryCariBtn);
        showTooltip(discLocationInput, "Pilih destinasi atau kategori dulu");
        return;
    }

    const params = new URLSearchParams();
    if (loc) params.set("q", loc);
    if (hasPick) {
        const filterKey = picksMap[discoveryState.picks[0]]?.filter || "all";
        params.set("filter", filterKey);
        params.set("pick", discoveryState.picks[0]);
    }
    if (hasCost) {
        params.set("budget", costMap[discoveryState.costRange]?.label || "");
        params.set("costLabel", discoveryState.costRange);
    }
    window.location.href = `destinasi.html?${params.toString()}`;
});

// ══════════════════════════════════════════════════════════
// ── VOYAGER TAB ──
// ══════════════════════════════════════════════════════════

const voyagerState = { location: "", stay: "Menginap", duration: "3 hari", placeDetails: [], routeOptimization: false, budget: null };

const staySelector = document.getElementById("staySelector");
const stayOptions  = ["Menginap", "Tidak Menginap", "Flexible"];
let stayIndex = 0;
staySelector?.addEventListener("click", () => {
    stayIndex = (stayIndex + 1) % stayOptions.length;
    staySelector.childNodes[0].textContent = stayOptions[stayIndex] + " ";
    voyagerState.stay = stayOptions[stayIndex];
    pulseElement(staySelector);
});

const durationSelector = document.getElementById("durationSelector");
const durationOptions  = ["1 hari", "2 hari", "3 hari", "5 hari", "7 hari"];
let durIndex = 2;
durationSelector?.addEventListener("click", () => {
    durIndex = (durIndex + 1) % durationOptions.length;
    durationSelector.childNodes[0].textContent = durationOptions[durIndex] + " ";
    voyagerState.duration = durationOptions[durIndex];
    pulseElement(durationSelector);
});

const vbarLocationInput = document.querySelector(".vbar-input");
vbarLocationInput?.addEventListener("input", () => {
    voyagerState.location = vbarLocationInput.value.trim();
});

const vbarChips = document.querySelectorAll(".vbar-chip");
vbarChips.forEach(chip => {
    chip.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        chip.classList.toggle("checked");
        voyagerState.placeDetails = [...vbarChips]
            .filter(c => c.classList.contains("checked"))
            .map(c => c.dataset.value || "");
    });
});

// FIX: vbarRouteDate sudah ada di HTML, gunakan id="vbarRouteDate" yang benar
const vbarRouteDate = document.getElementById("vbarRouteDate");
const routeOptions  = ["Shortest Path", "Scenic Route", "Budget Friendly", "Time Efficient"];
let vbarRouteIdx = 0;
vbarRouteDate?.addEventListener("click", () => {
    vbarRouteIdx = (vbarRouteIdx + 1) % routeOptions.length;
    vbarRouteDate.textContent = routeOptions[vbarRouteIdx];
    vbarRouteDate.style.cursor = "pointer";
    voyagerState.routeOptimization = routeOptions[vbarRouteIdx];
    pulseElement(vbarRouteDate);
});

function fillDiscoveryDates() {
    // placeholder — bisa diisi jika diperlukan
}

function fillVoyagerDates() {
    if (!voyagerState.routeOptimization && vbarRouteDate) {
        vbarRouteDate.textContent = "Klik untuk pilih";
        vbarRouteDate.style.cursor = "pointer";
    }
}

document.querySelector(".gen-btn")?.addEventListener("click", () => {
  const loc = voyagerState.location || vbarLocationInput?.value.trim();
  if (!loc) { shakeElement(document.querySelector(".gen-btn")); showTooltip(vbarLocationInput, "Masukkan lokasi dulu"); return; }
  voyagerState.location = loc;
  showPaketModal(loc);  // ← Ubah generateItinerary(loc) menjadi showPaketModal(loc)
});

document.querySelector(".budget-btn")?.addEventListener("click", () => {
    const loc = voyagerState.location || vbarLocationInput?.value.trim();
    if (!loc) { shakeElement(document.querySelector(".budget-btn")); showTooltip(vbarLocationInput, "Masukkan lokasi dulu"); return; }
    showBudgetBreakdown(loc);
});

const mapPlaceholder = document.querySelector(".vcard-map-placeholder");
if (mapPlaceholder) {
    mapPlaceholder.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:4px;cursor:pointer;opacity:0.6;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#75a9b3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span style="font-size:9px;color:#75a9b3;font-weight:700;text-align:center;line-height:1.3;">Klik untuk<br>buka Maps</span>
        </div>`;
    mapPlaceholder.style.cursor = "pointer";
    mapPlaceholder.addEventListener("click", () => {
        const loc = voyagerState.location || vbarLocationInput?.value.trim();
        if (!loc) { shakeElement(mapPlaceholder); showTooltip(vbarLocationInput, "Isi lokasi dulu di bawah!"); return; }
        const origin      = encodeURIComponent(loc + ", Indonesia");
        const destination = encodeURIComponent("Bandung, Jawa Barat, Indonesia");
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
        window.open(url, "_blank");
    });
    mapPlaceholder.addEventListener("mouseenter", () => gsap.to(mapPlaceholder, { opacity: 0.85, duration: 0.2 }));
    mapPlaceholder.addEventListener("mouseleave", () => gsap.to(mapPlaceholder, { opacity: 1, duration: 0.2 }));
}

// ── TAB-OPTION DROPDOWNS ──
document.querySelectorAll(".tab-option").forEach(opt => {
    const spanEl = opt.querySelector("span");
    let optionsPool = [];
    if (spanEl.textContent.includes("Pulang")) optionsPool = ["Pulang – Pergi", "Sekali Jalan", "Multi Destinasi"];
    else if (spanEl.textContent.includes("hari")) optionsPool = ["1 hari", "2 hari", "3 hari", "5 hari", "7 hari"];
    let idx = 0;
    opt.style.cursor = "pointer";
    opt.addEventListener("click", () => {
        if (!optionsPool.length) return;
        idx = (idx + 1) % optionsPool.length;
        spanEl.textContent = optionsPool[idx];
        pulseElement(opt);
    });
});

// ══════════════════════════════════════════════════════════
// ── HELPER FUNCTIONS ──
// ══════════════════════════════════════════════════════════

function shakeElement(el) {
    if (!el) return;
    gsap.fromTo(el, { x: -5 }, { x: 5, duration: 0.08, repeat: 5, yoyo: true, ease: "power1.inOut", onComplete: () => gsap.set(el, { x: 0 }) });
}

function pulseElement(el) {
    if (!el) return;
    gsap.fromTo(el, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
}

function showTooltip(el, message) {
    if (!el) return;
    const existing = el.parentElement.querySelector(".tooltip-msg");
    if (existing) existing.remove();
    const tip = document.createElement("div");
    tip.className = "tooltip-msg";
    tip.textContent = message;
    tip.style.cssText = `position:absolute;bottom:-28px;left:0;background:#ff5252;color:#fff;padding:4px 10px;border-radius:4px;font-size:11px;white-space:nowrap;z-index:100;pointer-events:none;`;
    el.parentElement.style.position = "relative";
    el.parentElement.appendChild(tip);
    gsap.fromTo(tip, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.3 });
    gsap.to(tip, { opacity: 0, delay: 2.5, duration: 0.3, onComplete: () => tip.remove() });
}

// ══════════════════════════════════════════════════════════
// ── GENERATE ITINERARY MODAL ──
// ══════════════════════════════════════════════════════════

function generateItinerary(location) {
    const existing = document.getElementById("itinerary-modal");
    if (existing) existing.remove();

    const checkedChips = [...document.querySelectorAll(".vbar-chip.checked")]
        .map(c => c.dataset.value || c.textContent.trim());
    const placeDetailsFinal = checkedChips.length ? checkedChips : voyagerState.placeDetails;
    const route = voyagerState.routeOptimization || vbarRouteDate?.textContent?.trim() || "—";
    const days = parseInt(voyagerState.duration) || 3;

    const cityTransportMap = {
        "medan": 1400000, "makassar": 1200000, "manado": 1500000,
        "papua": 2000000, "jayapura": 2000000, "sorong": 1800000,
        "surabaya": 200000, "yogyakarta": 150000, "semarang": 150000,
        "jakarta": 100000, "depok": 100000, "bekasi": 100000, "bogor": 80000,
        "solo": 150000, "malang": 250000, "bali": 500000, "denpasar": 500000,
        "lombok": 600000, "pontianak": 800000, "balikpapan": 900000,
        "samarinda": 900000, "palembang": 400000, "pekanbaru": 600000,
        "padang": 700000, "aceh": 1200000, "banda aceh": 1200000,
    };
    const locLower = location.toLowerCase();
    let baseTransport = 150000;
    for (const [city, cost] of Object.entries(cityTransportMap)) {
        if (locLower.includes(city)) { baseTransport = cost; break; }
    }

    const placeChipsActive = [...document.querySelectorAll(".vbar-chip.checked")].map(c => c.dataset.value || "");
    const activityMultiplier = placeChipsActive.length > 0 ? placeChipsActive.length * 0.4 + 0.6 : 1;
    const routeText = voyagerState.routeOptimization || vbarRouteDate?.textContent?.trim() || "";
    const routeMultiplier = routeText.includes("Scenic") ? 1.3 : routeText.includes("Budget") ? 0.75 : routeText.includes("Time") ? 1.15 : 1.0;

    const transport  = Math.round(baseTransport * routeMultiplier);
    const food       = Math.round(85000 * days * activityMultiplier);
    const stay       = voyagerState.stay === "Tidak Menginap" ? 0
                     : voyagerState.stay === "Flexible" ? 250000 * Math.max(days - 1, 1)
                     : 350000 * Math.max(days - 1, 1);
    const activities = Math.round(120000 * days * activityMultiplier);
    const total      = transport + food + stay + activities;
    const fmt        = n => "Rp " + new Intl.NumberFormat("id-ID").format(n);

    const origin      = encodeURIComponent(location + ", Indonesia");
    const destination = encodeURIComponent("Bandung, Jawa Barat, Indonesia");
    const mapsUrl     = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

    const modal = document.createElement("div");
    modal.id = "itinerary-modal";
    modal.style.cssText = `position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.45);backdrop-filter:blur(4px);font-family:'DM Sans',sans-serif;`;
    modal.innerHTML = `
        <div id="itinerary-card" style="background:#fff;border-radius:20px;padding:32px 36px;max-width:480px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.2);position:relative;">
            <button id="itinerary-close" style="position:absolute;top:14px;right:16px;background:none;border:none;cursor:pointer;font-size:20px;color:#aaa;line-height:1;">✕</button>
            <div style="margin-bottom:20px;">
                <div style="font-size:11px;font-weight:800;letter-spacing:1px;color:#75a9b3;text-transform:uppercase;margin-bottom:4px;">Itinerary Kamu</div>
                <h2 style="font-size:22px;font-weight:800;color:#222225;margin:0;">🗺️ Perjalanan ke Bandung</h2>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px;">
                <div style="display:flex;align-items:flex-start;gap:10px;">
                    <span style="font-size:18px;">📍</span>
                    <div>
                        <div style="font-size:10px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:0.5px;">Lokasi Asal</div>
                        <div style="font-size:14px;font-weight:700;color:#222225;">${location}</div>
                        <div style="font-size:11px;color:#75a9b3;">→ Destinasi: Bandung, Jawa Barat</div>
                    </div>
                </div>
                <div style="display:flex;align-items:flex-start;gap:10px;">
                    <span style="font-size:18px;">🏷️</span>
                    <div>
                        <div style="font-size:10px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:0.5px;">Place Details</div>
                        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;">
                            ${placeDetailsFinal.length
                                ? placeDetailsFinal.map(c => `<span style="font-size:11px;font-weight:700;background:#e8f5f7;color:#75a9b3;padding:3px 10px;border-radius:20px;">${c}</span>`).join("")
                                : `<span style="font-size:13px;color:#bbb;">Belum dipilih</span>`}
                        </div>
                    </div>
                </div>
                <div style="display:flex;align-items:flex-start;gap:10px;">
                    <span style="font-size:18px;">🛤️</span>
                    <div>
                        <div style="font-size:10px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:0.5px;">Route Optimization</div>
                        <div style="font-size:14px;font-weight:700;color:#222225;">${route === "Klik untuk pilih" || route === "—" ? "Belum dipilih" : route}</div>
                    </div>
                </div>
                <div style="display:flex;align-items:flex-start;gap:10px;">
                    <span style="font-size:18px;">🏨</span>
                    <div>
                        <div style="font-size:10px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:0.5px;">Akomodasi</div>
                        <div style="font-size:14px;font-weight:700;color:#222225;">${voyagerState.stay} · ${voyagerState.duration}</div>
                    </div>
                </div>
            </div>
            <div style="background:#f7fbfc;border-radius:14px;padding:16px 18px;margin-bottom:20px;">
                <div style="font-size:11px;font-weight:800;color:#75a9b3;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">💰 Estimasi Budget</div>
                <div style="display:flex;flex-direction:column;gap:6px;">
                    <div style="display:flex;justify-content:space-between;font-size:13px;color:#555;"><span>🚗 Transportasi</span><span style="font-weight:700;">${fmt(transport)}</span></div>
                    <div style="display:flex;justify-content:space-between;font-size:13px;color:#555;"><span>🍜 Makan</span><span style="font-weight:700;">${fmt(food)}</span></div>
                    <div style="display:flex;justify-content:space-between;font-size:13px;color:#555;"><span>🏨 Penginapan</span><span style="font-weight:700;">${fmt(stay)}</span></div>
                    <div style="display:flex;justify-content:space-between;font-size:13px;color:#555;"><span>🎯 Aktivitas</span><span style="font-weight:700;">${fmt(activities)}</span></div>
                    <div style="border-top:1.5px solid #dce8ea;margin-top:6px;padding-top:8px;display:flex;justify-content:space-between;font-weight:800;font-size:15px;">
                        <span>Total Estimasi</span><span style="color:#1a73e8;">${fmt(total)}</span>
                    </div>
                </div>
            </div>
            <a href="${mapsUrl}" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:8px;background:#1a73e8;color:#fff;border-radius:12px;padding:13px 20px;font-size:14px;font-weight:800;text-decoration:none;transition:background 0.2s;" onmouseover="this.style.background='#1558b0'" onmouseout="this.style.background='#1a73e8'">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Buka Rute di Google Maps
            </a>
            <div style="text-align:center;margin-top:8px;font-size:10px;color:#bbb;">${location} → Bandung, Jawa Barat</div>
        </div>`;
    document.body.appendChild(modal);
    gsap.fromTo("#itinerary-card", { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.7)" });
    document.getElementById("itinerary-close").addEventListener("click", () => {
        gsap.to("#itinerary-card", { opacity: 0, y: 20, scale: 0.95, duration: 0.25, onComplete: () => modal.remove() });
    });
    modal.addEventListener("click", (e) => {
        if (e.target === modal) gsap.to("#itinerary-card", { opacity: 0, y: 20, scale: 0.95, duration: 0.25, onComplete: () => modal.remove() });
    });
}

function showBudgetBreakdown(location) {
    const existing = document.getElementById("budget-modal");
    if (existing) existing.remove();
    const days = parseInt(voyagerState.duration) || 3;
    const cityTransportMap = {
        "medan": 1400000, "makassar": 1200000, "manado": 1500000,
        "surabaya": 200000, "yogyakarta": 150000, "semarang": 150000,
        "jakarta": 100000, "depok": 100000, "bekasi": 100000, "bogor": 80000,
        "bali": 500000, "denpasar": 500000, "palembang": 400000, "padang": 700000,
    };
    const locLower = location.toLowerCase();
    let baseTransport = 150000;
    for (const [city, cost] of Object.entries(cityTransportMap)) {
        if (locLower.includes(city)) { baseTransport = cost; break; }
    }
    const placeChipsActive = [...document.querySelectorAll(".vbar-chip.checked")].map(c => c.dataset.value || "");
    const activityMultiplier = placeChipsActive.length > 0 ? placeChipsActive.length * 0.4 + 0.6 : 1;
    const routeText = voyagerState.routeOptimization || vbarRouteDate?.textContent?.trim() || "";
    const routeMultiplier = routeText.includes("Scenic") ? 1.3 : routeText.includes("Budget") ? 0.75 : routeText.includes("Time") ? 1.15 : 1.0;
    const routeLabel = routeText.includes("Scenic") ? "Scenic Route (+30%)" : routeText.includes("Budget") ? "Budget Friendly (-25%)" : routeText.includes("Time") ? "Time Efficient (+15%)" : "Standard";
    const transport  = Math.round(baseTransport * routeMultiplier);
    const food       = Math.round(85000 * days * activityMultiplier);
    const stay       = voyagerState.stay === "Tidak Menginap" ? 0 : voyagerState.stay === "Flexible" ? 250000 * Math.max(days - 1, 1) : 350000 * Math.max(days - 1, 1);
    const activities = Math.round(120000 * days * activityMultiplier);
    const total      = transport + food + stay + activities;
    const fmt        = n => new Intl.NumberFormat("id-ID").format(n);
    const activeChipLabels = placeChipsActive.length ? placeChipsActive.join(", ") : "Belum dipilih";

    const modal = document.createElement("div");
    modal.id = "budget-modal";
    modal.style.cssText = `position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.45);backdrop-filter:blur(4px);font-family:'DM Sans',sans-serif;`;
    modal.innerHTML = `
        <div id="budget-card" style="background:#fff;border-radius:20px;padding:28px 32px;max-width:420px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.2);position:relative;">
            <button id="budget-close" style="position:absolute;top:14px;right:16px;background:none;border:none;cursor:pointer;font-size:20px;color:#aaa;">✕</button>
            <div style="font-size:11px;font-weight:800;letter-spacing:1px;color:#75a9b3;text-transform:uppercase;margin-bottom:4px;">Estimasi Biaya</div>
            <h2 style="font-size:20px;font-weight:800;color:#222225;margin:0 0 16px;">💰 Budget Breakdown</h2>
            <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#999;"><span>📍 Asal → Bandung</span><span style="font-weight:700;color:#222225;">${location}</span></div>
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#999;"><span>📅 Durasi</span><span style="font-weight:700;color:#222225;">${voyagerState.duration}</span></div>
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#999;"><span>🏷️ Place Details</span><span style="font-weight:700;color:#75a9b3;">${activeChipLabels}</span></div>
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#999;"><span>🛤️ Route</span><span style="font-weight:700;color:#222225;">${routeLabel}</span></div>
            </div>
            <div style="background:#f7fbfc;border-radius:14px;padding:16px 18px;margin-bottom:16px;">
                <div style="font-size:10px;font-weight:800;color:#75a9b3;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">Rincian Biaya</div>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    <div style="display:flex;justify-content:space-between;font-size:13px;color:#555;"><span>✈️ Transportasi</span><span style="font-weight:700;">Rp ${fmt(transport)}</span></div>
                    <div style="display:flex;justify-content:space-between;font-size:13px;color:#555;"><span>🍜 Makan (${days} hari)</span><span style="font-weight:700;">Rp ${fmt(food)}</span></div>
                    <div style="display:flex;justify-content:space-between;font-size:13px;color:#555;"><span>🏨 Penginapan (${voyagerState.stay})</span><span style="font-weight:700;">Rp ${fmt(stay)}</span></div>
                    <div style="display:flex;justify-content:space-between;font-size:13px;color:#555;"><span>🎯 Aktivitas</span><span style="font-weight:700;">Rp ${fmt(activities)}</span></div>
                    <div style="border-top:1.5px solid #dce8ea;margin-top:6px;padding-top:10px;display:flex;justify-content:space-between;font-weight:800;font-size:16px;">
                        <span>Total Estimasi</span><span style="color:#1a73e8;">Rp ${fmt(total)}</span>
                    </div>
                </div>
            </div>
            <div style="font-size:10px;color:#bbb;text-align:center;">*Estimasi kasar, harga aktual bisa berbeda</div>
        </div>`;
    document.body.appendChild(modal);
    gsap.fromTo("#budget-card", { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.7)" });
    document.getElementById("budget-close").addEventListener("click", () => {
        gsap.to("#budget-card", { opacity: 0, y: 20, scale: 0.95, duration: 0.25, onComplete: () => modal.remove() });
    });
    modal.addEventListener("click", (e) => {
        if (e.target === modal) gsap.to("#budget-card", { opacity: 0, y: 20, scale: 0.95, duration: 0.25, onComplete: () => modal.remove() });
    });
}

// ══════════════════════════════════════════════════════════
// ── SUPABASE REVIEWS ──
// ══════════════════════════════════════════════════════════

const SUPABASE_URL_INDEX  = "https://fvyjlwwurapxbddakdpq.supabase.co";
const SUPABASE_ANON_INDEX = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eWpsd3d1cmFweGJkZGFrZHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNjkxMjUsImV4cCI6MjA5NDY0NTEyNX0.76JVhpxtplY4B0dY7VhBmh2XP_Mzooi84yPA6-vNtb0";
const supabaseIndex = supabase.createClient(SUPABASE_URL_INDEX, SUPABASE_ANON_INDEX);

// FIX: satu deklarasi fungsi ini — tidak duplikat lagi
async function loadLatestReviewsForIndex() {
    const container = document.getElementById("latestReviewsIndex");
    if (!container) return;

    const { data, error } = await supabaseIndex
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

    if (!error && data) {
        if (data.length === 0) {
            container.innerHTML = "<p style='grid-column:1/-1;text-align:center;color:#999;'>Belum ada ulasan masuk.</p>";
            return;
        }
        container.innerHTML = data.map(r => {
            const cleanDestName = r.dest_id.replace(/-/g, ' ');
            return `
                <div class="index-review-card" style="cursor:pointer;" onclick="window.location.href='detaildestinasi.html?id=${r.dest_id}'">
                    <div>
                        <h4>${r.name} <span style="color:#75a9b3;">di ${cleanDestName}</span></h4>
                        <div style="color:#ffb800;margin-bottom:15px;font-size:12px;">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
                    </div>
                    <p>"${r.text.length > 120 ? r.text.substring(0, 120) + '...' : r.text}"</p>
                </div>`;
        }).join("");
    }
}

window.addEventListener("load", loadLatestReviewsForIndex);

// ── INIT ──
switchTab("discovery");
// ── NAV HIDE ON SCROLL (desktop only) ──
(function () {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                // Mobile: always show nav, remove hidden class
                nav.classList.remove('nav--hidden');
                lastY = window.scrollY;
                ticking = false;
                return;
            }

            const currentY = window.scrollY;
            if (currentY > lastY && currentY > 80) {
                // Scrolling DOWN → hide
                nav.classList.add('nav--hidden');
            } else {
                // Scrolling UP → show
                nav.classList.remove('nav--hidden');
            }
            lastY = currentY;
            ticking = false;
        });
    }, { passive: true });
})();