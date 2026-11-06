import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {AuthService} from '../../services/auth.service';
import {LogoComponent} from '../../components/brand/logo.component';

@Component({
  selector: 'app-sign-in-page',
  imports: [RouterLink, ReactiveFormsModule, MatIconModule, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-md mx-auto px-4 py-12">
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <!-- Brand Header -->
        <div class="text-center space-y-2">
          <div class="flex justify-center">
            <app-logo size="lg" [showText]="false"></app-logo>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
            Sign In to JChukwuemeka's
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Secure client banking portal &middot; 256-bit encryption
          </p>
        </div>

        @if (errorMessage()) {
          <div class="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
            <mat-icon class="text-sm! w-4! h-4! shrink-0 mt-0.5">error_outline</mat-icon>
            <span>{{ errorMessage() }}</span>
          </div>
        }

        <!-- Credentials Form -->
        <form [formGroup]="loginForm" (ngSubmit)="handleSignIn()" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">User ID or Registered Email</label>
            <input
              type="text"
              formControlName="userId"
              placeholder="e.g. alex.chukwuemeka"
              required
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-emerald-600"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <a routerLink="/forgot-credentials" class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
                Forgot password?
              </a>
            </div>
            <div class="relative">
              <input
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                placeholder="••••••••••••"
                required
                class="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-emerald-600"
              />
              <button
                type="button"
                (click)="showPassword.set(!showPassword())"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Toggle password visibility"
              >
                <mat-icon class="text-base! w-5! h-5!">{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs pt-1">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                formControlName="rememberDevice"
                class="accent-emerald-600 rounded"
              />
              <span class="text-slate-600 dark:text-slate-400">Remember this device</span>
            </label>
            <a routerLink="/forgot-credentials" class="text-slate-500 hover:text-emerald-700">Forgot User ID?</a>
          </div>

          <button
            type="submit"
            class="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <span>Proceed to 2FA Verification</span>
            <mat-icon class="text-sm! w-4! h-4!">arrow_forward</mat-icon>
          </button>
        </form>

        <!-- Fast Demo Credentials Helper -->
        <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
            Instant Demo Sign In (1-Click)
          </span>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              (click)="fillDemoUser('customer')"
              class="p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 font-semibold text-center transition-colors"
            >
              Customer Profile
              <span class="block text-[10px] text-slate-500 dark:text-slate-400 font-normal">Alex Chukwuemeka</span>
            </button>

            <button
              type="button"
              (click)="fillDemoUser('admin')"
              class="p-2.5 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 hover:bg-purple-100 font-semibold text-center transition-colors"
            >
              Admin & AML Lead
              <span class="block text-[10px] text-slate-500 dark:text-slate-400 font-normal">Sarah Jenkins</span>
            </button>
          </div>
        </div>

        <div class="text-center pt-2 text-xs text-slate-500">
          <span>New to JChukwuemeka's Financials?</span>
          <a routerLink="/onboarding" class="text-emerald-700 dark:text-emerald-400 font-bold ml-1 hover:underline">
            Open an account
          </a>
        </div>
      </div>
    </div>
  `,
})
export class SignInPage {
  private router = inject(Router);
  private auth = inject(AuthService);

  loginForm = new FormGroup({
    userId: new FormControl('alex.chukwuemeka', {nonNullable: true, validators: [Validators.required]}),
    password: new FormControl('DemoPassword2026!', {nonNullable: true, validators: [Validators.required]}),
    rememberDevice: new FormControl(true, {nonNullable: true}),
  });

  showPassword = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  fillDemoUser(role: 'customer' | 'admin') {
    if (role === 'customer') {
      this.loginForm.patchValue({
        userId: 'alex.chukwuemeka',
        password: 'DemoPassword2026!',
      });
    } else {
      this.loginForm.patchValue({
        userId: 'admin.compliance',
        password: 'AdminPassword2026!',
      });
    }
  }

  handleSignIn() {
    this.errorMessage.set(null);
    const {userId, password} = this.loginForm.getRawValue();
    const res = this.auth.initiateSignIn(userId, password);

    if (res.success) {
      this.router.navigate(['/sign-in/otp']);
    } else {
      this.errorMessage.set(res.error || 'Authentication error.');
    }
  }
}
