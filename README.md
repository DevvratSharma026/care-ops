# CareOps - Business Automation Platform

CareOps is a comprehensive, all-in-one SaaS platform designed to streamline operations for service-based businesses. From booking appointments to managing leads and staff, CareOps provides a unified command center to automate workflows and grow your business.

![CareOps Dashboard](https://via.placeholder.com/800x400?text=CareOps+Dashboard+Preview)

## 🚀 Features

### 1. **Command Center Dashboard**
   - Real-time metrics: Revenue, Active Leads, Bookings.
   - Activity Feed: Track every action in your business (New bookings, lead updates, etc.).

### 2. **Smart Booking System**
   - **Public Booking Page**: A beautiful, mobile-responsive booking portal for clients.
   - **Real-time Availability**: Syncs with your business hours and staff schedules.
   - **Service Management**: Define service duration, pricing, and descriptions.

### 3. **CRM & Lead Management**
   - **Unified Inbox**: Manage client communications in one place.
   - **Lead Tracking**: Track leads from "New" to "Converted".
   - **Automated Capture**: Leads are automatically created from booking inquiries.

### 4. **Dynamic Form Builder**
   - **Drag-and-Drop Interface**: Create custom intake forms, surveys, and questionnaires.
   - **Service Integration**: Link specific forms to services (e.g., "Medical History" for a consultation).
   - **Supported Fields**: Text, Checkboxes, Date Pickers, and more.

### 5. **Team & Operations**
   - **Staff Management**: Invite team members, assign roles (Owner, Manager, Staff).
   - **Availability Settings**: Configure business hours and exceptions.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Glassmorphism Design
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Prisma ORM](https://www.prisma.io/))
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL Database URL

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DevvratSharma026/care-ops.git
   cd care-ops
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/careops"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed # (Optional: Seeds demo data)
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
