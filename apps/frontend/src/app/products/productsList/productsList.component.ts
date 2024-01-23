// created with 'ng g component products/productsList -m products'
import { Component } from '@angular/core';
import { ProductsService } from '../products.service';
import { Product } from '../products.service';

@Component({
  selector: 'productsList',
  templateUrl: './productsList.component.html',
  styleUrl: './productsList.component.sass',
})
export class ProductsListComponent {
  products: Product[] = [];

  constructor(private store: ProductsService) {}

  ngOnInit(): void {
    this.store.getAllProducts().subscribe((products) => {
      this.products = products;
    });
  }
}
