import {Observable} from 'rxjs';

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {AuthService} from '../../lib/auth-module';
import {ApiService} from '../../lib/entity-lib';
import {ConfigService} from '../../app-config.service';


@Injectable({
  providedIn: 'root'
})
export class PocApiService implements ApiService {

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private authService: AuthService) {
  }


  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    console.debug('PocApiService - URL to get: ', `${this.config.apiRoot}${path}`);
    return this.http.get(
      `${this.config.apiRoot}${path}`,
      {params, headers: this.getHeaders()});
  }


  put(path: string, body: Object = {}): Observable<any> {
    const headers: HttpHeaders = this.getHeaders().append('Content-Type', 'application/json');
    return this.http.put(
      `${this.config.apiRoot}${path}`,
      JSON.stringify(body), {headers: headers}
    );
  }


  post(path: string, body: Object = {}): Observable<any> {
    const headers: HttpHeaders = this.getHeaders().append('Content-Type', 'application/json');
    return this.http.post(
      `${this.config.apiRoot}${path}`,
      JSON.stringify(body), {headers: headers}
    );
  }


  delete(path): Observable<any> {
    console.debug('PocApiService.delete() - Resource to delete: ', `${this.config.apiRoot}${path}`);
    return this.http.delete(
      `${this.config.apiRoot}${path}`,
      {headers: this.getHeaders()}
    );
  }


  private getHeaders(): HttpHeaders {
    const authorizationHeader: string | null = this.authService.getAuthorizationHeaderValue();
    return new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': (!!authorizationHeader) ? authorizationHeader : ''
    });
  }
}
