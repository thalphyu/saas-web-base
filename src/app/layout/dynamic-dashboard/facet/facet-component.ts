import {Facet} from './facet-model';
import {
	 Component, EventEmitter, Input, OnInit, Output
} from '@angular/core';

import {
	 style, state, trigger, animate, transition
} from '@angular/animations';

/**
 * Created by jayhamilton on 7/11/17.
 */
@Component({
	moduleId: module.id,
	selector: 'app-facet',
	template: `
		<hr class="bg-secondary">
		<div class="d-flex">
			<h4 class="fs-5 text-dark mb-1">{{facet.name}}</h4>
			<svg class="icon i-def text-muted ms-auto" (click)='toggleAccordion()'>
				<use xlink:href="assets/icons/symbol-defs.svg#icon-chevron-up" *ngIf="facetOpen === 'in'"></use>
				<use xlink:href="assets/icons/symbol-defs.svg#icon-chevron-down" *ngIf="facetOpen === 'out'"></use>
			</svg>
		</div>
		<div [@accordion]="facetOpen">
			<div [@accordion2]="facetOpen" class="pt-2 fs-6">
				<div *ngFor="let tag of facet.tags" class="text-muted pt-1">
					{{tag.name}} &nbsp;( {{tag.count}} )
				</div>
			</div>
		</div>
	`,
	styleUrls: ['../add-gadget/styles.scss'],
	animations: [

		  trigger('accordion', [
				state('in', style({
					 height: '*',
					 display: 'block'
				})),
				state('out', style({
					 opacity: '0',
					 height: '0px',
					 display: 'none'
				})),
				transition('in => out', animate('300ms ease-in-out')),
				transition('out => in', animate('300ms ease-in-out'))
		  ]),
		  trigger('accordion2', [
				state('in', style({
					 height: '*',
					 display: 'block'
				})),
				state('out', style({
					 opacity: '0',
					 height: '0px',
					 display: 'none'
				})),
				transition('in => out', animate('300ms ease-in-out')),
				transition('out => in', animate('300ms ease-in-out'))
		  ])
	 ]
})
export class FacetComponent implements OnInit {
	 @Output() tagSelectEvent: EventEmitter<any> = new EventEmitter();
	 @Input() facet: Facet;
	 @Input() openFacet: boolean;

	 facetOpen: string;

	 constructor() {
	 }

	 ngOnInit() {
		  if (this.openFacet) {
				this.facetOpen = 'in';
		  }else {
				this.facetOpen = 'out';
		  }
	 }

	 toggleAccordion() {
		  this.facetOpen = this.facetOpen === 'out' ? 'in' : 'out';

	 }

	 tagSelect(tagName) {
		  this.tagSelectEvent.emit(tagName);
	 }

}
