import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-otp-page',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-md mx-auto px-4 py-12">
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <!-- Security Shield Icon & Header -->
        <div class="text-center space-y-2">
          <div class="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 mx-auto flex items-center justify-center text-emerald-700 dark:text-emerald-400">
            <mat-icon class="text-3xl!">lock</mat-icon>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
            Two-Factor Verification
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Enter the 6-digit one-time passcode sent to your device.
          </p>
        </div>

        <!-- Anti-Phishing Guard Phrase -->
        <div class="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center space-y-1">
          <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
            Your Personal Anti-Phishing Security Phrase
          </span>
          <p class="text-sm font-extrabold text-emerald-950 dark:text-emerald-200">
            &ldquo;{{ targetUser()?.antiPhishingPhrase || 'Golden Palm & Emerald Shield' }}&rdquo;
          </p>
          <span class="text-[10px] text-slate-500 dark:text-slate-400 block">
            If this phrase does not match what you configured, do NOT enter your code.
          </span>
        </div>

        <!-- Channel Selector -->
        <div class="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            (click)="selectChannel('sms')"
            class="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
            [class]="auth.otpChannel() === 'sms' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'"
          >
            SMS Phone
          </button>
          <button
            type="button"
            (click)="selectChannel('email')"
            class="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
            [class]="auth.otpChannel() === 'email' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'"
          >
            Email
          </button>
          <button
            type="button"
            (click)="selectChannel('totp')"
            class="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
            [class]="auth.otpChannel() === 'totp' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'"
          >
            Authenticator App
          </button>
        </div>

        <!-- Demonstration Code Hint Pill -->
        <button
          type="button"
          (click)="fillDemoCode()"
          class="w-full p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 border border-amber-300 dark:border-amber-800 text-center text-xs text-amber-900 dark:text-amber-200 font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 group"
        >
          <span>Demo Passcode Issued:</span>
          <span class="font-mono text-sm font-bold tracking-widest text-amber-800 dark:text-amber-300 bg-amber-200/60 dark:bg-amber-900/80 px-2 py-0.5 rounded-md">{{ auth.otpCode() }}</span>
          <span class="text-[10px] text-amber-700 dark:text-amber-400 group-hover:underline">(Click to auto-fill)</span>
        </button>

        @if (errorMessage()) {
          <div class="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
            <mat-icon class="text-sm! w-4! h-4! shrink-0 mt-0.5">error_outline</mat-icon>
            <span>{{ errorMessage() }}</span>
          </div>
        }

        <!-- 6-Digit Auto-Advancing Boxes -->
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-2">
            @for (digit of digits(); track $index; let i = $index) {
              <input
                #digitInput
                type="text"
                maxlength="1"
                inputmode="numeric"
                [id]="'otp_cell_' + i"
                [value]="digits()[i]"
                (input)="onDigitInput($event, i)"
                (keydown)="onDigitKeydown($event, i)"
                (paste)="onPaste($event)"
                class="w-12 h-14 rounded-2xl border-2 text-center text-xl font-bold font-mono text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden transition-all tabular-nums"
              />
            }
          </div>

          <div class="flex items-center justify-between text-xs text-slate-500">
            <span>Attempts remaining: <strong class="text-slate-800 dark:text-slate-200">{{ auth.otpAttemptsLeft() }}</strong></span>
            <span>Expires in: <strong class="text-emerald-700 dark:text-emerald-400 tabular-nums">04:58</strong></span>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="button"
          (click)="submitOtp()"
          [disabled]="isCodeIncomplete()"
          class="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>Verify & Access Account</span>
          <mat-icon class="text-sm! w-4! h-4!">verified_user</mat-icon>
        </button>

        <!-- Resend Section with Cooldown -->
        <div class="pt-2 text-center text-xs text-slate-500">
          <span>Didn't receive the code?</span>
          <button
            type="button"
            (click)="handleResend()"
            class="text-emerald-700 dark:text-emerald-400 font-bold ml-1 hover:underline"
          >
            Resend Passcode
          </button>
        </div>
      </div>
    </div>
  `,
})
export class OtpPage {
  private router = inject(Router);
  auth = inject(AuthService);

  digits = signal<string[]>(['', '', '', '', '', '']);
  errorMessage = signal<string | null>(null);

  targetUser = computed(() => this.auth.otpPendingUser() || this.auth.currentUser());

  selectChannel(channel: 'sms' | 'email' | 'totp') {
    this.auth.resendOtp(channel);
  }

  isCodeIncomplete = computed(() => {
    return this.digits().some((d) => !d);
  });

  fillDemoCode() {
    const code = this.auth.otpCode();
    if (code && code.length === 6) {
      this.digits.set(code.split(''));
      this.submitOtp();
    }
  }

  onDigitInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/[^0-9]/g, '');
    const current = [...this.digits()];
    current[index] = val ? val[val.length - 1] : '';
    this.digits.set(current);

    if (val && index < 5) {
      const nextInput = document.getElementById('otp_cell_' + (index + 1)) as HTMLInputElement;
      nextInput?.focus();
    }

    if (!this.isCodeIncomplete()) {
      this.submitOtp();
    }
  }

  onDigitKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.digits()[index] && index > 0) {
      const prevInput = document.getElementById('otp_cell_' + (index - 1)) as HTMLInputElement;
      prevInput?.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') || '';
    const cleanNumbers = pasted.replace(/[^0-9]/g, '').slice(0, 6);
    const updated = ['', '', '', '', '', ''];

    for (let i = 0; i < 6; i++) {
      updated[i] = cleanNumbers[i] || '';
    }
    this.digits.set(updated);

    if (cleanNumbers.length === 6) {
      this.submitOtp();
    }
  }

  handleResend() {
    this.auth.resendOtp();
    this.errorMessage.set(null);
  }

  submitOtp() {
    const fullCode = this.digits().join('');
    const res = this.auth.verifyOtp(fullCode);

    if (res.success) {
      const user = this.auth.currentUser();
      if (user?.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } else {
      this.errorMessage.set(res.error || 'Verification failed.');
      this.digits.set(['', '', '', '', '', '']);
      const firstInput = document.getElementById('otp_cell_0') as HTMLInputElement;
      firstInput?.focus();
    }
  }
}
