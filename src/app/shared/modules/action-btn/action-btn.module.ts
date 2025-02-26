import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SvgIconModule } from '../svg-icon/svg-icon.module';
import { ActionBtnComponent } from './action-btn.component';

@NgModule({
    imports: [CommonModule, RouterModule, NgbModule, SvgIconModule],
    declarations: [ActionBtnComponent],
    exports: [ActionBtnComponent]
})
export class ActionBtnModule {}
