import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {LogoComponent} from '../brand/logo.component';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, MatIconModule, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Top Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          <!-- Brand Info -->
          <div class="col-span-2">
            <app-logo size="md"></app-logo>
            <p class="mt-4 text-sm text-slate-400 max-w-sm leading-relaxed">
              JChukwuemeka's Financials (JF) delivers next-generation personal, business, and wealth banking powered by real-time intelligence, double-entry ledger security, and uncompromising client dedication.
            </p>

            <div class="mt-6 flex items-center gap-3 text-xs text-slate-400">
              <div class="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
                <mat-icon class="text-emerald-400 text-sm! w-4! h-4!">verified_user</mat-icon>
                <span class="font-semibold text-slate-200">FDIC Insured</span>
              </div>
              <div class="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
                <mat-icon class="text-amber-400 text-sm! w-4! h-4!">home</mat-icon>
                <span class="font-semibold text-slate-200">Equal Housing Lender</span>
              </div>
            </div>
          </div>

          <!-- Column 1: Deposit Banking -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-white mb-4">Personal Banking</h4>
            <ul class="space-y-2.5 text-sm">
              <li><a routerLink="/products/checking" class="hover:text-emerald-400 transition-colors">Premier Checking</a></li>
              <li><a routerLink="/products/savings-cds" class="hover:text-emerald-400 transition-colors">High-Yield Savings</a></li>
              <li><a routerLink="/products/savings-cds" class="hover:text-emerald-400 transition-colors">Certificates of Deposit</a></li>
              <li><a routerLink="/products/credit-cards" class="hover:text-emerald-400 transition-colors">Travel Elite Cards</a></li>
              <li><a routerLink="/products/students" class="hover:text-emerald-400 transition-colors">Student Accounts</a></li>
            </ul>
          </div>

          <!-- Column 2: Loans & Wealth -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-white mb-4">Lending & Wealth</h4>
            <ul class="space-y-2.5 text-sm">
              <li><a routerLink="/products/home-loans" class="hover:text-emerald-400 transition-colors">Home Mortgages</a></li>
              <li><a routerLink="/products/auto-loans" class="hover:text-emerald-400 transition-colors">EV & Auto Loans</a></li>
              <li><a routerLink="/products/small-business" class="hover:text-emerald-400 transition-colors">Small Business Hub</a></li>
              <li><a routerLink="/products/investing" class="hover:text-emerald-400 transition-colors">Automated Portfolios</a></li>
              <li><a routerLink="/products/investing" class="hover:text-emerald-400 transition-colors">Retirement (IRAs)</a></li>
            </ul>
          </div>

          <!-- Column 3: Help & Connect -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-white mb-4">Help & Security</h4>
            <ul class="space-y-2.5 text-sm">
              <li><a routerLink="/locator" class="hover:text-emerald-400 transition-colors">Find ATM / Branch</a></li>
              <li><a routerLink="/appointments" class="hover:text-emerald-400 transition-colors">Book Appointment</a></li>
              <li><a routerLink="/help" class="hover:text-emerald-400 transition-colors">Help Center & FAQ</a></li>
              <li><a routerLink="/contact" class="hover:text-emerald-400 transition-colors">Contact Support</a></li>
              <li><a routerLink="/dashboard/security" class="hover:text-emerald-400 transition-colors">Security Center</a></li>
            </ul>
          </div>
        </div>

        <!-- Compliance & Legal Disclosures -->
        <div class="pt-8 text-xs text-slate-500 space-y-3 leading-relaxed">
          <p>
            <strong>Banking Disclosures:</strong> Deposit products offered by JChukwuemeka's Financials (JF), Member FDIC. Standard insurance covers deposits up to $250,000 per depositor, per insured bank, for each account ownership category. Investment and wealth products are NOT deposits, NOT FDIC insured, NOT bank guaranteed, and MAY LOSE VALUE.
          </p>
          <p>
            Annual Percentage Yield (APY) and Annual Percentage Rates (APR) displayed are accurate as of November 2026 and subject to change without prior notice. Rates depend on creditworthiness, loan-to-value ratios, and underwriting approvals. Equal Opportunity Housing Lender.
          </p>
          <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-slate-400">
            <p>&copy; 2026 JChukwuemeka's Financials. All rights reserved.</p>
            <div class="flex items-center gap-4">
              <a routerLink="/help" class="hover:text-white transition-colors">Privacy Policy</a>
              <span>&middot;</span>
              <a routerLink="/help" class="hover:text-white transition-colors">Security Guarantee</a>
              <span>&middot;</span>
              <a routerLink="/help" class="hover:text-white transition-colors">Terms of Service</a>
              <span>&middot;</span>
              <a routerLink="/help" class="hover:text-white transition-colors">Accessibility Notice</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
