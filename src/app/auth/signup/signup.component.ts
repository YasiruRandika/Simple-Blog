import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isLoading = false;

  constructor(private authService : AuthService) { }

  ngOnInit(): void {
  }

  onSignUp(form : NgForm) {
    if(form.invalid) {
      return;
    }
    this.authService.createUser(form.value.email, form.value.password);
  }
}
