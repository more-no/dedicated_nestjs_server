// created with 'ng g module products'

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './productsList/productsList.component';
import { ProductDetailsComponentComponent } from './product-details-component/product-details-component.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ProductsListComponent, ProductDetailsComponentComponent],
  imports: [CommonModule, RouterModule],
})
export class ProductsModule {}
