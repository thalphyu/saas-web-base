import { Component, OnInit} from '@angular/core';
import { routerTransition } from '../../router.animations';
import {Router} from '@angular/router';
import {LocalStorageService} from '../../core';
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	//animations: [routerTransition()]  //it is not working after upgrade
})
export class DashboardComponent implements OnInit {
	public showdb = false;
	public authData = JSON.parse(this._localStorageService.getItem('authorizationData'));
	constructor(private _router: Router,private _localStorageService: LocalStorageService)
	{

	}

	ngOnInit(): void {
		if(this.authData.packagetype === 4)
        {
            this.showdb = false;
        }
        else
        {
            this.showdb = true;
        }
	}

	ViewTermsAndConditions()
    {
        this._router.navigate(['/login/terms-and-condition']);
    }

}
