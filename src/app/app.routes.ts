import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'products/:category',
    loadComponent: () =>
      import('./pages/products/product-detail.page').then((m) => m.ProductDetailPage),
  },
  {
    path: 'locator',
    loadComponent: () => import('./pages/locator/locator.page').then((m) => m.LocatorPage),
  },
  {
    path: 'appointments',
    loadComponent: () =>
      import('./pages/appointments/appointments.page').then((m) => m.AppointmentsPage),
  },
  {
    path: 'help',
    loadComponent: () => import('./pages/help/help.page').then((m) => m.HelpPage),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.page').then((m) => m.ContactPage),
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./pages/auth/onboarding.page').then((m) => m.OnboardingPage),
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./pages/auth/sign-in.page').then((m) => m.SignInPage),
  },
  {
    path: 'sign-in/otp',
    loadComponent: () => import('./pages/auth/otp.page').then((m) => m.OtpPage),
  },
  {
    path: 'forgot-credentials',
    loadComponent: () =>
      import('./pages/auth/forgot-credentials.page').then((m) => m.ForgotCredentialsPage),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'accounts',
        loadComponent: () =>
          import('./pages/dashboard/accounts.page').then((m) => m.AccountsPage),
      },
      {
        path: 'transfers',
        loadComponent: () =>
          import('./pages/dashboard/transfers.page').then((m) => m.TransfersPage),
      },
      {
        path: 'bill-pay',
        loadComponent: () =>
          import('./pages/dashboard/bill-pay.page').then((m) => m.BillPayPage),
      },
      {
        path: 'cards',
        loadComponent: () =>
          import('./pages/dashboard/cards.page').then((m) => m.CardsPage),
      },
      {
        path: 'deposit',
        loadComponent: () =>
          import('./pages/dashboard/deposit.page').then((m) => m.DepositPage),
      },
      {
        path: 'loans',
        loadComponent: () =>
          import('./pages/dashboard/loans.page').then((m) => m.LoansPage),
      },
      {
        path: 'investing',
        loadComponent: () =>
          import('./pages/dashboard/investing.page').then((m) => m.InvestingPage),
      },
      {
        path: 'budgeting',
        loadComponent: () =>
          import('./pages/dashboard/budgeting.page').then((m) => m.BudgetingPage),
      },
      {
        path: 'security',
        loadComponent: () =>
          import('./pages/dashboard/security.page').then((m) => m.SecurityPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/dashboard/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./pages/dashboard/messages.page').then((m) => m.MessagesPage),
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.page').then((m) => m.AdminPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
