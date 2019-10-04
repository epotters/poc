import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {AuthService} from "../../lib/auth-module";


export interface PocError {
  code: string;
  message: string;
}


// Source: https://scotch.io/bar-talk/error-handling-with-angular-6-tips-and-best-practices192
@Injectable({providedIn: 'root'})
export class HttpErrorInterceptor implements HttpInterceptor {

  errorSubject: Subject<PocError> = new Subject<PocError>();

  constructor(
    public authService: AuthService) {
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        retry(0),
        catchError((error: HttpErrorResponse) => {
          let pocError: PocError;
          if (error.error instanceof ErrorEvent) {
            pocError = {
              code: 'CLIENT_SIDE',
              message: `Error: ${error.error.message}`
            }
          } else {
            pocError = {
              code: 'SERVER_SIDE',
              message: `Error Status: ${error.status}\nMessage: ${error.message}`
            };

            if (error.status === 401) {
              console.debug('Trying to reauthenticate the user');
              this.authService.startSilentAuthentication();
            }

          }
          this.errorSubject.next(pocError);
          console.debug(pocError);
          return throwError(pocError.message);
        })
      )
  }

  awaitErrors(): Observable<PocError> {
    return this.errorSubject.asObservable();
  }

}
