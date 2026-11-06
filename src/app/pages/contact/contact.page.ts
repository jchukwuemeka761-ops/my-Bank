import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-contact-page',
  imports: [FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <!-- Title -->
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Client Support</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
          Contact JChukwuemeka's Financials
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Reach our dedicated client service teams for account questions, wire assistance, and fraud prevention.
        </p>
      </div>

      <!-- Emergency Hotline Card -->
      <div class="bg-red-50 dark:bg-red-950/40 rounded-3xl p-6 sm:p-8 border border-red-200 dark:border-red-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/60 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
            <mat-icon class="text-2xl!">emergency</mat-icon>
          </div>
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">24/7 Emergency Hotline</span>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mt-0.5">Report Lost, Stolen, or Compromised Cards</h3>
            <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">
              If you detect unauthorized charges or suspect compromised credentials, reach our security desk immediately or freeze your card in the app.
            </p>
          </div>
        </div>

        <div class="shrink-0 flex items-center gap-3">
          <a
            href="tel:18005550199"
            class="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-colors flex items-center gap-2"
          >
            <mat-icon class="text-sm! w-4! h-4!">call</mat-icon>
            <span>1-800-555-0199</span>
          </a>
        </div>
      </div>

      <!-- Main Contact Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Inquiry Form (7 cols) -->
        <div class="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          @if (sent()) {
            <div class="text-center py-8 space-y-3">
              <mat-icon class="text-emerald-600 text-5xl!">check_circle</mat-icon>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white">Message Transmitted</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Thank you for contacting JChukwuemeka's Financials. Case ticket <strong>#JF-{{ ticketNum }}</strong> has been logged. A client manager will respond within 2 business hours.
              </p>
              <button
                type="button"
                (click)="sent.set(false)"
                class="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-700 text-white"
              >
                Send Another Inquiry
              </button>
            </div>
          } @else {
            <form (ngSubmit)="submitMessage()" class="space-y-4">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Send a Secure Inquiry</h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    [(ngModel)]="name"
                    name="name"
                    placeholder="Alex Chukwuemeka"
                    required
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    [(ngModel)]="email"
                    name="email"
                    placeholder="alex@example.com"
                    required
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    [(ngModel)]="phone"
                    name="phone"
                    placeholder="(555) 234-5678"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <select
                    [(ngModel)]="department"
                    name="department"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="general">Personal & Checking Accounts</option>
                    <option value="lending">Mortgages & Vehicle Loans</option>
                    <option value="business">Commercial & Merchant Services</option>
                    <option value="wealth">Private Wealth & IRAs</option>
                    <option value="fraud">Fraud & Card Security Desk</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Message</label>
                <textarea
                  rows="4"
                  [(ngModel)]="message"
                  name="message"
                  placeholder="How can we assist you today? Please do not include full passwords or card numbers..."
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                [disabled]="!message.trim()"
                class="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm shadow-sm transition-colors"
              >
                Submit Inquiry
              </button>
            </form>
          }
        </div>

        <!-- Headquarters & Phone Directory (5 cols) -->
        <div class="lg:col-span-5 space-y-6">
          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Corporate Headquarters</h3>
            <div class="text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <p class="font-semibold text-slate-900 dark:text-white">JChukwuemeka's Financials Tower</p>
              <p>100 Peachtree St NW, Suite 1800</p>
              <p>Atlanta, GA 30303</p>
              <p class="pt-2 text-emerald-700 dark:text-emerald-400 font-semibold">Routing Transit # 021000021</p>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Telephone Directory</h3>
            <div class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-500">General Customer Concierge</span>
              <strong class="text-slate-900 dark:text-white">(404) 555-0190</strong>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-500">Mortgage & Lending Desk</span>
              <strong class="text-slate-900 dark:text-white">(404) 555-0244</strong>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-500">International Collect Calls</span>
              <strong class="text-slate-900 dark:text-white">+1 (404) 555-0371</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ContactPage {
  name = 'Alex Chukwuemeka';
  email = 'alex.chukwuemeka@example.com';
  phone = '(555) 234-5678';
  department = 'general';
  message = '';
  sent = signal<boolean>(false);
  ticketNum = Math.floor(10000 + Math.random() * 90000);

  submitMessage() {
    this.sent.set(true);
    this.ticketNum = Math.floor(10000 + Math.random() * 90000);
  }
}
