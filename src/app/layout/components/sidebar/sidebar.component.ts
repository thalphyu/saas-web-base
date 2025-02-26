import { Component, OnInit, Output, ViewChild, EventEmitter, HostListener, AfterViewInit } from '@angular/core';
import { RouterOutlet, Router, ActivationStart, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JwtService, EmployeeSetupService, LocalStorageService, UserService } from '../../../core';
import { FileInfo } from '@progress/kendo-angular-upload';
import { Globals } from '../../../globals';
import { Globalfunction } from '../../../core/global/globalfunction';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
	public globalfunction: Globalfunction = new Globalfunction();

	globals: Globals;
	@ViewChild(RouterOutlet, { static: false }) outlet: RouterOutlet;
	@Output() collapsedEvent = new EventEmitter<boolean>();
	isActive = false;
	showFirst = false;
	showMenu = '';
	storedMenuName: string;
	pushRightClass = 'push-right';
	menu = [];
	public imageSrc = 'assets/images/user-pic.jpg';
	public imagePreviews: FileInfo[] = [];
	public File: any[] = [];
	Ext: string;
	srcImg: boolean;
	currentDesignation: string;
	username;
	public authData = JSON.parse(this.localStorageService.getItem('authorizationData'));
	public options = { autoHide: true };
	logo_default = false;
	customerlogo: string;
	isFirstTimeLogin = false;
	bodyClass;

	constructor(
		private localStorageService: LocalStorageService,
		private translate: TranslateService,
		public router: Router,
		private jwtService: JwtService,
		private employeeService: EmployeeSetupService,
		globals: Globals,
		private userService: UserService) {

		this.globals = globals;
		this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'myanmar']);
		this.translate.setDefaultLang('en');
		const browserLang = this.translate.getBrowserLang();
		this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|myanmar/) ? browserLang : 'en');

		this.router.events.subscribe(val => {
			this.globals.collapsed = false;
			this.bodyClass = document.getElementsByTagName('body')[0];
			this.bodyClass.classList.remove('scrollblock');

			if (
				val instanceof NavigationEnd &&
				window.innerWidth <= 992 &&
				this.isToggled()
			) {
				this.toggleSidebar();
			}
		});

		/* const EnMenuList = this.globalfunction.decryptDataClient(this.localStorageService.getItem('menuList'));
		console.log(EnMenuList);
		if(EnMenuList === undefined){
			this.router.navigate(['/login']);
		}else
		{
			const menulist = JSON.parse(EnMenuList);
			console.log("Json :" + menulist);
			this.menu = this.createMenuTree(menulist, 0);
		} */
	}

	ngOnInit() {
		this.logo_default = false;
		if (!this.authData) {
			this.router.navigate(['/login']);
		}
		this.username = this.authData.userName;
		this.currentDesignation = this.authData.Designation;
		this.Ext = 'jpg';
		this.imagePreviews = [];
		this.completeEventHandler();
		this.userService.isRequirePasswordChange().subscribe(data => {
			if (data === false) {
				this.isFirstTimeLogin = false;
			const EnMenuList = this.globalfunction.decryptDataClient(this.localStorageService.getItem('menuList'));
			if(EnMenuList === undefined){
				this.router.navigate(['/login']);
			}else
			{
			const menulist = JSON.parse(EnMenuList);
			this.menu = this.createMenuTree(menulist, 0);
			}
			}
			else {
				this.isFirstTimeLogin = true;
			}
			this.employeeService
			.getLoginImage()
			.subscribe(
			x => {
				if (x.length > 0) {
					const image = {
						src: x,
						uid: '',
						name: 'Employee Photo'
					};

					this.imagePreviews.unshift(image);
					this.srcImg = true;
				}
				else {
					const image = {
						src: this.imageSrc,
						uid: '',
						name: 'Employee Photo'
					};

					this.imagePreviews.unshift(image);
					this.srcImg = true;
				}
				this.employeeService
				.validateType()
				.subscribe(
					data1 => {

						this.customerlogo = data1[0].CustomerLogo;
						if (this.customerlogo !== '') {
							this.logo_default = true;
						}

					});
			});
		});

	}

	public completeEventHandler() {
		this.File = [];
	}

	toggleCollapsed($event: Event) {
		$event.stopPropagation();
		this.globals.collapsed = !this.globals.collapsed;
		this.collapsedEvent.emit(this.globals.collapsed);

		const body = document.getElementsByTagName('body')[0];

		if (window.innerWidth <= 992) {
			if (!this.globals.sideOpen && this.globals.collapsed) {
				//$('body').toggleClass('scrollblock');
				body.classList.add('scrollblock');
			} else if (this.globals.sideOpen && !this.globals.collapsed) {
				body.classList.add('scrollblock');
			} else if (this.globals.sideOpen && this.globals.collapsed) {
				body.classList.add('scrollblock');
			}
			else {
				body.classList.remove('scrollblock');
			}

			this.globals.mobile = true;
		}
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		//event.target.innerWidth;
		if (window.innerWidth >= 992) {

			if (this.globals.collapsed && !this.globals.sideOpen)
				{$('body').removeClass('scrollblock');}

		} else if (window.innerWidth < 992) {

			if (this.globals.collapsed)
				{$('body').addClass('scrollblock');}

		}
	}

	eventCalled() {
		this.isActive = !this.isActive;
	}

	addExpandClass(element: any, menu_ui_sref: any) {
		if (element === this.showMenu) {
			this.showFirst = false;
			this.showMenu = '0';
		} else {
			if (menu_ui_sref !== '#') {
				this.router.navigate([menu_ui_sref]);
			} else {
				this.showFirst = true;
				this.showMenu = element;
			}
		}
		//this.storedMenuName = '';
		//localStorage.setItem('menu-name', this.showMenu);
	}

	/*ngAfterViewInit() {
		this.storedMenuName = localStorage.getItem('menu-name');
	}*/

	isToggled(): boolean {
		const dom: Element = document.querySelector('body');
		return dom.classList.contains(this.pushRightClass);
	}

	toggleSidebar() {
		const dom: any = document.querySelector('body');
		dom.classList.toggle(this.pushRightClass);
	}

	rltAndLtr() {
		const dom: any = document.querySelector('body');
		dom.classList.toggle('rtl');
	}

	changeLang(language: string) {
		this.translate.use(language);
	}

	onLoggedout() {
		this.jwtService.destroyToken();
		localStorage.removeItem('isLoggedin');
	}

	// json filter
	filterJson(jsonobj: any, field: string, value: number) {
		return jsonobj.filter(s => s[field] === value);
	}
	// set menu
	createMenuTree(db_data, ParentID) {
		let node_item; let menu_id;
		// let sub_nodes = ''  ,
		let menu_ui_sref_text; let label_text; let parent_id; let tree_icon_text; let permission;
		const i = 0;
		const nodeObj = [];
		const  nodes = this.filterJson(db_data, 'ParentID', ParentID);
		for (let i1 = 0; i1 < nodes.length; i1++) {
			if (nodes.length > 0) {
				node_item = nodes[i1];
				menu_id = node_item.MenuID;
				menu_ui_sref_text = node_item.ControllerName;
				label_text = node_item.MenuName;
				parent_id = node_item.ParentID;
				tree_icon_text = node_item.Icon;
				permission = node_item.Permission;

				if (menu_ui_sref_text === '#') {
					const tree_icon = tree_icon_text.split('#@#');
					tree_icon_text = tree_icon[0];
				}

				nodeObj.push({
					label: label_text, menu_ui_sref: menu_ui_sref_text,
					tree_icon: tree_icon_text, menu_permission: permission,
					menu_parent: parent_id
				});
				nodeObj[i1].children = this.createMenuTree(db_data, menu_id);
			}
		}
		return nodeObj;
	}
}

