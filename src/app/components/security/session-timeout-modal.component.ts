import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-session-timeout-modal',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (auth.inactivityWarningVisible()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="timeout-title"
      >
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-center space-y-4">
          <div class="mx-auto w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <mat-icon class="text-2xl!">timer</mat-icon>
          </div>

          <h3 id="timeout-title" class="text-lg font-bold text-slate-900 dark:text-white">
            Security Inactivity Notice
          </h3>

          <p class="text-sm text-slate-600 dark:text-slate-300">
            For your security, JChukwuemeka's Financials sessions automatically expire after 10 minutes of inactivity.
          </p>

          <div class="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/40">
            <span class="text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300 font-semibold block">Auto-Sign Out In</span>
            <span class="text-3xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
              00:{{ auth.secondsUntilAutoLogout() < 10 ? '0' : '' }}{{ auth.secondsUntilAutoLogout() }}
            </span>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button
              type="button"
              (click)="auth.logout()"
              class="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Sign Out Now
            </button>
            <button
              type="button"
              (click)="auth.extendSession()"
              class="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <mat-icon class="text-sm! w-4! h-4!">lock_open</mat-icon>
              Continue Session
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class SessionTimeoutModalComponent {
  auth = inject(AuthService);
}
