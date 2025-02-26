import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from '../../../../node_modules/rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ApiService } from './api.service';
import { Globalfunction } from '../global/globalfunction';
import { UserlevelControl } from '../models/userlevelcontrol';
@Injectable({
  providedIn: 'root'
})

export class UserlevelcontrolService extends BehaviorSubject<GridDataResult>{

  public globalfunction: Globalfunction = new Globalfunction();
  constructor(private apiservice: ApiService) {
    super(null);
  }

  getUserLevelList(filterText: string): Observable<any> {
    return this.apiservice.postJsonModel('/userlevelcontrol/GetUserLevelList', filterText);
  }

  GetUserLevelMenu(SysID: string): Observable<any> {
    return this.apiservice.postJsonModel('/userlevelcontrol/GetUserLevelMenu', SysID);
  }

  SaveUserLevel(userlevelcontrol: UserlevelControl): Observable<any> {
    const newvalue = {
      SysID: userlevelcontrol.SysID,
      UserLevel: userlevelcontrol.UserLevel,
      Description: userlevelcontrol.Description,
      RestrictedIplist: userlevelcontrol.RestrictedIplist,
      Remark: userlevelcontrol.Remark,
      MenuList: userlevelcontrol.MenuList,
      AccessLogin: userlevelcontrol.AccessLogin,
      AccessMobileLogin: userlevelcontrol.AccessMobileLogin,
      IsAdministrator: userlevelcontrol.IsAdministrator,
      Dval: userlevelcontrol.Dval,
      MenuArrays: userlevelcontrol.MenuArrays,
      Password: this.globalfunction.encryptDataClient(userlevelcontrol.Password),
    };
    return this.apiservice.postJsonModel('/userlevelcontrol/SaveUserLevel', newvalue);
  }

  saveUserLevelControl(userlevelcontrol: UserlevelControl): Observable<any> {
    const newvalue = {
      SysId: userlevelcontrol.SysID,
      UserLevel: userlevelcontrol.UserLevel,
      Description: userlevelcontrol.Description,
      RestrictedIplist: userlevelcontrol.RestrictedIplist,
      Remark: userlevelcontrol.Remark,
      MenuList: userlevelcontrol.MenuList,
      AccessLogin: userlevelcontrol.AccessLogin,
      AccessMobileLogin: userlevelcontrol.AccessMobileLogin,
      IsAdministrator: userlevelcontrol.IsAdministrator,
      Dval: userlevelcontrol.Dval,
      MenuArrays: userlevelcontrol.MenuArrays,
      Password: this.globalfunction.encryptDataClient(userlevelcontrol.Password),
    };
    return this.apiservice.postJsonModel('/userlevelcontrol/SaveUserLevelControl', newvalue);
  }

  updateUserLevel(userlevelcontrol: UserlevelControl): Observable<any> {
    const newvalue = {
      SysId: userlevelcontrol.SysID,
      UserLevel: userlevelcontrol.UserLevel,
      Description: userlevelcontrol.Description,
      RestrictedIplist: userlevelcontrol.RestrictedIplist,
      Remark: userlevelcontrol.Remark,
      MenuList: userlevelcontrol.MenuList,
      AccessLogin: userlevelcontrol.AccessLogin,
      AccessMobileLogin: userlevelcontrol.AccessMobileLogin,
      IsAdministrator: userlevelcontrol.IsAdministrator,
      Dval: userlevelcontrol.Dval,
      MenuArrays: userlevelcontrol.MenuArrays,
      Password: this.globalfunction.encryptDataClient(userlevelcontrol.Password),
    };
    return this.apiservice.postJsonModel('/userlevelcontrol/UpdateUserLevel', newvalue);
  }

  deleteUserLevel(SysID: string): Observable<any> {
    return this.apiservice.postJsonModel('/userlevelcontrol/DeleteUserLevel', SysID);
  }


}
