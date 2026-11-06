import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {BankingService} from '../../services/banking.service';

@Component({
  selector: 'app-bill-pay-page',
  imports: [FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Recurring Management</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Bill Pay & Scheduled Payments
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pay verified utility, mortgage, and telecom payees with automated delivery confirmations.
          </p>
        </div>

        <button
          type="button"
          (click)="showAddPayeeModal.set(true)"
          class="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm transition-colors flex items-center gap-1.5"
        >
          <mat-icon class="text-sm! w-4! h-4!">add</mat-icon>
          <span>Add New Payee</span>
        </button>
      </div>

      <!-- Quick Payment Execution Form -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 class="font-bold text-base text-slate-900 dark:text-white">Pay a Bill Online</h3>

        @if (paymentSuccess()) {
          <div class="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <mat-icon class="text-emerald-600">check_circle</mat-icon>
              <span>Bill payment for {{ lastPayeeName }} processed successfully.</span>
            </div>
            <button
              type="button"
              (click)="paymentSuccess.set(false)"
              class="font-bold underline"
            >
              Dismiss
            </button>
          </div>
        }

        <form (ngSubmit)="submitPayment()" class="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Payee</label>
            <select
              [(ngModel)]="selectedPayeeId"
              name="selectedPayeeId"
              class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
            >
              @for (payee of banking.payees(); track payee.id) {
                <option [value]="payee.id">{{ payee.name }} ({{ payee.category }})</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">From Account</label>
            <select
              [(ngModel)]="sourceAccountId"
              name="sourceAccountId"
              class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
            >
              @for (acct of banking.userAccounts(); track acct.id) {
                <option [value]="acct.id">{{ acct.name }}</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="1"
              [(ngModel)]="paymentAmount"
              name="paymentAmount"
              required
              class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold tabular-nums"
            />
          </div>

          <div>
            <button
              type="submit"
              [disabled]="paymentAmount <= 0"
              class="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-colors"
            >
              Submit Payment
            </button>
          </div>
        </form>
      </div>

      <!-- Payee Catalog Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (payee of banking.payees(); track payee.id) {
          <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                <mat-icon class="text-xl!">domain</mat-icon>
              </div>
              <div>
                <h4 class="font-bold text-sm text-slate-900 dark:text-white">{{ payee.name }}</h4>
                <span class="text-xs text-slate-500">{{ payee.category }} &middot; Acct {{ payee.accountNumberMasked }}</span>
                @if (payee.lastPaidDate) {
                  <span class="block text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5 font-medium">
                    Last paid: {{ payee.lastPaidDate }}
                  </span>
                }
              </div>
            </div>

            <div class="text-right">
              @if (payee.autoPayEnabled) {
                <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <mat-icon class="text-xs! w-3! h-3!">autorenew</mat-icon>
                  Auto-Pay
                </span>
                <span class="block text-xs font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">
                  {{ banking.formatMoney(payee.autoPayAmount || 0) }}
                </span>
              } @else {
                <span class="text-xs text-slate-400">Manual</span>
              }
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Add Payee Modal -->
    @if (showAddPayeeModal()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payee-modal-title"
      >
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 id="payee-modal-title" class="font-bold text-base text-slate-900 dark:text-white">Add New Payee</h3>
            <button
              type="button"
              (click)="showAddPayeeModal.set(false)"
              class="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <mat-icon class="text-lg!">close</mat-icon>
            </button>
          </div>

          <form (ngSubmit)="savePayee()" class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company / Payee Name</label>
              <input
                type="text"
                [(ngModel)]="newPayeeName"
                name="newPayeeName"
                placeholder="e.g. Metro Fiber Internet"
                required
                class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                [(ngModel)]="newPayeeCategory"
                name="newPayeeCategory"
                class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                <option value="Utilities">Utilities</option>
                <option value="Housing">Housing & HOA</option>
                <option value="Telecommunications">Telecommunications</option>
                <option value="Insurance">Insurance</option>
                <option value="Credit">Credit Card</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Payee Account Number</label>
              <input
                type="text"
                [(ngModel)]="newPayeeAccount"
                name="newPayeeAccount"
                placeholder="e.g. 9812-441-209"
                required
                class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div class="pt-2">
              <button
                type="submit"
                [disabled]="!newPayeeName.trim()"
                class="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-colors"
              >
                Save Payee
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class BillPayPage {
  banking = inject(BankingService);

  selectedPayeeId = 'payee_01';
  sourceAccountId = 'acc_checking';
  paymentAmount = 215.30;
  paymentSuccess = signal<boolean>(false);
  lastPayeeName = '';

  showAddPayeeModal = signal<boolean>(false);
  newPayeeName = '';
  newPayeeCategory = 'Utilities';
  newPayeeAccount = '';

  submitPayment() {
    const payee = this.banking.payees().find((p) => p.id === this.selectedPayeeId);
    if (!payee) return;

    this.lastPayeeName = payee.name;
    const res = this.banking.payBill({
      payeeId: this.selectedPayeeId,
      sourceAccountId: this.sourceAccountId,
      amount: this.paymentAmount,
      paymentDate: new Date().toISOString().split('T')[0],
    });

    if (res.success) {
      this.paymentSuccess.set(true);
    }
  }

  savePayee() {
    if (!this.newPayeeName.trim()) return;
    this.banking.addPayee(this.newPayeeName, this.newPayeeCategory, this.newPayeeAccount);
    this.showAddPayeeModal.set(false);
    this.newPayeeName = '';
    this.newPayeeAccount = '';
  }
}
