import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {PocError} from './errors';


// Source: https://scotch.io/bar-talk/error-handling-with-angular-6-tips-and-best-practices192
@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {

  errorSubject: Subject<PocError> = new Subject<PocError>();

  constructor() {
    console.debug('Constructing the HttpErrorInterceptor');
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let rethrowError: boolean = true;

    return next.handle(request)
      .pipe(
        retry(0),
        catchError((error: any, caught: Observable<HttpEvent<any>>) => {
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
              const requestModified: HttpRequest<any> = request.clone({
                url: './assets/poc-config.json',
                headers: request.headers.set('Content-Type', 'application/json')
              });
              rethrowError = false;
              return next.handle(requestModified);

            } else if (error.status === 401) {
              console.debug('API call unauthorized. Trying to reauthenticate the user.',
                'Disabled because it makes the AuthService load before the external config, which it needs');

            } else if (error.status === 400 && request.url.endsWith('token')) {
              console.debug('Refreshing the access token failed. Refresh token probably expired.');
              console.debug('Error:', error);

            } else if (error.message.contains('Error: invalid_grant')) {
              console.debug('Invalid grant detected. Probably a failed reauthentication...');
            }

          }
          this.errorSubject.next(pocError);
          console.debug(pocError);
          return throwError(pocError.message);
          // Observable.throwError(error.statusText);
          // if (rethrowError) {
          //   return throwError(pocError.message);
          // } else {
          //   return null;
          // }
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
