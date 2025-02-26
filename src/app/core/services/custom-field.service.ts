import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
@Injectable({
  providedIn: 'root'
})
export class CustomFieldService extends BehaviorSubject<GridDataResult> {

  constructor(private apiservice: ApiService) { super(null); }

  getStockCustomField(gridState: any) {
    return this.apiservice.fetchgridpostJson('/customfield/GetStockCustomField', gridState, null)
      .subscribe(x => {
        super.next(x);
      });
  }
  saveStockCustomField(value: any) {
    return this.apiservice.postJson('/customfield/SaveStockCustomField', value);
  }
  DeleteStockCustomField(value: any) {
    return this.apiservice.postJson('/customfield/DeleteStockCustomField', value);
  }
  getStockCustomFieldForFilter(value: any) {
    const temp = {page : 1};
    return this.apiservice.postJson('/customfield/GetStockCustomField', {gridState : temp});
  }
  saveInitialValue(value: any) {
    return this.apiservice.postJson('/customfield/SaveInitialValue', value);
  }
}
