import { Component, Input } from '@angular/core';
import { WishItem } from '../../../shared/models/wishItem';
import { EventService } from '../../../shared/services/EventService';

@Component({
  selector: 'wish-list-item',
  templateUrl: './wish-list-item.component.html',
  styleUrl: './wish-list-item.component.sass',
})
export class WishListItemComponent {
  @Input() wish!: WishItem;

  get cssClasses() {
    return { 'strikeout text-muted': this.wish.isComplete };
  }

  constructor(private event: EventService) {}

  removeWish() {
    this.event.emit('removeWish', this.wish);
  }

  toggleFulfilled() {
    this.wish.isComplete = !this.wish.isComplete;
  }
}
