import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {AuthService} from "../../lib/auth-module";
import {ApiService} from "../../lib/entity-module";
import {ConfigService} from "../../app-config.service";


@Injectable({
  providedIn: 'root'
})
export class PocApiService implements ApiService {

  private errorsSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private authService: AuthService) {
  }


  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {

    console.debug('PocApiService - URL to get: ', `${this.config.apiRoot}${path}`);

    return this.http.get(
      `${this.config.apiRoot}${path}`,
      {params, headers: this.getHeaders()})
      .pipe(catchError(this.handleError));
  }


  put(path: string, body: Object = {}): Observable<any> {

    let headers: HttpHeaders = this.getHeaders().append('Content-Type', 'application/json');

    return this.http.put(
      `${this.config.apiRoot}${path}`,
      JSON.stringify(body), {headers: headers}
    ).pipe(catchError(this.handleError));
  }


  post(path: string, body: Object = {}): Observable<any> {

    let headers: HttpHeaders = this.getHeaders().append('Content-Type', 'application/json');

    return this.http.post(
      `${this.config.apiRoot}${path}`,
      JSON.stringify(body), {headers: headers}
    ).pipe(catchError(this.handleError));
  }


  delete(path): Observable<any> {

    console.debug('PocApiService.delete() - Resource to delete: ', `${this.config.apiRoot}${path}`);

    return this.http.delete(
      `${this.config.apiRoot}${path}`,
      {headers: this.getHeaders()}
    ).pipe(catchError(this.handleError));
  }

  public awaitErrors(): Observable<any> {
    return this.errorsSubject.asObservable();
  }

  public handleError(error: any): Observable<never> {

    console.error('An error occurred: ' + error.status + ' ' + error.message);
    console.error('An error occurred:', error);

    // this.errorsSubject.next(error);

    if (error.status === 401) {
      console.info('Unauthorized, token probably expired');
    }
    console.error(error);

    return throwError(error.error);
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Accept': 'application/json',
      // 'Content-Type': 'application/json',
      'Authorization': this.authService.getAuthorizationHeaderValue()
    });
  }

}
