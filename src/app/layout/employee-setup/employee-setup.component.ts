import { Component, OnInit, Inject, LOCALE_ID, EventEmitter, Output } from '@angular/core';
import { EmployeeSetupService, LocalStorageService } from '../../core';
import { formatDate } from '@angular/common';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { FileInfo, ClearEvent, RemoveEvent, SelectEvent, FileRestrictions } from '@progress/kendo-angular-upload';
import { State } from '@progress/kendo-data-query';
import * as XLSX from 'xlsx';
import { Observable, of } from 'rxjs';
import { TreeItemLookup, CheckableSettings } from '@progress/kendo-angular-treeview';
import { ProfileService } from '../../core/services/profile.service';
import { Router } from '@angular/router';
const { read, write, utils } = XLSX;
import { ModalDialogService } from '../../core/services/dialog.service';
import { Globals } from '../../globals';
import { DataStateChangeEvent, SelectableSettings, RowArgs, GridDataResult, SelectAllCheckboxState, PageChangeEvent } from '@progress/kendo-angular-grid';
import { FilterService } from '../../core/services/filter.service';
import { Globalfunction } from '../../core/global/globalfunction';
import { environment } from '../../../environments/environment';

const is = (fileName: string, ext: string) => ext === fileName;
@Component({
	selector: 'app-employee-setup',
	templateUrl: './employee-setup.component.html',
	styleUrls: ['./employee-setup.component.scss']
})
export class EmployeeSetupComponent implements OnInit {
	public globalFunction: Globalfunction = new Globalfunction();
	public view: Observable<GridDataResult>;

	@Output() addItemEvent = new EventEmitter<any[]>();

	globals: Globals;
	@Output() sideOpenEvent = new EventEmitter<boolean>();
	EmployeeInfromation: any = [];
	emp: any = [];
	public EmployeeName: any;
	menulist: string;
	menuobj: any;
	showNew = false;
	value: any;
	res: any;
	public selectempid;
	public globalfunction: Globalfunction;
	public uploadRestrictions: FileRestrictions = {
		allowedExtensions: ['.jpg', '.png', '.jpeg']
	};
	public uploadSaveUrl = ''; // should represent an actual API endpoint
	public uploadRemoveUrl = ''; // should represent an actual API endpoint
	public tempimage = '';
	public uploadedImage: string;
	public isUploadPending = false;
	public IsClickUpload = false;
	restrictedfiletype = false;
	public imagePreviews: any[] = [];
	tmpSysID: any;

	public mySelectionKey(context: RowArgs) { return context.dataItem; }
	file: File;
	public gridData: any[];
	public expandedKeys: any[] = ['0', '0_0'];
	// public opened = false;
	ShowOnlyEmployee = false;
	public formGroups: FormGroup = new FormGroup({ items: new FormArray([]) });
	public formGroup: FormGroup;

	constructor(
		public fb: FormBuilder,
		@Inject(LOCALE_ID) private locale: string,
		private profileService: ProfileService,
		public formBuilder: FormBuilder,
		private employeeService: EmployeeSetupService,
		private filterService: FilterService,
		private router: Router,
		private modalDialogService: ModalDialogService,
		private localStorageService: LocalStorageService,
		globals: Globals,) {
		this.view = employeeService;
		this.globals = globals;
	}

	public gridState: State = {
		sort: [{ field: 'EmployeeCustomFieldID', dir: 'asc' }],
		filter: { logic: 'and', filters: [] }
	};

	public loading = false;
	public updateBtn: boolean;
	public saveBtn: boolean;
	public expandedItem = false;
	public show_Divison = true;
	public isLocked = false;
	public data: any;
	public isdefault: boolean;
	levelIndex: any;
	public empName: any[];

	employeesetupForm = this.formBuilder.group({
		id: [],
		EmployeeID: [0],
		EnrollNumber: [, Validators.required],
		EmployeeCode: [, Validators.required],
		EmployeeName: [, Validators.required],
		MyanmarName: [],
		CID: [, Validators.required],
		//GradeID: ['',],
		Nationality: [],
		nrc: [],
		DOB: [],
		Address: [],
		Email: [,
			Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
		],
		ContactAddress: [],
		Phone: [],
		SysID: [],
		LoginPassword: [, Validators.required],
		Gender: [false],
		DivisionID: [],
		InactiveEmployee: [false],
		AccessStatus: [true],
		UserLevelID: [],
		uploadEmployeePhoto: []
	});

	public checkedKeys: any[] = [];//For UserLevel
	public File: any[] = [];
	FileName: string;
	Company: any;
	UserLevel: any;
	Division: any;
	public userlevelFrom: FormGroup;
	public DOBvalue: Date;
	check_emp_inactive: any = {};

	isShowUploadFilter = false;
	public openFilterByEmployeePopUp() {
		$('body').addClass('modal-open');
		localStorage.removeItem('FilterEmployeeID');
		this.isShowUploadFilter = true;
	}
	public closeFilterByEmployeePopUp() {
		$('body').removeClass('modal-open');
		localStorage.removeItem('FilterEmployeeID');
		this.isShowUploadFilter = false;
	}

	isUserLevelFilter = false;
	select() {
		this.restrictedfiletype = false;
		//let id;

		$('body').removeClass('modal-open');
		this.isShowUploadFilter = false;
		const id = localStorage.getItem('FilterEmployeeID');
		if (id != null) {
			this.saveBtn = false;
			this.updateBtn = false;

			this.GetEmployeeById(id);
		}

		this.employeesetupForm.value.EmployeeID = parseInt(id, 10);
		this.selectempid = id;
	}

	isShowDivision = false;
	public openDivision() {
		this.isShowDivision = true;
	}
	public closeDivision() {
		this.isShowDivision = false;
		this.employeeService.GetDivision().subscribe(resultDivision => {
			//this.Section = resultDivision;
			this.Division = resultDivision;
			this.employeesetupForm.controls.DivisionID.reset(resultDivision[0].DivisionID);
			this.getComboBOxRefresh();
		});
	}

	isShowUploadCmp = false;
	public openCompanyPopUp() {
		this.isShowUploadCmp = true;
	}
	public closeCompanyPopUp() {
		this.isShowUploadCmp = false;
		this.employeeService.GetCompanyByUserLevel().subscribe(resultCompany => {
			this.Company = resultCompany;
			this.employeesetupForm.controls.CID.reset(resultCompany[0].CID);
			this.getComboBOxRefresh();
		});
	}

	inactiveEmp(inactiveEmp) {
		this.employeesetupForm.value.InactiveEmployee = inactiveEmp;
	}

	public newEmployee() {
		if (this.File[0] != null) {
			this.remove(this.File[0]);
			this.imagePreviews = [];
		}

		this.File = [];
		this.uploadedImage = '';
		this.showNew = true;

		this.restrictedfiletype = false;
		this.loading = true;

		//this.completeEventHandler();
		this.employeesetupForm.reset();
		this.employeesetupForm.controls.EmployeeID.reset(0);
		this.employeesetupForm.controls.AccessStatus.reset(true);
		this.employeesetupForm.controls.Gender.reset(false);
		this.employeesetupForm.controls.InactiveEmployee.reset(false);

		this.employeeService.reset();
		this.gridData = [];

		this.saveBtn = true;
		this.updateBtn = false;
		this.EmployeeName = '';
		this.loading = false;

		this.ngOnInit();
	}

	onChange(event) {
		const value = event.target.value;
		const index = value.split(': ');
	}

	public authData = JSON.parse(this.localStorageService.getItem('authorizationData'));
	public CustomDate = this.authData.customDateFormat;

	ngOnInit() {

		this.uploadSaveUrl = `${environment.file_api_url}` + '/Upload/Temp';
		this.uploadRemoveUrl = `${environment.file_api_url}` + '/Upload/TempRemove';

		this.uploadedImage = '';
		this.tempimage = '';
		this.isUploadPending = false;

		this.menulist = this.globalFunction.decryptDataClient(this.localStorageService.getItem('menuList'));

		if (this.menulist === undefined)
			{this.router.navigate(['/login']);}

		this.menuobj = JSON.parse(this.menulist);
		// for (let i = 0; i < this.menuobj.length; i++) {
		// 	const key = this.menuobj[i].MenuID;
		// 	const keyname = this.menuobj[i].MenuName;

		// }

		this.userlevelFrom = this.fb.group({
			userlevelarray: this.fb.array([this.fb.group({ point: '', SysID: 0, Description: '' })])
		});

		this.removeuserlevelTextBox(0);

		this.EmployeeName = '';
		this.saveBtn = true;
		this.updateBtn = false;
		this.expandedItem = false;

		this.DOBvalue = new Date();

		this.employeeService.GetCompanyByUserLevel().subscribe(resultCompany => {
			this.Company = resultCompany;

			this.employeesetupForm.controls.CID.reset(resultCompany[0].CID);

			this.employeeService.GetUserLevel().subscribe(resultUserLevel => {
				this.UserLevel = resultUserLevel;
				this.employeesetupForm.controls.SysID.reset(resultUserLevel[0].SysID);
				this.tmpSysID = resultUserLevel[0].SysID;
				this.employeeService.GetDivision().subscribe(resultdivision => {
					this.Division = resultdivision;
					// for (let i = 0; i < resultdivision.length; i++) {
					for(const i of resultdivision) {
						if (i.isdefault === 1) {
							this.employeesetupForm.controls.DivisionID.reset(i.DivisionID);
						}
					}
				}); // update by myw
			});

		}); // End GetCompanyByUserLevel

		this.check_emp_inactive = false;

	} //end ngOnInit()

	showMessage(message) {
		if (message === 'Reset Password Successfully') {
			this.modalDialogService.confirm('', 'Your password has been reset successfully.', 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
		}

		else if (message.toLowerCase().indexOf('successfully') >= 0) {
			this.modalDialogService.confirm('', 'Employee information has been ' + message, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
			this.showNew = false;
			this.newEmployee();
		}
		else {

			this.modalDialogService.confirm('', message, 'Ok', '', 'text-warning', 'icon-warning', 'Sorry!');
		}
	}

	getComboBOxRefresh() {
		this.employeeService.GetCompanyByUserLevel().subscribe(resultCompany => {
			this.Company = resultCompany;

			this.employeesetupForm.controls.CID.reset(resultCompany[0].CID);

			this.employeeService.GetDivision().subscribe(resultdivision => {
				this.Division = resultdivision;
				for (const i of resultdivision) {
					if (i.isdefault === 1) {
						this.employeesetupForm.controls.DivisionID.reset(i.DivisionID);
					}
				}
			});
		});
	}

	saveEmpData() {

		if (this.employeesetupForm.value.uploadEmployeePhoto != null && this.employeesetupForm.value.uploadEmployeePhoto !== '')
			{this.employeesetupForm.value.uploadEmployeePhoto = this.tempimage;}

		this.employeesetupForm.value.DOB = formatDate(this.DOBvalue, 'yyyy-MM-dd', this.locale);
		this.loading = true;

		this.employeeService.saveEmpData(this.employeesetupForm.value)
			.subscribe((data) => {
				const message = data.message;
				//this.newEmployee();
				this.showMessage(message);

				this.loading = false;
			}); //saveemp end

	}

	update() {

		if (this.IsClickUpload === true)
			{this.employeesetupForm.value.uploadEmployeePhoto = this.tempimage;}
		else
			{this.employeesetupForm.value.uploadEmployeePhoto = '';}

		this.employeesetupForm.value.DOB = formatDate(this.DOBvalue, 'yyyy-MM-dd', this.locale);
		this.loading = true;

		this.employeeService.update(this.employeesetupForm.value)
			.subscribe((data) => {
				const message = data.message;
				//this.newEmployee();
				this.showMessage(message);
				/*if (data.message) {

					const message = data.message;
					if (message == "Update Successfully" && data.EmployeeID != null) {
						this.employeesetupForm.value.EmployeeID = data.EmployeeID;
						this.modalDialogService.confirm('', message + '. Employee Name is ' + this.employeesetupForm.value.EmployeeName + ' .', 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
						this.newEmployee();
					}
					else {
						this.modalDialogService.confirm('', message, 'Ok', '', 'text-danger', 'icon-warning', 'Save Failed!');
					}

				}*/
				this.loading = false;
			}); //empService Update End

	}

	showConfirmation(dataItem) {
		const name = dataItem.EmployeeName;
		this.modalDialogService.confirm('', 'Employee name is ' + name + '. You will not be able to recover it.', 'Delete', 'Cancel', 'text-danger', 'icon-trash', 'Delete this employee?')
			.then((confirmed) => { if (confirmed === true) {this.deleteEmployee(dataItem);} })
			.catch(() => { });
	}

	deleteEmployee(dataItem) {
		this.loading = true;
		this.employeeService.deleteEmployee(dataItem.EmployeeID)
			.subscribe((x) => {
				const message = x.message;
				//this.newEmployee();
				this.showMessage(message);

				/*if (x.message) {
					const message = x.message;
					if (message == "Delete Successfully") {
						this.modalDialogService.confirm('', message + '. Employee Name is ' + this.employeesetupForm.value.EmployeeName, 'Ok', '', 'text-success', 'icon-check', 'Done!');
					}
					else
						this.modalDialogService.confirm('', message, 'Ok', '', 'text-danger', 'icon-warning', 'Delete Unsuccessful!');
				}*/

				this.loading = false;
			});
	}

	resetPassword(data) {
		this.loading = true;
		this.modalDialogService.confirm('', 'Do you want to reset password these employee?', 'Yes, reset it.', 'Cancel', 'text-secondary', 'icon-help', 'Please confirm')
			.then((confirmed) => {
				if (confirmed === true) {
					this.employeeService.resetPassword(data.EmployeeID)
						.subscribe((data1) => {
							if (data1.message) {
								const message = data1.message;
								const Password = data1.Password;
								this.showMessage(message);

								/*if (message == "Reset Password Successfully") {
									this.modalDialogService.confirm('', 'Your password has been reset successfully.', 'Ok', '', 'text-success', 'icon-check', message + '!');
								}
								else
									this.modalDialogService.confirm('', 'You\'ve unsuccessfully reset password.', 'Ok', '', 'text-danger', 'icon-warning', message + 'Sorry!');*/
							}
							this.loading = false;
						});
				}
			})
			.catch(() => { });
	}

	public completeEventHandler(e) {
		console.log('All files processed');
		//this.File = [];

		this.isUploadPending = false;
	}

	public remove(e) {
		e.files[0].name = this.tempimage;
		// this.tempimage = e.files[0].name;
	}

	public clear(e): void {
		this.imagePreviews = [];
	}

	public selectFile(e: SelectEvent): void {
		const that = this;
		const fileNames = [];

		e.files.forEach((file) => {
			fileNames.push(file.name);

			if (!file.validationErrors) {
				const reader = new FileReader();

				reader.onload = ev => {
					const image = {
						src: ev.target.result,
						uid: file.uid,
					};

					that.imagePreviews.unshift(image);
				};

				reader.readAsDataURL(file.rawFile);
			}
		});
	}

	public removePreviewImage(e) {
		const index = this.imagePreviews.findIndex(
			(item) => item.uid === e.files[0].uid
		);

		if (index >= 0) {
			this.imagePreviews.splice(index, 1);
		}
	}

	public removeEventHandler(e: RemoveEvent): void {
		e.files[0].name = this.tempimage;  //replace original file name with unique temp file name
		// this.tempimage = e.files[0].name;
		this.removePreviewImage(e);
	}

	public uploadEventHandler(e) {
		console.log('Upload start');
		this.isUploadPending = true;
		e.data = {
			enFile: this.globalFunction.encryptData(e.files[0].name)
		};
	}

	public successEventHandler(e) {
		if (e.operation === 'upload') {
			this.tempimage = e.response.body;
			this.IsClickUpload = true;
			this.File.push(e);
		}
	}

	public iconClass({ icon }: any): any {
		return {
			'fa fa-cog': is(icon, 'icon-gear'),
			'fa-building': is(icon, 'icon-building'),
			'fa fa-dice-d6': is(icon, 'icon-cube'),
			'fa-user': is(icon, 'icon-user'),
			fas: true
		};
	}

	public GetEmployeeById(id) {

		this.userlevelFrom = this.fb.group({
			userlevelarray: this.fb.array([this.fb.group({ point: '', SysID: 0, Description: '' })])
		});
		this.removeuserlevelTextBox(0);

		this.loading = true;

		this.employeeService.getEmployeeByID(id).subscribe(result => {
			this.EmployeeName = result[0].EmployeeName;

			this.DOBvalue = new Date(result[0].DOB);

			this.employeesetupForm.reset(result[0]);

			if (result[0].AccessStatus === false) {
				this.employeesetupForm.controls.AccessStatus.reset(false);
				this.isLocked = true;
			}
			else {
				this.employeesetupForm.controls.AccessStatus.reset(true);
				this.isLocked = false;
			}

			const eid = result[0].EmployeeID;
			this.employeesetupForm.controls.SysID.reset(this.tmpSysID);
			this.employeesetupForm.controls.EmployeeID.setValue(result[0].EmployeeID);
			this.gridData = [];

			this.employeeService.reset();

			this.imagePreviews = [];
			this.employeeService.getImagePath(eid)
				.subscribe(resimage => {
					this.uploadedImage = resimage;
				});

			if (this.File[0] != null) {
				this.remove(this.File[0]);
			}

			this.File = [];
			this.employeesetupForm.get('LoginPassword').clearValidators();
			this.employeesetupForm.get('LoginPassword').updateValueAndValidity();

			this.loading = false;
			this.saveBtn = false;
			setTimeout(() => {
				this.updateBtn = true;
			}, 1000);

		});

	}

	public AccessStatusChange(dataItem) {
		this.loading = true;
		this.employeeService.unLockPassword(dataItem).subscribe(data => {
			this.loading = false;
			if (data.flat === true) // true ==> AccessStatus = 0
			{
				this.isLocked = false;
				this.employeesetupForm.controls.AccessStatus.reset(true);
				this.modalDialogService.confirm('', data.data, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
			}
			else // false ==> AccessStatus = 2 Or Error Message
			{
				this.isLocked = true;
				this.modalDialogService.confirm('', data.data, 'Ok', '', 'text-danger', 'icon-warning', 'Sorry!');

			}
		});
	}

	get userlevelLists() {

		return this.userlevelFrom.get('userlevelarray') as FormArray;

	}


	public openUserlevelPopup(rowIndex) {
		localStorage.removeItem('FilterSysIDs');
		localStorage.removeItem('DeselectSysIDs');
		this.selectempid = this.employeesetupForm.value.EmployeeID;
		this.checkedKeys = [];
		this.levelIndex = rowIndex;
		$('body').addClass('modal-open');
		this.isUserLevelFilter = true;
		if (this.updateBtn) {
			if (this.employeesetupForm.value.UserLevelID !== undefined) {
				for (const i of  this.employeesetupForm.value.UserLevelID) {
					this.checkedKeys.push(i);
				}
			}
		}

	}

	public closeUserlevelPopup() {
		$('body').removeClass('modal-open');
		localStorage.removeItem('FilterSysIDs');
		localStorage.removeItem('DeselectSysIDs');
		this.isUserLevelFilter = false;
	}

	removeuserlevelTextBox(index) {
		this.checkedKeys = [];
		if (this.updateBtn && this.userlevelFrom.get('userlevelarray').value.length > 0) {
			this.userlevelLists.removeAt(index);
			const UserLevelDescriptionArray = [];
			const UserLevelIDArray = [];
			for (const i of this.userlevelFrom.get('userlevelarray').value) {
				UserLevelDescriptionArray.push(i.point);
				UserLevelIDArray.push(i.SysID);
			}
			this.employeesetupForm.controls.UserLevelID.reset(UserLevelIDArray);
		} else {
			this.userlevelLists.removeAt(index);
		}

		this.userlevelLists.value.forEach(element => {
			this.checkedKeys.push(element.SysID);
		});
	}


	selectUserlevel() {
		$('body').removeClass('modal-open');
		const userlevelNameArray = [];
		//let sysIDArray = [];
		this.isUserLevelFilter = false;
		const id = localStorage.getItem('FilterSysIDs');
		const splitID = (id != null) ? id.split(',') : null;
		let val;

		for (let i = 0; i <= this.userlevelFrom.get('userlevelarray').value.length; i++) {
			if (i === this.userlevelFrom.get('userlevelarray').value.length) {
				val = this.userlevelFrom.get('userlevelarray').value[i - 1].level + 1;

			}
			if (splitID !== null) {
				// for (let i1 = 0; i1 < splitID.length; i1++) {
				for (const i1 of splitID) {
					if (i1 !== null) {
						if (this.checkedKeys.indexOf(i1) === -1) {
							this.checkedKeys.push(i1);
						}
						else {
							this.checkedKeys.splice(this.checkedKeys.indexOf(i1), 1);
						}

					}
				}
			}
		}
		this.employeesetupForm.controls.UserLevelID.reset(this.checkedKeys);//UserLevelID Array
	}


	addTextBox() {
		let val;
		for (let i = 1; i <= this.userlevelFrom.get('userlevelarray').value.length; i++) {
			if (i === this.userlevelFrom.get('userlevelarray').value.length) {
				val = this.userlevelFrom.get('userlevelarray').value[i - 1].level + 1;
			}
		}
		this.userlevelLists.push(this.fb.group({ point: '', level: val, SysID: '' }));

		this.userlevelFrom.controls.userlevelLists = this.userlevelLists;
	}

	onSelectedEmployee(e) {
		localStorage.setItem('FilterEmployeeIDs', e);
	}
	cancel() {
		this.newEmployee();
		this.showNew = false;
	}

	public getcheckedKeysOutput(event) {//Get Deselect UserLevel
		const valindex = this.checkedKeys.indexOf(event);
		if (valindex > -1) {
			this.checkedKeys.splice(valindex, 1);
			this.removeuserlevelTextBox(valindex);
		}

	}

	public deleteImageHandler(e) {   //remove existing photo
		this.modalDialogService.confirm('', 'You will not be able to recover it.', 'Delete', 'Cancel', 'text-danger', 'icon-trash', 'Delete Photo?')
			.then((confirmed) => {
				if (confirmed) {
					this.employeeService.deleteEmployeePhoto(this.employeesetupForm.value.EmployeeID).subscribe(deletestatus => {
						this.uploadedImage = '';
					});
				}
			});
		e.preventDefault();
	}

}

