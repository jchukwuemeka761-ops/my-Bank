import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {BankingService} from '../../services/banking.service';

@Component({
  selector: 'app-investing-page',
  imports: [FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8">
      <!-- Simulated Label Banner -->
      <div class="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-300 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded-md bg-purple-200 dark:bg-purple-900 font-bold uppercase text-[10px]">
            SIMULATION MODE
          </span>
          <span>Paper trading sandbox. Orders executed here are simulated for training and testing purposes.</span>
        </div>
        <span class="text-[11px] font-semibold text-purple-700 dark:text-purple-400">Live US Market Feeds</span>
      </div>

      <!-- Portfolio Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          class="rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between"
          style="background: linear-gradient(135deg, #0B6B4F 0%, #084E3A 100%);"
        >
          <div>
            <span class="text-xs uppercase tracking-wider text-emerald-200 font-semibold block">Total Portfolio Value</span>
            <div class="text-3xl font-extrabold tracking-tight mt-1 tabular-nums">
              {{ banking.formatMoney(totalPortfolioValue()) }}
            </div>
          </div>
          <div class="pt-4 mt-2 border-t border-white/10 text-xs text-emerald-200 flex items-center justify-between">
            <span>All Equity Holdings</span>
            <span class="text-[#F2B632] font-bold">+18.4% All-Time</span>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <span class="text-xs uppercase tracking-wider text-slate-500 font-semibold block">Unrealized Total Gains</span>
            <div class="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
              +{{ banking.formatMoney(totalUnrealizedGains()) }}
            </div>
          </div>
          <div class="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
            <span>S&P 500 Weighted Benchmark</span>
            <span class="text-emerald-600 font-semibold">+1.42% Today</span>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <span class="text-xs uppercase tracking-wider text-slate-500 font-semibold block">Settled Cash Balance</span>
            <div class="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
              {{ banking.formatMoney(availableCash()) }}
            </div>
          </div>
          <div class="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
            <span>Ready to Deploy</span>
            <span class="text-emerald-600 font-semibold">4.85% APY on uninvested cash</span>
          </div>
        </div>
      </div>

      <!-- Simulated Order Execution Terminal -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Simulated Trade Order Terminal</h3>
            <span class="text-xs text-slate-400">Commission-free simulated market order</span>
          </div>
          <span class="text-xs font-bold uppercase text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2.5 py-1 rounded-full">
            Simulated Execution
          </span>
        </div>

        @if (orderSuccessMessage()) {
          <div class="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <mat-icon class="text-emerald-600">check_circle</mat-icon>
              <span>{{ orderSuccessMessage() }}</span>
            </div>
            <button type="button" (click)="orderSuccessMessage.set(null)" class="font-bold underline">Dismiss</button>
          </div>
        }

        <form (ngSubmit)="placeOrder()" class="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Asset Symbol</label>
            <select
              [(ngModel)]="orderSymbol"
              name="orderSymbol"
              class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
            >
              @for (h of banking.holdings(); track h.symbol) {
                <option [value]="h.symbol">{{ h.symbol }} - {{ h.name }} (\${{ h.currentPrice }})</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Action</label>
            <div class="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                (click)="orderAction.set('BUY')"
                class="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                [class]="orderAction() === 'BUY' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-500'"
              >
                BUY
              </button>
              <button
                type="button"
                (click)="orderAction.set('SELL')"
                class="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                [class]="orderAction() === 'SELL' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-500'"
              >
                SELL
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Shares</label>
            <input
              type="number"
              min="1"
              max="500"
              [(ngModel)]="orderShares"
              name="orderShares"
              required
              class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold tabular-nums"
            />
          </div>

          <div>
            <span class="block text-[11px] text-slate-400 mb-1">Estimated Total</span>
            <div class="text-sm font-extrabold text-slate-900 dark:text-white tabular-nums py-2">
              {{ banking.formatMoney(estimatedOrderCost()) }}
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="w-full py-2.5 rounded-xl font-bold text-xs shadow-sm transition-colors text-white"
              [class]="orderAction() === 'BUY' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-red-600 hover:bg-red-700'"
            >
              Execute Simulated {{ orderAction() }}
            </button>
          </div>
        </form>
      </div>

      <!-- Holdings Table -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 class="font-bold text-base text-slate-900 dark:text-white">Active Portfolio Holdings</h3>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th class="py-3 px-3">Asset</th>
                <th class="py-3 px-3">Class</th>
                <th class="py-3 px-3 text-right">Shares</th>
                <th class="py-3 px-3 text-right">Avg Cost</th>
                <th class="py-3 px-3 text-right">Current Price</th>
                <th class="py-3 px-3 text-right">Market Value</th>
                <th class="py-3 px-3 text-right">Daily Change</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              @for (h of banking.holdings(); track h.symbol) {
                <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td class="py-3.5 px-3">
                    <span class="font-bold text-sm text-slate-900 dark:text-white block">{{ h.symbol }}</span>
                    <span class="text-[10px] text-slate-400">{{ h.name }}</span>
                  </td>
                  <td class="py-3.5 px-3">
                    <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[10px] font-semibold">
                      {{ h.assetClass }}
                    </span>
                  </td>
                  <td class="py-3.5 px-3 text-right font-bold tabular-nums">{{ h.shares }}</td>
                  <td class="py-3.5 px-3 text-right text-slate-500 tabular-nums">\${{ h.avgCost.toFixed(2) }}</td>
                  <td class="py-3.5 px-3 text-right font-bold text-slate-900 dark:text-white tabular-nums">\${{ h.currentPrice.toFixed(2) }}</td>
                  <td class="py-3.5 px-3 text-right font-extrabold text-slate-900 dark:text-white tabular-nums">
                    {{ banking.formatMoney(h.shares * h.currentPrice) }}
                  </td>
                  <td class="py-3.5 px-3 text-right font-bold tabular-nums" [class]="h.dailyChangePercent >= 0 ? 'text-emerald-600' : 'text-red-600'">
                    {{ h.dailyChangePercent >= 0 ? '+' : '' }}{{ h.dailyChangePercent }}%
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class InvestingPage {
  banking = inject(BankingService);

  orderSymbol = 'VOO';
  orderAction = signal<'BUY' | 'SELL'>('BUY');
  orderShares = 5;
  orderSuccessMessage = signal<string | null>(null);

  availableCash = computed(() => {
    const acct = this.banking.userAccounts().find((a) => a.type === 'investment');
    return acct ? acct.availableBalance : 12450.00;
  });

  totalPortfolioValue = computed(() => {
    return this.banking.holdings().reduce((acc, h) => acc + h.shares * h.currentPrice, 0);
  });

  totalUnrealizedGains = computed(() => {
    return this.banking.holdings().reduce((acc, h) => acc + h.shares * (h.currentPrice - h.avgCost), 0);
  });

  estimatedOrderCost = computed(() => {
    const holding = this.banking.holdings().find((h) => h.symbol === this.orderSymbol);
    if (!holding) return 0;
    return this.orderShares * holding.currentPrice;
  });

  placeOrder() {
    const res = this.banking.executeSimulatedOrder(this.orderSymbol, this.orderAction(), this.orderShares);
    if (res.success) {
      this.orderSuccessMessage.set(
        `Simulated ${this.orderAction()} of ${this.orderShares} shares of ${this.orderSymbol} executed successfully at current market price.`,
      );
    }
  }
}
