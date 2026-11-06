import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {BankingService} from '../../services/banking.service';

@Component({
  selector: 'app-transfers-page',
  imports: [ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-3xl mx-auto space-y-8">
      <!-- Title -->
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Money Movement</span>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Transfers & Wire Hub
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Atomic double-entry ledger transfers protected by client-generated idempotency keys.
        </p>
      </div>

      <!-- Transfer Type Switcher -->
      <div class="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
        <button
          type="button"
          (click)="transferType.set('internal')"
          class="flex-1 py-2 text-xs font-bold rounded-xl transition-all"
          [class]="transferType() === 'internal' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'"
        >
          Between Own Accounts
        </button>
        <button
          type="button"
          (click)="transferType.set('p2p')"
          class="flex-1 py-2 text-xs font-bold rounded-xl transition-all"
          [class]="transferType() === 'p2p' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'"
        >
          To Another Customer (P2P)
        </button>
        <button
          type="button"
          (click)="transferType.set('external')"
          class="flex-1 py-2 text-xs font-bold rounded-xl transition-all"
          [class]="transferType() === 'external' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'"
        >
          External Bank (ACH)
        </button>
      </div>

      <!-- Receipt Confirmation Modal / Banner -->
      @if (receipt(); as r) {
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-500 shadow-xl space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <mat-icon class="text-3xl!">check_circle</mat-icon>
            </div>
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Transfer Completed</span>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white">Funds Successfully Dispatched</h3>
            </div>
          </div>

          <div class="p-4 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-800 space-y-2 text-xs">
            <div class="flex justify-between">
              <span class="text-slate-500">Transaction ID:</span>
              <span class="font-mono font-bold text-slate-900 dark:text-white">{{ r.transactionId }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Amount Transferred:</span>
              <strong class="text-base text-emerald-800 dark:text-emerald-200 tabular-nums">{{ banking.formatMoney(r.amount) }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Recipient / Destination:</span>
              <span class="font-semibold text-slate-900 dark:text-white">{{ r.destination }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Idempotency Key:</span>
              <span class="font-mono text-[10px] text-slate-400 truncate max-w-xs">{{ r.idempotencyKey }}</span>
            </div>
          </div>

          <div class="pt-2 flex justify-end">
            <button
              type="button"
              (click)="receipt.set(null)"
              class="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              Make Another Transfer
            </button>
          </div>
        </div>
      } @else {
        <!-- Transfer Form -->
        <form [formGroup]="transferForm" (ngSubmit)="initiateTransfer()" class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          @if (errorMessage()) {
            <div class="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <mat-icon class="text-sm! w-4! h-4!">error</mat-icon>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Source Account -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">From Account</label>
              <select
                formControlName="sourceAccountId"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              >
                @for (acct of eligibleSources(); track acct.id) {
                  <option [value]="acct.id">
                    {{ acct.name }} ({{ banking.formatMoney(acct.availableBalance) }})
                  </option>
                }
              </select>
            </div>

            <!-- Destination Account (Internal) -->
            @if (transferType() === 'internal') {
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">To Account</label>
                <select
                  formControlName="destAccountId"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                >
                  @for (acct of eligibleDestinations(); track acct.id) {
                    <option [value]="acct.id">{{ acct.name }} ({{ acct.accountNumber }})</option>
                  }
                </select>
              </div>
            }

            <!-- Destination P2P -->
            @if (transferType() === 'p2p') {
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Recipient Email or Phone</label>
                <input
                  type="text"
                  formControlName="p2pRecipient"
                  placeholder="ifeoma@example.com or (555) 987-6543"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>
            }

            <!-- Destination External ACH -->
            @if (transferType() === 'external') {
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">External Bank & Account</label>
                <input
                  type="text"
                  formControlName="externalBankDetails"
                  placeholder="Chase Bank (Routing 021000021, Acct ••••8821)"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>
            }
          </div>

          <!-- Amount & Schedule -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Transfer Amount ({{ banking.activeCurrency() }})</label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  formControlName="transferAmount"
                  placeholder="500.00"
                  required
                  class="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm tabular-nums"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Frequency</label>
              <select
                formControlName="frequency"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                <option value="one_time">Immediate (One-Time)</option>
                <option value="weekly">Weekly Recurring</option>
                <option value="monthly">Monthly Recurring (1st of Month)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Transfer Memo / Note</label>
            <input
              type="text"
              formControlName="memo"
              placeholder="e.g. November Savings Allocation"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div class="pt-2">
            <button
              type="submit"
              [disabled]="(transferForm.value.transferAmount ?? 0) <= 0"
              class="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>Authorize & Execute Transfer</span>
              <mat-icon class="text-sm! w-4! h-4!">send</mat-icon>
            </button>
          </div>
        </form>
      }
    </div>
  `,
})
export class TransfersPage {
  banking = inject(BankingService);

  transferType = signal<'internal' | 'p2p' | 'external'>('internal');
  errorMessage = signal<string | null>(null);

  transferForm = new FormGroup({
    sourceAccountId: new FormControl('acc_checking', {nonNullable: true}),
    destAccountId: new FormControl('acc_savings', {nonNullable: true}),
    p2pRecipient: new FormControl('ifeoma.chukwuemeka@example.com', {nonNullable: true}),
    externalBankDetails: new FormControl('JPMorgan Chase (Acct ••••8812)', {nonNullable: true}),
    transferAmount: new FormControl(500, {nonNullable: true, validators: [Validators.min(1)]}),
    frequency: new FormControl('one_time', {nonNullable: true}),
    memo: new FormControl('Monthly Savings Transfer', {nonNullable: true}),
  });

  receipt = signal<{
    transactionId: string;
    amount: number;
    destination: string;
    idempotencyKey: string;
  } | null>(null);

  eligibleSources = computed(() => {
    return this.banking.userAccounts().filter((a) => a.type === 'checking' || a.type === 'savings');
  });

  eligibleDestinations = computed(() => {
    const src = this.transferForm.controls.sourceAccountId.value;
    return this.banking.userAccounts().filter((a) => a.id !== src);
  });

  initiateTransfer() {
    this.errorMessage.set(null);
    const formVal = this.transferForm.getRawValue();
    const idempotencyKey = `tx_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    let destName = 'Own Account Transfer';
    let destId: string | undefined = formVal.destAccountId;

    if (this.transferType() === 'p2p') {
      destName = formVal.p2pRecipient;
      destId = undefined;
    } else if (this.transferType() === 'external') {
      destName = formVal.externalBankDetails;
      destId = undefined;
    }

    const res = this.banking.executeTransfer({
      sourceAccountId: formVal.sourceAccountId,
      destinationAccountId: destId,
      destinationName: destName,
      amount: formVal.transferAmount,
      description: formVal.memo || `Transfer to ${destName}`,
      idempotencyKey,
    });

    if (res.success && res.transactionId) {
      this.receipt.set({
        transactionId: res.transactionId,
        amount: formVal.transferAmount,
        destination: destName,
        idempotencyKey,
      });
    } else {
      this.errorMessage.set(res.error || 'Transfer failed.');
    }
  }
}
