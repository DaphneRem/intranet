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
    Injector
  } from "@angular/core";
  import {NgForm} from '@angular/forms';
  import { MatDialog } from '@angular/material';
  import { Store } from '@ngrx/store';
  import { App, User } from '../../../../apps/k-planner/src/app/+state/app.interfaces';
  import * as moment from 'moment';
  import swal from 'sweetalert2';
  import Swal from 'sweetalert2/dist/sweetalert2.js'
  import { Subject } from 'rxjs/Subject';
  import { takeUntil } from 'rxjs/operators';
  
  // Syncfusion Imports
  // Synfucion Bases
  import { extend, closest, remove, createElement, addClass, L10n, loadCldr, isNullOrUndefined, Internationalization, removeClass, Draggable } from '@syncfusion/ej2-base';
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
  import { ChangeEventArgs as DropDownChangeArgs, DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
  import { TimePickerComponent } from '@syncfusion/ej2-angular-calendars';
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
  import { DataManager, ReturnOption, Query, Predicate, } from '@syncfusion/ej2-data';
//   import { Grid } from '@syncfusion/ej2-angular-grids';
  import { SpinSettingsModel } from "@syncfusion/ej2-splitbuttons";
  import { splitClasses, ConditionalExpr } from "@angular/compiler";
  import { CustomIconsModule } from "@ab/custom-icons";
  import { Navbar } from "@ab/root";
  import { StatutService } from "../services/statut.service";
  import { Statut } from "../models/statuts";
  import { WorkOrderTempsReelService } from "../services/workorder-tempsReel.service";

import { UtilisateurService } from "../services/utilisateur.service";
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
          WorkOrderTempsReelService
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
      @ViewChild('reel') 
      public reel: CheckBoxComponent;
      @ViewChild('theorique') 
      public theorique: CheckBoxComponent;
      @ViewChild('selectplan')
      public listObj: DropDownListComponent;
      @ViewChild('selectplage')
      public selectplage: DropDownListComponent;
      @ViewChild('selectOperateur')
      public selectOperateur: DropDownListComponent
      @ViewChild('eventTemplate')
      public eventTemplate : any
     @Input() groupeCoordinateur
     @Input() itemCoordinateur
     @Input() userStore
      
      private onDestroy$: Subject<any> = new Subject();
  
      public dataAllEventsReady = false;
      public dataRegieReady = false;
      public activeViewTimelineDay: ScheduleComponent;
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
   
      public colorStatut: Object[] = [
          { Id: 0, Color: '#e8e2ae' },
          { Id: 1, Color: '#e8e2ae' },
          { Id: 2, Color: '#2471A3' }, // pise en charge
          { Id: 3, Color: '#F3BE09' }, //  STATUT_A_AFFECTER JAUNE
          { Id: 4, Color: '#F3BE09' },
          { Id: 5, Color: '#7FB3D5' }, //  STATUT_A_FINIR(pause)
          { Id: 6, Color: '#3ba506' }, //  STATUT_TERMINE_OK VERT
          { Id: 7, Color: '#B01106' }, //   STATUT_TERMINE_KO ROUGE
          { Id: 8, Color: '#F39009' }, //   STATUT_EN_ATTENTE ORANGE
          { Id: 9, Color: '#e8e2ae' },
          { Id: 10, Color: '#3ba506' },//  STATUT_TACHES_OK
          { Id: 11, Color: '#B01106' },
          { Id: 12, Color: '#17AAB2' },
          { Id: 13, Color: '#17AAB2' }
      ]
//PLAGES HORAIRES
      public plagesHoraires: Object[] = [
        { text: 'Plage horaire matin', Code:1 },
        { text: 'Plage horaire jour', Code:2 },
        { text: 'Plage horaire soir', Code:3 },
        { text: 'Toute la journée', Code:4 }
    ]
      public fieldPlagesHoraires = { text: 'text', value:'Code' };
      public  choixPlagesHoraires = "Plages horaire"
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
      public statutWorkorder: Object[] = [];
      public allRegies: Object[] = [];
      public idExisting = [];
      public libGroupe: LibelleGroupe[] = []
      public lastRandomId;
  
      public WorkorderByContainerId;
      public codegroupe;
      public libelleGroupe
      public filtermonteurListeArray;
      public otherSchedule : string = "Autres plannings" ;
      public otherMonteur : string = "Autres Monteurs" ;
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
      public intervalValue: string = '120'
      public intervalValueDay: string = '60'
      public intervalData: string[] = ['10', '20', '30', '40', '50', '60','120','480']
  
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
      // ALL ACTIONS
      public isTreeItemDropped: boolean = false; // drag and drop wworkorder
      public isTreeItemDroppedMonteur: boolean = false; // drag and drop operateur
      public zoomCont: number = 0
      public valueMax: number = 60
      public value: number =60
      public valueAdd: number =5
      public refreshF4 : boolean
      public navigation: boolean = false;
      public intervalChanged: boolean = false
      public isStrictMode: boolean = true;
      public statutMonteur = []
    public isClickZoom = true 
    public offsetCell
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
          private statutService:StatutService,
          private workOrderTempsReelService : WorkOrderTempsReelService,
          private store: Store<App>,
          private injector: Injector
       
      ) {
          console.log('******* constructor start *******');
          this.isnotMyGroup = false;     
        setTimeout(() => {
            
      
          document.body.addEventListener('keyup', (eKey: KeyboardEvent) => {
              let btnrefresh = document.getElementById('btn-refresh');
              let btnrefreshWo = document.getElementById('btn-refreshWo');
              let scheduleElement = document.getElementsByClassName('schedule-drag-drop');
       
             
              if (eKey.keyCode === 115) {
  
                  if (this.hiderefresh == false &&  this.disabledrefresh == false  ) {
                    console.log("clique f4 !disabledrefresh")
                    this.timelineResourceDataOut = []
                    this.departmentDataSource = []
                    this.allDataContainers = []
                    this.allDataWorkorders = []
                     this.refreshScheduler()
                     this.refreshWorkordersBacklog()
                 
                  }else {
                      console.log("pas de refresh ")
                  }
                  eKey.preventDefault()
                  console.log(btnrefresh, btnrefreshWo)
  
              }
       
  
          })
        }, 200);
          document.body.addEventListener('keydown', (eKey: KeyboardEvent) => {
            let btnrefresh = document.getElementById('btn-refresh');
            let btnrefreshWo = document.getElementById('btn-refreshWo');
            let scheduleElement = document.getElementsByClassName('schedule-drag-drop');
     
           
            if (eKey.keyCode === 115) {

                if (this.hiderefresh == false &&  this.disabledrefresh == false  ) {
                  console.log("clique f4 !disabledrefresh")
                  this.timelineResourceDataOut = []
                  this.departmentDataSource = []
                    this.allDataContainers = []
                    this.allDataWorkorders = []
                }else {
                    console.log("pas de refresh ")
                }
  

            }
     

        })
        //   let schedule+++--+-+-+--Element = document.getElementsByClassName('e-table-container');
        //    let scheduleElement = document.getElementsByClassName('schedule-drag-drop');
         
           document.body.addEventListener('keydown', (eKey: KeyboardEvent) => {
            let scheduleElement: Element = document.querySelector('.e-schedule');
            let scheduleObj: Schedule = ((scheduleElement as EJ2Instance).ej2_instances[0] as Schedule);
            // if(this.isClickZoom){
            if (eKey.key === '-' ) {
                // -------------------------------------------------           
            this.isClickZoom = false
                this.intervalChanged = true;
                this.value = this.value + this.valueAdd;
                scheduleObj.timeScale.interval += 5;     
          
                setTimeout(() => {
                    this.zoomWithScroll()
                    
                }, 100);
                this.eventSettings.dataSource = this.timelineResourceDataOut
                console.log(this.value , this.valueMax)
           
           } else {
      
               if (eKey.key === '+' && this.value > 5 ) {
                      //+++++++++++++++++++++++             
                      this.intervalChanged = true;
                      this.value = this.value - this.valueAdd;
                      scheduleObj.timeScale.interval -=5;
                
                    setTimeout(() => {
                        this.zoomWithScroll()  
                    }, 70);
            
              if(this.value === 5){    

              }
              console.log( "+++++++",eKey )
  
              this.eventSettings.dataSource = this.timelineResourceDataOut
               }

        //    }
        }
   

        }, true);
        this.getStatut();
     
          console.log('******* constructor end *******');
      }
     public scrollLeft
      ngOnInit() {

          this.activeViewTimelineDay = this.scheduleObj;
          console.log(this.store);
          console.log(this.selectedDate, moment().add(1, 'd').toDate());
          
      
          this.storeAppSubscription();
          window.addEventListener('scroll', this.scroll, true);    
        
       
        
      }
  
    @HostListener('mouseenter') onMouseEnter() {
      // alert("Don't touch my bacon!");
    }
    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event) {
        console.log(event)
        return event.returnValue = "Êtes-vous sure de vouloir quitter le k-planner ?";

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
      public operateurSelected
      onClickedNode(event){
        console.log('ON Node Clicked ====> ', event.nodeData.text.length);
        console.log('ON Node Clicked ====> ', event)
        let point = "."
        let text = event.node.innerText
        let operateur = text.split( point)
        this.operateurSelected = operateur[0]
        console.log( this.operateurSelected)
      }
      ngAfterViewInit() {
          this.departmentDataSource = this.departmentGroupDataSource;
        
        
      }
  
      ngOnDestroy() {
          this.onDestroy$.next();
          window.removeEventListener('scroll', this.scroll, true);
        //   document.body.removeEventListener('keyup', (eKey: KeyboardEvent)=>{})
        //   document.body.removeEventListener('keydown', (eKey: KeyboardEvent) => {})
      }
  
  
      public disabledrefresh: boolean 
      public hiderefresh: boolean 
      refreshScheduler() {
          console.log(this.scheduleObj,this.disabledrefresh);
          this.departmentGroupDataSource = [];
          this.disabledrefresh = true;
          this.hiderefresh = true;
          this.planningChanged = false ;
          console.log('refresh scheduler click in refreshScheduler() => ', this.disabledrefresh );
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
          if(this.departmentGroupDataSource.length == 0 ){
          this.getSalleByGroup( this.idGroupeCoordinateur, this.refreshDateStart, this.refreshDateEnd);
        }
          console.log('this.refreshDateStart : ', this.refreshDateStart);
          console.log('this.refreshDateEnd : ', this.refreshDateEnd);
          console.log('refresh scheduler with my regies group');
          console.log(this.timelineResourceDataOut)

        //   this.departmentDataSource = this.departmentGroupDataSource; //bug btn rafraichir
          this.openEditorCount = 0;
      
        //*****************************************************garder l'etat des checkboxs *************************************************************
          this.Check = 0
       setTimeout(() => {                   
            this.onChangeDataSource()
            
              }, 1000);
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
                //   this.searchwo.value = ""
                 
                  console.log(this.searchString,valueSearch)
                  setTimeout(() => {
                    if (this.searchString != undefined) {
                        console.log("clic bouton refresh ")
                        this.searchwo.value = this.searchString
                        this.onFilter(this.searchwo.value, 0, this.argsKeyboardEvent)
                    } else {
                    }   
                  }, 200);
          
         
      }}
  refreshDate(){
    if ((this.refreshDateStart === undefined || this.refreshDateEnd === undefined) && this.scheduleObj.currentView === 'TimelineDay') {
        this.refreshDateStart = moment().toDate();
        this.refreshDateEnd = moment().add(1, 'd').toDate();
    }
  }
   
      public idCoordinateur
      public groupCoordinateur
      public   idGroupeCoordinateur 
      getCoordinateurByUsername() {
        this.timelineResourceDataOut = [];
        this.departmentGroupDataSource = [];
        this.allDataContainers = [];
        this.allDataWorkorders = [];
        console.log('get Current Coordinateur');
        let startofDay = moment().toDate()
        let endofDay = moment().add(1, 'd').toDate();
     
            this.idGroupeCoordinateur = this.groupeCoordinateur
              
                    console.log('COORDINATEUR => ', this.itemCoordinateur, this.idGroupeCoordinateur );
                    this.getTypeRessourceMonteur()
               
                this.getSalleByGroup(this.groupeCoordinateur, startofDay, endofDay);
                this.getMonteursByGroup(this.groupeCoordinateur);
                this.getWorkOrderByidGroup(this.groupeCoordinateur);
                this.getAllMonteurs(this.groupeCoordinateur);
                this.currentCoordinateur = this.itemCoordinateur;
                this.getLibGroupe(this.groupeCoordinateur)
                this.groupCoordinateur = this.groupeCoordinateur
              
           

    }
  
      storeAppSubscription() {        
                  this.user = this.userStore;            
                  console.log(this.user);
                  if(this.user.shortUserName === this.itemCoordinateur.Username){
                  this.getCoordinateurByUsername();
                }        
      }


      onEventClick(e: ActionEventArgs) {
          console.log('event clicked !!!!!!!!!!!',e);
     
          this.eventClick = true;
// this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut
      }
      public eventHoverData
      onHover(args :HoverEventArgs ){
        // console.log(args)
        this.offsetCell = args.element["offsetLeft"]
        if(args.element.className === "e-appointment e-lib e-draggable"){
        //   console.log(args)
          this.eventHoverData = args.element
        //   console.log( this.eventHoverData)
      
      } else {

        // this.eventHoverData = args.element.dataset 
           
     }
    }
 
  
      zoomWithScroll(){
       
        this.scheduleObj.element["ej2_instances"][0].refreshEvents()
        let len = document.querySelectorAll('.e-appointment').length;  
        if(this.eventHoverData != null){
        for (let i = 0; i < len -1; i++) {
          let event = document.querySelectorAll('.e-appointment')[i] as any;
      
       
     if(this.eventHoverData != null || undefined){  
          if (event.getAttribute("data-id") === this.eventHoverData.dataset.id) { 
            console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
            console.log(event,'event ')
            // console.log((event.getAttribute("aria-label") === this.eventClickData['Name']))
            // document.querySelector('.e-content-wrap').scrollTop = document.querySelector('.e-content-wrap').scrollTop;
            document.querySelector('.e-content-wrap').scrollLeft = event.offsetLeft ;
            // this.scheduleObj.dataBind()
            this.isClickZoom = true
          }else {
            // document.querySelector('.e-content-wrap').scrollLeft = this.offsetLeftCell
            this.isClickZoom = true
          }
        }
        } }
       //else{
           // let cell = document.querySelectorAll('.e-work-cells') as any;
          //  console.log("Cell click",this.offsetCell  )
      
                    
          //  for(let i = 0 ; i<cell.length ; i++){
          //            if (this.offsetLeftCell.dataset.date === cell[i].dataset.date && this.offsetLeftCell.dataset.groupIndex === cell[i].dataset.groupIndex ){
         //               console.log(cell[i],'event ')
           //             // document.querySelector('.e-content-wrap').scrollLeft = 
           //             document.querySelector('.e-content-wrap').scrollLeft = cell[i].offsetLeft || cell[i].offsetLeft +100 || cell[i].offsetLeft -100   
           //             console.log( document.querySelector('.e-content-wrap').scrollLeft)
          //          }
          //          if(i === cell.length - 1){
           //             this.isClickZoom = true
           //         }
           //           }
            
                   
        // }
      } 
   
//    
  
  
      /****************************************************************************************************************************************/
      /*************************************************************** API REQUEST ************************************************************/
      /****************************************************************************************************************************************/
  
      /************************************************************/
      /**************************** GET ***************************/
  
      public firstCallGetContainersByRessourceStartDateEndDate = 0
      public lastSalle = false
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
                          Id: item.CodeRessource,
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
                      let indexSalle = this.salleDataSource.indexOf(item);
                      if(indexSalle === (this.salleDataSource.length - 1)){
                        this.lastSalle = true 
                        console.log(this.salleDataSource[indexSalle],"-----------------------------lastSalle")
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

                      if(  this.planningChanged || this.clicFermerOnActionComplete ){  
                          if(this.reel.checked){
                              console.log(" this.planningChanged  was changed ", idGroup)
                      this.getWorkorderTempsReelByIdGroupeStartDateEndDate(idGroup, debut,fin,item.CodeRessource,item.CodeSalle) 
                    
                    }
                }
                  }); 
                  this.filterAfterRefresh();
                  // let startofDay = moment().toDate()
                  // let endofDay = moment().add(1, 'd').toDate();
                //   this.timelineResourceDataOut = []
                //   if(this.firstCallGetContainersByRessourceStartDateEndDate == 0 ){
                  this.salleDataSource.forEach(salle => {
                 
                   
                  });
            
              })
              this.listeRegies = this.departmentGroupDataSource
        
      }
  
      getSalleAll(currentGroup, start, end) {
          this.departmentDataSourceAll = [];
          // this.toggleBtn.iconCss = 'e-play-icon';
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
                  console.log('--------------------------------------------------indexSalle => ', indexSalle );
                  this.getContainersByRessourceStartDateEndDate(
                      salle.CodeRessource,
                      start,
                      end,
                      salle.CodeSalle,
                      indexSalle,
                      currentGroup
                  );
              });
  
  
          });
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
                          this.fieldsMonteur = { text: "Username", value: "Username"}
                
                      }
                    
                      this.typeRessourceMonteur.map((statut,index) =>{
             
                         if(statut.Code == item.typeressource  ){
                              this.statutMonteur.push({
                               Name: item.Username,
                               Libelle: statut.Libelle,
                               typeRessource:item.typeressource
                              })
                            this.statutMonteur.sort()
                         } else{
                          
                         }
               
                       })
                      
             
                  });
                  console.log(this.statutMonteur,"Avant ==>")
              

                          for( let i = 0; i < this.statutMonteur.length - 1 ; i++){
                               
                          if(this.statutMonteur[i].Name == this.statutMonteur[i + 1].Name  ){

                                this.statutMonteur.splice(i,1)
                                     if(this.statutMonteur[i + 1] != undefined ){
                                let operateur = this.statutMonteur.filter(item=> item.Name == this.statutMonteur[i + 1].Name )                     
                                      if(operateur.length>= 2){
                                        this.statutMonteur.splice(i,1)
                                       }
                                    }
                                                    
         }

     }
    
                console.log(this.statutMonteur,"Apres ==>")
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
                      id: 'idressourcetype',
                      text: 'Username',
                      codeRessource : "CodeRessource",
                      typeRessource:"typeressource"
                  };
              });
          console.log('fieldmonteur:', this.fieldMonteur);
          console.log('monteur:', this.monteurDataSource);
    // if( this.monteurDataSource != undefined){
    //       this.monteurDataSource.map(monteur =>{
      
    //         this.typeRessourceMonteur.map(statut =>{
    //          console.log(statut.Code, monteur.typeressource)
    //           if(statut.Code == monteur.typeressource){
    //                this.statutMonteur.push({
    //                 Name: monteur.Username,
    //                 Libelle: statut.Libelle
    //                })
    //                console.log( this.statutMonteur,"++++++++++++++++++++")
    //           } else{
               
    //           }
    
    //         })
    //     })
    // }   
   
      }



    
      public typeRessourceMonteur
        getTypeRessourceMonteur(){
      this.monteursService
      .getTypeRessource()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(statut => {
          console.log(statut)
     this.typeRessourceMonteur = statut

      })


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
      public statutsService
      public statutLibelle
      getStatut(){
          console.log("debut get statut")
          let couleur
          this.statutService
              .getStatut()
              .pipe(takeUntil(this.onDestroy$))
              .subscribe(data =>{
                  this.statutsService = data
                  this.statutsService.map(item =>{
                      this.colorStatut.map(statut =>{
                          if(item.code === statut["Id"]){
                              couleur = statut["Color"]
                         }
                      })
                  
                     this.statutWorkorder.push({Code:item.code,
                                                Color:couleur,
                                                 libelleStatut: item.libelle_operateur })
                   
                  })
                  console.log("statut", this.statutWorkorder) 
             
                
          })
      }
      public lastSalleCall = false;
      public lastContainerCallLength
      public disableNavigation  = false
      getContainersByRessourceStartDateEndDate(coderessource, datedebut, datefin, codeSalle, indexSalle,idGroup) {
      //     this.timelineResourceDataOut = []
      //     this.allDataWorkorders = []
      //    this.allDataContainers = [];

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
                  this.dataContainersByRessourceStartDateEndDate = res;
                  // console.log('container present in regie : ',  this.dataContainersByRessourceStartDateEndDate);
                  // console.log('debut =>', debut);
                  // console.log('fin =>', fin);
                  // console.log('coderessource salle => ', coderessource);
                console.log("res ===>",res)
            
                  if (res.length > 0) {
                      this.allDataContainers = [...this.allDataContainers, ...res];
                      // console.log('regie contains container : ', res.length);
                      this.dataContainersByRessourceStartDateEndDate.map(data => {
                        console.log("data ===>",data)
                          let indexContainer =  this.allDataContainers.indexOf(data)
                          console.log("allDataContainers",this.allDataContainers)
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
                              Description: data.Commentaire_Planning,
                              Operateur: data.LibelleRessourceOperateur === null ? '' : data.LibelleRessourceOperateur,
                              coordinateurCreate: initiales,
                              AzaIsPere: true,
                              AzaNumGroupe: data.Id_Planning_Container,
                              DepartmentID: coderessource,
                              ConsultantID: 2,
                              DepartmentName: '',
                              IsAllDay: false,
                              Commentaire: data.Commentaire,
                              Commentaire_Planning: data.Commentaire_Planning,
                              IsReadonly: false,
                              isTempsReel:0,
                              CodeRessourceCoordinateur:data.CodeRessourceCoordinateur
                          });
                          let index = this.dataContainersByRessourceStartDateEndDate.indexOf(data);
                          let length = this.dataContainersByRessourceStartDateEndDate.length;
         
                          console.log('--------------------------------------------------index  length => ', index , length);
                          this.getWorkorderByContainerId(data.Id_Planning_Container, coderessource, index, length, indexSalle,debut,fin ,data.LibelleRessourceOperateur);
                       
                          
                          
                        
                         
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
                    this.updateEventSetting(this.timelineResourceDataOut);
                    this.createTooltipWorkorder();
                      // console.log('this.scheduleObj.eventSettings.dataSource ', this.scheduleObj.eventSettings.dataSource);
                      console.log(this.timelineResourceDataOut,"timelineDataOut getContainer ")
                  } else {
                      // console.log('container not present for regie : ', coderessource, res);
                  
                      if (indexSalle === (this.salleDataSource.length - 1)) {
                          this.lastSalleCall = true;
                        console.log("pas de container")
         
                        console.log("length last call",length,indexSalle, this.lastContainerCallLength)
                                   this.disableNavigation = false;
                                  if(!this.disableNavigation){
                               let toolbar = document.getElementsByClassName('e-toolbar-items');
                               for(let i =0; i<toolbar.length; i++){
                                   toolbar[i]["style"].display = 'block'
                         
                               }
                             }
                         
                             this.disabledrefresh = false
                             this.hiderefresh = false
                  
                             this.updateEventSetting(this.timelineResourceDataOut);
                             this.createTooltipWorkorder();
                      }
   
                  }
              //   if( this.timelineResourceDataOut.length === 0){
                   
              //       let toolbar = document.getElementsByClassName('e-toolbar-items');
              //       for(let i =0; i<toolbar.length; i++){
                        
              //               toolbar[i]["style"].display = 'block'
                       
                  
                  
              //       }
              //   }
          
              });
            
              console.log("allDataContainers length",this.allDataContainers.length) 
              console.log("allDataworkorder length",this.allDataWorkorders.length) 
      }
      public allDataWorkorders = [];
      public libelleStatut
      getWorkorderByContainerId(id, coderessource, index, containerArrayLength, indexSalle,debut,fin, Operateur) {
          console.log('CALL getWorkorderByContainerId() with idContainer : ', id);   
          // console.log('--------------------------------------------------indexSalle => ', indexSalle);
          // console.log('id container to check workorder => ', id)
       
          // console.log('index => ', indexSalle);
          // console.log('containerArrayLength => ', containerArrayLength);
  
          this.workorderService
              .getWorkOrderByContainerId(id)
              .pipe(takeUntil(this.onDestroy$))
              .subscribe(res => {
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
                              dateFin = EndTime
                              this.statutWorkorder.map(item =>{
                                if(data.Statut === item["Code"]){
                             libelleStatut = item["libelleStatut"]
                            }
                     } )

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
                              coordinateurCreate: data.UserEnvoi ,
                              Statut: data.Statut,
                              AzaIsPere: false,
                              AzaNumGroupe: data.Id_Planning_Container,
                              DepartmentID: coderessource,
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
                              isTempsReel:0,
                              IsReadonly: false,
                              Id_Planning_Events_TempsReel:0,
                              titreepisode:data.titreepisode,
                              DateDebutReel:data.DateDebut,
                              DateFinReel: data.DateFin,
                              libelleStatut:libelleStatut,
                              CodeRessourceCoordinateur:data.CodeRessourceCoordinateur,
                             
                          }
  
                     
                          this.timelineResourceDataOut.push(newWorkorderEvent);
                        
                      });
                      // récuperer les containers de la derniére régie
                      let containerEvent = this.timelineResourceDataOut.filter(item => item.CodeRessourceSalle === this.salleDataSource[(this.salleDataSource.length - 1)].CodeRessource && item.AzaIsPere === true);
                    //   console.log(this.salleDataSource[0].CodeRessource)
                      let indexContainer
                      containerEvent.map(data => {
                          indexContainer = containerEvent.indexOf(data)
                      })
                      console.log(this.allDataWorkorders)
                      //    if){
                      if ((indexContainer === (containerEvent.length - 1)) && (indexSalle === (this.salleDataSource.length - 1))  ) {
                          this.lastSalleCall = true;
  
                          console.log('*********** end to initial request for all regies container and workorders ***********');
                        
                          // récuperer les workOrders du dérnier container de la derniére régie
                          let workorderEvent = this.timelineResourceDataOut.filter(item => item.AzaNumGroupe === containerEvent[indexContainer].AzaNumGroupe && item.AzaIsPere === false && item.isTempsReel ===0);
                          let indexWorkorder
                          workorderEvent.map(data => {
                              indexWorkorder = workorderEvent.indexOf(data)
                          })
                          console.log(containerEvent, "=========> containerEvent ")
                          console.log(workorderEvent, "=========> workorderEvent ")
                          this.disableNavigation = false;
                          if (workorderEvent.length === 1) {
                              console.log("dernier Workorder du dernier container ===>", workorderEvent[indexWorkorder])
                              console.log("dernier Container ===>", containerEvent[indexContainer])
                              if (!this.disableNavigation) {
                                  let toolbar = document.getElementsByClassName('e-toolbar-items');
                                  for (let i = 0; i < toolbar.length; i++) {
                                      toolbar[i]["style"].display = 'block'
                                      console.log(toolbar[i]["style"], "block", this.salleDataSource[this.salleDataSource.length - 1])
                                  }
                              }
                              setTimeout(() => {
                                this.disabledrefresh = false
                                this.hiderefresh = false  
                              }, 50);
                           this.lastSalle = false
                              // }
                              console.log("THIS.ALLDATAWORKORDER", this.allDataWorkorders)
                          } else {
                              if (indexWorkorder === (workorderEvent.length - 1)) {
                                  console.log("+sieurs workorders",workorderEvent, workorderEvent[indexWorkorder])
                                  if (!this.disableNavigation) {
                                      let toolbar = document.getElementsByClassName('e-toolbar-items');
                                      for (let i = 0; i < toolbar.length; i++) {
                                          toolbar[i]["style"].display = 'block'
                                          console.log(toolbar[i]["style"], "block", this.salleDataSource[this.salleDataSource.length - 1])
                                      }
                                  }
                                  setTimeout(() => {
                                    this.disabledrefresh = false
                                    this.hiderefresh = false  
                                 
                                  }, 100);
                                  this.lastSalle = false
                              }
                               
                          }
                          this.updateEventSetting(this.timelineResourceDataOut);
                          this.createTooltipWorkorder();
                         
                      }
                      // }
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
                      // this.getWorkorderTempsReelByIdGroupeStartDateEndDate(idGroup, debut,fin,codeSalle)
                     
  
                  } else {    
                      // récuperer les container de la derniére régie
                      let containerEvent = this.timelineResourceDataOut.filter(item => item.CodeRessourceSalle === this.salleDataSource[(this.salleDataSource.length - 1)].CodeRessource && item.AzaIsPere === true);     
                      let indexContainer
                      containerEvent.map(data => {
                          indexContainer = containerEvent.indexOf(data)
                      })
                      if ((indexContainer === (containerEvent.length - 1)) && (indexSalle === (this.salleDataSource.length - 1)) ) {
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
                        
                          this.updateEventSetting(this.timelineResourceDataOut);
                          this.eventSettings = {
                     
                            enableTooltip: true, tooltipTemplate: this.temp
                        };
                        this.createTooltipWorkorder();
                      }
                   
                
                    
                  }
  
              });
          
     
      }
  public dataWorkorderTempsReelByIdGroupeStartDateEndDate
  public EndTimeReel; StartTimeReel
  public newWorkorderTempsReelEvent 
      getWorkorderTempsReelByIdGroupeStartDateEndDate(idGroupe, dateDebut,dateFin,codeRessouceSalle,codeSalle){
     
        this.workOrderTempsReelService 
        .getWorkorderTempsReelByIdGroupeStartDateEndDate(idGroupe, dateDebut,dateFin)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(res =>{
            console.log("call getWorkorderTempsReelByIdGroupeStartDateEndDate () ", res)
        console.log(res, "<========================================== res temps reel") 
        console.log("date debut ===>",dateDebut,"date fin ===>",dateFin)
        this.dataWorkorderTempsReelByIdGroupeStartDateEndDate = res;
    
        if (res.length > 0) {
       this.createTooltipWorkorder()
            this.dataWorkorderTempsReelByIdGroupeStartDateEndDate.map(data => {
            
                let dateDebut = moment(data.DateDebutReel, moment.defaultFormat).toDate(),
                 dateFin = moment(data.DateFinReel, moment.defaultFormat).toDate(),
                 dateDebutTheo = moment(data.DateDebutTheo, moment.defaultFormat).toDate(),
                 dateFinTheo = moment(data.DateFinTheo, moment.defaultFormat).toDate(),
                 codeSalleTempsReel

                 let initiales = data.UserEnvoi.slice(-1) + data.UserEnvoi.slice(0, 1);
      
             if( moment(data.DateFinReel, moment.defaultFormat).isValid()){
           
             }else
             {
              dateFin =moment().toDate()
            //   console.log(dateFin)
             }
       let operateur, libelleStatut
             this.monteurDataSource.map(item => {
                if (item.CodeRessource === data.CodeRessourceOperateur) {
                    operateur = item.Username;
                }
            });

            this.statutWorkorder.map(item =>{
                if(data.Statut === item["Code"]){
             libelleStatut = item["libelleStatut"]
            }
     } )
             if(data.CodeRessourceSalle === codeRessouceSalle){
                // console.log(data.CodeRessourceSalle, "code ressource salle wotr")
                // console.log(codeRessouceSalle ,"code  ressource salle")
                // console.log(codeSalle ,"code salle")
                  codeSalleTempsReel = codeRessouceSalle
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
                  Operateur:operateur,
                  coordinateurCreate:initiales,
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
                  IdGenerationWO: data.IdGenerationWO,
                  isTempsReel:1,
                  IsReadonly: true,
                  Id_Planning_Events_TempsReel: data.Id_Planning_Events_TempsReel,
                  Id_Planning_Events: data.Id_Planning_Events,
                  DateDebutTheo:dateDebutTheo,
                  DateFinTheo:dateFinTheo,
                  titreepisode:data.titreepisode,
                  DateDebutReel:dateDebut,
                  DateFinReel:dateFin,
                  libelleStatut: libelleStatut,
                  CodeRessourceCoordinateur:data.CodeRessourceCoordinateur
                  
              }
            
              let tempsReel = []
               tempsReel.push(newWorkorderTempsReelEvent)
               console.log(tempsReel,"tempsReel ........")
              this.timelineResourceDataOut.push(newWorkorderTempsReelEvent);
              console.log(  this.timelineResourceDataOut ," ...  this.timelineResourceDataOut ")
             
              let workorderReelEvent = this.timelineResourceDataOut.filter(item =>  item.isTempsReel ===1);
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
     
          }else{

         
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
       
          
            // this.disableNavigation = false;
            // if (!this.disableNavigation) {
            //     let toolbar = document.getElementsByClassName('e-toolbar-items');
            //     for (let i = 0; i < toolbar.length; i++) {
            //         toolbar[i]["style"].display = 'block'
            //         console.log(toolbar[i]["style"], "block")
            //     }
            // }
            
            // console.log(this.disabledrefresh)
          }
          this.newWorkorderTempsReelEvent =  [... new Set( this.timelineResourceDataOut)]
          console.log( this.newWorkorderTempsReelEvent ," ... this.newWorkorderTempsReelEvent ")
      })
    
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
  let libelleStatut
          for (let i = 0; i < this.timelineResourceDataOut.length; i++) {

           
               
              let titreoeuvre = this.timelineResourceDataOut[i].titreoeuvre,  
                  titreepisode = this.timelineResourceDataOut[i].titreepisode,  
                  numepisode = this.timelineResourceDataOut[i].numepisode,
                  dureecommerciale = this.timelineResourceDataOut[i].dureecommerciale,
                  AzaIsPere = this.timelineResourceDataOut[i].AzaIsPere,
                  libchaine = this.timelineResourceDataOut[i].libchaine,
                  coordinateurCreate = this.timelineResourceDataOut[i].coordinateurCreate,
                  Operateur = this.timelineResourceDataOut[i].Operateur,
                  statut = this.timelineResourceDataOut[i].Statut,
                  DateDebutTheo=this.timelineResourceDataOut[i].DateDebutTheo,
                  DateFinTheo=this.timelineResourceDataOut[i].DateFinTheo,
                  DateDebutReel= moment(this.timelineResourceDataOut[i].DateDebutReel).format("YYYY-MM-DDTHH:mm:ss"),
                  DateFinReel=this.timelineResourceDataOut[i].DateFinReel
                 
              
              this.temp = '<div class="tooltip-wrap">' +
                  '<div class="tooltip-wrap">' +
                  '${if( titreoeuvre != null && titreoeuvre !== undefined )}<div class="content-area"><div class="name" >   Titre Oeuvre :  &nbsp; ${titreoeuvre} &nbsp;<br>  Titre épisode :${titreepisode}  &nbsp; ep &nbsp;${numepisode} <br> Type de Travail: &nbsp; ${libtypeWO} <br> Libellé chaine : &nbsp; ${libchaine}  <br>  Durée Commerciale :&nbsp;${dureecommerciale} <br> Statut :&nbsp; ${libelleStatut} </>  </>  </div> ${/if}' +
                  '${if (!AzaIsPere && isTempsReel === 0 && Commentaire_Planning !== undefined &&  Commentaire_Planning  !== "" &&  Commentaire_Planning  != null) }<div class="time">Retour Opérateur : &nbsp; ${Commentaire_Planning}   </div>  ${/if} </div> '+
                  '${if(   Commentaire_Planning !== undefined &&  Commentaire_Planning  !== "" &&  Commentaire_Planning  != null && AzaIsPere )}<div>Commentaire Coordinateur: &nbsp; ${Commentaire_Planning}  </>  </div> ${/if}' +
                  '${if (AzaIsPere  ) }<div class="time"> Titre: &nbsp;${Name} <br>  Coordinateur: &nbsp; ${coordinateurCreate}  </div> ${/if}' +
                  '${if ( Operateur != null && Operateur !== "" && Operateur !== undefined  ) }<div class="time">Opérateur:&nbsp;${Operateur} </div> ${/if}' + 
                  '${if (Statut === 3 || AzaIsPere ) }<div class="time">Début&nbsp;:&nbsp;${StartTime.toLocaleString()} </div> ${/if}' +
                  '${if (Statut === 3 || AzaIsPere ) }<div class="time">Fin&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;${EndTime.toLocaleString()} </div> ${/if}' +
                  '${if (!AzaIsPere && Statut !== 3 &&   isTempsReel === 0  ) }<div class="time">Début Réel&nbsp;:&nbsp;${DateDebutReel} </div> ${/if}' + //la date valide
                  '${if (!AzaIsPere && Statut !== 3 && Statut !== 2 && Statut !== 5 && isTempsReel === 0  ) }<div class="time">Fin Réel&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;${DateFinReel} </div> ${/if}' +
                  '${if (!AzaIsPere && isTempsReel === 1 ) }<div class="time">Retour Opérateur : &nbsp; ${Commentaire_Planning} <br>  Coordinateur: &nbsp; ${coordinateurCreate} <br>   Début théorique &nbsp;:&nbsp; ${DateDebutTheo.toLocaleString()} <br>Fin théorique &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp; ${DateFinTheo.toLocaleString()}  </div>  ${/if} </div></div> ';
  
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
              console.log("donnee backlog",donnees)
              console.log('getWorkOrderByidgroup', this.WorkOrderByidgroup);
              if (this.WorkOrderByidgroup != []) {
                  let testUser = 'VITIPON-C';
                  this.WorkOrderByidgroup.map(workOrder => {
                      console.log('workorder to map : ', workOrder)
                      let StartTime = moment(workOrder.DateDebutTheo, moment.defaultFormat).toDate(),
                        EndTime = moment(workOrder.DateFinTheo, moment.defaultFormat).toDate();
                      let dateDebut =  StartTime,
                          dateFin= EndTime,
                          libelleStatut
                          this.statutWorkorder.map(item =>{
                            if(workOrder.Statut === item["Code"]){
                         libelleStatut = item["libelleStatut"]
                        }
                 } )

                  this.workOrderData.push({
                      Id: workOrder.Id_Planning_Events,
                      Name: workOrder.titreoeuvre , 
                      StartTime: dateDebut ,
                      EndTime:  dateFin,
                      CodeRessourceSalle: workOrder.CodeRessourceSalle,
                      Container: false,
                      numGroup:workOrder.Id_Planning_Events,
                      Description:workOrder.Commentaire_Planning,
                      Operateur:workOrder.UserMaj,
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
                      isTempsReel:0,
                      IsReadonly: false,
                      Id_Planning_Events_TempsReel:0,
                      titreepisode:workOrder.titreepisode,
                      DateDebutReel:workOrder.DateDebutReel,
                      DateFinReel:workOrder.DateFinTheo,
                      libelleStatut:libelleStatut,
                      CodeRessourceCoordinateur:workOrder.CodeRessourceCoordinateur
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
              this.libGroupe.push({Libelle: "Mon Planning",Code: id  }) 
              })
              this.fieldsPlanning = { text: 'Libelle', value: 'Code' }
          console.log('............................', this.libGroupe)
          console.log(this.idCoordinateur, '################################ ID')
          
      }
      getAllCoordinateurs(){
          this.coordinateurService
          .getAllCoordinateurs()
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(res =>{
            
            res.map(item =>{
                if(item.Groupe === this.currentCoordinateur.Groupe){
                    this.coordinateurListeArray.push(item)
                  
            }  })
              
          })


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
                      if ((+event.AzaNumGroupe === +item.AzaNumGroupe) && !item.AzaIsPere && item.isTempsReel ===0) {
                          if (!this.field['dataSource'].includes(item)) {
                              this.updateWorkorderBackToBacklog(item, event);
                          }
                      }
                  });
                  this.timelineResourceDataOut = this.timelineResourceDataOut.filter(item => {
                    let workorderTempsReel , data
                      if (+event.AzaNumGroupe !== +item.AzaNumGroupe  && item.isTempsReel ===0 ) {
                           data = item;
                      }
                      if( item.isTempsReel ===1){
                           workorderTempsReel = item
                      }
                      return data + workorderTempsReel
                     
                  });
                  console.log(this.timelineResourceDataOut)
                  this.eventSettings = {
                      dataSource: <Object[]>extend(
                          [], this.timelineResourceDataOut, null, true
                      )
                  };
                  this.disabledrefresh = false
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
                      let workorderEventToUpdate = this.creationArray.filter(item => !item.AzaIsPere && item.isTempsReel ===0);
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
                                  isTempsReel:0,
                                  IsReadonly: false,
                                  Id_Planning_Events_TempsReel:0,
                                  titreepisode:item.titreepisode,
                                  DateDebutReel:item.DateDebutReel,
                                  DateFinReel:item.DateFinTheo,
                                  libelleStatut:item.libelleStatut,
                                  CodeRessourceCoordinateur:event.CodeRessourceCoordinateur
                              };
                              this.updateWorkorderInDragDrop(newItemWorkorderAfterEditorUpdate, containerToCreate);
                              console.log('new workorder from post container function: ', newItemWorkorderAfterEditorUpdate);
                          })
                      }       
                      this.timelineResourceDataOut.push(event);        
                      console.log(this.timelineResourceDataOut, 'timelineResourceDataOut');
                      this.createTooltipWorkorder();
                      this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                          dataSource: <Object[]>extend(
                              [], this.timelineResourceDataOut, null, true
                          ),
                          enableTooltip: true, tooltipTemplate: this.temp
                      };           
                      this.creationArray = [];
                      this.disabledrefresh = false
                      this.openEditor = false 
                    
                        this.startResize= false
                  }
              },
                  error => {
                      console.log('ERROR POST CONTAINER !!', error);
                      swal({
                          title: 'Attention',
                          html: 'La création est impossible car l\'emplacement est occupé par un autre container  ' ,
                          showCancelButton: true,
                          confirmButtonText: 'Rafraichir',
                          cancelButtonText: 'Annuler',
                          allowOutsideClick:false
                      }).then((refresh) => {
                          if(refresh.value){
                          this.refreshScheduler()
                      }else{
                          console.log("click annuler")
                      }
                      });
                      this.openEditor = false 
                  
                  this.startResize= false
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
          console.log(event.Name)
          let newContainer = {
              Id_Planning_Container: 0,
              UserEnvoi: this.user.shortUserName,
              DateEnvoi: now,
              Titre: (event.Name == null || typeof(event.Name) == 'undefined') ? 'Titre' : event.Name, // (aucun titre) 
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
              PlanningEventsList: null,
              isTempsReel:0,
             
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
          console.log(container, 'event container') //donnée brute
          let startTime = moment(event.StartTime).format('YYYY-MM-DDTHH:mm:ss');
          let endTime = moment(event.EndTime).format('YYYY-MM-DDTHH:mm:ss');
          let userEnvoi = this.coordinateurListeArray.filter(item => item.Username === containerResult[0].UserMaj )
          console.log(userEnvoi)
          let codeRessourceOperateur ;
        //   let codeRessourceCoordinateur = oldEvent[0].CodeRessourceCoordinateur.length === 0? oldEvent[0].CodeRessourceCoordinateur : this.currentCoordinateur.IdCoord
        //   console.log(codeRessourceCoordinateur,"codeRessourceCoordinateur")
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
          console.log(this.currentCoordinateur.IdCoord,"codeRessourceCoordinateur container")
          console.log(event,"event")
          if(typeof(container) != 'undefined' ){
          let newContainer = {
              Id_Planning_Container: container.Id_Planning_Container,
              UserEnvoi: container.UserEnvoi,
              DateEnvoi: container.DateEnvoi,
              Titre: event.Name || event.Subject ,
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
              Commentaire_Planning: event.Commentaire_Planning || event.Description ,
              DateMaj: now,
              UserMaj: this.user.shortUserName,
              PlanningEventsList: null,
              DepartmentID:codeRessourceSalle,
              IsReadonly:false,
              isTempsReel:0,
          };
          console.log("new Container ==>",newContainer)
          
          this.putContainer(newContainer.Id_Planning_Container, newContainer, event);
          
      }
      }
 
      putContainer(id, container, event) { // call in resize, deplacement and Editor (call in updateContainer() function )
        // this.scheduleObj.readonly = true
     
  
          this.containersService.updateContainerPromise(id, container)
            //   .pipe(takeUntil(this.onDestroy$))
            //   .subscribe(res => {
              .then(res => {
                if(!res["error"]){
                  console.log('succes update container. RES : ', res);
                  console.log(this.allDataContainers, 'allDataContainers')
                  let startDifferent = this.checkDiffExistById(event, this.timelineResourceDataOut, 'StartTime', 'StartTime');
                  let endDifferent = this.checkDiffExistById(event, this.timelineResourceDataOut, 'EndTime', 'EndTime');
                  this.timelineResourceDataOut = this.eventSettings.dataSource as Object[]; // refresh dataSource
                  console.log('this.timelineResourceDataOut : ', this.timelineResourceDataOut);
                  this.timelineResourceDataOut.map(item => {
                      if (item.Id === event.Id) {
                          console.log('event container to update => ', item);
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
                          item.Commentaire_Planning = event.Commentaire_Planning;
                          item.CodeRessourceCoordinateur = event.CodeRessourceCoordinateur
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
                  console.log('this.lastTimelineResourceDataOut => ', this.lastTimelineResourceDataOut);
          
                
                //   this.lastTimelineResourceDataOut.map(item =>{
                //     //   if(item.EndTime.getDate() !== event.DepartmentID){ //provisoire
                //       if (item.Id === id) {
                  
                //           item.DepartmentID = event.DepartmentID;

                //           console.log('old container to push in timelineResourceDataOut =>', item);
                //           this.timelineResourceDataOut.push(item);
                //           console.log('timelineResourceDataOut with new item => ', this.timelineResourceDataOut);
                //       }
                // // }
                //   })
                //   let workorderEventToUpdate = this.timelineResourceDataOut.filter(item => item.AzaNumGroupe === id && !item.AzaIsPere && item.isTempsReel ===0);
                  
            
                   
                        // ************************************************** =========>> a revoir 
                    //     if(this.lastTimelineResourceDataOut.length > 0 ){
                    //   let workorderFromLastTime = this.lastTimelineResourceDataOut.filter(item => item.AzaNumGroupe === id && !item.AzaIsPere && item.isTempsReel ===0);
                    //   if (workorderFromLastTime.length > 0) {
                    //       console.log('workorderFromLastTime ==> ', workorderFromLastTime);
                    //       this.lastTimelineResourceDataOut = this.lastTimelineResourceDataOut.filter(item => item.AzaNumGroupe !== id);
                    //       this.timelineResourceDataOut = [...this.timelineResourceDataOut, ...workorderFromLastTime];
                    //       console.log('this.timelineResourceDataOut ==> ', this.timelineResourceDataOut);
                    //   }
                    // }
                  // let newAllDataContainers = [];
                  // let newAllDataWorkorders = [];
                  // this.timelineResourceDataOut.map(item => {
                  // })
                 
                  this.calculDateGroup(this.timelineResourceDataOut, event.AzaNumGroupe, true, event, startDifferent, endDifferent);
                  let workorderEventToUpdate = this.timelineResourceDataOut.filter(item => item.AzaNumGroupe === id && !item.AzaIsPere && item.isTempsReel===0);
                //   this.allDataWorkorders.filter(item => item.Id_Planning_Container === id  && item.Id_Planning_Events_TempsReel===0);
                  console.log(workorderEventToUpdate)
                  console.log(this.allDataWorkorders)
                  console.log(this.timelineResourceDataOut)
                  if (workorderEventToUpdate.length > 0) {
                    console.log(workorderEventToUpdate)
                        this.updateWorkorderInContainerUpdate(id, container, event);   
                    }
               
                  
                  this.eventSettings = {
                    dataSource: <Object[]>extend(
                        [], this.timelineResourceDataOut, null, true
                    ),
                    enableTooltip: true, tooltipTemplate: this.temp
                };
                  // this.eventSettings = {
                  //     dataSource: <Object[]>extend(
                  //         [], this.calculDateAll(this.timelineResourceDataOut, true, event, startDifferent, endDifferent), null, true
                  //     ),
                  //     enableTooltip: true, tooltipTemplate: this.temp
                  // };           
                  this.disabledrefresh = false
                  this.startResize = false
                  this.openEditor = false 
                } else
                if(res["error"]){
                    console.log('error updatecontainer');
                    this.disabledrefresh = false
                    this.openEditor = false 
                    this.startResize= false
                  //   this.scheduleObj.readonly = false
                    swal({
                        title: 'Attention',
                        html: 'Le déplacement est impossible car l\'emplacement est occupé par un autre container.',
                        showCancelButton: false,
                        confirmButtonText: 'Fermer',
                        cancelButtonText: 'Annuler',
                        allowOutsideClick:false
                    }).then((refresh) => {
                        if(refresh.value){
                        this.refreshScheduler()
                    }else{
                        console.log("click annuler")
                    }
                    console.log(" ok ")
                    this.eventSettings = {
                        enableTooltip: true, tooltipTemplate: this.temp
                    };          
                });
                    
                    
            
                       
                  
                    this.eventSettings = {              
                        enableTooltip: false //disable tooltip
                    };
                }
              }
            //   , error => {
            //       console.error('error updatecontainer', error);
            //       this.disabledrefresh = false
            //       this.openEditor = false 
            //       this.startResize= false
            //     //   this.scheduleObj.readonly = false
            //       swal({
            //           title: 'Attention',
            //           html: 'Le déplacement est impossible car l\'emplacement est occupé par un autre container. <br> <br> Veuillez cliquer sur le bouton  Rafraichir pour l\'afficher',
            //           showCancelButton: false,
            //           confirmButtonText: 'Rafraichir',
            //           cancelButtonText: 'Annuler',
            //           allowOutsideClick:false
            //       }).then((refresh) => {
            //           if(refresh.value){
            //           this.refreshScheduler()
            //       }else{
            //           console.log("click annuler")
            //       }
            //       console.log(" ok ")
            //       this.eventSettings = {
            //           enableTooltip: true, tooltipTemplate: this.temp
            //       };          
            //   });
                  
                  
          
                     
                
            //       this.eventSettings = {              
            //           enableTooltip: false //disable tooltip
            //       };
                  
            //   }
              )
           
      }  
  
  
      /**** PUT CONTAINER WITH OPERATEUR DRAG AND DROP ****/
  
      updateContainerFromDragDropOperateur(operateurObject, dragDropEvent) {
          console.log('updateContainer from drag and drop ',dragDropEvent.target.id);
  
  
          let indexContainerEvent = this.findIndexEventById(dragDropEvent.target.id);
          console.log(indexContainerEvent,"indexContainerEvent ===> ")
          let containerId = this.timelineResourceDataOut[indexContainerEvent]['Id']
          let containerEvent = this.timelineResourceDataOut[indexContainerEvent];
          console.log(containerEvent,"containerEvent ===> ")
  
          let arrayContainerResult = this.allDataContainers.filter(item => item.Id_Planning_Container === containerId);
          let containerResult = arrayContainerResult[0];
          containerResult.LibelleRessourceOperateur = operateurObject.Username;
          console.log( containerResult.LibelleRessourceOperateur )
          containerResult.CodeRessourceOperateur = operateurObject.CodeRessource;
          console.log(  containerResult.CodeRessourceOperateur )
          let id = containerResult.Id_Planning_Container;
          this.putContainerFromDragDropOperateur(id, containerResult, indexContainerEvent, operateurObject, containerEvent);
      }
  
      putContainerFromDragDropOperateur(id, container, indexContainerEvent, operateurObject, containerEvent) { // RESIZE AND EDITOR
          this.containersService.updateContainerPromise(id, container)
            //   .pipe(takeUntil(this.onDestroy$))
            //   .subscribe(res => {
                .then(res => {
                    if(!res["error"]){
                  console.log('succes update container. RES : ', res);
                  this.timelineResourceDataOut[indexContainerEvent]['Operateur'] = operateurObject.Username;
                //   let workorderEventToUpdate = this.timelineResourceDataOut.filter(item => item.AzaNumGroupe === id && !item.AzaIsPere && item.isTempsReel===0);
                  let Operateur =operateurObject.Username;
                  this.updateWorkorderInContainerUpdate(id, container, containerEvent,Operateur);
                  this.onActionComplete('e');
                     } else
                     if(res["error"]){
                    console.error('error updatecontainer');
                    swal({
                        title: 'Attention',
                        text: 'Erreur dans la mise à jour du container lors du drag & drop'+ 'd\'un opérateur',
                        showCancelButton: false,
                        confirmButtonText: 'Fermer',
                        allowOutsideClick:false
                    
                    })

                  }
              }, error => {
                  console.error('error updatecontainer', error);
                  swal({
                      title: 'Attention',
                      text: 'Erreur dans la mise à jour du container lors du drag & drop'+ 'd\'un opérateur',
                      showCancelButton: false,
                      confirmButtonText: 'Fermer',
                      allowOutsideClick:false
                  
                  })
              }
              )
      }
  
  
  
      /*************************************************** WORKORDER ****************************************************/
  
      /*** PUT WORKORDER IN CONTAINER UPDATE ***/
  
      updateWorkorderInContainerUpdate(id, container, event,Operateur?) { // RESIZE AND EDITOR
          console.log('update workorer ! ==> id ==> ', id);
          console.log('update workorer ! ==> container ==> ', container);
          console.log('update workorer ! ==> event ==> ', event);
          // AJOUTER ICI UNE CONDITION SI DATE ACTIVE EST DIFFERENTE DE CELLE PRECEDENTE :
          // FILTRER ALORS SUR ANCIEN TIMELINEDATAOUT
          console.log('this.lastTimelineResourceDataOut ===> ', this.lastTimelineResourceDataOut);
          console.log('this.startofDay ==> ', this.startofDay);
          // this.startofDay = moment(newStartOfDay).toDate();
          // if (this.scheduleObj['activeView'].renderDates[0] === container.st )
          let timelineDataOut = this.timelineResourceDataOut;
          let workorderEventToUpdate = this.timelineResourceDataOut.filter(item => item.AzaNumGroupe === id && !item.AzaIsPere && item.isTempsReel===0);
          let workorderFromLastTime = this.lastTimelineResourceDataOut.filter(item => item.AzaNumGroupe === id && !item.AzaIsPere && item.isTempsReel===0);
          console.log('workorderEventToUpdate => ', workorderEventToUpdate);
          console.log(workorderFromLastTime)
          let numberOfWorkorder = workorderEventToUpdate.length;
          if (workorderEventToUpdate.length > 0) {
              // this.createJustContainerAction = false;
              workorderEventToUpdate.map(item => {
             
                  this.putWorkorderFromUpdateContainer(id, container, event, item,Operateur);         
              });
          // } else if (workorderFromLastTime.length > 0) {
          //     workorderFromLastTime.map(item => {
          //         console.log('!!!!!!!!!!!!!!! ========> item.StartTime before change ===> ', item.StartTime)
          //         let containerStartDay = moment(container.DateDebutTheo).get('date');
          //         let containerStartMonth = moment(container.DateDebutTheo).get('month');
          //         let containerStartYear = moment(container.DateDebutTheo).get('year');
          //         let containerEndDay = moment(container.DateFinTheo).get('date');
          //         let containerEndMonth = moment(container.DateFinTheo).get('month');
          //         let containerEndYear = moment(container.DateFinTheo).get('year');
          //         let dateDebut = item.StartTime;
          //         let dateFin = item.EndTime;
          //         let objectDateDebut = moment(dateDebut).toObject();
          //         let objectDateFin = moment(dateFin).toObject();
          //         let newDateDebut = moment(
          //             `${containerStartDay}.${containerStartMonth}.${containerStartYear} ${objectDateDebut.hours}:${objectDateDebut.minutes}`,
          //             'DD.MM.YYYY HH:mm').toDate();
          //         let newDateFin = moment(
          //             `${containerEndDay}.${containerEndMonth}.${containerEndYear} ${objectDateFin.hours}:${objectDateFin.minutes}`,
          //             'DD.MM.YYYY HH:mm').toDate();
          //         console.log('newDateDebut => ', newDateDebut);
          //         console.log('newDateFin => ', newDateFin);
          //         // newDate.date = containerDay;
          //         // newDate.months = containerMonth;
          //         // newDate.years = containerYear;
          //         // let startTime = moment(newDate).toString();
          //         // console.log(newDate);
          //         item.StartTime = newDateDebut;
          //         console.log('nouvelle dateDebut avec bon format ==> ', newDateDebut);
          //         item.EndTime = newDateFin;
          //         console.log('nouvelle dateFin avec bon format ==> ', newDateFin);
          //         console.log('!!!!!!!!!!!!!!! ========> item after change ===> ', item)
          //         // this.putWorkorderFromUpdateContainer(id, container, event, item);
          //     });
        
          }else{
              this.disabledrefresh = false
              this.fincalculDateGroup=false
              this.openEditor = false 
              this.startResize= false
           console.log("container without workorder")
            //   this.scheduleObj.readonly = false
          }
      }
  
      putWorkorderFromUpdateContainer(id, container, eventContainer, eventWorkorder,Operateur?) { // RESIZE AND EDITOR
      
          let now = moment().format('YYYY-MM-DDTHH:mm:ss');

          let workorderResult = this.allDataWorkorders.filter(item =>  item.Id_Planning_Events=== eventWorkorder.Id   );
        //    // le allDataWorkorders change de valeur 
          let workorderSelected = workorderResult[0];
          console.log("allDataWorkorders =>",this.allDataWorkorders )
          console.log("workorderResult =>", workorderResult)
          console.log("eventWorkorder =>", eventWorkorder)
          console.log('workorderSelected => ', workorderSelected);
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
              Operateur : container.LibelleRessourceOperateur,
              CodeRessourceCoordinateur: workorderSelected.CodeRessourceCoordinateur,
              LibelleRessourceCoordinateur: workorderSelected.LibelleRessourceCoordinateur,
              DateSoumission: workorderSelected.DateSoumission,
              DateDebut: workorderSelected.DateDebut, // changement pour Remy
              DateFin: workorderSelected.DateFin, // changement pour Remy
              DateDebutTheo: startTime,
              DateFinTheo: endTime,
              CodeRessourceSalle: container.CodeRessourceSalle,
              DepartmentID: container.CodeRessourceSalle,
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
              idwoprec: workorderSelected.idwoprec,
              isTempsReel:0,
              IsReadonly:false,
              Id_Planning_Events_TempsReel:0,
              titreepisode:workorderSelected.titreepisode,
              DateDebutReel:workorderSelected.DateDebutReel,
              DateFinReel:workorderSelected.DateFinTheo,
              libelleStatut: workorderSelected.libelleStatut,
          
          }
          console.log("newWorkorder => ", newWorkorder);         
          this.workorderService
              .updateWorkOrderPromise(newWorkorder.Id_Planning_Events, newWorkorder)
            //   .pipe(takeUntil(this.onDestroy$))
            //   .subscribe(res => {
                .then(res => {
                    if(!res["error"]){
                  console.log('update workorder with success : ', res);
                  console.log(this.allDataWorkorders); // all brut workorder data in backlog
                  // LUNDI ====> AJOUTER UN REFRESH DES EVENEMENTS !!!!!!!!!!
                
                
                //   this.allDataWorkorders.push(newWorkorder);
            
                this.allDataWorkorders.map(item => {
                    
                   if (item.Id_Planning_Events === newWorkorder.Id_Planning_Events ){

                    item.Id_Planning_Events= workorderSelected.Id_Planning_Events,
                    item.Iddetail= workorderSelected.Iddetail,
                    item.IdTypeWO= workorderSelected.IdTypeWO,
                    item.UserEnvoi= workorderSelected.UserEnvoi,
                    item.DateEnvoi= workorderSelected.DateEnvoi,
                    item.CodeRessourceOperateur= container.CodeRessourceOperateur, 
                    item.LibelleRessourceOperateur= container.LibelleRessourceOperateur,
                    item.Operateur = container.LibelleRessourceOperateur,
                    item.CodeRessourceCoordinateur= workorderSelected.CodeRessourceCoordinateur,
                    item.LibelleRessourceCoordinateur= workorderSelected.LibelleRessourceCoordinateur,
                    item.DateSoumission= workorderSelected.DateSoumission,
                    item.DateDebut= workorderSelected.DateDebut, 
                    item.DateFin= workorderSelected.DateFin, 
                    item.DateDebutTheo= startTime,
                    item.DateFinTheo= endTime,
                    item.CodeRessourceSalle= container.CodeRessourceSalle,
                    item.DepartmentID= container.CodeRessourceSalle,
                    item.Commentaire= workorderSelected.Commentaire,
                    item.Support1Cree= null,
                    item.Support2Cree= null,
                    item.MustWaitFor= null,
                    item.Statut= workorderSelected.Statut,
                    item.idplanningprec= null,
                    item.Regroup= null,
                    item.Commentaire_Planning= eventWorkorder.Commentaire_Planning,
                    item.DateMaj= now,
                    item.UserMaj= this.user.shortUserName,
                    item.Id_Planning_Container= container.Id_Planning_Container,
                    item.isbacklog= 0,
                    item.libchaine= workorderSelected.libchaine,
                    item.typetravail= workorderSelected.typetravail,
                    item.titreoeuvre= (workorderSelected.titreoeuvre === null || typeof (workorderSelected.titreoeuvre) === 'undefined') ? '' : workorderSelected.titreoeuvre,
                    item.numepisode= workorderSelected.numepisode,
                    item.dureecommerciale= workorderSelected.dureecommerciale,
                    item.libtypeWO= workorderSelected.libtypeWO,
                    item.IdGenerationWO= workorderSelected.IdGenerationWO,
                    item.debut= workorderSelected.debut,
                    item.fin= workorderSelected.fin,
                    item.dureeestime= workorderSelected.dureeestime,
                    item.idwoprec= workorderSelected.idwoprec,
                     item.isTempsReel=0,
                    item.IsReadonly=false,
                    item.Id_Planning_Events_TempsReel=0,
                    item.titreepisode=workorderSelected.titreepisode,
                    item.DateDebutReel=workorderSelected.DateDebutReel,
                    item.DateFinReel=workorderSelected.DateFinTheo,
                    item.libelleStatut= workorderSelected.libelleStatut

                   }
                });
                  console.log(this.allDataWorkorders);
                  console.log('this.scheduleObj.getEvents() ==> ', this.scheduleObj.getEvents());
                //   this.scheduleObj.saveEvent(eventWorkorder); //07/11/2019
                  this.eventSettings = {
                      dataSource: <Object[]>extend(
                          [], this.timelineResourceDataOut, null, true
                      ),
                      enableTooltip: true, tooltipTemplate: this.temp
                  };
                //   this.scheduleObj.dataBind();
                //   dataSource: <Object[]>extend([], this.calculDateAll(this.data, true, null, false, false), null, true),
                  console.log(this.eventSettings.dataSource);
                  this.disabledrefresh = false
                  this.fincalculDateGroup = false
                  this.openEditor = false 
                  this.startResize= false
                  console.log(this.openEditor,"this.openEditor when update container")

                } else
                if(res["error"]){
                    console.error('error update workorder : ')
                    this.scheduleObj.eventSettings.dataSource = []
                        this.timelineResourceDataOut = []
                        this.departmentGroupDataSource = [];
                    swal({
                        title: 'Attention',
                        text: 'Impossible de superpositionner les workorders',
                        showCancelButton: false,
                        confirmButtonText: 'Fermer',
                        allowOutsideClick:false
                    
                    }).then((Fermer) => {
                        console.log(Fermer)
                        this.scheduleObj.eventSettings.dataSource = []
                        this.departmentGroupDataSource = [];
                        if(Fermer.value){
                            this.clicFermerOnActionComplete = true
                             this.refreshDate()
                            this.getSalleByGroup(this.groupCoordinateur,this.refreshDateStart,this.refreshDateEnd)
    
                    }
                })
                      this.openEditor = false 
                      this.startResize= false
                   

                  }
                //   this.scheduleObj.readonly = false
              }, error => {
                // this.scheduleObj.readonly = false
                swal({
                    title: 'Attention',
                    text: 'Impossible de superpositionner les containers',
                    showCancelButton: false,
                    confirmButtonText: 'Fermer',
                    allowOutsideClick:false
                
                }).then((Fermer) => {
                    console.log(Fermer)
                    this.scheduleObj.eventSettings.dataSource = []
                    this.departmentGroupDataSource = [];
                    if(Fermer.value){
                        this.clicFermerOnActionComplete = true
                         this.refreshDate()
                        this.getSalleByGroup(this.groupCoordinateur,this.refreshDateStart,this.refreshDateEnd)

                }
            })
                  this.openEditor = false 
                  this.startResize= false
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
          console.log('workorderResult',workorderResult)
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
              idwoprec: workorderSelected.idwoprec,
              isTempsReel:0,
              IsReadonly:false,
              Id_Planning_Events_TempsReel:0,
              Operateur:workorderSelected.LibelleRessourceOperateur,
              titreepisode:workorderSelected.titreepisode,
              DateDebutReel:workorderSelected.DateDebutReel,
              DateFinReel:workorderSelected.DateFinTheo,
              libelleStatut:workorderSelected.libelleStatut
  
          }
          console.log('workorder data selected', newWorkorder);
          this.putWorkorder(newWorkorder.Id_Planning_Events, newWorkorder, event);
      }
  
      putWorkorder(id, workorder, event) {
          this.workorderService
              .updateWorkOrderPromise(id, workorder)
            //   .pipe(takeUntil(this.onDestroy$))
            //   .subscribe(res => {
                .then(res => {
                    console.log(res)

                    if(!res["error"]){
                  console.log('update workorder with success : ', res);
                  console.log(this.allDataWorkorders); // all brut workorder data in backlog
                  this.allDataWorkorders.push(workorder);
                  this.displayWorkorderInBacklogWorkorderData(event, 'delete')
                  this.timelineResourceDataOut.push(event);
                  this.createTooltipWorkorder();
                  this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                      dataSource: <Object[]>extend(
                          [], this.timelineResourceDataOut, null, true
                      ),
                      enableTooltip: true, tooltipTemplate: this.temp
                  };
                  this.WorkOrderByidgroup.push(workorder);
                  this.scheduleObj.refreshEvents()
                  this.disabledrefresh = false
               
                } else
                if(res["error"]){
                    swal({
                        title: 'Attention',
                        text: 'Erreur dans la mise à jour du workorder',
                        showCancelButton: false,
                        confirmButtonText: 'Fermer',
                        allowOutsideClick:false
                    
                    })
                    console.error('error update workorder : ') 
                  }

              }
           //   , error => {
               //   swal({
               //       title: 'Attention',
                 //    text: 'Erreur dans la mise à jour du workorder',
                   //   showCancelButton: false,
                   //   confirmButtonText: 'Fermer',
                   //   allowOutsideClick:false
                  
                //  })
                //  console.error('error update workorder : ', error)
            //  }
              );
      }
  
      displayWorkorderInBacklogWorkorderData(workoerderEvent, action: string) {
          // supprime workorder de la donnée du backlog (workorderData)
          if (action === 'delete') {
              this.workOrderData = this.workOrderData.filter(item => item.Id !== workoerderEvent.Id);
          } else if (action === 'add') {
              console.log('add');
          }
          this.field = {
              dataSource:  this.workOrderData,
              id: 'Id',
              text: 'Name',
              description: 'Commentaire_Planning'
          };
      }
  
      updateWorkorderInDragDropAddToContainer(event, containerParent) {
          console.log('event to workorder backlog => ', event);
          console.log('containerParent to workorder backlog => ', containerParent);
          
          let now = moment().format('YYYY-MM-DDTHH:mm:ss');
          let workorderResult = this.WorkOrderByidgroup.filter(item => item.Id_Planning_Events === event.Id );
          let workorderSelected = workorderResult[0];
          let otherWorkorderExistForCOntainer = this.timelineResourceDataOut.filter(item => item.AzaNumGroupe === event.AzaNumGroupe && !item.AzaIsPere &&  item.isTempsReel===0);
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
              otherWorkorderExistForCOntainer.map(item =>{
                  if(item.Statut != 3 ){
                    checkIfCloture = true
                  }else{
                    checkIfCloture = false
                  }
              })
              console.log(checkIfCloture,"checkIfCloture")
         if(!checkIfCloture){
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
              let eventNewDates = provisionalTimelineDataOut.filter(item => item['AzaNumGroupe'] === event.AzaNumGroupe && !item['AzaIsPere'] && item['isTempsReel']===0);
              console.log(eventNewDates);
              for (let i = 0; i < eventNewDates.length; i++) {
                  console.log(eventNewDates[i]);
                  this.updateStartTimeAndEndTimeWorkorder(eventNewDates[i], containerParent, provisionalTimelineDataOut);
                  console.log(checkIfCloture,"checkIfCloture if")
              }} else {
                  this.refreshWorkordersBacklog()
                  console.log(checkIfCloture,"checkIfCloture else")
              }
              if(this.creationArray.length==1){
                this.creationArray.pop() 
                
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
                  idwoprec: workorderSelected.idwoprec,
                  isTempsReel:0,
                  IsReadonly:false,
                  Id_Planning_Events_TempsReel:0,
                  titreepisode:workorderSelected.titreepisode,
                  DateDebutReel:workorderSelected.DateDebutReel,
                  DateFinReel:workorderSelected.DateFinTheo,
                  libelleStatut:workorderSelected.libelleStatut,
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
                    if(!res["error"]){
                  console.log('update workorder with success : ', res);
                  console.log(this.allDataWorkorders); // all brut workorder data in backlog
                  this.displayWorkorderInBacklogWorkorderData(eventWorkorder, 'delete');
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
                  if(this.creationArray.length==1){
                    this.creationArray.pop() 
                    
                }
             } else
             if(res["error"]){
                    swal({
                        title: 'Attention',
                        text: 'Erreur dans la mise à jour du workorder',
                        showCancelButton: false,
                        confirmButtonText: 'Fermer',
                        allowOutsideClick:false
                    
                    })
                    console.error('error update workorder : ')
                  }

              }
              //, error => {
              //    swal({
              //        title: 'Attention',
              //        text: 'Erreur dans la mise à jour du workorder',
              //        showCancelButton: false,
             //         confirmButtonText: 'Fermer',
              //        allowOutsideClick:false
              //    
              //    })
               //   console.error('error update workorder : ', error)
           //   }
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
          let workorderPlanningResult = this.allDataWorkorders.filter(item => item.Id_Planning_Events === event.Id );
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
              idwoprec: workorder.idwoprec,
              isTempsReel:0,
              IsReadonly:false,
              Id_Planning_Events_TempsReel:0,
              titreepisode:workorder.titreepisode,
              DateDebutReel:workorder.DateDebutReel,
              DateFinReel:workorder.DateFinTheo,
              libelleStatut:workorder.libelleStatut
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
          let workorderResult = this.allDataWorkorders.filter(item => item.Id_Planning_Events === event.Id );
          console.log(this.allDataWorkorders);
          let workorderSelected = workorderResult[0];
          console.log(workorderSelected,"workorderSelected")
          let othersWorkorderForContainer = this.timelineResourceDataOut.filter(item => item.AzaNumGroupe === event.AzaNumGroupe && !item.AzaIsPere && item.isTempsReel===0);
      
          if (othersWorkorderForContainer.length <= 0) {
              swal({
                  title: 'Supprimer le container associé',
                  text: 'Vous supprimez le dernier workorder du container, ' + 'souhaitez-vous supprimer le container ?',
                  showCancelButton: true,
                  allowOutsideClick:false,
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
                                  if (+event.AzaNumGroupe !== +item.AzaNumGroupe  && item.isTempsReel ===0) {
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
              CodeRessourceSalle: null,
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
              idwoprec: workorderSelected.idwoprec,
              isTempsReel:0,
              IsReadonly: false,
              Id_Planning_Events_TempsReel:0,
              titreepisode:workorderSelected.titreepisode,
              DateDebutReel:workorderSelected.DateDebutReel,
              DateFinReel:workorderSelected.DateFinTheo,
              libelleStatut:workorderSelected.libelleStatut
            
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
                      let eventNewDates = this.timelineResourceDataOut.filter(item => item['AzaNumGroupe'] === containerPere.Id && !item['AzaIsPere'] && item["isTempsReel"]===0);
                      console.log(eventNewDates);
                      for (let i = 0; i < eventNewDates.length; i++) {
                          console.log(eventNewDates[i]);
                          this.updateStartTimeAndEndTimeWorkorder(eventNewDates[i], containerParent[0], this.timelineResourceDataOut);
                      }
                  }
              }, error => {
                  swal({
                      title: 'Attention',
                      text: 'Erreur dans la mise à jour du workorder lors du retour au backlog',
                      showCancelButton: false,
                      confirmButtonText: 'Fermer',
                      allowOutsideClick:false
                  
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
              coordinateurCreate: selectedItem.coordinateurCreate,
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
              idwoprec: selectedItem.idwoprec,
              isTempsReel:0,
              IsReadonly: false,
              Id_Planning_Events_TempsReel:0,
              titreepisode:selectedItem.titreepisode,
              DateDebutReel:selectedItem.DateDebutReel,
              DateFinReel:selectedItem.DateFinTheo,
              libelleStatut:selectedItem.libelleStatut,
              CodeRessourceCoordinateur:selectedItem.CodeRessourceCoordinateur
          };
          this.workOrderData.push(newWorkorderForList);
          this.field['dataSource'] = this.workOrderData;
          console.log('this.workOrderData after add to backlog ==> ', this.workOrderData);
          console.log('this.field.datasource ==> ', this.field['dataSource']);
          this.isAddedToBacklog = true;
          let targetNodeId: string = this.treeObj.selectedNodes[0];
          let nodeId: string = 'tree_' + newWorkorderForList.Id;
          this.eventSettings = {
              enableTooltip: true, tooltipTemplate: this.temp
          };
          this.treeObj.addNodes([newWorkorderForList], targetNodeId, null); // TreeViewComponent
       
             if(this.user.initials === newWorkorderForList.coordinateurCreate){
    
        this.refreshWorkordersBacklog()
       
        }
        setTimeout(() => {
            if (this.searchString != undefined) {
                console.log("clic bouton refresh ")
                this.searchwo.value = this.searchString
                this.onFilter(this.searchwo.value, 0, this.argsKeyboardEvent)
            } else {
            }   
          }, 200);
      }
      /************************************************ PUT ---orkorder *****************************************/
      updateWorkOrder(args) {
  
          console.log('update workorder function');
          let now = moment().format('YYYY-MM-DDTHH:mm:ss');
  
          let event = args.data;
          console.log(event)
          console.log(this.allDataWorkorders)
          let oldEvent = this.timelineResourceDataOut.filter(item => item.Id === event.Id );
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
              idwoprec: workorder.idwoprec,
              isTempsReel:0,
              IsReadonly: false,
              Id_Planning_Events_TempsReel:0,
              titreepisode:workorder.titreepisode,
              DateDebutReel:workorder.DateDebutReel,
              DateFinReel:workorder.DateFinReel,
              libelleStatut:workorder.libelleStatut
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
              let containerEvent = this.timelineResourceDataOut.filter(item => item.Id === workorder.Id_Planning_Container);
              let containerPere = containerEvent[0];
              console.log(event)
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
                      enableTooltip: true, tooltipTemplate: this.temp
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
                      allowOutsideClick:false
                  
                  })
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
     
      public agendaStartDate;
      public agendaLastDate;
      public calcule;
      public navigateTimelineDay;
  
      public lastAllDataContainers;
      public lastAllDataWorkorders;
      public argsOnNavigating
  
     /***** refresh backlog********* */
  public lastTimelineResourceDataOut = [];

      onNavigating(args) {
          console.log(' =========================== NEW NAVIGATION ==================== ');
          console.log('onNavigating(args) function => args ==> ', args);
          console.log('onNavigating(args) function => args.currentView ==> ', args.currentView);
          console.log('this.timelineResourceDataOut before reset => ', this.timelineResourceDataOut);
          console.log("this.scheduleObj.getEvents() before reset =>",this.scheduleObj.getEvents())
          console.log("this.scheduleObj.getCurrentViewEvents before reset =>",this.scheduleObj.getCurrentViewEvents())
          console.log("this.scheduleObj.eventsProcessed() before reset =>",this.scheduleObj.eventsProcessed)
          console.log('COORDINATEUR GROUPE => ',  this.idGroupeCoordinateur );
          this.argsOnNavigating = args
          this.lastTimelineResourceDataOut = this.timelineResourceDataOut;
          this.lastAllDataContainers = this.allDataContainers;
          this.lastAllDataWorkorders = this.allDataWorkorders;
          console.log('this.lastTimelineResourceDataOut ===> ', this.lastTimelineResourceDataOut);
          this.timelineResourceDataOut = [];
          this.scheduleObj.eventsProcessed = []
          // this.allDataContainers = [];
          // this.allDataWorkorders = [];
          console.log("this.scheduleObj.getEvents() after reset =>",this.scheduleObj.getEvents())
          console.log("this.scheduleObj.eventsProcessed() after reset =>",this.scheduleObj.eventsProcessed)
          console.log('this.timelineResourceDataOut after reset => ', this.timelineResourceDataOut);
       
          this.navigation = true   
          // this.refreshWorkordersBacklog()
   
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
  
        
          let scheduleElement = document.getElementsByClassName('schedule');
          /************** ARGS.CURRENTVIEW CONDITIONS ************/
  
          /** readonly management **/
          if ((args.currentView === 'TimelineWeek') || (args.currentView === 'TimelineDay') ) {      
              this.scheduleObj.readonly = false
              this.scheduleObj.rowAutoHeight = true
              if (this.isnotMyGroup == true) {
                  this.scheduleObj.readonly = true
              } else {
                  this.scheduleObj.readonly = false
              }
            //   if (args.action === 'date') {
       
            // }
          } else if (args.currentView === 'TimelineMonth' || args.currentView === 'Agenda') {
              this.scheduleObj.readonly = true
              this.scheduleObj.rowAutoHeight = false
              if (args.action === 'date') {
                  this.scheduleObj.readonly = true
                  console.log('this.scheduleObj.readonly => ', this.scheduleObj.readonly)
              }
            //   let schObj = document.querySelector('.e-schedule')["ej2_instances"][0];
            //   console.log(schObj)
              
            //   schObj.setProperties({
            //     headerRows: [{ option: "Week" }, { option: "Date" }]
            //   })
          }
          // TIMELINEDAY
          if ((args.currentView === 'TimelineDay') || (args.currentView == undefined && (this.scheduleObj.currentView === 'TimelineDay'))) {
            //   this.valueMax = 60
          
              if(this.value <this.valueMax){
                //   scheduleElement[0]['style'].zoom =this.valueMax.toString() +"%"
                //   this.value = 60
                  console.log("value zoom ",scheduleElement[0]['style'].zoom )
              }
              console.log( 'TimelineDay first call condition width management value');  
              // this.valueMax = 60
              // this.value = parseInt(this.intervalValueDay as string, 10)
              // this.valueAdd = 10       
              this.intervalData = ['10', '20', '30', '40', '50', '60', '120','480'];
              this.scheduleObj.timeScale = { enable: true, interval: parseInt(this.intervalValueDay as string, 10), slotCount: 2 }
              if(this.intervalChanged){
              this.scheduleObj.timeScale.interval = this.value 
            }else{
                // this.value = this.scheduleObj.timeScale.interval
            }
              console.log('TIMELINEDAY !!!! => date contition');
              this.refreshDateStart = this.startofDay;
              this.refreshDateEnd = this.endofDay;
              this.salleDataSource.forEach(salle => {
                  let indexSalle = this.salleDataSource.indexOf(salle);
                  if(this.theorique.checked){
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
                  if(this.reel.checked){
                    this.getWorkorderTempsReelByIdGroupeStartDateEndDate(this.idGroupeCoordinateur, debut ,fin,salle.CodeRessource,salle.CodeSalle) 
              }
                    // this.getWorkorderTempsReelByIdGroupeStartDateEndDate(this.groupCoordinateur, debut ,fin,salle.CodeRessource,salle.CodeSalle) 
                 
              });
              this.scheduleObj.refreshEvents();
              console.log('timelineResourceDataOut => ', this.timelineResourceDataOut);    
              console.log("this.scheduleObj.getEvents() =>",this.scheduleObj.getEvents(), this.scheduleObj.eventsProcessed)
          // TIMELINEWEEK
          } else if ((args.currentView === 'TimelineWeek') || (args.currentView == undefined && (this.scheduleObj.currentView === 'TimelineWeek')  )) {               
              console.log( 'TimelineWEEK first call condition width management value');
            //   this.valueMax = 60
              // this.value = parseInt(this.intervalValue as string, 10)
              // this.valueMax = 240
              // this.valueAdd = 60     
         
              this.intervalData = ['10', '20', '30', '40', '50','60', '120','480'];
              this.scheduleObj.timeScale = { enable: true, interval: parseInt(this.intervalValue as string, 10), slotCount: 1 }
              if(this.intervalChanged){
                this.scheduleObj.timeScale.interval = this.value 
              }else{
                this.scheduleObj.timeScale.interval= 120
              }
              this.timelineResourceDataOut = []
              console.log('timelineResourceDataOut => ', this.timelineResourceDataOut);
              this.refreshDateStart = this.startofWeek;
              this.refreshDateEnd = this.endofWeek;
              this.salleDataSource.forEach(salle => {
                  let indexSalle = this.salleDataSource.indexOf(salle);
                  if(this.theorique.checked){
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
                  if(this.reel.checked){
                    this.getWorkorderTempsReelByIdGroupeStartDateEndDate(this.idGroupeCoordinateur, debut ,fin,salle.CodeRessource,salle.CodeSalle) 
              }
                    // this.getWorkorderTempsReelByIdGroupeStartDateEndDate(   this.groupCoordinateur, debut ,fin,salle.CodeRessource,salle.CodeSalle)   
              });
              this.scheduleObj.refreshEvents();
              console.log('timelineResourceDataOut => ', this.timelineResourceDataOut);
              console.log("this.scheduleObj.getEvents() =>",this.scheduleObj.getEvents() , this.scheduleObj.eventsProcessed)
        
                        // TIMELINEMONTH
          } else if ((args.currentView === 'TimelineMonth') || (args.currentView == undefined && (this.scheduleObj.currentView === 'TimelineMonth'))){     
            //   this.valueMax = 80
            //   if(this.value <this.valueMax){
            //     //   scheduleElement[0]['style'].zoom =this.valueMax.toString() +"%"
            //       this.value = this.valueMax
            //   }
            // console.log(this.scheduleObj.calendarUtil.getMonth(this.startofMonth))
            // console.log(this.scheduleObj.calendarUtil.getMonthDaysCount(this.startofMonth))
            // console.log(this.scheduleObj.calendarUtil.getExpectedDays(this.startofMonth,))
              this.timelineResourceDataOut = [];
              console.log('timelineResourceDataOut => ', this.timelineResourceDataOut);
              this.refreshDateStart = this.startofMonth;
              this.refreshDateEnd = this.endofMonth;
              this.salleDataSource.forEach(salle => {
                  let indexSalle = this.salleDataSource.indexOf(salle);
                  if(this.theorique.checked){
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
                  if(this.reel.checked){
                  this.getWorkorderTempsReelByIdGroupeStartDateEndDate(this.idGroupeCoordinateur, debut ,fin,salle.CodeRessource,salle.CodeSalle) 
            }
              });
              this.scheduleObj.refreshEvents();
              console.log("this.scheduleObj.getEvents() =>",this.scheduleObj.getEvents())
       
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
        //   else if (args.currentView === "Agenda" || (args.currentView == undefined && (this.scheduleObj.currentView === 'Agenda'))) { // AGENDAVIEW
        //       if (args.action === "date") {
        //           let navigateFirstOfWeek = moment(args.currentDate).toDate(),
        //               navigateLastOfWeek = moment(args.currentDate).add(7, 'd').toDate()
        //           this.timelineResourceDataOut = []
        //           this.refreshDateStart = navigateFirstOfWeek;
        //           this.refreshDateEnd = navigateLastOfWeek;
        //           this.salleDataSource.forEach(salle => {
        //               let indexSalle = this.salleDataSource.indexOf(salle);
        //               this.getContainersByRessourceStartDateEndDate(
        //                   salle.CodeRessource,
        //                   this.startofWeek,
        //                   this.endofWeek,
        //                   salle.CodeSalle,
        //                   indexSalle,
        //                   this.groupCoordinateur
        //               );
        //               let debut = moment(this.startofWeek).format('YYYY-MM-DD').toString();
        //               let fin = moment(this.endofWeek).format('YYYY-MM-DD').toString();
        //               this.getWorkorderTempsReelByIdGroupeStartDateEndDate(   this.groupCoordinateur, debut ,fin,salle.CodeRessource,salle.CodeSalle) 
        //           });
        //       }
        //       if (args.action === "view") {
        //           this.timelineResourceDataOut = []
        //           this.calcule = false
        //           console.log('timelineResourceDataOut => ', this.timelineResourceDataOut);
        //           this.refreshDateStart = this.agendaStartDate;
        //           this.refreshDateEnd = this.agendaLastDate;
        //           this.salleDataSource.forEach(salle => {
        //               let indexSalle = this.salleDataSource.indexOf(salle);
        //               this.getContainersByRessourceStartDateEndDate(
        //                   salle.CodeRessource,
        //                   this.startofWeek,
        //                   this.endofWeek,
        //                   salle.CodeSalle,
        //                   indexSalle,
        //                   this.groupCoordinateur
        //               );
        //               let debut = moment( this.startofWeek).format('YYYY-MM-DD').toString();
        //               let fin = moment(this.endofWeek).format('YYYY-MM-DD').toString();
        //               this.getWorkorderTempsReelByIdGroupeStartDateEndDate(   this.groupCoordinateur, debut ,fin,salle.CodeRessource,salle.CodeSalle) 
        //           });
        //       }
  
        //   }
       
          if(this.theorique.checked == false){
          this.CheckTheoriqueNavig = false
          console.log('$$$$$$$$$$$$$$$$$', this.CheckTheoriqueNavig)
        }
        if(this.reel.checked == false){
               this.Check =0
        }

        console.log(this.timelineResourceDataOut,"************************************************ navigation")
        // this.scheduleObj.refresh();
      }
  
      onEventRendered(args: EventRenderedArgs): void {    
          let couleur
          let scheduleElement = document.getElementsByClassName('schedule-drag-drop');
        // console.log(args)
        // args.element.draggable = true

          scheduleElement[0]['style'].zoom = "100%"

          if (args.data.AzaIsPere) {
            if (this.scheduleObj.currentView  === 'TimelineMonth') {
            //   (args.element.firstElementChild as HTMLElement).textContent = args.data.Name.toString();
            //   (args.element).textContent = args.data.Name.toString() +"<br>"+ args.data.Operateur.toString();
     
            }
          } else {
              this.statutWorkorder.map(statut => {
                  if (args.data.Statut === statut["Code"] && args.data.isTempsReel ===0) {
                      couleur = statut['Color']
                      this.couleur = couleur
                  }
  
                  if( args.data.Statut === statut["Code"] && args.data.isTempsReel===1){
                      if(this.scheduleObj.currentView  != 'TimelineMonth'){
                      args.element.style.borderTopColor =  "#FFEBCD"
                      args.element.style.borderTopWidth = "5px"
                   
                    }else{
                        args.element.style.borderTopColor =  "#FFEBCD"
                        args.element.style.borderTopWidth = "2px"
                    }
                    couleur = statut['Color'] 
                  }
                  this.workOrderColor = couleur
              })
              if (this.scheduleObj.currentView  != 'TimelineMonth') {
                
                      (args.element.firstChild as HTMLElement).style.backgroundColor = this.workOrderColor;
                      args.element.style.backgroundColor = this.workOrderColor;
                  
              }else{
              
                // (args.element.firstElementChild as HTMLElement).style.fontSize = "10px";
               
                (args.element.firstElementChild as HTMLElement).style.backgroundColor = this.workOrderColor;
                args.element.style.backgroundColor = this.workOrderColor;
             
              }
          }
         
      }
    
    cellClick(args :CellClickEventArgs ){
          console.log(args,"args ===> moreEventsClick")
        //  args.cancel = true
       
      }
      /*************************************************************************/
      /*************************** MODALS M1ANAGEMENT **************************/
      /*************************************************************************/
  
      public couleur;
      public cancel

      public CellClick: boolean = true;
      public hourContainer;
      public elementRow
      public updateWO:boolean = false;
      public openEditor = false
      public dataToEdit;
      public editor = false
      onPopupOpen(args) { // open container modal and display workorder list
          let workOrders = [];
        console.log(args);
        console.log(this.eventSettings)
        this.dataToEdit = args.data
          args.element.hidden = false;
     
          if ((args.type === 'QuickInfo') && (args.name === 'popupOpen')) {
              
              let start = moment(args.data["StartTime"]),
              end = moment(args.data["EndTime"]),
              diff = end.diff(start,'minute')
              let  interval 
              if(this.scheduleObj.currentView === "TimelineDay"){
              interval = this.scheduleObj.timeScale.interval / 2
              console.log( diff,interval)
            } else {
                interval = this.scheduleObj.timeScale.interval 
                console.log( diff,interval)
            }
             if(diff ===  Math.trunc(interval)   ){
              args.cancel = true;
              
            }

            let btnclose =  document.getElementsByClassName('e-close e-control');
            btnclose[0].addEventListener('click', () => {
                this.editor = false
                let cellPopup = document.getElementsByClassName('e-cell-popup');
             console.log(cellPopup)
             let error = document.getElementsByClassName('e-schedule-error');
             console.log(error)
             if(cellPopup[0] != null){
             error[0]["hidden"] = true
             cellPopup[0]["hidden"] = true
            }
                console.log(btnclose)
            }, true);
            let save = document.getElementsByClassName("e-event-save")
          
            save[0].addEventListener('click', () => {
               if (this.filtreRegie && args.target === "e-appointment"){
                  
                   this.openSideBar = false
                console.log('click save ', this.openSideBar  )
            }
        }, true)

           // e-subject e-field e-input
              console.log(args.data.StartTime.getHours())
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
              let DepartmentID =  document.getElementsByClassName('e-DepartmentID');
              console.log("DepartmentID dbclick cell", DepartmentID)
              DepartmentID[0]["ej2_instances"][0].value = DepartmentID[0]["ej2_instances"][0].text 
              // DepartmentID[0]["ej2_instances"][0].itemData = DepartmentID[0]["ej2_instances"][0].itemData.concat(this.listeRegies)
              DepartmentID[0]["ej2_instances"][0].dataSource = this.listeRegies
              this.editor = true
       
          }
          if (args.data.hasOwnProperty('AzaIsPere') && args.type !== 'Editor') {
              if (args.data.AzaIsPere) {
                  this.timelineResourceDataOut.map(item => {
                      if (item.AzaNumGroupe === args.data.AzaNumGroupe && item.AzaIsPere === false && item.isTempsReel === 0) {
                          workOrders.push(item);
                          if(item.Statut !== 3   ){
                            // let edit = document.getElementsByClassName('e-edit-icon'),
                            //     deleteWorkorder = document.getElementsByClassName('e-delete-icon')
                            // edit[0]['style'].display = 'none';
                            // deleteWorkorder[0]['style'].display = 'none';
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
                    row.innerHTML += `<div id='id${i}' style="color : black; font-size:10px">${workOrders[i].titreoeuvre}&nbsp;/&nbsp;${workOrders[i].titreepisode} ep ${workOrders[i].numepisode}</div>`;
                   let element = document.getElementById('id' + i)
                   let couleur 
                   this.statutWorkorder.map(statut => {
                    if (workOrders[i].Statut === statut["Code"] ) {
                        couleur = statut['Color']            
                    }
                    element.style.backgroundColor =couleur
                    this.workOrderColor = couleur
                })
                }
                  for (let e = 0; e < workOrders.length; e++) {
                      let child = document.getElementById(`id${e}`);
                      child.addEventListener('click', () => {
                          args.cancel = true;
                          args.element.hidden = true;
                          this.openDialog( this.workOrderColor  , args.data, workOrders[e], this.departmentDataSource);
                          console.log(child)
                      }, true);
                  }
                 
              } else {
                  let elementworkorder: HTMLElement = <HTMLElement>args.element.querySelector('.e-subject');
  
                  this.timelineResourceDataOut.map(item => {
                      if (item.AzaNumGroupe === args.data.AzaNumGroupe && item.AzaIsPere === false  && item.isTempsReel===0) {
                          workOrders.push(item);
                      }
                  });
                  for (let i = 0; i < workOrders.length; i++) {
                      // ${workOrders[i].typetravail}
                      elementworkorder.innerHTML = `<div class='e-subject e-text-ellipsis' style="color : black; font-size:12px">${workOrders[i].titreoeuvre}&nbsp;/&nbsp;${workOrders[i].titreepisode} ep ${workOrders[i].numepisode} </div>`
                  }
                  if(args.data.Statut != 3){
                 
                      args.cancel = true
                      console.log(args, "==> statut")
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
              console.log(this.isTreeItemDropped);
              this.creationArray = [];
              this.isTreeItemDropped = false;
            //   let title = document.getElementsByClassName('e-subject-container');
            //   let subTitle = document.getElementsByClassName('e-location-container');
            //   let Debut = document.getElementsByClassName('e-start-container');
            //   let fin = document.getElementsByClassName('e-end-container');
            //   let regie = document.getElementsByClassName('e-resources');
            //   let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
            //   let repeat = document.getElementsByClassName('e-editor');
            //   isAllDay[0]['style'].display = 'none';
            //   repeat[0]['style'].display = 'none';
            //   title[0]['style'].display = 'block';
            //   subTitle[0]['style'].display = 'none';
            //   Debut[0]['style'].display = 'block';
            //   fin[0]['style'].display = 'block';
            //   regie[0]['style'].display = 'block';
  
  
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
              if (this.openEditorCount === 0) { // diplay none for IsAllDay and Repeat field in editor
                    
                //   let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                //   isAllDay[0]['style'].display = 'none';
                //   let repeat = document.getElementsByClassName('e-editor');
                //   repeat[0]['style'].display = 'none';
                //   let subTitle = document.getElementsByClassName('e-location-container');
                //   subTitle[0]['style'].display = 'none';
  
                  if (!args.data.AzaIsPere && args.data.isTempsReel===0) {
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
              if (!args.data.AzaIsPere && args.data.isTempsReel===0) {
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
                 if(args.data.Statut != 3){
                 
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
             console.log(containerOperateur, "containerOperateur")
          
              let annuler = document.getElementsByClassName("e-event-cancel")
              console.log(annuler);
              annuler[0].addEventListener('click', () => {

                  this.disabledrefresh = false
                  this.openEditor = false
              }, true);
           
              let btnClose = document.getElementsByClassName("e-dlg-closeicon-btn")
              btnClose[0].addEventListener('click', () => {
              this.disabledrefresh= false
              this.openEditor = false
              console.log("click btn close");
              }, true);
  
              if (args.data.hasOwnProperty('AzaIsPere')) {
                  console.log('open Editor', args);
                  this.editor = true 
                  
                  console.log("open editor", this.editor)
                  console.log(this.drowDownOperateurList);
                  if (args.data.AzaIsPere) { // dblclick container
                      if (containerOperateur.length === 0) {
                          console.log('containerOperateur.length = 0', containerOperateur);
                          this.createDrowDownOperteurInput(args, container, inputEle);
                          console.log("==>>",this.drowDownOperateurList); 
                          this.drowDownOperateurList.onchange = args.data.Operateur = this.drowDownOperateurList.value;
                          this.drowDownOperateurList.dataSource = this.fieldMonteur['dataSource'].map(item => {
                              return { text: item.Username, value: item.idressourcetype };
                          });
                          console.log("==>>",this.drowDownOperateurList)
                          console.log(args.data.Operateur);
                      }
                      this.drowDownOperateurList.dataSource = this.fieldMonteur['dataSource'].map(item => {
                          return { text: item.Username, value: item.idressourcetype};
                      });
                      this.drowDownOperateurList.dataSource.unshift({ text: 'Aucun Opérateur', value: 0 });
                      let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                      let repeat = document.getElementsByClassName('e-editor');
                      let title = document.getElementsByClassName('e-subject-container');
                      let subTitle = document.getElementsByClassName('e-location-container');
                      let Debut = document.getElementsByClassName('e-start-container');
                      let fin = document.getElementsByClassName('e-end-container');
                      let regie = document.getElementsByClassName('e-resources');
                      // let DepartmentID =  document.getElementsByClassName('e-DepartmentID');
                      // console.log("DepartmentID", DepartmentID)
                      // DepartmentID[0]["ej2_instances"][0].value = DepartmentID[0]["ej2_instances"][0].text 
                     
                      console.log('title', title[0]);
                      console.log('subTitle', subTitle[0]);
                      title[0]['style'].display = 'block';
                      isAllDay[0]['style'].display = 'none';
                      console.log('repeat', repeat[0]);
                      repeat[0]['style'].display = 'none';
                      Debut[0]['style'].display = 'block';
                      fin[0]['style'].display = 'block';
                      regie[0]['style'].display = 'block';
                      console.log(title[0]['style'].display, "sssssssssssssssssssssssssssssssssssssss")
                  } else { // dblclick workorder
                    console.log(containerOperateur[0])
                    if(containerOperateur[0] != undefined || null ){
                      containerOperateur[0].parentNode.removeChild(containerOperateur[0]);
                    }
                      console.log("edit click")
                      if (!args.data.AzaIsPere && args.data.isTempsReel===0) {
                          let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                          let repeat = document.getElementsByClassName('e-editor');
                          let title = document.getElementsByClassName('e-subject-container');
                          let subTitle = document.getElementsByClassName('e-location-container');
                          let Debut = document.getElementsByClassName('e-start-container');
                          let fin = document.getElementsByClassName('e-end-container');
                          let regie = document.getElementsByClassName('e-resources');
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
                          console.log(title[0]['style'].display, "sssssssssssssssssssssssssssssssssssssss")
                      }
                  }
              } else {
                  if (args.name === 'popupOpen' && args.type === 'Editor' ) {
                  
                    //   let title = document.getElementsByClassName('e-subject-container');
                    //   let subTitle = document.getElementsByClassName('e-location-container');
                    //   let Debut = document.getElementsByClassName('e-start-container');
                    //   let fin = document.getElementsByClassName('e-end-container');
                    //   let regie = document.getElementsByClassName('e-resources');
                    //   let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                    //   let repeat = document.getElementsByClassName('e-editor');
                    //   title[0]['style'].display = 'block';
                    //   subTitle[0]['style'].display = 'none';
                    //   Debut[0]['style'].display = 'block';
                    //   fin[0]['style'].display = 'block';
                    //   regie[0]['style'].display = 'block';
                    //   console.log('Debut', Debut);
                    //   console.log('subtitle', subTitle[0]);
                    //   isAllDay[0]['style'].display = 'none';
                    //   console.log('repeat', repeat[0]);
                    //   repeat[0]['style'].display = 'none';
  
                    //   if(args.target === undefined){
                    //   let title = document.getElementsByClassName('e-subject-container');
                    //   let subTitle = document.getElementsByClassName('e-location-container');
                    //   let Debut = document.getElementsByClassName('e-start-container');
                    //   let fin = document.getElementsByClassName('e-end-container');
                    //   let regie = document.getElementsByClassName('e-resources');
                    //   let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                    //   let repeat = document.getElementsByClassName('e-editor');
                    //   title[0]['style'].display = 'block';
                    //   subTitle[0]['style'].display = 'none';
                    //   Debut[0]['style'].display = 'block';
                    //   fin[0]['style'].display = 'block';
                    //   regie[0]['style'].display = 'block';
                    //   console.log('title', title[0]);
                    //   console.log('subtitle', subTitle[0]);
                    //   isAllDay[0]['style'].display = 'none';
                    //   console.log('repeat', repeat[0]);
                    //   repeat[0]['style'].display = 'none';
                    //   }
                      let save = document.getElementsByClassName("e-event-save")
                      console.log(save);
                      save[0].addEventListener('click', () => {
                         if (this.filtreRegie && args.target === "e-appointment"){
                             console.log("this.departmentDataSource  before", this.departmentDataSource )
                             this.departmentDataSource = this.listeRegies
                             this.openEditor = false
                             this.openSideBar = false
                          console.log('click save ',this.departmentDataSource )
                      }
                      }, true);
                    
                        // args.duration =5;
                        // var dialogObj = (args.element as any).ej2_instances[0];
                        // dialogObj.open = function() {
                        //   // Changed the event duration to 5 min
                        //   let startObj = (args.element.querySelector(".e-start") as any)
                        //     .ej2_instances[0];
                        //   startObj.step = 5;
                        //   let endObj = (args.element.querySelector(".e-end") as any)
                        //     .ej2_instances[0];
                        //   endObj.step = 5;
                        // };
                  
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
              this.timelineResourceDataOut.map(item => {
                if (item.AzaNumGroupe === args.data.AzaNumGroupe && item.AzaIsPere === false && item.isTempsReel === 0) {
                  
                    if(item.Statut != 3 ){
           
                      args.cancel = true
                      console.log(args, "==> statut")
                     }
                }
            });
          } else if ((args.type === 'Editor') && this.checkIfContainerAlreadyExists(args)) {
              console.log('this.checkIfContainerAlreadyExists(args); => ', this.checkIfContainerAlreadyExists(args));
              args.cancel = true;
              this.timelineResourceDataOut.map(item => {
                if (item.AzaNumGroupe === args.data.AzaNumGroupe && item.AzaIsPere === false && item.isTempsReel === 0) {
                  
                    if(item.Statut!= 3){
           
                      args.cancel = true
                      console.log(args, "==> statut")
                     }
                }
            });
           
          }
       
     
          if (args.target != undefined && (args.target.classList.value === "e-header-cells e-current-day" || args.target.classList.value === "e-header-cells")) {
              args.data.cancel = true;
              args.cancel = true;
         
              console.log(args,  "-----------------------------------")
           
           if(this.scheduleObj.currentView === "TimelineWeek" ){
            if(args.type = "QuickInfo" )
            {
                (this.scheduleObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as any).click();
                // let calendar = (this.scheduleObj.element.querySelectorAll('.e-calendar')[0] as any).ej2_instances[0];
                // // console.log(calendar)
                // calendar.value = args.data.startTime;
                this.scheduleObj.selectedDate= args.data.startTime
                this.scheduleObj.currentView = "TimelineDay";     
                let day =    this.scheduleObj.element.querySelectorAll('.e-timeline-day');               
                addClass([day[0]], ['e-active-view']);
                let week =    this.scheduleObj.element.querySelectorAll('.e-timeline-week'); 
                removeClass([week[0]], ['e-active-view']);
                (this.scheduleObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as any).click();
            }
           }
          }

  

         
      }
      onPopupClose(args){
          console.log(args)
         
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
              return { text: item.Username, value: item.idressourcetype };
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
  
      openDialog(couleurWorkorder, object, subObject, categories): void { // open workorder modal from container list
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
          let couleur
          this.statutWorkorder.map(statut =>{
              if(statut['Code'] === subObject.Statut ){
                couleur = statut['Color']
              }
          })
          const dialogRef = this.dialog.open(WorkorderDetailsModalComponent, {
              width: '365px',
              data: {
                  workorder: subObject,
                  regie: category,
                  color: couleur
              }
          });
      }
  
      /*************************************************************************/
   /********************** DRAG AND DROP M1ANAGEMENT ***********************/
   public eventDragStart 
      onDragStart(args: DragEventArgs){
        console.log('onDragStart args =======> ', args);
        this.eventDragStart = args.data
      // drag interval time is changed to 5 minutes 

            //  args.navigation = { enable: true, timeDelay: 4000 };
            if(args.data['AzaIsPere'] == false) {
                swal({
                            title: 'Attention',
                            text: `Vous ne pouvez pas effectuer cette action ` ,
                            showCancelButton: false,
                            confirmButtonText: 'Fermer',
                            cancelButtonText: 'non',
                            allowOutsideClick:false
                        
                        }).then((Fermer) => {
                            console.log(Fermer)
                          
                            if(Fermer.value){
                             
                                // this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut
                                console.log(args)
                                this.scheduleObj.refresh()
                let now =  moment().subtract('h', 1).format('HH:mm')
                setTimeout(() => {
                  this.scheduleObj.scrollTo(now) 
                  console.log("scroll to ", now)
                }, 2000);
                              
                        }
                    })
            }

            this.scheduleObj.dataBind()
           //
            //     args.cancel = false
            // }
     
        
    }
   public groupIndex
    public eventItemDrag 
      onItemDrag(event: any, tabIndex): void { // FUCNTION FROM TEMPLATE
          event.interval = 5;
          this.disabledrefresh = true  
          console.log('onItemDrag event ==> ', event)
        this.eventItemDrag = event.data
        this.groupIndex = event.groupIndex
          if(event.name === 'nodeDragging') {
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
      
      onDragStop(args:DragEventArgs){
          console.log('onDragStop args =======> ', args, args.event)
 
    //     }
    
    if(args.event.target["className"] === "e-work-cells e-work-hours"){   
        this.disabledrefresh = false
    }
  

      }
  
      public onTreeDragStartCountDevTool = 0;
      onTreeDragStart(event) {
          console.log(this.onTreeDragStartCountDevTool);
          this.onTreeDragStartCountDevTool++;
          console.log('call onTreeDragStart() / event => ', event);
          console.log(this.treeObj);
          event.draggedParentNode.ej2_instances[1].enableAutoScroll = false    
      
        let operateur =   this.fieldMonteur['dataSource'].filter(item => item.typeressource == null )
        console.log( operateur) 
        operateur.map(item =>{
         
            if(item.idressourcetype == event.draggedNodeData.id){
                event.cancel = true 
                swal({
                    title: 'Attention',
                    text: `Vous ne pouvez pas effectuer cette action, l'opérateur n'a pas de statut : Intermittent ou Permanent ` ,
                    showCancelButton: false,
                    confirmButtonText: 'Fermer',
                    cancelButtonText: 'non',
                    allowOutsideClick:false
                
                })
                console.log("ressource type nullll ")
            }
        })
      }
  
      selectTabWitoutSwip (e: SelectEventArgs) {
        if (e.isSwiped) {
          e.cancel = true;
        }
      }
  
      /******* DRAG AND DROP WORKORDERS *******/
  
      onTreeDragStop(event: DragAndDropEventArgs): void {
          console.log(event)
          if(event["name"]=== "nodeDragStop"){
              this.disabledrefresh = false
              console.log("tree drag stop")
          }
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
                          treeviewData.filter((item: any) => item.Id === parseInt(event.draggedNodeData.id as string, 10)  );
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
                          IsReadonly : false,
                          isTempsReel:0,
                          CodeRessourceCoordinateur:codeRessourceCoordinateur
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
                          isTempsReel:0,
                          IsReadonly : false,
                          Id_Planning_Events_TempsReel:0,
                          titreepisode:filteredData[0].titreepisode,
                          DateDebutReel:filteredData[0].DateDebutReel,
                          DateFinReel:filteredData[0].DateFinTheo,
                          libelleStatut:filteredData[0].libelleStatut,
                          CodeRessourceCoordinateur:filteredData[0].codeRessourceCoordinateur
                      };
                      this.scheduleObj.eventSettings.tooltipTemplate = this.temp;
                      let annuler = document.getElementsByClassName("e-event-cancel")
                      let btnClose = document.getElementsByClassName("e-dlg-closeicon-btn")
                      console.log(annuler);
                     
                      btnClose[0].addEventListener('click', () => {
                          if(this.creationArray.length > 1){
                          this.creationArray.pop() 
                          
                      }
  
                      this.disabledrefresh= false
                     
                      this.isTreeItemDropped = false
                      console.log("click btn close",this.creationArray);
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
                          console.log( filteredDataW , event.draggedNodeData.id )
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
                              IdGenerationWO: filteredDataW[0].IdGenerationWO,
                              isTempsReel:0,
                              IsReadonly : false,
                              Id_Planning_Events_TempsReel:0,
                              titreepisode:filteredDataW[0].titreepisode,
                              DateDebutReel:filteredDataW[0].DateDebutReel,
                              DateFinReel:filteredDataW[0].DateFinTheo,
                              libelleStatut:filteredDataW[0].libelleStatut,
                              CodeRessourceCoordinateur:containerSelected.CodeRessourceCoordinateur
                          };
                          this.creationArray = [newEventData];
                          this.isTreeItemDropped = true;
                          console.log('filteredDataW : ', filteredDataW);
                          console.log(newEventData,"new event data")
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
          if(event["name"] === "nodeDragStop"){
              this.disabledrefresh = false
              console.log("tree drag stop")
          }
          let point = "."
          let text = event.draggedNode.innerText
          let operateur = text.split( point)
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
                      console.log('treeviewData  : ', treeviewData );
                      console.log('fieldMonteur  : ', this.fieldMonteur );
                     
                  const filteredData: { [key: string]: Object }[] =
                      treeviewData.filter((item: any) => item.idressourcetype === parseInt(event.draggedNodeData.id as string, 10) && item.Username ===operateur[0] );
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
                          IsReadonly : false,
                          isTempsReel:0,
                          CodeRessourceCoordinateur:codeRessourceCoordinateur
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
                          treeviewData.filter((item: any) => item.idressourcetype === parseInt(event.draggedNodeData.id as string, 10) && item.Username ===operateur[0]);
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
                              IsReadonly : false,
                              isTempsReel:0,
                              CodeRessourceCoordinateur:codeRessourceCoordinateur
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
    public firstZoom = 0 ;
    public argsOnActionBegin
    public resCollection
      onActionBegin(event: ActionEventArgs): void {
          this.containerParent = {};
          console.log('onActionBegin()');
          console.log(event);
          console.log(this.scheduleObj.currentView)
          console.log(this.isTreeItemDropped);
          console.log(this.scheduleObj, '====== scheduleobj');
     
          console.log( event.cancel, "onActionBegin(e)")
          if(event.requestType === 'viewNavigate'){
            //   this.scheduleObj.enablePersistence = false;
              // event.cancel =  true
              this.disableNavigation = true;
                 if(this.disableNavigation){
              let toolbar = document.getElementsByClassName('e-toolbar-items');
              for(let i =0; i<toolbar.length; i++){
                  toolbar[i]["style"].display = 'none'
              console.log(  toolbar[i]["style"],"none" )
              }
            }
              console.log(  this.scheduleObj.enablePersistence , "onActionBegin(e)")
              this.scheduleObj.getEvents().length = 0    
       
          }
          if (event.requestType === 'toolbarItemRendering') {
              let now =  moment().subtract(1,'h').format('HH:mm')
              setTimeout(() => {
                this.scheduleObj.scrollTo(now) 
              }, 500);
            // this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut
console.log('on load app', this.scheduleObj)
          }
    
          if (event.requestType === 'eventChange') {
          
  
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
        if( this.dataToEdit!= undefined  ){
            let initialDate = this.dataToEdit.StartTime.getDate()
            let changedDate = event.data["StartTime"].getDate()
            let date =  moment(event.data["StartTime"]).format('DD-MM-YYYY').toString()
            console.log(initialDate , changedDate, this.editor)
            // add isslotaviable
            let isSlotAviable = this.scheduleObj.isSlotAvailable(event.data)
            console.log(isSlotAviable)
            if(this.scheduleObj.currentView ==="TimelineDay"){
            if((initialDate !=  changedDate) &&  this.editor ){
                console.log("timelineDay")
                swal({
                    title: '',
                    text: `Souhaitez-vous naviguer vers la date: ${date}` ,
                    showCancelButton: true,
                    confirmButtonText: 'oui',
                    cancelButtonText: 'non',
                    allowOutsideClick:false
                
                }).then((oui) => {
                    console.log(oui)
                    this.scheduleObj.eventSettings.dataSource = []
                    this.departmentGroupDataSource = [];
                    if(oui.value){
                        // (this.scheduleObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as any).click();
                        // let calendar = (this.scheduleObj.element.querySelectorAll('.e-calendar')[0] as any).ej2_instances[0];
                        // // console.log(calendar)
                        // calendar.value = event.data["StartTime"];
                       
                        this.scheduleObj.selectedDate= event.data["StartTime"]
                }else{
                    // this.refreshScheduler()
                    this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut
                }
            })
            this.editor = false // pour ne pas afficher la modale a chaque fois 
            }
        } else{
//         let startOfWeek = moment(initialDate).startOf('week'),
//             endOfWeek = moment(initialDate).endOf('week'),
           let  isSameWeek = moment(this.dataToEdit.StartTime).isSame(event.data["StartTime"],'week')
                    // if (startOfWeek.format('D') <= )
            console.log(isSameWeek,"is the same week")
            if(this.scheduleObj.currentView ==="TimelineWeek"   ){
               if(!isSameWeek && this.editor ){
                swal({
                    title: '',
                    text: `Souhaitez-vous naviguer vers la date: ${date}` ,
                    showCancelButton: true,
                    confirmButtonText: 'oui',
                    cancelButtonText: 'non',
                    allowOutsideClick:false
                
                }).then((oui) => {
                    console.log(oui)
                    this.scheduleObj.eventSettings.dataSource = []
                    this.departmentGroupDataSource = [];
                    if(oui.value){
                        // (this.scheduleObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as any).click();
                        // let calendar = (this.scheduleObj.element.querySelectorAll('.e-calendar')[0] as any).ej2_instances[0];
                        // // console.log(calendar)
                        // calendar.value = event.data["StartTime"];
                       
                        this.scheduleObj.selectedDate= event.data["StartTime"]
                }else{
                    this.refreshScheduler()
                }
            })
            this.editor = false 
            }}
        }
        }
          }
          if (event.requestType === 'eventCreate') {
              console.log('eventCreate');
              console.log(event.requestType);
                /******* A voir ************************/
              // if (event.requestType === 'eventCreate' && (<Object[]>event.data).length > 0) {       
                if(event.data[0].Name == undefined){
                    event.data[0].Name = 'Titre'
                   }
                   if( this.dataToEdit!= undefined ){
                    let initialDate = this.dataToEdit.StartTime.getDate()
                    let changedDate = event.data[0]["StartTime"].getDate()
                    let date =  moment(event.data[0]["StartTime"]).format('DD-MM-YYYY').toString()
                    console.log(initialDate , changedDate, this.editor)
                    // add isslotaviable
                    let isSlotAviable = this.scheduleObj.isSlotAvailable(event.data)
                    console.log(isSlotAviable)
                    if((initialDate !=  changedDate) &&  this.editor ){
                        swal({
                            title: '',
                            text: `Souhaitez-vous naviguer vers la date: ${date}` ,
                            showCancelButton: true,
                            confirmButtonText: 'oui',
                            cancelButtonText: 'non',
                            allowOutsideClick:false
                        
                        }).then((oui) => {
                            console.log(oui)
                            this.scheduleObj.eventSettings.dataSource = []
                            this.departmentGroupDataSource = [];
                            if(oui.value){
                                // (this.scheduleObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as any).click();
                                // let calendar = (this.scheduleObj.element.querySelectorAll('.e-calendar')[0] as any).ej2_instances[0];
                                // // console.log(calendar)
                                // calendar.value = event.data[0]["StartTime"];
                                this.scheduleObj.selectedDate= event.data[0]["StartTime"]
        
                        }else{
                            this.refreshScheduler()
                        }
                    })
                    this.editor = false // pour ne pas afficher la modale a chaque fois 
                    }   
                }  
                console.log(this.openSideBar,"open Sidebar")  
          }
          if (((event.requestType === 'eventCreate') || (event.requestType === 'eventCreated')) && !this.isTreeItemDropped) {
              // CREATE CONTAINER ON CELL WITHOUT EVENT CLICK
              event.data[0]['AzaIsPere'] = true;
              console.log('action create and !== isTreeItemDropped');
               
            //   if( this.dataToEdit!= undefined ){
            //     let initialDate = this.dataToEdit.StartTime.getDate()
            //     let changedDate = event.data[0]["StartTime"].getDate()
            //     let date =  moment(event.data[0]["StartTime"]).format('DD-MM-YYYY').toString()
            //     console.log(initialDate , changedDate)
            //     if(initialDate !=  changedDate &&  this.editor ){
            //         swal({
            //             title: '',
            //             text: `Souhaitez-vous naviguer vers la date: ${date}` ,
            //             showCancelButton: true,
            //             confirmButtonText: 'oui',
            //             cancelButtonText: 'non',
            //             allowOutsideClick:false
                    
            //         }).then((oui) => {
            //             console.log(oui)
            //             this.scheduleObj.eventSettings.dataSource = []
            //             this.departmentGroupDataSource = [];
            //             if(oui.value){
            //                 (this.scheduleObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as any).click();
            //                 let calendar = (this.scheduleObj.element.querySelectorAll('.e-calendar')[0] as any).ej2_instances[0];
            //                 // console.log(calendar)
            //                 calendar.value = event.data[0]["StartTime"];
                           
       
            //         }else{
            //             this.refreshScheduler()
            //         }
            //     })
            //     this.editor = false
            //     }
            // }
          }
          if (event.requestType === 'eventRemove') {
              if (!event.data[0].AzaIsPere) {
              }
          }
          if (event.requestType === 'eventCreate' && this.isTreeItemDropped) {
              console.log('onActionBegin() ======> event create from drag and drop');
              this.scheduleObj.eventSettings.tooltipTemplate = this.temp;
              console.log(this.openSideBar,"open Sidebar") 
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
              let codeRessourceCoordinateur = this.currentCoordinateur.IdCoord
              if (!this.isTreeItemDroppedMonteur) {
                  this.creationArray.map(item => {
                      console.log(item);
                      console.log(event.data[0].Subject || event.data[0].Name)
                      console.log(event.data[0].Commentaire_Planning || event.data[0].Commentaire_Planning )
                      if (item.AzaIsPere) {
                          let newItemContainerAfterEditorUpdate = {
                              Id: item.Id,
                              Name:  event.data[0].Subject || event.data[0].Name ,
                              StartTime: event.data[0].StartTime,
                              EndTime: event.data[0].EndTime,
                              IsAllDay: event.data[0].IsAllDay,
                              DepartmentID: event.data[0].DepartmentID,
                              ConsultantID: item.ConsultantID,
                              AzaIsPere: true,
                              AzaNumGroupe: item.AzaNumGroupe,
                              coordinateurCreate: item.coordinateurCreate,
                              Operateur: event.data[0].Operateur === 'Aucun Opérateur' ? '' : event.data[0].Operateur,
                              Commentaire_Planning:event.data[0].Commentaire_Planning  ||  event.data[0].Description,
                              CodeRessourceSalle: event.data[0].CodeRessourceSalle,
                              LibelleRessourceSalle: event.data[0].LibelleRessourceSalle,
                              IsReadonly : false,
                              isTempsReel:0,
                              CodeRessourceCoordinateur:codeRessourceCoordinateur
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
                          Name: (event.data[0].Name=== null || event.data[0].Name === undefined) ? event.data[0].Subject : event.data[0].Name ,
                          StartTime: event.data[0].StartTime,
                          EndTime: event.data[0].EndTime,
                          IsAllDay: event.data[0].IsAllDay,
                          DepartmentID: event.data[0].DepartmentID,
                          ConsultantID: item.ConsultantID,
                          AzaIsPere: true,
                          AzaNumGroupe: item.AzaNumGroupe,
                          coordinateurCreate: item.coordinateurCreate,
                          Operateur: event.data[0].Operateur === 'Aucun Opérateur' ? '' : event.data[0].Operateur,
                          Commentaire_Planning:(event.data[0].Commentaire_Planning === null || event.data[0].Commentaire_Planning === undefined) ? event.data[0].Description : event.data[0].Commentaire_Planning,
                          IsReadonly : false,
                          isTempsReel:0,
                          CodeRessourceCoordinateur:codeRessourceCoordinateur
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
              if( this.dataToEdit!= undefined ){
                let initialDate = this.dataToEdit.StartTime.getDate()
                let changedDate = event.data[0]["StartTime"].getDate()
                let date =  moment(event.data[0]["StartTime"]).format('DD-MM-YYYY').toString()
                console.log(initialDate , changedDate)
                if(initialDate !=  changedDate &&  this.editor ){
                    swal({
                        title: '',
                        text: `Souhaitez-vous naviguer vers la date: ${date}` ,
                        showCancelButton: true,
                        confirmButtonText: 'oui',
                        cancelButtonText: 'non',
                        allowOutsideClick:false
                    
                    }).then((oui) => {
                        console.log(oui)
                        this.scheduleObj.eventSettings.dataSource = []
                        this.departmentGroupDataSource = [];
                        if(oui.value){
                            // (this.scheduleObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as any).click();
                            // let calendar = (this.scheduleObj.element.querySelectorAll('.e-calendar')[0] as any).ej2_instances[0];
                            // // console.log(calendar)
                            // calendar.value = event.data[0]["StartTime"];
                            this.scheduleObj.selectedDate= event.data[0]["StartTime"]
       
                    }else{
                        this.refreshScheduler()
                    }
                })
                this.editor = false
                }
            }
          } else { // CUSTOM FUNCTION
              console.log('customActionBegin()');
              this.customActionBegin(event);
          }
          // console.log('customActionBegin()');
          // this.customActionBegin(event); 
    
      }
      
      customActionBegin(args: any) { // CUSTOM ACTION BEGIN
          console.log('args customActionBegin ', args);
          console.log(this.openSideBar, '----------------------------------------------')
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
                          
              console.log(this.openSideBar, '----------------------------------------------')
          }
          if (args.requestType === 'eventRemove') { // CUSTOM ACTION REMOVE
              this.deleteEvent(args);
          } else if (args.requestType === 'viewNavigate') {
  
              if (this.openSideBar == true) {
                  this.openSideBar = true;
  
              } else {
                  this.openSideBar = false;
  
              }
                     
              console.log(this.openSideBar, '----------------------------------------------')
              console.log(args.data,"args.data")
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
              this.randomId();
              let codeRessourceCoordinateur = this.currentCoordinateur.IdCoord
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
                  Commentaire_Planning: data.Commentaire_Planning,
                  IsReadonly : false,
                  isTempsReel:0,
                  CodeRessourceCoordinateur:codeRessourceCoordinateur
  
              };
              this.createContainer(containerData);
              // this.timelineResourceDataOut.push(containerData);
            //   this.eventSettings = { // Réinitialise les events affichés dans le scheduler
            //       dataSource: <Object[]>extend(
            //           [], this.timelineResourceDataOut, null, true
            //       )
            //   };
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
          if(e.requestType === 'dateNavigate'){
              
            //  if(e.event.target.className === "e-appointment e-lib e-draggable"){
            //     e.event.target.className = "e-appointment e-lib e-draggable e-event-action"
            //     e.event.target["aria-grabbed"] = true
                console.log( "onActionComplete(e) dateNavigate ===> :",e)
            //  }
            
     
          }
          console.log(this.openSideBar,"open Sidebar")
          if (e.requestType === 'eventCreated') {
            this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut
            console.log(this.openSideBar)
          
          }
         
          if (e.requestType === 'eventChanged') {
            let startTime =  e.data instanceof Array ? e.data[0].StartTime : e.data.StartTime ,
            endTime = e.data instanceof Array ? e.data[0].EndTime:  e.data.EndTime ,
            groupIndex = this.groupIndex,
            cellVide = this.scheduleObj.isSlotAvailable(startTime),
            decallage,
            lengthContainer
            if(this.eventDragStart != undefined){
            decallage=  Math.abs(startTime - this.eventDragStart.StartTime) ,
            lengthContainer = Math.abs(this.eventDragStart.StartTime - this.eventDragStart.EndTime) 
        }
        console.log(decallage, "decallage")
        console.log(lengthContainer, "lengthContainer")
            // cellVide = this.scheduleObj.isSlotAvailable(e.data)
           
        
            console.log(cellVide,"this.scheduleObj.isSlotAvailable")
            console.log(this.openEditor, "open editor ==>")
            console.log(this.startResize,"start resize ===>")
              if (e.data.AzaIsPere || (!e.data.AzaIsPere && e.data.isTempsReel ===0 && this.isTreeItemDropped)) {
                console.log(e.data ," event in updatecontainer")
           
                //cellVide ==> ture  checkIfContainerAlreadyExists(args)  
                    console.log("************************************************* onaction complete : update container");
                  this.updateContainer(e);   
              } else {
                  if (!e.data.AzaIsPere && e.data.isTempsReel ===0 && this.updateWO) {
                      console.log("************************************************* onaction complete : update WorkOrder",e);
                     
                      this.updateWorkOrder(e)
                  }
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
              if(this.searchString != undefined){
              this.searchwo.value =""
          }
          this.eventSettings = { // Réinitialise les events affichés dans le scheduler
            dataSource: <Object[]>extend(
                [], this.timelineResourceDataOut, null, true
            ),
            enableTooltip: true, tooltipTemplate: this.temp
        };
              // this.onFilter( this.searchwo.value , 0, this.argsKeyboardEvent)
          } else {
              this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                  dataSource: <Object[]>extend(
                      [], this.timelineResourceDataOut, null, true
                  ),
                  enableTooltip: true, tooltipTemplate: this.temp
              };
              console.log('this.eventSettings ==> ', this.eventSettings);
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
          console.log('onActionComplete() this.timelineResourceDataOut ==> ', this.timelineResourceDataOut);


          //*************************************************************************************************************************************** */
          
     
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
                  if (+data.AzaNumGroupe === +item.AzaNumGroupe ) {
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
  public fincalculDateGroup = false
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
          console.log(atimelineResourceData,"atimelineResourceData CALCUL DATE GROUP  ")
          this.fincalculDateGroup = true
          console.log(this.fincalculDateGroup)
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
              if (+item.AzaNumGroupe === numGroup  && item.isTempsReel ===0) {
                  arrayDatesGroup.push(+item[timePosition]);
                  if (item.AzaIsPere) {
                      regie = item.DepartmentID;
                  }
              }
          });
          atimelineResourceData.forEach(item => {
              if (+item.AzaNumGroupe === numGroup  && item.isTempsReel ===0) {
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
                      if (+Objupdate['AzaNumGroupe'] === numGroup  && Objupdate["isTempsReel"]===0) {
                          mindate = Objupdate[timePosition];
                      }
                  }
              } else {
              }
              return mindate;
          } else if (timePosition === 'EndTime') {
              if (isUpdate) {
                  if (Objupdate != null) {
                      if (+Objupdate['AzaNumGroupe'] === numGroup && Objupdate["isTempsReel"]===0) {
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
              if (entry.AzaNumGroupe === numGroup && entry.isTempsReel===0) {
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
 
      onSelect(value,e) {
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

                 

                //   this.monteurDataSource.map(monteur =>{
    
                //     this.typeRessourceMonteur.map(statut =>{
                //      console.log(statut.Code, monteur.typeressource)
                //       if(statut.Code == monteur.typeressource){
                //            this.statutMonteur.push({
                //             Name: monteur.Username,
                //             Libelle: statut.Libelle
                //            })
                //            console.log( this.statutMonteur,"++++++++++++++++++++")
                //       } else{
                       
                //       }
            
                //     })
                // })
              }
          }
          if (this.searchStringM != undefined && !this.cancel) {
              this.searchStringM = this.searchoperateur.value
              this.onFilter(this.searchStringM, 1, this.argsKeyboardEvent)
              console.log(this.searchoperateur.value)
              console.log(typeof this.searchoperateur.value)
          } else {
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
          // this.departmentDataSource = [];
          this.departmentGroupDataSource = [];
          this.isnotMyGroup = true
          this.scheduleObj.readonly = true
          this.planningChanged = true
          console.log(val, this.listObj.value)
          

          let startofDay = moment().toDate()
          let endofDay = moment().add(1, 'd').toDate();
         this.refreshDate()
          this.idGroupeCoordinateur = this.listObj.value
          this.firstCallGetContainersByRessourceStartDateEndDate = 0
          this.getSalleByGroup(this.listObj.value, this.refreshDateStart, this.refreshDateEnd);
       
          this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut
          this.scheduleObj.dataBind()
          console.log(this.departmentDataSource, this.departmentGroupDataSource)
          console.log(this.idCoordinateur, this.listObj.value)
          if (this.listObj.value === this.idCoordinateur) {
              this.isnotMyGroup = false
              if(this.scheduleObj.currentView != "TimelineMonth"){
              this.scheduleObj.readonly = false
            }
          }
          console.log(this.timelineResourceDataOut, "...................")
      }

      
  
      getColor(value, codeGroup) {
       
          if (value && codeGroup != this.idGroupeCoordinateur) {
              for (let i = 0; i < this.monteurListe.length; i++) {
                  if (value === this.monteurListe[i].Username) {
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
      onFilterRegie(search, args?: KeyboardEvent) {
          this.filtreRegie = true
          this.rechercheRegieByID  = document.getElementById("searchregie") 
          this.searchRegie = search
          console.log( this.rechercheRegieByID.value , search)
          console.log(this.listeRegies, '*******************************************')
     
              if (search.length == 0) {
                  this.filtreRegie = false
              }
          

          // this.filtre = true
          console.log(search.length)
          // this.dataRegie = this.departmentGroupDataSource.filter(regie => {
          //     return regie['Text'].toLowerCase().includes(search.toLowerCase())
          // })
          // this.departmentDataSource = this.dataRegie

          // console.log(this.dataRegie)
  
          if ( search  !== "") {
              new DataManager(this.departmentGroupDataSource).executeQuery(new Query().
                  search( search  , ['Text', 'libelletype'], null, true, true)).then((e: ReturnOption) => {
                      console.log(e.result)
                      if ((e.result as any).length > 0) {
                          console.log(e.result)
                          this.departmentDataSource = e.result as any
                          this.resultRegie =  e.result as any
                      } else {
                          this.departmentDataSource = []
                      }
                  });

          } else {
              this.departmentDataSource = this.departmentGroupDataSource
          }



      }
  
  
  
  public searchwo
  public searchString : string
  public searchStringM : string
  public argsKeyboardEvent
  public searchResult
      onFilter(searchText: string, tabIndex, args: KeyboardEvent) {
          ///************************************************************** FILTRE DES MONTEURS ********************************************************************* */
          this.argsKeyboardEvent = args
          if (searchText.length >= 0) {
         
       
              console.log( searchText.length, '*******************************************')
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
                      search(this.searchStringM, ['Username','Prenom' ,'libelletype', 'libellecategorie','Libelle'], null, true, true)).then((e: ReturnOption) => {

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


     
      public filterAfterRefresh ()
      {
        if (this.searchRegie != undefined) {
            console.log("clic bouton refresh ")
            this.rechercheRegieByID.value = this.searchRegie
            console.log(this.rechercheRegieByID.value)
            this.onFilterRegie(this.rechercheRegieByID.value)
        } else {
        }
      
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
              this.openSideBar = false
              this.sidebar.hide();
              this.sidebar.position = 'Right'
              this.sidebar.animate = false
              this.sidebar.locale = 'fr-CH'
  
              this.scheduleObj.refreshEvents()
  
          }
          else {
              // this.togglebtnslide.content = '';
              this.openSideBar = true
              this.sidebar.show();
              this.sidebar.position = 'Right'
              this.sidebar.animate = false
              this.sidebar.locale = 'fr-CH'
              this.scheduleObj.refreshEvents()
  
  
          }
          console.log(this.openSideBar, '----------------------------------------------')
          console.log('slidebar', this.sidebar)
          console.log('button', this.togglebtnslide)
          console.log('scheduler element', this.scheduleObj)

      }
  
      /********************************** Remove Monteur *************************************/
  
      beforeopen(args: BeforeOpenCloseMenuEventArgs) {
        console.log(args,'clicknode treeview')
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
                  if (targetNodeId == itemliste.idressourcetype.toString()) {
                      if (itemliste.codegroupe != this.currentCoordinateur.Groupe) {
                          args.cancel = false;
                      }
                  }
  
              });
  
          });
  
  
      }
 
      menuclick(args: MenuEventArgs) {
    
        this.selectOperateur.value = null
          let targetNodeId: string = this.treeObjMonteur.selectedNodes[0];
         
          for (let i = 0; i < this.monteurListe.length; i++) {
              let CodeRessource = this.monteurListe[i].idressourcetype;
              let CodeRessourceToString = CodeRessource.toString();
              if (  this.operateurSelected === this.monteurListe[i].Username  && CodeRessourceToString === targetNodeId ) {         
                  if (args.item.text == 'Supprimer') {
                      this.treeObjMonteur.removeNodes([CodeRessourceToString]);
                      
                      console.log('element supprimer', this.monteurListe[i]);
                      this.elementDelete = this.monteurListe[i]
                      this.isDelete = true;
                      let indexOfMonteur = this.monteurListe.indexOf( this.elementDelete)
                      console.log(indexOfMonteur)
                      this.fieldMonteur['dataSource'] =  this.treeObjMonteur.removeNodes([CodeRessourceToString]);
                    // 
                      console.log(this.treeObjMonteur )
                      //  this.monteurDataSource= this.treeObjMonteur['groupedData']
                     
                  }
                  console.log(this.treeObjMonteur);
              }
              this.fieldArrayMonteur = this.treeObjMonteur['groupedData'];
              this.fieldMonteurDSource = this.fieldMonteur['dataSource']

            
            
          }
      
          this.fieldMonteur['dataSource'] =  this.treeObjMonteur['groupedData'][0];
          console.log(  this.fieldMonteur['dataSource']  ," this.fieldMonteur['dataSource'] ")
      }
      /************************************************************************ ADD Color **********************************************************************************/
  
  
     
  
  
  
  
      /******************************************* Zoom *******************/
  
      changeInterval(e: DropDownChangeArgs): void { // a rassembler avec changeIntevalDay plus de decalage events
          // this.scheduleObj.activeViewOptions.timeScale.interval =  parseInt(e.value as string, 10)
          // this.scheduleObj.dataBind();
  
         let value
          this.scheduleObj.timeScale.interval = parseInt(e.value as string, 10);
          this.intervalValue = e.value as string
          this.value = parseInt(e.value as string, 10);
        
          console.log(e.value)
          console.log(this.intervalValue)
          this.scheduleObj.dataBind();
      }
  
      changeIntervalDay(e: DropDownChangeArgs ) {
          this.scheduleObj.timeScale.interval = parseInt(e.value as string, 10);
          this.intervalValueDay = e.value as string
          let value = parseInt(e.value as string, 10);
          setTimeout(() => {
            this.scheduleObj.scrollTo(this.hourContainer)  
            this.zoomWithScroll()
          }, 50);
 
          console.log(this.intervalValueDay, e)
        //   this.scheduleObj.dataBind();
      
      }
     
      /*************************************************************************************** */
      onRenderCell(args: RenderCellEventArgs, value :CellTemplateArgs): void {

          if (this.scheduleObj.currentView == 'TimelineWeek') {
              if (args.element.classList.contains('e-work-cells') && ((args.date.getDay() % 2) != 0)) {
                  args.element['style'].background = '#E5FCFD';
             
              }
              if (args.element.classList.contains('e-work-cells') && (args.date.getDay() === 0)){
                args.element['style'].background = '#E5FCFD';
              }

              if(args.elementType === "dateHeader") {
         
            }
          
          }
     if(this.scheduleObj.currentView == 'TimelineMonth'){
 
     if (args.element.classList.contains('e-work-cells') && (args.date.getDay() === 6 || args.date.getDay() === 0   )) {
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
        
 
  
  
      }
public startResize = false
      onResizing(args: ResizeEventArgs) {
          console.log(args, "on resize..................")
          console.log(this.scheduleObj, "this.scheduleObj..................")
          this.disabledrefresh = true;
          args.interval = 5
          if(!args.data.AzaIsPere){
              args.cancel = true
          }
          this.startResize = true
      }
      onResizingStop(event :ResizeEventArgs ){
       console.log(event,"on resize stop ...........................")
       
      }
      //****** change data source displayed  *********/
      public items: object[];
      public Check = 0
      public CheckTheoriqueNavig = true
      public  timelineDataOutitems: object[] = []
      onChangeDataSource() { //a essayer avec la nouvelle méthode predicate
          let predicate: Predicate;
          let checkBoxes: CheckBoxComponent[] = [this.reel, this.theorique];
          const timelineDataOutitems = this.timelineResourceDataOut
          console.log(this.timelineDataOutitems, "aaaaa")
          console.log(this.Check)
  
        // setTimeout(() => {
          checkBoxes.forEach((checkBoxObj: CheckBoxComponent) => {
              console.log(checkBoxObj)
              if (checkBoxObj.checked) {
                if (checkBoxObj.value === '1' && this.Check == 0) {

                    // this.refreshDate()
                    // this.getSalleByGroup(this.idGroupeCoordinateur, this.refreshDateStart, this.refreshDateEnd)


                    //   this.timelineResourceDataOut = []
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
        
                    //   this.Check = 0
                  }
                    //    this.updateEventSetting( this.timelineResourceDataOut)

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
              this.navigation =  false
              
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
              
               
             
                //   console.log(this.timelineDataOutitems, "this.timelineDataOutitems")
                //   setTimeout(() => {

                //       new DataManager(timelineDataOutitems)
                //           .executeQuery(new Query().where(predicate))
                //           .then((e: ReturnOption) => {
                //               this.items = e.result as object[]
                //               console.log("timelineressourcedataout e.result", e.result)
                //               // this.timelineResourceDataOut = this.items
                //               checkBoxes.forEach((checkBoxObj: CheckBoxComponent) => {
                //                   if (checkBoxObj.checked) {
                //                     console.log("timelineressourcedataout item ", this.items)
                //                     this.timelineResourceDataOut =  [... new Set(this.items)] 
                //                    this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut 
                //                       console.log("item", this.items)
                //                       console.log("timelineressourcedataout item ", this.timelineResourceDataOut)
                //                       console.log(this.scheduleObj, "get event ")
                //                   } else {
                //                       // this.scheduleObj.element["ej2_instances"][0].eventSettings.dataSource = this.timelineResourceDataOut
                //                       this.timelineResourceDataOut =  [... new Set(this.items)] 
                //                       this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut 
                                         
                //                       console.log(" no check item", this.items, 'reel', this.reel.checked, 'theo', this.theorique.checked)
                //                   }

                //               });
                //           })
                //   }, 500);
                  if (this.theorique.checked) {

                      console.log(this.reel, " this.CheckTheoriqueNavig")
                      this.reel.disabled = false
                  }
                  if (this.reel.checked) {

                    this.theorique.disabled = false
                 
                }

                if( this.theorique.disabled == true &&  this.reel.disabled ==true){
                    this.theorique.disabled = false
                    this.reel.disabled = false
                    console.log("disabled  les deux ")
                }
              }
              else {
                if (!this.theorique.checked) { 
                    this.CheckTheoriqueNavig = false
                    this.Check = 1
                    console.log(this.reel, " this.CheckTheoriqueNavig")
                    this.reel.disabled = true
         
    
                }
                if (!this.reel.checked) {

                    this.theorique.disabled = true
                 
                }

              }
           
          });
     
          console.log(this.reel, this.theorique)
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

              //     this.value = 30

            //   this.scheduleObj.showTimeIndicator = true
              this.scheduleObj.element["ej2_instances"][0].timeScale.interval = this.value
              console.log(this.scheduleObj.startHour, this.scheduleObj.endHour)
             
          } else if (val === 2) { //jour
              this.scheduleObj.element["ej2_instances"][0].startHour = "06:00"
            this.scheduleObj.element["ej2_instances"][0].endHour = "19:00" //intervale 
       
              //     this.value = 30
            //   this.scheduleObj.showTimeIndicator = true
             this.scheduleObj.element["ej2_instances"][0].timeScale.interval = this.value 
              console.log(this.scheduleObj.startHour, this.scheduleObj.endHour)
              
          } else if (val === 3) { //soir
            this.scheduleObj.element["ej2_instances"][0].startHour = "18:00"
            this.scheduleObj.element["ej2_instances"][0].endHour = "23:59";
            //   this.scheduleObj.showTimeIndicator = true
              // (document.querySelectorAll('.template-wrap')[i] )["style"].width = "100px"
              //     this.value = 30

               this.scheduleObj.element["ej2_instances"][0].timeScale.interval = this.value 
              console.log(this.scheduleObj.startHour, this.scheduleObj.endHour)
          
          } else { //toute la journée
             this.scheduleObj.element["ej2_instances"][0].startHour = "00:00"
             this.scheduleObj.element["ej2_instances"][0].endHour = "24:00"
             this.scheduleObj.element["ej2_instances"][0].timeScale.interval = this.value
            //   this.scheduleObj.showTimeIndicator = true
           
              this.onCreated()
          }
      }

//Triggers when multiple cells or events are selected on the Scheduler.
            offsetLeftCell 
    public isCellClick
    public debutCellClick
    public finCellClick
      onSelectMultipleCell(args: SelectEventArgs) {
          console.log("on select =====>", args)
          args["showQuickPopup"] = true
          if(args["requestType"] === "cellSelect") {
          this.hourContainer = moment(args["data"]['StartTime']).subtract('h', 1).format('HH:mm')
        this.isCellClick = true
        this.debutCellClick = args["data"]['StartTime']
        this.finCellClick = args["data"]['StartTime']
          console.log(this.hourContainer)
          console.log(moment(args["data"]['StartTime']).format('x'))
          console.log(moment(args["data"]['EndTime']).format('x'))
          this.offsetLeftCell = args["element"].offsetLeft
          console.log(this.offsetLeftCell)
          let close = document.getElementsByClassName("e-popup-footer") 
          console.log(close);

        }
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
     
  }