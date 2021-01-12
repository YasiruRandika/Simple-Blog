import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../angular-material-module";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";

@NgModule({
  declarations :[
    LoginComponent,
    SignupComponent
  ],
  imports:[
    FormsModule,
    AngularMaterialModule,
    FormsModule,
    CommonModule,
    NgModule
  ]
})

export class AuthModule{}