import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {AuthService} from '../../services/auth.service';
import {BankingService} from '../../services/banking.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, MatIconModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8">
      <!-- Anti-Phishing Security Banner -->
      <div class="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
          <mat-icon class="text-emerald-600 text-sm! w-4! h-4!">verified_user</mat-icon>
          <span>
            Security Verification: Your security phrase is
            <strong class="font-bold underline">&ldquo;{{ user()?.antiPhishingPhrase || 'Golden Palm & Emerald Shield' }}&rdquo;</strong>
          </span>
        </div>
        <div class="text-slate-500 dark:text-slate-400">
          Last login: <span class="font-medium text-slate-700 dark:text-slate-200">{{ user()?.lastLoginAt | date:'medium' }}</span>
          ({{ user()?.lastLoginIp }})
        </div>
      </div>

      <!-- Financial Net Worth & Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- Total Net Worth -->
        <div
          class="rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between"
          style="background: linear-gradient(135deg, #0B6B4F 0%, #084E3A 100%);"
        >
          <div>
            <span class="text-xs uppercase tracking-wider text-emerald-200 font-semibold block">Total Net Worth</span>
            <div class="text-3xl font-extrabold tracking-tight mt-1 tabular-nums">
              {{ banking.formatMoney(banking.netWorth()) }}
            </div>
          </div>
          <div class="flex items-center justify-between pt-4 mt-2 border-t border-white/10 text-xs text-emerald-200">
            <span>All 6 Connected Accounts</span>
            <span class="text-[#F2B632] font-bold">+4.8% YTD</span>
          </div>
        </div>

        <!-- Liquid Assets -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <span class="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">Liquid Cash & Savings</span>
            <div class="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
              {{ banking.formatMoney(banking.liquidAssets()) }}
            </div>
          </div>
          <div class="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center justify-between">
            <span>High-Yield (4.85% APY)</span>
            <mat-icon class="text-sm! w-4! h-4!">trending_up</mat-icon>
          </div>
        </div>

        <!-- Investment Portfolio -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <span class="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">Wealth & Equities</span>
            <div class="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
              {{ banking.formatMoney(banking.investmentTotal()) }}
            </div>
          </div>
          <div class="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center justify-between">
            <span>5 Active Holdings</span>
            <span class="tabular-nums">+1.42% Today</span>
          </div>
        </div>

        <!-- Total Liabilities -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <span class="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">Revolving & Loan Debt</span>
            <div class="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
              {{ banking.formatMoney(banking.totalDebt()) }}
            </div>
          </div>
          <div class="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Auto Loan + Card Balance</span>
            <span class="text-emerald-700 dark:text-emerald-400 font-semibold">In Good Standing</span>
          </div>
        </div>
      </div>

      <!-- Quick Action Shortcuts Bar -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div class="flex items-center justify-between mb-3 px-1">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Actions</span>
          <span class="text-xs text-slate-500 font-medium">Instant double-entry movement</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <a
            routerLink="/dashboard/transfers"
            class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-600 transition-all flex items-center gap-3 group"
          >
            <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
              <mat-icon class="text-xl!">swap_horiz</mat-icon>
            </div>
            <div>
              <span class="block text-sm font-bold text-slate-900 dark:text-white">Make Transfer</span>
              <span class="block text-[11px] text-slate-500 dark:text-slate-400">Own, P2P, or Wire</span>
            </div>
          </a>

          <a
            routerLink="/dashboard/bill-pay"
            class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-600 transition-all flex items-center gap-3 group"
          >
            <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-700 dark:text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
              <mat-icon class="text-xl!">receipt</mat-icon>
            </div>
            <div>
              <span class="block text-sm font-bold text-slate-900 dark:text-white">Pay a Bill</span>
              <span class="block text-[11px] text-slate-500 dark:text-slate-400">4 Active Payees</span>
            </div>
          </a>

          <a
            routerLink="/dashboard/deposit"
            class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-600 transition-all flex items-center gap-3 group"
          >
            <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-700 dark:text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
              <mat-icon class="text-xl!">camera_alt</mat-icon>
            </div>
            <div>
              <span class="block text-sm font-bold text-slate-900 dark:text-white">Deposit Check</span>
              <span class="block text-[11px] text-slate-500 dark:text-slate-400">Instant Mobile Capture</span>
            </div>
          </a>

          <a
            routerLink="/dashboard/cards"
            class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-600 transition-all flex items-center gap-3 group"
          >
            <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
              <mat-icon class="text-xl!">credit_card</mat-icon>
            </div>
            <div>
              <span class="block text-sm font-bold text-slate-900 dark:text-white">Card Controls</span>
              <span class="block text-[11px] text-slate-500 dark:text-slate-400">Freeze & Limits</span>
            </div>
          </a>
        </div>
      </div>

      <!-- Split View: Account Breakdown (7 cols) + Spending By Category Chart & Security Meter (5 cols) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Accounts Summary (7 cols) -->
        <div class="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 class="font-bold text-lg text-slate-900 dark:text-white">Your Bank Accounts</h3>
              <p class="text-xs text-slate-500">Live balance derived from double-entry ledger</p>
            </div>
            <a routerLink="/dashboard/accounts" class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
              View Transactions &rarr;
            </a>
          </div>

          <div class="space-y-3">
            @for (acct of banking.userAccounts(); track acct.id) {
              <div class="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100/60 transition-colors flex items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    [class]="acct.type === 'checking' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' :
                             acct.type === 'savings' ? 'bg-[#F2B632]/20 text-[#D4981E]' :
                             acct.type === 'credit_card' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400' :
                             acct.type === 'investment' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400' :
                             'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'"
                  >
                    <mat-icon class="text-xl!">
                      {{ acct.type === 'checking' ? 'account_balance' :
                         acct.type === 'savings' ? 'savings' :
                         acct.type === 'credit_card' ? 'credit_card' :
                         acct.type === 'investment' ? 'trending_up' : 'directions_car' }}
                    </mat-icon>
                  </div>
                  <div>
                    <h4 class="font-bold text-sm text-slate-900 dark:text-white">{{ acct.name }}</h4>
                    <span class="text-xs text-slate-500 font-mono">{{ acct.accountNumber }} · Routing 021000021</span>
                  </div>
                </div>

                <div class="text-right">
                  <div
                    class="font-extrabold text-base tabular-nums"
                    [class.text-red-600]="acct.balance < 0"
                    [class.text-slate-900]="acct.balance >= 0"
                    [class.dark:text-white]="acct.balance >= 0"
                  >
                    {{ banking.formatMoney(acct.balance) }}
                  </div>
                  @if (acct.interestRateApy) {
                    <span class="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      {{ acct.interestRateApy }}% APY
                    </span>
                  }
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Right Side: Spending By Category & Security Meter (5 cols) -->
        <div class="lg:col-span-5 space-y-6">
          <!-- Spending Breakdown Chart -->
          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 class="font-bold text-sm text-slate-900 dark:text-white">Monthly Spending Breakdown</h3>
              <span class="text-xs text-slate-400">November 2026</span>
            </div>

            <div class="space-y-3 pt-1">
              @for (cat of spendingBreakdown(); track cat.name) {
                <div class="space-y-1">
                  <div class="flex items-center justify-between text-xs font-semibold">
                    <span class="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span class="w-2.5 h-2.5 rounded-full" [style.background-color]="cat.color"></span>
                      <span>{{ cat.name }}</span>
                    </span>
                    <span class="tabular-nums text-slate-900 dark:text-white">{{ banking.formatMoney(cat.amount) }} ({{ cat.pct }}%)</span>
                  </div>
                  <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-300"
                      [style.background-color]="cat.color"
                      [style.width.%]="cat.pct"
                    ></div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Security Health Meter -->
          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-sm text-slate-900 dark:text-white">Account Security Meter</h3>
              <span class="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                98 / 100
              </span>
            </div>

            <div class="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div class="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full w-[98%]"></div>
            </div>

            <div class="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
              <div class="flex items-center gap-2">
                <mat-icon class="text-emerald-600 text-sm! w-4! h-4!">check_circle</mat-icon>
                <span>Two-Factor Authentication (OTP) active</span>
              </div>
              <div class="flex items-center gap-2">
                <mat-icon class="text-emerald-600 text-sm! w-4! h-4!">check_circle</mat-icon>
                <span>Anti-phishing security phrase set</span>
              </div>
              <div class="flex items-center gap-2">
                <mat-icon class="text-emerald-600 text-sm! w-4! h-4!">check_circle</mat-icon>
                <span>Passkey / Biometrics authorized on this device</span>
              </div>
            </div>

            <div class="pt-2">
              <a
                routerLink="/dashboard/security"
                class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Manage Security Settings</span>
                <mat-icon class="text-xs! w-3.5! h-3.5!">arrow_forward</mat-icon>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardPage {
  auth = inject(AuthService);
  banking = inject(BankingService);

  user = computed(() => this.auth.currentUser());

  spendingBreakdown = signal([
    { name: 'Housing & Rent', amount: 1850, pct: 52, color: '#0B6B4F' },
    { name: 'Groceries & Markets', amount: 540, pct: 15, color: '#10B981' },
    { name: 'Shopping & Home', amount: 410, pct: 12, color: '#F2B632' },
    { name: 'Dining & Cafes', amount: 280, pct: 8, color: '#8B5CF6' },
    { name: 'Utilities & Power', amount: 279, pct: 8, color: '#3B82F6' },
    { name: 'Transport & Transit', amount: 145, pct: 5, color: '#EC4899' },
  ]);
}
