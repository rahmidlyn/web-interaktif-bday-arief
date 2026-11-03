# PLAYER 01: ARIEF 🎮 Level 29

Website ulang tahun berbentuk game RPG retro 16-bit dengan cerita **"Satu Hari Menuju Level 29"**: 10 stage dari pagi sampai malam.

| Stage | Waktu | Isi | Item untuk battle |
|---|---|---|---|
| 00 Perkenalan Pemain | Pagi | Profil karakter | — |
| 01 Quiz Kepribadian | Pagi | 5 pertanyaan | — |
| 02 Morning Rush | 06.30 | Rutinitas pagi + tolak godaan | ☕ Kopi Pagi: HP maksimal naik |
| 03 Kartu Memori | 07.25 | Cocokkan 8 pasang barang bawaan | 📝 Catatan Anti Lupa: serangan boss melemah |
| 04 Whack-a-Bug | 12.00 | Basmi bug 25 detik | ⌨️ Keyboard Legendaris: Coding Strike naik |
| 05 Tangkap Jajanan | 17.30 | Tangkap jajanan, hindari rokok | 🍢 Bekal Jajanan: Sleep Recovery bertambah |
| 06 Battle ADULTING | 21.00 | Boss terakhir, semua item aktif | — |
| 07 Mesin Ramalan | Malam | 6 kategori ramalan | — |
| 08 Penghargaan | Malam | Sertifikat PNG berisi semua skor | — |
| 09 Surat Terakhir | Malam | Surat penutup | — |
| ★ Hadiah Utama | 00.00 | Pilih 1 dari 15 hadiah "mustahil". Apa pun pilihannya, hasilnya selalu Power Bank Anker | Hadiah asli |

Warna langit ikut waktu cerita (pagi, siang, sore, malam). Semua mini game dibuat pasti bisa diselesaikan; skor yang lebih tinggi memberi bonus item yang lebih besar.
Dibuat dengan HTML, CSS, dan vanilla JavaScript. Tanpa backend, tanpa build tool, dan tanpa library tambahan.

## Isi folder

| File | Fungsi |
|---|---|
| `index.html` | Halaman utama, termasuk seluruh tampilan game (di dalam `<template id="game-template">`) |
| `style.css` | Semua styling dan breakpoint responsive (mobile < 600px, tablet 600–1023px, desktop ≥ 1024px) |
| `script.js` | Logika game, musik, dan semua teks (quiz, ramalan, surat, achievement) |
| `config.js` | **Pengaturan yang perlu kamu edit**: foto Arief dan posisi crop-nya |
| `mini-dc.js` | Renderer kecil yang menghubungkan template dengan logika. Tidak perlu diubah |
| `assets/` | Tempat menaruh foto Arief |

## 1. Memasang foto Arief

1. Simpan fotonya di `assets/arief-photo.jpg` (JPG atau PNG; untuk PNG, sesuaikan juga nama filenya).
2. Buka `config.js`, lalu ubah `photo: ''` menjadi `photo: 'assets/arief-photo.jpg'`.
3. Atur crop-nya. Arief ada di **kiri** foto, jadi nilai default `photoX: 0.27` sudah mengarah ke sana:
   - `photoX`: geser kiri/kanan (0 = tepi kiri, 1 = tepi kanan)
   - `photoY`: geser atas/bawah
   - `photoZoom`: 1 = kepala dan bahu, makin besar makin dekat

**Cara paling mudah menemukan angka crop:** buka game, klik tombol kamera di pojok bingkai avatar, pilih fotonya, lalu geser slider sampai yang terlihat hanya kepala dan bahu Arief. Salin angkanya ke `config.js`. Hasil pilihan lewat tombol ini hanya tersimpan di browser yang dipakai, jadi untuk HP Arief tetap pakai langkah 1–2.

Foto otomatis di-crop, di-pixelate, dan warnanya diturunkan ke palet ala 16-bit. Kalau `photo` dibiarkan kosong, game memakai sprite pixel-art Arief yang digambar tangan.

## 2. Mengedit teks

Semua teks ada di `script.js`, di dalam fungsi `D()` di bagian atas:
- `attrs`: stat karakter beserta komentar lucunya
- `quiz`: 5 pertanyaan. Setiap jawaban punya kategori (`sleepy`, `overthink`, `hungry`, `procrast`, `esports`)
- `types`: judul, deskripsi, dan rekomendasi untuk tiap kepribadian
- `cats`: 6 kategori ramalan dan pesannya
- `games`: teks cerita, aturan, dan label rating tiap mini game
- `rushTasks`, `tempts`: rutinitas pagi dan godaan di Morning Rush
- `memCards`: 8 gambar di Kartu Memori
- `itemBonus`: besar bonus tiap item (level 1–3)
- `prizes`: daftar hadiah "mustahil" beserta pesan error lucunya (Hadiah Utama). Teks hasil power bank dan klaim hadiah ada di `index.html`, cari `POWER BANK ANKER`
- `letter`: isi surat terakhir. Satu baris di array = satu paragraf

Judul, label tombol, dan teks profil ada langsung di `index.html`.

Setelah mengedit, ubah `instance` di `config.js` (misalnya ke `'web2'`) supaya progres lama yang tersimpan di browser ikut ter-reset.

## 3. Musik dan suara

- Setiap stage punya lagu chiptune original sendiri, termasuk keempat mini game, dan music box lembut di surat terakhir.
- Ada suara pengumuman berbahasa Indonesia ("Stage berikutnya!", "Victory!", "Achievement terbuka!") memakai suara bawaan browser/HP. Suaranya bisa berbeda di tiap perangkat.
- Semua suara dibuat langsung oleh browser (Web Audio API), jadi tidak ada file audio dan tidak ada masalah hak cipta.
- Musik baru mulai setelah sentuhan atau klik pertama, karena browser memblokir autoplay.
- Ikon speaker di kanan atas mematikan atau menyalakan musik, efek suara, dan pengumuman sekaligus.
- Melodinya bisa diubah di `script.js`, di fungsi `songs()`: angka = nada (format MIDI, 60 = C tengah), 0 = jeda.
- Di iPhone, mode silent biasanya ikut membisukan suara dari web.

## 4. Menjalankan di komputer

Game ini butuh web server lokal. Membuka `index.html` dengan dobel-klik juga biasanya jalan, tapi foto dari `assets/` bisa diblokir oleh browser.

```bash
cd birthday-arief
python3 -m http.server 8000
# buka http://localhost:8000
```

Alternatif: `npx serve .`, atau ekstensi **Live Server** di VS Code.

## 5. Publish online (gratis)

- **Netlify Drop** (paling cepat): buka https://app.netlify.com/drop, lalu drag-and-drop folder `birthday-arief`. Kamu langsung dapat link yang bisa dikirim ke Arief.
- **GitHub Pages**: upload isi folder ke repo baru, lalu buka Settings → Pages → Deploy from branch → `main` / root.
- **Vercel**: `npx vercel` dari dalam folder ini, atau import repo-nya di vercel.com.

## Catatan

- Progres tersimpan di `localStorage` per browser. Tombol ulangi (ikon panah melingkar) menghapus progres setelah konfirmasi.
- Keyboard di desktop: `1` `2` `3` untuk skill battle, `A`–`D` untuk menjawab quiz, panah kiri/kanan di Tangkap Jajanan, `Esc` untuk menutup popup.
- Tas item dan achievement bisa dilihat lewat ikon piala di kanan atas.
- Easter egg: klik avatar 5×, cari bebek karet, cari sate yang tersembunyi, dan klik stat "Manajemen Waktu" dua kali.
- Font dimuat dari Google Fonts (Press Start 2P, Rubik, VT323).
