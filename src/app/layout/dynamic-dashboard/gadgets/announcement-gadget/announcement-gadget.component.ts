import { ChangeDetectorRef, Component, Inject, LOCALE_ID } from '@angular/core';
import { OptionsService } from '../../configuration/tab-options/service';
import { GadgetInstanceService } from '../../grid/grid.service';
import { RuntimeService } from '../../services/runtime.service';
import { GadgetBase } from '../_common/gadget-base';
import { GadgetPropertyService } from '../_common/gadget-property.service';
import { AnnouncementGadgetService } from './announcement-gadget.service';
import { formatDate } from '@angular/common';
import {Router} from '@angular/router';
import {LocalStorageService} from '../../../../core';
import { Globals } from '../../../../globals';

@Component({
	selector: 'app-announcement-gadget',
	templateUrl: './announcement-gadget.component.html',
	styleUrls: ['../_common/styles-gadget.scss']
})
export class AnnouncementGadgetComponent extends GadgetBase {
	globals: Globals;
	announcements: any;
	resource: string;
	totalannouncements = 0;
	summary: string ;
	currentMonth: string;

	gadgetHasOperationControls = false;
	ToDate: any;
	FromDate: any;
	paramData: { FromDate: any;ToDate: any };
	CustomFormat: string;
	DateFormat: string;
	showAnnouncementDetail = false;
	detailarticle: any;
	options = { autoHide: false };

	constructor(protected _runtimeService: RuntimeService,
							protected _gadgetInstanceService: GadgetInstanceService,
							protected _propertyService: GadgetPropertyService,
							protected _changeDetectionRef: ChangeDetectorRef,
							protected _announcementGagetService: AnnouncementGadgetService,
							protected _optionsService: OptionsService,
							@Inject(LOCALE_ID) private locale: string,
							private _router: Router,
							private _localStorageService: LocalStorageService,
							globals: Globals) {
			super(_runtimeService,
					_gadgetInstanceService,
					_propertyService,
					_changeDetectionRef,
					_optionsService);

			this.globals = globals;
	}

	public preRun(): void {
		this.run();
	}

	public run() {
		if(this._localStorageService.getItem('changeDate')===null)
		{
			const startOfMonth = require('date-fns/start_of_month');
			const result = startOfMonth(new Date());
			this.FromDate = formatDate(result, 'yyyy-MM-dd',this.locale);
			this.currentMonth = formatDate(result,'MMMM',this.locale);
		}
		else
		{
			const changeDate = this._localStorageService.getItem('changeDate');
			const startOfMonth = require('date-fns/start_of_month');
			const result = startOfMonth(Date.parse(changeDate));
			this.FromDate = formatDate(result, 'yyyy-MM-dd',this.locale);
			this.currentMonth = formatDate(result,'MMMM',this.locale);
		}

		this.announcements = [];
		this.DateFormat = 'MMM d';
		this.CustomFormat = 'EEEE';
		const endOfMonth = require('date-fns/end_of_month');
		const result1 = endOfMonth(new Date());
		this.ToDate = formatDate(result1, 'yyyy-MM-dd',this.locale);
		this.paramData = {FromDate: this.FromDate,ToDate:this.ToDate};
		this.initializeRunState(true);
		this.getData(null);
	}

	public stop() {
		this.setStopState(false);
	}

	public getData(data: any[]) {
		this._announcementGagetService.getAnnouncementList(this.paramData).subscribe(x => {
			this.announcements = x;
			this.totalannouncements = x.length;
			if(this.totalannouncements === 0)
			{
				this.summary = ' No Announcements for '+ this.currentMonth;
			}
		});
	}

	public updateProperties(updatedProperties: any) {

		const updatedPropsObject = JSON.parse(updatedProperties);

		this.propertyPages.forEach((propertyPage)=> {


				// for (let x = 0; x < propertyPage.properties.length; x++) {
				for (const x of propertyPage.properties) {
						for (const prop in updatedPropsObject) {
								if (updatedPropsObject.hasOwnProperty(prop)) {
										if (prop === x.key) {
												x.value = updatedPropsObject[prop];
										}

								}
						}
				}
		});

		this.title = updatedPropsObject.title;
		this.getData(null);
	}

	ViewAllAnnouncements() {
		this._router.navigate(['/app.announcement']);
	}

	public Detail(article) {
		this.detailarticle = article;
		this.showAnnouncementDetail = true;
		$('body').addClass('modal-open');
	}

	close()
	{
		this.showAnnouncementDetail = false;
		$('body').removeClass('modal-open');
		this.detailarticle = [];
	}

}
