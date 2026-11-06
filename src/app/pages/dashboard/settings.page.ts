import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {AuthService} from '../../services/auth.service';
import {BankingService} from '../../services/banking.service';

@Component({
  selector: 'app-settings-page',
  imports: [FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-8">
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Client Preferences</span>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Profile & Account Settings
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage personal contact records, notification matrices, and display preferences.
        </p>
      </div>

      <!-- Profile Contact Info -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 class="font-bold text-base text-slate-900 dark:text-white">Personal Contact Information</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Legal Name</label>
            <input
              type="text"
              [value]="auth.currentUser()?.firstName + ' ' + auth.currentUser()?.lastName"
              disabled
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Email Address</label>
            <input
              type="email"
              [value]="auth.currentUser()?.email"
              disabled
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Phone (2FA SMS)</label>
            <input
              type="tel"
              [value]="auth.currentUser()?.phone"
              disabled
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">KYC Compliance Status</label>
            <div class="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <mat-icon class="text-sm! w-4! h-4!">verified</mat-icon>
              <span>Fully Verified (Level 3 Clearance)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Display & Currency Preferences -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 class="font-bold text-base text-slate-900 dark:text-white">Localization & Theme</h3>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Preferred Currency -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Base Currency</label>
            <select
              [ngModel]="banking.activeCurrency()"
              (ngModelChange)="banking.setCurrency($event)"
              name="baseCurrency"
              class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
            >
              <option value="USD">USD ($ - United States Dollar)</option>
              <option value="NGN">NGN (₦ - Nigerian Naira)</option>
            </select>
          </div>

          <!-- Color Theme -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Interface Appearance</label>
            <div class="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                (click)="auth.setDarkMode(false)"
                class="flex-1 py-1 rounded-lg text-xs font-bold transition-all"
                [class]="!auth.isDarkMode() ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400'"
              >
                Light
              </button>
              <button
                type="button"
                (click)="auth.setDarkMode(true)"
                class="flex-1 py-1 rounded-lg text-xs font-bold transition-all"
                [class]="auth.isDarkMode() ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400'"
              >
                Dark
              </button>
            </div>
          </div>

          <!-- Language -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Portal Language</label>
            <select
              class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
            >
              <option value="en">English (United States)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Notifications Matrix -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 class="font-bold text-base text-slate-900 dark:text-white">Notification Matrix</h3>

        <div class="space-y-3 text-xs">
          <label class="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 cursor-pointer">
            <div>
              <span class="font-bold text-slate-900 dark:text-white block">Wire & Transfer Activity Alerts</span>
              <span class="text-slate-400">Receive instant SMS and email for all money movement over $500.</span>
            </div>
            <input type="checkbox" checked class="accent-emerald-600 rounded w-4 h-4" />
          </label>

          <label class="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 cursor-pointer">
            <div>
              <span class="font-bold text-slate-900 dark:text-white block">International Card Authorization Alerts</span>
              <span class="text-slate-400">Receive push notification whenever your card is swiped outside the US.</span>
            </div>
            <input type="checkbox" checked class="accent-emerald-600 rounded w-4 h-4" />
          </label>

          <label class="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 cursor-pointer">
            <div>
              <span class="font-bold text-slate-900 dark:text-white block">Monthly E-Statement Delivery</span>
              <span class="text-slate-400">Notify me as soon as monthly PDF statements are finalized.</span>
            </div>
            <input type="checkbox" checked class="accent-emerald-600 rounded w-4 h-4" />
          </label>
        </div>
      </div>

      <!-- Account Closure Request -->
      <div class="p-6 rounded-3xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 space-y-3">
        <h3 class="font-bold text-sm text-red-900 dark:text-red-200">Account Closure Request</h3>
        <p class="text-xs text-red-700 dark:text-red-300">
          Closing an account requires transferring all remaining ledger balances and settling pending card transactions.
        </p>
        <button
          type="button"
          (click)="showCloseModal.set(true)"
          class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-xs"
        >
          Request Account Closure
        </button>
      </div>
    </div>

    <!-- Close Modal -->
    @if (showCloseModal()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="close-modal-title"
      >
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
          <h3 id="close-modal-title" class="font-bold text-base text-slate-900 dark:text-white">Account Closure Inquiry</h3>
          <p class="text-xs text-slate-500">
            Because this is a demonstration environment with simulated assets, accounts remain active for testing. In production, a zero-balance certified check is mailed to your registered address.
          </p>
          <div class="flex justify-end pt-2">
            <button
              type="button"
              (click)="showCloseModal.set(false)"
              class="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold"
            >
              Understood
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class SettingsPage {
  auth = inject(AuthService);
  banking = inject(BankingService);

  showCloseModal = signal<boolean>(false);
}
