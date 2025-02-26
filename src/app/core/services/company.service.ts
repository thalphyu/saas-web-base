import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
//import { BehaviorSubject } from "rxjs";
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BehaviorSubject, Observable } from '../../../../node_modules/rxjs';
import { Company } from '../models/company';


@Injectable({
  providedIn: 'root'
})
export class CompanyService extends BehaviorSubject<GridDataResult> {
  public gridLoading: boolean;
  constructor(private apiservice: ApiService) {
    super(null);
  }



  getCompanyList(girdState: any) {
    this.gridLoading = true;
    this.apiservice.fetchgridpostJson_DataSourceRequestState('/company/GetCompanyList/', girdState)
      .subscribe(x => {
        super.next(x);
        this.gridLoading = false;
      });
  }


  saveComp(Company1: Company): Observable<any> {

    return this.apiservice.postJsonModel('/company/SaveCompany', Company1);
  }



  updateComp(Company1: Company): Observable<any> {

    return this.apiservice.postJsonModel('/company/UpdateCompany', Company1);
  }



  deleteComp(CompanyId: string): Observable<any> {
    // var encryptdata = btoa(companyID);  //convert to base64
    return this.apiservice.postJsonModel('/company/DeleteCompany', CompanyId);
  }


  getImagePath(CompanyID: string): Observable<string> {
    const encryptdata = btoa(CompanyID);  //convert to base64
    return this.apiservice.get('/FileService/Download/CompanyPhoto/' + encryptdata);
  }

  /*getApplicationOption() {
      return this.apiservice.GetURL2(
          "/ApplicationOption/GetApplicationOption"
      );
  }*/
  deleteCompanyPhoto(CompanyID: string): Observable<string> {
    const encryptdata = btoa(CompanyID);  //convert to base64
    return this.apiservice.postJson('/FileService/Remove/CompanyPhoto/' + encryptdata, null);  //single file

  }


}
