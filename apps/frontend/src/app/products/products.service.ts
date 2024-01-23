// created with 'ng generate service products/products'
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private data: Product[] = [
    { id: 1, name: 'Guitar', price: 1000 },
    { id: 2, name: 'Piano', price: 5000 },
    { id: 3, name: 'Drums', price: 1200 },
  ];

  constructor() {}

  //  with 'of' we ask to return an Observable to which we can subscribe to
  getAllProducts() {
    return of(this.data);
  }

  getProduct(id: number) {
    return of(this.data.find((product) => product.id === id));
  }
}
