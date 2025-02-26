import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { TreeserviceService } from '.';
import { BehaviorSubject } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Injectable({
  providedIn: 'root'
})
export class CustomerInformationService extends BehaviorSubject<GridDataResult> {
  constructor(private apiservice: ApiService, private treeserviceService: TreeserviceService) { super(null); }

  GetCustomerPhoto() {
    return this.apiservice.GetURL2('/customer/GetCustomerPhoto');
  }

  GetCustomerInformation() {
    return this.apiservice.GetURL2('/customer/GetCustomerInformation');
  }

  UpdateCustomerInfo(data: any) {
    return this.apiservice.postJson('/customer/UpdateCustomerInfo',data);
  }

}
