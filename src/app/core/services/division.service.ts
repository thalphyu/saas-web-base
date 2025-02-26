import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BehaviorSubject, Observable } from '../../../../node_modules/rxjs';
import { Division } from '../models/division';

@Injectable({
  providedIn: 'root'
})
export class DivisionService extends BehaviorSubject<GridDataResult>{
  public gridLoading: boolean;

  constructor(private apiservice: ApiService) {
    super(null);
  }

  // getDivisionList(divisionSet: any) {
  //  return this.apiservice.postJson('/division/GetMoreDivision/', divisionSet);
  // // return this.apiservice.postJson('/v1/getdivisionlist/', divisionSet);
  //  //return this.apiservice.get('/v1/getdivisionlist/');
  //  // return this.apiservice.postmockJson('https://cloudpos-api.globalwave.company/mockapi/api/v1/getdivisionlist', divisionSet);
  // }

  getDivisionList(girdState: any) {
    this.gridLoading = true;
    this.apiservice.fetchgridpostJson_DataSourceRequestState('/division/GetMoreDivision/', girdState)
      .subscribe(x => {
        super.next(x);
        this.gridLoading = false;
      });

  }

  getDivisionNewList(gridState: any) {
    //this.gridLoading = true;
    gridState.pageSize = gridState.limit;
    gridState.page = gridState.offset;
    //gridState.page++;
    if (gridState.sort) {
      gridState.sort = gridState.sort + '-' + gridState.order;
    }

    gridState = { gridState };
    return this.apiservice.fetchnewgrid_postJson('/division/GetMoreDivision/', gridState);

  }


  saveDivision(divisionSet: Division): Observable<any> {
    return this.apiservice.postJsonModel('/division/SaveDivision/', divisionSet);
  }

  updateDivision(divisionSet: Division): Observable<any> {
    return this.apiservice.postJsonModel('/division/UpdateDivision/', divisionSet);
  }

  deleteDivision(DivisionID: string): Observable<any> {
    // var encryptdata = btoa(divisionID);  //convert to base64
    // var DivisionID = divisionSet.DivisionID;
    return this.apiservice.postJsonModel('/division/DeleteDivision/', DivisionID);
  }



}
