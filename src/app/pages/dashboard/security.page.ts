import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-security-page',
  imports: [FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8">
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Account Defense</span>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Security Center & Access Control
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review active authorization sessions, configure hardware authenticators, and manage phishing guards.
        </p>
      </div>

      <!-- Security Health Banner -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Security Score</span>
            <span class="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
              Excellent
            </span>
          </div>
          <div class="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">98 / 100</div>
          <p class="text-xs text-slate-500">
            Your account fulfills institutional defense standards with multi-factor OTP and tokenized card protection.
          </p>
        </div>

        <div class="w-full md:w-64 space-y-2">
          <div class="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div class="h-full bg-emerald-600 rounded-full w-[98%]"></div>
          </div>
          <span class="text-[11px] text-slate-400 block text-right">Last audited today</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <!-- Change Password Card -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div class="flex items-center gap-2">
            <mat-icon class="text-emerald-600">lock</mat-icon>
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Update Password</h3>
          </div>

          @if (passwordUpdated()) {
            <div class="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 text-xs text-emerald-900 dark:text-emerald-200">
              Password updated successfully!
            </div>
          }

          <form (ngSubmit)="updatePassword()" class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                [(ngModel)]="currentPw"
                name="currentPw"
                required
                class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">New Secure Password</label>
              <input
                type="password"
                [(ngModel)]="newPw"
                name="newPw"
                required
                class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <button
              type="submit"
              [disabled]="!currentPw || !newPw"
              class="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              Save New Password
            </button>
          </form>
        </div>

        <!-- 2FA & Anti-Phishing Setup -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div class="flex items-center gap-2">
            <mat-icon class="text-emerald-600">security</mat-icon>
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Multi-Factor Authentication</h3>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div class="flex items-center justify-between font-bold">
              <span>Primary 2FA Method</span>
              <span class="text-emerald-600 uppercase">SMS Passcode Active</span>
            </div>
            <p class="text-slate-500">
              One-time verification codes are dispatched to +1 (555) 234-5678 on every sign-in.
            </p>
          </div>

          <div class="pt-2 space-y-2">
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Anti-Phishing Phrase
            </label>
            <div class="flex items-center gap-2">
              <input
                type="text"
                [(ngModel)]="antiPhishing"
                name="antiPhishing"
                class="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
              />
              <button
                type="button"
                (click)="savePhrase()"
                class="px-3.5 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white text-xs font-semibold"
              >
                Save
              </button>
            </div>
            <span class="text-[10px] text-slate-400 block">
              Displayed on all official OTP challenges to prove origin legitimacy.
            </span>
          </div>
        </div>
      </div>

      <!-- Active Sessions & Trusted Devices -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 class="font-bold text-base text-slate-900 dark:text-white">Authorized Devices & Sessions</h3>

        <div class="space-y-3">
          @for (dev of devices(); track dev.name) {
            <div class="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-4 text-xs">
              <div class="flex items-center gap-3">
                <mat-icon class="text-slate-500 text-xl!">{{ dev.icon }}</mat-icon>
                <div>
                  <h4 class="font-bold text-slate-900 dark:text-white">{{ dev.name }}</h4>
                  <span class="text-slate-400">{{ dev.location }} &middot; {{ dev.lastActive }}</span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                @if (dev.isCurrent) {
                  <span class="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 font-bold text-[10px]">
                    Current Session
                  </span>
                } @else {
                  <button
                    type="button"
                    (click)="revokeDevice(dev.name)"
                    class="text-red-600 font-semibold hover:underline"
                  >
                    Revoke
                  </button>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class SecurityPage {
  auth = inject(AuthService);

  currentPw = '';
  newPw = '';
  passwordUpdated = signal<boolean>(false);
  antiPhishing = 'Golden Palm & Emerald Shield';

  devices = signal([
    { name: 'Chrome Browser on macOS (Current)', location: 'Atlanta, GA · IP 192.168.1.42', lastActive: 'Active now', icon: 'computer', isCurrent: true },
    { name: 'JF Mobile App on iPhone 16 Pro', location: 'Atlanta, GA · Face ID Verified', lastActive: '2 hours ago', icon: 'smartphone', isCurrent: false },
    { name: 'Safari on iPad Pro', location: 'Atlanta, GA', lastActive: 'Nov 3, 2026', icon: 'tablet', isCurrent: false },
  ]);

  updatePassword() {
    this.passwordUpdated.set(true);
    this.currentPw = '';
    this.newPw = '';
  }

  savePhrase() {
    const user = this.auth.currentUser();
    if (user) {
      user.antiPhishingPhrase = this.antiPhishing;
    }
  }

  revokeDevice(name: string) {
    this.devices.update((list) => list.filter((d) => d.name !== name));
  }
}
