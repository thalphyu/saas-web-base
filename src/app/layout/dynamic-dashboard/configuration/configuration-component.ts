/**
 * Created by jayhamilton on 1/24/17.
 */
import { ViewChild, ElementRef, AfterViewInit, Component, Output, EventEmitter, Input } from '@angular/core';
import { style, state, trigger, animate, transition } from '@angular/animations';
import {tabsModel} from './tabs.model';
import {environment} from '../../../../environments/environment';
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js';

declare let jquery: any;
declare const bootstrap: any;

/**
 * Message Modal - clasable modal with message
 *
 * Selector message-modal
 *
 * Methods
 *      popMessageModal - display a message modal for a sepcified duration
 *      showMessageModal - show the message modal
 *      hideMessageModal - hide the message modal
 */
@Component({
	selector: 'app-configuration-modal',
	moduleId: module.id,
	templateUrl: './view.html',
	styleUrls: [],
	animations: [

		trigger('contentSwitch', [
			state('inactive', style({
				opacity: 0
			})),
			state('active', style({
				opacity: 1
			})),
			transition('inactive => active', animate('750ms ease-in')),
			transition('active => inactive', animate('750ms ease-out'))
		])
	]

})
export class ConfigurationComponent implements AfterViewInit {

	@Output() dashboardCreateEvent: EventEmitter<any> = new EventEmitter();
	@Output() dashboardEditEvent: EventEmitter<any> = new EventEmitter();
	@Output() dashboardDeleteEvent: EventEmitter<any> = new EventEmitter();
	@Input() dashboardList: any [];

	newDashboardItem = '';
	modalicon: string;
	modalheader: string;
	modalconfig: string;
	env: any;

	@ViewChild('configuration', {static: true}) boardconfigmodalaRef: ElementRef;
	configModal: any;
	currentTab: string;
	tabsModel: any[];

	configuration: bootstrap.Modal | undefined;

	constructor() {

		Object.assign(this, {tabsModel});
		this.setCurrentTab(0);
		this.env = environment;

	}

	showConfigurationModal(header: string) {
		this.modalheader = header;
		this.configuration = new bootstrap.Modal(document.getElementById('configuration'), {});
		this.configuration?.show();
		document.body.classList.remove('pushable');
	}

	hideMessageModal() {
		this.modalicon = '';
		this.modalheader = '';
		this.modalconfig = '';
		this.configModal.modal('hide');
	}

	createBoard(name: string) {
		if (name !==  '') {
			this.dashboardCreateEvent.emit(name);
			this.newDashboardItem = '';
		}
	}

	editBoard(name: string) {
		if (name !==  '') {
			this.dashboardEditEvent.emit(name);
			this.newDashboardItem = '';
		}
	}

	deleteBoard(name: string) {
		this.dashboardDeleteEvent.emit(name);
	}


	ngAfterViewInit() {
		this.configModal = jQuery(this.boardconfigmodalaRef.nativeElement);
		this.configModal.modal('hide');
	}

	setCurrentTab(tab_index) {
		this.currentTab = this.tabsModel[tab_index].displayName;
	}

}
