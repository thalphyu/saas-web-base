import { ModalDialogService } from './core/services/dialog.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RouterModule, Router } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { DialogComponent } from './dialog/dialog.component';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import * as $ from 'jquery';
import { Globals } from './globals';
import { MatExpansionModule } from '@angular/material/expansion';
import {NgxImageCompressService} from 'ngx-image-compress';

// AoT requires an exported function for factories
export const createTranslateLoader = (http: HttpClient) =>
    /* for development
    return new TranslateHttpLoader(
        http,
        '/start-angular/SB-Admin-BS4-Angular-6/master/dist/assets/i18n/',
        '.json'
    ); */
     new TranslateHttpLoader(http, './assets/i18n/', '.json')
;

@NgModule({
    imports: [
        CoreModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        RouterModule,
        AppRoutingModule,
        SharedModule,
        LoadingBarHttpClientModule,
        LoadingBarRouterModule,
        MatExpansionModule
    ],
    exports: [RouterModule],
    declarations: [
        AppComponent,
        DialogComponent
    ],
    providers: [
        AuthGuard,
        ModalDialogService,
        Globals,
        NgxImageCompressService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent],
    entryComponents: [ DialogComponent ],
})
export class AppModule {}
