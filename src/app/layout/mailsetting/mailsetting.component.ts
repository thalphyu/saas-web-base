import { ModalDialogService } from './../../core/services/dialog.service';
import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataTransferService } from '../../core';
import { MailsettingService } from '../../core/services/mailsetting.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-mailsetting',
	templateUrl: './mailsetting.component.html',
	styleUrls: ['./mailsetting.component.scss']
})
export class MailsettingComponent implements OnInit {
	sendmail = false;

	constructor(public fb: FormBuilder,
		private mailsettingService: MailsettingService,
		private dataTransferService: DataTransferService,
		private router: Router,
		@Inject(LOCALE_ID) private locale: string,
		private modalDialogService: ModalDialogService,) { }

	MailSettingForm = this.fb.group({
		SMTPServer: [''],
		SMTPPort: [0, [Validators.min(0)]],
		FromName: [''],
		FromMail: [''],
		AdminMail: [''],
		Password: [''],
		Mail: [''],
		temp_Password: [''],
	});
	MailForm = this.fb.group({
		Mail: ['']
	});
	loading = false;
	ngOnInit() {
		this.mailsettingService.GetMailSetting()
		.subscribe((x) => {
			this.MailSettingForm.controls.SMTPServer.setValue(x[0].SMTPServer);
			this.MailSettingForm.controls.SMTPPort.setValue(x[0].SMTPPort);
			this.MailSettingForm.controls.FromName.setValue(x[0].FromName);
			this.MailSettingForm.controls.FromMail.setValue(x[0].FromMail);
			this.MailSettingForm.controls.AdminMail.setValue(x[0].AdminMail);
			this.MailSettingForm.controls.Password.setValue(x[0].Password);
			this.MailSettingForm.controls.temp_Password.setValue(x[0].Password);
		});
	}

	isShowUpload = false;
	public openTestMailSettingPopUp() {
		this.isShowUpload = true;
	}

	public closeTestMailSettingPopUp() {
		this.isShowUpload = false;
	}

	showMessage(message) {
		if(message.toLowerCase().indexOf('successfully') >= 0) {
			this.modalDialogService.confirm('', 'Mail Setting has been ' + message, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
			this.ngOnInit();
		}
		else {
			this.modalDialogService.confirm('', message, 'Ok', '', 'text-warning', 'icon-warning', 'Sorry!');
		}
	}

	SaveMailSetting() {
		if (this.MailSettingForm.value.temp_Password === this.MailSettingForm.value.Password) {
			this.MailSettingForm.value.temp_Password = this.MailSettingForm.value.temp_Password;
			this.MailSettingForm.controls.Password.setValue(null);
		}

		this.mailsettingService.SaveMailSetting(this.MailSettingForm.value)
		.subscribe((x) => {
			this.showMessage(x);
		});
	}

	testMailSetting() {
		// if (this.MailSettingForm.value.temp_Password == this.MailSettingForm.value.Password) {
		//   this.MailSettingForm.value.temp_Password = this.MailSettingForm.value.temp_Password;
		//   this.MailSettingForm.controls.Password.setValue(null);
		// }
		this.MailSettingForm.value.Mail = this.MailForm.value.Mail;
		this.mailsettingService.TestMailSetting(this.MailSettingForm.value)
		.subscribe((x) => {
			this.sendmail = false;
			this.isShowUpload = false;
			this.showMessage(x);
		});
	}
}
