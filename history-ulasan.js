// ── KONFIGURASI SUPABASE CLIENT GLOBAL ──
const SUPABASE_URL      = "https://fvyjlwwurapxbddakdpq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eWpsd3d1cmFweGJkZGFrZHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNjkxMjUsImV4cCI6MjA5NDY0NTEyNX0.76JVhpxtplY4B0dY7VhBmh2XP_Mzooi84yPA6-vNtb0";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Peta slug → nama destinasi yang rapi
const DEST_NAME_MAP = {
    "museum-sribaduga":    "Museum Sribaduga",
    "saung-angklung-udjo": "Saung Angklung Udjo",
    "great-asia-africa":   "The Great Asia Africa",
    "situ-patenggang":     "Situ Patenggang",
    "gunung-putri":        "Gunung Putri",
    "ranca-upas":          "Ranca Upas",
    "kawah-putih":         "Kawah Putih",
    "tebing-keraton":      "Tebing Keraton",
    "tahura-juanda":       "Taman Hutan Raya Juanda",
    "geger-kalong":        "Geger Kalong Girang",
    "warung-sebelah":      "Warung Sebelah",
    "kampung-daun":        "Kampung Kecil",
    "deli-bakes":          "Deli Bakes",
    "sudut-pandang-cafe":  "Sudut Pandang Cafe",
    "nara-park":           "Nara Park",
    "peach-of-cake":       "Peach Of Cake",
    "dago-dreampark":      "Dago Dreampark",
    "orchid-forest":       "Orchid Forest Cikole",
};

document.addEventListener("DOMContentLoaded", async () => {
    const globalLogContainer = document.getElementById("globalHistoryLog");
    if (!globalLogContainer) return;

    const { data: allReviews, error } = await supabaseClient
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Gagal menarik histori global:", error);
        globalLogContainer.innerHTML = "<p class='empty-text' style='color:#c94a4a;'>Gagal terhubung dengan server database.</p>";
        return;
    }

    if (!allReviews || allReviews.length === 0) {
        globalLogContainer.innerHTML = "<p class='empty-text'>Belum ada riwayat ulasan yang terekam di dalam database.</p>";
        return;
    }

    globalLogContainer.innerHTML = allReviews.map(review => {
        const dateFormatted = new Date(review.created_at).toLocaleDateString("id-ID", {
            day: "numeric", month: "long", year: "numeric"
        });

        const starStars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

        // Gunakan nama rapi dari map, fallback ke slug yang dirapikan
        const destName = DEST_NAME_MAP[review.dest_id]
            || review.dest_id.replace(/-/g, " ");

        return `
            <div class="history-item">
                <a href="detaildestinasi.html?id=${review.dest_id}" class="dest-badge" style="text-decoration:none;">
                    ${escapeHTML(destName)}
                </a>
                <div class="item-row">
                    <span class="user-title">${escapeHTML(review.name)}</span>
                    <span class="stars-display">${starStars}</span>
                </div>
                <p class="text-quote">"${escapeHTML(review.text)}"</p>
                <div class="date-footer">${dateFormatted}</div>
            </div>
        `;
    }).join("");
});

// ── XSS GUARD ──
function escapeHTML(str) {
    if (!str) return "";
    return String(str).replace(/[&<>'"]/g, tag => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[tag] || tag));
}