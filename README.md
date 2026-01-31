# NexKirana Accounting System - Frontend

🔒 **Internal Use Only** - Enterprise Financial Management Frontend

## Overview

This is the frontend application for the NexKirana Accounting System, a comprehensive financial management platform designed for internal use. Built with React, Vite, and modern web technologies, it provides an intuitive interface for managing companies, ledgers, vouchers, and financial reports.

## 🚀 Features

### User Interface
- **Modern React 18** with hooks and context
- **Responsive Design** - Works on all devices
- **Professional NexKirana Branding** throughout
- **Clean, Intuitive Interface** inspired by TallyPrime
- **Real-time Updates** with optimistic UI

### Authentication & Security
- **JWT-based Authentication** with automatic token management
- **Role-based Navigation** - Different views per user role
- **Session Management** with timeout warnings
- **Secure API Communication** with automatic retry
- **Protected Routes** - Authentication required

### Accounting Features
- **Multi-Company Dashboard** - Switch between companies
- **Comprehensive Ledger Management** - Create and manage accounts
- **Voucher Entry System** - All transaction types supported
- **Financial Reports** - Interactive reports and statements
- **User Management** - Admin interface for user administration

### User Experience
- **Fast Loading** with code splitting
- **Offline-Ready** with service worker support
- **Error Handling** with user-friendly messages
- **Loading States** for better UX
- **Form Validation** with real-time feedback

## 🛠 Technology Stack

- **React 18** - UI library with modern hooks
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Modern icon library
- **React Hook Form** - Form handling
- **React Hot Toast** - Toast notifications
- **Custom CSS** - Clean, maintainable styling

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see backend repository)

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nexkirana-accounting-frontend.git
   cd nexkirana-accounting-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your backend API URL
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open http://localhost:5173
   - Login with admin credentials

### Production Build

```bash
npm run build
npm run preview
```

## 🔧 Environment Variables

### Development (.env.local)
```env
VITE_API_URL=http://localhost:3000/api
```

### Production (.env.production)
```env
VITE_API_URL=https://your-backend-api.vercel.app/api
```

## 📊 Application Structure

### Pages
- **Login** - Secure authentication with NexKirana branding
- **Dashboard** - Overview with company stats and quick actions
- **Companies** - Multi-company management interface
- **Ledgers** - Chart of accounts management
- **Vouchers** - Transaction entry and management
- **Reports** - Financial reports and statements
- **User Management** - Admin interface for user administration

### Components
- **Navbar** - Navigation with role-based menu items
- **AuthForm** - Reusable authentication components
- **CompanyForm** - Company creation and editing
- **LedgerForm** - Ledger creation and management
- **VoucherForm** - Transaction entry interface
- **LedgerStatement** - Detailed ledger reports

## 🔐 User Roles & Interface

### Administrator
- Full navigation access
- User management interface
- Company creation/deletion
- All financial operations
- System administration tools

### Manager
- Company management
- User creation (limited)
- All financial operations
- Comprehensive reports

### Accountant
- Financial data entry
- Report generation
- Ledger management
- Voucher operations

### User
- Basic data entry
- Limited report access
- Read-only dashboard

## 🎨 Styling & Theming

### Design System
- **NexKirana Branding** - Consistent brand colors and typography
- **Professional Layout** - Clean, business-focused design
- **Responsive Grid** - Adapts to all screen sizes
- **Custom CSS** - No complex framework dependencies
- **Accessibility** - WCAG compliant interface

### Color Scheme
- **Primary**: #1e40af (NexKirana Blue)
- **Secondary**: #6b7280 (Professional Gray)
- **Success**: #16a34a (Green)
- **Warning**: #f59e0b (Amber)
- **Error**: #dc2626 (Red)

## 🚀 Deployment

### Vercel Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Set environment variables**
   - Configure VITE_API_URL in Vercel dashboard

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Serve static files**
   - Upload `dist/` folder to your web server
   - Configure server to serve `index.html` for all routes

## 📁 Project Structure

```
client/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── context/         # React context providers
│   ├── utils/           # Utility functions
│   ├── simple.css       # Custom styling
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── public/              # Static assets
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies
```

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🔒 Security Features

- **JWT Token Management** - Automatic token refresh and validation
- **Protected Routes** - Authentication required for all pages
- **Input Validation** - Client-side validation with server verification
- **XSS Protection** - Sanitized user inputs
- **CSRF Protection** - Secure API communication
- **Session Timeout** - Automatic logout on token expiry

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Features
- **Mobile-first** design approach
- **Touch-friendly** interface elements
- **Adaptive layouts** for all screen sizes
- **Optimized performance** on mobile devices

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check VITE_API_URL environment variable
   - Verify backend is running and accessible
   - Check CORS configuration

2. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token expiry
   - Verify backend authentication endpoints

3. **Build Failures**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Verify all dependencies are installed

## 📞 Support

For technical support:
- Check browser console for errors
- Verify API connectivity
- Review network requests in dev tools
- Check environment variables

## 📄 License

© 2024 NexKirana. All rights reserved.

This software is proprietary and confidential. Intended for internal use only.

---

**🚀 NexKirana Accounting System Frontend - Production Ready**