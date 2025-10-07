# 🏥 Healthcare Management System - Demo Guide

## 🚀 Quick Start (2 minutes)

### 1. Start Servers
```bash
# Terminal 1: Backend
cd backend && npm install && npm run dev

# Terminal 2: Frontend  
cd frontend && npm install && npm run dev
```

### 2. Access Application
**Visit: http://localhost:4000**

## 🔑 Demo Login Credentials

| **Role** | **Email** | **Password** | **What You Can Do** |
|----------|-----------|--------------|---------------------|
| 👨‍💼 **Admin** | `admin@demo.com` | `password` | See everything, manage all data |
| 👩‍⚕️ **Provider** | `provider@demo.com` | `password` | Document patient care, verify insurance |
| 👤 **Patient** | `patient@demo.com` | `password` | View personal records, manage profile |

## 📊 What's Inside (Pre-loaded Data)

### 5 Sample Patients Ready to Explore:
- **Michael Johnson** - Blue Cross (Active PPO)
- **Emma Davis** - Aetna (Active HMO)  
- **Robert Smith** - Cigna (Pending EPO)
- **John Doe** - UnitedHealth (Active PPO)
- **Sarah Wilson** - Kaiser Permanente (Active EPO)

### 5 Realistic Medical Records:
- Annual physicals, diabetes follow-ups, respiratory infections
- Real ICD-10 codes and clinical notes
- Multiple healthcare providers

## 🎯 Try These Demo Scenarios

### **Scenario A: Healthcare Provider Workflow**
1. Login: `provider@demo.com` / `password`
2. Go to "Insurance Verification" → Select a patient → Verify coverage
3. Go to "Medical Encounters" → Create new encounter → Add diagnosis & notes
4. View encounter history and statistics

### **Scenario B: Patient Experience**  
1. Login: `patient@demo.com` / `password`
2. Go to "Patient Profile" → Update personal information
3. View "Insurance Verification" → Check coverage status
4. Browse "Medical Records" → Review encounter history

### **Scenario C: Administrator Overview**
1. Login: `admin@demo.com` / `password`  
2. Explore dashboard statistics
3. View all patients, verifications, and encounters
4. Access full system capabilities

## 🔧 Technical Details

- **Frontend**: http://localhost:4000 (Next.js + TypeScript + Tailwind)
- **Backend**: http://localhost:5000 (Node.js + Express + SQLite)
- **Database**: Auto-created SQLite file with sample data
- **Authentication**: JWT tokens with role-based access

## 💡 Perfect For

- Healthcare IT demonstrations
- Full-stack development learning
- Code analysis and architecture review
- MVP prototyping and testing

---
**Ready to explore? Start with `admin@demo.com` for the full experience!** 🎉
