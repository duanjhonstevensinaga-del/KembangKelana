/* ══════════════════════════════════════════════════════════
   paket-auth-gate.js
   Patch: semua aksi beli/lihat paket Voyager wajib login dulu.
   Load SETELAH auth-modal.js dan script_patch.js
   ══════════════════════════════════════════════════════════ */

(function patchPaketWithAuthGate() {

    /* Simpan referensi fungsi asli dari script_patch.js */
    const _originalOpenPackageModal = window.openPackageModal;
    const _originalOpenPaymentModal  = window.openPaymentModal;

    /* ── Override openPackageModal ── */
    window.openPackageModal = function() {
        window.requireLoginForPaket(() => {
            _originalOpenPackageModal && _originalOpenPackageModal();
        });
    };

    /* ── Override openPaymentModal ── */
    window.openPaymentModal = function(pkgKey) {
        window.requireLoginForPaket(() => {
            _originalOpenPaymentModal && _originalOpenPaymentModal(pkgKey);
        });
    };

    /* ── Patch tombol "Generate Itinerary" → wajib login ── */
    document.addEventListener("DOMContentLoaded", () => {
        const genBtn = document.querySelector(".gen-btn");
        if (genBtn) {
            genBtn.addEventListener("click", (e) => {
                if (!window.currentUser) {
                    e.stopImmediatePropagation();
                    window.openAuthModal({
                        hint: '<strong>✈️ Masuk Dulu</strong> — Login untuk generate itinerary Voyager kamu.',
                        onSuccess: () => {
                            // Coba trigger lagi setelah login
                            if (!window.activePaket) {
                                window.openPackageModal && window.openPackageModal();
                            }
                        }
                    });
                }
            }, true); // capture phase agar intercept sebelum handler lain
        }

        /* Patch tombol "Lihat Paket" di voyager card */
        const openPkgBtn = document.getElementById("openPackageBtn");
        if (openPkgBtn) {
            // Remove listener lama dan pasang yang baru dengan gate
            const newBtn = openPkgBtn.cloneNode(true);
            openPkgBtn.parentNode.replaceChild(newBtn, openPkgBtn);
            newBtn.addEventListener("click", () => window.openPackageModal());
        }

        /* Patch tombol "Budget Breakdown" di voyager bar */
        const budgetBtn = document.querySelector(".budget-btn");
        if (budgetBtn) {
            budgetBtn.addEventListener("click", (e) => {
                if (!window.currentUser) {
                    e.stopImmediatePropagation();
                    window.openAuthModal({
                        hint: '<strong>💰 Masuk Dulu</strong> — Login untuk melihat estimasi budget perjalananmu.',
                    });
                }
            }, true);
        }
    });

})();