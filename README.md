# 🛒 POS App - Modern Point of Sale System

Aplikasi Point of Sale (POS) modern yang dibangun dengan Next.js 15, TypeScript, Prisma, dan SQLite. Aplikasi ini dilengkapi dengan fitur manajemen produk, transaksi penjualan, backup otomatis, dan sistem role-based authentication.

## ✨ Fitur Utama

### 🏪 Point of Sale

- Interface kasir yang user-friendly
- Pencarian produk real-time
- Keranjang belanja dengan update quantity
- Multiple metode pembayaran (Tunai, Debit, Kredit, QRIS, Transfer)
- Perhitungan diskon dan pajak otomatis
- Kalkulasi kembalian
- Validasi stok otomatis

### 📦 Manajemen Produk

- CRUD produk lengkap
- Upload gambar produk
- Kategorisasi produk
- Barcode support
- Status aktif/nonaktif produk
- Filter dan pencarian
- Monitoring stok real-time

### 📊 Laporan Penjualan

- Riwayat transaksi lengkap
- Filter berdasarkan tanggal
- Detail transaksi per item
- Ringkasan penjualan (total transaksi, revenue, rata-rata)
- Breakdown metode pembayaran
- Export data (CSV/PDF) - Coming Soon

### 💾 Backup & Restore

- Backup manual
- Auto backup (daily, weekly, monthly)
- Download backup file
- Restore dari backup
- Monitoring status backup
- Retention policy otomatis

### 👥 User Management

- Role-based access (Admin & Kasir)
- Authentication dengan NextAuth.js
- Secure password hashing
- Session management

## 🚀 Teknologi

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: SQLite dengan Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Validation**: Zod
- **Date**: date-fns
- **Export**: jsPDF, PapaParse

## 📋 Prasyarat

- Node.js 18+ atau yang lebih baru
- npm atau yarn package manager

## 🔧 Instalasi

### 1. Clone atau Download Project

```bash
cd pos-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

Copy file `.env.example` ke `.env`:

```bash
copy .env.example .env
```

File `.env` sudah dikonfigurasi untuk SQLite local database.

### 4. Setup Database

Generate Prisma Client:

```bash
npm run db:generate
```

Push schema ke database:

```bash
npm run db:push
```

### 5. Seed Data

Isi database dengan data awal (users & products):

```bash
npm run db:seed
```

**Demo Credentials:**

- Admin: `admin@pos.com` / `admin123`
- Kasir: `kasir@pos.com` / `kasir123`

### 6. Jalankan Development Server

```bash
npm run dev
```

Buka browser dan akses: [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

```bash
# Development
npm run dev          # Jalankan dev server

# Production
npm run build        # Build untuk production
npm start            # Jalankan production server

# Database
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema ke database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database

# Backup
npm run backup       # Manual backup
```

## 🗂️ Struktur Folder

```
pos-app/
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts          # Seed data
├── scripts/
│   └── backup.js        # Backup scheduler
├── src/
│   ├── app/
│   │   ├── (dashboard)/  # Protected routes
│   │   │   ├── pos/      # POS page
│   │   │   └── admin/    # Admin pages
│   │   ├── api/          # API routes
│   │   ├── login/        # Login page
│   │   └── layout.tsx
│   ├── components/
│   │   ├── layout/       # Layout components
│   │   └── ui/           # UI components
│   ├── lib/
│   │   ├── prisma.ts     # Prisma client
│   │   ├── auth.ts       # NextAuth config
│   │   ├── utils.ts      # Utility functions
│   │   ├── config.ts     # App config
│   │   └── validations.ts # Zod schemas
│   ├── modules/
│   │   ├── products/     # Product module
│   │   ├── sales/        # Sales module
│   │   └── backup/       # Backup module
│   └── types/           # TypeScript types
└── backups/             # Backup files (auto-generated)
```

## 🎨 Desain & UI

Aplikasi menggunakan color palette biru yang bersih dan profesional:

- **Primary**: Biru (#3b82f6, #2563eb, #1d4ed8)
- **Secondary**: Netral (#64748b, #475569, #334155)
- **Background**: Light gray (#f8fafc, #f1f5f9)

Desain minimalis dengan fokus pada usability dan readability.

## 🔐 Security Features

- Password hashing dengan bcryptjs
- JWT session management
- Role-based access control
- SQL injection protection (Prisma)
- XSS protection
- CSRF protection

## 📱 Responsive Design

Aplikasi fully responsive untuk:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🐛 Troubleshooting

### Database tidak bisa diakses

```bash
npm run db:push
```

### Prisma Client error

```bash
npm run db:generate
```

### Port 3000 sudah digunakan

Edit `package.json` scripts:

```json
"dev": "next dev -p 3001"
```

## 📝 API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/active` - Get active products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PATCH /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `GET /api/products/categories` - Get all categories

### Sales

- `GET /api/sales` - Get all sales
- `GET /api/sales/:id` - Get sale by ID
- `POST /api/sales` - Create sale
- `GET /api/sales/summary` - Get sales summary

### Backup

- `POST /api/backup/manual` - Create manual backup (Admin)
- `GET /api/backup/list` - Get backup list (Admin)
- `GET /api/backup/download` - Download backup (Admin)
- `POST /api/backup/restore` - Restore from backup (Admin)

### Auth

- `POST /api/auth/register` - Register user
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

## 🚧 Roadmap / Future Enhancements

- [ ] Export to CSV/PDF
- [ ] QRIS Payment Integration
- [ ] Multi-store support
- [ ] Inventory management
- [ ] Employee shift management
- [ ] Customer loyalty program
- [ ] Receipt printer integration
- [ ] Analytics dashboard
- [ ] Cloud backup (S3/Google Drive)
- [ ] Mobile app (React Native)

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 👨‍💻 Developer

Built with ❤️ using Next.js and TypeScript

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

---

**Happy Coding! 🎉**
