import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoardLayoutManagerComponent} from './layout-component';
import { SimplebarAngularModule } from 'simplebar-angular';

@NgModule({
    imports: [
        CommonModule,
        SimplebarAngularModule
    ],
    declarations: [BoardLayoutManagerComponent],
    exports: [BoardLayoutManagerComponent]
})
export class LayoutModule {
}
