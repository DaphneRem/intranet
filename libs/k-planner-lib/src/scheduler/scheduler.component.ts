import { Component,  ViewChild, OnInit, OnChanges, SimpleChanges, Input, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { App, User } from '../../../../apps/k-planner/src/app/+state/app.interfaces';
import * as moment from 'moment';

// Syncfusion Imports
// Synfucion Bases
import { extend, closest, remove, createElement, addClass, L10n, loadCldr, isNullOrUndefined, Internationalization } from '@syncfusion/ej2-base';
import { DragAndDropEventArgs, BeforeOpenCloseMenuEventArgs, MenuEventArgs, Item } from '@syncfusion/ej2-navigations';
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
    SidebarComponent
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
} from '@syncfusion/ej2-angular-schedule';

// Locale Data Imports
import { hospitalData, waitingList } from '../datasource';

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
    providers : [
        SalleService,
        CoordinateurService,
        ContainersService,
        MonteursService,
        Store,
        WorkOrderService,
        MonthAgendaService
    ]
})

export class SchedulerComponent implements OnInit, OnChanges, AfterViewInit {

    @ViewChild('scheduleObj')
    public scheduleObj: ScheduleComponent;

    @ViewChild('scheduleObjDay')
    public scheduleObjDay:  ScheduleComponent;
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
    @ViewChild ('contentmenutree')
    public contentmenutree: ContextMenuComponent;
    @ViewChild('sidebar')
    public sidebar: SidebarComponent;
    public type: string = 'Push';
    public target: string = '.content';
    @ViewChild('ejStartTimePicker')
    public ejStartTimePicker: TimePickerComponent;
    @ViewChild('ejEndTimePicker')
    public ejEndTimePicker: TimePickerComponent;

    /******** STORE *******/
    public user: User;
    public currentCoordinateur: Coordinateur;
    public allCoordinateurs: Coordinateur[];

    /******** SCHEDULER INIT *******/
    public dataContainersByRessourceStartDateEndDate;
    public containerData: EventModel[] = [];
    public workOrderData:EventModel[] = []; 
    // public selectedDate: Date = new Date();
    public selectedDate: Date = new Date();
    public data: EventModel[] =  <EventModel[]>extend([], this.containerData, null, true);
    public eventSettings: EventSettingsModel  =  {
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
                name: 'Description',
                // {
                // name: 'Description', validation: {
                //     required: true, minLength: 5, maxLength: 500
                // }
            },
            startTime: { name: 'StartTime', validation: { required: true } },
            endTime: { name: 'EndTime', validation: { required: true } },

        }
    };

    public btnRegieMessageAll    
    public colorReadOnly
    public currentView: View = 'TimelineDay';
    public workHours: WorkHoursModel = { start: '08:00', end: '20:00' };
    public cssClass: string = 'custom';
    public readonly: boolean = true;

    public openEditorCount = 0;
    public creationArray = [];
    public newData = [];
    public startHour: string = '06:00';
    public endHour: string = '23:00';
    public timeScale: TimeScaleModel = { enable: true, interval: 60, slotCount:2 };

    public colorStatut : Object []= [  
    { Id: 0, Color: '#B01106' },
    { Id: 1, Color: '#F96C63' },
    { Id: 2, Color: '#F0AC2C' },
    { Id: 3, Color: '#3ba506' },
    { Id: 4, Color: '#B01106' },
    { Id: 5, Color: '#F96C63' },
    { Id: 6, Color: '#F0AC2C' },
    { Id: 7, Color: '#3ba506' },
    { Id: 8, Color: '#B01106' },
    { Id: 9, Color: '#3ba506' },
    { Id: 10, Color: '#3ba506' },
    { Id: 11, Color: '#3ba506' },
    { Id: 12, Color: '#3ba506' },
    { Id: 13, Color: '#3ba506' }
   ]
    // BACKLOGS INIT
    public waitingList;
    public headerText: Object = [{ 'text': 'WorkOrder' }, { 'text': 'Operateur' }];
    public menuItems: MenuItemModel[] = [
        { text: 'Supprimer',
          iconCss: 'e-icons delete', }
    ];

    public monteurDataSource: MonteursData[];
    public timelineResourceDataOut = [];
    public dataMonteur: MonteursData[] = <MonteursData[]>extend([], this.monteurDataSource, null, true);
    public field: Object  = {
        dataSource:  this.workOrderData,
        id: 'Id',
        text: 'Name',
        description: 'Description'
    };
    public fieldMonteur: Object;
    public isClicked: boolean = false;
    public allowDragAndDrop: boolean = true;
    public isTreeItemDropped: boolean = false;
    public isTreeItemDroppedMonteur: boolean = false;
    public draggedItemId: string = '';

    public group: GroupModel = { enableCompactView: false, resources: ['Departments'] };
    public allowMultiple: Boolean = false;
    public filteredData: Object;
    public color : string = '#ea7a57'
    public cancelObjectModal = false;
    public salleDataSource;
    public containersPlanning;
    public departmentDataSource: Object[] = [];
    public departmentDataSourceAll: Object[] = [];
    public departmentGroupDataSource: Object[] = [];
    public allRegies: Object[] = [];
    public idExisting = [];
    public lastRandomId;

    public WorkorderByContainerId;
    public  codegroupe;
    public filtermonteurListeArray;
    public addMonteur: boolean;
    public fieldArray  =  this.field['dataSource']  ;
    public isDragged: boolean;
    public newField;
    public wOrderBackToBacklog;
    public  isAddedToBacklog: boolean;
    public count: number = 0;
    public groupeCharger: number ;
    public workOrderColor: string ;
    // public SelectDateDebut: Date = new Date();
    // public SelectDateFin: Date = new Date();
    public SelectDateDebut: Date = new Date(2019,0,1);
    public SelectDateFin: Date = new Date(2019,11,31);
    public startofWeek
    public endofWeek
    public startofMonth
    public endofMonth
    public startofDay
    public endofDay
    // public SelectDateFin: Date = new Date(this.SelectDateDebut.getDate() + 1);    
    public weekInterval: number = 1;
    public intervalValue: string = '60';
    public intervalData: string[] = ['15', '30', '60', '120'];
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

    constructor(
        public dialog: MatDialog,
        private coordinateurService: CoordinateurService,
        private salleService: SalleService,
        private containersService: ContainersService,
        private monteursService: MonteursService,
        private workorderService: WorkOrderService,
        private store: Store<App>
        ) {
            console.log('*******constructor*******');
            this.storeAppSubscription();
            this.getAllCoordinateurs();
            console.log('*******constructor*******');
                // public departmentDataSource: Object[] = [];
        }

    ngOnInit() {
        console.log(this.scheduleObj);
        console.log(this.scheduleObjDay, 'scheduleObjDay')
        this.toggleBtn.content = 'Voir toutes les Régies';
        // console.log(hospitalData);
        // console.log(this.eventSettings);
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
    
        // console.log(this.scheduleObj.currentView, "=========================================================================");
       
    }

    ngAfterViewInit() {
    
        this.departmentDataSource = this.departmentGroupDataSource;
        this.getWorkOrderByidGroup(3);
    
         
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('==============================================================================on change');
        
    }

    getAllCoordinateurs() {
          console.log('get ALL');
        this.coordinateurService.getAllCoordinateurs()
          .subscribe(data => {
              console.log('all coordinateurs : ', data);
              data.forEach(item => {
                  if (item.Username === this.user.shortUserName) {
                        console.log('COORDINATEUR => ', item);
                        this.getSalleByGroup(item.Groupe);
                        // ID PROVISOIRE !!!
                        this.getMonteursByGroup(item.Groupe);
                        this.getWorkOrderByidGroup(item.Groupe);
                        this.getAllMonteurs(item.Groupe);
                        this.currentCoordinateur = item;

                
                   }
              });
        });
    }

    storeAppSubscription() {
        this.store.subscribe(data => {
            console.log(data);
            this.user = data['app'].user;
            console.log(this.user);
        });


        // this.getWorkOrderByidGroup(3);
        // this.getAllMonteurs();
    }

    onEventClick(e: ActionEventArgs) {
        console.log('event clicked !!!!!!!!!!!');
    }


/*************************************************************************/
/******************************* API REQUEST *****************************/
/*************************************************************************/

/**************************** GET ***************************/


    getSalleByGroup(idGroup) {
        // this.toggleBtn.content = 'Voir autres Régies';
        console.log(this.departmentDataSource);
        this.salleService
            .getGroupSalle(idGroup)
            .subscribe(donnees => {
                this.salleDataSource = donnees;
                console.log('salles group result : ', donnees);
                this.salleDataSource.map(item => {
                    // console.log(item);
                    this.departmentGroupDataSource.push({
                        Text: item.NomSalle,
                        Id: item.CodeSalle,
                        Color: '#19716B',
                        codeSalle: item.CodeSalle,
                        codeRessource: item.CodeRessource
                    });
                    let newItem = [{ Text: item.NomSalle, Id: item.CodeSalle }];
                    this.departmentDataSource = this.departmentDataSource.concat(newItem);
                    // this.departmentDataSource = myGroupRegies;
                    console.log('regie departmentGroupDataSource', this.departmentDataSource);
                    console.log('item code salle fot container request : ', item.CodeSalle);
                    // this.getContainersByRessource(item.CodeRessource);
                 
                });
                
        let startofDay = moment().toDate()
        let endofDay = moment().add(1, 'd').toDate()
 
     

        this.salleDataSource.forEach(salle => {
            let indexSalle = this.salleDataSource.indexOf(salle);
            this.getContainersByRessourceStartDateEndDate(
                salle.CodeRessource,
                startofDay,
                endofDay,
                salle.CodeSalle,
                indexSalle
            );
        });
         
           
            
            })

        
    }

    getSalleAll(currentGroup) {
        this.toggleBtn.iconCss = 'e-play-icon';
        this.salleService
        .getSalle()
        .subscribe(donnees => {
            this.salleDataSource = donnees;
            this.salleDataSource.map(item => {
            if (item.codegroupe != currentGroup) {
                this.departmentDataSourceAll.push({
                    Text: item.NomSalle,
                    Id: item.CodeSalle,
                    Color: '#f9920b'
                });
            }
            });
            console.log(' this.departmentDataSourceAll', this.departmentDataSourceAll);
            this.allRegies = this.departmentGroupDataSource.concat(this.departmentDataSourceAll);
            console.log(' this.allRegies', this.allRegies);
            this.departmentDataSource = this.allRegies;
            console.log(' this.departmentDataSource', this.departmentDataSource);
        });
    }



    getAllMonteurs(group) {
        let monteurDataSource;
        this.monteursService
            .getMonteur()
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
            .subscribe(donnees => {
                console.log('monteurs : ', donnees);
                this.monteurDataSource = donnees;
                this.fieldMonteur = {
                    dataSource: this.monteurDataSource,
                    id: 'CodeRessource',
                    text: 'Username'
                };
        });
        console.log('fieldmonteur:',  this.fieldMonteur);
        console.log('monteur:',   this.monteurDataSource);
    }

    getAllContainer() {
        this.containersService
            .getAllContainers()
            .subscribe(donnees => {
                this.containersPlanning = donnees;
                console.log('container', this.containersPlanning);
            });
    }

    getContainersByRessource(coderessource) {
        this.containersService
            .getContainersByRessource(coderessource)
            .subscribe(data => {
                console.log('container by ressource : ', data);
            });
    }

    getContainersByRessourceStartDateEndDate(coderessource, datedebut, datefin, codeSalle, indexSalle) {
        let debut =moment(datedebut).format("YYYY-MM-DD").toString();
        let fin = moment(datefin).format("YYYY-MM-DD").toString();
        console.log(this.scheduleObj.currentView, 'currentView !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log(debut,fin, 'debut fin !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        this.containersService
            .getContainersByRessourceStartDateEndDate(coderessource, debut, fin)
            .subscribe(res => {
                this.dataContainersByRessourceStartDateEndDate = res;
                console.log('container by ressource, startDate and endDate',  this.dataContainersByRessourceStartDateEndDate);
                console.log(res.length);
                if (res.length > 0) {
                    this.allDataContainers = [...this.allDataContainers, ...res];
                    console.log('conainer present : ', res);
                    console.log(this.dataContainersByRessourceStartDateEndDate);
                    this.dataContainersByRessourceStartDateEndDate.map(data => {
                        this.idExisting.push(data.Id_Planning_Container);
                        console.log('data brut for conainer : ', data);
                        let StartTime =   moment(data.DateDebutTheo, moment.defaultFormat).toDate() ,
                        EndTime = moment(data.DateFinTheo, moment.defaultFormat).toDate();

                        let dateDebut =  StartTime,
                            dateFin= EndTime
                        // console.log(debut, "*******************************debut")
                        //    console.log(data, "*******************************data")
                        //    console.log(data.DateDebutTheo, "*******************************data.DateDebutTheo")
                        //    console.log(StartTime, "*******************************StartTime")
                    //    let mois = moment(data.DateDebutTheo, moment.defaultFormat).toDate()
                    //     console.log(  mois,'aa', mois._d, " !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! moisDebut !!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                        // let anneeDebut = StartTime.getFullYear(),
                        // moisDebut =(StartTime.getMonth()+1), // +1
                        // jourDebut = StartTime.getDate(),
                        // heurDebut = StartTime.getHours(),
                        // minuteDebut = StartTime.getMinutes();

                        // let anneefin = EndTime.getFullYear(),
                        // moisfin = (EndTime.getMonth()+1),
                        // jourfin = EndTime.getDate(),
                        // heurfin = EndTime.getHours(),
                        // minutefin = EndTime.getMinutes();
                        // console.log(  new Date(anneeDebut,moisDebut,jourDebut,heurDebut,minuteDebut), " !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! NEW DATE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                        // console.log(EndTime.getTime(),'day');
                        // console.log(datefin,'datefin');

                        let initiales = data.UserEnvoi.slice(-1) + data.UserEnvoi.slice(0,1);
                        console.log('initiales =====> ', initiales);

                        this.timelineResourceDataOut.push({
                            Id: data.Id_Planning_Container,
                            Name: (data.Titre === null || typeof(data.Titre) === 'undefined') ? 'Titre null' : data.Titre,
                            StartTime:dateDebut,
                            EndTime:  dateFin  , // date provisoire
                            CodeRessourceSalle: coderessource,
                            Container: true,
                            numGroup:data.Id_Planning_Container,
                            Description:data.Commentaire,
                            Operateur:data.LibelleRessourceOperateur === null ? '' : data.LibelleRessourceOperateur,
                            coordinateurCreate: initiales,
                            AzaIsPere: true,
                            AzaNumGroupe:  data.Id_Planning_Container,
                            DepartmentID: codeSalle,
                            ConsultantID: 2,
                            DepartmentName: '',
                            IsAllDay: false
                        });
                        let index = this.dataContainersByRessourceStartDateEndDate.indexOf(data);
                        let length = this.dataContainersByRessourceStartDateEndDate.length;
                        this.getWorkorderByContainerId(data.Id_Planning_Container, codeSalle, index, length, indexSalle);
                        
                    console.log('containerData starttime +++++++++++++++++++++++++++++++++++++++++++++++++++++',this.timelineResourceDataOut);
                    });
                    // timelineResourceDataOut
                    this.updateEventSetting(this.timelineResourceDataOut);
                                                        this.departmentDataSource = this.departmentGroupDataSource;

                    this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut;
                    console.log('this.scheduleObj.eventSettings.dataSource ', this.scheduleObj.eventSettings.dataSource);
                } else {
                    console.log('conainer not present for regie : ', coderessource, res);
                }
        });
    }

    getWorkorderByContainerId(id, codeSalle, index, containerArrayLength, indexSalle) {
        this.workorderService
            .getWorkOrderByContainerId(id)
            .subscribe(res => {
                console.log('response workorder for container : ', res);
                this.WorkorderByContainerId = res;
                if (this.WorkorderByContainerId != []) {
                    this.WorkorderByContainerId.map(data => {
                        let StartTime =   moment(data.DateDebutTheo, moment.defaultFormat).toDate() ,
                        EndTime = moment(data.DateFinTheo, moment.defaultFormat).toDate();

                        let dateDebut =  StartTime,
                            dateFin= EndTime
                        // let anneeDebut = StartTime.getFullYear(),
                        // moisDebut =(StartTime.getMonth()+1), // +1
                        // jourDebut = StartTime.getDate(),
                        // heurDebut = StartTime.getHours(),
                        // minuteDebut = StartTime.getMinutes();

                        // let anneefin = EndTime.getFullYear(),
                        // moisfin = (EndTime.getMonth()+1),
                        // jourfin = EndTime.getDate(),
                        // heurfin = EndTime.getHours(),
                        // minutefin = EndTime.getMinutes();
                        console.log(data.Statut, "statut")
                        //  this.statut = data.Statut 

                        this.timelineResourceDataOut.push({

                            Id: data.Id_Planning_Container,
                            Name: data.libtypeWO,
                            StartTime: dateDebut ,
                            EndTime:  dateFin, // date provisoire
                            CodeRessourceSalle: codeSalle,
                            Container: false,
                            numGroup:data.Id_Planning_Container,
                            Description:data.Commentaire,
                            Operateur:data.LibelleRessourceOperateur,
                            coordinateurCreate:data.LibelleRessourceCoordinateur,
                            Statut:data.Statut,
                            AzaIsPere: false,
                            AzaNumGroupe:  data.Id_Planning_Container,
                            DepartmentID: codeSalle,
                            ConsultantID: 2,
                            DepartmentName: '',
                            IsAllDay: false,

                    });
              
                });
                    
                
                this.updateEventSetting(this.timelineResourceDataOut); 
                // this.onActionComplete('');
                console.log('Planning Events', this.scheduleObj.eventSettings.dataSource);
                console.log('eventSettings 111', this.eventSettings);
                if (indexSalle === this.salleDataSource.length - 1) {
                    console.log('*********** end to initial request for all regies container and workorders ***********');
                    this.updateEventSetting(this.timelineResourceDataOut); 
                }
            } else {
                console.log(indexSalle);
                if (indexSalle === this.salleDataSource.length - 1) {
                    this.updateEventSetting(this.timelineResourceDataOut);
                    console.log('*********** end to initial request for all regies container and workorders ***********');
                }
            }
            if (index === (containerArrayLength - 1)) {
                this.field = {
                    dataSource:  this.workOrderData,
                    id: 'Id',
                    text: 'Name',
                    description: 'Description'
                };
                console.log('ready');
            }
        });
    }


    getWorkOrderByidGroup(idGroup) {
        this.workorderService
        .getWorkOrderByidGroup(idGroup)
        .subscribe(donnees => {
            this.WorkOrderByidgroup = donnees;
            console.log('getWorkOrderByidgroup', this.WorkOrderByidgroup);
            if (this.WorkOrderByidgroup != []) {
                this.WorkOrderByidgroup.map(workOrder => {
                    let StartTime =   moment(workOrder.DateDebut, moment.defaultFormat).toDate() ,
                    EndTime = moment(workOrder.DateFin, moment.defaultFormat).toDate();
                    let dateDebut =  StartTime,
                        dateFin= EndTime
                // let StartTime =   new Date (workOrder.DateDebut) ,
                // EndTime = new Date (workOrder.DateFin);
                // let anneeDebut = StartTime.getFullYear(),
                // moisDebut =(StartTime.getMonth() + 1),
                // jourDebut = StartTime.getDate(),
                // heurDebut = StartTime.getHours(),
                // minuteDebut = StartTime.getMinutes();

                // let anneefin = EndTime.getFullYear(),
                // moisfin = EndTime.getMonth(),
                // jourfin = EndTime.getDate(),
                // heurfin = EndTime.getHours(),
                // minutefin = EndTime.getMinutes();
                this.workOrderData.push({
                    Id: workOrder.Id_Planning_Events,
                    Name: workOrder.libtypeWO,
                    StartTime: dateDebut ,
                    EndTime:  dateFin,
                    CodeRessourceSalle: workOrder.CodeRessourceSalle,
                    Container: false,
                    numGroup:workOrder.Id_Planning_Events,
                    Description:workOrder.Commentaire,
                    Operateur:workOrder.LibelleRessourceOperateur,
                    coordinateurCreate:workOrder.LibelleRessourceCoordinateur,
                    Statut:workOrder.Statut,
                    AzaIsPere: false,
                    AzaNumGroupe:  workOrder.Id_Planning_Events,
                    DepartmentID: workOrder.CodeRessourceSalle,
                    ConsultantID: 2,
                    DepartmentName: '',
                    IsAllDay: false,
                });
            });
        }
        console.log('WorkOrderByidgroup', this.workOrderData);
        console.log('this.fieldArray', this.field);
        });

    }


/**************************** POST ***************************/

    deleteContainer(id, event) {
        this.containersService.deleteContainer(id)
            .subscribe(res => {
                console.log('delete container with success : ', res);
                this.timelineResourceDataOut.forEach(item => { // GARDER CETTE FONCTION POUR LA SUITE
                    if ((+event.AzaNumGroupe === +item.AzaNumGroupe) && !item.AzaIsPere) {
                        if (!this.field['dataSource'].includes(item)) {
                           this.backToBacklog(item); // ICI AJOUTER FONCTION UPDATE WORKORDER (isBacklog : 1)
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

    postContainer(containerToCreate, event) {
        this.containersService.postContainer(containerToCreate)
            .subscribe(res => {
                console.log('succes post new container. RES : ', res);
                if (res) {
                    console.log('res from post => ', res);
                    this.allDataContainers.push(res);
                    event.Id = res.Id_Planning_Container;
                    this.timelineResourceDataOut.push(event);
                    this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                        dataSource: <Object[]>extend(
                            [], this.timelineResourceDataOut, null, true
                        )
                    };
                }
            },
            error => {
                console.log('ERROR POST CONTAINER !!');
            }
        );
    }

    createContainer(event) {
        console.log(event);
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
        this.departmentGroupDataSource.map(item => {
            if (item['Id'] === event.DepartmentID) {
                libelleRessourceSalle = item['Text'];
                codeRessourceSalle = item['codeRessource'];
            }
        });
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
            Commentaire: '',
            Commentaire_Planning: '',
            DateMaj: now,
            UserMaj: libelleRessourceCoordinateur,
            PlanningEventsList: null
        };
        console.log('nouveau container fot api request : ', newContainer);
        console.log(event);
        this.postContainer(newContainer, event);
        // this.timelineResourceDataOut.push(containerData);
        //     this.eventSettings = { // Réinitialise les events affichés dans le scheduler
        //         dataSource: <Object[]>extend(
        //             [], this.timelineResourceDataOut, null, true
        //         )
        //     };
    }

    updateWorkorderToBacklog(event) {
        this.WorkOrderByidgroup.map(item => {
            if (item) {
            }
        });
    }

    updateWorkorder(id, workorder) {
        this.workorderService
            .updateWorkOrder(id, workorder)
            .subscribe(res => {
                 console.log(res);
            });
    }

/**************************** PUT ***************************/

/********** PUT WITH RESIZE OR EDITOR ***********/

    putContainer(id, container, event) { // RESIZE AND EditoR
        this.containersService.updateContainer(id, container)
            .subscribe(res => {
                console.log('succes update container. RES : ', res);
                let startDifferent = this.checkDiffExistById(event, this.timelineResourceDataOut, 'StartTime', 'StartTime');
                let endDifferent = this.checkDiffExistById(event, this.timelineResourceDataOut, 'EndTime', 'EndTime');
                this.timelineResourceDataOut = this.eventSettings.dataSource as Object[]; // refresh dataSource
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
                        console.log(item);
                    }
                });
                this.eventSettings = {
                    dataSource: <Object[]>extend(
                        [], this.calculDateAll(this.timelineResourceDataOut, true, event, startDifferent, endDifferent), null, true
                    )
                };
            }, error => {
                console.error('error updatecontainer', error);
                alert('error updatecontainer');
            }
        )
    }

    updateContainer(args) {
        let now = moment().format('YYYY-MM-DDTHH:mm:ss');
        args.data['Operateur'] = args.data['Operateur'] === 'Aucun Opérateur' ? '' : args.data['Operateur'];
        let event = args.data;
        let oldEvent = this.timelineResourceDataOut.filter(item => item.Id === event.Id);
        let containerResult = this.allDataContainers.filter(item => item.Id_Planning_Container === event.Id);
        let container = containerResult[0];
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
        this.departmentGroupDataSource.map(item => {
            if (item['Id'] === event.DepartmentID) {
                libelleRessourceSalle = item['Text'];
                codeRessourceSalle = item['codeRessource'];
            }
        });
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
            DateDebut: startTime,
            DateFin: endTime,
            DateDebutTheo: startTime,
            DateFinTheo: endTime,
            CodeRessourceSalle: codeRessourceSalle,
            LibelleRessourceSalle: libelleRessourceSalle,
            Commentaire: '',
            Commentaire_Planning: '',
            DateMaj: now,
            UserMaj: this.user.shortUserName,
            PlanningEventsList: null
        };
        this.putContainer(newContainer.Id_Planning_Container, newContainer, event);
    }

/****** PUT WITH OPERATEUR DRAG AND DROP *******/

    putContainerFromDragDropOperateur(id, container, indexContainerEvent, operateurObject) { // RESIZE AND EditoR
        this.containersService.updateContainer(id, container)
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

    updateContainerFromDragDropOperateur(operateurObject, dragDropEvent) {
        let indexContainerEvent = this.findIndexEventById(dragDropEvent.target.id);
        let containerId = this.timelineResourceDataOut[indexContainerEvent]['Id']
        let arrayContainerResult = this.allDataContainers.filter(item => item.Id_Planning_Container === containerId);
        let containerResult = arrayContainerResult[0];
        containerResult.LibelleRessourceOperateur = operateurObject.Username;
        containerResult.CodeRessourceOperateur = operateurObject.CodeRessource;
        let id = containerResult.Id_Planning_Container;
        this.putContainerFromDragDropOperateur(id, containerResult, indexContainerEvent, operateurObject);
    }

/*************************************************************************/
/*************************** UTILITY FUNCTIONS ***************************/

    updateEventSetting(data) {
            this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                dataSource: <Object[]>extend(
                    [], data, null, true
                )
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
/*************************** MODALS M1ANAGEMENT **************************/
public navigateFirstOfMouth
public navigateLastOfMouth
onNavigating(args){
    console.log('Schedule <b>Navigating</b> event called<hr>',args);
    console.log('ScheduleObj', args.currentView ,this.scheduleObj);
    console.log('ScheduleObj date',this.scheduleObj.activeView.colLevels[0][0].date );
    this.startofWeek = moment(this.scheduleObj.activeView.colLevels[0][0].date).startOf('week').toDate(),
        this.endofWeek = moment(this.scheduleObj.activeView.colLevels[0][0].date).endOf('week').toDate(),
        this.startofMonth = moment(this.scheduleObj.activeView.colLevels[0][0].date ).startOf('month').toDate(),
        this.endofMonth = moment(this.scheduleObj.activeView.colLevels[0][0].date ).endOf('month').toDate()
console.log("debut", this.startofWeek , "fin", this.endofWeek,"+++++++++",this.startofMonth,"++++++",this.endofMonth)
this.startofDay =   moment(this.scheduleObj.activeView.colLevels[0][0].date).startOf('day').toDate()
this.endofDay =   moment(this.scheduleObj.activeView.colLevels[0][0].date).endOf('day').toDate()
console.log( this.startofDay, "=========================================================================this.startofDay");
console.log( this.endofDay, "=========================================================================  this.endofDay");
   
  if(args.currentView ==="TimelineDay")
  {
 
      this.scheduleObj.timeScale.interval = 60
      this.scheduleObj.startHour ='06:00'
      this.scheduleObj.endHour ='23:00'
      this.scheduleObj.timeScale =  { enable: true, interval: 60, slotCount:2 }
      this.scheduleObj.dataBind()
    //   this.salleDataSource.forEach(salle => {
    //     let indexSalle = this.salleDataSource.indexOf(salle);
    //     this.getContainersByRessourceStartDateEndDate(
    //         salle.CodeRessource,
    //         this.SelectDateDebut,
    //         this.SelectDateFin,
    //         salle.CodeSalle,
    //         indexSalle
    //     );
    // });

    
  } else{ 
      if(args.currentView ==="TimelineWeek"){
          
        this.scheduleObj.startHour ='08:00'
        this.scheduleObj.endHour ='20:00'
        this.scheduleObj.timeScale =  { enable: true, interval: 60, slotCount:1 }
           if(this.open || !this.open){
             this.scheduleObj.refresh();
            }
      
    
      }
  }
  if(args.currentView ==="TimelineMonth" ||  args.currentView ==="Agenda" ){

    this.scheduleObj.readonly = true
    if (args.action === "date"){
        
          this.scheduleObj.readonly = true
          console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',this.scheduleObj.readonly)
    
  }
   
  } 
  
  if((args.currentView ==="TimelineWeek") || (args.currentView ==="TimelineDay") || (args.currentView ==="MonthAgenda")  )
  
  {
    this.scheduleObj.readonly = false

  }

  if(this.scheduleObj.currentView ==="TimelineMonth"){
 
  if (args.action === "date"){
    
    this.navigateFirstOfMouth = moment(args.currentDate).startOf('month').toDate()
    this.navigateLastOfMouth = moment(args.currentDate).endOf('month').toDate()
    console.log(this.navigateFirstOfMouth, "++++++++++++++++++++++++", this.navigateLastOfMouth  )

 

    console.log("debut", this.startofWeek , "fin", this.endofWeek,"+++++++++",this.startofMonth,"++++++",this.endofMonth)
        console.log(this.scheduleObj)
        
                 this.timelineResourceDataOut = []
                 this.salleDataSource.forEach(salle => {
                     let indexSalle = this.salleDataSource.indexOf(salle);
                     this.getContainersByRessourceStartDateEndDate(
                         salle.CodeRessource,
                         this.navigateFirstOfMouth,
                         this.navigateLastOfMouth ,
                         salle.CodeSalle,
                         indexSalle
                     );
                 });
                       

  }}
      if(this.scheduleObj.currentView ==="TimelineWeek"){

        if (args.action === "date"){
    
            let navigateFirstOfWeek = moment(args.currentDate).startOf('week').toDate()
            let navigateLastOfWeek = moment(args.currentDate).endOf('week').toDate()
            console.log(navigateFirstOfWeek, "++++++++++++++++++++++++", navigateLastOfWeek )
        
                
                         this.timelineResourceDataOut = []
                         this.salleDataSource.forEach(salle => {
                             let indexSalle = this.salleDataSource.indexOf(salle);
                             this.getContainersByRessourceStartDateEndDate(
                                 salle.CodeRessource,
                                 navigateFirstOfWeek,
                                 navigateLastOfWeek,
                                 salle.CodeSalle,
                                 indexSalle
                             );
                         });
                               
        
          }
      }
      if(this.scheduleObj.currentView === "TimelineDay"){

        if (args.action === "date"){
    
            let startofDay = moment(args.currentDate).toDate()
            let endofDay = moment(args.currentDate).add(1, 'd').toDate()
            console.log(startofDay, "++++++++++++++++++++++++", endofDay )
        
                
                         this.timelineResourceDataOut = []
                         this.salleDataSource.forEach(salle => {
                             let indexSalle = this.salleDataSource.indexOf(salle);
                             this.getContainersByRessourceStartDateEndDate(
                                 salle.CodeRessource,
                                 startofDay,
                                 endofDay,
                                 salle.CodeSalle,
                                 indexSalle
                             );
                         });
                               
        
          }
      }


}
public  couleur
    onPopupOpen(args) { // open container modal and display workorder list
        let workOrders = [];
     
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
       
        if(args.type === 'QuickInfo')
        {
          
            this.colorStatut.map(statut =>{
                if(args.data.Statut == statut['Id'])
                {
                   this.couleur  = statut["Color"]
                   
                }
                console.log( this.couleur , '+++++++++++++++++++++++++++++couleur++++++++++++++++++++++') 
            })
       
        }
          let colorRow = this.couleur
        console.log(  this.workOrderColor , '+++++++++++++++++++++++++++++couleur++++++++++++++++++++++') 
       

        args.element.hidden = false;
        if ((args.type === 'QuickInfo') &&  (args.data.name === 'cellClick')) {
            args.cancel = true;
        }
        if (this.cancelObjectModal) {
            args.cancel = true;
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
                elementParent.appendChild(row);
                for (let i = 0; i < workOrders.length; i++) {
                    let idRegie = workOrders[i].DepartmentID;
                    let colorRegie: string;
                 
                    this.departmentDataSource.map(item => {
                        if (item['Id'] === idRegie) {
                            colorRegie = item['Color'];
                        }
                    });
                    
   
                    console.log( this.couleur , '**********************************couleur*************************************') 
                  
                    row.innerHTML += `<div id='id${i}'>${workOrders[i].Name}</div>`;
                    
                   
                        let element = document.getElementById('id'+i)
                        
                        element.style.backgroundColor = this.workOrderColor


                



                console.log(element,"*********************ROW***********")
                }
                for (let e = 0; e < workOrders.length; e++) {
                    let child = document.getElementById(`id${e}`);
                    child.addEventListener('click', () => {
                        args.cancel = true;
                        args.element.hidden = true;
                        this.openDialog(args, args.data, workOrders[e], this.departmentDataSource);
                    });
                }
              
            }
        }
        if (args.data.name === 'cellClick') {
            console.log('cell click',args);
        }
        if (args.type === 'Editor') {
            console.log(this.openEditorCount);
            if (this.openEditorCount === 0) { // diplay none for IsAllDay and Repeat field in editor
                let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                console.log('isAllDay :', isAllDay[0]);
                isAllDay[0]['style'].display = 'none';
                let repeat = document.getElementsByClassName('e-editor');
                console.log('repeat', repeat[0]);
                repeat[0]['style'].display = 'none';
            }
            console.log('Open Editor');
            let inputEle: HTMLInputElement;
            let container: HTMLElement;
            let containerOperateur = document.getElementsByClassName('custom-field-container');
            if (args.data.hasOwnProperty('AzaIsPere')) {
                console.log('open Editor', args);
                console.log(this.drowDownOperateurList);
                if (args.data.AzaIsPere) { // dblclick container
                    if (containerOperateur.length === 0) {
                        console.log('containerOperateur.length = 0', containerOperateur);
                        this.createDrowDownOperteurInput(args, container, inputEle);
                        this.drowDownOperateurList.onchange = args.data.Operateur = this.drowDownOperateurList.value;
                        console.log(args.data.Operateur);
                    }
                } else { // dblclick workorder
                    containerOperateur[0].parentNode.removeChild(containerOperateur[0]);
                }
            } else {
                if (containerOperateur.length === 0) {
                    this.createDrowDownOperteurInput(args, container, inputEle);
                }
            }
            this.openEditorCount = 1;
        }
    }

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
        this.drowDownMonteurs.unshift({ text: 'Aucun Opérateur', value: 0});
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
                color:this.couleur
            }
        });
    }

/*************************************************************************/
/********************** DRAG AND DROP M1ANAGEMENT ***********************/

    onItemDrag(event: any, tabIndex): void { // FUCNTION FROM TEMPLATE
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

/******* DRAG AND DROP WORKORDERS *******/

    onTreeDragStop(event: DragAndDropEventArgs): void {
        this.creationArray = [];
        this.newData = [];
        let treeElement = closest(event.target, '.e-treeview');
        if (!treeElement) {
            event.cancel = true;
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
                    console.log('treeviewData  : ',treeviewData);
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
                        Operateur: ''
                    };
                    console.log(filteredData[0], 'filteredData[0]');
                    let eventData: { [key: string]: Object } = { // DISPLAY DATA FOR EVENT
                        Id: filteredData[0].Id,
                        Name: filteredData[0].Name,
                        StartTime: cellData.startTime,
                        EndTime: cellData.endTime,
                        IsAllDay: false,
                        Description: filteredData[0].Description,
                        DepartmentID: resourceDetails.resourceData.Id,
                        ConsultantID: resourceDetails.resourceData.Id,
                        AzaIsPere: false,
                        AzaNumGroupe: this.lastRandomId,
                        coordinateurCreate: this.user.initials,
                        Statut:filteredData[0].Statut,
                    };
                    this.creationArray.push(containerData);
                    this.creationArray.push(eventData);
                    console.log(containerData);
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
                        const filteredDataW =
                            treeviewData.filter((item: any) => item.Id === parseInt(event.draggedNodeData.id as string, 10));
                        let newEventData = { // DISPLAY DATA FOR EVENT
                            Id: filteredDataW[0].Id,
                            Name: filteredDataW[0].Name,
                            StartTime: containerSelected.StartTime,
                            EndTime: containerSelected.EndTime,
                            IsAllDay: false,
                            Description: filteredDataW[0].Description,
                            DepartmentID: containerSelected.DepartmentID,
                            ConsultantID: containerSelected.ConsultantID,
                            AzaIsPere: false,
                            AzaNumGroupe: containerSelected.AzaNumGroupe,
                            coordinateurCreate: this.user.initials,
                            Operateur: '',
                            Statut:filteredDataW[0].Statut,
                        };
                        this.timelineResourceDataOut.push(newEventData);
                        this.isTreeItemDropped = true;
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
                    }
                }
            }
        }
    }


/******* DRAG AND DROP OPERATEURS *******/

    onTreeDragStopMonteur(event: DragAndDropEventArgs): void {
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

    onActionBegin(event: ActionEventArgs): void {
        console.log('onActionBegin()');
        console.log(event);
        console.log(this.isTreeItemDropped);
      
        // if (event.requestType === 'eventChange' && !event.data.AzaIsPere) {
        //     console.log('is not pere');
        // }

    
     
     
        if (event.requestType === 'eventChange') {
            if(this.open == true) {
                this.open = true;
                this.sidebar.show();
                this.sidebar.position ='Right';
                this.sidebar.animate =  false;
            } else {
                this.open = false;
                this.sidebar.hide();
                this.sidebar.position ='Right';
                this.sidebar.animate =false;
            }
         }
        if (event.requestType === 'eventCreate') {
            console.log('eventCreate');
            console.log(event.requestType);
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
                        };
                        console.log('newItemContainerAfterEditorUpdate', newItemContainerAfterEditorUpdate);
                        // this.timelineResourceDataOut.push(newItemContainerAfterEditorUpdate);
                         this.createContainer(newItemContainerAfterEditorUpdate);
                    } else {
                        let newItemWorkorderAfterEditorUpdate = {
                            Id: item.Id,
                            Name: item.Name,
                            StartTime: event.data[0].StartTime,
                            EndTime: event.data[0].EndTime,
                            IsAllDay: event.data[0].IsAllDay,
                            DepartmentID: event.data[0].DepartmentID,
                            ConsultantID: item.ConsultantID,
                            AzaIsPere: false,
                            AzaNumGroupe: item.AzaNumGroupe,
                            coordinateurCreate: item.coordinateurCreate,
                            Operateur:  event.data[0].Operateur === 'Aucun Opérateur' ? '' : event.data[0].Operateur,
                            Statut:item.Statut
                        };
                        console.log('newItemWorkorderAfterEditorUpdate : ', newItemWorkorderAfterEditorUpdate);
                        this.timelineResourceDataOut.push(newItemWorkorderAfterEditorUpdate);
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
            if(this.open == true) {
                this.open = true;
                this.sidebar.show();
                this.sidebar.position ='Right';
                this.sidebar.animate =  false;
            } else {
                this.open = false;
                this.sidebar.hide();
                this.sidebar.position ='Right';
                this.sidebar.animate =false;
            }
         }
        if (args.requestType === 'eventRemove') { // CUSTOM ACTION REMOVE
            this.deleteEvent(args);
        } else if (args.requestType === 'viewNavigate') {
        } else if ((args.requestType !== 'toolbarItemRendering') && (args.data['AzaIsPere'])) { // RESIZE CONTAINER
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
                
            };
            this.createContainer(containerData);
            // this.timelineResourceDataOut.push(containerData);
            // this.eventSettings = { // Réinitialise les events affichés dans le scheduler
            //     dataSource: <Object[]>extend(
            //         [], this.timelineResourceDataOut, null, true
            //     )
            // };
        }
        


    }

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
        if(e.requestType === 'eventChanged') {
            if(this.open == true) {
                this.open = true;
                this.sidebar.show();
                this.sidebar.position ='Right';
                this.sidebar.animate =  false;
            } else {
                this.open = false;
                this.sidebar.hide();
                this.sidebar.position ='Right';
                this.sidebar.animate =false;
            }
            this.updateContainer(e);
        }
        this.isTreeItemDropped = false;
        this.isTreeItemDroppedMonteur = false;
        if (this.drowDownExist) {
            this.drowDownOperateurList.value = null;
        }
            // if(this.scheduleObj.currentView === 'TimelineWeek'){
            //     this.timeScale  = { enable: false };
            // }else{
            //     console.log("viewNavigate TimelineWeek ")
            //     this.timeScale  = { enable: true };
            // }
        this.eventSettings = { // Réinitialise les events affichés dans le scheduler
            dataSource: <Object[]>extend(
                [], this.calculDateAll(this.timelineResourceDataOut, false, null, false, false), null, true
            )
        };
        this.treeObj.fields = this.field;
        if(e.requestType === 'viewNavigate') {
        if(this.scheduleObj.currentView === 'TimelineDay'){
            this.timelineResourceDataOut = []
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
            console.log("journée", this.endofDay)
        }

        if(this.scheduleObj.currentView === "TimelineWeek"){
            this.timelineResourceDataOut = []
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
    }
        
if(this.scheduleObj.currentView === "TimelineMonth"){
    this.timelineResourceDataOut = []
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
 
  }
 
    }

   
 

    }

    /************************ DELETE ********************/

    deleteEvent(args: any) {
        console.log('call deleteEvent()');
        console.log('args : ', args);
        console.log('this.allDataContainers : ', this.allDataContainers);
        let data = args.data[0];
        if (data['AzaIsPere']) { // REMOVE CONTAINER
            // let selectedContainer = this.allDataContainers.filter(item => item.Id_Planning_Container === data.Id);
            // console.log('selected container : ', selectedContainer);
            // console.log('this.allDataContainers : ', this.allDataContainers);
            // let idContainer = selectedContainer[0].Id_Planning_Container;
            this.deleteContainer(data.Id, data);
        } else { // REMOVE WORKORDER
            let newGroup = [];
            let selectedItem;
            let pere;
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

            this.backToBacklog(selectedItem);
            let startDifferent = this.checkDiffExistById(pere, this.timelineResourceDataOut, 'StartTime', 'StartTime');
            let endDifferent = this.checkDiffExistById(pere, this.timelineResourceDataOut, 'EndTime', 'EndTime');
            this.eventSettings = {
                dataSource: <Object[]>extend(
                    [], this.calculDateAll(this.timelineResourceDataOut, true, pere, startDifferent, endDifferent), null, true
                )
            };
        }
    }

    backToBacklog(selectedItem) {
        let newWorkorderForList = {
            Id: selectedItem.Id,
            Name: selectedItem.Name,
            StartTime: selectedItem.StartTime,
            EndTime: selectedItem.EndTime,
            Description: selectedItem.Description,
            DepartmentName: selectedItem.Name,
            AzaIsPere: selectedItem.AzaIsPere,
            Statut:selectedItem.Statut
        };

        this.field['dataSource'].push(newWorkorderForList);
        this.wOrderBackToBacklog = this.field['dataSource'];
        this.isAddedToBacklog = true;
        let targetNodeId: string = this.treeObj.selectedNodes[0];
        let nodeId: string = 'tree_' + newWorkorderForList.Id;
        this.treeObj.addNodes([newWorkorderForList], targetNodeId, null); // TreeViewComponent
        console.log('wOrderBackToBacklog', this.wOrderBackToBacklog);
    }


    /************************ DATES CALCUL ********************/

    calculDateAll(
        atimelineResourceData: Object[], needUpdate: boolean, itemToUpdate: Object[], startDifferent: boolean, endDifferent: boolean
    ): Object[] {
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
        console.log('all AzaNumGroup present on planning :', groupe,);
        return this.timelineResourceDataOut;
    }

    calculDateGroup(
        atimelineResourceData: Object[], numGroup: number, needUpdate: boolean,
        itemToUpdate: Object[], startDifferent: boolean, endDifferent: boolean)
    : Object[] {
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

    getCountWorkOrderByGroup(objectin: Object[], property: string, numGroup: number): number {
        console.log('getCountWorkOrderByGroup()');
        let countWorkorderSameGroup = 0;
        console.log('numGroup : ', numGroup);
        objectin.forEach(item => {
            console.log(item[property]);
            if (+item[property] === numGroup) {
                if (!item['AzaIsPere']) {
                    countWorkorderSameGroup++;
                }
            }
        });
        console.log('countWorkorderSameGroup : ', countWorkorderSameGroup);
        return countWorkorderSameGroup;
    }

// GET MINIMUM DATE FROM GROUP
    getMinMaxNumgroupe(
        atimelineResourceData, numGroup: number, timePosition: string, isUpdate: boolean, Objupdate: Object[]
    ) {
        console.log('groupe to check max or min date : ', numGroup);
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
            console.log('min date for groupe', mindate);
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
            console.log('ma date for groupe', maxDate);
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
                    let tempdate = new Date(tempmindate.getTime() + Seconds_for_a_job * 1000) ;
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

    onSelect(value) {
    let monteurListArray;
        for (let i = 0; i < this.monteurListe.length; i++) {
            if (value === this.monteurListe[i].Username  ) {
                monteurListArray = this.fieldMonteur['dataSource'].concat(this.fieldMonteur['dataSource'].unshift( this.monteurListe[i]))
                monteurListArray.pop();
                this.fieldMonteur = { dataSource: monteurListArray , text: 'Username' };
                console.log('monteurListArray', monteurListArray);
                this.filtermonteurListeArray = monteurListArray;
                console.log(  this.fieldMonteur);
                this.addMonteur = true;
            }
        }
          // }
        // let CodeRessource= this.monteurDataSource.CodeRessource;
        // let username= this.monteurDataSource.Username;
        // let codeToString = CodeRessource.toString();
        // let target;
        // // console.log('codeToString', codeToString)
        // setTimeout(() => {
        //     if (document.querySelectorAll('.monteurs').length >= this.monteurDataSource.length) {
        //         target = document.getElementById(codeToString);
        //         console.log('target', target);
        //         target.innerHTML = username + `<button  class='float-right' style='border:none; height:20px;'  > btn <i class='icofont icofont-close float-right' ></i> </button>`;
        //         // document.getElementById('a'+codeToString).onclick=function(){
        //         //     console.log('monteur suprimé')
        //         //    }
        //         // target.addEventListener('click', (e: Event) => this.displayRegies());
        //     }
        //       console.log(this.dataMonteur);
        // }, 1000);
    }


    getColor (value, codeGroup) {
        if (value && codeGroup != this.groupeCharger ) {
        for (let i = 0; i < this.monteurListe.length; i++) {
            if (value === this.monteurListe[i].Username) {
                return 'red';
            }
        }
    }}

/**************************************************************** Filter Monteur  ******************************************************************/


/********** Filter Monteur  *********/

    onFilter(searchText: string, tabIndex) {

       
        if (tabIndex == 1) {

            if (!searchText) {
                console.log('searchText', typeof searchText, searchText);
                this.treeObjMonteur.fields['dataSource'] = this.fieldMonteur['dataSource'];
            }
       if(!this.isDelete){
            if (!this.addMonteur) {
                this.dataMonteur = this.monteurDataSource.filter(monteurs => {
                    return monteurs.Username.toLowerCase().includes(searchText.toLowerCase());
                });
            } else {
                this.dataMonteur = this.filtermonteurListeArray.filter(monteurs => {
                    return monteurs.Username.toLowerCase().includes(searchText.toLowerCase());
                });
            }
        } else {
            this.dataMonteur = this.filtermonteurListeArray.filter(monteurs => {
                return monteurs.Username.toLowerCase().includes(searchText.toLowerCase());
            });
            console.log('dataMonteur', this.fieldArrayMonteur[0]);
            console.log('dataMonteur', this.dataMonteur);
        }
            this.fieldMonteur['dataSource'] = this.dataMonteur;
            this.treeObjMonteur.fields['dataSource'] = this.fieldMonteur['dataSource']
            console.log('monteur datasource', this.monteurDataSource)
            console.log('filteredData', this.fieldMonteur);
            console.log('filteredData', this.dataMonteur);
            console.log(tabIndex);

        }
     
     console.log(    this.fieldArray , "fieldArray aaa  ")
        if (tabIndex == 0) {

           
            if (!searchText) {
                console.log('searchText', typeof searchText, searchText)
                if (!this.isAddedToBacklog){
                if (!this.isDragged){
                 this.field['dataSource'] = this.fieldArray;
                } else {
                    this.field['dataSource'] = this.newField;
                }

            } else {
                this.field['dataSource'] = this.wOrderBackToBacklog;
            }
            console.log('   this.field[dataSource]  quand le champs est vide',this.field['dataSource'])
            }
            if (!this.isAddedToBacklog) {
                if (!this.isDragged) {

                    this.data = this.field['dataSource'].filter(WorkOrder => {
                        return WorkOrder.Name.toLowerCase().includes(searchText.toLowerCase())
                            // || WorkOrder.Description.toLowerCase().includes(searchText.toLowerCase());
                    });
                } else {
                    this.data = this.newField.filter(WorkOrder => {
                        return WorkOrder.Name.toLowerCase().includes(searchText.toLowerCase())
                            // || WorkOrder.Description.toLowerCase().includes(searchText.toLowerCase());
                    });
                }
            } else {
                this.data = this.wOrderBackToBacklog.filter(WorkOrder => {
                    return WorkOrder.Name.toLowerCase().includes(searchText.toLowerCase())
                        // || WorkOrder.Description.toLowerCase().includes(searchText.toLowerCase());
                });
            }
            this.field['dataSource'] = this.data;
            this.treeObj.fields['dataSource'] = this.field['dataSource'];
            console.log('fieldArray', this.fieldArray);
            console.log('field', this.field['dataSource']);
            console.log('Data', this.data);
        }
    }


/**************************************************** Add Regies ************************************************************ *********/

    displayRegies() {
        // this.isClicked = true;
        console.log('AllRegie', this.allRegies)
        this.isClicked = !this.isClicked
        console.log(this.isClicked, 'isclickeddddd');
        if (this.isClicked) {
            this.toggleBtn.content = 'Voir mes Régies  ';
            if (this.count == 0 || this.allRegies.length == 0) {
                this.getSalleAll(this.currentCoordinateur.Groupe);
                this.count = this.count + 1;
                console.log(this.count);
            } else {
                this.departmentDataSource = this.allRegies;
                console.log('2eme click');
            }
        } else {
            this.toggleBtn.content = 'Voir autres Régies';
            this.departmentDataSource = this.departmentGroupDataSource;
            console.log('faux');
        }
    }
    public open
    
    btnClickSlide(){

        if(this.togglebtnslide.element.classList.contains('e-active')){
            // this.togglebtnslide.content = 'BackLog'
            this.open = false
            this.sidebar.hide();
            this.sidebar.position ='Right'
            this.sidebar.animate =false
            this.sidebar.locale = "fr-CH"
            
     
        
        }
        else{
            // this.togglebtnslide.content = '';
            this.open = true
            this.sidebar.show();
            this.sidebar.position ='Right'
            this.sidebar.animate =false
            this.sidebar.locale = "fr-CH"
         
         
           
        }
        console.log("slidebar",this.sidebar)
        console.log("button", this.togglebtnslide)
        console.log("scheduler element", this.scheduleObj)
        
    }

    /********************************** Remove Monteur *************************************/

    beforeopen(args: BeforeOpenCloseMenuEventArgs) {
        let targetNodeId: string = this.treeObjMonteur.selectedNodes[0];
        this.fieldMonteur['dataSource'].map(item => {
            if ( (item.codegroupe === this.currentCoordinateur.Groupe) ) {
                args.cancel = true;
                let targetNode: Element = document.querySelector(`[data-uid='${targetNodeId}']`);
                  console.log('targetNode', targetNode);
                if (targetNode.classList.contains('remove')) {
                    this.contentmenutree.enableItems(['Supprimer'], true);
                }
            }
            this.monteurListe.map(itemliste => {
                if (targetNodeId == itemliste.CodeRessource.toString()) {
                    if(itemliste.codegroupe != 10){
                args.cancel = false;
                } }
                console.log('args', item.codegroupe );
            });
            
        });
       
        console.log('targetNodeId', targetNodeId);
    }


    menuclick(args: MenuEventArgs) {
        let targetNodeId: string = this.treeObjMonteur.selectedNodes[0];
        for (let i = 0; i < this.monteurListe.length; i++) {
            let CodeRessource = this.monteurListe[i].CodeRessource;
            let CodeRessourceToString = CodeRessource.toString();
            if (CodeRessourceToString === targetNodeId) {
                if (args.item.text == 'Supprimer') {
                    this.treeObjMonteur.removeNodes([CodeRessourceToString]);
                   console.log('element supprimer');
                   this.isDelete = true;
                    //  this.monteurDataSource= this.treeObjMonteur['groupedData']
                }
                console.log( this.treeObjMonteur);
            }
        }
        this.fieldArrayMonteur  = this.treeObjMonteur['groupedData'];
        this.fieldMonteur['dataSource'] = this.fieldArrayMonteur[0];
        this.fieldMonteurDSource = this.fieldMonteur['dataSource']
        if (this.isDelete) {
            this.filtermonteurListeArray = this.fieldArrayMonteur[0];
        }
        console.log('field Array Monteur', this.fieldArrayMonteur);
        console.log('field Array Monteur DS', this.filtermonteurListeArray);
    }

    /************************************************************************ ADD Color **********************************************************************************/


    onEventRendered(args: EventRenderedArgs): void {
    
        let couleur

        // this.colorStatut.map(statut =>{
        //     if(args.data.Statut == statut['Id'])
        //     {
        //        couleur  = statut["Color"]
        //        console.log(couleur , 'couleur++++++++++++++++++++++')
        //     }
        // })
       
      
        if (args.data.AzaIsPere ) {
                return;
             
        } else {

            this.colorStatut.forEach(statut =>{
                if(args.data.Statut === statut['Id'])
                {
                   couleur  = statut["Color"]
                   console.log(couleur , 'couleur++++++++++++++++++++++')
                }
            })
            this.workOrderColor = couleur
           
               console.log("statut", args.data.Statut)


            if (this.scheduleObj.currentView === 'MonthAgenda') {
                (args.element.firstChild as HTMLElement).style.borderLeftColor = this.workOrderColor;
                (args.element.firstChild as HTMLElement).style.marginLeft ='30px'
                args.element.style.borderLeftColor = this.workOrderColor;
                console.log("statut", args)
         
            } else {
                if (this.scheduleObj.currentView === 'Agenda') {
                    (args.element.firstChild as HTMLElement).style.borderLeftColor =  this.workOrderColor;
                    (args.element.firstChild as HTMLElement).style.marginLeft ='30px'
                    // args.element.style.borderLeftColor =  this.workOrderColor;
                    
                } else {
                    (args.element.firstChild as HTMLElement).style.backgroundColor =  this.workOrderColor;
                    args.element.style.backgroundColor =  this.workOrderColor;
                }
            }
        }
     
      
    }


   



     /******************************************* Zoom *******************/
   
    changeInterval(e: DropDownChangeArgs): void {

        this.scheduleObj.timeScale.interval = parseInt(e.value as string, 10);
        // this.scheduleObj.activeViewOptions.timeScale.interval =  parseInt(e.value as string, 10)
        this.scheduleObj.dataBind();

        console.log(e)
    }
    public isStrictMode: boolean = true;

    onSubmit() {
        let temps = (this.ejEndTimePicker.value.getHours()) - (this.ejStartTimePicker.value.getHours())
        console.log('date picker ', temps);
        if (temps >= 12) {
            this.scheduleObj.startHour = this.instance.formatDate(this.ejStartTimePicker.value, { skeleton: 'Hm' });
            this.scheduleObj.endHour = this.instance.formatDate(this.ejEndTimePicker.value, { skeleton: 'Hm' });
        }

    }

    onRenderCell(args: RenderCellEventArgs): void {
        if (args.elementType === 'emptyCells' && args.element.classList.contains('e-resource-left-td')) {
            let target: HTMLElement = args.element.querySelector('.e-resource-text') as HTMLElement;
            if (this.scheduleObj.readonly == false) {
                target.innerHTML = '<div class="e-icons e-edit-icon1 icon-vue" ></div>';
            } else {
                target.innerHTML = '<div class="e-icons e-MT_Preview  icon-vue" ></div>';
            }
        }
    
    }




}