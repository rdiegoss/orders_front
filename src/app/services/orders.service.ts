import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class OrdersService {

  constructor(public http: Http) { }

  get(url) {
    return new Promise((resolve, reject) => {
      this.http.get(url).map(res => res.json())
        .subscribe(result => {
          resolve(result);
        }, error => {reject(error)});
      });
  }

  post(url, data) {
    return new Promise((resolve, reject) => {
      this.http.post(url, data).map(res => res)
        .subscribe(result => {
          resolve(result);
        }, error => {reject(error)});
      });
  }

  delete(url) {
    return new Promise((resolve, reject) => {
      this.http.delete(url).map(res => res)
        .subscribe(result => {
          resolve(result);
        }, error => {reject(error)});
      });
  }

  update(url, data) {
    return new Promise((resolve, reject) => {
      this.http.put(url, data).map(res => res)
        .subscribe(result => {
          resolve(result);
        }, error => {reject(error)});
      });
  }
}
