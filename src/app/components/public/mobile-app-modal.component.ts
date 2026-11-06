import {ChangeDetectionStrategy, Component, model, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-mobile-app-modal',
  imports: [FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-6 relative">
          <!-- Close button -->
          <button
            type="button"
            (click)="isOpen.set(false)"
            class="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <mat-icon class="text-xl! w-6! h-6!">close</mat-icon>
          </button>

          <div class="space-y-4">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <mat-icon class="text-2xl!">phone_iphone</mat-icon>
            </div>

            <div>
              <h3 id="modal-headline" class="text-xl font-bold text-slate-900 dark:text-white">
                Get the JF Mobile Banking App
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enjoy mobile check deposit, instant card freeze, push alerts, and biometric login on iOS & Android.
              </p>
            </div>

            @if (sent()) {
              <div class="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                <mat-icon class="text-emerald-600 text-3xl!">check_circle</mat-icon>
                <h4 class="text-sm font-bold text-emerald-900 dark:text-emerald-200">Download Link Sent!</h4>
                <p class="text-xs text-emerald-700 dark:text-emerald-300">
                  We sent a link to <span class="font-semibold">{{ targetInput }}</span>. Tap the link on your mobile device to install the app.
                </p>
                <button
                  type="button"
                  (click)="sent.set(false); isOpen.set(false)"
                  class="mt-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 underline"
                >
                  Done
                </button>
              </div>
            } @else {
              <div class="space-y-3 pt-2">
                <div class="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    type="button"
                    (click)="mode.set('phone')"
                    class="flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all"
                    [class]="mode() === 'phone' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'"
                  >
                    Text me a link
                  </button>
                  <button
                    type="button"
                    (click)="mode.set('email')"
                    class="flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all"
                    [class]="mode() === 'email' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'"
                  >
                    Email me a link
                  </button>
                </div>

                <form (ngSubmit)="sendLink()" class="space-y-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {{ mode() === 'phone' ? 'Mobile Phone Number' : 'Email Address' }}
                    </label>
                    <input
                      type="text"
                      name="targetInput"
                      [(ngModel)]="targetInput"
                      [placeholder]="mode() === 'phone' ? '+1 (555) 000-0000' : 'you@example.com'"
                      required
                      class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  <button
                    type="submit"
                    [disabled]="!targetInput.trim()"
                    class="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold text-sm transition-colors shadow-sm"
                  >
                    Send Download Link
                  </button>
                </form>

                <div class="pt-2 flex items-center justify-center gap-4 text-xs text-slate-400">
                  <span class="flex items-center gap-1">
                    <mat-icon class="text-sm! w-4! h-4!">apple</mat-icon> iOS App Store
                  </span>
                  <span>&bull;</span>
                  <span class="flex items-center gap-1">
                    <mat-icon class="text-sm! w-4! h-4!">android</mat-icon> Google Play
                  </span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class MobileAppModalComponent {
  isOpen = model<boolean>(false);
  mode = signal<'phone' | 'email'>('phone');
  targetInput = '';
  sent = signal<boolean>(false);

  sendLink() {
    if (!this.targetInput.trim()) return;
    this.sent.set(true);
  }
}
