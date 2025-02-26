import { ModalDialogService } from './../../core/services/dialog.service';
import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { DataTransferService, LocalStorageService } from '../../core';
import { Router } from '@angular/router';
import { DialogService, DialogRef, DialogCloseResult } from '@progress/kendo-angular-dialog';
import { Globalfunction } from '../../core/global/globalfunction';
import { State } from '@progress/kendo-data-query';
import { formatDate } from '@angular/common';
/* import { V } from "@angular/core/src/render3"; */
@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
	public EmpDOB: any;
	public saveBtn: boolean;
	public newBtn: boolean;
	public updateBtn: boolean;

	constructor(
		private router: Router,
		public fb: FormBuilder,
		private profileService: ProfileService,
		private modalDialogService: ModalDialogService,
		private localStorageService: LocalStorageService,
		@Inject(LOCALE_ID) private locale: string
	) {
	}

	ProfileInfoForm = this.fb.group({
		DOB: [new Date()],
		NRC: ['', Validators.required],
		Email: [''],
		Address: [],
		ContactAddress: [],
		Nationality: [],
		val: [],
		Phone: ['', [Validators.required, this.numberValidator]]
	});

	public authData = JSON.parse(this.localStorageService.getItem('authorizationData'));
	public CustomDate = this.authData.customDateFormat;

	ngOnInit() {
		this.profileService.GetEmployeeProfileInformation().subscribe(x => {
			this.EmpDOB = new Date(x.DOB);

			this.ProfileInfoForm.controls.DOB.setValue(new Date(x.DOB));


			this.ProfileInfoForm.controls.Address.setValue(x.Address);
			this.ProfileInfoForm.controls.ContactAddress.setValue(
				x.ContactAddress
			);
			this.ProfileInfoForm.controls.Email.setValue(x.Email);
			this.ProfileInfoForm.controls.NRC.setValue(x.Nrcno);
			this.ProfileInfoForm.controls.Nationality.setValue(x.Nationality);
			this.ProfileInfoForm.controls.Phone.setValue(x.Phone);

		});

		this.saveBtn = true;
		this.newBtn = true;
		this.updateBtn = false;

		document.querySelectorAll('.dropdown-toggle, .dropdown-menu').forEach((el)=> {
			el.classList.remove('show');
		});
	}

	SaveInfo(data) {

		data.DOB = Globalfunction.DateTimeToDateOnlyUTC(data.DOB);
		this.profileService.SaveProfile(data).subscribe(x => {
			this.showMessage(x);
		});
	}

	showMessage(message) {
		if(message.toLowerCase().indexOf('successfully') >= 0) {
			this.modalDialogService.confirm('', 'Your personal information has been ' + message, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
		}
		else if (message === 'Restricted') {
			this.modalDialogService.confirm('', message + ' personal information', 'Ok', '', 'text-warning', 'icon-warning', 'Sorry!');
		}
		else {
			this.modalDialogService.confirm('', message, 'Ok', '', 'text-warning', 'icon-warning', 'Sorry!');
		}
	}

	// Validates numbers
	public numberValidator(num): any {
		if (num.pristine) {
			return null;
		}

		const numberRegexp = /^-?[\d.]+(?:e-?\d+)?$/;

		num.markAsTouched();
		if (numberRegexp.test(num.value)) {
			return null;
		}
		return {
			invalidNumber: true
		};
	}

	// //Validate NRC
	public nrcValidator(
		control: AbstractControl
	): { [key: string]: any } | null {
		const nrc: string = control.value;
		const pattern = /^-?[\d]{2}[\/][A-Z]{3}[\(N)][\d]{6}$/;
		if (pattern.test(nrc)) {
			return null;
		} else {
			return { nrcValidate: true };
		}
	}
}
