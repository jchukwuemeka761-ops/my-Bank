import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {BankingService} from '../../services/banking.service';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

@Component({
  selector: 'app-ai-assistant-widget',
  imports: [MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Floating Launcher Button -->
    <div class="fixed bottom-6 right-6 z-40">
      @if (!isOpen()) {
        <button
          type="button"
          (click)="isOpen.set(true)"
          class="flex items-center gap-2.5 px-4 py-3 rounded-full text-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 select-none"
          style="background: linear-gradient(135deg, #0B6B4F 0%, #084E3A 100%); border: 1.5px solid rgba(242, 182, 50, 0.4);"
          aria-label="Open JF Financial AI Assistant"
        >
          <div class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <mat-icon class="text-xl! w-5! h-5! text-[#F2B632]">smart_toy</mat-icon>
          <span class="text-sm font-bold tracking-tight">Ask JF Assistant</span>
        </button>
      }

      <!-- Chat Modal Window -->
      @if (isOpen()) {
        <div
          class="w-[380px] sm:w-[420px] h-[550px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
          role="dialog"
          aria-label="JF Financial Assistant Chat"
        >
          <!-- Chat Header -->
          <div
            class="px-5 py-4 text-white flex items-center justify-between"
            style="background: linear-gradient(135deg, #0B6B4F 0%, #084E3A 100%);"
          >
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <mat-icon class="text-[#F2B632] text-xl! w-5! h-5!">psychology</mat-icon>
              </div>
              <div>
                <h3 class="text-sm font-bold leading-tight flex items-center gap-1.5">
                  <span>JF Financial Intelligence</span>
                </h3>
                <span class="text-[11px] text-emerald-200 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Privacy-guarded AI concierge
                </span>
              </div>
            </div>

            <button
              type="button"
              (click)="isOpen.set(false)"
              class="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close Assistant"
            >
              <mat-icon class="text-lg! w-5! h-5!">close</mat-icon>
            </button>
          </div>

          <!-- Privacy Guard Banner -->
          <div class="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <mat-icon class="text-xs! w-3.5! h-3.5! text-emerald-600">security</mat-icon>
            <span>Sensitive tokens (passwords, PINs, OTPs, full card numbers) are automatically redacted.</span>
          </div>

          <!-- Message History -->
          <div class="flex-1 p-4 overflow-y-auto space-y-3.5 text-sm">
            @for (msg of messages(); track msg.id) {
              <div
                class="flex gap-2.5"
                [class.justify-end]="msg.sender === 'user'"
              >
                @if (msg.sender === 'assistant') {
                  <div class="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5">
                    <mat-icon class="text-sm! w-4! h-4!">support_agent</mat-icon>
                  </div>
                }

                <div
                  class="max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed"
                  [class]="msg.sender === 'user' ? 'bg-emerald-700 text-white rounded-br-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs'"
                >
                  <p class="whitespace-pre-line">{{ msg.text }}</p>
                  <span class="block text-[10px] opacity-60 text-right mt-1">
                    {{ msg.timestamp }}
                  </span>
                </div>
              </div>
            }

            @if (isLoading()) {
              <div class="flex items-center gap-2 text-xs text-slate-400 p-2">
                <mat-icon class="text-sm! w-4! h-4! animate-spin">refresh</mat-icon>
                <span>JF Assistant is thinking...</span>
              </div>
            }
          </div>

          <!-- Suggested Quick Prompts -->
          <div class="px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              type="button"
              (click)="sendQuickPrompt('What is the current High-Yield Savings APY?')"
              class="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-emerald-600 text-slate-700 dark:text-slate-300 shrink-0"
            >
              Savings APY?
            </button>
            <button
              type="button"
              (click)="sendQuickPrompt('What is the routing number for JF?')"
              class="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-emerald-600 text-slate-700 dark:text-slate-300 shrink-0"
            >
              Routing number?
            </button>
            <button
              type="button"
              (click)="sendQuickPrompt('How do I freeze my debit card?')"
              class="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-emerald-600 text-slate-700 dark:text-slate-300 shrink-0"
            >
              Freeze card?
            </button>
          </div>

          <!-- Input Footer -->
          <form (ngSubmit)="sendMessage()" class="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              name="chatInput"
              [(ngModel)]="inputText"
              placeholder="Ask about products, rates, transfers..."
              class="flex-1 bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-emerald-600 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
              autocomplete="off"
            />
            <button
              type="submit"
              [disabled]="!inputText.trim() || isLoading()"
              class="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white transition-colors"
              aria-label="Send message"
            >
              <mat-icon class="text-sm! w-4! h-4!">send</mat-icon>
            </button>
          </form>
        </div>
      }
    </div>
  `,
})
export class AiAssistantWidgetComponent {
  private http = inject(HttpClient);
  private banking = inject(BankingService);

  isOpen = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  inputText = '';

  readonly messages = signal<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am your JChukwuemeka's Financials AI Concierge. How can I help you today? You can ask me about account rates, routing numbers, wire transfers, card controls, or loan pre-approvals.",
      timestamp: 'Just now',
    },
  ]);

  sendQuickPrompt(prompt: string) {
    this.inputText = prompt;
    this.sendMessage();
  }

  // Sanitize user text to redact potential card PANs, SSNs, and passwords
  private sanitizeInput(text: string): string {
    return text
      .replace(/\b(?:\d[ -]*?){13,16}\b/g, '[REDACTED_CARD_NUMBER]')
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED_SSN]')
      .replace(/(?:password|pin|otp|cvv)\s*[:=]\s*\S+/gi, '[REDACTED_CREDENTIAL]');
  }

  sendMessage() {
    const raw = this.inputText.trim();
    if (!raw || this.isLoading()) return;

    const sanitized = this.sanitizeInput(raw);
    this.inputText = '';

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: raw, // Show user's text in client
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    this.messages.update((list) => [...list, userMsg]);
    this.isLoading.set(true);

    // Call server endpoint with sanitized prompt
    this.http.post<{ response: string }>('/api/ai/chat', { prompt: sanitized }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        const reply: ChatMessage = {
          id: 'reply_' + Date.now(),
          sender: 'assistant',
          text: res.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        this.messages.update((list) => [...list, reply]);
      },
      error: () => {
        // High-quality local intelligence fallback
        this.isLoading.set(false);
        const fallbackReply = this.generateLocalFallback(sanitized);
        const reply: ChatMessage = {
          id: 'reply_' + Date.now(),
          sender: 'assistant',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        this.messages.update((list) => [...list, reply]);
      },
    });
  }

  private generateLocalFallback(prompt: string): string {
    const p = prompt.toLowerCase();
    const rates = this.banking.rates();

    if (p.includes('routing') || p.includes('aba')) {
      return "The routing number for JChukwuemeka's Financials is 021000021. You can use this for direct deposits, incoming wires, and external ACH transfers.";
    }
    if (p.includes('apy') || p.includes('interest') || p.includes('savings rate')) {
      return `Our High-Yield Savings Account currently earns a guaranteed ${rates.highYieldSavingsApy}% APY with daily compounding and no monthly service fees. Our 12-Month CD is currently yielding ${rates.cd12MonthApy}% APY.`;
    }
    if (p.includes('freeze') || p.includes('card')) {
      return 'You can instantly freeze or unfreeze any of your debit or credit cards in the Cards section of your dashboard. Freezing immediately blocks all new authorization attempts while preserving scheduled recurring bills.';
    }
    if (p.includes('deposit') || p.includes('check')) {
      return 'Mobile check deposit is available 24/7 in your dashboard. Simply take clear photos of the front and endorsed back of your check. Deposits submitted before 8:00 PM EST are credited next business morning.';
    }
    if (p.includes('mortgage') || p.includes('loan')) {
      return `Our 30-Year Fixed Mortgage starts from ${rates.mortgage30YearApr}% APR, and 15-Year Fixed starts from ${rates.mortgage15YearApr}% APR. You can calculate monthly payments and apply for instant pre-approval in the Loans & Mortgages dashboard!`;
    }
    if (p.includes('transfer') || p.includes('wire')) {
      return "JF supports three transfer types: Instant internal transfers between your own accounts, fast P2P transfers to other customers via email/phone, and standard ACH/Wire transfers to external US institutions.";
    }

    return "Thank you for asking! JChukwuemeka's Financials provides comprehensive digital banking with FDIC-insured checking, 4.85% APY High-Yield Savings, Travel Elite Visa credit cards, and mobile check deposit. Please navigate to the Dashboard to manage your accounts or reach out to our 24/7 support team.";
  }
}
