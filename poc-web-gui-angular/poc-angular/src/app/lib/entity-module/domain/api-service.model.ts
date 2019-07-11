import {HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

export interface ApiService {

  get(path: string, params?: HttpParams): Observable<any>;

  put(path: string, body: Object): Observable<any>;

  post(path: string, body: Object): Observable<any>;

  delete(path: string): Observable<any>;
}
