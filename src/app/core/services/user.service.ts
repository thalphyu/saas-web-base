import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import {LocalStorageService } from './localstorage.service';
import { User } from '../models';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Globalfunction } from '../global/globalfunction';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
  public globalfunction: Globalfunction = new Globalfunction();
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private localStorageService: LocalStorageService,
    private apiService: ApiService,
    private jwtService: JwtService
  ) { }

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // If JWT detected, attempt to get & store user's info
    if (this.jwtService.getToken()) {
      this.apiService.get('/user')
        .subscribe(
          data => this.setAuth(data.user),
          err => this.purgeAuth()
        );
    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  setAuth(user: any) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(user.access_token);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next({} as User);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  attemptAuth(type, credentials, customerurl): Observable<any> {
    //const body = `grant_type=password&LoginType=1&username=${credentials.username}&password=${credentials.password}&`;
    //var data = "grant_type=password&username=" + email + "&password=" + password  + "&initial=" + initial + "&CustomerURL=" + url ;
    //const body = `grant_type=password&username=${credentials.username}&password=${credentials.password}&initial=${credentials.idnumber}&CustomerURL=${customerurl}`;
    const body = {
      //"LoginType": "1",
      CustomerURL: customerurl,
      initial: credentials.idnumber,
      username: credentials.username,
      loginemail:credentials.loginemail,
      password: this.globalfunction.encryptDataClient(credentials.password),//credentials.password,
      grant_type: 'password',
      Uniquekey: credentials.Uniquekey,
    };
    return this.apiService.postJson('/token', body)
      .pipe(map(
        response => {
          const data = {
            token: response.access_token, loginType: response.loginType, paymentFrom: response.paymentFrom, paymentTo: response.paymentTo,
            customTimeFormat: response.customTimeFormat, customDateFormat: response.customDateFormat, gridPagingsize: response.gridPagingsize,
            firstDay: response.firstDay, inOutMode: response.inOutMode, singlePresstimeOption: response.singlePresstimeOption,
            pressTimeInterval: response.pressTimeInterval, clearLog: response.clearLog, UseEmployeeTreeview: response.UseEmployeeTreeview,
            absentColor: response.absentColor, offDayColor: response.offDayColor, publicHolidayColor: response.publicHolidayColor, leaveColor: response.leaveColor,
            packagetype: response.packagetype, IsDDMS: response.IsDDMS, refreshToken: '', useRefreshTokens: false, Cbo_Division_State: response.Cbo_Division_State,
            Cbo_Location_State: response.Cbo_Location_State, Cbo_Section_State: response.Cbo_Section_State, Cbo_Group_State: response.Cbo_Group_State,
            Cbo_Costcenter_State: response.Cbo_Costcenter_State, UseOTCheckOut: response.UseOTCheckOut, userlevelid: response.userlevelid, userName: response.userName,
            Designation: response.Designation, Unique_key: response.Unique_key, AuthOTP_status: response.AuthOTP_status
          };
          //localStorage.setItem('authorizationData', JSON.stringify(data));
          this.localStorageService.setItemObj('authorizationData', data); // save access token
          this.setAuth(response);
          // return <any>response;
          return response;
        }
      ));
  }

  validateType() {
    return this.apiService.post('/publicrequest/ValidateCustomer');
  }

  getUserMenu(): Observable<any> {
    return this.apiService.post('/UserLevel/GetUserLevelMenuData').pipe(
      //return this.apiService.post('/ServiceRequest/BLGeneral/BLGeneral.UserManagement.UserLevelController/GetUserLevelMenuData').pipe(
      map(response => {
        const EnResponse = this.globalfunction.encryptDataClient(JSON.stringify(response));
        this.localStorageService.setItemObjEn('menuList',EnResponse);
        localStorage.setItem('isLoggedin', 'true');
      }));
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  isRequirePasswordChange() {
    const value = {};
    return this.apiService.postJson('/publicrequest/GetRequirePasswordChange',value);
  }
  SaveWebLastLogin(){
    const value = {};
    return this.apiService.postJson('/UserLevel/SaveWebLastLogin',value);
  }
}
