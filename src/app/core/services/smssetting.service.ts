import { Injectable } from '@angular/core';
import { ApiService } from '.';

@Injectable({
    providedIn: 'root'
})
export class SmssettingService {

    constructor(private apiservice: ApiService) { }

    GetSmsSetting() {
        return this.apiservice.postJson('/SmsSetting/GetSmsSetting');
    }

    SaveSmsSetting(data: any) {
        return this.apiservice.postJson('/SmsSetting/SaveSmsSetting', data);
    }

    getAllSMSProvider() {
        return this.apiservice.postJson('/SmsSetting/GetAllSMSProvider');
    }
}
