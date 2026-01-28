# KARYA JAYA TEHNIK - Sistem Manajemen Persewaan Scaffolding

Aplikasi web untuk mengelola bisnis persewaan scaffolding, dibangun dengan React + Vite + TailwindCSS.

## 🚀 Fitur

### Core Features
- **Dashboard** - Overview statistik bisnis dengan chart interaktif
- **Rental Order** - Manajemen pesanan sewa lengkap
- **Pricelist** - Daftar harga barang scaffolding
- **Surat Jalan Kirim** - Dokumen pengiriman barang
- **Surat Jalan Retur** - Dokumen pengembalian barang
- **Invoice** - Pembuatan tagihan dengan preview PPN
- **Pembayaran** - Pencatatan pembayaran customer
- **Stok Barang** - Tracking inventaris real-time
- **Laporan & Arsip** - Dashboard analytics dengan chart
- **Pengaturan** - Konfigurasi perusahaan dan user

### Technical Features
- 📊 Chart.js untuk visualisasi data
- 🖨️ Print template untuk Invoice & Surat Jalan
- 🔐 Authentication ready (Supabase)
- 📱 Responsive design
- 🔔 Toast notifications

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL + Auth)
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📦 Installation

```bash
# Clone repository
cd scaffolding-rental-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update .env.local with your Supabase credentials
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Run development server
npm run dev
```

## 🗄️ Supabase Setup

1. Buat akun di [supabase.com](https://supabase.com)
2. Buat project baru
3. Copy URL dan Anon Key ke `.env.local`
4. Jalankan SQL schema di Supabase SQL Editor (lihat dokumentasi Implementation Plan)

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/       # Sidebar, TopBar, Layout
│   ├── ui/           # Reusable UI components
│   └── print/        # Print templates
├── pages/            # All page components
├── hooks/            # Custom React hooks
├── lib/              # Utilities & Supabase client
└── context/          # React contexts
```

## 🖥️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📄 License

MIT License - KARYA JAYA TEHNIK

---

Built with ❤️ using React + Vite + TailwindCSS
