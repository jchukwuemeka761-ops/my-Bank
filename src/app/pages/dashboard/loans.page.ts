import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {BankingService} from '../../services/banking.service';
import {LoanCalculatorComponent} from '../../components/public/loan-calculator.component';

@Component({
  selector: 'app-loans-page',
  imports: [FormsModule, MatIconModule, LoanCalculatorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8">
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Financing Hub</span>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Loans & Mortgages
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage active balances, calculate new terms, and submit fast digital pre-approvals.
        </p>
      </div>

      <!-- Active Loan Card -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Active Account</span>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Clean Energy EV Auto Loan</h3>
            <span class="text-xs text-slate-500 font-mono">Account ••••6012 &middot; 4.99% Fixed APR</span>
          </div>

          <span class="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
            Auto-Pay Active
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
            <span class="text-slate-400 block font-semibold">Remaining Principal</span>
            <strong class="text-lg text-slate-900 dark:text-white tabular-nums mt-1 block">
              {{ banking.formatMoney(18450.00) }}
            </strong>
          </div>

          <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
            <span class="text-slate-400 block font-semibold">Monthly Payment</span>
            <strong class="text-lg text-emerald-700 dark:text-emerald-400 tabular-nums mt-1 block">
              {{ banking.formatMoney(432.18) }}/mo
            </strong>
          </div>

          <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
            <span class="text-slate-400 block font-semibold">Next Payment Due</span>
            <strong class="text-sm text-slate-900 dark:text-white mt-1 block">
              November 25, 2026
            </strong>
          </div>

          <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
            <span class="text-slate-400 block font-semibold">Term Remaining</span>
            <strong class="text-sm text-slate-900 dark:text-white mt-1 block">
              34 of 48 Months
            </strong>
          </div>
        </div>

        <!-- Progress to Payoff -->
        <div class="space-y-1.5 pt-2">
          <div class="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>Payoff Progress (29% Repaid)</span>
            <span>$7,550 Paid of $26,000 Total</span>
          </div>
          <div class="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div class="h-full bg-emerald-600 rounded-full w-[29%]"></div>
          </div>
        </div>
      </div>

      <!-- Interactive Calculator Embed -->
      <app-loan-calculator></app-loan-calculator>

      <!-- Instant Pre-Approval Form -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Pre-Approval Engine</span>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Apply for Loan or Mortgage Pre-Approval
          </h3>
          <p class="text-xs text-slate-500">Soft credit inquiry only &middot; Will not impact your credit score</p>
        </div>

        @if (preApproved()) {
          <div class="p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-500 text-center space-y-3">
            <mat-icon class="text-emerald-600 text-4xl!">verified</mat-icon>
            <h4 class="text-lg font-bold text-emerald-950 dark:text-emerald-200">Congratulations! You Are Pre-Approved</h4>
            <p class="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
              Based on your verified banking relationship, you qualify for up to <strong>{{ banking.formatMoney(requestedAmount) }}</strong> at <strong>{{ estimatedApr }}% APR</strong>.
            </p>
            <div class="pt-2">
              <button
                type="button"
                (click)="preApproved.set(false)"
                class="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm"
              >
                Start Formal Underwriting File
              </button>
            </div>
          </div>
        } @else {
          <form (ngSubmit)="submitPreApproval()" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Loan Purpose</label>
              <select
                [(ngModel)]="loanType"
                name="loanType"
                class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
              >
                <option value="mortgage">Home Purchase Mortgage</option>
                <option value="refinance">Mortgage Refinance</option>
                <option value="auto">Electric Vehicle Auto Loan</option>
                <option value="business">Commercial Equipment Loan</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Requested Amount ($)</label>
              <input
                type="number"
                step="5000"
                min="10000"
                [(ngModel)]="requestedAmount"
                name="requestedAmount"
                required
                class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold tabular-nums"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Down Payment / Equity ($)</label>
              <input
                type="number"
                step="5000"
                min="0"
                [(ngModel)]="downPayment"
                name="downPayment"
                required
                class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold tabular-nums"
              />
            </div>

            <div class="sm:col-span-3 pt-2">
              <button
                type="submit"
                class="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-colors"
              >
                Check Instant Digital Pre-Approval
              </button>
            </div>
          </form>
        }
      </div>
    </div>
  `,
})
export class LoansPage {
  banking = inject(BankingService);

  loanType = 'mortgage';
  requestedAmount = 450000;
  downPayment = 90000;
  preApproved = signal<boolean>(false);
  estimatedApr = 6.45;

  submitPreApproval() {
    this.preApproved.set(true);
  }
}
