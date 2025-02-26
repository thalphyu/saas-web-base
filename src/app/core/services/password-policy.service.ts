import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { passwordpolicy } from '../models/passwordpolicy';
import { BehaviorSubject, Observable } from '../../../../node_modules/rxjs';
@Injectable({
  providedIn: 'root'
})
export class PasswordPolicyService extends BehaviorSubject<GridDataResult> {

  constructor(private apiservice: ApiService,) { super(null); }


  GetPasswordPolicy() {
    return this.apiservice.get('/PasswordPolicyWeb/GetPasswordPolicyDataWeb');
  }

  UpdatePasswordPolicy(passwordpolicy1: passwordpolicy): Observable<any> {
    return this.apiservice.postJsonModel('/PasswordPolicyWeb/UpdatePasswordPolicyWeb', passwordpolicy1);
  }

}
