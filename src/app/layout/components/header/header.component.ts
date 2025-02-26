import { Component, OnInit, EventEmitter, HostListener, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JwtService, EmployeeSetupService, LocalStorageService } from '../../../core';
import fscreen from 'fscreen';
import { FileInfo } from '@progress/kendo-angular-upload';
import { Globals } from '../../../globals';
import { Globalfunction } from '../../../core/global/globalfunction';
import { AppComponent } from '../../../app.component';

import { FormBuilder } from '@angular/forms';
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	public globalFunction: Globalfunction;
	themes: any = [
		'theme-light',
		'theme-blue',
		'theme-orange',
		'theme-indigo',
		'theme-green',
		'theme-red',
		'theme-dark'
	];
	skins: any = [
		'light',
		'dark',
		'semi-dark'
	];

	globals: Globals;
	@Output() collapsedEvent = new EventEmitter<boolean>();
	pushRightClass = 'push-right';
	isSticky = false;
	public imageSrc = 'assets/images/user-pic.jpg';
	isFullscreen = false;
	currentDesignation: string;
	username;
	public count: number;
	data: any;
	public imagePreviews: FileInfo[] = [];
	public File: any[] = [];
	Ext: string;
	srcImg: boolean;
	public userid: any;
	public authData = JSON.parse(this.localStorageService.getItem('authorizationData'));
	LicenseExpired = false;
	darkMode = false;
	bodyClass;

	EventViewerForm = this.fb.group({
		userName: [],
		UserID: [0]
		// gridState: [],
	});

	constructor(
		private localStorageService: LocalStorageService,
		private translate: TranslateService,
		public router: Router,
		globals: Globals,
		public appComponent: AppComponent,
		private jwtService: JwtService,
		private employeeService: EmployeeSetupService,
		public fb: FormBuilder) {
		this.globalFunction = new Globalfunction();
		this.globals = globals;
		this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS', 'myanmar']);
		this.translate.setDefaultLang('en');
		const browserLang = this.translate.getBrowserLang();
		this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS|myanmar/) ? browserLang : 'en');

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

		//  this.username = localStorage.getItem('userName');
		setInterval(() => {
			this.RetrieveNotificationCount();
		}, 1800000);
	}

	ngOnInit() {
		fscreen.fullscreenEnabled === true;
		this.Ext = 'jpg';
		if (!this.authData) {
			this.router.navigate(['/login']);
		}
		this.username = this.authData.userName;
		this.userid = this.authData.UserID;
		this.currentDesignation = this.authData.Designation;
		// const image = this.authData.UserID ;
		this.imagePreviews = [];
		this.completeEventHandler();
		//const encryptdata = btoa(image);
		this.employeeService.getLoginImage().subscribe(x => {
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
		});
		this.RetrieveNotificationCount();
		this.jwtService.GetLicenseExpiredDateForCustomer().subscribe(result => {
			if (result) {
				this.LicenseExpired = result;
			}
			else { this.LicenseExpired = false; }
		});

		/* this.employeeService
		.validateType()
		.subscribe(
			data => {

			}
		); */

		/*const switchBtn = document.getElementById('switchBtn') as HTMLInputElement;
		document.body.setAttribute('data-theme', 'light');
		switchBtn.addEventListener('change', function(event){
			(switchBtn.checked) ? document.body.setAttribute('data-theme', 'dark') : document.body.setAttribute('data-theme', 'light');
		});*/

	}

	public switchModeIcon() {
		this.darkMode = !this.darkMode;
	}

	GotoLink(event, NotiName) {
		if (NotiName === 'Daily Task Notification') {
			this.router.navigate(['/app.visitassign']);
		}
		else if (event === 'LeaveRequest') {
			this.router.navigate(['/app.leaveRequest']);
		}
		else if (event === 'AttendanceRequest') {
			this.router.navigate(['/app.attendanceRequest']);
		}
		else if (event === 'OvertimeRequest') {
			this.router.navigate(['/app.otRequest']);
		}
		else if (event === 'LeaveRequestForApprove') {
			this.router.navigate(['/app.leaveApprove']);
		}
		else if (event === 'AttendanceRequestForApprove') {
			this.router.navigate(['/app.attendanceApprove']);
		}
		else if (event === 'OvertimeRequestForApprove') {
			this.router.navigate(['/app.otApprove']);
		}
		else if (event === 'Announcement') {
			this.router.navigate(['/app.announcement']);
		}
	}

	resetToggle($event: Event) {
		$event.stopPropagation();
		this.globals.collapsed = false;
	}

	RetrieveNotificationCount() {
		this.jwtService.RetrieveNotificationCount().subscribe(result => {
			this.count = result.data.data.length;//result.total;
		});
	}
	RetrieveNotification() {
		this.jwtService.RetrieveNotification().subscribe(result => {
			this.data = result;
			// this.count = result.length;//result.total;
		});
	}

	fullscreenhandler() {
		if (fscreen.fullscreenElement !== null) {
			fscreen.exitFullscreen();
			this.isFullscreen = false;
			console.log('Entered fullscreen mode');
		} else {
			fscreen.requestFullscreen(document.querySelector('html'));
			this.isFullscreen = true;
			console.log('Exited fullscreen mode');
		}
	}

	@HostListener('window:scroll', [])
	checkScroll() {
		this.isSticky = (window.pageYOffset >= 100);
	}

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

	onLoggedout() {
		//const currentURL = localStorage.getItem("customerurl");
		//console.log(currentURL);
		//this.router.navigate(['/'+currentURL+'/login']);

		this.employeeService.UpdateLogoutEventLog().subscribe(x => {
			if (x === 'Successfull') {
				this.router.navigate(['/login']);
				this.localStorageService.removeItem('authorizationData');
				this.localStorageService.removeItem('menuList');
				this.localStorageService.removeItem('board');
				this.localStorageService.removeItem('dashboardOptions');
				this.localStorageService.removeItem('changeDate');
				this.localStorageService.removeItem('changeMonth');
				this.localStorageService.removeItem('selectTreeViewEvent');
				this.localStorageService.removeItem('EnableSlide');
				this.localStorageService.removeItem('dropdownselect');
				this.jwtService.destroyToken();
				const check = localStorage.getItem('check_rem_password');
				if (check === 'false') {
					localStorage.removeItem('refToken');
				}

			}

		});
	}

	changeLang(language: string) {
		this.translate.use(language);
	}

	Detail() {
		this.jwtService.NotificationDataOffForWeb().subscribe(result => {
			if(result) {
				this.RetrieveNotificationCount;
			}
		});
		this.RetrieveNotification();
	}

	EmpDetail() {
		this.RetrieveNotification();
	}
	public completeEventHandler() {
		this.File = [];
	}

	DownloadUserManualPDF() {
		this.employeeService.DownloadusermanualPDF(this.EventViewerForm.value)
		.subscribe(x => {
			if (x !== undefined) {
				//   this.loading = false;
				const FileName = '' + 'User Maunal PDF';
				const FileExt = 'pdf';
				const a = document.createElement('a');
				document.body.appendChild(a);
				a.href = x;
				a.download = FileName + '.' + FileExt;
				a.click();
				//   this.globalfunction.messageDialogBox(`Export Pdf File Successfully!.`, 'Payslip');
			}

		});

	}
}





