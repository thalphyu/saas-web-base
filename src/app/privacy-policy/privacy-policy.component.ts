import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Globals } from '../globals';

@Component({
	selector: 'app-privacy-policy',
	templateUrl: './privacy-policy.component.html',
	styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {
	globals: Globals;
	constructor(
		globals: Globals,
		private location: Location) {
		this.globals = globals;
	}

	goBack() {
		this.location.back();
	}

}
