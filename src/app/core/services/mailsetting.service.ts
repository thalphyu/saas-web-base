import { Injectable } from '@angular/core';
import { ApiService } from '.';
import { BehaviorSubject, Observable } from '../../../../node_modules/rxjs';
import { MailSetting } from '../models/mailsetting';

@Injectable({
  providedIn: 'root'
})
export class MailsettingService {

  constructor(private apiservice: ApiService) { }

  GetMailSetting() {
    return this.apiservice.get('/mailsetting/GetMailSetting');
  }
  SaveMailSetting(mailsetting: MailSetting): Observable<any> {
    return this.apiservice.postJsonModel('/mailsetting/SaveMailSetting', mailsetting);
  }
  TestMailSetting(mailsetting: MailSetting): Observable<any> {
    return this.apiservice.postJsonModel('/mailsetting/TestMailSetting', mailsetting);
  }
}
