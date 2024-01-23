// create with 'ng g module contact'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from './contact.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  // this time we use the ReactiveFormsModule instead of the FormsModule in wish.module
  declarations: [ContactComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [ContactComponent],
})
export class ContactModule {}
