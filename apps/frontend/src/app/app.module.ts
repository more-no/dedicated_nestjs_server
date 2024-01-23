import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WishModule } from './wish/wish.module';
import { ContactModule } from './contact/contact.module';
import { FirstComponent } from './first/first.component';
import { SecondComponent } from './second/second.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProductsModule } from './products/products.module';

@NgModule({
  declarations: [
    // AppComponent is the entry point of our Module
    AppComponent,
    FirstComponent,
    SecondComponent,
    NotFoundComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, WishModule, ContactModule, ProductsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
