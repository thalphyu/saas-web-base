import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { MulticheckFilterComponent } from './multicheck-filter.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [MulticheckFilterComponent],
  exports: [MulticheckFilterComponent]
})
export class MulticheckfilterModule { }
