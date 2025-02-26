import { Component, OnInit, Inject, LOCALE_ID, ViewChild, ElementRef } from '@angular/core';
/* import { getViewData } from '@angular/core/src/render3/instructions'; */
import { TreeserviceService } from '../../core';
import { formatDate } from '@angular/common';
import { EventEmitter } from 'events';
//const is = (fileName: string, ext: string) => new RegExp(`.${ext}\$`).test(fileName);
const is = (fileName: string, ext: string) => ext === fileName;

@Component({
    selector: 'app-treeview',
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.scss']
})

export class TreeviewComponent implements OnInit {

    // popup values
    public OrderbyDept = true;
    public OrderByDesign = false;
    public Include_Resign = false;
    public Include_Active = true;
    public Include_Inactive = false;
    public Resign_MonthOnly = false;
    // end of popup values
    queryString;

    public checkedKeys: any[] = [''];
    public key = 'label';

    public shifts;
    public employee;
    public _CurDate;

    public Include_ProvisionPeriod;
    public Companyid;
    public departments;
    //public formType;
    public compForShift;
    public test: any[];
    public test1: any[];

    public opened = false;
    public comp_nodeid;

    chkChange = function(chk) {
        if (chk === 1) {
            this.OrderbyDept = true;
            this.OrderByDesign = false;
        } else {
            this.OrderbyDept = false;
            this.OrderByDesign = true;
        }
    };
    isShowUpload = false;
    public openFileUploadPopUp() {
        this.isShowUpload = true;
    }
    public closeFileUploadPopUp() {
        this.isShowUpload = false;
    }

    public open_popup() {
        this.opened = true;
    }

    public close_popup(status) {
        this.opened = false;
    }

    public adminSets: any[] = [{ AdminName: 'Naing' }, { AdminName: 'Thura' }, { AdminName: 'Aung' }];

    /*  public iconClass({ text, items }: any): any {
      return {
          'k-i-file-pdf': is(text, 'pdf'),
          'k-i-folder': items !== undefined,
          'k-i-html': is(text, 'html'),
          'k-i-image': is(text, 'jpg|png'),
          'k-icon': true
      };
    }  */
    public iconClass({ icon }: any): any {
        return {
            'k-i-gears': is(icon, 'icon-gear'),
            'k-i-gear': is(icon, 'icon-building'),
            'k-i-plus': is(icon, 'icon-cube'),
            'k-i-user': is(icon, 'icon-user'),
            'k-icon': true
        };
    }

    constructor(private treeviewService: TreeserviceService, @Inject(LOCALE_ID) private locale: string) {

    }

    ngOnInit() {
        this.getData();
    }

    public handleSelection(node: any): void {
        const selectednode = node.dataItem;
        // this.OrderByDesign = true; // add this line to test designation.
        const vOrderByDesign = this.OrderByDesign;
        console.log(selectednode);
        const employee = { Eno: null, DOE: null, PermanentDate: null, DOB: null };
        const employees = [];
        const type = selectednode.nodeid.substring(0, 4);
        employee.Eno = null;//tempEnroll;
        employee.DOE = new Date();
        const customDateFormat = 'yyyy-MM-dd';
        employee.DOE = formatDate(employee.DOE, customDateFormat, this.locale);//$filter('date')(employee.DOE, customDateFormat);
        employee.PermanentDate = formatDate(employee.DOE, customDateFormat, this.locale);//$filter('date')(employee.DOE, customDateFormat);
        employee.DOB = new Date();
        employee.DOB = formatDate(employee.DOB, customDateFormat, this.locale);//$filter('date')(employee.DOB, customDateFormat);
        if (selectednode.nodetype !== 'Employee' && selectednode.nodetype !== 'Customer' && selectednode.nodetype !== 'Company') { // check need to request data
            const DeptID = selectednode.did;  //use as DeptID or DesignationID
            const formType = 'Employeesetup';
            this.treeviewService.GetEmployeeByDepartmentview(DeptID, this._CurDate, this.OrderbyDept, this.OrderByDesign, this.Include_Resign,
                this.Include_Active, this.Include_Inactive, this.Resign_MonthOnly, this.Include_ProvisionPeriod, this.Companyid, formType)
                .subscribe(employeeList => {

                    if (employeeList !== 'undefined') {
                        // for (let x = 0; x < employeeList.length; x++) {
                        for(const x of employeeList){
                            x.Dval = DeptID;
                            /* var tmpObj = $filter('filter')( employees, function(node) {
                                return ( node.val == parseInt(employee[x].val) );
                            })[0]; */
                            //const tmpObj = employees.filter(node => node.val == parseInt(employeeList[x].val))[0];
                            const tmpObj = employees.filter(node1 => node1.val === parseInt(x.val, 10))[0];
                            if (tmpObj !== undefined) {
                                //var arr_index = _.findIndex(employees, { 'val': parseInt(employee[x].val)});
                                const arr_index = employees.indexOf({ val: parseInt(x.val, 10) });
                                if (arr_index >= 0) {
                                    employees.splice(arr_index, 1);
                                }
                            }
                        }
                    }
                    employees.push.apply(employees, employeeList);
                    if (employeeList.length > 0) {selectednode.disabled = false;}
                    const newNodes = this.treeviewService.BuildTreeByDept(employeeList, selectednode.did, selectednode, vOrderByDesign);

                    // Attach new children to parent node
                    selectednode.children = newNodes.children;

                    //  var deptid = this.id_subString(selectednode.nodeid);
                    //  var deptobj = this.filterJson(this.departments, 'Dval', deptid);

                    //   employee.CID = deptobj[0].CID;
                    //   this.refreshData(employee.CID);
                    //  employee.Dval = deptid;
                    //   if (this.shifts) { employee.ShiftID = this.shifts[0].ShiftID; }
                    //  this.selectChange();
                    // employee.val = '';

                });

        } else {

        }
    }

    selectChange() {
        this.employee.Monday = this.employee.ShiftID;
        this.employee.Tuesday = this.employee.ShiftID;
        this.employee.Wednesday = this.employee.ShiftID;
        this.employee.Thursday = this.employee.ShiftID;
        this.employee.Friday = this.employee.ShiftID;
        this.employee.Saturday = this.employee.ShiftID;
        this.employee.Sunday = this.employee.ShiftID;
    };

    refreshData(CompanyID) {
        let tmpDepartments = [];
        tmpDepartments = this.filterJson(this.departments, 'CID', CompanyID);
        //  var temp = $filter('orderBy')($scope.tmpDepartments, 'Dval')[$scope.tmpDepartments.length - 1];

        const tmpC = this.filterJson(this.compForShift, 'CompanyID', CompanyID);
        if (tmpC.length > 0) {
            if (tmpC[0].Sunday === 1) { this.employee.Sunday = -1; }
            if (tmpC[0].Monday === 1) { this.employee.Monday = -1; }
            if (tmpC[0].Tuesday === 1) { this.employee.Tuesday = -1; }
            if (tmpC[0].Wednesday === 1) { this.employee.Wednesday = -1; }
            if (tmpC[0].Thursday === 1) { this.employee.Thursday = -1; }
            if (tmpC[0].Friday === 1) { this.employee.Friday = -1; }
            if (tmpC[0].Saturday === 1) { this.employee.Saturday = -1; }
        };
    };

    id_subString(value) {
        if (value) {
            if (value.toString().indexOf('Comp') >= 0 || value.toString().indexOf('Emp') >= 0 || value.toString().indexOf('Dept') >= 0 || value.toString().indexOf('Desg') >= 0) {
                if (value.length > 4) {
                    value = value.substring(4, value.length);
                }
                return value;
            } else {
                return value;
            }
        } else {
            return value;
        }
    };

    getData() {
        this.treeviewService.GetDataForTree().subscribe(result => {
            this.departments = result[2];
            this.test = this.treeviewService.CreateTree(result);
        });
        this.treeviewService.getCompanyList().subscribe(comp => {
            this.compForShift = comp;
        });

    }

    filterJson(jsonobj: any, field: string, value: number) {
        return jsonobj.filter(s => s[field] === value);
    }
    /*   FilterJson_Comp = function (jsonobj, field, value, field1 = null, value1 = null) {
          var tmpobj = [];
          tmpobj = jsonobj.filter(
              function (jsonobj) { return jsonobj[field] == value }
          );
          return tmpobj.filter(
              function (jsonobj) { return jsonobj[field1] == value1 }
          );
      }; */

    // test binding template
    closeForm() {
        this.isShowUpload = false;
    }
    // end of test binding template
}
