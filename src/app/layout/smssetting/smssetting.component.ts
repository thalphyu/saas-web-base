import { ModalDialogService } from './../../core/services/dialog.service';
import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataTransferService } from '../../core';
import { SmssettingService } from '../../core/services/smssetting.service';
import { Router } from '@angular/router';
import { DialogService } from '@progress/kendo-angular-dialog';
import { Globalfunction } from '../../core/global/globalfunction';

@Component({
  selector: 'app-smssetting',
  templateUrl: './smssetting.component.html',
  styleUrls: ['./smssetting.component.scss']
})
export class SmssettingComponent implements OnInit {
  globalfunction: any;
  providerData: any;

  constructor(public fb: FormBuilder,
    private smssettingService: SmssettingService,
    private dataTransferService: DataTransferService,
    private router: Router,
    private dialogService: DialogService,
    private modalDialogService: ModalDialogService,
    @Inject(LOCALE_ID) private locale: string) { this.globalfunction = new Globalfunction(dialogService); }

  SMSSettingForm = this.fb.group({
    accountid: [0],
    providerid: [null, Validators.required],
    clientid: [null, Validators.required],
    clientsecret: [null, Validators.required],
    tokenurl: [],
    redirecturl: [],
    authorizeurl: [],
    sendername: [null, Validators.required],
    username: [],
    password: [],
    tem_clientsecret: [],
    tem_password: [],
    baseurl: [],
    apikey: [],
    tem_apikey: [],
  });

  loading = false;

  ngOnInit() {
    this.GetAllProviderName();
    this.smssettingService.GetSmsSetting()
      .subscribe((x) => {
        if (x.length > 0) {
          this.SMSSettingForm.controls.accountid.setValue(x[0].accountid);
          this.SMSSettingForm.controls.providerid.setValue(x[0].providerid);
          this.SMSSettingForm.controls.clientid.setValue(x[0].clientid);
          this.SMSSettingForm.controls.clientsecret.setValue(x[0].clientsecret);
          this.SMSSettingForm.controls.tokenurl.setValue(x[0].tokenurl);
          this.SMSSettingForm.controls.redirecturl.setValue(x[0].redirecturl);
          this.SMSSettingForm.controls.authorizeurl.setValue(x[0].authorizeurl);
          this.SMSSettingForm.controls.sendername.setValue(x[0].sendername);
          this.SMSSettingForm.controls.username.setValue(x[0].username);
          this.SMSSettingForm.controls.password.setValue(x[0].password);
          this.SMSSettingForm.controls.tem_clientsecret.setValue(x[0].clientsecret);
          this.SMSSettingForm.controls.tem_password.setValue(x[0].password);
          this.SMSSettingForm.controls.baseurl.setValue(x[0].baseurl);
          this.SMSSettingForm.controls.apikey.setValue(x[0].apikey);
          this.SMSSettingForm.controls.tem_apikey.setValue(x[0].apikey);
        }
      });
  }

  GetAllProviderName() {
    this.smssettingService.getAllSMSProvider().subscribe((x) => {
      this.providerData = x;
    });
  }

  SaveSMSSetting() {
    if (this.SMSSettingForm.value.tem_clientsecret === this.SMSSettingForm.value.clientsecret) {
      this.SMSSettingForm.value.tem_clientsecret = this.SMSSettingForm.value.tem_clientsecret;
      this.SMSSettingForm.controls.clientsecret.setValue(null);
    }
    if (this.SMSSettingForm.value.tem_password === this.SMSSettingForm.value.password) {
      this.SMSSettingForm.value.tem_password = this.SMSSettingForm.value.tem_password;
      this.SMSSettingForm.controls.password.setValue(null);
    }
    if (this.SMSSettingForm.value.tem_apikey === this.SMSSettingForm.value.apikey) {
      this.SMSSettingForm.value.tem_apikey = this.SMSSettingForm.value.tem_apikey;
      this.SMSSettingForm.controls.apikey.setValue(null);
    }

    this.smssettingService.SaveSmsSetting(this.SMSSettingForm.value)
      .subscribe((x) => {
        if (x === 'Save Successfully') {
          this.modalDialogService.confirm('', `SMS Setting is save successfully.`, 'Ok', '');
          this.ngOnInit();
        }
        else
          {this.modalDialogService.confirm('', `Save Unsuccessfully !`, 'Ok', '');}
      });
  }

  // <<<<<<  Test Mail /Sms  >>>>>>>
  // isShowUpload = false;
  // public openTestMailSettingPopUp() {
  //   this.isShowUpload = true;
  // }
  // public closeTestMailSettingPopUp() {
  //   this.loading = false;
  //   this.isShowUpload = false;
  // }
  // testMailSetting() {
  //   this.loading = true;
  //   this.MailSettingForm.value.Mail = this.MailForm.value.Mail;
  //   this.mailsettingService.TestMailSetting(this.MailSettingForm.value)
  //     .subscribe((x) => {
  //       this.loading = false;
  //       this.isShowUpload = false;
  //       this.globalfunction.messageDialogBox(x, 'Mail Settings');
  //     });
  // }

}
