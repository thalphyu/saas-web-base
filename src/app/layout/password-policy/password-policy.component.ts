import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl, FormBuilder } from '@angular/forms';
import { PasswordPolicyService } from '../../core/services/password-policy.service';
import { ModalDialogService } from '../../core/services/dialog.service';

@Component({
	selector: 'app-password-policy',
	templateUrl: './password-policy.component.html',
	styleUrls: ['./password-policy.component.scss']
})

export class PasswordPolicyComponent implements OnInit {
	public approve = false;
	PasswordForm: FormGroup = new FormGroup({
		uppercase: new FormControl(0),
		lowercase: new FormControl(0),
		numericvalue: new FormControl(0),
		specialcharacter: new FormControl(0),
		passwordexpire: new FormControl(0),
		expiredays: new FormControl(0),

	});
	test: any;
	constructor( public fb: FormBuilder,
		private passwordPolicyService: PasswordPolicyService,
		private modalDialogService: ModalDialogService,) { }

	ngOnInit() {
		this.passwordPolicyService.GetPasswordPolicy().subscribe(x => {
			this.test=x;
			this.PasswordForm.controls.uppercase.reset(this.test[0].upppercase);
			this.PasswordForm.controls.lowercase.reset(this.test[0].lowercase);
			this.PasswordForm.controls.numericvalue.reset(this.test[0].numericvalue);
			this.PasswordForm.controls.specialcharacter.reset(this.test[0].specialcharacter);
			this.PasswordForm.controls.passwordexpire.reset(this.test[0].passwordexpire);
			this.PasswordForm.controls.expiredays.reset(this.test[0].expiredays);

		});
	}

	UpdatePassword(){
		this.passwordPolicyService.UpdatePasswordPolicy(this.PasswordForm.value).subscribe(x => {
			/*this.modalDialogService.confirm('', 'Password Policy '+ x, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
			this.close_popupApprove();*/
			this.showMessage(x);
		});
	}

	showMessage(message) {
		if(message.toLowerCase().indexOf('successfully') >= 0) {
			this.modalDialogService.confirm('', 'Password Policy has been ' + message, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');

		}
		else {
			this.modalDialogService.confirm('', message, 'Ok', '', 'text-warning', 'icon-warning', 'Sorry!');
		}
	}
	public close_popupApprove() {
		this.approve = false;
	}

}
