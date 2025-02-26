import { NgModule } from '@angular/core';
import { BoardsConfigurationTabComponent } from './tab-boards/boards-configuration-tab.component';
import { DndModule } from 'ng2-dnd';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OptionsConfigurationTabComponent } from './tab-options/options-configuration-tab.component';
import { ConfigurationComponent } from './configuration-component';
import { OptionsService } from './tab-options/service';
import { SharedModule } from '../../../shared';

@NgModule({
    imports: [
        DndModule.forRoot(),
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatSlideToggleModule,
        MatChipsModule,
        SharedModule
    ],
    declarations: [
        BoardsConfigurationTabComponent,
        OptionsConfigurationTabComponent,
        ConfigurationComponent
    ],
    providers: [
        OptionsService
    ],
    exports: [
        BoardsConfigurationTabComponent,
        OptionsConfigurationTabComponent,
        ConfigurationComponent,
        MatSlideToggleModule
    ]
})
export class ConfigurationModule {
}
