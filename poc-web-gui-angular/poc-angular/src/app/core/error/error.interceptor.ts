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
    // public authService: AuthService
  ) {
    console.debug('Constructing the HttpErrorInterceptor');
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let rethrowError: boolean = true;
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

            if (error.status === 404 && request.url.endsWith('poc-config.json')) {
              console.debug('Redirecting to local copy of poc-config.json');
              let requestModified: HttpRequest<any> = request.clone({
                url: './assets/poc-config.json',
                headers: request.headers.set('Content-Type', 'application/json')
              });
              rethrowError = false;
              return next.handle(requestModified);

            } else if (error.status === 401) {
              console.debug('Trying to reauthenticate the user.',
                'Disabled because it makes the AuthService load before the external config, which it needs');
              // this.authService.startSilentAuthentication();
            }

          }
          this.errorSubject.next(pocError);
          console.debug(pocError);
          if (rethrowError) {
            return throwError(pocError.message);
          } else {
            return null;
          }
        })
      )
  }

  awaitErrors(): Observable<PocError> {
    console.debug('Inside ErrorInterceptor.awaitErrors');
    return this.errorSubject.asObservable();
  }

}

//
// export class HttpErrorInterceptor implements HttpInterceptor {
//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     return next.handle(request)
//       .pipe(
//         retry(1),
//         catchError((error: HttpErrorResponse) => {
//           let errorMessage = '';
//           if (error.error instanceof ErrorEvent) {
//             // client-side error
//             errorMessage = `Error: ${error.error.message}`;
//           } else {
//             // server-side error
//             errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
//           }
//           window.alert(errorMessage);
//           return throwError(errorMessage);
//         })
//       )
//   }
// }
