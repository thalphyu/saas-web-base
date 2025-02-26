import { Injectable } from '@angular/core';
import { ApiService } from '.';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private apiservice: ApiService) { }

  GetEmployeeProfileInformation() {
    return this.apiservice.postJson('/employeeprofileweb/GetEmployeeProfileInformationWeb');
  }


  SaveProfile(data: any) {
    return this.apiservice.postJson('/employeeprofileweb/SaveEmployeeProfileInformationWeb', data);
  }


}

