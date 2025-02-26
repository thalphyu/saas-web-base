import { ModalDialogService } from './../core/services/dialog.service';
import { Component, OnInit, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { Location, PathLocationStrategy, LocationStrategy } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../router.animations';
import { Errors, UserService, UnlockService, LocalStorageService } from '../core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Globalfunction } from '../core/global/globalfunction';
import { DialogService } from '../../../node_modules/@progress/kendo-angular-dialog';
import { from } from 'rxjs';
import { Globals } from '../globals';
let customerurl = '';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	//animations: [routerTransition()],  //it is not working after upgrade
	providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
})

export class LoginComponent implements OnInit {
	globals: Globals;
	private native: any;
	public globalFunction: Globalfunction;
	signInType: number;
	isValid: boolean;
	loginName: any;
	loginEmployeeCode: any;
	email: any;
	loginEmail: any;
	checkValue: any;
	emailResponse: boolean;
	smsResponse: boolean;
	otpcode_button = false;
	checkuniquekey = false;
	generateotp_button = false;
	loginUniqueKey: any;
	checkUniKey: string;
	customerlogo: string;
	logo_default = false;
	prefix_char: any;
	constructor(
		private elementRef: ElementRef,
		private renderer: Renderer2,
		private route: ActivatedRoute,
		private location: Location,
		private router: Router,
		private userService: UserService,
		private unlockService: UnlockService,
		public fb: FormBuilder,
		private dialogService: DialogService,
		private modalDialogService: ModalDialogService,
		private localStorageService: LocalStorageService,
		globals: Globals
	) {
		this.globals = globals;
		this.globalFunction = new Globalfunction(dialogService);
		this.location = location;
		this.native = elementRef.nativeElement;
	}

	_disableLoginBtn = true;
	authType = '';
	title = '';
	errors = '';
	isSubmitting = false;
	authForm: FormGroup;
	loginData: any = {};
	pwdShow = false;
	forgotpassword = false;
	renewpassword = false;
	checkEmailandSMS = false;
	failotpretrybutton = false;
	ConfirmEmail = this.fb.group({
		UserName: [''],
		EmployeeCode: [''],
		Email: [''],
		Phone: [''],
		otpcode: [''],
		new_password: [''],
		comfirm_password: [''],
		check_value: [null],
		EP_value: [''],
		twofactoryOTP: [''],
		prefix_char: []
	});

	ngOnInit() {
		//customerurl = this.route.snapshot.paramMap.get('Customer');
		customerurl = window.location.pathname;
		//const url = customerurl.replace("/", "");
		const tmpurl = customerurl.split('/');
		const url = tmpurl[tmpurl.length - 1];
		//localStorage.setItem("customerurl", url);
		this.localStorageService.setItemString('customerurl', url);
		this.userService
		.validateType()
		.subscribe(
			data => {
				this.signInType = parseInt(data[0].SignIn, 10);
				this.customerlogo = data[0].CustomerLogo;
				this.logo_default = false;
				if (this.customerlogo === undefined) {
					this.customerlogo = '';
				}
				if (this.customerlogo !== '') {
					this.logo_default = true;
				}

				localStorage.setItem('signInType', data[0].SignIn);
				this.isValid = true;

				if (data[0] === 'invalid customer')
					{this.isValid = false;}

			},
			err => {
				this.isValid = false;
			}
		);

		this.route.url.subscribe(data => {
			// Get the last piece of the URL (it's either 'login' or 'register')
			// this.authType = data[data.length - 1].path;
			// Set a title for the page accordingly
			this.title = (this.authType === 'login') ? 'Sign in' : 'Sign up';
			// add form control for username if this is the register page
			if (this.authType === 'register') {
				this.authForm.addControl('username', new FormControl());
			}
		});

		const check = localStorage.getItem('check_rem_password');
		if (check === 'true') {
			this.loginData.remember = true;
			const oldData = localStorage.getItem('rem_pasw');
			if(oldData != null)
			{
				const oldlogindata = JSON.parse(oldData);
				this.loginData.idnumber = oldlogindata.IDnumber;
				this.loginData.username = oldlogindata.username;
				this.loginData.loginemail = oldlogindata.loginemail;
				this.loginData.password = this.globalFunction.encryptDataClient(oldlogindata.password);
				this.loginData.Uniquekey = oldlogindata.Uniquekey;

				const enRef = this.globalFunction.encryptDataClient(JSON.stringify(this.loginData));
				localStorage.setItem('refToken', enRef);
				//localStorage.removeItem('rem_pasw');
				this.loginData.password = oldlogindata.password;
			}
			else{
				const authData = JSON.parse(this.globalFunction.decryptDataClient(localStorage.getItem('refToken')));
				this.loginData.idnumber = authData.IDnumber;
				this.loginData.username = authData.username;
				this.loginData.loginemail = authData.loginemail;
				this.loginData.password = this.globalFunction.decryptDataClient(authData.password);
				this.loginData.Uniquekey = authData.Uniquekey;
			}
		}
		else {
			this.loginData.remember = false;
		}

		if( localStorage.getItem('skin-color') === 'dark' )
			{this.renderer.setAttribute( this.native.parentElement.parentElement, 'body-theme', localStorage.getItem('skin-color') );}
		else
			{this.renderer.removeAttribute( this.native.parentElement.parentElement, 'body-theme' );}

	}

	public showPassword() {
		this.pwdShow = !this.pwdShow;
	}

	onLoggedin() {
		const customerURL = window.location.pathname;
		const tmpurl = customerURL.split('/');
		 customerurl = tmpurl[tmpurl.length - 1];
		//customerurl = customerURL.replace("/", "");
		this.localStorageService.setItemString('customerurl', customerurl);
		//this.localStorageService.
		this.isSubmitting = true;
		this.errors = '';
		if (this.signInType === 0 && (this.loginData.username === undefined || this.loginData.username === '' || this.loginData.password === undefined || this.loginData.password === '')) {
			if (this.loginData.username === undefined) {
				this.loginData.username = '';
			}
			if (this.loginData.password === undefined) {
				this.loginData.password = '';
			}
		}
		else if (this.signInType === 1 && (this.loginData.idnumber === undefined || this.loginData.idnumber === '' || this.loginData.username === undefined || this.loginData.username === ''
		|| this.loginData.password === undefined || this.loginData.password === '')) {
			if (this.loginData.idnumber === undefined) {
				this.loginData.idnumber = '';
			}
			if (this.loginData.username === undefined) {
				this.loginData.username = '';
			}
			if (this.loginData.password === undefined) {
				this.loginData.password = '';
			}
		}
		else if (this.signInType === 2 && (this.loginData.loginemail === undefined || this.loginData.loginemail === '' || this.loginData.password === undefined || this.loginData.password === '')) {
			if (this.loginData.loginemail === undefined) {
				this.loginData.loginemail = '';
			}
			if (this.loginData.password === undefined) {
				this.loginData.password = '';
			}
		}
		else if (this.signInType === 3 && (this.loginData.idnumber === undefined || this.loginData.idnumber === '' || this.loginData.password === undefined || this.loginData.password === '')) {
			if (this.loginData.idnumber === undefined) {
				this.loginData.idnumber = '';
			}
			if (this.loginData.password === undefined) {
				this.loginData.password = '';
			}
		}
		else {
			const rem_data = {
				IDnumber: this.loginData.idnumber, username: this.loginData.username, loginemail: this.loginData.loginemail,
				password: this.globalFunction.encryptDataClient(this.loginData.password), Uniquekey: this.loginData.Uniquekey
			};
			const check = localStorage.getItem('check_rem_password');
			if (check === 'true') {
				const oldData = localStorage.getItem('rem_pasw');
				if(oldData != null)
				{
					localStorage.removeItem('rem_pasw');
				}
				const enRef = this.globalFunction.encryptDataClient(JSON.stringify(rem_data));
				localStorage.setItem('refToken', enRef);
			}
			else {
				this.localStorageService.removeItem('refToken');
			}

			const Key = this.localStorageService.getItem('Uniquevalue');
			if (Key != null) {
				const tmpkey = Key.split('"');
				this.checkUniKey = tmpkey[tmpkey.length - 2];
			}

			if (this.loginData.Uniquekey === undefined || this.checkUniKey !== '') {
				this.loginData.Uniquekey = this.checkUniKey;
			}
			const credentials = this.loginData; // this.authForm.value;

			//forget password loging
			this.userService
			.attemptAuth(this.authType, credentials, customerurl)
			.subscribe(
				data => {
					if (data.AuthOTP_status === 0) {
						this.checkuniquekey = true;
						this.otpcode_button = false;
						this.generateotp_button = false;
						this.checkEmailandSMS = false;
						this.forgotpassword = true;
						this.renewpassword = false;
						this.unlockService.sendTwoFactorOTP().subscribe(x => {
							const message = x.data.Message;
							if (x.data) {
								if (message === 'You takes too long resend code, please try again after 24 hrs') {
									this.modalDialogService.confirm('Generate OTP', `${message} .`, 'Ok', '');
									this.checkuniquekey = true;
								}
								else if (message.toLowerCase().indexOf('successfully') >= 0) {
									this.modalDialogService.confirm('Generate OTP', `${message} .`, 'Ok', '');
									this.checkuniquekey = true;
									this.otpcode_button = false;
									this.generateotp_button = false;
									this.prefix_char = x.data.prefix_char;
									this.ConfirmEmail.controls.prefix_char.setValue(this.prefix_char);

								}
								else {
									this.modalDialogService.confirm('Error !', `${message} .`, 'Ok', '');
								}

							} else {
								this.modalDialogService.confirm('Error !', `Oop ! Try again ,please .`, 'Ok', '');
							}
						});
					}
					else {
						if (data.RequirePasswordChange === false) {
							this.userService.getUserMenu().subscribe(
								res => {
									this.userService.SaveWebLastLogin().subscribe(data1 =>{
										if(data1 === 1) {this.router.navigateByUrl('/');}
									});
								}
							);
						}
						else {
							this.router.navigateByUrl('/changepassword');
						}
					}
				},
				err => {
					this.errors = err.error_description;
					this.router.navigate(['/login']);
					this.isSubmitting = false;
				}
			);
		}
	}

	forgetPassword() {
		this.loginData.Email = '';
		this.loginName = this.loginData.username;
		this.ConfirmEmail.controls.EmployeeCode.setValue(this.loginData.idnumber);
		if (this.loginData.idnumber !== null && this.loginData.idnumber !== '') {
			this.forgotpassword = true;
			this.checkEmailandSMS = true;
			const loginType = 1;
			this.unlockService.checkEmailandSmsbyUser().subscribe(x => {
				this.emailResponse = x.emailResponse;
				this.smsResponse = x.smsResponse;
			});
		}
		else {
			this.forgotpassword = false;
			this.modalDialogService.confirm('Forgot Password', 'Please enter your ID Number to reset a forgotten password.', 'Ok', '');
		}
	}

	backToLogin() {
		this.checkEmailandSMS = false;
		this.forgotpassword = false;
	}

	showMessage(message) {
		if (message.toLowerCase().indexOf('successfully') >= 0) {
		  this.modalDialogService.confirm('',  message, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');

			} else {
		  this.modalDialogService.confirm('', message, 'Ok', '', 'text-warning', 'icon-warning', 'Sorry!');
		}
	}

	confirmEmail() {
		this.checkValue = 1;
		this.loginEmail = this.loginData.email;
		// this.ConfirmEmail.value.UserName = this.loginName;
		this.ConfirmEmail.value.EmployeeCode = this.loginEmployeeCode;
		this.ConfirmEmail.value.Email = this.loginEmail;
		// const email = this.ConfirmEmail.value.Email;
		this.ConfirmEmail.controls.check_value.setValue(this.checkValue);
		if (this.ConfirmEmail.value.EmployeeCode != null && this.ConfirmEmail.value.Email != null) {
			this.unlockService.forgetPassword(this.ConfirmEmail.value)
				.subscribe(x => {
					this.showMessage(x);
				});
		}
		else {
			this.forgotpassword = true;
			this.modalDialogService.confirm('Forget Password', 'Please enter Email Address.', 'Ok', '');
		}
	}

	generateotp() {  // forgetpassword --> check gmail or phone And get OTP
		if (this.loginData.Email === undefined || this.loginData.Email === '') {
			if (this.loginData.Email === undefined) {
				this.loginData.Email = '';
			}
		}

		if (this.emailResponse === true && this.smsResponse === false) {
			this.ConfirmEmail.controls.EP_value.setValue(this.loginData.Email);
			this.checkValue = 1;
			this.ConfirmEmail.controls.check_value.setValue(this.checkValue);
		}
		else if (this.smsResponse === true && this.emailResponse === false) {
			this.ConfirmEmail.controls.EP_value.setValue(this.loginData.Phone);
			this.checkValue = 2;
			this.ConfirmEmail.controls.check_value.setValue(this.checkValue);
		}
		else if (this.smsResponse === true && this.emailResponse === true) {
			if (this.loginData.EP_value.match('@'))
				{this.checkValue = 1;}
			else
				{this.checkValue = 2;}

			this.ConfirmEmail.controls.EP_value.setValue(this.loginData.EP_value);
			this.ConfirmEmail.controls.check_value.setValue(this.checkValue);
		}

		if (this.loginData.idnumber !== null && this.loginData.Email !== '') {
			this.unlockService.generatOTP(this.ConfirmEmail.value).subscribe(x => {
				if (x) {
					const message = x.Message;
					if (message === 'You have been reached max OTP code, please try again after 24 hrs') {
						this.modalDialogService.confirm('',  message, 'Ok', '', 'text-warning', 'icon-warning', 'Oops!');
					}
					else if (message.toLowerCase().indexOf('successfully') >= 0) {
						this.modalDialogService.confirm('', 'OTP has been ' + message, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
						this.checkEmailandSMS = false;
						this.renewpassword = true;
						this.loginData.prefix_char = x.prefix_char;
						this.ConfirmEmail.controls.prefix_char.setValue(this.loginData.prefix_char);
					}
					else {
						this.modalDialogService.confirm('', message, 'Ok', '', 'text-warning', 'icon-warning', 'Sorry!');
					}
				}
				else {
					this.modalDialogService.confirm('', x.error, 'Ok', '', 'text-warning', 'icon-warning', 'Sorry!');
				}
			});
		}
		else {
			this.checkEmailandSMS = true;
			this.forgotpassword = true;
			this.renewpassword = false;
			//this.modalDialogService.confirm('Forget Password', 'Please enter Phone Number.', 'Ok', '');
		}

		this.ConfirmEmail.get('Email').updateValueAndValidity();
		this.ConfirmEmail.get('Phone').updateValueAndValidity();
	}

	flag: boolean;
	ComfirmOTPandNewPassword() {  // forgetpassword --> comfirm login
		if (this.loginData.new_password !== this.loginData.comfirm_password)
			{this.flag = true;}
		else
			{this.flag = false;}

		this.ConfirmEmail.value.EmployeeCode = this.loginData.idnumber;
		this.ConfirmEmail.value.Email = this.loginData.Email;
		// const email = this.ConfirmEmail.value.Email;
		if (this.ConfirmEmail.value.EmployeeCode !== null && this.ConfirmEmail.value.EP_value !== '') {
			if (this.flag === false) {
				this.ConfirmEmail.value.otpcode = this.loginData.prefix_char + '-' + this.loginData.otpcode;

				this.unlockService.saveNewPasswordAndOTP(this.ConfirmEmail.value).subscribe(x => {
					const response = x.data;
					if (x) {
						const message = x.Message;
						this.checkEmailandSMS = false;
						if (message.toLowerCase().indexOf('successfully') >= 0) {
							this.modalDialogService.confirm('', 'Your password has been changed' + message, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
							//this.forgotpassword = false;
							this.renewpassword = false;
							this.ConfirmEmail.reset();
						}
						else if (message === 'You have been reached maximum allowed OTP fail limit. Please try to request new OTP.') {
							this.modalDialogService.confirm('', message, 'Ok', '', 'text-warning', 'icon-warning', 'Sorry!');
							this.failotpretrybutton = true;
							this.renewpassword = true;
						}
						else {
							this.modalDialogService.confirm('', message, 'Ok', '', 'text-warning', 'icon-warning', 'Sorry!');
							this.renewpassword = true;
						}
					}
					else {
						this.modalDialogService.confirm('', response, 'Ok', '', 'text-warning', 'icon-warning', 'Sorry!');
					}
				});
			}
			else {
				this.flag = true;
			}
		}
		else {
			this.checkEmailandSMS = false;
			this.renewpassword = true;
		}
	}

	failandRetryOTP() {  // forgetpassword --> resendotp (tet button)
		this.unlockService.resendOTP(this.ConfirmEmail.value).subscribe(x => {
			if (x) {
				const message = x.Message;
				if (x.Message === 'OTP Expired ') {
					this.modalDialogService.confirm('', 'Generate OTP has been ' + message, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');

					this.checkEmailandSMS = false;
					this.renewpassword = true;
				}
				else if (x.status === 1) {
					this.modalDialogService.confirm('', 'Generate OTP has been ' + message, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
					this.checkEmailandSMS = false;
					this.renewpassword = true;
					this.prefix_char = x.prefix_char;
					this.ConfirmEmail.controls.prefix_char.setValue(this.prefix_char);
				}
				else {
					this.modalDialogService.confirm('', 'Generate OTP has been ' + message, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
					this.checkEmailandSMS = false;
					this.renewpassword = true;
				}
			}
			else {
				this.modalDialogService.confirm('', 'Oop ! Try again ,please .', 'Ok', '', 'text-warning', 'icon-warning', 'Sorry!');
			}
		});
	}

	public retryOTPCode() { // forgetpassword --> resendotp (button)
		this.ConfirmEmail.value.EmployeeCode = this.loginData.idnumber;
		this.ConfirmEmail.value.Email = this.loginData.Email;

		this.unlockService.resendOTP(this.ConfirmEmail.value).subscribe(x => {
			if (x) {
				const message = x.Message;
				if (x.Message === 'OTP Expired ') {
					this.modalDialogService.confirm('', 'Generate OTP has been ' + message, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
				}
				else if (x.status === 1) {
				this.modalDialogService.confirm('', 'Generate OTP has been ' + message, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
					this.loginData.prefix_char = x.prefix_char;
					this.ConfirmEmail.controls.prefix_char.setValue(this.loginData.prefix_char);
				}
				else {
					this.modalDialogService.confirm('', 'Generate OTP has been ' + message, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
				}
			}
			else {
				this.modalDialogService.confirm('', 'Oop ! Try again ,please .', 'Ok', '', 'text-warning', 'icon-warning', 'Sorry!');
			}
		});
	}

	checkremember(data) {
		if (data === true) {
			localStorage.setItem('check_rem_password', data);
		}
		else
			{localStorage.setItem('check_rem_password', data);}
	}

	public ResendtwoFactory() { // frist login --> resendOTP
		this.renewpassword = false;
		this.forgotpassword = true;
		this.checkEmailandSMS = false;
		this.ConfirmEmail.value.EmployeeCode = this.loginData.idnumber;

		this.unlockService.resendTwoFactorOTP().subscribe(x => {
			const message = x.data.Message;
			if (x.data) {
				if (x.data.status === 0) {
					this.modalDialogService.confirm('OTP Alert !', `${message} .`, 'Ok', '');
				}
				else {
					this.modalDialogService.confirm('OTP Alsert !', `${message} .`, 'Ok', '');
					this.prefix_char = x.data.prefix_char;
					this.ConfirmEmail.controls.prefix_char.setValue(this.prefix_char);
				}
			}
			else {
				this.modalDialogService.confirm('Error !', `${message} .`, 'Ok', '');
			}
		});
	}

	checktwoFactoryOTP() {  //login --> first login
		this.checkEmailandSMS = false;
		this.renewpassword = false;
		this.ConfirmEmail.value.twofactoryOTP = this.loginData.prefix_char + '-' + this.loginData.twofactoryOTP;
		this.unlockService.checktwoFactorOTP(this.ConfirmEmail.value).subscribe(x => {
			if (x) {
				const message = x.Message;
				if (x.status === 0) {
					this.modalDialogService.confirm('', 'OTP has been ' + message, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
					this.checkEmailandSMS = false;
					this.renewpassword = false;
				}
				else {
					this.checkEmailandSMS = false;
					this.renewpassword = false;
					this.checkEmailandSMS = false;
					this.loginData.Uniquekey = x.Uniquekey;
					this.localStorageService.setItemObj('Uniquevalue', x.Uniquekey);

					const credentials = this.loginData; // this.authForm.value;
					this.userService
						.attemptAuth(this.authType, credentials, customerurl)
						.subscribe(
							data => {
								this._disableLoginBtn = true;
								if (data.RequirePasswordChange === false) {
									this.userService.getUserMenu().subscribe(
										res => {
											this.userService.SaveWebLastLogin().subscribe(data1 =>{
												if(data1 === 1) {this.router.navigateByUrl('/');}
											});
										}
									);

								}
								else {
									this.router.navigateByUrl('/changepassword');
								}
								/* this.userService.getUserMenu().subscribe(
									res => this.router.navigateByUrl('/')
								); */
							},
							err => {
								this.errors = err.error_description;
								this.router.navigate(['/login']);
								this.isSubmitting = false;
							}
						);
				}
			}
			else {
				this.modalDialogService.confirm('', 'Your OTP code does not match', 'Ok', '', 'text-warning', 'icon-warning', 'Sorry!');
			}
		});
	}


}
