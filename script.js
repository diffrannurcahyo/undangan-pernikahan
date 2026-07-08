/* ==========================================================================
   UNDANGAN PERNIKAHAN DIGITAL: SILPI & DIFFRAN
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================================================
    // 1. LOGIKA MENAMPILKAN NAMA TAMU DARI URL (EXCEL/GOOGLE SHEETS)
    // ==========================================================================
    const parameterURL = new URLSearchParams(window.location.search);
    const namaDiURL = parameterURL.get('to');
    const elemenNamaTamu = document.getElementById('nama-tamu');

    if (namaDiURL && elemenNamaTamu) {
        // Mengubah kode %20 kembali menjadi spasi normal
        elemenNamaTamu.innerText = decodeURIComponent(namaDiURL);
    } else if (elemenNamaTamu) {
        // Teks cadangan jika tautan dibuka tanpa nama spesifik
        elemenNamaTamu.innerText = "Teman-teman & Keluarga";
    }


    // ==========================================================================
    // 2. LOGIKA BUKA UNDANGAN & AUTOPLAY MUSIK
    // ==========================================================================
    const tombolBuka = document.getElementById('tombol-buka');
    const audioElemen = document.getElementById('wedding-audio');
    const btnMusikKontrol = document.getElementById('btn-musik-kontrol');
    const iconMusik = document.getElementById('icon-musik');
    
    let musikSedangBerputar = false;

    if (tombolBuka) {
        tombolBuka.addEventListener('click', function() {
            // Membuka kunci scroll halaman
            document.body.classList.remove('locked');

            // Efek animasi transisi menutup cover ke atas
            const coverSection = document.getElementById('cover');
            if (coverSection) {
                coverSection.style.transition = "all 0.8s ease";
                coverSection.style.transform = "translateY(-100vh)";
                setTimeout(() => {
                    coverSection.style.display = "none";
                }, 800);
            }

            // Memulai putaran musik setelah ada interaksi klik
            if (audioElemen) {
                audioElemen.play().then(() => {
                    musikSedangBerputar = true;
                    if (btnMusikKontrol) btnMusikKontrol.style.display = "flex";
                }).catch(error => {
                    console.log("Autoplay diblokir oleh sistem browser:", error);
                });
            }
        });
    }

    // Kontrol On/Off Musik via Floating Button
    if (btnMusikKontrol && audioElemen) {
        btnMusikKontrol.addEventListener('click', function() {
            if (musikSedangBerputar) {
                audioElemen.pause();
                iconMusik.className = "fa-solid fa-volume-xmark";
                musikSedangBerputar = false;
            } else {
                audioElemen.play();
                iconMusik.className = "fa-solid fa-disc fa-spin";
                musikSedangBerputar = true;
            }
        });
    }


    // ==========================================================================
    // 3. LOGIKA HITUNG MUNDUR (COUNTDOWN TIMER)
    // ==========================================================================
    // Target tanggal pernikahan: 10 Oktober 2026 09:00:00
    const tanggalTujuan = new Date("Oct 10, 2026 09:00:00").getTime();

    const hitungMundur = setInterval(function() {
        const sekarang = new Date().getTime();
        const selisihWaktu = tanggalTujuan - sekarang;

        // Perhitungan matematika untuk Hari, Jam, Menit, Detik
        const hari = Math.floor(selisihWaktu / (1000 * 60 * 60 * 24));
        const jam = Math.floor((selisihWaktu % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const menit = Math.floor((selisihWaktu % (1000 * 60 * 60)) / (1000 * 60));
        const detik = Math.floor((selisihWaktu % (1000 * 60)) / 1000);

        // Menampilkan hasil ke elemen HTML masing-masing
        if(document.getElementById("days")) {
            document.getElementById("days").innerText = hari < 10 ? "0" + hari : hari;
            document.getElementById("hours").innerText = jam < 10 ? "0" + jam : jam;
            document.getElementById("minutes").innerText = menit < 10 ? "0" + menit : menit;
            document.getElementById("seconds").innerText = detik < 10 ? "0" + detik : detik;
        }

        // Jika waktu hitung mundur selesai
        if (selisihWaktu < 0) {
            clearInterval(hitungMundur);
            const containerCountdown = document.querySelector(".countdown-container");
            if (containerCountdown) {
                containerCountdown.innerHTML = "<h4 class='text-gold fw-bold w-100 text-center py-2'>Acara Sedang / Telah Berlangsung</h4>";
            }
        }
    }, 1000);


    // ==========================================================================
    // 4. LOGIKA INTEGRASI FORMULIR RSVP KE WHATSAPP
    // ==========================================================================
    const formRSVP = document.getElementById('form-rsvp');
    
    if (formRSVP) {
        formRSVP.addEventListener('submit', function(e) {
            e.preventDefault();

            // Ambil data input dari user
            const nama = document.getElementById('rsvp-nama').value;
            const jumlahTamu = document.getElementById('rsvp-jumlah').value;
            const statusKehadiran = document.getElementById('rsvp-status').value;

            // Ganti dengan nomor WhatsApp pengantin/panitia asli (awali dengan 62)
            const nomorTujuanWA = "6281234567890"; 

            // Susun teks pesan WhatsApp
            const teksPesan = "Halo, saya ingin mengonfirmasi kehadiran untuk undangan pernikahan Silpi & Diffran.\n\n" +
                              "*Nama:* " + nama + "\n" +
                              "*Jumlah Tamu:* " + jumlahTamu + " orang\n" +
                              "*Konfirmasi Kehadiran:* " + statusKehadiran;

            // Buka tab WhatsApp otomatis
            const urlWhatsApp = "https://api.whatsapp.com/send?phone=" + nomorTujuanWA + "&text=" + encodeURIComponent(teksPesan);
            window.open(urlWhatsApp, '_blank');
        });
    }


    // ==========================================================================
    // 5. LOGIKA DO'A & UCAPAN (LOCAL STORAGE SYSTEM)
    // ==========================================================================
    const formWish = document.getElementById('form-wish');
    const wishesBox = document.getElementById('wishes-box');

    function muatUcapan() {
        if (!wishesBox) return;
        wishesBox.innerHTML = '';
        
        let daftarUcapan = JSON.parse(localStorage.getItem('wedding_wishes')) || [];

        if (daftarUcapan.length === 0) {
            wishesBox.innerHTML = `<p class="text-muted text-center small my-3">Belum ada ucapan. Jadilah yang pertama memberikan doa!</p>`;
            return;
        }

        // Menampilkan ucapan terbaru di posisi paling atas
        daftarUcapan.reverse().forEach(function(item) {
            const div = document.createElement('div');
            div.className = 'wish-card p-3 mb-2 shadow-sm border';
            div.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <h5 class="fw-bold m-0" style="font-size: 14px;"><i class="fa-solid fa-user-heart me-2 text-gold"></i>${item.nama}</h5>
                    <small class="text-muted" style="font-size: 11px;">${item.waktu}</small>
                </div>
                <p class="mb-0 text-secondary italic">"${item.pesan}"</p>
            `;
            wishesBox.appendChild(div);
        });
    }

    if (formWish) {
        formWish.addEventListener('submit', function(e) {
            e.preventDefault();

            const nama = document.getElementById('wish-nama').value;
            const pesan = document.getElementById('wish-pesan').value;
            
            const opsiWaktu = { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' };
            const waktuSekarang = new Date().toLocaleDateString('id-ID', opsiWaktu);

            let daftarUcapan = JSON.parse(localStorage.getItem('wedding_wishes')) || [];
            
            daftarUcapan.push({
                nama: nama,
                pesan: pesan,
                waktu: waktuSekarang
            });

            localStorage.setItem('wedding_wishes', JSON.stringify(daftarUcapan));
            formWish.reset();
            muatUcapan();
        });
    }

    // Jalankan render daftar ucapan di awal aplikasi dimuat
    muatUcapan();


    // ==========================================================================
    // 6. LOGIKA TOMBOL SALIN REKENING E-GIFT
    // ==========================================================================
    const tombolSalin = document.querySelectorAll('.btn-salin');

    tombolSalin.forEach(function(tombol) {
        tombol.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const elemenTeks = document.getElementById(targetId);

            if (elemenTeks) {
                const nomorRekening = elemenTeks.innerText;

                // Menggunakan native Clipboard API
                navigator.clipboard.writeText(nomorRekening).then(() => {
                    const teksAsli = this.innerHTML;

                    // Berikan feedback visual berhasil disalin
                    this.innerHTML = `<i class="fa-solid fa-check me-1"></i>Tersalin!`;
                    this.classList.remove('btn-outline-warning');
                    this.classList.add('btn-success', 'text-white');

                    // Kembalikan tampilan tombol ke semula setelah 2 detik
                    setTimeout(() => {
                        this.innerHTML = teksAsli;
                        this.classList.remove('btn-success', 'text-white');
                        this.classList.add('btn-outline-warning');
                    }, 2000);
                }).catch(err => {
                    console.error('Sistem gagal menyalin teks: ', err);
                });
            }
        });
    });

});