export type CurrencyCode = 'USD' | 'NGN';

export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  kycStatus: 'pending' | 'verified' | 'rejected';
  antiPhishingPhrase: string;
  lastLoginAt: string;
  lastLoginIp: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: 'sms' | 'email' | 'totp';
  failedLoginAttempts: number;
  lockedUntil: string | null;
  preferredCurrency: CurrencyCode;
  createdAt: string;
}

export interface BankAccount {
  id: string;
  userId: string;
  accountNumber: string; // e.g. "••••4821"
  routingNumber: string; // "021000021"
  type: 'checking' | 'savings' | 'cd' | 'credit_card' | 'loan' | 'investment';
  name: string;
  balance: number;
  availableBalance: number;
  currency: CurrencyCode;
  status: 'active' | 'frozen' | 'restricted' | 'closed';
  interestRateApy?: number;
  termMonths?: number;
  openedAt: string;
}

export interface LedgerEntry {
  id: string;
  journalId: string;
  timestamp: string;
  accountId: string;
  accountType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  entryType: 'debit' | 'credit';
  amount: number;
  currency: CurrencyCode;
  description: string;
  referenceId: string;
  idempotencyKey: string;
}

export type TransactionCategory =
  | 'Housing'
  | 'Groceries'
  | 'Dining'
  | 'Utilities'
  | 'Transport'
  | 'Investments'
  | 'Income'
  | 'Entertainment'
  | 'Shopping'
  | 'Transfer'
  | 'Fees';

export interface Transaction {
  id: string;
  journalId: string;
  userId: string;
  sourceAccountId: string;
  destinationAccountId?: string;
  destinationName?: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'bill_pay' | 'card_purchase' | 'interest' | 'fee';
  amount: number;
  fee: number;
  currency: CurrencyCode;
  category: TransactionCategory;
  status: 'pending' | 'settled' | 'flagged' | 'reversed';
  description: string;
  createdAt: string;
  settledAt?: string;
  riskScore: number; // 0-100 AML flag score
  flagReason?: string;
}

export interface BankCard {
  id: string;
  accountId: string;
  userId: string;
  cardholderName: string;
  type: 'debit' | 'credit';
  cardNetwork: 'Visa' | 'Mastercard';
  last4: string;
  cvvMasked: string; // "•••"
  expiryMonth: number;
  expiryYear: number;
  isFrozen: boolean;
  dailyAtmLimit: number;
  dailyPurchaseLimit: number;
  travelNoticeActive: boolean;
  travelDestination?: string;
  travelEndDate?: string;
  status: 'active' | 'lost' | 'stolen' | 'cancelled';
  creditLimit?: number;
}

export interface BillPayee {
  id: string;
  userId: string;
  name: string;
  category: string;
  accountNumberMasked: string;
  autoPayEnabled: boolean;
  autoPayAmount?: number;
  nextPaymentDate?: string;
  lastPaidDate?: string;
}

export interface BillPayment {
  id: string;
  userId: string;
  payeeId: string;
  payeeName: string;
  sourceAccountId: string;
  amount: number;
  paymentDate: string;
  frequency: 'one_time' | 'monthly' | 'biweekly';
  status: 'scheduled' | 'processed' | 'failed';
  referenceNumber: string;
}

export interface CheckDeposit {
  id: string;
  userId: string;
  accountId: string;
  amount: number;
  currency: CurrencyCode;
  frontImagePreview: string;
  backImagePreview: string;
  status: 'submitted' | 'processing' | 'approved' | 'rejected';
  rejectionReason?: string;
  submittedAt: string;
  clearedAt?: string;
  checkNumber: string;
}

export interface LoanApplication {
  id: string;
  userId: string;
  type: 'mortgage' | 'auto' | 'personal' | 'business';
  requestedAmount: number;
  downPayment: number;
  termMonths: number;
  estimatedApr: number;
  monthlyPayment: number;
  status: 'pre_approved' | 'under_review' | 'approved' | 'declined';
  appliedDate: string;
  creditTier: 'excellent' | 'good' | 'fair';
}

export interface InvestmentHolding {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  assetClass: 'stocks' | 'etfs' | 'bonds' | 'crypto';
  dailyChangePercent: number;
}

export interface InvestmentOrder {
  id: string;
  userId: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  shares: number;
  price: number;
  total: number;
  status: 'EXECUTED_SIMULATED';
  timestamp: string;
}

export interface BudgetEnvelope {
  id: string;
  category: TransactionCategory;
  allocatedAmount: number;
  spentAmount: number;
  period: 'monthly';
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  category: string;
}

export interface KycApplication {
  id: string;
  userId: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  applicant: {
    fullName: string;
    dob: string;
    ssnOrTinMasked: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    idType: 'passport' | 'drivers_license' | 'national_id';
    idNumberMasked: string;
    employmentStatus: string;
    annualIncomeRange: string;
    accountSelected: string;
  };
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorUserId: string;
  actorRole: string;
  action:
    | 'LOGIN'
    | 'LOGOUT'
    | 'TRANSFER_CREATED'
    | 'BILL_PAID'
    | 'CARD_FROZEN'
    | 'CARD_UNFROZEN'
    | 'LIMIT_UPDATED'
    | 'KYC_APPROVED'
    | 'KYC_REJECTED'
    | 'PASSWORD_CHANGED'
    | 'ACCOUNT_FROZEN'
    | 'RATES_UPDATED'
    | 'CHECK_DEPOSITED';
  targetEntityId: string;
  details: string;
  ipAddress: string;
}

export interface RateConfig {
  checkingApy: number;
  highYieldSavingsApy: number;
  cd12MonthApy: number;
  mortgage30YearApr: number;
  mortgage15YearApr: number;
  autoLoanNewApr: number;
  autoLoanUsedApr: number;
  businessLoanApr: number;
  lastUpdated: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'transfers' | 'cards' | 'fraud' | 'account' | 'loans' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  messages: {
    id: string;
    sender: 'user' | 'agent';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

export interface BranchLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  distanceMiles: number;
  hours: string;
  hasAtm24_7: boolean;
  hasDriveThru: boolean;
  hasNotary: boolean;
  hasSafeDeposit: boolean;
  coordinates: { lat: number; lng: number };
}
