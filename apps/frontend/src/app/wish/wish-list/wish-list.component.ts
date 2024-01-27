import { Component, Input } from '@angular/core';
import { WishItem } from '../../../shared/models/wishItem';

@Component({
  selector: 'wish-list',
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.sass',
})
export class WishListComponent {
  @Input() wishes: WishItem[] = [];
}
