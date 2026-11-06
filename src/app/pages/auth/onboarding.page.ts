import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {AuthService} from '../../services/auth.service';
import {BankingService} from '../../services/banking.service';
import {UserProfile} from '../../types/banking.types';

@Component({
  selector: 'app-onboarding-page',
  imports: [RouterLink, FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Onboarding Card -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
        <!-- Progress Stepper Header -->
        <div>
          <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            <span>Step {{ currentStep() }} of 5</span>
            <span class="text-emerald-700 dark:text-emerald-400">{{ stepTitles[currentStep() - 1] }}</span>
          </div>

          <!-- Progress Bar -->
          <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              class="h-full bg-emerald-600 transition-all duration-300"
              [style.width.%]="(currentStep() / 5) * 100"
            ></div>
          </div>
        </div>

        <!-- Step 1: Personal Details -->
        @if (currentStep() === 1) {
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Let's get started with your personal details</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Required by federal banking regulations (USA PATRIOT Act) to establish identity.
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">First Legal Name</label>
                <input
                  type="text"
                  [(ngModel)]="firstName"
                  name="firstName"
                  placeholder="e.g. Alex"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Legal Name</label>
                <input
                  type="text"
                  [(ngModel)]="lastName"
                  name="lastName"
                  placeholder="e.g. Chukwuemeka"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                <input
                  type="date"
                  [(ngModel)]="dob"
                  name="dob"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Social Security Number / TIN</label>
                <input
                  type="text"
                  [(ngModel)]="ssn"
                  name="ssn"
                  placeholder="•••-••-4821"
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
                  placeholder="you@example.com"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Phone (for 2FA)</label>
                <input
                  type="tel"
                  [(ngModel)]="phone"
                  name="phone"
                  placeholder="+1 (555) 234-5678"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>
        }

        <!-- Step 2: Address & Employment -->
        @if (currentStep() === 2) {
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Residential Address & Financial Profile</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Must be a physical address (P.O. boxes cannot be used for primary account registration).
              </p>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Street Address</label>
                <input
                  type="text"
                  [(ngModel)]="street"
                  name="street"
                  placeholder="100 Peachtree St NW, Apt 4B"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    [(ngModel)]="city"
                    name="city"
                    placeholder="Atlanta"
                    required
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    [(ngModel)]="state"
                    name="state"
                    placeholder="GA"
                    required
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    [(ngModel)]="zip"
                    name="zip"
                    placeholder="30303"
                    required
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Employment Status</label>
                  <select
                    [(ngModel)]="employmentStatus"
                    name="employmentStatus"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="Employed Full-Time">Employed Full-Time</option>
                    <option value="Self-Employed">Self-Employed / Founder</option>
                    <option value="Retired">Retired</option>
                    <option value="Student">Student</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Estimated Annual Income</label>
                  <select
                    [(ngModel)]="annualIncome"
                    name="annualIncome"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                    <option value="$100,000 - $200,000">$100,000 - $200,000</option>
                    <option value="$200,000+">$200,000+</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Step 3: Identity Verification (KYC) -->
        @if (currentStep() === 3) {
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Verify Your Identity</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Upload a government-issued photo ID (Driver's License or Passport).
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Simulated Document Upload Card -->
              <div
                (click)="simulateDocUpload()"
                class="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors"
                [class]="docUploaded() ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' : 'border-slate-300 dark:border-slate-700 hover:border-emerald-600'"
              >
                @if (docUploaded()) {
                  <mat-icon class="text-emerald-600 text-4xl! mb-2">check_circle</mat-icon>
                  <h4 class="font-bold text-sm text-emerald-900 dark:text-emerald-200">US Driver License Verified</h4>
                  <p class="text-xs text-emerald-700 dark:text-emerald-400 mt-1">Biometric confidence score: 99.2%</p>
                } @else {
                  <mat-icon class="text-slate-400 text-4xl! mb-2">cloud_upload</mat-icon>
                  <h4 class="font-bold text-sm text-slate-800 dark:text-slate-200">Tap to Upload Government ID</h4>
                  <p class="text-xs text-slate-400 mt-1">JPEG, PNG, or PDF up to 10MB (Click to simulate)</p>
                }
              </div>

              <div class="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 text-xs space-y-3">
                <h4 class="font-bold text-slate-900 dark:text-white">Why is this required?</h4>
                <p class="text-slate-500 dark:text-slate-400 leading-relaxed">
                  To prevent identity theft, account hijacking, and financial fraud, our automated compliance engine cross-checks your photo ID against government registries in real time.
                </p>
                <div class="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
                  <mat-icon class="text-sm! w-4! h-4!">lock</mat-icon>
                  <span>Encrypted with AES-256 GCM</span>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Step 4: Account Selection & Credentials -->
        @if (currentStep() === 4) {
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Choose Product & Create Credentials</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select your starting account and configure strong login credentials.
              </p>
            </div>

            <!-- Account Selection -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Starting Account Package</label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  (click)="selectedProduct.set('premier_bundle')"
                  class="p-4 rounded-2xl border text-left transition-all"
                  [class]="selectedProduct() === 'premier_bundle' ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 ring-1 ring-emerald-600' : 'border-slate-200 dark:border-slate-700'"
                >
                  <span class="block font-bold text-sm text-slate-900 dark:text-white">Premier Bundle</span>
                  <span class="block text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-1">Checking + 4.85% Savings</span>
                </button>

                <button
                  type="button"
                  (click)="selectedProduct.set('checking_only')"
                  class="p-4 rounded-2xl border text-left transition-all"
                  [class]="selectedProduct() === 'checking_only' ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 ring-1 ring-emerald-600' : 'border-slate-200 dark:border-slate-700'"
                >
                  <span class="block font-bold text-sm text-slate-900 dark:text-white">Premier Checking</span>
                  <span class="block text-xs text-slate-500 mt-1">0.25% APY · $0 Fee</span>
                </button>

                <button
                  type="button"
                  (click)="selectedProduct.set('business_suite')"
                  class="p-4 rounded-2xl border text-left transition-all"
                  [class]="selectedProduct() === 'business_suite' ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 ring-1 ring-emerald-600' : 'border-slate-200 dark:border-slate-700'"
                >
                  <span class="block font-bold text-sm text-slate-900 dark:text-white">Small Business</span>
                  <span class="block text-xs text-slate-500 mt-1">Commercial Checking</span>
                </button>
              </div>
            </div>

            <!-- Credentials -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Create User ID</label>
                <input
                  type="text"
                  [(ngModel)]="userId"
                  name="userId"
                  placeholder="e.g. alex.chukwuemeka"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Anti-Phishing Security Phrase</label>
                <input
                  type="text"
                  [(ngModel)]="antiPhishingPhrase"
                  name="antiPhishingPhrase"
                  placeholder="e.g. Golden Palm 99"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
                <span class="text-[10px] text-slate-400">Displayed on every authentic OTP prompt from JF.</span>
              </div>

              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Create Secure Password</label>
                <input
                  type="password"
                  [(ngModel)]="password"
                  (ngModelChange)="checkPasswordStrength()"
                  name="password"
                  placeholder="Min 8 characters, number, and symbol"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />

                <!-- Password Strength Meter -->
                <div class="mt-2 space-y-1">
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="text-slate-500">Password Strength:</span>
                    <span class="font-bold" [class]="strengthColor()">{{ strengthLabel() }}</span>
                  </div>
                  <div class="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex gap-1">
                    <div class="h-full transition-all duration-200" [class]="pwScore() >= 1 ? 'w-1/4 bg-red-500' : 'w-1/4 bg-transparent'"></div>
                    <div class="h-full transition-all duration-200" [class]="pwScore() >= 2 ? 'w-1/4 bg-amber-500' : 'w-1/4 bg-transparent'"></div>
                    <div class="h-full transition-all duration-200" [class]="pwScore() >= 3 ? 'w-1/4 bg-blue-500' : 'w-1/4 bg-transparent'"></div>
                    <div class="h-full transition-all duration-200" [class]="pwScore() >= 4 ? 'w-1/4 bg-emerald-500' : 'w-1/4 bg-transparent'"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Step 5: Terms & Verification -->
        @if (currentStep() === 5) {
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Disclosures & Instant Digital Activation</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Please review and accept our electronic signature disclosures and terms of service.
              </p>
            </div>

            <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2 max-h-48 overflow-y-auto">
              <p><strong>Electronic Fund Transfer Disclosure (Regulation E):</strong> By checking below, you agree to receive electronic disclosures and monthly statements.</p>
              <p><strong>USA PATRIOT Act Notice:</strong> To help the government fight the funding of terrorism and money laundering, Federal law requires all financial institutions to obtain, verify, and record information identifying each account owner.</p>
              <p><strong>Deposit Account Agreement:</strong> You acknowledge that deposits are insured up to $250,000 by the FDIC.</p>
            </div>

            <div class="space-y-3">
              <label class="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="agreeTerms"
                  name="agreeTerms"
                  class="mt-1 accent-emerald-600"
                />
                <span class="text-xs text-slate-700 dark:text-slate-300">
                  I agree to the JChukwuemeka's Financials Electronic Communications Disclosure, Fee Schedule, and Privacy Policy under penalty of perjury.
                </span>
              </label>

              <label class="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="agreeBackupWithholding"
                  name="agreeBackupWithholding"
                  class="mt-1 accent-emerald-600"
                />
                <span class="text-xs text-slate-700 dark:text-slate-300">
                  I certify that the Taxpayer Identification Number (SSN/TIN) provided is correct and I am not subject to IRS backup withholding.
                </span>
              </label>
            </div>
          </div>
        }

        <!-- Bottom Navigation Controls -->
        <div class="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
          @if (currentStep() > 1) {
            <button
              type="button"
              (click)="prevStep()"
              class="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Back
            </button>
          } @else {
            <a routerLink="/sign-in" class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
              Already have an account? Sign in
            </a>
          }

          @if (currentStep() < 5) {
            <button
              type="button"
              (click)="nextStep()"
              class="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>Continue</span>
              <mat-icon class="text-xs! w-3.5! h-3.5!">arrow_forward</mat-icon>
            </button>
          } @else {
            <button
              type="button"
              [disabled]="!agreeTerms || !agreeBackupWithholding"
              (click)="completeOnboarding()"
              class="px-8 py-3 rounded-2xl bg-[#F2B632] hover:bg-[#E5A820] disabled:opacity-50 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Activate Account Now</span>
              <mat-icon class="text-sm! w-4! h-4!">verified</mat-icon>
            </button>
          }
        </div>
      </div>
    </div>
  `,
})
export class OnboardingPage {
  private router = inject(Router);
  private auth = inject(AuthService);
  private banking = inject(BankingService);

  currentStep = signal<number>(1);
  stepTitles = [
    'Personal Identity',
    'Address & Profile',
    'Document Verification',
    'Account & Credentials',
    'Terms & Activation',
  ];

  firstName = 'Alex';
  lastName = 'Chukwuemeka';
  dob = '1990-05-14';
  ssn = '•••-••-4821';
  email = 'alex.chukwuemeka@example.com';
  phone = '+1 (555) 234-5678';

  street = '100 Peachtree St NW, Suite 1800';
  city = 'Atlanta';
  state = 'GA';
  zip = '30303';
  employmentStatus = 'Employed Full-Time';
  annualIncome = '$100,000 - $200,000';

  docUploaded = signal<boolean>(true);

  selectedProduct = signal<string>('premier_bundle');
  userId = 'alex.chukwuemeka';
  antiPhishingPhrase = 'Golden Palm & Emerald Shield';
  password = 'SecurePassword2026!';
  pwScore = signal<number>(4);

  agreeTerms = true;
  agreeBackupWithholding = true;

  simulateDocUpload() {
    this.docUploaded.set(true);
  }

  checkPasswordStrength() {
    const pw = this.password;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    this.pwScore.set(score);
  }

  strengthLabel = signal<string>('Strong');
  strengthColor = signal<string>('text-emerald-600');

  nextStep() {
    this.currentStep.update((s) => Math.min(5, s + 1));
  }

  prevStep() {
    this.currentStep.update((s) => Math.max(1, s - 1));
  }

  completeOnboarding() {
    const newUser: UserProfile = {
      id: 'user_' + Date.now(),
      userId: this.userId || 'alex.chukwuemeka',
      email: this.email,
      phone: this.phone,
      firstName: this.firstName,
      lastName: this.lastName,
      role: 'customer',
      kycStatus: 'verified',
      antiPhishingPhrase: this.antiPhishingPhrase,
      lastLoginAt: new Date().toISOString(),
      lastLoginIp: '192.168.1.42 (Atlanta, GA)',
      twoFactorEnabled: true,
      twoFactorMethod: 'sms',
      failedLoginAttempts: 0,
      lockedUntil: null,
      preferredCurrency: 'USD',
      createdAt: new Date().toISOString(),
    };

    this.auth.registerNewUser(newUser);
    this.router.navigate(['/dashboard']);
  }
}
