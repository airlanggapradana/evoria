# Locketix

## 🏷 Badges
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Express](https://img.shields.io/badge/Express-TypeScript-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Framework-38B2AC)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Components-purple)
![License](https://img.shields.io/badge/License-MIT-green)

> Personal project: platform untuk **membeli tiket acara** dan **membuat event**.

## 🎯 Deskripsi
Locketix adalah aplikasi berbasis web/mobile yang memungkinkan dua peran utama:
- **Event Organizer** → membuat dan mengelola event (detail event, tiket, harga, kuota)
- **Pembeli Tiket** → melihat event yang tersedia, memilih tiket, melakukan pembayaran, menerima tiket digital

Tujuan utama platform ini adalah menyediakan solusi sederhana dan fleksibel untuk transaksi tiket acara, sebagai proyek pembelajaran dan eksplorasi teknologi.

---

## ✨ Fitur Utama
- Membuat event dengan detail lengkap (judul, deskripsi, lokasi, tanggal, gambar)
- Manajemen tipe tiket: Regular, VIP, kuota, harga, dan periode penjualan
- Halaman publik event untuk pembelian tiket
- Proses checkout dan pembayaran
- Dashboard Organizer untuk memantau penjualan & peserta
- Tiket digital (misalnya QR/Barcode)
- Autentikasi pengguna (Organizer & User)
- Desain responsif untuk desktop & mobile

---

## 🧰 Teknologi
| Layer | Tech |
|--------|--------|
| Frontend | Next.js 15, TailwindCSS, shadcn/ui |
| Backend | Express + TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT |
| Payment | Midtrans |
| Deployment | Vercel |

---

## 🚀 Instalasi & Setup
1. Clone repositori:
```bash
git clone https://github.com/airlanggapradana/locketix.git
cd locketix
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables (`.env`):
```env
DATABASE_URL=
JWT_SECRET=
PAYMENT_GATEWAY_KEY=
```

4. Jalankan aplikasi:
```bash
npm run dev
```

5. (Opsional) Seed data:
```bash
npm run seed
```

---

## 🧪 Penggunaan
- **Organizer**: login → dashboard → buat event → atur tiket → publish → tunggu approval dari admin
- **Pembeli**: pilih event → checkout → pembayaran → tiket digital tersedia

---

## 🛠 Kontribusi
Proyek ini dikembangkan secara personal. Jika ingin membantu pengembangan:
1. Fork repositori
2. Buat branch `feature/<nama-feature>`
3. Commit perubahan dan buat pull request
4. Sertakan deskripsi perubahan dan alasan teknis

---

## 🗺 Roadmap / Fitur Selanjutnya
- Sistem promo / voucher
- Multi bahasa & multi mata uang
- Aplikasi mobile (React Native)
- Integrasi otomatis laporan penjualan

---

## 📜 Lisensi
```
MIT License © 2025 Rangga
