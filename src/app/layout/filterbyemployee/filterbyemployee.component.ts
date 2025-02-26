import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { GridDataResult, RowArgs, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
import { FilterService } from '../../core/services/filter.service';
import { State } from '@progress/kendo-data-query';
import { FormBuilder } from '@angular/forms';
import { SelectableSettings } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-filterbyemployee',
  templateUrl: './filterbyemployee.component.html',
  styleUrls: ['./filterbyemployee.component.scss']
})
export class FilterbyemployeeComponent implements OnInit {
  public view: any;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 40,
    filter: { logic: 'and', filters: [] },
  };
  public selectableSettings: SelectableSettings;
  constructor(private filterService: FilterService, public formBuilder: FormBuilder, ) {
    this.setSelectableSettings();
    this.view = filterService;
  }
  //encapsulation: ViewEncapsulation.None
  public mySelection: string[] = [];
  empCount;
  public mySelectionKey(context: RowArgs) {
    return context.dataItem;
  }
  viewMenuForm = this.formBuilder.group({
    Type: ['true'],
    Include_Resign: [false],// = false;
    Include_Active: [true], //= true;
    Include_Inactive: [false],// = false;
    Include_ResignMonthOnly: [false], //= false;
    Resign_CustomPeriod: [false],
    Fromdate: [],
    Todate: [],
  });
  public mode = 'multiple';

  @Input() public viewMenu: any;

  ngOnInit() {
    if (this.viewMenu !== null && this.viewMenu !== undefined && this.viewMenu !== '') {
      this.viewMenuForm.reset(this.viewMenu);
      this.viewMenuForm.controls.Include_ResignMonthOnly.setValue(this.viewMenu.Resign_MonthOnly);
      if(this.viewMenuForm.value.Resign_CustomPeriod == null) {
        this.viewMenuForm.controls.Resign_CustomPeriod.setValue(false);
      }
    }
    this.filterService.query(this.gridState, this.viewMenuForm.value);
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridState = state;
    this.filterService.query(this.gridState, this.viewMenuForm.value);
  }
  onSelectedEmployee(e) {
    localStorage.setItem('FilterEmployeeID', e);
  }
  public setSelectableSettings(): void {
    this.selectableSettings = {
      mode: 'single'
    };
  }
  search(filter) {//for external search
    this.gridState.filter.filters = [
      { field: 'EnrollNumber', operator: 'eq', value: filter },
      { field: 'EmployeeCode', operator: 'eq', value: filter },
      { field: 'EmployeeName', operator: 'contains', value: filter },
      { field: 'CName', operator: 'contains', value: filter },
      // { field: "EDesc", operator: "contains", value: filter },
      // { field: "DesignationName", operator: "contains", value: filter },
    ];
     this.filterService.query(this.gridState, this.viewMenuForm.value);

  }
}
