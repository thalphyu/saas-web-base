import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SvgIconComponent } from './svg-icon.component';

@NgModule({
    imports: [CommonModule, RouterModule],
    declarations: [SvgIconComponent],
    exports: [SvgIconComponent]
})
export class SvgIconModule {}
