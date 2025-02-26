import {Injectable} from '@angular/core';
import {Subject,Observable} from 'rxjs';
import { Globalfunction } from '../../../../core/global/globalfunction';
import {LocalStorageService} from '../../../../core';

@Injectable()
export class OptionsService {
    public globalfunction: Globalfunction = new Globalfunction();
    userEnableSlide = '';

    optionsCollectionName = 'dashboardOptions';
    defaultOptions = {
        enableHover: false,
        enableSlide: false
    };

    private globalOptionsChangeEventSubject: Subject<any> = new Subject<any>();

    constructor(private _localstorageService: LocalStorageService) { }

    public getBoardOptions() {

        const databaseOptions = JSON.parse(this._localstorageService.getItem(this.optionsCollectionName));

        if (databaseOptions == null) {
            this.persistDefautBoardOptions();

            this.userEnableSlide = this._localstorageService.getItem('EnableSlide');
            this.defaultOptions.enableSlide = (this.userEnableSlide === 'True') ? true : false;
            return this.defaultOptions;
        } else {
            return databaseOptions;
        }
    }

    private persistDefautBoardOptions(){

        this.userEnableSlide = this._localstorageService.getItem('EnableSlide');
        this.defaultOptions.enableSlide = (this.userEnableSlide === 'True') ? true : false;
        this._localstorageService.setItemString(this.optionsCollectionName, JSON.stringify(this.defaultOptions));

    }
    public setBoardOptions(options: any) {

        /**
         * Todo this will need to change to support the update to individual options. Currently there is only one
         * option but once there is more than one this method must change to take the input and update just that
         * property of the options object.
         */

        this._localstorageService.removeItem(this.optionsCollectionName);

        /**
         *  Raise an event to listeners, primarily the gadgets, when the global options change. The listeners can use
         * the event to change their behavior
         */
        this.globalOptionsChangeEventSubject.next(options);

        return this._localstorageService.setItemString(this.optionsCollectionName, JSON.stringify(options));

    }


    /**
     * The gadget-base can use this method to subscribe to events that are created when the global options change.
     */
    listenForGlobalOptionsChanges(): Observable<string> {
        return this.globalOptionsChangeEventSubject.asObservable();
    }
}
