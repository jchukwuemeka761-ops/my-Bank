import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-forgot-credentials-page',
  imports: [RouterLink, FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-md mx-auto px-4 py-12">
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Account Recovery</span>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {{ mode() === 'password' ? 'Reset Your Password' : 'Find Your User ID' }}
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Verify your identity with registered contact details to regain account access.
          </p>
        </div>

        <div class="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            (click)="mode.set('password')"
            class="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
            [class]="mode() === 'password' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'"
          >
            Reset Password
          </button>
          <button
            type="button"
            (click)="mode.set('userId')"
            class="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
            [class]="mode() === 'userId' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'"
          >
            Recover User ID
          </button>
        </div>

        @if (sent()) {
          <div class="p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <mat-icon class="text-emerald-600 text-4xl!">mark_email_read</mat-icon>
            <h3 class="font-bold text-base text-emerald-950 dark:text-emerald-200">Instructions Dispatched</h3>
            <p class="text-xs text-emerald-800 dark:text-emerald-300">
              We dispatched verification instructions to <strong>{{ email }}</strong>. For demo testing: your demo User ID is <code>alex.chukwuemeka</code>.
            </p>
            <div class="pt-2">
              <a
                routerLink="/sign-in"
                class="inline-block px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm transition-colors"
              >
                Return to Sign In
              </a>
            </div>
          </div>
        } @else {
          <form (ngSubmit)="submitRecovery()" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {{ mode() === 'password' ? 'User ID or Email' : 'Registered Email Address' }}
              </label>
              <input
                type="text"
                [(ngModel)]="email"
                name="email"
                placeholder="alex.chukwuemeka@example.com"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Last 4 digits of SSN/TIN</label>
              <input
                type="text"
                maxlength="4"
                [(ngModel)]="ssnLast4"
                name="ssnLast4"
                placeholder="4821"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <button
              type="submit"
              [disabled]="!email.trim() || ssnLast4.length < 4"
              class="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-colors"
            >
              Send Secure Recovery Link
            </button>
          </form>

          <div class="text-center pt-2 text-xs text-slate-500">
            <a routerLink="/sign-in" class="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">
              &larr; Back to Sign In
            </a>
          </div>
        }
      </div>
    </div>
  `,
})
export class ForgotCredentialsPage {
  mode = signal<'password' | 'userId'>('password');
  email = 'alex.chukwuemeka@example.com';
  ssnLast4 = '4821';
  sent = signal<boolean>(false);

  submitRecovery() {
    this.sent.set(true);
  }
}
