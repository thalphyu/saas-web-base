import { ModalDialogService } from '../../core/services/dialog.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { ApplicationOptionService } from '../../core/services/application-option.service';
import { StockCustomField } from '../../core/models/stock-customfield.model';
import { Globalfunction } from '../../core/global/globalfunction';
import { DialogService } from '@progress/kendo-angular-dialog';
@Component({
    selector: 'app-application-option',
    templateUrl: './application-option.component.html',
    styleUrls: ['./application-option.component.scss']
})
export class ApplicationOptionComponent implements OnInit {


    PageSizes = [5, 10, 20, 40];
    public isNew: boolean;
    public formGroup: FormGroup;
    public view: Observable<GridDataResult>;
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 5
    };

    editedRowIndex: any;
    public globalfunction: Globalfunction;
    applicationList: any;
    save: any;
    message: any;
    flag: boolean;
    options;

    constructor(
        public fb: FormBuilder,
        private applicationOptionService: ApplicationOptionService,
        private dialogService: DialogService,
        private modalDialogService: ModalDialogService) {
        this.view = applicationOptionService;
        this.globalfunction = new Globalfunction(this.dialogService);
    }

    applicationOptionForm = this.fb.group({
        DateFormat: [''],
        FirstDay: [1],
        TimeValue: ['1'],
        TimeFormat: [''],
        GridPagingsize: [10, Validators.pattern('^[1-9][0-9]?$|^100$')],
        AllowLoginFailureCount: [0, Validators.required],
        AccessNewEmployeeToAllUserlevel: [false]



    });

    ngOnInit() {
        this.applicationOptionService.getApplicationOption().subscribe(x => {

            this.applicationOptionForm.controls.DateFormat.setValue(x.data.DateFormat);
            this.applicationOptionForm.controls.FirstDay.setValue(x.data.FirstDay);

            this.applicationOptionForm.controls.TimeFormat.setValue(x.data.TimeFormat);
            this.applicationOptionForm.controls.GridPagingsize.setValue(x.data.GridPagingsize);
            if (x.data.AllowLoginFailureCount !== 'null')
                {this.applicationOptionForm.controls.AllowLoginFailureCount.setValue(x.data.AllowLoginFailureCount);}
            if (this.applicationOptionForm.value.TimeFormat === 'hh:mm a')
                {this.applicationOptionForm.controls.TimeValue.setValue('1');}
            else
                {this.applicationOptionForm.controls.TimeValue.setValue('0');}

            this.applicationOptionForm.controls.AccessNewEmployeeToAllUserlevel.setValue(x.data.AccessNewEmployeeToAllUserlevel);

            this.applicationOptionForm.controls.AccessNewEmployeeToAllUserlevel.setValue(this.applicationOptionForm.value.AccessNewEmployeeToAllUserlevel);

            this.applicationOptionForm.controls.FirstDay.setValue(this.applicationOptionForm.value.FirstDay);
        });

    }

    public log(eventArgs: any): void {
        console.log(eventArgs);

    }

    SaveSetting() {



        if (this.applicationOptionForm.value.TimeValue === '1')
            {this.applicationOptionForm.controls.TimeFormat.setValue('hh:mm a');}
        else
            {this.applicationOptionForm.controls.TimeValue.setValue('HH:mm');}

        if (this.applicationOptionForm.value.AccessNewEmployeeToAllUserlevel === true)
            {this.applicationOptionForm.controls.AccessNewEmployeeToAllUserlevel.setValue(true);}
        else
            {this.applicationOptionForm.controls.AccessNewEmployeeToAllUserlevel.setValue(false);}










        this.applicationOptionService.SaveApplicationOption(this.applicationOptionForm.value).subscribe(x => {
            this.message = x;
            //this.globalfunction.messageDialogBox(x, 'Save Application Option');
            /*this.modalDialogService.confirm('Save Application Option', x, 'Ok', '');*/
            this.showMessage(x);
            this.applicationOptionForm.reset();
            this.ngOnInit();
        });
    }

    showMessage(message) {
		if(message.toLowerCase().indexOf('successfully') >= 0) {
			this.modalDialogService.confirm('', 'Application option has been ' + message, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');

		}
		else {
			this.modalDialogService.confirm('', message, 'Ok', '', 'text-warning', 'icon-warning', 'Sorry!');
		}
	}


    timecheckChange(value) {
        if (value === 1)
            {this.applicationOptionForm.controls.TimeFormat.setValue('hh:mm a');}
        else
            {this.applicationOptionForm.controls.TimeFormat.setValue('HH:mm');}
    }

    textChangeValidation(name, val) {
        const value = val.target.value;
        if (value) {
            const reg = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g;
            if (!reg.test(value)) {
                 if (name === 'AllowLoginFailureCount') {
                    this.applicationOptionForm.controls.AllowLoginFailureCount.setValue(5);
                }
                else {this.applicationOptionForm.controls.GridPagingsize.setValue(10);}
            }
            else if (name === 'AllowLoginFailureCount' && parseInt(value, 10) <= 5) {
                this.applicationOptionForm.controls.AllowLoginFailureCount.setValue(5);
            }


        }

        else {
            if (name === 'AllowLoginFailureCount') {
                this.applicationOptionForm.controls.AllowLoginFailureCount.setValue(5);
            }

            else {this.applicationOptionForm.controls.GridPagingsize.setValue(10);}
        }

    }

}
