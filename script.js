/* PLAYER 01: ARIEF — game logic & content. Edit texts inside D() below. */
class Component extends DCLogic {
  constructor(...args) {
    super(...args);
    this._timers = [];
    this._taps = [];
    this._lastSaved = '';
    const saved = this.load();
    this.state = Object.assign(this.blank(), saved, this.blankUI());
    const b = this.state.battle;
    if (b && b.phase === 'boss') this.state.battle = Object.assign({}, b, { phase: 'player' });
    if (b && b.won) this.state.victoryShow = true;
    if (this.state.view === 'prize') this.state.prizePhase = this.state.prize && this.state.prize.done ? 'reveal' : 'pick';
    if (this.D().games[this.state.view]) this.state.mgPhase = this.state.games[this.state.view] ? 'done' : 'story';
    const p = this.loadPhoto();
    if (p) { this.state.photoSrc = p.src; this.state.crop = p.crop || this.state.crop; this.state.photoLocal = true; }
  }

  /* ------------------------------------------------------------------ data */
  D() {
    if (this._d) return this._d;
    this._d = {
      stages: [
        { id: 'intro', num: '00', name: 'PERKENALAN PEMAIN', tod: 'pagi', say: 'Perkenalan pemain' },
        { id: 'quiz', num: '01', name: 'KUIS KEPRIBADIAN', tod: 'pagi', say: 'Quiz kepribadian' },
        { id: 'rush', num: '02', name: 'MORNING RUSH', tod: 'pagi', say: 'Morning Rush' },
        { id: 'memory', num: '03', name: 'KARTU MEMORI', tod: 'pagi', say: 'Kartu memori' },
        { id: 'bugs', num: '04', name: 'WHACK-A-BUG', tod: 'siang', say: 'Whack a bug' },
        { id: 'food', num: '05', name: 'TANGKAP JAJANAN', tod: 'sore', say: 'Tangkap jajanan' },
        { id: 'battle', num: '06', name: 'BATTLE ADULTING', tod: 'malam', say: 'Battle melawan Adulting' },
        { id: 'prophecy', num: '07', name: 'MESIN RAMALAN', tod: 'malam', say: 'Mesin ramalan' },
        { id: 'award', num: '08', name: 'PENGHARGAAN', tod: 'malam', say: 'Penghargaan ulang tahun' },
        { id: 'letter', num: '09', name: 'PESAN UNTUKMU', tod: 'malam', say: 'Pesan terakhir' },
        { id: 'prize', num: '★', name: 'HADIAH UTAMA', tod: 'malam', say: 'Hadiah utama' }
      ],
      prizes: [
        ['1000 Hektar Tanah', 'Sertifikat tanah masih diproses. Estimasi selesai: 200 tahun lagi.'],
        ['Mobil BYD', 'Stok habis. Inden 12 tahun, dan kamu belum punya garasi.'],
        ['Mobil Tesla', 'Saldo pembuat game tidak mencukupi. Kurang sedikit… sekitar Rp 1 miliar.'],
        ['Tiket Keliling Dunia', 'Ditolak. Alasan: kamu pasti telat datang ke bandara.'],
        ['Jadi Pejabat', 'Ditolak. Belum lulus tes bangun pagi.'],
        ['Kontrak Tim Esports Pro', 'Ditunda. Scout masih nunggu kamu push rank, bukan cuma rencana push rank.'],
        ['Semua Skin ML Seumur Hidup', 'Gagal. Diamond yang dibutuhkan melebihi kapasitas server.'],
        ['Rank Mythical Immortal Instan', 'Ditolak sistem. Legenda nggak pakai jalan pintas.'],
        ['Gerobak Martabak Pribadi', 'Abangnya menolak. Takut martabaknya habis sebelum sampai rumah.'],
        ['Libur 1 Tahun Tetap Digaji', 'HRD sedang tertawa. Mohon tunggu sampai tawanya selesai.'],
        ['Saldo Rp 100 Miliar', 'Transaksi gagal. Saldo pembuat game: Rp 87.500.'],
        ['Pulau Pribadi di Maldives', 'Pulau tidak ditemukan di peta. Mungkin lagi pasang.'],
        ['Tiket Liburan ke Mars', 'Roket penuh. Silakan coba lagi tahun 2099.'],
        ['WiFi 10 Gbps Anti Lag', 'Provider bilang: “Gangguan sedang diperbaiki.” Sejak 2019.'],
        ['Server Anti Down Seumur Hidup', 'Error 500. Ironis, ya.']
      ],
      games: {
        rush: { title: 'MORNING RUSH', clock: '06.30', tod: 'PAGI', icon: 'bed', item: 'coffee',
          sub: 'Siap berangkat sebelum jam 07.30!',
          text: 'Alarm berbunyi. Arief harus siap berangkat sebelum jam 07.30. Selesaikan rutinitas pagi sesuai urutan, dan tolak semua godaan yang muncul!',
          rules: ['Tap rutinitas sesuai urutan di daftar.', 'Salah urutan: waktu terbuang 2 menit.', 'Tergoda, atau diam saja waktu ada godaan: waktu terbuang.'],
          ratings: ['', 'TELAT 15 MENIT (SEPERTI BIASA)', 'TELAT DIKIT', 'TEPAT WAKTU!'] },
        memory: { title: 'KARTU MEMORI', clock: '07.25', tod: 'PAGI', icon: 'wallet', item: 'note',
          sub: 'Jangan sampai ada yang ketinggalan.',
          text: 'Sebelum berangkat, cek dulu barang bawaan. Arief suka lupa, jadi temukan semua pasangan kartu supaya nggak ada yang ketinggalan!',
          rules: ['Buka dua kartu sekaligus.', 'Kalau gambarnya sama, kartu tetap terbuka.', 'Makin sedikit langkah, makin bagus hadiahnya.'],
          ratings: ['', 'AKHIRNYA KETEMU SEMUA', 'INGATAN LUMAYAN', 'INGATAN TAJAM!'] },
        bugs: { title: 'WHACK-A-BUG', clock: '12.00', tod: 'SIANG', icon: 'bug', item: 'keyboard',
          sub: 'Production lagi panik!',
          text: 'Siang di kantor, dan bug bermunculan dari server. Basmi sebanyak mungkin dalam 25 detik sebelum production rusak!',
          rules: ['Tap bug hijau: +1.', 'Jangan tap notifikasi push rank: −1.', 'Fokus kerja dulu, mainnya nanti.'],
          ratings: ['', 'PRODUCTION SELAMAT', 'DEVELOPER ANDALAN', 'BUG SLAYER!'] },
        food: { title: 'TANGKAP JAJANAN', clock: '17.30', tod: 'SORE', icon: 'martabak', item: 'bekal',
          sub: 'Perjalanan pulang yang penuh godaan.',
          text: 'Pulang kerja naik motor, aroma jajanan menggoda dari pinggir jalan. Tangkap sebanyak mungkin, tapi hindari rokok!',
          rules: ['Geser motor dengan jari, mouse, atau tombol ◀ ▶.', 'Martabak, sate, gorengan, es teh: +1.', 'Rokok: −1. Waktunya 25 detik.'],
          ratings: ['', 'LUMAYAN KENYANG', 'RADAR JAJANAN AKTIF', 'RAJA JAJANAN!'] }
      },
      items: {
        coffee: { name: 'Kopi Pagi', icon: 'coffee', from: 'Morning Rush', fx: ['', '+5 HP maksimal', '+10 HP maksimal', '+20 HP maksimal'] },
        note: { name: 'Catatan Anti Lupa', icon: 'note', from: 'Kartu Memori', fx: ['', 'Serangan boss −1', 'Serangan boss −2', 'Serangan boss −3'] },
        keyboard: { name: 'Keyboard Legendaris', icon: 'keyboard', from: 'Whack-a-Bug', fx: ['', 'Coding Strike +3', 'Coding Strike +5', 'Coding Strike +8'] },
        bekal: { name: 'Bekal Jajanan', icon: 'bekal', from: 'Tangkap Jajanan', fx: ['', 'Sleep Recovery +1', 'Sleep Recovery +1', 'Sleep Recovery +2'] }
      },
      itemOrder: ['coffee', 'note', 'keyboard', 'bekal'],
      itemBonus: { coffee: [0, 5, 10, 20], note: [0, 1, 2, 3], keyboard: [0, 3, 5, 8], bekal: [0, 1, 1, 2] },
      rushTasks: [
        { id: 'bangun', name: 'Bangun', icon: 'bed', dur: 2 },
        { id: 'mandi', name: 'Mandi', icon: 'shower', dur: 12 },
        { id: 'baju', name: 'Pakai Baju', icon: 'shirt', dur: 6 },
        { id: 'sarapan', name: 'Sarapan', icon: 'plate', dur: 10 },
        { id: 'kunci', name: 'Ambil Kunci Motor', icon: 'key', dur: 2 }
      ],
      tempts: [
        { t: 'Tidur 5 menit lagi?', yes: 'ZZZ…', cost: 10, icon: 'moon' },
        { t: 'Satu match ML dulu?', yes: 'GAS!', cost: 15, icon: 'controller' },
        { t: 'Mandinya nanti aja?', yes: 'SKIP', cost: 8, icon: 'shower', before: 'mandi' },
        { t: 'Scroll HP sebentar?', yes: 'BENTAR', cost: 10, icon: 'phone' },
        { t: 'Cek grup WA dulu?', yes: 'CEK', cost: 6, icon: 'phone' }
      ],
      memCards: [['phone', 'HP'], ['wallet', 'Dompet'], ['laptop', 'Laptop'], ['pill', 'Vitamin'], ['key', 'Kunci Motor'], ['plug', 'Charger'], ['soap', 'Sabun'], ['controller', 'Stik Game']],
      foods: [['martabak', 'Martabak'], ['satay', 'Sate'], ['gorengan', 'Gorengan'], ['esteh', 'Es Teh']],
      attrs: [
        { name: 'Skill Gaming', val: 90, text: '90%', kind: 'bar', note: '10% sisanya dipakai buat nyalahin lag dan teammate.' },
        { name: 'Ambisi', val: 95, text: '95%', kind: 'bar', note: 'Mimpi besar, rencana lebih besar, eksekusinya agak ditunda.' },
        { name: 'Mode Tidur', val: 100, text: '100%', kind: 'bar', note: 'Selalu full charge. Bisa tidur di mana aja, kapan aja.' },
        { name: 'Daya Tarik Makanan', val: 99, text: '99%', kind: 'bar', note: '1% sisanya cuma terjadi kalau sudah kenyang. Langka.' },
        { name: 'Manajemen Waktu', val: 40, text: 'Loading…', kind: 'loading', note: 'Estimasi tiba: telat 15 menit. Tap sekali lagi untuk diagnosis.' },
        { name: 'Konsistensi Mandi', val: 100, text: 'Sedang Maintenance', kind: 'maint', note: 'Patch notes segera hadir. Mungkin besok. Mungkin.' }
      ],
      quiz: [
        { text: 'Weekend ideal kamu kayak gimana?', opts: [
          ['Tidur seharian. Jangan diganggu.', 'sleepy'],
          ['Push rank Mobile Legends sampai naik.', 'esports'],
          ['Cari makanan enak sambil jalan-jalan.', 'hungry'],
          ['Sedikit dari semuanya. Aku orangnya kompleks.', 'overthink']] },
        { text: 'Musuh terbesarmu apa?', opts: [
          ['Alarm.', 'sleepy'],
          ['Tanggung jawab dan deadline.', 'procrast'],
          ['Perut kosong.', 'hungry'],
          ['Pikiran sendiri jam 2 pagi.', 'overthink']] },
        { text: 'Bakat terpendammu apa?', opts: [
          ['Bisa tidur di mana aja.', 'sleepy'],
          ['Selalu nemu makanan di mana pun.', 'hungry'],
          ['Overthinking hal-hal sederhana.', 'overthink'],
          ['Debugging kode yang ruwet.', 'procrast']] },
        { text: 'Mimpi terbesarmu apa?', opts: [
          ['Jadi atlet esports profesional.', 'esports'],
          ['Jadi developer sukses.', 'procrast'],
          ['Bebas finansial.', 'hungry'],
          ['Semua yang di atas. Jelas dong.', 'esports']] },
        { text: 'Kelemahan terbesarmu apa?', opts: [
          ['Sindrom “satu game lagi”.', 'esports'],
          ['Godaan makanan.', 'hungry'],
          ['Suka menunda.', 'procrast'],
          ['Lupa hal-hal penting.', 'sleepy']] }
      ],
      types: {
        sleepy: { title: 'SI AHLI STRATEGI NGANTUK', short: 'Ahli Strategi Ngantuk', icon: 'moon',
          desc: 'Manusia ambisius dengan mimpi besar, jadwal tidur yang dipertanyakan, dan kemampuan luar biasa mengubah “rebahan lima menit” jadi tiga jam.',
          rec: 'Misi berikutnya: kejar mimpimu tanpa negosiasi sama bantal tiap pagi.' },
        overthink: { title: 'SI OVERTHINKER PROFESIONAL', short: 'Overthinker Profesional', icon: 'brain',
          desc: 'Bisa mengubah balasan “oke” jadi analisis 47 langkah, dan sudah menyimulasikan semua kemungkinan hasil quiz ini. Dua kali.',
          rec: 'Misi berikutnya: tutup 37 tab yang lagi kebuka di kepala. Beberapa pikiran bisa nunggu sampai besok pagi.' },
        hungry: { title: 'SI PENGEJAR MIMPI YANG LAPAR', short: 'Pengejar Mimpi yang Lapar', icon: 'bowl',
          desc: 'Mengejar mimpi besar dengan perut kenyang. Dilengkapi radar internal yang bisa mendeteksi jajanan pinggir jalan dari atas motor.',
          rec: 'Misi berikutnya: kejar mimpimu secepat kamu ngerem waktu lihat martabak.' },
        procrast: { title: 'SI PENUNDA YANG AMBISIUS', short: 'Penunda yang Ambisius', icon: 'hourglass',
          desc: 'Punya rencana lima tahun, rencana sepuluh tahun, dan rencana “mulai besok aja”. Kerjanya keras banget, habis satu tidur siang lagi, satu match lagi, satu camilan lagi.',
          rec: 'Misi berikutnya: mulai hari ini. Jadwal kamu-yang-besok sudah penuh.' },
        esports: { title: 'SI CALON LEGENDA ESPORTS', short: 'Calon Legenda Esports', icon: 'controller',
          desc: 'Terlahir untuk leaderboard. Refleks tajam, rank terus naik, dan yakin banget kalah kemarin itu salah teammate.',
          rec: 'Misi berikutnya: terus grinding, tapi ingat, legenda juga butuh tidur, makan sayur, dan sesekali log off.' }
      },
      typeOrder: ['sleepy', 'overthink', 'hungry', 'procrast', 'esports'],
      cats: [
        { id: 'career', name: 'KARIER & MIMPI', icon: 'trophy', msgs: ['Atlet esports profesional sedang loading…', 'Suatu hari, namamu akan ada di leaderboard.', 'Hari ini backend, besok MVP.', 'Terus grinding. Mimpimu bukan side quest.'] },
        { id: 'finance', name: 'KEUANGAN', icon: 'coin', msgs: ['Semoga pemasukanmu naik lebih cepat dari pengeluaranmu.', 'Kebebasan finansial sedang menelepon. Tolong diangkat.', 'Lebih banyak uang, lebih sedikit belanja yang nggak perlu.'] },
        { id: 'gaming', name: 'GAMING', icon: 'controller', msgs: ['Kejayaan Mythic menunggumu. Terus grinding!', 'Teammate masa depanmu sudah menunggu.', 'Semoga rank-mu naik dan koneksi internetmu stabil.'] },
        { id: 'health', name: 'KESEHATAN', icon: 'medkit', msgs: ['Peringatan: konsumsi rokok perlu di-update.', 'Badanmu bukan perangkat gaming yang bisa di-charge ulang.', 'Tidur cukup, makan yang benar, dan jaga dirimu baik-baik.', 'Pengingat: perawatan kuku rutin wajib dilakukan.'] },
        { id: 'love', name: 'CINTA', icon: 'heart', msgs: ['Selalu ada seseorang yang mendukungmu.', 'Kesabaran pacarmu sudah mencapai level legendaris.', 'Lebih banyak pelukan, lebih sedikit berantem.'] },
        { id: 'life', name: 'HIDUP & BERKAH', icon: 'crescent', msgs: ['Semoga Allah selalu melindungimu di mana pun kamu berada.', 'Semoga hidupmu selalu dipenuhi berkah.', 'Semoga setiap niat baikmu menemukan jalannya jadi kenyataan.', 'Semoga kebahagiaan menyertaimu di dunia dan akhirat.'] }
      ],
      ach: [
        { id: 'self', title: 'Kenal Diri Sendiri', desc: 'Selesaikan quiz kepribadian.', icon: 'mirror' },
        { id: 'blood', title: 'First Blood', desc: 'Menangkan battle ulang tahun.', icon: 'sword' },
        { id: 'bright', title: 'Masa Depan Cerah', desc: 'Buka semua kategori ramalan.', icon: 'star' },
        { id: 'legend', title: 'Legenda Ulang Tahun', desc: 'Selesaikan semua stage.', icon: 'crown' },
        { id: 'food', title: 'Radar Jajanan', desc: 'Temukan easter egg tersembunyi soal makanan.', icon: 'satay', hidden: true, hint: 'Tersembunyi. Ada yang enak nyelip di pemandangan.' },
        { id: 'dev', title: 'Mode Developer', desc: 'Temukan easter egg tersembunyi soal developer.', icon: 'terminal', hidden: true, hint: 'Tersembunyi. Hero nggak suka dicolek. Berkali-kali.' }
      ],
      bossMoves: ['SERANGAN DEADLINE', 'HANTAMAN TANGGUNG JAWAB', 'DAMAGE OVERTHINKING'],
      hitLines: ['CRITICAL HIT!', 'Mantap, calon legenda esports!', 'Bug dibasmi. Boss kebingungan.', 'Kode bersih, serangan bersih!'],
      motivation: ['Memuat motivasi Arief…', 'Mengecek jadwal tidur…', 'Mengecek jadwal main game…', 'Motivasi berhasil diinisialisasi!'],
      letter: [
        'Untuk Arief,',
        'Selamat ulang tahun yang ke-29!',
        'Aku berharap babak baru dalam hidupmu ini membawamu makin dekat dengan semua mimpi yang sudah kamu perjuangkan dengan sungguh-sungguh.',
        'Jaga dirimu baik-baik. Makan yang benar, kurangi rokok, istirahat yang cukup, potong kukumu (iya, ini masih penting 😂), dan jangan lupa kalau kesehatanmu juga penting.',
        'Semoga Allah selalu melindungimu, memberkahi setiap langkahmu, menjadikan hidupmu penuh berkah dan barokah, dan memberimu kebahagiaan di dunia dan akhirat.',
        'Aku akan selalu mendukungmu. Terus bertumbuh, terus bermimpi, dan tetaplah jadi dirimu sendiri.',
        'Selamat ulang tahun, Arief. ❤️'
      ],
      pal: {"K":"#150f27","H":"#1c192c","h":"#3e3a5c","P":"#4a3a48","S":"#c98b5f","s":"#a66a44","L":"#dfa77c","p":"#dd8f80","B":"#231817","E":"#3a2215","W":"#f7f4ff","M":"#3a2822","m":"#8a6249","T":"#fffaf2","R":"#7e2c40","C":"#f7f4ff","c":"#d3cae9","D":"#9d90c7","J":"#2c3a73","j":"#41529a","O":"#3b2620","Y":"#f5d477","y":"#c79a3e","w":"#fff3c4","Q":"#f1a9c7","q":"#c56c96","V":"#b99bef","v":"#6046a5","x":"#4a3787","U":"#91c7ef","u":"#4b80c2","I":"#d8f0ff","N":"#292044","n":"#3a2f63","o":"#e0814f","b":"#8a4a2b","g":"#6cbf74","G":"#3f8a52","Z":"#ffffff","X":"#e9e4f7","r":"#d9534f","F":"#ffd9a8","1":"#16171a","2":"#2a2c31","3":"#45484f","4":"#6a6e78","5":"#a9adb6","7":"#3fb6ff","0":"#f4f7ff"},
      sprites: {"portrait":["................................","............KKKKKKKK............","..........KKHHHHHHHHKK..........",".........KHHHhhhhHHHHHK.........","........KHHhsHHHHhhHHHHK........",".......KHHhHsHHhhHHhHHHHK.......",".......KHHHHsHHHHhHHhHHHHK......",".......KHhHHKKHHHHhHHhHHHK......",".......KHHHSSSLLSHHHHHhHHK......",".......KHHSSSSSSSSSSHHHHK.......",".......KHHLBBBSSSSBBBSHHK.......",".......KSHBSWESSSSWESBHsK.......",".......KsSSSEESsSSEESSssK.......",".......KSSSsSSSSsSSSsSsSK.......",".......KSSSLSSSsssSSSSssK.......","........KSpsSMMmmMMSspsK........","........KSSSRTTTTTTRSSsK........",".........KSSSRqqqqRSSsK.........","..........KSSmSSSSmSsK..........","...........KSSmmmmSsK...........","............KSSmmSsK............","............KssssssK............","............KSSSSSSK............",".........KKKCSSSSSSCKKK.........","......KKKCCDCCSSSSCCDCCKKK......","....KKCCCCCCDCCsSCCDCCCCCCKK....","...KccCCCCCCCDCCCCDCCCCCCCccK...","..KccCCCCCCCCCDCCDCCCCCCCCCccK..",".KccCCCcCCCCCCCCDCCCCCCCcCCCccK.",".KccCCCcCCCCCCCCcCCCCCCCcCCCccK.","KccCCCCcCCCCCCCCcCCCCCCCcCCCCccK","KccCCCCcCCCCCCCCDCCCCCCCcCCCCccK"],"hero":["............................","........KKKKKKKK............","......KKHHHHHHHHKK..........",".....KHHHhhhhHHHHHK.........","....KHHhsHHHHhhHHHHK........","...KHHhHsHHhhHHhHHHHK.......","...KHHHHsHHHHhHHhHHHHK......","...KHhHHKKHHHHhHHhHHHK......","...KHHHSSSLLSHHHHHhHHK......","...KHHSSSSSSSSSSHHHHK.......","...KHHLBBBSSSSBBBSHHK.......","...KSHBSWESSSSWESBHsK.......","...KsSSSEESsSSEESSssK.......","...KSSLsSSsSssSSsSsSK.......","...KSSSLSSSsssSSSSssK.......","....KSpsSMMmmMMSspsK.......K","....KSSSRTTTTTTRSSsK......KI",".....KSSSRqqqqRSSsK......KZK","......KSSmSSSSmSsK......KIUK",".......KSSmmmmSsK......KIUK.","........KSsssssK......KIUK..",".......KKKssssKKK....KIUK...",".....KKcCDSSSSDCcKKKKIUK....","....KCccCCDSSDCCccCYIUK.....","....KCccCCCDDCCCccYIUK......","....KCccCCCCcCCCccCUK.......","....KSScCCCCcCCCcSSyYK......","....KsscCCCCcCCCcKbKKYK.....",".....KKKjJJJJjJJKbK..K......",".......KjJJJJjJJKK..........",".......KjJJKKjJJK...........",".......KjJJKKjJJK...........","......KOOOOKKOOOOK..........",".......KKKK..KKKK...........","............................","............................"],"boss":["............................................","............................................","............................................",".....K................................K.....","....KZK..............................KZK....","....KVKK............................KKVK....",".....KVVK..........................KVVK.....",".....KVVK..........................KVVK.....","......KVVK........................KVVK......","......KVVKK...........K..........KKVVK......",".......KVVVK.........KvK........KVVVK.......",".......KVVVK...KKKKKKKKKKKKKKK..KVVVK.......","........KVVVKKKvvvvvvvKvvvvvvvKKVVVK........","........KVVVvvvvvvvvYYYYYvvvvvvvVVVK........",".........KKxvvvvvvYYYwywYYYvvvvvvxK.........",".........KxvvvvvvYYwwwKwwwYYvvvvvvxK........","........KxxvvvvvvYwwwwKwwwwYvvvvvvxxK.......",".......KxxvvvvvvYYwwwwKwwwwYYvvvvvvxxK......","......KxxxvvvvvvYwwwwwKwwwwwYvvvvvvxxxK.....","......KxxxvvvvvvYywwwwKrrrwyYvvvvvvxxxK.....",".....KxxxxvvvvvvYwwwwwwwwwwwYvvvvvvxxxxK....",".....KxxxxvvvvvvYYwwwwwwwwwYYvvvvvvxxxxK....",".....KxxxxvvvvvvvYwwwwwwwwwYvvvvvvvxxxxK....","....KKxxxxvvvvvvvYYwwwwwwwYYvvvvvvvxxxxKK...","...KxKxxxxxvvvvvvvYYYwywYYYvvvvvvvxxxxxKxK..","..KxxxxxxxxvvvvvvvvvYYYYYvvvvvvvvvxxxxxxxxK.","..KxxKxxxxxxvvvvvvvvvvvvvvvvvvvvvxxxxxxKxxK.","..KxxKxxxxxxxvvvvvvvvvvvvvvvvvvvxxxxxxxKxxK.","..KxxKxxxxxxxxvvvvvvvvvvvvvvvvvxxxxxxxxKxxK.","..KxxKxxxxxxKKKKKKKKKKKKKKKKKKKKKxxxxxxKxxK.","..KxKKxxxxxxxZZRZZRZZRZZRZZRZZRZZxxxxxxKKxK.","...K..KxxxxxxZRRZRRZRRZRRZRRZRRZxxxxxxK..K..","......KxxxxxxxKKKKKKKKKKKKKKKKKxxxxxxxK.....",".......KxxxxxxxxxxxxxqqqxxxxxxxxxxxxxK......","........KxxxxxxxxxxxxQQQxxxxxxxxxxxxK.......",".........KxNxNxNxNxNxQQQxNxNxNxNxNxK........","..........KxNxNxNxNxQQQQQxNxNxNxNxK.........","...........KxNxNxNxNQQQQQNxNxNxNxK..........","............KKNxNxNxQQQQQxNxNxNKK...........","..............KKxNxNQQQQQNxNxKK.............","...........KKKKKKKKKQQQQQKKKKKKKKK..........","..........KxxxxxxK..KKQKK..KxxxxxxK.........","...........KKKKKK.....K.....KKKKKK..........","............................................"],"moon":["................","...........VVV..","............V...","....KK.....VVV..","...KYYK.........","..KYYYK.........",".KYYYK........VV",".KYYYK.........V",".KYwYYK.......VV","KYYwYYK.........",".KYYYYYK........",".KYYYYYYKKKKK...",".KYYwYYYYYYYYK..","..KYYYYYYyYYK...","...KYYyyyYYK....","....KKKYKKK....."],"crescent":["................","......KK........","....KKYYKw......","...KYYKK........","..KYYYK.......w.",".KYYYK..........",".KYYYK..........","KYYYYK..........","KYYYYK..........","KYYYYYK.....w...",".KYYYYKK...www..",".KYYYYYYKKKKw...","..KYYYYYYYYYK...","...KYYYYYYYK....","....KKYYYKK.....","......KKK......."],"heart":["................","................","...KKK....KKK...","..KQQQK..KQQQK..",".KQZQQQKKQQQQqK.",".KQZQQQQQQQQQqK.",".KQQQQQQQQQQQqK.",".KQQQQQQQQQQqqK.","..KQQQQQQQQqqK..","...KQQQQQQqqK...","....KQQQQqqK....",".....KQQqqK.....","......KqqK......",".......KK.......","................","................"],"coin":[".......KK.......","....KKKyyKKK....","...KyyyyyyyyK...","..KyyYYYYYYyyK..",".KyyYwYyyYYYyyK.",".KyYwYYyyYYYYyK.",".KyYwYYyyYYYYyK.","KyyYYYYyyYYYYyyK","KyyYYYYyyYYYYyyK",".KyYYYYyyYYYYyK.",".KyYYYYyyYYYYyK.",".KyyYYYyyYYYyyK.","..KyyYYYYYYyyK..","...KyyyyyyyyK...","....KKKyyKKK....",".......KK......."],"star":[".......K........","......KYK.......","......KYK.......",".....KYYYK......",".....KYwYK......",".KKKKKYwYKKKKK..","KYYYYYwYYYYYyyK.",".KYYYYYYYYYyyK..","..KKYYYYYYyKK...","...KYYYYYyyK....","...KYYYYyyyK....","...KYYYKyyyK....","...KYYK.KyyK....","..KYKK...KKyK...","...K.......K....","................"],"sword":["..............KZ",".............KUI","............KUIK","...........KUIK.","..........KUIK..",".........KUIK...","........KUIK....","...K...KUIK.....","..KYK.KUIK......","...KYKUIKrK.....","....KYKKKrK.....","...KbKYK.K......","..KbK.KYK.......",".KbK...K........","KYK.............",".K.............."],"satay":["..............K.",".............KbK","..........KKKbK.",".........KFooK..",".........KoooK..",".......KKKoobK..","......KFooKKK...","......KoooK.....","....KKKoobK.....","...KFooKKK...V..","...KoooK......V.","...KoobK....V...","..KbKKK.........",".KbK............","KbK.............",".K.............."],"medkit":["......KKKK......",".....KDDDDK.....","..KKKKDDDDKKKK..",".KZZZZZZZZZZZZK.",".KZZZZZZZZZZZZK.",".KZZZZZrrZZZZZK.",".KZZZZZrrZZZZZK.",".KZZrrrrrrrrZZK.",".KZZrrrrrrrrZZK.",".KZZrrrrrrrrZZK.",".KZZZZZrrZZZZZK.",".KZZZZZrrZZZZZK.",".KXXXXXXXXXXXXK.",".KXXXXXXXXXXXXK.","..KKKKKKKKKKKK..","................"],"brain":["................","....KKKK.KKKK...","...KQQQQKQQQQK..","..KQQqQQKQqQQQK.",".KQQQqQQKQQqQQQK",".KQqQQQQKQQQQqQK",".KQQqqQQKQQqqQQK",".KQQQQqQKQqQQQQK",".KQqQQQQKQQQQqQK","..KQQqQQKQQqQQK.","...KQQQQKQQQQK..","....KKKQQQKKK...","......KqqqK.....","......KqqK......",".......KK.......","................"],"bowl":["...........K..K.","..........KbKKbK",".........KbKKbK.","........KbKKbK..","....KKKKbKKbKK..","...KwYwwYKbKwK..","..KwYwYwwYwYwwK.",".KKKKKKKKKKKKKKK",".KUUUUUUUUUUUUuK",".KUIIUUUUUUUUUuK","..KUUUUUUUUUUuK.","..KUUUUUUUUUuuK.","...KuUUUUUUuuK..","....KKuuuuuKK...",".....KKKKKKK....","................"],"hourglass":["................","...KKKKKKKKKK...","...KyyyyyyyyK...","...KKKKKKKKKK...","....KIIIIIIK....","....KIYYYYIK....",".....KIYYIK.....","......KIYK......","......KIYK......",".....KIIYIK.....","....KIIIYIIK....","....KIYYYYIK....","...KKKKKKKKKK...","...KyyyyyyyyK...","...KKKKKKKKKK...","................"],"controller":["................","................","................","....KKKKKKKK....","..KKVVVVVVVVKK..",".KVVKVVVVVVQVVK.","KVVKKKVVVVQVQVVK","KVVVKVVVVVVQVVVK","KVVVVVVKKVVVVVVK","KvVVVVVVVVVVVVvK","KvvVVVKKKKVVVvvK","KvvvvK....KvvvvK",".KvvK......KvvK.","..KK........KK..","................","................"],"mirror":["................",".....KKKKKK.....","....KYYYYYYK....","...KYIIIUUUYK...","...KYIZIUUUYK...","...KYIIUUUUYK...","...KYIUUUUuYK...","...KYUUUUuuYK...","....KYUUuuYK....",".....KYYYYK.....","......KyyK......","......KyyK......","......KyyK......","......KyyK......",".......KK.......","................"],"crown":["................","................","..KK...KK...KK..",".KQQK.KUUK.KQQK.","..KK...KK...KK..","..KYK.KYYK.KYK..","..KYYKYYYYKYYK..","..KYYYYYYYYYYK..","..KYwYYYYYYYyK..","..KYYQYYUYQYyK..","..KYYYYYYYYYyK..","..KyyyyyyyyyyK..","..KKKKKKKKKKKK..","................","................","................"],"terminal":["................","................",".KKKKKKKKKKKKKK.",".KvvvvvvvvQYgvK.",".KKKKKKKKKKKKKK.",".KNNNNNNNNNNNNK.",".KNgNNNNNNNNNNK.",".KNNgNNNNNNNNNK.",".KNNNgNNNNNNNNK.",".KNNgNNNNNNNNNK.",".KNgNNNggggNNNK.",".KNNNNNNNNNNNNK.",".KKKKKKKKKKKKKK.","................","................","................"],"duck":["................","................","......KKKK......",".....KYYYYK.....",".....KYKYYK.....","...KKoYYYYK.....","..KooKYYYYK.....","...KKYYYYYKKKK..","....KYYYYYYYYYK.","...KYYYYYYYYYYK.","...KYwYYYYYYyYK.","...KYYYYYYYYyK..","....KyyyyyyyK...",".....KKKKKKK....","..UUUUUUUUUUUU..","................"],"trophy":["........................","....KKKKKKKKKKKKKKKK....","..KKKYwwYYYYYYYYYYyKKK..",".KYYKYwYYYYYYYYYYYyKYYK.","KYKKKYwYYYYYYYYYYyyKKKYK","KYK.KYwYYYYYYYYYYyyK.KYK","KYK.KYYwYYYYYYYYYyyK.KYK",".KYKKYYwYYYYYYYYyyyKKYK.","..KYKKYYYYYYYYYYyyKKYK..","...KKKYYYYYYYYYYyyKKK...",".....KKYYYYYYYYyyKK.....","......KKYYYYYYyyKK......","........KKYYyyKK........","..........KYyK..........","..........KYyK..........",".........KYYyyK.........","........KKYYyyKK........","......KKyyyyyyyyKK......","......KnnnnnnnnnnK......","......KnnYYYYYYnnK......","......KnnnnnnnnnnK......",".....KKKKKKKKKKKKKK.....","........................","........................"],"envelope":["..........................",".KKKKKKKKKKKKKKKKKKKKKKKK.","KDDXXXXXXXXXXXXXXXXXXXXDDK","KXXDXXXXXXXXXXXXXXXXXXDXXK","KXXXDXXXXXXXXXXXXXXXXDXXXK","KXXXXDXXXXXXXXXXXXXXDXXXXK","KXXXXXDDXXXXXXXXXXDDXXXXXK","KXXXXXXXDXXXXXXXXDXXXXXXXK","KXXXXXXXXDXXXXXXDXXXXXXXXK","KXXXXXXXXXDQQXQQXXXXXXXXXK","KXXXXXXXXXQZQQQQQXXXXXXXXK","KXXXXXXXXXXQQQQQXXXXXXXXXK","KXXXXXXXXXXXQQQXXXXXXXXXXK","KXXXXXXXXXXXXQXXXXXXXXXXXK","KXXXXXXXXXXXXXXXXXXXXXXXXK","KccccccccccccccccccccccccK","KccccccccccccccccccccccccK","KccccccccccccccccccccccccK","KccccccccccccccccccccccccK",".KKKKKKKKKKKKKKKKKKKKKKKK."],"crystal":["..................................","..................................","............KKKKKKKKKK............","..........KKxxxxxxxxxxKK..........",".........KxxxUUUUUVVVxxxK.........","........KxxUUUUUUUUVVVVxxK........",".......KxxIIIZUUUUUVVVVVxxK.......","......KxxIIIIIIUUUUUVVVVvxxK......","......KxIIZZIIIIUUUUVVVVVvxK......",".....KxUIIZIIIIIQUQUVVVVVvvxK.....",".....KxUIIIIIIQIUUUUQVVVVvvxK.....","....KxxUUIIIQIIUUUUUVVQVvvvxxK....","....KxUUUUIQIIUQQQQQVVVVQvvvxK....","....KxUUUUUUUUQUUUUVQVVVvvvvxK....","....KxUUUUQUUQUUUUVVVQVVvQvvxK....","....KxVUUUUUUQUUUVQVVQVvvvvvxK....","....KxVVVUQUUUQVVVQVVVvvvvvvxK....","....KxxVVVVQVVVQQQVVVQvvvvvxxK....",".....KxVVVVVQVVVVVVVQvvvvvvxK.....",".....KxVVVVVVVQVVQVQvvvvvvvxK.....","......KxVVVVVVVVQVvvvvvvvvxK......","......KxxVVVVVVVvvvvvvvvvxxK......",".......KxxvvvvvvvvvvvvvvxxK.......","........KxxvvvvvvvvvvvvxxK........",".........KxxxvvvvvvvvxxxK.........","........KyYYYYYYYYYYYYYYyK........",".......KKyyyyyyyyyyyyyyyyKK.......","......KnnnnnnnnnnnnnnnnnnnnK......","......KnxxxxxxxxxxxxxxxxxxnK......",".....KnnnnnnYnnnYnnnYnnnnnnnK.....",".....KnnnnnnnnnnnnnnnnnnnnnnK.....","....KNNNNNNNNNNNNNNNNNNNNNNNNK....",".....KKKKKKKKKKKKKKKKKKKKKKKK.....",".................................."],"star5":["..K..",".KYK.","KYwYK",".KYK.","..K.."],"phone":["....KKKKKKKK....","...KnnnnnnnnK...","...KnnnKKnnnK...","...KnIIUUUUnK...","...KnIUUUUUnK...","...KnUUUUUUnK...","...KnUUUUUUnK...","...KnUUUUUUnK...","...KnUUUUUUnK...","...KnUUUUUUnK...","...KnUUUUUUnK...","...KnUUUUUUnK...","...KnnnnnnnnK...","...KnnnXXnnnK...","...KnnnnnnnnK...","....KKKKKKKK...."],"wallet":["................","...KKKKKKKK.....","..KggggggggK....",".KKggggggggKKKK.","KooooooooooooooK","KooooooooooooooK","KbbbbbbbbbbbbbbK","Kbbbbbbbbooooooo","KbbbbbbbboooYooo","Kbbbbbbbboooyooo","Kbbbbbbbbooooooo","KbbbbbbbbbbbbbbK","KbbbbbbbbbbbbbbK","KbbbbbbbbbbbbbbK",".KKKKKKKKKKKKKK.","................"],"laptop":["................","...KKKKKKKKKK...","..KnnnnnnnnnnK..","..KnUUUUUUUUnK..","..KnUIIUUUUUnK..","..KnUIUUUUUUnK..","..KnUUUgggUUnK..","..KnUUUUUUUUnK..","..KnUUUUUUUUnK..",".KKnnnnnnnnnnKK.","KXXXXXXXXXXXXXXK","KXXXXXccccXXXXXK","KccccccccccccccK",".KKKKKKKKKKKKKK.","................","................"],"pill":["............K...","...........KYK..","..........KYYK..",".........KYYYK..","........KYwYYK..",".......KYwYYYK..","......KrYYYYK...",".....KrrYYYK....","....KrrrYYK.....","...KrZrrYK......","..KrZrrrK.......","..KrrrrK........","..KrrrK.........","..KrrK..........","..KrK...........","...K............"],"key":["................","................",".KKKKKK.........","KnnnnnnK........","KnxxxxnKKKKKKKK.","KnxZxxnXXXXXXXXK","KnxxxxnccccccccK","KnxxxxnKKKKXKXK.","KnnnnnnK...KKXK.",".KKKKKK......K..",".KYK............","..KYK...........","...KYK..........","....K...........","................","................"],"plug":["......K..K......",".....KDKKDK.....",".....KDKKDK.....","....KKDKKDKK....","...KXXXXXXXXK...","...KXXXXXXXXK...","...KXXXXYXXXK...","...KXXXYYXXXK...","...KXXXYYXXXK...","...KXXXYXXXXK...","...KXXXXXXXXK...","...KccccccccK...","....KKKnnKKK....","......KnnK......","......KnnK......","......KnnK......"],"soap":["................",".........U......","...UUU..U.U.....","...U.U...U..UUU.","...UUU......U.U.","............UUU.","..KKKKKKKKKKKK..",".KQQQQQQQQQQQQK.",".KQQQQQQQQQQQQK.",".KQQZZZZZZZZQQK.",".KQQXXXXXXXXQQK.",".KQQQQQQQQQQQQK.",".KQQQQQQQQQQQQK.",".KqqqqqqqqqqqqK.","..KKKKKKKKKKKK..","................"],"bug":["...KGK....KGK...","....KGKKKKGK....","....KGGGGGGK....","....KGrGGrGK....","....KGGGGGGK....","..KKgggKKgggKK..",".KGKgggGGgggKGK.","..KGgYgGGgggGK..","..KKgggGGgggKK..",".KGKgggGGgYgKGK.","..KGgggGGgggGK..","..KKgYgGGgggKK..",".KGKgggGGgggKGK.","..KGgggGGgggGK..","...KKggggggKK...",".....KKKKKK....."],"martabak":["................","................","................","................",".KKKKKKKKKKKKKK.","KYYYYYYYYYYYYYYK","KYYYYYYYYYYYYYYK","KyyyywyyywyywyyK","KyybyyyyyybyyyyK","KyyyyybyyyyyyyyK","KyyyyyyyyyyybyyK","KyyybyyybyyyyyyK","KooooooooooooooK",".KKKKKKKKKKKKKK.","................","................"],"esteh":[".........KrK....","....KKKKKKrK....","...KIIIIIrIIK...","...KIIIIIrIIK...","...KIIIIIIIIK...","...KIIIIIIIIK...","...KIoZZoooIK...","...KIoZZoooIK...","...KIooooooIK...","...KIoooZZoIK...","...KIoooZZoIK...","...KIooooooIK...","...KIooooooIK...","...KIooooooIK...","...KIooooooIK...","....KKKKKKKK...."],"gorengan":["................","................","................","................",".....KKKKKK.....","...KKYYYyYYKK...","..KYywYYYwYyYK..",".KYYwYYyYYYYYYK.",".KYyYYYYYYyYYYK.","KYYYYYyYYYYYoyYK",".KyYYYYYYyoYYYK.",".KYYYyoYYYYYyYK.","..KYYYYYyYYYYK..","...KKYYYYYYKK...",".....KKKKKK.....","................"],"rokok":["..............c.",".............c.c","..............c.",".............c..","................","............KK..","..........KKrrK.","........KKXXrrK.","......KKXXooKK..","....KKXXXXKK....","..KKXXXXKK......",".KXXXXKK........",".KXXKK..........","..KK............","................","................"],"bed":["................","................","................","KK..............","bbKKKKK.........","bbXXXXXK........","bbXXXXXK........","bbXXXXXKKKKKKKK.","bbXXXXXUUUUUUUUK","bbUUUUUUUUUUUUUK","bbuuuuuuuuuuuuuK","bbuuuuuuuuuuuuuK","bbuuuuuuuuuuuuuK","bbbKKKKKKKKKKbbK","bbbK........KbbK","KKK..........KK."],"shower":["..KKKKKKKKK.....",".KDDDDDDDDDK....",".KDDDDDDDDDK....","..KKKKKKKDDK....",".......KKDDKK...","......KccccccK..","......KccccccK..",".......KKKKKK...","......KUKKKUK...",".......KKUKK....","........KK..K...",".......KUKKKUK..","........KKUKK...",".......K..KK....","......KUKKKUK...",".......KKUKK...."],"shirt":["................","................",".KKKKKK..KKKKKK.","KXXXXXcKKcXXXXXK","KXXXXXXccXXXXXXK","KXXXXXXXXXXXXXXK","KXXXXXXXXXXXXXXK","KXXXXXXDXXXXXXXK","KXXXXXXXXXXXXXXK",".KKKXXXXXXXXKKK.","...KXXXDXXXXK...","...KXXXXXXXXK...","...KXXXXXXXXK...","...KXXXDXXXXK...","...KccccccccK...","....KKKKKKKK...."],"plate":["................","................","................","................","......KKKK......","...KKKXXXXKKK...","..KZZZZZXZZZZK..",".KXZZZZZXZYYZXK.","KXXZZZZZXZYYZXXK","KXXZZZZZXZZZZXXK","KXXZZZZZXXXXXXXK",".KXXXggXXXXXXXK.","..KXXXXXXXXXXK..","...KKKXXXXKKK...","......KKKK......","................"],"coffee":["................",".....c..c.......","......c..c......",".....c..c.......","................","...KKKKKKKK.....","..KXbbbbbbXKKK..","..KXXXXXXXXXXXK.","..KXXXXXXXXKKXK.","..KXXQXXXXXKKXK.","..KXXXQXXXXKKXK.","..KXXXXXXXXXXXK.","..KXXXXXXXXKKK..","..KccccccccK....","...KKKKKKKK.....","................"],"note":["..KKKKKKKKKK....",".KYYYYYYYYYYK...",".KwwwwwwwwwwK...",".KwwwwwwwwwwK...",".KwwDDDDDDwwK...",".KwwwwwwwwwwK...",".KwwwwwwwwwwK.KK",".KwwDDDDDDwwKKoo",".KwwwwwwwwwwKooK",".KwwwwwwwwwwYyK.",".KwwDDDDDDwYyK..",".KwwwwwwwwYyK...",".KwwwwwwwYywK...",".KwwwwwwYywwK...",".KwwwwwYywwwK...","..KKKKKKKKKK...."],"keyboard":[".......K........","..K...KYK.......",".KYK...K.....K..","..K.........KYK.","KKKKKKKKKKKKKKKK","nnnnnnnnnnnnnnnn","nUnUnUnUnUnUnUnn","nnnnnnnnnnnnnnnn","nUnUnUnUnUnUnUnn","nnnnnnnnnnnnnnnn","nUnUnUnUnUnUnUnn","nnnnXXXXXXXXnnnn","nnnnnnnnnnnnnnnn","KKKKKKKKKKKKKKKK","................","................"],"bekal":["................",".....KKKKKK.....","....KbbbbbbK....","....KbbbbbbK....","..KKKbKKKKbKKK..",".KooooooooooooK.",".KrrrrrrrrrrrrK.",".KrrrrrrrrrrrrK.",".KrrrrwwwwrrrrK.",".KrrrrwwwwrrrrK.",".KrrrrwwwwrrrrK.",".KrrrrwwwwrrrrK.",".KrrrrrrrrrrrrK.",".KrrrrrrrrrrrrK.",".KqqqqqqqqqqqqK.","..KKKKKKKKKKKK.."],"cloud":["....................Z...........",".........ZZZZZ..ZZZZZZZZZ.......",".......ZZZZZZZZZZZZZZZZZZZZ.....","......ZZZZZZZZZZZZZZZZZZZZZ.....","......ZZZZZZZZZZZZZZZZZZZZZZ....",".....ZZZZZZZZZZZZZZZZZZZZZZ.....","......ZZZZZZZZZZZZZZZZZZZZZ.....","....ZZZZZZZZZZZZZZZZZZZZZZZZZ...","..ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ.",".ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ","..ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ.","....IIIIIIIIIIIIIIIIIIIIIIIII..."],"rider":["..................................","............KKKKKKKK..............","..........KKHHHHHHHHKK............",".........KHHHhhhhHHHHHK...........","........KHHhsHHHHhhHHHHK..........",".......KHHhHsHHhhHHhHHHHK.........",".......KHHHHsHHHHhHHhHHHHK........",".......KHhHHKKHHHHhHHhHHHK........",".......KHHHSSSLLSHHHHHhHHK........",".......KHHSSSSSSSSSSHHHHK.........",".......KHHLBBBSSSSBBBSHHK.........",".......KSHBSWESSSSWESBHsK.........",".......KsSSSEESsSSEESSssK.........",".......KSSLsSSsSssSSsSsSK.........",".......KSSSLSSSsssSSSSssK.........","........KSpsSMMmmMMSspsKKKK.......","........KSSSRTTTTTTRSnnnnnnK......",".........KSSSRqqqqRSSnnnnnnK......","..........KSSmSSSSmSsKrrrKKK......","...........KSSmmmmSsKKrrrKwYK.....","..........KCCCCCCCCKKKrrrKKYK.....","..........KcCCCCCCcSSSrrrK.K......","......KKKKJJJJJJJJCSSSrrrKK.......",".....KQQQQQQQQQQQQQQQQrrrQQK......",".....KrrrrrrrrrrrrrrrrrrrrrK......",".....KrnnnrrrrrrrrrrrrrnnnrK......",".....KnncnnKKKKKKKKKKKnncnnK......",".....KncccnK.........KncccnK......",".....KnncnnK.........KnncnnK......","......KnnnK...........KnnnK......."],"powerbank":["............................","............................","............................",".......KKKKKKKKKKKKKKKKKK...","......K333333333333333333K..",".....K32222KKK722KKK722211K.","...KKK32222222222222222211K.","..K11132222222222222222211K.","..K13K32222222222222222211K.","..K13K32222222222222222211K.","..K13K32222222222222222211K.","..K13K32222202200020002211K.","..K13K32222002202020202211K.","..K13K32222202202020202211K.","..K13K32222202202020202211K.","..K13K32222000200020002011K.","..K13K32222222222222222211K.","..K13K32222222222222222211K.","..K13K32222222222222222211K.","..K13K32222222222222222211K.","..K13K32222222222222222211K.","..K13K32222222222222222211K.","..K13K32222222222222222211K.","..K13K32222222222222222211K.","..K13K32222222222222222211K.","..K13K32222222222222222211K.","..K13K32222222222222222211K.","..K13K32222222222222222211K.","..K13K32222222222222222211K.","..K13K32222222222222222211K.",".K44KK32222222222222222231K.",".K44KK32222222222222222211K.",".K44KK32222222222222222231K.",".K55KK32242222222222222211K.","..KK.K32242222222222222231K.",".....K32242222222222222211K.",".....K32242222222222222231K.",".....K32242222222222222211K.",".....K32242222222222222231K.",".....K32242222222222222211K.",".....K32222222222222222231K.",".....K32222222222222222211K.",".....K32222222222222222211K.","......K111111111111111111K..",".......KKKKKKKKKKKKKKKKKK...","............................"],"gift":[".....K....K.....","....KYK..KYK....","...KYKYKKYKYK...",".KKKKYYKKYYKKKK.","KQQQQQQYYQQQQQQK","KQQQQQQQQQQQQQQK","KQQQQQQYYQQQQQQK",".KrrrrrYYrrrrrK.",".KrrrrrYYrrrrrK.",".KrrrrrYYrrrrrK.",".KrrrrrYYrrrrrK.",".KrrrrrYYrrrrrK.",".KrrrrrYYrrrrrK.",".KrrrrrYYrrrrrK.",".KqqqqqqqqqqqqK.","..KKKKKKKKKKKK.."]}
    };
    return this._d;
  }

  /* --------------------------------------------------------------- state */
  key() { return 'player01-arief:v2:' + (this.props.instance || 'desktop'); }
  bonus(item, items) {
    const lv = Math.max(0, Math.min(3, Number((items || (this.state && this.state.items) || {})[item]) || 0));
    return this.D().itemBonus[item][lv];
  }
  freshBattle(items) {
    const maxHp = 100 + this.bonus('coffee', items);
    const heals = 2 + this.bonus('bekal', items);
    return { php: maxHp, maxHp, bhp: 100, heals, healsMax: heals, dmg: 25 + this.bonus('keyboard', items), reduce: this.bonus('note', items),
      cd: 0, turn: 1, phase: 'player', won: false, acts: 0, nid: 4,
      log: [{ id: 1, t: 'Musuh muncul!' }, { id: 2, t: 'FINAL BOSS: ADULTING menantangmu!' }, { id: 3, t: 'Pilih skill-mu, Arief!' }] };
  }
  blank() {
    return { view: 'intro', done: [false, false, false, false, false, false, false, false, false, false], answers: [], qIdx: 0, quizType: null, items: {}, games: {},
      battle: this.freshBattle(), proph: { revealed: {}, seen: [], cur: null, count: 0 },
      certDone: false, letterOpen: false, prize: { picked: -1, done: false }, ach: {}, sound: true, xp: 0, foodBoost: false };
  }
  blankUI() {
    return { modal: null, toast: null, toastKey: 0, toastQ: [], banner: null, bannerKey: 0, confetti: 0,
      statSel: -1, pick: -1, lock: false, spinning: false, cardKey: 0, fx: null, heroAnim: '', bossAnim: '', animKey: 0,
      victoryShow: false, certUrl: null, certBusy: false, motStep: 0, avatar: null, photoSrc: null, photoLocal: false,
      crop: { z: 1.15, x: 0.27, y: 0.4, n: 48 }, photoPreview: null, photoErr: '', wipe: 0, shake: 0, mgPhase: 'story', g: null, mgMsg: '', mgMsgKey: 0, prizePhase: 'pick', procStep: 0, rarity: 0 };
  }
  storage() { try { return window.localStorage; } catch (e) { return null; } }
  load() {
    const ls = this.storage();
    if (!ls) return {};
    try {
      const raw = ls.getItem(this.key());
      if (!raw) return {};
      const o = JSON.parse(raw);
      if (!o || typeof o !== 'object') return {};
      const base = this.blank();
      const out = {};
      Object.keys(base).forEach((k) => { if (k in o && o[k] !== null && typeof o[k] === typeof base[k]) out[k] = o[k]; });
      if (out.done && (!Array.isArray(out.done) || out.done.length !== 10)) delete out.done;
      if (out.answers && !Array.isArray(out.answers)) delete out.answers;
      if (o.quizType && this.D().types[o.quizType]) out.quizType = o.quizType;
      const views = this.D().stages.map((x) => x.id);
      if (views.indexOf(out.view) < 0) delete out.view;
      return out;
    } catch (e) { return {}; }
  }
  persist() {
    const ls = this.storage();
    if (!ls) return;
    const s = this.state;
    const o = {};
    Object.keys(this.blank()).forEach((k) => { o[k] = s[k]; });
    const str = JSON.stringify(o);
    if (str === this._lastSaved) return;
    this._lastSaved = str;
    try { ls.setItem(this.key(), str); } catch (e) { /* storage full or blocked */ }
  }
  loadPhoto() {
    const ls = this.storage();
    if (!ls) return null;
    try { const p = JSON.parse(ls.getItem(this.key() + ':photo') || 'null'); return p && p.src ? p : null; } catch (e) { return null; }
  }

  /* ----------------------------------------------------------- lifecycle */
  componentDidMount() {
    this._mounted = true;
    this.reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (this.state.photoSrc) this.processPhoto(this.state.photoSrc, this.state.crop, (url) => this.setState({ avatar: url }));
    else if (this.props.photo) this.loadPropPhoto();
    if (this.props.hotkeys) {
      this._onKey = (e) => this.onKey(e);
      document.addEventListener('keydown', this._onKey);
    }
    this._onFirst = () => this.unlockAudio();
    ['pointerdown', 'touchend', 'click'].forEach((ev) => document.addEventListener(ev, this._onFirst, true));
    this.persist();
  }
  componentDidUpdate() { this.persist(); this.syncMusic(); }
  componentWillUnmount() {
    this._mounted = false;
    this._timers.forEach((t) => clearTimeout(t));
    if (this._onKey) document.removeEventListener('keydown', this._onKey);
    if (this._onFirst) ['pointerdown', 'touchend', 'click'].forEach((ev) => document.removeEventListener(ev, this._onFirst, true));
    this.stopMusic();
    this.stopGame();
  }
  later(ms, fn) {
    const t = setTimeout(() => { if (this._mounted !== false) fn(); }, this.reduced ? Math.min(ms, 120) : ms);
    this._timers.push(t);
    return t;
  }
  onKey(e) {
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    const s = this.state;
    if (e.key === 'Escape' && s.modal) { this.closeModal(); return; }
    if (s.modal) return;
    if (s.view === 'food' && s.mgPhase === 'play') {
      if (e.key === 'ArrowLeft') { e.preventDefault(); this.foodMove(-10); }
      if (e.key === 'ArrowRight') { e.preventDefault(); this.foodMove(10); }
    }
    if (s.view === 'battle') {
      const map = { '1': 'strike', '2': 'combo', '3': 'heal' };
      if (map[e.key]) this.useSkill(map[e.key]);
    }
    if (s.view === 'quiz' && !s.quizType) {
      const i = 'abcd'.indexOf(String(e.key).toLowerCase());
      const j = '1234'.indexOf(e.key);
      if (i >= 0) this.answer(i); else if (j >= 0) this.answer(j);
    }
  }

  /* -------------------------------------------------------------- sprites */
  spr(name) {
    if (!this._spr) this._spr = {};
    if (this._spr[name]) return this._spr[name];
    const rows = this.D().sprites[name];
    if (!rows || typeof document === 'undefined') return '';
    const c = document.createElement('canvas');
    c.width = rows[0].length; c.height = rows.length;
    const x = c.getContext('2d');
    const pal = this.D().pal;
    rows.forEach((r, y) => { for (let i = 0; i < r.length; i++) { const ch = r[i]; if (ch !== '.' && pal[ch]) { x.fillStyle = pal[ch]; x.fillRect(i, y, 1, 1); } } });
    this._spr[name] = c.toDataURL('image/png');
    this._sprCanvas = this._sprCanvas || {};
    this._sprCanvas[name] = c;
    return this._spr[name];
  }
  sprCanvas(name) { this.spr(name); return this._sprCanvas && this._sprCanvas[name]; }

  /* ---------------------------------------------------------------- sound */
  ac() {
    if (this._ac) return this._ac;
    const A = window.AudioContext || window.webkitAudioContext;
    if (!A) return null;
    try { this._ac = new A(); } catch (e) { return null; }
    return this._ac;
  }
  tone(f, dur, type, vol, at, slide) {
    const ctx = this.ac(); if (!ctx) return;
    const t = ctx.currentTime + (at || 0);
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = type || 'square'; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.05, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + dur + 0.02);
  }
  noise(dur, vol, at) {
    const ctx = this.ac(); if (!ctx) return;
    const t = ctx.currentTime + (at || 0);
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate); const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource(); const g = ctx.createGain();
    g.gain.value = vol || 0.06; src.buffer = buf; src.connect(g); g.connect(ctx.destination); src.start(t);
  }
  sfx(name) {
    if (!this.state.sound) return;
    const ctx = this.ac(); if (!ctx) return;
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) { /* ignore */ } }
    const n = (m) => 440 * Math.pow(2, (m - 69) / 12);
    const seq = (notes, step, type, vol) => notes.forEach((m, i) => { if (m) this.tone(n(m), step * 1.6, type, vol, i * step); });
    switch (name) {
      case 'click': this.tone(880, 0.05, 'square', 0.03); break;
      case 'select': seq([76, 83], 0.06, 'square', 0.035); break;
      case 'complete': seq([72, 76, 79, 84], 0.08, 'square', 0.04); break;
      case 'ach': seq([84, 88, 91, 96], 0.07, 'triangle', 0.06); break;
      case 'attack': this.noise(0.12, 0.05); this.tone(330, 0.16, 'square', 0.04, 0, 110); break;
      case 'combo': [0, 0.1, 0.2].forEach((d) => { this.noise(0.08, 0.05, d); this.tone(392 - d * 300, 0.1, 'square', 0.04, d, 160); }); break;
      case 'hit': this.tone(180, 0.22, 'sawtooth', 0.05, 0, 70); break;
      case 'heal': this.tone(420, 0.35, 'sine', 0.06, 0, 840); this.tone(630, 0.35, 'triangle', 0.03, 0.08, 1260); break;
      case 'victory': seq([67, 72, 76, 79, 0, 76, 79, 84], 0.11, 'square', 0.05); break;
      case 'reveal': seq([79, 83, 86, 91, 95], 0.06, 'triangle', 0.05); break;
      case 'spin': seq([60, 64, 67, 64, 60, 64, 67, 72], 0.09, 'sine', 0.03); break;
      case 'ending': seq([76, 79, 83, 88], 0.28, 'sine', 0.06); break;
      case 'error': seq([52, 47], 0.12, 'square', 0.04); break;
      default: break;
    }
  }
  /* ---------------------------------------------------------------- music
     Original chiptune loops, one per stage (8th-note steps, MIDI numbers, 0 = rest). */
  songs() {
    if (this._songs) return this._songs;
    this._songs = {
      intro: { bpm: 116, vol: 1, lw: 'square', lv: 0.022,
        lead: [72,0,76,79, 0,76,72,0, 74,0,77,81, 0,77,74,0, 76,0,79,84, 0,79,76,0, 74,76,77,74, 72,0,0,0],
        bass: [48,0,55,0, 48,0,55,0, 50,0,57,0, 50,0,57,0, 52,0,55,0, 52,0,55,0, 53,0,55,0, 48,0,43,0] },
      quiz: { bpm: 104, vol: 1, lw: 'triangle', lv: 0.045,
        lead: [77,0,81,0, 84,0,81,79, 77,0,0,79, 81,0,0,0, 74,0,77,0, 81,0,79,77, 76,0,0,77, 79,0,0,0],
        bass: [41,0,48,0, 41,0,48,0, 46,0,53,0, 46,0,53,0, 50,0,57,0, 50,0,57,0, 48,0,55,0, 48,0,55,0] },
      battle: { bpm: 152, vol: 1, lw: 'square', lv: 0.02, perc: true,
        lead: [69,0,72,76, 69,0,72,76, 77,76,74,72, 74,0,71,0, 69,0,72,76, 81,0,79,77, 76,74,72,71, 72,0,71,0],
        bass: [45,45,57,45, 45,45,57,45, 41,41,53,41, 43,43,55,43, 45,45,57,45, 45,45,57,45, 41,41,53,41, 40,40,52,40] },
      prophecy: { bpm: 92, vol: 1, lw: 'triangle', lv: 0.04,
        lead: [62,65,69,72, 74,72,69,65, 62,65,69,72, 76,72,69,65, 60,64,67,71, 72,71,67,64, 62,65,69,72, 74,0,0,0],
        bass: [38,0,0,0, 45,0,0,0, 38,0,0,0, 45,0,0,0, 36,0,0,0, 43,0,0,0, 38,0,0,0, 45,0,0,0] },
      award: { bpm: 120, vol: 1, lw: 'square', lv: 0.022,
        lead: [67,0,71,74, 79,0,74,0, 76,0,72,76, 79,0,0,0, 74,0,78,81, 83,0,81,79, 78,79,81,78, 79,0,0,0],
        bass: [43,0,50,0, 43,0,50,0, 48,0,55,0, 48,0,55,0, 50,0,57,0, 50,0,57,0, 50,0,54,0, 43,0,50,0] },
      rush: { bpm: 150, vol: 1, lw: 'square', lv: 0.02, perc: true,
        lead: [79,0,79,76, 79,0,84,0, 81,0,79,76, 74,0,76,0, 77,0,77,74, 77,0,81,0, 79,77,76,74, 72,0,0,0],
        bass: [48,55,48,55, 48,55,48,55, 53,60,53,60, 55,62,55,62, 50,57,50,57, 53,60,53,60, 55,62,55,62, 48,55,48,55] },
      memory: { bpm: 96, vol: 1, lw: 'triangle', lv: 0.045,
        lead: [72,0,79,0, 76,0,79,0, 74,0,79,0, 77,0,76,74, 72,0,79,0, 76,0,81,0, 79,0,77,0, 76,0,0,0],
        bass: [48,0,0,0, 52,0,0,0, 43,0,0,0, 47,0,0,0, 45,0,0,0, 41,0,0,0, 43,0,0,0, 48,0,0,0] },
      bugs: { bpm: 132, vol: 1, lw: 'square', lv: 0.018, perc: true,
        lead: [64,67,71,67, 64,0,62,0, 64,67,72,71, 69,0,67,0, 65,69,72,69, 65,0,64,0, 67,71,74,72, 71,0,0,0],
        bass: [40,0,52,0, 40,0,52,0, 45,0,57,0, 45,0,57,0, 41,0,53,0, 41,0,53,0, 43,0,55,0, 43,0,47,0] },
      food: { bpm: 124, vol: 1, lw: 'square', lv: 0.02,
        lead: [74,0,78,81, 0,78,74,0, 76,0,79,83, 0,79,76,0, 78,0,81,86, 0,81,78,0, 79,78,76,73, 74,0,0,0],
        bass: [50,0,57,0, 50,0,57,0, 52,0,59,0, 52,0,59,0, 54,0,57,0, 54,0,57,0, 55,0,57,0, 50,0,45,0] },
      prize: { bpm: 120, vol: 1, lw: 'square', lv: 0.022,
        lead: [67,0,71,74, 79,0,74,0, 76,0,72,76, 79,0,0,0, 74,0,78,81, 83,0,81,79, 78,79,81,78, 79,0,0,0],
        bass: [43,0,50,0, 43,0,50,0, 48,0,55,0, 48,0,55,0, 50,0,57,0, 50,0,57,0, 50,0,54,0, 43,0,50,0] },
      letter: { bpm: 58, vol: 1, lw: 'sine', lv: 0.04, long: true, fade: 2.5,
        lead: [64,67,71,76, 74,71,67,69, 60,64,67,72, 71,67,64,62],
        bass: [52,0,0,0, 50,0,0,0, 48,0,0,0, 47,0,0,0] }
    };
    return this._songs;
  }
  songFor() {
    const s = this.state;
    if (!s.sound || !this._unlocked) return null;
    if (s.view === 'letter') return s.letterOpen ? 'letter' : null;
    if (s.view === 'battle') return s.battle.won ? null : 'battle';
    if (s.view === 'prize') return s.prizePhase === 'process' ? null : 'prize';
    return this.songs()[s.view] ? s.view : null;
  }
  syncMusic() {
    const id = this.songFor();
    if (id === this._song) return;
    this.stopMusic();
    if (!id) return;
    const ctx = this.ac(); if (!ctx) return;
    const song = this.songs()[id];
    const bus = ctx.createGain();
    bus.gain.setValueAtTime(0.0001, ctx.currentTime);
    bus.gain.exponentialRampToValueAtTime(song.vol, ctx.currentTime + (song.fade || 0.8));
    bus.connect(ctx.destination);
    this._song = id; this._bus = bus;
    const step = 60 / song.bpm / 2;
    const n = (m) => 440 * Math.pow(2, (m - 69) / 12);
    const note = (f, t, dur, type, vol) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + 0.03);
    };
    let i = 0; let t = ctx.currentTime + 0.12;
    this._musicT = setInterval(() => {
      if (this._bus !== bus) return;
      if (t < ctx.currentTime - 0.05) t = ctx.currentTime + 0.05;   // tab was in the background
      while (t < ctx.currentTime + 0.25) {
        const k = i % song.lead.length;
        if (song.lead[k]) note(n(song.lead[k]), t, song.long ? step * 2.2 : step * 0.85, song.lw, song.lv);
        const bk = i % song.bass.length;
        if (song.bass[bk]) note(n(song.bass[bk]), t, song.long ? step * 4 : step * 0.8, 'triangle', song.long ? 0.03 : 0.05);
        if (song.perc && i % 2 === 1) {
          const len = Math.floor(ctx.sampleRate * 0.03); const buf = ctx.createBuffer(1, len, ctx.sampleRate); const d = buf.getChannelData(0);
          for (let j = 0; j < len; j++) d[j] = (Math.random() * 2 - 1) * (1 - j / len);
          const src = ctx.createBufferSource(); const g = ctx.createGain(); g.gain.value = 0.018; src.buffer = buf; src.connect(g); g.connect(bus); src.start(t);
        }
        t += step; i += 1;
      }
    }, 50);
  }
  stopMusic() {
    if (this._musicT) { clearInterval(this._musicT); this._musicT = null; }
    const bus = this._bus; this._bus = null; this._song = null;
    if (bus && this._ac) {
      const now = this._ac.currentTime;
      try { bus.gain.cancelScheduledValues(now); bus.gain.setValueAtTime(Math.max(bus.gain.value, 0.0001), now); bus.gain.exponentialRampToValueAtTime(0.0001, now + 0.35); } catch (e) { /* ignore */ }
      setTimeout(() => { try { bus.disconnect(); } catch (e) { /* ignore */ } }, 500);
    }
  }
  unlockAudio() {
    if (this._unlocked) return;
    this._unlocked = true;
    const ctx = this.ac();
    if (ctx && ctx.state === 'suspended') { try { ctx.resume(); } catch (e) { /* ignore */ } }
    ['pointerdown', 'touchend', 'click'].forEach((ev) => document.removeEventListener(ev, this._onFirst, true));
    this.syncMusic();
  }

  /* ------------------------------------------------------- core helpers */
  stageIndex(view) { return this.D().stages.map((x) => x.id).indexOf(view); }
  canGo(view) {
    const d = this.state.done;
    const i = this.stageIndex(view);
    return i === 0 || (i > 0 && d[i - 1]);
  }
  goTo(view) {
    if (!this.canGo(view)) { this.sfx('error'); return; }
    this.sfx('click');
    this.stopGame();
    const i = this.stageIndex(view);
    const st = { view, modal: null, wipe: this.state.wipe + 1 };
    if (this.D().games[view]) { st.mgPhase = this.state.games[view] ? 'done' : 'story'; st.g = null; st.mgMsg = ''; }
    if (view === 'prize') st.prizePhase = this.state.prize.done ? 'reveal' : 'pick';
    if (view === 'battle' && !this.state.battle.won && this.state.battle.acts === 0) st.battle = this.freshBattle();
    this.setState(st);
    if (!this.state.done[i] && i > 0) this.say('Stage berikutnya! ' + this.D().stages[i].say + '.', true);
    this.later(30, () => this.scrollTop());
  }
  scrollTop() {
    try {
      const el = document.querySelector('.stage');
      if (el) el.scrollTop = 0;
      window.scrollTo(0, 0);
    } catch (e) { /* ignore */ }
  }
  completeMission(i, label) {
    if (this.state.done[i]) return false;
    const done = this.state.done.slice(); done[i] = true;
    this.setState({ done, banner: label || ('MISI ' + (i + 1) + ' SELESAI'), bannerKey: this.state.bannerKey + 1, confetti: this.state.confetti + 1 });
    this.sfx('complete');
    this.later(1900, () => this.setState({ banner: null }));
    return true;
  }
  unlock(id) {
    if (this.state.ach[id]) return;
    const ach = Object.assign({}, this.state.ach); ach[id] = Date.now();
    const q = this.state.toastQ.concat([id]);
    this.setState({ ach, toastQ: q }, () => { if (!this.state.toast) this.nextToast(); });
    this.say('Achievement terbuka!');
  }
  nextToast() {
    const q = this.state.toastQ.slice();
    if (!q.length) { this.setState({ toast: null }); return; }
    const id = q.shift();
    this.setState({ toast: id, toastQ: q, toastKey: this.state.toastKey + 1 });
    this.later(250, () => this.sfx('ach'));
    this.later(3300, () => this.nextToast());
  }
  openModal(m) { this.sfx('click'); this.setState({ modal: m }); }
  closeModal() {
    this.sfx('click');
    const st = { modal: null };
    if (this.state.modal === 'photo') st.photoPreview = null;
    this.setState(st);
  }
  toggleSound() {
    const on = !this.state.sound;
    if (!on) { try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) { /* ignore */ } }
    this.setState({ sound: on }, () => {
      if (on) this.sfx('select');
      this.syncMusic();
    });
  }
  restart() {
    this.stopMusic();
    this.stopGame();
    const ls = this.storage();
    if (ls) { try { ls.removeItem(this.key()); } catch (e) { /* ignore */ } }
    this._lastSaved = '';
    const keep = { sound: this.state.sound, avatar: this.state.avatar, photoSrc: this.state.photoSrc, crop: this.state.crop, photoLocal: this.state.photoLocal };
    this.setState(Object.assign(this.blank(), this.blankUI(), keep, { wipe: this.state.wipe + 1 }));
    this.later(30, () => this.scrollTop());
  }

  /* ---------------------------------------------------------------- intro */
  startQuest() {
    this.completeMission(0, 'QUEST DIMULAI · MISI 1/10');
    this.say('Quest dimulai!');
    this.later(650, () => this.goTo('quiz'));
  }
  tapAttr(i) {
    this.sfx('click');
    if (i === 4 && this.state.statSel === 4) { this.runMotivation(); return; }
    this.setState({ statSel: this.state.statSel === i ? -1 : i });
  }
  runMotivation() {
    this.setState({ modal: 'mot', motStep: 0 });
    [700, 1500, 2300].forEach((ms, k) => this.later(ms, () => { if (this.state.modal === 'mot') { this.setState({ motStep: k + 1 }); this.sfx(k === 2 ? 'complete' : 'click'); } }));
  }
  avatarTap() {
    const now = Date.now();
    this._taps = this._taps.filter((t) => now - t < 1600).concat([now]);
    this.sfx('click');
    this.setState({ heroAnim: 'poke', animKey: this.state.animKey + 1 });
    if (this._taps.length >= 5) {
      this._taps = [];
      this.setState({ modal: 'dev' });
      this.unlock('dev');
    }
  }
  foodEgg() { this.sfx('select'); this.setState({ modal: 'food', foodBoost: true }); this.unlock('food'); }
  bathEgg() { this.sfx('error'); this.setState({ modal: 'bath' }); }

  /* ----------------------------------------------------------------- quiz */
  answer(i) {
    const s = this.state;
    if (s.lock || s.quizType || s.view !== 'quiz') return;
    this.sfx('select');
    this.setState({ lock: true, pick: i });
    this.later(420, () => {
      const answers = this.state.answers.slice(0, this.state.qIdx); answers[this.state.qIdx] = i;
      if (this.state.qIdx < 4) {
        this.setState({ answers, qIdx: this.state.qIdx + 1, lock: false, pick: -1 });
      } else {
        const r = this.scoreQuiz(answers);
        this.setState({ answers, quizType: r.winner, lock: false, pick: -1 });
        this.completeMission(1, 'KENAL DIRI SENDIRI!');
        this.say('Kamu adalah ' + this.D().types[r.winner].short + '!');
        this.unlock('self');
        this.later(30, () => this.scrollTop());
      }
    });
  }
  scoreQuiz(answers) {
    const D = this.D();
    const scores = {}; D.typeOrder.forEach((t) => { scores[t] = 0; });
    const cats = answers.map((a, q) => (D.quiz[q] && D.quiz[q].opts[a]) ? D.quiz[q].opts[a][1] : null);
    cats.forEach((c) => { if (c) scores[c] += 1; });
    const max = Math.max.apply(null, D.typeOrder.map((t) => scores[t]));
    const tied = D.typeOrder.filter((t) => scores[t] === max);
    let winner = tied[0];
    // tie-break: the most recently selected answer whose category is among the tied ones
    for (let k = cats.length - 1; k >= 0; k--) { if (tied.indexOf(cats[k]) >= 0) { winner = cats[k]; break; } }
    return { winner, scores };
  }
  quizBack() {
    if (this.state.qIdx > 0 && !this.state.lock) { this.sfx('click'); this.setState({ qIdx: this.state.qIdx - 1 }); }
  }
  retakeQuiz() { this.sfx('click'); this.setState({ answers: [], qIdx: 0, quizType: null }); }

  /* --------------------------------------------------------------- battle */
  log(b, text) {
    const id = b.nid; b.nid = id + 1;
    b.log = b.log.concat([{ id, t: text }]).slice(-3);
  }
  useSkill(id) {
    const s = this.state;
    if (s.view !== 'battle' || s.modal) return;
    const b = Object.assign({}, s.battle, { log: s.battle.log.slice() });
    if (b.phase !== 'player') return;
    if (id === 'combo' && b.cd > 0) { this.sfx('error'); return; }
    const maxHp = b.maxHp || 100; const dmg = b.dmg || 25;
    if (id === 'heal' && (b.heals <= 0 || b.php >= maxHp)) { this.sfx('error'); return; }
    const D = this.D();
    let fx; let heroAnim = 'attack'; let bossAnim = 'hit';
    if (id === 'strike') {
      b.bhp = Math.max(0, b.bhp - dmg); b.cd = Math.max(0, b.cd - 1);
      fx = { on: 'on-boss', t: '-' + dmg, kind: 'dmg' };
      this.log(b, 'CODING STRIKE! ' + D.hitLines[b.acts % D.hitLines.length] + ' (-' + dmg + ' HP)');
      this.sfx('attack');
    } else if (id === 'combo') {
      b.bhp = Math.max(0, b.bhp - 35); b.cd = 2;
      fx = { on: 'on-boss', t: '-35', kind: 'crit' };
      this.log(b, 'SAVAGE COMBO! CRITICAL HIT! (-35 HP)');
      heroAnim = 'combo'; bossAnim = 'hit-big';
      this.sfx('combo');
    } else {
      const before = b.php;
      b.php = Math.min(maxHp, b.php + 25); b.heals -= 1; b.cd = Math.max(0, b.cd - 1);
      fx = { on: 'on-hero', t: '+' + (b.php - before), kind: 'heal' };
      this.log(b, 'Istirahat dulu… seperti yang biasa Arief lakukan. (+' + (b.php - before) + ' HP)');
      heroAnim = 'heal'; bossAnim = '';
      this.sfx('heal');
    }
    b.acts += 1;
    const ak = s.animKey + 1;
    if (b.bhp <= 0) {
      b.phase = 'won'; b.won = true;
      this.log(b, 'ADULTING berhasil dikalahkan!');
      this.setState({ battle: b, fx, heroAnim, bossAnim: 'ko', animKey: ak });
      this.later(1100, () => {
        this.setState({ victoryShow: true, xp: this.state.xp + 500 });
        this.sfx('victory');
        this.completeMission(6, 'VICTORY! MISI 7/10');
        this.say('Victory! Kamu mengalahkan boss!');
        this.unlock('blood');
      });
      return;
    }
    b.phase = 'boss';
    this.setState({ battle: b, fx, heroAnim, bossAnim, animKey: ak });
    this.later(1150, () => this.bossTurn());
  }
  bossTurn() {
    const s = this.state;
    if (s.battle.phase !== 'boss') return;
    const b = Object.assign({}, s.battle, { log: s.battle.log.slice() });
    const D = this.D();
    const dmg = Math.max(2, 5 + Math.floor(Math.random() * 6) - (b.reduce || 0));
    const move = D.bossMoves[Math.floor(Math.random() * D.bossMoves.length)];
    b.php = Math.max(0, b.php - dmg);
    this.log(b, 'Adulting menyerang balik! ' + move + '! (-' + dmg + ' HP)');
    if (b.php <= 0) { b.phase = 'lost'; } else { b.phase = 'player'; b.turn += 1; this.log(b, 'Giliranmu. Pilih skill-mu, Arief!'); }
    this.setState({ battle: b, fx: { on: 'on-hero', t: '-' + dmg, kind: 'dmg' }, heroAnim: 'hurt', bossAnim: 'atk', animKey: s.animKey + 1, shake: s.shake + 1 });
    this.sfx('hit');
  }
  respawn() { this.sfx('select'); this.setState({ battle: this.freshBattle(), fx: null, heroAnim: '', bossAnim: '', victoryShow: false }); }

  /* --------------------------------------------------------------- voice */
  say(text, interrupt) {
    if (!this.state.sound) return;
    try {
      const ss = window.speechSynthesis; const U = window.SpeechSynthesisUtterance;
      if (!ss || !U) return;
      if (interrupt) ss.cancel();
      const u = new U(text);
      u.lang = 'id-ID'; u.rate = 1.05; u.pitch = 1.15; u.volume = 1;
      const vs = ss.getVoices ? ss.getVoices() : [];
      const v = vs.filter((x) => /^id/i.test(x.lang))[0];
      if (v) u.voice = v;
      ss.speak(u);
    } catch (e) { /* speech not available */ }
  }

  /* ------------------------------------------------------------ mini games */
  stopGame() { if (this._gameT) { clearInterval(this._gameT); this._gameT = null; } }
  rnd(n) { return Math.floor(Math.random() * n); }
  shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = this.rnd(i + 1); const t = b[i]; b[i] = b[j]; b[j] = t; } return b; }
  flash(msg) { this.setState({ mgMsg: msg, mgMsgKey: this.state.mgMsgKey + 1 }); }
  startGame() {
    const id = this.state.view;
    if (!this.D().games[id]) return;
    this.stopGame();
    this.sfx('select');
    let g;
    if (id === 'rush') g = { min: 390, step: 0, order: this.shuffle([0, 1, 2, 3, 4]), tempt: null, nextTempt: 2500, el: 0, temptKey: 0, wrong: -1 };
    if (id === 'memory') g = { cards: this.shuffle(this.D().memCards.concat(this.D().memCards)).map((c, i) => ({ i, icon: c[0], name: c[1], open: false, done: false })), first: -1, lock: false, moves: 0, pairs: 0 };
    if (id === 'bugs') g = { left: 25000, score: 0, holes: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(() => ({ type: '', until: 0, k: 0 })), spawn: 400, n: 0, now: 0 };
    if (id === 'food') g = { left: 25000, score: 0, x: 50, items: [], spawn: 300, n: 0, pop: null };
    this.setState({ mgPhase: 'play', g, mgMsg: '' });
    this.say(id === 'rush' ? 'Ayo cepat!' : id === 'memory' ? 'Ingat-ingat ya!' : id === 'bugs' ? 'Basmi bugnya!' : 'Tangkap jajanannya!', true);
    if (id === 'rush') this._gameT = setInterval(() => this.rushTick(100), 100);
    if (id === 'bugs') this._gameT = setInterval(() => this.bugsTick(100), 100);
    if (id === 'food') this._gameT = setInterval(() => this.foodTick(50), 50);
  }
  finishGame(id, rating, summary) {
    this.stopGame();
    const games = Object.assign({}, this.state.games);
    const prev = games[id];
    games[id] = { rating, summary, best: Math.max(rating, prev ? prev.best || prev.rating : 0) };
    const itemId = this.D().games[id].item;
    const items = Object.assign({}, this.state.items);
    items[itemId] = Math.max(items[itemId] || 0, rating);
    this.setState({ games, items, mgPhase: 'done', g: null });
    const idx = this.stageIndex(id);
    const label = this.D().games[id].ratings[rating];
    if (!this.completeMission(idx, label)) { this.sfx('complete'); }
    this.say(label.replace(/[()]/g, '') + ' Kamu dapat ' + this.D().items[itemId].name + '.');
    this.later(30, () => this.scrollTop());
  }
  replayGame() { this.sfx('click'); this.setState({ mgPhase: 'story', g: null, mgMsg: '' }); }

  /* Morning Rush */
  rushTick(ms) {
    const g = this.state.g; if (!g || this.state.view !== 'rush') { this.stopGame(); return; }
    const n = Object.assign({}, g);
    n.min += ms / 600;
    n.el += ms;
    if (n.tempt) {
      if (n.el >= n.tempt.until) { n.min += 5; n.tempt = null; n.nextTempt = n.el + 2600; this.flash('Melamun 5 menit…'); this.sfx('error'); }
    } else if (n.el >= n.nextTempt) {
      const done = this.D().rushTasks.slice(0, n.step).map((t) => t.id);
      const pool = this.D().tempts.filter((t) => !t.before || done.indexOf(t.before) < 0);
      const t = pool[this.rnd(pool.length)];
      n.tempt = { t: t.t, yes: t.yes, cost: t.cost, icon: t.icon, until: n.el + 3200 }; n.temptKey += 1;
      this.sfx('error');
    }
    this.setState({ g: n });
    if (n.min >= 480) this.rushEnd(n);
  }
  rushTask(k) {
    const g = this.state.g; if (!g || g.tempt) return;
    const T = this.D().rushTasks;
    const n = Object.assign({}, g);
    if (k === n.step) {
      n.min += T[k].dur; n.step += 1; n.order = this.shuffle([0, 1, 2, 3, 4]);
      this.sfx('select'); this.setState({ g: n, mgMsg: '' });
      if (n.step >= T.length) this.rushEnd(n);
    } else {
      n.min += 2; n.wrong = k; this.sfx('error'); this.setState({ g: n }); this.flash('Urutannya salah! +2 menit');
    }
  }
  rushTempt(yes) {
    const g = this.state.g; if (!g || !g.tempt) return;
    const n = Object.assign({}, g);
    if (yes) { n.min += n.tempt.cost; this.flash('Tergoda… +' + n.tempt.cost + ' menit'); this.sfx('error'); } else { this.flash('Mantap, fokus!'); this.sfx('select'); }
    n.tempt = null; n.nextTempt = n.el + 2600 + this.rnd(1500);
    this.setState({ g: n });
  }
  rushEnd(n) {
    const m = Math.round(n.min);
    const rating = m <= 450 ? 3 : m <= 465 ? 2 : 1;
    this.finishGame('rush', rating, 'Berangkat jam ' + this.clockText(m) + (n.step < 5 ? ' (akhirnya…)' : ''));
  }
  clockText(m) { const h = Math.floor(m / 60), mm = Math.floor(m % 60); return (h < 10 ? '0' : '') + h + '.' + (mm < 10 ? '0' : '') + mm; }

  /* Kartu Memori */
  memFlip(i) {
    const g = this.state.g; if (!g || g.lock) return;
    const c = g.cards[i]; if (!c || c.open || c.done) return;
    const cards = g.cards.map((x) => Object.assign({}, x)); cards[i].open = true;
    this.sfx('click');
    if (g.first < 0) { this.setState({ g: Object.assign({}, g, { cards, first: i }) }); return; }
    const a = cards[g.first]; const moves = g.moves + 1;
    if (a.icon === c.icon) {
      a.done = true; cards[i].done = true;
      const pairs = g.pairs + 1;
      this.setState({ g: Object.assign({}, g, { cards, first: -1, moves, pairs }) });
      this.sfx('select'); this.flash(c.name + ' aman, nggak ketinggalan!');
      if (pairs >= 8) this.later(700, () => this.finishGame('memory', moves <= 12 ? 3 : moves <= 18 ? 2 : 1, moves + ' langkah'));
    } else {
      this.setState({ g: Object.assign({}, g, { cards, first: -1, moves, lock: true }) });
      this.later(750, () => {
        const h = this.state.g; if (!h) return;
        this.setState({ g: Object.assign({}, h, { lock: false, cards: h.cards.map((x) => Object.assign({}, x, { open: x.done })) }) });
      });
    }
  }

  /* Whack-a-Bug */
  bugsTick(ms) {
    const g = this.state.g; if (!g || this.state.view !== 'bugs') { this.stopGame(); return; }
    const n = Object.assign({}, g, { holes: g.holes.slice() });
    n.left -= ms; n.now += ms; n.spawn -= ms;
    n.holes = n.holes.map((h) => (h.type && n.now >= h.until ? { type: '', until: 0, k: h.k } : h));
    if (n.spawn <= 0) {
      const empty = n.holes.map((h, i) => (h.type ? -1 : i)).filter((i) => i >= 0);
      if (empty.length) {
        const i = empty[this.rnd(empty.length)];
        const type = Math.random() < 0.2 ? 'notif' : 'bug';
        n.n += 1;
        n.holes[i] = { type, until: n.now + (type === 'bug' ? 1150 : 1300), k: n.n };
      }
      n.spawn = 520 + this.rnd(260);
    }
    if (n.left <= 0) { this.setState({ g: n }); this.finishGame('bugs', n.score >= 14 ? 3 : n.score >= 8 ? 2 : 1, n.score + ' bug dibasmi'); return; }
    this.setState({ g: n });
  }
  bugHit(i) {
    const g = this.state.g; if (!g) return;
    const h = g.holes[i]; if (!h || !h.type || h.type === 'hit') return;
    const holes = g.holes.slice();
    if (h.type === 'bug') {
      holes[i] = { type: 'hit', until: g.now + 260, k: h.k };
      this.sfx('attack'); this.setState({ g: Object.assign({}, g, { holes, score: g.score + 1 }) });
    } else {
      holes[i] = { type: '', until: 0, k: h.k };
      this.sfx('error'); this.setState({ g: Object.assign({}, g, { holes, score: Math.max(0, g.score - 1) }) }); this.flash('Fokus kerja dulu! −1');
    }
  }

  /* Tangkap Jajanan */
  foodTick(ms) {
    const g = this.state.g; if (!g || this.state.view !== 'food') { this.stopGame(); return; }
    const F = this.D().foods;
    const n = Object.assign({}, g);
    n.left -= ms; n.spawn -= ms;
    let score = n.score; let pop = n.pop;
    const items = [];
    n.items.forEach((it) => {
      const y = it.y + it.v * ms / 1000;
      if (y >= 76 && y <= 92 && Math.abs(it.x - n.x) < 12) {
        if (it.kind === 'rokok') { score = Math.max(0, score - 1); pop = { t: 'Rokoknya dibuang! −1', bad: true, k: it.id }; this.sfx('error'); } else { score += 1; pop = { t: '+1 ' + it.name, bad: false, k: it.id }; this.sfx('select'); }
        return;
      }
      if (y < 104) items.push(Object.assign({}, it, { y }));
    });
    if (n.spawn <= 0) {
      n.n += 1;
      const bad = Math.random() < 0.24;
      const f = F[this.rnd(F.length)];
      items.push({ id: n.n, kind: bad ? 'rokok' : f[0], name: bad ? 'Rokok' : f[1], x: 8 + this.rnd(84), y: -8, v: 34 + this.rnd(14) });
      n.spawn = 560 + this.rnd(200);
    }
    n.items = items; n.score = score; n.pop = pop;
    if (n.left <= 0) { this.setState({ g: n }); this.finishGame('food', score >= 14 ? 3 : score >= 8 ? 2 : 1, score + ' jajanan tertangkap'); return; }
    this.setState({ g: n });
  }
  foodMove(dx) { const g = this.state.g; if (!g) return; this.setState({ g: Object.assign({}, g, { x: Math.max(8, Math.min(92, g.x + dx)) }) }); }
  foodPoint(e) {
    const g = this.state.g; if (!g || !e || !e.currentTarget) return;
    const r = e.currentTarget.getBoundingClientRect(); if (!r.width) return;
    const x = ((e.clientX - r.left) / r.width) * 100;
    this.setState({ g: Object.assign({}, g, { x: Math.max(8, Math.min(92, x)) }) });
  }


  /* ----------------------------------------------------------- grand prize */
  pickPrize(i) {
    const s = this.state;
    if (s.prizePhase === 'process') return;
    if (s.prize.done) { this.sfx('error'); this.flash('Hadiah sudah diklaim. Takdirmu memang power bank 🔋'); return; }
    const P = this.D().prizes[i]; if (!P) return;
    this.sfx('select');
    this.setState({ prize: { picked: i, done: false }, prizePhase: 'process', procStep: 0, rarity: 0, mgMsg: '' });
    this.say('Memproses hadiah: ' + P[0], true);
    this.later(30, () => this.scrollTop());
    this.later(1500, () => { this.setState({ procStep: 1 }); this.sfx('error'); this.sfx('hit'); this.say('Error!'); });
    this.later(3300, () => { this.setState({ procStep: 2 }); this.sfx('click'); });
    this.later(4400, () => { this.setState({ procStep: 3 }); this.sfx('spin'); });
    [0, 1, 2, 3].forEach((r) => this.later(4500 + r * 520, () => { this.setState({ rarity: r }); this.sfx(r === 3 ? 'reveal' : 'click'); }));
    this.later(6800, () => {
      this.setState({ prize: { picked: i, done: true }, prizePhase: 'reveal', confetti: this.state.confetti + 1, banner: 'LEGENDARY DROP!', bannerKey: this.state.bannerKey + 1 });
      this.sfx('victory');
      this.later(900, () => this.sfx('ach'));
      this.later(1900, () => this.setState({ banner: null }));
      this.say('Legendary drop! Power bank Anker!', true);
      this.later(30, () => this.scrollTop());
    });
  }
  prizeGrid() { this.sfx('click'); this.setState({ prizePhase: 'pick', mgMsg: '' }); this.later(30, () => this.scrollTop()); }
  prizeReveal() { this.sfx('click'); this.setState({ prizePhase: 'reveal', mgMsg: '' }); this.later(30, () => this.scrollTop()); }

  /* ------------------------------------------------------------- prophecy */
  reveal() {
    const s = this.state;
    if (s.spinning) return;
    this.sfx('spin');
    this.setState({ spinning: true });
    this.later(1500, () => {
      const D = this.D();
      const p = this.state.proph;
      const revealed = Object.assign({}, p.revealed);
      const unrevealed = D.cats.filter((c) => !revealed[c.id]);
      let pool = unrevealed.length ? unrevealed : D.cats.filter((c) => !p.cur || c.id !== p.cur.cat);
      const cat = pool[Math.floor(Math.random() * pool.length)];
      let idxs = cat.msgs.map((m, i) => i).filter((i) => p.seen.indexOf(cat.id + ':' + i) < 0);
      if (!idxs.length) idxs = cat.msgs.map((m, i) => i).filter((i) => !(p.cur && p.cur.cat === cat.id && p.cur.idx === i));
      const idx = idxs[Math.floor(Math.random() * idxs.length)];
      revealed[cat.id] = true;
      const seen = p.seen.indexOf(cat.id + ':' + idx) < 0 ? p.seen.concat([cat.id + ':' + idx]) : p.seen;
      const proph = { revealed, seen, cur: { cat: cat.id, idx }, count: p.count + 1 };
      this.setState({ proph, spinning: false, cardKey: this.state.cardKey + 1 });
      this.sfx('reveal');
      if (Object.keys(revealed).length >= D.cats.length && !this.state.done[7]) {
        this.later(700, () => { this.completeMission(7, 'MASA DEPAN CERAH!'); this.unlock('bright'); });
      }
    });
  }

  /* ---------------------------------------------------------- certificate */
  battleSummary() {
    const b = this.state.battle;
    if (!b.won) return 'Battle belum selesai';
    return 'Kalahkan ADULTING dalam ' + b.acts + ' giliran · sisa ' + b.php + ' HP';
  }
  typeShort() { const t = this.D().types[this.state.quizType]; return t ? t.short : 'Masih loading…'; }
  wrap(ctx, text, maxW) {
    const words = String(text).split(' '); const lines = []; let line = '';
    words.forEach((w) => { const test = line ? line + ' ' + w : w; if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test; });
    if (line) lines.push(line);
    return lines;
  }
  async downloadCert() {
    if (this.state.certBusy) return;
    this.sfx('select');
    this.setState({ certBusy: true });
    try {
      if (document.fonts && document.fonts.load) {
        await Promise.all([document.fonts.load('24px "Press Start 2P"'), document.fonts.load('24px "Rubik"'), document.fonts.load('bold 24px "Rubik"')]).catch(() => {});
      }
      const canvas = this.drawCert();
      const url = canvas.toDataURL('image/png');
      let href = url;
      if (canvas.toBlob && window.URL && URL.createObjectURL) {
        href = await new Promise((res) => canvas.toBlob((blob) => res(blob ? URL.createObjectURL(blob) : url), 'image/png'));
      }
      try {
        const a = document.createElement('a');
        a.href = href; a.download = 'Arief-Level-29-Birthday-Certificate.png'; a.rel = 'noopener';
        document.body.appendChild(a); a.click(); a.remove();
      } catch (e) { /* the preview below still lets them save it */ }
      const first = !this.state.certDone;
      this.setState({ certBusy: false, certDone: true, certUrl: url, modal: 'cert' });
      if (first) this.completeMission(8, 'SERTIFIKAT DIKLAIM · 9/10');
    } catch (e) {
      this.setState({ certBusy: false });
    }
  }
  drawCert() {
    const W = 1080, H = 1350, k = 2;
    const c = document.createElement('canvas'); c.width = W * k; c.height = H * k;
    const x = c.getContext('2d'); x.scale(k, k); x.imageSmoothingEnabled = false;
    const C = { navy: '#0f1a4a', dp: '#1e2d6e', royal: '#3b63d6', lav: '#a8c6ff', blue: '#91C7EF', yel: '#F5D477', pink: '#F1A9C7', white: '#F7F4FF' };
    const PX = '"Press Start 2P", monospace'; const SANS = '"Rubik", system-ui, sans-serif';
    x.fillStyle = C.navy; x.fillRect(0, 0, W, H);
    // starfield
    for (let i = 0; i < 90; i++) { const sx = (i * 397) % W, sy = (i * 211 + (i % 7) * 53) % H, z = i % 3 === 0 ? 4 : 2; x.fillStyle = i % 5 === 0 ? C.yel : (i % 3 ? C.lav : C.white); x.globalAlpha = 0.5; x.fillRect(sx, sy, z, z); }
    x.globalAlpha = 1;
    // stepped pixel border
    const frame = (m, col, w) => { x.fillStyle = col; x.fillRect(m + w, m, W - 2 * (m + w), w); x.fillRect(m + w, H - m - w, W - 2 * (m + w), w); x.fillRect(m, m + w, w, H - 2 * (m + w)); x.fillRect(W - m - w, m + w, w, H - 2 * (m + w)); };
    x.fillStyle = C.dp; x.fillRect(40, 40, W - 80, H - 80);
    frame(28, C.yel, 12); frame(52, C.lav, 4); frame(64, C.royal, 4);
    [[40, 40], [W - 64, 40], [40, H - 64], [W - 64, H - 64]].forEach((p) => { x.fillStyle = C.pink; x.fillRect(p[0], p[1], 24, 24); x.fillStyle = C.navy; x.fillRect(p[0] + 8, p[1] + 8, 8, 8); });
    const center = (txt, y, font, col) => { x.font = font; x.fillStyle = col; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.fillText(txt, W / 2, y); };
    const img = (name, dx, dy, w, h) => { const sc = this.sprCanvas(name); if (sc) x.drawImage(sc, dx, dy, w, h); };
    img('trophy', W / 2 - 72, 96, 144, 144);
    img('star5', 300, 150, 30, 30); img('star5', W - 330, 150, 30, 30); img('heart', 230, 190, 40, 40); img('heart', W - 270, 190, 40, 40);
    center('SERTIFIKAT', 292, '22px ' + PX, C.lav);
    center('PENCAPAIAN LEGENDARIS', 340, '30px ' + PX, C.yel);
    center('Dengan bangga diberikan kepada', 392, '24px ' + SANS, C.white);
    // avatar
    const ax = W / 2 - 80, ay = 414;
    x.fillStyle = C.navy; x.fillRect(ax - 12, ay - 12, 184, 184);
    x.fillStyle = C.yel; x.fillRect(ax - 8, ay - 8, 176, 176);
    x.fillStyle = C.navy; x.fillRect(ax - 4, ay - 4, 168, 168);
    let drew = false;
    if (this._avatarImg && this._avatarImg.complete && this._avatarImg.naturalWidth) { try { x.drawImage(this._avatarImg, ax, ay, 160, 160); drew = true; } catch (e) { drew = false; } }
    if (!drew) img('portrait', ax, ay, 160, 160);
    center('ARIEF', 652, '56px ' + PX, C.white);
    x.fillStyle = C.pink; x.fillRect(W / 2 - 210, 672, 420, 44); x.fillStyle = C.navy; x.fillRect(W / 2 - 206, 676, 412, 36);
    center('LEVEL ULANG TAHUN 29', 703, '18px ' + PX, C.pink);
    // stat rows
    const gs = this.state.games; const gsum = (k) => (gs[k] ? gs[k].summary : 'Belum dimainkan');
    const rows = [['KEPRIBADIAN', this.typeShort()], ['MORNING RUSH', gsum('rush')], ['KARTU MEMORI', gsum('memory')], ['WHACK-A-BUG', gsum('bugs')], ['TANGKAP JAJANAN', gsum('food')], ['HASIL BATTLE', this.battleSummary()], ['GELAR SPESIAL', 'Calon Legenda Esports']];
    let y = 762;
    rows.forEach((r) => {
      x.textAlign = 'left'; x.font = '14px ' + PX; x.fillStyle = C.lav; x.fillText(r[0], 140, y);
      x.textAlign = 'right'; x.font = '600 24px ' + SANS; x.fillStyle = C.white; x.fillText(r[1], W - 140, y + 2);
      x.fillStyle = C.royal; x.fillRect(140, y + 16, W - 280, 2);
      y += 40;
    });
    // award box
    const by = 1050;
    x.fillStyle = C.yel; x.fillRect(120, by, W - 240, 150); x.fillStyle = C.navy; x.fillRect(126, by + 6, W - 252, 138);
    center('PENGHARGAAN SPESIAL', by + 34, '14px ' + PX, C.lav);
    center('PALING MUNGKIN JADI PRO PLAYER', by + 70, '22px ' + PX, C.yel);
    center('“Terus grinding, Arief. Mimpimu bukan side quest.”', by + 104, 'italic 22px ' + SANS, C.white);
    center('*Syarat & ketentuan: latihan konsisten, istirahat cukup, dan kurangi menunda.', by + 130, '16px ' + SANS, C.lav);
    // badges
    const got = this.D().ach.filter((a) => this.state.ach[a.id]);
    const n = Math.max(got.length, 1); const gap = 108; let bx = W / 2 - ((n - 1) * gap) / 2;
    if (!got.length) center('Belum ada badge', 1232, '18px ' + SANS, C.lav);
    got.forEach((a) => { img(a.icon, bx - 20, 1214, 40, 40); bx += gap; });
    x.textAlign = 'center';
    center(got.length + '/6 ACHIEVEMENT · ' + (this.state.xp || 0) + ' XP', 1274, '12px ' + PX, C.lav);
    return c;
  }

  /* ------------------------------------------------------------------ letter */
  openLetter() {
    this.setState({ letterOpen: true });
    if (!this.state.done[9]) { const done = this.state.done.slice(); done[9] = true; this.setState({ done }); }
    this.later(1600, () => this.say('Selamat ulang tahun, Arief!'));
    this.sfx('ending');
    this.unlock('legend');
  }

  /* ------------------------------------------------------------------- photo */
  loadImage(src, cb) {
    const im = new Image();
    if (!/^data:/.test(src)) im.crossOrigin = 'anonymous';
    im.onload = () => cb(im);
    im.onerror = () => cb(null);
    im.src = src;
  }
  loadPropPhoto() {
    const p = this.props;
    const crop = { z: Number(p.photoZoom) || 1.15, x: p.photoX != null ? Number(p.photoX) : 0.27, y: p.photoY != null ? Number(p.photoY) : 0.4, n: 48 };
    this.processPhoto(p.photo, crop, (url) => { if (url) this.setState({ avatar: url, crop }); });
  }
  processPhoto(src, crop, cb) {
    this.loadImage(src, (im) => {
      if (!im) { this.setState({ photoErr: 'Foto tidak bisa dimuat.' }); cb(null); return; }
      try {
        const W = im.naturalWidth, H = im.naturalHeight;
        const side = Math.min(W * 0.5, H) / Math.max(1, crop.z);
        const sx = Math.max(0, Math.min(W - side, crop.x * W - side / 2));
        const sy = Math.max(0, Math.min(H - side, crop.y * H - side / 2));
        const N = crop.n || 48;
        const c = document.createElement('canvas'); c.width = N; c.height = N;
        const x = c.getContext('2d'); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
        x.drawImage(im, sx, sy, side, side, 0, 0, N, N);
        const d = x.getImageData(0, 0, N, N); const a = d.data; const L = 7;
        for (let i = 0; i < a.length; i += 4) {
          let r = a[i], g = a[i + 1], b = a[i + 2];
          const avg = (r + g + b) / 3;
          r = avg + (r - avg) * 1.18; g = avg + (g - avg) * 1.18; b = avg + (b - avg) * 1.18;
          r = (r - 128) * 1.08 + 128; g = (g - 128) * 1.08 + 128; b = (b - 128) * 1.08 + 128;
          const q = (v) => Math.round(Math.max(0, Math.min(255, v)) / 255 * (L - 1)) / (L - 1) * 255;
          a[i] = q(r); a[i + 1] = q(g); a[i + 2] = q(b + 4); a[i + 3] = 255;
        }
        x.putImageData(d, 0, 0);
        const url = c.toDataURL('image/png');
        const ai = new Image(); ai.src = url; this._avatarImg = ai;
        this.setState({ photoErr: '' });
        cb(url);
      } catch (e) {
        this.setState({ photoErr: 'Foto ini tidak bisa diproses di sini (diblokir browser).' });
        cb(null);
      }
    });
  }
  onPhotoFile(e) {
    const f = e && e.target && e.target.files && e.target.files[0];
    if (!f) return;
    if (!/^image\//.test(f.type)) { this.setState({ photoErr: 'Pilih file gambar (JPG atau PNG).' }); return; }
    const r = new FileReader();
    r.onload = () => {
      this.loadImage(String(r.result), (im) => {
        if (!im) { this.setState({ photoErr: 'Gambar tidak bisa dibaca.' }); return; }
        const max = 900; const s = Math.min(1, max / Math.max(im.naturalWidth, im.naturalHeight));
        const c = document.createElement('canvas'); c.width = Math.round(im.naturalWidth * s); c.height = Math.round(im.naturalHeight * s);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        const src = c.toDataURL('image/jpeg', 0.85);
        const crop = { z: 1.15, x: 0.27, y: 0.4, n: this.state.crop.n || 48 };
        this.setState({ photoSrc: src, crop });
        this.processPhoto(src, crop, (url) => this.setState({ photoPreview: url }));
      });
    };
    r.readAsDataURL(f);
  }
  setCrop(key, v) {
    const crop = Object.assign({}, this.state.crop); crop[key] = Number(v);
    this.setState({ crop });
    if (!this.state.photoSrc) return;
    if (this._cropT) clearTimeout(this._cropT);
    this._cropT = setTimeout(() => this.processPhoto(this.state.photoSrc, this.state.crop, (url) => this.setState({ photoPreview: url })), 60);
  }
  savePhoto() {
    const s = this.state;
    if (!s.photoSrc) { this.closeModal(); return; }
    const ls = this.storage();
    if (ls) { try { ls.setItem(this.key() + ':photo', JSON.stringify({ src: s.photoSrc, crop: s.crop })); } catch (e) { this.setState({ photoErr: 'Foto terlalu besar untuk disimpan di perangkat ini, tapi tetap dipakai untuk sekarang.' }); } }
    this.processPhoto(s.photoSrc, s.crop, (url) => this.setState({ avatar: url, photoLocal: true, modal: null, photoPreview: null }));
    this.sfx('complete');
  }
  clearPhoto() {
    const ls = this.storage();
    if (ls) { try { ls.removeItem(this.key() + ':photo'); } catch (e) { /* ignore */ } }
    this._avatarImg = null;
    this.setState({ avatar: null, photoSrc: null, photoPreview: null, photoLocal: false, modal: null });
    if (this.props.photo) this.loadPropPhoto();
  }

  /* ----------------------------------------------------------- render vals */
  renderVals() {
    const s = this.state; const D = this.D();
    const view = s.view;
    const si = this.stageIndex(view);
    const stage = D.stages[si];
    const doneCount = s.done.filter(Boolean).length;
    const segs = D.stages.slice(0, 10).map((st, i) => {
      const reach = i === 0 || s.done[i - 1];
      const cur = si === i;
      return { cls: (s.done[i] ? 'is-done' : '') + (cur ? ' is-current' : '') + (reach ? '' : ' is-locked'),
        locked: !reach, current: cur, label: 'Stage ' + st.num + ': ' + st.name + (s.done[i] ? ' (selesai)' : reach ? '' : ' (terkunci)'),
        go: () => this.goTo(st.id) };
    });
    const avatarSrc = s.avatar || this.spr('portrait');
    const hasPhoto = !!s.avatar;
    // attributes
    const attrs = D.attrs.map((a, i) => {
      let val = a.val, text = a.text;
      if (i === 3 && s.foodBoost) { val = 100; text = '100%'; }
      return { name: a.name, text, w: val, cls: 'k-' + a.kind + (s.statSel === i ? ' is-open' : ''), kind: 'm-' + a.kind, open: s.statSel === i, tap: () => this.tapAttr(i) };
    });
    const attrNote = s.statSel >= 0 ? (s.statSel === 3 && s.foodBoost ? 'Ada jajanan terdeteksi di dekat sini. Daya Tarik Makanan sekarang maksimal.' : D.attrs[s.statSel].note) : 'Tap salah satu stat untuk melihat detailnya.';
    // quiz
    const qIdx = Math.min(s.qIdx, 4);
    const q = D.quiz[qIdx];
    const qOpts = q.opts.map((o, i) => ({ key: 'ABCD'[i], text: o[0], cls: (s.pick === i ? 'is-picked' : '') + (s.answers[qIdx] === i && s.pick < 0 ? ' was-chosen' : ''), pick: () => this.answer(i) }));
    const qDots = D.quiz.map((x, i) => ({ cls: i < qIdx ? 'is-done' : i === qIdx ? 'is-current' : '' }));
    const type = s.quizType ? D.types[s.quizType] : null;
    let scoreBars = [];
    if (type) {
      const r = this.scoreQuiz(s.answers);
      scoreBars = D.typeOrder.map((t) => ({ name: D.types[t].short, n: r.scores[t], w: Math.round(r.scores[t] / 5 * 100), cls: t === s.quizType ? 'is-win' : '' }));
    }
    // battle
    const b = s.battle;
    const bMax = b.maxHp || 100; const bDmg = b.dmg || 25; const bHealsMax = b.healsMax || 2;
    const skills = [
      { id: 'strike', name: 'CODING STRIKE', meta: bDmg + ' DMG · Serangan debugging yang kuat', short: bDmg + ' DMG', icon: 'sword', hot: '1' },
      { id: 'combo', name: 'SAVAGE COMBO', meta: b.cd > 0 ? 'COOLDOWN · ' + b.cd + ' GILIRAN' : '35 DMG · Combo beruntun, cooldown 2 giliran', short: b.cd > 0 ? 'CD ' + b.cd : '35 DMG', icon: 'controller', hot: '2' },
      { id: 'heal', name: 'SLEEP RECOVERY', meta: b.heals <= 0 ? 'JATAH HABIS' : (b.php >= bMax ? 'HP PENUH · ' : '+25 HP · ') + 'sisa ' + b.heals + '/' + bHealsMax, short: b.heals <= 0 ? 'SISA 0/' + bHealsMax : '+25 · ' + b.heals + '/' + bHealsMax, icon: 'moon', hot: '3' }
    ].map((k) => {
      const off = b.phase !== 'player' || (k.id === 'combo' && b.cd > 0) || (k.id === 'heal' && (b.heals <= 0 || b.php >= bMax));
      return Object.assign(k, { img: this.spr(k.icon), off, cls: 'sk-' + k.id + (off ? ' is-off' : ''), use: () => this.useSkill(k.id) });
    });
    const turnText = b.phase === 'player' ? 'GILIRANMU · ' + b.turn : b.phase === 'boss' ? 'GILIRAN BOSS' : b.phase === 'won' ? 'K.O.!' : 'GAME OVER?';
    // prophecy
    const cats = D.cats.map((c) => ({ name: c.name, img: this.spr(c.icon), cls: s.proph.revealed[c.id] ? 'is-on' : 'is-off', state: s.proph.revealed[c.id] ? 'revealed' : 'locked' }));
    const revCount = Object.keys(s.proph.revealed).length;
    let card = null;
    if (s.proph.cur) { const c = D.cats.filter((x) => x.id === s.proph.cur.cat)[0]; if (c) card = { cat: c.name, text: c.msgs[s.proph.cur.idx] || c.msgs[0], img: this.spr(c.icon) }; }
    // achievements
    const achList = D.ach.map((a) => {
      const on = !!s.ach[a.id];
      return { title: on || !a.hidden ? a.title : '???', desc: on ? a.desc : (a.hidden ? a.hint : a.desc), img: this.spr(a.icon), cls: on ? 'is-on' : 'is-off', status: on ? 'TERBUKA' : 'TERKUNCI' };
    });
    const achCount = D.ach.filter((a) => s.ach[a.id]).length;
    const badges = D.ach.filter((a) => s.ach[a.id]).map((a) => ({ title: a.title, img: this.spr(a.icon) }));
    const toastA = s.toast ? D.ach.filter((a) => a.id === s.toast)[0] : null;
    // decor
    if (!this._stars) {
      this._stars = []; for (let i = 0; i < 46; i++) this._stars.push({ x: (i * 37.7) % 100, y: (i * 61.3 + (i % 5) * 7) % 100, d: ((i * 0.37) % 4).toFixed(2), z: i % 4 === 0 ? 4 : 2 });
      this._bits = []; const cols = ['#F5D477', '#F1A9C7', '#B99BEF', '#91C7EF', '#F7F4FF'];
      for (let i = 0; i < 36; i++) this._bits.push({ x: (i * 29.3) % 100, d: ((i * 0.13) % 0.9).toFixed(2), c: cols[i % 5], r: (i * 47) % 360, z: 6 + (i % 3) * 3 });
    }
    const lines = D.letter.map((t, i) => ({ t, d: (0.35 + i * 0.45).toFixed(2), cls: i === 0 ? 'l-dear' : i === D.letter.length - 1 ? 'l-end' : '' }));
    const crop = s.crop;
    const certBattle = this.battleSummary();
    // time of day, clouds, items
    const tod = (stage && stage.tod) || 'pagi';
    if (!this._clouds) { this._clouds = [0, 1, 2, 3, 4].map((i) => ({ y: [8, 22, 14, 30, 4][i], d: (-i * 9).toFixed(1), s: (38 + i * 7), w: [120, 84, 150, 96, 70][i] })); }
    const bag = D.itemOrder.map((id) => {
      const it = D.items[id]; const lv = s.items[id] || 0;
      return { name: it.name, img: this.spr(it.icon), fx: lv ? it.fx[lv] : 'Belum didapat · dari ' + it.from, stars: lv ? '★★★'.slice(0, lv) + '☆☆☆'.slice(0, 3 - lv) : '', cls: lv ? 'is-on' : 'is-off' };
    });
    const activeItems = bag.filter((x) => x.cls === 'is-on');
    if (s.prize && s.prize.done) bag.push({ name: 'Power Bank Anker', img: this.spr('powerbank'), fx: 'LEGENDARY · hadiah asli, klaim langsung', stars: '✦', cls: 'is-on is-legend' });
    const rar = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'];
    const pz = s.prize || { picked: -1, done: false };
    const pzPick = D.prizes[pz.picked] || D.prizes[0];
    const prizeCards = D.prizes.map((p, i) => ({ name: p[0], cls: 'pz-h' + (i % 6) + (pz.done ? ' is-claimed' : '') + (pz.picked === i ? ' is-picked' : ''), tap: () => this.pickPrize(i), stamp: pz.done, label: pz.done ? p[0] + ', tidak tersedia' : 'Pilih ' + p[0] }));
    // mini games
    const gm = D.games[view];
    const g = s.g;
    let mg = { title: '', clock: '', tod: '', sub: '', text: '', rules: [], img: '', itemName: '', itemImg: '', itemFx: '', rating: '', summary: '', stars: '' };
    let rush = null, mem = null, bugs = null, food = null;
    if (gm) {
      const it = D.items[gm.item]; const res = s.games[view]; const lvl = res ? (s.items[gm.item] || res.rating) : 0;
      mg = { title: gm.title, clock: gm.clock, tod: gm.tod, sub: gm.sub, text: gm.text, rules: gm.rules.map((t) => ({ t })), img: this.spr(gm.icon),
        itemName: it.name, itemImg: this.spr(it.icon), itemFx: lvl ? it.fx[lvl] : 'Makin bagus skormu, makin besar bonusnya.',
        rating: res ? gm.ratings[res.rating] : '', summary: res ? res.summary : '', stars: res ? '★★★'.slice(0, res.rating) + '☆☆☆'.slice(0, 3 - res.rating) : '',
        improved: res && res.best > res.rating ? 'Hadiah tetap memakai skor terbaikmu.' : '' };
      if (g && view === 'rush') {
        const T = D.rushTasks;
        const m = Math.round(g.min);
        rush = { clock: this.clockText(m), clockCls: m > 450 ? 'is-late' : m > 435 ? 'is-warn' : '',
          list: T.map((t, i) => ({ name: t.name, img: this.spr(t.icon), cls: i < g.step ? 'is-done' : i === g.step ? 'is-next' : '' })),
          tasks: g.order.map((k) => ({ name: T[k].name, img: this.spr(T[k].icon), cls: k < g.step ? 'is-done' : '', off: k < g.step || !!g.tempt, tap: () => this.rushTask(k) })),
          tempt: !!g.tempt, temptText: g.tempt ? g.tempt.t : '', yesLabel: g.tempt ? g.tempt.yes : '', temptImg: g.tempt ? this.spr(g.tempt.icon) : '', temptKey: 'tp' + g.temptKey,
          late: Math.max(0, m - 450) };
      }
      if (g && view === 'memory') {
        mem = { moves: g.moves, pairs: g.pairs, cards: g.cards.map((c, i) => ({ img: this.spr(c.icon), name: c.name, cls: (c.open || c.done ? 'is-open' : '') + (c.done ? ' is-done' : ''),
          label: c.open || c.done ? c.name : 'Kartu tertutup ' + (i + 1), tap: () => this.memFlip(i) })) };
      }
      if (g && view === 'bugs') {
        bugs = { score: g.score, sec: Math.ceil(Math.max(0, g.left) / 1000), pct: Math.max(0, g.left / 250),
          holes: g.holes.map((h, i) => ({ show: !!h.type, img: h.type === 'notif' ? this.spr('controller') : this.spr('bug'), cls: 'h-' + (h.type || 'empty'), k: 'k' + h.k + h.type,
            label: h.type === 'bug' ? 'Bug! Tap untuk membasmi' : h.type === 'notif' ? 'Notifikasi push rank, jangan di-tap' : 'Lubang server ' + (i + 1), tap: () => this.bugHit(i), notif: h.type === 'notif' })) };
      }
      if (g && view === 'food') {
        food = { score: g.score, sec: Math.ceil(Math.max(0, g.left) / 1000), pct: Math.max(0, g.left / 250), x: g.x.toFixed(1),
          items: g.items.map((f) => ({ img: this.spr(f.kind), x: f.x, y: f.y.toFixed(1), cls: f.kind === 'rokok' ? 'is-bad' : '' })),
          pop: !!g.pop, popText: g.pop ? g.pop.t : '', popCls: g.pop && g.pop.bad ? 'is-bad' : '', popKey: 'p' + (g.pop ? g.pop.k : 0) };
      }
    }
    const nextStage = D.stages[si + 1] ? D.stages[si + 1].id : 'letter';
    return {
      view, viewCls: 'view-' + view, motion: this.reduced ? 'reduced' : 'full',
      tod, todCls: 'tod-' + tod, clouds: this._clouds, bag, activeItems, hasItems: activeItems.length > 0,
      isGame: !!gm, isRush: view === 'rush', isMemory: view === 'memory', isBugs: view === 'bugs', isFood: view === 'food',
      mg, mgStory: !!gm && s.mgPhase === 'story', mgPlay: !!gm && s.mgPhase === 'play' && !!g, mgDone: !!gm && s.mgPhase === 'done',
      mgMsg: s.mgMsg, mgMsgOn: !!s.mgMsg, mgMsgKey: 'm' + s.mgMsgKey,
      rush: rush || { clock: '', clockCls: '', list: [], tasks: [], tempt: false, temptText: '', yesLabel: '', temptImg: '', temptKey: '', late: 0 },
      mem: mem || { moves: 0, pairs: 0, cards: [] },
      bugs: bugs || { score: 0, sec: 0, pct: 0, holes: [] },
      food: food || { score: 0, sec: 0, pct: 0, x: 50, items: [], pop: false, popText: '', popCls: '', popKey: '' },
      rider: this.spr('rider'), cloudImg: this.spr('cloud'),
      certGames: [['MORNING RUSH', 'rush'], ['KARTU MEMORI', 'memory'], ['WHACK-A-BUG', 'bugs'], ['TANGKAP JAJANAN', 'food']].map((p) => ({ k: p[0], v: s.games[p[1]] ? s.games[p[1]].summary : 'Belum dimainkan' })), gameTimeLabel: gm ? gm.clock + ' · ' + gm.tod : '',
      startGame: () => this.startGame(), replayGame: () => this.replayGame(), toNext: () => this.goTo(nextStage),
      rushNo: () => this.rushTempt(false), rushYes: () => this.rushTempt(true),
      foodPoint: (e) => this.foodPoint(e), foodLeft: () => this.foodMove(-12), foodRight: () => this.foodMove(12),
      isPrize: view === 'prize', pzPick: s.prizePhase === 'pick', pzProc: s.prizePhase === 'process', pzReveal: s.prizePhase === 'reveal', pzDone: pz.done, pzFresh: !pz.done,
      prizeCards, pzName: pzPick[0], pzErr: pzPick[1], pzS1: s.procStep >= 1, pzS2: s.procStep >= 2, pzS3: s.procStep >= 3,
      rarName: rar[s.rarity], rarCls: 'rar-' + s.rarity, rarKey: 'r' + s.rarity, pbImg: this.spr('powerbank'), giftImg: this.spr('gift'),
      toPrize: () => this.goTo('prize'), prizeGrid: () => this.prizeGrid(), prizeReveal: () => this.prizeReveal(),
      isIntro: view === 'intro', isQuiz: view === 'quiz', isBattle: view === 'battle', isProph: view === 'prophecy', isAward: view === 'award', isLetter: view === 'letter',
      stageNum: stage.num, stageName: stage.name, todName: { pagi: 'PAGI', siang: 'SIANG', sore: 'SORE', malam: 'MALAM' }[tod], doneCount, segs,
      sound: s.sound, soundOff: !s.sound, soundLabel: s.sound ? 'Suara dan musik nyala. Tap untuk mute' : 'Suara mati. Tap untuk menyalakan',
      achCount, achList, badges, hasBadges: badges.length > 0,
      spr: { portrait: this.spr('portrait'), hero: this.spr('hero'), boss: this.spr('boss'), crystal: this.spr('crystal'), trophy: this.spr('trophy'), envelope: this.spr('envelope'), satay: this.spr('satay'), duck: this.spr('duck'), heart: this.spr('heart'), star: this.spr('star'), terminal: this.spr('terminal') },
      avatarSrc, hasPhoto, noPhoto: !hasPhoto,
      attrs, attrNote,
      quizAsking: !s.quizType, quizDone: !!s.quizType, qNum: qIdx + 1, q: { text: q.text }, qOpts, qDots, qKey: 'q' + qIdx, quizLocked: s.lock, canBack: qIdx > 0 && !s.quizType,
      type: type ? { title: type.title, desc: type.desc, rec: type.rec, img: this.spr(type.icon) } : { title: '', desc: '', rec: '', img: '' }, scoreBars,
      b: { php: b.php, maxHp: bMax, bhp: b.bhp, pPct: Math.round(b.php / bMax * 100), bPct: b.bhp, pCls: b.php <= 30 ? 'is-low' : '', bCls: b.bhp <= 30 ? 'is-low' : '' },
      skills, turnText, turnCls: 'tf-' + b.phase, battleLog: b.log.map((l, i) => ({ t: l.t, k: 'l' + l.id, cls: i === b.log.length - 1 ? 'is-new' : '' })),
      heroAnimCls: s.heroAnim, bossAnimCls: s.bossAnim, heroKey: 'h' + s.animKey, bossKey: 'b' + s.animKey, avatarKey: 'a' + s.animKey,
      fxShow: !!s.fx && view === 'battle', fx: s.fx || { on: '', t: '', kind: '' }, fxKey: 'fx' + s.animKey, arenaKey: 'ar' + s.shake, arenaCls: s.shake > 0 && s.heroAnim === 'hurt' ? 'is-shake' : '',
      victory: b.won && s.victoryShow, lost: b.phase === 'lost', bossDown: b.won,
      cats, revCount, hasCard: !!card, noCard: !card, card: card || { cat: '', text: '', img: '' }, cardKey: 'c' + s.cardKey, spinning: s.spinning, spinCls: s.spinning ? 'is-spinning' : '',
      machineStatus: s.spinning ? 'Membaca bintang-bintang…' : (revCount >= 6 ? 'Keenam kategori sudah terbuka. Ramal lagi kalau masih penasaran.' : (revCount ? 'Ramal lagi untuk membuka kategori lainnya.' : 'Masukkan rasa penasaran. Tekan tombolnya.')),
      revealLabel: s.spinning ? 'MEMBACA BINTANG…' : (s.proph.count ? 'RAMAL LAGI' : 'RAMAL MASA DEPANKU'),
      prophDone: s.done[7],
      certType: this.typeShort(), certBattle, certBusy: s.certBusy, certDone: s.certDone, certUrl: s.certUrl || '', xp: s.xp, certLabel: s.certBusy ? 'MEMBUAT…' : (s.certDone ? 'UNDUH LAGI' : 'UNDUH SERTIFIKAT ULANG TAHUNMU'),
      letterIntro: !s.letterOpen, letterOpen: s.letterOpen, lines,
      stars: this._stars, bits: this._bits, confettiOn: s.confetti > 0 && !!s.banner, confKey: 'cf' + s.confetti,
      bannerK: view === 'prize' ? 'HADIAH UTAMA' : 'MISI SELESAI',
      banner: s.banner || '', bannerOn: !!s.banner, bannerKey: 'bn' + s.bannerKey,
      toastOn: !!toastA, toast: toastA ? { title: toastA.title, img: this.spr(toastA.icon) } : { title: '', img: '' }, toastKey: 't' + s.toastKey,
      wipeKey: 'w' + s.wipe, wipeOn: s.wipe > 0,
      modalOn: !!s.modal, mAch: s.modal === 'ach', mRestart: s.modal === 'restart', mDev: s.modal === 'dev', mBath: s.modal === 'bath', mFood: s.modal === 'food', mMot: s.modal === 'mot', mCert: s.modal === 'cert', mPhoto: s.modal === 'photo',
      mot: D.motivation.map((t, i) => ({ t, cls: i <= s.motStep ? 'is-on' : 'is-off', done: i < s.motStep || (i === 3 && s.motStep >= 3) })), motPct: Math.round((s.motStep + 1) / 4 * 100), motDone: s.motStep >= 3, motBusy: s.motStep < 3,
      photoPreview: s.photoPreview || s.avatar || this.spr('portrait'), photoLoaded: !!s.photoSrc, photoEmpty: !s.photoSrc, photoErr: s.photoErr, hasPhotoErr: !!s.photoErr,
      cropZ: crop.z, cropX: crop.x, cropY: crop.y, cropN: crop.n, cropZTxt: Number(crop.z).toFixed(2) + '×', cropNTxt: crop.n + ' px',
      // handlers
      openAch: () => this.openModal('ach'), askRestart: () => this.openModal('restart'), closeModal: () => this.closeModal(),
      doRestart: () => { this.sfx('click'); this.restart(); }, toggleSound: () => this.toggleSound(),
      startQuest: () => this.startQuest(), avatarTap: () => this.avatarTap(), foodEgg: () => this.foodEgg(), bathEgg: () => this.bathEgg(),
      openPhoto: () => this.openModal('photo'), onPhotoFile: (e) => this.onPhotoFile(e), savePhoto: () => this.savePhoto(), clearPhoto: () => this.clearPhoto(),
      onZoom: (e) => this.setCrop('z', e.target.value), onCropX: (e) => this.setCrop('x', e.target.value), onCropY: (e) => this.setCrop('y', e.target.value), onCropN: (e) => this.setCrop('n', e.target.value),
      quizBack: () => this.quizBack(), retake: () => this.retakeQuiz(), toBattle: () => this.goTo('rush'),
      respawn: () => this.respawn(), toProphecy: () => this.goTo('prophecy'), reveal: () => this.reveal(), toAward: () => this.goTo('award'),
      downloadCert: () => this.downloadCert(), toLetter: () => this.goTo('letter'), openLetter: () => this.openLetter(), toCert: () => this.goTo('award'),
      runMotivation: () => this.runMotivation(), noop: (e) => { if (e && e.stopPropagation) e.stopPropagation(); }
    };
  }
}
