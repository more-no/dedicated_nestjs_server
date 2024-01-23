// created with - ng generate module wish
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//    moved from app.module
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//    these are moved from the app.module where we wrote them in the beginning
import { WishListComponent } from './wish-list/wish-list.component';
import { AddWishFormComponent } from './add-wish-form/add-wish-form.component';
import { WishFilterComponent } from './wish-filter/wish-filter.component';
import { WishListItemComponent } from './wish-list-item/wish-list-item.component';
import { WishComponent } from './wish.component';

@NgModule({
  declarations: [
    //    also these are moved from the app.module
    WishListComponent,
    AddWishFormComponent,
    WishFilterComponent,
    WishListItemComponent,
    WishComponent,
  ],
  //    also "FormsModule, HttpClientModule" are moved from app.module
  imports: [CommonModule, FormsModule, HttpClientModule],

  //    the difference with the app.module is that we also need to export these components, so that they may be reachable by the app.component
  exports: [
    // WishListComponent,
    // AddWishFormComponent,
    // WishFilterComponent,
    // WishListItemComponent,
    //      now we need to only export the WishComponent !!
    WishComponent,
  ],
})
export class WishModule {}
