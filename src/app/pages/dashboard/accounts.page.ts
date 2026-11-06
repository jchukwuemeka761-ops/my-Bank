import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {AuthService} from '../../services/auth.service';
import {BankingService} from '../../services/banking.service';

@Component({
  selector: 'app-accounts-page',
  imports: [DatePipe, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Account Selection Cards -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Select Account</span>
          <button
            type="button"
            (click)="showStatementModal.set(true)"
            class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <mat-icon class="text-sm! w-4! h-4!">picture_as_pdf</mat-icon>
            <span>View Official E-Statement (PDF)</span>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (acct of banking.userAccounts(); track acct.id) {
            <div
              (click)="selectedAccountId.set(acct.id)"
              class="p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between"
              [class]="selectedAccountId() === acct.id ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h4 class="font-bold text-sm text-slate-900 dark:text-white">{{ acct.name }}</h4>
                  <span class="text-xs text-slate-500 font-mono">{{ acct.accountNumber }}</span>
                </div>
                <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                  [class]="acct.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 text-red-700'">
                  {{ acct.status }}
                </span>
              </div>

              <div class="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-end justify-between">
                <div>
                  <span class="text-[10px] uppercase text-slate-400 block font-semibold">Current Balance</span>
                  <div
                    class="text-xl font-extrabold tabular-nums"
                    [class.text-red-600]="acct.balance < 0"
                    [class.text-slate-900]="acct.balance >= 0"
                    [class.dark:text-white]="acct.balance >= 0"
                  >
                    {{ banking.formatMoney(acct.balance) }}
                  </div>
                </div>

                @if (acct.interestRateApy) {
                  <span class="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {{ acct.interestRateApy }}% APY
                  </span>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Account Details Banner -->
      @if (activeAccount(); as current) {
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div class="space-y-1">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">{{ current.name }} Credentials</span>
            <div class="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
              <div class="flex items-center gap-1.5 font-mono">
                <span class="text-slate-500">Account:</span>
                <strong class="text-slate-900 dark:text-white">{{ revealNumber() ? '0210' + current.accountNumber.replace('••••', '') : current.accountNumber }}</strong>
                <button
                  type="button"
                  (click)="revealNumber.set(!revealNumber())"
                  class="text-slate-400 hover:text-slate-600 p-0.5"
                  title="Toggle account number"
                >
                  <mat-icon class="text-xs! w-3.5! h-3.5!">{{ revealNumber() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </div>

              <div class="flex items-center gap-1.5 font-mono">
                <span class="text-slate-500">Routing Number:</span>
                <strong class="text-slate-900 dark:text-white">{{ current.routingNumber }}</strong>
              </div>

              <div class="flex items-center gap-1.5">
                <span class="text-slate-500">Available Balance:</span>
                <strong class="text-emerald-700 dark:text-emerald-400 tabular-nums">{{ banking.formatMoney(current.availableBalance) }}</strong>
              </div>
            </div>
          </div>

          <!-- CSV Export Button -->
          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="exportCsv()"
              class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <mat-icon class="text-sm! w-4! h-4!">file_download</mat-icon>
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      }

      <!-- Transactions Ledger Table -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <!-- Filter Bar -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div class="relative flex-1 max-w-sm">
            <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm! w-4! h-4!">search</mat-icon>
            <input
              type="text"
              [value]="searchQuery()"
              (input)="searchQuery.set($any($event.target).value); currentPage.set(1)"
              placeholder="Search descriptions, amounts, payees..."
              class="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
            />
          </div>

          <div class="flex items-center gap-2">
            <select
              [value]="selectedCategory()"
              (change)="selectedCategory.set($any($event.target).value); currentPage.set(1)"
              class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Categories</option>
              <option value="Income">Income / Payroll</option>
              <option value="Transfer">Transfers</option>
              <option value="Groceries">Groceries</option>
              <option value="Dining">Dining</option>
              <option value="Utilities">Utilities</option>
              <option value="Housing">Housing</option>
            </select>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th class="py-3 px-3">Date</th>
                <th class="py-3 px-3">Description</th>
                <th class="py-3 px-3">Category</th>
                <th class="py-3 px-3">Status</th>
                <th class="py-3 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              @for (tx of paginatedTransactions(); track tx.id) {
                <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td class="py-3.5 px-3 text-slate-500 whitespace-nowrap">{{ tx.createdAt | date:'mediumDate' }}</td>
                  <td class="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">
                    {{ tx.description }}
                    @if (tx.destinationName) {
                      <span class="block text-[10px] text-slate-400 font-normal">To: {{ tx.destinationName }}</span>
                    }
                  </td>
                  <td class="py-3.5 px-3">
                    <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                      {{ tx.category }}
                    </span>
                  </td>
                  <td class="py-3.5 px-3">
                    <span
                      class="px-2 py-0.5 rounded-full font-bold uppercase text-[10px]"
                      [class]="tx.status === 'settled' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                               tx.status === 'flagged' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                               'bg-blue-100 text-blue-800'"
                    >
                      {{ tx.status }}
                    </span>
                  </td>
                  <td class="py-3.5 px-3 text-right font-extrabold tabular-nums whitespace-nowrap text-sm"
                    [class.text-emerald-600]="tx.type === 'deposit' || tx.type === 'interest'"
                    [class.text-slate-900]="tx.type !== 'deposit' && tx.type !== 'interest'"
                    [class.dark:text-white]="tx.type !== 'deposit' && tx.type !== 'interest'"
                  >
                    {{ tx.type === 'deposit' || tx.type === 'interest' ? '+' : '-' }}{{ banking.formatMoney(tx.amount) }}
                  </td>
                </tr>
              }

              @if (paginatedTransactions().length === 0) {
                <tr>
                  <td colspan="5" class="py-8 text-center text-slate-400">
                    No transactions found for this account or search query.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <span>Showing {{ paginatedTransactions().length }} of {{ filteredTransactions().length }} records</span>
          <div class="flex items-center gap-1">
            <button
              type="button"
              [disabled]="currentPage() === 1"
              (click)="currentPage.set(currentPage() - 1)"
              class="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30"
            >
              Previous
            </button>
            <span class="px-2 font-bold">{{ currentPage() }}</span>
            <button
              type="button"
              [disabled]="paginatedTransactions().length < pageSize"
              (click)="currentPage.set(currentPage() + 1)"
              class="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Official E-Statement Modal (PDF Printable Format) -->
    @if (showStatementModal()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stmt-title"
      >
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <mat-icon class="text-emerald-600 text-2xl!">description</mat-icon>
              <div>
                <h3 id="stmt-title" class="font-bold text-lg text-slate-900 dark:text-white">
                  Official Electronic Statement
                </h3>
                <span class="text-xs text-slate-500">Statement Period: October 01, 2026 – October 31, 2026</span>
              </div>
            </div>
            <button
              type="button"
              (click)="showStatementModal.set(false)"
              class="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <mat-icon class="text-xl!">close</mat-icon>
            </button>
          </div>

          <!-- Document Header -->
          <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <div class="flex justify-between font-bold">
              <span>JChukwuemeka's Financials, Member FDIC</span>
              <span>Account Number: ••••4821</span>
            </div>
            <div class="flex justify-between text-slate-500">
              <span>100 Peachtree St NW, Atlanta, GA 30303</span>
              <span>Account Holder: Alex Chukwuemeka</span>
            </div>
          </div>

          <!-- Summary Matrix -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span class="text-slate-400 block">Starting Balance</span>
              <strong class="text-sm tabular-nums">{{ banking.formatMoney(11850.50) }}</strong>
            </div>
            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span class="text-slate-400 block">Total Deposits</span>
              <strong class="text-sm text-emerald-600 tabular-nums">+{{ banking.formatMoney(6650.00) }}</strong>
            </div>
            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span class="text-slate-400 block">Total Withdrawals</span>
              <strong class="text-sm text-red-600 tabular-nums">-{{ banking.formatMoney(4249.70) }}</strong>
            </div>
            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span class="text-slate-400 block">Ending Balance</span>
              <strong class="text-sm tabular-nums">{{ banking.formatMoney(14250.80) }}</strong>
            </div>
          </div>

          <div class="pt-2 text-center">
            <button
              type="button"
              (click)="printStatement()"
              class="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm transition-colors flex items-center gap-2 mx-auto"
            >
              <mat-icon class="text-sm! w-4! h-4!">print</mat-icon>
              <span>Print or Save PDF Document</span>
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class AccountsPage {
  auth = inject(AuthService);
  banking = inject(BankingService);

  selectedAccountId = signal<string>('acc_checking');
  revealNumber = signal<boolean>(false);
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('all');
  currentPage = signal<number>(1);
  pageSize = 8;
  showStatementModal = signal<boolean>(false);

  activeAccount = computed(() => {
    return this.banking.userAccounts().find((a) => a.id === this.selectedAccountId()) || this.banking.userAccounts()[0];
  });

  filteredTransactions = computed(() => {
    const acctId = this.selectedAccountId();
    let txs = this.banking.userTransactions().filter((t) => t.sourceAccountId === acctId || t.destinationAccountId === acctId);

    const q = this.searchQuery().trim().toLowerCase();
    if (q) {
      txs = txs.filter((t) => t.description.toLowerCase().includes(q) || t.amount.toString().includes(q));
    }

    if (this.selectedCategory() !== 'all') {
      txs = txs.filter((t) => t.category === this.selectedCategory());
    }

    return txs;
  });

  paginatedTransactions = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredTransactions().slice(start, start + this.pageSize);
  });

  exportCsv() {
    const txs = this.filteredTransactions();
    const rows = [
      ['Date', 'Description', 'Category', 'Status', 'Amount', 'Currency'],
      ...txs.map((t) => [t.createdAt, `"${t.description}"`, t.category, t.status, t.amount, t.currency]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `JF_Transactions_${this.selectedAccountId()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  printStatement() {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
