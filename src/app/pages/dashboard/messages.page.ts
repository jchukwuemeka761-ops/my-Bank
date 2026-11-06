import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {BankingService} from '../../services/banking.service';

@Component({
  selector: 'app-messages-page',
  imports: [DatePipe, FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Secure Communications</span>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Client Concierge Messaging
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          End-to-end encrypted direct channel with your dedicated personal banking officer.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <!-- Thread List (4 cols) -->
        <div class="md:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block">Conversations</span>
          @for (ticket of banking.tickets(); track ticket.id) {
            <button
              type="button"
              (click)="selectedTicketId.set(ticket.id)"
              class="w-full text-left p-3.5 rounded-2xl transition-all"
              [class]="selectedTicketId() === ticket.id ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/60 shadow-2xs' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'"
            >
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-slate-900 dark:text-white truncate">{{ ticket.subject }}</span>
                <span class="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {{ ticket.status }}
                </span>
              </div>
              <span class="block text-[11px] text-slate-400 mt-1 truncate">{{ ticket.messages[ticket.messages.length - 1].text }}</span>
            </button>
          }
        </div>

        <!-- Active Conversation View (8 cols) -->
        <div class="md:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-[520px] overflow-hidden">
          @if (activeTicket(); as t) {
            <!-- Chat Header -->
            <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 class="font-bold text-sm text-slate-900 dark:text-white">{{ t.subject }}</h4>
                <span class="text-xs text-slate-400 font-mono">Case #{{ t.id }} &middot; Category: {{ t.category }}</span>
              </div>
              <span class="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                Encrypted Channel
              </span>
            </div>

            <!-- Messages Stream -->
            <div class="flex-1 p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              @for (msg of t.messages; track msg.id) {
                <div class="flex gap-3" [class.justify-end]="msg.sender === 'user'">
                  @if (msg.sender === 'agent') {
                    <div class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0 font-bold text-xs">
                      JF
                    </div>
                  }

                  <div
                    class="max-w-[75%] p-4 rounded-2xl space-y-1"
                    [class]="msg.sender === 'user' ? 'bg-emerald-700 text-white rounded-br-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-xs'"
                  >
                    <span class="block text-[10px] font-bold opacity-75">{{ msg.senderName }}</span>
                    <p class="leading-relaxed">{{ msg.text }}</p>
                    <span class="block text-[10px] opacity-60 text-right pt-1">{{ msg.timestamp | date:'shortTime' }}</span>
                  </div>
                </div>
              }
            </div>

            <!-- Reply Box -->
            <form (ngSubmit)="sendReply()" class="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                [(ngModel)]="replyText"
                name="replyText"
                placeholder="Type your message to your banking officer..."
                class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
              />
              <button
                type="submit"
                [disabled]="!replyText.trim()"
                class="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold text-xs transition-colors flex items-center gap-1"
              >
                <span>Send</span>
                <mat-icon class="text-sm! w-4! h-4!">send</mat-icon>
              </button>
            </form>
          }
        </div>
      </div>
    </div>
  `,
})
export class MessagesPage {
  banking = inject(BankingService);

  selectedTicketId = signal<string>('tkt_01');
  replyText = '';

  activeTicket = () => {
    return this.banking.tickets().find((t) => t.id === this.selectedTicketId()) || this.banking.tickets()[0];
  };

  sendReply() {
    if (!this.replyText.trim()) return;
    this.banking.sendSupportMessage(this.selectedTicketId(), this.replyText);
    this.replyText = '';
  }
}
