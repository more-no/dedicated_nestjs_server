import { Component, EventEmitter, Output } from '@angular/core';
import { WishItem } from '../../../shared/models/wishItem';

@Component({
  // always remove the "app-" from the name of the selectors
  selector: 'add-wish-form',
  templateUrl: './add-wish-form.component.html',
  styleUrl: './add-wish-form.component.sass',
})
export class AddWishFormComponent {
  // we need to specify that this is an output (extra passage from props in React)
  @Output() addWish = new EventEmitter<WishItem>();

  newWishText = '';

  addNewWish() {
    this.addWish.emit(new WishItem(this.newWishText));

    //    modified to use an Emitter
    // // todo : add wish to the items array
    // this.items.push(new WishItem(this.newWishText));

    // clear the text-box
    this.newWishText = '';
  }
}
