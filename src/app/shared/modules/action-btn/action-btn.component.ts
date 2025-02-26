import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'action-btn',
	templateUrl: './action-btn.component.html',
	styleUrls: ['./action-btn.component.scss']
})
export class ActionBtnComponent {
	@Input() btnType = 'submit';
	@Input() btnClass = 'btn-primary btn-icon btn-sm';
	@Input() textTooltip: string;
	@Input() btnSvgicon: string;
	@Input() btniClass: string;
	@Input() btnText: string;
	@Input() disableFlag = 'false';

	@Output() byClick = new EventEmitter<any>();

	onClickButton(event) {
		if(event === undefined)
			{this.byClick.emit();}
		else
			{this.byClick.emit(event);}
	}
	constructor() {}

	/*isValid(str: string) {
		return typeof str !== 'undefined' && str !== null;
	}*/
}
