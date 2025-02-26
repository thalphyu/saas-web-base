import { ModalDialogService } from './../../core/services/dialog.service';
import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { distinct, State } from '@progress/kendo-data-query';
import { EventViewerService } from '../../core/services/event-viewer.service';
import { formatDate } from '@angular/common';
import { EmployeeSetupService } from '../../core/services/employee-setup.service';
import { GridDataResult, RowArgs, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { aggregateBy, DataSourceRequestState } from '@progress/kendo-data-query';
import { ApplicationOptionService } from '../../core/services/application-option.service';
import { Globals } from '../../globals';
import { Globalfunction } from '../../../app/core/global/globalfunction';

@Component({
	selector: 'app-event-viewer',
	templateUrl: './event-viewer.component.html',
	styleUrls: ['./event-viewer.component.scss']
})

export class EventViewerComponent implements OnInit {
	public gridState: DataSourceRequestState = {
		sort: [],
		skip: 0,
		take: 40,
		filter: { logic: 'or', filters: [] },
	};
	globals: Globals;


	EventViewerForm = this.fb.group({
		Period: [7],
		Fromdate: [new Date()],
		Todate: [new Date()],
		Employee: [''],
		Source: [''],
		EmployeeID: [0]
		// gridState: [],
	});

	public CustomDate;
	public periodList: Array<{ PeroidName: string; PeriodValue: number }> = [
		{ PeroidName: 'Today', PeriodValue: 0 },
		{ PeroidName: 'This Week', PeriodValue: 1 },
		{ PeroidName: 'This Month', PeriodValue: 2 },
		{ PeroidName: 'This Year', PeriodValue: 3 },
		{ PeroidName: 'Last Week', PeriodValue: 4 },
		{ PeroidName: 'Last Month', PeriodValue: 5 },
		{ PeroidName: 'Last Year', PeriodValue: 6 },
		{ PeroidName: 'Custom', PeriodValue: 7 },

	];
	/*
	public LogType: Array<{ LogTypeName: string, TypeValue: number }> = [
		{ LogTypeName: "Info", TypeValue: 0 },
		{ LogTypeName: "Warning", TypeValue: 1 },
		{ LogTypeName: "Insert", TypeValue: 3 },
		{ LogTypeName: "Error ", TypeValue: 2 },
		{ LogTypeName: "Update", TypeValue: 4 },
		{ LogTypeName: "Delete ", TypeValue: 5 },
	];*/ //OnTypeChange &LogType comment for html

	//add  LogTypeList for checkbox filter
	public LogTypelist = [{ id: 0, value: 'Information' }, { id: 1, value: 'Warning' }, { id: 2, value: 'Error' }, { id: 3, value: 'Insert' }, { id: 4, value: 'Update' }, { id: 5, value: 'Delete' }];

	public Sourcedata: Array<{ MenuName: string; MenuId: number }>;
	SourceList: any;
	//GridData: any;
	view: any;
	selectEmp: any;
	selectEmpID: any;
	allCount: any;
	gridData: any[];
	Excel_column = [];
	constructor(public fb: FormBuilder,
		globals: Globals,
		private eventViewerService: EventViewerService,
		private employeeService: EmployeeSetupService,
		private applicationOptionService: ApplicationOptionService,
		private modalDialogService: ModalDialogService,
		@Inject(LOCALE_ID) private locale: string) {
		this.globals = globals;
		this.view = eventViewerService;
	}

	ngOnInit() {


		this.applicationOptionService.getApplicationOption().subscribe(result => {
			const GridPagingsize = parseInt(result.data.GridPagingsize, 10);
			this.CustomDate = result.data.DateFormat;
			if (GridPagingsize != null) {
				this.gridState.take = GridPagingsize;
			} else {
				this.gridState.take = 40;
			}
		});

		this.eventViewerService.getFormList().subscribe(x => {
			this.SourceList = x;
			this.Sourcedata = this.SourceList.slice();
		});

	}

	public dataStateChange(state: DataStateChangeEvent): void {
		this.gridState = state;
		this.eventViewerService.query(this.gridState, this.EventViewerForm.value);
	}
	isShowUploadFilter = false;

	public openFilterByEmployeePopUp() {  // FilterbyEmployeeID
		localStorage.removeItem('FilterEmployeeID');
		this.isShowUploadFilter = true;
	}

	public closeFilterByEmployeePopUp() {
		localStorage.removeItem('FilterEmployeeID');
		this.isShowUploadFilter = false;
	}

	public select() {
		const id = localStorage.getItem('FilterEmployeeID');
		if (id != null) {
			this.EventViewerForm.value.Employee = id;
			this.GetEmployeeById(id);
		}
		this.isShowUploadFilter = false;
	}

	public GetEmployeeById(id) {
		this.employeeService.getEmployeeByID(id).subscribe(result => {
			this.selectEmpID = result[0].EmployeeID;
			this.selectEmp = result[0].EmployeeName;
			this.EventViewerForm.controls.Employee.reset(this.selectEmp);
			this.EventViewerForm.controls.EmployeeID.reset(this.selectEmpID);
		});
	}

	public preview() {


		this.EventViewerForm.value.Fromdate = Globalfunction.DateTimeToDateOnlyUTC(this.EventViewerForm.value.Fromdate);
		this.EventViewerForm.value.Todate = Globalfunction.DateTimeToDateOnlyUTC(this.EventViewerForm.value.Todate);

		if (this.EventViewerForm.value.Employee === '') {
			this.EventViewerForm.value.EmployeeID = 0;
		}

		if (this.EventViewerForm.value.Source === 'All Source Form ...') {
			this.EventViewerForm.controls.Source.setValue('');
		}

		this.eventViewerService.query(this.gridState, this.EventViewerForm.value);

	}

	public changeperiod(PeriodValue: any) {

		const Today = new Date();
		if (PeriodValue === 0) {
			this.EventViewerForm.controls.Fromdate.reset(Today);
			this.EventViewerForm.controls.Todate.reset(Today);

		}

		else if (PeriodValue === 1) {
			const startOfWeek = require('date-fns/start_of_week');
			const result1 = startOfWeek(Today);
			this.EventViewerForm.controls.Fromdate.reset(result1);

			const endOfWeek = require('date-fns/end_of_week');
			const result2 = endOfWeek(Today);
			this.EventViewerForm.controls.Todate.reset(result2);


		}

		else if (PeriodValue === 2) {
			const startOfMonth = require('date-fns/start_of_month');
			const result1 = startOfMonth(Today);
			this.EventViewerForm.controls.Fromdate.reset(result1);

			const endOfMonth = require('date-fns/end_of_month');
			const result2 = endOfMonth(Today);
			this.EventViewerForm.controls.Todate.reset(result2);

		}

		else if (PeriodValue === 3) {
			const startOfYear = require('date-fns/start_of_year');
			const result1 = startOfYear(Today);
			this.EventViewerForm.controls.Fromdate.reset(result1);

			const endOfYear = require('date-fns/end_of_year');
			const result2 = endOfYear(Today);
			this.EventViewerForm.controls.Todate.reset(result2);



		}

		else if (PeriodValue === 4) {
			const startOfWeek = require('date-fns/start_of_week');
			const subDays = require('date-fns/sub_days');
			const result1 = startOfWeek(Today);
			const i = subDays(result1, 1);
			this.EventViewerForm.controls.Todate.reset(i);
			const result = startOfWeek(result1 - 1);
			this.EventViewerForm.controls.Fromdate.reset(result);


		}

		else if (PeriodValue === 5) {
			const startOfMonth = require('date-fns/start_of_month');
			const result2 = startOfMonth(Today);
			const subMonths = require('date-fns/sub_months');
			const result1 = subMonths(result2, 1);
			const endOfMonth = require('date-fns/end_of_month');
			const result3 = endOfMonth(result1);
			this.EventViewerForm.controls.Todate.reset(result3);
			this.EventViewerForm.controls.Fromdate.reset(result1);


		}

		else if (PeriodValue === 6) {
			const startOfYear = require('date-fns/start_of_year');
			const result2 = startOfYear(Today);
			const subYears = require('date-fns/sub_years');
			const result1 = subYears(result2, 1);
			const EndOfYear = require('date-fns/end_of_year');
			const result3 = EndOfYear(result1);
			this.EventViewerForm.controls.Todate.reset(result3);
			this.EventViewerForm.controls.Fromdate.reset(result1);


		}

		else if (PeriodValue === 7) {
			this.EventViewerForm.controls.Fromdate.reset(Today);
			this.EventViewerForm.controls.Todate.reset(Today);



		}
	}

	handleFilter(value) {
		this.SourceList = this.Sourcedata.filter((s) => s.MenuName.toLowerCase().indexOf(value.toLowerCase()) !== -1);
	}

	public distinctPrimitive(fieldName: string): any {
		if (this.gridData !== undefined) {
			const aa = distinct(this.gridData, fieldName).map(
				item => item[fieldName]
			);
			const result = aa.filter((el) =>el !== '');
			return result;
		}
	}

}
