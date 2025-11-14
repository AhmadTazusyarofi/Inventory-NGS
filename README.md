# NGS - Sistem Inventory Barang

Aplikasi web modern untuk manajemen inventory barang dengan fitur lengkap dashboard analytics, stock management, dan reporting.

## 🌟 Fitur Utama

- ✅ **Dashboard Analytics** - Visualisasi stok dengan charts interaktif
- ✅ **CRUD Items** - Manajemen barang lengkap dengan kategori dan supplier
- ✅ **Stock IN/OUT** - Tracking pergerakan stok dengan history lengkap
- ✅ **Reports** - Export laporan ke PDF dan CSV
- ✅ **Activity Log** - Monitoring semua aktivitas sistem
- ✅ **User Profile** - Manajemen profil dan change password
- ✅ **Dark Mode** - Light & dark theme support
- ✅ **Responsive** - 100% mobile-friendly design

## 🛠 Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- Zustand (state management)
- React Router v6 (routing)
- Recharts (data visualization)
- Lucide React (icons)
- Shadcn/ui (UI components)

### Backend (Struktur Ready)
- Node.js + Express.js
- PostgreSQL + Prisma ORM
- JWT Authentication
- Multer (file upload)
- API documentation (OpenAPI 3.0)

## 📦 Installation

### Frontend Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Frontend akan berjalan di `http://localhost:8080`

### Backend Setup (Manual)

Backend belum terimplementasi penuh di Lovable. Untuk menjalankan backend:

1. Buat folder `backend` di root project
2. Setup struktur sesuai dokumentasi di `backend/docs/openapi.yaml`
3. Install dependencies:
```bash
cd backend
npm install express prisma @prisma/client jsonwebtoken bcryptjs multer
```

4. Setup PostgreSQL database dan konfigurasi `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ngs_inventory"
JWT_SECRET="your-secret-key"
PORT=3000
```

5. Run Prisma migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

6. Start backend server:
```bash
npm run dev
```

## 🎯 Default Login

Untuk testing, gunakan kredensial apapun:
- Email: `admin@ngs.com` (atau email apapun)
- Password: `password` (atau password apapun)

**Note**: Ini adalah mock authentication. Untuk production, integrasikan dengan backend API yang sebenarnya.

## 📁 Struktur Project

```
root/
├── src/
│   ├── components/         # Reusable components
│   │   ├── layout/        # Layout components (Sidebar, Header)
│   │   └── ui/            # UI components (Shadcn)
│   ├── layouts/           # Page layouts
│   ├── pages/             # All pages
│   │   ├── auth/          # Login & Register
│   │   ├── dashboard/     # Dashboard
│   │   ├── items/         # Items management
│   │   ├── categories/    # Categories management
│   │   ├── suppliers/     # Suppliers management
│   │   ├── stock/         # Stock IN/OUT
│   │   ├── reports/       # Reports & exports
│   │   ├── activity/      # Activity log
│   │   └── profile/       # User profile
│   ├── routes/            # Route protection
│   ├── store/             # Zustand stores
│   └── hooks/             # Custom hooks
├── backend/               # Backend structure (to be implemented)
│   ├── docs/
│   │   └── openapi.yaml   # Complete API documentation
│   ├── prisma/
│   │   └── schema.prisma  # Database models
│   └── src/
│       └── modules/       # Feature modules
└── README.md
```

## 🔌 API Integration

Frontend sudah disiapkan dengan struktur untuk integrasi API:

1. **Auth API** - `/api/auth/login`, `/api/auth/register`
2. **Items API** - `/api/items` (CRUD)
3. **Categories API** - `/api/categories` (CRUD)
4. **Suppliers API** - `/api/suppliers` (CRUD)
5. **Stock API** - `/api/stock/in`, `/api/stock/out`
6. **Reports API** - `/api/reports/stock`, `/api/reports/movements`
7. **Activity API** - `/api/activity`

Lihat dokumentasi lengkap di `backend/docs/openapi.yaml`

## 🎨 Dark Mode

Toggle dark/light mode tersedia di header. Preferensi tersimpan di localStorage.

```typescript
// Manual toggle via code
import { useThemeStore } from '@/store/themeStore';

const { theme, toggleTheme } = useThemeStore();
toggleTheme(); // Switch theme
```

## 📊 Mock Data

Frontend menggunakan mock data untuk demonstrasi. Data meliputi:
- Items dengan berbagai kategori
- Suppliers
- Stock movements (IN/OUT)
- Activity logs
- Reports

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway/DigitalOcean)
```bash
# Push backend folder ke git
# Setup environment variables
# Deploy ke platform pilihan
```

## 🔐 Security Notes

- Implementasikan validation dengan Zod
- Gunakan HTTPS di production
- Set secure JWT secret
- Enable CORS dengan proper origin
- Sanitize user inputs
- Implement rate limiting

## 📝 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

### Backend (.env)
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=3000
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 💡 Future Enhancements

- [ ] Real-time notifications
- [ ] Barcode scanning
- [ ] Multi-warehouse support
- [ ] Advanced analytics
- [ ] Email notifications
- [ ] Export scheduling
- [ ] Role-based permissions

## 📞 Support

Untuk bantuan atau pertanyaan, silakan buat issue di repository ini.

---

Built with ❤️ using React + TypeScript + TailwindCSS
