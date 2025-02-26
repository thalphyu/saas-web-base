import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { Globalfunction } from '../../../core/global/globalfunction';
import { LocalStorageService } from '../../../core';

/**a
 * Board component
 *
 */
@Component({
    moduleId: module.id,
    templateUrl: './view.html',
    selector: 'app-board-component'

})
export class BoardComponent {
    public globalfunction: Globalfunction = new Globalfunction();

    constructor(private router: Router,private _localStorageService: LocalStorageService) {this.boardinit();}
    boardinit() {

    }

}
