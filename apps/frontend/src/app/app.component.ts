import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  constructor(private router: Router) {}

  goToContact() {
    //  here we only added 'contact' but we could add strings and Angular would create an URL for us
    this.router.navigate(['contact']);
  }
}
