import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center gap-3">
      <!-- Rounded square with JF monogram -->
      <div
        class="flex items-center justify-center font-bold tracking-tight rounded-xl shadow-sm text-white select-none transition-transform hover:scale-105"
        [class]="size() === 'lg' ? 'w-11 h-11 text-xl' : size() === 'sm' ? 'w-8 h-8 text-sm' : 'w-9 h-9 text-base'"
        style="background: linear-gradient(135deg, #0B6B4F 0%, #084E3A 100%); border: 1.5px solid rgba(242, 182, 50, 0.4);"
      >
        <span class="tracking-tighter">
          <span class="text-white">J</span><span style="color: #F2B632">F</span>
        </span>
      </div>

      @if (showText()) {
        <div class="flex flex-col text-left">
          <span class="font-bold text-base md:text-lg leading-tight tracking-tight text-slate-900 dark:text-white">
            JChukwuemeka's
          </span>
          <span class="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Financials
          </span>
        </div>
      }
    </div>
  `,
})
export class LogoComponent {
  size = input<'sm' | 'md' | 'lg'>('md');
  showText = input<boolean>(true);
}
