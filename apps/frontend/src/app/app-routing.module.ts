import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstComponent } from './first/first.component';
import { SecondComponent } from './second/second.component';
import { WishComponent } from './wish/wish.component';
import { ContactComponent } from './contact/contact.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProductsListComponent } from './products/productsList/productsList.component';
import { ProductDetailsComponentComponent } from './products/product-details-component/product-details-component.component';

const routes: Routes = [
  { path: '', component: FirstComponent },
  { path: 'second', component: SecondComponent },
  { path: 'wish', component: WishComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'products', component: ProductsListComponent },
  { path: 'products/:id', component: ProductDetailsComponentComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
