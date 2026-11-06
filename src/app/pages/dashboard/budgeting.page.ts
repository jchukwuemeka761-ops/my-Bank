import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {BankingService} from '../../services/banking.service';
import {SavingsGoal} from '../../types/banking.types';

@Component({
  selector: 'app-budgeting-page',
  imports: [FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Financial Planning</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Budgets & Savings Targets
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Allocate monthly spending envelopes and monitor long-term capital goals.
          </p>
        </div>

        <button
          type="button"
          (click)="showGoalModal.set(true)"
          class="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm transition-colors flex items-center gap-1.5"
        >
          <mat-icon class="text-sm! w-4! h-4!">add</mat-icon>
          <span>Create New Goal</span>
        </button>
      </div>

      <!-- Savings Goals Section -->
      <div class="space-y-4">
        <h3 class="font-bold text-base text-slate-900 dark:text-white">Active Savings Targets</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          @for (goal of banking.goals(); track goal.id) {
            <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                    <mat-icon class="text-xl!">{{ goal.icon }}</mat-icon>
                  </div>
                  <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Target: {{ goal.deadline }}
                  </span>
                </div>

                <h4 class="font-bold text-sm text-slate-900 dark:text-white mt-1">{{ goal.name }}</h4>
                <div class="flex items-baseline justify-between text-xs pt-1">
                  <span class="text-lg font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {{ banking.formatMoney(goal.currentAmount) }}
                  </span>
                  <span class="text-slate-400 tabular-nums">
                    of {{ banking.formatMoney(goal.targetAmount) }}
                  </span>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="space-y-1">
                <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    class="h-full bg-emerald-600 rounded-full transition-all duration-300"
                    [style.width.%]="(goal.currentAmount / goal.targetAmount) * 100"
                  ></div>
                </div>
                <div class="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>{{ ((goal.currentAmount / goal.targetAmount) * 100).toFixed(0) }}% funded</span>
                  <span>{{ banking.formatMoney(goal.targetAmount - goal.currentAmount) }} remaining</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Monthly Budget Envelopes -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 class="font-bold text-base text-slate-900 dark:text-white">Monthly Expense Envelopes</h3>
          <span class="text-xs text-slate-400">November 2026</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (b of banking.budgets(); track b.id) {
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <div class="flex items-center justify-between text-xs font-bold">
                <span class="text-slate-900 dark:text-white">{{ b.category }}</span>
                <span class="tabular-nums" [class.text-red-600]="b.spentAmount > b.allocatedAmount">
                  {{ banking.formatMoney(b.spentAmount) }} / {{ banking.formatMoney(b.allocatedAmount) }}
                </span>
              </div>

              <div class="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-300"
                  [class]="b.spentAmount > b.allocatedAmount ? 'bg-red-500' : 'bg-emerald-600'"
                  [style.width.%]="Math.min(100, (b.spentAmount / b.allocatedAmount) * 100)"
                ></div>
              </div>

              <div class="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>{{ ((b.spentAmount / b.allocatedAmount) * 100).toFixed(0) }}% spent</span>
                <span>{{ banking.formatMoney(Math.max(0, b.allocatedAmount - b.spentAmount)) }} available</span>
              </div>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Create Goal Modal -->
    @if (showGoalModal()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="goal-title"
      >
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
          <h3 id="goal-title" class="font-bold text-base text-slate-900 dark:text-white">Create New Savings Target</h3>

          <form (ngSubmit)="saveGoal()" class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Goal Name</label>
              <input
                type="text"
                [(ngModel)]="newGoalName"
                name="newGoalName"
                placeholder="e.g. Wedding Fund or Real Estate Downpayment"
                required
                class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Amount ($)</label>
              <input
                type="number"
                [(ngModel)]="newGoalAmount"
                name="newGoalAmount"
                required
                class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Date</label>
              <input
                type="date"
                [(ngModel)]="newGoalDeadline"
                name="newGoalDeadline"
                required
                class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div class="flex items-center gap-2 pt-2">
              <button
                type="button"
                (click)="showGoalModal.set(false)"
                class="flex-1 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="!newGoalName.trim()"
                class="flex-1 py-2 rounded-xl bg-emerald-700 text-white font-semibold text-xs"
              >
                Create Target
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class BudgetingPage {
  banking = inject(BankingService);
  Math = Math;

  showGoalModal = signal<boolean>(false);
  newGoalName = '';
  newGoalAmount = 10000;
  newGoalDeadline = '2027-06-30';

  saveGoal() {
    if (!this.newGoalName.trim()) return;
    const goal: SavingsGoal = {
      id: 'g_' + Date.now(),
      name: this.newGoalName,
      targetAmount: this.newGoalAmount,
      currentAmount: 0,
      deadline: this.newGoalDeadline,
      icon: 'savings',
      category: 'General',
    };
    this.banking.goals.update((list) => [...list, goal]);
    this.showGoalModal.set(false);
    this.newGoalName = '';
  }
}
