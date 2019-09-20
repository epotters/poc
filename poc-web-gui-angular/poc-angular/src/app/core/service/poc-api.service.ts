import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import 'rxjs/Rx';
import {Observable, Subject, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {environment} from '../../../environments/environment';
import {AuthService} from "../../lib/auth-module";
import {ApiService} from "../../lib/entity-module";


@Injectable({
  providedIn: 'root'
})
export class PocApiService implements ApiService {

  private errorsSubject: Subject<any> = new Subject();


  constructor(
    private http: HttpClient,
    private authService: AuthService) {
  }


  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {

    console.debug('Inside PocApiService.get()');
    console.debug('URL to get: ' + `${environment.apiUrl}${path}`);

    return this.http.get(
      `${environment.apiUrl}${path}`,
      {params, headers: this.getHeaders()})
      .pipe(catchError(this.handleError));
  }


  put(path: string, body: Object = {}): Observable<any> {

    let headers: HttpHeaders = this.getHeaders().append('Content-Type', 'application/json');

    return this.http.put(
      `${environment.apiUrl}${path}`,
      JSON.stringify(body), {headers: headers}
    ).pipe(catchError(this.handleError));
  }


  post(path: string, body: Object = {}): Observable<any> {

    let headers: HttpHeaders = this.getHeaders().append('Content-Type', 'application/json');

    return this.http.post(
      `${environment.apiUrl}${path}`,
      JSON.stringify(body), {headers: headers}
    ).pipe(catchError(this.handleError));
  }


  delete(path): Observable<any> {

    console.debug('Inside PocApiService.delete()');
    console.debug('Resource to delete: ' + `${environment.apiUrl}${path}`);

    return this.http.delete(
      `${environment.apiUrl}${path}`,
      {headers: this.getHeaders()}
    ).pipe(catchError(this.handleError));
  }


  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Accept': 'application/json',
      // 'Content-Type': 'application/json',
      'Authorization': this.authService.getAuthorizationHeaderValue()
    });
  }


  public awaitErrors(): Observable<any> {
    return this.errorsSubject.asObservable();
  }


  private handleError(error: any): Observable<never> {
    console.error('An error occurred: ' + error.status + ' ' + error.message);

    this.errorsSubject.next(error);

    if(error.status === 401) {
      console.info('Unauthorized, token probably expired');
    }
    console.debug(error);

    return throwError(error.error);
  }

}
