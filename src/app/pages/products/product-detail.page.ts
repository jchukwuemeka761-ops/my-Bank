import {ChangeDetectionStrategy, Component, computed, inject, input, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {BankingService} from '../../services/banking.service';

interface ProductInfo {
  id: string;
  category: string;
  title: string;
  headline: string;
  subtitle: string;
  rateHighlight: string;
  fdicNote: string;
  features: { icon: string; title: string; desc: string }[];
  fees: { item: string; fee: string; note: string }[];
  faqs: { q: string; a: string }[];
}

@Component({
  selector: 'app-product-detail-page',
  imports: [RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (currentProduct(); as prod) {
      <div class="space-y-16 pb-20">
        <!-- Hero Header -->
        <section class="bg-gradient-to-b from-emerald-950/10 dark:from-emerald-950/30 via-transparent to-transparent pt-12 pb-16 border-b border-slate-200 dark:border-slate-800">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="max-w-3xl space-y-4">
              <div class="flex items-center gap-2">
                <a routerLink="/" class="text-xs font-semibold text-slate-500 hover:text-emerald-700">Home</a>
                <span class="text-slate-300">/</span>
                <span class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">{{ prod.category }}</span>
              </div>

              <h1 class="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {{ prod.title }}
              </h1>

              <p class="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {{ prod.subtitle }}
              </p>

              <div class="flex flex-wrap items-center gap-4 pt-4">
                <a
                  routerLink="/onboarding"
                  class="px-6 py-3.5 rounded-2xl bg-[#F2B632] hover:bg-[#E5A820] text-slate-950 font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <span>Apply Online in 5 Minutes</span>
                  <mat-icon class="text-sm! w-4! h-4!">arrow_forward</mat-icon>
                </a>

                <div class="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  {{ prod.rateHighlight }}
                </div>
              </div>

              <p class="text-xs text-slate-400 pt-2">
                {{ prod.fdicNote }}
              </p>
            </div>
          </div>
        </section>

        <!-- Product Features Grid -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mb-8">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Core Advantages</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Engineered For Modern High Performers
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @for (feat of prod.features; track feat.title) {
              <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                  <mat-icon class="text-2xl!">{{ feat.icon }}</mat-icon>
                </div>
                <h3 class="font-bold text-base text-slate-900 dark:text-white">{{ feat.title }}</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ feat.desc }}</p>
              </div>
            }
          </div>
        </section>

        <!-- Fee Transparency Schedule -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Transparent Pricing</span>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Zero Hidden Surprises
              </h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                JChukwuemeka's Financials eliminates junk fees so your hard-earned money stays with you.
              </p>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead>
                  <tr class="border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th class="py-3 px-4">Service / Feature</th>
                    <th class="py-3 px-4">Fee Structure</th>
                    <th class="py-3 px-4">Details & Notes</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  @for (fee of prod.fees; track fee.item) {
                    <tr>
                      <td class="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{{ fee.item }}</td>
                      <td class="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">{{ fee.fee }}</td>
                      <td class="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400">{{ fee.note }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- FAQs Accordion -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-3xl space-y-6">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Common Questions</span>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Frequently Asked Questions
              </h2>
            </div>

            <div class="space-y-3">
              @for (faq of prod.faqs; track faq.q; let i = $index) {
                <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 transition-colors">
                  <button
                    type="button"
                    (click)="toggleFaq(i)"
                    class="w-full text-left font-semibold text-sm text-slate-900 dark:text-white flex items-center justify-between gap-4"
                  >
                    <span>{{ faq.q }}</span>
                    <mat-icon class="text-slate-400 transition-transform duration-200" [class.rotate-180]="openFaqIndex() === i">
                      expand_more
                    </mat-icon>
                  </button>
                  @if (openFaqIndex() === i) {
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                      {{ faq.a }}
                    </p>
                  }
                </div>
              }
            </div>
          </div>
        </section>

        <!-- Bottom Call to Action -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            class="rounded-3xl p-8 sm:p-12 text-center text-white space-y-4"
            style="background: linear-gradient(135deg, #0B6B4F 0%, #084E3A 100%);"
          >
            <h2 class="text-2xl sm:text-3xl font-bold">Ready to Experience Premier Digital Banking?</h2>
            <p class="text-sm text-emerald-100 max-w-xl mx-auto">
              Join thousands of clients banking securely with JChukwuemeka's Financials. Fast paperless KYC verification.
            </p>
            <div class="pt-2">
              <a
                routerLink="/onboarding"
                class="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#F2B632] hover:bg-[#E5A820] text-slate-950 font-bold text-sm shadow-lg transition-transform hover:scale-105"
              >
                <span>Open Your Account Today</span>
                <mat-icon class="text-sm! w-4! h-4!">arrow_forward</mat-icon>
              </a>
            </div>
          </div>
        </section>
      </div>
    }
  `,
})
export class ProductDetailPage {
  category = input<string>('checking');
  banking = inject(BankingService);
  openFaqIndex = signal<number | null>(0);

  toggleFaq(idx: number) {
    this.openFaqIndex.update((curr) => (curr === idx ? null : idx));
  }

  currentProduct = computed<ProductInfo>(() => {
    const cat = this.category() || 'checking';
    return PRODUCT_CATALOG[cat] || PRODUCT_CATALOG['checking'];
  });
}

const PRODUCT_CATALOG: Record<string, ProductInfo> = {
  checking: {
    id: 'checking',
    category: 'Checking Accounts',
    title: 'JF Premier & High-Yield Checking',
    headline: 'Everyday Banking Engineered For Freedom',
    subtitle: 'Zero monthly maintenance fees, nationwide fee-free ATMs, instant contactless payments, and real-time ledger accounting.',
    rateHighlight: '0.25% APY Daily Balance Earnings',
    fdicNote: 'Member FDIC. Insured up to $250,000 per depositor.',
    features: [
      { icon: 'account_balance_wallet', title: 'Zero Monthly Fees', desc: 'No balance minimums, no unexpected maintenance deductions, and no overdraft surprises.' },
      { icon: 'atm', title: '55,000+ Free ATMs', desc: 'Fee-free cash withdrawals at Allpoint and MoneyPass partner machines across North America.' },
      { icon: 'bolt', title: '2-Day Early Direct Deposit', desc: 'Get your paycheck up to 2 days faster when direct deposit is routed to your JF account.' },
    ],
    fees: [
      { item: 'Monthly Maintenance Fee', fee: '$0.00', note: 'No conditions or minimum direct deposits required.' },
      { item: 'In-Network ATM Withdrawals', fee: '$0.00', note: 'Free at 55,000+ partner network ATMs.' },
      { item: 'Out-of-Network ATM Surcharge Reimbursement', fee: 'Up to $15.00/mo', note: 'Automatically credited back to your account at month-end.' },
      { item: 'Overdraft Protection Transfers', fee: '$0.00', note: 'Instant automated sweep from linked savings.' },
    ],
    faqs: [
      { q: 'How quickly can I open a checking account?', a: 'Our 5-step digital onboarding takes under 5 minutes with real-time biometric and ID verification.' },
      { q: 'What is the routing number for direct deposit?', a: 'JF ABA Routing transit number is 021000021.' },
      { q: 'Can I link external accounts?', a: 'Yes! Instant ACH linking and wire transfers are supported directly from your dashboard.' },
    ],
  },
  'savings-cds': {
    id: 'savings-cds',
    category: 'Savings & Certificates of Deposit',
    title: 'High-Yield Savings & Guaranteed CDs',
    headline: 'Accelerate Your Compound Wealth',
    subtitle: 'Earn an extraordinary 4.85% APY on liquid savings with daily compounding, plus fixed-term CDs up to 5.10% APY.',
    rateHighlight: '4.85% APY Liquid · 5.10% APY 12-Month CD',
    fdicNote: 'Member FDIC. Backed by the full faith and credit of the United States Government.',
    features: [
      { icon: 'trending_up', title: '4.85% High-Yield APY', desc: 'Over 10x the national average with daily compound interest credited monthly.' },
      { icon: 'lock_clock', title: 'Fixed-Rate CDs (5.10% APY)', desc: 'Lock in guaranteed high returns for 6, 12, 24, or 36 months.' },
      { icon: 'savings', title: 'Automated Savings Goals', desc: 'Create custom savings envelopes for vacations, down payments, and emergency funds.' },
    ],
    fees: [
      { item: 'Monthly Account Fee', fee: '$0.00', note: 'Keep 100% of the interest you earn.' },
      { item: 'Minimum Opening Deposit', fee: '$0.00', note: 'Start growing your balance with any amount.' },
      { item: 'ACH Transfers Out', fee: '$0.00', note: 'Unlimited online transfers between your JF accounts.' },
    ],
    faqs: [
      { q: 'How does interest compound?', a: 'Interest is calculated daily based on your end-of-day ledger balance and deposited monthly.' },
      { q: 'Are there limits on savings withdrawals?', a: 'Enjoy unlimited internal transfers to your JF checking account anytime.' },
    ],
  },
  'credit-cards': {
    id: 'credit-cards',
    category: 'Credit Cards',
    title: 'Travel Elite Visa & Cashback Rewards',
    headline: 'Elevate Every Swipe and Itinerary',
    subtitle: 'From 3x points on global travel and dining to zero foreign transaction fees, experience premium credit designed for global citizens.',
    rateHighlight: '3x Travel & Dining · 0% Foreign Transaction Fees',
    fdicNote: 'Credit approval required. Variable APRs apply.',
    features: [
      { icon: 'flight_takeoff', title: 'Global Travel Protection', desc: 'Comprehensive trip delay insurance, rental car collision coverage, and 24/7 concierge.' },
      { icon: 'lock', title: 'Instant Card Freeze & Limits', desc: 'Control daily spending and freeze lost cards in real-time from the mobile app.' },
      { icon: 'redeem', title: 'Unlimited Flexible Rewards', desc: 'Redeem points for airfare, hotel stays, statement credits, or high-yield savings deposits.' },
    ],
    fees: [
      { item: 'Foreign Transaction Fee', fee: '$0.00 (0%)', note: 'Pay in any currency without international exchange markups.' },
      { item: 'Annual Fee (Cash Rewards)', fee: '$0.00', note: 'Zero annual fee for lifetime of account.' },
      { item: 'Annual Fee (Travel Elite)', fee: '$95.00', note: 'Waived for first year with $3,000 intro spend.' },
    ],
    faqs: [
      { q: 'Does freezing my card stop recurring payments?', a: 'No, pre-authorized recurring subscriptions (like utility bills) continue uninterrupted.' },
      { q: 'Can I set international travel notices?', a: 'Yes! Toggle your itinerary in the Cards tab to prevent false fraud trip blocks.' },
    ],
  },
  'home-loans': {
    id: 'home-loans',
    category: 'Mortgages & Home Lending',
    title: 'Custom Mortgages & Home Refinancing',
    headline: 'Your Dream Home Financed With Clarity',
    subtitle: 'Competitive fixed-rate mortgages, transparent closing cost breakdowns, and dedicated loan specialists from offer to closing.',
    rateHighlight: '30Y Fixed from 6.45% APR · 15Y Fixed from 5.75% APR',
    fdicNote: 'Equal Housing Lender. NMLS #910241.',
    features: [
      { icon: 'home', title: 'Digital Pre-Approval', desc: 'Receive a verifiable digital pre-approval letter in as little as 15 minutes.' },
      { icon: 'price_check', title: 'Rate Lock Guarantee', desc: 'Lock your interest rate for up to 60 days while shopping for your home.' },
      { icon: 'support_agent', title: 'Dedicated Loan Officer', desc: 'Direct access to experienced mortgage underwriters every step of the journey.' },
    ],
    fees: [
      { item: 'Pre-Approval Application Fee', fee: '$0.00', note: 'Complimentary instant credit check pre-approval.' },
      { item: 'Rate Lock Fee', fee: '$0.00', note: '60-day standard rate lock included.' },
      { item: 'Underwriting & Processing', fee: '$995.00', note: 'Flat-rate transparent lender fee.' },
    ],
    faqs: [
      { q: 'What credit score is needed for best rates?', a: 'Scores of 740+ qualify for our premier tier interest rates and lowest down payments.' },
      { q: 'Can I refinance an existing mortgage?', a: 'Yes! We offer cash-out and rate-and-term refinancing options.' },
    ],
  },
  'auto-loans': {
    id: 'auto-loans',
    category: 'Vehicle Financing',
    title: 'New, Used & EV Auto Loans',
    headline: 'Drive Off With Low Rates & Green Rebates',
    subtitle: 'Finance your next vehicle with competitive rates starting from 4.99% APR, plus an exclusive 0.50% APR discount for electric vehicles.',
    rateHighlight: 'Rates starting from 4.99% APR · 0.50% EV Rebate',
    fdicNote: 'Loans subject to credit approval and vehicle collateral verification.',
    features: [
      { icon: 'electric_car', title: 'Clean Energy EV Discount', desc: 'Special 0.50% APR rate discount on zero-emission battery electric cars.' },
      { icon: 'speed', title: 'Fast Digital Funding', desc: 'Approved funds can be wired directly to dealership or seller on the same day.' },
      { icon: 'tune', title: 'Flexible Terms (24-84 Months)', desc: 'Customize your monthly payment to fit your household cash flow.' },
    ],
    fees: [
      { item: 'Application Fee', fee: '$0.00', note: 'Zero fee to apply or check pre-approval rates.' },
      { item: 'Prepayment Penalty', fee: '$0.00', note: 'Pay off your vehicle early without any penalties.' },
    ],
    faqs: [
      { q: 'Which vehicles qualify for the EV discount?', a: 'Any fully electric or plug-in hybrid vehicle qualifies for the rate discount.' },
    ],
  },
  'small-business': {
    id: 'small-business',
    category: 'Business Banking',
    title: 'Commercial Banking & Merchant Services',
    headline: 'Scale Your Enterprise With Smart Tools',
    subtitle: 'High-volume commercial accounts, multi-user role authorizations, integrated payroll, and working capital credit lines.',
    rateHighlight: 'Next-Day Card Settlement · Multi-User Permissions',
    fdicNote: 'FDIC Insured to statutory business limits.',
    features: [
      { icon: 'point_of_sale', title: 'Integrated Merchant POS', desc: 'Next-day credit card processing settlements with transparent interchange rates.' },
      { icon: 'group', title: 'Multi-User Role Permissions', desc: 'Delegate access to accountants, managers, and partners with granular controls.' },
      { icon: 'receipt_long', title: 'Automated Invoicing & Tax', desc: 'Export ledger records directly into QuickBooks, Xero, and CSV formats.' },
    ],
    fees: [
      { item: 'Monthly Business Maintenance', fee: '$0.00', note: 'Waived with $5,000 average monthly balance.' },
      { item: 'Electronic Deposits', fee: '$0.00', note: 'First 250 monthly transactions free.' },
    ],
    faqs: [
      { q: 'What documents are required to open a business account?', a: 'Articles of incorporation, EIN verification letter, and officer government ID.' },
    ],
  },
  investing: {
    id: 'investing',
    category: 'Wealth & Investing',
    title: 'Self-Directed & Automated Portfolios',
    headline: 'Build Long-Term Wealth Intelligently',
    subtitle: 'Commission-free stock trading, fractional shares, algorithmic asset allocation, and tax-smart retirement planning (IRAs).',
    rateHighlight: 'Zero Commission Trades · Algorithmic Balancing',
    fdicNote: 'Investment products: Not FDIC Insured · No Bank Guarantee · May Lose Value.',
    features: [
      { icon: 'pie_chart', title: 'Automated Smart Portfolios', desc: 'Diversified global stock and bond index portfolios rebalanced automatically.' },
      { icon: 'swap_horiz', title: 'Zero Commission Trading', desc: 'Trade major US equities and exchange-traded funds without per-trade fees.' },
      { icon: 'savings', title: 'Traditional & Roth IRAs', desc: 'Tax-deductible or tax-free retirement growth strategies.' },
    ],
    fees: [
      { item: 'Online Stock & ETF Trades', fee: '$0.00', note: 'Commission-free trading on US exchanges.' },
      { item: 'Robo-Advisory Management Fee', fee: '0.25%/yr', note: 'Includes automated tax-loss harvesting and rebalancing.' },
    ],
    faqs: [
      { q: 'Is the investment platform simulated in demo mode?', a: 'Yes! In this demo environment, order executions are clearly labeled as simulated paper trading.' },
    ],
  },
  students: {
    id: 'students',
    category: 'Student Banking',
    title: 'Zero-Fee Banking for Young Adults',
    headline: 'Smart Financial Foundations Start Here',
    subtitle: 'Zero monthly fees, zero minimum balances, free debit card, campus credit builder, and financial literacy coaching.',
    rateHighlight: 'Zero Fees · Free Contactless Debit Card',
    fdicNote: 'Member FDIC. Available for clients aged 17–24.',
    features: [
      { icon: 'school', title: 'Zero Minimum Balance', desc: 'Never worry about keeping a minimum balance while studying.' },
      { icon: 'credit_card', title: 'Campus Credit Builder', desc: 'Build credit history safely with automated guardrails.' },
      { icon: 'menu_book', title: 'JF Financial Academy', desc: 'Free interactive modules on credit scoring, taxes, and investing basics.' },
    ],
    fees: [
      { item: 'Monthly Service Charge', fee: '$0.00', note: '100% free through age 24.' },
      { item: 'ATM Surcharge Waivers', fee: 'Up to $10.00/mo', note: 'We reimburse campus ATM fees.' },
    ],
    faqs: [
      { q: 'Do I need a co-signer?', a: 'Students 18 and older can open an individual account instantly with student ID verification.' },
    ],
  },
};
