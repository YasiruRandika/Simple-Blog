import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userAuthenticated = false;
  private authListnerSub : Subscription = new Subscription();

  constructor(private authService : AuthService) { }

  ngOnInit(): void {
    this.userAuthenticated = this.authService.getAuthStatus();
    this.authListnerSub = this.authService.getAuthStatusListner()
    .subscribe(isAuthenticated => {
      this.userAuthenticated = isAuthenticated;
    })
  }

  ngOnDestroy() {
    this.authListnerSub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

}
