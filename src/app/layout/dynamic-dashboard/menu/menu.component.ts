import {Component, ElementRef, Output, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {ConfigurationService} from '../services/configuration.service';
import {MenuEventService} from './menu-service';
import {environment} from '../../../../environments/environment';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';
import { OptionsService } from '../configuration/tab-options/service';
import { Globalfunction } from '../../../core/global/globalfunction';
import { Globals } from '../../../globals';
import {LocalStorageService} from '../../../core';
import { IEvent } from './IEvent';
import { ApplicationOptionService } from '../../../core/services/application-option.service';
declare let jQuery: any;


/**a
 * Menu component
 *
 */
@Component({
    moduleId: module.id,
    selector: 'app-menu-component',
    templateUrl: './view.html',
    styleUrls: ['../grid/grid.scss']

})
export class MenuComponent implements OnInit {
    @Output() sideOpenEvent = new EventEmitter<boolean>();
    public globalfunction: Globalfunction = new Globalfunction();
    host = window.location.host;
    dashboardSlideIndex = 0;
    dashboardList: any[] = [];
    selectedBoard = '';
    placeHolderText = 'Ask the board to do something!';
    searchList: Array<string> = [];
    env: any;
    dashboardSlide: any;
    globalOptions: any;
    POLL_INTERVAL = 60000;
    globals: Globals;

    @ViewChild('notificationSideBar_tag', {static: true}) notificationSideBarRef: ElementRef;
    @ViewChild('layoutSideBar_tag', {static: true}) layoutSideBarRef: ElementRef;
    @ViewChild('aboutSideBar_tag', {static: true}) aboutSideBarRef: ElementRef;
    //@ViewChild('stickymenu_tag', {static: true}) stickyMenuRef: ElementRef;

    notificationSideBar: any;
    layoutSideBar: any;
    aboutSideBar: any;
    stickyMenu: any;

    typeAheadIsInMenu = true;

    layoutId = 0;
    showdb = false;
    IsDDMS: any;
    public authData = JSON.parse(this._localStorageService.getItem('authorizationData'));
    constructor(private _configurationService: ConfigurationService,
                private _menuEventService: MenuEventService,
                protected _optionsService: OptionsService,
                globals: Globals,
                private _localStorageService: LocalStorageService) {

        this.globals = globals;
        this.env = environment;

        if(this.authData !== undefined)
        {
            this.IsDDMS = this.authData.IsDDMS;
            if(Number(this.authData.packagetype) === 4 || this.IsDDMS === '1')
            {
                this.showdb = false;
            }
            else
            {
                this.showdb = true;
            }
            if(this.showdb)
            {
                this._menuEventService.unSubscribeAll();
                this.setupEventListeners();
            }
        }


    }

    setupEventListeners() {
       const gridEventSubscription =  this._menuEventService.listenForGridEvents().subscribe((event: IEvent) => {
            const edata = event.data;

            switch (event.name) {
                case 'boardUpdateEvent':
                    this.updateDashboardMenu(edata);
                    break;
            }

        });

       this._menuEventService.addSubscriber(gridEventSubscription);

       this._optionsService.listenForGlobalOptionsChanges().subscribe(options=>{

            this.globalOptions = Object.assign({},options);
            if(this.globalOptions.enableSlide === false) {
                if(this.dashboardSlide)
                    {this.dashboardSlide.unsubscribe();}
            }
            else {
                this.startDashboardSlide();
            }
        });

        this.globalOptions = Object.assign({},(this._optionsService.getBoardOptions()));

    }

    ngOnInit() {
        if(this.showdb)
        {
            this.updateDashboardMenu('');
        }
        //this.stickyMenu = jQuery(this.stickyMenuRef.nativeElement);
        //this.stickyMenu.sticky();

        // if(this.globalOptions.enableSlide == true) {
        //     this.startDashboardSlide();
        // }
    }

    startDashboardSlide() {

        //this.dashboardSlide.unsubscribe();
        this.dashboardSlideIndex = 0;
        this.dashboardSlide = Observable.interval(this.POLL_INTERVAL)
            .subscribe((val) => {
                this.changeSlide();
            });
    }

    changeSlide() {
        if(this.dashboardList.length > 1) {
            this.dashboardSlideIndex += 1;
            this.dashboardSlideIndex = this.dashboardSlideIndex % this.dashboardList.length;
            //console.log(this.dashboardSlideIndex);
            this.emitBoardSelectEvent(this.dashboardList[this.dashboardSlideIndex]);
        }
    }

    sidePanelToggle($event: Event) {
        $event.stopPropagation();
        this.globals.sideOpen = !this.globals.sideOpen;
        this.sideOpenEvent.emit(this.globals.sideOpen);
        $('body').addClass('scrollblock');
    }

    emitBoardChangeLayoutEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardChangeLayoutEvent', data: event});
    }

    emitBoardSelectEvent(event) {
        this.boardSelect(event);
        this._menuEventService.raiseMenuEvent({name: 'boardSelectEvent', data: event});
    }

    emitBoardCreateEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardCreateEvent', data: event});
        this.updateDashboardMenu(event);
    }

    emitBoardEditEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardEditEvent', data: event});
        this.updateDashboardTitle(event);
    }

    emitBoardDeleteEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardDeleteEvent', data: event});
        this.updateDashboardMenu('');
    }

    emitBoardAddGadgetEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardAddGadgetEvent', data: event});
    }

    emitBoardAIAddGadgetEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardAIAddGadgetEvent', data: event});
    }

    updateDashboardMenu(selectedBoard: string) {
        this._configurationService.getBoards().subscribe(data => {

            const me = this;
            if (data && data instanceof Array && data.length) {
                this.dashboardList.length = 0;
                // sort boards
                data.sort((a: any, b: any) => a.boardInstanceId - b.boardInstanceId);

                data.forEach(board => {

                    me.dashboardList.push(board.title);

                });

                if (selectedBoard === '') {

                    this.boardSelect(this.dashboardList[0]);

                } else {

                    this.boardSelect(selectedBoard);
                }
            }
        });
    }

    updateDashboardTitle(dashboardnamechangeList: string[]) {
        let tmpselectBoard = '';
        const board_collection = {board: []};
        this._configurationService.getBoards().subscribe(data => {

            const me = this;
            if (data && data instanceof Array && data.length) {
                this.dashboardList.length = 0;
                // sort boards
                data.sort((a: any, b: any) => a.boardInstanceId - b.boardInstanceId);

                data.forEach(board => {
                    if(dashboardnamechangeList[1] === board.title) //equal to old board title  //change new board title
                    {
                        me.dashboardList.push(dashboardnamechangeList[0]);
                        board.title = dashboardnamechangeList[0];
                        tmpselectBoard = board.title;
                    }
                    else
                    {
                        me.dashboardList.push(board.title);
                    }

                    board_collection.board.push(board);

                });
                //save to localstorage
                this._localStorageService.removeItem('board');
                this._localStorageService.setItemString('board', JSON.stringify(board_collection));
                this._configurationService.saveBoardAfterDashboardTitleEdit(board_collection).subscribe(result => {
                },
                error => console.error(' Saving After Dashboard title Edit Error!' + error));
                this.updateDashboardMenu(tmpselectBoard);

            }
        });
    }

    boardSelect(selectedBoard: string) {
        this.selectedBoard = selectedBoard;
    }

    toggleLayoutSideBar() {
        this.layoutSideBar = jQuery(this.layoutSideBarRef.nativeElement);
        this.layoutSideBar.sidebar('setting', 'transition', 'overlay');
        this.layoutSideBar.sidebar('toggle');
        this.layoutId = this._configurationService.currentModel.id;
        document.body.classList.add('pushable');
    }

    toggleNotificationSideBar() {
        this.notificationSideBar = jQuery(this.notificationSideBarRef.nativeElement);
        this.notificationSideBar.sidebar('setting', 'transition', 'overlay');
        this.notificationSideBar.sidebar('toggle');
    }
    toggleAboutSideBar() {
        this.aboutSideBar = jQuery(this.aboutSideBarRef.nativeElement);
        this.aboutSideBar.sidebar('setting', 'transition', 'overlay');
        this.aboutSideBar.sidebar('toggle');
    }


    public showDocumentation() {

        window.location.href = 'http://' + window.location.host + 'assets/documentation/index.html';
    }

}
