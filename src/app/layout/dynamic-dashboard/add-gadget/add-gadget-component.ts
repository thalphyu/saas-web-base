/**
 * Created by jayhamilton on 1/24/17.
 */
import { ViewChild, ElementRef, AfterViewInit, Component, Output, EventEmitter } from '@angular/core';
import { style, trigger, animate, transition } from '@angular/animations';
import {AddGadgetService} from './service';
import {Facet} from '../facet/facet-model';
import {FacetTagProcessor} from '../facet/facet-tag-processor';
import { LocalStorageService } from '../../../core';
import { Globalfunction } from '../../../core/global/globalfunction';
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
	selector: 'app-add-gadget-modal',
	moduleId: module.id,
	templateUrl: './view.html',
	styleUrls: [],
	animations: [
		trigger(
			'showHideAnimation',
			[
				transition(':enter', [   // :enter is alias to 'void => *'
					style({opacity: 0}),
					animate(750, style({opacity: 1}))
				]),
				transition(':leave', [   // :leave is alias to '* => void'
					animate(750, style({opacity: 0}))
				])
			])
	]

})
export class AddGadgetComponent implements AfterViewInit {
	public globalfunction: Globalfunction = new Globalfunction();

	@Output() addGadgetEvent: EventEmitter<any> = new EventEmitter();

	gadgetObjectList: any[] = [];
	gadgetObjectTitleList: string[] = [];
	placeHolderText = 'Begin typing gadget name';
	layoutColumnOneWidth = 'six';
	layoutColumnTwoWidth = 'ten';
	listHeader= 'Gadgets';
	facetTags: Array<Facet>;
	color = 'white';
	typeAheadIsInMenu = false;
	modalicon: string;
	modalheader: string;
	modalmessage: string;

	@ViewChild('addGadget',{static:false}) messagemodalRef: ElementRef;

	messageModal: any;
	IsFullAccessGagets = false;
	menulist: any;
	menuobj: any = [];

	addGadget: bootstrap.Modal | undefined;

	constructor( private _addGadgetService: AddGadgetService,
					private _localStorageService: LocalStorageService ) {

			this.getObjectList();
	}

	actionHandler(actionItem, actionName) {
		this.addGadgetEvent.emit(actionItem);
		this.hideMessageModal();
	}

	showMessageModal(icon: string, header: string, message: string) {
		this.modalicon = icon;
		this.modalheader = header;
		this.modalmessage = message;
		this.messageModal.modal('show');
	}

	showComponentLibraryModal(header: string) {
		this.modalheader = header;
		this.addGadget = new bootstrap.Modal(document.getElementById('addGadget'), {});
		this.addGadget?.show();
		document.body.classList.remove('pushable');
	}

	hideMessageModal() {
		this.modalicon = '';
		this.modalheader = '';
		this.modalmessage = '';
		this.messageModal.modal('hide');
	}

	ngAfterViewInit() {
		this.menulist =this.globalfunction.decryptDataClient(this._localStorageService.getItem('menuList'));
		this.menuobj = JSON.parse(this.menulist);
		this.messageModal = jQuery(this.messagemodalRef.nativeElement);
	}

	getObjectList() {
		this._addGadgetService.getGadgetLibrary().subscribe(data => {
			this.gadgetObjectList.length = 0;
			const me = this;
			data.library.forEach((item)=> {
				// for (let i = 0; i < me.menuobj.length; i++) {
				// 	const keyname = me.menuobj[i].MenuName;
				// 	if (keyname === item.name) {
				// 		me.gadgetObjectList.push(item);
				// 		me.gadgetObjectTitleList.push(item.name);
				// 	}
				// }
				for (const i of me.menuobj) {
					const keyname = i.MenuName;
					if (keyname === item.name) {
						me.gadgetObjectList.push(item);
						me.gadgetObjectTitleList.push(item.name);
					}
				}
			});
			const facetTagProcess = new FacetTagProcessor(this.gadgetObjectList);
			this.facetTags = facetTagProcess.getFacetTags();
		});

	}
}
