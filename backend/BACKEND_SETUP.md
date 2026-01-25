# Backend Implementation Guide

Dokumen ini menjelaskan cara implementasi backend untuk NGS Inventory System.

## 🎯 Overview

Backend menggunakan:
- **Node.js** + **Express.js** untuk REST API
- **PostgreSQL** sebagai database
- **Prisma ORM** untuk database management
- **JWT** untuk authentication
- **Multer** untuk file upload
- **Zod/Express-validator** untuk validation

## 📁 Recommended Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── env.ts                 # Environment configuration
│   │   └── db.ts                  # Database connection
│   ├── middleware/
│   │   ├── authMiddleware.ts      # JWT verification
│   │   ├── errorHandler.ts        # Global error handler
│   │   └── uploadMiddleware.ts    # Multer config
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.validation.ts
│   │   ├── items/
│   │   │   ├── items.controller.ts
│   │   │   ├── items.service.ts
│   │   │   ├── items.routes.ts
│   │   │   └── items.validation.ts
│   │   ├── categories/
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories.service.ts
│   │   │   ├── categories.routes.ts
│   │   │   └── categories.validation.ts
│   │   ├── suppliers/
│   │   │   ├── suppliers.controller.ts
│   │   │   ├── suppliers.service.ts
│   │   │   ├── suppliers.routes.ts
│   │   │   └── suppliers.validation.ts
│   │   ├── stock/
│   │   │   ├── stock.controller.ts
│   │   │   ├── stock.service.ts
│   │   │   ├── stock.routes.ts
│   │   │   └── stock.validation.ts
│   │   ├── reports/
│   │   │   ├── reports.controller.ts
│   │   │   ├── reports.service.ts
│   │   │   └── reports.routes.ts
│   │   ├── activity/
│   │   │   ├── activity.controller.ts
│   │   │   ├── activity.service.ts
│   │   │   └── activity.routes.ts
│   │   └── user/
│   │       ├── user.controller.ts
│   │       ├── user.service.ts
│   │       ├── user.routes.ts
│   │       └── user.validation.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── logger.ts
│   │   └── pdf.ts
│   ├── app.ts
│   └── server.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── uploads/                        # Upload directory
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
``` 

## 🚀 Setup Instructions

### 1. Initialize Project

```bash
mkdir backend
cd backend
npm init -y
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install express cors dotenv
npm install bcryptjs jsonwebtoken
npm install @prisma/client
npm install multer
npm install zod
npm install pdfkit csv-writer

# Dev dependencies
npm install -D typescript @types/node @types/express
npm install -D @types/bcryptjs @types/jsonwebtoken
npm install -D @types/multer @types/cors
npm install -D prisma ts-node nodemon
npm install -D tsx
```

### 3. Setup TypeScript

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 4. Setup Prisma

```bash
npx prisma init
```

Copy schema dari `backend-docs/prisma-schema.prisma` ke `prisma/schema.prisma`.

### 5. Configure Environment

Create `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ngs_inventory"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"

# CORS
ALLOWED_ORIGINS="http://localhost:8080,http://localhost:5173"

# Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR="./uploads"
```

### 6. Run Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 7. Add Scripts to package.json

```json
{
  "scripts": {
    "dev": "nodemon --exec tsx src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}
```

## 🔐 Authentication Implementation

### JWT Helper (`src/utils/jwt.ts`)

```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): { userId: string } => {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
};
```

### Auth Middleware (`src/middleware/authMiddleware.ts`)

```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};
```

## 📤 File Upload Implementation

### Upload Middleware (`src/middleware/uploadMiddleware.ts`)

```typescript
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = process.env.UPLOAD_DIR || './uploads';

// Create upload directory if not exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, and PNG files are allowed'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB default
  }
});
```

## 📝 Example: Items Module

### Items Service (`src/modules/items/items.service.ts`)

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ItemsService {
  async getAllItems(filters: any) {
    const { search, category, supplier, sort, page = 1, limit = 10 } = filters;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (category) {
      where.categoryId = category;
    }
    
    if (supplier) {
      where.supplierId = supplier;
    }

    const skip = (page - 1) * limit;
    
    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        include: {
          category: true,
          supplier: true
        },
        skip,
        take: limit,
        orderBy: this.getSortOrder(sort)
      }),
      prisma.item.count({ where })
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  private getSortOrder(sort?: string) {
    const sortMap: any = {
      'name_asc': { name: 'asc' },
      'name_desc': { name: 'desc' },
      'createdAt_asc': { createdAt: 'asc' },
      'createdAt_desc': { createdAt: 'desc' }
    };
    
    return sortMap[sort || 'createdAt_desc'] || { createdAt: 'desc' };
  }

  async createItem(data: any, imagePath?: string) {
    return await prisma.item.create({
      data: {
        ...data,
        image: imagePath,
        stock: parseInt(data.stock),
        minStock: parseInt(data.minStock)
      },
      include: {
        category: true,
        supplier: true
      }
    });
  }

  // ... other methods
}
```

### Items Controller (`src/modules/items/items.controller.ts`)

```typescript
import { Request, Response } from 'express';
import { ItemsService } from './items.service';
import { ActivityService } from '../activity/activity.service';

const itemsService = new ItemsService();
const activityService = new ActivityService();

export class ItemsController {
  async getAll(req: Request, res: Response) {
    try {
      const result = await itemsService.getAllItems(req.query);
      
      res.json({
        success: true,
        data: result.items,
        meta: result.meta
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch items',
        error: error.message
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const imagePath = req.file?.filename;
      const item = await itemsService.createItem(req.body, imagePath);
      
      // Log activity
      await activityService.log({
        userId: req.userId!,
        action: 'CREATE_ITEM',
        description: `Created new item: ${item.name}`
      });

      res.status(201).json({
        success: true,
        message: 'Item created successfully',
        data: item
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Failed to create item',
        error: error.message
      });
    }
  }

  // ... other methods
}
```

## 📊 PDF & CSV Generation

### PDF Service Example

```typescript
import PDFDocument from 'pdfkit';
import fs from 'fs';

export const generateStockPDF = async (items: any[]) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const filename = `stock-report-${Date.now()}.pdf`;
    const stream = fs.createWriteStream(`./temp/${filename}`);
    
    doc.pipe(stream);
    
    doc.fontSize(18).text('Stock Report', { align: 'center' });
    doc.moveDown();
    
    items.forEach(item => {
      doc.fontSize(12).text(`${item.code} - ${item.name}: ${item.stock} ${item.unit}`);
    });
    
    doc.end();
    
    stream.on('finish', () => resolve(filename));
    stream.on('error', reject);
  });
};
```

## 🧪 Testing

Gunakan tools seperti:
- **Postman** atau **Insomnia** untuk manual testing
- **Jest** untuk unit testing
- **Supertest** untuk integration testing

## 🔒 Security Best Practices

1. **Password Hashing**: Gunakan bcryptjs dengan salt rounds minimal 10
2. **JWT Secret**: Gunakan string yang kuat dan aman
3. **Input Validation**: Validate semua input dengan Zod
4. **Rate Limiting**: Implementasi rate limiting untuk prevent abuse
5. **CORS**: Configure CORS dengan allowed origins
6. **File Upload**: Validate file type dan size
7. **SQL Injection**: Prisma ORM sudah protect dari SQL injection
8. **Environment Variables**: Jangan commit `.env` ke git

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JWT Best Practices](https://jwt.io/introduction)
- OpenAPI Spec: `backend-docs/openapi.yaml`

## 🎯 Next Steps

1. Implement auth module (login, register)
2. Implement items CRUD dengan file upload
3. Implement stock movements (IN/OUT)
4. Implement activity logging
5. Implement PDF/CSV export
6. Add unit tests
7. Deploy to production

---

**Note**: Ini adalah guide lengkap untuk backend implementation. Frontend sudah siap dan menggunakan mock data, tinggal replace dengan API calls yang sebenarnya.
