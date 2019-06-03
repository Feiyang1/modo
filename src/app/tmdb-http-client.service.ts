import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

const API_KEY = '6af285299e4495dab300171ed0b9d013';

@Injectable({
  providedIn: 'root'
})
export class TmdbHttpClientService {
  constructor(private http: HttpClient) {
    type a = typeof http.get;
  }

  get(...params: Parameters<HttpClient["get"]>) {
    const url = params[0];
    const options = params[1] || {};
    options.params = addAPIKEY(options.params);
    return this.http.get(url, options);
  }
}

function addAPIKEY(params?: HttpParams | {
  [param: string]: string | string[];
}): HttpParams {

  let myParams = params || {};

  if (!(myParams instanceof HttpParams)) {
    myParams = new HttpParams(myParams);
  }

  return myParams.set('api_key', API_KEY);
}
