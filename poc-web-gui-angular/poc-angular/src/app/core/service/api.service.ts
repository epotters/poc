import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import 'rxjs/Rx';
import {AuthService} from "./auth.service";


@Injectable()
export class ApiService {

  constructor(private http: HttpClient, private authService: AuthService) {
  }


  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {

    console.debug('Inside ApiService.get()');
    console.debug('URL to get: ' + `${environment.apiUrl}${path}`);

    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': this.authService.getAuthorizationHeaderValue()
    });
    

    return this.http.get(`${environment.apiUrl}${path}`, {params, headers: headers})
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {

    return this.http.put(
      `${environment.apiUrl}${path}`,
      JSON.stringify(body),{headers: this.getHeaders()}
    ).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}${path}`,
      JSON.stringify(body), {headers: this.getHeaders()}
    ).pipe(catchError(this.formatErrors));
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}${path}`
    ).pipe(catchError(this.formatErrors));
  }

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }
}
