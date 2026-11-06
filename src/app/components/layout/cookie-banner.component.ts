import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-cookie-banner',
  imports: [RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!dismissed()) {
      <div
        class="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 dark:bg-black/95 text-slate-200 border-t border-slate-800 p-4 backdrop-blur-md transition-transform animate-in slide-in-from-bottom-4 duration-300"
        role="region"
        aria-label="Privacy and cookies"
      >
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-start gap-3">
            <mat-icon class="text-emerald-400 text-lg! w-5! h-5! shrink-0 mt-0.5">cookie</mat-icon>
            <p class="text-xs text-slate-300 leading-relaxed">
              JChukwuemeka's Financials uses essential cookies for secure authentication, fraud detection, and transaction integrity. We never sell your personal financial data. By continuing, you agree to our
              <a routerLink="/help" class="text-emerald-400 hover:underline">Privacy Policy</a> and
              <a routerLink="/help" class="text-emerald-400 hover:underline">Security Standards</a>.
            </p>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              (click)="dismiss()"
              class="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
            >
              Accept Essential Cookies
            </button>
            <button
              type="button"
              (click)="dismiss()"
              class="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              Preferences
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class CookieBannerComponent {
  dismissed = signal<boolean>(false);

  dismiss() {
    this.dismissed.set(true);
  }
}
