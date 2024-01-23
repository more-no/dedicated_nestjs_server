import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WishItem } from '../../../shared/models/wishItem';
import { EventService } from '../../../shared/services/EventService';

@Component({
  selector: 'wish-list-item',
  templateUrl: './wish-list-item.component.html',
  styleUrl: './wish-list-item.component.sass',
})
export class WishListItemComponent {
  // bang operator => not null property
  @Input() wish!: WishItem;

  get cssClasses() {
    // return this.fulfilled ? ['strikeout', 'text-muted'] : [];
    // below we try using an object instead of an array
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
