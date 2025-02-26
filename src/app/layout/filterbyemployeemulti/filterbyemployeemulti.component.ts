import { Component, OnInit, ViewEncapsulation, Input,Output,EventEmitter,ViewChild } from '@angular/core';
import { GridDataResult, RowArgs, DataStateChangeEvent, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
import { FilterService } from '../../core/services/filter.service';
import { State,CompositeFilterDescriptor,distinct } from '@progress/kendo-data-query';
import { FormBuilder } from '@angular/forms';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
@Component({
  selector: 'app-filterbyemployeemulti',
  templateUrl: './filterbyemployeemulti.component.html',
  styleUrls: ['./filterbyemployeemulti.component.scss']
})
export class FilterbyemployeemultiComponent implements OnInit {
@Output () newItemEvent=new EventEmitter<string>();
@ViewChild(DataBindingDirective,{static: false}) dataBinding: DataBindingDirective;
public filter: CompositeFilterDescriptor;
public gridData: any[]=[];
public gridView: any[]=[];
public empList: any[];
public view: any;
public total: any;
public loading: boolean;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 40,
    filter: {  logic: 'and', filters: [] }
  };
  public selectableSettings: SelectableSettings;
  selectAllState='unchecked';
  isUserlevelControl=false;
  valarrayselectList: any[] = [];
  valarraydeselectList: any[] = [];
  valarrayremoveList={
    val:'',
   // "Dval":"",
    ID:0,
    GPSLocationID:0,
    DeviceID:0
  };
  res: any[] = [];
  res1: any = [];
  constructor(private filterService: FilterService, public formBuilder: FormBuilder) {
    this.view = filterService;
  }


  public rowSelected(context: any) {

    //select
    const dataEmp=localStorage.getItem('FilterEmployeeIDs');
    if(dataEmp!=null)
    {
      this.res = dataEmp.split(',');
			// for (let i = 0; i < this.res.length; i++) {
      for (const i of this.res) {
        if (context.dataItem.val === i) {
          context.dataItem.ischecked = true;
        }
      }
    }
    //deselect
    const dataEmp1=localStorage.getItem('DeselectEmployeeIDs');
    if(dataEmp1!=null)
    {
      this.res1 = dataEmp1.split(',');
			// for (let i = 0; i < this.res1.length; i++) {
      for (const i of this.res1) {
        if (context.dataItem.val === i) {
          context.dataItem.ischecked = false;
        }
      }
    }
    return context.dataItem.ischecked;
}
  public mySelection: string[] = [];
  empCount;
  public mySelectionKey(context: RowArgs) {
    return context.dataItem;
  }
  viewMenuForm = this.formBuilder.group({
    Type: ['true'],
    Include_Resign: [false],
    Include_Active: [true],
    Include_Inactive: [false],
    Include_ResignMonthOnly: [false],
    UserLevelID:[0],
    isuserlevelcontrol:[false],
    isuserlevelassign:[false],
    GPSLocationID:[0],
    DeviceID : [0],
    Resign_CustomPeriod: [false],
    Fromdate: [],
    Todate: [],
  });
  public mode = 'multiple';

  @Input() public viewMenu: any;
  @Input() public selectable: any;
  @Input() public checkedKeys: any;
  @Input() public ID: any;
  @Input() public GPSLocationID: any;
  @Input() public DeviceID: any;
  @Output() checkedKeysOutput: EventEmitter<any> = new EventEmitter();

  public empcheckedKeys: any[] = [];

  ngOnInit() {

    this.selectableSettings = {
      checkboxOnly: true,
      mode: 'multiple'
    };


      this.view._value = [];

      if (this.viewMenu !== null && this.viewMenu !== undefined && this.viewMenu !== '') {
        this.viewMenuForm.reset(this.viewMenu);
        this.viewMenuForm.controls.Include_ResignMonthOnly.setValue(this.viewMenu.Resign_MonthOnly);
        if(this.viewMenuForm.value.Resign_CustomPeriod == null) {
          this.viewMenuForm.controls.Resign_CustomPeriod.setValue(false);
        }

    }

    if(this.selectable!== null && this.selectable!==undefined && this.selectable!=='')
    {
      this.selectableSettings=this.selectable;
    }

    if ((this.checkedKeys !== null && this.checkedKeys !== undefined && this.checkedKeys !== '')
    || (this.ID !== null && this.ID !== undefined && this.ID !== '')) {
      this.empcheckedKeys=this.checkedKeys;
      this.viewMenuForm.controls.UserLevelID.setValue(this.ID);
      this.isUserlevelControl=true;
      }

    if(this.GPSLocationID!==null && this.GPSLocationID!==undefined && this.GPSLocationID!=='')
    {
      this.viewMenuForm.controls.GPSLocationID.setValue(this.GPSLocationID);
      this.isUserlevelControl=true;
    }

    if(this.DeviceID!==null && this.DeviceID!==undefined && this.DeviceID!=='')
    {
      this.viewMenuForm.controls.DeviceID.setValue(this.DeviceID);
      this.isUserlevelControl=true;
    }

      this.getAllEmployeeFilter();

      this.filterService.gridState.filter.filters=[];
  }
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridState = state;

    this.filterService.gridState = state;

    const grid=JSON.stringify(this.gridState);
    this.newItemEvent.emit(grid);
    this.getAllEmployeeFilter();
  }
  onSelectedEmployee(e) {
    localStorage.setItem('FilterEmployeeIDs', e);
  }
  public setSelectableSettings(): void {
    this.selectableSettings = {
      mode: 'multiple'
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
    this.getAllEmployeeFilter();
  }

  public onFilter(inputValue: string): void {

        this.gridState.filter.filters =
        [
          {
            field: 'EnrollNumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'EmployeeCode',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'EmployeeName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'CName',
            operator: 'contains',
            value: inputValue
          },
          // {
          //   field: 'EDesc',
          //   operator: 'contains',
          //   value: inputValue
          // },
          // {
          //   field: 'DesignationName',
          //   operator: 'contains',
          //   value: inputValue
          // },
          // {
          //   field: 'Shift',
          //   operator: 'contains',
          //   value: inputValue
          // },
          // {
          //   field: 'LocationName',
          //   operator: 'contains',
          //   value: inputValue
          // },
          // {
          //   field: 'SectionName',
          //   operator: 'contains',
          //   value: inputValue
          // },
          // {
          //   field: 'DivisionName',
          //   operator: 'contains',
          //   value: inputValue
          // },
          // {
          //   field: 'GroupPolicyName',
          //   operator: 'contains',
          //   value: inputValue
          // },

        ];

        this.getAllEmployeeFilter();
        const grid=JSON.stringify(this.gridState);
        this.newItemEvent.emit(grid);


  }
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    this.gridState.filter.filters = this.filter.filters;
  }

  public distinctPrimitive(fieldName: string): any {
    if (this.empList !== undefined) {
      const aa = distinct(this.empList, fieldName).map(item => item[fieldName]);
      // const result = aa.filter(function(el) {
      //   return el != '';
      // });

      const result = aa.filter(el=> el !== '');

      return result;
    }

  }
  public getServiceMonth(value): any {
    let result;
    if (value !== 0) {
      if (value % 12 === 0) {
        result = Math.floor(value / 12);
        const word = result === 1 ? 'year' : 'years';
        result = result + ' ' + word;
      }

      else if (value === 12) {
        result = '1 year';
      }

      else if (value > 12) {
        result = Math.floor(value / 12);
        const word = result === 1 ? 'year' : 'years';
        const month = value % 12;
        const mon = month === 1 ? 'month' : 'months';
        result = result + ' ' + word + ' & ' + month + ' ' + mon;
      }else if(value < 0)
      {
        result = '0 month';
      }

      else {
        const word = value === 1 ? 'month' : 'months';
        result = value + ' ' + word;
      }
    }

    else {
      result = '0 month';
    }


    return result;
  }

  public onSelectAllChange(checkedState: SelectAllCheckboxState) {
    if (checkedState === 'checked') {
        this.selectAllState = 'checked';
    } else {
        this.selectAllState = 'unchecked';
    }
}

SelectDeselect(e) {
 if(e.selectedRows.length > 0)
 {
  e.selectedRows.map(item => {
    if(this.valarraydeselectList.length > 0)
    {
      const remove_index = this.valarraydeselectList.indexOf(item.dataItem.val);
      if(remove_index > -1)
      {
        this.valarraydeselectList.splice(remove_index, 1);
        localStorage.setItem('DeselectEmployeeIDs',this.valarraydeselectList.toString());
      }
    }
    if(this.valarrayselectList.indexOf(item.dataItem.val)===-1)
    {
      this.valarrayselectList.push(item.dataItem.val);
      localStorage.setItem('FilterEmployeeIDs',this.valarrayselectList.toString());
    }
    item.dataItem.ischecked = true;
    return item;
  });
 }

 if(e.deselectedRows.length > 0)
 {
  e.deselectedRows.map(item => {
    if(this.valarrayselectList.length > 0)
    {
      const remove_index = this.valarrayselectList.indexOf(item.dataItem.val);
      if(remove_index > -1)
      {
        this.valarrayselectList.splice(remove_index, 1);
        if(this.valarrayselectList.length===0)
        {
          localStorage.removeItem('FilterEmployeeIDs');
        }
        else
        {
          localStorage.setItem('FilterEmployeeIDs',this.valarrayselectList.toString());
        }

      }
    }
    if(this.valarraydeselectList.indexOf(item.dataItem.val) === -1)
    {
      this.valarraydeselectList.push(item.dataItem.val);
      localStorage.setItem('DeselectEmployeeIDs',this.valarraydeselectList.toString());
    }

    this.valarrayremoveList.val='Emp-'+item.dataItem.val;
    //this.valarrayremoveList.Dval="Dept"+item.dataItem.Dval;
    this.valarrayremoveList.ID = this.ID;
    this.valarrayremoveList.GPSLocationID = this.GPSLocationID;
    this.valarrayremoveList.DeviceID = this.DeviceID;
    this.checkedKeysOutput.emit(this.valarrayremoveList);
    item.dataItem.ischecked = false;
    return item;
  });
 }

}



public getAllEmployeeFilter()
{
    this.filterService.query(this.gridState, this.viewMenuForm.value);
    this.gridData=this.view;
}



}
