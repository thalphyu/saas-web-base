import { ModalDialogService } from '../../core/services/dialog.service';
import { Component, OnInit } from '@angular/core';
import { Router, Event } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidator, UserService } from '../../core';
import { UnlockService } from '../../core/services/unlock.service';
import { Globalfunction } from '../../core/global/globalfunction';
import { ChangePasswordService } from '../../core/services/change-password.service';
@Component({
	selector: 'app-change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
	flag: boolean;
	editForm: FormGroup = new FormGroup({
		CurrentPassword: new FormControl('', { validators: Validators.required }),//, updateOn: 'blur'
		NewPassword: new FormControl('', { validators: Validators.compose([Validators.required, CustomValidator.PasswordValidation])}),//, updateOn: 'blur'
		ConfirmPassword: new FormControl('', { validators: Validators.required })//, updateOn: 'blur'
	},
		(formGroup: FormGroup) => CustomValidator.ConfirmPasswordMatch(formGroup)
	);
	// public authData = JSON.parse(localStorage.getItem('authorizationData'));
	// public minPasswordLength = this.authData.MinPasswordLength;;// localStorage.getItem('MinPasswordLength');
	public globalFunction: Globalfunction;
	allPolicy: any[];
	currentPwd = false;
	newPwd = false;
	confirmPwd = false;
	pwdPolicy = '';
	isbtnShow = true;
	showWithoutPolicy = false;
	constructor(
		private router: Router,
		private modalDialogService: ModalDialogService,
		private changePasswordService: ChangePasswordService,
		private userService: UserService) {
		//this.globalFunction = new Globalfunction(dialogService);
	}
	showmsg = false;
	ngOnInit() {
		this.userService.isRequirePasswordChange().subscribe(data => {
			this.getPasswordPolicy();
			if (data === false) {
				this.showmsg = false;
			} else {
				this.showmsg = true;
			}
		});

		document.querySelectorAll('.dropdown-toggle, .dropdown-menu').forEach((el)=> {
			el.classList.remove('show');
		});
	}

	change() {
		if (this.editForm.controls.NewPassword.value !== this.editForm.controls.ConfirmPassword.value) {
			this.flag = true;
		} else {
			this.flag = false;
		}
		this.changePasswordService.changePassword(this.editForm.value)
			.subscribe(x => {
				if (x === 1) {
					if (this.showmsg === true) {
						this.modalDialogService.confirmRoute('Change Password', `Save Successfully `, 'Ok', '',true);
						// this.modalDialogService.confirm('', 'Change Password has been Saved Successfully ' , 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
					} else {
						this.modalDialogService.confirm('', 'Change Password has been Saved Successfully' , 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
					}
					this.newChangePassword();

				} else if (x === 2) {
				// this.modalDialogService.confirm('Change Password', `Please change password according to password policy `, 'Ok', '');
					this.modalDialogService.confirm('', 'Please change password according to password policy.', 'Ok', '', 'text-info', 'icon-info', 'Invalid Password!');
				} else if (x === 3) {
					// this.modalDialogService.confirm('Change Password', `Current Password and New Password are the same..! According to your security, please choose the different password. `, 'Ok', '');
					this.modalDialogService.confirm('', 'Current Password and New Password are the same..! According to your security, please choose the different password.',
						'Ok', '', 'text-info', 'icon-info', 'Invalid Password!');
				} else {
					// this.modalDialogService.confirm('Change Password', `Wrong Old Password `, 'Ok', '');
					this.modalDialogService.confirm('', 'Wrong Old Password', 'Ok', '', 'text-warning', 'icon-warning', 'Sorry!');
				}
		});
	}

	cancel() {
		if (this.showmsg === false) {
			this.router.navigate(['/dashboard']);
		} else {
			this.router.navigate(['/login']);
		}
	}

	newChangePassword() {
		this.editForm.controls.NewPassword.reset(null);
		this.editForm.controls.CurrentPassword.reset(null);
		this.editForm.controls.ConfirmPassword.reset(null);
	}

	getPasswordPolicy() {
		this.changePasswordService.getPasswordPolicy().subscribe(x => {
			this.allPolicy = x;
			if (this.allPolicy.length > 0) {
				this.showWithoutPolicy = false;
				// tslint:disable-next-line:max-line-length
				if ((this.allPolicy[0].upppercase !== '' && this.allPolicy[0].lowercase !== '' && this.allPolicy[0].numericvalue !== '' && this.allPolicy[0].specialchracter !== '')) {
					// tslint:disable-next-line:max-line-length
					this.pwdPolicy = this.allPolicy[0].upppercase + '' + this.allPolicy[0].lowercase + '' + this.allPolicy[0].numericvalue + '' + this.allPolicy[0].specialchracter ;
				} else {
					this.pwdPolicy = '';
				}
			} else {

				this.showWithoutPolicy = true;
			}
			localStorage.setItem('PasswordPolicy', this.pwdPolicy);

		});
	}

	public showPassword(pwdType) {
		if(pwdType === 'currentPwd')
			{this.currentPwd = !this.currentPwd;}
		else if(pwdType === 'newPwd')
			{this.newPwd = !this.newPwd;}
		else if(pwdType === 'confirmPwd')
			{this.confirmPwd = !this.confirmPwd;}
	}

	public checkValid() {
		if ((this.editForm.controls.NewPassword.valid && this.editForm.controls.ConfirmPassword.valid && this.editForm.controls.CurrentPassword.valid)
			&& (this.editForm.controls.CurrentPassword.value !== this.editForm.controls.NewPassword.value)) {
			this.isbtnShow = false;
		}
		else {
			this.isbtnShow = true;
		}
	}
}

