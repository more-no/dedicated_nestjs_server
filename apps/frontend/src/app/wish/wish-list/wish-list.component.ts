import { Component, Input } from '@angular/core';
import { WishItem } from '../../../shared/models/wishItem';

// ng create a component adding "app-" as suffix to the the name
// we need to remove it or modify the name of the components in the rest of the files
@Component({
  selector: 'wish-list',
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.sass',
})
export class WishListComponent {
  // we need to declare "wishes"
  // we need to specify that this is an input (extra passage from props in React)
  @Input() wishes: WishItem[] = [];
}
