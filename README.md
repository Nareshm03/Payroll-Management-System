# PayrollPulse

**Transform Your Payroll Experience with Effortless Precision**

Introducing the Future of Payroll Management – Where Complexity Meets Simplicity. Our intuitive dashboard UI delivers enterprise-grade payroll automation with the elegance of modern SaaS design. Streamline payroll processing, gain real-time insights, and empower your team with a system so seamless, it feels like magic.

Built for finance teams who demand both power and polish. Welcome to payroll perfected.

---

A comprehensive full-stack web application for managing employee payroll, salary slips, and expense requests with role-based access control.

## 🚀 Features

### Admin Features
- **Dashboard Overview**: Real-time statistics on employees, expenses, and salary slips
- **Salary Slip Management**:
  - Create salary slips with detailed components (basic, allowances, bonuses, deductions, tax)
  - Edit existing salary slips with version tracking
  - Automatic net salary calculation
  - Month-wise organization
- **Expense Management**:
  - Review all employee expense requests
  - Approve/reject expenses with one click
  - Track expense categories and amounts
  - View expense history with timestamps
- **Employee Management**: View all employees and their details

### Employee Features
- **Personal Dashboard**: 
  - Current month salary summary
  - Expense statistics with visual charts
  - Quick access to all personal data
- **Expense Submission**:
  - Submit expenses with category selection
  - Date picker for expense date
  - Optional receipt URL attachment
  - Track approval status in real-time
- **Salary History**: 
  - View all salary slips in tabular format
  - Detailed breakdown of salary components
  - Historical salary trends

## ✨ Why PayrollPulse?

- **Effortless Automation**: Say goodbye to manual calculations and spreadsheet chaos
- **Real-Time Intelligence**: Make data-driven decisions with live analytics and insights
- **Enterprise Security**: Bank-grade encryption and role-based access control
- **Beautiful Design**: Modern, intuitive interface that your team will love
- **Lightning Fast**: Built on cutting-edge technology for instant performance
- **Scalable Architecture**: Grows with your business from startup to enterprise

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database (easily switchable to PostgreSQL)
- **JWT** - Secure authentication
- **Pydantic** - Data validation
- **Bcrypt** - Password hashing

### Frontend
- **React 18** - UI library
- **Material-UI (MUI)** - Component library
- **Recharts** - Data visualization
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **TailwindCSS** - Utility-first CSS

## 🎯 Perfect For

- **Startups**: Get professional payroll management from day one
- **SMBs**: Scale your finance operations without the complexity
- **HR Teams**: Empower employees with self-service capabilities
- **Finance Leaders**: Gain visibility and control over payroll operations

## 📁 Project Structure

```
Payroll Management System/
├── backend/
│   ├── app/
│   │   ├── models/          # Database models
│   │   │   ├── user.py
│   │   │   ├── salary_slip.py
│   │   │   └── expense.py
│   │   ├── schemas/         # Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── salary_slip.py
│   │   │   └── expense.py
│   │   ├── routes/          # API endpoints
│   │   │   ├── auth.py
│   │   │   ├── admin.py
│   │   │   └── employee.py
│   │   ├── utils/           # Utilities
│   │   │   ├── auth.py
│   │   │   └── database.py
│   │   ├── config.py        # Configuration
│   │   └── main.py          # FastAPI app
│   ├── seed_data.py         # Database seeding
│   ├── requirements.txt
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.js
    │   │   │   └── CreateSalarySlip.js
    │   │   ├── employee/
    │   │   │   ├── EmployeeDashboard.js
    │   │   │   └── ExpenseForm.js
    │   │   └── auth/
    │   │       ├── Login.js
    │   │       └── Signup.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── services/
    │   │   └── api.js
    │   ├── pages/
    │   │   └── Dashboard.js
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── tailwind.config.js
```

## 🚀 Quick Setup

### Automated Setup (Recommended)

**Windows:**
```bash
install.bat
```

**Unix/Linux/Mac:**
```bash
chmod +x install.sh
./install.sh
```

### Quick Start

**Windows:**
```bash
start.bat
```

**Manual Setup:**

### Prerequisites
- Python 3.10+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Create virtual environment** (recommended):
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Unix/MacOS
source venv/bin/activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Configure environment**:
   - Edit `.env` file with your settings
   - Change `SECRET_KEY` for production

5. **Initialize database and seed data**:
```bash
python seed_data.py
```

6. **Run the server**:
```bash
uvicorn app.main:app --reload
```

Backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start development server**:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 🎨 Brand Identity

**PayrollPulse** embodies the perfect balance of professionalism and innovation:
- **Deep Navy & Teal**: Trust meets financial clarity
- **Inter Typography**: Modern readability with 5-weight system
- **Light/Dark Modes**: Comfortable viewing in any environment
- **Premium Design**: Inspired by Linear, Supabase, and Stripe
- **8px Baseline Grid**: Consistent spacing throughout
- **12-Column Responsive Grid**: Flexible layouts for all devices

See `DASHBOARD_DESIGN_SPEC.md` and `COMPONENT_LIBRARY.md` for complete specifications.

## 🔐 Demo Credentials

### Admin Account
- **Email**: hire-me@anshumat.org
- **Password**: HireMe@2025!

### Sample Employee Account
- **Email**: john.doe@company.com
- **Password**: password123

## 📚 Documentation

### Quick References
- **QUICK_REFERENCE.md** - Quick commands and tips
- **SETUP_GUIDE.md** - Detailed setup instructions
- **API_REFERENCE.md** - Complete API documentation
- **TESTING_GUIDE.md** - Testing procedures
- **DEPLOYMENT_GUIDE.md** - Production deployment guide
- **PROJECT_SUMMARY.md** - Project overview and features

### Design System
- **DESIGN_SYSTEM.md** - Complete design system specification
- **DESIGN_QUICK_REFERENCE.md** - Developer cheat sheet for styling
- **VISUAL_AUDIT_REPORT.md** - Design consistency audit report

### Form Validation
- **FORM_VALIDATION_IMPLEMENTATION.md** - Complete validation system documentation
- **VALIDATION_QUICK_REFERENCE.md** - Developer quick reference for validation
- **VALIDATION_TESTING_GUIDE.md** - Comprehensive testing guide for all forms

### API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

#### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `GET /auth/employees` - Get all employees

#### Admin Routes
- `POST /admin/salary-slips` - Create salary slip
- `PUT /admin/salary-slips/{id}` - Update salary slip
- `GET /admin/salary-slips` - Get all salary slips
- `GET /admin/expenses` - Get all expenses
- `PATCH /admin/expenses/{id}` - Update expense status
- `GET /admin/dashboard-stats` - Get dashboard statistics

#### Employee Routes
- `POST /employee/expenses` - Submit expense
- `GET /employee/expenses` - Get my expenses
- `GET /employee/salary-slips` - Get my salary slips
- `GET /employee/dashboard-stats` - Get dashboard statistics

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Role-Based Access Control**: Admin and Employee roles
- **Protected Routes**: Frontend and backend route protection
- **CORS Configuration**: Controlled cross-origin requests
- **Input Validation**: Pydantic schemas for data validation

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Material Design**: Modern UI with Material-UI components
- **Loading States**: Visual feedback for async operations
- **Error Handling**: User-friendly error messages
- **Data Visualization**: Charts for expense breakdown
- **Form Validation**: Client-side and server-side validation

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Production Deployment

### Backend
1. Set strong `SECRET_KEY` in `.env`
2. Use PostgreSQL instead of SQLite
3. Set `ACCESS_TOKEN_EXPIRE_MINUTES` appropriately
4. Use production ASGI server (Gunicorn + Uvicorn)
5. Enable HTTPS

### Frontend
1. Build production bundle:
```bash
npm run build
```
2. Serve with Nginx or similar
3. Update API URL in production

## 🐳 Docker Deployment

### Quick Start with Docker

```bash
# Production deployment
docker-compose up -d

# Development with hot-reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Using Makefile (recommended)
make up      # Start production
make dev     # Start development
make logs    # View logs
make down    # Stop services
```

### Access Services
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Docker Documentation
- **DOCKER_GUIDE.md** - Complete Docker deployment guide
- **DOCKER_QUICK_REFERENCE.md** - Quick command reference
- **Makefile** - Simplified command execution

### Docker Features
- ✅ Multi-stage builds for optimized images
- ✅ Production-ready Nginx configuration
- ✅ Health checks for both services
- ✅ Resource limits and monitoring
- ✅ Development hot-reload support
- ✅ Security best practices (non-root users)
- ✅ Automated database persistence

## 🔄 Database Schema

### Users Table
- id (Primary Key)
- email (Unique)
- password_hash
- full_name
- role (admin/employee)
- created_at

### Salary Slips Table
- id (Primary Key)
- employee_id (Foreign Key)
- month_year
- basic_salary
- allowances
- deductions
- bonuses
- tax
- net_salary
- notes
- created_by (Foreign Key)
- created_at
- updated_at

### Expenses Table
- id (Primary Key)
- employee_id (Foreign Key)
- amount
- category
- description
- expense_date
- receipt_url
- status (pending/approved/rejected)
- reviewed_by (Foreign Key)
- reviewed_at
- created_at

## 🚧 Roadmap

**Completed**:
- ✅ PDF export for salary slips
- ✅ Light/Dark mode theming
- ✅ Role-based authentication

**Coming Soon**:
- [ ] Email notifications
- [ ] Advanced reporting and analytics
- [ ] Multi-level approval workflow
- [ ] Bulk operations
- [ ] File upload for receipts
- [ ] Audit trail logging
- [ ] Performance optimization with Redis caching
- [ ] PostgreSQL migration
- [ ] CI/CD pipeline

## 💼 Enterprise Features

**PayrollPulse Pro** (Coming Soon):
- Multi-company support
- Advanced analytics dashboard
- Custom approval workflows
- API integrations (QuickBooks, Xero, SAP)
- White-label options
- Dedicated support

## 📝 License

This project is for demonstration purposes.

## 👨‍💻 About

PayrollPulse is a comprehensive full-stack demonstration project showcasing modern web development best practices, enterprise-grade architecture, and beautiful UI/UX design.

**Built with ❤️ using cutting-edge technologies**

## 🤝 Contributing

This is a demonstration project. For production use, consider:
- Adding comprehensive test coverage
- Implementing proper logging
- Setting up monitoring
- Adding rate limiting
- Implementing data backup strategies
- Adding more granular permissions

## 📞 Support & Resources

- **API Documentation**: http://localhost:8000/docs
- **Brand Guidelines**: See `BRAND_SHEET.md`
- **UI Style Guide**: See `UI_STYLE_GUIDE.md`
- **Technical Docs**: See documentation folder

---

**PayrollPulse** - Real-time Payroll Intelligence  
*Where Complexity Meets Simplicity*
