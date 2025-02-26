import {Injectable} from '@angular/core';
import {RuntimeService} from '../../services/runtime.service';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import { ApiService } from '../../../../core/services/api.service';
@Injectable({
  providedIn: 'root'
})
export class AnnouncementGadgetService {

  constructor(private _http: HttpClient,private apiservice: ApiService) { }

  getAnnouncementList(paramdata: any)
  {
    return this.apiservice.postJson('/dynamicdashboard/GetAnnouncementList',paramdata);
  }
}
