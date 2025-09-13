# Freightnaut Sales CRM

A comprehensive, production-ready CRM system built specifically for Freightnaut's sales processes. This application streamlines the entire sales pipeline from lead capture to deal closure, with integrated communication tools and automated workflows.

## 🚀 Features

### Core CRM Functionality
- **Pipeline Management**: Visual Kanban board for opportunity tracking
- **Lead Management**: Complete lead lifecycle management
- **Contact & Account Management**: Centralized customer data
- **Quote Generation**: Professional PDF quote creation with download
- **Demo Scheduling**: Integrated calendar management
- **Activity Tracking**: Complete audit trail of all interactions
- **Reporting & Analytics**: Comprehensive sales performance metrics

### Integrations
- **Telephony**: Click-to-call with Exotel, Knowlarity, Twilio
- **WhatsApp**: Automated messaging and conversation tracking
- **Email**: SMTP integration with SES/SendGrid
- **Calendar**: Google Calendar integration for demo scheduling
- **File Storage**: AWS S3 for document management

### Automation & Workflows
- **Cadences**: Automated outreach and follow-up sequences
- **Triggers**: Event-based automation rules
- **Templates**: Reusable message and email templates
- **SLA Management**: Automated task assignment and escalation

### User Experience
- **Loading States**: Comprehensive loading indicators
- **Error Handling**: User-friendly error messages
- **Help System**: Contextual help and guidance
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Live data synchronization

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.3** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Query** for server state management
- **React Hook Form** with Zod validation

### Backend
- **Node.js** with Express/Fastify
- **PostgreSQL** database
- **Drizzle ORM** for database operations
- **JWT** authentication
- **bcryptjs** for password hashing

### Infrastructure
- **Vercel** for frontend deployment
- **Fly.io/Render/AWS** for backend hosting
- **AWS S3** for file storage
- **Redis** for caching and queues

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sales-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   Update the `.env.local` file with your actual values:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/freightnaut_crm"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key-here"
   JWT_EXPIRES_IN="7d"
   
   # Email Configuration
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   
   # Telephony Integration
   EXOTEL_API_KEY="your-exotel-api-key"
   EXOTEL_API_TOKEN="your-exotel-api-token"
   EXOTEL_SID="your-exotel-sid"
   
   # WhatsApp Integration
   WHATSAPP_API_KEY="your-whatsapp-api-key"
   WHATSAPP_PHONE_NUMBER_ID="your-whatsapp-phone-number-id"
   
   # Google Calendar
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # File Storage
   AWS_ACCESS_KEY_ID="your-aws-access-key"
   AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
   AWS_REGION="us-east-1"
   AWS_S3_BUCKET="freightnaut-crm-files"
   
   # App Configuration
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   ```

4. **Set up the database**
   ```bash
   # Generate database migrations
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## 🚀 Getting Started

1. **Visit the landing page** at `http://localhost:3000`
2. **Click "Get Started"** to create your account
3. **Fill out the signup form** with your company details
4. **Check your email** for the verification link
5. **Click the verification link** to activate your account
6. **Sign in** and start using the CRM!

## 🔐 Authentication System

The application includes a complete authentication system:

- **User Registration**: Company onboarding with email verification
- **Email Verification**: Secure account activation via email
- **Login/Logout**: Session management with JWT tokens
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Password Security**: Bcrypt hashing for secure password storage

## 🗄️ Database Schema

The application uses a comprehensive PostgreSQL schema with the following main entities:

- **Users**: System users with role-based access control
- **Accounts**: Company/organization records
- **Contacts**: Individual people within accounts
- **Leads**: Potential customers in early stages
- **Opportunities**: Active sales deals
- **Activities**: All interactions and tasks
- **Demos**: Scheduled product demonstrations
- **Quotes**: Professional pricing documents
- **Plans & Features**: Product catalog and pricing

## 🔐 Authentication & Authorization

The system implements role-based access control (RBAC) with the following roles:

- **Admin**: Full system access
- **Sales Manager**: Team management and reporting
- **SDR**: Lead management and outreach
- **AE**: Opportunity management and closing
- **Finance/Ops**: Quote approval and reporting
- **Exec/Viewer**: Read-only access to reports

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Opportunities
- `GET /api/opportunities` - List opportunities
- `POST /api/opportunities` - Create opportunity
- `GET /api/opportunities/[id]` - Get opportunity details
- `PUT /api/opportunities/[id]` - Update opportunity
- `DELETE /api/opportunities/[id]` - Delete opportunity

### Leads
- `GET /api/leads` - List leads
- `POST /api/leads` - Create lead
- `GET /api/leads/[id]` - Get lead details
- `PUT /api/leads/[id]` - Update lead
- `DELETE /api/leads/[id]` - Delete lead

### Accounts & Contacts
- `GET /api/accounts` - List accounts
- `POST /api/accounts` - Create account
- `GET /api/contacts` - List contacts
- `POST /api/contacts` - Create contact

### Integrations
- `POST /api/integrations/call` - Make phone call
- `POST /api/integrations/whatsapp` - Send WhatsApp message
- `POST /api/integrations/email` - Send email
- `POST /api/integrations/calendar` - Create calendar event

## 🎯 Key Features Implemented

### ✅ Production-Ready Features
- **Real Database Integration**: All data is stored in PostgreSQL
- **API Routes**: Complete REST API for all CRUD operations
- **Loading States**: Comprehensive loading indicators throughout
- **Error Handling**: User-friendly error messages and retry mechanisms
- **PDF Quote Generation**: Professional PDF quotes with download
- **Real Integrations**: Working telephony, WhatsApp, email, and calendar
- **Help System**: Contextual help and user guidance
- **Responsive Design**: Mobile-first responsive design
- **Type Safety**: Full TypeScript implementation
- **Data Validation**: Zod validation for all forms and API endpoints

### 🔄 Data Flow
- **Real-time Updates**: React Query for live data synchronization
- **Optimistic Updates**: Immediate UI updates with rollback on error
- **Caching**: Intelligent data caching for performance
- **Background Refetching**: Automatic data refresh

### 🎨 User Experience
- **Intuitive Navigation**: Clear navigation between all modules
- **Quick Actions**: One-click actions for common tasks
- **Search & Filtering**: Advanced search and filtering capabilities
- **Contextual Help**: Help text and guidance throughout the app
- **Loading Feedback**: Clear loading states for all operations

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Fly.io)
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Deploy: `fly deploy`

### Database (PostgreSQL)
1. Create PostgreSQL database (AWS RDS, Supabase, or local)
2. Set `DATABASE_URL` environment variable
3. Run migrations: `npm run db:migrate`

## 📈 Monitoring & Observability

- **Error Tracking**: Sentry integration
- **Performance Monitoring**: OpenTelemetry
- **Metrics**: Prometheus + Grafana
- **Logging**: Structured logging with Winston

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: support@freightnaut.com
- Documentation: [docs.freightnaut.com](https://docs.freightnaut.com)
- Issues: [GitHub Issues](https://github.com/freightnaut/sales-crm/issues)

---

Built with ❤️ by the Freightnaut team