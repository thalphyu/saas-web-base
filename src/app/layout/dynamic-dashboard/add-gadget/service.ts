/**
 * Created by jayhamilton on 2/7/17.
 */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import { ApiService } from '../../../core/services/api.service';
import { GadgetLibraryResponse } from './gadgetLibraryResponse';


@Injectable()
export class AddGadgetService {

    env: any;

    constructor(private _http: HttpClient,private apiservice: ApiService) {
        this.env = environment;
    }

    checkUser()
    {
        return this.apiservice.postJson('/dynamicdashboard/CheckUser/');
    }

    getGadgetLibrary() {
        let gadgetLibraryJson = '';

        if (this.env.production === true) {
                gadgetLibraryJson = 'gadget-library-model-prod.json';

        } else {
                gadgetLibraryJson = 'gadget-library-model.json';
        }
        return this._http.get<GadgetLibraryResponse>('assets/api/' + gadgetLibraryJson);
    }

}
