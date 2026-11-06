import {Injectable, computed, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {INITIAL_USERS} from '../lib/seed-data';
import {UserProfile} from '../types/banking.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);

  // Users storage
  private users = signal<UserProfile[]>(INITIAL_USERS);

  // Active user session
  readonly currentUser = signal<UserProfile | null>(INITIAL_USERS[0]); // Defaults to customer Alex Chukwuemeka
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  // Multi-Factor OTP State Machine
  readonly otpPendingUser = signal<UserProfile | null>(null);
  readonly otpChannel = signal<'sms' | 'email' | 'totp'>('sms');
  readonly otpCode = signal<string>('729415'); // Current expected demo OTP
  readonly otpExpiresAt = signal<number>(Date.now() + 5 * 60 * 1000);
  readonly otpAttemptsLeft = signal<number>(5);
  readonly otpResendCooldown = signal<number>(0);
  readonly rememberDevice = signal<boolean>(true);

  // Inactivity timeout tracking (10 minutes)
  readonly inactivityWarningVisible = signal<boolean>(false);
  readonly secondsUntilAutoLogout = signal<number>(60);
  private lastActivityTimestamp = Date.now();
  private inactivityCheckInterval: ReturnType<typeof setInterval> | null = null;

  // Dark / Light Theme
  readonly isDarkMode = signal<boolean>(false);

  constructor() {
    this.initTheme();
    this.initInactivityTracker();
  }

  private initTheme() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jf_theme');
      if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        this.setDarkMode(true);
      } else {
        this.setDarkMode(false);
      }
    }
  }

  setDarkMode(enable: boolean) {
    this.isDarkMode.set(enable);
    if (typeof document !== 'undefined') {
      if (enable) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('jf_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('jf_theme', 'light');
      }
    }
  }

  toggleDarkMode() {
    this.setDarkMode(!this.isDarkMode());
  }

  // 1-click Demo Switching between Customer and Admin
  switchToCustomer() {
    const alex = this.users().find((u) => u.userId === 'alex.chukwuemeka') || INITIAL_USERS[0];
    this.currentUser.set(alex);
  }

  switchToAdmin() {
    const admin = this.users().find((u) => u.userId === 'admin.compliance') || INITIAL_USERS[1];
    this.currentUser.set(admin);
  }

  // Sign In Process
  initiateSignIn(userIdOrEmail: string, passwordPlain: string): { success: boolean; error?: string } {
    if (!passwordPlain || passwordPlain.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const user = this.users().find(
      (u) =>
        u.userId.toLowerCase() === userIdOrEmail.toLowerCase() ||
        u.email.toLowerCase() === userIdOrEmail.toLowerCase(),
    );

    if (!user) {
      return { success: false, error: 'Invalid User ID or Password. Please check credentials.' };
    }

    if (user.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now()) {
      const minutesRemaining = Math.ceil((new Date(user.lockedUntil).getTime() - Date.now()) / 60000);
      return {
        success: false,
        error: `Account locked due to consecutive security failures. Try again in ${minutesRemaining} minutes.`,
      };
    }

    // Generate fresh 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpCode.set(generatedOtp);
    this.otpPendingUser.set(user);
    this.otpAttemptsLeft.set(5);
    this.otpExpiresAt.set(Date.now() + 5 * 60 * 1000);
    this.otpResendCooldown.set(30);

    return { success: true };
  }

  // OTP Verification
  verifyOtp(enteredCode: string): { success: boolean; error?: string } {
    if (Date.now() > this.otpExpiresAt()) {
      return { success: false, error: 'OTP has expired. Please request a new verification code.' };
    }

    if (this.otpAttemptsLeft() <= 1) {
      const user = this.otpPendingUser();
      if (user) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        this.updateUserInList(user);
      }
      return { success: false, error: 'Too many incorrect attempts. Account locked for 15 minutes.' };
    }

    // Accept exact OTP or demo master code '729415' or whatever was issued
    if (enteredCode === this.otpCode() || enteredCode === '729415') {
      const user = this.otpPendingUser();
      if (user) {
        user.lastLoginAt = new Date().toISOString();
        user.failedLoginAttempts = 0;
        this.currentUser.set(user);
        this.updateUserInList(user);
        this.otpPendingUser.set(null);
        this.recordActivity();
        return { success: true };
      }
    }

    this.otpAttemptsLeft.update((n) => n - 1);
    return {
      success: false,
      error: `Incorrect OTP. ${this.otpAttemptsLeft()} attempts remaining.`,
    };
  }

  resendOtp(channel?: 'sms' | 'email' | 'totp') {
    if (channel) {
      this.otpChannel.set(channel);
    }
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpCode.set(generatedOtp);
    this.otpExpiresAt.set(Date.now() + 5 * 60 * 1000);
    this.otpAttemptsLeft.set(5);
    this.otpResendCooldown.set(30);
  }

  registerNewUser(newUser: UserProfile) {
    this.users.update((list) => [...list, newUser]);
    this.currentUser.set(newUser);
    this.recordActivity();
  }

  logout() {
    this.currentUser.set(null);
    this.otpPendingUser.set(null);
    this.inactivityWarningVisible.set(false);
    this.router.navigate(['/']);
  }

  recordActivity() {
    this.lastActivityTimestamp = Date.now();
    this.inactivityWarningVisible.set(false);
  }

  extendSession() {
    this.recordActivity();
  }

  private initInactivityTracker() {
    if (typeof window === 'undefined') return;

    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach((event) => {
      window.addEventListener(event, () => {
        if (!this.inactivityWarningVisible()) {
          this.lastActivityTimestamp = Date.now();
        }
      });
    });

    this.inactivityCheckInterval = setInterval(() => {
      if (!this.currentUser()) return;

      const idleMs = Date.now() - this.lastActivityTimestamp;
      const tenMinutesMs = 10 * 60 * 1000;
      const warningThresholdMs = 9 * 60 * 1000; // Warn 1 minute before

      if (idleMs >= tenMinutesMs) {
        this.logout();
      } else if (idleMs >= warningThresholdMs) {
        this.inactivityWarningVisible.set(true);
        const remainingSeconds = Math.max(0, Math.floor((tenMinutesMs - idleMs) / 1000));
        this.secondsUntilAutoLogout.set(remainingSeconds);
      } else {
        this.inactivityWarningVisible.set(false);
      }
    }, 1000);
  }

  private updateUserInList(updated: UserProfile) {
    this.users.update((list) => list.map((u) => (u.id === updated.id ? updated : u)));
  }
}
