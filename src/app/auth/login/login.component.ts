import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  authSubscription : Subscription = new Subscription();

  constructor(private authService : AuthService, private snackBar : MatSnackBar, private router : Router) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.getAuthStatusListner()
    .subscribe(response => {
      this.isLoading = false;
    })
  }

  onLogin(form : NgForm) {
    if(form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }

}
