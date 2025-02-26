import { Injectable } from '@angular/core';
import { Globalfunction } from '../global/globalfunction';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UnlockService {
  public globalfunction: Globalfunction = new Globalfunction();
  constructor(private apiservice: ApiService) { }

  checkOldPassword(oldPassword) {
    return this.apiservice.postJson('/admin/checkPassword', { oldPassword });
  }

  changePassword(oldPassword, newPassword) {
    return this.apiservice.postJson('/admin/PassChange', { oldPassword, newPassword });

  }

  unBlock(adminID) {
    return this.apiservice.get('/admin/unBlock/' + adminID);
  }

  resetPassword(adminID) {
    return this.apiservice.get('/admin/ResetPassword/' + adminID);
  }

  publicResetPassword(ID, loginType) {
    const obj = { ID, loginType };
    return this.apiservice.postJson('/publicrequest/resetpassword', obj);
  }

  // forgetPassword(loginName, loginType) {
  //   return this.apiservice.postJson('/public/ForgotPassword', {loginName:loginName,loginType: loginType});
  // }

  forgetPassword(dataItem) {
    const employeeCode = dataItem.EmployeeCode;
    const loginName = dataItem.UserName;
    const email = dataItem.Email;
    const check_value = dataItem.check_value;
    return this.apiservice.postJson('/publicrequest/ConfirmEmail', { loginEmployeeCode: employeeCode, username: loginName, email, check_value });
  }

  checkEmailandSmsbyUser() {
    // const obj = { loginType: loginType };
    return this.apiservice.postJson('/publicrequest/CheckEmailandSmsbyUser', {});
  }

  generatOTP(dataItem) {
    const EmployeeCode = dataItem.EmployeeCode;
    const epValue = dataItem.EP_value;
    const checkValue = dataItem.check_value;
    return this.apiservice.postJson('/publicrequest/ConfirmEmail', { loginEmployeeCode: EmployeeCode, epValue, checkValue });
  }
  resendOTP(dataItem) {
    const EmployeeCode = dataItem.EmployeeCode;
    const epValue = dataItem.EP_value;
    const checkValue = dataItem.check_value;
    return this.apiservice.postJson('/publicrequest/ResendOTP', { EmployeeCode, epValue, checkValue });
  }

  saveNewPasswordAndOTP(dataItem) {
    const EmployeeCode = dataItem.EmployeeCode;
    const epValue = dataItem.EP_value;
    const otpcode = dataItem.otpcode;
    const newPassword = this.globalfunction.encryptDataClient(dataItem.new_password);
    return this.apiservice.postJson('/publicrequest/SaveNewPasswordAndOTP', { loginEmployeeCode: EmployeeCode, epValue, otpcode, newPassword, });
  }

  sendTwoFactorOTP() {
    return this.apiservice.get('/publicrequest/SendTwoFactorOTP');
  }

  resendTwoFactorOTP() {
    return this.apiservice.get('/publicrequest/SendTwoFactorOTP'); // ResendTwoFactorOTP
  }
  checktwoFactorOTP(dataItem) {
    const authOTP = this.globalfunction.encryptDataClient(dataItem.twofactoryOTP);
    const checkType = 1;
    const browserInfo = '';
    return this.apiservice.postJson('/publicrequest/ChecktwoFactorOTP', { checkType, authOTP, browserInfo });
  }

}
