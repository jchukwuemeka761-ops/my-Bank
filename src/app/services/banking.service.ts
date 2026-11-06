import {Injectable, computed, inject, signal} from '@angular/core';
import {
  DEFAULT_RATE_CONFIG,
  INITIAL_ACCOUNTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_BRANCHES,
  INITIAL_BUDGETS,
  INITIAL_CARDS,
  INITIAL_GOALS,
  INITIAL_HOLDINGS,
  INITIAL_KYC_APPLICATIONS,
  INITIAL_PAYEES,
  INITIAL_TRANSACTIONS,
  USD_TO_NGN_RATE,
} from '../lib/seed-data';
import {
  AuditLogItem,
  BankAccount,
  BankCard,
  BillPayee,
  BranchLocation,
  BudgetEnvelope,
  CheckDeposit,
  CurrencyCode,
  InvestmentHolding,
  KycApplication,
  LedgerEntry,
  LoanApplication,
  RateConfig,
  SavingsGoal,
  SupportTicket,
  Transaction,
  TransactionCategory,
} from '../types/banking.types';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class BankingService {
  private auth = inject(AuthService);

  // Currency State (USD default, toggleable to NGN)
  readonly activeCurrency = signal<CurrencyCode>('USD');

  // Core Data Stores
  readonly accounts = signal<BankAccount[]>(INITIAL_ACCOUNTS);
  readonly cards = signal<BankCard[]>(INITIAL_CARDS);
  readonly transactions = signal<Transaction[]>(INITIAL_TRANSACTIONS);
  readonly payees = signal<BillPayee[]>(INITIAL_PAYEES);
  readonly holdings = signal<InvestmentHolding[]>(INITIAL_HOLDINGS);
  readonly budgets = signal<BudgetEnvelope[]>(INITIAL_BUDGETS);
  readonly goals = signal<SavingsGoal[]>(INITIAL_GOALS);
  readonly branches = signal<BranchLocation[]>(INITIAL_BRANCHES);
  readonly kycApplications = signal<KycApplication[]>(INITIAL_KYC_APPLICATIONS);
  readonly auditLogs = signal<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  readonly rates = signal<RateConfig>(DEFAULT_RATE_CONFIG);

  // Check Deposits
  readonly checkDeposits = signal<CheckDeposit[]>([]);

  // Loan Applications
  readonly loanApplications = signal<LoanApplication[]>([
    {
      id: 'loan_app_01',
      userId: 'user_alex',
      type: 'auto',
      requestedAmount: 22000,
      downPayment: 3500,
      termMonths: 48,
      estimatedApr: 4.99,
      monthlyPayment: 427.65,
      status: 'approved',
      appliedDate: '2025-08-15',
      creditTier: 'excellent',
    },
  ]);

  // Support Tickets
  readonly tickets = signal<SupportTicket[]>([
    {
      id: 'tkt_01',
      userId: 'user_alex',
      userName: 'Alex Chukwuemeka',
      userEmail: 'alex.chukwuemeka@example.com',
      subject: 'International Card Usage Notice in Europe',
      category: 'cards',
      priority: 'medium',
      status: 'resolved',
      createdAt: '2026-11-04T12:00:00Z',
      messages: [
        {
          id: 'msg_01',
          sender: 'user',
          senderName: 'Alex Chukwuemeka',
          text: 'Hello, I scheduled travel for UK & France. Will contactless tap work seamlessly at transit gates?',
          timestamp: '2026-11-04T12:00:00Z',
        },
        {
          id: 'msg_02',
          sender: 'agent',
          senderName: 'Marcus (JF Concierge)',
          text: 'Hi Alex, yes! Your Travel Elite Visa Signature features zero foreign transaction fees and works on London TfL and Paris Metro.',
          timestamp: '2026-11-04T12:15:00Z',
        },
      ],
    },
  ]);

  // Double-Entry Ledger Store (immutable journal entries)
  readonly ledger = signal<LedgerEntry[]>([]);

  // Track processed idempotency keys to prevent double-spending
  private processedIdempotencyKeys = new Set<string>();

  // Derived Financial Metrics
  readonly userAccounts = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.accounts().filter((a) => a.userId === user.id);
  });

  readonly userTransactions = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.transactions().filter((t) => t.userId === user.id);
  });

  readonly userCards = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.cards().filter((c) => c.userId === user.id);
  });

  readonly netWorth = computed(() => {
    const accts = this.userAccounts();
    return accts.reduce((acc, curr) => acc + curr.balance, 0);
  });

  readonly liquidAssets = computed(() => {
    const accts = this.userAccounts();
    return accts
      .filter((a) => a.type === 'checking' || a.type === 'savings' || a.type === 'cd')
      .reduce((acc, curr) => acc + curr.balance, 0);
  });

  readonly totalDebt = computed(() => {
    const accts = this.userAccounts();
    return accts
      .filter((a) => a.type === 'credit_card' || a.type === 'loan')
      .reduce((acc, curr) => acc + Math.abs(curr.balance), 0);
  });

  readonly investmentTotal = computed(() => {
    const accts = this.userAccounts();
    return accts
      .filter((a) => a.type === 'investment')
      .reduce((acc, curr) => acc + curr.balance, 0);
  });

  // Currency Converter Helpers
  toggleCurrency() {
    this.activeCurrency.update((c) => (c === 'USD' ? 'NGN' : 'USD'));
  }

  setCurrency(curr: CurrencyCode) {
    this.activeCurrency.set(curr);
  }

  formatMoney(amount: number, forceCurrency?: CurrencyCode): string {
    const curr = forceCurrency || this.activeCurrency();
    const isNegative = amount < 0;
    const absVal = Math.abs(amount);

    if (curr === 'NGN') {
      const converted = absVal * USD_TO_NGN_RATE;
      const formatted = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(converted);
      return isNegative ? `-${formatted}` : formatted;
    }

    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(absVal);
    return isNegative ? `-${formatted}` : formatted;
  }

  // Double-Entry Atomic Transfer Processing
  executeTransfer(params: {
    sourceAccountId: string;
    destinationAccountId?: string;
    destinationName?: string;
    amount: number;
    description: string;
    category?: TransactionCategory;
    idempotencyKey: string;
  }): { success: boolean; transactionId?: string; error?: string } {
    const { sourceAccountId, destinationAccountId, destinationName, amount, description, idempotencyKey } = params;

    // Idempotency check
    if (this.processedIdempotencyKeys.has(idempotencyKey)) {
      return { success: false, error: 'Transaction already processed (Idempotency violation).' };
    }

    if (amount <= 0) {
      return { success: false, error: 'Transfer amount must be greater than zero.' };
    }

    const source = this.accounts().find((a) => a.id === sourceAccountId);
    if (!source) {
      return { success: false, error: 'Source account not found.' };
    }

    if (source.status !== 'active') {
      return { success: false, error: 'Source account is frozen or restricted.' };
    }

    // Balance check for deposit accounts
    if (source.type !== 'credit_card' && source.availableBalance < amount) {
      return { success: false, error: 'Insufficient available funds for this transfer.' };
    }

    const journalId = 'jrn_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const txId = 'tx_' + Date.now();
    const timestamp = new Date().toISOString();

    // Double-entry records:
    // Debit source account
    const debitEntry: LedgerEntry = {
      id: 'ledg_' + Date.now() + '_dr',
      journalId,
      timestamp,
      accountId: sourceAccountId,
      accountType: source.type === 'credit_card' ? 'liability' : 'asset',
      entryType: 'debit',
      amount,
      currency: source.currency,
      description,
      referenceId: txId,
      idempotencyKey,
    };

    // Credit destination account (or external entity)
    const creditEntry: LedgerEntry = {
      id: 'ledg_' + Date.now() + '_cr',
      journalId,
      timestamp,
      accountId: destinationAccountId || 'external_ach_holding',
      accountType: 'asset',
      entryType: 'credit',
      amount,
      currency: source.currency,
      description,
      referenceId: txId,
      idempotencyKey,
    };

    // Atomic update of accounts
    this.accounts.update((list) =>
      list.map((acct) => {
        if (acct.id === sourceAccountId) {
          const newBal = acct.balance - amount;
          return { ...acct, balance: newBal, availableBalance: newBal };
        }
        if (destinationAccountId && acct.id === destinationAccountId) {
          const newBal = acct.balance + amount;
          return { ...acct, balance: newBal, availableBalance: newBal };
        }
        return acct;
      }),
    );

    // Record immutable ledger entries
    this.ledger.update((entries) => [...entries, debitEntry, creditEntry]);

    // Record transaction
    const newTx: Transaction = {
      id: txId,
      journalId,
      userId: this.auth.currentUser()?.id || 'user_alex',
      sourceAccountId,
      destinationAccountId,
      destinationName: destinationName || (destinationAccountId ? 'Own Account Transfer' : 'External Recipient'),
      type: 'transfer',
      amount,
      fee: 0,
      currency: source.currency,
      category: params.category || 'Transfer',
      status: 'settled',
      description,
      createdAt: timestamp,
      settledAt: timestamp,
      riskScore: amount > 5000 ? 45 : 3,
    };

    this.transactions.update((txs) => [newTx, ...txs]);
    this.processedIdempotencyKeys.add(idempotencyKey);

    // Audit log entry
    this.logAuditEvent(
      'TRANSFER_CREATED',
      txId,
      `Transferred ${this.formatMoney(amount, 'USD')} from ${source.name} to ${newTx.destinationName}`,
    );

    return { success: true, transactionId: txId };
  }

  // Pay Bill
  payBill(params: {
    payeeId: string;
    sourceAccountId: string;
    amount: number;
    paymentDate: string;
  }): { success: boolean; error?: string } {
    const payee = this.payees().find((p) => p.id === params.payeeId);
    if (!payee) return { success: false, error: 'Payee not found.' };

    const idempotencyKey = `billpay_${params.payeeId}_${Date.now()}`;
    const res = this.executeTransfer({
      sourceAccountId: params.sourceAccountId,
      destinationName: payee.name,
      amount: params.amount,
      description: `Bill Payment to ${payee.name}`,
      category: 'Utilities',
      idempotencyKey,
    });

    if (res.success) {
      this.payees.update((list) =>
        list.map((p) => (p.id === payee.id ? { ...p, lastPaidDate: new Date().toISOString().split('T')[0] } : p)),
      );
    }
    return res;
  }

  // Add Payee
  addPayee(name: string, category: string, accountNumberMasked: string) {
    const newPayee: BillPayee = {
      id: 'payee_' + Date.now(),
      userId: this.auth.currentUser()?.id || 'user_alex',
      name,
      category,
      accountNumberMasked: accountNumberMasked.startsWith('••••') ? accountNumberMasked : `••••${accountNumberMasked.slice(-4)}`,
      autoPayEnabled: false,
    };
    this.payees.update((list) => [...list, newPayee]);
  }

  // Card Controls
  toggleCardFreeze(cardId: string) {
    this.cards.update((list) =>
      list.map((c) => {
        if (c.id === cardId) {
          const updated = !c.isFrozen;
          this.logAuditEvent(
            updated ? 'CARD_FROZEN' : 'CARD_UNFROZEN',
            cardId,
            `Card ${c.cardNetwork} ending in ${c.last4} was ${updated ? 'frozen' : 'unfrozen'}.`,
          );
          return { ...c, isFrozen: updated };
        }
        return c;
      }),
    );
  }

  updateCardLimits(cardId: string, dailyAtmLimit: number, dailyPurchaseLimit: number) {
    this.cards.update((list) =>
      list.map((c) => {
        if (c.id === cardId) {
          this.logAuditEvent(
            'LIMIT_UPDATED',
            cardId,
            `ATM limit: $${dailyAtmLimit}, Purchase limit: $${dailyPurchaseLimit}`,
          );
          return { ...c, dailyAtmLimit, dailyPurchaseLimit };
        }
        return c;
      }),
    );
  }

  setTravelNotice(cardId: string, destination: string, endDate: string) {
    this.cards.update((list) =>
      list.map((c) =>
        c.id === cardId
          ? {
              ...c,
              travelNoticeActive: true,
              travelDestination: destination,
              travelEndDate: endDate,
            }
          : c,
      ),
    );
  }

  // Mobile Check Deposit
  submitCheckDeposit(accountId: string, amount: number, frontImage: string, backImage: string): CheckDeposit {
    const deposit: CheckDeposit = {
      id: 'chk_' + Date.now(),
      userId: this.auth.currentUser()?.id || 'user_alex',
      accountId,
      amount,
      currency: 'USD',
      frontImagePreview: frontImage,
      backImagePreview: backImage,
      status: 'approved', // Instant simulated clearance in demo
      checkNumber: Math.floor(1000 + Math.random() * 9000).toString(),
      submittedAt: new Date().toISOString(),
      clearedAt: new Date().toISOString(),
    };

    this.checkDeposits.update((list) => [deposit, ...list]);

    // Atomic balance update
    this.accounts.update((list) =>
      list.map((a) => (a.id === accountId ? { ...a, balance: a.balance + amount, availableBalance: a.availableBalance + amount } : a)),
    );

    // Transaction item
    const tx: Transaction = {
      id: 'tx_dep_' + Date.now(),
      journalId: 'jrn_dep_' + Date.now(),
      userId: this.auth.currentUser()?.id || 'user_alex',
      sourceAccountId: accountId,
      type: 'deposit',
      amount,
      fee: 0,
      currency: 'USD',
      category: 'Income',
      status: 'settled',
      description: `Mobile Deposit - Check #${deposit.checkNumber}`,
      createdAt: deposit.submittedAt,
      settledAt: deposit.clearedAt,
      riskScore: 5,
    };
    this.transactions.update((txs) => [tx, ...txs]);

    this.logAuditEvent('CHECK_DEPOSITED', deposit.id, `Deposited $${amount} via mobile check #${deposit.checkNumber}`);
    return deposit;
  }

  // Simulated Stock Order
  executeSimulatedOrder(symbol: string, action: 'BUY' | 'SELL', shares: number): { success: boolean; error?: string } {
    const holding = this.holdings().find((h) => h.symbol === symbol);
    if (!holding) return { success: false, error: 'Asset not found.' };

    const totalCost = shares * holding.currentPrice;
    const investAcct = this.accounts().find((a) => a.type === 'investment');

    if (action === 'BUY') {
      if (investAcct && investAcct.availableBalance < totalCost) {
        return { success: false, error: 'Insufficient portfolio cash for this trade.' };
      }
      this.holdings.update((list) =>
        list.map((h) => (h.symbol === symbol ? { ...h, shares: h.shares + shares } : h)),
      );
    } else {
      if (holding.shares < shares) {
        return { success: false, error: `You only own ${holding.shares} shares of ${symbol}.` };
      }
      this.holdings.update((list) =>
        list.map((h) => (h.symbol === symbol ? { ...h, shares: h.shares - shares } : h)),
      );
    }

    return { success: true };
  }

  // Admin KYC Actions
  approveKyc(applicationId: string, reviewerName: string) {
    this.kycApplications.update((list) =>
      list.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: 'approved',
              reviewedBy: reviewerName,
              reviewedAt: new Date().toISOString(),
            }
          : app,
      ),
    );
    this.logAuditEvent('KYC_APPROVED', applicationId, `KYC application approved by ${reviewerName}`);
  }

  rejectKyc(applicationId: string, reviewerName: string, reason: string) {
    this.kycApplications.update((list) =>
      list.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: 'rejected',
              reviewNotes: reason,
              reviewedBy: reviewerName,
              reviewedAt: new Date().toISOString(),
            }
          : app,
      ),
    );
    this.logAuditEvent('KYC_REJECTED', applicationId, `KYC application rejected: ${reason}`);
  }

  // Admin Account Freeze
  adminToggleAccountFreeze(accountId: string) {
    this.accounts.update((list) =>
      list.map((a) => {
        if (a.id === accountId) {
          const nextStatus = a.status === 'active' ? 'frozen' : 'active';
          this.logAuditEvent('ACCOUNT_FROZEN', accountId, `Account ${a.name} status changed to ${nextStatus}`);
          return { ...a, status: nextStatus };
        }
        return a;
      }),
    );
  }

  // Admin Clear Flagged Transaction
  clearFlaggedTransaction(txId: string) {
    this.transactions.update((list) =>
      list.map((t) => (t.id === txId ? { ...t, status: 'settled', flagReason: 'Cleared by compliance officer review.' } : t)),
    );
  }

  // Update System Rates
  updateRates(newRates: Partial<RateConfig>) {
    this.rates.update((curr) => ({
      ...curr,
      ...newRates,
      lastUpdated: new Date().toISOString(),
    }));
    this.logAuditEvent('RATES_UPDATED', 'rates_global', 'System interest rate APY benchmarks updated');
  }

  // Create Support Message
  sendSupportMessage(ticketId: string, text: string) {
    const user = this.auth.currentUser();
    const senderName = user ? `${user.firstName} ${user.lastName}` : 'Customer';
    const newMsg = {
      id: 'msg_' + Date.now(),
      sender: (user?.role === 'admin' ? 'agent' : 'user') as 'user' | 'agent',
      senderName,
      text,
      timestamp: new Date().toISOString(),
    };

    this.tickets.update((list) =>
      list.map((t) => (t.id === ticketId ? { ...t, messages: [...t.messages, newMsg] } : t)),
    );
  }

  // Audit Logging
  private logAuditEvent(action: AuditLogItem['action'], targetEntityId: string, details: string) {
    const user = this.auth.currentUser();
    const item: AuditLogItem = {
      id: 'log_' + Date.now() + '_' + Math.floor(Math.random() * 100),
      timestamp: new Date().toISOString(),
      actorUserId: user ? user.userId : 'system',
      actorRole: user ? user.role : 'system',
      action,
      targetEntityId,
      details,
      ipAddress: '192.168.1.42',
    };
    this.auditLogs.update((logs) => [item, ...logs]);
  }
}
