import { ModalDialogService } from '../../core/services/dialog.service';
import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { AnnouncemantService } from '../../core/services/announcemant.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DataTransferService } from '../../core/services/data-transfer.service';
import { Globalfunction } from '../../core/global/globalfunction';
import { State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, RowArgs, SelectableSettings, GridComponent } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { DialogService, DialogRef, DialogCloseResult } from '@progress/kendo-angular-dialog';
import { AnnouncemantComponent } from '../announcemant/announcemant.component';
import { formatDate } from '@angular/common';
import tinymce from 'tinymce/tinymce';
/* declare var tinymce: any; */
interface Item {
	text: string;
	value: number;
}
@Component({
	selector: 'app-create-announcemant',
	templateUrl: './create-announcemant.component.html',
	styleUrls: ['./create-announcemant.component.scss']
})
export class CreateAnnouncemantComponent implements OnInit {
	isDetails = false;
	constructor(private announcemantService: AnnouncemantService,
		private fb: FormBuilder,
		private dataTransferService: DataTransferService,
		@Inject(LOCALE_ID) private locale: string,
		private dialogService: DialogService,
		private announcemantComponent: AnnouncemantComponent,
		private modalDialogService: ModalDialogService,) {
		this.globalfunction = new Globalfunction(this.dialogService);

		this.tinymceInit = {
			menubar: false,
			statusbar: false,
			height: '400px',
			plugins: [
				'advlist autolink lists link image charmap print preview anchor textcolor',
				'searchreplace visualblocks code fullscreen',
				'insertdatetime media table paste code help wordcount'
			],
			toolbar: ['undo redo | formatselect | cut copy paste selectall | bold italic underline strikethrough',
				'|alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image print preview | removeformat'],
			image_title: 'true',
			automatic_uploads: 'true',
			file_picker_types: 'image',
			// file_picker_callback: function (cb, value, meta) {
			//   var input = document.createElement('input');
			//   input.setAttribute('type', 'file');
			//   input.setAttribute('accept', 'image/*');


			//   input.onchange = function () {
			//     var file = input.files[0];

			//     var reader = new FileReader();
			//     reader.onload = function () {
			//       var id = 'blobid' + (new Date()).getTime();
			//       var blobCache = tinymce.activeEditor.editorUpload.blobCache;
			//       var base64 = reader.result.split(',')[1];
			//       var blobInfo = blobCache.create(id, file, base64);
			//       blobCache.add(blobInfo);
			//       cb(blobInfo.blobUri(), { title: file.name });
			//     };
			//     reader.readAsDataURL(file);
			//   };

			//   input.click();
			// },
			images_upload_handler: (blobInfo, success, failure) => {
				success('data:' + blobInfo.blob().type + ';base64,' + blobInfo.base64());
			},
		};
	}
	public tinymceInit;
	public globalfunction: Globalfunction;
	public loading: boolean;
	public btnViewDetail = false;
	public audienceNullHide = true;
	public dataSchedule;
	public view: Observable<GridDataResult>;
	public unSelectedAudience = true;
	public btnCancle = false;
	public btnSaveAsDraft = true;
	public EmployeeName: any;
	//date = localStorage.getItem('customDateFormat'); // CustomDateTime_Fromat
	date = 'yyyy-MM-dd';
	public gridState: State = {
		sort: [],
		skip: 0,
		take: 10,
		filter: { logic: 'or', filters: [] },
	};

	public createAnnouncementForm = this.fb.group({
		Title: ['', Validators.required], // in html form
		ReferenceNo: ['', Validators.required], // in html form
		SelectedAudienceArray: [[0]],
		AnnouncementID: [],
		EmployeeId: [[]],
		SelectedId: [[]],
		Team: [], // Audience Name as string
		EmployeeName: [''],
		AnnouncementDate: [],
		Schedule: [],
		Body: [''],
		IsEmail: [false],
		IsDraft: [false], // If is Draft
		IsAdvance: [false],
		IsPublish: [false],
		MakePost: [true]
	});
	public selectedByAudienceList; // Data for DropDown
	public selectedByEmpAudienceList;
	public dataModel; // Data for tinyMec
	public selectedAudienceTitle;
	public choosedAudience: Item; // Value
	public selectedAudience: number[]; // Value MultiSelect data
	public audienceByEmpHide = true;
	public byEmployee = false;
	public isUpdate = false;
	public updateAudience: any;
	public tmpselectedAudience: number[];

	public audienceList: Array<Item> = [
		{ text: 'By Company', value: 0 },
		// { text: "By Department", value: 1 },
		// { text: "By Desgination", value: 2 },
		{ text: 'By Employee', value: 3 },
	];
	viewMenuForm = this.fb.group({
		Type: ['true'],
		Include_Resign: [false],// = false;
		Include_Active: [true], //= true;
		Include_Inactive: [false],// = false;
		Resign_MonthOnly: [false], //= false;
		OrderbyDept: [],
		OrderByDesign: [],
		Dval: ['']
	});
	ngOnInit() {
		tinymce.overrideDefaults({
			base_url: 'tinymce/',  // Base for assets such as skins, themes and plugins [** need in localhost /tinymce]
			suffix: '.min'          // This will make Tiny load minified versions of all its assets
		});
		//  ****Check is Update
		this.unSelectedAudience = true;
		const checkAnnouncemantUpdate = localStorage.getItem('checkAnnouncemantUpdate');
		if (checkAnnouncemantUpdate === 'true') {
			this.update();
		}
		else if (checkAnnouncemantUpdate === 'false') {
			this.viewDetailData();
		}

	}
	isShowUploadFilter = false;
	public openFilterByEmployeeMultiPopUp() {
		$('body').addClass('dialog-open');
		localStorage.removeItem('FilterEmployeeIDs');
		this.isShowUploadFilter = true;
		// this.viewMenuForm.controls.Fromdate.reset(formatDate(this.kpireportForm.value.KpiFromDate, this.CustomDate, this.locale));
		// this.viewMenuForm.controls.Todate.reset(formatDate(this.kpireportForm.value.KpiToDate, this.CustomDate, this.locale));

	}
	public closeFilterByEmployeeMultiPopUp() {
		$('body').removeClass('dialog-open');
		localStorage.removeItem('FilterEmployeeIDs');
		this.isShowUploadFilter = false;
	}
	public viewDetailData() {
		this.btnViewDetail = true;
		this.loading = true;
		this.isDetails = true;
		const checkAnnouncemantUpdate = localStorage.getItem('checkAnnouncemantUpdate');
		if (checkAnnouncemantUpdate === 'false') {
			const editData = JSON.parse(localStorage.getItem('editAnnouncemantData'));
			this.dataModel = editData.Body;
			const ValTextOfAudience = editData.Audience;
			if (ValTextOfAudience != null) {
				if (ValTextOfAudience === 'By Company') {
					this.choosedAudience = this.audienceList[0];
					this.handleAudienceChange(this.audienceList[0]);
				}
				else if (ValTextOfAudience === 'By Employee') {
					this.choosedAudience = this.audienceList[3];
					this.handleAudienceChange(this.audienceList[3]);
				}
				this.selectedAudienceTitle = ValTextOfAudience.split(' ')[1];
				this.createAnnouncementForm.controls.Team.reset(ValTextOfAudience);
				this.updateAudience = ValTextOfAudience;
				const arr = new Array();
				this.announcemantService.getSelectedAudienceList(editData.AnnouncementID).subscribe((data) => {
					// for (let indexOfData = 0; indexOfData < data.length; indexOfData++) {
					for (const indexOfData of data) {
						arr.push(indexOfData.ID);
					}
					this.selectedAudience = arr;
					if (this.selectedAudience.length > 0) {
						this.unSelectedAudience = false;
					}
					if (ValTextOfAudience === 'By Employee') {
						this.selectedByEmpAudienceList = data;
					}
				});
			}
			this.createAnnouncementForm.reset(editData);
			this.createAnnouncementForm.controls.MakePost.setValue(true);
			localStorage.removeItem('checkAnnouncemantUpdate');
			localStorage.removeItem('editAnnouncemantData');
			this.loading = false;
		}
		else {
			localStorage.removeItem('checkAnnouncemantUpdate');
			localStorage.removeItem('editAnnouncemantData');
		}
		this.loading = false;
	}

	public update() {
		// this.audienceNullHide = false;
		this.loading = true;
		this.isUpdate = true;
		const checkAnnouncemantUpdate = localStorage.getItem('checkAnnouncemantUpdate');
		if (checkAnnouncemantUpdate === 'true') {
			const editData = JSON.parse(localStorage.getItem('editAnnouncemantData'));
			this.dataModel = editData.Body;
			const ValTextOfAudience = editData.Audience;
			if (ValTextOfAudience != null) {
				if (ValTextOfAudience === 'By Company') {
					this.audienceNullHide = false;
					this.choosedAudience = this.audienceList[0];
					this.handleAudienceChange(this.audienceList[0]);
				}

				else if (ValTextOfAudience === 'By Employee') {
					this.byEmployee = true;
					this.audienceByEmpHide = false;
					this.audienceNullHide = true;
					this.choosedAudience = this.audienceList[1];
					this.handleAudienceChange(this.audienceList[1]);
				}
				this.selectedAudienceTitle = ValTextOfAudience.split(' ')[1];
				this.createAnnouncementForm.controls.Team.reset(ValTextOfAudience);
				const arr = new Array();
				this.announcemantService.getSelectedAudienceList(editData.AnnouncementID).subscribe((data) => {
					// for (let indexOfData = 0; indexOfData < data.length; indexOfData++) {
					for (const indexOfData of data) {
						arr.push(indexOfData.ID);
					}
					this.selectedAudience = arr;
					if (this.selectedAudience.length > 0) {
						this.unSelectedAudience = false;
					}
					if (ValTextOfAudience === 'By Employee') {
						this.selectedByEmpAudienceList = data;
					}
				});
			}
			this.createAnnouncementForm.reset(editData);
			this.createAnnouncementForm.controls.MakePost.setValue(true);
			localStorage.removeItem('checkAnnouncemantUpdate');
			localStorage.removeItem('editAnnouncemantData');
			this.loading = false;
		}
		else {
			localStorage.removeItem('checkAnnouncemantUpdate');
			localStorage.removeItem('editAnnouncemantData');
		}
		this.loading = false;
	}

	handleAudienceChange(data) {
		const val = data;
		this.selectedAudience = [];
		if (val !== undefined) {
			if (val.value === 3) {
				this.byEmployee = true;
				this.audienceByEmpHide = false;
				this.audienceNullHide = true;
				this.createAnnouncementForm.controls.Team.reset(val.text);
			}
			else {
				this.selectedAudienceTitle = val.text.split(' ')[1];
				this.createAnnouncementForm.controls.Team.reset(val.text);
				this.announcemantService.GetListByAudience(this.createAnnouncementForm.value).subscribe((data1) => {
					this.selectedByAudienceList = data1;
					this.audienceNullHide = false;
					this.audienceByEmpHide = true;
					this.byEmployee = false;
				});
			}
		}
		else {
			this.byEmployee = false;
			this.audienceNullHide = true;
		}
	}

	handleFilter(value, audience) {

		if (this.isUpdate === true) {
			this.createAnnouncementForm.controls.Team.reset(audience.text);
		}

		if (value !== '') {
			this.EmployeeName = value;
			this.unSelectedAudience = false;
			this.createAnnouncementForm.controls.EmployeeName.reset(value);
			this.announcemantService.GetListByAudience(this.createAnnouncementForm.value).subscribe((data) => {
				this.selectedByEmpAudienceList = data;
			});
		}

	}

	// This Fun: is only for Only for Post Button hide/show By Milti-Audience-Lists
	audienceValueChange(data) {
		if (data.length <= 0) {
			this.unSelectedAudience = true;
		} else {
			// Only for Post Button hide/show
			this.unSelectedAudience = false;
		}
	}
	public selectEmployee(val, selected) {
		$('body').removeClass('dialog-open');
		const emp = [];
		const audience = val.text;
		this.isShowUploadFilter = false;
		// this.GridData = [];
		// this.emplist = [];
		const dataEmp = localStorage.getItem('FilterEmployeeIDs');
		const res = dataEmp.split(',');
		for (let i = 0; i < res.length; i++) {
			emp[i] = 'Emp-' + res[i];
		}
		this.getEmployeeForAnnouncement(res, audience, selected);
		// this.checkedKeys = emp;
		// this.kpireportForm.controls['EmployeeID'].setValue(res);
	}

	getEmployeeForAnnouncement(id, audience, selected) {
		const arr = new Array();
		this.unSelectedAudience = false;
		this.createAnnouncementForm.controls.EmployeeId.reset(id);
		this.createAnnouncementForm.controls.SelectedId.reset(selected);
		this.createAnnouncementForm.controls.Team.reset(audience);
		this.announcemantService.GetListByAudience(this.createAnnouncementForm.value).subscribe((data) => {
			this.selectedByEmpAudienceList = data;
			// for (let indexOfData = 0; indexOfData < data.length; indexOfData++) {
			for (const indexOfData of data) {
				arr.push(indexOfData.ID);
			}
			this.selectedAudience = arr;
		});
	}

	showMessage() {
		this.announcemantService.PostAnnoucemant(this.createAnnouncementForm.value).subscribe((data) => {
			this.loading = false;
			this.btnCancle = false;
			this.unSelectedAudience = false;
			this.announcemantComponent.ngOnInit(); // Call Announcemant Onnit Function;
			this.exitFromCreateAnnouncemant();
			if (data.toLowerCase().indexOf('successfully') >= 0) {
				this.modalDialogService.confirm('', 'Your announcement has been ' + data, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
			}
			else {
				this.modalDialogService.confirm('', data, 'Ok', '', 'text-warning', 'icon-warning', 'Invalid Announcement!');
			}
		});
	}

	post() {
		this.loading = true;
		this.unSelectedAudience = true;
		this.btnCancle = true;
		this.tmpselectedAudience = [];
		// Check shedule date is selected or not
		this.createAnnouncementForm.controls.AnnouncementDate.reset(new Date());
		this.createAnnouncementForm.controls.Body.reset(this.dataModel);
		this.createAnnouncementForm.controls.Team.reset(this.choosedAudience.text);
		if (this.selectedAudience === undefined) {
			this.createAnnouncementForm.controls.SelectedAudienceArray.reset(this.tmpselectedAudience);
		}
		else if (this.selectedAudience.length === 0) {
			this.createAnnouncementForm.controls.SelectedAudienceArray.reset(this.tmpselectedAudience);
		}
		else {
			this.createAnnouncementForm.controls.SelectedAudienceArray.reset(this.selectedAudience);
		}

		this.showMessage();
	}

	saveAsDraft() {
		this.loading = true;
		this.unSelectedAudience = true;
		this.btnCancle = true;
		this.tmpselectedAudience = [];
		// Check shedule date is selected or not
		if (this.dataSchedule !== undefined) {
			const schDate = formatDate(this.dataSchedule, this.date, this.locale);
			this.createAnnouncementForm.controls.Schedule.reset(schDate);
		}
		else {
			this.createAnnouncementForm.controls.AnnouncementDate.reset(new Date());
		}
		this.createAnnouncementForm.controls.Body.reset(this.dataModel);
		if (this.selectedAudience === undefined) {
			this.createAnnouncementForm.controls.SelectedAudienceArray.reset(this.tmpselectedAudience);
		}
		else if (this.selectedAudience.length === 0) {
			this.createAnnouncementForm.controls.SelectedAudienceArray.reset(this.tmpselectedAudience);
		}
		else {
			this.createAnnouncementForm.controls.SelectedAudienceArray.reset(this.selectedAudience);
		}
		if (this.choosedAudience !== undefined) {
			this.createAnnouncementForm.controls.Team.reset(this.choosedAudience.text);
		}
		this.createAnnouncementForm.controls.IsDraft.reset(true);
		this.createAnnouncementForm.controls.MakePost.reset(false);

		this.showMessage();
	}

	// Dialog For Confirm Cancelling
	public opened = false;
	public open() {
		this.createAnnouncementForm.controls.Body.reset(this.dataModel);
		this.createAnnouncementForm.controls.SelectedAudienceArray.reset(this.selectedAudience);
		if (this.createAnnouncementForm.controls.Title.value !== '' || this.createAnnouncementForm.controls.SelectedAudienceArray.value != null ||
			this.createAnnouncementForm.controls.Body.value != null || this.createAnnouncementForm.controls.ReferenceNo.value !== '') {
			this.opened = true;
			this.btnSaveAsDraft = false;
		} else {
			this.btnSaveAsDraft = true;
			this.announcemantComponent.closeCreateAnnouncemantPopUp();
		}
	}
	// Dialog For Calendar Shedule
	public openedCalendar = false;
	public openCalendar() {
		this.openedCalendar = true;
	}
	// Close  Dialog For Confirm Cancelling
	public close(status) {
		this.opened = false;
	}
	// Close  For Calendar Shedule
	public closeCalendar(status) {
		this.openedCalendar = false;
	}
	exitFromCreateAnnouncemant() {
		this.announcemantComponent.closeCreateAnnouncemantPopUp();
	}

	/*showConfirmation(event) {
		// const Name = event.EmployeeName;
		this.modalDialogService.confirm('Please confirm...', 'Are you sure to make changes?', 'Yes', 'No')
			.then((confirmed) => {
				if (confirmed == true) {
					this.UpdateAnnoumcemant(event);
				}
			})
			.catch(() => { });
	}
	UpdateAnnoumcemant(event) {
		this.announcemantService.PostAnnoucemant(event).subscribe(x => {
			this.modalDialogService.confirm('', x, 'Ok', '', 'text-success', 'icon-check', 'Done!');
		});
	}*/
}
