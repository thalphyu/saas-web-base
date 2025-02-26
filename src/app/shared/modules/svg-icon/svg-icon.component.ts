import { Component, OnInit, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'svg-icon',
    templateUrl: './svg-icon.component.html',
    styleUrls: ['./svg-icon.component.scss']
})
export class SvgIconComponent {
    @Input() svgicon: string;
    @Input() iClass: string;
    constructor() {}

}
