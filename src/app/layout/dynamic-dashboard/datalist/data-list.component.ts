import {Component, ContentChild, Input, TemplateRef} from '@angular/core';
import {Facet} from '../facet/facet-model';
import { Globals } from '../../../globals';

@Component({
	selector: 'app-data-list',
	moduleId: module.id,
	templateUrl: './view.html',
	styleUrls: ['../add-gadget/styles.scss']
})
export class DataListComponent {
	globals: Globals;
	@Input() objectList: any[];
	@Input() objectTitleList: string[];
	@Input() placeHolderText: string;
	@Input() layoutColumnOneWidth: string;
	@Input() layoutColumnTwoWidth: string;
	@Input() listHeader: string;
	@Input() typeAheadIsInMenu: boolean;
	@Input() facetTags: Array<Facet>;

	@ContentChild(TemplateRef,{static:false}) template: TemplateRef<any>;

	color = 'white';
	filterTag;
	objectListCopy: any[] = [];
	options = { autoHide: false };

	constructor(globals: Globals){
		this.globals = globals;
	}

	filterListByTags(filterList: string[]) {

		this.copyObjectList();
		this.objectList = this.objectListCopy.filter(object => {

			let tagFound = false;

			if (!filterList.length) {
				return true;
			} else {
				object.tags.forEach(tag => {

					filterList.forEach(filter => {

						if (tag.name.toLocaleLowerCase() === filter.toLocaleLowerCase()) {
							tagFound = true;
						}
					});
				});

				return tagFound;
			}
		});

	}

	filterListBySearchString(searchString: string) {

		this.copyObjectList();
		this.objectList = this.objectListCopy.filter(object => {

			if (searchString.localeCompare('') === 0) {
				return true;
			} else {

				if (object.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1) {

					return true;
				}
			}

		});
	}

	/**
	 * todo - find a better way to manage the list that is displayed and filtered.
	 */
	copyObjectList() {
		if (this.objectListCopy.length === 0) {
			this.objectList.forEach(item => {
				this.objectListCopy.push(item);
			});
		}
	}
}

