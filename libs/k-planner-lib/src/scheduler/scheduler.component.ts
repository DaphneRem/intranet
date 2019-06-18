import {
  Component,
  ViewChild,
  OnInit,
  SimpleChanges,
  Input,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  HostListener
} from "@angular/core";
import {NgForm} from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { App, User } from '../../../../apps/k-planner/src/app/+state/app.interfaces';
import * as moment from 'moment';
import swal from 'sweetalert2';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

// Syncfusion Imports
// Synfucion Bases
import { extend, closest, remove, createElement, addClass, L10n, loadCldr, isNullOrUndefined, Internationalization, removeClass } from '@syncfusion/ej2-base';
import { TooltipComponent, Position } from '@syncfusion/ej2-angular-popups';
import {
    DragAndDropEventArgs,
    BeforeOpenCloseMenuEventArgs,
    MenuEventArgs,
    Item,
    ItemModel,
    EJ2Instance
} from "@syncfusion/ej2-navigations";
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { ChangeEventArgs as DropDownChangeArgs } from '@syncfusion/ej2-angular-dropdowns';
import { TimePickerComponent } from '@syncfusion/ej2-angular-calendars';
// Syncfusion Angular
import { ButtonComponent, ChangeEventArgs } from '@syncfusion/ej2-angular-buttons';
import {
    TabComponent,
    SelectEventArgs,
    TreeViewComponent,
    MenuItemModel,
    ContextMenuComponent,
    SidebarComponent,
} from '@syncfusion/ej2-angular-navigations';
import {
    EventSettingsModel,
    View,
    GroupModel,
    WorkHoursModel,
    ResourceDetails,
    ScheduleComponent,
    ActionEventArgs,
    CellClickEventArgs,
    RenderCellEventArgs,
    EventRenderedArgs,
    TimeScaleModel,
    dataBinding,
    MonthAgendaService,
    Schedule,
    ResizeEventArgs,
    DragEventArgs,
    CellTemplateArgs,
    getWeekNumber,
    EventFieldsMapping,
    MonthService,
    DayService,
    WeekService,
    ResizeService,
    DragAndDropService
} from '@syncfusion/ej2-angular-schedule';

// Locale Data Imports


// Models Imports
import { HospitalData } from '../models/hospital-data';
import { ContainerKP } from '../models/container';
import { Workorder } from '../models/workorder';
import { Coordinateur } from '../models/coordinateur';

// Components Imports
import { WorkorderDetailsModalComponent } from '../workorder-details-modal/workorder-details-modal.component';
import { MonteursData } from '../models/monteurs-data';

// import { monteurs } from '../data/monteur';
import { element } from 'protractor';
import { SalleService } from '../services/salle.service';
import { CoordinateurService } from '../services/coordinateur.service';
import { ContainersService } from '../services/containers.service';
import { MonteursService } from '../services/monteurs.service';


import { WorkOrderService } from '../services/workOrder.service';
import { group } from '@angular/animations';
import { EventModel } from '../models/Events';
import { LibGroupeService } from '../services/libGroupe.service';
import { LibelleGroupe } from '../models/libelle-groupe';
import { DataManager, Query, ReturnOption } from '@syncfusion/ej2-data';
import { Grid } from '@syncfusion/ej2-angular-grids';
import { SpinSettingsModel } from "@syncfusion/ej2-splitbuttons";
import { splitClasses, ConditionalExpr } from "@angular/compiler";
import { CustomIconsModule } from "@ab/custom-icons";

const localeFrenchData = require('./scheduler-fr.json');
const numberingSystems = require('cldr-data/supplemental/numberingSystems.json');
const gregorian = require('cldr-data/main/fr-CH/ca-gregorian.json');
const numbers = require('cldr-data/main/fr-CH/numbers.json');
const timeZoneNames = require('cldr-data/main/fr-CH/timeZoneNames.json');

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames);

L10n.load(localeFrenchData);

@Component({
    selector: 'scheduler',
    templateUrl: './scheduler.component.html',
    styleUrls: [
        './scheduler.component.scss',
        '../../../../assets/icon/icofont/css/icofont.scss'
    ],
    providers: [
        SalleService,
        CoordinateurService,
        ContainersService,
        MonteursService,
        Store,
        WorkOrderService,
        MonthAgendaService,
        LibGroupeService,
        WeekService,
        DayService,
        MonthService,
        ResizeService, 
        DragAndDropService
    ]
})

export class SchedulerComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('scheduleObj')
    public scheduleObj: ScheduleComponent;
    
    @ViewChild('scheduleObjDay')
    public scheduleObjDay: ScheduleComponent;
    @ViewChild('tooltip')
    public control: TooltipComponent;
  
    @ViewChild('treeObj')
    public treeObj: TreeViewComponent;
    @ViewChild('treeObjMonteur')
    public treeObjMonteur: TreeViewComponent;
    @ViewChild('toggleBtn')
    public toggleBtn: ButtonComponent;
    @ViewChild('togglebtnslide')
    public togglebtnslide: ButtonComponent;
    @ViewChild('element')
    public tabInstance: TabComponent;
    @ViewChild('contentmenutree')
    public contentmenutree: ContextMenuComponent;
    @ViewChild('sidebar')
    public sidebar: SidebarComponent;
    public type: string = 'Push';
    public target: string = '.content';
    @ViewChild('ejStartTimePicker')
    public ejStartTimePicker: TimePickerComponent;
    @ViewChild('ejEndTimePicker')
    public ejEndTimePicker: TimePickerComponent;
    @ViewChild('panzoomDiv') panzoomDiv: ElementRef;


    private onDestroy$: Subject<any> = new Subject();

    public dataAllEventsReady = false;
    public dataRegieReady = false;
    public activeViewTimelineDay: ScheduleComponent;
    /******** STORE *******/
    public user: User;
    public currentCoordinateur: Coordinateur;
    public allCoordinateurs: Coordinateur[];

    /******** SCHEDULER INIT *******/
    public rowAutoHeight: Boolean = false;
    public dataContainersByRessourceStartDateEndDate;
    public containerData: EventModel[] = [];
    public workOrderData: EventModel[] = [];
    // public selectedDate: Date = new Date();
    public selectedDate: Date = moment().toDate();
    public data: EventModel[] = <EventModel[]>extend([], this.containerData, null, true);
    public temp

    public eventSettings: EventSettingsModel = {
        dataSource: <Object[]>extend([], this.calculDateAll(this.data, false, null, false, false), null, true),
        // fields: {
        //     subject: { title: 'Patient Name', name: 'Name' },
        //     startTime: { title: 'From', name: 'StartTime' },
        //     endTime: { title: 'To', name: 'EndTime' },
        //     description: { title: 'description', name: 'Description' }
        // }
        fields: {
            subject: { name: 'Name', validation: { required: [true, 'Ce champ est requis'] } },
            description: {
                name: 'Commentaire_Planning',
                //     // {
                //     // name: 'Description', validation: {
                //     //     required: true, minLength: 5, maxLength: 500
                //     // }
            },
            startTime: { name: 'StartTime', validation: { required: true } },
            endTime: { name: 'EndTime', validation: { required: true } },

        },
        enableTooltip: true, tooltipTemplate: this.temp
    };
    public eventClick = false;
    public btnRegieMessageAll
    public colorReadOnly
    public currentView: View = 'TimelineDay';
    public workHours: WorkHoursModel = { start: '07:00', end: '23:00', highlight: true };
    public weekNumber = true
    public cssClass: string = 'custom';
    public readonly: boolean = true;

    public openEditorCount = 0;
    public creationArray = [];
    public newData = [];
    public startHour: string = '00:00';
    public endHour: string = '01:00';
    public timeScale: TimeScaleModel = { enable: true, interval: 60, slotCount: 2 };

    public colorStatut: Object[] = [
        // { Id: 0, Color: '#B01106' },
        // { Id: 1, Color: '#F96C63' },
        // { Id: 2, Color: '#F0AC2C' },
        { Id: 3, Color: '#F3BE09' }, //  STATUT_A_AFFECTER
        // { Id: 4, Color: '#B01106' },
        // { Id: 5, Color: '#F96C63' },
        { Id: 6, Color: '#3ba506' }, //  STATUT_TERMINE_OK 
        { Id: 7, Color: '#B01106' }, //   STATUT_TERMINE_KO 
        { Id: 8, Color: '#F39009' }, //   STATUT_EN_ATTENTE
        // { Id: 9, Color: '#3ba506' },
        // { Id: 10, Color: '#3ba506' },//  STATUT_TACHES_OK
        // { Id: 11, Color: '#3ba506' },
        // { Id: 12, Color: '#3ba506' },
        // { Id: 13, Color: '#3ba506' }
    ]
    // BACKLOGS INIT
    public waitingList;
    public headerText: Object = [{ 'text': 'WorkOrder' }, { 'text': 'Operateur' }];
    public menuItems: MenuItemModel[] = [
        {
            text: 'Supprimer',
            iconCss: 'e-icons delete',
        }
    ];

    public monteurDataSource: MonteursData[];
    public timelineResourceDataOut = [];
    public dataMonteur: MonteursData[] = <MonteursData[]>extend([], this.monteurDataSource, null, true);
    public dataRegie;
    public field: Object = {
        dataSource: this.workOrderData,
        id: 'Id',
        text: 'Name',
        description: 'Commentaire_Planning'
    };
    public fieldMonteur: Object;
    public isClicked: boolean = false;
    public isnotMyGroup: boolean = false;
    public draggedItemId: string = '';

    public group: GroupModel = { enableCompactView: false, resources: ['Departments'] };
    public allowMultiple: Boolean = false;
    public filteredData: Object;
    public color: string = '#ea7a57'
    public cancelObjectModal = false;
    public salleDataSource;
    public containersPlanning;
    public departmentDataSource: Object[] = [];
    public departmentDataSourceAll: Object[] = [];
    public departmentGroupDataSource: Object[] = [];
    public allRegies: Object[] = [];
    public idExisting = [];
    public libGroupe: LibelleGroupe[] = []
    public lastRandomId;

    public WorkorderByContainerId;
    public codegroupe;
    public libelleGroupe
    public filtermonteurListeArray;
    public addMonteur: boolean;
    public fieldArray = this.field['dataSource'];
    public isDragged: boolean;
    public newField;
    public wOrderBackToBacklog;
    public isAddedToBacklog: boolean;
    public count: number = 0;
    public groupeCharger: number;
    public workOrderColor: string;
    // public SelectDateDebut: Date = new Date();
    // public SelectDateFin: Date = new Date();
    public SelectDateDebut: Date = new Date(2019, 0, 1);
    public SelectDateFin: Date = new Date(2019, 11, 31);
    public startofWeek
    public endofWeek
    public startofMonth
    public endofMonth
    public startofDay
    public endofDay
    // public SelectDateFin: Date = new Date(this.SelectDateDebut.getDate() + 1);    
    public weekInterval: number = 1;
    public intervalValue: string = '120'
    public intervalValueDay: string = '60'
    public intervalData: string[] = ['10', '20', '30', '40', '50', '60']

    public instance: Internationalization = new Internationalization();

    // Editor
    public drowDownMonteurs;

    // EDIT EVENT CONFIG
    public drowDownOperateurList;

    public monteurListe: MonteursData[] = [];

    public isDelete: boolean;
    public fieldArrayMonteur;
    public fieldMonteurDSource;
    public drowDownExist = false;

    public WorkOrderByidgroup;
    public statut;
    public allDataContainers = [];
    public refreshDateStart;
    public refreshDateEnd;
    public ajoutMonteur
    public monteurListArray
    public countAdd: number = 0
    public nameService: string = 'Mon planning'
    public comptText
    public filtre: boolean
    public open
    public elementDelete
    // ALL ACTIONS
    public isTreeItemDropped: boolean = false; // drag and drop wworkorder
    public isTreeItemDroppedMonteur: boolean = false; // drag and drop operateur
    public zoomCont: number = 0
    public valueMax: number = 85
    public value: number = 90
    public valueAdd: number =10
    public refreshF4 : boolean
    public navigation: boolean = false
    // public fistCallAction: boolean = false;
    // public deleteWorkorderAction: boolean = false;
    // public deleteContainerAction: boolean = false;
    // public dragdropWorkorderCreateContainerAction: boolean = false;
    // public dragdropOperateurCreateContainerAction: boolean = false;
    // public resizeContainerAction: boolean = false;
    // public addWorkorderToContainerAction: boolean = false;
    // public changeOperateurToContainerAction: boolean = false;
public scrollto
    constructor(
        public dialog: MatDialog,
        private coordinateurService: CoordinateurService,
        private salleService: SalleService,
        private containersService: ContainersService,
        private monteursService: MonteursService,
        private workorderService: WorkOrderService,
        private libGroupeService: LibGroupeService,
        private store: Store<App>
    ) {
        console.log('******* constructor start *******');
        this.isnotMyGroup = false;
        this.storeAppSubscription();
     
        document.body.addEventListener('keydown', (eKey: KeyboardEvent) => {
            let btnrefresh = document.getElementById('btn-refresh');
            let btnrefreshWo = document.getElementById('btn-refreshWo');
            let scheduleElement = document.getElementsByClassName('schedule-drag-drop');
           
            if (eKey.keyCode === 115) {
           

                if (this.disabledrefresh || this.disabledrefreshBacklog) {

                    btnrefresh[0]["disabled"] = true
                    btnrefreshWo[0]["disabled"] = true
                } else {
                    btnrefresh.click()
                    btnrefreshWo.click()
                    this.scheduleObj.refresh()
                }
                eKey.preventDefault()
                console.log(btnrefresh, btnrefreshWo)

            }
           

        })

        let scheduleElement = document.getElementsByClassName('e-schedule-table');
       let scheduletable = document.getElementsByClassName(' e-schedule-table e-content-table');
        
      document.body.addEventListener('keyup', (eKey: KeyboardEvent) => {
        if (eKey.keyCode === 109  && scheduleElement ) {
            // -------------------------------------------------
          if(this.value > this.valueMax){
              this.value = this.value - this.valueAdd
            // this.scheduleObj.element.style["zoom"] =this.value.toString() +"%"
            // scheduleElement[0]['style'].transform ="scale(this.value)"
            scheduleElement[0]['style'].zoom =this.value.toString() +"%"
     
      
        console.log( scheduleElement[0]['style'].zoom,"value -",scheduletable[0]['style'] )
    }
       } else {
  
           if (eKey.keyCode === 107 && scheduleElement ) {
                  //+++++++++++++++++++++++
                  this.value = this.value +  this.valueAdd
            //    this.scheduleObj.element.style["zoom"] =this.value.toString() +"%"
            // scheduleElement[0]['style'].transform ="scale(this.value)"
            scheduleElement[0]['style'].zoom =this.value.toString() +"%"
           
            console.log( scheduleElement[0]['style'],"value +",scheduletable[0]['style'])
               
           }
       }
    }, true);
   

        console.log('******* constructor end *******');
    }

    ngOnInit() {
        
        this.scheduleObj.enablePersistence = false;
        this.scheduleObj.allowKeyboardInteraction = true;
        this.treeObj.enablePersistence = false;
        // this.toggleBtn.content = 'Voir toutes les Régies';
        this.activeViewTimelineDay = this.scheduleObj;
        // console.log(hospitalData); 
        // console.log(this.data);
        // this.storeAppSubscription();
        console.log(this.store);
        // this.getMonteur(10);
        // this.getAllContainer();
        // this.getContainersByRessource(118);
        console.log(this.selectedDate, moment().add(1, 'd').toDate());
        // this.getWorkorderByContainerId(1);
        //  this.getWorkOrderByidGroup(1)
        // this.getWorkOrderByidGroup(3);
        //  this.getSalleByGroup(10);

    }

  @HostListener('mouseenter') onMouseEnter() {
    // alert("Don't touch my bacon!");
  }

    onTreeSelecting(event) {
        console.log('ON TREE SELECTING ====> ', event);
    }
    onTreeSelected(event) {
        console.log('ON TREE SELECTED ====> ', event);
    }
    onTreeExpanding(event) {
        console.log('ON TREE EXPANDING ====> ', event);
    }

    ngAfterViewInit() {
        this.departmentDataSource = this.departmentGroupDataSource;
    }

    ngOnDestroy() {
        this.onDestroy$.next();
    }

    onDragStart(args: DragEventArgs): void {
        args.interval = 5; // drag interval time is changed to 10 minutes
        console.log('args =======> ', args);
        // args.navigation = { enable: true, timeDelay: 2000 };
        // args.scroll.enable = false;
       if(!args.data['AzaIsPere']) {
           args.cancel = true
       }
       if(args.name === "dragStop"){
        console.log('args =======> Stop', args);
       }
    }


    public disabledrefresh: boolean 
    public hiderefresh: boolean 
    refreshScheduler() {
        console.log(this.scheduleObj);
        this.disabledrefresh = true;
        this.hiderefresh = true
        console.log('refresh scheduler click in refreshScheduler() => ', this.disabledrefresh);
        this.timelineResourceDataOut = []
        this.allDataWorkorders = []
        this.departmentDataSource = [];
        this.departmentDataSourceAll = [];
        this.departmentGroupDataSource = [];
        this.allDataContainers = [];
        this.openEditorCount = 0;
        console.log(this.scheduleObj.currentView, 'currentView !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log('refresh scheduler click in refreshScheduler() => ');
        console.log('isClicked : ', this.isClicked);
        console.log('this.refreshDateStart => ', this.refreshDateStart);
        console.log('this.refreshDateEnd => ', this.refreshDateEnd);
        

        // this.departmentGroupDataSource = [];
        console.log('this.refreshDateStart : ', this.refreshDateStart);
        console.log('this.refreshDateEnd : ', this.refreshDateEnd);

        if ((this.refreshDateStart === undefined || this.refreshDateEnd === undefined) && this.scheduleObj.currentView === 'TimelineDay') {
            this.refreshDateStart = moment().toDate();
            this.refreshDateEnd = moment().add(1, 'd').toDate();
        }
        // if (this.isClicked) {
        //     console.log('refresh scheduler with all regies');
        //     this.toggleBtn.content = 'Voir mes Régies  ';
        //     this.getSalleAll(this.currentCoordinateur.Groupe, this.refreshDateStart, this.refreshDateEnd);
        // } else {


        console.log('refresh scheduler with my regies group');
        console.log(this.timelineResourceDataOut)
        this.getSalleByGroup(this.currentCoordinateur.Groupe, this.refreshDateStart, this.refreshDateEnd);
        // this.toggleBtn.content = 'Voir toutes les Régies';
        this.departmentDataSource = this.departmentGroupDataSource;
        console.log('faux');

        // }

        // this.scheduleObj.refresh();
        this.openEditorCount = 0;

        if ( this.searchString != undefined) {
            console.log("clic bouton refresh ")
            this.searchwo.value = this.searchString
             this.onFilter(this.searchwo.value,0,this.argsKeyboardEvent)
        } else {
               }
  


    }
    public disabledrefreshBacklog:boolean =true

    refreshWorkordersBacklog() {
        this.disabledrefreshBacklog = true
        console.log('refresh workorders backlog click');
        this.workOrderData = [];
        this.getWorkOrderByidGroup(this.currentCoordinateur.Groupe);
        
          if(this.searchString != undefined )
          {
            // if (!this.navigation ) {
                let valueSearch = document.getElementsByClassName('recherche-wo');
                console.log("clic bouton refresh ", this.searchString, this.argsKeyboardEvent)
                this.searchwo.value = ""
               
                console.log(this.searchString,valueSearch)
                //  this.onFilter(a,0,this.argsKeyboardEvent)
        //     } 
           
        //   else   {
   
        //   }
        //         if(this.argsKeyboardEvent.keyCode != undefined){
        //             if(this.argsKeyboardEvent.keyCode === 8 ){
                  
        //             }else{
                       
        // setTimeout(() => {
        //     // console.log(this.searchwo.value)
        //     this.searchwo.value =  this.searchString
        //     // console.log(this.searchwo.value)
        //    this.onFilter(this.searchwo.value,0,this.argsKeyboardEvent)
        //     this.treeObj.fields['dataSource'] = this.treeObj.getTreeData()
            
        //     console.log("clic bouton navigation",  this.treeObj.fields['dataSource'],this.treeObj.getTreeData() ) 
        // }, 100);
        //     } 
        // }
        //   }
        //   console.log(this.navigation, "²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²")
        this.navigation = false      
   
    }}

    // getAllCoordinateurs() {
    //     console.log('this.user => ', this.user);
    //     this.timelineResourceDataOut = [];
    //     this.departmentGroupDataSource = [];
    //     this.allDataContainers = [];
    //     this.allDataWorkorders = [];
    //     console.log('get ALL Coordinateurs');
    //     let startofDay = moment().toDate()
    //     let endofDay = moment().add(1, 'd').toDate();
    //     this.coordinateurService.getAllCoordinateurs()
    //         .subscribe(data => {
    //             console.log('all coordinateurs : ', data);
    //             data.forEach(item => {
    //                 if (item.Username === this.user.shortUserName) {
    //                     console.log('COORDINATEUR => ', item);
    //                     this.getSalleByGroup(item.Groupe, startofDay, endofDay);
    //                     // ID PROVISOIRE !!!
    //                     this.getMonteursByGroup(item.Groupe);
    //                     this.getWorkOrderByidGroup(item.Groupe);
    //                     this.getAllMonteurs(item.Groupe);
    //                     this.currentCoordinateur = item;
    //                     this.getLibGroupe(item.Groupe)
    //                 }
    //             });
    //         });
    // }
    public idCoordinateur
    getCoordinateurByUsername(Username) {
        this.timelineResourceDataOut = [];
        this.departmentGroupDataSource = [];
        this.allDataContainers = [];
        this.allDataWorkorders = [];
        console.log('get Current Coordinateur');
        let startofDay = moment().toDate()
        let endofDay = moment().add(1, 'd').toDate();
        this.coordinateurService.getCoordinateurByUsername(Username)
            .subscribe(item => {

                console.log('COORDINATEUR => ', item);
                this.getSalleByGroup(item.Groupe, startofDay, endofDay);
                // ID PROVISOIRE !!!
                this.getMonteursByGroup(item.Groupe);
                this.getWorkOrderByidGroup(item.Groupe);
                this.getAllMonteurs(item.Groupe);
                
                this.currentCoordinateur = item;
                this.getLibGroupe(item.Groupe)

            });


    }


    storeAppSubscription() {
        this.store
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(data => {
                console.log(data);
                this.user = data["app"].user;
                console.log(this.user);
            });
            this.getCoordinateurByUsername(this.user.shortUserName);
      

    }

    onEventClick(e: ActionEventArgs) {
        console.log('event clicked !!!!!!!!!!!');

        this.eventClick = true;
    }


    /****************************************************************************************************************************************/
    /*************************************************************** API REQUEST ************************************************************/
    /****************************************************************************************************************************************/

    /************************************************************/
    /**************************** GET ***************************/


    getSalleByGroup(idGroup, start, end) {
        // this.toggleBtn.content = 'Voir autres Régies';
        
    
        console.log(this.departmentDataSource);
        console.log(this.departmentGroupDataSource);
        this.salleService
            .getGroupSalle(idGroup)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(donnees => {
                this.dataRegieReady = true;
                this.salleDataSource = donnees;
                console.log('salles group result : ', donnees);
                this.salleDataSource.map(item => {
                    console.log(item);
                    this.departmentGroupDataSource.push({
                        Text: item.NomSalle,
                        Id: item.CodeSalle,
                        Color: '#95b9',
                        codeSalle: item.CodeSalle,
                        codeRessource: item.CodeRessource,
                        libelletype:item.libelletype
                    });
                    let newItem = [{ Text: item.NomSalle, Id: item.CodeSalle }];
                    // this.departmentDataSource = this.departmentDataSource.concat(newItem);
                    console.log('regie departmentGroupDataSource', this.departmentGroupDataSource);
                    this.departmentDataSource = this.departmentGroupDataSource
                    console.log('regie departmentDataSource', this.departmentDataSource);
                    console.log('item code salle fot container request : ', item.CodeSalle);
                    // this.getContainersByRessource(item.CodeRessource);
                });
                // let startofDay = moment().toDate()
                // let endofDay = moment().add(1, 'd').toDate();
                this.timelineResourceDataOut = []
                this.salleDataSource.forEach(salle => {
                    let indexSalle = this.salleDataSource.indexOf(salle);
                    console.log('--------------------------------------------------indexSalle => ', indexSalle);

                  
                    this.getContainersByRessourceStartDateEndDate(
                        salle.CodeRessource,
                        start,
                        end,
                        salle.CodeSalle,
                        indexSalle
                    );
                });
            })

    }

    getSalleAll(currentGroup, start, end) {
        this.departmentDataSourceAll = [];
        this.toggleBtn.iconCss = 'e-play-icon';
        this.salleService
        .getSalle()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(donnees => {
            this.timelineResourceDataOut = [];
            this.salleDataSource = donnees;
            console.log('all regies = ', this.salleDataSource);
            this.salleDataSource.map(item => {
                if (item.codegroupe != currentGroup) {
                    this.departmentDataSourceAll.push({
                        Text: item.NomSalle,
                        Id: item.CodeSalle,
                        Color: '#AC4BC6',
                        codeSalle: item.CodeSalle,
                        codeRessource: item.CodeRessource
                    });
                }
            });
            this.salleDataSource.forEach(salle => {
                let indexSalle = this.salleDataSource.indexOf(salle);
                console.log('--------------------------------------------------indexSalle => ', indexSalle);
                this.getContainersByRessourceStartDateEndDate(
                    salle.CodeRessource,
                    start,
                    end,
                    salle.CodeSalle,
                    indexSalle
                );
            });
        });
    }



    getAllMonteurs(group) {
        let monteurDataSource;
        this.monteursService
            .getMonteur()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(donnees => {
                monteurDataSource = donnees;
                monteurDataSource.map(item => {
                    if (item.codegroupe !== group) {
                        this.monteurListe.push(item);
                        this.codegroupe = item.codegroupe;
                    }
                });
            });
    }

    getMonteursByGroup(idGroup) {
        this.monteursService
            .getGroupMonteur(idGroup)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(donnees => {
                console.log('monteurs : ', donnees);
                this.monteurDataSource = donnees;
                this.fieldMonteur = {
                    dataSource: this.monteurDataSource,
                    id: 'CodeRessource',
                    text: 'Username'
                };
            });
        console.log('fieldmonteur:', this.fieldMonteur);
        console.log('monteur:', this.monteurDataSource);

    }

    getAllContainer() {
        this.containersService
            .getAllContainers()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(donnees => {
                this.containersPlanning = donnees;
                console.log('container', this.containersPlanning);
            });
    }

    getContainersByRessource(coderessource) {
        this.containersService
            .getContainersByRessource(coderessource)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(data => {
                console.log('container by ressource : ', data);
            });
    }

    public lastSalleCall = false;
    public disableNavigation  = false
    getContainersByRessourceStartDateEndDate(coderessource, datedebut, datefin, codeSalle, indexSalle) {
    //     this.timelineResourceDataOut = []
    //     this.allDataWorkorders = []
    //    this.allDataContainers = [];
        console.log('CALL getContainersByRessourceStartDateEndDate() with codeRegie : ', coderessource, ' / dateDebut : ', datedebut, ' / dateFin : ', datefin);

        let debut = moment(datedebut).format('YYYY-MM-DD').toString();
        let fin = moment(datefin).format('YYYY-MM-DD').toString();
        if (indexSalle === (this.salleDataSource.length - 1)) {
            this.lastSalleCall = true;
        }
        // console.log('******************************** this.lastSalleCall ===> ', this.lastSalleCall);
        // console.log('debut =>', debut);
        // console.log('fin =>', fin);
        // console.log('coderessource salle => ', coderessource);
        this.containersService
            .getContainersByRessourceStartDateEndDate(coderessource, debut, fin)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(res => {
                this.dataContainersByRessourceStartDateEndDate = res;
                // console.log('container present in regie : ',  this.dataContainersByRessourceStartDateEndDate);
                // console.log('debut =>', debut);
                // console.log('fin =>', fin);
                // console.log('coderessource salle => ', coderessource);
                // console.log('container res.length :', res.length);
                if (res.length > 0) {
                    this.allDataContainers = [...this.allDataContainers, ...res];
                    // console.log('regie contains container : ', res.length);
                    this.dataContainersByRessourceStartDateEndDate.map(data => {
                        this.idExisting.push(data.Id_Planning_Container);
                        // console.log('item in container present in regie (map) : ', data);
                        let dateDebut = moment(data.DateDebutTheo, moment.defaultFormat).toDate();
                        let dateFin = moment(data.DateFinTheo, moment.defaultFormat).toDate();
                        let initiales = data.UserEnvoi.slice(-1) + data.UserEnvoi.slice(0, 1);

                        this.timelineResourceDataOut.push({
                            Id: data.Id_Planning_Container,
                            Name: (data.Titre === null || typeof (data.Titre) === 'undefined') ? 'Titre' : data.Titre,
                            StartTime: dateDebut,
                            EndTime: dateFin,
                            CodeRessourceSalle: coderessource,
                            Container: true,
                            numGroup: data.Id_Planning_Container,
                            Description: data.Commentaire,
                            Operateur: data.LibelleRessourceOperateur === null ? '' : data.LibelleRessourceOperateur,
                            coordinateurCreate: initiales,
                            AzaIsPere: true,
                            AzaNumGroupe: data.Id_Planning_Container,
                            DepartmentID: codeSalle,
                            ConsultantID: 2,
                            DepartmentName: '',
                            IsAllDay: false,
                            Commentaire: data.Commentaire,
                            Commentaire_Planning: data.Commentaire_Planning
                        });
                        let index = this.dataContainersByRessourceStartDateEndDate.indexOf(data);
                        let length = this.dataContainersByRessourceStartDateEndDate.length;
                        // console.log('--------------------------------------------------indexSalle => ', indexSalle);
                        this.getWorkorderByContainerId(data.Id_Planning_Container, codeSalle, index, length, indexSalle);
                      
                    });
                    // console.log('this.timelineResourceDataOut => ', this.timelineResourceDataOut)
                    // timelineResourceDataOut
                    this.updateEventSetting(this.timelineResourceDataOut);
                    // this.departmentDataSource = this.departmentGroupDataSource;
                    this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut;
                    // console.log('this.scheduleObj.eventSettings.dataSource ', this.scheduleObj.eventSettings.dataSource);
                  
                
                 
                    console.log('refresh scheduler click in getContainersByRessourceStartDateEndDate() => ', this.disabledrefresh);
                
                } else {
                    // console.log('container not present for regie : ', coderessource, res);
               
                }
             
              
            });
         
    }
    public allDataWorkorders = [];
    getWorkorderByContainerId(id, codeSalle, index, containerArrayLength, indexSalle) {
        console.log('CALL getWorkorderByContainerId() with idContainer : ', id);
        // console.log('--------------------------------------------------indexSalle => ', indexSalle);
        // console.log('id container to check workorder => ', id)
        // console.log('codeSalle => ', codeSalle);
        // console.log('index => ', index);
        // console.log('containerArrayLength => ', containerArrayLength);
        // console.log('this.salleDataSource.length => ', this.salleDataSource.length)
        this.workorderService
            .getWorkOrderByContainerId(id)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(res => {
                // console.log('response workorder for container : ', res);
                this.WorkorderByContainerId = res;
                this.allDataWorkorders = [...this.allDataWorkorders, ...res];
                  
       
                // console.log('******* res workorder  ******* => ', this.WorkorderByContainerId);
                // console.log('this.WorkorderByContainerId.length => ', this.WorkorderByContainerId.length);
                if (this.WorkorderByContainerId.length > 0) {
                    this.WorkorderByContainerId.map(data => {
                        let StartTime = moment(data.DateDebutTheo, moment.defaultFormat).toDate(),
                            EndTime = moment(data.DateFinTheo, moment.defaultFormat).toDate();
                        let dateDebut = StartTime,
                            dateFin = EndTime
                        let newWorkorderEvent = {
                            Id: data.Id_Planning_Events,
                            Name: data.titreoeuvre,
                            StartTime: dateDebut,
                            EndTime: dateFin, // date provisoire
                            CodeRessourceSalle: codeSalle,
                            Container: false,
                            numGroup: data.Id_Planning_Container,
                            Description: data.Commentaire,
                            Operateur: data.LibelleRessourceOperateur,
                            coordinateurCreate: data.LibelleRessourceCoordinateur,
                            Statut: data.Statut,
                            AzaIsPere: false,
                            AzaNumGroupe: data.Id_Planning_Container,
                            DepartmentID: codeSalle,
                            ConsultantID: 2,
                            DepartmentName: '',
                            IsAllDay: false,
                            libchaine: data.libchaine,
                            typetravail: data.typetravail,
                            titreoeuvre: (data.titreoeuvre === null || typeof (data.titreoeuvre) === 'undefined') ? '' : data.titreoeuvre,
                            numepisode: data.numepisode,
                            dureecommerciale: data.dureecommerciale,
                            libtypeWO: data.libtypeWO,
                            Commentaire_Planning: data.Commentaire_Planning,
                            IdGenerationWO: data.IdGenerationWO,
                        }
                        this.timelineResourceDataOut.push(newWorkorderEvent);
                    });
                    // console.log('Planning Events', this.scheduleObj.eventSettings.dataSource);
                    // console.log('Planning Events', this.timelineResourceDataOut[0].AzaIsPere );
                    //    for(let i = 0 ; i< this.timelineResourceDataOut.length; i++)
                    //    {
                    //        let titreoeuvre = this.timelineResourceDataOut[i].titreoeuvre,
                    //        numepisode = this.timelineResourceDataOut[i].numepisode,
                    //        dureecommerciale=this.timelineResourceDataOut[i].dureecommerciale,
                    //         AzaIsPere = this.timelineResourceDataOut[i].AzaIsPere
                    //         this.temp =  
                    //         '<div class="tooltip-wrap">' +
                    //         '${if( titreoeuvre !== null && titreoeuvre !== undefined )}<div class="content-area"><div class="name" > ${libtypeWO}<br> Durée Commerciale :&nbsp;${dureecommerciale} </>  </div> ${/if}' +
                    //         '<div class="time">Début&nbsp;:&nbsp;${StartTime.toLocaleString()} </div>' +
                    //         '<div class="time">Fin&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;${EndTime.toLocaleString()} </div></div></div> ';
                    //    }
                    this.createTooltipWorkorder();
                    // console.log('workorder function get : call calculDateAll function');

                    // this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                    //     dataSource: <Object[]>extend(
                    //         [], this.calculDateAll(this.timelineResourceDataOut, false, null, false, false), null, true
                    //     ),
                    //     enableTooltip: true, tooltipTemplate: this.temp
                    // };

                    this.eventSettings = {
                        dataSource: <Object[]>extend(
                            [], this.timelineResourceDataOut, null, true
                        ),
                        enableTooltip: true, tooltipTemplate: this.temp
                    };
                    // console.log('indexSalle => ', indexSalle);
                    // console.log('this.salleDataSource.length => ', this.salleDataSource.length);
                    if (indexSalle === this.salleDataSource.length - 1) {
                        // console.log('*********** end to initial request for all regies container and workorders ***********');
                        this.updateEventSetting(this.timelineResourceDataOut);
                        // this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                        //     dataSource: <Object[]>extend(
                        //         [], this.calculDateAll(this.timelineResourceDataOut, false, null, false, false), null, true
                        //     ),
                        //     enableTooltip: true, tooltipTemplate: this.temp
                        // };
                    }
                   
                    this.disabledrefresh = false
                  this.hiderefresh = false
                // console.log(this.hiderefresh,"hiderefresh")
                // console.log(this.disabledrefresh,"disabledrefresh")
                         } else {
                    // console.log('indexSalle => ', indexSalle);
                    // console.log('this.salleDataSource.length => ', this.salleDataSource.length);
                    if (indexSalle === (this.salleDataSource.length - 1)) {
                        this.updateEventSetting(this.timelineResourceDataOut);
                        // console.log('*********** end to initial request for all regies container and workorders ***********');
                        // this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                        //     dataSource: <Object[]>extend(
                        //         [], this.calculDateAll(this.timelineResourceDataOut, false, null, false, false), null, true
                        //     ),
                        //     enableTooltip: true, tooltipTemplate: this.temp
                        // };
                    }
                }
      
                if (index === (containerArrayLength - 1)) { // refresh backlog workorders si on fait appel à this.refreshSchedule()
                    // this.field = {
                    //     dataSource: this.workOrderData,
                    //     id: 'Id',
                    //     text: 'Name',
                    //     description: 'typetravail'
                    // };
                    // console.log('ready');
                }
                this.disableNavigation = false;
                   
                if(!this.disableNavigation){
                    let toolbar = document.getElementsByClassName('e-toolbar-items');
                    for(let i =0; i<toolbar.length; i++){
                        setTimeout(() => {
                            toolbar[i]["style"].display = 'block'
                        }, 3000);
                  
                  
                    }
                  }    
               
            });
        
       
    }

    createTooltipWorkorder() {
        let nameService = false
        this.libGroupe.map(libelle => {
            if (this.nameService === "BANDES ANNONCES") {
                if (this.nameService === libelle.Libelle) {
                    nameService = true
                    console.log(nameService)
                }
            }
        })

        for (let i = 0; i < this.timelineResourceDataOut.length; i++) {
            let titreoeuvre = this.timelineResourceDataOut[i].titreoeuvre,
                numepisode = this.timelineResourceDataOut[i].numepisode,
                dureecommerciale = this.timelineResourceDataOut[i].dureecommerciale,
                AzaIsPere = this.timelineResourceDataOut[i].AzaIsPere,
                libchaine = this.timelineResourceDataOut[i].libchaine,
                coordinateurCreate = this.timelineResourceDataOut[i].coordinateurCreate,
                Operateur = this.timelineResourceDataOut[i].Operateur
                

            this.temp = '<div class="tooltip-wrap">' +
                '<div class="tooltip-wrap">' +
                '${if( titreoeuvre != null && titreoeuvre !== undefined )}<div class="content-area"><div class="name" >   Titre Oeuvre :  &nbsp; ${titreoeuvre} &nbsp; ep &nbsp;${numepisode} <br> Type de Travail: &nbsp; ${typetravail} <br> Libellé chaine : &nbsp; ${libchaine}  <br> Libellé WorkOrder : &nbsp; ${libtypeWO}<br> Durée Commerciale :&nbsp;${dureecommerciale} </>  </>  </div> ${/if}' +
                '${if(   Commentaire_Planning !== undefined &&  Commentaire_Planning  !== "" &&  Commentaire_Planning  != null)}<div> Description : &nbsp; ${Commentaire_Planning}  </>  </div> ${/if}' +
                '${if (AzaIsPere  ) }<div class="time"> Titre: &nbsp;${Name} <br>  Coordinateur: &nbsp; ${coordinateurCreate}  </div> ${/if}' +
                '${if (AzaIsPere && Operateur != null && Operateur !== "" && Operateur !== undefined ) }<div class="time">Opérateur:&nbsp;${Operateur} </div> ${/if}' +
                '<div class="time">Début&nbsp;:&nbsp;${StartTime.toLocaleString()} </div>' +
                '<div class="time">Fin&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;${EndTime.toLocaleString()} </div></div></div> ';
        }
    }


    getWorkOrderByidGroup(idGroup) {
        console.log("++++++++++++++++++++++", this.workOrderData);
        this.workOrderData = [];
        this.workorderService
        .getWorkOrderByidGroup(idGroup)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(donnees => {
            this.WorkOrderByidgroup = donnees;
            console.log('getWorkOrderByidgroup', this.WorkOrderByidgroup);
            if (this.WorkOrderByidgroup != []) {
                let testUser = 'VITIPON-C';
                this.WorkOrderByidgroup.map(workOrder => {
                    console.log('workorder to map : ', workOrder)
                    let StartTime = moment(workOrder.DateDebutTheo, moment.defaultFormat).toDate(),
                      EndTime = moment(workOrder.DateFinTheo, moment.defaultFormat).toDate();
                    let dateDebut =  StartTime,
                        dateFin= EndTime
                this.workOrderData.push({
                    Id: workOrder.Id_Planning_Events,
                    Name: workOrder.titreoeuvre , 
                    StartTime: dateDebut ,
                    EndTime:  dateFin,
                    CodeRessourceSalle: workOrder.CodeRessourceSalle,
                    Container: false,
                    numGroup:workOrder.Id_Planning_Events,
                    Description:workOrder.Commentaire,
                    Operateur:workOrder.LibelleRessourceOperateur,
                    coordinateurCreate:workOrder.UserEnvoi,
                    Statut:workOrder.Statut,
                    AzaIsPere: false,
                    AzaNumGroupe:  workOrder.Id_Planning_Events,
                    DepartmentID: workOrder.CodeRessourceSalle,
                    ConsultantID: 2,
                    DepartmentName: '',
                    IsAllDay: false,
                    libchaine: workOrder.libchaine,
                    typetravail:workOrder.typetravail,
                    titreoeuvre:workOrder.titreoeuvre,
                    numepisode:workOrder.numepisode,
                    dureecommerciale:workOrder.dureecommerciale,
                    libtypeWO:workOrder.libtypeWO,
                    Commentaire_Planning: workOrder.Commentaire_Planning,
                    IdGenerationWO:workOrder.IdGenerationWO,
                    
                });
            }),
            this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                enableTooltip: true, tooltipTemplate: this.temp
            };
            this.field = {
                dataSource:  this.workOrderData,
                id: 'Id',
                text: 'Name',
                description: 'Commentaire_Planning'

            };
                    // this.treeObj.refresh();
                    console.log('WorkOrderByidgroup', this.workOrderData);
                    console.log('this.fieldArray', this.field);
                    this.disabledrefreshBacklog = false
                }
            });
          
    }


    getLibGroupe(id) {
        this.idCoordinateur = id
        let libGroupe
        this.libGroupeService
        .getLibGroupe(id)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(donnees => {
            libGroupe = donnees
            libGroupe.map(donnees =>{
                this.libGroupe.push({
                    Libelle: donnees.Libelle,
                    Code: donnees.Code
                })
            })
          
            })
            
        console.log('............................', this.libGroupe)
        console.log(this.idCoordinateur, '################################ ID')
        
    }

    /*************************** DELETE **************************/

    public deleteContainerAction = false;
    deleteContainer(id, event) {
        this.containersService.deleteContainer(id)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(res => {
                console.log('delete container with success : ', res);
                this.allDataContainers = this.allDataContainers.filter(container => container.Id_Planning_Container !== id);
                console.log('this.allDataContainers after delete container : ', this.allDataContainers);
                this.timelineResourceDataOut.forEach(item => {
                    if ((+event.AzaNumGroupe === +item.AzaNumGroupe) && !item.AzaIsPere) {
                        if (!this.field['dataSource'].includes(item)) {
                            this.updateWorkorderBackToBacklog(item, event);
                        }
                    }
                });
                this.timelineResourceDataOut = this.timelineResourceDataOut.filter(item => {
                    if (+event.AzaNumGroupe !== +item.AzaNumGroupe) {
                        return item;
                    }
                });
                this.eventSettings = {
                    dataSource: <Object[]>extend(
                        [], this.timelineResourceDataOut, null, true
                    )
                };
            }, error => {
                console.error('error for delete container request : ', error);
            }
            )
    }


    /************************************************************/
    /**************************** POST **************************/

    public createJustContainerAction = false;

    postContainer(containerToCreate, event) {
        this.containersService.postContainer(containerToCreate)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(res => {
                console.log('succes post new container. RES : ', res);
                if (res) {
                    console.log('res from post => ', res);
                    this.allDataContainers.push(res);
                    event.Id = res.Id_Planning_Container;
                    event.AzaNumGroupe = res.Id_Planning_Container;
                    console.log('event after post and update id')
                    containerToCreate.Id_Planning_Container = res.Id_Planning_Container;
                    let workorderEventToUpdate = this.creationArray.filter(item => !item.AzaIsPere);
                    console.log('workorderEventToUpdate=> ',workorderEventToUpdate);
                    console.log('this.creationArray => ', this.creationArray);
                    if (workorderEventToUpdate.length > 0) {
                        this.createJustContainerAction = false;
                        workorderEventToUpdate.map(item => {
                            console.log(item, "===> item")
                            let newItemWorkorderAfterEditorUpdate = {
                                Id: item.Id,
                                Name: item.titreoeuvre,
                                StartTime: event.StartTime,
                                EndTime: event.EndTime,
                                IsAllDay: event.IsAllDay,
                                DepartmentID: event.DepartmentID,
                                ConsultantID: item.ConsultantID,
                                AzaIsPere: false,
                                AzaNumGroupe: res.Id_Planning_Container,
                                coordinateurCreate: item.coordinateurCreate,
                                Operateur: event.Operateur,
                                Statut: item.Statut,
                                typetravail: item.typetravail,
                                titreoeuvre:(item.titreoeuvre === null || typeof (item.titreoeuvre) === 'undefined') ? '' : item.titreoeuvre,
                                numepisode: item.numepisode,
                                dureecommerciale: item.dureecommerciale,
                                libchaine: item.libchaine,
                                Commentaire_Planning: item.Commentaire_Planning,
                                IdGenerationWO: item.IdGenerationWO,
                                libtypeWO: item.libtypeWO,

                            };
                            this.updateWorkorderInDragDrop(newItemWorkorderAfterEditorUpdate, containerToCreate);
                            console.log('new workorder from post container function: ', newItemWorkorderAfterEditorUpdate);
                        })
                    }
                    this.timelineResourceDataOut.push(event);
                    console.log(this.timelineResourceDataOut, 'timelineResourceDataOut');
                    this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                        dataSource: <Object[]>extend(
                            [], this.timelineResourceDataOut, null, true
                        ),
                        enableTooltip: true, tooltipTemplate: this.temp
                    };
                    this.creationArray = [];
                    this.disabledrefresh = false
                }
            },
                error => {
                    console.log('ERROR POST CONTAINER !!');
                    swal({
                        title: 'Attention',
                        text: 'La création est impossible car l\'emplacement est occupé par un autre container. Veuillez rafraichir la page pour l\'afficher',
                        showCancelButton: false,
                        confirmButtonText: 'OK'
                    });
                }
            );
    }

    createContainer(event) {
        console.log(event);
        console.log('this.creationArray', this.creationArray);
        let now = moment().format('YYYY-MM-DDTHH:mm:ss');
        let startTime = moment(event.StartTime).format('YYYY-MM-DDTHH:mm:ss');
        let endTime = moment(event.EndTime).format('YYYY-MM-DDTHH:mm:ss');
        console.log('startTime : ', startTime);
        console.log('endTime : ', endTime);
        console.log('now : ', now);
        let codeRessourceOperateur;
        let libelleRessourceSalle;
        let codeRessourceSalle;
        // let codeRessourceCoordinateur = this.currentCoordinateur.CodeRessource;
        let codeRessourceCoordinateur = this.currentCoordinateur.IdCoord;
        let libelleRessourceCoordinateur = this.user.shortUserName;
        this.monteurDataSource.map(item => {
            if (item.Username === event.Operateur) {
                codeRessourceOperateur = item.CodeRessource;
            }
        });
        this.departmentDataSource.map(item => {
            if (item['Id'] === event.DepartmentID) {
                libelleRessourceSalle = item['Text'];
                codeRessourceSalle = item['codeRessource'];
            }
        });
        console.log(libelleRessourceSalle,"===>",codeRessourceSalle)
        let newContainer = {
            Id_Planning_Container: 0,
            UserEnvoi: this.user.shortUserName,
            DateEnvoi: now,
            Titre: event.Name,
            CodeRessourceOperateur: codeRessourceOperateur,
            LibelleRessourceOperateur: event.Operateur,
            CodeRessourceCoordinateur: codeRessourceCoordinateur,
            LibelleRessourceCoordinateur: libelleRessourceCoordinateur,
            DateSoumission: null,
            DateDebut: startTime,
            DateFin: endTime,
            DateDebutTheo: startTime,
            DateFinTheo: endTime,
            CodeRessourceSalle: codeRessourceSalle,
            LibelleRessourceSalle: libelleRessourceSalle,
            Commentaire: event.Commentaire,
            Commentaire_Planning: event.Commentaire_Planning,
            DateMaj: now,
            UserMaj: libelleRessourceCoordinateur,
            PlanningEventsList: null
        };
        console.log('nouveau container fot api request : ', newContainer);
        console.log(event);
        this.createJustContainerAction = true;
        this.postContainer(newContainer, event);
    }


    /******************************************************************************************************************************************/
    /********************************************************************** PUT ***************************************************************/
    /******************************************************************************************************************************************/


    /******************************************************************************************************************/
    /***************************************************** CONTAINER **************************************************/

    /**************** PUT CONTAINER WITH RESIZE OR EDITOR ************/
    public updateContainerAction;
    public isBackToBacklog: boolean = false;

    updateContainer(args) { // CALL IN RESIZE, DEPLACEMENTS AND EDITOR
        this.updateContainerAction = true;
        console.log('update container function');
        let now = moment().format('YYYY-MM-DDTHH:mm:ss');
        args.data['Operateur'] = args.data['Operateur'] === 'Aucun Opérateur' ? '' : args.data['Operateur'];
        let event = args.data;
        console.log(event, 'event container')
        let oldEvent = this.timelineResourceDataOut.filter(item => item.Id === event.Id);
        console.log('old Event container :', oldEvent);
        let containerResult = this.allDataContainers.filter(item => item.Id_Planning_Container === event.Id);
        console.log("container result",containerResult[0])
        let container = containerResult[0];
        console.log(container, 'event container')
        let startTime = moment(event.StartTime).format('YYYY-MM-DDTHH:mm:ss');
        let endTime = moment(event.EndTime).format('YYYY-MM-DDTHH:mm:ss');
        let codeRessourceOperateur;
        let libelleRessourceSalle;
        let codeRessourceSalle;
        this.monteurDataSource.map(item => {
            if (item.Username === event.Operateur) {
                codeRessourceOperateur = item.CodeRessource;
            }
        });
        console.log(this.departmentDataSource);
        this.departmentDataSource.map(item => {
            if (item['Id'] === event.DepartmentID) {
                libelleRessourceSalle = item['Text'];
                codeRessourceSalle = item['codeRessource'];
            }
        }); 
        if(typeof(container) != 'undefined'){
        let newContainer = {
            Id_Planning_Container: container.Id_Planning_Container,
            UserEnvoi: container.UserEnvoi,
            DateEnvoi: container.DateEnvoi,
            Titre: event.Name,
            CodeRessourceOperateur: codeRessourceOperateur,
            LibelleRessourceOperateur: event.Operateur,
            CodeRessourceCoordinateur: container.codeRessourceCoordinateur,
            LibelleRessourceCoordinateur: container.libelleRessourceCoordinateur,
            DateSoumission: null,
            DateDebut: event.DateDebut,
            DateFin: event.DateFin,
            DateDebutTheo: startTime,
            DateFinTheo: endTime,
            CodeRessourceSalle: codeRessourceSalle,
            LibelleRessourceSalle: libelleRessourceSalle,
            Commentaire: container.Commentaire,
            Commentaire_Planning: event.Commentaire_Planning,
            DateMaj: now,
            UserMaj: this.user.shortUserName,
            PlanningEventsList: null,
            DepartmentID:codeRessourceSalle
        };
        this.putContainer(newContainer.Id_Planning_Container, newContainer, event);
    }
    }

    putContainer(id, container, event) { // call in resize, deplacement and Editor (call in updateContainer() function)
        this.containersService.updateContainer(id, container)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(res => {
                console.log('succes update container. RES : ', res);
                console.log(this.allDataContainers, 'allDataContainers')


                console.log(this.allDataContainers, 'allDataContainers')


                let startDifferent = this.checkDiffExistById(event, this.timelineResourceDataOut, 'StartTime', 'StartTime');
                let endDifferent = this.checkDiffExistById(event, this.timelineResourceDataOut, 'EndTime', 'EndTime');
                this.timelineResourceDataOut = this.eventSettings.dataSource as Object[]; // refresh dataSource
                console.log('this.timelineResourceDataOut : ', this.timelineResourceDataOut);
                this.timelineResourceDataOut.map(item => {
                    if (item.Id === event.Id) {
                        item.Name = event.Name;
                        item.StartTime = event.StartTime;
                        item.EndTime = event.EndTime;
                        item.IsAllDay = event.IsAllDay;
                        item.DepartmentID = event.DepartmentID;
                        item.ConsultantID = event.ConsultantID;
                        item.AzaIsPere = true;
                        item.AzaNumGroupe = event.AzaNumGroupe;
                        item.coordinateurCreate = event.coordinateurCreate;
                        item.Operateur = event.Operateur;
                        item.Commentaire = event.Commentaire
                        item.Commentaire_Planning = event.Commentaire_Planning,
                            console.log(item);

                    }


                });
                this.allDataContainers.map(item => {
                    if (item.Id_Planning_Container === res['Id_Planning_Container']) {
                        item.CodeRessourceCoordinateur = res['CodeRessourceCoordinateur']
                        item.CodeRessourceOperateur = res['CodeRessourceOperateur']
                        item.CodeRessourceSalle = res['CodeRessourceSalle']
                        item.Commentaire = res['Commentaire']
                        item.Commentaire_Planning = res['Commentaire_Planning']
                        item.DateDebut = res['DateDebut']
                        item.DateDebutTheo = res['DateDebutTheo']
                        item.DateEnvoi = res["DateEnvoi"];
                        item.DateFin = res['DateFin']
                        item.DateFinTheo = res['DateFinTheo']
                        item.DateMaj = res['DateMaj']
                        item.DateSoumission = res['DateSoumission']
                        item.Id_Planning_Container = res['Id_Planning_Container']
                        item.Titre = res['Titre']
                        item.UserEnvoi = res['UserEnvoi']
                        item.UserMaj = res['UserMaj']
                        item.LibelleRessourceOperateur = res['LibelleRessourceOperateur']
                        item.LibelleRessourceCoordinateur = res['LibelleRessourceCoordinateur']
                        item.LibelleRessourceSalle = res['LibelleRessourceSalle']
                        item.DepartmentID = res['codeRessourceSalle']
                    }
                })
                console.log(this.allDataContainers, 'allDataContainers')
                this.calculDateGroup(this.timelineResourceDataOut, event.AzaNumGroupe, true, event, startDifferent, endDifferent);
                this.eventSettings = {
                    dataSource: <Object[]>extend(
                        [], this.timelineResourceDataOut, null, true
                    ),
                    enableTooltip: true, tooltipTemplate: this.temp
                };
                this.updateWorkorderInContainerUpdate(id, container, event);
                // this.eventSettings = {
                //     dataSource: <Object[]>extend(
                //         [], this.calculDateAll(this.timelineResourceDataOut, true, event, startDifferent, endDifferent), null, true
                //     ),
                //     enableTooltip: true, tooltipTemplate: this.temp
                // };
            }, error => {
                console.error('error updatecontainer', error);
                swal({
                    title: 'Attention',
                    text: 'Le déplacement est impossible car l\'emplacement est occupé par un autre container',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                });
            }
            )
    }


    /**** PUT CONTAINER WITH OPERATEUR DRAG AND DROP ****/

    updateContainerFromDragDropOperateur(operateurObject, dragDropEvent) {
        console.log('updateContainer from drag and drop ');


        let indexContainerEvent = this.findIndexEventById(dragDropEvent.target.id);
        let containerId = this.timelineResourceDataOut[indexContainerEvent]['Id']


        let arrayContainerResult = this.allDataContainers.filter(item => item.Id_Planning_Container === containerId);
        let containerResult = arrayContainerResult[0];
        containerResult.LibelleRessourceOperateur = operateurObject.Username;
        containerResult.CodeRessourceOperateur = operateurObject.CodeRessource;
        let id = containerResult.Id_Planning_Container;
        this.putContainerFromDragDropOperateur(id, containerResult, indexContainerEvent, operateurObject);
    }

    putContainerFromDragDropOperateur(id, container, indexContainerEvent, operateurObject) { // RESIZE AND EDITOR
        this.containersService.updateContainer(id, container)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(res => {
                console.log('succes update container. RES : ', res);
                this.timelineResourceDataOut[indexContainerEvent]['Operateur'] = operateurObject.Username;

                this.onActionComplete('e');
            }, error => {
                console.error('error updatecontainer', error);
                alert('error updatecontainer');
            }
            )
    }

    /*************************************************** WORKORDER ****************************************************/

    /*** PUT WORKORDER IN CONTAINER UPDATE ***/

    updateWorkorderInContainerUpdate(id, container, event) { // RESIZE AND EDITOR
        let workorderEventToUpdate = this.timelineResourceDataOut.filter(item => item.AzaNumGroupe === id && !item.AzaIsPere);
        console.log('workorderEventToUpdate => ', workorderEventToUpdate);
        let numberOfWorkorder = workorderEventToUpdate.length;
        if (workorderEventToUpdate.length > 0) {
            // this.createJustContainerAction = false;
            workorderEventToUpdate.map(item => {
                this.putWorkorderFromUpdateContainer(id, container, event, item);
            });
        };
        this.disabledrefresh = false
        console.log(  this.disabledrefresh ,"disabledrefresh")
    }

    putWorkorderFromUpdateContainer(id, container, eventContainer, eventWorkorder) { // RESIZE AND EDITOR
        let now = moment().format('YYYY-MM-DDTHH:mm:ss');
        let workorderResult = this.allDataWorkorders.filter(item => item.Id_Planning_Events === eventWorkorder.Id);
        let workorderSelected = workorderResult[0];
        let startTime = moment(eventWorkorder.StartTime).format('YYYY-MM-DDTHH:mm:ss');
        let endTime = moment(eventWorkorder.EndTime).format('YYYY-MM-DDTHH:mm:ss');
        let newWorkorder = {
            Id_Planning_Events: workorderSelected.Id_Planning_Events,
            Iddetail: workorderSelected.Iddetail,
            IdTypeWO: workorderSelected.IdTypeWO,
            UserEnvoi: workorderSelected.UserEnvoi,
            DateEnvoi: workorderSelected.DateEnvoi,
            CodeRessourceOperateur: container.CodeRessourceOperateur, // voir ou et si on récupère la donnée par la suite
            CodeRessourceCoordinateur: workorderSelected.CodeRessourceCoordinateur,
            DateSoumission: workorderSelected.DateSoumission,
            DateDebut: workorderSelected.DateDebut, // changement pour Remy
            DateFin: workorderSelected.DateFin, // changement pour Remy
            DateDebutTheo: startTime,
            DateFinTheo: endTime,
            CodeRessourceSalle: container.CodeRessourceSalle,
            Commentaire: workorderSelected.Commentaire,
            Support1Cree: null,
            Support2Cree: null,
            MustWaitFor: null,
            Statut: workorderSelected.Statut,
            idplanningprec: null,
            Regroup: null,
            Commentaire_Planning: eventWorkorder.Commentaire_Planning,
            DateMaj: now,
            UserMaj: this.user.shortUserName,
            Id_Planning_Container: container.Id_Planning_Container,
            isbacklog: 0,
            libchaine: workorderSelected.libchaine,
            typetravail: workorderSelected.typetravail,
            titreoeuvre: (workorderSelected.titreoeuvre === null || typeof (workorderSelected.titreoeuvre) === 'undefined') ? '' : workorderSelected.titreoeuvre,
            numepisode: workorderSelected.numepisode,
            dureecommerciale: workorderSelected.dureecommerciale,
            libtypeWO: workorderSelected.libtypeWO,
            IdGenerationWO: workorderSelected.IdGenerationWO,

            // +
            debut: workorderSelected.debut,
            fin: workorderSelected.fin,
            dureeestime: workorderSelected.dureeestime,
            idwoprec: workorderSelected.idwoprec
        }
        console.log("newWorkorder => ", newWorkorder);
        this.workorderService
            .updateWorkOrder(newWorkorder.Id_Planning_Events, newWorkorder)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(res => {
                console.log('update workorder with success : ', res);
                console.log(this.allDataWorkorders); // all brut workorder data in backlog
                this.allDataWorkorders = this.allDataWorkorders.filter(item => item.Id !== newWorkorder.Id_Planning_Events);
                this.allDataWorkorders.push(newWorkorder);
                console.log(this.allDataWorkorders);          
            }, error => {
                alert('error update workorder');
                console.error('error update workorder : ', error)
            }
            );
    }

    /**** PUT WORKORDER IN DRAG AND DROP ****/

    updateWorkorderInDragDrop(event, containerParent) {
        console.log('event to workorder backlog => ', event);
        console.log('containerParent to workorder backlog => ', containerParent);
        let now = moment().format('YYYY-MM-DDTHH:mm:ss');
        let workorderResult = this.WorkOrderByidgroup.filter(item => item.Id_Planning_Events === event.Id);
        let workorderSelected = workorderResult[0];
        console.log('workorderSelected', workorderSelected);
        let startTime = moment(event.StartTime).format('YYYY-MM-DDTHH:mm:ss');
        let endTime = moment(event.EndTime).format('YYYY-MM-DDTHH:mm:ss');
        this.calculWorkorderTime(startTime, endTime);
        let codeRessourceOperateur;
        let libelleRessourceSalle;
        let codeRessourceSalle;
        this.monteurDataSource.map(item => {
            if (item.Username === event.Operateur) {
                codeRessourceOperateur = item.CodeRessource;
            }
        });
        console.log(this.departmentDataSource);
        this.departmentDataSource.map(item => {
            if (item['Id'] === event.DepartmentID) {
                libelleRessourceSalle = item['Text'];
                codeRessourceSalle = item['codeRessource'];
            }
        });
        let newWorkorder = {
            Id_Planning_Events: workorderSelected.Id_Planning_Events,
            Iddetail: workorderSelected.Iddetail,
            IdTypeWO: workorderSelected.IdTypeWO,
            UserEnvoi: workorderSelected.UserEnvoi,
            DateEnvoi: workorderSelected.DateEnvoi,
            CodeRessourceOperateur: containerParent.CodeRessourceOperateur, // voir ou et si on récupère la donnée par la suite
            CodeRessourceCoordinateur: workorderSelected.CodeRessourceCoordinateur,
            DateSoumission: workorderSelected.DateSoumission,
            DateDebut: workorderSelected.DateDebut, // changement pour remy
            DateFin: workorderSelected.DateFin, // changement pour remy
            DateDebutTheo: startTime,
            DateFinTheo: endTime,
            CodeRessourceSalle: containerParent.CodeRessourceSalle,
            Commentaire: null,
            Support1Cree: null,
            Support2Cree: null,
            MustWaitFor: null,
            Statut: workorderSelected.Statut,
            idplanningprec: null,
            Regroup: null,
            Commentaire_Planning: workorderSelected.Commentaire_Planning,
            DateMaj: now,
            UserMaj: this.user.shortUserName,
            Id_Planning_Container: containerParent.Id_Planning_Container,
            isbacklog: 0,
            libchaine: workorderSelected.libchaine,
            typetravail: workorderSelected.typetravail,
            titreoeuvre: (workorderSelected.titreoeuvre === null || typeof (workorderSelected.titreoeuvre) === 'undefined') ? '' : workorderSelected.titreoeuvre,
            numepisode: workorderSelected.numepisode,
            dureecommerciale: workorderSelected.dureecommerciale,
            libtypeWO: workorderSelected.libtypeWO,
            IdGenerationWO: workorderSelected.IdGenerationWO,
            DepartmentID:workorderSelected.codeRessourceSalle,
            // +
            debut: workorderSelected.debut,
            fin: workorderSelected.fin,
            dureeestime: workorderSelected.dureeestime,
            idwoprec: workorderSelected.idwoprec

        }
        console.log('workorder data selected', newWorkorder);
        this.putWorkorder(newWorkorder.Id_Planning_Events, newWorkorder, event);
    }

    putWorkorder(id, workorder, event) {
        this.workorderService
            .updateWorkOrder(id, workorder)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(res => {
                console.log('update workorder with success : ', res);
                console.log(this.allDataWorkorders); // all brut workorder data in backlog
                this.allDataWorkorders.push(workorder);
                this.timelineResourceDataOut.push(event);
                this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                    dataSource: <Object[]>extend(
                        [], this.timelineResourceDataOut, null, true
                    ),
                    enableTooltip: true, tooltipTemplate: this.temp
                };
                this.WorkOrderByidgroup.push(workorder);
                this.scheduleObj.refreshEvents()
                this.disabledrefresh = false
            }, error => {
                alert('error update workorder');
                console.error('error update workorder : ', error)
            }
            );
    }

    updateWorkorderInDragDropAddToContainer(event, containerParent) {
        console.log('event to workorder backlog => ', event);
        console.log('containerParent to workorder backlog => ', containerParent);
        let now = moment().format('YYYY-MM-DDTHH:mm:ss');
        let workorderResult = this.WorkOrderByidgroup.filter(item => item.Id_Planning_Events === event.Id);
        let workorderSelected = workorderResult[0];
        console.log('workorderSelected', workorderSelected);
        let otherWorkorderExistForCOntainer = this.timelineResourceDataOut.filter(item => item.AzaNumGroupe === event.AzaNumGroupe && !item.AzaIsPere);
        console.log('otherWorkorderExistForCOntainer => ', otherWorkorderExistForCOntainer);
        let startTime = moment(event.StartTime).format('YYYY-MM-DDTHH:mm:ss');
        let endTime = moment(event.EndTime).format('YYYY-MM-DDTHH:mm:ss');
        // let startTime = moment(containerParent.StartTime).format('YYYY-MM-DDTHH:mm:ss');
        // let endTime = moment(containerParent.EndTime).format('YYYY-MM-DDTHH:mm:ss');
        let codeRessourceOperateur;
        let libelleRessourceSalle;
        let codeRessourceSalle;
        this.monteurDataSource.map(item => {
            if (item.Username === event.Operateur) {
                codeRessourceOperateur = item.CodeRessource;
            }
        });
        console.log(this.departmentDataSource);
        this.departmentDataSource.map(item => {
            if (item['Id'] === event.DepartmentID) {
                libelleRessourceSalle = item['Text'];
                codeRessourceSalle = item['codeRessource'];
            }
        });
        if (otherWorkorderExistForCOntainer.length > 0) {
            console.log('otherWorkorderExistForCOntainer => ', otherWorkorderExistForCOntainer);
            let startDifferent = this.checkDiffExistById(containerParent, this.timelineResourceDataOut, 'StartTime', 'StartTime');
            let endDifferent = this.checkDiffExistById(containerParent, this.timelineResourceDataOut, 'EndTime', 'EndTime');
            this.timelineResourceDataOut.push(event);
            let provisionalTimelineDataOut = this.calculPrevisonalDateGroup(
                this.timelineResourceDataOut,
                event.AzaNumGroupe, true, event,
                startDifferent, endDifferent
            );
            console.log('provisionalTimelineDataOut => ', provisionalTimelineDataOut);
            console.log(event.Id);
            let eventNewDates = provisionalTimelineDataOut.filter(item => item['AzaNumGroupe'] === event.AzaNumGroupe && !item['AzaIsPere']);
            console.log(eventNewDates);
            for (let i = 0; i < eventNewDates.length; i++) {
                console.log(eventNewDates[i]);
                this.updateStartTimeAndEndTimeWorkorder(eventNewDates[i], containerParent, provisionalTimelineDataOut);
            }
        } else {
            console.log('NO otherWorkorderExistForCOntainer => ', otherWorkorderExistForCOntainer);
            this.scheduleObj.eventSettings.tooltipTemplate = this.temp;
            let newWorkorder = {
                Id_Planning_Events: workorderSelected.Id_Planning_Events,
                Iddetail: workorderSelected.Iddetail,
                IdTypeWO: workorderSelected.IdTypeWO,
                UserEnvoi: workorderSelected.UserEnvoi,
                DateEnvoi: workorderSelected.DateEnvoi,
                CodeRessourceOperateur: containerParent.CodeRessourceOperateur, // voir ou et si on récupère la donnée par la suite
                CodeRessourceCoordinateur: workorderSelected.CodeRessourceCoordinateur,
                DateSoumission: workorderSelected.DateSoumission,
                DateDebut: workorderSelected.DateDebut, // changement pour remy
                DateFin: workorderSelected.DateFin, // changement pour remy
                DateDebutTheo: startTime,
                DateFinTheo: endTime,
                CodeRessourceSalle: containerParent.CodeRessourceSalle,
                Commentaire: workorderSelected.Commentaire,
                Support1Cree: null,
                Support2Cree: null,
                MustWaitFor: null,
                Statut: workorderSelected.Statut,
                idplanningprec: null,
                Regroup: null,
                Commentaire_Planning: workorderSelected.Commentaire_Planning,
                DateMaj: now,
                UserMaj: this.user.shortUserName,
                Id_Planning_Container: containerParent.Id_Planning_Container,
                isbacklog: 0,
                libchaine: workorderSelected.libchaine,
                typetravail: workorderSelected.typetravail,
                titreoeuvre: (workorderSelected.titreoeuvre === null || typeof (workorderSelected.titreoeuvre) === 'undefined') ? '' : workorderSelected.titreoeuvre,
                numepisode: workorderSelected.numepisode,
                dureecommerciale: workorderSelected.dureecommerciale,
                libtypeWO: workorderSelected.libtypeWO,
                IdGenerationWO: workorderSelected.IdGenerationWO,
                // +
                debut: workorderSelected.debut,
                fin: workorderSelected.fin,
                dureeestime: workorderSelected.dureeestime,
                idwoprec: workorderSelected.idwoprec
            }
            console.log('workorder data selected', newWorkorder);
            this.putWorkorderWithCalcul(newWorkorder, event, containerParent, this.timelineResourceDataOut, true);
        }

    }

    putWorkorderWithCalcul(newWorkorder, eventWorkorder, containerParent, timelineDataOut, pushEvent) {
        this.workorderService
            .updateWorkOrder(newWorkorder.Id_Planning_Events, newWorkorder)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(res => {
                console.log('update workorder with success : ', res);
                console.log(this.allDataWorkorders); // all brut workorder data in backlog
                let containerEvent = this.timelineResourceDataOut.filter(item => item.Id === containerParent.Id_Planning_Container && item.AzaIsPere);
                let containerPere = containerEvent[0];
                this.allDataWorkorders.push(newWorkorder);
                console.log('eventWorkorder =================>', eventWorkorder);
                if (pushEvent) {
                    this.timelineResourceDataOut.push(eventWorkorder);
                }
                let startDifferent = this.checkDiffExistById(containerPere, timelineDataOut, 'StartTime', 'StartTime');
                let endDifferent = this.checkDiffExistById(containerPere, timelineDataOut, 'EndTime', 'EndTime');
                console.log('update only group in timelinesDataOut');
                this.timelineResourceDataOut = this.calculDateGroup(
                    timelineDataOut,
                    containerPere.Id_Planning_Container,
                    true,
                    containerPere,
                    startDifferent,
                    endDifferent
                );
                console.log('this.timelineResourceDataOut after calcul workorder update => ', this.timelineResourceDataOut);
                this.eventSettings = {
                    dataSource: <Object[]>extend([], this.timelineResourceDataOut, null, true),
                    enableTooltip: true, tooltipTemplate: this.temp
                };
                this.disabledrefresh = false
            }, error => {
                alert('error update workorder');
                console.error('error update workorder : ', error)
            }
            );
    }

    updateStartTimeAndEndTimeWorkorder(event, containerParent, provisionalTimelineDataOut) {
        console.log(event);
        let workorder;
        let now = moment().format('YYYY-MM-DDTHH:mm:ss');
        let startTime = moment(event.StartTime).format('YYYY-MM-DDTHH:mm:ss');
        let endTime = moment(event.EndTime).format('YYYY-MM-DDTHH:mm:ss');
        console.log('event ID ============> ', event.Id);
        console.log('this.allDataWorkorders -----> ', this.allDataWorkorders);
        console.log('this.WorkOrderByidgroup -----> ', this.WorkOrderByidgroup);
        let workorderPlanningResult = this.allDataWorkorders.filter(item => item.Id_Planning_Events === event.Id);
        let workorderBacklogResult = this.WorkOrderByidgroup.filter(item => item.Id_Planning_Events === event.Id);
        if (workorderPlanningResult.length > 0) {
            workorder = workorderPlanningResult[0];
            console.log(workorderPlanningResult);
        } else {
            workorder = workorderBacklogResult[0];
            console.log(workorderBacklogResult);
        }
        console.log('workorder before => ', workorder);
        let newWorkorder = {
            Id_Planning_Events: workorder.Id_Planning_Events,
            Iddetail: workorder.Iddetail,
            IdTypeWO: workorder.IdTypeWO,
            UserEnvoi: workorder.UserEnvoi,
            DateEnvoi: workorder.DateEnvoi,
            CodeRessourceOperateur: containerParent.CodeRessourceOperateur, // voir ou et si on récupère la donnée par la suite
            CodeRessourceCoordinateur: workorder.CodeRessourceCoordinateur,
            DateSoumission: workorder.DateSoumission,
            DateDebut: workorder.DateDebut,
            DateFin: workorder.DateFin,
            DateDebutTheo: startTime,
            DateFinTheo: endTime,
            CodeRessourceSalle: containerParent.CodeRessourceSalle,
            Commentaire: workorder.Commentaire,
            Support1Cree: null,
            Support2Cree: null,
            MustWaitFor: null,
            Statut: workorder.Statut,
            idplanningprec: null,
            Regroup: null,
            Commentaire_Planning: workorder.Commentaire_Planning,
            DateMaj: now,
            UserMaj: this.user.shortUserName,
            Id_Planning_Container: containerParent.Id_Planning_Container,
            isbacklog: 0,
            libchaine: workorder.libchaine,
            typetravail: workorder.typetravail,
            titreoeuvre: (workorder.titreoeuvre === null || typeof (workorder.titreoeuvre) === 'undefined') ? '' : workorder.titreoeuvre,
            numepisode: workorder.numepisode,
            dureecommerciale: workorder.dureecommerciale,
            libtypeWO: workorder.libtypeWO,
            IdGenerationWO: workorder.IdGenerationWO,
            // +
            debut: workorder.debut,
            fin: workorder.fin,
            dureeestime: workorder.dureeestime,
            idwoprec: workorder.idwoprec
        }

        console.log('workorder after => ', newWorkorder);
        this.putWorkorderWithCalcul(newWorkorder, event, containerParent, provisionalTimelineDataOut, false);
    }

    /**** PUT WORKORDER BACK TO BACKLOG ****/

    updateWorkorderBackToBacklog(event, containerPere) {
        this.isBackToBacklog = true;
        console.log(event);
        console.log(containerPere);
        console.log('event workorder to transform in workorder data : ', event);
        let now = moment().format('YYYY-MM-DDTHH:mm:ss');
        let workorderResult = this.allDataWorkorders.filter(item => item.Id_Planning_Events === event.Id);
        console.log(this.allDataWorkorders);
        let workorderSelected = workorderResult[0];
        let othersWorkorderForContainer = this.timelineResourceDataOut.filter(item => item.AzaNumGroupe === event.AzaNumGroupe && !item.AzaIsPere);
        if (othersWorkorderForContainer.length <= 0) {
            swal({
                title: 'Supprimer le container associé',
                text: 'Vous supprimez le dernier workorder du container, ' + 'souhaitez-vous supprimer le container ?',
                showCancelButton: true,
                cancelButtonText: 'NON',
                confirmButtonText: 'SUPPRIMER'
            }).then((result) => {
                if (result.value) {
                    this.containersService.deleteContainer(containerPere.Id)
                        .pipe(takeUntil(this.onDestroy$))
                        .subscribe(res => {
                            console.log('delete container with success : ', res);
                            this.allDataContainers = this.allDataContainers.filter(container => container.Id_Planning_Container !== containerPere.Id);
                            console.log('this.allDataContainers after delete container : ', this.allDataContainers);
                            this.timelineResourceDataOut = this.timelineResourceDataOut.filter(item => {
                                if (+event.AzaNumGroupe !== +item.AzaNumGroupe) {
                                    return item;
                                }
                            });
                            this.eventSettings = {
                                dataSource: <Object[]>extend(
                                    [], this.timelineResourceDataOut, null, true
                                )
                            };
                        }, error => {
                            console.error('error for delete container request : ', error);
                        })
                }
            })
        } else {
            // console.log('other workorders presents for container');
            // let provisionaldeletetimelineResourceDataOut = this.timelineResourceDataOut.filter(item => {
            //     if (+event.Id !== +item.Id) {
            //         return item;
            //     }
            // });
            // console.log(provisionaldeletetimelineResourceDataOut);
            // let startDifferent = this.checkDiffExistById(containerPere, provisionaldeletetimelineResourceDataOut, 'StartTime', 'StartTime');
            // let endDifferent = this.checkDiffExistById(containerPere, provisionaldeletetimelineResourceDataOut, 'EndTime', 'EndTime');
            // console.log('startDifferent => ', startDifferent);
            // console.log('endDifferent => ', endDifferent);
            // let provisionalTimelineDataOut = this.calculPrevisonalDateGroup(
            //     provisionaldeletetimelineResourceDataOut,
            //     event.AzaNumGroupe, true, event,
            //     true, true
            // );
            // console.log('provisionalTimelineDataOut => ', provisionalTimelineDataOut);
            // console.log(event.Id);
            // let eventNewDates = provisionalTimelineDataOut.filter(item => item["AzaNumGroupe"] === event.AzaNumGroupe && !item["AzaIsPere"]);
            // console.log(eventNewDates);
            // for (let i = 0; i < eventNewDates.length; i++) {
            //     console.log(eventNewDates[i]);
            //     // this.updateStartTimeAndEndTimeWorkorder(eventNewDates[i], containerPere, provisionalTimelineDataOut);
            // }
        }
        console.log('othersWorkorderForContainer : ', othersWorkorderForContainer);
        let startTime = moment(event.StartTime).format('YYYY-MM-DDTHH:mm:ss');
        let endTime = moment(event.EndTime).format('YYYY-MM-DDTHH:mm:ss');
        let newWorkorder = {
            Id_Planning_Events: workorderSelected.Id_Planning_Events,
            Iddetail: workorderSelected.Iddetail,
            IdTypeWO: workorderSelected.IdTypeWO,
            UserEnvoi: workorderSelected.UserEnvoi,
            DateEnvoi: workorderSelected.DateEnvoi,
            CodeRessourceOperateur: null, // voir ou et si on récupère la donnée par la suite
            CodeRessourceCoordinateur: workorderSelected.CodeRessourceCoordinateur,
            DateSoumission: workorderSelected.DateSoumission,
            DateDebut: workorderSelected.DateDebut,
            DateFin: workorderSelected.DateFin,
            DateDebutTheo: workorderSelected.DateDebutTheo,
            DateFinTheo: workorderSelected.DateFinTheo,
            CodeRessourceSalle: event.CodeRessourceSalle,
            Commentaire: workorderSelected.Commentaire,
            Support1Cree: null,
            Support2Cree: null,
            MustWaitFor: null,
            Statut: workorderSelected.Statut,
            idplanningprec: null,
            Regroup: null,
            Commentaire_Planning: workorderSelected.Commentaire_Planning,
            DateMaj: now,
            UserMaj: this.user.shortUserName,
            Id_Planning_Container: null,
            isbacklog: 1,
            libchaine: workorderSelected.libchaine,
            typetravail: workorderSelected.typetravail,
            titreoeuvre:(workorderSelected.titreoeuvre === null || typeof (workorderSelected.titreoeuvre) === 'undefined') ? '' : workorderSelected.titreoeuvre,
            numepisode: workorderSelected.numepisode,
            libtypeWO: workorderSelected.libtypeWO,
            dureecommerciale: workorderSelected.dureecommerciale,
            IdGenerationWO: workorderSelected.IdGenerationWO,
            // +
            debut: workorderSelected.debut,
            fin: workorderSelected.fin,
            dureeestime: workorderSelected.dureeestime,
            idwoprec: workorderSelected.idwoprec

        }
        console.log(newWorkorder);
        this.workorderService
            .updateWorkOrder(newWorkorder.Id_Planning_Events, newWorkorder)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(res => {
                console.log('update workorder with success : ', res);
                this.allDataWorkorders.filter(item => item.Id_Planning_Events !== newWorkorder.Id_Planning_Events);
                console.log(this.allDataWorkorders); // all brut workorder data in backlog
                this.backToBacklog(event);
                this.WorkOrderByidgroup.push(newWorkorder);
                let startDifferent = this.checkDiffExistById(containerPere, this.timelineResourceDataOut, 'StartTime', 'StartTime');
                let endDifferent = this.checkDiffExistById(containerPere, this.timelineResourceDataOut, 'EndTime', 'EndTime');
                console.log('this.deleteContainerAction', this.deleteContainerAction)
                if (this.deleteContainerAction) {
                    this.eventSettings = {
                        dataSource: <Object[]>extend([], this.timelineResourceDataOut, null, true),
                        enableTooltip: true, tooltipTemplate: this.temp
                    };
                } else {
                    this.eventSettings = {
                        dataSource: <Object[]>extend([],
                            this.calculDateGroup(
                                this.timelineResourceDataOut,
                                event.AzaNumGroupe,
                                true,
                                containerPere,
                                startDifferent,
                                endDifferent
                            ), null, true),
                        enableTooltip: true, tooltipTemplate: this.temp
                    };
                    console.log('this.timelineResourceDataOut => ', this.timelineResourceDataOut)
                    console.log(event.Id);
                    let containerParent = this.allDataContainers.filter(item => item.Id_Planning_Container === containerPere.Id);
                    let eventNewDates = this.timelineResourceDataOut.filter(item => item['AzaNumGroupe'] === containerPere.Id && !item['AzaIsPere']);
                    console.log(eventNewDates);
                    for (let i = 0; i < eventNewDates.length; i++) {
                        console.log(eventNewDates[i]);
                        this.updateStartTimeAndEndTimeWorkorder(eventNewDates[i], containerParent[0], this.timelineResourceDataOut);
                    }
                }
            }, error => {
                alert('error update workorder');
                console.error('error update workorder : ', error)
            }
            );
    }

    backToBacklog(selectedItem) {
        console.log('item back to backlog : ', selectedItem);
        let newWorkorderForList = {
            Id: selectedItem.Id,
            Name: selectedItem.titreoeuvre ,
            StartTime: selectedItem.StartTime,
            EndTime: selectedItem.EndTime,
            Statut: selectedItem.Statut,
            AzaIsPere: false,
            AzaNumGroupe: null,
            CodeRessourceSalle: null,
            ConsultantID: selectedItem.ConsultantID,
            Container: false,
            DepartmentID: null,
            DepartmentName: '',
            Description: null,
            IsAllDay: false,
            Operateur: null,
            coordinateurCreate: this.user.initials,
            numGroup: null,
            libchaine: selectedItem.libchaine,
            typetravail: selectedItem.typetravail,
            titreoeuvre: (selectedItem.titreoeuvre === null || typeof (selectedItem.titreoeuvre) === 'undefined') ? '' : selectedItem.titreoeuvre,
            numepisode: selectedItem.numepisode,
            dureecommerciale: selectedItem.dureecommerciale,
            libtypeWO: selectedItem.libtypeWO,
            Commentaire_Planning: selectedItem.Commentaire_Planning,
            IdGenerationWO: selectedItem.IdGenerationWO,
            Commentaire: selectedItem.Commentaire,
            // +
            debut: selectedItem.debut,
            fin: selectedItem.fin,
            dureeestime: selectedItem.dureeestime,
            idwoprec: selectedItem.idwoprec

        };
        this.field['dataSource'].push(newWorkorderForList);
        this.isAddedToBacklog = true;
        let targetNodeId: string = this.treeObj.selectedNodes[0];
        let nodeId: string = 'tree_' + newWorkorderForList.Id;
        this.eventSettings = {
            enableTooltip: true, tooltipTemplate: this.temp
        };
        this.treeObj.addNodes([newWorkorderForList], targetNodeId, null); // TreeViewComponent
        this.wOrderBackToBacklog = this.field['dataSource'];
        console.log('wOrderBackToBacklog', this.wOrderBackToBacklog);
    }
    /************************************************ PUT Workorder *****************************************/
    updateWorkOrder(args) {

        console.log('update workorder function');
        let now = moment().format('YYYY-MM-DDTHH:mm:ss');

        let event = args.data;
        console.log(event)
        let oldEvent = this.timelineResourceDataOut.filter(item => item.Id === event.Id);
        console.log('old Event workorder :', oldEvent);
        let workorderResult = this.allDataWorkorders.filter(item => item.Id_Planning_Events === event.Id);
        console.log('workorder result ', workorderResult, workorderResult[0]['Id_Planning_Container'])
        let workorder = workorderResult[0];
        let startTime = moment(event.StartTime).format('YYYY-MM-DDTHH:mm:ss');
        let endTime = moment(event.EndTime).format('YYYY-MM-DDTHH:mm:ss');
        let codeRessourceOperateur;
        let libelleRessourceSalle;
        let codeRessourceSalle;
        this.monteurDataSource.map(item => {
            if (item.Username === event.Operateur) {
                codeRessourceOperateur = item.CodeRessource;
            }
        });
        console.log(this.departmentDataSource);
        this.departmentDataSource.map(item => {
            if (item['Id'] === event.DepartmentID) {
                libelleRessourceSalle = item['Text'];
                codeRessourceSalle = item['codeRessource'];
            }
        });

        let newWorkorder = {
            Id_Planning_Events: workorder.Id_Planning_Events,
            Iddetail: workorder.Iddetail,
            IdTypeWO: workorder.IdTypeWO,
            UserEnvoi: workorder.UserEnvoi,
            DateEnvoi: workorder.DateEnvoi,
            CodeRessourceOperateur: workorder.CodeRessourceOperateur, // voir ou et si on récupère la donnée par la suite
            CodeRessourceCoordinateur: workorder.CodeRessourceCoordinateur,
            DateSoumission: null,
            DateDebut: workorder.DateDebut, // changement pour remy
            DateFin: workorder.DateFin, // changement pour remy
            DateDebutTheo: startTime,
            DateFinTheo: endTime,
            CodeRessourceSalle: event.CodeRessourceSalle,
            Commentaire: workorder.Commentaire,
            Support1Cree: null,
            Support2Cree: null,
            MustWaitFor: null,
            Statut: workorder.Statut,
            idplanningprec: null,
            Regroup: null,
            DateMaj: now,
            UserMaj: this.user.shortUserName,
            Id_Planning_Container: workorder.Id_Planning_Container,
            isbacklog: 0,
            libchaine: workorder.libchaine,
            typetravail: workorder.typetravail,
            titreoeuvre: (workorder.titreoeuvre === null || typeof (workorder.titreoeuvre) === 'undefined') ? '' : workorder.titreoeuvre,
            numepisode: workorder.numepisode,
            dureecommerciale: workorder.dureecommerciale,
            libtypeWO: workorder.libtypeWO,
            Commentaire_Planning: event.Commentaire_Planning,
            IdGenerationWO: event.IdGenerationWO,
            // +
            debut: workorder.debut,
            fin: workorder.fin,
            dureeestime: workorder.dureeestime,
            idwoprec: workorder.idwoprec
        }
        console.log('workorder data selected', newWorkorder);
        this.putWorkorderEditor(newWorkorder.Id_Planning_Events, newWorkorder, event);


    }

putWorkorderEditor(id, workorder, event) { // RESIZE AND EditoR
    this.workorderService
    .updateWorkOrder(id, workorder)
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(res => {
            console.log('succes update workorder. RES : ', res);
            let startDifferent = this.checkDiffExistById(event, this.timelineResourceDataOut, 'StartTime', 'StartTime');
            let endDifferent = this.checkDiffExistById(event, this.timelineResourceDataOut, 'EndTime', 'EndTime');
            this.timelineResourceDataOut = this.eventSettings.dataSource as Object[]; // refresh dataSource
            let containerEvent = this.timelineResourceDataOut.filter(item => item.Id === workorder.Id_Planning_Container);
            let containerPere = containerEvent[0];
            console.log('this.timelineResourceDataOut : ', this.timelineResourceDataOut);
            this.timelineResourceDataOut.map(item => {
                if (item.Id === event.Id) {
                    item.Name = event.Name;
                    item.StartTime = event.StartTime;
                    item.EndTime = event.EndTime;
                    item.IsAllDay = event.IsAllDay;
                    item.DepartmentID = event.DepartmentID;
                    item.ConsultantID = event.ConsultantID;
                    item.AzaIsPere = false;
                    item.AzaNumGroupe = event.AzaNumGroupe;
                    item.coordinateurCreate = event.coordinateurCreate;
                    item.Operateur = event.Operateur;
                    item.libchaine= event.libchaine;
                    item.typetravail= event.typetravail;
                    item.titreoeuvre= event.titreoeuvre;
                    item.numepisode = event.numepisode;
                    item.dureecommerciale=  event.dureecommerciale;
                    item.libtypeWO= event.libtypeWO;
                    item.Commentaire_Planning= event.Commentaire_Planning;
                    item.Id_Planning_Container = event.Id_Planning_Container;
                    item.IdGenerationWO = event.IdGenerationWO,
                    item.Commentaire = event.Commentaire,
                    console.log(item);
                }
            });
            this.eventSettings = {
                dataSource: <Object[]>extend(
                    [],
                    this.calculDateGroup(
                        this.timelineResourceDataOut,
                        event.AzaNumGroupe,
                        true,
                        containerPere,
                        startDifferent,
                        endDifferent
                    ),
                    null, true
                    ),
                    enableTooltip: true, tooltipTemplate: this.temp
                };
                // this.eventSettings = {
                //     dataSource: <Object[]>extend(
                //         [], this.calculDateAll(this.timelineResourceDataOut, true, event, startDifferent, endDifferent), null, true
                //     ),
                //     enableTooltip: true, tooltipTemplate: this.temp
                // };
                this.updateWO = false;
                console.log("UPDATE WORKORDERS", this.updateWO)
            }, error => {
                console.error('error updateworkorder', error);
                // alert('error updatecontainer');

            }
            )
    }



    /*************************************************************************/
    /*************************** UTILITY FUNCTIONS ***************************/

    updateEventSetting(data) {
        this.eventSettings = { // Réinitialise les events affichés dans le scheduler
            dataSource: <Object[]>extend(
                [], data, null, true
            ),
            enableTooltip: true, tooltipTemplate: this.temp
        };      
    }

    randomId() {
        let randomId = Math.floor(Math.random() * 100 + 1);
        if (this.idExisting.indexOf(randomId) >= 0) {
            this.randomId();
        } else {
            this.idExisting.push(randomId);
            this.lastRandomId = randomId;
            return randomId;
        }
    }

    findIndexEventById(id) {
        let selectedEvent;
        let indexEvent;
        this.timelineResourceDataOut.forEach(item => {
            if ((item.Id === +id) && (item.AzaIsPere)) {
                selectedEvent = item;
                indexEvent = this.timelineResourceDataOut.indexOf(item);
            }
        });
        return indexEvent;
    }

    /*************************************************************************/
    /************************* NAVIGATION MANAGEMENT *************************/
    /*************************************************************************/

    public navigateFirstOfMouth
    public navigateLastOfMouth
    public activeView = 'TimelineDay';
    public eventTemplate;
    public agendaStartDate;
    public agendaLastDate;
    public calcule;
    public navigateTimelineDay;

   /***** refresh backlog********* */

    onNavigating(args) {
        console.log(' =========================== NEW NAVIGATION ==================== ');
        console.log('onNavigating(args) function => args ==> ', args);
        console.log('onNavigating(args) function => args.currentView ==> ', args.currentView);
        console.log('this.timelineResourceDataOut before reset => ', this.timelineResourceDataOut);
        this.timelineResourceDataOut = [];
        console.log('this.timelineResourceDataOut after reset => ', this.timelineResourceDataOut);
        this.scheduleObj.enablePersistence = false;
        this.navigation = true
        // this.refreshWorkordersBacklog()
   
        this.disableNavigation = true;
        if(this.disableNavigation){
            let toolbar = document.getElementsByClassName('e-toolbar-items');
            for(let i =0; i<toolbar.length; i++){
                toolbar[i]["style"].display = 'none'
            console.log(  toolbar[i]["style"],"none" )
            }
          }
        // this.newTreeObj = this.treeObj;
        // this.treeObj.destroy();
        // this.treeObj = this.newTreeObj;
        // this.treeObj['fields'] = this.field;
        console.log(this.treeObj);
        // this.treeObj['ngEle'].nativeElement = ejs-treeview.e-control.e-treeview.e-lib.treeview-external-drag.e-fullrow-wrap.e-draggable.e-droppable.e-touch.e-keyboard;
        // [fields]='field'
        // cssClass='treeview-external-drag'
        // [allowMultiSelection]='false'
        // [allowDragAndDrop]='true'
        // (nodeDragStart)="onTreeDragStart($event)"
        // (nodeDragStop)="onTreeDragStop($event)"
        // (nodeSelecting)="onTreeSelecting($event)"
        // (nodeSelecting)="onTreeSelected($event)"
        // (nodeExpanding)="onTreeExpanding($event)"
        // (nodeDragging)="onItemDrag($event, 0)"
        console.log(this.scheduleObj, '=========================================================================');
        console.log(this.treeObj);
        console.log(this.field);
        console.log(this.departmentDataSource);
        console.log(args.currentDate);
        console.log(this.scheduleObj.selectedDate);
        if (args.currentDate == undefined) {
            console.log('pas de currentDate');
            let newStartOfDay = this.scheduleObj.selectedDate;
            console.log('selected Date => ', newStartOfDay);
            this.startofDay = moment(newStartOfDay).toDate();
            this.endofDay =  moment(newStartOfDay).add(1, 'd').toDate();
        } else {
            this.startofDay = moment(args.currentDate).toDate();
            this.endofDay =  moment(args.currentDate).add(1, 'd').toDate();
        }
        this.startofWeek = moment(this.startofDay).startOf('week').add(1, 'd').toDate(); // LUNDI
        this.endofWeek = moment(this.startofDay).endOf('week').add(2, 'd').toDate(); // LUNDI SUIVANT
        this.startofMonth = moment(this.startofDay).startOf('month').toDate();
        this.endofMonth = moment(this.startofDay).endOf('month').add(1, 'd').toDate();
        console.log('this.startofDay ==> ', this.startofDay);
        console.log('this.endofDay ==> ', this.endofDay);
        console.log('this.startofWeek ==> ', this.startofWeek);
        console.log('this.endofWeek ==> ', this.endofWeek);
        console.log('this.startofMonth ==> ', this.startofMonth);
        console.log('this.endofMonth ==> ', this.endofMonth);

        // this.agendaStartDate = moment().toDate()
        // this.agendaLastDate = moment().add(7, 'd').toDate()
        // console.log('this.agendaStartDate => ', this.agendaStartDate);
        // console.log('this.agendaLastDate => ', this.agendaLastDate);
        console.log('this.scheduleObj.currentView ==> ', this.scheduleObj.currentView);
        console.log('args.currentView ==> ', args.currentView);

        if (this.filtre == true) {
            this.filtre = true
        }
        let scheduleElement = document.getElementsByClassName('schedule');
        /************** ARGS.CURRENTVIEW CONDITIONS ************/

        /** readonly management **/
        if ((args.currentView === 'TimelineWeek') || (args.currentView === 'TimelineDay') || (args.currentView === 'MonthAgenda')) {      
            this.scheduleObj.readonly = false
            if (this.isnotMyGroup == true) {
                this.scheduleObj.readonly = true
            } else {
                this.scheduleObj.readonly = false
            }
        } else if (args.currentView === 'TimelineMonth' || args.currentView === 'Agenda') {
            this.scheduleObj.readonly = true
            if (args.action === 'date') {
                this.scheduleObj.readonly = true
                console.log('this.scheduleObj.readonly => ', this.scheduleObj.readonly)
            }
        }
        // TIMELINEDAY
        if ((args.currentView === 'TimelineDay') || (args.currentView == undefined && (this.scheduleObj.currentView === 'TimelineDay'))) {
            this.valueMax = 85
            if(this.value <this.valueMax){
                scheduleElement[0]['style'].zoom =this.valueMax.toString() +"%"
                this.value = 80
                console.log("value zoom ",scheduleElement[0]['style'].zoom )
            }
            console.log( 'TimelineDay first call condition width management value');  
            // this.valueMax = 60
            // this.value = parseInt(this.intervalValueDay as string, 10)
            // this.valueAdd = 10       
            this.intervalData = ['10', '20', '30', '40', '50', '60'];
            this.scheduleObj.timeScale = { enable: true, interval: parseInt(this.intervalValueDay as string, 10), slotCount: 2 }
            console.log('TIMELINEDAY !!!! => date contition');
            this.refreshDateStart = this.startofDay;
            this.refreshDateEnd = this.endofDay;
            this.salleDataSource.forEach(salle => {
                let indexSalle = this.salleDataSource.indexOf(salle);
                this.getContainersByRessourceStartDateEndDate(
                    salle.CodeRessource,
                    this.startofDay,
                    this.endofDay,
                    salle.CodeSalle,
                    indexSalle
                );
            });
            this.scheduleObj.refreshEvents();
            console.log('timelineResourceDataOut => ', this.timelineResourceDataOut);    
        // TIMELINEWEEK
        } else if ((args.currentView === 'TimelineWeek') || (args.currentView == undefined && (this.scheduleObj.currentView === 'TimelineWeek'))) {        
            console.log(this.disableNavigation,"disablenavig")
            console.log( 'TimelineWEEK first call condition width management value');
            this.valueMax = 20
            // this.value = parseInt(this.intervalValue as string, 10)
            // this.valueMax = 240
            // this.valueAdd = 60       
            this.intervalData = ['10', '20', '30', '40', '50','60', '120'];
            this.scheduleObj.timeScale = { enable: true, interval: parseInt(this.intervalValue as string, 10), slotCount: 1 }
            this.timelineResourceDataOut = []
            console.log('timelineResourceDataOut => ', this.timelineResourceDataOut);
            this.refreshDateStart = this.startofWeek;
            this.refreshDateEnd = this.endofWeek;
            this.salleDataSource.forEach(salle => {
                let indexSalle = this.salleDataSource.indexOf(salle);
                this.getContainersByRessourceStartDateEndDate(
                    salle.CodeRessource,
                    this.startofWeek,
                    this.endofWeek,
                    salle.CodeSalle,
                    indexSalle
                );
            });
            this.scheduleObj.refreshEvents();
            console.log('timelineResourceDataOut => ', this.timelineResourceDataOut);
        // TIMELINEMONTH
        } else if ((args.currentView === 'TimelineMonth') || (args.currentView == undefined && (this.scheduleObj.currentView === 'TimelineMonth'))){     
            this.valueMax = 80
            if(this.value <this.valueMax){
                scheduleElement[0]['style'].zoom =this.valueMax.toString() +"%"
                this.value = this.valueMax
            }
            this.timelineResourceDataOut = [];
            console.log('timelineResourceDataOut => ', this.timelineResourceDataOut);
            this.refreshDateStart = this.startofMonth;
            this.refreshDateEnd = this.endofMonth;
            this.salleDataSource.forEach(salle => {
                let indexSalle = this.salleDataSource.indexOf(salle);
                this.getContainersByRessourceStartDateEndDate(
                    salle.CodeRessource,
                    this.startofMonth,
                    this.endofMonth,
                    salle.CodeSalle,
                    indexSalle
                );
            });
            this.scheduleObj.refreshEvents();

       
        }
        // else if (args.currentView === 'MonthAgenda') { // MONTHAGENDAVIEW
        //     // if (args.action === date){
        //     //     this.timelineResourceDataOut = []
        //     //   this.navigateFirstOfMouth = moment(args.currentDate).startOf('month').toDate()
        //     //   this.navigateLastOfMouth = moment(args.currentDate).endOf('month').add(1,'d').toDate()
        //     //   console.log(this.navigateFirstOfMouth, "++++++++++++++++++++++++", this.navigateLastOfMouth  )
        //     //   console.log("debut", this.startofWeek , "fin", this.endofWeek,"+++++++++",this.startofMonth,"++++++",this.endofMonth)
        //     //       console.log(this.scheduleObj)
        //     //                this.salleDataSource.forEach(salle => {
        //     //                    let indexSalle = this.salleDataSource.indexOf(salle);
        //     //                    this.getContainersByRessourceStartDateEndDate(
        //     //                        salle.CodeRessource,
        //     //                        this.navigateFirstOfMouth,
        //     //                        this.navigateLastOfMouth ,
        //     //                        salle.CodeSalle,
        //     //                        indexSalle
        //     //                    );
        //     //                });
        //     // }
        //     if (args.action === "view") {
        //         this.timelineResourceDataOut = [];
        //         console.log('timelineResourceDataOut => ', this.timelineResourceDataOut);
        //         this.refreshDateStart = this.startofMonth;
        //         this.refreshDateEnd = this.endofMonth;
        //         this.salleDataSource.forEach(salle => {
        //             let indexSalle = this.salleDataSource.indexOf(salle);
        //             this.getContainersByRessourceStartDateEndDate(
        //                 salle.CodeRessource,
        //                 this.startofMonth,
        //                 this.endofMonth,
        //                 salle.CodeSalle,
        //                 indexSalle
        //             );
        //         });
        //         console.log('timelineResourceDataOut => ', this.timelineResourceDataOut);
        //     }
        // }
        // else if (args.currentView === "Agenda") { // AGENDAVIEW
        //     if (args.action === "date") {
        //         let navigateFirstOfWeek = moment(args.currentDate).toDate(),
        //             navigateLastOfWeek = moment(args.currentDate).add(7, 'd').toDate()
        //         this.timelineResourceDataOut = []
        //         this.refreshDateStart = navigateFirstOfWeek;
        //         this.refreshDateEnd = navigateLastOfWeek;
        //         this.salleDataSource.forEach(salle => {
        //             let indexSalle = this.salleDataSource.indexOf(salle);
        //             this.getContainersByRessourceStartDateEndDate(
        //                 salle.CodeRessource,
        //                 navigateFirstOfWeek,
        //                 navigateLastOfWeek,
        //                 salle.CodeSalle,
        //                 indexSalle
        //             );
        //         });
        //     }
        //     if (args.action === "view") {
        //         this.timelineResourceDataOut = []
        //         this.calcule = false
        //         console.log('timelineResourceDataOut => ', this.timelineResourceDataOut);
        //         this.refreshDateStart = this.agendaStartDate;
        //         this.refreshDateEnd = this.agendaLastDate;
        //         this.salleDataSource.forEach(salle => {
        //             let indexSalle = this.salleDataSource.indexOf(salle);
        //             this.getContainersByRessourceStartDateEndDate(
        //                 salle.CodeRessource,
        //                 this.agendaStartDate,
        //                 this.agendaLastDate,
        //                 salle.CodeSalle,
        //                 indexSalle
        //             );
        //         });
        //     }
        // }
        // this.scheduleObj.refresh();
    }

    onEventRendered(args: EventRenderedArgs): void {
        let couleur
        if (args.data.AzaIsPere) {
            return;
        } else {
            this.colorStatut.forEach(statut => {
                if (args.data.Statut === statut['Id']) {
                    couleur = statut['Color']
                }
            })
            this.workOrderColor = couleur
            if (this.scheduleObj.currentView === 'MonthAgenda') {
                (args.element.firstChild as HTMLElement).style.borderLeftColor = this.workOrderColor;
                (args.element.firstChild as HTMLElement).style.marginLeft = '30px'
                args.element.style.borderLeftColor = this.workOrderColor;
                console.log('statut', args)

            } else {
                if (this.scheduleObj.currentView === 'Agenda') {
                    (args.element.firstChild as HTMLElement).style.borderLeftColor = this.workOrderColor;
                    (args.element.firstChild as HTMLElement).style.marginLeft = '30px'
                    // args.element.style.borderLeftColor =  this.workOrderColor;

                } else {
                    (args.element.firstChild as HTMLElement).style.backgroundColor = this.workOrderColor;
                    args.element.style.backgroundColor = this.workOrderColor;
                }
            }
        }
     
    }

    /*************************************************************************/
    /*************************** MODALS M1ANAGEMENT **************************/
    /*************************************************************************/

    public couleur;
    public cancel
    public zoom: boolean = true;
    public CellClick: boolean = true;
    public hourContainer;
    public elementRow
    public updateWO:boolean = false;
    onPopupOpen(args) { // open container modal and display workorder list
        let workOrders = [];
        // this.filtre = true
        // this.zoom = true
        console.log(args);
        // if (args.type === 'EventContainer') {
        //     args.data.element.innerText = `Plus`;
        //     // args.data.event = args.data.event[0]
        //     for (let i = 0; i < args.data.event.length; i++) {
        //         console.log('AzaIsPere', args.data.event[i].AzaIsPere);
        //         if (args.data.event[i].AzaIsPere == false) {
        //             let elem = args.element.getElementsByClassName('e-appointment');
        //             elem[i].hidden = true;
        //             console.log('elem', elem);
        //             this.scheduleObj.resizing;
        //         }
        //         console.log(this.scheduleObj);
        //     }
        // }
        this.hourContainer =  moment(args.data['StartTime']).add(1,"hour").format('HH:mm')
        if (args.type === 'QuickInfo') {
            this.colorStatut.map(statut => {
                if (args.data.Statut == statut['Id']) {
                    this.couleur = statut['Color']
                }
            })
        }
        let colorRow = this.couleur
        args.element.hidden = false;
        if ((args.type === 'QuickInfo') && (args.data.name === 'cellClick')) {
            args.cancel = true;
        }
        if (this.cancelObjectModal) {
            args.cancel = true;
        }
        if ((args.type === 'QuickInfo') && (args.name === 'popupOpen')) {
            args.cancel = true;
            let title = document.getElementsByClassName('e-subject-container');
            let subTitle = document.getElementsByClassName('e-location-container');
            let Debut = document.getElementsByClassName('e-start-container');
            let fin = document.getElementsByClassName('e-end-container');
            let regie = document.getElementsByClassName('e-resources');
            let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
            let repeat = document.getElementsByClassName('e-editor');
            isAllDay[0]['style'].display = 'none';
            repeat[0]['style'].display = 'none';
            title[0]['style'].display = 'block';
            subTitle[0]['style'].display = 'none';
            Debut[0]['style'].display = 'block';
            fin[0]['style'].display = 'block';
            regie[0]['style'].display = 'block';

            if ((args.target.className === "e-appointment e-lib e-draggable e-appointment-border")) {
                args.cancel = false;
            }
        }
        if (args.data.hasOwnProperty('AzaIsPere') && args.type !== 'Editor') {
            if (args.data.AzaIsPere) {
                this.timelineResourceDataOut.map(item => {
                    if (item.AzaNumGroupe === args.data.AzaNumGroupe && item.AzaIsPere === false) {
                        workOrders.push(item);
                    }
                });
                let row: HTMLElement = createElement('div', {
                    className: 'e-sub-object-list'
                });
                let elementParent: HTMLElement = <HTMLElement>args.element.querySelector('.e-popup-content');
                elementParent.style.overflow = 'auto'
                elementParent.style.maxHeight = '40vh'
                elementParent.appendChild(row);
                for (let i = 0; i < workOrders.length; i++) {
                    let idRegie = workOrders[i].DepartmentID;
                    let colorRegie: string;

                    this.departmentDataSource.map(item => {
                        if (item['Id'] === idRegie) {
                            colorRegie = item['Color'];
                        }
                    });
                    console.log(this.couleur, this.workOrderColor, '**********************************couleur*************************************')
                    row.innerHTML += `<div id='id${i}' style="color : black">${workOrders[i].titreoeuvre} ep ${workOrders[i].numepisode}</div>`;
                   let element = document.getElementById('id' + i)
                if(this.workOrderColor != undefined){
                    element.style.backgroundColor = this.workOrderColor
                }else{
                    element.style.backgroundColor = '#95b9'
                }
                }
                for (let e = 0; e < workOrders.length; e++) {
                    let child = document.getElementById(`id${e}`);
                    child.addEventListener('click', () => {
                        args.cancel = true;
                        args.element.hidden = true;
                        this.openDialog(args, args.data, workOrders[e], this.departmentDataSource);
                        console.log(child)
                    }, true);
                }

            } else {
                let elementworkorder: HTMLElement = <HTMLElement>args.element.querySelector('.e-subject');

                this.timelineResourceDataOut.map(item => {
                    if (item.AzaNumGroupe === args.data.AzaNumGroupe && item.AzaIsPere === false) {
                        workOrders.push(item);
                    }
                });
                for (let i = 0; i < workOrders.length; i++) {
                    // ${workOrders[i].typetravail}
                    elementworkorder.innerHTML = `<div class='e-subject e-text-ellipsis' style="color : black"> ${workOrders[i].titreoeuvre} ep ${workOrders[i].numepisode} </div>`
                }


            }
        }
        if (args.data.name === 'cellClick') {
            console.log('cell click', args)
            this.filtre = true
            this.zoom = true
            this.CellClick = true
            if (args.target.className === "e-header-cells  e-current-day" || args.target.className === "e-header-cells") {
                args.cancel = true
                args.data.cancel = true
                console.log(args, "-----------------------------------")
            }
            console.log(this.scheduleObj.selectedDate)
            console.log(this.isTreeItemDropped);
            this.creationArray = [];
            this.isTreeItemDropped = false;
            let title = document.getElementsByClassName('e-subject-container');
            let subTitle = document.getElementsByClassName('e-location-container');
            let Debut = document.getElementsByClassName('e-start-container');
            let fin = document.getElementsByClassName('e-end-container');
            let regie = document.getElementsByClassName('e-resources');
            let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
            let repeat = document.getElementsByClassName('e-editor');
            isAllDay[0]['style'].display = 'none';
            repeat[0]['style'].display = 'none';
            title[0]['style'].display = 'block';
            subTitle[0]['style'].display = 'none';
            Debut[0]['style'].display = 'block';
            fin[0]['style'].display = 'block';
            regie[0]['style'].display = 'block';


        }
        if (args.data.name === 'cellDoubleClick') {
            console.log('cell double click', args);
            console.log(this.isTreeItemDropped);
            this.creationArray = [];
            this.isTreeItemDropped = false;
        }
        if (this.filtre == false && this.CellClick == true) {
            this.filtre = true
            this.zoom = true
        }
        if (((args.type === 'Editor') && this.eventClick) || ((args.type === 'Editor') && this.checkIfContainerAlreadyExists(args) === false)) {
            console.log('this.checkIfContainerAlreadyExists(args); => ', this.checkIfContainerAlreadyExists(args));
            this.filtre = false
            this.zoom = false
            console.log('Editor Open and this.isTreeItemDropped = ', this.isTreeItemDropped);
            console.log(this.openEditorCount);
            if (this.openEditorCount === 0) { // diplay none for IsAllDay and Repeat field in editor

                let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                isAllDay[0]['style'].display = 'none';
                let repeat = document.getElementsByClassName('e-editor');
                repeat[0]['style'].display = 'none';
                let subTitle = document.getElementsByClassName('e-location-container');
                subTitle[0]['style'].display = 'none';

                if (!args.data.AzaIsPere) {
                    let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                    let repeat = document.getElementsByClassName('e-editor');
                    let title = document.getElementsByClassName('e-subject-container');
                    let subTitle = document.getElementsByClassName('e-location-container');
                    let Debut = document.getElementsByClassName('e-start-container');
                    let fin = document.getElementsByClassName('e-end-container');
                    let regie = document.getElementsByClassName('e-resources');
                    title[0]['style'].display = 'none';
                    subTitle[0]['style'].display = 'none';
                    Debut[0]['style'].display = 'none';
                    fin[0]['style'].display = 'none';
                    regie[0]['style'].display = 'none';
                    isAllDay[0]['style'].display = 'none';
                    repeat[0]['style'].display = 'none';
                }
            }
            if (!args.data.AzaIsPere) {
                let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                let repeat = document.getElementsByClassName('e-editor');
                let title = document.getElementsByClassName('e-subject-container');
                let subTitle = document.getElementsByClassName('e-location-container');
                let Debut = document.getElementsByClassName('e-start-container');
                let fin = document.getElementsByClassName('e-end-container');
                let regie = document.getElementsByClassName('e-resources');
                console.log('repeat', title[0]);
                console.log('repeat', subTitle[0]);
                title[0]['style'].display = 'none';
                subTitle[0]['style'].display = 'none';
                Debut[0]['style'].display = 'none';
                fin[0]['style'].display = 'none';
                regie[0]['style'].display = 'none';
                console.log('isAllDay :', isAllDay[0]);
                isAllDay[0]['style'].display = 'none';
                console.log('repeat', repeat[0]);
                repeat[0]['style'].display = 'none';
                console.log(title[0]['style'].display, "sssssssssssssssssssssssssssssssssssssss")
               this.updateWO = true
            } else {
                let subTitle = document.getElementsByClassName('e-location-container');
                let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                let repeat = document.getElementsByClassName('e-editor');
                console.log('subTitle', subTitle[0]);
                subTitle[0]['style'].display = 'none';
                console.log('isAllDay :', isAllDay[0]);
                isAllDay[0]['style'].display = 'none';
                console.log('repeat', repeat[0]);
                repeat[0]['style'].display = 'none';

            }
            console.log('Open Editor');
            let inputEle: HTMLInputElement;
            let container: HTMLElement;
            let containerOperateur = document.getElementsByClassName('custom-field-container');

            let annuler = document.getElementsByClassName("e-event-cancel")
            console.log(annuler);
            annuler[0].addEventListener('click', () => {
                this.cancel = true
                this.zoom = true
                this.filtre = false
                console.log('click annuler ', this.zoom, this.filtre)
            }, true);
            if (args.data.hasOwnProperty('AzaIsPere')) {
                console.log('open Editor', args);
                console.log(this.drowDownOperateurList);
                if (args.data.AzaIsPere) { // dblclick container
                    if (containerOperateur.length === 0) {
                        console.log('containerOperateur.length = 0', containerOperateur);
                        this.createDrowDownOperteurInput(args, container, inputEle);
                        console.log("==>>",this.drowDownOperateurList); 
                        this.drowDownOperateurList.onchange = args.data.Operateur = this.drowDownOperateurList.value;
                        console.log("==>>",this.drowDownOperateurList)
                        console.log(args.data.Operateur);
                    }
                    this.drowDownOperateurList.dataSource = this.fieldMonteur['dataSource'].map(item => {
                        return { text: item.Username, value: item.CodeRessource };
                    });
                    this.drowDownOperateurList.dataSource.unshift({ text: 'Aucun Opérateur', value: 0 });
                    let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                    let repeat = document.getElementsByClassName('e-editor');
                    let title = document.getElementsByClassName('e-subject-container');
                    let subTitle = document.getElementsByClassName('e-location-container');
                    let Debut = document.getElementsByClassName('e-start-container');
                    let fin = document.getElementsByClassName('e-end-container');
                    let regie = document.getElementsByClassName('e-resources');
                    console.log('repeat', title[0]);
                    console.log('repeat', subTitle[0]);
                    title[0]['style'].display = 'block';
                    isAllDay[0]['style'].display = 'none';
                    console.log('repeat', repeat[0]);
                    repeat[0]['style'].display = 'none';
                    Debut[0]['style'].display = 'block';
                    fin[0]['style'].display = 'block';
                    regie[0]['style'].display = 'block';
                    console.log(title[0]['style'].display, "sssssssssssssssssssssssssssssssssssssss")
                } else { // dblclick workorder
                    containerOperateur[0].parentNode.removeChild(containerOperateur[0]);
                    console.log("edit click")
                    if (!args.data.AzaIsPere) {
                        let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                        let repeat = document.getElementsByClassName('e-editor');
                        let title = document.getElementsByClassName('e-subject-container');
                        let subTitle = document.getElementsByClassName('e-location-container');
                        let Debut = document.getElementsByClassName('e-start-container');
                        let fin = document.getElementsByClassName('e-end-container');
                        let regie = document.getElementsByClassName('e-resources');
                        console.log('repeat', title[0]);
                        console.log('repeat', subTitle[0]);
                        title[0]['style'].display = 'none';
                        subTitle[0]['style'].display = 'none';
                        Debut[0]['style'].display = 'none';
                        fin[0]['style'].display = 'none';
                        regie[0]['style'].display = 'none';
                        isAllDay[0]['style'].display = 'none';
                        console.log('repeat', repeat[0]);
                        repeat[0]['style'].display = 'none';
                        console.log(title[0]['style'].display, "sssssssssssssssssssssssssssssssssssssss")
                    }
                }
            } else {
                if (args.name === 'popupOpen' && args.type === 'Editor' ) {
                    let title = document.getElementsByClassName('e-subject-container');
                    let subTitle = document.getElementsByClassName('e-location-container');
                    let Debut = document.getElementsByClassName('e-start-container');
                    let fin = document.getElementsByClassName('e-end-container');
                    let regie = document.getElementsByClassName('e-resources');
                    let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                    let repeat = document.getElementsByClassName('e-editor');
                    title[0]['style'].display = 'block';
                    subTitle[0]['style'].display = 'none';
                    Debut[0]['style'].display = 'block';
                    fin[0]['style'].display = 'block';
                    regie[0]['style'].display = 'block';
                    console.log('title', title[0]);
                    console.log('subtitle', subTitle[0]);
                    isAllDay[0]['style'].display = 'none';
                    console.log('repeat', repeat[0]);
                    repeat[0]['style'].display = 'none';

                    if(args.target === undefined){
                    let title = document.getElementsByClassName('e-subject-container');
                    let subTitle = document.getElementsByClassName('e-location-container');
                    let Debut = document.getElementsByClassName('e-start-container');
                    let fin = document.getElementsByClassName('e-end-container');
                    let regie = document.getElementsByClassName('e-resources');
                    let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                    let repeat = document.getElementsByClassName('e-editor');
                    title[0]['style'].display = 'block';
                    subTitle[0]['style'].display = 'none';
                    Debut[0]['style'].display = 'block';
                    fin[0]['style'].display = 'block';
                    regie[0]['style'].display = 'block';
                    console.log('title', title[0]);
                    console.log('subtitle', subTitle[0]);
                    isAllDay[0]['style'].display = 'none';
                    console.log('repeat', repeat[0]);
                    repeat[0]['style'].display = 'none';
                    }

                }


                if (containerOperateur.length === 0) {
                    this.createDrowDownOperteurInput(args, container, inputEle);
                    this.drowDownOperateurList.onchange = args.data.Operateur = this.drowDownOperateurList.value;
                }
                   this.drowDownOperateurList.dataSource = this.fieldMonteur['dataSource'].map(item => {
                        return { text: item.Username, value: item.CodeRessource };
                    });
            }
            this.openEditorCount = 1;
            this.eventClick = false;
        } else if ((args.type === 'Editor') && this.checkIfContainerAlreadyExists(args)) {
            console.log('this.checkIfContainerAlreadyExists(args); => ', this.checkIfContainerAlreadyExists(args));
            args.cancel = true;
        }
        if (args.target != undefined && (args.target.classList.value === "e-header-cells e-current-day" || args.target.classList.value === "e-header-cells")) {
            args.data.cancel = true;
            args.cancel = true;
            console.log(args, "-----------------------------------")
        }
    }

    checkIfContainerAlreadyExists(args): boolean {
        let containerAlreadyExists = [];
        console.log('checkIfContainerAlreadyExists args = ', args);
        this.timelineResourceDataOut.map(item => {
            if (item.AzaIsPere && (+item.DepartmentID === +args.data.DepartmentID)) {
                let containerStartTime = +item.StartTime;
                let containeEndTime = +item.EndTime;
                let eventStartTime = +args.data.StartTime;
                console.log(containerStartTime);
                console.log(containeEndTime);
                console.log(eventStartTime);
                if ((eventStartTime >= containerStartTime) && (eventStartTime < containeEndTime)) {
                    containerAlreadyExists.push(item);
                    console.log(containerAlreadyExists);
                }
            }
        });
        if (containerAlreadyExists.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    public valueOperateur
    createDrowDownOperteurInput(args, container, inputEle) {
        let row: HTMLElement = createElement('div', { className: 'custom-field-row' });
        let formElement: HTMLElement = <HTMLElement>args.element.querySelector('.e-schedule-form');
        formElement.firstChild.insertBefore(row, args.element.querySelector('.e-resources-row'));
        container = createElement('div', { className: 'custom-field-container' });
        inputEle = createElement('input', {
            className: 'e-field', attrs: { name: 'Operateur' }
        }) as HTMLInputElement;
        container.appendChild(inputEle);
        row.appendChild(container);
        // this.drowDownMonteurs = this.monteurDataSource.map(item => {
        //     return { text: item.Username, value: item.CodeRessource };
        // });
        this.drowDownMonteurs = this.fieldMonteur['dataSource'].map(item => {
            return { text: item.Username, value: item.CodeRessource };
        });
        this.drowDownMonteurs.unshift({ text: 'Aucun Opérateur', value: 0 });
        this.drowDownOperateurList = new DropDownList({
            dataSource: this.drowDownMonteurs,
            fields: { text: 'text', value: 'text' },
            value:  args.data.Operateur,
            floatLabelType: 'Always', placeholder: 'Opérateur'
        });
        this.drowDownOperateurList.appendTo(inputEle);
        inputEle.setAttribute('name', 'Operateur');
        args.data.Operateur = this.drowDownOperateurList.value;
        this.drowDownExist = true;
    }

    openDialog(args, object, subObject, categories): void { // open workorder modal from container list
        let category;
        let containerModal = document.getElementsByClassName('cdk-overlay-container');
        for (let i = 0; i < containerModal.length; i++) {
            containerModal[i].classList.remove('hidden');
        }
        categories.map(item => {
            if (object.DepartmentID === item.Id) {
                category = item;
            }

        });
        const dialogRef = this.dialog.open(WorkorderDetailsModalComponent, {
            width: '365px',
            data: {
                workorder: subObject,
                regie: category,
                color: this.couleur
            }
        });
    }

    /*************************************************************************/
    /********************** DRAG AND DROP M1ANAGEMENT ***********************/

    onItemDrag(event: any, tabIndex): void { // FUCNTION FROM TEMPLATE
        event.interval = 5;
        this.disabledrefresh = true
        console.log('ooooooooooooooooooooooooooooooooooooooooooooooooooooooooo', event)
        if(event.name === 'nodeDragging') {
            console.log('nodeDragging event => ', event)
            this.tabInstance.select(tabIndex);
            if (document.body.style.cursor === 'not-allowed') {
                document.body.style.cursor = '';
            }
            if (event.name === 'nodeDragging') {
                let dragElementIcon: NodeListOf<HTMLElement> =
                    document.querySelectorAll('.e-drag-item.treeview-external-drag .e-icon-expandable') as NodeListOf<HTMLElement>;
                for (let i: number = 0; i < dragElementIcon.length; i++) {
                    dragElementIcon[i].style.display = 'none';
                }
            }
        }
    }

    public onTreeDragStartCountDevTool = 0;
    onTreeDragStart(event) {
        console.log(this.onTreeDragStartCountDevTool);
        this.onTreeDragStartCountDevTool++;
        console.log('call onTreeDragStart() / event => ', event);
        console.log(this.treeObj);
    }

    selectTabWitoutSwip (e: SelectEventArgs) {
      if (e.isSwiped) {
        e.cancel = true;
      }
    }

    /******* DRAG AND DROP WORKORDERS *******/

    onTreeDragStop(event: DragAndDropEventArgs): void {
        console.log(event)
        this.creationArray = [];
        this.newData = [];
        let treeElement = closest(event.target, '.e-treeview');
        if (!treeElement) {
            console.log(event)
            // event.cancel = true;
            let scheduleElement: Element = <Element>closest(event.target, '.e-content-wrap');
            if (scheduleElement) { // IF EMPLACEMENT EST VIDE
                let treeviewData: { [key: string]: Object }[] =
                    this.treeObj.fields.dataSource as { [key: string]: Object }[];
                if (event.target.classList.contains('e-work-cells')) {
                    const filteredData: { [key: string]: Object }[] =
                        treeviewData.filter((item: any) => item.Id === parseInt(event.draggedNodeData.id as string, 10));
                    this.randomId();
                    console.log('last Random id : ', this.lastRandomId);
                    console.log('event target : ', event.target);
                    console.log('treeviewData  : ', treeviewData);
                    let cellData: CellClickEventArgs = this.scheduleObj.getCellDetails(event.target);
                    let resourceDetails: ResourceDetails = this.scheduleObj.getResourcesByIndex(cellData.groupIndex);
                    let containerData = { // DISPLAY DATA FOR CONTAINER
                        Id: this.lastRandomId,
                        Name: 'Title',
                        StartTime: cellData.startTime,
                        EndTime: cellData.endTime,
                        IsAllDay: false,
                        DepartmentID: resourceDetails.resourceData.Id,
                        ConsultantID: resourceDetails.resourceData.Id,
                        AzaIsPere: true,
                        AzaNumGroupe: this.lastRandomId,
                        coordinateurCreate: this.user.initials,
                        Operateur: '',
                                        };
                    console.log(filteredData[0], 'filteredData[0]');
                    let eventData: { [key: string]: Object } = { // DISPLAY DATA FOR EVENT
                        Id: filteredData[0].Id,
                        Name: filteredData[0].titreoeuvre,
                        StartTime: cellData.startTime,
                        EndTime: cellData.endTime,
                        IsAllDay: false,
                        Description: filteredData[0].Description,
                        DepartmentID: resourceDetails.resourceData.Id,
                        ConsultantID: resourceDetails.resourceData.Id,
                        AzaIsPere: false,
                        AzaNumGroupe: this.lastRandomId,
                        coordinateurCreate: this.user.initials,
                        Statut: filteredData[0].Statut,
                        libchaine: filteredData[0].libchaine,
                        typetravail: filteredData[0].typetravail,
                        titreoeuvre: (filteredData[0].titreoeuvre === null || typeof (filteredData[0].titreoeuvre) === 'undefined') ? '' : filteredData[0].titreoeuvre,
                        numepisode: filteredData[0].numepisode,
                        dureecommerciale: filteredData[0].dureecommerciale,
                        Commentaire_Planning: filteredData[0].Commentaire_Planning,
                        libtypeWO: filteredData[0].libtypeWO,
                        IdGenerationWO: filteredData[0].IdGenerationWO,

                    };
                    this.scheduleObj.eventSettings.tooltipTemplate = this.temp;
                    let annuler = document.getElementsByClassName("e-event-cancel")
                    let btnClose = document.getElementsByClassName("e-dlg-closeicon-btn")
                    console.log(annuler);
                   
                    btnClose[0].addEventListener('click', () => {
                        if(this.creationArray.length > 1){
                        this.creationArray.pop() 
                    }

                   
                    this.isTreeItemDropped = false
                    console.log(this.creationArray);
                    }, true);

                    annuler[0].addEventListener('click', () => {
                        if(this.creationArray.length > 1){
                        this.creationArray.pop() 
                    }
                    this.isTreeItemDropped = false
                    console.log(this.creationArray);
                    }, true);
                    this.creationArray.push(containerData);
                    this.creationArray.push(eventData);
                    console.log(containerData);
                    console.log(this.creationArray);
                    this.scheduleObj.openEditor(containerData, 'Add', true);
                    this.isTreeItemDropped = true;
                    this.draggedItemId = event.draggedNodeData.id as string;
                    this.newData = this.field['dataSource'].filter(item => {
                        if (+item.Id !== +this.draggedItemId) {
                            return item;
                        }
                    }
                    );
                } else {  // IF EMPLACEMENT EST DEJA PRIS PAR UN CONTENEUR
                    if (event.target.id) {
                        let indexContainerEvent = this.findIndexEventById(event.target.id);
                        let containerSelected = this.timelineResourceDataOut[indexContainerEvent];
                        console.log('containerSelected => ', containerSelected);
                        const filteredDataW =
                            treeviewData.filter((item: any) => item.Id === parseInt(event.draggedNodeData.id as string, 10));
                        let container = this.allDataContainers.filter(item => item.Id_Planning_Container === containerSelected.Id);
                        let containerDataSelected = container[0];
                        console.log('container => ', container);
                        console.log('containerDataSelected => ', containerDataSelected);
                        let newEventData = { // DISPLAY DATA FOR EVENT
                            Id: filteredDataW[0].Id,
                            Name: filteredDataW[0].titreoeuvre,
                            StartTime: containerSelected.StartTime,
                            EndTime: containerSelected.EndTime,
                            IsAllDay: false,
                            Description: filteredDataW[0].Description,
                            DepartmentID: containerSelected.DepartmentID,
                            ConsultantID: containerSelected.ConsultantID,
                            AzaIsPere: false,
                            AzaNumGroupe: containerDataSelected.Id_Planning_Container,
                            coordinateurCreate: this.user.initials,
                            Operateur: '',
                            Statut: filteredDataW[0].Statut,
                            libchaine: filteredDataW[0].libchaine,
                            typetravail: filteredDataW[0].typetravail,
                            titreoeuvre: (filteredDataW[0].titreoeuvre === null || typeof (filteredDataW[0].titreoeuvre) === 'undefined') ? '' : filteredDataW[0].titreoeuvre,
                            numepisode: filteredDataW[0].numepisode,
                            dureecommerciale: filteredDataW[0].dureecommerciale,
                            libtypeWO: filteredDataW[0].libtypeWO,
                            Commentaire_Planning: filteredDataW[0].Commentaire_Planning,
                            IdGenerationWO: filteredDataW[0].IdGenerationWO,
                        };
                        this.creationArray = [newEventData];
                        this.isTreeItemDropped = true;
                        console.log('filteredDataW : ', filteredDataW);
                        console.log('containerDataSelected : ', containerDataSelected);
                        this.updateWorkorderInDragDropAddToContainer(newEventData, containerDataSelected);
                        // this.timelineResourceDataOut.push(newEventData);
                        this.draggedItemId = event.draggedNodeData.id as string;
                        let nData = this.field['dataSource'].filter(item => {
                            if (+item.Id !== +this.draggedItemId) {
                                return item;
                            }
                        }
                        );
                        this.field['dataSource'] = nData;
                        this.treeObj.fields.dataSource = this.field['dataSource'];
                        this.onActionComplete('e');
                        this.scheduleObj.eventSettings.tooltipTemplate = this.temp;
                    }         
                }    
            }
        }
      
     
    }


    /******* DRAG AND DROP OPERATEURS *******/

    onTreeDragStopMonteur(event: DragAndDropEventArgs): void {
        console.log(event)
        this.creationArray = [];
        let treeElement = closest(event.target, '.e-treeview');
        let classElement = this.scheduleObj.element.querySelector('.e-device-hover');
        if (classElement) {
            classElement.classList.remove('e-device-hover');
        }
        if (!treeElement) {
            event.cancel = true;
            let scheduleElement: Element = <Element>closest(event.target, '.e-content-wrap');
            if (scheduleElement) {
                let treeviewData: { [key: string]: Object }[] =
                    this.treeObjMonteur.fields.dataSource as { [key: string]: Object }[];
                const filteredData: { [key: string]: Object }[] =
                    treeviewData.filter((item: any) => item.CodeRessource === parseInt(event.draggedNodeData.id as string, 10));
                if (event.target.classList.contains('e-work-cells')) {
                    console.log('event target : ', event.target);
                    let cellData: CellClickEventArgs = this.scheduleObj.getCellDetails(event.target);
                    let resourceDetails: ResourceDetails = this.scheduleObj.getResourcesByIndex(cellData.groupIndex);
                    console.log(event);
                    console.log(filteredData[0]);
                    console.log(cellData);
                    console.log(resourceDetails);
                    let containerData = { // DISPLAY DATA FOR CONTAINER
                        Id: filteredData[0].CodeRessource,
                        Name: 'Title',
                        StartTime: cellData.startTime,
                        EndTime: cellData.endTime,
                        IsAllDay: false,
                        DepartmentID: resourceDetails.resourceData.Id,
                        ConsultantID: resourceDetails.resourceData.Id,
                        AzaIsPere: true,
                        AzaNumGroupe: filteredData[0].CodeRessource,
                        Operateur: filteredData[0].Username,
                        coordinateurCreate: this.user.initials
                    };
                    console.log('création array ==============', this.creationArray);
                    // this.timelineResourceDataOut.push(containerData); // filteredData[0]
                    this.creationArray.push(containerData);
                    this.scheduleObj.openEditor(containerData, 'Add', true);
                    this.isTreeItemDropped = true;
                    this.isTreeItemDroppedMonteur = true;
                    this.draggedItemId = event.draggedNodeData.id as string;
                    this.newData = this.field['dataSource'].filter(item => {
                        if (+item.Id !== +this.draggedItemId) {
                            return item;
                        }
                    }
                    );
                } else { // Emplacement déjà pris par un event (container)
                    const filteredData: { [key: string]: Object }[] =
                        treeviewData.filter((item: any) => item.CodeRessource === parseInt(event.draggedNodeData.id as string, 10));
                    if (event.target.classList.contains('e-work-cells')) {
                        let cellData: CellClickEventArgs = this.scheduleObj.getCellDetails(event.target);
                        let resourceDetails: ResourceDetails = this.scheduleObj.getResourcesByIndex(cellData.groupIndex);
                        console.log(event);
                        console.log(filteredData[0]);
                        console.log(cellData);
                        console.log(resourceDetails);
                        let containerData = { // DISPLAY DATA FOR CONTAINER
                            Id: filteredData[0].CodeRessource,
                            Name: 'Title',
                            StartTime: cellData.startTime,
                            EndTime: cellData.endTime,
                            IsAllDay: false,
                            DepartmentID: resourceDetails.resourceData.Id,
                            ConsultantID: resourceDetails.resourceData.Id,
                            AzaIsPere: true,
                            AzaNumGroupe: filteredData[0].CodeRessource,
                            Operateur: filteredData[0].Username,
                            coordinateurCreate: this.user.initials
                        };
                        this.timelineResourceDataOut.push(containerData); // filteredData[0]
                        this.scheduleObj.openEditor(containerData, 'Add', true);
                        this.isTreeItemDropped = true;
                        this.isTreeItemDroppedMonteur = true;
                        this.draggedItemId = event.draggedNodeData.id as string;
                    } else { // Emplacement déjà pris par un event (container)
                        console.log(event);
                        // let indexContainerEvent = this.findIndexEventById(event.target.id);
                        // this.timelineResourceDataOut[indexContainerEvent]['Operateur'] = filteredData[0].Username;
                        this.isTreeItemDropped = true;
                        this.isTreeItemDroppedMonteur = true;
                        this.updateContainerFromDragDropOperateur(filteredData[0], event);
                        // this.updateContainer(filteredData[0], event);
                        // this.onActionComplete('e');
                    }
                }
            }
        }
    }

    /*********************** ACTION BEGIN FUNCTION *********************/
    public containerParent;
  public firstZoom = 0 
    onActionBegin(event: ActionEventArgs): void {
        this.containerParent = {};
        console.log('onActionBegin()');
        console.log(event);
        console.log(this.scheduleObj.currentView)
        console.log(this.isTreeItemDropped);

        // if (event.requestType === 'eventChange' && !event.data.AzaIsPere) {
        //     console.log('is not pere');
        // } 
    
        // let clicktoolbar = document.getElementsByClassName('e-tbar-btn-text') 
     
   
      
        // for(let i = 0; i<clicktoolbar.length; i++ ){
  
        //      clicktoolbar[i].addEventListener('mousedown',() => {
                    
        //         console.log("click *********************************************************************************",  clicktoolbar[i] )

        //      }, true);
        // }
     
        // if(this.firstZoom === 0) {

        //   console.log("1er zoooommmm")
        //     this.firstZoom= 1
        // }

     
        if (event.requestType === 'eventChange') {
            this.zoom = true

            if (this.open == true) {
                this.open = true;
                this.sidebar.show();
                this.sidebar.position = 'Right';
                this.sidebar.animate = false;
            } else {
                this.open = false;
                this.sidebar.hide();
                this.sidebar.position = 'Right';
                this.sidebar.animate = false;
            }
        }
        if (event.requestType === 'eventCreate') {
            console.log('eventCreate');
            console.log(event.requestType);
              /******* A voir ************************/
            // if (event.requestType === 'eventCreate' && (<Object[]>event.data).length > 0) {
            //     let eventData: { [key: string]: Object } = (<Object[]>event.data)[0] as { [key: string]: Object };
            //     let eventField: EventFieldsMapping = this.scheduleObj.eventFields;
            //     let startDate: Date = eventData[eventField.startTime] as Date;
            //     let endDate: Date = eventData[eventField.endTime] as Date;
            //     event.cancel = !this.scheduleObj.isSlotAvailable(startDate, endDate); } 
        }
        if (((event.requestType === 'eventCreate') || (event.requestType === 'eventCreated')) && !this.isTreeItemDropped) {
            // CREATE CONTAINER ON CELL WITHOUT EVENT CLICK
            event.data[0]['AzaIsPere'] = true;
            console.log('action create and !== isTreeItemDropped');
        }
        if (event.requestType === 'eventRemove') {
            if (!event.data[0].AzaIsPere) {
            }
        }
        if (event.requestType === 'eventCreate' && this.isTreeItemDropped) {
            console.log('onActionBegin() ======> event create from drag and drop');
            this.scheduleObj.eventSettings.tooltipTemplate = this.temp;
            // FUNCTION FROM TEMPLATE => Call when workodre is drag and drop from backlog to create container
            let treeViewdata: { [key: string]: Object }[] = this.treeObj.fields.dataSource as { [key: string]: Object }[];
            const filteredPeople: { [key: string]: Object }[] =
                treeViewdata.filter((item: any) => item.Id !== parseInt(this.draggedItemId, 10));
            this.treeObj.fields.dataSource = filteredPeople;
            let elements: NodeListOf<HTMLElement> =
                document.querySelectorAll('.e-drag-item.treeview-external-drag') as NodeListOf<HTMLElement>;
            for (let i: number = 0; i < elements.length; i++) {
                remove(elements[i]);
            }
            console.log(this.eventSettings.dataSource);
            console.log('newData', this.newData);
            console.log(this.isTreeItemDroppedMonteur);
            if (!this.isTreeItemDroppedMonteur) {
                this.creationArray.map(item => {
                    console.log(item);
                    if (item.AzaIsPere) {
                        let newItemContainerAfterEditorUpdate = {
                            Id: item.Id,
                            Name: event.data[0].Name,
                            StartTime: event.data[0].StartTime,
                            EndTime: event.data[0].EndTime,
                            IsAllDay: event.data[0].IsAllDay,
                            DepartmentID: event.data[0].DepartmentID,
                            ConsultantID: item.ConsultantID,
                            AzaIsPere: true,
                            AzaNumGroupe: item.AzaNumGroupe,
                            coordinateurCreate: item.coordinateurCreate,
                            Operateur: event.data[0].Operateur === 'Aucun Opérateur' ? '' : event.data[0].Operateur,
                            Commentaire_Planning: event.data[0].Commentaire_Planning,
                            CodeRessourceSalle: event.data[0].CodeRessourceSalle,
                            LibelleRessourceSalle: event.data[0].LibelleRessourceSalle
                        };
                        this.containerParent = newItemContainerAfterEditorUpdate;
                        console.log('newItemContainerAfterEditorUpdate', newItemContainerAfterEditorUpdate);
                        // this.timelineResourceDataOut.push(newItemContainerAfterEditorUpdate);
                        this.createContainer(newItemContainerAfterEditorUpdate);
                        // } else {
                        //     let newItemWorkorderAfterEditorUpdate = {
                        //         Id: item.Id,
                        //         Name: item.Name,
                        //         StartTime: event.data[0].StartTime,
                        //         EndTime: event.data[0].EndTime,
                        //         IsAllDay: event.data[0].IsAllDay,
                        //         DepartmentID: event.data[0].DepartmentID,
                        //         ConsultantID: item.ConsultantID,
                        //         AzaIsPere: false,
                        //         AzaNumGroupe: item.AzaNumGroupe,
                        //         coordinateurCreate: item.coordinateurCreate,
                        //         Operateur:  event.data[0].Operateur === 'Aucun Opérateur' ? '' : event.data[0].Operateur,
                        //         Statut:item.Statut
                        //     };
                        //     this.updateWorkorderInDragDrop(newItemWorkorderAfterEditorUpdate, this.containerParent);
                        //     console.log('newItemWorkorderAfterEditorUpdate : ', newItemWorkorderAfterEditorUpdate);
                        //     this.timelineResourceDataOut.push(newItemWorkorderAfterEditorUpdate);
                    }
                });
            } else if (this.isTreeItemDroppedMonteur) {
                this.creationArray.map(item => {
                    let newItemContainerFromMonteurAfterEditorUpdate = {
                        Id: item.Id,
                        Name: event.data[0].Name,
                        StartTime: event.data[0].StartTime,
                        EndTime: event.data[0].EndTime,
                        IsAllDay: event.data[0].IsAllDay,
                        DepartmentID: event.data[0].DepartmentID,
                        ConsultantID: item.ConsultantID,
                        AzaIsPere: true,
                        AzaNumGroupe: item.AzaNumGroupe,
                        coordinateurCreate: item.coordinateurCreate,
                        Operateur: event.data[0].Operateur === 'Aucun Opérateur' ? '' : event.data[0].Operateur,
                        Commentaire_Planning: event.data[0].Commentaire_Planning
                    };
                    console.log('newItemContainerFromMonteurAfterEditorUpdate ==== ', newItemContainerFromMonteurAfterEditorUpdate);
                    // this.timelineResourceDataOut.push(newItemContainerFromMonteurAfterEditorUpdate);
                    this.createContainer(newItemContainerFromMonteurAfterEditorUpdate);
                    console.log('this.timelineResourceDataOut ', this.timelineResourceDataOut)
                });
            }

            this.field['dataSource'] = this.newData;
            this.newField = this.field['dataSource'];
            this.treeObj.fields.dataSource = this.field['dataSource'];
            this.isDragged = true;
        } else { // CUSTOM FUNCTION
            console.log('customActionBegin()');
            this.customActionBegin(event);
        }
        // console.log('customActionBegin()');
        // this.customActionBegin(event); 
    
    }

    customActionBegin(args: any) { // CUSTOM ACTION BEGIN
        console.log('args customActionBegin ', args);
        if (args.requestType === 'eventChange') {
            if (this.open == true) {
                this.open = true;
                this.sidebar.show();
                this.sidebar.position = 'Right';
                this.sidebar.animate = false;
            } else {
                this.open = false;
                this.sidebar.hide();
                this.sidebar.position = 'Right';
                this.sidebar.animate = false;
            }
        }
        if (args.requestType === 'eventRemove') { // CUSTOM ACTION REMOVE
            this.deleteEvent(args);
        } else if (args.requestType === 'viewNavigate') {

            if (this.open == true) {
                this.open = true;

            } else {
                this.open = false;

            }
                   
            console.log(this.open, '----------------------------------------------')
        } else if ((args.requestType !== 'toolbarItemRendering') && (args.data.AzaIsPere)) { // RESIZE CONTAINER
            console.log('CALL CUSTOM ACTION BEGIN');
            // this.updateContainer(args);
            // args.data['Operateur'] = args.data['Operateur'] === 'Aucun Opérateur' ? '' : args.data['Operateur'];
            // let startDifferent = this.checkDiffExistById(args.data, this.timelineResourceDataOut, 'StartTime', 'StartTime');
            // let endDifferent = this.checkDiffExistById(args.data, this.timelineResourceDataOut, 'EndTime', 'EndTime');
            // this.timelineResourceDataOut = this.eventSettings.dataSource as Object[]; // refresh dataSource
            // this.eventSettings = {
            //     dataSource: <Object[]>extend(
            //         [], this.calculDateAll(this.timelineResourceDataOut, true, args.data, startDifferent, endDifferent), null, true

            //     )
            // };
        } else if (args.requestType === 'eventCreate') { // ADD EMPTY CONTAINER
            let data = args.data[0];
            this.randomId();
            console.log('last Random id : ', this.lastRandomId);
            console.log('container create only one ==> %%%%%% ', data);
            let containerData = { // DISPLAY DATA FOR CONTAINER
                Id: this.lastRandomId,
                Name: data.Name,
                StartTime: data.StartTime,
                EndTime: data.EndTime,
                IsAllDay: data.IsAllDay,
                DepartmentID: data.DepartmentID,
                ConsultantID: data.DepartmentID,
                AzaIsPere: true,
                AzaNumGroupe: this.lastRandomId,
                coordinateurCreate: this.user.initials,
                Operateur: data.Operateur === 'Aucun Opérateur' ? '' : data.Operateur,
                Commentaire_Planning: data.Commentaire_Planning

            };
            this.createContainer(containerData);
            // this.timelineResourceDataOut.push(containerData);
            // this.eventSettings = { // Réinitialise les events affichés dans le scheduler
            //     dataSource: <Object[]>extend(
            //         [], this.timelineResourceDataOut, null, true
            //     )
            // };
        }
    //     if(args.requestType === "dateNavigate"){
    //         this.searchString = this.searchwo.value
    //      this.onFilter( this.searchString  , 0, this.argsKeyboardEvent)
    //     }
    //     if( this.searchString != undefined && !this.cancel){
    //         this.searchString = this.searchwo.value
    //         this.onFilter( this.searchString  , 0, this.argsKeyboardEvent)
    //        console.log(  this.searchwo.value , this.searchString )
    //        console.log( typeof this.searchwo.value)
    //    }
    }

    checkDiffExistByGroupe(object: any, arrayObject: Object[], objectAttribute, arrayItemAttribute) { }

    checkDiffExistById(object: any, arrayObject: Object[], objectAttribute, arrayItemAttribute): boolean {
        let diffExist: boolean = false;
        for (let i = 0; i < arrayObject.length; i++) {
            if (object.Id === arrayObject[i]['Id']) {
                if (object[objectAttribute] === arrayObject[i][arrayItemAttribute]) {
                    diffExist = false;
                } else {
                    diffExist = true;
                }
            }
        }
        return diffExist;
    }

    /*********************** ACTION COMPLETE FUNCTION *********************/

    onActionComplete(e) {
        console.log('onActionComplete()');
        console.log('event onActionComplete : ', e);

        // if (this.timelineResourceDataOut['container'] = true) {
        //     this.scheduleObj.eventSettings.enableTooltip = true;
        //     // this.scheduleObj.eventSettings.tooltipTemplate = this.temp;
        // } else {
        //     this.scheduleObj.eventSettings.enableTooltip = false;
        //     this.scheduleObj.eventSettings.tooltipTemplate = null;
        // }
        // this.scheduleObj.dataBind();     
        if (e.requestType === 'eventChanged') {
            console.log("UPDATE WORKORDER", this.updateWO)
            if (e.data.AzaIsPere || (!e.data.AzaIsPere && this.isTreeItemDropped)) {
                console.log("************************************************* onaction complete : update container");
                this.updateContainer(e);
            } else {
                if (!e.data.AzaIsPere && this.updateWO) {
                    console.log("************************************************* onaction complete : update WorkOrder");
                   
                    this.updateWorkOrder(e)
                }
            }
            if (this.open == true) {
                this.open = true;
                this.sidebar.show();
                this.sidebar.position = 'Right';
                this.sidebar.animate = false;
            } else {
                this.open = false;
                this.sidebar.hide();
                this.sidebar.position = 'Right';
                this.sidebar.animate = false;
            }
            // this.updateContainer(e);
        }
        if (this.drowDownExist) {
            this.drowDownOperateurList.value = null;
        }
        console.log('------------------- ', this.timelineResourceDataOut);   
        if (
            !this.isTreeItemDropped &&
            !this.isTreeItemDroppedMonteur &&
            !this.deleteContainerAction &&
            !this.updateContainerAction &&
            !this.createJustContainerAction &&
            !this.isBackToBacklog &&
            e.requestType !== 'eventChanged'
            // !this.navigateTimelineDay
        ) {
            console.log('=======> args : ', e);
            console.log(this.createJustContainerAction);
            if ( this.searchString != undefined) {
              
                this.searchwo.value = this.searchString
                 this.onFilter(this.searchwo.value,0,this.argsKeyboardEvent)
            } else {
                   }
            // this.eventSettings = { // Réinitialise les events affichés dans le scheduler
            //     dataSource: <Object[]>extend(
            //         [], this.calculDateAll(this.timelineResourceDataOut, false, null, false, false), null, true
            //     ),
            //     enableTooltip: true, tooltipTemplate: this.temp
            // };
        } else if (this.deleteContainerAction) {
            console.log('delete container without call calcul function');
            if(this.searchString != undefined){
            this.searchwo.value =""
        }
            // this.onFilter( this.searchwo.value , 0, this.argsKeyboardEvent)
        } else {
            this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                dataSource: <Object[]>extend(
                    [], this.timelineResourceDataOut, null, true
                ),
                enableTooltip: true, tooltipTemplate: this.temp
            };          
        }
        this.treeObj.fields = this.field;
        this.isTreeItemDropped = false;
        this.isTreeItemDroppedMonteur = false;
        this.deleteContainerAction = false;
        this.updateContainerAction = false;
        this.createJustContainerAction = false;
        this.isBackToBacklog = false;
        this.navigateTimelineDay = false;
        this.eventClick = false;

      
    }

    /************************ DELETE ********************/

    deleteEvent(args: any) {
        console.log('call deleteEvent()');
        console.log('args : ', args);
        console.log('this.allDataContainers : ', this.allDataContainers);
        let data = args.data[0];
        let containerEvent;
        if (data['AzaIsPere']) { // REMOVE CONTAINER
            this.deleteContainerAction = true;
            // let selectedContainer = this.allDataContainers.filter(item => item.Id_Planning_Container === data.Id);
            // console.log('selected container : ', selectedContainer);
            // console.log('this.allDataContainers : ', this.allDataContainers);
            // let idContainer = selectedContainer[0].Id_Planning_Container;
            containerEvent = data;
            this.deleteContainer(data.Id, data);
        } else { // REMOVE WORKORDER
            let newGroup = [];
            let selectedItem;
            let pere;
             this.creationArray = [];
            this.timelineResourceDataOut.forEach(item => {
                if (+item.Id === +data.Id && item.Name === data.Name) {
                    selectedItem = item;
                }
            });
            this.timelineResourceDataOut = this.timelineResourceDataOut.filter(item => {
                if ((+data.Id !== +item.Id) || (+data.Id === +item.Id && item.AzaIsPere)) {
                    return item;
                }
            });
            this.timelineResourceDataOut.forEach(item => {
                if (+data.AzaNumGroupe === +item.AzaNumGroupe) {
                    newGroup.push(item);
                    if (item.AzaIsPere) {
                        pere = item;
                    }
                }
            });
            this.updateWorkorderBackToBacklog(selectedItem, pere);
            // this.backToBacklog(selectedItem);
            // let startDifferent = this.checkDiffExistById(pere, this.timelineResourceDataOut, "StartTime", "StartTime");
            // let endDifferent = this.checkDiffExistById(pere, this.timelineResourceDataOut, "EndTime", "EndTime");
            // this.eventSettings = {
            //     dataSource: <Object[]>extend([],
            //         this.calculDateAll(this.timelineResourceDataOut, true, pere, startDifferent, endDifferent), null, true) 
            // };
        }
    }




    /************************ DATES CALCUL ********************/

    calculDateAll(
        atimelineResourceData: Object[], needUpdate: boolean, itemToUpdate: Object[], startDifferent: boolean, endDifferent: boolean
    ): Object[] {
        console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& CALCUL DATE ALL &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
        // CALL ONINT => this.calculDateAll(this.data, false, null, false, false )
        // CALL ONRESIZE => this.calculDateAll(this.timelineResourceDataOut, true, args.data, startDifferent, endDifferent), null, true;
        let groupe = [], i;
        console.log(atimelineResourceData);
        for (i = 0; i < atimelineResourceData.length; i++) {
            if (!groupe.includes(atimelineResourceData[i]['AzaNumGroupe'])) {
                groupe.push(atimelineResourceData[i]['AzaNumGroupe']);
            }
        }
        groupe.forEach(item => {
            this.timelineResourceDataOut = this.calculDateGroup(
                atimelineResourceData,
                +item,
                needUpdate,
                itemToUpdate,
                startDifferent,
                endDifferent
            );
        });
        return this.timelineResourceDataOut;
    }

    calculWorkorderTime(start, end) {
        console.log('WorkorderStart = ', start);
        console.log('WorkorderEnd = ', end);
        let startW = moment(start);
        let endW = moment(end);
        console.log('WorkorderStart = ', startW);
        console.log('WorkorderEnd = ', endW);
        let diff = endW.diff(startW);
        console.log('diff = ', diff);
        let mmdiff = moment(diff);
        console.log('mmdiff = ', mmdiff);
    }

    calculDateGroup(
        atimelineResourceData: Object[], numGroup: number, needUpdate: boolean,
        itemToUpdate: Object[], startDifferent: boolean, endDifferent: boolean)
        : Object[] {
        console.log('-------------------> CALCUL DATE GROUP !!!!!!!!!!!!')
        let minDateGroup = this.getMinMaxNumgroupe(
            atimelineResourceData, numGroup, 'StartTime', needUpdate, itemToUpdate
        );
        let maxDateGroup = this.getMinMaxNumgroupe(
            atimelineResourceData, numGroup, 'EndTime', needUpdate, itemToUpdate
        );
        let diffMinMax = +maxDateGroup - +minDateGroup;
        let Seconds_from_T1_to_T2 = diffMinMax / 1000;
        let Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
        let countWorkorderSameGroup = this.getCountWorkOrderByGroup(atimelineResourceData, 'AzaNumGroupe', +numGroup);
        let Seconds_for_a_job = Seconds_Between_Dates / countWorkorderSameGroup;
        atimelineResourceData = this.calcultimesforalljobs(atimelineResourceData, numGroup, minDateGroup, maxDateGroup, Seconds_for_a_job);
        this.timelineResourceDataOut = atimelineResourceData;
        return atimelineResourceData;
    }

    calculPrevisonalDateGroup(atimelineResourceData: Object[], numGroup: number, needUpdate: boolean,
        itemToUpdate: Object[], startDifferent: boolean, endDifferent: boolean)
        : Object[] {
        console.log('-------------------> CALCUL "PREVISIONAL" DATE GROUP !!!!!!!!!!!!')
        let minDateGroup = this.getMinMaxNumgroupe(
            atimelineResourceData, numGroup, 'StartTime', needUpdate, itemToUpdate
        );
        let maxDateGroup = this.getMinMaxNumgroupe(
            atimelineResourceData, numGroup, 'EndTime', needUpdate, itemToUpdate
        );
        let diffMinMax = +maxDateGroup - +minDateGroup;
        let Seconds_from_T1_to_T2 = diffMinMax / 1000;
        let Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
        let countWorkorderSameGroup = this.getCountWorkOrderByGroup(atimelineResourceData, 'AzaNumGroupe', +numGroup);
        let Seconds_for_a_job = Seconds_Between_Dates / countWorkorderSameGroup;
        let newAtimelineResourceData = this.calcultimesforalljobs(atimelineResourceData, numGroup, minDateGroup, maxDateGroup, Seconds_for_a_job);
        return newAtimelineResourceData;
    }

    getCountWorkOrderByGroup(objectin: Object[], property: string, numGroup: number): number {
        let countWorkorderSameGroup = 0;
        objectin.forEach(item => {
            if (+item[property] === numGroup) {
                if (!item['AzaIsPere']) {
                    countWorkorderSameGroup++;
                }
            }
        });
        return countWorkorderSameGroup;
    }

    // GET MINIMUM DATE FROM GROUP
    getMinMaxNumgroupe(
        atimelineResourceData, numGroup: number, timePosition: string, isUpdate: boolean, Objupdate: Object[]
    ) {
        let mindate, maxDate, regie: number;
        let arrayDatesGroup = [];
        atimelineResourceData.forEach(item => {
            if (+item.AzaNumGroupe === numGroup) {
                arrayDatesGroup.push(+item[timePosition]);
                if (item.AzaIsPere) {
                    regie = item.DepartmentID;
                }
            }
        });
        atimelineResourceData.forEach(item => {
            if (+item.AzaNumGroupe === numGroup) {
                if (!item.AzaIsPere) {
                    item.DepartmentID = regie;
                }
            }
        });
        let min = Math.min(...arrayDatesGroup);
        let max = Math.max(...arrayDatesGroup);
        mindate = new Date(min);
        maxDate = new Date(max);
        if (timePosition === 'StartTime') {
            if (isUpdate) {
                if (Objupdate != null) {
                    if (+Objupdate['AzaNumGroupe'] === numGroup) {
                        mindate = Objupdate[timePosition];
                    }
                }
            } else {
            }
            return mindate;
        } else if (timePosition === 'EndTime') {
            if (isUpdate) {
                if (Objupdate != null) {
                    if (+Objupdate['AzaNumGroupe'] === numGroup) {
                        maxDate = Objupdate[timePosition];
                    }
                }
            } else {
            }
            return maxDate;
        }
    }

    calcultimesforalljobs(atimelineResourceData, numGroup: number, minDateGroup: Date, maxDateGroup: Date, Seconds_for_a_job) {
        // this.calcultimesforalljobs(atimelineResourceData, numGroup, minDateGroup, maxDateGroup, Seconds_for_a_job);
        let tempmindate = minDateGroup;
        let tempmaxdate = maxDateGroup;
        for (let entry of atimelineResourceData) {
            if (entry.AzaNumGroupe === numGroup) {
                const properties = Object.getOwnPropertyNames(entry);
                if (entry['AzaIsPere']) { // IF CONTAINER DISPLAY STARTTIME AND ENDTIME MAX
                    entry['StartTime'] = minDateGroup;
                    entry['EndTime'] = maxDateGroup;
                } else {
                    entry['StartTime'] = tempmindate;
                    let tempdate = new Date(tempmindate.getTime() + Seconds_for_a_job * 1000);
                    entry['EndTime'] = tempdate;
                    tempmindate = tempdate;
                }
            }
        }
        return atimelineResourceData;
    }

    /*************************************************************************/
    /************************* OPERATEUR MANAGEMENT **************************/

    /********** Add Monteur  *********/

public searchoperateur

    onSelect(value) {
        let monteurListArray;
        let fieldMonteur
        for (let i = 0; i < this.monteurListe.length; i++) {
            if (value === this.monteurListe[i].Username) {
                fieldMonteur = this.fieldMonteur['dataSource'].concat(this.fieldMonteur['dataSource'].unshift(this.monteurListe[i])) //pour l'affichage dans le treeview
                fieldMonteur.pop()
                this.monteurDataSource.unshift(this.monteurListe[i])
                console.log('monteurDataSource', this.monteurDataSource);
                console.log('fieldMonteur', fieldMonteur);

                for (let i = 0; i < this.monteurDataSource.length; i++) {
                    if (this.monteurDataSource[i] === this.monteurDataSource[i + 1]) {
                        console.log('monteurDataSource', this.monteurDataSource);
                       this.monteurDataSource.splice(i,1)
                       console.log('monteurDataSource aprés delete', this.monteurDataSource);
                    }
                }
                monteurListArray = this.monteurDataSource

                console.log('monteurListArray', monteurListArray);


                this.ajoutMonteur = this.monteurListe[i]
                this.monteurListArray = monteurListArray
                console.log('monteurListArray', this.monteurListArray);
                this.filtermonteurListeArray = monteurListArray;
                console.log('filtermonteurListeArray', this.filtermonteurListeArray);
                console.log(this.fieldMonteur);
                this.addMonteur = true;
                this.fieldMonteur = { dataSource: fieldMonteur, text: 'Username' };
                this.countAdd = this.countAdd + 1
            }
        }
        if( this.searchStringM  != undefined && !this.cancel){
            this.searchStringM = this.searchoperateur.value
            this.onFilter(this.searchStringM , 1, this.argsKeyboardEvent)
                   console.log(  this.searchoperateur.value)
                   console.log( typeof this.searchoperateur.value)
               }else{    
               }
    }


    onSelectPlannig(value) {

        this.nameService = value
        console.log(typeof this.nameService, parseInt(value as string, 10))
        let codeGoupe
        this.workOrderData = [];
        this.timelineResourceDataOut = [];
        this.allDataContainers = [];
        this.allDataWorkorders = [];
        // this.salleDataSource = [];
        // this.departmentDataSource = [];
        this.departmentGroupDataSource = [];
        this.isnotMyGroup = true
        this.scheduleObj.readonly = true
 



         let startofDay = moment().toDate()
         let endofDay = moment().add(1, 'd').toDate();
         this.getSalleByGroup(parseInt(value as string, 10), startofDay, endofDay);
         this.getWorkOrderByidGroup(parseInt(value as string, 10));
         this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut
        this.scheduleObj.dataBind()
        console.log(this.departmentDataSource, this.departmentGroupDataSource)

        if (parseInt(value as string, 10) === this.idCoordinateur) {
            // this.workOrderData = [];
            // this.timelineResourceDataOut = [];
            this.isnotMyGroup = false
            this.scheduleObj.readonly = false
            //  this.departmentDataSource = [];
            // this.departmentGroupDataSource = [];
            // this.allDataContainers = [];
            // this.allDataWorkorders = [];
            // this.salleDataSource = [];
            // this.getSalleByGroup(parseInt(value as string, 10), startofDay, endofDay);
            // this.getWorkOrderByidGroup(parseInt(value as string, 10));
         
        //          this.allDataWorkorders = []
        // this.departmentDataSource = [];
        // this.departmentDataSourceAll = [];
        // this.departmentGroupDataSource = [];
        // this.allDataContainers = [];


            //  this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut;
       
            // this.scheduleObj.refresh();
        }

    

        console.log(this.timelineResourceDataOut, "...................")
    }

    // backTomyPlanning(){
    //     this.isnotMyGroup = false
    //     this.scheduleObj.readonly = false

    //     this.departmentDataSource = [];
    //     this.departmentGroupDataSource = [];

    //     let startofDay = moment().toDate()
    //     let endofDay = moment().add(1, 'd').toDate();

    //     this.coordinateurService.getCoordinateurByUsername(this.user.shortUserName)
    //     .subscribe(data => {


    //                   console.log('COORDINATEUR => ',data);
    //                   this.getSalleByGroup(data.Groupe, startofDay, endofDay);
    //                   this.getMonteursByGroup(data.Groupe);
    //                   this.getWorkOrderByidGroup(data.Groupe);
    //                   this.getAllMonteurs(data.Groupe);
    //                   this.currentCoordinateur = data;



    //   });
    //     this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut;
    //     this.scheduleObj.refresh();
    // }

    getColor(value, codeGroup) {
        if (value && codeGroup != this.groupeCharger) {
            for (let i = 0; i < this.monteurListe.length; i++) {
                if (value === this.monteurListe[i].Username) {
                    return '#17aab2';
                }
            }
        }
    }

    getBackgroundColor(value, codeGroup) {
        if (value && codeGroup != this.groupeCharger) {
            for (let i = 0; i < this.monteurListe.length; i++) {
                if (value === this.monteurListe[i].Username) {
                    return 'rgba(23, 170, 178, 0.1)';
                }
            }
        }
    }

    /**************************************************************** Filter Monteur  ******************************************************************/


    /************************************************************ Filter Monteur et régies ***********************************************************************************/
 public listeRegies
    onFilterRegie(search, args: KeyboardEvent) {
        this.filtreRegie = true
        this.listeRegies = this.departmentGroupDataSource
        console.log(this.listeRegies, '*******************************************')
        if (search.length >= 0) {
            this.zoom = false
            this.filtre = false
           
        } else {
            if (search.length == 0) {
                this.filtreRegie = false
            }
        }

        // this.filtre = true
        console.log(search.length)
        // this.dataRegie = this.departmentGroupDataSource.filter(regie => {
        //     return regie['Text'].toLowerCase().includes(search.toLowerCase())
        // })
        // this.departmentDataSource = this.dataRegie

        // console.log(this.dataRegie)
        let searchString = (args.target as HTMLInputElement).value;
        if (searchString !== "" ) {
            new DataManager(this.departmentGroupDataSource).executeQuery(new Query().
              search(searchString, ['Text','libelletype'], null, true,true)).then((e: ReturnOption) => {
                  console.log(e.result)
                  if ((e.result as any).length > 0) {
                   console.log(e.result)
                   this.departmentDataSource =  e.result as any
                
                    } else{
                        this.departmentDataSource = []
                    }
                  });
              }else{
                this.departmentDataSource = this.departmentGroupDataSource
              }

              

    }



public searchwo
public searchString : string
public searchStringM : string
public argsKeyboardEvent
public searchResult
    onFilter(searchText: string, tabIndex,args: KeyboardEvent) {
///************************************************************** FILTRE DES MONTEURS ********************************************************************* */
      this.argsKeyboardEvent = args
if (searchText.length >= 0) {
            this.zoom = false
            this.filtre = false
            console.log(this.zoom, searchText.length, '*******************************************')
        }
        this.comptText = searchText.length
        // this.filtre == true


        if (tabIndex == 1) {
          this.searchStringM = (args.target as HTMLInputElement).value;
           this.searchoperateur = document.getElementById("searchoperateur")
            console.log(this.searchStringM,'.......')
          
            console.log(this.treeObjMonteur.getTreeData())
            let fieldMonteur = this.fieldMonteur['dataSource']
            if (this.searchStringM !== "" ) {
               
              new DataManager(fieldMonteur).executeQuery(new Query().
                search(this.searchStringM, ['Username','libelletype','libellecategorie'], null, true, true)).then((e: ReturnOption) => {
                 
                    if ((e.result as any).length > 0) {
                     console.log(e.result,this.treeObjMonteur.fields['dataSource'] )
                     console.log(this.treeObjMonteur.getTreeData())
            
                     this.treeObjMonteur.fields.dataSource = e.result as any
                     console.log("this.fieldMonteur['dataSource']",this.fieldMonteur)
                   
                      }  else {
                       
                        this.treeObjMonteur.fields['dataSource'] = []
                      }
                    });
            
                } else {
                    console.log("this.fieldMonteur['dataSource']",this.fieldMonteur['dataSource'])
                     
                            this.treeObjMonteur.fields.dataSource = fieldMonteur 
                            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa", fieldMonteur ) 
                           
                            if(this.isDelete){
                                this.treeObjMonteur.fields.dataSource = this.fieldMonteur['dataSource'] 
                                console.log("ISDelete", this.fieldMonteur['dataSource'] )   
                             }

                }
               
        }

///************************************************************** FILTRE DES WORKORDERS ********************************************************************* */
        if (tabIndex == 0) {
           
            this.searchString = (args.target as HTMLInputElement).value;
            this.searchwo = document.getElementById("searchwo")
        
             console.log(this.searchwo.value)
             console.log(typeof this.searchwo.value)
            console.log(this.searchString,'.......', )
            console.log(this.treeObj.getTreeData())
            if (searchText !== "" ) {
              new DataManager(this.field['dataSource']).executeQuery(new Query().
                search(searchText, ['typetravail', 'titreoeuvre', 'numepisode', 'libtypeWO','libchaine','coordinateurCreate'], null, true,true)).then((e: ReturnOption) => {
                    console.log(e.result)
                    if ((e.result as any).length > 0) {
                     console.log(e.result,this.treeObj.fields['dataSource'] )
                     
                   
                     this.treeObj.fields['dataSource'] =  e.result as any
                     console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa >0",   this.treeObj.fields['dataSource'])
                this.searchResult =  e.result as any
           
                
                      }else{
                        this.treeObj.fields['dataSource']  = []
                      }
                    });
                } else {
                this.treeObj.fields['dataSource'] = this.field['dataSource']
                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa",this.treeObj.getTreeData(), this.treeObj)
                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa",this.treeObj["treeData"])
              
                }
               
        }
    }


   

    Filter() {
        let schedule = document.getElementsByClassName('recherche');
        console.log(schedule)
        schedule[0].addEventListener('mousedown', (eKey: KeyboardEvent) => {
            this.zoom = false
            this.filtre = false

        }, true)
        schedule[1].addEventListener('mousedown', (eKey: KeyboardEvent) => {
            this.zoom = false
            this.filtre = false

        }, true)
    }


    public filtreRegie

  

    /**************************************************** Add Regies ************************************************************ *********/

    displayRegies() {
        // this.isClicked = true;
        console.log('AllRegie', this.allRegies)
        this.isClicked = !this.isClicked
        console.log(this.isClicked, 'isclickeddddd');
        if (this.isClicked) {
            this.toggleBtn.content = 'Voir mes Régies  ';
            if (this.count == 0 || this.allRegies.length == 0) {
                this.getSalleAll(this.currentCoordinateur.Groupe, this.refreshDateStart, this.refreshDateEnd);
                this.count = this.count + 1;
                console.log(this.count);
            } else {
                this.departmentDataSource = this.allRegies;
                console.log('2eme click');
            }
        } else {
            this.toggleBtn.content = 'Voir toutes les Régies';
            this.departmentDataSource = this.departmentGroupDataSource;
            console.log('faux');
        }
    }







    btnClickSlide() {

        if (this.togglebtnslide.element.classList.contains('e-active')) {
            // this.togglebtnslide.content = 'BackLog'
            this.open = false
            this.sidebar.hide();
            this.sidebar.position = 'Right'
            this.sidebar.animate = false
            this.sidebar.locale = 'fr-CH'

            this.scheduleObj.refreshEvents()

        }
        else {
            // this.togglebtnslide.content = '';
            this.open = true
            this.sidebar.show();
            this.sidebar.position = 'Right'
            this.sidebar.animate = false
            this.sidebar.locale = 'fr-CH'
            this.scheduleObj.refreshEvents()


        }
        console.log('slidebar', this.sidebar)
        console.log('button', this.togglebtnslide)
        console.log('scheduler element', this.scheduleObj)
        console.log(this.treeObj,'11111111111111111111111')
    }

    /********************************** Remove Monteur *************************************/

    beforeopen(args: BeforeOpenCloseMenuEventArgs) {
        let targetNodeId: string = this.treeObjMonteur.selectedNodes[0];
        this.fieldMonteur['dataSource'].map(item => {
            if ((item.codegroupe === this.currentCoordinateur.Groupe)) {
                args.cancel = true;
                let targetNode: Element = document.querySelector(`[data-uid='${targetNodeId}']`);

                if (targetNode.classList.contains('remove')) {
                    this.contentmenutree.enableItems(['Supprimer'], true);
                }
            }
            this.monteurListe.map(itemliste => {
                if (targetNodeId == itemliste.CodeRessource.toString()) {
                    if (itemliste.codegroupe != this.currentCoordinateur.Groupe) {
                        args.cancel = false;
                    }
                }

            });

        });


    }


    menuclick(args: MenuEventArgs) {
        let targetNodeId: string = this.treeObjMonteur.selectedNodes[0];
        for (let i = 0; i < this.monteurListe.length; i++) {
            let CodeRessource = this.monteurListe[i].CodeRessource;
            let CodeRessourceToString = CodeRessource.toString();
            if (CodeRessourceToString === targetNodeId) {
                if (args.item.text == 'Supprimer') {
                    this.treeObjMonteur.removeNodes([CodeRessourceToString]);
                    console.log('element supprimer', this.monteurListe[i]);
                    this.elementDelete = this.monteurListe[i]
                    this.isDelete = true;
                    //  this.monteurDataSource= this.treeObjMonteur['groupedData']
                }
                console.log(this.treeObjMonteur);
            }
            this.fieldArrayMonteur = this.treeObjMonteur['groupedData'];
        
            this.fieldMonteurDSource = this.fieldMonteur['dataSource']
            
        }
        console.log('field Array Monteur', this.fieldArrayMonteur);
        console.log('field Array Monteur DS', this.filtermonteurListeArray);
        if (this.isDelete) {
            console.log('field Array Monteur is delete', this.filtermonteurListeArray);
            this.filtermonteurListeArray = this.fieldArrayMonteur[0];
          
            this.fieldMonteur['dataSource'].splice(this.fieldMonteur['dataSource'].lastIndexOf(this.elementDelete),1)
            console.log('field Array Monteur is delete',     this.fieldMonteur['dataSource']);
        }
      
      
    }
    /************************************************************************ ADD Color **********************************************************************************/


   




    /******************************************* Zoom *******************/

    changeInterval(e: DropDownChangeArgs): void {
        // this.scheduleObj.activeViewOptions.timeScale.interval =  parseInt(e.value as string, 10)
        // this.scheduleObj.dataBind();
        console.log(e)

       let value
        this.scheduleObj.timeScale.interval = parseInt(e.value as string, 10);
        this.intervalValue = e.value as string
        value = parseInt(e.value as string, 10);
        console.log(e.value)
        console.log(this.intervalValue)
        this.scheduleObj.dataBind();
    }

    changeIntervalDay(e: DropDownChangeArgs ) {
        this.scheduleObj.timeScale.interval = parseInt(e.value as string, 10);
        this.intervalValueDay = e.value as string
        let value = parseInt(e.value as string, 10);
     
        console.log(this.intervalValueDay)
        this.scheduleObj.dataBind();
    
    }
   
    /*************************************************************************************** */
    onRenderCell(args: RenderCellEventArgs): void {
        if (this.scheduleObj.currentView == 'TimelineWeek') {
            if (args.element.classList.contains('e-work-cells') && ((args.date.getDate() % 2) === 0)) {
                args.element['style'].background = '#E5FCFD';
           
            }
        }
       
   
        if (args.elementType === 'emptyCells' && args.element.classList.contains('e-resource-left-td')) {
            let target: HTMLElement = args.element.querySelector('.e-resource-text') as HTMLElement;
            if (this.scheduleObj.readonly == false) {
                target.innerHTML = '<div class="e-icons e-edit-icon1 icon-vue" ></div>';
            } else {
                target.innerHTML = '<div class="e-icons e-MT_Preview  icon-vue" ></div>';
            }
        }
        // if(args.element.classList.contains('e-resource-cells')  ) {
        //     // args.element['style'].height = '160px' || args.element.classList.contains('e-work-cells ')
        //        console.log(args.element['style'].height)
        // }
    
    }
    

    onResizing(args:ResizeEventArgs){

    }
    // public valueCellTemplateArgs : CellTemplateArgs 

    // getMonthDetails(value: CellTemplateArgs): string {
    //     return this.instance.formatDate((value as CellTemplateArgs).date, { skeleton: 'yMMMM' });
    // }
    // getWeekDetails(value: CellTemplateArgs): string {

    //     return 'semaine ' + getWeekNumber((value as CellTemplateArgs).date);
        
    // }

    //  getDateHeaderText: Function = (value: Date) => {
    
    //     return this.instance.formatDate(value, { skeleton: 'Ed' });
    // };
}