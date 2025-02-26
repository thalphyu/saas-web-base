import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Admin } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {

  private isSaved = new BehaviorSubject(false);
  currentValue = this.isSaved.asObservable();
  private filterData = new BehaviorSubject(false);
  fData = this.filterData.asObservable();
  private viewData = new BehaviorSubject(false);
  vData = this.filterData.asObservable();
  private isempValueData = new BehaviorSubject(false);
  empValueData = this.isempValueData.asObservable();
  private isleaveValueData = new BehaviorSubject(false);
  leaveValueData = this.isleaveValueData.asObservable();
  private isattendanceValueData = new BehaviorSubject(false);
  attendanceValueData = this.isattendanceValueData.asObservable();
  private attEmployeeData = new BehaviorSubject(false);
  attEmployeeList = this.attEmployeeData.asObservable();
  private defaultFunctionData = new BehaviorSubject(false);
  defaultFunction = this.defaultFunctionData.asObservable();
  private AttRequestData = new BehaviorSubject(false);
  AttendanceRequestList = this.AttRequestData.asObservable();
  constructor() { }

  isSavedAdmin(isSaved: boolean) {
    this.isSaved.next(isSaved);
  }

  isSavedGazette(isSaved: boolean) {
    this.isSaved.next(isSaved);
  }

  saveFlterData(filterData: any) {
    this.filterData.next(filterData);
  }
  addEmpValue(empValue: any) {
    this.isempValueData.next(empValue);
  }
  addLeaveValue(leaveValue: any) {
    this.isleaveValueData.next(leaveValue);
  }
  addAttendanceValue(attendanceValue: any) {
    this.isattendanceValueData.next(attendanceValue);
  }
  addDefaultFunction(defaultFunction: any) {
    this.defaultFunctionData.next(defaultFunction);
  }
  saveViewMenuData(viewData: any) {
    this.filterData.next(viewData);
  }

  saveAttendanceEmployeeData(attData: any) {
    this.attEmployeeData.next(attData);
  }

  saveAttendanceRequestData(attData: any) {
    this.AttRequestData.next(attData);
  }

}
