import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isLoading = false;
  authSubscription : Subscription = new Subscription();


  constructor(private authService : AuthService, private snackBar : MatSnackBar, private router : Router) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.getAuthStatusListner()
    .subscribe(response => {
      this.isLoading = false;
      if(!response) {
      if(this.router.url == '/signup') {
      this.snackBar.open("Email Alredy Exists", "Dismiss",{duration : 5000});
      }
      }
    })
  }

  onSignUp(form : NgForm) {
    if(form.invalid) {
      return;
    }
    this.authService.createUser(form.value.email, form.value.password);
  }
}
