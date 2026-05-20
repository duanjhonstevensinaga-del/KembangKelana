// ── IMAGE MAP ──
const DEST_IMAGES = {
    "museum-sribaduga": "Museum Sribaduga.svg",
    "saung-angklung-udjo": "Saung Angklung Udjo.svg",
    "great-asia-africa": "Great Asia Africa.svg",
    "situ-patenggang": "Situ Patenggang.svg",
    "gunung-putri": "Gunung Putri.svg",
    "ranca-upas": "Ranca Upas.svg",
    "kawah-putih": "Kawah Putih.svg",
    "tebing-keraton": "Tebing Keraton.svg",
    "tahura-juanda": "Tahura Juanda.svg",
    "geger-kalong": "Geger Kalong Girang.svg",
    "warung-sebelah": "Warung Sebelah.svg",
    "kampung-daun": "Kampung Kecil.svg",
    "deli-bakes": "Deli Bakes.svg",
    "sudut-pandang-cafe": "Sudut Pandang Cafe.svg",
    "nara-park": "Nara Park.svg",
    "peach-of-cake": "Peach of Cake.svg",
    "orchid-forest": "Orchid Forest.svg",
};

const FALLBACK_IMAGES = {
    "museum-sribaduga": "https://placehold.co/400x260/8B7355/fff?text=Museum+Sribaduga",
    "saung-angklung-udjo": "https://placehold.co/400x260/6B8E23/fff?text=Saung+Angklung",
    "great-asia-africa": "https://placehold.co/400x260/2E8B57/fff?text=Great+Asia+Africa",
    "situ-patenggang": "https://placehold.co/400x260/4682B4/fff?text=Situ+Patenggang",
    "gunung-putri": "https://placehold.co/400x260/778899/fff?text=Gunung+Putri",
    "ranca-upas": "https://placehold.co/400x260/4A7C59/fff?text=Ranca+Upas",
    "kawah-putih": "https://placehold.co/400x260/87CEEB/333?text=Kawah+Putih",
    "tebing-keraton": "https://placehold.co/400x260/228B22/fff?text=Tebing+Keraton",
    "tahura-juanda": "https://placehold.co/400x260/3CB371/fff?text=Tahura+Juanda",
    "geger-kalong": "https://placehold.co/400x260/5B7A52/fff?text=Geger+Kalong",
    "warung-sebelah": "https://placehold.co/400x260/B5C9A8/333?text=Warung+Sebelah",
    "kampung-daun": "https://placehold.co/400x260/556B2F/fff?text=Kampung+Kecil",
    "sudut-pandang-cafe": "https://placehold.co/400x260/8FA89B/fff?text=Sudut+Pandang",
    "nara-park": "https://placehold.co/400x260/7CB9A0/fff?text=Nara+Park",
    "peach-of-cake": "https://placehold.co/400x260/D4936B/fff?text=Peach+Of+Cake",
    "deli-bakes": "https://placehold.co/400x260/9370DB/fff?text=Deli+Bakes",
    "orchid-forest": "https://placehold.co/400x260/6A5ACD/fff?text=Orchid+Forest",
    "dago-dreampark": "https://placehold.co/400x260/708090/fff?text=Dago+Dreampark",
};

function resolveImage(id) {
    return DEST_IMAGES[id] || FALLBACK_IMAGES[id] || "https://placehold.co/400x260/ccc/333?text=No+Image";
}

// ── DATA DESTINASI ──
const DESTINATIONS = [
    { id: "museum-sribaduga", name: "Museum Sribaduga", tagline: "Eksplor sisi Cultural kamu yuk!", category: "Cultural", rating: "4.5", distance: "3.2", lat: -6.9218, lng: 107.6066, img: resolveImage("museum-sribaduga"), desc: "Museum Sribaduga adalah museum negeri yang menyimpan koleksi benda-benda bersejarah dan budaya Sunda. Museum ini memiliki ribuan artefak mulai dari masa prasejarah hingga era modern.", mapsQuery: "Museum Sribaduga Bandung" },
    { id: "saung-angklung-udjo", name: "Saung Angklung Udjo", tagline: "Eksplor sisi Cultural kamu yuk!", category: "Cultural", rating: "4.7", distance: "7.8", lat: -6.8916, lng: 107.6601, img: resolveImage("saung-angklung-udjo"), desc: "Saung Angklung Udjo merupakan destinasi wisata budaya di Bandung yang berfokus pada pelestarian seni dan budaya Sunda, khususnya angklung sebagai alat musik tradisional berbahan bambu.", mapsQuery: "Saung Angklung Udjo Bandung" },
    { id: "great-asia-africa", name: "The Great Asia Africa", tagline: "Eksplor sisi Cultural kamu yuk!", category: "Cultural", rating: "4.6", distance: "15", lat: -6.8103, lng: 107.6114, img: resolveImage("great-asia-africa"), desc: "The Great Asia Africa adalah kawasan wisata tematik di Lembang yang menghadirkan miniatur budaya dan arsitektur khas berbagai negara di Asia dan Afrika.", mapsQuery: "The Great Asia Africa Lembang Bandung" },
    { id: "situ-patenggang", name: "Situ Patenggang", tagline: "Eksplor keindahan alam Bandung!", category: "Nature", rating: "4.6", distance: "49", lat: -7.1646, lng: 107.3969, img: resolveImage("situ-patenggang"), desc: "Situ Patenggang adalah danau indah yang terletak di kawasan perkebunan teh Ciwidey. Terdapat Batu Cinta yang dipercaya legenda sebagai simbol kesetiaan, dan perahu yang bisa disewa untuk mengelilingi danau.", mapsQuery: "Situ Patenggang Ciwidey Bandung" },
    { id: "gunung-putri", name: "Gunung Putri", tagline: "Eksplor keindahan alam Bandung!", category: "Nature", rating: "4.3", distance: "25", lat: -6.8021, lng: 107.6328, img: resolveImage("gunung-putri"), desc: "Gunung Putri Lembang menawarkan pemandangan panorama kota Bandung dari ketinggian. Trekking ringan melalui jalur hutan pinus menuju puncak menjadi aktivitas favorit para pengunjung.", mapsQuery: "Gunung Putri Lembang Bandung" },
    { id: "ranca-upas", name: "Ranca Upas", tagline: "Eksplor keindahan alam Bandung!", category: "Nature", rating: "4.4", distance: "51", lat: -7.1762, lng: 107.3843, img: resolveImage("ranca-upas"), desc: "Ranca Upas adalah bumi perkemahan dan kawasan wisata alam di Ciwidey. Pengunjung dapat melihat rusa, berendam di kolam air panas, dan menikmati suasana kabut pagi yang dramatis.", mapsQuery: "Ranca Upas Ciwidey Bandung" },
    { id: "kawah-putih", name: "Kawah Putih", tagline: "Eksplor keindahan alam Bandung!", category: "Nature", rating: "4.8", distance: "46", lat: -7.1662, lng: 107.4020, img: resolveImage("kawah-putih"), desc: "Kawah Putih adalah danau kawah vulkanik dengan air berwarna putih kehijauan akibat kandungan belerang. Dikelilingi tebing berbatu dan suasana berkabut yang misterius namun memukau.", mapsQuery: "Kawah Putih Ciwidey Bandung" },
    { id: "tebing-keraton", name: "Tebing Keraton", tagline: "Eksplor keindahan alam Bandung!", category: "Nature", rating: "4.4", distance: "12", lat: -6.8598, lng: 107.6498, img: resolveImage("tebing-keraton"), desc: "Tebing Keraton menawarkan panorama hutan pinus dan lembah yang luar biasa. Saat pagi hari, pengunjung dapat menyaksikan lautan awan yang menyelimuti lembah.", mapsQuery: "Tebing Keraton Bandung" },
    { id: "tahura-juanda", name: "Taman Hutan Raya Juanda", tagline: "Eksplor keindahan alam Bandung!", category: "Nature", rating: "4.3", distance: "9", lat: -6.8638, lng: 107.6370, img: resolveImage("tahura-juanda"), desc: "Taman Hutan Raya Ir. H. Djuanda menawarkan trekking, bersepeda, dan menjelajahi goa peninggalan Jepang. Dilalui aliran Sungai Cikapundung dan memiliki Curug Dago serta Curug Omas.", mapsQuery: "Taman Hutan Raya Juanda Bandung" },
    { id: "geger-kalong", name: "Geger Kalong Girang", tagline: "Eksplor kuliner khas Bandung!", category: "Culinary", rating: "4.3", distance: "8", lat: -6.8701, lng: 107.5778, img: resolveImage("geger-kalong"), desc: "Geger Kalong Girang adalah kawasan kuliner yang ramai di dekat kampus UPI Bandung, terkenal sebagai surga berburu aneka jajanan pasar, camilan tradisional, hingga makanan berat khas Sunda dengan harga mahasiswa.", mapsQuery: "Geger Kalong Girang Bandung" },
    { id: "warung-sebelah", name: "Warung Sebelah", tagline: "Eksplor kuliner khas Bandung!", category: "Culinary", rating: "4.2", distance: "4", lat: -6.9175, lng: 107.6191, img: resolveImage("warung-sebelah"), desc: "Warung Sebelah adalah konsep warung makan modern yang menggabungkan cita rasa masakan rumahan dengan penyajian estetik dan kekinian. Suasana santai dan harga bersahabat.", mapsQuery: "Warung Sebelah Bandung" },
    { id: "kampung-daun", name: "Kampung Kecil", tagline: "Eksplor kuliner khas Bandung!", category: "Culinary", rating: "4.6", distance: "14", lat: -6.8268, lng: 107.5961, img: resolveImage("kampung-daun"), desc: "Kampung Kecil menghadirkan restoran keluarga berkonsep saung tradisional Sunda yang asri di atas kolam air besar, menyajikan aneka hidangan khas Nusantara cita rasa otentik.", mapsQuery: "Kampung Kecil Bandung" },
    { id: "deli-bakes", name: "Deli Bakes", tagline: "Eksplor tempat cozy di Bandung!", category: "Cozy", rating: "4.4", distance: "3.5", lat: -6.9095, lng: 107.6138, img: resolveImage("deli-bakes"), desc: "Deli Bakes adalah salah satu bakehouse dan kafe estetik bernuansa minimalis modern yang menyajikan aneka pastry segar, dessert manis, serta aneka kopi yang ramah di lidah pecinta nongkrong.", mapsQuery: "Deli Bakes Bandung" },
    { id: "sudut-pandang-cafe", name: "Sudut Pandang Cafe", tagline: "Eksplor tempat cozy di Bandung!", category: "Cozy", rating: "4.4", distance: "11", lat: -6.8198, lng: 107.6079, img: resolveImage("sudut-pandang-cafe"), desc: "Sudut Pandang Cafe adalah kafe modern terbuka dengan pemandangan alam Lembang sebagai latar belakang. Sangat populer di kalangan anak muda sebagai spot foto estetik.", mapsQuery: "Sudut Pandang Cafe Lembang Bandung" },
    { id: "nara-park", name: "Nara Park", tagline: "Eksplor tempat cozy di Bandung!", category: "Cozy", rating: "4.5", distance: "13", lat: -6.8344, lng: 107.5904, img: resolveImage("nara-park"), desc: "Nara Park adalah kawasan kuliner outdoor terpadu di Bandung yang menggabungkan beberapa restoran dan kafe dalam satu area taman hijau luas bernuansa asri dan sangat ramah keluarga.", mapsQuery: "Nara Park Bandung" },
    { id: "peach-of-cake", name: "Peach Of Cake", tagline: "Eksplor tempat cozy di Bandung!", category: "Cozy", rating: "4.3", distance: "5", lat: -6.9143, lng: 107.6322, img: resolveImage("peach-of-cake"), desc: "Peach Of Cake adalah kafe kue dan patisserie dengan dekorasi pastel yang manis dan pilihan kue buatan sendiri berdesain cantik. Tempatnya sangat instagramable dan cozy untuk bersantai.", mapsQuery: "Peach Of Cake Bandung" },
    { id: "dago-dreampark", name: "Dago Dreampark", tagline: "Eksplor tempat cozy di Bandung!", category: "Cozy", rating: "4.3", distance: "10", lat: -6.8512, lng: 107.6250, img: resolveImage("dago-dreampark"), desc: "Dago Dreampark adalah kawasan wisata di atas bukit Dago yang menawarkan taman bermain, spot foto ekstrem yang ikonik, kafe sejuk, dan pemandangan panorama alam Bandung.", mapsQuery: "Dago Dreampark Bandung" },
    { id: "orchid-forest", name: "Orchid Forest Cikole", tagline: "Eksplor tempat cozy di Bandung!", category: "Cozy", rating: "4.5", distance: "20", lat: -6.7930, lng: 107.6225, img: resolveImage("orchid-forest"), desc: "Orchid Forest Cikole menggabungkan keindahan hutan pinus Lembang dengan penangkaran ratusan jenis tanaman anggrek. Wahana jembatan gantung dan lampu estetiknya memberi nuansa magis di malam hari.", mapsQuery: "Orchid Forest Cikole Lembang Bandung" },
];

// ── SUPABASE CONFIG ──
const SUPABASE_URL = "https://fvyjlwwurapxbddakdpq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eWpsd3d1cmFweGJkZGFrZHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNjkxMjUsImV4cCI6MjA5NDY0NTEyNX0.76JVhpxtplY4B0dY7VhBmh2XP_Mzooi84yPA6-vNtb0";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── AUTH ──
const ADMIN_EMAIL_DETAIL = 'admin@kisahanda.co';

async function initDetailAuth() {
    // Cek flag logout
    const hasLogoutFlag = localStorage.getItem('kisahanda_logout') ||
        new URLSearchParams(location.search).get('logout');
    if (hasLogoutFlag) {
        localStorage.removeItem('kisahanda_logout');
        Object.keys(localStorage).forEach(k => {
            if (k.startsWith('sb-') || k.includes('supabase') || k.includes('kisahanda')) localStorage.removeItem(k);
        });
        try { await supabaseClient.auth.signOut({ scope: 'global' }); } catch (_) { }
        history.replaceState(null, '', location.pathname + (location.search.replace(/[?&]logout=1/, '') || ''));
        return;
    }
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session?.user) return;
    const user = session.user;
    const isAdminUser = user.email === ADMIN_EMAIL_DETAIL || user.user_metadata?.role === 'admin';
    const bar = document.getElementById('authBar');
    const email = document.getElementById('authBarEmail');
    const badge = document.getElementById('authBarBadge');
    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0];
    if (bar) bar.style.display = 'flex';
    if (email) email.textContent = name;
    if (badge) badge.style.display = isAdminUser ? 'inline-flex' : 'none';
}
initDetailAuth();

// ── HELPERS ──
function getParam(key) {
    return new URLSearchParams(window.location.search).get(key);
}

function showToast(msg) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2400);
}

function bindImageFallback(imgEl, id) {
    imgEl.addEventListener("error", function onErr() {
        imgEl.removeEventListener("error", onErr);
        imgEl.src = FALLBACK_IMAGES[id] || "https://placehold.co/400x260/ccc/333?text=No+Image";
    });
}

function escapeHTML(str) {
    if (!str) return "";
    return String(str).replace(/[&<>'"]/g, t => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[t] || t
    ));
}

// ── HAVERSINE DISTANCE (km) ──
function haversineKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2
        + Math.cos(lat1 * Math.PI / 180)
        * Math.cos(lat2 * Math.PI / 180)
        * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatKm(km) {
    return km < 1 ? (km * 1000).toFixed(0) + " m"
        : km < 10 ? km.toFixed(1) + " km"
            : Math.round(km) + " km";
}

// ── GEOLOCATION → update chip jarak ──
function initGeolocation(dest) {
    const chip = document.getElementById("destDistance");
    if (!navigator.geolocation || !dest.lat || !dest.lng) return;

    chip.textContent = "📍 Mendeteksi...";

    navigator.geolocation.getCurrentPosition(
        pos => {
            const d = haversineKm(pos.coords.latitude, pos.coords.longitude, dest.lat, dest.lng);
            chip.textContent = "📍 " + formatKm(d);

            // update juga di kartu "other" yang sudah ter-render
            document.querySelectorAll(".other-card[data-id]").forEach(card => {
                const otherId = card.getAttribute("data-id");
                const other = DESTINATIONS.find(x => x.id === otherId);
                if (!other || !other.lat) return;
                const od = haversineKm(pos.coords.latitude, pos.coords.longitude, other.lat, other.lng);
                const infoP = card.querySelector(".other-dist");
                if (infoP) infoP.textContent = other.category + " · " + formatKm(od);
            });
        },
        _err => {
            // fallback ke data statis jika ditolak
            chip.textContent = "📍 " + dest.distance + " km";
        },
        { timeout: 8000, maximumAge: 60000 }
    );
}

// ── LOAD DETAIL DESTINASI (Supabase-first, fallback ke hardcoded) ──
async function loadDetail() {
    const id = getParam("id") || "saung-angklung-udjo";

    // Coba ambil dari Supabase dulu
    let dest = null;
    try {
        const { data, error } = await supabaseClient
            .from("destinations")
            .select("*")
            .eq("id", id)
            .single();
        if (!error && data) {
            dest = {
                id: data.id,
                name: data.name,
                tagline: data.tagline || "",
                category: data.category,
                rating: data.rating || "0.0",
                distance: data.distance || "0",
                lat: data.lat,
                lng: data.lng,
                img: data.img_url || resolveImage(id),
                desc: data.description || "",
                mapsQuery: data.maps_query || data.name + " Bandung",
            };
        }
    } catch (_) { }

    // Fallback ke data hardcoded jika Supabase gagal / data belum ada
    if (!dest) dest = DESTINATIONS.find(d => d.id === id) || DESTINATIONS[1];

    document.title = dest.name + " \u2014 Kisah Anda";
    document.getElementById("navTitle").textContent = dest.name;
    document.getElementById("destName").textContent = dest.name;
    document.getElementById("destTagline").textContent = dest.tagline;
    document.getElementById("destCategory").textContent = dest.category;
    document.getElementById("destRating").textContent = "\u2B50 " + dest.rating;
    document.getElementById("destDistance").textContent = "\uD83D\uDCCD " + dest.distance + " km";
    initGeolocation(dest);
    document.getElementById("destDesc").textContent = dest.desc;

    const mainImg = document.getElementById("destImg");
    mainImg.src = dest.img;
    mainImg.alt = dest.name;
    bindImageFallback(mainImg, dest.id);

    document.getElementById("btnLocation").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(dest.mapsQuery);
    document.getElementById("btnInfo").href = "https://www.google.com/search?q=" + encodeURIComponent(dest.name + " Bandung wisata");

    // Destinasi Lainnya - coba dari Supabase, fallback hardcoded
    let others = [];
    try {
        const { data } = await supabaseClient
            .from("destinations")
            .select("id, name, category, distance, img_url")
            .neq("id", id)
            .limit(20);
        if (data && data.length > 0) {
            others = data
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map(d => ({
                    id: d.id,
                    name: d.name,
                    category: d.category,
                    distance: d.distance || 0,
                    img: d.img_url || resolveImage(d.id),
                }));
        }
    } catch (_) { }

    if (others.length === 0) {
        others = DESTINATIONS
            .filter(d => d.id !== dest.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
    }

    document.getElementById("otherGrid").innerHTML = others.map(d =>
        '<a class="other-card" href="detaildestinasi.html?id=' + d.id + '" data-id="' + d.id + '">' +
        '<img src="' + d.img + '" alt="' + escapeHTML(d.name) + '" ' +
        'onerror="this.src=\'' + (FALLBACK_IMAGES[d.id] || "https://placehold.co/200x140/ccc/333?text=No+Image") + '\'" />' +
        '<div class="other-card-info"><h4>' + escapeHTML(d.name) + '</h4>' +
        '<p class="other-dist">' + escapeHTML(d.category) + ' \u00B7 \uD83D\uDCCD ' + d.distance + ' km</p>' +
        '</div></a>'
    ).join("");
}


// ── REVIEWS ──
const currentDestId = getParam("id") || "default-slug";
let selectedRatingInput = 0;

async function loadDestinationReviews() {
    const reviewsList = document.getElementById("reviewsList");
    if (!reviewsList) return;

    reviewsList.innerHTML = `<p class="loading-reviews">Memuat ulasan...</p>`;

    const { data: reviews, error } = await supabaseClient
        .from("reviews")
        .select("*")
        .eq("dest_id", currentDestId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Gagal memuat ulasan:", error);
        reviewsList.innerHTML = `<p class="empty-reviews">Gagal memuat ulasan. Coba refresh halaman.</p>`;
        return;
    }

    if (!reviews || reviews.length === 0) {
        reviewsList.innerHTML = `<p class="empty-reviews">Belum ada cerita perjalanan di sini. Jadilah yang pertama membagikan ulasan!</p>`;
        updateOverviewStats("0.0", 0);
        return;
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = (totalRating / reviews.length).toFixed(1);
    updateOverviewStats(avgRating, reviews.length);

    reviewsList.innerHTML = reviews.map(rev => {
        const dateFormatted = new Date(rev.created_at).toLocaleDateString("id-ID", {
            day: "numeric", month: "long", year: "numeric"
        });
        const filledStars = "★".repeat(rev.rating) + "☆".repeat(5 - rev.rating);
        return `
            <div class="review-item-card">
                <div class="review-item-header">
                    <span class="reviewer-name">${escapeHTML(rev.name)}</span>
                    <span class="review-item-stars">${filledStars}</span>
                </div>
                <p class="reviewer-text">"${escapeHTML(rev.text)}"</p>
                <div class="review-item-date">${dateFormatted}</div>
            </div>
        `;
    }).join("");
}

function updateOverviewStats(avg, count) {
    const avgText = document.getElementById("reviewsAverageRating");
    const avgStars = document.getElementById("reviewsAverageStars");
    const cntText = document.getElementById("reviewsCount");

    if (avgText) avgText.innerText = count > 0 ? avg : "0.0";
    if (cntText) cntText.innerText = `(${count} ulasan)`;
    if (avgStars) {
        const round = Math.round(parseFloat(avg));
        avgStars.innerText = count > 0
            ? "★".repeat(round) + "☆".repeat(5 - round)
            : "☆☆☆☆☆";
    }

    // ── Sinkronkan chip rating di detail card ──
    const ratingChip = document.getElementById("destRating");
    if (ratingChip && count > 0) {
        ratingChip.textContent = "⭐ " + avg;
    }
}

// ── STAR INPUT ──
function highlightStarsOnHover(val) {
    document.querySelectorAll("#ratingInputStars span").forEach(s => {
        const v = parseInt(s.getAttribute("data-value"));
        s.innerText = v <= val ? "★" : "☆";
        s.classList.toggle("hover", v <= val);
    });
}

function updateInputStars(val) {
    document.querySelectorAll("#ratingInputStars span").forEach(s => {
        const v = parseInt(s.getAttribute("data-value"));
        s.innerText = v <= val ? "★" : "☆";
        s.classList.toggle("active", v <= val);
    });
}

function resetInputStars() {
    selectedRatingInput = 0;
    document.querySelectorAll("#ratingInputStars span").forEach(s => {
        s.innerText = "☆";
        s.classList.remove("active", "hover");
    });
}

// ── DOM READY ──
document.addEventListener("DOMContentLoaded", () => {
    loadDetail();
    loadDestinationReviews();

    const reviewForm = document.getElementById("reviewForm");
    const btnToggleForm = document.getElementById("btnToggleForm");
    const btnCancelReview = document.getElementById("btnCancelReview");
    const starContainer = document.getElementById("ratingInputStars");

    btnToggleForm?.addEventListener("click", () => {
        reviewForm.classList.remove("hidden");
        reviewForm.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    btnCancelReview?.addEventListener("click", () => {
        reviewForm.classList.add("hidden");
        reviewForm.reset();
        resetInputStars();
    });

    starContainer?.querySelectorAll("span").forEach(star => {
        star.addEventListener("click", e => {
            selectedRatingInput = parseInt(e.target.getAttribute("data-value"));
            updateInputStars(selectedRatingInput);
        });
        star.addEventListener("mouseenter", e => {
            highlightStarsOnHover(parseInt(e.target.getAttribute("data-value")));
        });
        star.addEventListener("mouseleave", () => {
            highlightStarsOnHover(selectedRatingInput);
        });
    });

    // ── SUBMIT ULASAN KE SUPABASE ──
    reviewForm?.addEventListener("submit", async e => {
        e.preventDefault();

        const reviewerName = document.getElementById("reviewName").value.trim();
        const reviewerText = document.getElementById("reviewText").value.trim();

        if (!reviewerName) { showToast("Masukkan nama kamu dulu ya!"); return; }
        if (selectedRatingInput === 0) { showToast("Pilih rating bintang dulu ya!"); return; }
        if (!reviewerText) { showToast("Ceritakan pengalamanmu dulu!"); return; }

        const btnSubmit = document.getElementById("btnSubmitReview");
        btnSubmit.disabled = true;
        btnSubmit.textContent = "Mengirim...";

        const { error } = await supabaseClient
            .from("reviews")
            .insert([{
                dest_id: currentDestId,
                name: reviewerName,
                rating: selectedRatingInput,
                text: reviewerText,
            }]);

        btnSubmit.disabled = false;
        btnSubmit.textContent = "Kirim Ulasan";

        if (error) {
            console.error("Gagal mengirim ulasan:", error);
            showToast("❌ Gagal mengirim. Coba lagi.");
            return;
        }

        reviewForm.classList.add("hidden");
        reviewForm.reset();
        resetInputStars();
        showToast("✨ Ulasan kamu berhasil dikirim!");
        loadDestinationReviews();
    });
});
/* ══════════════════════════════════════
   LOGOUT HANDLER
   (sama seperti destinasi.js agar admin bisa keluar dari halaman detail)
══════════════════════════════════════ */
document.body.addEventListener('click', async (e) => {
    if (!e.target.closest('#btnLogout')) return;
    try { await supabaseClient.auth.signOut({ scope: 'global' }); } catch (_) {
        console.log("error")
    }
    Object.keys(localStorage).forEach(k => {
        if (k.startsWith('sb-') || k.includes('supabase') || k.includes('kisahanda')) localStorage.removeItem(k);
    });
    sessionStorage.clear();
    showToast('Berhasil keluar. Sampai jumpa! 👋');
    setTimeout(() => { location.href = location.pathname + '?logout=1'; }, 900);
});