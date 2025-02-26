import { ModalDialogService } from '../../core/services/dialog.service';
import { Component, OnInit, Inject, LOCALE_ID, AfterViewInit, Input } from '@angular/core';
import { AnnouncemantService } from '../../core/services/announcemant.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DataTransferService } from '../../core/services/data-transfer.service';
import { DialogService, DialogRef, DialogCloseResult } from '@progress/kendo-angular-dialog';
import { Globalfunction } from '../../core/global/globalfunction';
import { State } from '@progress/kendo-data-query';
import { Observable, BehaviorSubject } from 'rxjs';
import { GridDataResult, RowArgs, DataStateChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';
import { formatDate } from '@angular/common';
import { FilterService } from '../../core/services/filter.service';
import { Router } from '@angular/router';
import { CreateAnnouncemantComponent } from '../create-announcemant/create-announcemant.component';
declare let require: any;
declare let tinymceInit: any;
interface Item {
	text: string;
	value: number;
}
@Component({
	selector: 'app-announcemant',
	templateUrl: './announcemant.component.html',
	styleUrls: ['./announcemant.component.scss']
})
export class AnnouncemantComponent implements OnInit {
	@Input() elementId: string;
	public DraftGridData: any;
	public selectedItem: Item;
	constructor(
		private announcemantService: AnnouncemantService,
		private filterService: FilterService,
		private fb: FormBuilder,
		private dataTransferService: DataTransferService,
		@Inject(LOCALE_ID) private locale: string,
		private dialogService: DialogService,
		private modalDialogService: ModalDialogService,
	) {
		this.NormalView = announcemantService;
		this.DraftView = announcemantService;
		// this.col = announcemantService.totalDraft;
		this.globalfunction = new Globalfunction(this.dialogService);
	}
	public totalDraftCount = 0;
	public tinymceInit;
	public globalfunction: Globalfunction;
	public loading: boolean;
	public NormalView: Observable<GridDataResult>;
	public DraftView: Observable<GridDataResult>;
	//date = localStorage.getItem('customDateFormat'); // CustomDateTime_Fromat
	date = 'yyyy-MM-dd';
	normalGrid: boolean;
	draftGrid: boolean;
	announcementLabel: boolean;
	draftannouncement: boolean;
	goBackBtn = true;
	draftGridBtn = true;
	disabledEditBtn = false;
	dataArray: any;
	public compbutton = false;
	public isDetails = false;
	public isEdit = false;
	public gridState: State = {
		sort: [],
		skip: 0,
		take: 10,
		filter: {
			logic: 'or', filters: []
		}
	};
	public tmpgridState: State = {
		sort: [],
		skip: 0,
		take: 10,
	};
	public announcemantForm = this.fb.group({
		fromDate: [],
		toDate: [],
		search: [],
		Body: [],
		AnnouncementID: [],
		Ispublish: [],
		Title: [],
	});
	public dateList: Array<Item> = [
		{ text: 'By This Month', value: 1 },
		{ text: 'By Last Month', value: 2 },
		{ text: 'By This Year', value: 3 },
	];
	ItemClickData_two: Array<any> = [
		{ text: 'Edit' },
		{ text: 'Delete' }
	];
	ItemClickData_one: Array<any> = [
		{ text: 'Delete' }
	];
	ngOnInit() {
		// *** Get all data to Grid By This Month on intial state  *** //
		this.compbutton = false;
		this.goBackBtn = true;
		this.draftGridBtn = false;
		this.normalGrid = true;
		this.draftGrid = false;
		this.announcementLabel = true;
		this.draftannouncement = false;
		this.isShowUpload = false;
		this.isEdit = false;
		this.selectedItem = this.dateList[0];
		const startOfMonth = require('date-fns/start_of_month');
		const result = startOfMonth(new Date());
		this.announcemantForm.controls.fromDate.reset(formatDate(result, this.date, this.locale));
		const endOfMonth = require('date-fns/end_of_month');
		const result1 = endOfMonth(result);
		this.announcemantForm.controls.toDate.reset(formatDate(result1, this.date, this.locale));
		this.announcemantService.filterAnnouncemant(this.gridState, this.announcemantForm.value);
		this.announcemantService.getDraftRowCount().subscribe((data) => {
			this.totalDraftCount = data.data;
		});
	}
	public dataStateChangeNormalGrid(state: DataStateChangeEvent): void {
		this.gridState = state;
		this.announcemantService.filterAnnouncemant(this.gridState, this.announcemantForm.value);
	}
	public dataStateChangeDraftGrid(state: DataStateChangeEvent): void {
		this.gridState = state;
		this.announcemantService.GetDraft(this.gridState, this.announcemantForm.value);
	}
	handleCategoryChange(value) {
		if (value === undefined) {
			this.announcemantForm.reset();
			this.gridState = this.tmpgridState;
			this.ngOnInit();
		}
		else {
			const timeSelect = value.value;
			const Today = new Date();
			if (timeSelect === 1)// [1 == this Month]
			{
				const startOfMonth = require('date-fns/start_of_month');
				const result2 = startOfMonth(Today);
				this.announcemantForm.controls.fromDate.reset(formatDate(result2, this.date, this.locale));
				const endOfMonth = require('date-fns/end_of_month');
				const result3 = endOfMonth(result2);
				this.announcemantForm.controls.toDate.reset(formatDate(result3, this.date, this.locale));
			}
			else if (timeSelect === 2) // [2 == last month]
			{
				const subMonths = require('date-fns/sub_months');
				const result = subMonths(Today, 1);
				this.announcemantForm.controls.fromDate.reset(formatDate(result, this.date, this.locale));
				const endOfMonth = require('date-fns/end_of_month');
				const result4 = endOfMonth(result);
				this.announcemantForm.controls.toDate.reset(formatDate(result4, this.date, this.locale));

				// [-- BY LAST YEAR --]
				// var startOfYear = require('date-fns/start_of_year');
				// var result2 = startOfYear(Today);
				// var subYears = require('date-fns/sub_Years');
				// var result1 = subYears(result2, 1);
				// var EndOfYear = require('date-fns/end_of_year');
				// var result3 = EndOfYear(result1);
				// this.announcemantForm.controls.fromDate.reset(formatDate(result1, this.date, this.locale));
				// this.announcemantForm.controls.toDate.reset(formatDate(result3, this.date, this.locale));
			}
			else // [ 3 == this year]
			{
				const startOfYear = require('date-fns/start_of_year');
				const result = startOfYear(Today);
				this.announcemantForm.controls.fromDate.reset(formatDate(result, this.date, this.locale));
				const endOfYear = require('date-fns/end_of_year');
				const result1 = endOfYear(result);
				this.announcemantForm.controls.toDate.reset(formatDate(result1, this.date, this.locale));
			}
			// Get Data to GridDate
			if (this.draftGrid === false) {
				this.announcemantService.filterAnnouncemant(this.gridState, this.announcemantForm.value);
			}
			else {
				this.announcemantService.GetDraft(this.gridState, this.announcemantForm.value);
			}
		}

	}
	// *** NormalGrid Action Click Funcion
	public onItemClick(item: any, dataItem: any): void {
		if (item === 'Edit') {
			if (dataItem.IsPublish === true) {
				this.modalDialogService.confirm('', 'It\'s already published.', 'Ok', '', 'text-info', 'icon-info', 'Invalid Edit!');
			} else {
				localStorage.setItem('checkAnnouncemantUpdate', 'true');
				localStorage.setItem('editAnnouncemantData', JSON.stringify(dataItem));
				this.isEdit = true;
				this.openCreateAnnouncemantPopUp();
			}
		}
		else if (item === 'Delete') {
			this.showConfirmation(dataItem);
		}
	}
	public onItemFocus(dataItem) {
		if (dataItem.IsPublish === true) {
			// var removeItemArray = this.ItemClickData.map(function (item) { return item.text; }).indexOf('Edit');
			// if(removeItemArray > -1){
			//   this.ItemClickData.splice(removeItemArray, 1);
			this.dataArray = this.ItemClickData_one;
		} else {
			this.dataArray = this.ItemClickData_two;
		}
	}

	// *** DraftGrid Action Click Funcion
	public onItemDraftClick(item: any, dataItem: any): void {
		if (item === 'Create Post') {
			// Check all required filed filled or not
			this.ngOnInit();
			if (dataItem.AnnouncementID !== '' && dataItem.Audience != null && dataItem.ReferenceNo !== '' && dataItem.Title !== '' && dataItem.IsDraft === true) {
				dataItem.IsDraft = false;
				this.announcemantService.CreatePostAnnouncement(dataItem).subscribe((data) => {
					if (data.toLowerCase().indexOf('successfully') >= 0) {
						this.modalDialogService.confirm('', 'Your announcement has been ' + data, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
					}
					else {
						this.modalDialogService.confirm('', 'Your announcement unable to save.', 'Ok', '', 'text-info', 'icon-info', 'Invalid Announcement!');
					}
				});
			}
			else {
				this.modalDialogService.confirm('', 'You\'ve something wrong!', 'Ok', '', 'text-danger', 'icon-warning', 'Oops...');
			}
		}
		else if (item === 'Edit') {
			localStorage.setItem('checkAnnouncemantUpdate', 'true');
			localStorage.setItem('editAnnouncemantData', JSON.stringify(dataItem));
			this.isEdit = true;
			this.openCreateAnnouncemantPopUp();
		}
		else { // (item == Delete)
			this.showConfirmation(dataItem);
		}
	}

	showConfirmation(event) {
		// const Name = event.EmployeeName;
		this.modalDialogService.confirm('', 'This will be permanently deleted.', 'Yes, delete it.', 'Cancel', 'text-danger', 'icon-trash', 'Delete Announcemant?')
			.then((confirmed) => {
				if (confirmed === true) {
					this.DeleteAnnouncement(event);
				}
			})
			.catch(() => { });
	}
	DeleteAnnouncement(event) {
		this.loading = true;
		this.announcemantService.DeleteAnnouncement(event.AnnouncementID).subscribe(x => {
			this.modalDialogService.confirm('', 'Your announcement has been ' + x, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
			this.loading = false;
			this.ngOnInit();
		});
	}

	isShowUpload = false;
	public openCreateAnnouncemantPopUp() {
		this.isShowUpload = true;
	}
	public closeCreateAnnouncemantPopUp() {
		this.isShowUpload = false;
		this.isEdit = false;
		this.isDetails = false;
		//display data in Grid when click Discard button
		if (this.draftGrid === false) {
			this.announcemantService.filterAnnouncemant(this.gridState, this.announcemantForm.value);
		}
		else {
			this.announcemantService.GetDraft(this.gridState, this.announcemantForm.value);
		}

	}
	public close(status) {
		this.isShowUpload = false;
	}
	openDraftGrid() {
		this.compbutton = true;
		this.draftGridBtn = true;
		this.goBackBtn = false;
		this.normalGrid = false;
		this.announcementLabel = false;
		this.draftGrid = true;
		this.draftannouncement = true;
		this.isShowUpload = false;
		this.announcemantService.GetDraft(this.gridState, this.announcemantForm.value);
	}
	search(filter) {//for external search
		this.gridState.filter.filters = [
			{ field: 'Title', operator: 'contains', value: filter },
			{ field: 'AnnouncementDate', operator: 'contains', value: filter },
			{ field: 'CreatedBy', operator: 'contains', value: filter },
		];
		if (this.draftGrid === false) {
			this.announcemantService.filterAnnouncemant(this.gridState, this.announcemantForm.value);
		}
		else {
			this.announcemantService.GetDraft(this.gridState, this.announcemantForm.value);
		}
	}
	viewdetail(dataItem) {
		this.isDetails = true;
		this.isEdit = false;
		localStorage.setItem('checkAnnouncemantUpdate', 'false');
		localStorage.setItem('editAnnouncemantData', JSON.stringify(dataItem));
		this.openCreateAnnouncemantPopUp();
	}
	changeNormalCheck(dataItem) {
		// Check IsPublic is true or flase
		this.loading = true;
		this.announcemantForm.controls.AnnouncementID.reset(dataItem.AnnouncementID);
		this.announcemantForm.controls.Title.reset(dataItem.Title);
		this.announcemantForm.controls.Body.reset(dataItem.Body);
		let changePublic: boolean;
		if (dataItem.IsPublish === true) {
			changePublic = false;
		} else {
			changePublic = true;
		}
		this.announcemantForm.controls.Ispublish.reset(changePublic);
		this.announcemantService.changeIsPublic(this.announcemantForm.value).subscribe((data) => {
			if (data === 'true') {
				// Check is Normal or Draft to reload GridState
				if (dataItem.IsDraft === false) {
					this.announcemantService.filterAnnouncemant(this.gridState, this.announcemantForm.value);
					this.loading = false;
				}
				else {
					this.openDraftGrid();
					this.loading = false;
				}
			}
		});
	}
}
