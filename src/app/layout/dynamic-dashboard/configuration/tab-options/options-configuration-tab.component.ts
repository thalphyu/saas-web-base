/**
 * Created by jayhamilton on 1/24/17.
 */
import {
    Component
} from '@angular/core';
import {OptionsService} from './service';
import {ToastService} from '../../toast/toast.service';
import { ApiService } from '../../../../core/services/api.service';
import { Globalfunction } from '../../../../core/global/globalfunction';
import {LocalStorageService} from '../../../../core';
@Component({
    selector: 'app-options-config-tab',
    moduleId: module.id,
    templateUrl: './view.html',
    styleUrls: ['../styles.scss']
})
export class OptionsConfigurationTabComponent {
    public globalfunction: Globalfunction = new Globalfunction();
    enableHover: boolean;
    enableSlide: boolean;

    constructor(private _optionsService: OptionsService, private _toastService: ToastService, private apiservice: ApiService,private _localStorageService: LocalStorageService) {

        this.enableHover = this._optionsService.getBoardOptions().enableHover;
        this.enableSlide = this._optionsService.getBoardOptions().enableSlide;
    }

    onSlideOptionChange(value) {
        this.enableHover = this._optionsService.getBoardOptions().enableHover;
        this._optionsService.setBoardOptions(
            {
                enableSlide: value.checked,
                enableHover: this.enableHover
            });
        this.apiservice.postJson('/board/SaveSlideOption',{slideoption: value.checked}).subscribe(x => {
            this._localStorageService.setItemString('EnableSlide',value.checked);
        });
        this._toastService.sendMessage('The board configuration has changed!',null);
    }

    onHooverOptionChange(value) {
        this.enableSlide = this._optionsService.getBoardOptions().enableSlide;
        this._optionsService.setBoardOptions(
            {
                enableHover: value.checked,
                enableSlide: this.enableSlide
            });
        this._toastService.sendMessage('The board configuration has changed!',null);
    }


}
