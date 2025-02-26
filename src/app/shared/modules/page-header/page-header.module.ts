import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SvgIconModule } from '../svg-icon/svg-icon.module';
import { PageHeaderComponent } from './page-header.component';

@NgModule({
    imports: [CommonModule, RouterModule, SvgIconModule],
    declarations: [PageHeaderComponent],
    exports: [PageHeaderComponent, SvgIconModule]
})
export class PageHeaderModule {}
