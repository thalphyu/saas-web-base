import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import * as fs from 'file-saver';
import { BehaviorSubject, Observable } from '../../../../node_modules/rxjs';
import { Employeesetup } from '../models/employeesetup';

@Injectable({
  providedIn: 'root'
})
export class EmployeeSetupService extends BehaviorSubject<GridDataResult>{

  constructor(private apiservice: ApiService) { super(null); }

  loading = false;
  private data: any[] = [];
  private dataB: any[] = [];

  public getCompany() {
    return this.apiservice.postJson('/department/GetCompany');
  }

  public GetUserLevel() {
    return this.apiservice.get('/employeesetupweb/GetUserLevel');
  }

  public GetDivision() {
    return this.apiservice.get('/employeesetupweb/GetDivision');
  }

  getEmployeeByID(EmployeeID: string): Observable<any> {
    // var encryptdata = btoa(id);
    return this.apiservice.postJsonModel('/employeesetupweb/GetEmployeeByID', EmployeeID);
  }

  uploadFile(functionname, ID, formData) {
    const encryptdata = btoa(ID);
    return this.apiservice.uploadFileURL2('/fileservice/Upload/' + functionname + '/' + encryptdata, formData);
  }

  getLoginImage() {
    return this.apiservice.GetURL2('/fileservice/GetLoginImage');
  }
  saveEmpData(employeesetup: Employeesetup): Observable<any> {
    return this.apiservice.postJsonModel('/employeesetupweb/SaveEmployee', employeesetup);
  }

  update(employeesetup: Employeesetup): Observable<any> {
    return this.apiservice.postJsonModel('/employeesetupweb/UpdateEmployee', employeesetup);
  }
  deleteEmployee(EmployeeID: string): Observable<any> {
    return this.apiservice.postJsonModel('/employeesetupweb/DeleteEmployee', EmployeeID);
  }

  resetPassword(EmployeeID: string): Observable<any> {
    // var encryptdata = btoa(EmployeeID);
    return this.apiservice.postJsonModel('/employeesetupweb/ResetPassword/', EmployeeID);
  }

  unLockPassword(obj: any) {
    return this.apiservice.postJson('/employeesetupweb/unLockPassword', obj);
  }

  UpdateLogoutEventLog() {
    return this.apiservice.postJson('/EventLogReport/LogoutEventLog');
  }

  public GetCompanyByUserLevel() {
    return this.apiservice.get('/Company/GetCompanyByLoginUser');
  }

  validateType() {
    return this.apiservice.post('/publicrequest/ValidateCustomer');
  }

  getImagePath(EmployeeID: string): Observable<string> {
    const encryptdata = btoa(EmployeeID);  //convert to base64
    return this.apiservice.get('/FileService/Download/uploadEmployeePhoto/' + encryptdata);
  }

  deleteEmployeePhoto(EmployeeID: number): Observable<string> {
    const encryptdata = btoa(EmployeeID.toString());  //convert to base64
    return this.apiservice.postJson('/FileService/Remove/uploadEmployeePhoto/' + encryptdata, null);  //single file
  }
  public reset() {
    this.data = [];
    this.dataB = [];
  }

  DownloadusermanualPDF(data: any) {
    return this.apiservice.postJson('/publicrequest/DownloadUserManualPDF', data);
  }

}
