import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {BankingService} from '../../services/banking.service';
import {BranchLocation} from '../../types/banking.types';

@Component({
  selector: 'app-locator-page',
  imports: [FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <!-- Page Title -->
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Locations & Access</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
          Branch & Fee-Free ATM Locator
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Find your nearest full-service wealth center, 24/7 smart deposit ATM, or drive-thru teller.
        </p>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <!-- Search Input -->
        <div class="relative flex-1">
          <mat-icon class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg! w-5! h-5!">search</mat-icon>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Search by city, state, or ZIP code (e.g., Atlanta, GA, 30303)..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
          />
        </div>

        <!-- Filter Tags -->
        <div class="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            (click)="toggleFilter('atm')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
            [class]="filterAtm() ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
          >
            <mat-icon class="text-xs! w-3.5! h-3.5!">atm</mat-icon>
            <span>24/7 ATM</span>
          </button>

          <button
            type="button"
            (click)="toggleFilter('driveThru')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
            [class]="filterDriveThru() ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
          >
            <mat-icon class="text-xs! w-3.5! h-3.5!">directions_car</mat-icon>
            <span>Drive-Thru</span>
          </button>

          <button
            type="button"
            (click)="toggleFilter('notary')"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
            [class]="filterNotary() ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
          >
            <mat-icon class="text-xs! w-3.5! h-3.5!">history_edu</mat-icon>
            <span>Notary</span>
          </button>
        </div>
      </div>

      <!-- Split View: List on left, Visual Map Representation on right -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Branch List (5 cols) -->
        <div class="lg:col-span-5 space-y-4">
          <div class="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>Showing {{ filteredBranches().length }} locations</span>
            <span>Sorted by distance</span>
          </div>

          <div class="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            @for (branch of filteredBranches(); track branch.id) {
              <button
                type="button"
                (click)="selectedBranch.set(branch)"
                class="w-full text-left p-5 rounded-2xl border transition-all cursor-pointer"
                [class]="selectedBranch()?.id === branch.id ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-600 shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'"
              >
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <h3 class="font-bold text-sm text-slate-900 dark:text-white">{{ branch.name }}</h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{ branch.address }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">{{ branch.city }}, {{ branch.state }} {{ branch.zip }}</p>
                  </div>
                  <span class="text-xs font-bold text-emerald-700 dark:text-emerald-400 tabular-nums shrink-0 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                    {{ branch.distanceMiles }} mi
                  </span>
                </div>

                <div class="mt-3 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <mat-icon class="text-sm! w-4! h-4! text-slate-400">schedule</mat-icon>
                  <span>{{ branch.hours }}</span>
                </div>

                <div class="mt-2 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <mat-icon class="text-sm! w-4! h-4! text-slate-400">phone</mat-icon>
                  <span>{{ branch.phone }}</span>
                </div>

                <!-- Feature badges -->
                <div class="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                  @if (branch.hasAtm24_7) {
                    <span class="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-medium">
                      24/7 ATM
                    </span>
                  }
                  @if (branch.hasDriveThru) {
                    <span class="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-medium">
                      Drive-Thru
                    </span>
                  }
                  @if (branch.hasNotary) {
                    <span class="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-medium">
                      Notary Available
                    </span>
                  }
                  @if (branch.hasSafeDeposit) {
                    <span class="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-medium">
                      Safe Deposit
                    </span>
                  }
                </div>
              </button>
            }

            @if (filteredBranches().length === 0) {
              <div class="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
                <mat-icon class="text-3xl! mb-2">search_off</mat-icon>
                <p class="text-sm font-semibold">No branches matching your criteria</p>
                <p class="text-xs mt-1">Try clearing your filters or search a broader area.</p>
              </div>
            }
          </div>
        </div>

        <!-- Interactive Map Visual Canvas (7 cols) -->
        <div class="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Metro Atlanta Banking Network</span>
            <span class="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">All ATMs Fee-Free For JF Clients</span>
          </div>

          <!-- Stylized Map Canvas Component -->
          <div class="h-[480px] w-full bg-slate-100 dark:bg-slate-950 rounded-2xl relative overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center">
            <!-- Grid Lines pattern representing streets -->
            <div class="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <!-- Major Simulated Arterials -->
            <div class="absolute w-full h-1 bg-emerald-500/20 top-1/2 -translate-y-1/2"></div>
            <div class="absolute h-full w-1 bg-emerald-500/20 left-1/2 -translate-x-1/2"></div>

            <!-- Branch Pins -->
            @for (branch of filteredBranches(); track branch.id; let i = $index) {
              <button
                type="button"
                (click)="selectedBranch.set(branch)"
                class="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-transform hover:scale-110"
                [style.top.%]="30 + (i * 18)"
                [style.left.%]="25 + (i * 16)"
              >
                <div
                  class="px-2 py-1 rounded-md text-[10px] font-bold shadow-md whitespace-nowrap mb-1 transition-all"
                  [class]="selectedBranch()?.id === branch.id ? 'bg-emerald-700 text-white scale-105' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'"
                >
                  {{ branch.name.split(' ')[0] }}
                </div>
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg"
                  [class]="selectedBranch()?.id === branch.id ? 'bg-emerald-700 ring-4 ring-emerald-300 dark:ring-emerald-900' : 'bg-emerald-900 hover:bg-emerald-700'"
                >
                  <mat-icon class="text-sm! w-4! h-4!">account_balance</mat-icon>
                </div>
              </button>
            }

            <!-- Active Selected Card Overlay -->
            @if (selectedBranch(); as sel) {
              <div class="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between gap-4">
                <div>
                  <h4 class="font-bold text-sm text-slate-900 dark:text-white">{{ sel.name }}</h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400">{{ sel.address }}, {{ sel.city }} · {{ sel.distanceMiles }} miles away</p>
                </div>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  class="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1 shrink-0"
                >
                  <mat-icon class="text-xs! w-3.5! h-3.5!">directions</mat-icon>
                  <span>Directions</span>
                </a>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LocatorPage {
  banking = inject(BankingService);

  searchQuery = '';
  filterAtm = signal<boolean>(false);
  filterDriveThru = signal<boolean>(false);
  filterNotary = signal<boolean>(false);

  selectedBranch = signal<BranchLocation | null>(this.banking.branches()[0]);

  toggleFilter(key: 'atm' | 'driveThru' | 'notary') {
    if (key === 'atm') this.filterAtm.set(!this.filterAtm());
    if (key === 'driveThru') this.filterDriveThru.set(!this.filterDriveThru());
    if (key === 'notary') this.filterNotary.set(!this.filterNotary());
  }

  filteredBranches = computed(() => {
    let list = this.banking.branches();
    const q = this.searchQuery.trim().toLowerCase();

    if (q) {
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q) ||
          b.state.toLowerCase().includes(q) ||
          b.zip.includes(q),
      );
    }

    if (this.filterAtm()) list = list.filter((b) => b.hasAtm24_7);
    if (this.filterDriveThru()) list = list.filter((b) => b.hasDriveThru);
    if (this.filterNotary()) list = list.filter((b) => b.hasNotary);

    return list;
  });
}
