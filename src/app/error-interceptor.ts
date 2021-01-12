import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog : MatDialog, private snackBar : MatSnackBar){}

  intercept(req : HttpRequest<any>, next : HttpHandler) {
    return next.handle(req).pipe(
      catchError((error : HttpErrorResponse) => {
        let errorMessage = "Unkown Error Occured";
        if(error.error.message) {
          errorMessage = error.error.message;
        }
        this.snackBar.open(errorMessage, "Dismiss", {duration : 5000});
        //this.dialog.open(ErrorComponent, {data : {message :errorMessage}});
        return throwError(error);
      })
    )
  }

}
