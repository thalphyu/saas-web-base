import {NgModule} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DndModule } from 'ng2-dnd';
import { GadgetModule } from '../gadgets/gadget.module';
import { ConfigurationModule } from '../configuration/configuration.module';
import { LayoutModule } from '../layout-dashboard/layout.module';
import { AddGadgetModule } from '../add-gadget/add-gadget.module';
import { NotificationModule } from '../notification/notification.module';
import { GadgetPropertyService } from '../gadgets/_common/gadget-property.service';
import { ConfigurationService } from '../services/configuration.service';
import { RuntimeService } from '../services/runtime.service';
import { ObservableWebSocketService } from '../services/websocket-service';
import { TypeAheadInputModule } from '../typeahead-input/typeahead-input.module';
import { MenuComponent } from './menu.component';
import { MenuEventService } from './menu-service';
import { AboutModule } from '../about/about.module';
import { BoardModule } from '../board/board.module';
import { SharedModule } from '../../../shared';

@NgModule({
    imports: [
        NotificationModule,
        AddGadgetModule,
        LayoutModule,
        AboutModule,
        ConfigurationModule,
        TypeAheadInputModule,
        GadgetModule,
        DndModule.forRoot(),
        MatButtonModule, MatIconModule,
        BoardModule,
        SharedModule
    ],
    providers: [
        RuntimeService,
        ConfigurationService,
        GadgetPropertyService,
        ObservableWebSocketService,
        MenuEventService
    ],
    declarations: [
        MenuComponent
    ],
    exports: [
        MenuComponent
    ]
})
export class MenuModule {
}
