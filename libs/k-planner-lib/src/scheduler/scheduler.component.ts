import {
    Component,
    ViewChild,
    OnInit,
    SimpleChanges,
    Input,
    AfterViewInit,
    OnDestroy,
    ElementRef,
    HostListener,
    ViewEncapsulation,
    Injector,
    ViewChildren,
    Output
} from "@angular/core";
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Store } from '@ngrx/store';
import { App, User } from '../../../../apps/k-planner/src/app/+state/app.interfaces';
import * as moment from 'moment';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

// Syncfusion Imports
// Synfucion Bases
import { extend, closest, remove, createElement, addClass, L10n, loadCldr, isNullOrUndefined, Internationalization, removeClass, Draggable, EmitType, EventHandler } from '@syncfusion/ej2-base';
import { TooltipComponent, Position,DialogComponent, AnimationSettingsModel, ButtonPropsModel, TooltipEventArgs } from '@syncfusion/ej2-angular-popups';
import {
    DragAndDropEventArgs,
    BeforeOpenCloseMenuEventArgs,
    MenuEventArgs,
    Item,
    ItemModel,
    Toolbar
} from "@syncfusion/ej2-navigations";
import { DropDownList, FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { ChangeEventArgs as DropDownChangeArgs, DropDownListComponent, MultiSelectComponent, CheckBoxSelectionService } from '@syncfusion/ej2-angular-dropdowns';
import { TimePickerComponent, DateTimePicker, Calendar } from '@syncfusion/ej2-angular-calendars';
// Syncfusion Angular
import { ButtonComponent, ChangeEventArgs, CheckBoxComponent, Button } from '@syncfusion/ej2-angular-buttons';
import {
    TabComponent,
    TreeViewComponent,
    MenuItemModel,
    ContextMenuComponent,
    SidebarComponent,
    SelectEventArgs
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
    DragAndDropService,
    EventClickArgs,
    TimelineViewsService,
    ExportOptions,
    HoverEventArgs,
    ToolbarActionArgs,

    EJ2Instance,



} from '@syncfusion/ej2-angular-schedule';
import { DataManager, ReturnOption, Query, Predicate, } from '@syncfusion/ej2-data';
import { TextBox } from "@syncfusion/ej2-inputs";
// Locale Data Imports


// Models Imports
import { HospitalData } from '../models/hospital-data';
import { ContainerKP } from '../models/container';
import { Workorder } from '../models/workorder';
import { Coordinateur } from '../models/coordinateur';
import { EventModel } from '../models/Events';
import { LibelleGroupe } from '../models/libelle-groupe';
import { Statut } from "../models/statuts";
// Components Imports
import { WorkorderDetailsModalComponent } from '../workorder-details-modal/workorder-details-modal.component';
import { MonteursData } from '../models/monteurs-data';
import { colorStatut, menuItemsSchedule,menuItems } from "../statut";
// Services Imports

import { SalleService } from '../services/salle.service';
import { CoordinateurService } from '../services/coordinateur.service';
import { ContainersService } from '../services/containers.service';
import { MonteursService } from '../services/monteurs.service';
import { WorkOrderService } from '../services/workOrder.service';
import { LibGroupeService } from '../services/libGroupe.service';
import { StatutService } from "../services/statut.service";
import { WorkOrderTempsReelService } from "../services/workorder-tempsReel.service";
import { UtilisateurService } from "../services/utilisateur.service";
import { JourFeriesComponent } from "../jour-feries/jour-feries.component";




var localeFrenchData = require('./scheduler-fr.json');
var numberingSystems = require('cldr-data/supplemental/numberingSystems.json');
var gregorian = require('cldr-data/main/fr-CH/ca-gregorian.json');
var numbers = require('cldr-data/main/fr-CH/numbers.json');
var timeZoneNames = require('cldr-data/main/fr-CH/timeZoneNames.json');

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
        //   MonthAgendaService,
        LibGroupeService,
        UtilisateurService,
        //   WeekService,
        //   DayService,
        //   MonthService,
        ResizeService,
        DragAndDropService,
        TimelineViewsService,
        StatutService,
        WorkOrderTempsReelService,
        CheckBoxSelectionService,
        JourFeriesComponent
       
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
    @ViewChild('treeViewContextMenu')
    public treeViewContextMenu: ContextMenuComponent;

    @ViewChild('sidebar')
    public sidebar: SidebarComponent;
    public type: string = 'Push';
    public target: string = '.content';
    @ViewChild('ejStartTimePicker')
    public ejStartTimePicker: TimePickerComponent;
    @ViewChild('ejEndTimePicker')
    public ejEndTimePicker: TimePickerComponent;
    @ViewChild('reel')
    public reel: CheckBoxComponent;
    @ViewChild('theorique')
    public   theorique: CheckBoxComponent;
    // @ViewChild('workorder')
    // public workorder: CheckBoxComponent;
    @ViewChild('Ecriture')
    public Ecriture: CheckBoxComponent; //btn affichage workorder 
    @ViewChild('operateur')
    public operateur: CheckBoxComponent;
    @ViewChild('selectplan')
    public listObj: DropDownListComponent;
    @ViewChild('selectplage')
    public selectplage: DropDownListComponent;
    @ViewChild('selectOperateur')
    public selectOperateur: DropDownListComponent
    @ViewChild('eventTemplate')
    @ViewChild('checkbox')
    public mulObj: MultiSelectComponent;
    @ViewChild('workOrderBacklog')
    public workOrderBacklog: MultiSelectComponent;
    @ViewChild('Dialog')
    public Dialog: DialogComponent;

  
    public eventTemplate: any
    @Input() groupeCoordinateur;
    @Input() itemCoordinateur;
    @Input() userStore;
   

    private onDestroy$: Subject<any> = new Subject();

    public dataAllEventsReady = false;
    public dataRegieReady = false;

    /******** STORE *******/
    public user: User;
    public currentCoordinateur: Coordinateur;
    public allCoordinateurs: Coordinateur[];


    /******** SCHEDULER INIT *******/
    public rowAutoHeight: Boolean = true;
    public dataContainersByRessourceStartDateEndDate;
    public containerData: EventModel[] = [];
    public workOrderData: EventModel[] = [];
    //   public selectedDate: Date = new Date();
    public selectedDate: Date = moment().toDate();
    public data: EventModel[] = <EventModel[]>extend([], this.containerData, null, true);
    public temp
    public lastTimelineResourceDataOut = [];
    public eventSettings: EventSettingsModel = {
        dataSource: <Object[]>extend([], this.calculDateAll(this.data, true, null, false, false), null, true),
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

        //   enableTooltip: true, tooltipTemplate: this.temp
    };
    public eventClick = false;
    public btnRegieMessageAll
    public colorReadOnly
    public currentView: View = 'TimelineDay';
    public workHours: WorkHoursModel = { start: '00:00', end: '23:00', highlight: true };
    public weekNumber = true
    public cssClass: string = 'custom';
    public readonly: boolean = true;

    public openEditorCount = 0;
    public creationArray = [];
    public newData = [];

    public timeScale: TimeScaleModel = { enable: true, interval: 60, slotCount: 2 };

  public   colorStatut = colorStatut //couleur des différents statut
    //PLAGES HORAIRES
    public plagesHoraires: Object[] = [
        { text: 'Plage horaire matin', Code: 1 },
        { text: 'Plage horaire jour', Code: 2 },
        { text: 'Plage horaire soir', Code: 3 },
        { text: 'Toute la journée', Code: 4 }
    ]
    public fieldPlagesHoraires = { text: 'text', value: 'Code' };
    public choixPlagesHoraires = "Plages horaire"
    // BACKLOGS INIT
    public waitingList;
    public headerText: Object = [{ 'text': 'WorkOrder' }, { 'text': 'Operateur' }];
    public menuItems: MenuItemModel[] = menuItems

    public menuItemsSchedule : MenuItemModel[]  = menuItemsSchedule;;
       

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
    public color: string = '#DD57EA'
    public cancelObjectModal = false;
    public salleDataSource;
    public containersPlanning;
    public departmentDataSource: Object[] = [];
    public departmentDataSourceAll: Object[] = [];
    public departmentGroupDataSource: Object[] = [];
    public statutWorkorder: Object[] = [];
    public allRegies: Object[] = [];
    public idExisting = [];
    public libGroupe: LibelleGroupe[] = []
    public lastRandomId;

    public WorkorderByContainerId;
    public codegroupe;
    public libelleGroupe
    public filtermonteurListeArray;
    public otherSchedule: string = "Autres plannings";
    public otherMonteur: string = "Autres Opérateurs";
    public sorting: string = 'Ascending';
    public addMonteur: boolean;
    public fieldArray = this.field['dataSource'];
    public isDragged: boolean;
    public newField;
    public isAddedToBacklog: boolean;
    public count: number = 0;
    public groupeCharger: number;
    public workOrderColor: string;
    public fieldsPlanning
    public fieldsMonteur
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
    public intervalValue: string = '60'
    public intervalValueDay: string = '60'
    public intervalData: string[] = ['10', '20', '30', '40', '50', '60', '120','150','180','210','240','270','300','330','360','390','420','450', '480']

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
    public coordinateurListeArray = []
    public countAdd: number = 0
    public nameService: string = 'Mon planning'
    public comptText
    public openSideBar
    public elementDelete
    public placeholderRegie = 'Rechercher une régie...'

    public checkFields = { groupBy: 'libelletype', text: 'Text', value: 'Text' };
    public popwidth = '300px';
    public CheckBox = 'CheckBox';
 
    public workOrderBacklogFields = { groupBy: 'typetravail', text: 'Name', value: 'Name' };

    // ALL ACTIONS
    public isTreeItemDropped: boolean = false; // drag and drop wworkorder
    public isTreeItemDroppedMonteur: boolean = false; // drag and drop operateur
    public zoomCont: number = 0
    public valueMax: number = 60
    public value: number = 60
    public valueAdd: number = 5
    public refreshF4: boolean
    public navigation: boolean = false;
    public intervalChanged: boolean = false
    public isStrictMode: boolean = true;
    public statutMonteur = []
    public isClickZoom = true
    public offsetCell;
    public disabledrefresh: boolean = false;
    public multiSelectionBacklog :boolean = false;
//Dialog INIT 
  
public header: string = 'Raccourcis Clavier';
public showCloseIcon: Boolean = true;
public width: string = '70%';
public animationSettings: AnimationSettingsModel = { effect: 'None' };
// public intervalle:string  ='Intervalle (Minutes)'
public targetModal: string = '.control-section';
public displayRessourceMonteur = false
// public header: string = 'Raccourcis Clavier';
// public showCloseIcon: Boolean = true;
// public width: string = '50%';

// public targetDialog: string = '.control-section';

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
        private statutService: StatutService,
        private workOrderTempsReelService: WorkOrderTempsReelService,
        private store: Store<App>,
        private injector: Injector,
        private jourFeries :JourFeriesComponent

    ) {
        console.log('******* constructor start *******');
        console.log(this.store)
   console.log(this.jourFeries)

        // this.store.source['value'].navbar ='close'
        this.isnotMyGroup = false;
        setTimeout(() => {


            document.body.addEventListener('keyup', (eKey: KeyboardEvent) => {
                let btnrefresh = document.getElementById('btn-refresh');
                let btnrefreshWo = document.getElementById('btn-refreshWo');
            


                if (eKey.keyCode === 115) {

                    if (this.hiderefresh == false && this.disabledrefresh == false) {
                        this.disabledrefresh = true
                        this.hiderefresh = true
                        console.log("clique f4 !disabledrefresh")
                        this.timelineResourceDataOut = []
                        // this.departmentDataSource = []
                        this.allDataContainers = []
                        this.allDataWorkorders = []
                        this.refreshScheduler()
                        this.refreshWorkordersBacklog()

                    } else {
                        console.log("pas de refresh ")
                    }

                    console.log(btnrefresh, btnrefreshWo)

                }
                if(eKey.keyCode === 17){
                    this.multiSelectionBacklog = false
                }

            })
        }, 700);
        document.body.addEventListener('keydown', (eKey: KeyboardEvent) => {
       
               if(eKey.keyCode === 17){ //touche ctrl
                //    console.log(eKey)
                this.multiSelectionBacklog = true
               }

            if (eKey.keyCode === 115) {

                if (this.hiderefresh == false && this.disabledrefresh == false) {
                    console.log("clique f4 !disabledrefresh")
                    this.timelineResourceDataOut = []
                    // this.departmentDataSource = []
                    this.allDataContainers = []
                    this.allDataWorkorders = []

                } else {
                    console.log("pas de refresh ")
                }


            }
            


        })

        document.body.addEventListener('keydown', (eKey: KeyboardEvent) => {
            let scheduleElement: Element = document.querySelector('.e-schedule');
            let scheduleObj: Schedule = ((scheduleElement as EJ2Instance).ej2_instances[0] as Schedule);
    
            if (eKey.key === '-') {
                // -------------------------------------------------           
                this.isClickZoom = false
                this.intervalChanged = true;
                this.value = this.value + this.valueAdd;
                this.scheduleObj.timeScale.interval += 5;

                setTimeout(() => {
                    // this.zoomWithScroll()
                    // this.scheduleObj.scrollToResource(this.eventOnCellClick[0].Id)
                    this.scheduleObj.scrollTo(this.hourContainer, this.dateContainer)

                }, 200);
                this.eventSettings.dataSource = this.timelineResourceDataOut
                console.log(this.value, this.valueMax)

            } else {

                if (eKey.key === '+' && this.value > 5) {
                    this.intervalChanged = true;
                    this.value = this.value - this.valueAdd;
                    this.scheduleObj.timeScale.interval -= 5;

                    setTimeout(() => {
                        // this.zoomWithScroll()
                    // this.scheduleObj.scrollToResource(this.eventOnCellClick[0].Id)
                    this.scheduleObj.scrollTo(this.hourContainer, this.dateContainer)

                    }, 200);

                    if (this.value === 5) {

                    }
                    console.log("+++++++", eKey)

                    this.eventSettings.dataSource = this.timelineResourceDataOut
                }

                //    }
            }


        }, true);
        this.getStatut();
      
        console.log('******* constructor end *******');
    }

    ngOnInit() {

   
        console.log(this.store);
        console.log(this.selectedDate, moment().add(1, 'd').toDate());

        this.storeAppSubscription();
        // window.addEventListener('scroll', this.scroll, true);
     

    }
 
    // @HostListener('window:beforeunload', ['$event'])
    // beforeunloadHandler(event) {
    //     console.log(event)
    //     return event.returnValue = "Êtes-vous sur de vouloir quitter le k-planner ?";

    // }
    ngAfterViewInit() {
        this.departmentDataSource = this.departmentGroupDataSource;
    }
    onTreeSelecting(event) {
        console.log('ON TREE SELECTING ====> ', event);
    }
    public workorderSelectedInBacklog = []
    onTreeSelected(event) {
        console.log('ON TREE SELECTED ====> ', event);
        if(event.action== "select"){
            let id = +event.nodeData.id
            let treeviewData: { [key: string]: Object }[] =
            this.treeObj.fields.dataSource as { [key: string]: Object }[];
        
            if (this.multiSelectionBacklog){ //touche ctrl est pressée
            let workorderSelected =  treeviewData.filter(item => item.Id === id)
            this.workorderSelectedInBacklog.push(workorderSelected[0])
            let eventArray =[]
            
            this.workorderSelectedInBacklog = this.workorderSelectedInBacklog.sort((a,b)=>{
              return  +a.Id - +b.Id         
               })
            for(let i =0; i <this.workorderSelectedInBacklog.length ; i++){
                               if( i == 0){
                                   eventArray.push(this.workorderSelectedInBacklog[i])
                               }else if(+this.workorderSelectedInBacklog[i-1].Id != +this.workorderSelectedInBacklog[i].Id ){
                                   console.log("item different ", this.workorderSelectedInBacklog[i-1].Id, this.workorderSelectedInBacklog[i].Id)
                               eventArray.push(this.workorderSelectedInBacklog[i])
                               console.log(eventArray)
                              }
                           }
                           console.log(eventArray,"eventArray ===>")
                           this.workorderSelectedInBacklog= eventArray
                          
        }else{
            this.workorderSelectedInBacklog = []
            let workorderSelected =  treeviewData.filter(item => item.Id === id)
            this.workorderSelectedInBacklog.push(workorderSelected[0])
        }}
        if(event.action== "un-select"){
            let id = +event.nodeData.id
            this.workorderSelectedInBacklog = this.workorderSelectedInBacklog.filter(item => item.Id != id)
        }
       
    }
    contClickEvent = 1
public idBacklog 
    onNodeClicked(event){
        console.log('ON event clicked ====> ', event);
        this.idBacklog = event.node.dataset.uid;
        console.log(this.idBacklog);
        let point = "."
        let text = event.node.innerText
        let operateur = text.split(point)
        this.operateurSelected = operateur[0]
        console.log(this.operateurSelected)
        
}
    onTreeExpanding(event) {
        console.log('ON TREE EXPANDING ====> ', event);
    }
    public operateurSelected
    onClickedNode(event) {
        console.log('ON Node Clicked ====> ', event.nodeData.text.length);
        console.log('ON Node Clicked ====> ', event)
     
    }
  

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.unsubscribe();
        // window.removeEventListener('scroll', this.scroll, true);
  
    }
   


    public hiderefresh: boolean
    refreshScheduler() {
        console.log(this.scheduleObj, this.disabledrefresh);
        // this.departmentGroupDataSource = [];
        this.disabledrefresh = true;
        this.hiderefresh = true;
        this.planningChanged = false;
        // this.statutDifferent = false;    
        this.eventSelecte = [];
        // this.workorderSelected =[]
        console.log('refresh scheduler click in refreshScheduler() => ', this.disabledrefresh);
        this.scheduleObj.eventSettings.dataSource = []
        this.timelineResourceDataOut = []
        this.allDataWorkorders = []
        //   this.departmentDataSource = [];
        //   this.departmentDataSourceAll = []; /bug btn rafraichir les regis sont pas charger 
        this.allDataContainers = [];
        this.openEditorCount = 0;

        console.log(this.scheduleObj.currentView, 'currentView !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log('refresh scheduler click in refreshScheduler() => ');
        console.log('isClicked : ', this.isClicked);
        console.log('this.refreshDateStart => ', this.refreshDateStart);
        console.log('this.refreshDateEnd => ', this.refreshDateEnd);
        this.refreshDate()
        // if (this.departmentGroupDataSource.length == 0) {
            // this.getSalleByGroup(this.idGroupeCoordinateur, this.refreshDateStart, this.refreshDateEnd);
            this.salleDataSource.forEach(salle => {
                let indexSalle = this.salleDataSource.indexOf(salle);
            
                if (this.theorique.checked) {
                    this.navigation = true
                    this.getContainersByRessourceStartDateEndDate(
                        salle.CodeRessource,
                        this.refreshDateStart,
                        this.refreshDateEnd,
                        salle.CodeSalle,
                        indexSalle,
                        this.idGroupeCoordinateur
                    );
                }
           
    // }
        let debut = moment(this.refreshDateStart,).format('YYYY-MM-DD').toString();
        let fin = moment(this.refreshDateEnd,).format('YYYY-MM-DD').toString();
        // if (this.planningChanged || this.clicFermerOnActionComplete) {
       
            if (this.reel.checked ) { // affiche le temps réel 
                console.log(" this.planningChanged  was changed ", this.idGroupeCoordinateur)
                this.getWorkorderTempsReelByIdGroupeStartDateEndDate(this.idGroupeCoordinateur, debut, fin, salle.CodeRessource, salle.CodeSalle)

            }
        this.numberContainerWithoutOperateur()
        // }
        })
        console.log('this.refreshDateStart : ', this.refreshDateStart);
        console.log('this.refreshDateEnd : ', this.refreshDateEnd);
        console.log('refresh scheduler with my regies group');
        console.log(this.timelineResourceDataOut)
        this.Check = 0
        //   this.departmentDataSource = this.departmentGroupDataSource; //bug btn rafraichir
        this.openEditorCount = 0;

        //*****************************************************garder l'etat des checkboxs *************************************************************
        // this.Check = 0
        // setTimeout(() => {
            // this.onChangeDataSource()
            // this.onChangeDataSourceEvents()
            // this.onChangeDataSourceOperateur()
            if ( this.resultFilterDataSource.length != 0) {
                if(!this.displayRessourceMonteur){
                this.departmentDataSource = this.resultFilterDataSource;
                 }else{
                  this.displayRessourceMonteur= this.resultFilterDataSource;
                 }
            } else {
                // this.departmentDataSource = this.departmentDataSource
            }
        // }, 1200);
        // this.createTooltipWorkorder()
    }
    public disabledrefreshBacklog: boolean = true


    refreshWorkordersBacklog() {
        this.disabledrefreshBacklog = true
        console.log('refresh workorders backlog click');
        this.workOrderData = [];
        this.workOrderToBacklog = [];
        this.workorderSelectedInBacklog = [];
        this.getWorkOrderByidGroup(this.currentCoordinateur.Groupe);
        
        setTimeout(() => {
            if (this.searchString != undefined) {
                console.log("clic bouton refresh ")
                this.searchwo.value = this.searchString
                this.onFilter(this.searchwo.value, 0, this.argsKeyboardEvent)
            } else {
            }   
        }, 200);
      
    }
    refreshDate() {
        if ((this.refreshDateStart === undefined || this.refreshDateEnd === undefined) && this.scheduleObj.currentView === 'TimelineDay') {
            this.refreshDateStart = moment().toDate();
            this.refreshDateEnd = moment().add(1, 'd').toDate();
        }
    }
    dialogRefresh(){ // le container contient des taches commencée et pas visible dans le planner   
        swal({
            title: 'Attention',
            html: 'Le container contient une ou plusieurs tâches commencées, veuillez rafraichir pour pouvoir les afficher ',
            showCancelButton: false,
            confirmButtonText: 'Rafraichir',
            cancelButtonText: 'Annuler',
            allowOutsideClick: false
        }).then((refresh) => {
            if (refresh.value) {
                this.refreshScheduler()
            } else {
                
            }
        });
        // this.disabledrefresh = false 
    
    }

    numberContainerWithoutOperateur(){
        let containerWithoutOperateur = this.timelineResourceDataOut.filter(item =>item.Operateur == '' || item.Operateur == null && item.AzaIsPere )
        this.comptContainerWithoutOperateur = containerWithoutOperateur.length
        return   this.comptContainerWithoutOperateur
    }

    public idCoordinateur
    public groupCoordinateur
    public idGroupeCoordinateur
    getCoordinateurByUsername() {
        this.timelineResourceDataOut = [];
        this.departmentGroupDataSource = [];
        this.allDataContainers = [];
        this.allDataWorkorders = [];
        console.log('get Current Coordinateur');
        let startofDay = moment().toDate()
        let endofDay = moment().add(1, 'd').toDate();

        this.idGroupeCoordinateur = this.groupeCoordinateur

        console.log('COORDINATEUR => ', this.itemCoordinateur, this.idGroupeCoordinateur);
        this.getTypeRessourceMonteur()
        this.getMonteursByGroup(this.groupeCoordinateur);
        this.getSalleByGroup(this.groupeCoordinateur, startofDay, endofDay);
          this.getWorkOrderByidGroup(this.groupeCoordinateur)
        this.currentCoordinateur = this.itemCoordinateur;
        this.getLibGroupe(this.groupeCoordinateur)
        this.groupCoordinateur = this.groupeCoordinateur



    }

    storeAppSubscription() {
        this.user = this.userStore;
        console.log(this.user);
        if (this.user.shortUserName === this.itemCoordinateur.Username) {
            this.getCoordinateurByUsername();
        }
    }

public eventSelecte =[]
    onEventClick(e: ActionEventArgs) {
        console.log('event clicked !!!!!!!!!!!', e);

        if (e.event["Statut"] != 3 && !e.event["AzaIsPere"]) {
            console.log("temps reel")
            //   this.openDialog( this.workOrderColor  , e.event, e.event, this.departmentDataSource);
         
        }
          
        if(e.event["AzaIsPere"]){
      
        }
        this.eventClick = true;
     
      

       
      // this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut 
    }
    // public eventHoverData
    // onHover(args: HoverEventArgs) {
    //     if (args.element.className === "e-appointment e-lib e-draggable") {
    //         this.eventHoverData = args.element
    //     } 
    // }

    // zoomWithScroll() {

    //     this.scheduleObj.element["ej2_instances"][0].refreshEvents()
    //     let len = document.querySelectorAll('.e-appointment').length;
    //     if (this.eventHoverData != null) {
    //         for (let i = 0; i < len - 1; i++) {
    //             let event = document.querySelectorAll('.e-appointment')[i] as any;
    //             if (this.eventHoverData != null || undefined) {
    //                 if (event.getAttribute("data-id") === this.eventHoverData.dataset.id) {
    //                     console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
    //                     console.log(event, 'event ')
    //                     document.querySelector('.e-content-wrap').scrollLeft = event.offsetLeft;
    //                     this.isClickZoom = true
    //                 } else {
    //                     this.isClickZoom = true
    //                 }
    //             }
    //         }
    //     }
        
    // }



    /****************************************************************************************************************************************/
    /*************************************************************** API REQUEST ************************************************************/
    /****************************************************************************************************************************************/

    /************************************************************/
    /**************************** GET ***************************/
    public dataSourcePlanner
 
    public lastSalle = false
    getSalleByGroup(idGroup, start, end) {
        // this.toggleBtn.content = 'Voir autres Régies';


        console.log(this.departmentDataSource);
        console.log(this.departmentGroupDataSource);
        this.salleService
            .getGroupSalle(idGroup)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(donnees => {
                //   .then(donnees => {

                this.dataRegieReady = true;
                this.salleDataSource = donnees;
                 this.salleDataSource = this.salleDataSource.sort((a,b) => {
                    var regieA = a["NomSalle"].toUpperCase(); // ignore les  upper & lowercase
                    var regieB = b['NomSalle'].toUpperCase(); // ignore les upper & lowercase
                    if (regieA < regieB) {
                      return -1;
                    }
                    if (regieA > regieB) {
                      return 1;
                    }
                  
                    // names must be equal
                    return 0;
                } );
                console.log('salles group result : ', this.salleDataSource);
                this.salleDataSource.map(item => {
                    console.log(item);        
                    this.departmentGroupDataSource.push({
                        Text: item.NomSalle,
                        Id: item.CodeRessource,
                        Color: '#bb87c0',
                        codeSalle: item.CodeSalle,
                        codeRessource: item.CodeRessource,
                        libelletype: item.libelletype,
                        isRegie:true,
                    });
                    let newItem = [{ Text: item.NomSalle, Id: item.CodeSalle }];
                    // this.departmentDataSource = this.departmentDataSource.concat(newItem);           
                    console.log('regie departmentGroupDataSource', this.departmentGroupDataSource);
                    this.departmentDataSource=  this.departmentGroupDataSource
              
                    console.log('regie departmentDataSource', this.departmentDataSource);
                    console.log('item code salle fot container request : ', item.CodeSalle);
                    // this.getContainersByRessource(item.CodeRessource);
                    let indexSalle = this.salleDataSource.indexOf(item);
                    if (indexSalle === (this.salleDataSource.length - 1)) {
                        this.lastSalle = true
                        console.log(this.salleDataSource[indexSalle], "-----------------------------lastSalle")
                    }
                    console.log('--------------------------------------------------indexSalle => ', indexSalle);

                    // lors du demarrage de l'application 
                    this.getContainersByRessourceStartDateEndDate(
                        item.CodeRessource,
                        start,
                        end,
                        item.CodeSalle,
                        indexSalle,
                        idGroup
                    );



                    let debut = moment(start).format('YYYY-MM-DD').toString();
                    let fin = moment(end).format('YYYY-MM-DD').toString();

                    if (this.planningChanged || this.clicFermerOnActionComplete) {
                        if (this.reel.checked) { // affiche le temps réel 
                            console.log(" this.planningChanged  was changed ", idGroup)
                            this.getWorkorderTempsReelByIdGroupeStartDateEndDate(idGroup, debut, fin, item.CodeRessource, item.CodeSalle)

                        }
                    }
                });
                          
                    this.listeRegies = this.departmentGroupDataSource   
                    this.dataSourcePlanner = this.listeRegies                
            })
  

    }


   
    public monteurUsername
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
                        this.monteurUsername = item.Username
                        this.fieldsMonteur = { text: "Username", value: "Username" }

                    }

                    this.typeRessourceMonteur.map((statut, index) => {

                        if (statut.Code == item.typeressource) {
                            this.statutMonteur.push({
                                Name: item.Username,
                                Libelle: statut.Libelle,
                                typeRessource: item.typeressource
                            })
                            this.statutMonteur = this.statutMonteur.sort((a, b) => {
                                return +a.Username - +b.Username
                            })
                        } else {

                        }

                    })


                });
                console.log(this.statutMonteur, "Avant ==>")

                     let newArrayStatutMonteur =  []
                for (let i = 0; i < this.statutMonteur.length - 1; i++) {


                    if(i == 0){
                        // console.log(this.statutMonteur[0].Name)
                        newArrayStatutMonteur.push(this.statutMonteur[i])
                    }else{
                        // console.log(this.statutMonteur[i-1].Name)
                       if (this.statutMonteur[i-1].Name != this.statutMonteur[i].Name) {
                        newArrayStatutMonteur.push(this.statutMonteur[i])
                 
                       }
                    }
               

                }
                this.statutMonteur = newArrayStatutMonteur
                console.log(this.statutMonteur, "Apres ==>")
            });

    }
public operateurDataSource = []; //dataSource pour afficher le planning des operateur
public listOperateur = []
    getMonteursByGroup(idGroup) {
        this.monteursService
            .getGroupMonteur(idGroup)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(donnees => {
                console.log('monteurs : ', donnees);
                this.monteurDataSource = donnees;
                this.fieldMonteur = {
                    dataSource: this.monteurDataSource,
                    id: 'idressourcetype',
                    text: 'Username',
                    codeRessource: "CodeRessource",
                    typeRessource: "typeressource",
                    colorMonteurr:'#bb87c0',
                   
                };

                this.monteurDataSource.map(item =>{
                    this.operateurDataSource.push({
                        Text: item.Username,
                        Id: item.CodeRessource,
                        Color: '#bb87c0',
                        isRegie:false,
                        libelletype:item.libelletype
            })
            });
    
    this.operateurDataSource = this.operateurDataSource.sort((a, b) => {
        return +a.Username - +b.Username
    })    
      let operateurArray =[]
      for(let i= 0 ; i< this.operateurDataSource.length; i++){
          if(i==0){
              operateurArray.push(this.operateurDataSource[i])
          }else{
              if(this.operateurDataSource[i-1].Id != this.operateurDataSource[i].Id){
                operateurArray.push( this.operateurDataSource[i])
              }
          }
      }
      console.log(operateurArray)
      this.operateurDataSource = operateurArray
      this.listOperateur = operateurArray
      console.log('liste operateur ', this.listOperateur)
            }) 
        
         console.log(this.operateurDataSource,"operateurDataSource")
        console.log('fieldmonteur:', this.fieldMonteur);
        console.log('monteur:', this.monteurDataSource);
    }




    public typeRessourceMonteur
    getTypeRessourceMonteur() {
        this.monteursService
            .getTypeRessource()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(statut => {
                console.log(statut)
                this.typeRessourceMonteur = statut

            })


    }

    public statutsService
    public statutLibelle
    getStatut() {
        console.log("debut get statut")
        let couleur
        this.statutService
            .getStatut()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(data => {
                this.statutsService = data
                this.statutsService.map(item => {
                    this.colorStatut.map(statut => {
                        if (item.code === statut["Id"]) {
                            couleur = statut["Color"]
                        }
                    })

                    this.statutWorkorder.push({
                        Code: item.code,
                        Color: couleur,
                        libelleStatut: item.libelle_operateur
                    })

                })
                console.log("statut", this.statutWorkorder)


            })
    }
    public lastSalleCall = false;
    public lastContainerCallLength
    public disableNavigation = false
    getContainersByRessourceStartDateEndDate(coderessource, datedebut, datefin, codeSalle, indexSalle, idGroup) {
        this.timelineResourceDataOut = []
        this.allDataWorkorders = []
        this.allDataContainers = [];

        console.log('CALL getContainersByRessourceStartDateEndDate() with codeRegie : ', coderessource, ' / dateDebut : ', datedebut, ' / dateFin : ', datefin);

        let debut = moment(datedebut).format('YYYY-MM-DD').toString();
        let fin = moment(datefin).format('YYYY-MM-DD').toString();


        // console.log('******************************** this.lastSalleCall ===> ', this.lastSalleCall);
        // console.log('debut =>', debut);
        // console.log('fin =>', fin);

        // console.log('coderessource salle => ', coderessource);
        this.containersService
            .getContainersByRessourceStartDateEndDate(coderessource, debut, fin)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(res => {
                //   .then(res => {

                this.dataContainersByRessourceStartDateEndDate = res;
                // console.log('container present in regie : ',  this.dataContainersByRessourceStartDateEndDate);
                // console.log('debut =>', debut);
                // console.log('fin =>', fin);
                // console.log('coderessource salle => ', coderessource);
                console.log("res ===>", res)

                if (res.length > 0) {
                    this.allDataContainers = [...this.allDataContainers, ...res];
                    console.log('all data container : ', this.allDataContainers);
                    this.dataContainersByRessourceStartDateEndDate.map(data => {
                        console.log("data ===>", data)
                        let indexContainer = this.allDataContainers.indexOf(data)
                        console.log("allDataContainers", this.allDataContainers)
                        this.idExisting.push(data.Id_Planning_Container);
                        // console.log('item in container present in regie (map) : ', data);
                        let dateDebut = moment(data.DateDebutTheo, moment.defaultFormat).toDate();
                        let dateFin = moment(data.DateFinTheo, moment.defaultFormat).toDate();
                        //   let arrName = data.UserEnvoi.split('-');
                        let libelleRessourceSalle =this.salleDataSource.filter(item => item.CodeRessource ==coderessource)
                        console.log(libelleRessourceSalle)
                        let NomSalle = libelleRessourceSalle[0].NomSalle
                        let initiales
                        if (data.UserEnvoi != null) {
                            initiales = data.UserEnvoi.slice(-1) + data.UserEnvoi.slice(0, 1);
                        } else {
                            initiales = ''
                        }
                        //  console.log(initiales,"&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
                     let Event={
                            Id: data.Id_Planning_Container,
                            Name: (data.Titre === null || typeof (data.Titre) === 'undefined') ? 'Titre' : data.Titre,
                            StartTime: dateDebut,
                            EndTime: dateFin,
                            CodeRessourceSalle: coderessource,
                            Container: true,
                            numGroup: data.Id_Planning_Container,
                            Description: data.Commentaire_Planning,
                            Operateur: data.LibelleRessourceOperateur === null ? '' : data.LibelleRessourceOperateur,
                            coordinateurCreate: (initiales === null || typeof (initiales) === 'undefined') ? '' : initiales,
                            AzaIsPere: true,
                            AzaNumGroupe: data.Id_Planning_Container,
                            DepartmentID: coderessource,
                            ConsultantID: 2,
                            DepartmentName: NomSalle,
                            IsAllDay: false,
                            Commentaire: data.Commentaire,
                            Commentaire_Planning: data.Commentaire_Planning,
                            IsReadonly: false,
                            isTempsReel: 0,
                            CodeRessourceCoordinateur: data.CodeRessourceCoordinateur,
                            CodeRessourceOperateur:data.CodeRessourceOperateur
                        }
                        this.timelineResourceDataOut.push(Event);
                        // this.lastTimelineResourceDataOut.push(Event)
                      
                  
                        // console.log(   this.lastTimelineResourceDataOut ,"this.lastTimelineResourceDataOut ====>>")
                        let index = this.dataContainersByRessourceStartDateEndDate.indexOf(data);
                        let length = this.dataContainersByRessourceStartDateEndDate.length;

                        console.log('--------------------------------------------------index  length => ', index, length);
                        this.getWorkorderByContainerId(data.Id_Planning_Container, coderessource, index, NomSalle, indexSalle, debut, fin, data.LibelleRessourceOperateur);





                    });
                    // console.log('this.timelineResourceDataOut => ', this.timelineResourceDataOut)
                    // timelineResourceDataOut

                    // this.departmentDataSource = this.departmentGroupDataSource;
                    //   this.eventSettings = {
                    //     dataSource: <Object[]>extend(
                    //         [], this.timelineResourceDataOut, null, true
                    //     ),
                    //     enableTooltip: true, tooltipTemplate: this.temp
                    // };
                    // this.updateEventSetting(this.timelineResourceDataOut);
                    this.createTooltipWorkorder();
                    // console.log('this.scheduleObj.eventSettings.dataSource ', this.scheduleObj.eventSettings.dataSource);
                    console.log(this.timelineResourceDataOut, "timelineDataOut getContainer ")
                } else {
                    // console.log('container not present for regie : ', coderessource, res);

                    if (indexSalle === (this.salleDataSource.length - 1)) {
                        this.lastSalleCall = true;
                        console.log("pas de container")
                        // this.updateEventSetting(this.timelineResourceDataOut);
                        console.log("length last call", length, indexSalle, )
                        this.numberContainerWithoutOperateur()
                    
                   
                        console.log(this.timelineResourceDataOut)
                        this.disableNavigation = false;
                        if (!this.disableNavigation) {
                            let toolbar = document.getElementsByClassName('e-toolbar-items');
                            for (let i = 0; i < toolbar.length; i++) {
                                toolbar[i]["style"].display = 'block'

                            }
                        }

                        this.disabledrefresh = false
                        this.hiderefresh = false

                      
                        // this.createTooltipWorkorder();
                        // this.onChangeDataSourceEvents()
                        this.onChangeDataSourceOperateur()
                        this.onChangeDataSourceEvents()
                    }

                }
         

            });

        console.log("allDataContainers length", this.allDataContainers.length)
        console.log("allDataworkorder length", this.allDataWorkorders.length)
    }
    public allDataWorkorders = [];
    public libelleStatut:string;
    public comptContainerWithoutOperateur:number = 0
    getWorkorderByContainerId(id, coderessource, index, DepartmentName, indexSalle, debut, fin, Operateur) {
        console.log('CALL getWorkorderByContainerId() with idContainer : ', id);
        // console.log('--------------------------------------------------indexSalle => ', indexSalle);
        // console.log('id container to check workorder => ', id)

        // console.log('index => ', indexSalle);
        // console.log('containerArrayLength => ', containerArrayLength);

        this.workorderService
            .getWorkOrderByContainerId(id)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(res => {
                //   .then(res => {

                // console.log('response workorder for container : ', res);
                this.WorkorderByContainerId = res;
                this.allDataWorkorders = [...this.allDataWorkorders, ...res];
                console.log('******* res workorder  ******* => ', this.WorkorderByContainerId);
                // console.log('this.WorkorderByContainerId.length => ', this.WorkorderByContainerId.length);
                let libelleStatut
                if (this.WorkorderByContainerId.length > 0) {
                    this.WorkorderByContainerId.map(data => {
                        let StartTime = moment(data.DateDebutTheo, moment.defaultFormat).toDate(),
                            EndTime = moment(data.DateFinTheo, moment.defaultFormat).toDate(),
                            dateDebut = StartTime,
                            dateFin = EndTime,
                            StartTimeReel = moment(data.DateDebut, moment.defaultFormat).toDate(),
                            EndTimeReel = moment(data.DateFin, moment.defaultFormat).toDate();

                        this.statutWorkorder.map(item => {
                            if (data.Statut === item["Code"]) {
                                libelleStatut = item["libelleStatut"]
                            }
                        })

                        let newWorkorderEvent = {
                            Id: data.Id_Planning_Events,
                            Name: data.titreoeuvre,
                            StartTime: dateDebut,
                            EndTime: dateFin, // date provisoire
                            CodeRessourceSalle: coderessource,
                            Container: false,
                            numGroup: data.Id_Planning_Container,
                            Description: data.Commentaire_Planning,
                            Operateur: Operateur,
                            coordinateurCreate: data.UserEnvoi,
                            Statut: data.Statut,
                            AzaIsPere: false,
                            AzaNumGroupe: data.Id_Planning_Container,
                            DepartmentID: coderessource,
                            ConsultantID: 2,
                            DepartmentName: DepartmentName,
                            IsAllDay: false,
                            libchaine: data.libchaine,
                            typetravail: data.typetravail,
                            titreoeuvre: (data.titreoeuvre === null || typeof (data.titreoeuvre) === 'undefined') ? '' : data.titreoeuvre,
                            numepisode: data.numepisode,
                            dureecommerciale: data.dureecommerciale,
                            libtypeWO: data.libtypeWO,
                            Commentaire_Planning: data.Commentaire_Planning,
                            Commentaire_Planning_rtf:data.Commentaire_Planning,
                            IdGenerationWO: data.IdGenerationWO,
                            isTempsReel: 0,
                            IsReadonly: false,
                            Id_Planning_Events_TempsReel: 0,
                            titreepisode: data.titreepisode,
                            DateDebutReel:StartTimeReel ,
                            DateFinReel:EndTimeReel ,
                            libelleStatut: libelleStatut,
                            CodeRessourceCoordinateur: data.CodeRessourceCoordinateur,
                            CodeRessourceOperateur:data.CodeRessourceOperateur,
                            Commentaire:data.Commentaire

                        }


                        this.timelineResourceDataOut.push(newWorkorderEvent);
                    
                        // récuperer les containers de la derniére régie
                    let containerEvent = this.timelineResourceDataOut.filter(item => item.CodeRessourceSalle === this.salleDataSource[(this.salleDataSource.length - 1)].CodeRessource && item.AzaIsPere === true);
                    //   console.log(this.salleDataSource[0].CodeRessource)
                    let indexContainer
                    containerEvent.map(data => {
                        indexContainer = containerEvent.indexOf(data)
                    })
                    console.log(this.allDataWorkorders)
                    console.log(indexSalle)
                    if ( (indexSalle === (this.salleDataSource.length - 1))) {
                        this.lastSalleCall = true;
                                
                        console.log('*********** end to initial request for all regies container and workorders ***********');

                        // récuperer les workOrders du dérnier container de la derniére régie
                        let workorderEvent = this.timelineResourceDataOut.filter(item => item.AzaNumGroupe === containerEvent[indexContainer].AzaNumGroupe && item.AzaIsPere === false && item.isTempsReel === 0);
                        let indexWorkorder
                        workorderEvent.map(data => {
                            indexWorkorder = workorderEvent.indexOf(data)
                        })
                        console.log(containerEvent, "=========> containerEvent ")
                        console.log(workorderEvent, "=========> workorderEvent ")
                        this.disableNavigation = false;
                        if (workorderEvent.length === 0) {
                            console.log("pas de workorder")
                        }
                        if (workorderEvent.length > 0) {
                            if (indexWorkorder === (workorderEvent.length-1 )) {
                            console.log("dernier Workorder du dernier container ===>", workorderEvent[indexWorkorder])
                            console.log("dernier Container ===>", containerEvent[indexContainer])
                            if (!this.disableNavigation) {
                                let toolbar = document.getElementsByClassName('e-toolbar-items');
                                for (let i = 0; i < toolbar.length; i++) {
                                    toolbar[i]["style"].display = 'block'
                                    console.log(toolbar[i]["style"], "block", this.salleDataSource[this.salleDataSource.length - 1])
                                }
                            } 
                                this.disabledrefresh = false
                                this.hiderefresh = false 
                            this.lastSalle = false
                             }
                            console.log("THIS.ALLDATAWORKORDER", this.allDataWorkorders)
                          
                           
                            this.onChangeDataSourceOperateur()
                            this.onChangeDataSourceEvents()
                            // this.onChangeDataSource()
                        } 
                  

                        
                                         
                    }else{
                     
                            this.onChangeDataSourceEvents() 
                            // this.onChangeDataSource()
                            this.onChangeDataSourceOperateur()
                    }
                 });
                
          
                } else {
                    // récuperer les container de la derniére régie
                    let containerEvent = this.timelineResourceDataOut.filter(item => item.CodeRessourceSalle === this.salleDataSource[(this.salleDataSource.length - 1)].CodeRessource && item.AzaIsPere === true);
                    let indexContainer
                    containerEvent.map(data => {
                        indexContainer = containerEvent.indexOf(data)
                    })
                    if ((indexSalle === (this.salleDataSource.length - 1))) {
                        this.lastSalleCall = true;
                        console.log(containerEvent, "containers present on last regie ")
                        console.log("dernier Container sans workoders ===>", containerEvent[indexContainer])
                        console.log("length last call", length, indexSalle, this.lastContainerCallLength)
                       
                        this.disableNavigation = false;
                        if (!this.disableNavigation) {
                            let toolbar = document.getElementsByClassName('e-toolbar-items');
                            for (let i = 0; i < toolbar.length; i++) {
                                toolbar[i]["style"].display = 'block'
                                console.log(toolbar[i]["style"], "block")
                            }
                        }
                        this.disabledrefresh = false
                        this.hiderefresh = false
                        this.lastSalle = false
                      
                                     
                        if(this.Ecriture.checked ==true){
                            console.log("workorder checked ======>")
                             let workorderTimeDataSource = this.timelineResourceDataOut.filter(item =>!item.AzaIsPere)
                          this.updateEventSetting(workorderTimeDataSource)
                        }else{
                            this.updateEventSetting(this.timelineResourceDataOut);
                        }
                        // if( this.operateur.checked == true){
                        //     this.onChangeDataSourceOperateur()
                        // }                  
                        // this.createTooltipWorkorder();
                    }



                }

            });
        
    }
    public dataWorkorderTempsReelByIdGroupeStartDateEndDate
    public EndTimeReel; StartTimeReel
    public WorkorderTempsReelEvent
    getWorkorderTempsReelByIdGroupeStartDateEndDate(idGroupe, dateDebut, dateFin, codeRessouceSalle, codeSalle) {

        this.workOrderTempsReelService
            .getWorkorderTempsReelByIdGroupeStartDateEndDate(idGroupe, dateDebut, dateFin)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(res => {
                console.log("call getWorkorderTempsReelByIdGroupeStartDateEndDate () ", res)
                console.log(res, "<========================================== res temps reel")
                console.log("date debut ===>", dateDebut, "date fin ===>", dateFin)
                this.dataWorkorderTempsReelByIdGroupeStartDateEndDate = res;

                if (res.length > 0) {
                    this.createTooltipWorkorder()
                    this.dataWorkorderTempsReelByIdGroupeStartDateEndDate.map(data => {

                        let dateDebut = moment(data.DateDebutReel, moment.defaultFormat).toDate(),
                            dateFin = moment(data.DateFinReel, moment.defaultFormat).toDate(),
                            dateDebutTheo = moment(data.DateDebutTheo, moment.defaultFormat).toDate(),
                            dateFinTheo = moment(data.DateFinTheo, moment.defaultFormat).toDate();
                            

                        let initiales = data.UserEnvoi.slice(-1) + data.UserEnvoi.slice(0, 1);

                        if (moment(data.DateFinReel, moment.defaultFormat).isValid()) {

                        } else {
                            dateFin = moment().toDate()
                            //   console.log(dateFin)
                        }
                        let operateur, libelleStatut
                        this.monteurDataSource.map(item => {
                            if (item.CodeRessource === data.CodeRessourceOperateur) {
                                operateur = item.Username;
                            }
                        });

                        this.statutWorkorder.map(item => {
                            if (data.Statut === item["Code"]) {
                                libelleStatut = item["libelleStatut"]
                            }
                        })
                        if (data.CodeRessourceSalle === codeRessouceSalle) {
                            // console.log(data.CodeRessourceSalle, "code ressource salle wotr")
                            // console.log(codeRessouceSalle ,"code  ressource salle")
                            // console.log(codeSalle ,"code salle")
                            //   console.log(codeSalleTempsReel, "code  salle")
                            //   console.log( " date debut" , dateDebut, "date fin", dateFin)
                            let newWorkorderTempsReelEvent = {

                                Id: data.Id_Planning_Events_TempsReel,
                                Name: data.titreoeuvre,
                                StartTime: dateDebut,
                                EndTime: dateFin,
                                CodeRessourceSalle: data.CodeRessourceSalle,
                                Container: false,

                                Description: data.Commentaire_Planning,

                                Operateur: operateur,
                                coordinateurCreate: initiales,
                                Statut: data.Statut,
                                AzaIsPere: false,
                                //   AzaNumGroupe: data.Id_Planning_Container,
                                DepartmentID: data.CodeRessourceSalle,
                                //   ConsultantID: 2,
                                DepartmentName: '',
                                IsAllDay: false,
                                libchaine: data.libchaine,
                                typetravail: data.typetravail,
                                titreoeuvre: (data.titreoeuvre === null || typeof (data.titreoeuvre) === 'undefined') ? '' : data.titreoeuvre,
                                numepisode: data.numepisode,
                                dureecommerciale: data.dureecommerciale,
                                libtypeWO: data.libtypeWO,
                                Commentaire_Planning: data.Commentaire_Planning,
                                Commentaire_Planning_rtf:data.Commentaire_Planning,
                                IdGenerationWO: data.IdGenerationWO,
                                isTempsReel: 1,
                                IsReadonly: true,
                                Id_Planning_Events_TempsReel: data.Id_Planning_Events_TempsReel,
                                Id_Planning_Events: data.Id_Planning_Events,
                                DateDebutTheo: dateDebutTheo,
                                DateFinTheo: dateFinTheo,
                                titreepisode: data.titreepisode,
                                DateDebutReel: dateDebut,
                                DateFinReel: dateFin,
                                libelleStatut: libelleStatut,
                                CodeRessourceCoordinateur: data.CodeRessourceCoordinateur,
                                CodeRessourceOperateur:data.CodeRessourceOperateur,
                                Commentaire:data.Commentaire

                            }

                            this.timelineResourceDataOut.push(newWorkorderTempsReelEvent);
                            console.log(this.timelineResourceDataOut, " ...  this.timelineResourceDataOut ")
                            this.updateEventSetting(this.timelineResourceDataOut)
                            let workorderReelEvent = this.timelineResourceDataOut.filter(item => item.isTempsReel === 1);
                            let indexWorkorderReel
                            workorderReelEvent.map(data => {
                                indexWorkorderReel = workorderReelEvent.indexOf(data)
                            })
                            if (indexWorkorderReel === (workorderReelEvent.length - 1)) {
                                this.disableNavigation = false;
                                if (!this.disableNavigation) {
                                    let toolbar = document.getElementsByClassName('e-toolbar-items');
                                    for (let i = 0; i < toolbar.length; i++) {
                                        toolbar[i]["style"].display = 'block'
                                    }
                                }
                                this.disabledrefresh = false
                                this.hiderefresh = false
                                this.clicFermerOnActionComplete = false

                            }
                            console.log(this.disabledrefresh)
                        }
                    })
            
                } else {


                    this.disableNavigation = false;
                    if (!this.disableNavigation) {
                        let toolbar = document.getElementsByClassName('e-toolbar-items');
                        for (let i = 0; i < toolbar.length; i++) {
                            toolbar[i]["style"].display = 'block'
                            //   console.log(toolbar[i]["style"], "block")
                        }

                        this.disabledrefresh = false
                        this.hiderefresh = false
                        this.clicFermerOnActionComplete = false
                    }
                    this.updateEventSetting(this.timelineResourceDataOut)

                }
            })

    }

    getWorkorderTempsReelByIdPlannigEvents(idPlanningEvents) {
        console.log(' get Workorder Temps Reel By IdPlannigEvents')
        this.workOrderTempsReelService
            .getWorkorderTempsReelByIdPlannigEvents(idPlanningEvents)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(res => {
                console.log(res)
                this.WorkorderTempsReelEvent = res
            })
        console.log(this.WorkorderTempsReelEvent)
    }

    createTooltipWorkorder() {
        // let nameService = false
        // this.libGroupe.map(libelle => {
        //     if (this.nameService === "BANDES ANNONCES") {
        //         if (this.nameService === libelle.Libelle) {
        //             nameService = true
        //             console.log(nameService)
        //         }
        //     }
        // })
        // console.log('TOOLTIP')
        // let libelleStatut 
        // for (let i = 0; i < this.timelineResourceDataOut.length; i++) {

         

        //     let titreoeuvre = this.timelineResourceDataOut[i].titreoeuvre,
        //         titreepisode = this.timelineResourceDataOut[i].titreepisode,
        //         numepisode = this.timelineResourceDataOut[i].numepisode,
        //         dureecommerciale = this.timelineResourceDataOut[i].dureecommerciale,
        //         AzaIsPere = this.timelineResourceDataOut[i].AzaIsPere,
        //         libchaine = this.timelineResourceDataOut[i].libchaine,
        //         coordinateurCreate = this.timelineResourceDataOut[i].coordinateurCreate,
        //         Operateur = this.timelineResourceDataOut[i].Operateur,
        //         statut = this.timelineResourceDataOut[i].Statut,
        //         DateDebutTheo = this.timelineResourceDataOut[i].DateDebutTheo,
        //         DateFinTheo = this.timelineResourceDataOut[i].DateFinTheo,
        //         DateDebutReel = this.timelineResourceDataOut[i].DateDebutReel,
        //         DateFinReel = this.timelineResourceDataOut[i].DateFinReel
             
            
              
             
        //     this.temp = '<div class="tooltip-wrap">' +
        //         '<div class="tooltip-wrap">' +
        //         '${if(!AzaIsPere && titreoeuvre != null && titreoeuvre !== undefined )}<div class="content-area"><div class="name" >   Titre Oeuvre :  &nbsp; ${titreoeuvre} &nbsp;<br>  Titre épisode :${titreepisode}  &nbsp; ep &nbsp;${numepisode} <br> Type de Travail: &nbsp; ${libtypeWO} <br> Libellé chaine : &nbsp; ${libchaine}  <br>  Durée Commerciale :&nbsp;${dureecommerciale} <br> Statut :&nbsp; ${libelleStatut} </>  </>  </div> ${/if}' +
        //         '${if (!AzaIsPere && isTempsReel === 0 && Commentaire_Planning !== undefined &&  Commentaire_Planning  !== "" &&  Commentaire_Planning  != null) }<div class="time">Retour Opérateur : &nbsp; ${Commentaire_Planning}   </div>  ${/if} </div> ' +
        //         '${if(   Commentaire_Planning !== undefined &&  Commentaire_Planning  !== "" &&  Commentaire_Planning  != null && AzaIsPere )}<div>Commentaire Coordinateur: &nbsp; ${Commentaire_Planning}  </>  </div> ${/if}' +
        //         '${if (AzaIsPere  ) }<div class="time"> Titre: &nbsp;${Name} <br>  Coordinateur: &nbsp; ${coordinateurCreate}  </div> ${/if}' +
        //         '${if ( Operateur != null && Operateur !== "" && Operateur !== undefined  ) }<div class="time">Opérateur:&nbsp;${Operateur} </div> ${/if}' +
        //         '${if (Statut === 3 || AzaIsPere ) }<div class="time">Début&nbsp;:&nbsp;${StartTime.toLocaleString()} </div> ${/if}' +
        //         '${if (Statut === 3 || AzaIsPere ) }<div class="time">Fin&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;${EndTime.toLocaleString()} </div> ${/if}' +
        //         '${if (!AzaIsPere && Statut !== 3 &&   isTempsReel === 0  ) }<div class="time">Début Réel&nbsp;:&nbsp; ${DateDebutReel.toLocaleString()} </div> ${/if}' + //la date valide
        //         '${if (!AzaIsPere && Statut !== 3 && Statut !== 2 && Statut !== 5 && isTempsReel === 0  ) }<div class="time">Fin Réel&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp; ${ DateFinReel.toLocaleString()} </div> ${/if}' +
        //         '${if (!AzaIsPere && isTempsReel === 1 ) }<div class="time">Retour Opérateur : &nbsp; ${Commentaire_Planning} <br>  Coordinateur: &nbsp; ${coordinateurCreate} <br>   Début théorique &nbsp;:&nbsp; ${DateDebutTheo.toLocaleString()} <br>Fin théorique &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp; ${DateFinTheo.toLocaleString()}  </div>  ${/if} </div></div> ';

        // }
    }

    public workOrderToBacklog = []
    getWorkOrderByidGroup(idGroup) {
        console.log("++++++++++++++++++++++", this.workOrderData);
        this.workOrderData = [];
        this.workorderService
            .getWorkOrderByidGroup(idGroup)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(donnees => {
                this.WorkOrderByidgroup = donnees; //donnees brute en backlog
                console.log("donnee backlog", donnees)
                console.log('getWorkOrderByidgroup', this.WorkOrderByidgroup);
                let worKorderByidGroupSort = []
                this.WorkOrderByidgroup.map(item => {
                    if (item.UserEnvoi === this.itemCoordinateur.Username) {
                        worKorderByidGroupSort.unshift(item)
                    } else {
                        worKorderByidGroupSort.push(item)
                    }
                })
                console.log("workorder backlog sort ", worKorderByidGroupSort)
                this.WorkOrderByidgroup = worKorderByidGroupSort
                console.log(this.WorkOrderByidgroup)
                if (this.WorkOrderByidgroup != []) {

                    this.WorkOrderByidgroup.map(workOrder => {
                        console.log('workorder to map : ', workOrder)
                        let StartTime = moment(workOrder.DateDebutTheo, moment.defaultFormat).toDate(),
                            EndTime = moment(workOrder.DateFinTheo, moment.defaultFormat).toDate();
                        let dateDebut = StartTime,
                            dateFin = EndTime,
                            libelleStatut
                        this.statutWorkorder.map(item => {
                            if (workOrder.Statut === item["Code"]) {
                                libelleStatut = item["libelleStatut"]
                            }
                        })

                        // 
                        let WorkorderBacklog = {
                            Id: workOrder.Id_Planning_Events,
                            Name: workOrder.titreoeuvre,
                            StartTime: dateDebut,
                            EndTime: dateFin,
                            CodeRessourceSalle: workOrder.CodeRessourceSalle,
                            Container: false,
                            numGroup: workOrder.Id_Planning_Events,
                            Description: workOrder.Commentaire_Planning,
                            Operateur: workOrder.UserMaj,
                            coordinateurCreate: workOrder.UserEnvoi,
                            Statut: workOrder.Statut,
                            AzaIsPere: false,
                            AzaNumGroupe: workOrder.Id_Planning_Events,
                            DepartmentID: workOrder.CodeRessourceSalle,
                            ConsultantID: 2,
                            DepartmentName: '',
                            IsAllDay: false,
                            libchaine: workOrder.libchaine,
                            typetravail: workOrder.typetravail,
                            titreoeuvre: workOrder.titreoeuvre,
                            numepisode: workOrder.numepisode,
                            dureecommerciale: workOrder.dureecommerciale,
                            libtypeWO: workOrder.libtypeWO,
                            Commentaire_Planning: workOrder.Commentaire_Planning,
                            Commentaire_Planning_rtf:workOrder.Commentaire_Planning,
                            IdGenerationWO: workOrder.IdGenerationWO,
                            isTempsReel: 0,
                            IsReadonly: false,
                            Id_Planning_Events_TempsReel: 0,
                            titreepisode: workOrder.titreepisode,
                            DateDebutReel: workOrder.DateDebutReel,
                            DateFinReel: workOrder.DateFinTheo,
                            libelleStatut: libelleStatut,
                            CodeRessourceCoordinateur: workOrder.CodeRessourceCoordinateur,
                            CodeRessourceOperateur:workOrder.CodeRessourceOperateur,
                            statut :  workOrder.Statut,
                            Commentaire: workOrder.Commentaire

                        };

                      
                        this.workOrderToBacklog.push(WorkorderBacklog)
                      
                    })

                    this.workOrderToBacklog=  this.workOrderToBacklog.sort((a,b)=>{
                        return  +a.Id - +b.Id
                    })
                    console.log(this.workOrderToBacklog)
                    let workorderBacklog =[]
                    for(let i =0 ; i<this.workOrderToBacklog.length ; i ++){
                        if(i  ==0){
                            if(this.workOrderToBacklog[i].coordinateurCreate != this.itemCoordinateur.Username){
                            workorderBacklog.push(this.workOrderToBacklog[i])
                        }else{
                            workorderBacklog.unshift(this.workOrderToBacklog[i])
                        }
                        }else{
                            if(this.workOrderToBacklog[i-1].Id != this.workOrderToBacklog[i].Id){
                                if(this.workOrderToBacklog[i].coordinateurCreate != this.itemCoordinateur.Username){
                                    workorderBacklog.push(this.workOrderToBacklog[i])
                                }else{
                                    workorderBacklog.unshift(this.workOrderToBacklog[i])
                                }
                            }
                        }
                    }
                    console.log(workorderBacklog)
                    this.workOrderToBacklog = workorderBacklog;
                    this.workOrderData = workorderBacklog;
                 
                 
                    this.field = {
                        dataSource: this.workOrderData,
                        id: 'Id',
                        text: 'Name',
                        description: 'Commentaire_Planning'

                    };
                    // this.treeObj.refresh();
                    console.log('workorder to backlog',this.workOrderToBacklog)
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
                libGroupe.map(donnees => {
                    this.libGroupe.push({
                        Libelle: donnees.Libelle,
                        Code: donnees.Code
                    })
                })
                this.libGroupe.push({ Libelle: "Mon Planning", Code: id })
            })
        this.fieldsPlanning = { text: 'Libelle', value: 'Code' }
        console.log('............................', this.libGroupe)
        console.log(this.idCoordinateur, '################################ ID')

    }
    getAllCoordinateurs() {
        this.coordinateurService
            .getAllCoordinateurs()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(res => {

                res.map(item => {
                    if (item.Groupe === this.currentCoordinateur.Groupe) {
                        this.coordinateurListeArray.push(item)

                    }
                })

            })


    }
    /*************************** DELETE **************************/

    public deleteContainerAction = false;
    deleteContainer(id, event) { // remise au backlog
        this.containersService.deleteContainer(id)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(res => {
                console.log('delete container with success : ', res);
                this.allDataContainers = this.allDataContainers.filter(container => container.Id_Planning_Container !== id);
                console.log('this.allDataContainers after delete container : ', this.allDataContainers);
                this.timelineResourceDataOut.forEach(item => {
                    if ((+event.AzaNumGroupe === +item.AzaNumGroupe) && !item.AzaIsPere && item.isTempsReel === 0) {
                        if (!this.field['dataSource'].includes(item)) {
                            this.updateWorkorderBackToBacklog(item, event);
                        }
                    }
                });
                this.timelineResourceDataOut = this.timelineResourceDataOut.filter(item => {
                    let workorderTempsReel, data
                    if (+event.AzaNumGroupe !== +item.AzaNumGroupe && item.isTempsReel === 0) {
                        data = item;
                    }
                    if (item.isTempsReel === 1) {
                        workorderTempsReel = item
                    }
                    return data + workorderTempsReel

                });
                console.log(this.timelineResourceDataOut)
                if(this.operateur.checked == true){
                    let containerWithoutOperateur = this.timelineResourceDataOut.filter(item =>item.Operateur == '' || item.Operateur == null )
                    console.log(containerWithoutOperateur,"containerWithoutOperateur & this.operateur.checked == true")
                    this.updateEventSetting(containerWithoutOperateur) 
                  }else{
                    this.updateEventSetting(this.timelineResourceDataOut) 
                  }
                this.disabledrefresh = false
                this.eventSelecte = [];
                // this.workorderSelected =[]
                this.numberContainerWithoutOperateur()
            }, error => {
                console.error('error for delete container request : ', error);
            }
            )
    }


    /************************************************************/
    /**************************** POST **************************/

    public createJustContainerAction:boolean = false;
 public provisionalTimelineDataOut
 public workorderMultiSelectArray:any =[]
 public splitContainerResult : any =[]
    postContainer(containerToCreate, event) {
        this.containersService.postContainer(containerToCreate)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(res => {
                console.log('succes post new container. RES : ', res);
                if (res) {
                    this.splitContainerResult = []
                    console.log('res from post => ', res);
                    this.allDataContainers.push(res);
                    event.Id = res.Id_Planning_Container; //data container for planner
                    event.AzaNumGroupe = res.Id_Planning_Container;
                    console.log(event)
                    console.log('event after post and update id')
                    containerToCreate.Id_Planning_Container = res.Id_Planning_Container;              //
                    let workorderEventToUpdate =  this.creationArray.filter(item => !item["AzaIsPere"] && item['isTempsReel'] === 0);
                    console.log('workorderEventToUpdate=> ', workorderEventToUpdate);
                    console.log('this.creationArray => ', this.creationArray);
                    console.log('event postContainer',event)
                    console.log('departement id',event.Id)
                    this.timelineResourceDataOut.push(event);
                    this.splitContainerResult.push(event)
                    if (workorderEventToUpdate.length > 0) {
                        this.createJustContainerAction = false;
                        if (workorderEventToUpdate.length == 1) {
                        workorderEventToUpdate.map(item => {
                            console.log(item, "===> item")  
                            let newItemWorkorderAfterEditorUpdate = {
                                Id: item.Id,
                                Name: item.titreoeuvre,
                                StartTime: event.StartTime, //modifier avec le horraires des workorders selectionnés
                                EndTime: event.EndTime,
                                IsAllDay: event.IsAllDay,
                                DepartmentID: event.DepartmentID,
                                ConsultantID: item.ConsultantID,
                                AzaIsPere: false,
                                AzaNumGroupe: res.Id_Planning_Container,
                                coordinateurCreate: item.coordinateurCreate,
                                Operateur: event.Operateur,
                                Statut: (item.Statut=== null || typeof (item.Statut) === 'undefined') ? 3 : item.Statut,
                                typetravail: item.typetravail,
                                titreoeuvre: (item.titreoeuvre === null || typeof (item.titreoeuvre) === 'undefined') ? '' : item.titreoeuvre,
                                numepisode: item.numepisode,
                                dureecommerciale: item.dureecommerciale,
                                libchaine: item.libchaine,
                                Commentaire_Planning: item.Commentaire_Planning,
                                Commentaire_Planning_rtf:item.Commentaire_Planning,
                                IdGenerationWO: item.IdGenerationWO,
                                libtypeWO: item.libtypeWO,
                                isTempsReel: 0,
                                IsReadonly: false,
                                Id_Planning_Events_TempsReel: 0,
                                titreepisode: item.titreepisode,
                                DateDebutReel: item.DateDebutReel,
                                DateFinReel: item.DateFinReel,
                                libelleStatut: item.libelleStatut,
                                CodeRessourceCoordinateur: event.CodeRessourceCoordinateur,
                                CodeRessourceOperateur:res.CodeRessourceOperateur,
                                isbacklog: 0,
                                Commentaire:item.Commentaire,

                            };
                            // this.updateWorkorderInDragDrop(newItemWorkorderAfterEditorUpdate, containerToCreate);
                           //ajout multiSelection
                           
                               console.log("creat one workorder")
                           this.updateWorkorderInDragDropAddToContainer(newItemWorkorderAfterEditorUpdate, containerToCreate);
                         } ) 
                        }
                         if (workorderEventToUpdate.length > 1) {
                            this.workorderMultiSelectArray.push(event)
                            workorderEventToUpdate.map(item =>{
                                   //item ==> workorder
                                   //event ==>container
                                   // containerToCreate ==> donnée brute du container
                                this.updateWorkOrderMultiselect(item, event, containerToCreate)
                            })


                               
                       }
                         
                            // console.log('new workorder from post container function: ', newArrayOfWorkordersAfterEditorUpdate);
                            // console.log('startTime new workorder from post container function: ',  newItemWorkorderAfterEditorUpdate.StartTime)
                            // console.log('endtime new workorder from post container function: ',  newItemWorkorderAfterEditorUpdate.EndTime)
                  
                     }else{
                   if(this.eventsSelect != null){
                         if(this.eventsSelect.length>0){ //les élément pour le split
                            this.splitContainer()
                         }
                     }
                
                    }
                       
                    console.log(this.timelineResourceDataOut, 'timelineResourceDataOut');
                    // this.createTooltipWorkorder();
                    this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                        dataSource: <Object[]>extend(
                            [], this.timelineResourceDataOut, null, true
                        ),
                        // enableTooltip: true, tooltipTemplate: this.temp
                    };
                    this.creationArray = [];
                    this.disabledrefresh = false
                    this.openEditor = false
                    this.startResize = false
                    this.numberContainerWithoutOperateur()
                    setTimeout(() => {
                        if (this.searchString != undefined) {
                            console.log('drag & drop')
                            this.searchwo.value = this.searchString
                            this.onFilter(this.searchwo.value, 0, this.argsKeyboardEvent)
                        } else {
                        }   
                    }, 25);
                }
            },
                error => {
                    console.log('ERROR POST CONTAINER !!', error);
                    swal({
                        title: 'Attention',
                        html: 'La création est impossible car l\'emplacement est occupé par un autre container  ',
                        showCancelButton: true,
                        confirmButtonText: 'Rafraichir',
                        cancelButtonText: 'Annuler',
                        allowOutsideClick: false
                    }).then((refresh) => {
                        if (refresh.value) {
                            this.refreshScheduler()
                        } else {
                            console.log("click annuler")
                        }
                    });
                    this.openEditor = false

                    this.startResize = false
                }
            );
    }


      updateWorkOrderMultiselect(item,event,containerToCreate ){ //called when we selected +plusieurs workorder in backlog
      
            let newItemWorkorderAfterEditorUpdate = {
                Id: item.Id,
                Name: item.titreoeuvre,
                StartTime: event.StartTime,
                EndTime: event.EndTime,
                IsAllDay: item.IsAllDay,
                DepartmentID: event.DepartmentID,
                ConsultantID: item.ConsultantID,
                AzaIsPere: false,
                AzaNumGroupe: event.Id,
                coordinateurCreate: item.coordinateurCreate,
                Operateur: item.Operateur,
                Statut: (item.Statut=== null || typeof (item.Statut) === 'undefined') ? 3 : item.Statut,
                typetravail: item.typetravail,
                titreoeuvre: (item.titreoeuvre === null || typeof (item.titreoeuvre) === 'undefined') ? '' : item.titreoeuvre,
                numepisode: item.numepisode,
                dureecommerciale: item.dureecommerciale,
                libchaine: item.libchaine,
                Commentaire_Planning: item.Commentaire_Planning,
                Commentaire_Planning_rtf:item.Commentaire_Planning,
                IdGenerationWO: item.IdGenerationWO,
                libtypeWO: item.libtypeWO,
                isTempsReel: 0,
                IsReadonly: false,
                Id_Planning_Events_TempsReel: 0,
                titreepisode: item.titreepisode,
                DateDebutReel: item.DateDebutReel,
                DateFinReel: item.DateFinReel,
                libelleStatut: item.libelleStatut,
                CodeRessourceCoordinateur: event.CodeRessourceCoordinateur,
                CodeRessourceOperateur:event.CodeRessourceOperateur,
                isbacklog: 0,
                Commentaire: item.Commentaire

            };
            console.log(newItemWorkorderAfterEditorUpdate,"newItemWorkorderAfterEditorUpdate")
         
            this.timelineResourceDataOut.push(newItemWorkorderAfterEditorUpdate)
            //  console.log(this.workorderMultiSelectArray)

             let itemSelected =   this.timelineResourceDataOut.filter(item =>item.Id == newItemWorkorderAfterEditorUpdate.Id )

           let  workOrderMultiSelect = this.calculPrevisonalDateGroup(
            this.timelineResourceDataOut,
                    itemSelected[0].AzaNumGroupe,
                    true,
                    itemSelected[0],
                 
                );
            // workOrderMultiSelect = workOrderMultiSelect.filter(item => !item["AzaIsPere"])
                // console.log(workOrderMultiSelect)
                let newItem = workOrderMultiSelect.filter(item=> item["Id"] ===newItemWorkorderAfterEditorUpdate.Id ) //workorder en cours apres le calcule
                console.log(newItem,"new item apres le calcule")
                let workorderSelectedBrute
                workorderSelectedBrute   =  this.WorkOrderByidgroup.filter(item => item.Id_Planning_Events === newItemWorkorderAfterEditorUpdate.Id); // workorder brute en cours apres le calcule
                if(workorderSelectedBrute.length == 0){
                    workorderSelectedBrute = this.allDataWorkorders.filter(item => item.Id_Planning_Events === newItemWorkorderAfterEditorUpdate.Id);
                }
                console.log(workorderSelectedBrute)
                setTimeout(() => {
                    
                    let startTime = moment(newItem[0]["StartTime"]).format('YYYY-MM-DDTHH:mm:ss');
                    let endTime = moment(newItem[0]["EndTime"]).format('YYYY-MM-DDTHH:mm:ss');
                    console.log(startTime, "startTime")
                    console.log(endTime, "endTime")

                    if(workorderSelectedBrute[0].Id_Planning_Events === newItemWorkorderAfterEditorUpdate.Id){
                        console.log("donnée brute du workordersélectionné")
                    workorderSelectedBrute[0].DateDebutTheo = startTime;
                    workorderSelectedBrute[0].DateFinTheo = endTime;
                    workorderSelectedBrute[0].CodeRessourceSalle = newItem[0]["DepartmentID"]
                    workorderSelectedBrute[0].Id_Planning_Container = newItem[0]["AzaNumGroupe"]
                    workorderSelectedBrute[0].Statut = newItem[0]["Statut "] || 3
                    workorderSelectedBrute[0].statut = newItem[0]["Statut "] 
                    workorderSelectedBrute[0].isbacklog = 0
                    workorderSelectedBrute[0].CodeRessourceOperateur = newItem[0]["CodeRessourceOperateur"]
                    //    this.allDataWorkorders.push( workorderSelectedBrute[0])
                      
                    //    this.WorkOrderByidgroup.push(workorderSelectedBrute[0]);
                       console.log(this.WorkOrderByidgroup)
                    console.log(workorderSelectedBrute[0],"new workorder backlog brut")
                    console.log(newItem ,"new Item backlog")
              
                    // this.timelineResourceDataOut
                    this.putWorkorderWithCalcul( workorderSelectedBrute[0], newItem[0], containerToCreate, workOrderMultiSelect,false) 
                }
                }, 100);
                   
                
                
                // console.log(    this.allDataWorkorders)
            // this.updateWorkorderInDragDropAddToContainer(newItem[0], containerToCreate);
            // this.updateStartTimeAndEndTimeWorkorder(newItem[0],containerToCreate,this.workorderMultiSelectArray,newItem[0]["StartTime"],newItem[0]["EndTime"] ); 
            

      }
    createContainer(event,codeRessourceOperateur) {
        console.log(event);
        console.log('this.creationArray', this.creationArray);
        let now = moment().format('YYYY-MM-DDTHH:mm:ss');
        let startTime = moment(event.StartTime).format('YYYY-MM-DDTHH:mm:ss');
        let endTime = moment(event.EndTime).format('YYYY-MM-DDTHH:mm:ss');
        console.log('startTime : ', startTime);
        console.log('endTime : ', endTime);
        console.log('now : ', now);
        // let codeRessourceOperateur;
        let libelleRessourceSalle;
        let codeRessourceSalle;
        // let codeRessourceCoordinateur = this.currentCoordinateur.CodeRessource;
        let codeRessourceCoordinateur = this.currentCoordinateur.IdCoord;
        let libelleRessourceCoordinateur = this.user.shortUserName;
    
        console.log(codeRessourceOperateur)
        this.departmentDataSource.map(item => {
            if (item['Id'] === event.DepartmentID) {
                libelleRessourceSalle = item['Text'];
                codeRessourceSalle = item['codeRessource'];
            }
        });
        console.log(libelleRessourceSalle, "===>", codeRessourceSalle)
        console.log(event.Name)
        let newContainer = {
            Id_Planning_Container: 0,
            UserEnvoi: this.user.shortUserName,
            DateEnvoi: now,
            Titre: (event.Name == null || typeof (event.Name) == 'undefined') ? 'Titre' : event.Name  , // (aucun titre) 
            CodeRessourceOperateur: codeRessourceOperateur,
            LibelleRessourceOperateur: event.Operateur,
            CodeRessourceCoordinateur: codeRessourceCoordinateur,
            LibelleRessourceCoordinateur: libelleRessourceCoordinateur,
         
            DateSoumission: null,
            DateDebut: startTime,
            DateFin: endTime,
            DateDebutTheo: startTime,
            DateFinTheo: endTime,
            CodeRessourceSalle: event.DepartmentID,
            LibelleRessourceSalle: libelleRessourceSalle,
            Commentaire: event.Commentaire,
            Commentaire_Planning: event.Commentaire_Planning,
            DateMaj: now,
            UserMaj: libelleRessourceCoordinateur,
            PlanningEventsList: null,
            isTempsReel: 0,

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
        console.log('this.allDataWorkorders ==> ', this.allDataWorkorders);
        console.log('this.allDataContainers ==> ', this.allDataContainers);
        console.log('update container args ==> ', args);
        this.updateContainerAction = true;
       console.log(this.clickDrop) 
    let chekIfContainerExist = this.timelineResourceDataOut.filter(item =>{ 
        if(item.Id === args.Id) {
            return item
        }
    
    })

    console.log(chekIfContainerExist,"chekIfContainerExist")
        if(chekIfContainerExist.length == 0 && this.clickDrop){  //si le container args n'existe pas dans timelineResourceDataOut et que j'ai cliqué sur déposer

            this.containerSelected.map(item=>{
                if(item.Id === args.Id){
                this.timelineResourceDataOut.push(item)
         
        }
            })

            console.log(this.workorderSelected)
            if (this.workorderSelected.length>0){
          let workorders = this.workorderSelected.filter(workorder => workorder.AzaNumGroupe == args.Id)
       console.log(workorders)
       if(workorders.length != 0){
        workorders.map(itemWo =>{
         
            if(itemWo.AzaNumGroupe === args.Id){
                this.timelineResourceDataOut.push(itemWo)
            }
        })
       }
    }
           console.log( this.timelineResourceDataOut," this.timelineResourceDataOut")
           console.log(this.containerBrutSelected);
           console.log(this.workorderbrutSelected)
           this.containerBrutSelected.map(item =>{
            if(item.Id_Planning_Container === args.Id){
            this.allDataContainers.push(item)}
           })
           this.workorderbrutSelected.map(item =>{
            if(item.Id_Planning_Container === args.Id){
            this.allDataWorkorders.push(item)}
           })
        }
        console.log(this.containerBrutSelected);
        console.log(this.allDataContainers)
        console.log('update container function');
        let now = moment().format('YYYY-MM-DDTHH:mm:ss');
        args['Operateur'] = args['Operateur'] === 'Aucun Opérateur' ? '' : args['Operateur'];
        let event = args; //args == data
        console.log(event, 'event container')
        let oldEvent = this.timelineResourceDataOut.filter(item => item.Id === event.Id);
        console.log('old Event container :', oldEvent);
        //   let containerResult = this.timelineResourceDataOut.filter(item => item.Id === event.Id && item.AzaIsPere);
        let containerResult = this.allDataContainers.filter(item => item.Id_Planning_Container === event.Id);
        // console.log(containerResult1)
        console.log("container result", containerResult[0])
        let container = containerResult[0];
        console.log(container, 'event container') //donnée brute
        let startTime = moment(event.StartTime).format('YYYY-MM-DDTHH:mm:ss');
        let endTime = moment(event.EndTime).format('YYYY-MM-DDTHH:mm:ss');
        let userEnvoi = this.coordinateurListeArray.filter(item => item.Username === containerResult[0].UserMaj)
        console.log(userEnvoi)
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
                console.log('event libelle salle => ', item['Text']);
                libelleRessourceSalle = item['Text'];
                codeRessourceSalle = item['codeRessource'];
            }
        });
        console.log(this.currentCoordinateur.IdCoord, "codeRessourceCoordinateur container")
        console.log(event, "event")
        if (typeof (container) != 'undefined') {
            let newContainer = {
                Id_Planning_Container: container.Id_Planning_Container,
                UserEnvoi: container.UserEnvoi,
                DateEnvoi: container.DateEnvoi,
                Titre: event.Name || event.Subject,
                CodeRessourceOperateur: codeRessourceOperateur,
                LibelleRessourceOperateur: event.Operateur,
                CodeRessourceCoordinateur: this.currentCoordinateur.IdCoord,// a changer
                LibelleRessourceCoordinateur: container.libelleRessourceCoordinateur,
                DateSoumission: null,
                DateDebut: event.DateDebut,
                DateFin: event.DateFin,
                DateDebutTheo: startTime,
                DateFinTheo: endTime,
                CodeRessourceSalle: codeRessourceSalle,
                LibelleRessourceSalle: libelleRessourceSalle,
                Commentaire: container.Commentaire,
                Commentaire_Planning: event.Commentaire_Planning || event.Description,
                DateMaj: now,
                UserMaj: this.user.shortUserName,
                PlanningEventsList: null,
                DepartmentID: codeRessourceSalle,
                IsReadonly: false,
                isTempsReel: 0,
            };
            console.log("new Container ==>", newContainer)

            this.putContainer(newContainer.Id_Planning_Container, newContainer, event);
          
            console.log(this.clickDrop)
        }
    }

    putContainer(id, container, event) { // call in resize, deplacement and Editor (call in updateContainer() function )
        // this.scheduleObj.readonly = true


        this.containersService.updateContainerPromise(id, container)
            //   .pipe(takeUntil(this.onDestroy$))
            //   .subscribe(res => {
            .then(res => {
                if (!res["error"]) {
                    console.log('succes update container. RES : ', res);
                    console.log(this.allDataContainers, 'allDataContainers')
                    let startDifferent = this.checkDiffExistById(event, this.timelineResourceDataOut, 'StartTime', 'StartTime');
                    let endDifferent = this.checkDiffExistById(event, this.timelineResourceDataOut, 'EndTime', 'EndTime');
                    // this.timelineResourceDataOut = this.eventSettings.dataSource as Object[]; // refresh dataSource
                    console.log('this.timelineResourceDataOut : ', this.timelineResourceDataOut);
                    this.timelineResourceDataOut.map(item => {
                        if (item.Id === event.Id && item.AzaIsPere) {
                            console.log('event container to update => ', item);
                            item.Name = event.Name;
                            item.StartTime = event.StartTime;
                            item.EndTime = event.EndTime;
                            item.IsAllDay = event.IsAllDay;
                            item.DepartmentID = container.DepartmentID;
                            item.ConsultantID = event.ConsultantID;
                            item.AzaIsPere = true;
                            item.AzaNumGroupe = event.AzaNumGroupe;
                            item.coordinateurCreate = event.coordinateurCreate;
                            item.Operateur = event.Operateur;
                            item.Commentaire = event.Commentaire
                            item.Commentaire_Planning = event.Commentaire_Planning;
                            item.CodeRessourceCoordinateur = event.CodeRessourceCoordinateur;
                            item.CodeRessourceOperateur = container.CodeRessourceOperateur;
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
                    let workorderEventToUpdate = this.timelineResourceDataOut.filter(item => item.AzaNumGroupe === id && !item.AzaIsPere && item.isTempsReel === 0);
                    //   this.allDataWorkorders.filter(item => item.Id_Planning_Container === id  && item.Id_Planning_Events_TempsReel===0);
                    console.log(workorderEventToUpdate)
                    console.log(this.allDataWorkorders)
                    console.log(this.timelineResourceDataOut)
                    this.numberContainerWithoutOperateur()
                    if (workorderEventToUpdate.length > 0) {
                        console.log(workorderEventToUpdate)
                        this.updateWorkorderInContainerUpdate(id, container, event);       
                    }else{
                        this.DropEventWithNavigation = false;
                        this.disabledrefresh = false;
                        this.startResize = false;
                        this.openEditor = false;
                 
                        this.eventSelected =[];
                        this.workorderSelected = [];
                    }

                    
                    this.eventSettings = {
                        dataSource: <Object[]>extend(
                            [], this.timelineResourceDataOut, null, true
                        ),
                        // enableTooltip: true, tooltipTemplate: this.temp
                    };                 
                    if(this.clickDrop){
                        this.containerSelected = [];
                        this.clickDrop = false
                        }                   
                } else
                    if (res["error"]) {
                        console.log('error updatecontainer');
                        this.disabledrefresh = false
                        this.openEditor = false
                        this.startResize = false
                        this.eventSelected =[];
                        this.workorderSelected = []
                        //   this.scheduleObj.readonly = false
                        swal({
                            title: 'Attention',
                            html: 'Le déplacement est impossible car l\'emplacement est occupé par un autre container.',
                            showCancelButton: false,
                            confirmButtonText: 'Fermer',
                            cancelButtonText: 'Annuler',
                            allowOutsideClick: false
                        }).then((refresh) => {
                            if (refresh.value) {
                                this.refreshScheduler()
                            } else {
                                console.log("click annuler")
                            }
                            console.log(" ok ")
                            this.eventSettings = {
                                // enableTooltip: true, tooltipTemplate: this.temp
                            };
                        });



                        // this.DropEventWithNavigation = false

                        this.eventSettings = {
                            enableTooltip: false //disable tooltip
                        };
                    }
                }
            )

    }


    /**** PUT CONTAINER WITH OPERATEUR DRAG AND DROP ****/

    updateContainerFromDragDropOperateur(operateurObject, dragDropEvent) {
        console.log('updateContainer from drag and drop ', dragDropEvent.target.id);
       
            let indexContainerEvent = this.findIndexEventById(dragDropEvent.target.id);
            console.log(indexContainerEvent, "indexContainerEvent ===> ")
            if (indexContainerEvent != null) {
                let containerId = this.timelineResourceDataOut[indexContainerEvent]['Id']
                let containerEvent = this.timelineResourceDataOut[indexContainerEvent];
                console.log(containerEvent, "containerEvent ===> ")
              
                let arrayContainerResult = this.allDataContainers.filter(item => item.Id_Planning_Container === containerId);
                let containerResult = arrayContainerResult[0];
                containerResult.LibelleRessourceOperateur = operateurObject.Username;
                console.log(containerResult.LibelleRessourceOperateur)
                containerResult.CodeRessourceOperateur = operateurObject.CodeRessource;
                console.log(containerResult.CodeRessourceOperateur)
                let id = containerResult.Id_Planning_Container;
                this.putContainerFromDragDropOperateur(id, containerResult, indexContainerEvent, operateurObject, containerEvent);
        }

    }
    putContainerFromDragDropOperateur(id, container, indexContainerEvent, operateurObject, containerEvent) { 
        if (!this.checkIfContainerHasATempsReel(containerEvent,id)) {
        this.containersService.updateContainerPromise(id, container)
            //   .pipe(takeUntil(this.onDestroy$))
            //   .subscribe(res => {
            .then(res => {
                if (!res["error"]) {
                    console.log('succes update container. RES : ', res);
                    this.timelineResourceDataOut[indexContainerEvent]['Operateur'] = operateurObject.Username;
                  
                    this.timelineResourceDataOut[indexContainerEvent]['CodeRessourceOperateur'] = operateurObject.CodeRessource;
                    //   let workorderEventToUpdate = this.timelineResourceDataOut.filter(item => item.AzaNumGroupe === id && !item.AzaIsPere && item.isTempsReel===0);
                    let Operateur = operateurObject.Username;
                    this.updateWorkorderInContainerUpdate(id, container, containerEvent, Operateur);    
                   

                    this.numberContainerWithoutOperateur()
                      if(this.operateur.checked == true){
                        let containerWithoutOperateur = this.timelineResourceDataOut.filter(item =>item.Operateur == '' || item.Operateur == null )
                        console.log(containerWithoutOperateur,"containerWithoutOperateur & this.operateur.checked == true")
                        this.updateEventSetting(containerWithoutOperateur) 
                      }else{
                        this.updateEventSetting(this.timelineResourceDataOut) 
                      }
                } else
                    if (res["error"]) {
                        console.error('error updatecontainer');
                        swal({
                            title: 'Attention',
                            text: 'Erreur dans la mise à jour du container lors du drag & drop' + 'd\'un opérateur',
                            showCancelButton: false,
                            confirmButtonText: 'Fermer',
                            allowOutsideClick: false

                        })

                    }
            }, error => {
                console.error('error updatecontainer', error);
                swal({
                    title: 'Attention',
                    text: 'Erreur dans la mise à jour du container lors du drag & drop' + 'd\'un opérateur',
                    showCancelButton: false,
                    confirmButtonText: 'Fermer',
                    allowOutsideClick: false

                })
            }
            )
        } else {
            this.dialogRefresh()
        }
    }



    /*************************************************** WORKORDER ****************************************************/

    /*** PUT WORKORDER IN CONTAINER UPDATE ***/

    updateWorkorderInContainerUpdate(id, container, event, Operateur?) { // RESIZE AND EDITOR
        console.log('update workorer ! ==> id ==> ', id);
        console.log('update workorer ! ==> container ==> ', container);
        console.log('update workorer ! ==> event ==> ', event);
        // AJOUTER ICI UNE CONDITION SI DATE ACTIVE EST DIFFERENTE DE CELLE PRECEDENTE :
        // FILTRER ALORS SUR ANCIEN TIMELINEDATAOUT
        // console.log('this.lastTimelineResourceDataOut ===> ', this.lastTimelineResourceDataOut);
        console.log('this.startofDay ==> ', this.startofDay);
        // this.startofDay = moment(newStartOfDay).toDate();
        // if (this.scheduleObj['activeView'].renderDates[0] === container.st )
        let timelineDataOut = this.timelineResourceDataOut;
        let workorderEventToUpdate = this.timelineResourceDataOut.filter(item => item.AzaNumGroupe === id && !item.AzaIsPere && item.isTempsReel === 0);
        // let workorderFromLastTime = this.lastTimelineResourceDataOut.filter(item => item.AzaNumGroupe === id && !item.AzaIsPere && item.isTempsReel === 0);
        console.log('workorderEventToUpdate => ', workorderEventToUpdate);     
        let numberOfWorkorder = workorderEventToUpdate.length;
        // if (workorderEventToUpdate.length > 0) {
            // this.createJustContainerAction = false;
            workorderEventToUpdate.map(item => {

                this.putWorkorderFromUpdateContainer(id, container, event, item, Operateur);
            });
           
        // } else {
        //     this.disabledrefresh = false
        //     this.fincalculDateGroup = false
        //     this.openEditor = false
        //     this.startResize = false
        //     console.log("container without workorder")
        //     //   this.scheduleObj.readonly = false
        //     this.DropEventWithNavigation = false
        // }
    }

    putWorkorderFromUpdateContainer(id, container, eventContainer, eventWorkorder, Operateur?) { // RESIZE AND EDITOR

        let now = moment().format('YYYY-MM-DDTHH:mm:ss');

        let workorderResult = this.allDataWorkorders.filter(item => item.Id_Planning_Events === eventWorkorder.Id);
        //    // le allDataWorkorders change de valeur 
        let workorderSelected = workorderResult[0];
        console.log("allDataWorkorders =>", this.allDataWorkorders)
        console.log("workorderResult =>", workorderResult)
        console.log("eventWorkorder =>", eventWorkorder)
        console.log('workorderSelected => ', workorderSelected);
        console.log('Container ==>',container)
        let startTime = moment(eventWorkorder.StartTime).format('YYYY-MM-DDTHH:mm:ss');
        let endTime = moment(eventWorkorder.EndTime).format('YYYY-MM-DDTHH:mm:ss');
        let newWorkorder = {
            Id_Planning_Events: workorderSelected.Id_Planning_Events,
            Iddetail: workorderSelected.Iddetail,
            IdTypeWO: workorderSelected.IdTypeWO,
            UserEnvoi: workorderSelected.UserEnvoi,
            DateEnvoi: workorderSelected.DateEnvoi,
            CodeRessourceOperateur: container.CodeRessourceOperateur, // voir ou et si on récupère la donnée par la suite
            LibelleRessourceOperateur: container.LibelleRessourceOperateur,
            Operateur: container.LibelleRessourceOperateur,
            CodeRessourceCoordinateur: workorderSelected.CodeRessourceCoordinateur,
            LibelleRessourceCoordinateur: workorderSelected.LibelleRessourceCoordinateur,
            DateSoumission: workorderSelected.DateSoumission,
            DateDebut: workorderSelected.DateDebut, // changement pour Remy
            DateFin: workorderSelected.DateFin, // changement pour Remy
            DateDebutTheo: startTime,
            DateFinTheo: endTime,
            CodeRessourceSalle: container.CodeRessourceSalle,
            DepartmentID: container.CodeRessourceSalle,
            Commentaire: eventWorkorder.Commentaire,
            Support1Cree: null,
            Support2Cree: null,
            MustWaitFor: null,
            Statut: workorderSelected.Statut,
            idplanningprec: null,
            Regroup: null,
            Commentaire_Planning: eventWorkorder.Commentaire_Planning,
            Commentaire_Planning_rtf:eventWorkorder.Commentaire_Planning,
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
            idwoprec: workorderSelected.idwoprec,
            isTempsReel: 0,
            IsReadonly: false,
            Id_Planning_Events_TempsReel: 0,
            titreepisode: workorderSelected.titreepisode,
            DateDebutReel: workorderSelected.DateDebutReel,
            DateFinReel: workorderSelected.DateFinTheo,
            libelleStatut: workorderSelected.libelleStatut,

        }
        console.log("newWorkorder => ", newWorkorder);


        this.workorderService
            .updateWorkOrderPromise(newWorkorder.Id_Planning_Events, newWorkorder)
            //   .pipe(takeUntil(this.onDestroy$))
            //   .subscribe(res => {
            .then(res => {
                if (!res["error"]) {
                    console.log('update workorder with success : ', res);
                    // console.log(this.allDataWorkorders); // all brut workorder data in backlog
                    // LUNDI ====> AJOUTER UN REFRESH DES EVENEMENTS !!!!!!!!!!

                    this.timelineResourceDataOut.map(item => {
                        if (item.Id === newWorkorder.Id_Planning_Events) {
                            item.Operateur = Operateur;
                            item.CodeRessourceOperateur = newWorkorder.CodeRessourceOperateur
                        }
                    })
                    //   this.allDataWorkorders.push(newWorkorder);

                    this.allDataWorkorders.map(item => {

                        if (item.Id_Planning_Events === newWorkorder.Id_Planning_Events) {

                            item.Id_Planning_Events = workorderSelected.Id_Planning_Events,
                                item.Iddetail = workorderSelected.Iddetail,
                                item.IdTypeWO = workorderSelected.IdTypeWO,
                                item.UserEnvoi = workorderSelected.UserEnvoi,
                                item.DateEnvoi = workorderSelected.DateEnvoi,
                                item.CodeRessourceOperateur = container.CodeRessourceOperateur,
                                item.LibelleRessourceOperateur = container.LibelleRessourceOperateur,
                                item.Operateur = container.LibelleRessourceOperateur,
                                item.CodeRessourceCoordinateur = workorderSelected.CodeRessourceCoordinateur,
                                item.LibelleRessourceCoordinateur = workorderSelected.LibelleRessourceCoordinateur,
                                item.DateSoumission = workorderSelected.DateSoumission,
                                item.DateDebut = workorderSelected.DateDebut,
                                item.DateFin = workorderSelected.DateFin,
                                item.DateDebutTheo = startTime,
                                item.DateFinTheo = endTime,
                                item.CodeRessourceSalle = container.CodeRessourceSalle,
                                item.DepartmentID = container.CodeRessourceSalle,
                                item.Commentaire = workorderSelected.Commentaire,
                                item.Support1Cree = null,
                                item.Support2Cree = null,
                                item.MustWaitFor = null,
                                item.Statut = workorderSelected.Statut,
                                item.idplanningprec = null,
                                item.Regroup = null,
                                item.Commentaire_Planning = eventWorkorder.Commentaire_Planning,
                                item.Commentaire_Planning_rtf= eventWorkorder.Commentaire_Planning,
                                item.DateMaj = now,
                                item.UserMaj = this.user.shortUserName,
                                item.Id_Planning_Container = container.Id_Planning_Container,
                                item.isbacklog = 0,
                                item.libchaine = workorderSelected.libchaine,
                                item.typetravail = workorderSelected.typetravail,
                                item.titreoeuvre = (workorderSelected.titreoeuvre === null || typeof (workorderSelected.titreoeuvre) === 'undefined') ? '' : workorderSelected.titreoeuvre,
                                item.numepisode = workorderSelected.numepisode,
                                item.dureecommerciale = workorderSelected.dureecommerciale,
                                item.libtypeWO = workorderSelected.libtypeWO,
                                item.IdGenerationWO = workorderSelected.IdGenerationWO,
                                item.debut = workorderSelected.debut,
                                item.fin = workorderSelected.fin,
                                item.dureeestime = workorderSelected.dureeestime,
                                item.idwoprec = workorderSelected.idwoprec,
                                item.isTempsReel = 0,
                                item.IsReadonly = false,
                                item.Id_Planning_Events_TempsReel = 0,
                                item.titreepisode = workorderSelected.titreepisode,
                                item.DateDebutReel = workorderSelected.DateDebutReel,
                                item.DateFinReel = workorderSelected.DateFinTheo,
                                item.libelleStatut = workorderSelected.libelleStatut

                        }
                    });
                    // console.log(this.allDataWorkorders);
                    // console.log('this.scheduleObj.getEvents() ==> ', this.scheduleObj.getEvents());
                   //07/11/2019

                    //   this.scheduleObj.dataBind();
                    //   dataSource: <Object[]>extend([], this.calculDateAll(this.data, true, null, false, false), null, true),
                    // console.log(this.eventSettings.dataSource);
                    // this.scheduleObj.refreshEvents()
                    if(this.operateur.checked == true){
                        let containerWithoutOperateur = this.timelineResourceDataOut.filter(item =>item.Operateur == '' || item.Operateur == null )
                        console.log(containerWithoutOperateur,"containerWithoutOperateur & this.operateur.checked == true")
                        this.updateEventSetting(containerWithoutOperateur) 
                      }else{
                        this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                            dataSource: <Object[]>extend(
                                [], this.timelineResourceDataOut, null, true
                            ),
                            // enableTooltip: true, tooltipTemplate: this.temp
                        };
                        this.updateEventSetting(this.timelineResourceDataOut) 
                      }
               
                    // this.updateEventSetting(this.timelineResourceDataOut)
                    this.disabledrefresh = false;
                    this.fincalculDateGroup = false;
                    this.openEditor = false;
                    this.startResize = false;
                    console.log(this.openEditor, "this.openEditor when update container")
                    this.DropEventWithNavigation = false;
               
                    setTimeout(() => {
                        if (this.searchString != undefined) {
                            console.log('drag & drop')
                            this.searchwo.value = this.searchString
                            this.onFilter(this.searchwo.value, 0, this.argsKeyboardEvent)
                        } else {
                        }   
                    }, 25);
                    // this.scheduleObj.saveEvent(eventWorkorder);   
                    this.eventSelected =[];
                        this.workorderSelected = []  
                  
                } else
                    if (res["error"]) {
                        console.error('error update workorder : ')
                        this.scheduleObj.eventSettings.dataSource = []
                        this.timelineResourceDataOut = []
                        this.departmentGroupDataSource = [];
                        swal({
                            title: 'Attention',
                            text: 'Impossible de superpositionner les workorders',
                            showCancelButton: false,
                            confirmButtonText: 'Fermer',
                            allowOutsideClick: false

                        }).then((Fermer) => {
                            console.log(Fermer)
                            this.scheduleObj.eventSettings.dataSource = []
                            this.departmentGroupDataSource = [];
                            if (Fermer.value) {
                                this.clicFermerOnActionComplete = true
                                this.refreshDate()
                                this.getSalleByGroup(this.groupCoordinateur, this.refreshDateStart, this.refreshDateEnd)

                            }
                        })
                        this.openEditor = false
                        this.startResize = false
                    

                        this.eventSelected =[];
                        this.workorderSelected = []
                    }
                //   this.scheduleObj.readonly = false
            }
            // , error => {
            //     // this.scheduleObj.readonly = false
            //     swal({
            //         title: 'Attention',
            //         text: 'Impossible de superpositionner les containers',
            //         showCancelButton: false,
            //         confirmButtonText: 'Fermer',
            //         allowOutsideClick: false

            //     }).then((Fermer) => {
            //         console.log(Fermer)
            //         this.scheduleObj.eventSettings.dataSource = []
            //         this.departmentGroupDataSource = [];
            //         if (Fermer.value) {
            //             this.clicFermerOnActionComplete = true
            //             this.refreshDate()
            //             this.getSalleByGroup(this.groupCoordinateur, this.refreshDateStart, this.refreshDateEnd)

            //         }
            //     })
            //     this.openEditor = false
            //     this.startResize = false
            //     console.error('error update workorder : ', error)
            // }
            );
    }

    /**** PUT WORKORDER IN DRAG AND DROP ****/

    updateWorkorderInDragDrop(event, containerParent) {
        console.log('event to workorder backlog => ', event); //data container
        console.log('containerParent to workorder backlog => ', containerParent); //data brut container
        let now = moment().format('YYYY-MM-DDTHH:mm:ss');
        let workorderResult = this.WorkOrderByidgroup.filter(item => item.Id_Planning_Events === event.Id);
        console.log('workorderResult', workorderResult)
        let workorderSelected = workorderResult[0];
        console.log('workorderSelected', workorderSelected);
        let startTime = moment(event.StartTime).format('YYYY-MM-DDTHH:mm:ss');
        let endTime = moment(event.EndTime).format('YYYY-MM-DDTHH:mm:ss');
        console.log(startTime,'startTime ==>');
        console.log(endTime,'endTime ==>');
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
        // let startDifferent = this.checkDiffExistById(event, this.timelineResourceDataOut, 'StartTime', 'StartTime');
        // let endDifferent = this.checkDiffExistById(event, this.timelineResourceDataOut, 'EndTime', 'EndTime');
      
        //  let calculegroup = this.calculDateGroup(
        //             this.timelineResourceDataOut,
        //             event.AzaNumGroupe,
        //             true,
        //            event,
        //             startDifferent,
        //             endDifferent
        //         )
        // console.log( calculegroup)
        // let workorderSelectedInBacklog
        //                  for(let i =0;i<calculegroup.length;i++){
        //                      if(calculegroup['Id'] === workorderSelected.Id_Planning_Events ){
        //                     workorderSelectedInBacklog = calculegroup[i]
        //                  }}
    //    console.log(workorderSelectedInBacklog,"**********")
        let newWorkorder = {
            Id_Planning_Events: workorderSelected.Id_Planning_Events,
            Iddetail: workorderSelected.Iddetail,
            IdTypeWO: workorderSelected.IdTypeWO,
            UserEnvoi: workorderSelected.UserEnvoi,
            DateEnvoi: workorderSelected.DateEnvoi,
            CodeRessourceOperateur: containerParent.CodeRessourceOperateur, 
            CodeRessourceCoordinateur: workorderSelected.CodeRessourceCoordinateur,
            DateSoumission: workorderSelected.DateSoumission,
            DateDebut: workorderSelected.DateDebut, 
            DateFin: workorderSelected.DateFin, 
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
            Commentaire_Planning_rtf:workorderSelected.Commentaire_Planning,
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
            DepartmentID: containerParent.codeRessourceSalle,
            // +
            debut: workorderSelected.debut,
            fin: workorderSelected.fin,
            dureeestime: workorderSelected.dureeestime,
            idwoprec: workorderSelected.idwoprec,
            isTempsReel: 0,
            IsReadonly: false,
            Id_Planning_Events_TempsReel: 0,
            Operateur: workorderSelected.LibelleRessourceOperateur,
            titreepisode: workorderSelected.titreepisode,
            DateDebutReel: workorderSelected.DateDebutReel,
            DateFinReel: workorderSelected.DateFinTheo,
            libelleStatut: workorderSelected.libelleStatut

        }
        console.log('workorder data selected', newWorkorder);
//  this.putWorkorderWithCalcul(newWorkorder,event,containerParent,this.timelineResourceDataOut,true)
        this.putWorkorder(newWorkorder.Id_Planning_Events, newWorkorder, event);
    }
// }

    putWorkorder(id, workorder, event) {
        this.workorderService
            .updateWorkOrderPromise(id, workorder)
            //   .pipe(takeUntil(this.onDestroy$))
            //   .subscribe(res => {
            .then(res => {
                console.log(res)
                

                if (!res["error"]) {
                    console.log('update workorder with success : ', res);
                    console.log(this.allDataWorkorders); // all brut workorder data in backlog
                    this.allDataWorkorders.push(workorder); // workorder: brut data
                    this.displayWorkorderInBacklogWorkorderData(event, 'delete')
                    this.timelineResourceDataOut.push(event);
                    // this.createTooltipWorkorder();
                    // this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                    //     dataSource: <Object[]>extend(
                    //         [], this.timelineResourceDataOut, null, true
                    //     ),
                    //     // enableTooltip: true, tooltipTemplate: this.temp
                    // };
                    this.WorkOrderByidgroup.push(workorder);
                    this.scheduleObj.refreshEvents()
                    this.disabledrefresh = false
                    let startDifferent = this.checkDiffExistById(event, this.timelineResourceDataOut, 'StartTime', 'StartTime');
                    let endDifferent = this.checkDiffExistById(event, this.timelineResourceDataOut, 'EndTime', 'EndTime');
                    this.eventSettings = {
                        dataSource: <Object[]>extend(
                            [],
                            this.calculDateGroup(
                                this.timelineResourceDataOut,
                                event.AzaNumGroupe,
                                true,
                               event,
                                startDifferent,
                                endDifferent
                            ),
                            null, true
                        ),
                        // enableTooltip: true, tooltipTemplate: this.temp
                    };
                    this.workorderSelectedInBacklog = []
                } else
                    if (res["error"]) {
                        swal({
                            title: 'Attention',
                            text: 'Erreur dans la mise à jour du workorder',
                            showCancelButton: false,
                            confirmButtonText: 'Fermer',
                            allowOutsideClick: false

                        })
                        console.error('error update workorder : ')
                        this.workorderSelectedInBacklog = []
                    }

            }
            
            );
    }

    displayWorkorderInBacklogWorkorderData(workoerderEvent, action: string) {
        // supprime workorder de la donnée du backlog (workorderData)
        console.log(workoerderEvent)
        console.log( this.workOrderData,'données backlog avant drag and drop')
        if (action === 'delete') {
            this.workOrderData = this.workOrderData.filter(item => item.Id !== workoerderEvent.Id);
            console.log( this.workOrderData,'données backlog apres drag and drop ')
            this.field = {
                dataSource: this.workOrderData,
                id: 'Id',
                text: 'Name',
                description: 'Commentaire_Planning'
            };
        } else if (action === 'add') {
            console.log('add');
        }
        

        console.log(this.field["dataSource"])
    }
public compt = 0
    updateWorkorderInDragDropAddToContainer(event, containerParent) { //event ==>workorder
        console.log('event to workorder backlog => ', event);
        console.log('containerParent to workorder backlog => ', containerParent);

        let now = moment().format('YYYY-MM-DDTHH:mm:ss');
        let workorderResult = this.WorkOrderByidgroup.filter(item => item.Id_Planning_Events === event.Id);
        let workorderSelected = workorderResult[0];
        
        let otherWorkorderExistForCOntainer;
        // if(this.workorderSelectedInBacklog.length == 0){
            console.log(this.timelineResourceDataOut)
        otherWorkorderExistForCOntainer = this.timelineResourceDataOut.filter(item => item.AzaNumGroupe === event.AzaNumGroupe && !item.AzaIsPere );
        //  }else{
        // otherWorkorderExistForCOntainer = this.workorderSelectedInBacklog
        //  }
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
            let checkIfCloture = false;
            otherWorkorderExistForCOntainer.map(item => {
                if (item.Statut != 3) {
                    checkIfCloture = true
                } else {
                    checkIfCloture = false
                }
            })
            console.log(checkIfCloture, "checkIfCloture")
            if (!checkIfCloture) {
                let startDifferent = this.checkDiffExistById(containerParent, this.timelineResourceDataOut, 'StartTime', 'StartTime');
                let endDifferent = this.checkDiffExistById(containerParent, this.timelineResourceDataOut, 'EndTime', 'EndTime');
                this.timelineResourceDataOut.push(event);

                let provisionalTimelineDataOut =  this.calculPrevisonalDateGroup(
                    this.timelineResourceDataOut,
                    event.AzaNumGroupe, true, event,
                 
                );
                console.log('provisionalTimelineDataOut => ', provisionalTimelineDataOut);
                console.log(event.Id);
                let eventNewDates = provisionalTimelineDataOut.filter(item => item['AzaNumGroupe'] === event.AzaNumGroupe && !item["AzaIsPere"] &&item['isTempsReel'] === 0);
                // eventNewDates =  eventNewDates.filter(item => item.Id == event.Id)
                console.log(eventNewDates);
             for (let i = 0; i < eventNewDates.length; i++) {
                    console.log(eventNewDates[i]);
                    this.updateStartTimeAndEndTimeWorkorder(eventNewDates[i], containerParent, provisionalTimelineDataOut); 
                    console.log(checkIfCloture, "checkIfCloture if")
                }
            } else {
                this.refreshWorkordersBacklog()
                console.log(checkIfCloture, "checkIfCloture else")
            }
            if (this.creationArray.length == 1) {
                this.creationArray.pop()

            }
       
        } else {
            console.log('NO otherWorkorderExistForCOntainer => ', otherWorkorderExistForCOntainer);
            // this.scheduleObj.eventSettings.tooltipTemplate = this.temp;
       
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
                Commentaire_Planning_rtf:workorderSelected.Commentaire_Planning,
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
                idwoprec: workorderSelected.idwoprec,
                isTempsReel: 0,
                IsReadonly: false,
                Id_Planning_Events_TempsReel: 0,
                titreepisode: workorderSelected.titreepisode,
                DateDebutReel: workorderSelected.DateDebutReel,
                DateFinReel: workorderSelected.DateFinReel,
                libelleStatut: workorderSelected.libelleStatut,
                coordinateurCreate: this.currentCoordinateur.Username
            }
            console.log('workorder data selected', newWorkorder);
         
            this.putWorkorderWithCalcul(newWorkorder, event, containerParent, this.timelineResourceDataOut, true);
    }
    
    }

    putWorkorderWithCalcul(newWorkorder, eventWorkorder, containerParent, timelineDataOut, pushEvent) {    
        this.workorderService
            .updateWorkOrderPromise(newWorkorder.Id_Planning_Events, newWorkorder)
            //   .pipe(takeUntil(this.onDestroy$))
            //   .subscribe(res => {
            .then(res => {
                if (!res["error"]) {
                    console.log('update workorder with success : ', res);
                    console.log(this.allDataWorkorders); // all brut workorder data in backlog
                    this.displayWorkorderInBacklogWorkorderData(eventWorkorder, 'delete');
                    console.log(containerParent,"container parant")
                    console.log( this.timelineResourceDataOut)
                    let containerEvent = this.timelineResourceDataOut.filter(item => item.Id === containerParent.Id_Planning_Container );
                    let containerPere = containerEvent[0];
                    console.log(containerPere)
                    this.allDataWorkorders.push(newWorkorder);
                    console.log('newWorkOerder ==========>',newWorkorder)
                    eventWorkorder.DepartmentID = newWorkorder.CodeRessourceSalle
                    console.log('eventWorkorder =================>', eventWorkorder);
                    if (pushEvent) {
                        this.timelineResourceDataOut.push(eventWorkorder);
                    }
                    let startDifferent = this.checkDiffExistById(containerPere, timelineDataOut, 'StartTime', 'StartTime');
                    let endDifferent = this.checkDiffExistById(containerPere, timelineDataOut, 'EndTime', 'EndTime');
                    console.log('update only group in timelinesDataOut',  this.allDataWorkorders);
                
                    console.log('this.timelineResourceDataOut after calcul workorder update => ', this.timelineResourceDataOut);
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
                        // enableTooltip: true, tooltipTemplate: this.temp
                    };
                        // this.eventSettings = {
                        //     dataSource: <Object[]>extend(
                        //         [],
                        //         this.calculDateGroup(
                        //             this.timelineResourceDataOut,
                        //             containerPere.Id_Planning_Container,
                        //             true,
                        //             containerPere,
                        //             startDifferent,
                        //             endDifferent
                        //         ),
                        //         null, true
                        //     ),
                        //     // enableTooltip: true, tooltipTemplate: this.temp
                        // };
                     
                        // enableTooltip: true, tooltipTemplate: this.temp
                        // this.updateEventSetting(this.timelineResourceDataOut)

                    this.disabledrefresh = false
                    if (this.creationArray.length == 1) {
                        this.creationArray.pop()

                    }
            //  this.creationArray = []
                    
                    this.workorderSelectedInBacklog = []
                    console.log(this.numberOfDeleteWorkOrder, this.eventSelecte.length,"LENGTH ====>" )
                //   if(this.workorderSelectedInBacklog.length == 0){
                //      console.log(this.timelineResourceDataOut) 
                    //   this.updateEventSetting(this.timelineResourceDataOut)
                //   }
                this.workorderMultiSelectArray= []
                    this.eventSelecte = [];
                    // this.workorderSelected =[]
                    setTimeout(() => {
                        if (this.searchString != undefined) {
                            console.log('drag & drop')
                            this.searchwo.value = this.searchString
                            this.onFilter(this.searchwo.value, 0, this.argsKeyboardEvent)
                        } else {
                        }   
                    }, 25);
                } else
                    if (res["error"]) {
                        swal({
                            title: 'Attention',
                            text: 'Erreur dans la mise à jour du workorder',
                            showCancelButton: false,
                            confirmButtonText: 'Fermer',
                            allowOutsideClick: false

                        })
                        console.error('error update workorder : ')
                        this.workorderSelectedInBacklog = []
                    }

            }
            ); 
    }

    updateStartTimeAndEndTimeWorkorder(event, containerParent, provisionalTimelineDataOut, StartTime?,EndTime?) {
        console.log(event);

        console.log("compt =========", this.compt)
        let workorder;
        let now = moment().format('YYYY-MM-DDTHH:mm:ss');
        let startTime = moment(event.StartTime).format('YYYY-MM-DDTHH:mm:ss');
        let endTime = moment(event.EndTime).format('YYYY-MM-DDTHH:mm:ss');
        console.log(startTime,"Start Time ======>>>>>>>",event.StartTime);
        console.log( endTime," endTime ===================>",event.EndTime)
        console.log('event ID ============> ', event.Id);
        console.log('this.allDataWorkorders -----> ', this.allDataWorkorders);
        console.log('this.WorkOrderByidgroup -----> ', this.WorkOrderByidgroup);
 

        // this.allDataWorkorders = this.allDataWorkorders.sort((a,b)=>{
        //     return  a.Id_Planning_Events - b.Id_Planning_Events         
        //      })

        //      console.log( this.allDataWorkorders)
        //   for(let i =0; i <   this.allDataWorkorders.length ; i++){
        //                      if( i == 0){
        //                          eventArray.push(this.allDataWorkorders[0])
        //                          console.log(typeof this.allDataWorkorders[0].Id_Planning_Events )
        //                      }else if(this.allDataWorkorders[i-1].Id_Planning_Events  != this.allDataWorkorders[i].Id_Planning_Events  ){
        //                      eventArray.push(this.allDataWorkorders[i])
        //                     }
        //                  }
        //                  console.log(eventArray,"eventArray ===>")
        //     this.allDataWorkorders = eventArray
  
  


        let workorderPlanningResult = this.allDataWorkorders.filter(item => item.Id_Planning_Events === event.Id);
        let workorderBacklogResult = this.WorkOrderByidgroup.filter(item => item.Id_Planning_Events === event.Id);
        if (workorderPlanningResult.length > 0) {
            workorder = workorderPlanningResult[0];
            console.log(workorderPlanningResult,"workorderPlanningResult");
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
            Commentaire_Planning_rtf:workorder.Commentaire_Planning,
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
            idwoprec: workorder.idwoprec,
            isTempsReel: 0,
            IsReadonly: false,
            Id_Planning_Events_TempsReel: 0,
            titreepisode: workorder.titreepisode,
            DateDebutReel: workorder.DateDebutReel,
            DateFinReel: workorder.DateFinTheo,
            libelleStatut: workorder.libelleStatut
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
        console.log(workorderSelected, "workorderSelected")
        let othersWorkorderForContainer = this.timelineResourceDataOut.filter(item => item.AzaNumGroupe === event.AzaNumGroupe && !item.AzaIsPere && item.isTempsReel === 0);
 
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
            CodeRessourceSalle: null,
            Commentaire: workorderSelected.Commentaire,
            Support1Cree: null,
            Support2Cree: null,
            MustWaitFor: null,
            Statut: workorderSelected.Statut,
            idplanningprec: null,
            Regroup: null,
            Commentaire_Planning: event.Commentaire_Planning,
            Commentaire_Planning_rtf:event.Commentaire_Planning,
            DateMaj: now,
            UserMaj: this.user.shortUserName,
            Id_Planning_Container: null,
            isbacklog: 1,
            libchaine: workorderSelected.libchaine,
            typetravail: workorderSelected.typetravail,
            titreoeuvre: (workorderSelected.titreoeuvre === null || typeof (workorderSelected.titreoeuvre) === 'undefined') ? '' : workorderSelected.titreoeuvre,
            numepisode: workorderSelected.numepisode,
            libtypeWO: workorderSelected.libtypeWO,
            dureecommerciale: workorderSelected.dureecommerciale,
            IdGenerationWO: workorderSelected.IdGenerationWO,
            // +
            debut: workorderSelected.debut,
            fin: workorderSelected.fin,
            dureeestime: workorderSelected.dureeestime,
            idwoprec: workorderSelected.idwoprec,
            isTempsReel: 0,
            IsReadonly: false,
            Id_Planning_Events_TempsReel: 0,
            titreepisode: workorderSelected.titreepisode,
            DateDebutReel: workorderSelected.DateDebutReel,
            DateFinReel: workorderSelected.DateFinTheo,
            libelleStatut: workorderSelected.libelleStatut

        }
        console.log(newWorkorder);
        this.workorderService
            .updateWorkOrder(newWorkorder.Id_Planning_Events, newWorkorder)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(res => {
                console.log('update workorder with success : ', res);
                this.allDataWorkorders =   this.allDataWorkorders.filter(item => item.Id_Planning_Events !== newWorkorder.Id_Planning_Events);
                console.log(this.allDataWorkorders); // all brut workorder data in backlog
                this.backToBacklog(event);
       
                let startDifferent = this.checkDiffExistById(containerPere, this.timelineResourceDataOut, 'StartTime', 'StartTime');
                let endDifferent = this.checkDiffExistById(containerPere, this.timelineResourceDataOut, 'EndTime', 'EndTime');
                console.log('this.deleteContainerAction', this.deleteContainerAction)
                if (this.deleteContainerAction) {
                    this.eventSettings = {
                        dataSource: <Object[]>extend([], this.timelineResourceDataOut, null, true),
                        // enableTooltip: true, tooltipTemplate: this.temp
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
                        // enableTooltip: true, tooltipTemplate: this.temp
                    };
                    console.log('this.timelineResourceDataOut => ', this.timelineResourceDataOut)
                    console.log(event.Id);
                    let containerParent = this.allDataContainers.filter(item => item.Id_Planning_Container === containerPere.Id);
                    let eventNewDates = this.timelineResourceDataOut.filter(item => item['AzaNumGroupe'] === containerPere.Id && !item['AzaIsPere'] && item["isTempsReel"] === 0);
                    console.log(eventNewDates);
                  
                    for (let i = 0; i < eventNewDates.length; i++) {
                        console.log(eventNewDates[i]);
                        this.updateStartTimeAndEndTimeWorkorder(eventNewDates[i], containerParent[0], this.timelineResourceDataOut);
                    }
                }
         this.WorkOrderByidgroup.push(newWorkorder);
                
        if (othersWorkorderForContainer.length <= 0) {
            swal({
                title: 'Supprimer le container associé',
                text: 'Vous supprimez le dernier workorder du container, ' + 'souhaitez-vous supprimer le container ?',
                showCancelButton: true,
                allowOutsideClick: false,
                cancelButtonText: 'NON',
                confirmButtonText: 'SUPPRIMER'
            }).then((result) => {
                if (result.value) {
                   this.deleteContainerForGood(containerPere.Id,event)
                }
            })
        }
            }, error => {
                swal({
                    title: 'Attention',
                    text: 'Erreur dans la mise à jour du workorder lors du retour au backlog',
                    showCancelButton: false,
                    confirmButtonText: 'Fermer',
                    allowOutsideClick: false

                })
                console.error('error update workorder : ', error)
            }
            );
    }

    backToBacklog(selectedItem) {
        console.log('this.workOrderData before add to backlog ==> ', this.workOrderData);
        console.log('item back to backlog : ', selectedItem);
        let newWorkorderForList = {
            Id: selectedItem.Id,
            Name: selectedItem.titreoeuvre,
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
            coordinateurCreate: selectedItem.coordinateurCreate,
            numGroup: null,
            libchaine: selectedItem.libchaine,
            typetravail: selectedItem.typetravail,
            titreoeuvre: (selectedItem.titreoeuvre === null || typeof (selectedItem.titreoeuvre) === 'undefined') ? '' : selectedItem.titreoeuvre,
            numepisode: selectedItem.numepisode,
            dureecommerciale: selectedItem.dureecommerciale,
            libtypeWO: selectedItem.libtypeWO,
            Commentaire_Planning: selectedItem.Commentaire_Planning,
            Commentaire_Planning_rtf:selectedItem.Commentaire_Planning,
            IdGenerationWO: selectedItem.IdGenerationWO,
            Commentaire: selectedItem.Commentaire,
            // +
            debut: selectedItem.debut,
            fin: selectedItem.fin,
            dureeestime: selectedItem.dureeestime,
            idwoprec: selectedItem.idwoprec,
            isTempsReel: 0,
            IsReadonly: false,
            Id_Planning_Events_TempsReel: 0,
            titreepisode: selectedItem.titreepisode,
            DateDebutReel: selectedItem.DateDebutReel,
            DateFinReel: selectedItem.DateFinTheo,
            libelleStatut: selectedItem.libelleStatut,
            CodeRessourceCoordinateur: selectedItem.CodeRessourceCoordinateur,
            CodeRessourceOperateur:null,
            isbacklog:1
        };
        this.workOrderData.push(newWorkorderForList);
        this.field['dataSource'] = this.workOrderData;
        console.log('this.workOrderData after add to backlog ==> ', this.workOrderData);
        console.log('this.field.datasource ==> ', this.field['dataSource']);
        this.isAddedToBacklog = true;
        let targetNodeId: string = this.treeObj.selectedNodes[0];
        let nodeId: string = 'tree_' + newWorkorderForList.Id;
        // this.eventSettings = {
        //     // enableTooltip: true, tooltipTemplate: this.temp
        // };
        this.treeObj.addNodes([newWorkorderForList], targetNodeId, null); // TreeViewComponent
        
        if (this.user.initials === newWorkorderForList.coordinateurCreate) {
            this.workOrderData = [];
            this.workOrderToBacklog = [];
            this.refreshWorkordersBacklog()
             

        }// }
        setTimeout(() => {
            if (this.searchString != undefined) {
                console.log("retour au backlog")
                this.searchwo.value = this.searchString
                this.onFilter(this.searchwo.value, 0, this.argsKeyboardEvent)
            } else {
            }
        }, 200);
        this.eventSelecte = [] // vider la liste des workorders remis au backlog;
        // this.workorderSelected =[]
    }
    /************************************************ PUT workorder *****************************************/
    updateWorkOrder(args) {

        console.log('update workorder function');
        let now = moment().format('YYYY-MM-DDTHH:mm:ss');

        let event = args.data;
        console.log(event)
        console.log(this.allDataWorkorders)
        let oldEvent = this.timelineResourceDataOut.filter(item => item.Id === event.Id && !item.AzaIsPere);
        console.log('old Event workorder :', oldEvent);
        let workorderResult = this.allDataWorkorders.filter(item => item.Id_Planning_Events === event.Id && item.Id_Planning_Events_TempsReel === 0);
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
        console.log("startTime & endTime ===>", startTime, endTime, "event.StartTime ,event.EndTime ", event.StartTime, event.EndTime)

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

            Commentaire: event.Commentaire,
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
            Commentaire_Planning_rtf:event.Commentaire_Planning,
            IdGenerationWO: event.IdGenerationWO,
            // +
            debut: workorder.debut,
            fin: workorder.fin,
            dureeestime: workorder.dureeestime,
            idwoprec: workorder.idwoprec,
            isTempsReel: 0,
            IsReadonly: false,
            Id_Planning_Events_TempsReel: 0,
            titreepisode: workorder.titreepisode,
            DateDebutReel: workorder.DateDebutReel,
            DateFinReel: workorder.DateFinReel,
            libelleStatut: workorder.libelleStatut
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
                console.log('this.timelineResourceDataOut : ', this.timelineResourceDataOut);
                let startDifferent = this.checkDiffExistById(event, this.timelineResourceDataOut, 'StartTime', 'StartTime');
                let endDifferent = this.checkDiffExistById(event, this.timelineResourceDataOut, 'EndTime', 'EndTime');
                this.timelineResourceDataOut = this.eventSettings.dataSource as Object[]; // refresh dataSource
                let containerEvent = this.timelineResourceDataOut.filter(item => item.Id === workorder.Id_Planning_Container && item.AzaIsPere);
                let containerPere = containerEvent[0];
                console.log(event)
                console.log('this.timelineResourceDataOut : ', this.timelineResourceDataOut);
                this.timelineResourceDataOut.map(item => {
                    if (item.Id === event.Id && !item.AzaIsPere && item.isTempsReel == 0) {
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
                        item.libchaine = event.libchaine;
                        item.typetravail = event.typetravail;
                        item.titreoeuvre = event.titreoeuvre;
                        item.numepisode = event.numepisode;
                        item.dureecommerciale = event.dureecommerciale;
                        item.libtypeWO = event.libtypeWO;
                        item.Commentaire_Planning = event.Commentaire_Planning;
                        item.Commentaire_Planning_rtf = event.Commentaire_Planning;
                        item.Id_Planning_Container = event.AzaNumGroupe;
                        item.IdGenerationWO = event.IdGenerationWO,
                        item.Commentaire = event.Commentaire,
                        item.titreepisode = event.titreepisode,
                        item.libelleStatut = event.libelleStatut,
                        item.CodeRessourceCoordinateur = event.CodeRessourceCoordinateur
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
                    // enableTooltip: true, tooltipTemplate: this.temp
                };
                this.scheduleObj.refreshEvents()

                // this.eventSettings = {
                //     dataSource: <Object[]>extend(
                //         [], this.calculDateAll(this.timelineResourceDataOut, true, event, startDifferent, endDifferent), null, true
                //     ),
                //     enableTooltip: true, tooltipTemplate: this.temp
                // };
                this.updateWO = false;
                console.log(" this.updateWO ===> UPDATE WORKORDERS", this.updateWO)
            }, error => {
                console.error('error updateworkorder', error);
                console.log(event, "event")
                // alert('error updatecontainer');
                swal({
                    title: 'Attention',
                    text: 'Erreur dans la mise à jour du workorder',
                    showCancelButton: false,
                    confirmButtonText: 'Fermer',
                    allowOutsideClick: false

                })
            }
            )
    }

  

    updateStatutWorkorderBeforeDelete(id, workorder,place){
        // workorder.Statut = 1;
        workorder.Statut = 1
        workorder.statut = 1
        this.workorderService
        .updateWorkOrder(id, workorder)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(res =>{
        console.log(res,"update statut workorder with success")
        let workorderUpdate = res
        if(place=='planner'){
            console.log('delete workorder planner', workorderUpdate)
            let workorderDelete = this.timelineResourceDataOut.filter(item => item.Id == id)
            this.deleteWorkOrder(workorderDelete[0])
        //   this.updateEventSetting(this.timelineResourceDataOut)
            // this.deleteWorkOrderForGood(id, place)
        }else{
            this.deleteWorkOrderForGood(id, place)
            console.log('delete workorder backlog', res)

        }

    })

    }

    updateStatutWorkorderBacklog(id,workorder){
   
        this.workorderService
        .putStatutWorkorder(id, workorder)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(res =>{
            let workorderUpdate = res
            this.deleteWorkOrderForGood(id, 'backlog')
          
        })
    }
/********************************* Delete Functions **************************************************************/
workorderDelete
deleteWorkOrderForGood(id, place:string ){
    if(!this.statutDifferent){
    this.workorderService
    .deleteWorkOrderByidGroup(id)
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(res =>{

        console.log("delete workorder with success",res)
        let workOrderDelete : any
        workOrderDelete  = res
        this.workorderDelete = {
            Id: workOrderDelete.Id_Planning_Events,
            AzaIsPere: false,
            AzaNumGroupe: workOrderDelete.Id_Planning_Container, 
            isbacklog: workOrderDelete.isbacklog
        }
        console.log("workorder supprimer =>",res,id)
       if(workOrderDelete.isbacklog == 1){    
            this.displayWorkorderInBacklogWorkorderData(this.workorderDelete , 'delete')
         
        
        }else{
            this.timelineResourceDataOut =  this.timelineResourceDataOut.filter(item => item.Id !=  this.workorderDelete.Id);
            this.updateEventSetting(this.timelineResourceDataOut)
            // console.log(this.timelineResourceDataOut)
            if(place=='planner'){
            this.eventSelecte = [];
            // this.workorderSelected =[]
        }else{
            this.workorderSelectedInBacklog = []
        }
    }
    })
  
}else{
    this.dialogRefresh()
    this.eventSelecte = [];
    // this.workorderSelected =[]
}}

deleteContainerForGood(id,event){ // suppression définitive
    if(!this.statutDifferent){
    this.containersService.deleteContainer(id)
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(res => {
        console.log('delete container with success : ', res);
        this.numberContainerWithoutOperateur()
        this.allDataContainers = this.allDataContainers.filter(container => container.Id_Planning_Container !== id);
        console.log('this.allDataContainers after delete container : ', this.allDataContainers);
        console.log(event)
        this.timelineResourceDataOut = this.timelineResourceDataOut.filter(item => {
            if (+event.AzaNumGroupe !== +item.AzaNumGroupe) {
                return item;
            }
        });
        console.log(this.timelineResourceDataOut)
        if(this.operateur.checked == true){
            let containerWithoutOperateur = this.timelineResourceDataOut.filter(item =>item.Operateur == '' || item.Operateur == null )
            console.log(containerWithoutOperateur,"containerWithoutOperateur & this.operateur.checked == true")
            this.updateEventSetting(containerWithoutOperateur) 
          }else{
            this.updateEventSetting(this.timelineResourceDataOut) 
          }
    }, error => {
        console.error('error for delete container request : ', error);
    })
    // this.updateEventSetting(this.timelineResourceDataOut)
}else{
    this.dialogRefresh()
}
this.eventSelecte = [];
// this.workorderSelected =[]
this.disableNavigation = false;
if (!this.disableNavigation) {
    let toolbar = document.getElementsByClassName('e-toolbar-items');
    for (let i = 0; i < toolbar.length; i++) {
        toolbar[i]["style"].display = 'block'
  
    }
}

}


deleteWorkOrder(event){
    this.deleteWorkOrderForGood(event.Id,'planner') 
    
    console.log(this.timelineResourceDataOut,this.allDataWorkorders,'before')
    this.timelineResourceDataOut = this.timelineResourceDataOut.filter(item => {
     if ((+event.Id !== +item.Id) ) {
         return item;
     }
 });
 this.allDataWorkorders = this.allDataWorkorders.filter(workorder => workorder.Id_Planning_Events !== event.Id );
 let containerPere = this.timelineResourceDataOut.filter(item =>  event.AzaNumGroupe== item.Id && item.AzaIsPere )
 let workorderexist = this.timelineResourceDataOut.filter(item =>  event.AzaNumGroupe== item.AzaNumGroupe && !item.AzaIsPere )
 console.log(this.timelineResourceDataOut, this.allDataWorkorders,'after')


 console.log(containerPere)
 console.log(workorderexist)
 if(workorderexist.length>0){
 let startDifferent = this.checkDiffExistById(containerPere, this.timelineResourceDataOut, 'StartTime', 'StartTime');
 let endDifferent = this.checkDiffExistById(containerPere, this.timelineResourceDataOut, 'EndTime', 'EndTime');
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
         // enableTooltip: true, tooltipTemplate: this.temp
     };
     let eventNewDates = this.timelineResourceDataOut.filter(item => item['AzaNumGroupe'] === containerPere[0].Id && !item['AzaIsPere'] && item["isTempsReel"] === 0);
     console.log(eventNewDates);
     let containerParent = this.allDataContainers.filter(item => item.Id_Planning_Container === containerPere[0].Id);
     for (let i = 0; i < eventNewDates.length; i++) {
         console.log(eventNewDates[i]);
         this.updateStartTimeAndEndTimeWorkorder(eventNewDates[i], containerParent[0], this.timelineResourceDataOut);
     }
 }else{
     swal({
         title: 'Supprimer le container associé',
         text: 'Vous supprimez le dernier workorder du container, ' + 'souhaitez-vous supprimer le container ?',
         showCancelButton: true,
         allowOutsideClick: false,
         cancelButtonText: 'NON',
         confirmButtonText: 'SUPPRIMER'
     }).then((result) => {
         if (result.value) {
             this.deleteContainerForGood(containerPere[0].Id, this.workorderDelete)
             this.updateEventSetting(this.timelineResourceDataOut)
         }
     })
     
 }


 this.updateEventSetting(this.timelineResourceDataOut)
}

    /*************************************************************************/
    /*************************** UTILITY FUNCTIONS ***************************/

    updateEventSetting(data) {
console.log("**** UPDATE EVENTSETTING**********",data)
        this.eventSettings = { // Réinitialise les events affichés dans le scheduler
            dataSource: <Object[]>extend(
                [], data, null, true
            ),
            // enableTooltip: true, tooltipTemplate: this.temp
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

    public agendaStartDate;
    public agendaLastDate;
    public calcule;
    public navigateTimelineDay;

    public lastAllDataContainers;
    public lastAllDataWorkorders;
    public argsOnNavigating

    /***** refresh backlog********* */
   
    onNavigating(args) {
        console.log(' =========================== NEW NAVIGATION ==================== ');
        console.log('onNavigating(args) function => args ==> ', args);
        console.log('onNavigating(args) function => args.currentView ==> ', args.currentView);
        console.log('this.timelineResourceDataOut before reset => ', this.timelineResourceDataOut);
        console.log("this.scheduleObj.getEvents() before reset =>", this.scheduleObj.getEvents())
        console.log("this.scheduleObj.getCurrentViewEvents before reset =>", this.scheduleObj.getCurrentViewEvents())
        console.log("this.scheduleObj.eventsProcessed() before reset =>", this.scheduleObj.eventsProcessed)
        console.log('COORDINATEUR GROUPE => ', this.idGroupeCoordinateur);
        this.argsOnNavigating = args
        this.lastAllDataContainers = this.allDataContainers;
        this.lastAllDataWorkorders = this.allDataWorkorders;
        // console.log('this.lastTimelineResourceDataOut ===> ', this.lastTimelineResourceDataOut);
        this.timelineResourceDataOut = [];
        this.scheduleObj.eventsProcessed = []
        // this.allDataContainers = [];
        // this.allDataWorkorders = [];
        console.log("this.scheduleObj.getEvents() after reset =>", this.scheduleObj.getEvents())
        console.log("this.scheduleObj.eventsProcessed() after reset =>", this.scheduleObj.eventsProcessed)
        console.log('this.timelineResourceDataOut after reset => ', this.timelineResourceDataOut);

        this.navigation = true
        this.DropEventWithNavigation = true
      
        console.log(this.treeObj);
       
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
            this.endofDay = moment(newStartOfDay).add(1, 'd').toDate();
        } else {
            this.startofDay = moment(args.currentDate).toDate();
            this.endofDay = moment(args.currentDate).add(1, 'd').toDate();
        }
        this.startofWeek = moment(this.startofDay).startOf('week').add(1, 'd').toDate(); // LUNDI
        this.endofWeek = moment(this.startofDay).endOf('week').add(1, 'd').toDate(); // LUNDI SUIVANT
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


   
        /************** ARGS.CURRENTVIEW CONDITIONS ************/

        /** readonly management **/
        if ((args.currentView === 'TimelineWeek') || (args.currentView === 'TimelineDay')) {
            this.scheduleObj.readonly = false
            this.scheduleObj.rowAutoHeight = true
            if (this.isnotMyGroup == true) {
                this.scheduleObj.readonly = true
            } else {
                this.scheduleObj.readonly = false
            }
            //   if (args.action === 'date') {

            // }
        } else if (args.currentView === 'TimelineMonth' ) {
            this.scheduleObj.readonly = true
            this.scheduleObj.rowAutoHeight = false
            if (args.action === 'date') {
                this.scheduleObj.readonly = true
                console.log('this.scheduleObj.readonly => ', this.scheduleObj.readonly)
            }

        }
        // TIMELINEDAY
        if ((args.currentView === 'TimelineDay') || (args.currentView == undefined && (this.scheduleObj.currentView === 'TimelineDay'))) {

            console.log('TimelineDay first call condition width management value');


           
            this.scheduleObj.timeScale = { enable: true, interval: parseInt(this.intervalValueDay as string, 10), slotCount: 2 }
            this.intervalValue = "60"
            if (this.intervalChanged) {
                this.scheduleObj.timeScale.interval = this.value
            } else {
                // this.value = this.scheduleObj.timeScale.interval

            }
            console.log('TIMELINEDAY !!!! => date contition');
            this.refreshDateStart = this.startofDay;
            this.refreshDateEnd = this.endofDay;
            this.salleDataSource.forEach(salle => {
                let indexSalle = this.salleDataSource.indexOf(salle);
                if (this.theorique.checked) {
                    this.navigation = false
                    this.getContainersByRessourceStartDateEndDate(
                        salle.CodeRessource,
                        this.startofDay,
                        this.endofDay,
                        salle.CodeSalle,
                        indexSalle,
                        this.idGroupeCoordinateur
                    );
                }
                let debut = moment(this.startofDay).format('YYYY-MM-DD').toString();
                let fin = moment(this.endofDay).format('YYYY-MM-DD').toString();
                if (this.reel.checked) {
                    this.getWorkorderTempsReelByIdGroupeStartDateEndDate(this.idGroupeCoordinateur, debut, fin, salle.CodeRessource, salle.CodeSalle)
                }
                // this.getWorkorderTempsReelByIdGroupeStartDateEndDate(this.groupCoordinateur, debut ,fin,salle.CodeRessource,salle.CodeSalle) 

            });
            this.scheduleObj.refreshEvents();
            console.log('timelineResourceDataOut => ', this.timelineResourceDataOut);
            console.log("this.scheduleObj.getEvents() =>", this.scheduleObj.getEvents(), this.scheduleObj.eventsProcessed)
            // TIMELINEWEEK
        } else if ((args.currentView === 'TimelineWeek') || (args.currentView == undefined && (this.scheduleObj.currentView === 'TimelineWeek'))) {
            console.log('TimelineWEEK first call condition width management value');
            //   this.valueMax = 60
            // this.value = parseInt(this.intervalValue as string, 10)
            // this.valueMax = 240
            // this.valueAdd = 60     
            this.scheduleObj.enablePersistence = false
           
            this.scheduleObj.timeScale = { enable: true, interval: parseInt(this.intervalValue as string, 10), slotCount: 1 }
            if (this.intervalChanged) {
                this.scheduleObj.timeScale.interval = this.value
            } else {
                this.intervalValue = "120"
                this.scheduleObj.timeScale.interval = 120
            }
            this.timelineResourceDataOut = []
            console.log('timelineResourceDataOut => ', this.timelineResourceDataOut);
            this.refreshDateStart = this.startofWeek;
            this.refreshDateEnd = this.endofWeek;
   
            this.salleDataSource.forEach(salle => {
                let indexSalle = this.salleDataSource.indexOf(salle);
                if (this.theorique.checked) {
                    this.navigation = false
                    this.getContainersByRessourceStartDateEndDate(
                        salle.CodeRessource,
                        this.startofWeek,
                        this.endofWeek,
                        salle.CodeSalle,
                        indexSalle,
                        this.idGroupeCoordinateur

                    );
                }
                let debut = moment(this.startofWeek).format('YYYY-MM-DD').toString();
                let fin = moment(this.endofWeek).format('YYYY-MM-DD').toString();
                if (this.reel.checked) {
                    this.getWorkorderTempsReelByIdGroupeStartDateEndDate(this.idGroupeCoordinateur, debut, fin, salle.CodeRessource, salle.CodeSalle)
                }
                // this.getWorkorderTempsReelByIdGroupeStartDateEndDate(   this.groupCoordinateur, debut ,fin,salle.CodeRessource,salle.CodeSalle)   
            });
            this.scheduleObj.refreshEvents();
            console.log('timelineResourceDataOut => ', this.timelineResourceDataOut);
            console.log("this.scheduleObj.getEvents() =>", this.scheduleObj.getEvents(), this.scheduleObj.eventsProcessed)
            console.log(this.scheduleObj,"eeeeeeeeeeeeeee")
            // TIMELINEMONTH
        } else if ((args.currentView === 'TimelineMonth') || (args.currentView == undefined && (this.scheduleObj.currentView === 'TimelineMonth'))) {
            this.scheduleObj.readonly = true
     
            this.timelineResourceDataOut = [];
            console.log('timelineResourceDataOut => ', this.timelineResourceDataOut);
            this.refreshDateStart = this.startofMonth;
            this.refreshDateEnd = this.endofMonth;
            this.salleDataSource.forEach(salle => {
                let indexSalle = this.salleDataSource.indexOf(salle);
                if (this.theorique.checked) {
                    this.navigation = false
                    this.getContainersByRessourceStartDateEndDate(
                        salle.CodeRessource,
                        this.startofMonth,
                        this.endofMonth,
                        salle.CodeSalle,
                        indexSalle,
                        this.idGroupeCoordinateur
                    );
                }
                let debut = moment(this.startofMonth).format('YYYY-MM-DD').toString();
                let fin = moment(this.endofMonth).format('YYYY-MM-DD').toString();
                if (this.reel.checked) {
                    this.getWorkorderTempsReelByIdGroupeStartDateEndDate(this.idGroupeCoordinateur, debut, fin, salle.CodeRessource, salle.CodeSalle)
                }
            });
            this.scheduleObj.refreshEvents();
            console.log("this.scheduleObj.getEvents() =>", this.scheduleObj.getEvents())

        }
      

        if (this.theorique.checked == false) {
            this.CheckTheoriqueNavig = false
            console.log('$$$$$$$$$$$$$$$$$', this.CheckTheoriqueNavig)
        }
        if (this.reel.checked == false) {
            this.Check = 0
        }

        console.log(this.timelineResourceDataOut, "************************************************ navigation")
        // this.scheduleObj.refresh();
    }

    onEventRendered(args: EventRenderedArgs): void {
        let couleur
        let scheduleElement = document.getElementsByClassName('schedule-drag-drop');
        // console.log(args)
        // args.element.draggable = true

       

        if (args.data.AzaIsPere) {
            if (this.scheduleObj.currentView === 'TimelineMonth') {
                //   (args.element.firstElementChild as HTMLElement).textContent = args.data.Name.toString();
                //   (args.element).textContent = args.data.Name.toString() +"<br>"+ args.data.Operateur.toString();

            }
        } else {
            this.statutWorkorder.map(statut => {
                if (args.data.Statut === statut["Code"] && args.data.isTempsReel === 0) {
                    couleur = statut['Color']
                    this.couleur = couleur
                }

                if (args.data.Statut === statut["Code"] && args.data.isTempsReel === 1) {
                    if (this.scheduleObj.currentView != 'TimelineMonth') {
                        args.element.style.borderTopColor = "#FFEBCD"
                        args.element.style.borderTopWidth = "5px"

                    } else {
                        args.element.style.borderTopColor = "#FFEBCD"
                        args.element.style.borderTopWidth = "2px"
                    }
                    couleur = statut['Color']
                }
                this.workOrderColor = couleur
            })
            if (this.scheduleObj.currentView != 'TimelineMonth') {

                (args.element.firstChild as HTMLElement).style.backgroundColor = this.workOrderColor;
                args.element.style.backgroundColor = this.workOrderColor;

            } else {

                // (args.element.firstElementChild as HTMLElement).style.fontSize = "10px";

                (args.element.firstElementChild as HTMLElement).style.backgroundColor = this.workOrderColor;
                args.element.style.backgroundColor = this.workOrderColor;

            }
        }

    }
public eventOnCellClick
    cellClick(args: CellClickEventArgs) {
        console.log(args, "args")
        //  args.cancel = true
        this.isCellsEmpty = this.scheduleObj.isSlotAvailable(args.startTime,args.endTime,args.groupIndex);
    //    let codeRessourceSalle = this.scheduleObj.getResourcesByIndex(args.groupIndex).groupData.DepartmentID;
       this.eventOnCellClick =this.scheduleObj.getEvents(args.startTime,args.endTime)
      
console.log(this.eventOnCellClick)
    }
    /*************************************************************************/
    /*************************** MODALS M1ANAGEMENT **************************/
    /*************************************************************************/
    cellDoubleClick(args:CellClickEventArgs){

        console.log(args,'<CellClickEventArgs>')
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
    public couleur; //couleur statuts
    public cancel

    public CellClick: boolean = true;
    public hourContainer;
    public elementRow
    public updateWO: boolean = false;
    public openEditor = false
    public dataToEdit;

    public deleteButton;
    public argsOnPopupOpen;
    public clickDeleteDialog:boolean = false //true ===> clique sur delete workorder dans la modale du container 
    onPopupOpen(args) { // open container modal and display workorder list
        let workOrders = [];
        console.log(args);
        console.log(this.eventSettings)
        this.argsOnPopupOpen = args
        this.dataToEdit = args.data
        args.element.hidden = false;
       
        //ajuster la durée des evenements 
                     args.duration =5;
                    var dialogObj = (args.element as any).ej2_instances[0];
                    dialogObj.open = function() {
                      // Changed the event duration to 5 min
                      let startObj = (args.element.querySelector(".e-start") as any)
                        .ej2_instances[0];
                      startObj.step = 5;
                      let endObj = (args.element.querySelector(".e-end") as any)
                        .ej2_instances[0];
                      endObj.step = 5;}

        let isTempsReel = this.timelineResourceDataOut.filter(item =>
            item.AzaNumGroupe === args.data.AzaNumGroupe && item.Statut != 3 && !item.AzaIsPere
            )
            let commentaireWorkorderEditor = document.getElementsByClassName('custom-field-workorder');
            if(commentaireWorkorderEditor.length ===0){
                // this.createInputCommentWorkorder(args)
            }
        if ((args.type === 'QuickInfo') && (args.name === 'popupOpen')) {

            let start = moment(args.data["StartTime"]),
                end = moment(args.data["EndTime"]),
                diff = end.diff(start, 'minute')
            let interval
            if (this.scheduleObj.currentView === "TimelineDay") {  //afficher la modale de multi-selection aa partir de 2 cellule 
                interval = this.scheduleObj.timeScale.interval / 2
                console.log(diff, interval)
            } else {
                interval = this.scheduleObj.timeScale.interval
                console.log(diff, interval)
              }
            if (diff === Math.trunc(interval)  ) {
                    args.cancel = true;

                }

                if(this.isCellsEmpty == false){
                 args.cancel = true
                }
            
                if(this.operateur.checked == true){ //bloquer l'ouvrerture de la modale d'edition si le bouton container sans operateur est coché
                          args.cancel = true

                }
           if(args.target.classList.contains("e-work-cells")){ //uniquement les cellules vides
                   this.eventSelecte = [] //vider le tableau de la multiselection
                  this.containerDupliquer = [] //vider le tableau de la duplication
                //   this.workorderSelected =[];
                }
            let buttonElementDelete = args.type === "QuickInfo" ? ".e-event-popup .e-delete" : ".e-schedule-dialog .e-event-delete";
           this.deleteButton = document.querySelector(buttonElementDelete)
            console.log(this.deleteButton)
            if(this.deleteButton != null){
            this.deleteButton['title'] = "Retour au backlog"
        }
            let btnclose = document.getElementsByClassName('e-close e-control');  //btn fermer de la modale de multiselection 
            btnclose[0].addEventListener('click', () => {
                console.log("click close")
              
                let cellPopup = document.getElementsByClassName('e-cell-popup');
                console.log(cellPopup)
                let error = document.getElementsByClassName('e-schedule-error');
                console.log(error)
                if (cellPopup != null || error != null) {
                    error[0]["hidden"] = true
                    cellPopup[0]["hidden"] = true
                }
                console.log(btnclose)
            }, true);
    
            let title = document.getElementsByClassName('e-subject-container');
            let subTitle = document.getElementsByClassName('e-location-container');
            let Debut = document.getElementsByClassName('e-start-container');
            let fin = document.getElementsByClassName('e-end-container');
            let regie = document.getElementsByClassName('e-resources');
            let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
            let repeat = document.getElementsByClassName('e-editor');
            let commentaireWorkorder = document.getElementsByClassName('custom-field-workorder');
            // commentaireWorkorder[0]['style'].display = 'none';
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
            let DepartmentID = document.getElementsByClassName('e-DepartmentID');
            console.log("DepartmentID dbclick cell", DepartmentID)
            DepartmentID[0]["ej2_instances"][0].value = DepartmentID[0]["ej2_instances"][0].text //afficher le nom de la regie sans la modale
            // DepartmentID[0]["ej2_instances"][0].itemData = DepartmentID[0]["ej2_instances"][0].itemData.concat(this.listeRegies)
            DepartmentID[0]["ej2_instances"][0].dataSource = this.listeRegies
           
      
         this.addButtonDelete(args,isTempsReel)
      
    }
        if (args.data.hasOwnProperty('AzaIsPere') && args.type !== 'Editor') {
            if (args.data.AzaIsPere) {
                this.timelineResourceDataOut.map(item => {
                    if (item.AzaNumGroupe === args.data.AzaNumGroupe && item.AzaIsPere === false && item.isTempsReel === 0) {
                        workOrders.push(item);
                        if (item.Statut !== 3) {
                            this.disableBtnCloseAndEdit(args)
                        }
                    }
                });
                let row: HTMLElement = createElement('div', {
                    className: 'e-sub-object-list'
                });
                let elementParent: HTMLElement = <HTMLElement>args.element.querySelector('.e-popup-content');
                console.log(elementParent)
                if (elementParent != null) {
                    elementParent['style'].overflow = 'auto'
                    elementParent['style'].maxHeight = '40vh'
                    elementParent.appendChild(row);
                }
                this.popupContaint(workOrders, row)

                let RowContent = document.querySelector(".e-sub-object-list")
                let newWorkorder = []

                console.log(RowContent)

                for (let e = 0; e < workOrders.length; e++) {
                    let child = document.getElementById(`id${e}`);
                    child.addEventListener('click', () => {
                        args.cancel = true;
                        args.element.hidden = true;
                        this.openDialog(this.workOrderColor, args.data, workOrders[e], this.departmentDataSource, "planner");
                        console.log(child)
                    }, true);

                    let childBtnDelete = document.getElementById(`id${workOrders[e].Id}`);

                    console.log(childBtnDelete)
                    if (childBtnDelete != null) {
                        childBtnDelete.addEventListener('click', () => {
                            let workorderDataBrut = this.allDataWorkorders.filter(itemBrut => itemBrut.Id_Planning_Events == workOrders[e].Id)
                            this.updateStatutWorkorderBeforeDelete(workorderDataBrut[0]["Id_Planning_Events"],workorderDataBrut[0],'planner')
                            // this.deleteWorkOrder(workOrders[e])
                            console.log("click btn delete ", workOrders[e]);
                            this.clickDeleteDialog = true

                            this.timelineResourceDataOut.map(item => {
                                if (item.AzaNumGroupe === args.data.AzaNumGroupe && workOrders[e].Id != item.Id && item.AzaIsPere === false && item.isTempsReel === 0) {
                                    newWorkorder.push(item);
                                }

                            })
                            if (this.clickDeleteDialog) {

                                console.log(newWorkorder);
                                // RowContent.innerHTML = ``;
                                // this.popupContaint(newWorkorder, row)
                                let rowSelected = document.getElementsByClassName(workOrders[e].Id)
                                rowSelected[0]['style'].display = 'none';

                            }
                        })
                    }
                    let childBtnRetourBacklog = document.getElementById(`backlog${workOrders[e].Id}`);
                    let newArrayworkorder = []

                    if(childBtnRetourBacklog != null) {
                        childBtnRetourBacklog.addEventListener('click',()=>{
                            this.deleteEvent(workOrders[e])
                            this.timelineResourceDataOut.map(item => {
                                if (item.AzaNumGroupe === args.data.AzaNumGroupe && workOrders[e].Id != item.Id && item.AzaIsPere === false && item.isTempsReel === 0) {
                                    newArrayworkorder.push(item);
                              
                                }
                                })
                                // RowContent.innerHTML = ``; display : none 
                                let rowSelected = document.getElementsByClassName(workOrders[e].Id)
                                rowSelected[0]['style'].display = 'none';
                    console.log('retour au backlog')
                    // this.popupContaint(newArrayworkorder, row)
                    // args.target.click()

                        })
                    }
                
                }
                
             
              
             
            } else {
                let elementworkorder: HTMLElement = <HTMLElement>args.element.querySelector('.e-subject');

                this.timelineResourceDataOut.map(item => {
                    if (item.AzaNumGroupe === args.data.AzaNumGroupe && item.AzaIsPere === false && item.isTempsReel === 0) {
                        workOrders.push(item);
                    }
                });
                for (let i = 0; i < workOrders.length; i++) {     
                    if (elementworkorder != null) {
                        if(args.data.Id ==workOrders[i].Id){
                            console.log(workOrders[i],"workorder selected =======>")
                        elementworkorder.innerHTML = `<div class='e-subject e-text-ellipsis' style="color : black; font-size:12px">${workOrders[i].titreoeuvre}&nbsp;/&nbsp;${workOrders[i].titreepisode} ep ${workOrders[i].numepisode} </div>`
                    }}
                }
                if (args.data.Statut != 3 && args.data.isTempsReel === 0) {
                    console.log(args.data)
                    this.disableBtnCloseAndEdit(args)

                    let rowWorkOrderReel: HTMLElement = createElement('div', {
                        className: 'e-sub-object-list'
                    });

                    let elementParent: HTMLElement = <HTMLElement>args.element.querySelector('.e-popup-content');
                    console.log(elementParent)
                    if (elementParent != null) {
                        elementParent['style'].overflow = 'auto'
                        elementParent['style'].maxHeight = '40vh'
                        elementParent.appendChild(rowWorkOrderReel);

                    }

                    setTimeout(() => {
                        console.log(this.WorkorderTempsReelEvent.length)
                        for (let i = 0; i < this.WorkorderTempsReelEvent.length; i++) {
                            console.log(rowWorkOrderReel)
                            let dateDebut = moment(this.WorkorderTempsReelEvent[i].DateDebut).format('DD-MM-YYYY à HH:mm:ss').toString(),
                                datefin
                            if (moment(this.WorkorderTempsReelEvent[i].DateFin, moment.defaultFormat).isValid()) {
                                datefin = moment(this.WorkorderTempsReelEvent[i].DateFin).format('DD-MM-YYYY à HH:mm:ss').toString()
                            } else {
                                datefin = moment().format('DD-MM-YYYY à HH:mm:ss').toString()
                                //   console.log(dateFin)
                            }
                            let data = args.data
                            rowWorkOrderReel.innerHTML += `<div id='id${i}' style="color : black; font-size:14px">  Titre Oeuvre :  &nbsp; ${data.titreoeuvre} &nbsp;<br>  Titre épisode :${data.titreepisode}  &nbsp; ep &nbsp;${data.numepisode} <br> Type de Travail: &nbsp; ${data.libtypeWO} <br> Libellé chaine : &nbsp; ${data.libchaine}  <br>  Durée Commerciale :&nbsp;${data.dureecommerciale} <br> Statut :&nbsp; ${data.libelleStatut} &nbsp;<br> Debut réel&nbsp;:&nbsp;${dateDebut} <br> &nbsp;Fin réel :&nbsp;${datefin}&nbsp; <br> &nbsp;Opérateur :&nbsp;${this.WorkorderTempsReelEvent[i].UserMaj} </div>`;
                            let element = document.getElementById('id' + i)

                            
                          
                            this.statutWorkorder.map(statut => {
                                if (data.Statut === statut["Code"]) {
                                    console.log(this.WorkorderTempsReelEvent[i].statut, data.Statut)
                                    element.style.backgroundColor  = statut['Color']
                                }
                                

                            })
                        }

                    }, 200);
                    // if( this.scheduleObj.readonly === true){
                    //     element['style'].display ='none'
                    // }else{
                    //     element['style'].display ='block'
                    // }

                }else{
                    if (args.data.Statut == 3 ) {
                        let rowWorkOrdr: HTMLElement = createElement('div', {
                        className: 'e-sub-object-list'
                    });

                    let elementParent: HTMLElement = <HTMLElement>args.element.querySelector('.e-popup-content');
                    console.log(elementParent)
                    if (elementParent != null) {
                        elementParent['style'].overflow = 'auto'
                        elementParent['style'].maxHeight = '40vh'
                        elementParent.appendChild(rowWorkOrdr);

                    }
                    let data = args.data
                    rowWorkOrdr.innerHTML += `<div id='id${data.Id}' style="color : black; font-size:14px">  Titre Oeuvre :  &nbsp; ${data.titreoeuvre} &nbsp;<br>  Titre épisode :${data.titreepisode}  &nbsp; ep &nbsp;${data.numepisode} <br> Type de Travail: &nbsp; ${data.libtypeWO} <br> Libellé chaine : &nbsp; ${data.libchaine}  <br>  Durée Commerciale :&nbsp;${data.dureecommerciale} <br> Statut :&nbsp; ${data.libelleStatut}   </div>`
                 
                          let  couleur = "#F3BE09"
                        
                        let element = document.getElementById('id' + data.Id)
                        element.style.backgroundColor = couleur


                   
                    }
                }
            }
        }
        if (args.data.name === 'cellClick') {
            console.log('cell click', args)

            this.CellClick = true
            if (args.target.className === "e-header-cells  e-current-day" || args.target.className === "e-header-cells") {
                args.cancel = true
                args.data.cancel = true
                console.log(args, "-----------------------------------")
            }
            console.log(this.scheduleObj.selectedDate)
            this.creationArray = [];
            this.isTreeItemDropped = false;
              let title = document.getElementsByClassName('e-subject-container');
              let subTitle = document.getElementsByClassName('e-location-container');
              let Debut = document.getElementsByClassName('e-start-container');
              let fin = document.getElementsByClassName('e-end-container');
              let regie = document.getElementsByClassName('e-resources');
              let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
              let repeat = document.getElementsByClassName('e-editor');
              let commentaireWorkorder = document.getElementsByClassName('custom-field-workorder');
            //   commentaireWorkorder[0]['style'].display = 'none';
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

        if (((args.type === 'Editor') && this.eventClick) || ((args.type === 'Editor') && this.checkIfContainerAlreadyExists(args) === false)) {
            console.log('this.checkIfContainerAlreadyExists(args); => ', this.checkIfContainerAlreadyExists(args));

            console.log('Editor Open and this.isTreeItemDropped = ', this.isTreeItemDropped);
            this.openEditor = true
            console.log(this.openEditorCount);

            
            console.log(commentaireWorkorderEditor)

            if (this.openEditorCount === 0) { // diplay none for IsAllDay and Repeat field in editor

                //   let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                //   isAllDay[0]['style'].display = 'none';
                //   let repeat = document.getElementsByClassName('e-editor');
                //   repeat[0]['style'].display = 'none';
                //   let subTitle = document.getElementsByClassName('e-location-container');
                //   subTitle[0]['style'].display = 'none';

                if (!args.data.AzaIsPere && args.data.isTempsReel === 0) {
                    let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                    let repeat = document.getElementsByClassName('e-editor');
                    let title = document.getElementsByClassName('e-subject-container');
                    let subTitle = document.getElementsByClassName('e-location-container');
                    let Debut = document.getElementsByClassName('e-start-container');
                    let fin = document.getElementsByClassName('e-end-container');
                    let regie = document.getElementsByClassName('e-resources');
                    let commentaireWorkorder = document.getElementsByClassName('custom-field-workorder');
                    console.log(commentaireWorkorder)
               
                    title[0]['style'].display = 'none';
                    subTitle[0]['style'].display = 'none';
                    Debut[0]['style'].display = 'none';
                    fin[0]['style'].display = 'none';
                    regie[0]['style'].display = 'none';
                    isAllDay[0]['style'].display = 'none';
                    repeat[0]['style'].display = 'none';
                    // commentaireWorkorder[0]['style'].display ='block'
                }
            }
            if (!args.data.AzaIsPere && args.data.isTempsReel === 0) {
                // if(commentaireWorkorderEditor.length ===0){
                //     this.createInputCommentWorkorder(args)
                // }
                let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                let repeat = document.getElementsByClassName('e-editor');
                let title = document.getElementsByClassName('e-subject-container');
                let subTitle = document.getElementsByClassName('e-location-container');
                let Debut = document.getElementsByClassName('e-start-container');
                let fin = document.getElementsByClassName('e-end-container');
                let regie = document.getElementsByClassName('e-resources');
                let commentaireWorkorder = document.getElementsByClassName('custom-field-workorder');
                console.log(commentaireWorkorder)

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
                // commentaireWorkorder[0]['style'].display = 'block';
                console.log(title[0]['style'].display, "sssssssssssssssssssssssssssssssssssssss")
                this.updateWO = true
                if (args.data.Statut != 3 ) {

                    args.cancel = true
                    console.log(args, "==> statut")
                }
            } else {
                //   let subTitle = document.getElementsByClassName('e-location-container');
                //   let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                //   let repeat = document.getElementsByClassName('e-editor');
                //   console.log('subTitle', subTitle[0]);
                //   subTitle[0]['style'].display = 'none';
                //   console.log('isAllDay :', isAllDay[0]);
                //   isAllDay[0]['style'].display = 'none';
                //   console.log('repeat', repeat[0]);
                //   repeat[0]['style'].display = 'none';                  
            }
            console.log('Open Editor');
            let inputEle: HTMLInputElement;
            let container: HTMLElement;
            let containerOperateur = document.getElementsByClassName('custom-field-container');
            console.log(containerOperateur, "containerOperateur");
            let inputEleCommantaire : HTMLInputElement;
            let commentaire:  HTMLElement;
           

            // let annuler = document.getElementsByClassName("e-event-cancel")
            // console.log(annuler);
            // annuler[0].addEventListener('click', () => {
            //     console.log("click btn annuler");
            //     this.disabledrefresh = false
            //     this.openEditor = false
            // }, true);

            // let btnClose = document.getElementsByClassName("e-dlg-closeicon-btn")
            // btnClose[0].addEventListener('click', () => {
            //     this.disabledrefresh = false
            //     this.openEditor = false
            //     this.eventClick = false
            //     console.log("click btn close");
            // }, true);

            if (args.data.hasOwnProperty('AzaIsPere')) {
                console.log('open Editor', args);
           
                console.log(this.drowDownOperateurList);
                if (args.data.AzaIsPere) { // dblclick container
                    if (containerOperateur.length === 0) {
                        console.log('containerOperateur.length = 0', containerOperateur);
                        this.createDrowDownOperteurInput(args, container, inputEle);
                        console.log("==>>", this.drowDownOperateurList);
                        this.drowDownOperateurList.onchange = args.data.Operateur = this.drowDownOperateurList.value;
                        this.drowDownOperateurList.dataSource = this.fieldMonteur['dataSource'].map(item => {
                            return { text: item.Username, value: item.idressourcetype };
                        });
                        console.log("==>>", this.drowDownOperateurList)
                        console.log(args.data.Operateur);
                       

                    }
                   
                    this.drowDownOperateurList.dataSource = this.fieldMonteur['dataSource'].map(item => {
                        return { text: item.Username, value: item.idressourcetype };
                    });
                    this.drowDownOperateurList.dataSource.unshift({ text: 'Aucun Opérateur', value: 0 });
                   
                    let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                    let repeat = document.getElementsByClassName('e-editor');
                    let title = document.getElementsByClassName('e-subject-container');
                    let subTitle = document.getElementsByClassName('e-location-container');
                    let Debut = document.getElementsByClassName('e-start-container');
                    let fin = document.getElementsByClassName('e-end-container');
                    let regie = document.getElementsByClassName('e-resources');
                    let commentaireWorkorder = document.getElementsByClassName('custom-field-workorder');

                    console.log('title', title[0]);
                    console.log('subTitle', subTitle[0]);
                    title[0]['style'].display = 'block';
                    isAllDay[0]['style'].display = 'none';
                    console.log('repeat', repeat[0]);
                    repeat[0]['style'].display = 'none';
                    Debut[0]['style'].display = 'block';
                    fin[0]['style'].display = 'block';
                    regie[0]['style'].display = 'block';
                    // commentaireWorkorder[0]['style'].display = 'none';
                   
                } else { // dblclick workorder
                    console.log(containerOperateur[0])
                    if (containerOperateur[0] != undefined || null) {
                        containerOperateur[0].parentNode.removeChild(containerOperateur[0]);
                    }
                  console.log(this.textBoxe)
                //   this.textBoxe.value = args.data.Commentaire
                    console.log("edit click")
                    if (!args.data.AzaIsPere && args.data.isTempsReel === 0) {
                        let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                        let repeat = document.getElementsByClassName('e-editor');
                        let title = document.getElementsByClassName('e-subject-container');
                        let subTitle = document.getElementsByClassName('e-location-container');
                        let Debut = document.getElementsByClassName('e-start-container');
                        let fin = document.getElementsByClassName('e-end-container');
                        let regie = document.getElementsByClassName('e-resources');
                        let commentaireWorkorder = document.getElementsByClassName('custom-field-workorder');
                        console.log('title', title[0]);
                        console.log('subTitle', subTitle[0]);
                        title[0]['style'].display = 'none';
                        subTitle[0]['style'].display = 'none';
                        Debut[0]['style'].display = 'none';
                        fin[0]['style'].display = 'none';
                        regie[0]['style'].display = 'none';
                        isAllDay[0]['style'].display = 'none';
                        console.log('repeat', repeat[0]);
                        repeat[0]['style'].display = 'none';
                        // commentaireWorkorder[0]['style'].display = 'block';
                        console.log(title[0]['style'].display, "sssssssssssssssssssssssssssssssssssssss")
                    
                    }
                  
                }
                if(!args.data.AzaIsPere && args.data.Statut !=3 ){
                    args.cancel = true
                }
            
                console.log(isTempsReel,"le container contient des temps reels")
                if(args.data.AzaIsPere && isTempsReel.length>0  ){
                    args.cancel = true;
                }
                if(this.operateur.checked == true){
                    args.cancel = true;

                  }else{
                    args.cancel = false;
                }
            } else {
                if (args.name === 'popupOpen' && args.type === 'Editor') {

                        args.cancel = false

                        if(this.operateur.checked == true){
                            args.cancel = true;
  
                          }else{
                            args.cancel = false;
                        }

                  
                      let title = document.getElementsByClassName('e-subject-container');
                      let subTitle = document.getElementsByClassName('e-location-container');
                      let Debut = document.getElementsByClassName('e-start-container');
                      let fin = document.getElementsByClassName('e-end-container');
                      let regie = document.getElementsByClassName('e-resources');
                      let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                      let repeat = document.getElementsByClassName('e-editor');
                      let commentaireWorkorder = document.getElementsByClassName('custom-field-workorder');
                    //   commentaireWorkorder[0]['style'].display = 'none';
                      title[0]['style'].display = 'block';
                      subTitle[0]['style'].display = 'none';
                      Debut[0]['style'].display = 'block';
                      fin[0]['style'].display = 'block';
                      regie[0]['style'].display = 'block';
                      console.log('Debut', Debut);
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
                      let commentaireWorkorder = document.getElementsByClassName('custom-field-workorder');
                    //   commentaireWorkorder[0]['style'].display = 'none';
                      }
                    // let save = document.getElementsByClassName("e-event-save")
                    // console.log(save);
                    // save[0].addEventListener('click', () => {
                    //     if (this.filtreRegie && args.target === "e-appointment") {
                    //         console.log("this.departmentDataSource  before", this.departmentDataSource)
                    //         this.departmentDataSource = this.listeRegies
                    //         this.openEditor = false
                    //         this.openSideBar = false
                    //         console.log('click save ', this.departmentDataSource)
                    //     }
                    // }, true);

                    
                    // };

                }
                if(commentaireWorkorderEditor.length ===0){
                    // this.createInputCommentWorkorder(args)
                  
                    console.log(this.textBoxe)
                }

                if (containerOperateur.length === 0) {
                    this.createDrowDownOperteurInput(args, container, inputEle);
                    this.drowDownOperateurList.onchange = args.data.Operateur = this.drowDownOperateurList.value;
                    

                }
                this.drowDownOperateurList.dataSource = this.fieldMonteur['dataSource'].map(item => {
                    return { text: item.Username, value: item.idressourcetype };
                });
              
            }
            
         
            this.openEditorCount = 1;
            this.eventClick = false;
          

            // this.timelineResourceDataOut.map(item => {
            //     if (item.AzaNumGroupe === args.data.AzaNumGroupe && item.AzaIsPere === false && item.isTempsReel === 0) {

            //         if (item.Statut != 3) {

            //             args.cancel = true
            //             console.log(args, "==> statut")
            //         } 
            //         if (item.Statut === 3)  {
            //             args.cancel = false
            //         }
            //     }
            // });
        } else if ((args.type === 'Editor') && this.checkIfContainerAlreadyExists(args)) {
            console.log('this.checkIfContainerAlreadyExists(args); => ', this.checkIfContainerAlreadyExists(args));
            args.cancel = true;
            this.timelineResourceDataOut.map(item => {
                if (item.AzaNumGroupe === args.data.AzaNumGroupe && item.AzaIsPere === false && item.isTempsReel === 0) {

                    if (item.Statut != 3) {

                        args.cancel = true
                        console.log(args, "==> statut")
                    } else {
                        args.cancel = false
                    }
                }
            });

        }


        if (args.target != undefined && (args.target.classList.value === "e-header-cells e-current-day" || args.target.classList.value === "e-header-cells")) {
            args.data.cancel = true;
            args.cancel = true;

            console.log(args, "-----------------------------------")

            if (this.scheduleObj.currentView === "TimelineWeek") {
                if (args.type = "QuickInfo") {
                    (this.scheduleObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as any).click();
                    // let calendar = (this.scheduleObj.element.querySelectorAll('.e-calendar')[0] as any).ej2_instances[0];
                    // // console.log(calendar)
                    // calendar.value = args.data.startTime;
                    this.scheduleObj.selectedDate = args.data.startTime
                    this.scheduleObj.currentView = "TimelineDay";
                    let day = this.scheduleObj.element.querySelectorAll('.e-timeline-day');
                    addClass([day[0]], ['e-active-view']);
                    let week = this.scheduleObj.element.querySelectorAll('.e-timeline-week');
                    removeClass([week[0]], ['e-active-view']);
                    (this.scheduleObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as any).click();
                }
            }
        }


        // if (args.target.classList.contains("e-appointment")) {
        //     let subject = (document.querySelector(args.data.AzaIsPere) as any);
        //     subject.value = args.data.Name;
        // }

    }
  
    onPopupClose(args) {
        console.log(args)
        /* clic sur le btn annuler ou fermer de la modale d'edition */ 
        if(args.data == null ){ 
            console.log("annuler ou btnclose")
            console.log(this.creationArray);
            this.creationArray = [];
            this.disabledrefresh = false;
            this.openEditor = false;
            this.eventClick = false;
            this.isTreeItemDropped=false;
            this.dataToEdit = [];
        
        }else{
            console.log("sauvegarder")

            if (this.dataToEdit != undefined) { //display a modale to navigate when change the date
                let initialDate = this.dataToEdit.StartTime.getDate()
                let changedDate = args.data["StartTime"].getDate()
                let date = moment(args.data["StartTime"]).format('DD-MM-YYYY').toString()
                console.log(initialDate, changedDate);
                let isSameDay = moment(this.dataToEdit.StartTime).isSame(args.data["StartTime"], 'day');
                console.log(isSameDay,"is same day")
                // add isslotaviable
                let isSlotAviable = this.scheduleObj.isSlotAvailable(args.data)
                console.log(isSlotAviable)
                if (this.scheduleObj.currentView === "TimelineDay") {
                    if (!isSameDay) {
                        console.log("timelineDay")
                        swal({
                            title: '',
                            text: `Souhaitez-vous naviguer vers la date: ${date}`,
                            showCancelButton: true,
                            confirmButtonText: 'oui',
                            cancelButtonText: 'non',
                            allowOutsideClick: false

                        }).then((oui) => {
                            console.log(oui)
                            this.scheduleObj.eventSettings.dataSource = []
                            this.departmentGroupDataSource = [];
                            if (oui.value) {
                               
                                // calendar.value = event.data["StartTime"];

                                this.scheduleObj.selectedDate = args.data["StartTime"]
                            } else {
                                // this.refreshScheduler()
                                this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut
                            }
                      
                        })
                      
                    }
                } else {
                    //         let startOfWeek = moment(initialDate).startOf('week'),
                    //             endOfWeek = moment(initialDate).endOf('week'),
                    let isSameWeek = moment(this.dataToEdit.StartTime).isSame(args.data["StartTime"], 'week')
                    // if (startOfWeek.format('D') <= )
                    console.log(isSameWeek, "is the same week")
                    if (this.scheduleObj.currentView === "TimelineWeek") {
                        if (!isSameWeek) {
                            swal({
                                title: '',
                                text: `Souhaitez-vous naviguer vers la date: ${date}`,
                                showCancelButton: true,
                                confirmButtonText: 'oui',
                                cancelButtonText: 'non',
                                allowOutsideClick: false

                            }).then((oui) => {
                                console.log(oui)
                                this.scheduleObj.eventSettings.dataSource = []
                                this.departmentGroupDataSource = [];
                                if (oui.value) {
                                    // (this.scheduleObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as any).click();
                                    // let calendar = (this.scheduleObj.element.querySelectorAll('.e-calendar')[0] as any).ej2_instances[0];
                                    // // console.log(calendar)
                                    // calendar.value = event.data["StartTime"];

                                    this.scheduleObj.selectedDate = args.data["StartTime"]
                                } else {
                                    this.refreshScheduler()
                                }
                    
                            })
                          
                        }
                    }
                }
            }
        }
        this.isTreeItemDropped=false;
       
        console.log(this.textBoxe)
    } 
    popupContaint(workOrders,row){
        for (let i = 0; i < workOrders.length; i++) {
             
            let statut =workOrders[i].Statut;
            if (statut == 3){
             row.innerHTML += `<div class="${workOrders[i].Id}"><div id='id${i}'  style="color : black; font-size:10px">${workOrders[i].titreoeuvre}&nbsp;/&nbsp;${workOrders[i].titreepisode} ep ${workOrders[i].numepisode} </div> <span id='id${workOrders[i].Id}' class='e-icons delete icon-vue ' title='Supprimer définitivement' ></span> <span id='backlog${workOrders[i].Id}' class='e-icons M_PV_Redo  icon-vue ' title='Retour au backlog' ></span> </div> `;
            }else{
             row.innerHTML += `<div><div id='id${i}' style="color : black; font-size:10px">${workOrders[i].titreoeuvre}&nbsp;/&nbsp;${workOrders[i].titreepisode} ep ${workOrders[i].numepisode} </div></div> `;

            }
             let element = document.getElementById('id' + i)
            let couleur
            this.statutWorkorder.map(statut => {
                if (workOrders[i].Statut === statut["Code"]) {
                    couleur = statut['Color']
                }
                element.style.backgroundColor = couleur
                this.workOrderColor = couleur
            })
        
        }

    }




    addButtonDelete(args, isTempsReel){ //Ajouter un bouton pour la suppression définitive 
        if( this.eventClick && (args.data.Statut == 3 || args.data.AzaIsPere) ){
            let elementPopOpen  = args.element.querySelector('.e-header-icon-wrapper');
            console.log(elementPopOpen)
            // let btnCalendar = createElement('div'); 
            if(elementPopOpen!= null  ){
            let rowBtnDelete= createElement('div');
           
            elementPopOpen.prepend(rowBtnDelete)
       
            console.log(args.data.Id)
           
            rowBtnDelete.innerHTML=`<div id='${args.data.Id}id' class='e-icons BT_Remove icon-vue ' title='Supprimer définitivement' ></div>`
      
            console.log(rowBtnDelete)
        }
            let btnDelete = document.getElementById(args.data.Id+ 'id') //btn de suppression définitive 
            console.log(btnDelete)
            console.log(isTempsReel)
            if( isTempsReel.length==0 ){ //affichage uniquement pour les taches non commencées
                let removeIcone = document.getElementsByClassName('BT_Remove');
                removeIcone[0]['style'].display = 'block';
                if( this.Ecriture.checked == true){ //masquer le btn si y'a que les workorders qui sont affichées
                console.log(btnDelete)
                    removeIcone[0]['hidden'] = true;
                    console.log( removeIcone)
                }else{
                    removeIcone[0]['hidden'] =false;
                    console.log( removeIcone)
                }
            }else{     
                let removeIcone = document.getElementsByClassName('BT_Remove');
                removeIcone[0]['style'].display = 'none';
    
            }
    
            if(!args.data.AzaIsPere && args.data.Statut ==3 ){
                let removeIcone = document.getElementsByClassName('BT_Remove');
                removeIcone[0]['style'].display = 'block';
              }
            if(this.scheduleObj.currentView == "TimelineMonth"){
                let removeIcone = document.getElementsByClassName('BT_Remove');
                removeIcone[0]['style'].display = 'none';
            }
                
                btnDelete.addEventListener('click', () => { 
                    let container 
                    if(!args.data.AzaIsPere){
                     let     workorder =  this.timelineResourceDataOut.filter(item => item.Id === args.data.AzaNumGroupe)
                     container = workorder[0]
                    }else{
                        container = args.data
                    }
                 console.log(container)
               if(!this.checkIfContainerHasATempsReel(container,container.Id)){
                    if(!args.data.AzaIsPere && args.data.Statut == 3){
                        let event = args.data
                  console.log("click new btn delete",btnDelete)
                  swal({
                    title: 'Supprimer définitivement le workorder',
                    text:  'souhaitez-vous supprimer définitivement le workorder ?',
                    showCancelButton: true,
                    allowOutsideClick: false,
                    cancelButtonText: 'NON',
                    confirmButtonText: 'SUPPRIMER'
                }).then((result) => {
                    if (result.value) {
                        // this.deleteWorkOrder(event) //suppression définitive du workorder
                        console.log(this.allDataWorkorders)
                        let workorderDataBrut = this.allDataWorkorders.filter(item =>item.Id_Planning_Events == event.Id)
                       
                      
                        console.log(workorderDataBrut)
                        this.updateStatutWorkorderBeforeDelete(workorderDataBrut[0]["Id_Planning_Events"],workorderDataBrut[0],'planner')
                 
                    }
                })
                }else {
                    let containerPere = this.timelineResourceDataOut.filter(item =>  args.data.AzaNumGroupe== item.Id && item.AzaIsPere )
                    let workorderexist = this.timelineResourceDataOut.filter(item =>  args.data.AzaNumGroupe== item.AzaNumGroupe && !item.AzaIsPere )
                    swal({
                        title: 'Supprimer le container ',
                        text:  'souhaitez-vous supprimer le container définitivement ?',
                        showCancelButton: true,
                        allowOutsideClick: false,
                        cancelButtonText: 'NON',
                        confirmButtonText: 'SUPPRIMER'
                    }).then((result) => {
                        if (result.value) {
                            console.log(containerPere)
                            console.log(workorderexist)
                            if(workorderexist.length > 0){
                               
                              console.log("container avec workorder")
                              workorderexist.map(item =>{
                        let workorderDataBrut = this.allDataWorkorders.filter(itemBrut =>itemBrut.Id_Planning_Events == item.Id)

                                  this.updateStatutWorkorderBeforeDelete(workorderDataBrut[0].Id_Planning_Events,workorderDataBrut[0],'planner')
                          
                                // this.deleteWorkOrderForGood(item.Id,'planner') 
                                
                              })
                              let startDifferent = this.checkDiffExistById(containerPere, this.timelineResourceDataOut, 'StartTime', 'StartTime');
                              let endDifferent = this.checkDiffExistById(containerPere, this.timelineResourceDataOut, 'EndTime', 'EndTime');
                          this.eventSettings = {
                                      dataSource: <Object[]>extend([],
                                          this.calculDateGroup(
                                              this.timelineResourceDataOut,
                                              args.data.AzaNumGroupe,
                                              true,
                                              containerPere,
                                              startDifferent,
                                              endDifferent
                                          ), null, true),
                                    //   enableTooltip: true, tooltipTemplate: this.temp
                                  };
                            }
                            this.deleteContainerForGood(containerPere[0].Id, args.data);
                        }
                    })
                
              
                }
                this.eventClick = false
            }else{
                this.dialogRefresh()
            }
                }, true);
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

     public eventsContainer:any = []
     public eventsResult =[]
     public  chekIfEqual  = []
     public statutDifferent = false
    checkIfContainerHasATempsReel(data: any ,id: number):boolean{
        let eventTempsReel
        let oldData:any =[];


        this.workorderService
        .getWorkOrderByContainerId(id)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(res => {
         let workorders = res
         console.log(res)
         if(workorders.length >0){
            this.eventsResult = []
            this.eventsContainer = []
         workorders.map(item =>{ 
           let workOrder = {
            Id: item.Id_Planning_Events,
            Name: item.titreoeuvre,
            StartTime: item.DateDebutTheo,
            EndTime: item.DateFinTheo, 
            CodeRessourceSalle: item.CodeRessourceSalle,
            Container: false,
            numGroup: data.Id,
            Description: item.Commentaire_Planning,
            Operateur: data.Operateur,
            coordinateurCreate: item.UserEnvoi,
            Statut: item.Statut,
            AzaIsPere: false,
            AzaNumGroupe: data.Id,
            DepartmentID: item.CodeRessourceSalle,
            ConsultantID: 2,
            DepartmentName: '',
            IsAllDay: false,
            libchaine: item.libchaine,
            typetravail: item.typetravail,
            titreoeuvre: (item.titreoeuvre === null || typeof (item.titreoeuvre) === 'undefined') ? '' : item.titreoeuvre,
            numepisode: item.numepisode,
            dureecommerciale: item.dureecommerciale,
            libtypeWO: item.libtypeWO,
            Commentaire_Planning: item.Commentaire_Planning,
            Commentaire_Planning_rtf:item.Commentaire_Planning,
            IdGenerationWO: item.IdGenerationWO,
            isTempsReel: 0,
            IsReadonly: false,
            Id_Planning_Events_TempsReel: 0,
            titreepisode: item.titreepisode,
            DateDebutReel: item.DateDebut,
            DateFinReel: item.DateFin,
            CodeRessourceCoordinateur: data.CodeRessourceCoordinateur,
            Commentaire:item.Commentaire

            
           }
           this.eventsContainer.push(workOrder)
       
         })
         oldData = this.timelineResourceDataOut.filter(item => {
            if( item.AzaNumGroupe === id && !item.AzaIsPere){
                return item.Statut
            }
            
            })
           let eventsResult = workorders.map(item=>{  
                        return item.Statut
                            
                        })
         console.log(oldData,"old event")
      
         for(let i=0 ; i<oldData.length; i++){
             console.log(this.eventsContainer[i], oldData[i].Statut)
                if( eventsResult[i] != oldData[i].Statut ){
                    
                    this.eventsResult.push(oldData[i] )
                  console.log(this.eventsResult)
               
                }
                
        
            }
        // }
      
        console.log(this.eventsResult,'new event')
        if( this.eventsResult.length>0){
            this.statutDifferent = true
            console.log("y'a un statut different", this.statutDifferent )
        
             }else{
              this.statutDifferent = false
              console.log("y'a pas un statut different", this.statutDifferent )
              
             }
            } else {
                this.statutDifferent = false
            }
           
        })
   
         if(this.statutDifferent){
             return true 
         } else{
             return false 
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
            return { text: item.Username, value: item.idressourcetype };
        });
        this.drowDownMonteurs.unshift({ text: 'Aucun Opérateur', value: 0 });
        this.drowDownOperateurList = new DropDownList({
            dataSource: this.drowDownMonteurs,
            fields: { text: 'text', value: 'text' },
            value: args.data.Operateur,
            floatLabelType: 'Always', placeholder: 'Opérateur'
        });
        this.drowDownOperateurList.appendTo(inputEle);
        inputEle.setAttribute('name', 'Operateur');
        args.data.Operateur = this.drowDownOperateurList.value;
        this.drowDownExist = true;
    }
    public textBoxe :TextBox //commentaire workorder dans popup editor
    public valueCommentaire : string// valeur du commenteire workorder
    public previousValueCommentaire : string
    createInputCommentWorkorder(args){ //add comment workorder to popup
                let row: HTMLElement = createElement('div', { className: 'custom-field-row' });
                let formElement: HTMLElement = args.element.querySelector('.e-schedule-form');
                console.log(formElement[0])
                formElement.firstChild.insertBefore(row, args.element.querySelector('.e-description-row'));
                let container: HTMLElement = createElement('div', { className: 'custom-field-workorder' });
                let inputEle: HTMLTextAreaElement = createElement('input', {
                    className: 'e-input', attrs: { name: 'Commentaire Workorder' }
                }) as HTMLTextAreaElement; 

                this.textBoxe  = new TextBox({
            floatLabelType: 'Auto', placeholder: 'Commentaire Workorder',
            value: args.data.Commentaire,
            change:(e)=>{
                console.log(e)
                this.valueCommentaire = e.value
                this.previousValueCommentaire = e.previousValue
            }
          })  ; 
              
            
                      
                container.appendChild(inputEle);
                row.appendChild(container);
                this.textBoxe.appendTo(inputEle);
       
                inputEle.setAttribute('name', 'Commentaire Workorder');
         
               
                console.log(  this.valueCommentaire)
                console.log(args.data.Commentaire,"args.data.Commentaire")
    }
public dialogRef
    openDialog(couleurWorkorder, object, subObject, categories,placeClick?): void { // open workorder modal from container list
        let category;
        let containerModal = document.getElementsByClassName('cdk-overlay-container');
        for (let i = 0; i < containerModal.length; i++) {
            // containerModal[i].classList.remove('hidden');
            containerModal[i]['style'].display='block'
        }
        categories.map(item => {
            if (object.DepartmentID === item.Id) {
                category = item;
            }

        });
        let couleur
        this.statutWorkorder.map(statut => {
            if (statut['Code'] === subObject.Statut) {
                couleur = statut['Color']
            }
        })
 
      this.dialogRef = this.dialog.open(WorkorderDetailsModalComponent, {
            width: '365px',
            data: {
                workorder: subObject,
                regie: category,
                color: couleur,
                placeClick:placeClick
            }
        });
    }

    /*************************************************************************/
    /********************** DRAG AND DROP M1ANAGEMENT ***********************/
    public eventDragStart
    public argsDragStart
    onDragStart(args: DragEventArgs) {
        console.log('onDragStart args =======> ', args);
        this.eventDragStart = args.data
        this.argsDragStart = args  
        this.checkIfContainerHasATempsReel(args["data"],+args["data"]["Id"]);
        args.scroll.timeDelay=0;
        if (args.event.target["className"] === "e-time-slots") {
            this.updateEvents = false;
        }else {
            this.updateEvents =true;
        }
        // args.element["ej2_instances"][0].clone = false
        // if (args.data['AzaIsPere'] == false) {
        //     swal({
        //         title: 'Attention',
        //         text: `Vous ne pouvez pas effectuer cette action `,
        //         showCancelButton: false,
        //         confirmButtonText: 'Fermer',
        //         cancelButtonText: 'non',
        //         allowOutsideClick: false

        //     }).then((Fermer) => {
        //         console.log(Fermer)

        //         if (Fermer.value) {
        //             console.log(args)
        //             this.disabledrefresh = false
        //             this.updateEventSetting(this.timelineResourceDataOut)
        //         }
        //     })
          
        // }else{
        //     args.cancel = false
        // }
        console.log(this.scheduleObj)
    }
    public groupIndex
    public eventItemDrag
    onItemDrag(event: any, tabIndex): void { // FUCNTION FROM TEMPLATE
        event.interval = 5;
        this.disabledrefresh = true
 
        console.log('onItemDrag event ==> ', event)
        this.eventItemDrag = event.data
        this.groupIndex = event.groupIndex
        if (event.name === 'nodeDragging') {
            //   console.log('nodeDragging event => ', event)
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
    targetDrop
public updateEvents : boolean =true 
    onDragStop(args: DragEventArgs) {
        console.log('onDragStop args =======> ', args, args.event)

        //     }

        if (args.event.target["className"] === "e-work-cells e-work-hours"  || args.event.target["className"] === "e-work-cells e-alternate-cells e-work-hours" ) {
            this.disabledrefresh = false
            this.updateEvents = true //le workorder seras mis à jour
        }
        
 
          
   

        console.log(this.updateEvents)
    
        if (args.target["className"] === "badge badge-info"){
        //    this.timelineResourceDataOut.map(item => {
        //        if(item.Id == args["data"].Id){
        //            args["data"].StartTime = item.StartTime;
        //            args["data"].EndTime = item.EndTime
        //        }
        //    })
        
            this.updateEvents = false
            let itemDrag = this.timelineResourceDataOut.filter(item => item.Id === args["data"].Id)
            console.log(itemDrag)
            this.eventSelecte.push(itemDrag[0])
            let eventArray = []
            this.eventSelecte.sort((a, b) => {
                return +a.Id - +b.Id
            })
            console.log(this.eventSelecte)
            for (let i = 0; i < this.eventSelecte.length; i++) {
                if (i == 0) {
                    eventArray.push(this.eventSelecte[i])
                } else if (+this.eventSelecte[i - 1].Id != +this.eventSelecte[i].Id) {
                    console.log("item different ", this.eventSelecte[i - 1].Id, this.eventSelecte[i].Id)
                    eventArray.push(this.eventSelecte[i])
                    console.log(eventArray)
                }
            }
            console.log(eventArray, "eventArray ===>")
            this.eventSelecte = eventArray
            console.log(this.allDataWorkorders)

            // if( itemDrag[0].AzaIsPere){

            let containerBrutSelected = this.allDataContainers.filter(itemBrut => itemBrut.Id_Planning_Container === itemDrag[0].Id);
            this.containerBrutSelected.push(containerBrutSelected[0])
            // }else{

            console.log(this.containerBrutSelected)
            console.log(this.workorderbrutSelected)
            for(let i=0 ; i<this.timelineResourceDataOut.length; i++){
                if(this.timelineResourceDataOut[i].AzaNumGroupe == itemDrag[0].Id&& !this.timelineResourceDataOut[i].AzaIsPere){
                  this.workorderSelected.push(this.timelineResourceDataOut[i])
                }
            }//recupérer les workorder des container selectonnés 
            console.log(this.workorderSelected)
            this.workorderSelected.map(itemWo => {
                if (itemWo.AzaNumGroupe == itemDrag[0].Id) {
                    console.log(itemWo, "item workorder")
                    let workorderbrutSelected = this.allDataWorkorders.filter(itemBrut => itemBrut.Id_Planning_Events === itemWo.Id);
                    console.log(workorderbrutSelected)
                    if (workorderbrutSelected != []) {
                        this.workorderbrutSelected.push(workorderbrutSelected[0])
                        // }
                    }
                }
            })
            //  this.onActionComplete(this.argsOnActionComplete);
            this.disabledrefresh = false;
        }
        console.log(this.updateEvents, "zzzzzzz")

    }

    public onTreeDragStartCountDevTool = 0;
    onTreeDragStart(event) {
        console.log(this.onTreeDragStartCountDevTool);
        this.onTreeDragStartCountDevTool++;
        console.log('call onTreeDragStart() / event => ', event);
        console.log(this.treeObj);
        event.draggedParentNode.ej2_instances[1].enableAutoScroll = false //treeview 

        let operateur = this.fieldMonteur['dataSource'].filter(item => item.typeressource == null)
        console.log(operateur)
        operateur.map(item => {

            if (item.idressourcetype == event.draggedNodeData.id) {
                event.cancel = true
                swal({
                    title: 'Attention',
                    text: `Vous ne pouvez pas effectuer cette action, l'opérateur n'a pas de statut : Intermittent ou Permanent `,
                    showCancelButton: false,
                    confirmButtonText: 'Fermer',
                    cancelButtonText: 'non',
                    allowOutsideClick: false

                })
                console.log("ressource type nullll ")
            }
        })
    }

    selectTabWitoutSwip(e: SelectEventArgs) {
        if (e.isSwiped) {
            e.cancel = true;
        }
    }

    /******* DRAG AND DROP WORKORDERS *******/

    onTreeDragStop(event: DragAndDropEventArgs): void {
        console.log(event)
         let checkIfExist = [];
        if (event["name"] === "nodeDragStop") {
            this.disabledrefresh = false
            console.log("tree drag stop")
            let indexContainerEvent = this.findIndexEventById(event.target.id);
            let containerSelected = this.timelineResourceDataOut[indexContainerEvent];
      
           
            checkIfExist = this.workorderSelectedInBacklog.filter(item=>{
                if (item.Id === +event.draggedNodeData.id ){
                    return item
                }
            })
            if(checkIfExist.length ==0){
                this.workorderSelectedInBacklog = []
            }
            console.log(this.workorderSelectedInBacklog)
            console.log(containerSelected)
        }
        this.creationArray = [];
        this.newData = [];
        let treeElement = closest(event.target, '.e-treeview');
        if (!treeElement) {
            console.log(event)
          
            // event.cancel = true;
           
            let scheduleElement: Element = <Element>closest(event.target, '.e-content-wrap');
      
            if (scheduleElement) {  //e-content-wrap
                let treeviewData: { [key: string]: Object }[] =
                    this.treeObj.fields.dataSource as { [key: string]: Object }[];
                if (event.target.classList.contains('e-work-cells')) {// IF EMPLACEMENT EST VIDE
                    console.log(treeviewData)
                    var filteredData: { [key: string]: Object }[] =
                        treeviewData.filter((item: any) => item.Id === parseInt(event.draggedNodeData.id as string, 10));
                    this.randomId();
                    console.log('last Random id : ', this.lastRandomId);
                    console.log('event target : ', event.target);
                    let codeRessourceCoordinateur = this.currentCoordinateur.IdCoord;
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
                        IsReadonly: false,
                        isTempsReel: 0,
                        CodeRessourceCoordinateur: codeRessourceCoordinateur
                    };
                    console.log(filteredData[0], 'filteredData[0]');

                    this.creationArray.push(containerData);
                    if( this.workorderSelectedInBacklog.length == 0){ //si n'y as pas de multiselection,push l'evenement drag & dropper
                        this.workorderSelectedInBacklog.push(filteredData[0])
                    }
                    console.log( this.workorderSelectedInBacklog)
              
                    this.workorderSelectedInBacklog.map(item =>{
                       
                        filteredData[0] = item 
                    let eventData: { [key: string]: Object } = { // DISPLAY DATA FOR EVENT
                        Id:filteredData[0].Id ,

                        Name: filteredData[0].titreoeuvre,
                        StartTime: filteredData[0].StartTime,
                        EndTime: filteredData[0].EndTime,
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
                        Commentaire_Planning_rtf:filteredData[0].Commentaire_Planning,
                        libtypeWO: filteredData[0].libtypeWO,
                        IdGenerationWO: filteredData[0].IdGenerationWO,
                        isTempsReel: 0,
                        IsReadonly: false,
                        Id_Planning_Events_TempsReel: 0,
                        titreepisode: filteredData[0].titreepisode,
                        DateDebutReel: filteredData[0].DateDebutReel,
                        DateFinReel: filteredData[0].DateFinTheo,
                        libelleStatut: filteredData[0].libelleStatut,
                        CodeRessourceCoordinateur: filteredData[0].codeRessourceCoordinateur,
                        Commentaire:filteredData[0].Commentaire

                    };

                    console.log(eventData,"eventData")
                    this.creationArray.push(eventData);
                    this.draggedItemId = event.draggedNodeData.id as string;
                    this.newData = this.field['dataSource'].filter(item => {
                        if (+item.Id !== +this.draggedItemId) {
                            return item;
                        }
                    }
                    );
               
                })     
                console.log(this.creationArray)
             
                  this.creationArray = this.creationArray.sort((a,b)=>{
                      return a.Id - b.Id
                  })
          
                
                    console.log(containerData);
                    console.log(this.creationArray);
                    this.scheduleObj.openEditor(containerData, 'Add', true);
                    this.isTreeItemDropped = true;

                } else {  // IF EMPLACEMENT EST DEJA PRIS PAR UN CONTENEUR
                    if (event.target.id) {
                      console.log("aaaaaaaaaaaaaaa Ajout à un container deja existant",+event.target.id)

                        let indexContainerEvent = this.findIndexEventById(event.target.id);
                        let containerSelected = this.timelineResourceDataOut[indexContainerEvent];
                        console.log(containerSelected)
                        //vérifier si le container n'a pas de taches deja commencée
                          let otherworkorderBegin = this.timelineResourceDataOut.filter(item =>item.AzaNumGroupe == containerSelected.Id && item.Statut !=3 && !item.AzaIsPere)
                          console.log("otherworkorder ===>",otherworkorderBegin)
   
                        this.checkIfContainerHasATempsReel(containerSelected,containerSelected.Id)

                        setTimeout(() => {
                        if(!this.checkIfContainerHasATempsReel(containerSelected,containerSelected.Id) && otherworkorderBegin.length ==0 ){
                        console.log( this.statutDifferent,"this.statutDifferent")
                        console.log('containerSelected => ', containerSelected);
                        if( this.workorderSelectedInBacklog.length == 0){
                        var filteredDataW =
                            treeviewData.filter((item: any) => item.Id === parseInt(event.draggedNodeData.id as string, 10));
                            this.workorderSelectedInBacklog.push(filteredDataW[0])
                            console.log( this.workorderSelectedInBacklog)
                        }
                        let container = this.allDataContainers.filter(item => item.Id_Planning_Container === containerSelected.Id);
                        let containerDataSelected = container[0];
                        console.log('container => ', container);
                        console.log('containerDataSelected => ', containerDataSelected);
                        let otherWorkorder = []
                        otherWorkorder = this.timelineResourceDataOut.filter(item => item.AzaNumGroupe === containerSelected.Id && ! item.AzaIsPere )
                        console.log(otherWorkorder, "other workorder exist in cotainer target")
                        if(otherWorkorder.length>0){
                            otherWorkorder.map(item =>{
                             this.workorderSelectedInBacklog.unshift(item)
                             this.timelineResourceDataOut = this.timelineResourceDataOut.filter(itemTimelineRessource => itemTimelineRessource.Id!= item.Id)
                             console.log( this.workorderSelectedInBacklog)
                            })
                        }else{
                            console.log( this.workorderSelectedInBacklog)
                         
                        }
                        
                        
                      
                       
                       
                        if( this.workorderSelectedInBacklog.length == 1  ){
                        this.workorderSelectedInBacklog.map(item =>{
                            console.log(item)
                            
                            filteredDataW[0] = item
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
                            Operateur: containerSelected.Operateur,
                            Statut: filteredDataW[0].Statut,
                            libchaine: filteredDataW[0].libchaine,
                            typetravail: filteredDataW[0].typetravail,
                            titreoeuvre: (filteredDataW[0].titreoeuvre === null || typeof (filteredDataW[0].titreoeuvre) === 'undefined') ? '' : filteredDataW[0].titreoeuvre,
                            numepisode: filteredDataW[0].numepisode,
                            dureecommerciale: filteredDataW[0].dureecommerciale,
                            libtypeWO: filteredDataW[0].libtypeWO,
                            Commentaire_Planning: filteredDataW[0].Commentaire_Planning,
                            Commentaire_Planning_rtf:filteredDataW[0].Commentaire_Planning,
                            IdGenerationWO: filteredDataW[0].IdGenerationWO,
                            isTempsReel: 0,
                            IsReadonly: false,
                            Id_Planning_Events_TempsReel: 0,
                            titreepisode: filteredDataW[0].titreepisode,
                            DateDebutReel: filteredDataW[0].DateDebutReel,
                            DateFinReel: filteredDataW[0].DateFinTheo,
                            libelleStatut: filteredDataW[0].libelleStatut,
                            CodeRessourceCoordinateur: containerSelected.CodeRessourceCoordinateur,
                            CodeRessourceOperateur:containerDataSelected.CodeRessourceOperateur,
                            Commentaire:filteredDataW[0].Commentaire
                        };
                        this.creationArray.push(newEventData);
                        this.isTreeItemDropped = true;
                        console.log('filteredDataW : ', filteredDataW);
                        console.log(newEventData, "new event data")
                        console.log('containerDataSelected : ', containerDataSelected);
                        // console.log( this.eventsResult.length , this.eventsResult)
                   console.log(this.allDataWorkorders)
                            console.log('statut pas different')
                        this.updateWorkorderInDragDropAddToContainer(newEventData, containerDataSelected);
                        // this.timelineResourceDataOut.push(newEventData);
                    // })
                        this.draggedItemId = event.draggedNodeData.id as string;
                        let nData = this.field['dataSource'].filter(item => {
                            if (+item.Id !== +this.draggedItemId) {
                                return item;
                            }
                        }
                        );
                        this.field['dataSource'] = nData;
                        this.treeObj.fields.dataSource = this.field['dataSource'];
                        // this.onActionComplete('e');
                        }) }
                           // this.scheduleObj.eventSettings.tooltipTemplate = this.temp;
                           if( this.workorderSelectedInBacklog.length > 1 ){
                           
                            this.workorderSelectedInBacklog.map(item =>{
                                console.log(item,"item workorder")
                                //item ==>workororder
                                //containerSelected ==> container
                                // containerDataSelected ==> container brut
                        this.updateWorkOrderMultiselect(item, containerSelected, containerDataSelected)
                  
                    })
                        }
                        
                        
                    }else{
                        this.dialogRefresh()
                                console.log('statut different')
                    }
                }, 200);
                    }
                }
            }
        }


    }


    /******* DRAG AND DROP OPERATEURS *******/

    onTreeDragStopMonteur(event: DragAndDropEventArgs): void {
        console.log(event)
        if (event["name"] === "nodeDragStop") {
            this.disabledrefresh = false
            console.log("tree drag stop")
            let container = this.timelineResourceDataOut.filter(item => item.Id === +event.target.id )
            if(container.length>0){
                                this.checkIfContainerHasATempsReel(container,+event.target.id)
                            }
        }
        let point = "."
        let text = event.draggedNode.innerText
        let operateur = text.split(point)
        this.creationArray = [];
        let treeElement = closest(event.target, '.e-treeview');
        let classElement = this.scheduleObj.element.querySelector('.e-device-hover');
        if (classElement) {
            classElement.classList.remove('e-device-hover');
        }
        if (!treeElement) {
            let codeRessourceCoordinateur = this.currentCoordinateur.IdCoord;
            event.cancel = true;
            let scheduleElement: Element = <Element>closest(event.target, '.e-content-wrap');
            if (scheduleElement) {
                let treeviewData: { [key: string]: Object }[] =
                    this.treeObjMonteur.fields.dataSource as { [key: string]: Object }[];
                console.log('treeviewData  : ', treeviewData);
                console.log('fieldMonteur  : ', this.fieldMonteur);

                var filteredData: { [key: string]: Object }[] =
                    treeviewData.filter((item: any) => item.idressourcetype === parseInt(event.draggedNodeData.id as string, 10) && item.Username === operateur[0]);
                console.log(filteredData)
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
                        coordinateurCreate: this.user.initials,
                        IsReadonly: false,
                        isTempsReel: 0,
                        CodeRessourceCoordinateur: codeRessourceCoordinateur
                    };
                  
                    // this.timelineResourceDataOut.push(containerData); // filteredData[0]
                    this.creationArray.push(containerData);
                    console.log('creation array ==============', this.creationArray);
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
                    var filteredData: { [key: string]: Object }[] =
                        treeviewData.filter((item: any) => item.idressourcetype === parseInt(event.draggedNodeData.id as string, 10) && item.Username === operateur[0]);
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
                            coordinateurCreate: this.user.initials,
                            IsReadonly: false,
                            isTempsReel: 0,
                            CodeRessourceCoordinateur: codeRessourceCoordinateur
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
                    // console.log(container)
                        this.isTreeItemDropped = true;
                        this.isTreeItemDroppedMonteur = true;
                        console.log(filteredData[0] ,event.draggedNodeData.id )
                        console.log(this.eventsResult.length)
               
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
    public firstZoom = 0;
    public argsOnActionBegin
    public resCollection
    onActionBegin(event: ActionEventArgs& ToolbarActionArgs): void {
        this.containerParent = {};
        console.log('onActionBegin()');
        console.log(event);
        console.log(this.scheduleObj.currentView)
        console.log(this.isTreeItemDropped);
        this.scheduleObj.eventSettings.fields.subject.name = 'Name'
        console.log(this.scheduleObj, '====== scheduleobj');
      
    
        this.argsOnActionBegin = event
        console.log(event.cancel, "onActionBegin(e)")
        console.log(this.scheduleObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range'))
        this.scheduleObj.eventSettings.fields.subject.default = "Titre"
        if (event.requestType === 'viewNavigate') {
            //   this.scheduleObj.enablePersistence = false;
            // event.cancel =  true
            this.disableNavigation = true;
            if (this.disableNavigation) {
                let toolbar = document.getElementsByClassName('e-toolbar-items');
                for (let i = 0; i < toolbar.length; i++) {
                    toolbar[i]["style"].display = 'none'
                    console.log(toolbar[i]["style"], "none")
                }
            }
            console.log(this.scheduleObj.enablePersistence, "onActionBegin(e)")
            this.scheduleObj.getEvents().length = 0

        }
        if (event.requestType === 'toolbarItemRendering') {
            let now = moment().subtract(1, 'h').format('HH:mm')
            setTimeout(() => {
                this.scheduleObj.scrollTo(now)
            }, 500);
 // this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut
          console.log('on load app', this.scheduleObj)
          console.log(event)

          //bouton choix plannings

          const choixPlanning :  ItemModel = {
            align: 'Left',template:'#choixPlanning'
        };   

      
          // afficher les plages horraire et l'intrevelle dans la toolbar
          const SeparatorItem: ItemModel = {
              align: 'Left', type: "Separator",cssClass: "e-schedule-seperator"
          };   
   // dropdownlist intervalle
          const intervalleItem: ItemModel = {
           align: 'Left', showTextOn: 'Both', prefixIcon: 'e-dropdownlist', cssClass: 'e-dropdownlist',template:'#change-intervalle'
          };
         // dropdownlist plages horaire  
          const timeSlotItem: ItemModel = {
              align: 'Left', showTextOn: 'Both', prefixIcon: 'e-dropdownlist', cssClass: 'e-dropdownlist',template:'#selectplage'
          };
      
          event.items.push(SeparatorItem);
          event.items.push(choixPlanning);
          event.items.push(intervalleItem); //Ajouter à la liste des items deja présent dans la toolbar 
          event.items.push(timeSlotItem);

        }

        if (event.requestType === 'eventChange') {
console.log(this.dataToEdit)

            if (this.openSideBar == true) {
                this.openSideBar = true;
                this.sidebar.show();
                this.sidebar.position = 'Right';
                this.sidebar.animate = false;
            } else {
                this.openSideBar = false;
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
            if (event.data[0].Name == undefined) {
                event.data[0].Name = event.data[0].Subject || 'Titre'
            }
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
            // this.scheduleObj.eventSettings.tooltipTemplate = this.temp;
            console.log(this.openSideBar, "open Sidebar")
            // FUNCTION FROM TEMPLATE => Call when workodre is drag and drop from backlog to create container
            let treeViewdata: { [key: string]: Object }[] = this.treeObj.fields.dataSource as { [key: string]: Object }[];
            var filteredPeople: { [key: string]: Object }[] =
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
            let codeRessourceCoordinateur = this.currentCoordinateur.IdCoord
            let codeRessourceOperateur
            this.monteurDataSource.map(item => {
                if (item.Username === event.data[0].Operateur) {
                    codeRessourceOperateur = item.CodeRessource;
                }
            });
            if (!this.isTreeItemDroppedMonteur) {
                this.creationArray.map(item => {
                    console.log(item);
                    console.log(event.data[0].Subject || event.data[0].Name)
                   
                    if (item.AzaIsPere) {
                        let newItemContainerAfterEditorUpdate = {
                            Id: item.Id,
                            Name: event.data[0].Subject || event.data[0].Name,
                            StartTime: event.data[0].StartTime,
                            EndTime: event.data[0].EndTime,
                            IsAllDay: event.data[0].IsAllDay,
                            DepartmentID: event.data[0].DepartmentID,
                            ConsultantID: item.ConsultantID,
                            AzaIsPere: true,
                            AzaNumGroupe: item.AzaNumGroupe,
                            coordinateurCreate: item.coordinateurCreate,
                            Operateur: event.data[0].Operateur === 'Aucun Opérateur' ? '' : event.data[0].Operateur,
                            Commentaire_Planning: event.data[0].Commentaire_Planning || event.data[0].Description,
                            Commentaire_Planning_rtf:event.data[0].Commentaire_Planning || event.data[0].Description,
                            CodeRessourceSalle: event.data[0].CodeRessourceSalle,
                            LibelleRessourceSalle: event.data[0].LibelleRessourceSalle,
                            IsReadonly: false,
                            isTempsReel: 0,
                            CodeRessourceCoordinateur: codeRessourceCoordinateur,
                        CodeRessourceOperateur:codeRessourceOperateur

                        };
                        this.containerParent = newItemContainerAfterEditorUpdate;
                        console.log('newItemContainerAfterEditorUpdate', newItemContainerAfterEditorUpdate);
                        // this.timelineResourceDataOut.push(newItemContainerAfterEditorUpdate);
                        this.createContainer(newItemContainerAfterEditorUpdate,codeRessourceOperateur);      
                    }
                });
            } else if (this.isTreeItemDroppedMonteur) {
               
                this.creationArray.map(item => {
                    let newItemContainerFromMonteurAfterEditorUpdate = {
                        Id: item.Id,
                        Name: (event.data[0].Name === null || event.data[0].Name === undefined) ? event.data[0].Subject : event.data[0].Name,
                        StartTime: event.data[0].StartTime,
                        EndTime: event.data[0].EndTime,
                        IsAllDay: event.data[0].IsAllDay,
                        DepartmentID: event.data[0].DepartmentID,
                        ConsultantID: item.ConsultantID,
                        AzaIsPere: true,
                        AzaNumGroupe: item.AzaNumGroupe,
                        coordinateurCreate: item.coordinateurCreate,
                        Operateur: event.data[0].Operateur === 'Aucun Opérateur' ? '' : event.data[0].Operateur,
                        Commentaire_Planning: (event.data[0].Commentaire_Planning === null || event.data[0].Commentaire_Planning === undefined) ? event.data[0].Description : event.data[0].Commentaire_Planning,
                        IsReadonly: false,
                        isTempsReel: 0,
                        CodeRessourceCoordinateur: codeRessourceCoordinateur,
                        CodeRessourceOperateur:codeRessourceOperateur
                    };
                    console.log('newItemContainerFromMonteurAfterEditorUpdate ==== ', newItemContainerFromMonteurAfterEditorUpdate);
                    // this.timelineResourceDataOut.push(newItemContainerFromMonteurAfterEditorUpdate);
                  
                    this.createContainer(newItemContainerFromMonteurAfterEditorUpdate, codeRessourceOperateur);
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
 

    }

    customActionBegin(args: any) { // CUSTOM ACTION BEGIN
        console.log('args customActionBegin ', args);
        if (args.requestType === 'eventChange') {
            if (this.openSideBar == true) {
                this.openSideBar = true;
                this.sidebar.show();
                this.sidebar.position = 'Right';
                this.sidebar.animate = false;
            } else {
                this.openSideBar = false;
                this.sidebar.hide();
                this.sidebar.position = 'Right';
                this.sidebar.animate = false;
            }
            args.data.Commentaire =   this.valueCommentaire
            console.log(args.data)
        }
        if (args.requestType === 'eventRemove') { // CUSTOM ACTION REMOVE
            this.deleteEvent(args.data[0]);
        } else if (args.requestType === 'viewNavigate') {

            if (this.openSideBar == true) {
                this.openSideBar = true;

            } else {
                this.openSideBar = false;

            }

            console.log(this.openSideBar, '----------------------------------------------')
            console.log(args.data, "args.data")
            //   } else if ((args.requestType !== 'toolbarItemRendering') && (args.data["AzaIsPere"])) { // RESIZE CONTAINER
            //       console.log('CALL CUSTOM ACTION BEGIN');
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
            let checkIfContainerExist = this.timelineResourceDataOut.filter(item =>item.Id == data.Id) //vérifier si l'ID n'existe pas deja 
            console.log(data),
            console.log(this.timelineResourceDataOut)
            console.log(checkIfContainerExist,"chek if container existe in planner")
            if(checkIfContainerExist.length==0 ){
            this.randomId();
            let codeRessourceCoordinateur = this.currentCoordinateur.IdCoord
            console.log('last Random id : ', this.lastRandomId);
            console.log('container create only one ==> %%%%%% ', data);
            let codeRessourceOperateur
            this.monteurDataSource.map(item => {
                if (item.Username === data.Operateur) {
                    codeRessourceOperateur = item.CodeRessource;
                }
            });
            console.log(codeRessourceOperateur)
            let containerData = { // DISPLAY DATA FOR CONTAINER
                Id: this.lastRandomId,
                Name: data.Name || data.Subject,
                StartTime: data.StartTime,
                EndTime: data.EndTime,
                IsAllDay: data.IsAllDay,
                DepartmentID: data.DepartmentID,
                ConsultantID: data.DepartmentID,
                AzaIsPere: true,
                AzaNumGroupe: this.lastRandomId,
                coordinateurCreate: this.user.initials,
                Operateur: data.Operateur === 'Aucun Opérateur' ? '' : data.Operateur,
                Commentaire_Planning: data.Commentaire_Planning,
                IsReadonly: false,
                isTempsReel: 0,
                CodeRessourceCoordinateur: codeRessourceCoordinateur,
                CodeRessourceOperateur:codeRessourceOperateur,

            };
            this.createContainer(containerData,codeRessourceOperateur);
            // this.timelineResourceDataOut.push(containerData);
            //   this.eventSettings = { // Réinitialise les events affichés dans le scheduler
            //       dataSource: <Object[]>extend(
            //           [], this.timelineResourceDataOut, null, true
            //       )
            //   };
        }
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
    public argsOnActionComplete
    public clicFermerOnActionComplete = false
    onActionComplete(e) {
        console.log('onActionComplete()');
        console.log('event onActionComplete : ', e);
        this.argsOnActionComplete = e
        // if (this.timelineResourceDataOut['container'] = true) {
        //     this.scheduleObj.eventSettings.enableTooltip = true;
        //     // this.scheduleObj.eventSettings.tooltipTemplate = this.temp;
        // } else {
        //     this.scheduleObj.eventSettings.enableTooltip = false;
        //     this.scheduleObj.eventSettings.tooltipTemplate = null;
        // }
        // this.scheduleObj.dataBind(); 
        // console.log( e.cancel, "onActionComplete(e)")    
      
        console.log(this.timelineResourceDataOut)
        if (e.requestType === 'dateNavigate') {

            //  if(e.event.target.className === "e-appointment e-lib e-draggable"){
            //     e.event.target.className = "e-appointment e-lib e-draggable e-event-action"
            //     e.event.target["aria-grabbed"] = true
            console.log("onActionComplete(e) dateNavigate ===> :", e)
            //  }


        }
        if (e.requestType === 'eventCreated') {
            this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut
            console.log(this.openSideBar)

        }

        if (e.requestType === 'eventChanged') {
            let startTime = e.data instanceof Array ? e.data[0].StartTime : e.data.StartTime,
                endTime = e.data instanceof Array ? e.data[0].EndTime : e.data.EndTime,
                groupIndex = this.groupIndex,
                cellVide = this.scheduleObj.isSlotAvailable(startTime),
                decallage,
                lengthContainer
            if (this.eventDragStart != undefined) {
                decallage = Math.abs(startTime - this.eventDragStart.StartTime),
                    lengthContainer = Math.abs(this.eventDragStart.StartTime - this.eventDragStart.EndTime)
            }
            console.log(decallage, "decallage")
            console.log(lengthContainer, "lengthContainer")
            // cellVide = this.scheduleObj.isSlotAvailable(e.data)


            console.log(cellVide, "this.scheduleObj.isSlotAvailable")
            console.log(this.openEditor, "open editor ==>")
            console.log(this.startResize, "start resize ===>")
            if(this.updateEvents){// si le drop est à l'interieur du palnner
            if (e.data.AzaIsPere || (!e.data.AzaIsPere && e.data.isTempsReel === 0 && this.isTreeItemDropped)  ) {
                console.log(e.data, " event in updatecontainer")

                //cellVide ==> ture  checkIfContainerAlreadyExists(args)  
                console.log("************************************************* onaction complete : update container");
                if(!this.statutDifferent){
                this.updateContainer(e.data);
            }else {
                console.log("veuillez rafraichir avant ")
                this.dialogRefresh()
            }
            } else {
                if (!e.data.AzaIsPere && e.data.isTempsReel === 0 && this.updateWO) {
                    console.log("************************************************* onaction complete : update WorkOrder", e);

                    if(!this.statutDifferent){
                    this.updateWorkOrder(e)
                }else {
                    console.log("veuillez rafraichir avant ")
                    this.dialogRefresh()
                }
            }
            }}else{
                console.log( "drag taget out of schedule ")
                this.updateEvents = true 
                console.log(this.eventSelecte)
            }
            if (this.openSideBar == true) {
                this.openSideBar = true;
                this.sidebar.show();
                this.sidebar.position = 'Right';
                this.sidebar.animate = false;
            } else {
                this.openSideBar = false;
                this.sidebar.hide();
                this.sidebar.position = 'Right';
                this.sidebar.animate = false;
            }


            this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                dataSource: <Object[]>extend(
                    [], this.timelineResourceDataOut, null, true
                ),
                // enableTooltip: true, tooltipTemplate: this.temp
            };              // this.updateContainer(e); 
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
            if (this.searchString != undefined) {

                this.searchwo.value = this.searchString
                //    this.onFilter(this.searchwo.value,0,this.argsKeyboardEvent)
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
            if (this.searchString != undefined) {
                this.searchwo.value = ""
            }
            this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                dataSource: <Object[]>extend(
                    [], this.timelineResourceDataOut, null, true
                ),
                // enableTooltip: true, tooltipTemplate: this.temp
            };
            // this.onFilter( this.searchwo.value , 0, this.argsKeyboardEvent)
        } else {
            this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                dataSource: <Object[]>extend(
                    [], this.timelineResourceDataOut, null, true
                ),
                // enableTooltip: true, tooltipTemplate: this.temp
            };
            console.log('this.eventSettings ==> ', this.eventSettings);
        }
       
if(this.treeObj != null){
        this.treeObj.fields = this.field;
    }
        this.isTreeItemDropped = false;
        this.isTreeItemDroppedMonteur = false;
        this.deleteContainerAction = false;
        this.updateContainerAction = false;
        this.createJustContainerAction = false;
        this.isBackToBacklog = false;
        this.navigateTimelineDay = false;
        this.eventClick = false;
        console.log('onActionComplete() this.timelineResourceDataOut ==> ', this.timelineResourceDataOut);
        // (this.scheduleObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as any).click();
        // let calendar = (this.scheduleObj.element.querySelectorAll('.e-calendar') as any);
      
        // let contentCalendar = (document.querySelectorAll('.e-content .e-month')[0] as any); 
        // console.log(contentCalendar);
    
        // console.log(calendar[0].ej2_instances[0].renderDays(this.scheduleObj.selectedDate))
        // let date = calendar[0].ej2_instances[0].renderDays(this.scheduleObj.selectedDate)
        // let cell = this.scheduleObj.element.querySelectorAll('.e-day');
        // console.log(cell)
        // cell.map(item=>{
        //     if (+item.innerText === 10) {
        //         // let span: HTMLElement;
        //         //  span = document.createElement('span');
        //         //  span.setAttribute('class', 'e-icons highlight');
        //          addClass([item], ['special']);
        //           // element.setAttribute('title', 'Birthday !');
        
        //         //  element.appendChild(span);
        //          console.log(item)
        //          console.log(document.getElementsByClassName('.special'))
        //      }
        // })
        // for(let i = 0; i< cell.length; i++){
        //     if(+cell[i].innerHTML === 10){
        //         cell[i]['style'].borderBottom ="3px red solid !important"
        //         console.log(cell[i])
        //                  console.log(document.getElementsByClassName('.special'))
        //     }
        // }
        // (this.scheduleObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as any).click();

        //*************************************************************************************************************************************** */


    }
  

    /************************ DELETE ********************/

    deleteEvent(args: any) { //remise au backlog
        console.log('call deleteEvent()');
        console.log('args : ', args);
        console.log('this.allDataContainers : ', this.allDataContainers);
        let data = args;
        let containerEvent;
        if(!this.statutDifferent){
        if (data['AzaIsPere']) { // REMOVE CONTAINER
            this.deleteContainerAction = true;
            // let selectedContainer = this.allDataContainers.filter(item => item.Id_Planning_Container === data.Id);
            // console.log('selected container : ', selectedContainer);
            // console.log('this.allDataContainers : ', this.allDataContainers);
            // let idContainer = selectedContainer[0].Id_Planning_Container;
            containerEvent = data;
            this.deleteContainer(data.Id, data);
        } else { // REMOVE WORKORDER
            console.log("remise workorder backlog  ")
            let newGroup = [];
            let selectedItem;
            let pere;
            this.creationArray = [];
            this.timelineResourceDataOut.forEach(item => {
                if (+item.Id === +data.Id && item.Name === data.Name) {
                    selectedItem = item;
                    console.log(item)
                    console.log(selectedItem)
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

        this.numberContainerWithoutOperateur()
    }else{
        this.dialogRefresh()
        this.numberContainerWithoutOperateur()
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
    public fincalculDateGroup = false
    calculDateGroup(
        atimelineResourceData: Object[], numGroup: number, needUpdate: boolean,
        itemToUpdate: Object[], startDifferent?: boolean, endDifferent?: boolean)
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
        console.log(atimelineResourceData, "atimelineResourceData CALCUL DATE GROUP  ")
        this.fincalculDateGroup = true
        console.log(this.fincalculDateGroup)
        return atimelineResourceData;
      
    }

    calculPrevisonalDateGroup(atimelineResourceData: Object[], numGroup: number, needUpdate: boolean,
        itemToUpdate: Object[], startDifferent?: boolean, endDifferent?: boolean)
        : Object[] {
        console.log('-------------------> CALCUL "PREVISIONAL" DATE GROUP !!!!!!!!!!!!')
       
        let minDateGroup = this.getMinMaxNumgroupe(
            atimelineResourceData, numGroup, 'StartTime', needUpdate, itemToUpdate
        );
        let maxDateGroup = this.getMinMaxNumgroupe(
            atimelineResourceData, numGroup, 'EndTime', needUpdate, itemToUpdate
        );
        console.log(maxDateGroup ,"maxDateGroup")
        console.log(minDateGroup,"minDateGroup")
        let diffMinMax = +maxDateGroup - +minDateGroup;
        let Seconds_from_T1_to_T2 = diffMinMax / 1000;
        let Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
        let countWorkorderSameGroup = this.getCountWorkOrderByGroup(atimelineResourceData, 'AzaNumGroupe', +numGroup);
        console.log(countWorkorderSameGroup)
        let Seconds_for_a_job = Seconds_Between_Dates / countWorkorderSameGroup;
        let newAtimelineResourceData = this.calcultimesforalljobs(atimelineResourceData, numGroup, minDateGroup, maxDateGroup, Seconds_for_a_job);
        console.log(newAtimelineResourceData)
        return newAtimelineResourceData;
    }

    getCountWorkOrderByGroup(objectin: Object[], property: string, numGroup: number): number {
        let countWorkorderSameGroup = 0;
        objectin.forEach(item => {
            if (+item[property] === numGroup) {
                if (!item['AzaIsPere'] && item['isTempsReel'] === 0) {
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
            if (+item.AzaNumGroupe === numGroup && item.isTempsReel === 0) {
                arrayDatesGroup.push(+item[timePosition]);
                if (item.AzaIsPere) {
                    regie = item.DepartmentID;
                }
            }
        });
        atimelineResourceData.forEach(item => {
            if (+item.AzaNumGroupe === numGroup && item.isTempsReel === 0) {
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
                    if (+Objupdate['AzaNumGroupe'] === numGroup && Objupdate["isTempsReel"] === 0) {
                        mindate = Objupdate[timePosition];
                    }
                }
            } else {
            }
            return mindate;
        } else if (timePosition === 'EndTime') {
            if (isUpdate) {
                if (Objupdate != null) {
                    if (+Objupdate['AzaNumGroupe'] === numGroup && Objupdate["isTempsReel"] === 0) {
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
            if (entry.AzaNumGroupe === numGroup && entry.isTempsReel === 0) {
                // const properties = Object.getOwnPropertyNames(entry);
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

    onSelect(value, e) {
        console.log(e)
        console.log(value)

        let monteurListArray;
        let fieldMonteur
        for (let i = 0; i < this.monteurListe.length; i++) {
            if (value === this.monteurListe[i].Username) {
                console.log(this.monteurListe[i].Username)
                fieldMonteur = this.fieldMonteur['dataSource'].concat(this.fieldMonteur['dataSource'].unshift(this.monteurListe[i])) //pour l'affichage dans le treeview
                fieldMonteur.pop()
                this.monteurDataSource.unshift(this.monteurListe[i])
                console.log('monteurDataSource', this.monteurDataSource);
                console.log('fieldMonteur', fieldMonteur);

                for (let i = 0; i < this.monteurDataSource.length; i++) {
                    if (this.monteurDataSource[i] === this.monteurDataSource[i + 1]) {
                        console.log('monteurDataSource', this.monteurDataSource);
                        this.monteurDataSource.splice(i, 1)
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

                if (this.searchStringM != undefined && !this.cancel) {

                    this.onFilter("", 1, this.argsKeyboardEvent)
                    console.log(this.searchoperateur.value)
                    console.log(typeof this.searchoperateur.value)
                } else {
                }
            }
        }

    }

    planningChanged = false

    onSelectPlannig(val) {

        console.log(typeof this.nameService, parseInt(val as string, 10))

        this.workOrderData = [];
        this.timelineResourceDataOut = [];
        this.allDataContainers = [];
        this.allDataWorkorders = [];
        // this.salleDataSource = [];
        this.departmentDataSource = [];  
        this.departmentGroupDataSource = [];
        this.isnotMyGroup = true
        this.scheduleObj.readonly = true
        this.planningChanged = true
        console.log(val, this.listObj.value)
         if( this.mulObj != null){
        this.mulObj.value =[]
    }
        let startofDay = moment().toDate()
        let endofDay = moment().add(1, 'd').toDate();
        this.refreshDate()
        this.idGroupeCoordinateur = this.listObj.value
    
        this.getSalleByGroup(this.listObj.value, this.refreshDateStart, this.refreshDateEnd);

        this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut
        this.scheduleObj.dataBind()
        console.log(this.departmentDataSource, this.departmentGroupDataSource)
        console.log(this.idCoordinateur, this.listObj.value)
if(this.resultFilterDataSource.length>0){
    this.resultFilterDataSource = []
}
        if (this.listObj.value === this.idCoordinateur) {
            this.isnotMyGroup = false
            if (this.scheduleObj.currentView != "TimelineMonth") {
                this.scheduleObj.readonly = false
            }
        }
        console.log(this.timelineResourceDataOut, "...................")
        this.numberContainerWithoutOperateur()
    }


public colorOperateur: string 
    getColor(value, codeGroup) {

        if (value && codeGroup != this.idGroupeCoordinateur) {
            for (let i = 0; i < this.monteurListe.length; i++) {
                if (value === this.monteurListe[i].Username) {
                    this.colorOperateur = '#17aab2'
                    return '#17aab2';
                }
            }
        }
    }

    getBackgroundColor(value, codeGroup) {

        if (value && codeGroup != this.idGroupeCoordinateur) {
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
    public rechercheRegieByID
    public searchRegie
    public resultRegie
    public search

    public resultFilterDataSource : any
    onClickChipsClose(event){ // cliquer sur la croix
console.log(event)
this.resultFilterDataSource = []
if(event = true){
    if(!this.displayRessourceMonteur){
        this.departmentDataSource = this.listeRegies;
    }else{
        this.operateurDataSource = this.listOperateur
    }
}
    }

    displayResultSearch(event,mulObj){ //close popup et afffichage du resutat
      
        console.log('result search ', event)
        if(!this.displayRessourceMonteur){
            event = event.filter(item => item.isRegie);
          console.log(event,'regie')
        }else{
            event = event.filter(item => !item.isRegie);
          console.log(event,'operateur')


        }
        this.resultFilterDataSource = event 
        if(!this.displayRessourceMonteur){
            this.departmentDataSource = this.resultFilterDataSource;
        }else{
            this.operateurDataSource = this.resultFilterDataSource
        }
        this.scheduleObj.refresh()
    }

    public searchwo
    public searchString: string
    public searchStringM: string
    public argsKeyboardEvent
    public searchResult
    onFilter(searchText: string, tabIndex, args: KeyboardEvent) {
        ///************************************************************** FILTRE DES MONTEURS ********************************************************************* */
        this.argsKeyboardEvent = args
        if (searchText.length >= 0) {


            console.log(searchText.length, '*******************************************')
        }
        this.comptText = searchText.length
        // this.filtre == true


        if (tabIndex == 1) {
            this.searchStringM = (args.target as HTMLInputElement).value;
            this.searchoperateur = document.getElementById("searchoperateur")
            console.log(this.searchStringM, '.......')

            console.log(this.treeObjMonteur.getTreeData())
            let fieldMonteur = this.fieldMonteur['dataSource']
            if (this.searchStringM !== "") {
                console.log(fieldMonteur)
                new DataManager(fieldMonteur).executeQuery(new Query().
                    search(this.searchStringM, ['Username', 'Prenom', 'libelletype', 'libellecategorie', 'Libelle'], null, true, true)).then((e: ReturnOption) => {
                        console.log(e)
                        if ((e.result as any).length > 0) {
                            console.log(e.result, this.treeObjMonteur.fields['dataSource'])
                            console.log(this.treeObjMonteur.getTreeData())

                            this.treeObjMonteur.fields.dataSource = e.result as any
                            console.log("this.fieldMonteur['dataSource']", this.fieldMonteur)

                        } else {

                            this.treeObjMonteur.fields['dataSource'] = []
                        }
                    });

            } else {
                console.log("this.fieldMonteur['dataSource']", this.fieldMonteur['dataSource'])

                this.treeObjMonteur.fields.dataSource = fieldMonteur
                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa", fieldMonteur)

                if (this.isDelete) {
                    this.treeObjMonteur.fields.dataSource = this.fieldMonteur['dataSource']
                    console.log("ISDelete", this.fieldMonteur['dataSource'])
                }

            }

        }

        ///************************************************************** FILTRE DES WORKORDERS ********************************************************************* */
        if (tabIndex == 0) {

            this.searchString = (args.target as HTMLInputElement).value;
            this.searchwo = document.getElementById("searchwo")

            console.log(this.searchwo.value)
            console.log(typeof this.searchwo.value)
            console.log(this.searchString, '.......')
            console.log(this.treeObj.getTreeData())
            if (searchText !== "") {
                new DataManager(this.field['dataSource']).executeQuery(new Query().
                    search(searchText, ['typetravail', 'titreoeuvre', 'titreepisode', 'numepisode', 'libtypeWO', 'libchaine', 'coordinateurCreate'], null, true, true)).then((e: ReturnOption) => {
                        console.log(e.result)
                        if ((e.result as any).length > 0) {
                            console.log(e.result, this.treeObj.fields['dataSource'])


                            this.treeObj.fields['dataSource'] = e.result as any
                            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa >0", this.treeObj.fields['dataSource'])
                            this.searchResult = e.result as any


                        } else {
                            this.treeObj.fields['dataSource'] = []
                        }
                    });
            } else {
                this.treeObj.fields['dataSource'] = this.field['dataSource']
                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa", this.treeObj.getTreeData(), this.treeObj)
                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa", this.treeObj["treeData"])

            }

        }
    }
    /**************************************************** Add Regies ************************************************************ *********/

    btnClickSlide() {
      
        if (this.togglebtnslide.element.classList.contains('e-active')) {
           
            // this.togglebtnslide.content = 'BackLog'
            this.openSideBar = false
            this.sidebar.hide();
            this.sidebar.position = 'Right'
            this.sidebar.animate = false
            this.sidebar.locale = 'fr-CH'

            this.scheduleObj.refreshEvents()
            this.workOrderData = [];
            // this.monteurDataSource=[];
            this.monteurListe= [];
            this.statutMonteur  =[]
        }
        else {
            // this.togglebtnslide.content = '';
            this.openSideBar = true
            this.sidebar.show();
            this.sidebar.position = 'Right'
            this.sidebar.animate = false
            this.sidebar.locale = 'fr-CH'
            this.scheduleObj.refreshEvents()
        
            this.getTypeRessourceMonteur()
            this.getAllMonteurs(this.groupeCoordinateur);

        }
        console.log(this.openSideBar, '----------------------------------------------')
        console.log('slidebar', this.sidebar)
        console.log('button', this.togglebtnslide)
        console.log('scheduler element', this.treeObj)
   

    }
public changeDataSource 
    choixPlanning(){
      
    this.displayRessourceMonteur = !this.displayRessourceMonteur;
    console.log("change planning", this.displayRessourceMonteur);
   this.changeDataSource = true;
 
    if(this.displayRessourceMonteur ){
        this.resultFilterDataSource= [];
        this.scheduleObj.readonly = true;
        this.isnotMyGroup = true;
        this.toggleBtn.content = 'Vue régies';
        this.dataSourcePlanner = this.listOperateur;
        console.log(this.dataSourcePlanner, 'source planner monteur ')
        this.checkFields  = { groupBy: 'libelletype', text: 'Text', value: 'Text' };
       this.placeholderRegie = 'Rechercher un opérateur...'
    


    }else{
        this.resultFilterDataSource= [];
        this.scheduleObj.readonly= false;
        this.isnotMyGroup = false;
        this.toggleBtn.content = 'Vue opérateurs';
        this.dataSourcePlanner = this.listeRegies
        this.checkFields  = { groupBy: 'libelletype', text: 'Text', value: 'Text' };
        this.placeholderRegie = 'Rechercher une régie...'
     


    }

    }
    /********************************** Context Menu *************************************/
   public eventSelected;
   public idContainerSelected : number;
   public containerSelected =[];
   public containerBrutSelected = [];
   public workorderbrutSelected = [];
   public selectedTarget :Element;
   public activeCellsData: CellClickEventArgs;
   public RegieSelected;
   public DropEventWithNavigation:boolean = false;
   public clickDrop:boolean = false
   public clickDeplacer :boolean = false
    beforeopen(args: BeforeOpenCloseMenuEventArgs,i?) {
        console.log(args,i, 'clicknode treeview')

        if(i == 1){
        // let targetNodeId: string = this.treeObjMonteur.selectedNodes[0];
        let targetNodeId :string = this.idBacklog 
        // this.treeViewContextMenu.showItems(['Supprimer'], true);
        // this.treeViewContextMenu.hideItems(['details'], true);
        this.fieldMonteur['dataSource'].map(item => {
            if ((item.codegroupe === this.currentCoordinateur.Groupe)) {
                args.cancel = true;
                let targetNode: Element = document.querySelector(`[data-uid='${targetNodeId}']`);

                if (targetNode.classList.contains('remove')) {
                    this.contentmenutree.enableItems(['Supprimer'], true);
                }
            }
            this.monteurListe.map(itemliste => {
                if (targetNodeId == itemliste.idressourcetype.toString()) {
                    if (itemliste.codegroupe != this.currentCoordinateur.Groupe) {
                        args.cancel = false;
                    }
                }

            });
      
        });
        console.log(  this.treeViewContextMenu," context menu operateur")
       
    }
    if(i == 0){  //backlog workorder
        console.log(this.treeObj)
        this.treeViewContextMenu.showItems(['details'], true);
    }

        if (i == 3) { //schedule
            console.log(this.containerSelected.length )
            if (args.event.target["classList"].contains('e-work-cells')) {
                if (this.containerSelected.length > 0 ||   this.containerDupliquer.length>0) {
                    this.contentmenutree.hideItems(['deplacer'], true);
                    this.contentmenutree.hideItems(['split'], true);
                    this.contentmenutree.hideItems(['dupliquer'], true);
                    this.contentmenutree.showItems(['poser'], true);
                } else {
                    args.cancel = true
                }
                let targetElement: HTMLElement = <HTMLElement>args.event.target;
                if (closest(targetElement, '.e-contextmenu')) {
                    return;
                }
                this.selectedTarget = closest(targetElement, '.e-work-cells' );
                if (isNullOrUndefined(this.selectedTarget)) {
                    args.cancel = true;
                    return;
                }
             console.log(targetElement)
     
            console.log(args)
            
            console.log(  this.selectedTarget);
        
              let selectedCells: Element[] = this.scheduleObj.getSelectedElements();
              this.activeCellsData = this.scheduleObj.getCellDetails(selectedCells.length > 0 ? selectedCells : this.selectedTarget); 
              this.RegieSelected= this.scheduleObj.getResourcesByIndex(+this.selectedTarget.getAttribute("data-group-index"))
                console.log(this.activeCellsData,'active cells data')
                console.log(this.RegieSelected)

            } else { 
                if (args.event.target["classList"].contains('workorders') ||
                    args.event.target["classList"].contains('e-toolbar-items') ||
                    args.event.target["classList"].contains('e-header-cells') ||  
                    args.event.target["classList"].contains('e-time-slots')   ) {  //
                    args.cancel = true
             
                } else {
                    this.idContainerSelected = +args.event.target['id']
                    console.log(this.idContainerSelected)
           if( this.idContainerSelected != 0){
                    this.contentmenutree.showItems(['deplacer'], true);
                    this.contentmenutree.showItems(['split'], true);
                    this.contentmenutree.showItems(['dupliquer'], true);
                    this.contentmenutree.hideItems(['poser'], true);
                }else{ //si le container est trop petit l'Id est 0 
                 args.cancel = true
                }
            
            }
            }
}
    }
public eventsSelect
public containerDupliquer = []
    async menuclick(args: MenuEventArgs,i) {

        console.log(args)
        if(i == 1){   //operateur 
        this.selectOperateur.value = null
        let targetNodeId: string = this.treeObjMonteur.selectedNodes[0];
            console.log(targetNodeId)
        for (let i = 0; i < this.monteurListe.length; i++) {
            let CodeRessource = this.monteurListe[i].idressourcetype;
            let CodeRessourceToString = CodeRessource.toString();
      
            if (this.operateurSelected === this.monteurListe[i].Username && CodeRessourceToString=== this.idBacklog ) {
                console.log(CodeRessourceToString, "CodeRessourceToString",this.idBacklog);
                if (args.item.text == 'Supprimer') {
                    this.treeObjMonteur.removeNodes([CodeRessourceToString]);

                    console.log('element supprimer', this.monteurListe[i]);
                    this.elementDelete = this.monteurListe[i]
                    this.isDelete = true;
                    let indexOfMonteur = this.monteurListe.indexOf(this.elementDelete)
                    console.log(indexOfMonteur)
                    this.fieldMonteur['dataSource'] = this.treeObjMonteur.removeNodes([CodeRessourceToString]);
                    // 
                    console.log(this.treeObjMonteur)
                    //  this.monteurDataSource= this.treeObjMonteur['groupedData']

                }
                console.log(this.treeObjMonteur);

                if (args.item.text == 'Plus de détails') {
                this.openDialog( this.colorOperateur,this.monteurListe, this.monteurListe[i], this.departmentDataSource, "Operateur");
                }
            }
            this.fieldArrayMonteur = this.treeObjMonteur['groupedData'];
            this.fieldMonteurDSource = this.fieldMonteur['dataSource']



        }

        this.fieldMonteur['dataSource'] = this.treeObjMonteur['groupedData'][0];
        console.log(this.treeViewContextMenu,"context Menu")
    
    }

    if(i == 0){ // workorder
        if (args.item.text == 'Supprimer') {

            console.log("clique contextMenu Supprimer")
        console.log(this.treeObj)
        // let idWorkOrder = +this.treeObj.selectedNodes[0];
        let idWorkOrder = +this.idBacklog;
        console.log(idWorkOrder)
        let workorderBacklogBrut  =  this.workOrderData.filter(item =>item.Id == idWorkOrder)
        console.log(workorderBacklogBrut,'data brut to delete');
        // this.updateStatutWorkorderBeforeDelete(workorderBacklogBrut[0].Id_Planning_Events, workorderBacklogBrut[0],'backlog')
        let workorder ={
            Id: idWorkOrder,
            Statut:1

        }
        this.updateStatutWorkorderBacklog(idWorkOrder,workorder)
        // this.deleteWorkOrderForGood(idWorkOrder,'backlog')
        // this.displayWorkorderInBacklogWorkorderData(this.workorderDelete , 'delete')
    }
    if (args.item.text == 'Plus de détails') {
        console.log("clique pour detail")
        console.log("click event")
        this.contClickEvent = 0
        console.log(this.contClickEvent, "contClickEvent")
        let id = +this.treeObj.selectedNodes[0]
        console.log(id);
        console.log(this.WorkOrderByidgroup)
        let workorderSelected = this.WorkOrderByidgroup.filter(item => item.Id_Planning_Events === id)
        console.log(workorderSelected)
        this.openDialog(this.workOrderColor, workorderSelected, workorderSelected[0], this.departmentDataSource, "backlog");

        let btn = document.getElementsByClassName('btn-close-modal');

        for (let i = 0; i < btn.length; i++) {
            document.getElementsByClassName('btn-close-modal')[i].addEventListener('click', () => {
                this.contClickEvent = 1
                console.log(" click fermer")
                console.log(this.contClickEvent, "contClickEvent")
            })
   }
    }

}
    if(i== 3){ // planner
        if(args.item.text == 'Split'){
             this.eventsSelect= this.timelineResourceDataOut.filter(item => item.AzaNumGroupe === this.idContainerSelected && !item.AzaIsPere)
            console.log(this.eventsSelect)
          let  containerSelect = this.timelineResourceDataOut.filter(item => item.AzaNumGroupe === this.idContainerSelected && item.AzaIsPere)
          console.log(containerSelect)
          let newContainers =[]
            if(this.eventsSelect.length>1){
            
                this.eventsSelect.map(item =>{
                    let newcontainer ={

                        Id:  containerSelect[0].Id,
                        Name:  containerSelect[0].Name ,
                        StartTime: item.StartTime,
                        EndTime: item.EndTime,
                        IsAllDay:containerSelect[0].IsAllDay,
                        DepartmentID:  containerSelect[0].DepartmentID,
                        ConsultantID:  containerSelect[0].DepartmentID,
                        AzaIsPere: true,
                        AzaNumGroupe: this.lastRandomId,
                        coordinateurCreate: this.user.initials,
                        Operateur:  containerSelect[0].Operateur === 'Aucun Opérateur' ? '' : containerSelect[0].Operateur,
                        Commentaire_Planning:  containerSelect[0].Commentaire_Planning,
                        IsReadonly: false,
                        isTempsReel: 0,
                        CodeRessourceCoordinateur:  containerSelect[0].CodeRessourceCoordinateur,
                        CodeRessourceOperateur: containerSelect[0].CodeRessourceOperateur,
                    }
                    item.AzaNumGroupe = 0
                   
                    newContainers.push(newcontainer)
                    this.deleteContainer(containerSelect[0].Id, containerSelect[0])
                    console.log(newContainers)

                })
        
            }
            setTimeout(() => {
                newContainers.map(item=>{
                    this.createContainer(item,item.CodeRessourceOperateur)
                })
            }, 50);
          
        
        }

     
        if (args.item.text == 'Déplacer') {
            this.containerDupliquer = []
        console.log(  this.containerDupliquer,'  containerDupliquer')
        console.log(this.idContainerSelected);
        console.log(this.timelineResourceDataOut)
            this.containerSelected = this.timelineResourceDataOut.filter(item => item.Id === this.idContainerSelected)
            console.log(this.containerSelected)
            this.containerBrutSelected = this.allDataContainers.filter(item => item.Id_Planning_Container === this.idContainerSelected)
            console.log( this.containerBrutSelected)
            this.workorderbrutSelected = this.allDataWorkorders.filter(item => item.Id_Planning_Container === this.idContainerSelected)
            console.log(this.workorderbrutSelected);
          for(let i=0 ; i<this.timelineResourceDataOut.length; i++){
              if(this.timelineResourceDataOut[i].AzaNumGroupe == this.idContainerSelected && !this.timelineResourceDataOut[i].AzaIsPere){
                this.workorderSelected.push(this.timelineResourceDataOut[i])
              }
          }
           
            console.log(this.workorderSelected)
            this.clickDeplacer = true
        }

        if (args.item.text == 'Poser') {
            if(this.containerSelected.length>0){ //deplacer un cotainer n'importe ou dans le planner
            let event = this.containerSelected.filter(item => item.AzaIsPere)
            let start = moment(event[0].StartTime),
                end = moment(event[0].EndTime),
                diff = end.diff(start, 'minute')
                this.disabledrefresh = true
            this.clickDrop = true //cliquer sur poser

            console.log(diff)
            console.log(this.contentmenutree)
            console.log(this.scheduleObj)
            console.log(this.RegieSelected)
            let dateStartCell =moment(+this.selectedTarget.getAttribute("data-date")).toDate()
            console.log( dateStartCell )
            let StartTime = dateStartCell,
                DepartementId = this.RegieSelected.groupData.DepartmentID,
                EndTime = moment(dateStartCell).add(diff, 'minute').toDate();
          
            console.log(DepartementId)
            console.log(  EndTime)
    
          
            this.containerSelected.map(item => {
                if (item.AzaIsPere && item.AzaNumGroupe === this.idContainerSelected) {
                    item.StartTime = StartTime,
                        item.EndTime = EndTime,
                        item.DepartmentID = DepartementId,
                        item.CodeRessourceSalle = DepartementId
                }


            })
         console.log( this.containerSelected)
    
            this.updateContainer(this.containerSelected[0])
        }
          
    if(this.containerDupliquer.length>0){
        let selectedCells: Element[] = this.scheduleObj.getSelectedElements();
        let activeCellsData = this.scheduleObj.getCellDetails(selectedCells.length > 0 ? selectedCells : this.selectedTarget); 
        let RegieSelected= this.scheduleObj.getResourcesByIndex(+this.selectedTarget.getAttribute("data-group-index"))
        console.log(activeCellsData, 'activecellsData')
        let endTime = moment(this.containerDupliquer[0].EndTime),
            startTime =moment(this.containerDupliquer[0].StartTime)  ;
        let    diff = endTime.diff(startTime, 'minute');
            console.log(diff,"diff date début date fin")
        let newEndTime = moment(activeCellsData.startTime).add(diff, 'minute').toDate(),
        newStartTime = activeCellsData.startTime,
        newDepartmrntID =  RegieSelected.groupData.DepartmentID;
        console.log(newEndTime)

        let newContainers =[]
     
        
        this.containerDupliquer.map(item =>{
                let newcontainer ={

                    Id:  item.Id,
                    Name:  item.Name ,
                    StartTime: newStartTime,
                    EndTime: newEndTime,
                    IsAllDay:item.IsAllDay,
                    DepartmentID: newDepartmrntID,
                    ConsultantID: newDepartmrntID,
                    AzaIsPere: true,
                    AzaNumGroupe: this.lastRandomId,
                    coordinateurCreate: this.user.initials,
                    Operateur:  item.Operateur === 'Aucun Opérateur' ? '' : item.Operateur,
                    Commentaire_Planning: item.Commentaire_Planning,
                    IsReadonly: false,
                    isTempsReel: 0,
                    CodeRessourceCoordinateur:  item.CodeRessourceCoordinateur,
                    CodeRessourceOperateur: item.CodeRessourceOperateur,
                }
                
               
                newContainers.push(newcontainer)
             
                console.log(newContainers)

            })
    
        
     
            newContainers.map(item=>{
                this.createContainer(item,item.CodeRessourceOperateur)
            })
        






    }
     
    }

    if(args.item.text =='Dupliquer'){
        this.containerSelected = []
        console.log(this.containerSelected,"containerSelected")

       let  containerDupliquer = this.timelineResourceDataOut.filter(item =>item.Id == this.idContainerSelected )
        console.log(containerDupliquer)
        if(containerDupliquer.length>0){
        let workorderExist = this.timelineResourceDataOut.filter(item => item.AzaNumGroupe== containerDupliquer[0].Id && !item.AzaIsPere) //vérifier que le container ne contient pas de workorder
        console.log(workorderExist)
        if(workorderExist.length == 0){
            this.containerDupliquer = containerDupliquer
     
        }else {
            swal({
                title: 'Attention',
                html: 'Le container contient une ou plusieurs tâches, vous ne pouvez pas le dupliquer',
                showCancelButton: false,
                confirmButtonText: 'Fermer',
                cancelButtonText: 'Annuler',
                allowOutsideClick: false
            })
           
        }
    }}


}
}

    /************************************************************************Split **********************************************************************************/

    splitContainer(){
    console.log(this.splitContainerResult)// the new container after split
    console.log(this.eventsSelect) //old workorder
    let SplitContainerResultBrut =this.allDataContainers.filter(item => item.Id_Planning_Container ==   this.splitContainerResult[0].Id )
    console.log(SplitContainerResultBrut)
        for(let j=0;j<this.eventsSelect.length; j++){

            if(this.splitContainerResult[0].StartTime == this.eventsSelect[j].StartTime){
                           this.timelineResourceDataOut = this.timelineResourceDataOut.filter(item => item.Id !=  this.eventsSelect[j].Id)
                               this.eventsSelect[j].AzaNumGroupe = this.splitContainerResult[0].Id
                               this.timelineResourceDataOut.push(this.eventsSelect[j])
                               this.putWorkorderFromUpdateContainer( this.eventsSelect[j].Id,SplitContainerResultBrut[0],SplitContainerResultBrut[0],this.eventsSelect[j])
            }
        
    }
   
this.updateEventSetting(this.timelineResourceDataOut)
    console.log(this.eventsSelect,"after")
    }





    /******************************************* Zoom *******************/

    changeInterval(e: DropDownChangeArgs): void {
        // this.scheduleObj.activeViewOptions.timeScale.interval =  parseInt(e.value as string, 10)
        // this.scheduleObj.dataBind();

        let value
        this.scheduleObj.timeScale.interval = parseInt(e.value as string, 10);
        this.intervalValue = e.value as string
        this.value = parseInt(e.value as string, 10);

        console.log(e.value)
        console.log(this.intervalValue)
        this.scheduleObj.dataBind();
        if (this.scheduleObj.currentView === "TimelineDay") {
            setTimeout(() => {
                this.scheduleObj.scrollTo(this.hourContainer,this.dateContainer)
                // this.zoomWithScroll()
            }, 50);
        }
    }
    /*************************************************************************************** */
    public endOfHour: string ='00:00'
   public argsRenderCell : RenderCellEventArgs;
    onRenderCell(args: RenderCellEventArgs, value?: CellTemplateArgs): void {

        this.argsRenderCell = args
        if (this.scheduleObj.currentView == 'TimelineWeek') {
            if (args.element.classList.contains('e-work-cells') ) {
                    let date = moment(+args.element.getAttribute("data-date")).format('HH:mm')
                   
               if (date == this.endOfHour ) {
                args.element['style'].borderLeft= '#3ae4e2 solid 3px';
                 }  
                 let timeSlot = document.getElementsByClassName('e-time-slots')
     
              for(let i= 0; i<= timeSlot.length-1;i++){
                  if( timeSlot[i]["innerText"] == this.endOfHour ){
                timeSlot[i]['style'].borderLeft= '#3ae4e2 solid 3px';
            }}
            }
           
                 
        }
        if (this.scheduleObj.currentView == 'TimelineMonth') {

            if (args.element.classList.contains('e-work-cells') && (args.date.getDay() === 6 || args.date.getDay() === 0)) {
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
        // console.log(document.getElementsByClassName('e-tbar-btn e-tbtn-txt '),"date range")

    }
    public startResize = false
    onResizing(args: ResizeEventArgs) {
        console.log(args, "on resize..................")
        console.log(this.scheduleObj, "this.scheduleObj..................")
        this.disabledrefresh = true;
        args.interval = 5
        if (!args.data.AzaIsPere) {
            args.cancel = true
        }
        this.startResize = true
        this.checkIfContainerHasATempsReel(args["data"],+args["data"]["Id"])
    }
    onResizingStop(event: ResizeEventArgs) {
        console.log(event, "on resize stop ...........................")

    }
    //****** change data source displayed  *********/
    public items: object[];
    public Check = 0
    public CheckTheoriqueNavig = true

    onChangeDataSource() { 
        let predicate: Predicate;
        let checkBoxes: CheckBoxComponent[] = [this.reel, this.theorique];
        // const timelineDataOutitems = this.timelineResourceDataOut
        console.log(this.timelineResourceDataOut, "aaaaa")
        console.log(this.Check)
       
        // setTimeout(() => {
        checkBoxes.forEach((checkBoxObj: CheckBoxComponent) => {
            console.log(checkBoxObj)
            if (checkBoxObj.checked) {
                  console.log('le checkbox is checked',checkBoxObj.label )
                if (checkBoxObj.value === '1' && this.Check == 0) {
                    this.refreshDate()
                    console.log("call get workorder temps reel in onchangeDataSource() ", this.timelineResourceDataOut)
                    this.salleDataSource.forEach(salle => {
                        let indexSalle = this.salleDataSource.indexOf(salle);
                        let debut = moment(this.refreshDateStart).format('YYYY-MM-DD').toString(),
                            fin = moment(this.refreshDateEnd).format('YYYY-MM-DD').toString();

                        this.getWorkorderTempsReelByIdGroupeStartDateEndDate(this.idGroupeCoordinateur, debut, fin, salle.CodeRessource, salle.CodeSalle)

                    });
                    this.Check = 1
                    this.theorique.disabled = false
                } else {
                }
             
                if (this.navigation && checkBoxObj.value === '0') {
                    console.log("call get workorder théorique in onchangeDataSource() ", this.timelineResourceDataOut)
                    this.refreshDate()
                    //   this.timelineResourceDataOut = []
                    this.salleDataSource.forEach(salle => {
                        let indexSalle = this.salleDataSource.indexOf(salle);

                        this.getContainersByRessourceStartDateEndDate(
                            salle.CodeRessource,
                            this.refreshDateStart,
                            this.refreshDateEnd,
                            salle.CodeSalle,
                            indexSalle,
                            this.groupCoordinateur
                        );

                    });
                    this.navigation = false

                }

                setTimeout(() => {
                    this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut
                    console.log(checkBoxObj.value, checkBoxObj, "checkBoxObj")
                    if (predicate) {
                        predicate = predicate.or('isTempsReel', 'equal', parseInt(checkBoxObj.value, 10));
                        console.log("IF", checkBoxObj.value)
                    } else {
                        predicate = new Predicate('isTempsReel', 'equal', parseInt(checkBoxObj.value, 10));
                        console.log("ELSE", checkBoxObj.value)
                    }
                    this.scheduleObj.eventSettings.query = new Query().where(predicate);
                }, 1000);

                if (this.theorique.checked) {

                    console.log(this.reel, " this.CheckTheoriqueNavig")
                    this.reel.disabled = false
                }
                if (this.reel.checked) {

                    this.theorique.disabled = false
                    // this.Ecriture.disabled =false
                    this.updateEventSetting(this.timelineResourceDataOut)
                }else{
                   
                }

                if (this.theorique.disabled == true && this.reel.disabled == true) {
                    this.theorique.disabled = false
                    this.reel.disabled = false
                    console.log("disabled  les deux ")
                }
            }
            else {
                if (!this.theorique.checked) {
                    this.CheckTheoriqueNavig = false
                    // this.Check = 1
                    console.log(this.reel, " this.CheckTheoriqueNavig")
                    this.reel.disabled = true


                }
                if (!this.reel.checked) {

                    this.theorique.disabled = true
                    // this.Ecriture.disabled =true
                }else{
                    
                    // this.Ecriture.disabled =false
                }

            }

        });
        
      
        console.log(this.reel, this.theorique)
    }

    onChangeDataSourceEvents(){ // affichage uniquement les workorders en lecture seule
    console.log(this.Ecriture)
        if(this.Ecriture.checked ==false)  {
          
            this.updateEventSetting(this.timelineResourceDataOut)
           
             if(this.scheduleObj.currentView=='TimelineMonth'){
                this.scheduleObj.readonly = true
             }else{
                this.isnotMyGroup= false
                this.scheduleObj.readonly = false
             }
            //  this.workorder.disabled = true
            // this.operateur.disabled = false
           
        }else{
            console.log("btn workorder checked")
            let workorderTimeDataSource = this.timelineResourceDataOut.filter(item =>!item.AzaIsPere)
            console.log('workorderTimeDataSource ===>',workorderTimeDataSource)
            console.log('this.timelineResourceDataOut',this.timelineResourceDataOut)
            this.updateEventSetting(workorderTimeDataSource)
            this.scheduleObj.readonly =  true 
            this.isnotMyGroup = true 
            // this.reel.disabled = true
          if ( this.operateur.checked == true){
            this.operateur.checked = false
          }
        }

    }
public containerWithoutOperateurIsCheched : Boolean = false
    onChangeDataSourceOperateur(){ // afficher uniquement les container sans opérateurs
   if(this.Ecriture.checked ==false){
        if(this.operateur.checked == true){
            console.log('this.operateur.checked == true')
            let containerWithoutOperateur = this.timelineResourceDataOut.filter(item =>item.Operateur == '' || item.Operateur == null )
            console.log('workorderTimeDataSource ===>',containerWithoutOperateur)
            this.updateEventSetting(containerWithoutOperateur)
            this.isnotMyGroup= false
            this.scheduleObj.readonly =  false
            // this.Ecriture.disabled = true
            this.Ecriture.checked =false
            this.containerWithoutOperateurIsCheched = true
        }else{
            console.log('this.operateur.checked == false')
            this.updateEventSetting(this.timelineResourceDataOut)
            // this.isnotMyGroup= false
            // this.scheduleObj.readonly = false
            // this.Ecriture.disabled = false
            this.containerWithoutOperateurIsCheched = false
        }
    }
    //else{
        console.log("this.Ecriture.checked ==true")
    // }

}
    disableBtnCloseAndEdit(args) {
        var buttonElementEdit = args.type === "QuickInfo" ? ".e-event-popup .e-edit" : ".e-schedule-dialog .e-event-edit";
        var buttonElementDelete = args.type === "QuickInfo" ? ".e-event-popup .e-delete" : ".e-schedule-dialog .e-event-delete";
        var editButton = document.querySelector(buttonElementEdit);
        var deleteButton = document.querySelector(buttonElementDelete)   
        if (editButton && (editButton as EJ2Instance).ej2_instances) {
            ((editButton as EJ2Instance).ej2_instances[0] as Button).disabled = true;
        }
        if (deleteButton && (deleteButton as EJ2Instance).ej2_instances) {
            ((deleteButton as EJ2Instance).ej2_instances[0] as Button).disabled = true;
        }
    }


    onCreated() {

        let currTime: Date = new Date();
        let hours: string = currTime.getHours() < 10 ? '0' + currTime.getHours().toString() : currTime.getHours().toString();
        let minutes: string = currTime.getMinutes().toString();
        let time: string = hours + ':' + minutes;
        this.scheduleObj.scrollTo(time);
        //   console.log(args, "on created !!!!!!!!!")
    }
    //plages horaires 
    onSelectPlageHoraire(val) {
        console.log(val, this.selectplage)
        console.log(this.scheduleObj)

        if (val === 1) { //matin
            this.scheduleObj.element["ej2_instances"][0].startHour = "00:00"
            this.scheduleObj.element["ej2_instances"][0].endHour = "08:00"
            this.endOfHour ='00:00'
 
            //     this.value = 30

            //   this.scheduleObj.showTimeIndicator = true
            this.scheduleObj.element["ej2_instances"][0].timeScale.interval = this.value
            console.log(this.scheduleObj.startHour, this.scheduleObj.endHour)

        } else
         if (val === 2) { //jour
            this.scheduleObj.element["ej2_instances"][0].startHour = "06:00";
            this.scheduleObj.element["ej2_instances"][0].endHour = "18:00"; //intervale 
            this.endOfHour ='06:00'

            //     this.value = 30
            //   this.scheduleObj.showTimeIndicator = true
            this.scheduleObj.element["ej2_instances"][0].timeScale.interval = this.value
            console.log(this.scheduleObj.startHour, this.scheduleObj.endHour)

        } else if (val === 3) { //soir
            this.scheduleObj.element["ej2_instances"][0].startHour = "18:00";
            this.scheduleObj.element["ej2_instances"][0].endHour = "23:59";
            //   this.scheduleObj.showTimeIndicator = true
            // (document.querySelectorAll('.template-wrap')[i] )["style"].width = "100px"
            //     this.value = 30
            this.endOfHour ='18:00'

            this.scheduleObj.element["ej2_instances"][0].timeScale.interval = this.value
            console.log(this.scheduleObj.startHour, this.scheduleObj.endHour)

        } else { //toute la journée
            this.scheduleObj.element["ej2_instances"][0].startHour = "00:00";
            this.scheduleObj.element["ej2_instances"][0].endHour = "24:00";
            this.scheduleObj.element["ej2_instances"][0].timeScale.interval = this.value
            //   this.scheduleObj.showTimeIndicator = true
            this.endOfHour ='00:00'

            this.onCreated()
        }
        console.log(this.scheduleObj)
        this.scheduleObj.refresh()
       this.onRenderCell( this.argsRenderCell)

 
    }

    //Triggers when multiple cells or events are selected on the Scheduler.
   
    public isCellsEmpty:boolean ;
   public dateContainer
    onSelectMultipleCell(args: SelectEventArgs) {
        console.log("on select =====>", args, this.scheduleObj)
        args["showQuickPopup"] = true
        if (args["requestType"] === "cellSelect") {
            this.dateContainer = args["data"]['StartTime']
            this.hourContainer = moment(args["data"]['StartTime']).subtract(1, 'h').format('HH:mm');
       
        }
        if (args["requestType"] === "eventSelect") {
            if (args["data"]["AzaIsPere"] ) {
                this.checkIfContainerHasATempsReel(args["data"], args["data"]["Id"])
            }
            if (!args["data"]["AzaIsPere"]  && args["data"]["isTempsReel"] == 0) {
                let containerAssocier = this.timelineResourceDataOut.filter(item => item.Id === args["data"]["AzaNumGroupe"])
                console.log(containerAssocier, "containerAssocier to workorder selectionner")
                this.checkIfContainerHasATempsReel(containerAssocier[0], containerAssocier[0]["Id"])

            }
            this.getWorkorderTempsReelByIdPlannigEvents(args["data"]['Id'])

            //si la touche ctrl est pressée
            if (this.multiSelectionBacklog && (args["data"]["Statut"] == 3 || args["data"]["AzaIsPere"]  )) { // &&  e.event["Statut"] == 3 && !e.event["AzaIsPere"]
                console.log('add multiselect')
                let eventArray = []
                this.eventSelecte.push(args["data"])

                this.eventSelecte.sort((a, b) => {
                    return +a.Id - +b.Id
                })
                console.log(this.eventSelecte)
                for (let i = 0; i < this.eventSelecte.length; i++) {
                    if (i == 0) {
                        eventArray.push(this.eventSelecte[i])
                    } else if (+this.eventSelecte[i - 1].Id != +this.eventSelecte[i].Id) {
                        console.log("item different ", this.eventSelecte[i - 1].Id, this.eventSelecte[i].Id)
                        eventArray.push(this.eventSelecte[i])
                        console.log(eventArray)
                    }
                }
                console.log(eventArray, "eventArray ===>")
                this.eventSelecte = eventArray


                console.log(this.eventSelecte)// liste des events selectionnées 
            }
         
        }
        
 
        

    }

    newEventSelecte(event){
        console.log(event)
        this.eventSelecte = event
    }

    scroll = (): void => {

        let left = document.querySelector('.e-content-wrap').scrollLeft;

        let length = document.querySelectorAll('.e-appointment').length;
        let wrapLeft
        for (let i = 0; i < length; i++) {
            let appWidth = (document.querySelectorAll('.e-appointment')[i] as any).offsetWidth == undefined ? 0 : (document.querySelectorAll('.e-appointment')[i] as any).offsetWidth
            let appLeft = (document.querySelectorAll('.e-appointment')[i] as any).offsetLeft;

            if (appLeft < left && appLeft + appWidth > left) {
                wrapLeft = left - appLeft;

                (document.querySelectorAll('.template-wrap')[i])["style"].left = wrapLeft.toString() + "px";
                (document.querySelectorAll('.template-wrap')[i])["style"].position = "relative";

            } else {
                (document.querySelectorAll('.template-wrap')[i])["style"].left = "0px";

            }

        }

    }
//*************************************************************** Raccourcis clavier *************************************/
 // On Dialog close, 'Open' Button will be shown
 public dialogClose = (): void => {
    document.getElementById('dlgbtn').style.display = '';
    console.log(this.Dialog)
}
// On Dialog open, 'Open' Button will be hidden
public dialogOpen = (): void => {
    document.getElementById('dlgbtn').style.display = 'none';
    console.log(this.Dialog)
}


public confirmDlgBtnClick = (): void => {
    this.Dialog.hide();
    console.log(this.Dialog)
}
public BtnClick = (): void => {
    this.Dialog.show();
    console.log(this.Dialog)
}
//************************************* */remise multiple au backlog  et suppression definitive / deplacement multiple******************************************///
clickBtnDeplacement(){
    console.log(this.containerBrutSelected)
    console.log(this.workorderbrutSelected)
}
public deplacementMultipleEvent : boolean =  false;
public workorderSelected = []
deplacementMultiple(args){
    console.log(args)
    console.log(this.eventSelecte);
    // this.containerSelected = [];
    // this.containerBrutSelected =[];
    // this.workorderbrutSelected =[];
    // this.eventSelecte = this.eventSelecte.filter(item=>item.AzaIsPere)
    console.log(this.eventSelecte)
    let dateValue = args.value;
    this.clickDrop = true
    console.log(dateValue.getTime())
    this.eventSelecte.map(item =>{
        //recuper l'heure des anciens container et la nouvelle date vers laquelle on veut déplacer les events
let heureStart = moment(item.StartTime).format('HH');
let minuteStart =moment(item.StartTime).format('mm');
let heureEnd = moment(item.EndTime).format('HH');
let minuteEnd =moment(item.EndTime).format('mm');
let newStarttimeAfterChange =  moment(dateValue).add(heureStart,'h').add(minuteStart,'minute').toDate();
let newEndTimeAfterChange =  moment(dateValue).add(heureEnd,'h').add(minuteEnd,'minute').toDate();
item.StartTime = newStarttimeAfterChange;
item.EndTime =  newEndTimeAfterChange

if(item.AzaIsPere){
 
this.containerSelected.push(item); //utiliser le containerSelected pour ajouter les containers sélectionné à la nouvelle données dans timelineResssourceDataOut

console.log(this.containerSelected)
console.log(item)
this.updateContainer(item)
}else{
let workorder = this.containerSelected.map(itemContainer => itemContainer.Id == item.AzaNumGroupe);
if(workorder.length>0){
    workorder.map(item =>{
        this.workorderSelected.push(item)
    })

    console.log(this.workorderSelected)
}
}



    })
}
public numberOfDeleteWorkOrder = 0
remiseMultiselectionBacklog(){
if(this.eventSelecte.length>0){
    this.eventSelecte.map(item =>{
        this.numberOfDeleteWorkOrder = this.numberOfDeleteWorkOrder +1
        if(!item.AzaIsPere){
        this.deleteEvent(item);
    }else{
        this.deleteContainer(item.Id, item);
    }
    })
   console.log("LENGTH ====>",this.numberOfDeleteWorkOrder )
}
}
suppressionDefinitive(){
    if(this.eventSelecte.length>0){
        this.eventSelecte.map(item =>{
            if(!item.AzaIsPere){
                let workorderDataBrut = this.allDataWorkorders.filter(itemBrut => itemBrut.Id_Planning_Events == item.Id)
                this.updateStatutWorkorderBeforeDelete(workorderDataBrut[0]["Id_Planning_Events"],workorderDataBrut[0],'planner')
            // this.deleteWorkOrder(item)
            }else{

                this.deleteContainerForGood(item.Id, item)
              
                this.updateEventSetting(this.timelineResourceDataOut)
            }
    })

    }
    console.log("suppression definitive")
}
suppressionDefinitiveWorkOrderBacklog(){
  if(this.workorderSelectedInBacklog.length>0)  {
    this.workorderSelectedInBacklog.map(item =>{
        this.deleteWorkOrderForGood(item.Id,'backlog')
        this.displayWorkorderInBacklogWorkorderData(item , 'delete')
         
    })
    console.log("suppression definitive backlog")
}
}

public cliqueComptEventMultiSelect : boolean =false

selectItemInGrid(args){
    console.log(args);
  
    (this.scheduleObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as any).click();
    // let calendar = (this.scheduleObj.element.querySelectorAll('.e-calendar')[0] as any).ej2_instances[0];
    let data = args
    this.scheduleObj.selectedDate = data.StartTime
    this.scheduleObj.currentView = "TimelineDay";
    let day = this.scheduleObj.element.querySelectorAll('.e-timeline-day');
    addClass([day[0]], ['e-active-view']);
    let week = this.scheduleObj.element.querySelectorAll('.e-timeline-week');
    removeClass([week[0]], ['e-active-view']);
    (this.scheduleObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as any).click();
    setTimeout(() => {
        let time = moment(data.StartTime).format('HH:mm')
        this.scheduleObj.scrollTo(time)
       
    }, 50);
}
onActionFailure(event){
console.log(event)
}
}