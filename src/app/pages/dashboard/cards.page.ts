import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {BankingService} from '../../services/banking.service';

@Component({
  selector: 'app-cards-page',
  imports: [FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8">
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Card Controls</span>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Manage Debit & Credit Cards
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Instant contactless authorization locks, daily limit controls, and travel protection.
        </p>
      </div>

      <!-- Card Selection Switcher -->
      <div class="flex items-center gap-2">
        @for (card of banking.userCards(); track card.id) {
          <button
            type="button"
            (click)="selectedCardId.set(card.id)"
            class="px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2"
            [class]="selectedCardId() === card.id ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'"
          >
            <mat-icon class="text-sm! w-4! h-4!">credit_card</mat-icon>
            <span>{{ card.cardNetwork }} {{ card.type === 'credit' ? 'Visa Signature' : 'Mastercard Debit' }} (•••• {{ card.last4 }})</span>
          </button>
        }
      </div>

      @if (activeCard(); as card) {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Card Graphic Visualizer (5 cols) -->
          <div class="lg:col-span-5 space-y-4">
            <div
              class="w-full h-56 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between transition-all"
              [style.background]="card.type === 'credit' ? 'linear-gradient(135deg, #084E3A 0%, #04251B 100%)' : 'linear-gradient(135deg, #0B6B4F 0%, #084E3A 100%)'"
              [style.border]="card.isFrozen ? '2px dashed #EF4444' : '2px solid rgba(242, 182, 50, 0.4)'"
            >
              <!-- Frozen Overlay -->
              @if (card.isFrozen) {
                <div class="absolute inset-0 bg-red-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-10 space-y-1">
                  <mat-icon class="text-red-400 text-4xl!">lock</mat-icon>
                  <span class="font-bold text-sm tracking-wide">CARD TEMPORARILY FROZEN</span>
                  <span class="text-[11px] text-red-200">New charges blocked</span>
                </div>
              }

              <!-- Top Row: Monogram & Network -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-sm border border-white/20">
                    <span class="text-[#F2B632]">JF</span>
                  </div>
                  <span class="text-[10px] font-bold uppercase tracking-widest text-emerald-200">
                    {{ card.type === 'credit' ? 'TRAVEL ELITE' : 'PREMIER DEBIT' }}
                  </span>
                </div>
                <span class="font-extrabold italic text-sm tracking-wide">{{ card.cardNetwork }}</span>
              </div>

              <!-- EMV Chip graphic -->
              <div class="w-10 h-7 rounded-md bg-amber-200/40 border border-amber-300/60 flex items-center justify-center">
                <div class="w-6 h-4 border border-amber-400/40 rounded-xs"></div>
              </div>

              <!-- Card Numbers & Expiry -->
              <div class="space-y-1">
                <div class="font-mono text-lg font-bold tracking-widest tabular-nums">
                  •••• &nbsp; •••• &nbsp; •••• &nbsp; {{ card.last4 }}
                </div>
                <div class="flex items-center justify-between text-[11px] text-emerald-200 pt-1">
                  <span class="uppercase tracking-wider font-semibold">{{ card.cardholderName }}</span>
                  <span class="font-mono">EXP {{ card.expiryMonth }}/{{ card.expiryYear }}</span>
                </div>
              </div>
            </div>

            <!-- Fast Status Info -->
            <div class="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
              <span class="text-slate-500">Current Security State:</span>
              <span class="font-bold uppercase" [class]="card.isFrozen ? 'text-red-600' : 'text-emerald-600'">
                {{ card.isFrozen ? 'Locked (Frozen)' : 'Unlocked & Active' }}
              </span>
            </div>
          </div>

          <!-- Controls Panel (7 cols) -->
          <div class="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <!-- Freeze / Unfreeze Switch -->
            <div class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div class="space-y-0.5">
                <h4 class="font-bold text-sm text-slate-900 dark:text-white">Freeze Card Instantly</h4>
                <p class="text-xs text-slate-500">Temporarily prevent new purchases while allowing recurring subscriptions.</p>
              </div>

              <button
                type="button"
                (click)="banking.toggleCardFreeze(card.id)"
                class="px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                [class]="card.isFrozen ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'"
              >
                {{ card.isFrozen ? 'Unfreeze Card' : 'Freeze Card' }}
              </button>
            </div>

            <!-- Daily Limits Sliders -->
            <div class="space-y-4">
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">Daily Spending & ATM Limits</h4>

              <!-- ATM Limit -->
              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span class="text-slate-600 dark:text-slate-300">Daily ATM Cash Withdrawal:</span>
                  <span class="text-emerald-700 dark:text-emerald-400 font-bold tabular-nums">\${{ card.dailyAtmLimit }}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="2500"
                  step="100"
                  [value]="card.dailyAtmLimit"
                  (change)="onAtmLimitChange(card.id, $event, card.dailyPurchaseLimit)"
                  class="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <!-- Purchase Limit -->
              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span class="text-slate-600 dark:text-slate-300">Daily Purchase Limit:</span>
                  <span class="text-emerald-700 dark:text-emerald-400 font-bold tabular-nums">\${{ card.dailyPurchaseLimit }}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="20000"
                  step="500"
                  [value]="card.dailyPurchaseLimit"
                  (change)="onPurchaseLimitChange(card.id, card.dailyAtmLimit, $event)"
                  class="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            <!-- Travel Notice Section -->
            <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-emerald-600 text-base!">flight</mat-icon>
                  <h4 class="font-bold text-sm text-slate-900 dark:text-white">International Travel Notice</h4>
                </div>
                @if (card.travelNoticeActive) {
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Active Notice
                  </span>
                }
              </div>

              <p class="text-xs text-slate-500">
                Notify our security monitoring system before traveling abroad to ensure uninterrupted card approvals.
              </p>

              @if (card.travelNoticeActive) {
                <div class="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                  Covered Destination: <strong>{{ card.travelDestination }}</strong> through {{ card.travelEndDate }}.
                </div>
              } @else {
                <div class="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    [(ngModel)]="travelCountry"
                    placeholder="e.g. United Kingdom & Japan"
                    class="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                  <button
                    type="button"
                    (click)="setTravel(card.id)"
                    class="px-3 py-1.5 rounded-xl bg-emerald-700 text-white font-semibold text-xs"
                  >
                    Enable Travel Mode
                  </button>
                </div>
              }
            </div>

            <!-- Secondary Actions -->
            <div class="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                (click)="showPinModal.set(true)"
                class="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs text-center transition-colors"
              >
                Change Card PIN
              </button>

              <button
                type="button"
                (click)="reportLost(card.id)"
                class="p-2.5 rounded-xl border border-red-300 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 font-semibold text-xs text-center transition-colors"
              >
                Report Lost or Stolen
              </button>
            </div>
          </div>
        </div>
      }
    </div>

    <!-- PIN Change Modal -->
    @if (showPinModal()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pin-modal-title"
      >
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-4">
          <h3 id="pin-modal-title" class="font-bold text-base text-slate-900 dark:text-white">Change 4-Digit Card PIN</h3>
          <p class="text-xs text-slate-500">Your new PIN will take effect immediately at all retail terminals and ATMs.</p>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Enter New 4-Digit PIN</label>
            <input
              type="password"
              maxlength="4"
              placeholder="••••"
              class="w-full text-center text-xl font-bold font-mono px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div class="flex items-center gap-2 pt-2">
            <button
              type="button"
              (click)="showPinModal.set(false)"
              class="flex-1 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              (click)="showPinModal.set(false)"
              class="flex-1 py-2 rounded-xl bg-emerald-700 text-white font-semibold text-xs"
            >
              Update PIN
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class CardsPage {
  banking = inject(BankingService);

  selectedCardId = signal<string>('card_debit');
  showPinModal = signal<boolean>(false);
  travelCountry = 'United Kingdom & France';

  activeCard = computed(() => {
    return this.banking.userCards().find((c) => c.id === this.selectedCardId()) || this.banking.userCards()[0];
  });

  onAtmLimitChange(cardId: string, event: Event, purchaseLimit: number) {
    const val = Number((event.target as HTMLInputElement).value);
    this.banking.updateCardLimits(cardId, val, purchaseLimit);
  }

  onPurchaseLimitChange(cardId: string, atmLimit: number, event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    this.banking.updateCardLimits(cardId, atmLimit, val);
  }

  setTravel(cardId: string) {
    this.banking.setTravelNotice(cardId, this.travelCountry, '2026-12-15');
  }

  reportLost(cardId: string) {
    this.banking.toggleCardFreeze(cardId);
  }
}
