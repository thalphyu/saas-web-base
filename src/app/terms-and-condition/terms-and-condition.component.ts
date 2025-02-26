import { Location } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../globals';

@Component({
	selector: 'app-terms-and-condition',
	templateUrl: './terms-and-condition.component.html',
	styleUrls: ['./terms-and-condition.component.scss'],
	// animations: [routerTransition()],  //it is not working after upgrade
	// providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
})
export class TermsAndConditionComponent {
	globals: Globals;
	public switchlang = false;
	public showLang = false;
	windowScrolled: boolean;

	constructor(
		globals: Globals,
		private router: Router,
		private location: Location
	) {
		this.globals = globals;
	}

	@HostListener('window:scroll', [])
	onWindowScroll() {
		if (document.documentElement.scrollTop > window.outerHeight) {
			this.windowScrolled = true;
		} else if (this.windowScrolled && (window.scrollY || document.documentElement.scrollTop || document.body.scrollTop) < 10) {
			this.windowScrolled = false;
		}
	}
	scrollToTop() {
		window.scroll({ top: 0, behavior: 'smooth' });
	}

	langs: string[] = ['English', 'Myanmar'];
	activeLang = 'English';

	ChangeLanguage(switchLang: string) {
		this.activeLang = switchLang;

		if (switchLang === 'Myanmar') {
			this.showLang = true;
		} else {
			this.showLang = false;
		}

	}

	goBack() {
		this.location.back();
	}

}
