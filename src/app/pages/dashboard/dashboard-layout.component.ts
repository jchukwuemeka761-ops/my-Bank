import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {AuthService} from '../../services/auth.service';
import {BankingService} from '../../services/banking.service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <!-- Top Client Greeting & Currency Bar -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Client Portal</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            Welcome, {{ auth.currentUser()?.firstName }} {{ auth.currentUser()?.lastName }}
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <!-- Currency Toggle Button -->
          <button
            type="button"
            (click)="banking.toggleCurrency()"
            class="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-600 transition-colors shadow-2xs flex items-center gap-1.5"
            title="Switch display currency"
          >
            <mat-icon class="text-sm! w-4! h-4! text-emerald-600">currency_exchange</mat-icon>
            <span>Currency:</span>
            <span class="text-emerald-700 dark:text-emerald-400">{{ banking.activeCurrency() }}</span>
          </button>

          <a
            routerLink="/dashboard/messages"
            class="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition-colors relative"
            title="Secure Support Messages"
          >
            <mat-icon class="text-lg! w-5! h-5!">mail</mat-icon>
            <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
          </a>
        </div>
      </div>

      <!-- Dashboard Navigation Tabs -->
      <nav class="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-bold scrollbar-none">
        <a
          routerLink="/dashboard"
          [routerLinkActiveOptions]="{exact: true}"
          routerLinkActive="bg-emerald-700 text-white shadow-xs"
          class="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1.5"
        >
          <mat-icon class="text-sm! w-4! h-4!">dashboard</mat-icon>
          <span>Overview</span>
        </a>

        <a
          routerLink="/dashboard/accounts"
          routerLinkActive="bg-emerald-700 text-white shadow-xs"
          class="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1.5"
        >
          <mat-icon class="text-sm! w-4! h-4!">account_balance</mat-icon>
          <span>Accounts & Statements</span>
        </a>

        <a
          routerLink="/dashboard/transfers"
          routerLinkActive="bg-emerald-700 text-white shadow-xs"
          class="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1.5"
        >
          <mat-icon class="text-sm! w-4! h-4!">swap_horiz</mat-icon>
          <span>Transfers & Wires</span>
        </a>

        <a
          routerLink="/dashboard/bill-pay"
          routerLinkActive="bg-emerald-700 text-white shadow-xs"
          class="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1.5"
        >
          <mat-icon class="text-sm! w-4! h-4!">receipt_long</mat-icon>
          <span>Bill Pay</span>
        </a>

        <a
          routerLink="/dashboard/cards"
          routerLinkActive="bg-emerald-700 text-white shadow-xs"
          class="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1.5"
        >
          <mat-icon class="text-sm! w-4! h-4!">credit_card</mat-icon>
          <span>Cards & Controls</span>
        </a>

        <a
          routerLink="/dashboard/deposit"
          routerLinkActive="bg-emerald-700 text-white shadow-xs"
          class="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1.5"
        >
          <mat-icon class="text-sm! w-4! h-4!">camera_alt</mat-icon>
          <span>Mobile Deposit</span>
        </a>

        <a
          routerLink="/dashboard/loans"
          routerLinkActive="bg-emerald-700 text-white shadow-xs"
          class="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1.5"
        >
          <mat-icon class="text-sm! w-4! h-4!">home</mat-icon>
          <span>Loans & Mortgages</span>
        </a>

        <a
          routerLink="/dashboard/investing"
          routerLinkActive="bg-emerald-700 text-white shadow-xs"
          class="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1.5"
        >
          <mat-icon class="text-sm! w-4! h-4!">trending_up</mat-icon>
          <span>Investing (Simulated)</span>
        </a>

        <a
          routerLink="/dashboard/budgeting"
          routerLinkActive="bg-emerald-700 text-white shadow-xs"
          class="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1.5"
        >
          <mat-icon class="text-sm! w-4! h-4!">pie_chart</mat-icon>
          <span>Budget & Goals</span>
        </a>

        <a
          routerLink="/dashboard/security"
          routerLinkActive="bg-emerald-700 text-white shadow-xs"
          class="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1.5"
        >
          <mat-icon class="text-sm! w-4! h-4!">shield</mat-icon>
          <span>Security Center</span>
        </a>

        <a
          routerLink="/dashboard/settings"
          routerLinkActive="bg-emerald-700 text-white shadow-xs"
          class="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1.5"
        >
          <mat-icon class="text-sm! w-4! h-4!">settings</mat-icon>
          <span>Settings</span>
        </a>
      </nav>

      <!-- Sub-view content -->
      <router-outlet></router-outlet>
    </div>
  `,
})
export class DashboardLayoutComponent {
  auth = inject(AuthService);
  banking = inject(BankingService);
}
