# Supabase Setup Guide

## Langkah 1: Buat Akun Supabase

1. Buka [supabase.com](https://supabase.com)
2. Klik **Start your project** (gratis)
3. Login dengan GitHub atau email

## Langkah 2: Buat Project Baru

1. Klik **New Project**
2. Isi detail:
   - **Name**: `scaffolding-rental` (atau nama lain)
   - **Database Password**: Buat password yang kuat
   - **Region**: Pilih yang terdekat (Singapore)
3. Klik **Create new project**
4. Tunggu ~2 menit sampai project ready

## Langkah 3: Copy Credentials

1. Di dashboard Supabase, klik **Settings** (gear icon)
2. Klik **API** di sidebar
3. Copy nilai berikut:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## Langkah 4: Setup Environment

1. Buka project folder:
   ```
   /Users/cakbaho/.gemini/antigravity/scratch/scaffolding-rental-app
   ```

2. Buat file `.env.local` dengan isi:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
   ```

## Langkah 5: Jalankan SQL Schema

1. Di dashboard Supabase, klik **SQL Editor**
2. Klik **New Query**
3. Copy seluruh isi file `supabase/schema.sql`
4. Paste di editor
5. Klik **Run** (atau Ctrl+Enter)
6. Tunggu sampai selesai ✅

## Langkah 6: Setup Authentication

1. Klik **Authentication** di sidebar
2. Klik **Providers**
3. Aktifkan **Email** provider
4. Di **Auth Settings**, set:
   - Site URL: `http://localhost:5173`

## Langkah 7: Buat User Pertama

1. Klik **Users** di sidebar Authentication
2. Klik **Add user**
3. Isi email dan password
4. Klik **Create user**

## Langkah 8: Test Aplikasi

```bash
# Restart server
cd /Users/cakbaho/.gemini/antigravity/scratch/scaffolding-rental-app
npm run dev
```

Buka http://localhost:5173 dan login!

---

## Troubleshooting

### Error: Invalid API key
- Pastikan `.env.local` sudah benar
- Restart dev server setelah edit `.env.local`

### Error: Permission denied
- Pastikan RLS policies sudah diterapkan
- Check Authentication sudah enabled

### Data tidak muncul
- Pastikan seed data sudah terinsert
- Check tabel di Table Editor

---

## File Referensi

- Schema SQL: `supabase/schema.sql`
- Env template: `.env.example`
- Supabase client: `src/lib/supabase.js`
