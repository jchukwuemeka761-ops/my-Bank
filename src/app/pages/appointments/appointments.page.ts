import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {BankingService} from '../../services/banking.service';

@Component({
  selector: 'app-appointments-page',
  imports: [FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Personalized Advisory</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
          Schedule a Private Banking Consultation
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Meet with an experienced mortgage officer, wealth planner, or commercial banking specialist.
        </p>
      </div>

      @if (confirmed()) {
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-emerald-500 shadow-xl text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 mx-auto flex items-center justify-center text-emerald-600">
            <mat-icon class="text-4xl!">check_circle</mat-icon>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Appointment Confirmed!</h2>
          <p class="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Your {{ meetingType() === 'virtual' ? 'Virtual Video Call' : 'In-Person Branch Visit' }} with a JF Senior Advisor is locked in for:
          </p>
          <div class="inline-block p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold text-base">
            {{ selectedDate }} at {{ selectedTime }}
          </div>
          <p class="text-xs text-slate-400">
            A calendar confirmation (.ics) and video link have been sent to <strong>{{ clientEmail }}</strong>.
          </p>
          <div class="pt-4">
            <button
              type="button"
              (click)="resetForm()"
              class="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      } @else {
        <form (ngSubmit)="bookAppointment()" class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          <!-- Step 1: Select Topic -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              1. Select Consultation Topic
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              @for (topic of topics; track topic.id) {
                <button
                  type="button"
                  (click)="selectedTopic.set(topic.id)"
                  class="p-4 rounded-2xl border text-left transition-all flex items-start gap-3"
                  [class]="selectedTopic() === topic.id ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-600 ring-1 ring-emerald-600' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'"
                >
                  <mat-icon class="text-emerald-600 text-xl! shrink-0 mt-0.5">{{ topic.icon }}</mat-icon>
                  <div>
                    <span class="block font-bold text-sm text-slate-900 dark:text-white">{{ topic.label }}</span>
                    <span class="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ topic.desc }}</span>
                  </div>
                </button>
              }
            </div>
          </div>

          <!-- Step 2: Format -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              2. Meeting Format
            </label>
            <div class="grid grid-cols-2 gap-4">
              <button
                type="button"
                (click)="meetingType.set('in_person')"
                class="p-4 rounded-2xl border text-center transition-all"
                [class]="meetingType() === 'in_person' ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-600 ring-1 ring-emerald-600 font-bold text-emerald-900 dark:text-emerald-200' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'"
              >
                <mat-icon class="text-2xl! mb-1">store</mat-icon>
                <div class="text-sm font-semibold">In-Person at Branch</div>
              </button>

              <button
                type="button"
                (click)="meetingType.set('virtual')"
                class="p-4 rounded-2xl border text-center transition-all"
                [class]="meetingType() === 'virtual' ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-600 ring-1 ring-emerald-600 font-bold text-emerald-900 dark:text-emerald-200' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'"
              >
                <mat-icon class="text-2xl! mb-1">videocam</mat-icon>
                <div class="text-sm font-semibold">Virtual Video Call</div>
              </button>
            </div>
          </div>

          <!-- Step 3: Date & Time -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Preferred Date</label>
              <input
                type="date"
                [(ngModel)]="selectedDate"
                name="selectedDate"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Available Time Slot</label>
              <select
                [(ngModel)]="selectedTime"
                name="selectedTime"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              >
                <option value="09:30 AM EST">09:30 AM EST</option>
                <option value="11:00 AM EST">11:00 AM EST</option>
                <option value="01:30 PM EST">01:30 PM EST</option>
                <option value="03:00 PM EST">03:00 PM EST</option>
                <option value="04:30 PM EST">04:30 PM EST</option>
              </select>
            </div>
          </div>

          <!-- Step 4: Contact Info -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Full Name</label>
              <input
                type="text"
                [(ngModel)]="clientName"
                name="clientName"
                placeholder="Alex Chukwuemeka"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                [(ngModel)]="clientEmail"
                name="clientEmail"
                placeholder="alex@example.com"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                [(ngModel)]="clientPhone"
                name="clientPhone"
                placeholder="(555) 234-5678"
                required
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button
              type="submit"
              class="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>Confirm Advisory Appointment</span>
              <mat-icon class="text-sm! w-4! h-4!">calendar_today</mat-icon>
            </button>
          </div>
        </form>
      }
    </div>
  `,
})
export class AppointmentsPage {
  banking = inject(BankingService);

  topics = [
    { id: 'mortgage', label: 'Mortgage & Home Equity', desc: 'Pre-approvals, jumbo loans, and 15/30 year fixed rates.', icon: 'home' },
    { id: 'wealth', label: 'Wealth Strategy & IRAs', desc: 'Algorithmic portfolios, tax-smart retirement planning.', icon: 'trending_up' },
    { id: 'business', label: 'Commercial & Small Business', desc: 'Merchant settlement, commercial credit, and business checking.', icon: 'business' },
    { id: 'notary', label: 'Notary & Trust Services', desc: 'Affidavits, real estate deeds, and power of attorney execution.', icon: 'history_edu' },
  ];

  selectedTopic = signal<string>('mortgage');
  meetingType = signal<'in_person' | 'virtual'>('virtual');
  selectedDate = '2026-11-12';
  selectedTime = '11:00 AM EST';
  clientName = 'Alex Chukwuemeka';
  clientEmail = 'alex.chukwuemeka@example.com';
  clientPhone = '(555) 234-5678';
  confirmed = signal<boolean>(false);

  bookAppointment() {
    this.confirmed.set(true);
  }

  resetForm() {
    this.confirmed.set(false);
  }
}
