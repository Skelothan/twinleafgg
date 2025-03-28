import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserInfo } from 'ptcg-server';
import { Observable, interval } from 'rxjs';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap, filter, take } from 'rxjs/operators';

import { AlertService } from './shared/alert/alert.service';
import { LoginRememberService } from './login/login-remember.service';
import { LoginService } from './api/services/login.service';
import { SessionService } from './shared/session/session.service';
import { SocketService } from './api/socket.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';

@UntilDestroy()
@Component({
  selector: 'ptcg-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public isLoggedIn = false;
  public loggedUser: UserInfo | undefined;
  private authToken$: Observable<string>;
  private readonly MAX_RECONNECT_ATTEMPTS = 3;
  private reconnectAttempts = 0;

  constructor(
    private alertService: AlertService,
    private dialog: MatDialog,
    private elementRef: ElementRef<HTMLElement>,
    private loginService: LoginService,
    private loginRememberService: LoginRememberService,
    private router: Router,
    private sessionService: SessionService,
    private socketService: SocketService,
    private translate: TranslateService
  ) {
    this.authToken$ = this.sessionService.get(session => session.authToken);
    setTimeout(() => this.onResize());
  }

  public ngOnInit() {
    // Connect to websockets after when logged in
    this.authToken$
      .pipe(untilDestroyed(this))
      .subscribe(authToken => {
        this.isLoggedIn = !!authToken;

        // Connect to websockets
        if (this.isLoggedIn && !this.socketService.isEnabled) {
          this.socketService.enable(authToken);
        }
        if (!this.isLoggedIn && this.socketService.isEnabled) {
          this.socketService.disable();
        }
      });

    this.socketService.connection.pipe(
      untilDestroyed(this)
    ).subscribe({
      next: async connected => {
        if (!connected && this.isLoggedIn) {
          // Try to reconnect
          if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
            this.reconnectAttempts++;
            // Wait 2 seconds before attempting to reconnect
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.authToken$.pipe(take(1)).subscribe(authToken => {
              this.socketService.enable(authToken);
            });
            return;
          }

          // If max reconnection attempts reached, logout user
          this.reconnectAttempts = 0;
          this.socketService.disable();
          this.dialog.closeAll();
          await this.alertService.alert(this.translate.instant('ERROR_DISCONNECTED_FROM_SERVER'));
          this.sessionService.clear();
          this.router.navigate(['/login']);
        } else if (connected) {
          // Reset reconnect attempts when successfully connected
          this.reconnectAttempts = 0;
        }
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.isLoggedIn && !this.socketService.isEnabled) {
        this.authToken$.pipe(take(1)).subscribe(authToken => {
          this.socketService.enable(authToken);
        });
      }
    });

    // Refresh token with given interval
    interval(environment.refreshTokenInterval).pipe(
      untilDestroyed(this),
      filter(() => !!this.sessionService.session.authToken),
      switchMap(() => this.loginService.refreshToken())
    ).subscribe({
      next: response => {
        this.sessionService.session.authToken = response.token;
        if (this.loginRememberService.token) {
          this.loginRememberService.rememberToken(response.token);
        }
      }
    });
  }

  public ngOnDestroy() {
    document.removeEventListener('visibilitychange', () => { });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    const element = this.elementRef.nativeElement;
    const toolbarHeight = 64;
    const contentHeight = element.offsetHeight - toolbarHeight;
    const cardAspectRatio = 1.37;
    const padding = 32;
    const cardHeight = (contentHeight - (padding * 5)) / 7;
    let cardSize = Math.floor(cardHeight / cardAspectRatio);
    cardSize = Math.min(Math.max(cardSize, 60), 60);
    element.style.setProperty('--card-size', cardSize + 'px');
  }

}
