import {Component, Output, EventEmitter,Inject, LOCALE_ID,ElementRef,  ViewChild} from '@angular/core';
import {GadgetInstanceService} from './grid.service';
import {ConfigurationService} from '../services/configuration.service';
import {GadgetConfigModel} from '../gadgets/_common/gadget-config-model';
import {AddGadgetService} from '../add-gadget/service';
import {ToastService} from '../toast/toast.service';
import {MenuEventService} from '../menu/menu-service';
import { formatDate } from '@angular/common';
import { Globals } from '../../../globals';
import {Router} from '@angular/router';
import { LocalStorageService,TreeserviceService } from '../../../core';
import { FormBuilder ,FormControl} from '@angular/forms';
import { IEvent } from '../menu/IEvent';
import { Globalfunction } from '../../../core/global/globalfunction';
declare let jQuery: any;
@Component({
    moduleId: module.id,
    selector: 'app-grid-component',
    templateUrl: './grid.html',
    styleUrls: ['./grid.scss']
})
export class GridComponent {
    public globalFunction: Globalfunction = new Globalfunction();
    @Output() boardUpdateEvent: EventEmitter<any> = new EventEmitter();

    model: any = {};
    noGadgets = true;
    dashedStyle: any = {};
    dropZone1: any = null;
    dropZone2: any = null;
    dropZone3: any = null;

    gadgetLibrary: any[] = [];

    /** todo
     * Temporary objects for experimenting with AI
     *
     * @type
     */

    gridInsertionPosition = {
        x: 0,
        y: 0
    };

    /**
     * Todo - split model and board operations. This class should really focus on an individual board model's operations
     * within the grid. The board specific operations should be moved to the board component.
     *
     * @param _gadgetInstanceService
     * @param _procmonConfigurationService
     */

    public dateValue: Date = new Date();
    public attDate;
    public attMonth;
    globals: Globals;
	DepiD: any = null;
    greetingName = '';
    greetingMessage = '';

    menulist: string;
    menuobj: any;

    @Output() sideOpenEvent = new EventEmitter<boolean>();
    public checkedKeys: any[] = [];
    viewMenuForm = this.fb.group({
		Type: ['true'],
		Include_Resign: [false],
		Include_Active: [true],
		Include_Inactive: [false],
		Resign_MonthOnly: [false],
		OrderbyDept: [true],
		OrderByDesign: [false],
		Dval: [''],
		DepartmentID: [null],
		Date: [new Date()],
		AttMonth : [new Date()],
        CompanyID: [null],
        Resign_CustomPeriod: [false],
        Fromdate: new FormControl(''),
        Todate: new FormControl('')
     });
     public authData = JSON.parse(this._localStorageService.getItem('authorizationData'));
     public showdb = false;

    constructor(private _gadgetInstanceService: GadgetInstanceService,
                private _configurationService: ConfigurationService,
                private _gadgetLibraryService: AddGadgetService,
                private _toastService: ToastService,
                private _menuEventService: MenuEventService,
                @Inject(LOCALE_ID) private locale: string,
                globals: Globals,
                private _router: Router,
                private _localStorageService: LocalStorageService,
                private treeservice: TreeserviceService,
                public fb: FormBuilder) {
        this.globals = globals;
        let empname = this.authData.userName;
        let empnamearray: any = [];
        empnamearray = empname.split(' ');
        empname = empnamearray[0];
        if(empname === 'U' || empname === 'Daw' || empname === 'Mr' || empname === 'Ms' || empname === 'Mrs' || empname === 'Mg' || empname === 'Ma')
        {
            empname = empnamearray[1];
        }
        this.greetingName = 'Hello ';
        this.greetingName = this.greetingName.concat(empname);
        const today = new Date();
        const curHr = today.getHours();
        if (curHr < 12){
            this.greetingMessage = 'Good Morning';
        }else if (curHr < 18){
            this.greetingMessage = 'Good Afternoon';
        } else{
            this.greetingMessage = 'Good Evening';
        }
        if(this.authData.packagetype === 4)
        {
            this.showdb = false;
        }
        else
        {
            this.showdb = true;
        }
        if(this.showdb)
        {
            this.removeOldListeners();
            this.setupEventListeners();
            this.initializeBoard();
            this.getGadgetLibrary();


            this.attDate = formatDate(this.dateValue, 'yyyy-MM-dd', this.locale);
            this.attMonth = formatDate(this.dateValue, 'yyyy-MM', this.locale);
            this._localStorageService.setItemString('changeDate',this.attDate);
            this._localStorageService.setItemString('changeMonth',this.attMonth);
        }



    }

    /**
     * todo - This is a temporary attempt to avoid emitting events from stale listeners.
     * Most severe symptom is when you drill down and then change the layout.
     * Multiple events are triggered per action due to the services not
     * getting destroyed when coming into the main board from a child route. The end result is multiple gadget instances
     * appearing. The following code improves the condition but there still are issues with multiple gadgets appearing
     * when changing the layout.
     *
     */
    public onChange(value: Date): void {
        this.attDate = formatDate(value, 'yyyy-MM-dd',this.locale);
        this.attMonth = formatDate(value, 'yyyy-MM', this.locale);
        this._localStorageService.setItemString('changeDate',this.attDate);
        this._localStorageService.setItemString('changeMonth',this.attMonth);
        this.loadBoard(this.model.title);
	}
    removeOldListeners(){

        this._gadgetInstanceService.unSubscribeAll();
        this._menuEventService.unSubscribeAll();

    }

    setupEventListeners() {

        const gadgetRemoveEventSubscriber = this._gadgetInstanceService.listenForInstanceRemovedEventsFromGadgets().subscribe((message: string) => {
            this.saveBoard('Gadget Removed From Board: ' + message, false);
        });


        const menuEventSubscriber = this._menuEventService.listenForMenuEvents().subscribe((event: IEvent) => {
            const edata = event.data;

            switch (event.name) {
                case 'boardChangeLayoutEvent':
                    this.updateBoardLayout(edata);
                    break;
                case 'boardSelectEvent':
                    this.loadBoard(edata);
                    break;
                case 'boardCreateEvent':
                    this.createBoard(edata);
                    break;
                case 'boardEditEvent':
                    this.editBoard(edata);
                    break;
                case 'boardDeleteEvent':
                    this.deleteBoard(edata);
                    break;
                case 'boardAddGadgetEvent':
                    this.addGadget(edata);
                    break;
                case 'boardAIAddGadgetEvent':
                    this.addGadgetUsingArtificialIntelligence(edata);
                    break;
            }
        });

        this._gadgetInstanceService.addSubscriber(gadgetRemoveEventSubscriber);
        this._menuEventService.addSubscriber(menuEventSubscriber);

    }

    /**
     *
     * This is experimental code that deals with AI
     */
    getGadgetLibrary() {
        this.menulist =this.globalFunction.decryptDataClient(this._localStorageService.getItem('menuList'));
        if(this.menulist === undefined){
            this._router.navigate(['/login']);
          }
		this.menuobj = JSON.parse(this.menulist);
        this._gadgetLibraryService.getGadgetLibrary().subscribe(data => {
            this.gadgetLibrary.length = 0;
            const me = this;
            data.library.forEach((item) =>{
                // for (let i = 0; i < me.menuobj.length; i++) {
                    for(const i of me.menuobj) {
                    const keyname = i.MenuName;
                    if (keyname === item.name) {
                        me.gadgetLibrary.push(item);
                    }
                }

            });
        });
    }

    getGadgetFromLibrary(gadgetType: string) {

        let gadgetObject = null;
        this.gadgetLibrary.forEach(gadget => {


            if (gadgetType.localeCompare(gadget.componentType) === 0) {

                gadgetObject = gadget;
            }
        });
        return gadgetObject;
    }

    addGadgetUsingArtificialIntelligence(aiObject: any) {

        /** todo
         * make confidence code configurable
         */
        if (aiObject && aiObject.operation) {
            switch (aiObject.operation) {
                case 'get_storage':
                    this.addGadget(this.getGadgetFromLibrary('StorageObjectListComponent'));
                    break;
                case 'get_cpu':
                    this.addGadget(this.getGadgetFromLibrary('CPUGadgetComponent'));
                    break;
            }
        }
    }

    /**
     * This is the end of the experimental AI code.
     */

    updateGadgetPositionInBoard($event, columnNumber, rowNumber, type) {
        let moveComplete = false;

        this.getModel().rows.forEach(row => {

            let colpos = 0;

            row.columns.forEach(column => {

                let gadgetpos = 0;

                if (column.gadgets) {

                    column.gadgets.forEach(_gadget => {

                        if (_gadget.instanceId === $event.dragData && !moveComplete) {

                            const gadget = column.gadgets.splice(gadgetpos, 1);


                            if (!this.getModel().rows[rowNumber].columns[columnNumber].gadgets) {
                                this.getModel().rows[rowNumber].columns[columnNumber].gadgets = [];
                            }
                            this.getModel().rows[rowNumber].columns[columnNumber].gadgets.push(gadget[0]);
                            this.saveBoard('drag drop operation', false);
                            moveComplete = true;
                        }
                        gadgetpos++;
                    });
                    colpos++;
                }
            });
        });
    }

    public createBoard(name: string) {
        this.loadNewBoard(name);
    }

    public editBoard(name: string) {

    }

    public deleteBoard(name: string) {

        this._configurationService.deleteBoard(name).subscribe(data => {

             this.initializeBoard();

            },
            error => console.error('Deletion error', error));

    }

    public addGadget(gadget: any) {

        const Gadget = Object.assign({}, gadget);

        Gadget.instanceId = new Date().getTime();
        Gadget.config = new GadgetConfigModel(gadget.config);

        this.setGadgetInsertPosition();

        const x = this.gridInsertionPosition.x;
        const y = this.gridInsertionPosition.y;

        if (!this.getModel().rows[x].columns[y].gadgets) {

            this.getModel().rows[x].columns[y].gadgets = [];
        }
        this.getModel().rows[x].columns[y].gadgets.push(Gadget);

        this.saveBoard('Adding Gadget To The Board', false);

    }

    public updateBoardLayout(structure) {


        // user selected the currently selected layout
        if (structure.id === this.getModel().id) {
            return;
        }

        // copy the current board's model
        const boardModel = Object.assign({}, this.getModel());

        // get just the columns that contain gadgets from all rows
        const originalColumns: any[] = this.readColumnsFromOriginalModel(boardModel);

        // reset the copied model's rows, which include columns
        boardModel.rows.length = 0;

        // copy the contents of the requested structure into the temporary model
        // we now have a board model we can populate with the original board's gadgets
        Object.assign(boardModel.rows, structure.rows);
        boardModel.structure = structure.structure;
        boardModel.id = structure.id;

        let originalColumnIndexToStartProcessingFrom = 0;

        /* For each column from the original board, copy its gadgets to the new structure.
         The requested layout may have more or less columns than defined by the original layout. So the fillGridStructure method
         will copy column content into the target. If there are more columns than the target,
         the fillGridStructure will return the count of remaining columns to be processed and then process those.
         */
        while (originalColumnIndexToStartProcessingFrom < originalColumns.length) {
            originalColumnIndexToStartProcessingFrom = this.fillGridStructure(boardModel, originalColumns, originalColumnIndexToStartProcessingFrom);
        }

        // This will copy the just processed model and present it to the board
        this.setModel(boardModel);

        // clear temporary object
        for (const member of  boardModel) {
            delete  boardModel[member];
        }

        // persist the board change
        this.saveBoard('Grid Layout Update', false);
    }

    private updateGridState() {

        let gadgetCount = 0;

        if (this.getModel().rows) {
            this.getModel().rows.forEach((row)=>{
                row.columns.forEach((column)=> {
                    if (column.gadgets) {
                        column.gadgets.forEach((gadget) =>{
                            gadgetCount++;
                        });
                    }
                });
            });
        }

        this.noGadgets = !gadgetCount;

        this.dashedStyle = {
            'border-style': this.noGadgets ? 'dashed' : 'none',
            'border-width': this.noGadgets ? '2px' : 'none',
            'border-color': this.noGadgets ? 'darkgray' : 'none',
            padding: this.noGadgets ? '5px' : 'none'
        };
    }

    private readColumnsFromOriginalModel(_model) {

        const columns = [];
        _model.rows.forEach((row)=> {
            row.columns.forEach((col)=> {
                columns.push(col);
            });
        });
        return columns;

    }

    private fillGridStructure(destinationModelStructure, originalColumns: any[], counter: number) {

        const me = this;

        destinationModelStructure.rows.forEach((row)=> {
            row.columns.forEach((destinationColumn)=> {
                if (!destinationColumn.gadgets) {
                    destinationColumn.gadgets = [];
                }
                if (originalColumns[counter]) {
                    me.copyGadgets(originalColumns[counter], destinationColumn);
                    counter++;
                }
            });
        });

        return counter;

    }

    private copyGadgets(source, target) {

        if (source.gadgets && source.gadgets.length > 0) {
            let w = source.gadgets.shift();
            while (w) {
                target.gadgets.push(w);
                w = source.gadgets.shift();
            }
        }
    }

    public enableConfigMode() {

        this._gadgetInstanceService.enableConfigureMode();
    }

    private initializeBoard() {

        this._configurationService.getBoards().subscribe(data => {

            if (data && data instanceof Array && data.length > 0) {

                const sortedBoard = data.sort((a, b) => a.boardInstanceId - b.boardInstanceId);

                this.loadBoard(sortedBoard[0].title);
            } else {
                this.loadDefaultBoard();
            }
        });
    }

    private loadBoard(boardTitle: string) {
        this.clearGridModelAndGadgetInstanceStructures();

        this._configurationService.getBoardByTitle(boardTitle).subscribe(board => {

                this.setModel(board);
                this.updateServicesAndGridWithModel();
                this.boardUpdateEvent.emit(boardTitle);
            },
            error => {
                console.error(error);
                this.loadDefaultBoard();

            });

    }

    private loadDefaultBoard() {
        this.clearGridModelAndGadgetInstanceStructures();

        this._configurationService.getDefaultBoard().subscribe(board => {

            this.setModel(board);
            this.updateServicesAndGridWithModel();
            this.saveBoard('Initialization of a default board', true);


        });
    }

    private loadNewBoard(name: string) {

        this.clearGridModelAndGadgetInstanceStructures();

        this._configurationService.getDefaultBoard().subscribe(res => {

            this.setModel(res);
            this.getModel().title = name;
            this.getModel().boardInstanceId = new Date().getTime();

            this.updateServicesAndGridWithModel();
            this.saveBoard('grid create default Initialization of a new board', true);


        });
    }

    private updateServicesAndGridWithModel() {
        this._gadgetInstanceService.setCurrentModel(this.getModel());
        this._configurationService.setCurrentModel(this.getModel());
        this.updateGridState();
    }

    private saveBoard(operation: string, alertBoardListenerThatTheMenuShouldBeUpdated: boolean) {
        this.updateServicesAndGridWithModel();

        this._configurationService.saveBoard(this.getModel()).subscribe(result => {

                this._toastService.sendMessage(this.getModel().title + ' has been updated!', '');

                if (alertBoardListenerThatTheMenuShouldBeUpdated) {
                    this._menuEventService.raiseGridEvent({name: 'boardUpdateEvent', data: this.getModel().title});
                }
            },
            error => console.error('Error' + error));

    }

    private clearGridModelAndGadgetInstanceStructures() {
// clear gadgetInstances
        this._gadgetInstanceService.clearAllInstances();
// clear current model
        for (const prop in this.getModel()) {
            if (this.model.hasOwnProperty(prop)) {
                delete this.model[prop];
            }
        }
    }

    private setGadgetInsertPosition() {

        for (let x = 0; x < this.getModel().rows.length; x++) {

            for (let y = 0; y < this.getModel().rows[x].columns.length; y++) {

                if (this.getModel().rows[x].columns[y].gadgets && this.getModel().rows[x].columns[y].gadgets.length === 0) {

                    this.gridInsertionPosition.x = x;
                    this.gridInsertionPosition.y = y;
                    return;

                }
            }
        }
// we go here because the board is either empty or full
// insert in the top left most cell
        this.gridInsertionPosition.y = 0;

        if (this.noGadgets) {
            // there are no gadgets so insert in top row
            this.gridInsertionPosition.x = 0;
        } else {
            // board is full so insert in the last row
            this.gridInsertionPosition.x = this.getModel().rows.length - 1;
        }
    }

    public setModel(model: any) {

        this.model = Object.assign({}, model);
    }

    public getModel() {
        return this.model;
    }



    sidePanelToggle($event: Event) {
		$event.stopPropagation();
		this.globals.sideOpen = !this.globals.sideOpen;
		this.sideOpenEvent.emit(this.globals.sideOpen);
		$('body').addClass('scrollblock');
    }

	 getFormData(event)
	 {
		this.viewMenuForm.controls.DepartmentID.reset(event.DepartmentID);
        this.viewMenuForm.controls.CompanyID.reset(event.CID);
        this.viewMenuForm.controls.Date.reset(this.attDate);
        this.viewMenuForm.controls.AttMonth.reset(this.attMonth);
        const selectedData = JSON.stringify(this.viewMenuForm.value);
        this._localStorageService.setItemString('selectTreeViewEvent',selectedData);
        this.loadBoard(this.model.title);
	 }

	 getViewMenu(event)
	 {
	   this.viewMenuForm.controls.Type.reset(event.Type);
	   this.viewMenuForm.controls.Include_Resign.reset(event.Include_Resign);
	   this.viewMenuForm.controls.Include_Active.reset(event.Include_Active);
	   this.viewMenuForm.controls.Include_Inactive.reset(event.Include_Inactive);
	   this.viewMenuForm.controls.Resign_MonthOnly.reset(event.Resign_MonthOnly);
	   this.viewMenuForm.controls.OrderbyDept.reset(event.OrderbyDept);
       this.viewMenuForm.controls.OrderByDesign.reset(event.OrderByDesign);
       this.viewMenuForm.controls.Resign_CustomPeriod.reset(event.Resign_CustomPeriod);
	 }

	 getcheckedKeys(event) {
		this.checkedKeys = event;
      }

      emitBoardAddGadgetEvent(event) {
        this._menuEventService.raiseMenuEvent({name: 'boardAddGadgetEvent', data: event});
    }



}
