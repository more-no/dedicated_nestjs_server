import { Component } from '@angular/core';
import { ProductsService } from '../products.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'product-details-component',
  templateUrl: './product-details-component.component.html',
  styleUrl: './product-details-component.component.sass',
})
export class ProductDetailsComponentComponent {
  product: any = {};

  constructor(
    private store: ProductsService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get('id');

      if (id) {
        this.store
          .getProduct(parseInt(id))
          .subscribe((product) => (this.product = product));
      }
    });
  }
}
