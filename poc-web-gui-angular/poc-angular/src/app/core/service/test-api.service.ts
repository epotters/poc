import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Constants } from '../../../constants';
import { Observable } from 'rxjs';
import { AuthService, User } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TestApiService {

  constructor(private _httpClient: HttpClient, private authService: AuthService) {
  }


  // TODO: Reenable after fixing

  // public callApi(): Promise<any> {
  //   return this.authService.getUser().then(user => {
  //     if (user && user.access_token) {
  //       return this._callApi(user.access_token);
  //     }
  //     else if (user) {
  //       return this.authService.renewToken().then(user => {
  //         return this._callApi(user.access_token);
  //       });
  //     }
  //     else {
  //       throw new Error("user is not logged in");
  //     }
  //   });
  // }
  //
  // _callApi(token: string) {
  //   let headers = new HttpHeaders({
  //     'Accept': 'application/json',
  //     'Authorization': 'Bearer ' + token
  //   });
  //
  //   return this._httpClient.get(Constants.apiRoot + "test", { headers: headers })
  //     .toPromise()
  //     .catch((result : HttpErrorResponse) => {
  //         if (result.status === 401){
  //           return this.authService.renewToken().then(user => {
  //             return this._callApi(user.access_token);
  //           });
  //         }
  //         throw result;
  //     });
  // }
}
