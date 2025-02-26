import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { TreeserviceService } from '.';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BehaviorSubject, Observable } from '../../../../node_modules/rxjs';
import { Announcement } from '../models/announcement';
import { FilterbyAnnouncement } from '../models/filterbyannouncement';
@Injectable({
  providedIn: 'root'
})
export class AnnouncemantService extends BehaviorSubject<GridDataResult> {
  load = false;
  totalNomal = 0;
  totalDraft = 0;
  constructor(private apiservice: ApiService) { super(null); }

  public filterAnnouncemant(state: any, postdata: any) {
    this.load = true;
    return this.apiservice.fetchgridpostJson('/Announcement/GetAnnouncementList', state, postdata)
      .subscribe(x => {
        super.next(x);
        this.totalNomal = x.total;
        this.load = false;
      });
  }
  GetDraft(state: any, postdata: any) { // For Create-Announcement post
    this.load = true;
    return this.apiservice.fetchgridpostJson('/Announcement/GetDraftPosts', state, postdata)
      .subscribe(x => {
        super.next(x);
        this.totalDraft = x.total;
        this.load = false;
      });
  }
  GetAnnouncemantList(obj) {
    return this.apiservice.postJson('/Announcement/GetAnnouncementList', obj);
  }
  PostAnnoucemant(announcement: Announcement): Observable<any> {
    return this.apiservice.postJsonModel('/Announcement/SaveAnnouncement', announcement);
  }
  CreatePostAnnouncement(announcement: Announcement): Observable<any> {
    return this.apiservice.postJsonModel('/Announcement/CreatePostAnnouncement', announcement);
  }
  GetListByAudience(announcement: Announcement): Observable<any> { // For Create-Announcement post
    const newvalue = {
      Team: announcement.Team,
      EmployeeId: announcement.EmployeeId,
      SelectedId: announcement.SelectedId,
    };
    return this.apiservice.postJsonModel('/Announcement/GetTeam', newvalue);
  }
  DeleteAnnouncement(AnnouncementID: string): Observable<any> {
    return this.apiservice.postJsonModel('/Announcement/DeleteAnnouncement', AnnouncementID);
  }
  changeIsPublic(filterbyAnnouncement: FilterbyAnnouncement): Observable<any> {
    return this.apiservice.postJsonModel('/Announcement/UpdateIsPublic', filterbyAnnouncement);
  }
  // For update to collect data into its associead filed;
  getSelectedAudienceList(announcementID: string): Observable<any> { // For Create-Announcement post
    return this.apiservice.postJsonModel('/Announcement/GetSelectedAudienceList', announcementID);
  }
  getDraftRowCount() { // get draftRowCount
    return this.apiservice.GetURL2('/Announcement/GetDraftRowCount');
  }

}
