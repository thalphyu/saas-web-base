import { Component, OnInit, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
    @Input() mainHeading: string;
    @Input() heading: string;
    @Input() subheading: string;
    @Input() icon: string;
    constructor() {}
}
