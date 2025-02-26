/**
 * Created by jayhamilton on 2/5/17.
 */
import {AfterViewInit, Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {PropertyBase} from './property-base';

import {
    style, trigger, animate, transition
} from '@angular/animations';

@Component({
    moduleId: module.id,
    selector: 'app-df-property',
    templateUrl: './dynamic-form-property.component.html',
    styleUrls: ['./styles-props.css'],
    animations: [

        trigger(
            'showHideAnimation',
            [
                transition(':enter', [   // :enter is alias to 'void => *'
                    style({opacity: 0}),
                    animate(750, style({opacity: 1}))
                ]),
                transition(':leave', [   // :leave is alias to '* => void'
                    animate(750, style({opacity: 0}))
                ])
            ])
    ]
})
export class DynamicFormPropertyComponent {
    @Input() property: PropertyBase<any>;
    @Input() form: FormGroup;
    @Input() gadgetTags: any[];//todo - use to control what endpoints are displayed
    endPoints: string[] = [];

    get isValid() {

        return this.form.controls[this.property.key].valid;
    }

    constructor() {

        this.updateEndPointList();
    }

    updateEndPointList() {

    }

}
