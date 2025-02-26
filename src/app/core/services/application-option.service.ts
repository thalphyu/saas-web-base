import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BehaviorSubject, Observable } from '../../../../node_modules/rxjs';
import { ApplicationOption } from '../models/applicationoption';
@Injectable({
  providedIn: 'root'
})
export class ApplicationOptionService extends BehaviorSubject<GridDataResult> {

  constructor(private apiservice: ApiService) { super(null); }

  getEmployeeCustomField(gridState: any) {
    return this.apiservice.fetchgridpostJson('/applicationoption/GetEmployeeCustomField', gridState, null)
      .subscribe(x => {
        super.next(x);
      });
  }

  getApplicationOption() {
    return this.apiservice.GetURL2('/applicationoption/GetApplicationOption');
  }

  SaveApplicationOption(applicationOption: ApplicationOption): Observable<any> {
    return this.apiservice.postJsonModel('/applicationoption/SaveApplicationOptionWeb', applicationOption);
  }
}

