import { Injectable } from '@angular/core';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class JwtService {
  constructor(private apiservice: ApiService) { }
  getToken(): string {
    return window.localStorage.jwtToken;
  }

  saveToken(token: string) {
    window.localStorage.jwtToken = token;
  }

  destroyToken() {
    window.localStorage.removeItem('jwtToken');
  }

  RetrieveNotification() {
    return this.apiservice.postJson('/RetrieveNotificationDataWeb/RetrieveNotificationDataForWeb');
  }

  RetrieveNotificationCount() {
    return this.apiservice.get('/RetrieveNotificationDataWeb/RetrieveNotificationCountForWeb');
  }

  NotificationDataOffForWeb() {
    return this.apiservice.get('/RetrieveNotificationDataWeb/NotificationDataOffForWeb');
  }

  GetLicenseExpiredDateForCustomer() {
    return this.apiservice.post('/RetrieveNotificationDataWeb/GetLicenseExpiredDateForCustomer');
  }

}
