import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {AuthService} from '../../services/auth.service';
import {LogoComponent} from '../brand/logo.component';

interface MegaMenuCategory {
  id: string;
  title: string;
  route: string;
  icon: string;
  description: string;
  items: { label: string; desc: string; route: string; badge?: string }[];
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatIconModule, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-18 gap-4">
          <!-- Brand Logo -->
          <a routerLink="/" class="shrink-0 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 rounded-lg p-1">
            <app-logo></app-logo>
          </a>

          <!-- Desktop Navigation with Mega-Menu -->
          <nav class="hidden lg:flex items-center gap-1 xl:gap-2">
            @for (cat of megaMenuCategories; track cat.id) {
              <div
                class="relative group"
                (mouseenter)="activeMenu.set(cat.id)"
                (mouseleave)="activeMenu.set(null)"
              >
                <button
                  type="button"
                  [routerLink]="['/products', cat.route]"
                  class="px-2.5 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1"
                >
                  <span>{{ cat.title }}</span>
                  <mat-icon class="text-xs! w-3.5! h-3.5! text-slate-400 group-hover:rotate-180 transition-transform duration-200">
                    expand_more
                  </mat-icon>
                </button>

                <!-- Dropdown Mega Menu Panel -->
                @if (activeMenu() === cat.id) {
                  <div
                    class="absolute top-full left-1/2 -translate-x-1/2 w-96 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 mt-1 grid gap-2 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div class="pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <mat-icon class="text-emerald-600 dark:text-emerald-400 text-lg! w-5! h-5!">{{ cat.icon }}</mat-icon>
                        <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{{ cat.title }} Hub</span>
                      </div>
                      <a
                        [routerLink]="['/products', cat.route]"
                        (click)="activeMenu.set(null)"
                        class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                      >
                        View All &rarr;
                      </a>
                    </div>

                    <div class="grid gap-2 pt-1">
                      @for (item of cat.items; track item.label) {
                        <a
                          [routerLink]="['/products', cat.route]"
                          (click)="activeMenu.set(null)"
                          class="p-2.5 rounded-xl hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 transition-colors group/item block"
                        >
                          <div class="flex items-center justify-between">
                            <span class="text-sm font-semibold text-slate-900 dark:text-white group-hover/item:text-emerald-700 dark:group-hover/item:text-emerald-400">
                              {{ item.label }}
                            </span>
                            @if (item.badge) {
                              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                                {{ item.badge }}
                              </span>
                            }
                          </div>
                          <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {{ item.desc }}
                          </p>
                        </a>
                      }
                    </div>
                  </div>
                }
              </div>
            }

            <!-- Additional Quick Links -->
            <a
              routerLink="/locator"
              routerLinkActive="text-emerald-700 dark:text-emerald-400 font-semibold"
              class="px-2 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              ATM / Branches
            </a>

            <a
              routerLink="/help"
              routerLinkActive="text-emerald-700 dark:text-emerald-400 font-semibold"
              class="px-2 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              Help & FAQ
            </a>
          </nav>

          <!-- Right Action Zone -->
          <div class="flex items-center gap-2.5">
            @if (auth.isAuthenticated()) {
              @if (auth.isAdmin()) {
                <a
                  routerLink="/admin"
                  class="px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1.5"
                >
                  <mat-icon class="text-sm! w-4! h-4!">admin_panel_settings</mat-icon>
                  Admin Portal
                </a>
              }
              <a
                routerLink="/dashboard"
                class="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm flex items-center gap-1.5 transition-all"
              >
                <mat-icon class="text-sm! w-4! h-4!">account_balance_wallet</mat-icon>
                <span>Dashboard</span>
              </a>
              <button
                type="button"
                (click)="auth.logout()"
                class="p-2 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Sign Out"
                aria-label="Sign out"
              >
                <mat-icon class="text-base! w-5! h-5!">logout</mat-icon>
              </button>
            } @else {
              <a
                routerLink="/sign-in"
                class="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors"
              >
                Sign in
              </a>

              <a
                routerLink="/onboarding"
                class="px-4 py-2 rounded-xl text-sm font-semibold text-slate-900 bg-[#F2B632] hover:bg-[#E5A820] shadow-sm transition-all flex items-center gap-1"
              >
                <span>Open an account</span>
                <mat-icon class="text-sm! w-4! h-4!">arrow_forward</mat-icon>
              </a>
            }

            <!-- Mobile Hamburger Button -->
            <button
              type="button"
              (click)="mobileMenuOpen.set(!mobileMenuOpen())"
              class="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              <mat-icon class="text-xl! w-6! h-6!">{{ mobileMenuOpen() ? 'close' : 'menu' }}</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      @if (mobileMenuOpen()) {
        <div class="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div class="grid gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Products & Banking</span>
            @for (cat of megaMenuCategories; track cat.id) {
              <a
                [routerLink]="['/products', cat.route]"
                (click)="mobileMenuOpen.set(false)"
                class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-sm"
              >
                <mat-icon class="text-emerald-600 text-base! w-5! h-5!">{{ cat.icon }}</mat-icon>
                <span>{{ cat.title }}</span>
              </a>
            }
          </div>

          <div class="pt-2 border-t border-slate-200 dark:border-slate-800 grid gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Links</span>
            <a
              routerLink="/locator"
              (click)="mobileMenuOpen.set(false)"
              class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium"
            >
              <mat-icon class="text-slate-500 text-base! w-5! h-5!">location_on</mat-icon>
              <span>Branch & ATM Locator</span>
            </a>
            <a
              routerLink="/appointments"
              (click)="mobileMenuOpen.set(false)"
              class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium"
            >
              <mat-icon class="text-slate-500 text-base! w-5! h-5!">event</mat-icon>
              <span>Schedule Appointment</span>
            </a>
            <a
              routerLink="/help"
              (click)="mobileMenuOpen.set(false)"
              class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium"
            >
              <mat-icon class="text-slate-500 text-base! w-5! h-5!">help_outline</mat-icon>
              <span>Help Center & FAQ</span>
            </a>
            <a
              routerLink="/contact"
              (click)="mobileMenuOpen.set(false)"
              class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium"
            >
              <mat-icon class="text-slate-500 text-base! w-5! h-5!">support_agent</mat-icon>
              <span>Contact Support</span>
            </a>
          </div>

          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            @if (auth.isAuthenticated()) {
              <a
                routerLink="/dashboard"
                (click)="mobileMenuOpen.set(false)"
                class="w-full py-3 rounded-xl text-center bg-emerald-700 text-white font-semibold text-sm"
              >
                Go to Dashboard
              </a>
              <button
                type="button"
                (click)="auth.logout(); mobileMenuOpen.set(false)"
                class="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold"
              >
                Sign Out
              </button>
            } @else {
              <a
                routerLink="/sign-in"
                (click)="mobileMenuOpen.set(false)"
                class="w-full py-3 rounded-xl text-center border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm"
              >
                Sign In
              </a>
              <a
                routerLink="/onboarding"
                (click)="mobileMenuOpen.set(false)"
                class="w-full py-3 rounded-xl text-center bg-[#F2B632] hover:bg-[#E5A820] text-slate-950 font-bold text-sm shadow-sm"
              >
                Open an Account
              </a>
            }
          </div>
        </div>
      }
    </header>
  `,
})
export class HeaderComponent {
  auth = inject(AuthService);
  activeMenu = signal<string | null>(null);
  mobileMenuOpen = signal<boolean>(false);

  readonly megaMenuCategories: MegaMenuCategory[] = [
    {
      id: 'checking',
      title: 'Checking',
      route: 'checking',
      icon: 'account_balance',
      description: 'Modern checking with zero hidden fees and high interest rewards.',
      items: [
        { label: 'Premier Checking', desc: 'No monthly fees, 0.25% APY, fee-free nationwide ATMs.', route: 'checking', badge: 'Popular' },
        { label: 'High-Yield Checking', desc: 'Earn premium yield on daily qualifying balances.', route: 'checking' },
        { label: 'Student Checking', desc: 'Tailored for young adults with zero minimum balance.', route: 'checking' },
      ],
    },
    {
      id: 'savings',
      title: 'Savings & CDs',
      route: 'savings-cds',
      icon: 'savings',
      description: 'Maximize your compound wealth with industry-leading yields.',
      items: [
        { label: 'High-Yield Savings', desc: '4.85% APY with daily compounding and no lock-in.', route: 'savings-cds', badge: '4.85% APY' },
        { label: 'Certificate of Deposit (CD)', desc: 'Guaranteed 5.10% APY on 12-month fixed terms.', route: 'savings-cds', badge: '5.10% APY' },
        { label: 'Money Market Account', desc: 'Check-writing privileges combined with premium interest.', route: 'savings-cds' },
      ],
    },
    {
      id: 'cards',
      title: 'Credit Cards',
      route: 'credit-cards',
      icon: 'credit_card',
      description: 'Reward your lifestyle with travel points and cashback perks.',
      items: [
        { label: 'Travel Elite Visa Signature', desc: '3x points on travel/dining, zero foreign transaction fees.', route: 'credit-cards', badge: 'Top Pick' },
        { label: 'Cashback Everyday Mastercard', desc: 'Unlimited 2% cash back on all eligible everyday spend.', route: 'credit-cards' },
        { label: 'Credit Builder Secured Card', desc: 'Build or restore credit with zero annual fee.', route: 'credit-cards' },
      ],
    },
    {
      id: 'home-loans',
      title: 'Home Loans',
      route: 'home-loans',
      icon: 'home',
      description: 'Competitive mortgage financing from pre-approval to closing.',
      items: [
        { label: '30-Year Fixed Mortgage', desc: 'Predictable low monthly payments for long-term peace.', route: 'home-loans' },
        { label: '15-Year Accelerated Fixed', desc: 'Pay down principal faster with reduced interest rates.', route: 'home-loans' },
        { label: 'Mortgage Refinance', desc: 'Lower your payment or tap home equity with cash-out.', route: 'home-loans' },
      ],
    },
    {
      id: 'auto-loans',
      title: 'Auto Loans',
      route: 'auto-loans',
      icon: 'directions_car',
      description: 'Low-rate financing for new, pre-owned, and EV vehicles.',
      items: [
        { label: 'New Vehicle Financing', desc: 'Rates starting from 4.99% APR with flexible terms.', route: 'auto-loans' },
        { label: 'Pre-Owned Car Loans', desc: 'Transparent terms and quick pre-approval.', route: 'auto-loans' },
        { label: 'Clean Energy EV Discount', desc: 'Additional 0.50% APR discount for qualifying electric cars.', route: 'auto-loans', badge: 'Green Perk' },
      ],
    },
    {
      id: 'business',
      title: 'Small Business',
      route: 'small-business',
      icon: 'business_center',
      description: 'Comprehensive banking tools to power entrepreneurs and growth.',
      items: [
        { label: 'Business Checking', desc: 'High-volume transaction tiers and multi-user controls.', route: 'small-business' },
        { label: 'Commercial Lines of Credit', desc: 'Flexible liquidity for inventory and expansion.', route: 'small-business' },
        { label: 'Integrated Merchant Services', desc: 'Next-day card settlement and invoicing tools.', route: 'small-business' },
      ],
    },
    {
      id: 'investing',
      title: 'Investing',
      route: 'investing',
      icon: 'trending_up',
      description: 'Intelligent portfolios, automated advisory, and retirement planning.',
      items: [
        { label: 'Smart Automated Portfolios', desc: 'Algorithmic asset allocation and tax-loss harvesting.', route: 'investing' },
        { label: 'Self-Directed Wealth Trading', desc: 'Commission-free trading on major US stocks and ETFs.', route: 'investing' },
        { label: 'Traditional & Roth IRAs', desc: 'Tax-advantaged retirement accounts for your future.', route: 'investing' },
      ],
    },
    {
      id: 'students',
      title: 'Students & Young Adults',
      route: 'students',
      icon: 'school',
      description: 'Empowering future leaders with zero fees and financial guidance.',
      items: [
        { label: 'Zero-Fee Student Account', desc: 'No monthly maintenance or minimum balance requirements.', route: 'students' },
        { label: 'Campus Credit Starter', desc: 'Start building credit history responsibly with credit guardrails.', route: 'students' },
        { label: 'Financial Academy', desc: 'Interactive lessons on budgeting, investing, and taxes.', route: 'students' },
      ],
    },
  ];
}
