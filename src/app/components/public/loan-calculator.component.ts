import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {BankingService} from '../../services/banking.service';

@Component({
  selector: 'app-loan-calculator',
  imports: [RouterLink, FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Interactive Tool</span>
          <h3 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
            Loan & Mortgage Estimator
          </h3>
        </div>

        <!-- Loan Type Tabs -->
        <div class="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            (click)="setPreset('mortgage30')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            [class]="preset() === 'mortgage30' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'"
          >
            30Y Mortgage
          </button>
          <button
            type="button"
            (click)="setPreset('mortgage15')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            [class]="preset() === 'mortgage15' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'"
          >
            15Y Fixed
          </button>
          <button
            type="button"
            (click)="setPreset('auto')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            [class]="preset() === 'auto' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'"
          >
            Auto Loan
          </button>
          <button
            type="button"
            (click)="setPreset('personal')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            [class]="preset() === 'personal' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'"
          >
            Personal
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        <!-- Sliders & Inputs (7 cols) -->
        <div class="lg:col-span-7 space-y-6">
          <!-- Loan Amount -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Loan Amount:
              </label>
              <span class="text-lg font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                {{ banking.formatMoney(amount()) }}
              </span>
            </div>
            <input
              type="range"
              [min]="minAmount()"
              [max]="maxAmount()"
              [step]="amountStep()"
              [value]="amount()"
              (input)="onAmountChange($event)"
              class="w-full accent-emerald-600 cursor-pointer"
            />
            <div class="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>{{ banking.formatMoney(minAmount()) }}</span>
              <span>{{ banking.formatMoney(maxAmount()) }}</span>
            </div>
          </div>

          <!-- Term in Years -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Term (Years):
              </label>
              <span class="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                {{ termYears() }} Years ({{ termYears() * 12 }} Months)
              </span>
            </div>
            <input
              type="range"
              [min]="minYears()"
              [max]="maxYears()"
              step="1"
              [value]="termYears()"
              (input)="onTermChange($event)"
              class="w-full accent-emerald-600 cursor-pointer"
            />
            <div class="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>{{ minYears() }} yr</span>
              <span>{{ maxYears() }} yrs</span>
            </div>
          </div>

          <!-- Interest Rate APR -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Interest Rate (APR):
              </label>
              <span class="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                {{ apr().toFixed(2) }}%
              </span>
            </div>
            <input
              type="range"
              min="2.5"
              max="15.0"
              step="0.05"
              [value]="apr()"
              (input)="onAprChange($event)"
              class="w-full accent-emerald-600 cursor-pointer"
            />
            <div class="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>2.50%</span>
              <span>15.00%</span>
            </div>
          </div>
        </div>

        <!-- Result Card (5 cols) -->
        <div class="lg:col-span-5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/60 flex flex-col justify-between">
          <div class="space-y-4">
            <div>
              <span class="text-xs uppercase tracking-wider font-bold text-emerald-800 dark:text-emerald-300 block">
                Estimated Monthly Payment
              </span>
              <div class="text-3xl sm:text-4xl font-extrabold text-emerald-900 dark:text-emerald-200 mt-1 tabular-nums">
                {{ banking.formatMoney(monthlyPayment()) }}
                <span class="text-sm font-normal text-slate-500 dark:text-slate-400">/mo</span>
              </div>
            </div>

            <div class="space-y-2 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 text-xs sm:text-sm">
              <div class="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Principal Borrowed:</span>
                <span class="font-semibold tabular-nums">{{ banking.formatMoney(amount()) }}</span>
              </div>
              <div class="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Total Interest Paid:</span>
                <span class="font-semibold text-amber-700 dark:text-amber-400 tabular-nums">
                  {{ banking.formatMoney(totalInterest()) }}
                </span>
              </div>
              <div class="flex items-center justify-between text-slate-900 dark:text-white font-bold pt-2 border-t border-emerald-200/40 dark:border-emerald-800/40">
                <span>Total Payment:</span>
                <span class="tabular-nums">{{ banking.formatMoney(totalCost()) }}</span>
              </div>
            </div>
          </div>

          <div class="pt-6">
            <a
              routerLink="/onboarding"
              class="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-1.5 text-center"
            >
              <span>Get Pre-Approved Online</span>
              <mat-icon class="text-sm! w-4! h-4!">arrow_forward</mat-icon>
            </a>
            <p class="text-[10px] text-slate-400 text-center mt-2">
              Rate estimation does not affect your credit score. Subject to formal underwriting approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoanCalculatorComponent {
  banking = inject(BankingService);

  preset = signal<'mortgage30' | 'mortgage15' | 'auto' | 'personal'>('mortgage30');
  amount = signal<number>(350000);
  termYears = signal<number>(30);
  apr = signal<number>(6.45);

  minAmount = signal<number>(50000);
  maxAmount = signal<number>(1000000);
  amountStep = signal<number>(5000);
  minYears = signal<number>(5);
  maxYears = signal<number>(30);

  constructor() {
    this.setPreset('mortgage30');
  }

  setPreset(type: 'mortgage30' | 'mortgage15' | 'auto' | 'personal') {
    this.preset.set(type);
    const r = this.banking.rates();

    if (type === 'mortgage30') {
      this.minAmount.set(50000);
      this.maxAmount.set(1200000);
      this.amountStep.set(5000);
      this.amount.set(380000);
      this.minYears.set(15);
      this.maxYears.set(30);
      this.termYears.set(30);
      this.apr.set(r.mortgage30YearApr);
    } else if (type === 'mortgage15') {
      this.minAmount.set(50000);
      this.maxAmount.set(1200000);
      this.amountStep.set(5000);
      this.amount.set(320000);
      this.minYears.set(10);
      this.maxYears.set(20);
      this.termYears.set(15);
      this.apr.set(r.mortgage15YearApr);
    } else if (type === 'auto') {
      this.minAmount.set(5000);
      this.maxAmount.set(120000);
      this.amountStep.set(1000);
      this.amount.set(35000);
      this.minYears.set(2);
      this.maxYears.set(7);
      this.termYears.set(5);
      this.apr.set(r.autoLoanNewApr);
    } else {
      this.minAmount.set(2000);
      this.maxAmount.set(50000);
      this.amountStep.set(500);
      this.amount.set(15000);
      this.minYears.set(1);
      this.maxYears.set(5);
      this.termYears.set(3);
      this.apr.set(8.5);
    }
  }

  onAmountChange(event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    this.amount.set(val);
  }

  onTermChange(event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    this.termYears.set(val);
  }

  onAprChange(event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    this.apr.set(val);
  }

  monthlyPayment = computed(() => {
    const P = this.amount();
    const annualRate = this.apr() / 100;
    const r = annualRate / 12;
    const n = this.termYears() * 12;

    if (r === 0) return P / n;
    return (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  });

  totalCost = computed(() => {
    return this.monthlyPayment() * (this.termYears() * 12);
  });

  totalInterest = computed(() => {
    return Math.max(0, this.totalCost() - this.amount());
  });
}
