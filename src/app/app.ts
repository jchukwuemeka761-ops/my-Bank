import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {DemoBannerComponent} from './components/layout/demo-banner.component';
import {HeaderComponent} from './components/layout/header.component';
import {FooterComponent} from './components/layout/footer.component';
import {AiAssistantWidgetComponent} from './components/ai/ai-assistant-widget.component';
import {SessionTimeoutModalComponent} from './components/security/session-timeout-modal.component';
import {CookieBannerComponent} from './components/layout/cookie-banner.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [
    RouterOutlet,
    DemoBannerComponent,
    HeaderComponent,
    FooterComponent,
    AiAssistantWidgetComponent,
    SessionTimeoutModalComponent,
    CookieBannerComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
