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
  // the order of the routes is important  ==> '' must first and ** must be last
  { path: '', component: FirstComponent }, // empty path is taken as homepage
  { path: 'second', component: SecondComponent },
  { path: 'wish', component: WishComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'products', component: ProductsListComponent },
  { path: 'products/:id', component: ProductDetailsComponentComponent },
  { path: '**', component: NotFoundComponent }, // take-all for all non-existing paths
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
