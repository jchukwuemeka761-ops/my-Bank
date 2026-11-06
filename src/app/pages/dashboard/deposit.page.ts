import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {BankingService} from '../../services/banking.service';
import {CheckDeposit} from '../../types/banking.types';

@Component({
  selector: 'app-deposit-page',
  imports: [FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-3xl mx-auto space-y-8">
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Mobile Express</span>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Mobile Check Deposit
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Deposit checks anytime from your phone or browser with automated OCR MICR validation.
        </p>
      </div>

      <!-- Deposit Success Banner -->
      @if (lastDeposit(); as dep) {
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-500 shadow-xl space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <mat-icon class="text-3xl!">task_alt</mat-icon>
            </div>
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Deposit Submitted & Approved</span>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white">Funds Credited to Your Account</h3>
            </div>
          </div>

          <div class="p-4 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-800 space-y-2 text-xs">
            <div class="flex justify-between">
              <span class="text-slate-500">Check Reference:</span>
              <strong class="font-mono text-slate-900 dark:text-white">#{{ dep.checkNumber }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Credited Amount:</span>
              <strong class="text-base text-emerald-800 dark:text-emerald-200 tabular-nums">{{ banking.formatMoney(dep.amount) }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Availability:</span>
              <span class="font-semibold text-emerald-700 dark:text-emerald-400">Immediate (Simulated Demo Clearance)</span>
            </div>
          </div>

          <div class="pt-2 flex justify-end">
            <button
              type="button"
              (click)="lastDeposit.set(null)"
              class="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              Deposit Another Check
            </button>
          </div>
        </div>
      } @else {
        <!-- Check Capture Form -->
        <form (ngSubmit)="submitCheck()" class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Deposit To Account</label>
              <select
                [(ngModel)]="targetAccountId"
                name="targetAccountId"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              >
                @for (acct of eligibleAccounts(); track acct.id) {
                  <option [value]="acct.id">{{ acct.name }} ({{ acct.accountNumber }})</option>
                }
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Check Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="5"
                [(ngModel)]="amount"
                name="amount"
                placeholder="1250.00"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm tabular-nums"
              />
            </div>
          </div>

          <!-- Front & Back Capture Simulated Viewports -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Front of Check -->
            <div class="space-y-2">
              <span class="block text-xs font-bold text-slate-700 dark:text-slate-300">Front of Check</span>
              <button
                type="button"
                (click)="simulateFrontCapture()"
                class="w-full h-44 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors relative overflow-hidden"
                [class]="frontCaptured() ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' : 'border-slate-300 dark:border-slate-700 hover:border-emerald-600 bg-slate-50 dark:bg-slate-800/40'"
              >
                @if (frontCaptured()) {
                  <mat-icon class="text-emerald-600 text-3xl! mb-1">check_circle</mat-icon>
                  <span class="font-bold text-xs text-emerald-900 dark:text-emerald-200">Front Image Captured</span>
                  <span class="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono mt-1">MICR: ⑆021000021⑆ 1042⑈</span>
                } @else {
                  <mat-icon class="text-slate-400 text-3xl! mb-1">photo_camera</mat-icon>
                  <span class="font-semibold text-xs text-slate-700 dark:text-slate-300">Tap to Capture Front</span>
                  <span class="text-[10px] text-slate-400 mt-0.5">Ensure all 4 corners and MICR line are visible</span>
                }
              </button>
            </div>

            <!-- Back of Check -->
            <div class="space-y-2">
              <span class="block text-xs font-bold text-slate-700 dark:text-slate-300">Back of Check (Endorsed)</span>
              <button
                type="button"
                (click)="simulateBackCapture()"
                class="w-full h-44 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors relative overflow-hidden"
                [class]="backCaptured() ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' : 'border-slate-300 dark:border-slate-700 hover:border-emerald-600 bg-slate-50 dark:bg-slate-800/40'"
              >
                @if (backCaptured()) {
                  <mat-icon class="text-emerald-600 text-3xl! mb-1">check_circle</mat-icon>
                  <span class="font-bold text-xs text-emerald-900 dark:text-emerald-200">Back Image & Endorsement Verified</span>
                  <span class="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono mt-1">&ldquo;For Mobile Deposit Only at JF&rdquo;</span>
                } @else {
                  <mat-icon class="text-slate-400 text-3xl! mb-1">photo_camera</mat-icon>
                  <span class="font-semibold text-xs text-slate-700 dark:text-slate-300">Tap to Capture Back</span>
                  <span class="text-[10px] text-slate-400 mt-0.5">Endorse with signature & &ldquo;For Mobile Deposit Only at JF&rdquo;</span>
                }
              </button>
            </div>
          </div>

          <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500 space-y-1">
            <p><strong>Daily Deposit Limit:</strong> Up to $25,000.00 daily for verified clients.</p>
            <p><strong>Availability:</strong> Checks submitted before 8:00 PM EST credit the next business day morning.</p>
          </div>

          <button
            type="submit"
            [disabled]="amount <= 0 || !frontCaptured() || !backCaptured()"
            class="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <span>Verify & Submit Check Deposit</span>
            <mat-icon class="text-sm! w-4! h-4!">upload</mat-icon>
          </button>
        </form>
      }
    </div>
  `,
})
export class DepositPage {
  banking = inject(BankingService);

  targetAccountId = 'acc_checking';
  amount = 1250.00;
  frontCaptured = signal<boolean>(true);
  backCaptured = signal<boolean>(true);
  lastDeposit = signal<CheckDeposit | null>(null);

  eligibleAccounts = computed(() => {
    return this.banking.userAccounts().filter((a) => a.type === 'checking' || a.type === 'savings');
  });

  simulateFrontCapture() {
    this.frontCaptured.set(true);
  }

  simulateBackCapture() {
    this.backCaptured.set(true);
  }

  submitCheck() {
    if (this.amount <= 0 || !this.frontCaptured() || !this.backCaptured()) return;

    const dep = this.banking.submitCheckDeposit(
      this.targetAccountId,
      this.amount,
      'simulated_front.jpg',
      'simulated_back.jpg',
    );
    this.lastDeposit.set(dep);
  }
}
