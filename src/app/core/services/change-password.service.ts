import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BehaviorSubject } from 'rxjs';
import { Globalfunction } from '../global/globalfunction';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService extends BehaviorSubject<GridDataResult>{
  public globalfunction: Globalfunction = new Globalfunction();
  loading = false;
  constructor(private apiservice: ApiService) { super(null); }

  getPasswordPolicy() {
    return this.apiservice.postJson('/PasswordPolicyWeb/GetPasswordPolicyDataWeb');
  }


  changePassword(data: any) {
    const body = {
      ConfirmPassword: this.globalfunction.encryptDataClient(data.ConfirmPassword),
      CurrentPassword: this.globalfunction.encryptDataClient(data.CurrentPassword),
      NewPassword: this.globalfunction.encryptDataClient(data.NewPassword)
    };
    return this.apiservice.postJson('/PasswordPolicyWeb/ChangePassword', body);

  }
}
