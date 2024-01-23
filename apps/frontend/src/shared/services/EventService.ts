import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
// RxJS is a library for reactive programming using Observables, to make it easier to compose asynchronous or callback-based code.

// through this we can emit events anywhere in out application, and listen to them anywhere
@Injectable({
  providedIn: 'root', // this mean is available throughout the entire application
})

// to be possible to automatically import it, we need the Injectable decorator
export class EventService {
  private subject = new Subject();

  emit(eventName: string, payload: any) {
    // debugger;
    this.subject.next({ eventName, payload });
  }

  listen(eventName: string, callback: (event: any) => void) {
    // debugger;
    this.subject.asObservable().subscribe((nextObj: any) => {
      if (eventName === nextObj.eventName) {
      }
      callback(nextObj.payload);
    });
  }
}
