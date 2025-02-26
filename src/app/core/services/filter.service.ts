import { Injectable } from '@angular/core';
import { ApiService } from '.';
import { BehaviorSubject } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';

@Injectable({
  providedIn: 'root'
})
export class FilterService extends BehaviorSubject<GridDataResult>{
  loading = false;
  total;
  public selectall: any[];
  public allProduct: any[];
  public userlevellist: any[];

  constructor(private apiService: ApiService) {
    super(null);
  }

  gridState: State={
    filter: { logic: 'and', filters: [] },
  };

  public query(state: any, postdata: any) {
    this.loading = true;
    return this.apiService.fetchgridpostJson('/employeesetupweb/GetAllEmployeeForFilter', state, postdata)
      .subscribe(x => {
        super.next(x);
        this.total = x.total;
        this.selectall = x.data;
        this.loading = false;
      });
  }
  public filterAnnouncemant(state: any, postdata: any) {
    this.loading = true;
    return this.apiService.fetchgridpostJson('/Announcement/GetAnnouncementList', state, postdata)
      .subscribe(x => {
        super.next(x);
        this.total = x.total;
        this.loading = false;
      });
  }

  public filterUserlevelAssign(state: any, postdata: any) {
    this.loading = true;
    return this.apiService.fetchgridpostJson('/userlevelassign/GetAllUserlevelForFilter', state, postdata)
      .subscribe(x => {
        super.next(x);
        this.total = x.total;
         this.userlevellist = x.data;
        this.loading = false;
      });
  }
  /*
  public filterProduct(state: any, postdata: any) {
    this.loading = true;
    return this.apiService.fetchgridpostJson('/employeesetupweb/GetAllProductFilter', state, postdata)
      .subscribe(x => {
        super.next(x);
        this.loading = false
      });
  }*/

  public GetAllUserlevelAssign(state: any, postdata: any) {
    return this.apiService.fetchgridpostJson('/userlevelassign/GetAllUserlevelForFilter', state, postdata)
      .subscribe(x => {
        this.total = x.total;
        this.selectall = x.data;
        this.loading = false;
      });
  }
/*
  public AllProduct(state: any, postdata: any) {
    return this.apiService.fetchgridpostJson('/employeesetupweb/GetAllProductFilter', state, postdata)
      .subscribe(x => {
        this.allProduct = x.data;
      });
  }*/
}



