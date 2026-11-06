import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {AuthService} from '../../services/auth.service';
import {BankingService} from '../../services/banking.service';

@Component({
  selector: 'app-demo-banner',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside
      aria-label="Demonstration environment notice"
      class="bg-amber-500/10 dark:bg-amber-500/20 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs px-3 py-1.5 transition-colors"
    >
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2 font-medium">
          <mat-icon class="text-sm! w-4! h-4! text-amber-600 dark:text-amber-400">info</mat-icon>
          <span class="font-semibold uppercase tracking-wide text-[11px] bg-amber-200 dark:bg-amber-900/60 px-1.5 py-0.5 rounded text-amber-800 dark:text-amber-300">
            DEMO MODE
          </span>
          <span>Demonstration environment. No real funds. Simulated transactions only.</span>
        </div>

        <div class="flex items-center gap-2">
          <!-- Currency Switcher -->
          <button
            type="button"
            (click)="banking.toggleCurrency()"
            class="px-2 py-0.5 rounded bg-white/70 dark:bg-slate-800 border border-amber-300 dark:border-amber-800 font-semibold text-[11px] hover:bg-white transition-colors"
            title="Toggle between USD and NGN"
          >
            Currency: <span class="text-emerald-700 dark:text-emerald-400">{{ banking.activeCurrency() }}</span>
          </button>

          <!-- Fast Role Switcher -->
          <div class="flex items-center gap-1 bg-white/70 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-800 text-[11px]">
            <span class="text-slate-500 dark:text-slate-400">Role:</span>
            <button
              type="button"
              (click)="auth.switchToCustomer()"
              [class.font-bold]="!auth.isAdmin()"
              [class.text-emerald-700]="!auth.isAdmin()"
              [class.dark:text-emerald-400]="!auth.isAdmin()"
              class="px-1.5 py-0.2 rounded hover:underline"
            >
              Customer
            </button>
            <span class="text-slate-300 dark:text-slate-600">|</span>
            <button
              type="button"
              (click)="auth.switchToAdmin()"
              [class.font-bold]="auth.isAdmin()"
              [class.text-emerald-700]="auth.isAdmin()"
              [class.dark:text-emerald-400]="auth.isAdmin()"
              class="px-1.5 py-0.2 rounded hover:underline"
            >
              Admin Portal
            </button>
          </div>

          <!-- Light/Dark Mode Switch -->
          <button
            type="button"
            (click)="auth.toggleDarkMode()"
            class="p-1 rounded bg-white/70 dark:bg-slate-800 hover:bg-white text-slate-700 dark:text-slate-200"
            [title]="auth.isDarkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            aria-label="Toggle theme"
          >
            <mat-icon class="text-sm! w-4! h-4!">{{ auth.isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>
        </div>
      </div>
    </aside>
  `,
})
export class DemoBannerComponent {
  auth = inject(AuthService);
  banking = inject(BankingService);
}
