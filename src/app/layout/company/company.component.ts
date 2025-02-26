import { ModalDialogService } from '../../core/services/dialog.service';
import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../core/services/company.service';
import { Globalfunction } from '../../core/global/globalfunction';
import { FormBuilder } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '../../../../node_modules/@angular/forms';
import { DataTransferService } from '../../core/services/data-transfer.service';
import { DialogService, DialogRef, DialogCloseResult } from '../../../../node_modules/@progress/kendo-angular-dialog';
import { FileInfo, ClearEvent, RemoveEvent, SelectEvent, FileRestrictions } from '@progress/kendo-angular-upload';
import { Observable } from 'rxjs';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid'; /*GridDataResult */
import { State, distinct } from '@progress/kendo-data-query'; /* distinct */
import { LocalStorageService } from '../../core/services';
import { environment } from '../../../environments/environment';
//import { TbGeCompanyprofile } from '../../core/models/company';

const is = (fileName: string, ext: string) => ext === fileName;

@Component({
	selector: 'app-company',
	templateUrl: './company.component.html',
	styleUrls: ['./company.component.scss']
})

export class CompanyComponent implements OnInit {
	Ext: string;
	public state;
	public Companylist: any[] = [];
	public maxItems = 0;
	public canLoad: boolean;
	public saveBtn: boolean;
	public updateBtn: boolean;
	public compName;
	public compEmail;
	//public imagePreviews: FileInfo[] = [];
	public File: any[] = [];
	public btnsave: boolean;
	public autoCorrect = true;
	public min = 1;
	public max = 31;
	public value = 2;

	ID;
	FileName: string;
	filterText: string;
	public companySets: any[];
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
	public imagePreviews: any[] = [];
	public authData = JSON.parse(this.localStorageService.getItem('authorizationData'));

	compForm: FormGroup = new FormGroup({
		CompanyId: new FormControl(''),
		Name: new FormControl('', { validators: Validators.required, updateOn: 'change' }),
		Address: new FormControl(' '),
		Email: new FormControl('', { validators: Validators.email }),
		Phone: new FormControl(' '),
		WebSite: new FormControl(' '),

		State: new FormControl(' '),
		City: new FormControl(' '),
		Country: new FormControl(' '),
		Zip: new FormControl(' '),
		Fax: new FormControl(' '),

		SSBRegister: new FormControl(' '),
		MyanmarName: new FormControl(' '),
		CompanyPhoto: new FormControl(),

	});

	CountryList = ['Afghanistan', 'Albania', 'Algeria', 'American Samoa',
		'Andorra', 'Angola', 'Anguilla', 'Antarctica', 'Antigua And Barbuda', 'Argentina',
		'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain',
		'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia',
		'Bosnia And Herzegowina', 'Botswana', 'Bouvet Island', 'Brazil',
		'British Indian Ocean Territory', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso',
		'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde',
		'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China',
		'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo', 'Cook Islands', 'Costa Rica', 'Cote D`Ivoire',
		'Croatia (Local Name: Hrvatska)', 'Cuba', 'Cyprus', 'Czech Republic  Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
		'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia',
		'Falkland Islands (Malvinas)', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia',
		'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland',
		'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard And Mc Donald Islands',
		'Holy See (Vatican City State)', 'Honduras', 'Hong Kong', 'Hungary', 'Icel And', 'India', 'Indonesia', 'Iran (Islamic Republic Of)',
		'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, Dem People`S Republic',
		'Korea, Republic Of', 'Kuwait', 'Kyrgyzstan', 'Lao People`S Dem Republic',
		'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libyan Arab Jamahiriya', 'Liechtenstein', 'Lithuania',
		'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique',
		'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia, Federated States', 'Moldova, Republic Of',
		'Monaco', 'Mongolia', 'Montserrat', 'Morocco', 'Mozambique',
		'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'Netherlands Ant Illes', 'New Caledonia', 'New Zealand',
		'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands',
		'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
		'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion',
		'Romania', 'Russian Federation', 'Rwanda', 'Saint K Itts And Nevis', 'Saint Lucia', 'Saint Vincent, The Grenadines',
		'Samoa', 'San Marino', 'Sao Tome And Principe', 'Saudi Arabia', 'Senegal',
		'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia (Slovak Republic)', 'Slovenia', 'Solomon Islands',
		'Somalia', 'South Africa', 'South Georgia , S Sandwich Is.', 'Spain', 'Sri Lanka',
		'St. Helena', 'St. Pierre And Miquelon', 'Sudan', 'Suriname', 'Svalbard, Jan Mayen Islands', 'Sw Aziland',
		'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Taiwan', 'Tajikistan',
		'Tanzania, United Republic Of', 'Thailand',
		'Togo', 'Tokelau', 'Tonga', 'Trinidad And Tobago', 'Tunisia',
		'Turkey', 'Turkmenistan', 'Turks And Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine',
		'United Arab Emirates', 'United Kingdom', 'United States', 'United States Minor Is.', 'Uruguay',
		'Uzbekistan', 'Vanuatu', 'Venezuela', 'Viet Nam', 'Virgin Islands (British)',
		'Virgin Islands (U.S.)', 'Wallis And Futuna Islands', 'Western Sahara', 'Yemen', 'Zaire', 'Zambia', 'Zimbabwe'];

	public showNew = false;
	public compbutton = false;
	public edit = false;
	// GridData: any;
	// public view: Observable<GridDataResult>;
	public view: any;
	public gridState: State = {
		sort: [],
		skip: 0,
		take: 10,
		filter: { logic: 'and', filters: [] },
	};

	loading: boolean;
	syncflag = false;
	invalidfiletype = false;

	constructor(
		private localStorageService: LocalStorageService,
		private companyservice: CompanyService,
		private dialogService: DialogService,
		private modalDialogService: ModalDialogService,
		public fb: FormBuilder,
		private dataTransferService: DataTransferService,
	) {
		this.globalfunction = new Globalfunction(this.dialogService);
		//this.view = this.companyservice;
	}

	companyForm = this.fb.group({
		Cur_Row: [0],
		limitRow: [0],
		filterText: [''],
		data: this.fb.array([
		])

	});

	ngOnInit() {
		this.view = this.companyservice;

		this.uploadSaveUrl = `${environment.file_api_url}` + '/Upload/Temp';
		this.uploadRemoveUrl = `${environment.file_api_url}` + '/Upload/TempRemove';

		this.showNew = false;
		this.companyForm.value.Cur_Row = 0,
			this.companyForm.value.limitRow = 0;
		this.Companylist = [];
		this.uploadedImage = '';
		this.tempimage = '';
		this.isUploadPending = false;
		this.canLoad = true;
		this.IsClickUpload = false;

		//fix for last record 's image success event clear
		if (this.File[0] != null) {
			this.remove(this.File[0]);
			this.imagePreviews = [];
		}

		this.File = [];

		this.compForm.reset();
		//fix for last record 's image success event clear

		this.gridState.take = parseInt(this.authData.gridPagingsize, 10);
		this.getMoreCompany(this.gridState);
		/*this.GetPayslipName();*/
	}

	getMoreCompany(gridState) {
		this.loading = true;
		if (this.canLoad === true) {
			this.companyservice.getCompanyList(gridState);
			this.loading = false;
		}
	}



	public onStateChange(state: DataStateChangeEvent): void {
		this.gridState = state;

		this.getMoreCompany(this.gridState);
	}

	searchCompany() {
		this.Companylist = [];
		this.canLoad = true;
		this.companyForm.value.Cur_Row = 0,
			this.companyForm.value.limitRow = 0;
		this.getMoreCompany(this.gridState);
	}

	newCompany() {
		if (this.File[0] != null) {
			this.remove(this.File[0]);
			this.imagePreviews = [];
		}

		this.File = [];
		this.uploadedImage = '';

		this.compForm.reset();
		this.compForm.controls.CompanyId.reset();

		this.compForm.controls.Address.reset();
		this.compForm.controls.City.reset();
		this.compForm.controls.Email.reset();
		this.compForm.controls.Phone.reset();
		this.compForm.controls.WebSite.reset();
		this.compForm.controls.State.reset();
		this.compForm.controls.Country.reset();
		this.compForm.controls.Zip.reset();
		this.compForm.controls.Fax.reset();

		this.compForm.controls.SSBRegister.reset();
		this.compForm.controls.MyanmarName.reset();



		this.getMoreCompany(this.gridState);
		/*this.GetPayslipName();*/
		this.saveBtn = true;
		this.updateBtn = false;
		this.compbutton = false;
		this.edit = false;
		this.showNew = true;
		this.IsClickUpload = false;
	}

	showMessage(message) {
		if (message.toLowerCase().indexOf('successfully') >= 0) {
			this.modalDialogService.confirm('', 'Your company has been ' + message, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
			this.showNew = false;
			this.ngOnInit();
		}
		else {
			this.modalDialogService.confirm('', 'The company name was already exists. Please try another one.', 'Ok', '', 'text-warning', 'icon-warning', message);
		}
	}

	saveCompany() {
		if (this.compForm.value.CompanyPhoto != null && this.compForm.value.CompanyPhoto !== '')
			{this.compForm.value.CompanyPhoto = this.tempimage;}


		this.companyservice.saveComp(this.compForm.value).subscribe((data) => {
			const message = data.message;
			this.compForm.value.CompanyId = data.CompanyId;
			this.showMessage(message);
		});
	}

	updateCompany() {

		if (this.IsClickUpload === true) { this.compForm.value.CompanyPhoto = this.tempimage; }
		else { this.compForm.value.CompanyPhoto = ''; }

		this.companyservice.updateComp(this.compForm.value).subscribe((data) => {
			const message = data.message;
			this.showMessage(message);
		});

	}

	showConfirmation(dataItem) {
		const Name = dataItem.Name;
		this.modalDialogService.confirm('', Name + ' will be permanently deleted.', 'Yes, delete it.', 'Cancel', 'text-danger', 'icon-trash', 'Delete Company?')
			.then((confirmed) => { if (confirmed === true) {this.deleteCompany();} })
			.catch(() => { });
	}

	deleteCompany() {
		this.companyservice.deleteComp(this.compForm.value.CompanyId).subscribe((x) => {
			this.showMessage(x);
		});
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

				reader.onload = (ev)=> {
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
			enFile: this.globalfunction.encryptData(e.files[0].name)
		};
	}

	public successEventHandler(e) {
		if (e.operation === 'upload') {
			this.tempimage = e.response.body;
			this.IsClickUpload = true;
			this.File.push(e);
		}
	}

	cancel() {
		this.showNew = false;
		this.ngOnInit();
	}

	public onItemClick(item: any, dataItem: any): void {
		if (item === 'Edit') {
			this.compbutton = true;
			this.updateBtn = true;

			this.showNew = true;
			this.edit = true;
			this.saveBtn = false;
			this.compName = dataItem.Name;
			this.compEmail = dataItem.Email;
			this.compForm.controls.CompanyId.reset(dataItem.CompanyId);
			this.compForm.controls.Name.reset(dataItem.Name);


			this.compForm.controls.Address.reset(dataItem.Address);

			this.compForm.controls.City.reset(dataItem.City);
			this.compForm.controls.Email.reset(dataItem.Email);
			this.compForm.controls.Phone.reset(dataItem.Phone);
			this.compForm.controls.WebSite.reset(dataItem.WebSite);
			this.compForm.controls.State.reset(dataItem.State);
			this.compForm.controls.Country.reset(dataItem.Country);
			this.compForm.controls.Zip.reset(dataItem.Zip);
			this.compForm.controls.Fax.reset(dataItem.Fax);

			this.compForm.controls.SSBRegister.reset(dataItem.SSBRegisterNo);
			this.compForm.controls.MyanmarName.reset(dataItem.MyanmarName);

			if (dataItem.CompanyId != null) {
				const id = dataItem.CompanyId;

				this.imagePreviews = [];
				this.companyservice.getImagePath(id)
					.subscribe(resimage => {
						this.uploadedImage = resimage;
					});
			}

			if (this.File[0] != null)
				{this.remove(this.File);}

			this.File = [];
		}
		else if (item === 'Delete') {
			this.compForm.controls.CompanyId.reset(dataItem.CompanyId);
			this.compForm.controls.Name.reset(dataItem.Name);

			this.compForm.controls.Address.reset(dataItem.Address);
			this.compForm.controls.City.reset(dataItem.City);
			this.compForm.controls.Email.reset(dataItem.Email);
			this.compForm.controls.Phone.reset(dataItem.Phone);
			this.compForm.controls.WebSite.reset(dataItem.WebSite);
			this.compForm.controls.State.reset(dataItem.State);
			this.compForm.controls.Country.reset(dataItem.Country);
			this.compForm.controls.Zip.reset(dataItem.Zip);
			this.compForm.controls.Fax.reset(dataItem.Fax);

			this.compForm.controls.SSBRegister.reset(dataItem.SSBRegisterNo);
			this.compForm.controls.MyanmarName.reset(dataItem.MyanmarName);
			this.showConfirmation(dataItem);
		}

	}

	//remove existing photo
	public deleteImageHandler(e) {   //remove existing photo
		this.modalDialogService.confirm('', 'You will not be able to recover it.', 'Yes, delete it.', 'Cancel', 'text-danger', 'icon-trash', 'Delete Photo?')
			.then((confirmed) => {
				if (confirmed) {
					this.companyservice.deleteCompanyPhoto(this.compForm.value.CompanyId).subscribe(deletestatus => {
						this.uploadedImage = '';
					});
				}
			});
		e.preventDefault();
	}

}
