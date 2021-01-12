import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./authData.model";

@Injectable({providedIn:"root"})
export class AuthService{
  constructor(private http : HttpClient, private router : Router){}

  private token : string = "";
  private authStatusListener = new Subject<boolean>();
  authStatus = false;
  private tokenTimer : any;
  private userId : string | null = null;

  createUser(email:string, password:string) {
    const authData : AuthData = {email : email, password : password};
    this.http.post("http://localhost:3000/api/user/signup", authData)
    .subscribe(response => {
      console.log(response);
    })
  }

  login(email : string, password : string) {
    const authData : AuthData = {email : email, password : password};
    this.http.post<{token : string, expiresIn : number, userId  :string}>("http://localhost:3000/api/user/login", authData)
    .subscribe(response => {
      this.token = response.token;
      if(this.token) {
        this.setAuthTimer(response.expiresIn);
        this.authStatus = true;
        this.authStatusListener.next(true);
        const now = new Date();
        this.userId = response.userId;
        const expirationDate = new Date(now.getTime() + response.expiresIn * 1000);
        this.saveDate(response.token, expirationDate, userId);
        this.router.navigate(['/']);
      }
    })
  }

  getUserId() {
    return this.userId;
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();

    if(authInformation) {
      const now = new Date();
      const isFuture = authInformation.expirationDate > now;

      if(isFuture) {
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        this.token = authInformation.token;
        this.authStatus = true;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
      }
    } else {
      return;
    }

  }

  setAuthTimer(duration : number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  getToken() {
    return this.token;
  }

  getAuthStatusListner() {
    return this.authStatusListener.asObservable();
  }

  getAuthStatus() {
    return this.authStatus;
  }

  getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");

    if(token && expirationDate) {
      return {token : token, expirationDate : new Date(expirationDate)}
    } else {
      return;
    }
  }

  logout() {
    this.token = "";
    this.authStatus = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  private saveDate(token : string, expireDate : Date, userId : string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expireDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }
}
