import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {BankingService} from '../../services/banking.service';
import {LoanCalculatorComponent} from '../../components/public/loan-calculator.component';
import {MobileAppModalComponent} from '../../components/public/mobile-app-modal.component';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, MatIconModule, LoanCalculatorComponent, MobileAppModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-20 pb-20">
      <!-- Hero Section -->
      <section class="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-emerald-950/5 via-transparent to-transparent">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <!-- Left Copy (7 cols) -->
            <div class="lg:col-span-7 space-y-6">
              <!-- High-Yield Badge -->
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>4.85% APY High-Yield Savings · FDIC Insured · Zero Hidden Fees</span>
              </div>

              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Banking Engineered for <span class="text-emerald-700 dark:text-emerald-400">Generational Wealth</span>.
              </h1>

              <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Welcome to JChukwuemeka's Financials. Experience modern personal checking, industry-leading savings yields, rapid pre-approved mortgages, and double-entry ledger security.
              </p>

              <!-- CTA Buttons -->
              <div class="flex flex-wrap items-center gap-3 pt-2">
                <a
                  routerLink="/onboarding"
                  class="px-6 py-3.5 rounded-2xl bg-[#F2B632] hover:bg-[#E5A820] text-slate-950 font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span>Open an Account</span>
                  <mat-icon class="text-sm! w-4! h-4!">arrow_forward</mat-icon>
                </a>

                <a
                  routerLink="/sign-in"
                  class="px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 font-semibold text-sm transition-colors flex items-center gap-2 shadow-xs"
                >
                  <mat-icon class="text-sm! w-4! h-4!">lock</mat-icon>
                  <span>Sign In</span>
                </a>

                <button
                  type="button"
                  (click)="showAppModal.set(true)"
                  class="px-4 py-3.5 rounded-2xl text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 text-sm font-semibold transition-colors flex items-center gap-1.5"
                >
                  <mat-icon class="text-sm! w-4! h-4!">smartphone</mat-icon>
                  <span>Get Mobile App</span>
                </button>
              </div>

              <!-- Trust Metrics -->
              <div class="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 max-w-lg">
                <div>
                  <span class="block text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">4.85%</span>
                  <span class="text-xs text-slate-500 dark:text-slate-400">High-Yield APY</span>
                </div>
                <div>
                  <span class="block text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">$250k</span>
                  <span class="text-xs text-slate-500 dark:text-slate-400">FDIC Protection</span>
                </div>
                <div>
                  <span class="block text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">021000021</span>
                  <span class="text-xs text-slate-500 dark:text-slate-400">Fed Routing Number</span>
                </div>
              </div>
            </div>

            <!-- Right Interactive Card (5 cols) -->
            <div class="lg:col-span-5">
              <div
                class="rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden space-y-6"
                style="background: linear-gradient(135deg, #0B6B4F 0%, #084E3A 100%); border: 2px solid rgba(242, 182, 50, 0.4);"
              >
                <!-- Monogram Emblem watermark -->
                <div class="absolute -right-8 -bottom-8 opacity-10 text-[180px] font-black pointer-events-none select-none">
                  JF
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg border border-white/20">
                      <span class="text-[#F2B632]">JF</span>
                    </div>
                    <div>
                      <span class="text-xs font-semibold text-emerald-200 uppercase tracking-wider block">Live Demo Profile</span>
                      <span class="text-sm font-bold text-white">Alex Chukwuemeka</span>
                    </div>
                  </div>
                  <span class="px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold border border-emerald-400/30">
                    Active & Verified
                  </span>
                </div>

                <div class="space-y-1">
                  <span class="text-xs text-emerald-200">Combined Liquid Balance</span>
                  <div class="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-white">
                    {{ banking.formatMoney(banking.liquidAssets()) }}
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs">
                  <div class="p-3 rounded-xl bg-black/20 border border-white/10">
                    <span class="text-emerald-300 block">Premier Checking</span>
                    <span class="font-bold text-base text-white tabular-nums">{{ banking.formatMoney(14250.80) }}</span>
                  </div>
                  <div class="p-3 rounded-xl bg-black/20 border border-white/10">
                    <span class="text-[#F2B632] block">High-Yield Savings</span>
                    <span class="font-bold text-base text-white tabular-nums">{{ banking.formatMoney(48620.50) }}</span>
                  </div>
                </div>

                <div class="pt-2">
                  <a
                    routerLink="/dashboard"
                    class="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border border-white/20"
                  >
                    <span>Launch Customer Dashboard</span>
                    <mat-icon class="text-sm! w-4! h-4!">launch</mat-icon>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Rate Comparison Ticker -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="text-center max-w-2xl mx-auto mb-8">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Competitive Transparency</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Earn Over 10x The National Average
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
              See how JChukwuemeka's Financials compares against traditional legacy retail banks.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- JF High Yield -->
            <div class="rounded-2xl p-6 bg-emerald-50/80 dark:bg-emerald-950/40 border-2 border-emerald-500/60 relative">
              <span class="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                Best Rate
              </span>
              <span class="text-xs font-semibold text-emerald-800 dark:text-emerald-300">JChukwuemeka's Financials</span>
              <div class="text-4xl font-extrabold text-emerald-900 dark:text-emerald-200 mt-2 tabular-nums">4.85% <span class="text-sm font-normal">APY</span></div>
              <p class="text-xs text-slate-600 dark:text-slate-300 mt-2">Daily compounding with zero minimum balance fees.</p>
              <div class="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-800 dark:text-emerald-300">
                On $25,000 balance: <strong class="tabular-nums">+$1,212.50/yr</strong>
              </div>
            </div>

            <!-- National Average -->
            <div class="rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">National Average Rate</span>
              <div class="text-4xl font-extrabold text-slate-700 dark:text-slate-300 mt-2 tabular-nums">0.46% <span class="text-sm font-normal">APY</span></div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">Standard FDIC national deposit index benchmark.</p>
              <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                On $25,000 balance: <strong class="tabular-nums">+$115.00/yr</strong>
              </div>
            </div>

            <!-- Legacy Mega Banks -->
            <div class="rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Traditional Big 4 Banks</span>
              <div class="text-4xl font-extrabold text-slate-400 dark:text-slate-500 mt-2 tabular-nums">0.01% <span class="text-sm font-normal">APY</span></div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">Often burdened with monthly maintenance charges.</p>
              <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                On $25,000 balance: <strong class="tabular-nums">+$2.50/yr</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Complete 8-Product Grid -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Comprehensive Solutions</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Explore Our Banking Suites
            </h2>
          </div>
          <a routerLink="/products/checking" class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1">
            <span>Browse all product guides</span>
            <mat-icon class="text-sm! w-4! h-4!">arrow_forward</mat-icon>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (prod of products; track prod.route) {
            <a
              [routerLink]="['/products', prod.route]"
              class="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  <mat-icon class="text-2xl!">{{ prod.icon }}</mat-icon>
                </div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {{ prod.title }}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {{ prod.desc }}
                </p>
              </div>

              <div class="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <span>{{ prod.stat }}</span>
                <mat-icon class="text-sm! w-4! h-4! group-hover:translate-x-1 transition-transform">arrow_forward</mat-icon>
              </div>
            </a>
          }
        </div>
      </section>

      <!-- Embedded Interactive Loan Calculator -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <app-loan-calculator></app-loan-calculator>
      </section>

      <!-- Security Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-3xl p-8 sm:p-12 bg-slate-900 text-white relative overflow-hidden">
          <div class="max-w-3xl space-y-4">
            <span class="text-xs font-bold uppercase tracking-wider text-[#F2B632]">Institutional-Grade Safeguards</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white">
              Bank with Uncompromising Confidence
            </h2>
            <p class="text-sm text-slate-300 leading-relaxed">
              Every deposit, transaction, and transfer at JChukwuemeka's Financials is defended by multi-layered cryptographic safeguards, immutable double-entry ledger bookkeeping, and automated anti-fraud monitoring.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 mt-8 border-t border-slate-800">
            <div class="space-y-2">
              <mat-icon class="text-emerald-400 text-2xl!">verified_user</mat-icon>
              <h4 class="font-bold text-sm">FDIC Insurance</h4>
              <p class="text-xs text-slate-400">Your eligible deposit balances are insured up to $250,000 per depositor.</p>
            </div>
            <div class="space-y-2">
              <mat-icon class="text-amber-400 text-2xl!">lock</mat-icon>
              <h4 class="font-bold text-sm">Double-Entry Ledger</h4>
              <p class="text-xs text-slate-400">All money movements are executed in server-authoritative double-entry journals.</p>
            </div>
            <div class="space-y-2">
              <mat-icon class="text-blue-400 text-2xl!">fingerprint</mat-icon>
              <h4 class="font-bold text-sm">Mandatory 2FA OTP</h4>
              <p class="text-xs text-slate-400">Every sign-in requires 6-digit OTP verification with anti-phishing banners.</p>
            </div>
            <div class="space-y-2">
              <mat-icon class="text-emerald-400 text-2xl!">shield</mat-icon>
              <h4 class="font-bold text-sm">Zero Fraud Liability</h4>
              <p class="text-xs text-slate-400">You are protected against unauthorized debit and credit card transactions.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Financial Education Tiles -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Knowledge Hub</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Financial Intelligence & Education
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (article of educationArticles; track article.title) {
            <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
              <div>
                <span class="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  {{ article.tag }} · {{ article.readTime }}
                </span>
                <h3 class="text-base font-bold text-slate-900 dark:text-white mt-2">
                  {{ article.title }}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {{ article.summary }}
                </p>
              </div>

              <div class="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                <a routerLink="/help" class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1">
                  <span>Read Guide</span>
                  <mat-icon class="text-xs! w-3.5! h-3.5!">arrow_forward</mat-icon>
                </a>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Connect with Us Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-emerald-50/70 dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-emerald-100 dark:border-slate-800">
          <div class="text-center max-w-xl mx-auto mb-8">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Seamless Access</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Connect With JChukwuemeka's Financials
            </h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              routerLink="/appointments"
              class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-600 transition-all text-center space-y-3 group"
            >
              <div class="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 mx-auto flex items-center justify-center text-emerald-700 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <mat-icon class="text-2xl!">calendar_month</mat-icon>
              </div>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">Schedule Appointment</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">Book in-person or video advisory consultations.</p>
            </a>

            <a
              routerLink="/locator"
              class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-600 transition-all text-center space-y-3 group"
            >
              <div class="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 mx-auto flex items-center justify-center text-emerald-700 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <mat-icon class="text-2xl!">map</mat-icon>
              </div>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">Branch & ATM Finder</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">Locate fee-free smart ATMs and concierge branches.</p>
            </a>

            <a
              routerLink="/contact"
              class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-600 transition-all text-center space-y-3 group"
            >
              <div class="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 mx-auto flex items-center justify-center text-emerald-700 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <mat-icon class="text-2xl!">support_agent</mat-icon>
              </div>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">24/7 Client Care</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">Direct phone support and emergency card assistance.</p>
            </a>

            <a
              routerLink="/help"
              class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-600 transition-all text-center space-y-3 group"
            >
              <div class="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 mx-auto flex items-center justify-center text-emerald-700 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <mat-icon class="text-2xl!">help_center</mat-icon>
              </div>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">Knowledge Center</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">Searchable answers to banking and account questions.</p>
            </a>
          </div>
        </div>
      </section>
    </div>

    <!-- Mobile App Modal -->
    <app-mobile-app-modal [(isOpen)]="showAppModal"></app-mobile-app-modal>
  `,
})
export class HomePage {
  banking = inject(BankingService);
  showAppModal = signal<boolean>(false);

  readonly products = [
    {
      title: 'Premier Checking',
      route: 'checking',
      icon: 'account_balance',
      desc: 'Zero maintenance fees, nationwide fee-free ATMs, and 0.25% APY interest on daily balances.',
      stat: '0.25% APY · $0 Monthly Fee',
    },
    {
      title: 'High-Yield Savings & CDs',
      route: 'savings-cds',
      icon: 'savings',
      desc: 'Accelerate your liquidity with 4.85% APY savings and fixed 5.10% APY certificates of deposit.',
      stat: 'Up to 5.10% APY',
    },
    {
      title: 'Credit Cards',
      route: 'credit-cards',
      icon: 'credit_card',
      desc: 'Travel Elite Visa Signature with 3x dining/travel points, luxury concierge, and 0% foreign fees.',
      stat: '3x Points · No Foreign Fees',
    },
    {
      title: 'Home Mortgages',
      route: 'home-loans',
      icon: 'home',
      desc: 'Transparent 30-year and 15-year fixed home loans with instant digital pre-approval in 5 minutes.',
      stat: 'Rates from 5.75% APR',
    },
    {
      title: 'EV & Auto Loans',
      route: 'auto-loans',
      icon: 'directions_car',
      desc: 'Competitive financing for new, pre-owned, and EV clean energy vehicles with 0.50% APR discount.',
      stat: 'Starting at 4.99% APR',
    },
    {
      title: 'Small Business Hub',
      route: 'small-business',
      icon: 'business_center',
      desc: 'Dedicated commercial checking, multi-user authorizations, merchant settlement, and payroll tools.',
      stat: 'Next-Day Card Settlement',
    },
    {
      title: 'Wealth & Investing',
      route: 'investing',
      icon: 'trending_up',
      desc: 'Algorithmic automated portfolios, self-directed stock trading, and tax-advantaged IRAs.',
      stat: 'Commission-Free Trading',
    },
    {
      title: 'Students & Young Adults',
      route: 'students',
      icon: 'school',
      desc: 'No minimum deposit requirement, free debit card, budgeting tools, and credit score building.',
      stat: '$0 Minimum · Free Debit',
    },
  ];

  readonly educationArticles = [
    {
      title: 'The Compounding Multiplier: How 4.85% APY Builds Wealth',
      tag: 'Wealth Strategy',
      readTime: '4 min read',
      summary: 'Explore how daily compound interest outpaces inflation and accelerates your liquid emergency reserves.',
    },
    {
      title: 'Credit Utilization Architecture: Optimizing Your FICO Score',
      tag: 'Credit Health',
      readTime: '5 min read',
      summary: 'Master the 10% revolving credit rule and understand how timing card payments maximizes borrowing power.',
    },
    {
      title: 'First-Time Homebuyer Roadmap: Down Payments to Closing',
      tag: 'Real Estate',
      readTime: '6 min read',
      summary: 'A step-by-step financial breakdown of appraisal fees, escrow accounts, and rate lock timing in 2026.',
    },
  ];
}
