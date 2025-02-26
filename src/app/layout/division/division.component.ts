import { ModalDialogService } from '../../core/services/dialog.service';
import { Component, OnInit } from '@angular/core';
import { DivisionService } from '../../core/services/division.service';
import { FormBuilder } from '@angular/forms';
import { DataTransferService } from '../../core/services/data-transfer.service';
import { FormGroup, FormControl, Validators } from '../../../../node_modules/@angular/forms';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid'; /*GridDataResult */
import { Observable } from 'rxjs';
import { State, distinct } from '@progress/kendo-data-query';
import { LocalStorageService } from '../../core/services';
import { Globals } from '../../globals';

@Component({
	selector: 'app-division',
	templateUrl: './division.component.html',
	styleUrls: ['./division.component.scss']
})
export class DivisionComponent implements OnInit {
	globals: Globals;
	public canLoad: boolean;
	public divisionList: any[] = [];
	public divisionSets: any[];
	public maxDivisions = 0;
	isNewDivision: boolean;
	public saveBtn = false;
	public updateBtn = false;
	selected: any;
	gridData: any;
	showNew = false;
	inactivemarked = false;
	loading: boolean;
	additem: boolean;
	edititem: boolean;
	//view: Observable<GridDataResult>;
	public view: any;
	public compbutton = false;
	syncflag = false;
	public authData = JSON.parse(this.localStorageService.getItem('authorizationData'));
	public statuslist = [{ id: 0, value: 'Active' }, { id: 1, value: 'Inactive' }];

	public gridState: State = {
		sort: [],
		skip: 0,
		take: 20,
		filter: { logic: 'and', filters: [] },
	};
	constructor(private localStorageService: LocalStorageService,
		public fb: FormBuilder,
		public divisionservice: DivisionService,
		private dataTransferService: DataTransferService,
		private modalDialogService: ModalDialogService,
		globals: Globals
	) {
		this.globals = globals;
		this.view = this.divisionservice;
	}

	divisionForm = this.fb.group({
		DivisionID: ['0'],
		Division: ['', Validators.required],
		Inactive_Division: [false, Validators.required],
		Is_Default: [false, Validators.required],
	});

	ngOnInit() {
		this.gridState.take = parseInt(this.authData.gridPagingsize, 10);
		this.getAllDivision(this.gridState);
	}

	showMessage(message) {
		if (message.toLowerCase().indexOf('successfully') >= 0) {

			this.modalDialogService.confirm('', 'Your division has been ' + message, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
			this.showNew = false;
			this.getAllDivision(this.gridState);
		}
		else {

			this.modalDialogService.confirm('', message, 'Ok', '', 'text-warning', 'icon-warning', 'Sorry!');
		}
	}

	saveDivision() {
		this.divisionservice.saveDivision(this.divisionForm.value)
			.subscribe(x => {
				this.showMessage(x);
			});
	}

	updateDivision() {
		this.divisionservice.updateDivision(this.divisionForm.value)
			.subscribe(x => {
				this.showMessage(x);
			});
	}

	newDivision() {
		this.compbutton = false;
		this.showNew = true;
		this.additem = true;
		this.edititem = false;
		this.divisionForm.controls.Division.reset('');
		this.divisionForm.controls.Is_Default.reset(false);
		this.divisionForm.controls.Inactive_Division.reset(false);
		this.saveBtn = true;
		this.updateBtn = false;
	}

	showConfirmation(dataItem) {
		const Name = dataItem.Division;
		this.divisionForm.controls.DivisionID.reset(dataItem.DivisionID);
		this.modalDialogService.confirm('', Name + ' will be permanently deleted.', 'Yes, delete it.', 'Cancel', 'text-danger', 'icon-trash', 'Delete Division?')
			.then((confirmed) => {
				if (confirmed === true) {
					this.deleteDivision();
				}
			})
			.catch(() => { });
	}

	deleteDivision() {
		this.divisionservice.deleteDivision(this.divisionForm.value.DivisionID)
			.subscribe((x) => {
				this.showMessage(x);
			});
	}

	// getAllDivision() {
	// 	this.loading = true;
	// 	this.divisionForm.controls.Inactive_Division.setValue(this.inactivemarked);
	// 	this.divisionservice.getDivisionList(this.divisionForm.value)
	// 	.subscribe((x) => {
	// 		this.gridData = x.data;
	// 		this.loading = false;
	// 	});
	// }

	getAllDivision(gridState) {
		this.loading = true;
		this.divisionservice.getDivisionList(gridState);
		this.loading = false;

	}
	public onStateChange(state: DataStateChangeEvent): void {
		this.gridState = state;

		this.getAllDivision(this.gridState);
	}

	public onItemClick(item: any, dataItem: any): void {
		if (item === 'Edit') {
			this.compbutton = true;
			this.saveBtn = false;
			this.updateBtn = true;
			this.showNew = true;
			this.additem = false;
			this.edititem = true;
			this.divisionForm.reset();
			this.divisionForm.controls.DivisionID.reset(dataItem.DivisionID);
			this.divisionForm.controls.Division.reset(dataItem.Division);
			this.divisionForm.controls.Inactive_Division.reset(dataItem.Inactive_Division);
			this.divisionForm.controls.Is_Default.reset(dataItem.Is_Default);
		}
		else if (item === 'Delete') {
			this.showConfirmation(dataItem);
		}
	}

	cancel() {
		this.showNew = false;
	}





	// getMoreDivision() {
	//   if (this.canLoad == true) {
	//     // this.divisionForm.value.Cur_Row = this.divisionForm.value.lRow,
	//     //   this.divisionForm.value.lRow = this.divisionForm.value.lRow + 14;
	//     // this.divisionForm.value.limitRow = 14;
	//     this.divisionservice.getDivisionList(this.divisionForm.value)
	//       .subscribe((x) => {
	//         this.divisionSets = x.data;
	//         this.maxDivisions = x.totalrecord;
	//         this.divisionSets.forEach((group) => {
	//           this.divisionList.push(group);
	//         })
	//         if (this.divisionList.length >= this.maxDivisions) {
	//           this.canLoad = false;
	//         }
	//       })
	//   }
	// }

	// searchDivision() {
	//   this.divisionList = [];
	//   this.canLoad = true;
	//   this.divisionForm.value.Cur_Row = 0;
	//   this.divisionForm.value.lRow = 0;
	//   this.getMoreDivision();
	// }

	// selectedDivision(DivisionID, i) {
	//   this.selected = i;
	//   this.divisionForm.reset(DivisionID);
	//   this.saveBtn = false;
	//   this.updateBtn = true;

	// }


}
