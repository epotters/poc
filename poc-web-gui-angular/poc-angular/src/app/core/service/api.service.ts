import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import 'rxjs/Rx';

import {environment} from '../../../environments/environment';
import {AuthService} from "../../lib/auth-module";


@Injectable()
export class ApiService {


  constructor(
    private http: HttpClient,
    private authService: AuthService) {
  }


  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {

    console.debug('Inside ApiService.get()');
    console.debug('URL to get: ' + `${environment.apiUrl}${path}`);

    return this.http.get(
      `${environment.apiUrl}${path}`,
      {params, headers: this.getHeaders()})
      .pipe(catchError(this.formatErrors));
  }


  put(path: string, body: Object = {}): Observable<any> {

    let headers: HttpHeaders = this.getHeaders().append('Content-Type', 'application/json');

    return this.http.put(
      `${environment.apiUrl}${path}`,
      JSON.stringify(body), {headers: headers}
    ).pipe(catchError(this.formatErrors));
  }


  post(path: string, body: Object = {}): Observable<any> {

    let headers: HttpHeaders = this.getHeaders().append('Content-Type', 'application/json');

    return this.http.post(
      `${environment.apiUrl}${path}`,
      JSON.stringify(body), {headers: headers}
    ).pipe(catchError(this.formatErrors));
  }


  delete(path): Observable<any> {

    console.debug('Inside ApiService.delete()');
    console.debug('Resource to delete: ' + `${environment.apiUrl}${path}`);

    return this.http.delete(
      `${environment.apiUrl}${path}`,
      {headers: this.getHeaders()}
    ).pipe(catchError(this.formatErrors));
  }


  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Accept': 'application/json',
      // 'Content-Type': 'application/json',
      'Authorization': this.authService.getAuthorizationHeaderValue()
    });
  }


  private formatErrors(error: any) {
    console.error('An error occurred: ' + error);
    return throwError(error.error);
  }

}
