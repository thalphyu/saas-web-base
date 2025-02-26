import { ModalDialogService } from './../../core/services/dialog.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
//import { TreeviewItem, TreeviewConfig, TreeviewComponent } from '../../../../node_modules/ngx-treeview';
import { UserlevelcontrolService } from '../../core/services/userlevelcontrol.service';
import { DialogService, DialogRef, DialogCloseResult } from '@progress/kendo-angular-dialog';
import { TreeserviceService } from '../../core';
import { TreeItemLookup, CheckedState, CheckableSettings } from '@progress/kendo-angular-treeview';
import { Observable, of, empty } from 'rxjs';
import { Globalfunction } from '../../core/global/globalfunction';


const is = (fileName: string, ext: string) => ext === fileName;
@Component({
	selector: 'app-userlevelcontrol',
	templateUrl: './userlevelcontrol.component.html',
	styleUrls: ['./userlevelcontrol.component.scss'],
})
export class UserlevelcontrolComponent implements OnInit {
	/*@ViewChild(TreeviewComponent, { static: false }) treeviewComponent: TreeviewComponent;
	menuitems: TreeviewItem[];

	config = TreeviewConfig.create({
		hasAllCheckBox: false,
		hasFilter: false,
		hasCollapseExpand: false,
		decoupleChildFromParent: false,
		maxHeight: 400
	});*/

	public expandedKeys: any[] = ['0', '0_0'];
	public expandedKeys1: any[] = ['0', '0_0'];
	check: any;
	public checkedKeys: any[] = [];
	public valsBackUp: any[] = [];
	public checkedMenuKeys: any[] = [];
	public testforemp: any[] = [];
	public key = 'nodeid';
	tmp = [];
	public checkid = [];
	public allnodes: any[];
	public allnodes1: any[];
	public options = { autoHide: true };


	public selectedTab;

	userLevelForm = this.fb.group({
		filterText: [''],
		// SysID: ['']
	});

	saveUserLevelForm = this.fb.group({
		Password: [''],
		SysID: [''],
		UserLevel: ['', Validators.required],
		Description: ['', Validators.required],
		RestrictedIplist: [''],
		Remark: [''],
		MenuList: [false],
		AccessLogin: [false],
		AccessMobileLogin: [false],
		IsAdministrator: [false],
		Dval: [''],
		MenuArrays: [],

	});

	userLevelSets: any[];
	isPermission = false;
	isUserLevelSetup = true;
	showPermission = false;
	disabled = false;
	DvalArray: any = [];
	/*menuNames: any[];*/
	public globalfunction: Globalfunction;
	menus: any;
	menunodes: any[];
	value: any;
	checkedKeysForDept: any;
	isUpdate: boolean;
	isSave = true;
	ChildMenu: any;
	ParentMenu: any;
	nodes: any[] = ['Application Main Menu'];
	db_data: any;
	db_dept: any;
	isAdmin = false;
	opened: boolean;
	vOrderByDesign: any;
	subNodeType = '';
	menuLoading: boolean;
	//empLoading: boolean;
	saveMLoading: boolean;
	IsAdministrator: boolean;
	pwd: any;
	isMenuList: boolean;
	selected: any;
	checkemp: any;
	// wrongPwd: any = 'Your current password is wrong. Please Try Again.';
	val: any;
	Dval: any;
	currentID: any;
	constructor(
		public fb: FormBuilder,
		private treeviewService: TreeserviceService,
		public userlevelcontrolService: UserlevelcontrolService,
		private modalDialogService: ModalDialogService,
		private dialogService: DialogService
	) {
		this.globalfunction = new Globalfunction(this.dialogService);
	}

	public checkChildren = true;
	public checkParents = true;
	public checkMode: any = 'multiple';

	public get checkableSettings(): CheckableSettings {
		return {
			checkChildren: this.checkChildren,
			checkParents: this.checkParents,
			mode: this.checkMode,


		};
	}

	ngOnInit() {
		this.userlevelcontrolService.getUserLevelList(this.userLevelForm.value.filterText).subscribe((x) => {
			this.userLevelSets = x;

			this.newUserLevel();
			this.value = this.saveUserLevelForm.value.SysID;
		});
	}

	getUserLevelList() {
		this.userlevelcontrolService.getUserLevelList(this.userLevelForm.value.filterText).subscribe((x) => {
			this.userLevelSets = x;
		});
	}

	public open_popup() {
		this.opened = true;
	}
	public openViewMenu() {
		this.opened = true;
	}

	getDatabyViewMenu(data) {
		this.DvalArray = [];
		this.checkedKeys = [];
		//this.empLoading = true;

		//this.close_popup('yes');
	}

	public close_popup(status) {
		this.opened = false;
	}

	newUserLevel() {
		const labelElement = document.getElementsByClassName('k-floating-label-container');

		let i = 0;
		for (i = 0; i < labelElement.length; i++) {
			labelElement[i].classList.add('k-state-empty');
		}
		// for(const i of labelElement) {
		// 	i.classList.add('k-state-empty');
		// }


		this.isUserLevelSetup = true;
		this.isPermission = false;
		this.showPermission = false;
		this.selectedTab = 0; //For TabSelection
		// this.userlevelcontrolService.checkPassword(this.saveUserLevelForm.value).subscribe(x => {
		// 	if (x == true) {
		this.isAdmin = false;
		this.isSave = true;
		this.isUpdate = false;
		this.selected = '';
		//this.disabled = false;
		// this.saveUserLevelForm.reset();
		this.saveUserLevelForm = this.fb.group({
			Password: [''],
			SysID: [''],
			UserLevel: ['', Validators.required],
			Description: ['', Validators.required],
			RestrictedIplist: [''],
			Remark: [''],
			MenuList: [false],
			AccessLogin: [false],
			AccessMobileLogin: [false],
			IsAdministrator: [false],
			Dval: [''],
			MenuArrays: [],

		});

		this.saveUserLevelForm.controls.Password.setValue(this.pwd);
		if (this.saveUserLevelForm.value.Password !== '' && this.saveUserLevelForm.value.Password != null) {
			this.disabled = true;
			this.selected = '';
		} else {
			this.disabled = false;
		}
	}

	public isDisabled = (dataItem: any) => this.isAdmin === true;

	searchUserLevel() {
		this.getUserLevelList();
	}

	closeUserLevelPopup() {
		$('body').removeClass('dialog-open');
		this.isPermission = false;
		if (this.IsAdministrator === true) {
			this.isAdmin = true;
			this.isDisabled('');
		}
		else {
			this.isAdmin = false;
		}
	}

	showMessage(message, sysID) {
		if (message.toLowerCase().indexOf('successfully') >= 0 && sysID > 0) {
			this.modalDialogService.confirm('', message + '. User Level is ' + this.saveUserLevelForm.value.UserLevel, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
			this.ngOnInit();

		}
		else
			{this.modalDialogService.confirm('', message, 'Ok', '', 'text-warning', 'icon-warning', 'Sorry!');}
	}

	wrongPassword(message) {
		this.modalDialogService.confirm('', message, 'Ok', '', 'text-warning', 'icon-warning', 'Incorrect Password!');
	}

	errorMessage(message) {
		this.modalDialogService.confirm('', message, 'Ok', '', 'text-danger', 'icon-warning', 'Sorry!');
	}

	saveUserLevelMenu() {
		this.saveUserLevelForm.controls.MenuArrays.reset();
		if (this.checkedMenuKeys.length > 0) {
			this.saveUserLevelForm.controls.MenuArrays.setValue(this.checkedMenuKeys);
		}
		this.saveMLoading = true;

		this.userlevelcontrolService.saveUserLevelControl(this.saveUserLevelForm.value).subscribe(x => {
			this.saveMLoading = false;
			if (x.message) {
				if (x.message.toLowerCase().indexOf('successfully') >= 0) {
					this.DvalArray = [];
					// this.expandedKeys = ["0", "0_0", "0_1", "0_2", "0_3", "0_4","0_5","0_6","0_7","0_8","0_9","0_10","0_11"];
					// this.expandedKeys1 = ["0", "0_0", "0_1", "0_2", "0_3", "0_4","0_5","0_6","0_7","0_8","0_9","0_10","0_11"];
					this.expandedKeys = ['0', '0_0'];
					this.expandedKeys1 = ['0', '0_0'];
					this.modalDialogService.confirm('', 'Menu setting for User Level ' + this.saveUserLevelForm.value.UserLevel +
						' has been ' + x.message, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
					if (this.saveUserLevelForm.value.MenuList === true) {
						this.menuLoading = true;
						this.userlevelcontrolService.GetUserLevelMenu(this.saveUserLevelForm.value.SysID).subscribe(x1 => {
							this.menus = x1.data;
							this.ParentMenu = x1.ParentMenu;
							this.ChildMenu = x1.ChildMenu;
							//var nodes = this.FilterJson(this.menus, 'ParentId', 0);
							//this.menunodes = this.create_menunodes(nodes);
							//this.menunodes = this.createNodesDepartment(this.nodes, this.ParentMenu, this.ChildMenu);
							this.checkedMenuKeys = x1.checkList;
							this.menuLoading = false;
						});
					}
				}
				else if (x.error) {
					this.errorMessage(x.error);
					this.disabled = false;
				}
				else {
					this.wrongPassword(x.message);
					this.disabled = false;
				}

			}
			else {
				this.errorMessage(x.error);
				this.disabled = false;
			}
		});
	}

	saveUserLevel() {
		this.isPermission = false;
		this.userlevelcontrolService.SaveUserLevel(this.saveUserLevelForm.value).subscribe(x => {
			if (x.message.toLowerCase().indexOf('successfully') >= 0) {
				this.showMessage(x.message, x.sysID);
			}
			else if (x.error) {
				this.errorMessage(x.error);
			}
			else {
				this.wrongPassword(x.message);
			}
		});

	}

	/*
	updateUserLevel() {
		this.userlevelcontrolService.checkPassword(this.saveUserLevelForm.value).subscribe(x => {
			if (x == true) {
				this.isPermission = true;
				this.isUpdate = true;
				this.isSave = false;
			}
			else {
				this.wrongPassword(this.wrongPwd);
			}
		})
	} */

	updateUserLevel1() {
		this.isPermission = false;

		this.userlevelcontrolService.updateUserLevel(this.saveUserLevelForm.value).subscribe(x => {
			if (x.message.toLowerCase().indexOf('successfully') >= 0) {
				this.showMessage(x.message, x.sysID);
			}
			else if (x.error) {
				this.errorMessage(x.error);
			}
			else {
				this.wrongPassword(x.message);
			}
		});
	}

	showConfirmation() {
		if (this.saveUserLevelForm.value.IsAdministrator) {
			this.modalDialogService.confirm('', 'Can\'t delete Administrator User Level.', 'Ok', '', 'text-danger', 'icon-warning', 'Sorry!');
		}
		else {
			const Name = this.saveUserLevelForm.value.UserLevel;
			this.modalDialogService.confirm('', Name + ' will be permanently deleted.', 'Yes, delete it.', 'Cancel', 'text-danger', 'icon-trash', 'Delete User Level?')
				.then((confirmed) => { if (confirmed === true) {this.deleteUserLevel();} })
				.catch(() => { });
		}
	}

	deleteUserLevel() {
		this.userlevelcontrolService.deleteUserLevel(this.saveUserLevelForm.value.SysID)
			.subscribe((x) => {
				if (x.message) {
					const message = x.message;
					if (message.toLowerCase().indexOf('successfully') >= 0) {
						this.modalDialogService.confirm('', message + '. User Level is ' + this.saveUserLevelForm.value.UserLevel, 'Ok', '', 'text-success', 'icon-check', 'Well Done!');
						this.ngOnInit();
					}
					else
						{this.modalDialogService.confirm('', message, 'Ok', '', 'text-warning', 'icon-warning', 'Sorry!');}
				}
				else if (x.error) {
					this.errorMessage(x.error);
				}
			});
	}

	handlePassword() {
		if (this.saveUserLevelForm.value.Password !== '' && this.saveUserLevelForm.value.Password !== null) {
			this.disabled = false;
			this.pwd = this.saveUserLevelForm.value.Password;
		}
		else
			{this.disabled = true;}
	}

	onTabSelect(e) {

		this.selectedTab = e.index;

		if (e.title === 'User Level') {


			this.isUserLevelSetup = true;
			this.isPermission = false;

		}
		else {
			this.isUserLevelSetup = false;
			this.isPermission = true;
		}
	}

	selectedUserLevel(ID, i) {

		const labelElement = document.querySelectorAll('.k-tabstrip .k-floating-label-container');
		//document.getElementsByClassName("k-floating-label-container");

		let i1 = 0;
		for (i1 = 0; i1 < labelElement.length; i1++) {
			labelElement[i1].classList.remove('k-state-empty');
		}
		// for(const j of labelElement) {
		// 	j.classList.remove('k-state-empty');
		// }

		//this.isPermission = false;
		this.showPermission = true;
		this.selected = i;
		/*if (this.saveUserLevelForm.value.Password != "" && this.saveUserLevelForm.value.Password != null)
			this.disabled = false;
		else*/
		this.disabled = false;
		this.isSave = false;
		this.isUpdate = true;
		this.isAdmin = false;
		this.isMenuList = true;
		this.allnodes = [];
		this.menunodes = [];
		this.checkedKeys = [];
		this.checkedMenuKeys = [];
		this.value = ID;

		if (this.userLevelSets !== undefined) {
			const list = this.userLevelSets.find(x => x.SysID === ID);

			this.saveUserLevelForm.controls.SysID.setValue(list.SysID);
			this.saveUserLevelForm.controls.UserLevel.setValue(list.UserLevel);
			this.saveUserLevelForm.controls.Description.reset(list.Description);
			this.saveUserLevelForm.controls.RestrictedIplist.setValue(list.RestrictedIplist);
			this.saveUserLevelForm.controls.Remark.setValue(list.Remark);

			this.saveUserLevelForm.controls.MenuList.setValue(list.MenuList);

			this.saveUserLevelForm.controls.AccessLogin.setValue(list.AccessLogin);
			this.saveUserLevelForm.controls.AccessMobileLogin.setValue(list.AccessMobileLogin);
			this.saveUserLevelForm.controls.IsAdministrator.setValue(list.IsAdministrator);

			this.IsAdministrator = list.IsAdministrator;


			// this.expandedKeys = ["0", "0_0", "0_1", "0_2", "0_3", "0_4","0_5","0_6","0_7","0_8","0_9","0_10","0_11"];
			// this.expandedKeys1 = ["0", "0_0", "0_1", "0_2", "0_3", "0_4","0_5","0_6","0_7","0_8","0_9","0_10","0_11"];
			this.expandedKeys = ['0', '0_0'];
			this.expandedKeys1 = ['0', '0_0'];
			this.DvalArray = [];

			if (this.saveUserLevelForm.value.IsAdministrator) {
				this.isAdmin = true;
			}
			else {
				if (!this.saveUserLevelForm.value.MenuList)
					{this.isMenuList = false;}
			}

		}

		this.onItemClick(ID, i);
	}

	//public onItemClick(item: any, dataItem: any, ID, i): void {
	public onItemClick(ID, i): void {

		//if (item == "View Permission") {
		//this.isUserLevelSetup = false;
		//this.isUserLevel = true;
		this.isAdmin = false;
		this.isMenuList = true;
		this.allnodes = [];
		this.menunodes = [];
		this.checkedKeys = [];
		this.checkedMenuKeys = [];
		this.valsBackUp = [];
		this.value = ID;
		this.selected = i;
		this.DvalArray = [];
		if (this.saveUserLevelForm.value.Password !== '' && this.saveUserLevelForm.value.Password !== null)
			{this.disabled = false;}
		else
			{this.disabled = true;}

		const list = this.userLevelSets.find(x => x.SysID === ID);
		this.saveUserLevelForm.controls.SysID.setValue(list.SysID);
		this.saveUserLevelForm.controls.UserLevel.setValue(list.UserLevel);
		this.saveUserLevelForm.controls.Description.setValue(list.Description);
		this.saveUserLevelForm.controls.RestrictedIplist.setValue(list.RestrictedIplist);
		this.saveUserLevelForm.controls.Remark.setValue(list.Remark);

		this.saveUserLevelForm.controls.MenuList.setValue(list.MenuList);

		this.saveUserLevelForm.controls.AccessLogin.setValue(list.AccessLogin);
		this.saveUserLevelForm.controls.AccessMobileLogin.setValue(list.AccessMobileLogin);
		this.saveUserLevelForm.controls.IsAdministrator.setValue(list.IsAdministrator);
		this.IsAdministrator = list.IsAdministrator;

		if (this.saveUserLevelForm.value.IsAdministrator) {
			this.isAdmin = true;
			//this.empLoading = true;
		}
		else {
			if (!this.saveUserLevelForm.value.MenuList)
				{this.isMenuList = false;}
		}

		if (this.saveUserLevelForm.value.MenuList === true) {
			this.menuLoading = true;
			this.userlevelcontrolService.GetUserLevelMenu(this.saveUserLevelForm.value.SysID).subscribe(x => {
				//this.menus = x.data;
				this.ParentMenu = x.ParentMenu;
				this.ChildMenu = x.ChildMenu;
				//var nodes = this.FilterJson(this.menus, 'ParentId', 0);
				//this.menunodes = this.create_menunodes(nodes);
				this.menunodes = this.createMenuNodes(this.nodes, this.ParentMenu, this.ChildMenu);
				this.checkedMenuKeys = x.checkList;
				this.menuLoading = false;
			});
		}
	}

	// FilterJson = (jsonobj, field, value, field1 = null, value1 = null) =>{
	// 	let tmpobj = [];
	// 	tmpobj = jsonobj.filter(
	// 		(jsonobj1)=> jsonobj1[field] === value
	// 	);
	// 	return tmpobj.filter(
	// 		(jsonobj2)=> jsonobj2[field1] === value1
	// 	);
	// };
	FilterJson = (jsonobj, field, value) => {
		const tmpobj = [];
		for(const i of jsonobj) {
			if(i[field] === value) {
				tmpobj.push(i);
			}
		}

		return tmpobj;
	};

	createMenuNodes(nodes, db_data, db_dept) {
		this.db_data = db_data;
		this.db_dept = db_dept;
		const retdata = [];
		let t = 0;
		for (t = 0; t < nodes.length; t++) {
			const server_nodeitem = nodes[t];
			const server_nodename = 'Application Main Menu';
			const server_parentid = 0;
			const server_nodeid = 0;
			let icon = 'icon-main-menu';
			let server_nodechecked = false;
			if (server_nodeitem.check)
				{server_nodechecked = server_nodeitem.check;}
			const server_nodetype = 'AppMenu';
			const server_nodeobj = {
				children: [], label: server_nodename, nodeid: server_nodeid,
				check: server_nodechecked, nodetype: server_nodetype, icon, nodename: server_nodename, parentid: server_parentid
			};
			const subnodes = this.FilterJson(this.db_data, 'ParentId', server_nodeid);
			// if (subnodes)
			// 	{const k = 0;}
			// for (let k = 0; k < subnodes.length; k++) {
			for(const k of subnodes) {
				const nodeitem = k;
				const nodename = nodeitem.MenuName;
				const parentid = nodeitem.ParentId;
				const nodeid = nodeitem.MenuId;
				//var icon = 'icon-ballot';
				 icon = 'icon-ballot';
				let nodechecked = false;
				if (nodeitem.check) { nodechecked = nodeitem.check; };
				const comp_nodetype = 'MasterMenu';
				const comp_nodeobj = { children: [], label: nodename, nodeid, check: nodechecked, nodetype: comp_nodetype, icon, nodename, parentid };
				const comp_subnodes = this.FilterJson(this.db_dept, 'ParentId', nodeid);
				if (comp_subnodes) {
					let j = 0;
					if (!comp_nodeobj.children) { comp_nodeobj.children = []; }
					for (j = 0; j < comp_subnodes.length; j++) {
						comp_nodeobj.children[comp_nodeobj.children.length] = this.createSubNodes(comp_subnodes[j]);
					}
					if (!server_nodeobj.children) { server_nodeobj.children = []; }
					server_nodeobj.children[server_nodeobj.children.length] = comp_nodeobj;
				}
			}
			retdata[t] = server_nodeobj;
		}
		return retdata;
	};

	createSubNodes(param_nodes) {
		const nodes = [];
		nodes[0] = param_nodes;
		let nodeobj: any = {};
		let i = 0;
		for (i = 0; i < nodes.length; i++) {
			const nodeitem = nodes[i];
			const name = nodeitem.MenuName;
			const parentid = nodeitem.ParentId;
			const nodeid = nodeitem.MenuId;
			const srNo = nodeitem.SrNo;
			let icon;
			if (srNo > 1000) {
				icon = 'icon-label';
				this.subNodeType = 'btnMenu';
			}
			else {
				icon = 'icon-layers';
				this.subNodeType = 'FormMenu';
			}

			let nodechecked = false;
			if (nodeitem.check) { nodechecked = nodeitem.check; };

			nodeobj = { children: [], label: name, nodeid, check: nodechecked, nodetype: this.subNodeType, icon, parentid };
			const subnodes = this.treeviewService.filterJson(this.db_dept, 'ParentId', nodeid);
			if (subnodes.length > 0) {
				let t = 0;
				if (!nodeobj.children) { nodeobj.children = []; }
				for (t = 0; t < subnodes.length; t++) {
					nodeobj.children[nodeobj.children.length] = this.createSubNodes(subnodes[t]);
				}
			};
		}
		return nodeobj;
	};


	public fetchChildren1(selectednode: any): Observable<any[]> {
		return of(selectednode.children);
	}

	public hasChildren1(node: any): boolean {
		// Check if the parent node has children
		//console.log(node);
		return (node.children && node.children.length > 0);
	}




	public isMenuChecked = (dataItem: any, index: string): CheckedState => {
		//console.log(this.checkedKeys);
		if (this.containsItem1(dataItem)) { return 'checked'; }

		if (this.isIndeterminate1(dataItem.children)) { return 'indeterminate'; }// { return 'indeterminate'; }



		return 'none';
	};



	private containsItem1(item: any): boolean {
		return this.checkedMenuKeys.indexOf(item[this.key]) > -1;
	}



	private isIndeterminate1(items: any[] = []): boolean {
		// let idx = 0;
		// let item;
		// while (item = items[idx]) {
		// 	if (this.isIndeterminate1(item.children) || this.containsItem1(item)) {// (this.isIndeterminate1(item.children) || this.containsItem1(item))
		// 		return true;
		// 	}
		// 	idx += 1;
		// }
		for (const item of items) {
			if (this.isIndeterminate1(item.children) || this.containsItem1(item)) {
				return true;
			}
		}
		return false;
	}




	public getcheckedKeysOutput(event) {
		this.val = event.val;
		this.Dval = event.Dval;
		this.currentID = event.ID;
		if (this.valsBackUp.indexOf(this.val) === -1 && this.currentID === this.value) {
			this.valsBackUp.push(this.val);
		}
		const valindex = this.checkedKeys.indexOf(this.val);
		if (valindex > -1) {
			this.checkedKeys.splice(valindex, 1);
			const dvalIndex = this.checkedKeys.indexOf(this.Dval);
			if (this.checkedKeys.length === 1 && dvalIndex > -1) {
				this.checkedKeys.splice(dvalIndex, 1);
			}
		}
		else {
			let dvalAry = [];
			const dvalIndex = this.checkedKeys.indexOf(this.Dval);
			if (dvalIndex > -1) {
				dvalAry = this.Dval.split('Dept');
				this.Dval = dvalAry[1];
				//this.getEmpListForDepartmentID(this.val, this.currentID, this.Dval);
			}
		}

	}


}
