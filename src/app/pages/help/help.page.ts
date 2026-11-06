import {ChangeDetectionStrategy, Component, computed, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';

interface FaqItem {
  id: string;
  category: 'accounts' | 'transfers' | 'security' | 'cards' | 'deposit';
  question: string;
  answer: string;
}

@Component({
  selector: 'app-help-page',
  imports: [RouterLink, FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <!-- Header -->
      <div class="text-center max-w-2xl mx-auto space-y-3">
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Knowledge Base</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Help Center & FAQs
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Everything you need to know about accounts, ledger security, wire transfers, and digital banking tools.
        </p>

        <!-- Search Bar -->
        <div class="relative pt-2">
          <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg! w-5! h-5!">search</mat-icon>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Search questions (e.g. routing number, card freeze, wire limits)..."
            class="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm shadow-xs focus:outline-hidden focus:border-emerald-600"
          />
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center justify-center gap-1.5 flex-wrap">
        <button
          type="button"
          (click)="selectedCategory.set('all')"
          class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors"
          [class]="selectedCategory() === 'all' ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
        >
          All Topics
        </button>
        <button
          type="button"
          (click)="selectedCategory.set('accounts')"
          class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors"
          [class]="selectedCategory() === 'accounts' ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
        >
          Accounts & Rates
        </button>
        <button
          type="button"
          (click)="selectedCategory.set('transfers')"
          class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors"
          [class]="selectedCategory() === 'transfers' ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
        >
          Transfers & Wires
        </button>
        <button
          type="button"
          (click)="selectedCategory.set('security')"
          class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors"
          [class]="selectedCategory() === 'security' ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
        >
          Security & 2FA
        </button>
        <button
          type="button"
          (click)="selectedCategory.set('cards')"
          class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors"
          [class]="selectedCategory() === 'cards' ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
        >
          Cards & Limits
        </button>
        <button
          type="button"
          (click)="selectedCategory.set('deposit')"
          class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors"
          [class]="selectedCategory() === 'deposit' ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
        >
          Mobile Check Deposit
        </button>
      </div>

      <!-- Questions List -->
      <div class="space-y-3">
        @for (item of filteredFaqs(); track item.id; let i = $index) {
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
            <button
              type="button"
              (click)="toggleQuestion(item.id)"
              class="w-full text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center justify-between gap-4"
            >
              <span>{{ item.question }}</span>
              <mat-icon
                class="text-slate-400 transition-transform duration-200 shrink-0"
                [class.rotate-180]="openQuestionId() === item.id"
              >
                expand_more
              </mat-icon>
            </button>

            @if (openQuestionId() === item.id) {
              <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {{ item.answer }}
              </div>
            }
          </div>
        }

        @if (filteredFaqs().length === 0) {
          <div class="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
            <mat-icon class="text-4xl! mb-2">sentiment_dissatisfied</mat-icon>
            <p class="text-sm font-semibold">No answers match your search term</p>
            <p class="text-xs mt-1">Try a different keyword or contact our 24/7 concierge.</p>
          </div>
        }
      </div>

      <!-- Need more help card -->
      <div class="bg-emerald-50/70 dark:bg-emerald-950/30 rounded-3xl p-6 sm:p-8 border border-emerald-100 dark:border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 class="font-bold text-base text-slate-900 dark:text-white">Still have questions?</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Our specialized banking concierge is available 24/7 via secure message or emergency phone.
          </p>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <a
            routerLink="/contact"
            class="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  `,
})
export class HelpPage {
  searchQuery = '';
  selectedCategory = signal<'all' | 'accounts' | 'transfers' | 'security' | 'cards' | 'deposit'>('all');
  openQuestionId = signal<string | null>('faq_01');

  readonly faqs: FaqItem[] = [
    {
      id: 'faq_01',
      category: 'accounts',
      question: "What is JChukwuemeka's Financials ABA Routing Number?",
      answer: "Our direct ABA routing transit number is 021000021. Use this number for inbound and outbound ACH direct deposits, automated utility bill debits, and domestic wire transfers.",
    },
    {
      id: 'faq_02',
      category: 'accounts',
      question: 'How is interest calculated on High-Yield Savings and CDs?',
      answer: 'Our High-Yield Savings earns 4.85% APY compounded daily on your settled ledger balance and credited on the last calendar day of each month. Certificates of Deposit earn fixed guaranteed yields (up to 5.10% APY on 12-month terms).',
    },
    {
      id: 'faq_03',
      category: 'transfers',
      question: 'How do double-entry ledger transfers work and prevent double-spending?',
      answer: 'JF operates on strict double-entry ledger principles. Every transfer produces equal and opposite debit and credit journal entries executed atomically on our secure backend. Client requests carry unique idempotency keys, guaranteeing that re-transmissions never double-charge your account.',
    },
    {
      id: 'faq_04',
      category: 'transfers',
      question: 'What are the daily wire transfer limits?',
      answer: 'Verified accounts have a standard outbound wire limit of $50,000 per day. For real estate closings or large capital movements above this threshold, please schedule a verbal verification callback through the Security Center.',
    },
    {
      id: 'faq_05',
      category: 'security',
      question: 'Why do I need a 6-digit OTP code on every login?',
      answer: 'To protect your assets against credential stuffing, phishing, and session hijacking, multi-factor authentication (MFA) is strictly required for every login session. You can receive your one-time code via SMS, email, or an authenticator app (TOTP).',
    },
    {
      id: 'faq_06',
      category: 'security',
      question: 'What happens if my account is locked after 5 failed attempts?',
      answer: 'If 5 consecutive incorrect OTP or password attempts are detected, the account enters a 15-minute defensive cooldown. You can reset your credentials via the "Forgot Password" self-service portal or call our fraud desk.',
    },
    {
      id: 'faq_07',
      category: 'cards',
      question: 'Can I instantly freeze my card if misplaced?',
      answer: 'Yes! Navigate to the Cards tab in your dashboard and toggle "Freeze Card". This instantly blocks new point-of-sale and online transactions within milliseconds, while continuing to allow pre-scheduled automatic bill payments.',
    },
    {
      id: 'faq_08',
      category: 'deposit',
      question: 'How does mobile check deposit work and what are the funds availability rules?',
      answer: 'Simply snap front and endorsed back photos of your check via the Mobile Check Deposit portal. Checks submitted by 8:00 PM EST on business days are reviewed and settled into your available balance the next morning.',
    },
  ];

  toggleQuestion(id: string) {
    this.openQuestionId.update((curr) => (curr === id ? null : id));
  }

  filteredFaqs = computed(() => {
    let list = this.faqs;
    const cat = this.selectedCategory();
    if (cat !== 'all') {
      list = list.filter((f) => f.category === cat);
    }
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
    }
    return list;
  });
}
