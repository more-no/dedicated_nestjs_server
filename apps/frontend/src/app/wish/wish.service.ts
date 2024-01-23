// file create with CLI - "ng generate service Wish"
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { WishItem } from '../../shared/models/wishItem';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';

// this is created already as an Injectable
@Injectable({
  providedIn: 'root',
})

// we write here the logic to access the json file we created wishes.json
export class WishService {
  constructor(private http: HttpClient) {}

  private getStandardOptions(): any {
    return {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        // 'Authorization': '...',
      }),
    };
  }

  getWishes() {
    let options = this.getStandardOptions();

    options.params = new HttpParams({
      fromObject: {
        format: 'json',
      },
    });

    // in a real app here we'd put a real URL -- options here adds the parameters of the request
    return (
      this.http
        .get('/assets/wishes.json', options)
        // we add a pipe to process the error - now we need to add below how to handleError
        .pipe(catchError(this.handleError))
    );
    // we can make here get/put/post/ and many other requests
    // the GET method return an Observable (as object)
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error(
        'There is an issue with the client or network: ',
        error.error,
      );
    } else {
      console.error('Server-side error: ', error.error);
    }

    return throwError(() =>
      Error('Cannot retrieve wishes from the server. Please try again.'),
    );
  }

  private addWish(wish: WishItem) {
    let options = this.getStandardOptions();

    // we need the 'set' method to replace the current header with a new one with the 'Auth' options added
    options.header = options.header.set(
      'Authorization',
      'value-for-authorization',
    );

    // for the post we pass an URL, a body and the options
    this.http.post('/assets/wishes.json', wish, options);
  }
}
