# Healthcare Management System

A complete patient healthcare management demo application with modern full-stack architecture.

## 🚀 Quick Start for New Users

### 1. Start the Application

```bash
# Terminal 1: Start Backend
cd backend
npm install
npm run dev
# Backend runs on http://localhost:5000

# Terminal 2: Start Frontend  
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:4000
```

### 2. Access the Application

**Visit: http://localhost:4000**

### 3. Demo Login Credentials

The application comes with pre-configured demo accounts:

| Role | Email | Password | Access |
|------|--------|----------|---------|
| **Administrator** | `admin@demo.com` | `password` | Full system access, manage all patients, view all records |
| **Healthcare Provider** | `provider@demo.com` | `password` | Document encounters, verify insurance, view patients |
| **Patient** | `patient@demo.com` | `password` | Personal profile, medical records, insurance status |
| **Patient** | `john.doe@email.com` | `password` | Sample patient account |
| **Patient** | `sarah.wilson@email.com` | `password` | Sample patient account |

## 📊 Pre-loaded Demo Data

The application includes realistic dummy data for testing:

### 👥 5 Sample Patients
- **Michael Johnson** - Blue Cross insurance, Annual physical
- **Emma Davis** - Aetna insurance, Hypertension management  
- **Robert Smith** - Cigna insurance, Diabetes follow-up
- **John Doe** - UnitedHealth insurance, Upper respiratory infection
- **Sarah Wilson** - Kaiser Permanente insurance, Preventive care

### 🛡️ Insurance Verifications
- Mix of Active, Pending, and different coverage types (PPO, HMO, EPO)
- Mock API responses with realistic insurance provider scenarios

### 🏥 Medical Encounters  
- Comprehensive clinical notes with ICD-10 diagnosis codes
- Various encounter types: physicals, follow-ups, acute care, preventive
- Multiple healthcare providers documenting care

## 🎯 MVP Features

### 1. **Patient Intake & Registration**
- Complete demographic information forms
- Insurance provider and policy details
- File upload for ID and insurance cards
- Role-based profile management

### 2. **Insurance Verification (Mock API)**
- Real-time insurance coverage verification
- Verification history tracking
- Different status scenarios (Active, Pending, Inactive)
- Provider-specific response patterns

### 3. **Encounter Documentation**
- Clinical notes with ICD-10 diagnosis codes
- Provider documentation workflow
- Patient encounter history
- CRUD operations for medical records

## 🔐 Role-Based Access

### **Patient Portal**
- View personal medical records
- Manage profile and insurance information
- Check insurance verification status
- Access encounter history

### **Provider Portal**
- Document patient encounters
- Verify patient insurance coverage
- View all patient profiles
- Clinical documentation tools

### **Administrator Portal**
- Full system access and management
- View all patients, encounters, and verifications
- System statistics and reporting
- User management capabilities

## 📱 Application Flow

1. **Login** → Choose your role (Admin/Provider/Patient)
2. **Dashboard** → Navigate to main features
3. **Patient Profile** → Complete intake forms, manage demographics  
4. **Insurance Verification** → Verify coverage, view history
5. **Medical Encounters** → Document visits, view clinical records

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **SQLite** - Lightweight database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Context API** - State management

## 📁 Project Structure

```
demo-patient-healthcare-management/
├── backend/
│   ├── routes/
│   │   ├── auth.js          # Authentication endpoints
│   │   ├── patients.js      # Patient management
│   │   ├── insurance.js     # Insurance verification
│   │   └── encounters.js    # Medical encounters
│   ├── database.js          # SQLite setup and models
│   ├── server.js           # Main application server
│   └── healthcare.db       # SQLite database (auto-created)
├── frontend/
│   ├── app/
│   │   ├── dashboard/       # Main dashboard
│   │   ├── patient-profile/ # Patient intake forms
│   │   ├── insurance-verification/ # Insurance tools
│   │   ├── encounters/      # Medical encounter forms
│   │   ├── login/          # Authentication
│   │   └── register/       # User registration
│   └── lib/
│       └── auth.tsx        # Authentication context
```

## 🚦 Development

- **Backend API**: http://localhost:5000
- **Frontend App**: http://localhost:4000  
- **Database**: SQLite (automatically created)
- **Hot Reload**: Enabled for both frontend and backend

## 🎭 Demo Scenarios

### Scenario 1: New Patient Registration
1. Login as Provider (`provider@demo.com`)
2. Navigate to Patient Profile
3. Create new patient with insurance details
4. Verify insurance coverage
5. Document first encounter

### Scenario 2: Patient Self-Service
1. Login as Patient (`patient@demo.com`) 
2. Complete profile information
3. View insurance verification status
4. Review medical encounter history

### Scenario 3: Clinical Workflow
1. Login as Provider
2. Select existing patient
3. Document new encounter with diagnosis
4. Update clinical notes
5. Review encounter history

## 📋 API Endpoints

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Patients**: `/api/patients/profile`, `/api/patients/all`
- **Insurance**: `/api/insurance/verify/:id`, `/api/insurance/history/:id`
- **Encounters**: `/api/encounters`, `/api/encounters/patient/:id`

Perfect for healthcare IT demonstrations, code analysis, and full-stack development learning!
