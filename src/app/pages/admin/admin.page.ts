import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {AuthService} from '../../services/auth.service';
import {BankingService} from '../../services/banking.service';

@Component({
  selector: 'app-admin-page',
  imports: [DatePipe, FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Admin Portal Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold text-xs uppercase tracking-wider">
              Compliance & Executive Ops
            </span>
            <span class="text-xs text-slate-400">Strict Role-Based Access Control</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            JF Banking Administration & Risk Control
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <div class="text-right text-xs">
            <span class="font-bold text-slate-900 dark:text-white block">{{ auth.currentUser()?.firstName }} {{ auth.currentUser()?.lastName }}</span>
            <span class="text-purple-700 dark:text-purple-400 font-semibold">Chief Compliance Officer</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-700 dark:text-purple-400 font-bold text-sm">
            SJ
          </div>
        </div>
      </div>

      <!-- Quick Metrics Strip -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Pending KYC Files</span>
          <div class="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
            {{ pendingKycCount() }}
          </div>
        </div>

        <div class="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Flagged AML Wires</span>
          <div class="text-2xl font-black text-red-600 mt-1 tabular-nums">
            {{ flaggedTransactions().length }}
          </div>
        </div>

        <div class="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Customer Accounts</span>
          <div class="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
            {{ banking.accounts().length }}
          </div>
        </div>

        <div class="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Savings Benchmark APY</span>
          <div class="text-2xl font-black text-emerald-600 mt-1 tabular-nums">
            {{ banking.rates().highYieldSavingsApy }}%
          </div>
        </div>
      </div>

      <!-- Admin Tabs Navigation -->
      <div class="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-bold">
        <button
          type="button"
          (click)="activeTab.set('kyc')"
          class="px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
          [class]="activeTab() === 'kyc' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'"
        >
          <mat-icon class="text-sm! w-4! h-4!">how_to_reg</mat-icon>
          <span>KYC Review Queue ({{ pendingKycCount() }})</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('aml')"
          class="px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
          [class]="activeTab() === 'aml' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'"
        >
          <mat-icon class="text-sm! w-4! h-4!">warning</mat-icon>
          <span>AML Monitoring ({{ flaggedTransactions().length }})</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('customers')"
          class="px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
          [class]="activeTab() === 'customers' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'"
        >
          <mat-icon class="text-sm! w-4! h-4!">people</mat-icon>
          <span>Customer Freeze Controls</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('rates')"
          class="px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
          [class]="activeTab() === 'rates' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'"
        >
          <mat-icon class="text-sm! w-4! h-4!">tune</mat-icon>
          <span>Rate & Fee Engine</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('audit')"
          class="px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
          [class]="activeTab() === 'audit' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'"
        >
          <mat-icon class="text-sm! w-4! h-4!">history</mat-icon>
          <span>Immutable Audit Log</span>
        </button>
      </div>

      <!-- Tab 1: KYC Queue -->
      @if (activeTab() === 'kyc') {
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Customer Identity Verification Files</h3>
            <span class="text-xs text-slate-500">Tier 3 Biometric & Sanction List Checks</span>
          </div>

          <div class="grid grid-cols-1 gap-4">
            @for (app of banking.kycApplications(); track app.id) {
              <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <h4 class="font-bold text-base text-slate-900 dark:text-white">{{ app.applicant.fullName }}</h4>
                    <span
                      class="px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase"
                      [class]="app.status === 'approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                               app.status === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-red-100 text-red-800'"
                    >
                      {{ app.status }}
                    </span>
                  </div>

                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-y-1 gap-x-4 text-xs text-slate-500">
                    <span>Email: <strong class="text-slate-700 dark:text-slate-300">{{ app.applicant.email }}</strong></span>
                    <span>Phone: <strong class="text-slate-700 dark:text-slate-300">{{ app.applicant.phone }}</strong></span>
                    <span>SSN/TIN: <strong class="font-mono text-slate-700 dark:text-slate-300">{{ app.applicant.ssnOrTinMasked }}</strong></span>
                    <span>ID: <strong class="font-mono text-slate-700 dark:text-slate-300">{{ app.applicant.idNumberMasked }}</strong></span>
                    <span>Income: <strong class="text-slate-700 dark:text-slate-300">{{ app.applicant.annualIncomeRange }}</strong></span>
                    <span>Package: <strong class="text-emerald-700 dark:text-emerald-400">{{ app.applicant.accountSelected }}</strong></span>
                  </div>

                  @if (app.reviewNotes) {
                    <p class="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <strong>Review Note:</strong> {{ app.reviewNotes }}
                      @if (app.reviewedBy) {
                        &middot; <span class="text-slate-400">By {{ app.reviewedBy }} on {{ app.reviewedAt | date:'short' }}</span>
                      }
                    </p>
                  }
                </div>

                @if (app.status === 'pending') {
                  <div class="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      (click)="approve(app.id)"
                      class="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs"
                    >
                      Approve & Issue Account
                    </button>
                    <button
                      type="button"
                      (click)="reject(app.id)"
                      class="px-4 py-2 rounded-xl border border-red-300 dark:border-red-900 text-red-600 hover:bg-red-50 text-xs font-semibold"
                    >
                      Reject
                    </button>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }

      <!-- Tab 2: AML Monitoring -->
      @if (activeTab() === 'aml') {
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Flagged High-Risk Transactions (AML Thresholds)</h3>
            <span class="text-xs text-red-600 font-semibold">Automated FinCEN Pattern Rules</span>
          </div>

          <div class="space-y-4">
            @for (tx of flaggedTransactions(); track tx.id) {
              <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-red-500/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div class="space-y-2">
                  <div class="flex items-center gap-3">
                    <span class="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-100 dark:bg-red-950 px-2 py-0.5 rounded-md">
                      Risk Score: {{ tx.riskScore }}/100
                    </span>
                    <h4 class="font-bold text-base text-slate-900 dark:text-white">{{ tx.description }}</h4>
                  </div>

                  <div class="text-xs text-slate-500 space-x-3">
                    <span>Amount: <strong class="text-base text-red-600 tabular-nums">{{ banking.formatMoney(tx.amount) }}</strong></span>
                    <span>Initiated: <strong>{{ tx.createdAt | date:'medium' }}</strong></span>
                    <span>To: <strong>{{ tx.destinationName }}</strong></span>
                  </div>

                  <div class="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/60 text-xs text-red-900 dark:text-red-200">
                    <strong>Rule Trigger:</strong> {{ tx.flagReason }}
                  </div>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    (click)="clearAml(tx.id)"
                    class="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs"
                  >
                    Clear & Release Wire
                  </button>
                  <button
                    type="button"
                    class="px-4 py-2 rounded-xl border border-red-300 dark:border-red-900 text-red-600 text-xs font-semibold"
                  >
                    Escalate to FinCEN
                  </button>
                </div>
              </div>
            }

            @if (flaggedTransactions().length === 0) {
              <div class="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
                <mat-icon class="text-4xl! text-emerald-600 mb-2">verified</mat-icon>
                <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">All transaction queues clear</p>
                <p class="text-xs">No pending compliance holds at this moment.</p>
              </div>
            }
          </div>
        </div>
      }

      <!-- Tab 3: Customer Controls & Freezes -->
      @if (activeTab() === 'customers') {
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Customer Account Status & Freeze Governance</h3>
            <span class="text-xs text-slate-400">Administrative ledger locks</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th class="py-3 px-3">Account Name</th>
                  <th class="py-3 px-3">Type</th>
                  <th class="py-3 px-3">Account #</th>
                  <th class="py-3 px-3 text-right">Ledger Balance</th>
                  <th class="py-3 px-3">Status</th>
                  <th class="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                @for (acct of banking.accounts(); track acct.id) {
                  <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td class="py-3 px-3 font-bold text-slate-900 dark:text-white">{{ acct.name }}</td>
                    <td class="py-3 px-3 uppercase text-[10px] text-slate-500 font-semibold">{{ acct.type }}</td>
                    <td class="py-3 px-3 font-mono text-slate-500">{{ acct.accountNumber }}</td>
                    <td class="py-3 px-3 text-right font-extrabold tabular-nums text-slate-900 dark:text-white">
                      {{ banking.formatMoney(acct.balance) }}
                    </td>
                    <td class="py-3 px-3">
                      <span
                        class="px-2 py-0.5 rounded-full font-bold uppercase text-[10px]"
                        [class]="acct.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-100 text-red-800'"
                      >
                        {{ acct.status }}
                      </span>
                    </td>
                    <td class="py-3 px-3 text-right">
                      <button
                        type="button"
                        (click)="banking.adminToggleAccountFreeze(acct.id)"
                        class="px-3 py-1 rounded-lg text-xs font-semibold"
                        [class]="acct.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'"
                      >
                        {{ acct.status === 'active' ? 'Freeze Account' : 'Unfreeze' }}
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Tab 4: Rates Configuration -->
      @if (activeTab() === 'rates') {
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white">Live System APY & APR Benchmark Controls</h3>
              <p class="text-xs text-slate-400">Updates propagate instantaneously across client calculators and compounding engines.</p>
            </div>
            <span class="text-xs text-emerald-600 font-bold">Real-time update active</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">High-Yield Savings APY (%)</label>
              <input
                type="number"
                step="0.05"
                [ngModel]="banking.rates().highYieldSavingsApy"
                (ngModelChange)="updateSavingsRate($event)"
                class="w-full text-xl font-bold font-mono px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 tabular-nums"
              />
              <span class="text-[10px] text-slate-400 block">Current flagship rate benchmark.</span>
            </div>

            <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">12-Month CD APY (%)</label>
              <input
                type="number"
                step="0.05"
                [ngModel]="banking.rates().cd12MonthApy"
                (ngModelChange)="updateCdRate($event)"
                class="w-full text-xl font-bold font-mono px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 tabular-nums"
              />
              <span class="text-[10px] text-slate-400 block">Certificate term guarantee.</span>
            </div>

            <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">30-Year Mortgage APR (%)</label>
              <input
                type="number"
                step="0.05"
                [ngModel]="banking.rates().mortgage30YearApr"
                (ngModelChange)="updateMortgageRate($event)"
                class="w-full text-xl font-bold font-mono px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
              />
              <span class="text-[10px] text-slate-400 block">Lending underwriting index.</span>
            </div>
          </div>
        </div>
      }

      <!-- Tab 5: Immutable Audit Log -->
      @if (activeTab() === 'audit') {
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white">Immutable Administrative Event Stream</h3>
              <p class="text-xs text-slate-400">Append-only audit trail satisfying SOC 2 & PCI-DSS governance</p>
            </div>
            <span class="text-xs font-mono text-slate-400">Ledger Verified</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs font-mono">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th class="py-3 px-3">Timestamp</th>
                  <th class="py-3 px-3">Actor</th>
                  <th class="py-3 px-3">Action</th>
                  <th class="py-3 px-3">Entity Reference</th>
                  <th class="py-3 px-3">Audit Details</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                @for (log of banking.auditLogs(); track log.id) {
                  <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td class="py-3 px-3 text-slate-500 whitespace-nowrap">{{ log.timestamp | date:'yyyy-MM-dd HH:mm:ss' }}</td>
                    <td class="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">{{ log.actorUserId }}</td>
                    <td class="py-3 px-3 font-bold text-emerald-700 dark:text-emerald-400">{{ log.action }}</td>
                    <td class="py-3 px-3 text-slate-500 font-mono">{{ log.targetEntityId }}</td>
                    <td class="py-3 px-3 text-slate-700 dark:text-slate-300 font-sans text-xs">{{ log.details }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminPage {
  auth = inject(AuthService);
  banking = inject(BankingService);

  activeTab = signal<'kyc' | 'aml' | 'customers' | 'rates' | 'audit'>('kyc');

  pendingKycCount = computed(() => {
    return this.banking.kycApplications().filter((a) => a.status === 'pending').length;
  });

  flaggedTransactions = computed(() => {
    return this.banking.transactions().filter((t) => t.status === 'flagged');
  });

  approve(appId: string) {
    this.banking.approveKyc(appId, 'Sarah Jenkins (Compliance Lead)');
  }

  reject(appId: string) {
    this.banking.rejectKyc(appId, 'Sarah Jenkins (Compliance Lead)', 'Documentation inadequate or expired.');
  }

  clearAml(txId: string) {
    this.banking.clearFlaggedTransaction(txId);
  }

  updateSavingsRate(newRate: number) {
    this.banking.updateRates({ highYieldSavingsApy: Number(newRate) });
  }

  updateCdRate(newRate: number) {
    this.banking.updateRates({ cd12MonthApy: Number(newRate) });
  }

  updateMortgageRate(newRate: number) {
    this.banking.updateRates({ mortgage30YearApr: Number(newRate) });
  }
}
