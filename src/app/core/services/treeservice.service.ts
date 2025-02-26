import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class TreeserviceService {
  private db_data = [];
  private db_server = [];
  private db_company = [];
  private db_dept = [];
  private db_desg = [];
  private db_employee = [];
  public comp_nodeid;

  constructor(private apiservice: ApiService) { }

  getCompanyList() {
    return this.apiservice.post(`${environment.Data}BLGeneral/BLGeneral.Company.CompanyController/GetCompany`);
  }

  GetDataForTree() {
    return this.apiservice.post(`${environment.Data}BLGeneral/BLGeneral.Employee.EmployeeController/GetDataForTree`);
  }

  GetEmployeeByDepartmentview = function(Dval, _CurDate, OrderbyDept, OrderByDesign, Include_Resign, Include_Active,
    Include_Inactive, Resign_MonthOnly, Include_ProvisionPeriod, Companyid, const_var, isReappoint = false) {
    const_var = (const_var === undefined ? '' : const_var);
    const vDval = (Dval === undefined ? '0' : Dval);
    if (isReappoint == null) { isReappoint = false; };
    const objEmp = {
      Dval: vDval, _CurDate, OrderbyDept, OrderByDesign, Include_Resign, Include_Active, Include_Inactive,
      Include_ResignMonthOnly: Resign_MonthOnly, Include_ProvisionPeriod, Companyid, DeviceNo: const_var, IsReappoint: isReappoint
    };
    return this.apiservice.postJsonESS(`${environment.Data}BLGeneral/BLGeneral.Employee.EmployeeController/GetEmployeeByDepartmentview`, objEmp);

  };

  /* create department nodes */

  createNodesDepartment(nodes, db_data, db_dept) {
    this.db_data = db_data;
    this.db_dept = db_dept;

    const retdata = [];
    let t = 0;
    for (t = 0; t < nodes.length; t++) {
      const server_nodeitem = nodes[t];
      const server_nodename = server_nodeitem.CustomerName;
      const server_parentid = server_nodeitem.ParentID;
      const server_nodeid = server_nodeitem.CustomerID;
      let icon = 'icon-gear';
      let server_nodechecked = false;
      if (server_nodeitem.check)
        {server_nodechecked = server_nodeitem.check;}

      const server_nodetype = 'ServerLocation';
      const server_nodeobj = { children: null, label: server_nodename, nodeid: server_nodeid, check: server_nodechecked, nodetype: server_nodetype, icon };
      const subnodes = this.FilterJson_Comp(this.db_data, 'CustomerID', server_nodeid, 'ParentID', 0);
      if (subnodes)
        {const k = 0;}
      // for (let k = 0; k < subnodes.length; k++) {
      for(const k of subnodes) {
        const comp_nodeitem = k;
        const comp_nodename = comp_nodeitem.CName;
        const comp_parentid = comp_nodeitem.ParentID;
        const comp_nodeid = comp_nodeitem.CID;
         icon = 'icon-building';
        let comp_nodechecked = false;
        if (comp_nodeitem.check) { comp_nodechecked = comp_nodeitem.check; };

        const comp_nodetype = 'Company';
        const comp_nodeobj = { children: null, label: comp_nodename, nodeid: comp_nodeid, check: comp_nodechecked, nodetype: comp_nodetype, icon };
        const comp_subnodes = this.FilterJson_Comp(this.db_dept, 'CID', comp_nodeid, 'ParentID', 0);//0//"JBsYdk67FTQ="
        if (comp_subnodes) {
          let j = 0;
          if (!comp_nodeobj.children) { comp_nodeobj.children = []; }
          for (j = 0; j < comp_subnodes.length; j++) {
            comp_nodeobj.children[comp_nodeobj.children.length] = this.createSubNodesDepartment(comp_subnodes[j]);
          }
          if (!server_nodeobj.children) { server_nodeobj.children = []; }
          server_nodeobj.children[server_nodeobj.children.length] = comp_nodeobj;
        }
      }
      retdata[t] = server_nodeobj;
    }
    return retdata;
  };

  createSubNodesDepartment(param_nodes) {
    const resultdata = [];
    const nodes = [];
    let nodeobj;
    /* 	if (jQuery.isArray(param_nodes)) {
        nodes = param_nodes;
      } else {
        nodes[0] = param_nodes;
      } */
    nodes[0] = param_nodes;
    let i = 0;
    for (i = 0; i < nodes.length; i++) {
      const nodeitem = nodes[i];
      const nodename = nodeitem.EDesc;
      const parentid = nodeitem.ParentID;
      const nodeid = nodeitem.Dval;
      const icon = 'icon-cube';
      let nodechecked = false;
      if (nodeitem.check) { nodechecked = nodeitem.check; };

      const nodetype = 'Department';
      nodeobj = { children: null, label: nodename, nodeid, check: nodechecked, nodetype, icon };
      const subnodes = this.filterJson(this.db_dept, 'ParentID', nodeid);
      if (subnodes.length > 0) {
        let t = 0;
        if (!nodeobj.children) { nodeobj.children = []; }
        for (t = 0; t < subnodes.length; t++) {
          nodeobj.children[nodeobj.children.length] = this.createSubNodesDepartment(subnodes[t]);
        }
      };
      //resultdata[i] = nodeobj;
    }
    //return resultdata;
    return nodeobj;
  };

  /* end of create department nodes */

  BuildTreeByDept(db_employee_list, did, nodeobj, OrderByDesign, isCheck = false) {
    const mnu_nodechk = false;
    if (OrderByDesign === undefined) {OrderByDesign = false;}
    if (db_employee_list.length > 0 && OrderByDesign === false) {
      const empnodes = this.filterJson(db_employee_list, 'Dval', did);
      //var empnodes = db_employee_list;
      if (empnodes.length > 0) {
        let j = 0;
        for (j = 0; j < empnodes.length; j++) {
          //if(j>10) continue; //testing
          const empnodeitem = empnodes[j];
          const empnodename = empnodeitem.Name;
          const empparentid = empnodeitem.Dval;
          const empnodeid = 'Emp-' + empnodeitem.val;
          const icon = 'icon-user';
          let empnodechecked = mnu_nodechk;
          /* if(empnodeitem['check'])
            {empnodechecked = empnodeitem['check'];} */
          if (empnodeitem.check === 1 || isCheck) { empnodechecked = true; }
          const empnodetype = 'Employee';
          const empnodeobj = {
            label: empnodename, did: empnodeitem.Dval, nodeid: empnodeid,
            check: empnodechecked, selected: empnodechecked, nodetype: empnodetype, icon, parentid: 'Emp-' + empparentid
          };
          //duplicate Employee tza 2015-11-03
          if (!nodeobj.children) {
            nodeobj.children = [];
          }
          else {
						/* 	var tmpObj = $filter('filter')( nodeobj.children, function(node) {
                return ( node.val == empnodeid );
              })[0]; */
            const tmpObj = nodeobj.children.filter(node => node.val === empnodeid)[0];
            if (tmpObj !== undefined) {
              // var arr_index = _.findIndex(nodeobj.children, { 'val': empnodeid});
              const arr_index = nodeobj.children.indexOf({ val: empnodeid });
              if (arr_index >= 0) {
                nodeobj.children.splice(arr_index, 1);
              }
            }
          }

          //if(nodeobj.children.indexOf(empnodeobj)<0)
          //{
          nodeobj.children.push(empnodeobj);
          //}
        }
      }
    }

    if (db_employee_list.length > 0 && OrderByDesign === true) {
      //var desg_subnodes = $rootScope.FilterJson_Comp(db_employee_list,'CID', nodeobj["CID"] ,'DeID', desg_nodeitem["DeID"]);
      const desg_subnodes = this.filterJson(db_employee_list, 'Dval', did);
      let i = 0;
      for (i = 0; i < desg_subnodes.length; i++) {
        const emp_nodeitem = desg_subnodes[i];
        const emp_nodename = emp_nodeitem.Name;
        const emp_parentid = emp_nodeitem.ParentID;
        const emp_nodeid = 'Emp-' + emp_nodeitem.val;
        const icon = 'icon-user';
        let emp_nodechecked = false;
        /* if(emp_nodeitem['check'])
          emp_nodechecked = emp_nodeitem['check']; */
        if (emp_nodeitem.check === 1 || isCheck)
          {emp_nodechecked = true;}

        const emp_nodetype = 'Employee';
        const emp_nodeobj = { label: emp_nodename, nodeid: emp_nodeid, check: emp_nodechecked, selected: emp_nodechecked, nodetype: emp_nodetype, icon };
        if (!nodeobj.children) {
          nodeobj.children = [];
        }
        else {
          /* 	var tmpObj = $filter('filter')( nodeobj.children, function(node) {
               return ( node.val == emp_nodeid );
              })[0]; */
          const tmpObj = nodeobj.children.filter(node => node.val === emp_nodeid)[0];
          if (tmpObj !== undefined) {
            // var arr_index = _.findIndex(nodeobj.children, { 'val': emp_nodeid});
            const arr_index = nodeobj.children.indexOf({ val: emp_nodeid });
            if (arr_index >= 0) {
              nodeobj.children.splice(arr_index, 1);
            }
          }
        }
        nodeobj.children.push(emp_nodeobj);
      }
    }
    return nodeobj;
  }

  CreateTree(result) {

    if (result[2] !== undefined || result[2].length !== 0) {
      result[2] = this.splitParentID(result[2]);
    }
    if (result[3] !== undefined || result[3].length !== 0) {
      result[3] = this.splitParentIDForDesignation(result[3]);
    }
    const customers = result[0];
    const companys = result[1];
    const departments = result[2];
    const designations = result[3];
    const employee = { Dval: null, Deval: null, CID: null };
    const allEmployee = result[4];
    const tmpDepartments = this.filterJson(departments, 'CID', companys[0].CID);
    const tmpDesigations = this.filterJson(designations, 'CID', companys[0].CID);
    if (departments.length !== 0) {
      if (tmpDepartments === undefined || tmpDepartments.length === 0) {
        return []; //Please define Department firstly!
      } else {
        employee.Dval = tmpDepartments[0].Dval;
      }
    }
    if (designations.length !== 0) {
      if (tmpDesigations === undefined || tmpDesigations.length === 0) {
        return []; // Please define Designation firstly!
      } else {
        employee.Deval = tmpDesigations[0].Deval;
      }
    }

    /*  if (designations == undefined || designations.length == 0) {
       return []; // Please define Designation firstly!
     } else {
       employee.Deval = designations[0].Deval;
     } */

    if (companys) {
      employee.CID = companys[0].CID;
    } else {

    }
    return this.BuildTree(customers, companys, departments, designations, {});

  }

  BuildTree(server, companys, departments, designations, employee, OrderByDesign = false, IsAdmin = false, form_type = '') {
    this.db_server = server;
    this.db_company = companys;
    this.db_dept = departments;
    this.db_desg = designations;
    this.db_employee = employee;
    const encryptKey = this.db_server[0].ParentID;

    let resultdata = [];
    if (departments.length !== 0) {
      OrderByDesign = false;
    }
    if (designations.length !== 0) {
      OrderByDesign = true;
    }
    //var servernodes = $rootScope.FilterJson(db_server.data,'ParentID',0);
    //var servernodes = $rootScope.FilterJson(db_server,'ParentID',0);
    let servernodes ='';
    if (OrderByDesign === false) {
      if (this.db_server !== undefined && this.db_server.length > 0 && this.db_company !== undefined && this.db_company.length > 0 && this.db_dept !== undefined && this.db_dept.length > 0) {
         servernodes = this.filterJson(this.db_server, 'ParentID', encryptKey);//0
        return resultdata = this.create_nodes_employee(servernodes, IsAdmin, form_type);
      }
    } else {
      if (this.db_server !== undefined && this.db_server.length > 0 && this.db_company !== undefined && this.db_company.length > 0 && this.db_desg !== undefined && this.db_desg.length > 0) {
         servernodes = this.filterJson(this.db_server, 'ParentID', encryptKey);//0
        return resultdata = this.create_desgnodes(servernodes);
      }
    }

  }
  BuildTreeForPackageType4(server, companys, departments, designations, employee) {
    this.db_server = server;
    this.db_company = companys;
    this.db_dept = departments;
    this.db_desg = designations;
    this.db_employee = employee;
    const encryptKey = this.db_server[0].ParentID;

    let resultdata = [];

    if (this.db_server !== undefined && this.db_server.length > 0 && this.db_company !== undefined && this.db_company.length > 0 && this.db_desg !== undefined && this.db_desg.length > 0) {
      const servernodes = this.filterJson(this.db_server, 'ParentID', encryptKey);//0
      return resultdata = this.create_nodes_employeeForPackageType4(servernodes);
    }
  }
  create_nodes_employeeForPackageType4(nodes) {
    const retdata = [];
    const t = 0;
    const server_nodeitem = nodes[t];
    const server_nodename = server_nodeitem.CustomerName;
    const server_parentid = server_nodeitem.ParentID;
    const server_nodeid = 'Svr-' + server_nodeitem.CustomerID;
    const icon = 'icon-gear';
    let server_nodechecked = false;

    if (server_nodeitem.check === 1)
      {server_nodechecked = true;}

    const server_nodetype = 'Customer';
    const server_nodeobj = { children: [], label: server_nodename, nodeid: server_nodeid, check: server_nodechecked, selected: server_nodechecked, nodetype: server_nodetype, icon };
    const subnodes = this.FilterJson_Comp(this.db_company, 'CustomerID', server_nodeitem.CustomerID, 'ParentID', server_parentid);//
    if (subnodes)
      {const k = 0;}
    // for (let k = 0; k < subnodes.length; k++) {
      for(const k of subnodes) {
      const comp_nodeitem = k;
      const comp_nodename = comp_nodeitem.CName;
      const comp_parentid = comp_nodeitem.ParentID;
      const comp_nodeid = 'Comp' + comp_nodeitem.ParentID;
      const icon_building = 'icon-building';
      let comp_nodechecked = false;
      if (comp_nodeitem.check === 1)
        {comp_nodechecked = true;}

      const comp_nodetype = 'Company';
      const comp_nodeobj = { children: [], label: comp_nodename, nodeid: comp_nodeid, check: comp_nodechecked, selected: comp_nodechecked, nodetype: comp_nodetype, icon_building };
      const comp_subnodes = this.FilterJson_Comp(this.db_desg, 'ParentID', comp_nodeitem.ParentID, 'ParentID', server_parentid);

      if (comp_subnodes) {
        let j = 0;
        if (!comp_nodeobj.children) { comp_nodeobj.children = []; }
        for (j = 0; j < comp_subnodes.length; j++) {

          for (j = 0; j < comp_subnodes.length; j++) {
            const desg_nodeitem = comp_subnodes[j];
            /* var desg_nodename = desg_nodeitem["EDesc"];
            var desg_parentid = desg_nodeitem["ParentID"];
            var desg_nodeid = 'Dept' + desg_nodeitem["Dval"]; */
            const desg_nodename = desg_nodeitem.DeName;
            const desg_parentid = desg_nodeitem.ParentID;
            const desg_nodeid = 'Dept' + desg_nodeitem.Deval;
            const icon_cube = 'icon-cube';
            const desg_nodechecked = false;
            let btnmenu_nodechecked;
            if (desg_nodeitem.check === 1)
              {btnmenu_nodechecked = true;}

            const desg_nodetype = 'Department';
            const desg_nodeobj = {
              label: desg_nodename, did: desg_nodeitem.Deval, nodeid: desg_nodeid, check: desg_nodechecked,
              selected: desg_nodechecked, nodetype: desg_nodetype, icon_cube, children: []
            };
            if (this.db_employee.length > 0) {
              const desg_subnodes = this.FilterJson_Comp(this.db_employee, 'CID', comp_nodeitem.CID, 'Deval', desg_nodeitem.Deval);
              let i = 0;
              for (i = 0; i < desg_subnodes.length; i++) {
                const emp_nodeitem = desg_subnodes[i];
                const emp_nodename = emp_nodeitem.Name;
                const emp_parentid = emp_nodeitem.ParentID;
                const emp_nodeid = 'Emp-' + emp_nodeitem.val;
                const icon_user = 'icon-user';
                let emp_nodechecked = false;
                if (emp_nodeitem.check === 1)
                  {emp_nodechecked = true;}

                const emp_nodetype = 'Employee';
                const emp_nodeobj = { label: emp_nodename, nodeid: emp_nodeid, check: emp_nodechecked, selected: emp_nodechecked, nodetype: emp_nodetype, icon_user };
                if (!desg_nodeobj.children) { desg_nodeobj.children = []; }
                desg_nodeobj.children[desg_nodeobj.children.length] = emp_nodeobj;
              }
            }
            if (!comp_nodeobj.children) { comp_nodeobj.children = []; }
            comp_nodeobj.children[comp_nodeobj.children.length] = desg_nodeobj;
          }
        }
        if (!server_nodeobj.children) { server_nodeobj.children = []; }
        server_nodeobj.children[server_nodeobj.children.length] = comp_nodeobj;
      }
      retdata[t] = server_nodeobj;
    }
    return retdata;
  }

  FilterJson_Comp = (jsonobj, field, value, field1 = null, value1 = null) => {
    let tmpobj = [];
    tmpobj = jsonobj.filter(
      (jsonobj1) => jsonobj1[field] === value
    );
    return tmpobj.filter(
      (jsonobj2) => jsonobj2[field1] === value1
    );
  };

  create_nodes_employee(nodes, isAdmin, form_type) {
    const retdata = [];
    let t = 0;
    let mnu_nodechk = false;
    if (isAdmin) {
      mnu_nodechk = true;
    } else {
      mnu_nodechk = false;
    }
    if (form_type === 'UserLevelAssignment') { mnu_nodechk = false; }
    for (t = 0; t < nodes.length; t++) {
      const server_nodeitem = nodes[t];
      const server_nodename = server_nodeitem.CustomerName;
      const server_parentid = server_nodeitem.ParentID;
      const server_nodeid = 'Svr-' + server_nodeitem.CustomerID;
      let icon = 'icon-gear';
      let server_nodechecked = mnu_nodechk;
      /* if(server_nodeitem['check'])
          server_nodechecked = server_nodeitem['check']; */
      if (server_nodeitem.check === 1)
        {server_nodechecked = true;}

      const server_nodetype = 'Customer';
      const server_nodeobj = { children: [], label: server_nodename, nodeid: server_nodeid, check: server_nodechecked, selected: server_nodechecked, nodetype: server_nodetype, icon };
      //var subnodes = $rootScope.FilterJson_Comp(db_company.data,'ServerLocationID', server_nodeitem["ServerLocationID"], 'ParentID', 0);
      const subnodes = this.FilterJson_Comp(this.db_company, 'CustomerID', server_nodeitem.CustomerID, 'ParentID', server_parentid);//0
      if (subnodes)
        {const k = 0;}
      // for (let k = 0; k < subnodes.length; k++) {
        for(const k of subnodes) {
        const comp_nodeitem = k;
        const comp_nodename = comp_nodeitem.CName;
        const comp_parentid = comp_nodeitem.ParentID;
        this.comp_nodeid = 'Comp' + comp_nodeitem.CID;
         icon = 'icon-building';
        let comp_nodechecked = mnu_nodechk;
        /* if(comp_nodeitem['check'])
            comp_nodechecked = comp_nodeitem['check']; */
        if (comp_nodeitem.check === 1)
          {comp_nodechecked = true;}

        const comp_nodetype = 'Company';
          const comp_nodeobj = {
            children: [], disabled: false, label: comp_nodename, nodeid: this.comp_nodeid,
            check: comp_nodechecked, selected: comp_nodechecked, nodetype: comp_nodetype, icon, parentid: 'Comp' + comp_parentid
          };
        //var comp_subnodes = $rootScope.FilterJson_Comp(db_dept.data,'CompanyID', comp_nodeitem["CompanyID"], 'ParentID', 0);
        const comp_subnodes = this.FilterJson_Comp(this.db_dept, 'CID', comp_nodeitem.CID, 'ParentID', server_parentid);//0
        if (comp_subnodes) {
          let j = 0;
          if (!comp_nodeobj.children) { comp_nodeobj.children = []; }
          for (j = 0; j < comp_subnodes.length; j++) {
            comp_nodeobj.children[comp_nodeobj.children.length] = this.create_sub_nodes_employee(comp_subnodes[j], mnu_nodechk, form_type);
          }
          if (!server_nodeobj.children) { server_nodeobj.children = []; }
          server_nodeobj.children[server_nodeobj.children.length] = comp_nodeobj;
        }
      }
      retdata[t] = server_nodeobj;
    }
    //console.info("nodedata",retdata);
    return retdata;
  }


  create_desgnodes(nodes) {
    const retdata = [];
    const t = 0;
    // for (t = 0; t < nodes.length; t++) {
    const server_nodeitem = nodes[t];
    const server_nodename = server_nodeitem.CustomerName;
    const server_parentid = server_nodeitem.ParentID;
    const server_nodeid = 'Svr-' + server_nodeitem.CustomerID;
    const icon_gear = 'icon-gear';
    let server_nodechecked = false;

    if (server_nodeitem.check === 1)
      {server_nodechecked = true;}

    const server_nodetype = 'Customer';
    const server_nodeobj = { children: [], label: server_nodename, nodeid: server_nodeid, check: server_nodechecked, selected: server_nodechecked, nodetype: server_nodetype, icon_gear };
    //var subnodes = $rootScope.FilterJson_Comp(db_company.data,'ServerLocationID', server_nodeitem["ServerLocationID"], 'ParentID', 0);
    const subnodes = this.FilterJson_Comp(this.db_company, 'CustomerID', server_nodeitem.CustomerID, 'ParentID', server_parentid);//
    if (subnodes)
      {const k = 0;}
    // for (let k = 0; k < subnodes.length; k++) {
      for (const i of subnodes) {
      const comp_nodeitem = i;
      const comp_nodename = comp_nodeitem.CName;
      const comp_parentid = comp_nodeitem.ParentID;
      const comp_nodeid = 'Comp' + comp_nodeitem.ParentID;
      let icon = 'icon-building';
      let comp_nodechecked = false;
      // if(comp_nodeitem['check'])
      //  comp_nodechecked = comp_nodeitem['check'];
      if (comp_nodeitem.check === 1)
        {comp_nodechecked = true;}

      const comp_nodetype = 'Company';
      const comp_nodeobj = { children: [], label: comp_nodename, nodeid: comp_nodeid, check: comp_nodechecked, selected: comp_nodechecked, nodetype: comp_nodetype, icon };
        //var comp_subnodes = $rootScope.FilterJson_Comp(db_desg.data,'ParentID', 0);
        //var comp_subnodes = this.FilterJson_Comp(this.db_desg, 'ParentID',  server_parentid);//0
        const comp_subnodes = this.FilterJson_Comp(this.db_desg, 'ParentID', comp_nodeitem.ParentID, 'ParentID', server_parentid);

        if (comp_subnodes) {
          let j = 0;
          if (!comp_nodeobj.children) { comp_nodeobj.children = []; }
          for (j = 0; j < comp_subnodes.length; j++) {

            for (j = 0; j < comp_subnodes.length; j++) {
              const desg_nodeitem = comp_subnodes[j];
              const desg_nodename = desg_nodeitem.DeName;
              const desg_parentid = desg_nodeitem.ParentID;
              //var desg_nodeid = 'Desg'+desg_nodeitem["DeID"];
              const desg_nodeid = 'Desg' + desg_nodeitem.Deval;
              icon = 'icon-cube';
              const desg_nodechecked = false;
              let btnmenu_nodechecked;
              // if(desg_nodeitem['check'])
              //    btnmenu_nodechecked = desg_nodeitem['check'];
              if (desg_nodeitem.check === 1) { btnmenu_nodechecked = true; }

              const desg_nodetype = 'Designation';
            //var desg_nodeobj = {disabled:true, label: desg_nodename, did:desg_nodeitem["Deval"], nodeid: desg_nodeid, check:desg_nodechecked, selected:desg_nodechecked, nodetype:desg_nodetype, icon:icon};
              const desg_nodeobj = {
                label: desg_nodename, did: desg_nodeitem.Deval, nodeid: desg_nodeid,
                check: desg_nodechecked, selected: desg_nodechecked, nodetype: desg_nodetype, icon, children: []
              };
            if (this.db_employee.length > 0) {
              const desg_subnodes = this.FilterJson_Comp(this.db_employee, 'CID', comp_nodeitem.CID, 'Deval', desg_nodeitem.Deval);
              //var desg_subnodes = $rootScope.FilterJson(db_employee.data,'DesignationID', desg_nodeid);
              // let i = 0;
              // for (i = 0; i < desg_subnodes.length; i++) {
              for (const desg of desg_subnodes) {
                const emp_nodeitem = desg;
                const emp_nodename = emp_nodeitem.Name;
                const emp_parentid = emp_nodeitem.ParentID;
                const emp_nodeid = 'Emp-' + emp_nodeitem.val;
                const icon_user = 'icon-user';
                let emp_nodechecked = false;
                // if(emp_nodeitem['check'])
                //   emp_nodechecked = emp_nodeitem['check']; /
                if (emp_nodeitem.check === 1)
                  {emp_nodechecked = true;}

                const emp_nodetype = 'Employee';
                const emp_nodeobj = { label: emp_nodename, nodeid: emp_nodeid, check: emp_nodechecked, selected: emp_nodechecked, nodetype: emp_nodetype, icon_user };
                if (!desg_nodeobj.children) { desg_nodeobj.children = []; }
                desg_nodeobj.children[desg_nodeobj.children.length] = emp_nodeobj;
              }
            }
            if (!comp_nodeobj.children) { comp_nodeobj.children = []; }
            comp_nodeobj.children[comp_nodeobj.children.length] = desg_nodeobj;
          }
        }
        if (!server_nodeobj.children) { server_nodeobj.children = []; }
        server_nodeobj.children[server_nodeobj.children.length] = comp_nodeobj;
      }
      retdata[t] = server_nodeobj;
    }
    return retdata;
  }

  splitParentID(deptObj) {
    // for (let k = 0; k < deptObj.length; k++) {
      for(const k of deptObj) {
      const deptArr = k.Dval.split('=');
      k.Dval = deptArr[0];
      k.ParentID = (deptArr.length > 1 ? deptArr[1] : 0);
    }
    return deptObj;
  }
  splitParentIDForDesignation(desgObj) {
    // for (let k = 0; k < desgObj.length; k++) {
    for (const k of desgObj) {
      const desgArr = k.Deval.split('=');
      k.Dval = desgArr[0];
      k.ParentID = (desgArr.length > 1 ? desgArr[1] : 0);
    }
    return desgObj;
  }

  makeNode(text, value, check) {
    return { text, value, check, children: [] };
  }

  filterJson(jsonobj: any, field: string, value: string) {
    return jsonobj.filter(s => s[field] === value);
  }
  filterJson1(jsonobj: any, field: string, value: number) {
    return jsonobj.filter(s => s[field] === value);
  }

  create_sub_nodes_employee(param_nodes, mnu_nodechk, form_type) { ////mhmw
    const resultdata = [];
    const nodes = [];
    /* 	if(jQuery.isArray(param_nodes)){
        nodes = param_nodes;
      }else{
        nodes[0] = param_nodes;
      } */
    nodes[0] = param_nodes;
    let nodeobj;
    let i = 0;
    for (i = 0; i < nodes.length; i++) {
      const nodeitem = nodes[i];
      const nodename = nodeitem.EDesc;
      const parentid = nodeitem.ParentID;
      const nodeid = 'Dept' + nodeitem.Dval;
      // var nodeid = 'Dept' + nodeitem["DID"];
      let icon = 'icon-cube';
      let ivhTreeviewIndeterminate = -1;
      if ((nodeitem.deptchecked !== undefined)) {ivhTreeviewIndeterminate = nodeitem.deptchecked;}
      let nodechecked = mnu_nodechk;
      if (nodeitem.check === 1) { nodechecked = true; }

      let parent_id;
      if (parentid === 0) {
        parent_id = this.comp_nodeid;
      } else {
        parent_id = 'Dept' + parentid;
      }

      const nodetype = 'Department';
      nodeobj = {
        children: [], disabled: false, label: nodename, did: nodeitem.Dval, nodeid,
        check: nodechecked, selected: nodechecked, nodetype, icon, parentid: parent_id, __ivhTreeviewIndeterminate: false
      };
      if (ivhTreeviewIndeterminate === -1) {
        nodeobj = {
          children: [], disabled: false, label: nodename, did: nodeitem.Dval, nodeid,
          check: nodechecked, selected: nodechecked, nodetype, icon, parentid: parent_id, __ivhTreeviewIndeterminate: false
        };
      } else if (ivhTreeviewIndeterminate === 2) {
        nodeobj = {
          children: [], disabled: false, label: nodename, did: nodeitem.Dval, nodeid,
          check: nodechecked, selected: true, nodetype, icon, parentid: parent_id, __ivhTreeviewIndeterminate: false
        };
      } else if (ivhTreeviewIndeterminate === 0 || ivhTreeviewIndeterminate === 1) {
        nodeobj = {
          children: [], disabled: false, label: nodename, did: nodeitem.Dval, nodeid,
          check: nodechecked, selected: nodechecked, nodetype, icon, parentid: parent_id, __ivhTreeviewIndeterminate: (ivhTreeviewIndeterminate === 1 ? true : false)
        };
      }
      //var subnodes = $rootScope.FilterJson(db_dept.data, 'ParentID', nodeitem["DepartmentID"]);
      const subnodes = this.filterJson(this.db_dept, 'ParentID', nodeitem.Dval);
      // var subnodes = this.filterJson(this.db_dept, 'ParentID', nodeitem["DID"]);

      if (subnodes.length > 0) {
        let t = 0;
        if (!nodeobj.children) { nodeobj.children = []; }
        for (t = 0; t < subnodes.length; t++) {
          const chknodes = this.filterJson1(subnodes, 'deptchecked', 1);
          if (nodeobj.__ivhTreeviewIndeterminate === false && ((chknodes !== undefined) && chknodes.length > 0)) { nodeobj.__ivhTreeviewIndeterminate = true; }
          nodeobj.children[nodeobj.children.length] = this.create_sub_nodes_employee(subnodes[t], mnu_nodechk, '');
        }
      };

      if ((this.db_employee !== undefined) && this.db_employee.length > 0) {
        const empnodes = this.filterJson(this.db_employee, 'Dval', nodeitem.Dval);
        if (empnodes.length > 0) {
          let j = 0;
          for (j = 0; j < empnodes.length; j++) {
            const empnodeitem = empnodes[j];
            const empnodename = empnodeitem.Name;
            const empparentid = empnodeitem.Dval;
            const empnodeid = 'Emp-' + empnodeitem.val;
             icon = 'icon-user';
            let empnodechecked = mnu_nodechk;

            if (empnodeitem.check === 1) { empnodechecked = true; }
            const empnodetype = 'Employee';
            const empnodeobj = {
              label: empnodename, did: empnodeitem.Dval, nodeid: empnodeid,
              check: empnodechecked, selected: empnodechecked, nodetype: empnodetype, icon, parentid: 'Emp-' + empparentid
            };
            if (!nodeobj.children)
              {nodeobj.children = [];}
            nodeobj.children[nodeobj.children.length] = empnodeobj;
          }
        }
      }
    }
    return nodeobj;
  }
}
