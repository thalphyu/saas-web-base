import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { GridDataResult } from '@progress/kendo-angular-grid'; @Injectable({
  providedIn: 'root'
})
export class EventViewerService extends BehaviorSubject<GridDataResult> {

  constructor(private apiservice: ApiService,) { super(null); }
  total;
  loading: boolean;
  getFormList() {

    return this.apiservice.get('/EventLogReport/getFormList');
  }
  public query(state: any, postdata: any) {
    this.loading = true;
    return this.apiservice.fetchgridpostJson('/EventLogReport/ReadLogNew', state, postdata)
      .subscribe(x => {
        super.next(x);
        this.total = x.total;
        this.loading = false;
      });
  }



}
