import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FacetModule} from '../facet/facet.module';
import {HttpClientModule} from '@angular/common/http';
import {TypeAheadInputModule} from '../typeahead-input/typeahead-input.module';
import {DataListComponent} from './data-list.component';
import { SimplebarAngularModule } from 'simplebar-angular';

@NgModule({
    imports: [
        CommonModule,
        FacetModule,
        TypeAheadInputModule,
        HttpClientModule,
        SimplebarAngularModule
    ],
    declarations: [
        DataListComponent
    ],
    providers: [],
    exports: [
        DataListComponent
    ]
})
export class DataListModule {
}
