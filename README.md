# Money Management App

A comprehensive personal finance and task management application built with Next.js 15. This modern web app helps you track your finances, manage debts and loans, and organize your daily and monthly tasks all in one centralized platform.

## ✨ Features

### 💰 Finance Management
- **Income & Expense Tracking**: Add and categorize transactions with detailed descriptions
- **Financial Dashboard**: View your balance, monthly income/expenses with interactive charts
- **Transaction History**: Filter and search through your complete financial history
- **Visual Analytics**: Beautiful charts showing income vs expenses and category breakdowns

### 💳 Debt & Loan Management
- **Debt Tracking**: Monitor and manage your debts with payment schedules
- **Loan Management**: Track loans, interest rates, and payment progress
- **Payment Reminders**: Stay on top of your financial obligations
- **Financial Health**: Overview of your debt-to-income ratio and payment status

### ✅ Task Management
- **Daily Tasks**: Manage your daily tasks with priorities and due dates
- **Monthly Goals**: Set and track long-term monthly objectives
- **Task Categories**: Organize tasks by type and priority level
- **Progress Tracking**: Monitor completion rates and productivity metrics

### 📊 Dashboard & Analytics
- **Comprehensive Overview**: Quick view of financial status and task progress
- **Interactive Charts**: Visual representation of data using Recharts
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Live data updates using Zustand state management

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS v4 with custom components
- **State Management**: Zustand for lightweight state management
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React icon library
- **Date Handling**: date-fns for date manipulation
- **Code Quality**: ESLint + Prettier with Tailwind plugin
- **Development**: Hot reload with Turbopack support

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ocean28799/money-manage.git
   cd money-manage
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── finance/           # Finance management page
│   ├── debt/              # Debt tracking page
│   ├── loan/              # Loan management page
│   ├── tasks/             # Task management pages
│   │   ├── daily/         # Daily tasks page
│   │   └── monthly/       # Monthly goals page
│   ├── settings/          # Settings page
│   ├── layout.tsx         # Root layout with navigation
│   └── page.tsx           # Dashboard homepage
├── components/            # Reusable UI components
│   ├── dashboard/         # Dashboard-specific components
│   ├── finance/           # Finance-related components
│   ├── debt/              # Debt management components
│   ├── loan/              # Loan management components
│   ├── layout/            # Layout components (sidebar, etc.)
│   ├── tasks/             # Task-related components
│   └── ui/                # Base UI components (buttons, inputs, etc.)
├── lib/                   # Utility functions and configurations
│   ├── mock-data.ts       # Sample data for demonstration
│   ├── utils.ts           # Utility functions
│   └── validations.ts     # Zod schemas for form validation
├── store/                 # Zustand state management
│   ├── finance-store.ts   # Finance state management
│   ├── debt-store.ts      # Debt tracking state
│   ├── loan-store.ts      # Loan management state
│   └── task-store.ts      # Task state management
└── types/                 # TypeScript type definitions
    └── index.ts           # Global type definitions
```

## 🎯 Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## 🔧 Key Features Explained

### State Management with Zustand
The application uses Zustand for lightweight and efficient state management:
- **Finance Store**: Manages transactions, calculates summaries, and provides filtering
- **Debt Store**: Handles debt tracking and payment schedules
- **Loan Store**: Manages loan information and payment tracking
- **Task Store**: Handles task operations, status updates, and productivity statistics

### Form Validation with Zod
All forms use Zod schemas for comprehensive type-safe validation:
- Transaction validation with amount, category, and date validation
- Debt/loan validation with interest rates and payment schedules
- Task validation with priority levels and due date requirements

### Responsive Design with Tailwind CSS v4
Built with the latest Tailwind CSS for a modern, mobile-first experience:
- Collapsible sidebar navigation for all screen sizes
- Responsive grid layouts that adapt to device width
- Mobile-optimized forms and interactive charts
- Dark mode support (coming soon)

## 📊 Sample Data & Demo

The application includes comprehensive sample data to demonstrate all features:
- **Sample Transactions**: Various income and expense entries across different categories
- **Sample Debts**: Credit card balances and personal loans with payment schedules
- **Sample Loans**: Mortgage and auto loans with interest calculations
- **Sample Tasks**: Daily tasks and monthly goals with different priority levels
- **Categories**: Pre-defined income and expense categories for easy organization

## 🎨 Customization

### Adding New Transaction Categories
Modify the `categories` object in `src/lib/mock-data.ts`:

```typescript
export const categories = {
  income: ['Salary', 'Freelance', 'Investment', 'Business', 'Your Custom Category'],
  expense: ['Housing', 'Food', 'Transportation', 'Entertainment', 'Your Custom Category'],
};
```

### Customizing UI Theme
The application uses Tailwind CSS v4. Customize the appearance by:
- Modifying `tailwind.config.js` for global theme changes
- Updating component styles using Tailwind utility classes
- Adding custom color schemes in the CSS variables

### Extending Functionality
- Add new debt/loan types in the respective store files
- Create custom task categories and priority levels
- Implement additional chart types using Recharts library

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub repository
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with zero configuration - Vercel automatically detects Next.js

### Other Deployment Platforms
The application can be deployed to any platform supporting Node.js:
- **Netlify**: Use `npm run build && npm run start`
- **Railway**: Connect GitHub repo for automatic deployments
- **Heroku**: Add Node.js buildpack and set build script
- **DigitalOcean App Platform**: Deploy directly from GitHub
- **AWS Amplify**: Connect repository for continuous deployment

### Environment Variables
For production deployment, you may want to set:
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🔒 Security & Privacy

- All data is stored locally in browser storage (no external database required)
- No personal financial data is transmitted to external servers
- Client-side only application for maximum privacy
- No authentication required - perfect for personal use

## 🗺️ Roadmap

- [ ] Dark mode toggle
- [ ] Data export/import functionality
- [ ] Recurring transaction templates
- [ ] Advanced analytics and reports
- [ ] Multi-currency support
- [ ] Budget planning and tracking
- [ ] Mobile app (React Native)
- [ ] Cloud sync option (optional)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📞 Support

If you have any questions or need help with setup, please open an issue in the GitHub repository.
