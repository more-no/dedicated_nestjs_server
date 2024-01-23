import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WishItem } from '../../../shared/models/wishItem';

const filters = [
  (item: WishItem) => item,
  (item: WishItem) => !item.isComplete,
  (item: WishItem) => item.isComplete,
];

@Component({
  // delete the "app-"
  selector: 'wish-filter',
  templateUrl: './wish-filter.component.html',
  styleUrl: './wish-filter.component.sass',
})
export class WishFilterComponent implements OnInit {
  @Input() filter: any;
  // the output must have the same name + Change
  @Output() filterChange = new EventEmitter<any>();

  // we pass the initial value changeFilter - is it used on first mounting?
  ngOnInit(): void {
    this.updateFilter('0');
  }

  listFilter: number = 0;

  updateFilter(value: any) {
    this.filter = filters[value];
    this.filterChange.emit(this.filter);
  }
}
