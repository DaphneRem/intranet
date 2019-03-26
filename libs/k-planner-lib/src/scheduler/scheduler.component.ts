import { Component,  ViewChild, OnInit, OnChanges, SimpleChanges, Input, AfterViewInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { App, User } from '../../../../apps/k-planner/src/app/+state/app.interfaces';
import * as moment from 'moment';
import swal from 'sweetalert2';

// Syncfusion Imports
// Synfucion Bases
import { extend, closest, remove, createElement, addClass, L10n, loadCldr, isNullOrUndefined, Internationalization } from '@syncfusion/ej2-base';
import { TooltipComponent, Position } from '@syncfusion/ej2-angular-popups';
import { DragAndDropEventArgs, BeforeOpenCloseMenuEventArgs, MenuEventArgs, Item, ItemModel } from '@syncfusion/ej2-navigations';
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
import { LibGroupeService } from '../services/libGroupe.service';
import { LibelleGroupe } from '../models/libelle-groupe';


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
        MonthAgendaService,
        LibGroupeService
    ]
})

export class SchedulerComponent implements OnInit, OnChanges, AfterViewInit {

    @ViewChild('scheduleObj')
    public scheduleObj: ScheduleComponent;
    @ViewChild('tooltip')
    public control: TooltipComponent;
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


    public activeViewTimelineDay: ScheduleComponent;
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
           public temp

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
    // { Id: 0, Color: '#B01106' },
    // { Id: 1, Color: '#F96C63' },
    // { Id: 2, Color: '#F0AC2C' },
    { Id: 3, Color: '#F3BE09' },
    // { Id: 4, Color: '#B01106' },
    // { Id: 5, Color: '#F96C63' },
    { Id: 6, Color: '#3ba506' },
    { Id: 7, Color: '#B01106' },
    { Id: 8, Color: '#F39009' }
    // { Id: 9, Color: '#3ba506' },
    // { Id: 10, Color: '#3ba506' },
    // { Id: 11, Color: '#3ba506' },
    // { Id: 12, Color: '#3ba506' },
    // { Id: 13, Color: '#3ba506' }
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
        description: 'Commentaire_Planning'
    };
    public fieldMonteur: Object;
    public isClicked: boolean = false;
    public allowDragAndDrop: boolean = true;
    public isnotMyGroup : boolean = false;
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
    public libGroupe : LibelleGroupe[] = []
    public lastRandomId;

    public WorkorderByContainerId;
    public  codegroupe;
    public libelleGroupe
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
    public intervalData: string[] = ['5','15', '30', '60', '120'];
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

    // ALL ACTIONS
    public isTreeItemDropped: boolean = false; // drag and drop wworkorder
    public isTreeItemDroppedMonteur: boolean = false; // drag and drop operateur
    // public fistCallAction: boolean = false;
    // public deleteWorkorderAction: boolean = false;
    // public deleteContainerAction: boolean = false;
    // public dragdropWorkorderCreateContainerAction: boolean = false;
    // public dragdropOperateurCreateContainerAction: boolean = false;
    // public resizeContainerAction: boolean = false;
    // public addWorkorderToContainerAction: boolean = false;
    // public changeOperateurToContainerAction: boolean = false;

    constructor(
        public dialog: MatDialog,
        private coordinateurService: CoordinateurService,
        private salleService: SalleService,
        private containersService: ContainersService,
        private monteursService: MonteursService,
        private workorderService: WorkOrderService,
        private libGroupeService: LibGroupeService , 
        private store: Store<App>
        ) {
            this.isnotMyGroup = false;
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
        this.activeViewTimelineDay = this.scheduleObj;
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
        // console.log(this.scheduleObj.currentView, '=========================================================================');
    }

    ngAfterViewInit() {
        this.departmentDataSource = this.departmentGroupDataSource;
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('==============================================================================on change');
    }

    refreshScheduler() {
        this.timelineResourceDataOut = [];
        this.openEditorCount = 0;
        console.log(this.scheduleObj.currentView, 'currentView !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log('refresh scheduler click');
        console.log('isClicked : ', this.isClicked);
        this.departmentDataSource = [];
        this.departmentDataSourceAll = [];
        this.departmentGroupDataSource = [];
        this.allDataContainers = [];
        this.allDataWorkorders = [];
        // this.departmentGroupDataSource = [];
        console.log('this.refreshDateStart : ', this.refreshDateStart);
        console.log('this.refreshDateEnd : ', this.refreshDateEnd);
        if ((this.refreshDateStart === undefined || this.refreshDateEnd === undefined) && this.scheduleObj.currentView === 'TimelineDay') {
            this.refreshDateStart = moment().toDate();
            this.refreshDateEnd = moment().add(1, 'd').toDate();
        }
        if (this.isClicked) {
            console.log('refresh scheduler with all regies');
            this.toggleBtn.content = 'Voir mes Régies  ';
            this.getSalleAll(this.currentCoordinateur.Groupe, this.refreshDateStart, this.refreshDateEnd);
        } else {
            console.log('refresh scheduler with my regies group');
            this.getSalleByGroup(this.currentCoordinateur.Groupe, this.refreshDateStart, this.refreshDateEnd);
            this.toggleBtn.content = 'Voir toutes les Régies';
            this.departmentDataSource = this.departmentGroupDataSource;
            console.log('faux');
        }
        this.scheduleObj.refresh();
        this.openEditorCount = 0;
    }

    refreshWorkordersBacklog() {
        console.log('refresh workorders backlog click');
        this.workOrderData = [];
        this.getWorkOrderByidGroup(this.currentCoordinateur.Groupe);
    }

    getAllCoordinateurs() {
        this.timelineResourceDataOut = [];
        this.departmentGroupDataSource = [];
        this.allDataContainers = [];
        this.allDataWorkorders = [];
        console.log('get ALL Coordinateurs');
        let startofDay = moment().toDate()
        let endofDay = moment().add(1, 'd').toDate();
        this.coordinateurService.getAllCoordinateurs()
            .subscribe(data => {
                console.log('all coordinateurs : ', data);
                data.forEach(item => {
                    if (item.Username === this.user.shortUserName) {
                        console.log('COORDINATEUR => ', item);
                        this.getSalleByGroup(item.Groupe, startofDay, endofDay);
                        // ID PROVISOIRE !!!
                        this.getMonteursByGroup(item.Groupe);
                        this.getWorkOrderByidGroup(item.Groupe);
                        this.getAllMonteurs(item.Groupe);
                        this.currentCoordinateur = item;
                        this.getLibGroupe(item.Groupe)
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
    }

    onEventClick(e: ActionEventArgs) {
        console.log('event clicked !!!!!!!!!!!');
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
                    // this.departmentDataSource = this.departmentDataSource.concat(newItem);
                    console.log('regie departmentGroupDataSource', this.departmentGroupDataSource);
                    this.departmentDataSource = this.departmentGroupDataSource
                    console.log('regie departmentDataSource', this.departmentDataSource);
                    console.log('item code salle fot container request : ', item.CodeSalle);
                    // this.getContainersByRessource(item.CodeRessource);
                });
                // let startofDay = moment().toDate()
                // let endofDay = moment().add(1, 'd').toDate();
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
        this.toggleBtn.iconCss = 'e-play-icon';
        this.salleService
        .getSalle()
        .subscribe(donnees => {
            this.timelineResourceDataOut = [];
            this.salleDataSource = donnees;
            console.log('all regies = ', this.salleDataSource);
            this.salleDataSource.map(item => {
                if (item.codegroupe != currentGroup) {
                    this.departmentDataSourceAll.push({
                        Text: item.NomSalle,
                        Id: item.CodeSalle,
                        Color: '#5A012B',
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

    public lastSalleCall = false;
    getContainersByRessourceStartDateEndDate(coderessource, datedebut, datefin, codeSalle, indexSalle) {
        console.log('--------------------------------------------------indexSalle => ', indexSalle);
        let debut =moment(datedebut).format('YYYY-MM-DD').toString();
        let fin = moment(datefin).format('YYYY-MM-DD').toString();
        if (indexSalle === (this.salleDataSource.length - 1)) {
            this.lastSalleCall = true;
        }
        console.log('******************************** this.lastSalleCall ===> ', this.lastSalleCall);
        console.log('debut =>', debut);
        console.log('fin =>', fin);
        console.log('coderessource salle => ', coderessource);
        this.containersService
            .getContainersByRessourceStartDateEndDate(coderessource, debut, fin)
            .subscribe(res => {
                this.dataContainersByRessourceStartDateEndDate = res;
                console.log('container present in regie : ',  this.dataContainersByRessourceStartDateEndDate);
                console.log('debut =>', debut);
                console.log('fin =>', fin);
                console.log('coderessource salle => ', coderessource);
                console.log('container res.length :', res.length);
                if (res.length > 0) {
                    this.allDataContainers = [...this.allDataContainers, ...res];
                    console.log('regie contains container : ', res.length);
                    this.dataContainersByRessourceStartDateEndDate.map(data => {
                        this.idExisting.push(data.Id_Planning_Container);
                        console.log('item in container present in regie (map) : ', data);
                        let dateDebut =   moment(data.DateDebutTheo, moment.defaultFormat).toDate();
                        let dateFin = moment(data.DateFinTheo, moment.defaultFormat).toDate();
                        let initiales = data.UserEnvoi.slice(-1) + data.UserEnvoi.slice(0,1);

                        this.timelineResourceDataOut.push({
                            Id: data.Id_Planning_Container,
                            Name: (data.Titre === null || typeof(data.Titre) === 'undefined') ? 'Titre' : data.Titre,
                            StartTime: dateDebut,
                            EndTime: dateFin ,
                            CodeRessourceSalle: coderessource,
                            Container: true,
                            numGroup: data.Id_Planning_Container,
                            Description: data.Commentaire,
                            Operateur: data.LibelleRessourceOperateur === null ? '' : data.LibelleRessourceOperateur,
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
                        console.log('--------------------------------------------------indexSalle => ', indexSalle);
                        this.getWorkorderByContainerId(data.Id_Planning_Container, codeSalle, index, length, indexSalle);
                    });
                    console.log('this.timelineResourceDataOut => ', this.timelineResourceDataOut)
                    // timelineResourceDataOut
                    this.updateEventSetting(this.timelineResourceDataOut);
                    // this.departmentDataSource = this.departmentGroupDataSource;
                    this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut;
                    console.log('this.scheduleObj.eventSettings.dataSource ', this.scheduleObj.eventSettings.dataSource);
                } else {
                    console.log('container not present for regie : ', coderessource, res);
                }
        });
    }
    public allDataWorkorders = [];
    getWorkorderByContainerId(id, codeSalle, index, containerArrayLength, indexSalle) {
        console.log('--------------------------------------------------indexSalle => ', indexSalle);
        console.log('id container to check workorder => ', id)
        console.log('codeSalle => ', codeSalle);
        console.log('index => ', index);
        console.log('containerArrayLength => ', containerArrayLength);
        console.log('this.salleDataSource.length => ', this.salleDataSource.length)
        this.workorderService
            .getWorkOrderByContainerId(id)
            .subscribe(res => {
                // console.log('response workorder for container : ', res);
                this.WorkorderByContainerId = res;
                this.allDataWorkorders = [...this.allDataWorkorders, ...res];
                // console.log('all data workorder : ', this.allDataWorkorders);
                console.log('******* res workorder  ******* => ', this.WorkorderByContainerId);
                console.log('this.WorkorderByContainerId.length => ', this.WorkorderByContainerId.length);
                if (this.WorkorderByContainerId.length > 0) {
                    this.WorkorderByContainerId.map(data => {
                        let StartTime =   moment(data.DateDebutTheo, moment.defaultFormat).toDate(),
                            EndTime = moment(data.DateFinTheo, moment.defaultFormat).toDate();
                        let dateDebut =  StartTime,
                            dateFin= EndTime
                        let newWorkorderEvent = {
                            Id: data.Id_Planning_Events,
                            Name:  data.titreoeuvre  + data.numepisode,
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
                            libchaine:data.libchaine,
                            typetravail:data.typetravail,
                            titreoeuvre:data.titreoeuvre,
                            numepisode:data.numepisode,
                            dureecommerciale:data.dureecommerciale,
                            libtypeWO:data.libtypeWO,
                            Commentaire_Planning:data.Commentaire_Planning
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
                console.log('workorder function get : call calculDateAll function');

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
                console.log('indexSalle => ', indexSalle);
                console.log('this.salleDataSource.length => ', this.salleDataSource.length);
                if (indexSalle === this.salleDataSource.length - 1) {
                    console.log('*********** end to initial request for all regies container and workorders ***********');
                    this.updateEventSetting(this.timelineResourceDataOut);
                    this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                        dataSource: <Object[]>extend(
                            [], this.calculDateAll(this.timelineResourceDataOut, false, null, false, false), null, true
                        ),
                        enableTooltip: true, tooltipTemplate: this.temp
                    };
                }
            } else {
                console.log('indexSalle => ', indexSalle);
                console.log('this.salleDataSource.length => ', this.salleDataSource.length);
                if (indexSalle === (this.salleDataSource.length - 1)) {
                    this.updateEventSetting(this.timelineResourceDataOut);
                    console.log('*********** end to initial request for all regies container and workorders ***********');
                    this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                        dataSource: <Object[]>extend(
                            [], this.calculDateAll(this.timelineResourceDataOut, false, null, false, false), null, true
                        ),
                        enableTooltip: true, tooltipTemplate: this.temp
                    };
                }
            }
            if (index === (containerArrayLength - 1)) {
                this.field = {
                    dataSource:  this.workOrderData,
                    id: 'Id',
                    text: 'Name',
                    description: 'typetravail'
                };
                console.log('ready');
            }
        });
    }

    createTooltipWorkorder() {
        for (let i = 0 ; i< this.timelineResourceDataOut.length; i++) {
            let titreoeuvre = this.timelineResourceDataOut[i].titreoeuvre,
                numepisode = this.timelineResourceDataOut[i].numepisode,
                dureecommerciale=this.timelineResourceDataOut[i].dureecommerciale,
                AzaIsPere = this.timelineResourceDataOut[i].AzaIsPere
            this.temp = '<div class="tooltip-wrap">' +
                '<div class="tooltip-wrap">' +
                '${if( titreoeuvre !== null && titreoeuvre !== undefined )}<div class="content-area"><div class="name" > Type de Travail: &nbsp; ${typetravail}<br> ${libtypeWO}<br> Durée Commerciale :&nbsp;${dureecommerciale} </>  </>  </div> ${/if}' +
                '${if(  Commentaire_Planning !== null && Commentaire_Planning !== undefined )}<div> Description : &nbsp; ${Commentaire_Planning} </>  </div> ${/if}'+
                '<div class="time">Début&nbsp;:&nbsp;${StartTime.toLocaleString()} </div>' +
                '<div class="time">Fin&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;${EndTime.toLocaleString()} </div></div></div> ';
        }
    }


    getWorkOrderByidGroup(idGroup) {
        console.log(this.workOrderData);
        this.workorderService
        .getWorkOrderByidGroup(idGroup)
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
                    Name: workOrder.titreoeuvre  + workOrder.numepisode,
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
                    libchaine: workOrder.libchaine,
                    typetravail:workOrder.typetravail,
                    titreoeuvre:workOrder.titreoeuvre,
                    numepisode:workOrder.numepisode,
                    dureecommerciale:workOrder.dureecommerciale,
                    libtypeWO:workOrder.libtypeWO,
                    Commentaire_Planning: workOrder.Commentaire_Planning
                });
            }),
            this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                enableTooltip: true, tooltipTemplate: this.temp
            };
            this.field = {
                dataSource:  this.workOrderData,
                id: 'Id',
                text: 'Name',
                description: 'typetravail'
            };
            // this.treeObj.refresh();
            console.log('WorkOrderByidgroup', this.workOrderData);
            console.log('this.fieldArray', this.field);
        }
        });
    }


    getLibGroupe(id){
        let libGroupe
        this.libGroupeService
        .getLibGroupe(id)
        .subscribe(donnees => {
            libGroupe = donnees
            libGroupe.map(donnees =>{
                this.libGroupe.push({
                    Libelle: donnees.Libelle,
                    Code: donnees.Code
                })
            })
        })
        console.log('............................',  this.libGroupe)
    }

/*************************** DELETE **************************/

    public deleteContainerAction = false;
    deleteContainer(id, event) {
        this.containersService.deleteContainer(id)
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
                    console.log(workorderEventToUpdate);
                    console.log('this.creationArray => ', this.creationArray);
                    if (workorderEventToUpdate.length > 0) {
                        this.createJustContainerAction = false;
                        workorderEventToUpdate.map(item => {
                            let newItemWorkorderAfterEditorUpdate = {
                                Id: item.Id,
                                Name: item.Name,
                                StartTime: event.StartTime,
                                EndTime: event.EndTime,
                                IsAllDay: event.IsAllDay,
                                DepartmentID: event.DepartmentID,
                                ConsultantID: item.ConsultantID,
                                AzaIsPere: false,
                                AzaNumGroupe: res.Id_Planning_Container,
                                coordinateurCreate: item.coordinateurCreate,
                                Operateur: event.Operateur,
                                Statut:item.Statut,
                                typetravail:item.typetravail,
                                titreoeuvre:item.titreoeuvre,
                                numepisode:item.numepisode,
                                dureecommerciale:item.dureecommerciale,
                                libchaine: item.libchaine,
                                Commentaire_Planning:item.Commentaire_Planning
                            };
                            this.updateWorkorderInDragDrop(newItemWorkorderAfterEditorUpdate, containerToCreate);
                            console.log('new workorder from post container function: ', newItemWorkorderAfterEditorUpdate);
                        })
                    }
                    this.timelineResourceDataOut.push(event);
                    this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                        dataSource: <Object[]>extend(
                            [], this.timelineResourceDataOut, null, true
                        ),
                        enableTooltip: true, tooltipTemplate: this.temp
                    };
                    this.creationArray = [];
                }
            },
            error => {
                console.log('ERROR POST CONTAINER !!');
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
        let oldEvent = this.timelineResourceDataOut.filter(item => item.Id === event.Id);
        console.log('old Event container :', oldEvent);
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
        console.log(this.departmentDataSource);
        this.departmentDataSource.map(item => {
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
            DateDebut: container.DateDebut,
            DateFin: container.DateFin,
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

    putContainer(id, container, event) { // call in resize, deplacement and Editor (call in updateContainer() function)
        this.containersService.updateContainer(id, container)
            .subscribe(res => {
                console.log('succes update container. RES : ', res);
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
                        console.log(item);
                    }
                });
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
                  text:'Le déplacement est impossible car l\'emplacement est occupé par un autre container',
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
            DateDebut: startTime,
            DateFin: startTime,
            DateDebutTheo: startTime,
            DateFinTheo: endTime,
            CodeRessourceSalle: container.CodeRessourceSalle,
            Commentaire: null,
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
            typetravail:workorderSelected.typetravail,
            titreoeuvre:workorderSelected.titreoeuvre,
            numepisode:workorderSelected.numepisode,
            dureecommerciale:workorderSelected.dureecommerciale,
        }
        console.log("newWorkorder => ", newWorkorder);
        this.workorderService
            .updateWorkOrder(newWorkorder.Id_Planning_Events, newWorkorder)
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
            DateDebut: startTime,
            DateFin: startTime,
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
            typetravail:workorderSelected.typetravail,
            titreoeuvre:workorderSelected.titreoeuvre,
            numepisode:workorderSelected.numepisode,
            dureecommerciale:workorderSelected.dureecommerciale,
            libtypeWO:workorderSelected.libtypeWO,
        
        }
        console.log('workorder data selected', newWorkorder);
        this.putWorkorder(newWorkorder.Id_Planning_Events, newWorkorder, event);
    }

    putWorkorder(id, workorder, event) {
        this.workorderService
            .updateWorkOrder(id, workorder)
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
                DateDebut: startTime,
                DateFin: startTime,
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
                Commentaire_Planning: null,
                DateMaj: now,
                UserMaj: this.user.shortUserName,
                Id_Planning_Container: containerParent.Id_Planning_Container,
                isbacklog: 0,
                libchaine:workorderSelected.libchaine,
                typetravail:workorderSelected.typetravail,
                titreoeuvre:workorderSelected.titreoeuvre,
                numepisode:workorderSelected.numepisode,
                dureecommerciale:workorderSelected.dureecommerciale,
            }
            console.log('workorder data selected', newWorkorder);
            this.putWorkorderWithCalcul(newWorkorder, event, containerParent, this.timelineResourceDataOut, true);
        }

    }

    putWorkorderWithCalcul(newWorkorder, eventWorkorder, containerParent, timelineDataOut, pushEvent) {
        this.workorderService
            .updateWorkOrder(newWorkorder.Id_Planning_Events, newWorkorder)
            .subscribe(res => {
                console.log('update workorder with success : ', res);
                console.log(this.allDataWorkorders); // all brut workorder data in backlog
                let containerEvent = this.timelineResourceDataOut.filter(item => item.Id === containerParent.Id_Planning_Container && item.AzaIsPere);
                let containerPere = containerEvent[0];
                this.allDataWorkorders.push(newWorkorder);
                console.log('eventWorkorder =================>', eventWorkorder);
                if(pushEvent) {
                    this.timelineResourceDataOut.push(eventWorkorder);
                }
                let startDifferent = this.checkDiffExistById(containerPere, timelineDataOut, 'StartTime', 'StartTime');
                let endDifferent = this.checkDiffExistById(containerPere, timelineDataOut, 'EndTime', 'EndTime');
                console.log('update only group in timelinesDataOut');
                this.timelineResourceDataOut =  this.calculDateGroup(
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
            DateDebut:  workorder.DateDebut,
            DateFin:  workorder.DateFin,
            DateDebutTheo: startTime,
            DateFinTheo: endTime,
            CodeRessourceSalle: containerParent.CodeRessourceSalle,
            Commentaire: null,
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
            libchaine:workorder.libchaine,
            typetravail:workorder.typetravail,
            titreoeuvre:workorder.titreoeuvre,
            numepisode:workorder.numepisode,
            dureecommerciale:workorder.dureecommerciale,
            libtypeWO:workorder.libtypeWO,
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
        if (othersWorkorderForContainer.length  <= 0) {
            swal({
              title: 'Supprimer le container associé',
              text:'Vous supprimez le dernier workorder du container, ' + 'souhaitez-vous supprimer le container ?',
              showCancelButton: true,
              cancelButtonText: 'NON',
              confirmButtonText: 'SUPPRIMER'
            }).then((result) => {
                if (result.value) {
                    this.containersService.deleteContainer(containerPere.Id)
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
            Commentaire: null,
            Support1Cree: null,
            Support2Cree: null,
            MustWaitFor: null,
            Statut: workorderSelected.Statut,
            idplanningprec: null,
            Regroup: null,
            Commentaire_Planning:  workorderSelected.Commentaire_Planning,
            DateMaj: now,
            UserMaj: this.user.shortUserName,
            Id_Planning_Container: null,
            isbacklog: 1,
            libchaine:workorderSelected.libchaine,
            typetravail:workorderSelected.typetravail,
             titreoeuvre:workorderSelected.titreoeuvre,
             numepisode:workorderSelected.numepisode,
             dureecommerciale:workorderSelected.dureecommerciale,
             libtypeWO:workorderSelected.libtypeWO,

        }
        console.log(newWorkorder);
        this.workorderService
            .updateWorkOrder(newWorkorder.Id_Planning_Events, newWorkorder)
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
            Name: selectedItem.titreoeuvre  + selectedItem.numepisode,
            StartTime: selectedItem.StartTime,
            EndTime: selectedItem.EndTime,
            Statut:selectedItem.Statut,
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
            coordinateurCreate: null,
            numGroup: null,
            libchaine:selectedItem.libchaine,
            typetravail:selectedItem.typetravail,
            titreoeuvre:selectedItem.titreoeuvre,
            numepisode:selectedItem.numepisode,
            dureecommerciale:selectedItem.dureecommerciale,
                        libtypeWO:selectedItem.libtypeWO,
            Commentaire_Planning: selectedItem.Commentaire_Planning

        };
        this.field['dataSource'].push(newWorkorderForList);
        this.wOrderBackToBacklog = this.field['dataSource'];
        this.isAddedToBacklog = true;
        let targetNodeId: string = this.treeObj.selectedNodes[0];
        let nodeId: string = 'tree_' + newWorkorderForList.Id;
        this.eventSettings = {
            enableTooltip: true, tooltipTemplate: this.temp
        };
        this.treeObj.addNodes([newWorkorderForList], targetNodeId, null); // TreeViewComponent
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
        Id_Planning_Events:workorder.Id_Planning_Events,
        Iddetail: workorder.Iddetail,
        IdTypeWO: workorder.IdTypeWO,
        UserEnvoi: workorder.UserEnvoi,
        DateEnvoi: workorder.DateEnvoi,
        CodeRessourceOperateur: workorder.CodeRessourceOperateur, // voir ou et si on récupère la donnée par la suite
        CodeRessourceCoordinateur: workorder.CodeRessourceCoordinateur,
        DateSoumission: null,
        DateDebut: startTime,
        DateFin: endTime,
        DateDebutTheo: startTime,
        DateFinTheo: endTime,
        CodeRessourceSalle: event.CodeRessourceSalle,
        Commentaire: null,
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
        typetravail:workorder.typetravail,
        titreoeuvre:workorder.titreoeuvre,
        numepisode:workorder.numepisode,
        dureecommerciale:workorder.dureecommerciale,
        libtypeWO:workorder.libtypeWO,
        Commentaire_Planning: event.Commentaire_Planning,
      
    }
    console.log('workorder data selected', newWorkorder);
    this.putWorkorderEditor(newWorkorder.Id_Planning_Events, newWorkorder, event);


}
putWorkorderEditor(id, workorder, event) { // RESIZE AND EditoR
    this.workorderService
    .updateWorkOrder(id, workorder)
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
                    item.Id_Planning_Container = event.Id_Planning_Container
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
        },  error => {
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
/*************************** MODALS M1ANAGEMENT **************************/
public navigateFirstOfMouth
public navigateLastOfMouth
public activeView = 'TimelineDay';
public eventTemplate;
public agendaStartDate;
public agendaLastDate;
public calcule;
public navigateTimelineDay;
    onNavigating(args) {
        console.log(' ============================> NEW NAVIGATION ====================> ', args);
        console.log(this.field);
        console.log('this.timelineResourceDataOut => ', this.timelineResourceDataOut)
        this.timelineResourceDataOut = [];
        console.log(this.departmentDataSource);
        // console.log('this.timelineResourceDataOut vide => ', this.timelineResourceDataOut)
        this.startofDay =   moment(this.scheduleObj.activeView.renderDates[0]).toDate()
        this.endofDay =   moment(this.scheduleObj.activeView.renderDates[0]).add(1, 'd').toDate()

        this.startofWeek = moment().startOf('week').toDate(),
        this.endofWeek = moment().endOf('week').add(1, 'd').toDate(),

        this.startofMonth = moment().startOf('month').toDate(),
        this.endofMonth = moment().endOf('month').add(1, 'd').toDate()

        this.agendaStartDate =  moment().toDate()
        this.agendaLastDate =  moment().add(7, 'd').toDate()

        if (args.currentView ==="TimelineDay") {
            this.scheduleObj.timeScale.interval = 60
            this.scheduleObj.startHour ='06:00'
            this.scheduleObj.endHour ='23:00'
            this.scheduleObj.timeScale =  { enable: true, interval: 60, slotCount:2 }
            this.scheduleObj.dataBind()
        } else {
            if (args.currentView ==="TimelineWeek") {
                this.scheduleObj.startHour ='08:00'
                this.scheduleObj.endHour ='20:00'
                this.scheduleObj.timeScale =  { enable: true, interval: 60, slotCount:1 }
                //    if(this.open || !this.open){
                //      this.scheduleObj.refresh();
                //     }
            }
        }
        if (args.currentView === 'TimelineDay') {
            this.scheduleObj.currentView = 'TimelineDay';
            this.navigateTimelineDay = true;
            let startofDay = moment(args.currentDate).toDate()
            let endofDay = moment(args.currentDate).add(1, 'd').toDate()
            console.log(startofDay, "++++++++++++++++++++++++", endofDay )
            this.timelineResourceDataOut = [];
            this.refreshDateStart = startofDay;
            this.refreshDateEnd = endofDay;
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
        if (this.scheduleObj.currentView === 'TimelineDay' && args.currentView === 'TimelineDay') {
          console.log('TIMELINEDAY !!!!')
            if (args.action === 'date') {
                console.log('TIMELINEDAY !!!! => date contition');
                this.timelineResourceDataOut = []
                let startofDay = moment(args.currentDate).toDate()
                let endofDay = moment(args.currentDate).add(1, 'd').toDate()
                this.refreshDateStart = startofDay;
                this.refreshDateEnd = endofDay;
                console.log(startofDay, ' ++++++++++++++++++++++++ ', endofDay )
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
              if (args.action === 'view') {
                console.log('TIMELINEDAY !!!! => view contition');
                this.timelineResourceDataOut = []
                console.log('timelineResourceDataOut => ', this.timelineResourceDataOut);
                this.salleDataSource.forEach(salle => {
                    let indexSalle = this.salleDataSource.indexOf(salle);
                    this.refreshDateStart = this.startofDay;
                    this.refreshDateEnd = this.endofDay;
                    this.getContainersByRessourceStartDateEndDate(
                        salle.CodeRessource,
                        this.startofDay,
                        this.endofDay,
                        salle.CodeSalle,
                        indexSalle
                    );
                });
                console.log("currentView date ",  this.startofDay ,  this.endofDay, )
                console.log('timelineResourceDataOut => ', this.timelineResourceDataOut);
              }
            }
        if (args.currentView ==="TimelineMonth" ||  args.currentView ==="Agenda" ) {
            this.scheduleObj.readonly = true
            if (args.action === "date") {
                this.scheduleObj.readonly = true
                console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',this.scheduleObj.readonly)
            }
        }
        if ((args.currentView ==="TimelineWeek") || (args.currentView ==="TimelineDay") || (args.currentView ==="MonthAgenda")) {
            this.scheduleObj.readonly = false
            if( this.isnotMyGroup == true){
                this.scheduleObj.readonly = true
            }else{
                this.scheduleObj.readonly = false
            }
        }
        if(this.scheduleObj.currentView ==="TimelineMonth") {
            if (args.action === "date") {
                this.navigateFirstOfMouth = moment(args.currentDate).startOf('month').toDate()
                this.navigateLastOfMouth = moment(args.currentDate).endOf('month').toDate()
                console.log(this.navigateFirstOfMouth, "++++++++++++++++++++++++", this.navigateLastOfMouth)
                console.log("debut", this.startofWeek , "fin", this.endofWeek,"+++++++++",this.startofMonth,"++++++",this.endofMonth)
                console.log(this.scheduleObj)
                this.refreshDateStart = this.navigateFirstOfMouth;
                this.refreshDateEnd = this.navigateLastOfMouth;
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
            }
        }
        if (this.scheduleObj.currentView ==="TimelineWeek") {
            if (args.action === "date"){
                let navigateFirstOfWeek = moment(args.currentDate).startOf('week').toDate()
                let navigateLastOfWeek = moment(args.currentDate).endOf('week').toDate()
                console.log(navigateFirstOfWeek, "++++++++++++++++++++++++", navigateLastOfWeek )
                this.timelineResourceDataOut = [];
                this.refreshDateStart = navigateFirstOfWeek;
                this.refreshDateEnd = navigateLastOfWeek;
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
        if (this.scheduleObj.currentView === "TimelineDay") {
            if (args.action === "date") {
                let startofDay = moment(args.currentDate).toDate()
                let endofDay = moment(args.currentDate).add(1, 'd').toDate()
                console.log(startofDay, "++++++++++++++++++++++++", endofDay )
                this.timelineResourceDataOut = [];
                this.refreshDateStart = startofDay;
                this.refreshDateEnd = endofDay;
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
        if (args.currentView === "TimelineMonth" ) {
    //   if (args.action === "date"){
    //             this.timelineResourceDataOut = []
    //             this.navigateFirstOfMouth = moment(args.currentDate).startOf('month').toDate()
    //             this.navigateLastOfMouth = moment(args.currentDate).endOf('month').add(1,'d').toDate()
    //                 console.log(this.navigateFirstOfMouth, "++++++++++++++++++++++++", this.navigateLastOfMouth  )
    //                 console.log("debut", this.startofWeek , "fin", this.endofWeek,"+++++++++",this.startofMonth,"++++++",this.endofMonth)
    //                 console.log(this.scheduleObj) 
    //                  this.salleDataSource.forEach(salle => {
    //                      let indexSalle = this.salleDataSource.indexOf(salle);
    //                      this.getContainersByRessourceStartDateEndDate(
    //                          salle.CodeRessource,
    //                          this.navigateFirstOfMouth,
    //                          this.navigateLastOfMouth ,
    //                          salle.CodeSalle,
    //                          indexSalle
    //                      );
    //                  });
    //   }
            if (args.action === "view") {
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
                console.log('timelineResourceDataOut => ', this.timelineResourceDataOut);
            }
        }
        if (args.currentView ==="MonthAgenda") {
            // if (args.action === "date"){
            //     this.timelineResourceDataOut = []
            //   this.navigateFirstOfMouth = moment(args.currentDate).startOf('month').toDate()
            //   this.navigateLastOfMouth = moment(args.currentDate).endOf('month').add(1,'d').toDate()
            //   console.log(this.navigateFirstOfMouth, "++++++++++++++++++++++++", this.navigateLastOfMouth  )
            //   console.log("debut", this.startofWeek , "fin", this.endofWeek,"+++++++++",this.startofMonth,"++++++",this.endofMonth)
            //       console.log(this.scheduleObj)
            //                this.salleDataSource.forEach(salle => {
            //                    let indexSalle = this.salleDataSource.indexOf(salle);
            //                    this.getContainersByRessourceStartDateEndDate(
            //                        salle.CodeRessource,
            //                        this.navigateFirstOfMouth,
            //                        this.navigateLastOfMouth ,
            //                        salle.CodeSalle,
            //                        indexSalle
            //                    );
            //                });
            // }
            if (args.action === "view") {
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
                console.log('timelineResourceDataOut => ', this.timelineResourceDataOut);

            }
        }
        //   if(args.currentView ==="TimelineWeek"){
        // if (args.action === "date"){
        //     this.timelineResourceDataOut = []
        //   this.navigateFirstOfWeek = moment(args.currentDate).startOf('week').toDate()
        //     this.navigateLastOfWeek = moment(args.currentDate).endOf('week').add(1,'d').toDate()
        //                  this.salleDataSource.forEach(salle => {
        //                      let indexSalle = this.salleDataSource.indexOf(salle);
        //                      this.getContainersByRessourceStartDateEndDate(
        //                          salle.CodeRessource,
        //                          this.navigateFirstOfWeek,
        //                          this.navigateLastOfWeek,
        //                          salle.CodeSalle,
        //                          indexSalle
        //                      );
        //                  });
        //   }
        // }
        if (args.currentView ==="TimelineWeek") {
            if (args.action === "view") {
                this.timelineResourceDataOut = []
                console.log(this.timelineResourceDataOut,"timelineResourceDataOut");
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
            console.log(this.timelineResourceDataOut,"timelineResourceDataOut")
          }

          if(args.previousView === "TimelineDay"){
     
            this.zoom = true
                  }
          

     
       
            let value = 60
            document.body.addEventListener('keydown', (eKey: KeyboardEvent) => {
                let scheduleElement = document.getElementsByClassName("schedule-container");
               
    if(this.zoom === true){
                            if ( eKey.keyCode === 80 && scheduleElement ) {
                                if (value < 120){
                                  value = value +  30
                             this.scheduleObj.timeScale.interval = value
                                      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!+++++++++",  this.scheduleObj.timeScale.interval)
                            }
                      } else {  
                     if ( eKey.keyCode === 77 && scheduleElement ) {
               
              
                          if ( value > 30){
                              value = value - 30
                              this.scheduleObj.timeScale.interval = value 
                              console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!+++++++++",  this.scheduleObj.timeScale.interval)
                                   }}
                     }
         } else {

            if ( eKey.keyCode === 80 && scheduleElement ) {
            
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!+++++++++",  this.zoom)
            
        } else {  
        if ( eKey.keyCode === 77 && scheduleElement ) {
           
          
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!+++++++++",  this.zoom)
            }
        }


        }
            });


        
      }

        if(args.currentView === "TimelineDay"){
     
        this.zoom = false
      }



       
        console.log("date agenda schedulerobj ......................................",this.scheduleObj)
      if(args.currentView ==="Agenda"){
        if (args.action === "date"){
                   let navigateFirstOfWeek =  moment(args.currentDate).toDate() ,
                   navigateLastOfWeek = moment(args.currentDate).add(7, 'd').toDate()
            this.timelineResourceDataOut = []
            this.refreshDateStart = navigateFirstOfWeek;
            this.refreshDateEnd = navigateLastOfWeek;
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
                  if (args.action === "view"){
                    this.timelineResourceDataOut = []
                    this.calcule = false
                    console.log('timelineResourceDataOut => ', this.timelineResourceDataOut);
                    this.refreshDateStart = this.agendaStartDate;
                    this.refreshDateEnd = this.agendaLastDate;
                this.salleDataSource.forEach(salle => {
                    let indexSalle = this.salleDataSource.indexOf(salle);
                    this.getContainersByRessourceStartDateEndDate(
                        salle.CodeRessource,
                        this.agendaStartDate,
                        this.agendaLastDate,
                        salle.CodeSalle,
                        indexSalle
                    );
                });
            }
        }

    }

public  couleur;

public zoom : boolean = true;
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
                   this.couleur  = statut['Color']
                }
            })
      
        }
        let colorRow = this.couleur
        args.element.hidden = false;
        if ((args.type === 'QuickInfo') &&  (args.data.name === 'cellClick')) {
            args.cancel = true;
        }
        if (this.cancelObjectModal) {
            args.cancel = true;
        }
                if ((args.type === 'QuickInfo') &&  (args.name === 'popupOpen')){
            let title = document.getElementsByClassName('e-subject-container');
            let subTitle =  document.getElementsByClassName('e-location-container');
            let Debut =  document.getElementsByClassName('e-start-container');
            let fin=  document.getElementsByClassName('e-end-container');
            let regie =  document.getElementsByClassName('e-resources');
            console.log('repeat', title[0]);
            console.log('repeat', subTitle[0]);
            title[0]['style'].display = 'block';
            subTitle[0]['style'].display = 'block';
            Debut[0]['style'].display = 'block';
            fin[0]['style'].display = 'block';
            regie[0]['style'].display = 'block';
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
                  
                    row.innerHTML += `<div id='id${i}'> ${workOrders[i].titreoeuvre} ep ${workOrders[i].numepisode}</div>`;
                    
                   
                        let element = document.getElementById('id'+i)
                        
                        element.style.backgroundColor = this.workOrderColor


                



                console.log(element,'*********************ROW***********')
                }
                for (let e = 0; e < workOrders.length; e++) {
                    let child = document.getElementById(`id${e}`);
                    child.addEventListener('click', () => {
                        args.cancel = true;
                        args.element.hidden = true;
                        this.openDialog(args, args.data, workOrders[e], this.departmentDataSource);
                        console.log(child)
                        });
                }
              
            }else {
                let elementworkorder: HTMLElement = <HTMLElement>args.element.querySelector('.e-subject');
             
                this.timelineResourceDataOut.map(item => {
                    if (item.AzaNumGroupe === args.data.AzaNumGroupe && item.AzaIsPere === false) {
                        workOrders.push(item);
                    }
                });
                for (let i = 0; i < workOrders.length; i++) {
                    // ${workOrders[i].typetravail}
                elementworkorder.innerHTML=`<div class='e-subject e-text-ellipsis'> ${workOrders[i].titreoeuvre} ep ${workOrders[i].numepisode} </div>` 
            }
            console.log(elementworkorder,"wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww")
        
        }
        } 
        if (args.data.name === 'cellClick') {
            console.log('cell click',args);
            console.log(this.isTreeItemDropped);
            this.creationArray = [];
            this.isTreeItemDropped = false;
            let title = document.getElementsByClassName('e-subject-container');
            let subTitle =  document.getElementsByClassName('e-location-container');
            let Debut =  document.getElementsByClassName('e-start-container');
            let fin=  document.getElementsByClassName('e-end-container');
            let regie =  document.getElementsByClassName('e-resources');
            console.log('repeat', title[0]);
            console.log('repeat', subTitle[0]);
            title[0]['style'].display = 'block';
            subTitle[0]['style'].display = 'block';
            Debut[0]['style'].display = 'block';
            fin[0]['style'].display = 'block';
            regie[0]['style'].display = 'block';


        }
        if (args.data.name === 'cellDoubleClick') {
            console.log('cell double click',args);
            console.log(this.isTreeItemDropped);
            this.creationArray = [];
            this.isTreeItemDropped = false;
        }
        if (args.type === 'Editor') {

            this.zoom = false
            console.log('Editor Open and this.isTreeItemDropped = ', this.isTreeItemDropped);
            console.log(this.openEditorCount);
            if (this.openEditorCount === 0) { // diplay none for IsAllDay and Repeat field in editor
                let isAllDay = document.getElementsByClassName('e-all-day-time-zone-row');
                console.log('isAllDay :', isAllDay[0]);
                isAllDay[0]['style'].display = 'none';
                let repeat = document.getElementsByClassName('e-editor');
                console.log('repeat', repeat[0]);
                repeat[0]['style'].display = 'none';
                               
                if (!args.data.AzaIsPere) {
                    let title = document.getElementsByClassName('e-subject-container');
                    let subTitle =  document.getElementsByClassName('e-location-container');
                    let Debut =  document.getElementsByClassName('e-start-container');
                    let fin=  document.getElementsByClassName('e-end-container');
                    let regie =  document.getElementsByClassName('e-resources');
                    console.log('repeat', title[0]);
                    console.log('repeat', subTitle[0]);
                    title[0]['style'].display = 'none';
                    subTitle[0]['style'].display = 'none';
                    Debut[0]['style'].display = 'none';
                    fin[0]['style'].display = 'none';
                    regie[0]['style'].display = 'none';

                    console.log(title[0]['style'].display, "sssssssssssssssssssssssssssssssssssssss")  
                  
             }




            }
            console.log('Open Editor');
            let inputEle: HTMLInputElement;
            let container: HTMLElement;
            let containerOperateur = document.getElementsByClassName('custom-field-container');
            
            let annuler = document.getElementsByClassName("e-event-cancel")
            console.log(annuler);
            annuler[0].addEventListener('click', () => {
                this.zoom = true
                console.log('click annuler ', this.zoom)
                 });


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
                 
                    let title = document.getElementsByClassName('e-subject-container');
                    let subTitle =  document.getElementsByClassName('e-location-container');
                    let Debut =  document.getElementsByClassName('e-start-container');
                    let fin=  document.getElementsByClassName('e-end-container');
                    let regie =  document.getElementsByClassName('e-resources');
                    console.log('repeat', title[0]);
                    console.log('repeat', subTitle[0]);
                    title[0]['style'].display = 'block';
                    subTitle[0]['style'].display = 'block';
                    Debut[0]['style'].display = 'block';
                    fin[0]['style'].display = 'block';
                    regie[0]['style'].display = 'block';
                    console.log(title[0]['style'].display, "sssssssssssssssssssssssssssssssssssssss")
                } else { // dblclick workorder
                    containerOperateur[0].parentNode.removeChild(containerOperateur[0]);
                    console.log("edit click")
                     if (!args.data.AzaIsPere) {
                        let title = document.getElementsByClassName('e-subject-container');
                        let subTitle =  document.getElementsByClassName('e-location-container');
                        let Debut =  document.getElementsByClassName('e-start-container');
                        let fin=  document.getElementsByClassName('e-end-container');
                        let regie =  document.getElementsByClassName('e-resources');
                        console.log('repeat', title[0]);
                        console.log('repeat', subTitle[0]);
                        title[0]['style'].display = 'none';
                        subTitle[0]['style'].display = 'none';
                        Debut[0]['style'].display = 'none';
                        fin[0]['style'].display = 'none';
                        regie[0]['style'].display = 'none';
    
                        console.log(title[0]['style'].display, "sssssssssssssssssssssssssssssssssssssss")  
                 }
                 }
            } else {
                                if(  args.name === 'popupOpen') 
       
                {
                 let title = document.getElementsByClassName('e-subject-container');
                 let subTitle =  document.getElementsByClassName('e-location-container');
                 let Debut =  document.getElementsByClassName('e-start-container');
                 let fin=  document.getElementsByClassName('e-end-container');
                 let regie =  document.getElementsByClassName('e-resources');
               
                 title[0]['style'].display = 'block';
                 subTitle[0]['style'].display = 'block';
                 Debut[0]['style'].display = 'block';
                 fin[0]['style'].display = 'block';
                 regie[0]['style'].display = 'block';
                 console.log('title', title[0]);
                 console.log('subtitle', subTitle[0]);
                }


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
                        libchaine: filteredData[0].libchaine,
                        typetravail:filteredData[0].typetravail,
                        titreoeuvre:filteredData[0].titreoeuvre,
                        numepisode:filteredData[0].numepisode,
                        dureecommerciale:filteredData[0].dureecommerciale,
                        Commentaire_Planning: filteredData[0].Commentaire_Planning,
                        libtypeWO:filteredData[0].libtypeWO,

                    };
                    this.scheduleObj.eventSettings.tooltipTemplate = this.temp;
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
                        console.log('containerSelected => ', containerSelected);
                        const filteredDataW =
                            treeviewData.filter((item: any) => item.Id === parseInt(event.draggedNodeData.id as string, 10));
                        let container = this.allDataContainers.filter(item => item.Id_Planning_Container === containerSelected.Id);
                        let containerDataSelected = container[0];
                        console.log('container => ', container);
                        console.log('containerDataSelected => ', containerDataSelected);
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
                            AzaNumGroupe: containerDataSelected.Id_Planning_Container,
                            coordinateurCreate: this.user.initials,
                            Operateur: '',
                            Statut:filteredDataW[0].Statut,
                            libchaine: filteredDataW[0].libchaine,
                            typetravail:filteredDataW[0].typetravail,
                            titreoeuvre:filteredDataW[0].titreoeuvre,
                            numepisode:filteredDataW[0].numepisode,
                            dureecommerciale:filteredDataW[0].dureecommerciale,
                            libtypeWO:filteredDataW[0].libtypeWO,
                            Commentaire_Planning: filteredDataW[0].Commentaire_Planning
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
    onActionBegin(event: ActionEventArgs): void {
        this.containerParent = {};
        console.log('onActionBegin()');
        console.log(event);
        console.log(this.isTreeItemDropped);
      
        // if (event.requestType === 'eventChange' && !event.data.AzaIsPere) {
        //     console.log('is not pere');
        // }

    
     
     
        if (event.requestType === 'eventChange') {
             this.zoom = true

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

    checkDiffExistByGroupe(object: any, arrayObject: Object[], objectAttribute, arrayItemAttribute) {}

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
        if(e.requestType === 'eventChanged') {
            if (e.data.AzaIsPere || (!e.data.AzaIsPere && this.isTreeItemDropped)) {
              console.log("************************************************* onaction complete : update container");
              this.updateContainer(e);
            }
            else
            {
                if (!e.data.AzaIsPere){
                console.log("************************************************* onaction complete : update WorkOrder");
                this.updateWorkOrder(e)
             }
            }


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
            // this.eventSettings = { // Réinitialise les events affichés dans le scheduler
            //     dataSource: <Object[]>extend(
            //         [], this.calculDateAll(this.timelineResourceDataOut, false, null, false, false), null, true
            //     ),
            //     enableTooltip: true, tooltipTemplate: this.temp
            // };
        } else if (this.deleteContainerAction) {
            console.log('delete container without call calcul function');
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
 public ajoutMonteur
 public monteurListArray
 public countAdd : number  = 0
    onSelect(value) {
    let monteurListArray;
    let fieldMonteur
        for (let i = 0; i < this.monteurListe.length; i++) {
            if (value === this.monteurListe[i].Username  ) {

                fieldMonteur = this.fieldMonteur['dataSource'].concat(this.fieldMonteur['dataSource'].unshift( this.monteurListe[i])) //pour l'affichage dans le treeview
                fieldMonteur.pop()

        
                this.monteurDataSource.unshift(this.monteurListe[i])
                console.log('monteurDataSource',this.monteurDataSource);
           
                for(let i = 0 ; i<this.monteurDataSource.length ; i++)
                {
                    if(this.monteurDataSource[i] === this.monteurDataSource[i+1] ){
                    delete this.monteurDataSource[i]
                   
                }
            
            
            
            }
                monteurListArray =  this.monteurDataSource

              console.log('monteurListArray',monteurListArray);
              
                
                this.ajoutMonteur = this.monteurListe[i]
                this.monteurListArray = monteurListArray
                console.log('monteurListArray', this.monteurListArray);
                this.filtermonteurListeArray = monteurListArray;
                console.log('filtermonteurListeArray', this.filtermonteurListeArray);
                console.log(  this.fieldMonteur);
                this.addMonteur = true;


                this.fieldMonteur['dataSource'] = monteurListArray
                  this.fieldMonteur = { dataSource:fieldMonteur , text: 'Username' };
                  this.countAdd = this.countAdd +1
                 
            }
        }

    }
    onSelectPlannig(value){
     
    let codeGoupe

    this.timelineResourceDataOut = [];
    this.allDataContainers = [];
    this.allDataWorkorders = [];
    this.salleDataSource = [];
    this.departmentDataSource = [];
    this.departmentGroupDataSource = [];
        this.isnotMyGroup = true
        this.scheduleObj.readonly = true
        this.libGroupe.map(group =>{
            if(value === group.Libelle){
                codeGoupe = group.Code
          
        }
        })
      

        
        let startofDay = moment().toDate()
        let endofDay = moment().add(1, 'd').toDate();
        this.getSalleByGroup(codeGoupe, startofDay, endofDay);
      
        this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut;
       if(value==="Mon planning"){
        this.isnotMyGroup = false
        this.scheduleObj.readonly = false
        this.departmentDataSource = [];
        this.departmentGroupDataSource = [];

        let startofDay = moment().toDate()
        let endofDay = moment().add(1, 'd').toDate();
  
        this.coordinateurService.getAllCoordinateurs()
          .subscribe(data => {
              console.log('all coordinateurs : ', data);
              data.forEach(item => {
                  if (item.Username === this.user.shortUserName) {
                   
                        console.log('COORDINATEUR => ', item);
                        this.getSalleByGroup(item.Groupe, startofDay, endofDay);
                        this.getMonteursByGroup(item.Groupe);
                        this.getWorkOrderByidGroup(item.Groupe);
                        this.getAllMonteurs(item.Groupe);
                        this.currentCoordinateur = item;
                        
                   
                }
              });
        });
        this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut;
        this.scheduleObj.refresh();
       }
    }

    backTomyPlanning(){
        this.isnotMyGroup = false
        this.scheduleObj.readonly = false
        
        this.departmentDataSource = [];
        this.departmentGroupDataSource = [];

        let startofDay = moment().toDate()
        let endofDay = moment().add(1, 'd').toDate();
  
        this.coordinateurService.getAllCoordinateurs()
          .subscribe(data => {
              console.log('all coordinateurs : ', data);
              data.forEach(item => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
                  if (item.Username === this.user.shortUserName) {
                   
                        console.log('COORDINATEUR => ', item);
                        this.getSalleByGroup(item.Groupe, startofDay, endofDay);
                        this.getMonteursByGroup(item.Groupe);
                        this.getWorkOrderByidGroup(item.Groupe);
                        this.getAllMonteurs(item.Groupe);
                        this.currentCoordinateur = item;
                        
                   
                }
              });
        });
        this.scheduleObj.eventSettings.dataSource = this.timelineResourceDataOut;
        this.scheduleObj.refresh();
    }

    getColor(value, codeGroup) {
        if (value && codeGroup != this.groupeCharger ) {
            for (let i = 0; i < this.monteurListe.length; i++) {
                if (value === this.monteurListe[i].Username) {
                    return '#17aab2';
                }
            }
    }
}

    getBackgroundColor(value, codeGroup) {
        if (value && codeGroup != this.groupeCharger ) {
            for (let i = 0; i < this.monteurListe.length; i++) {
                if (value === this.monteurListe[i].Username) {
                    return 'rgba(23, 170, 178, 0.1)';
                }
            }
        }
    }

/**************************************************************** Filter Monteur  ******************************************************************/


/********** Filter Monteur  *********/

    onFilter(searchText: string, tabIndex) {

       
        if (tabIndex == 1) {

            if (!searchText  ) {
                
                console.log('searchText', typeof searchText, searchText);
              
                this.treeObjMonteur.fields['dataSource'] = this.fieldMonteur['dataSource'];
        console.log("!!!!!!!!!!!!!!!!!!!!searchText",this.treeObjMonteur.fields['dataSource'] )
           if(this.isDelete){
         
             for(let i = 0 ; i<this.monteurListArray.length ; i++)
             {
                 if(this.monteurListArray[i] ===this.elementDelete ){
                 delete this.monteurListArray[i]
                
             }
             this.filtermonteurListeArray =  this.monteurListArray
    
         
         }

            }

            if(this.dataMonteur.length == 0){
             
                this.dataMonteur =   this.filtermonteurListeArray.filter(monteurs => {
                    return monteurs.Username.toLowerCase().includes(searchText.toLowerCase())
                     // || monteurs.libelletype.toLowerCase().includes(searchText.toLowerCase())
                    // || monteurs.libellecategorie.toLowerCase().includes(searchText.toLowerCase());;
               
                });
                console.log( this.dataMonteur )
            }
            }
                         
            
      
         
       

    
       if(!this.isDelete){
            if (!this.addMonteur) {
                this.dataMonteur = this.monteurDataSource.filter(monteurs => {
                    return monteurs.Username.toLowerCase().includes(searchText.toLowerCase())
                    // || monteurs.libelletype.toLowerCase().includes(searchText.toLowerCase())
                    // || monteurs.libellecategorie.toLowerCase().includes(searchText.toLowerCase());
                });
            } 
            else
             {
                this.dataMonteur =   this.filtermonteurListeArray.filter(monteurs => {
                    return monteurs.Username.toLowerCase().includes(searchText.toLowerCase())
                     // || monteurs.libelletype.toLowerCase().includes(searchText.toLowerCase())
                    // || monteurs.libellecategorie.toLowerCase().includes(searchText.toLowerCase());;
               
                });

               
                console.log('this.dataMonteur', this.dataMonteur);
                console.log('dataMonteur', this.fieldArrayMonteur);
             
            }

        } else {

            this.dataMonteur = this.filtermonteurListeArray.filter(monteurs => {
                return monteurs.Username.toLowerCase().includes(searchText.toLowerCase())
                // || monteurs.libelletype.toLowerCase().includes(searchText.toLowerCase())
                // || monteurs.libellecategorie.toLowerCase().includes(searchText.toLowerCase());;

              
              
            });
          
            console.log('dataMonteur', this.dataMonteur);
        }
            console.log('monteurListArray', this.monteurListArray);
            this.fieldMonteur['dataSource'] = this.dataMonteur;
            this.treeObjMonteur.fields['dataSource'] = this.fieldMonteur['dataSource']
            console.log('monteur datasource', this.monteurDataSource)
            console.log('filteredData', this.fieldMonteur);
            console.log('filteredData', this.dataMonteur);
            console.log(tabIndex);
         
    
        }
     

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
                            || WorkOrder.libchaine.toLowerCase().includes(searchText.toLowerCase())
                            || WorkOrder.typetravail.toLowerCase().includes(searchText.toLowerCase())
                            || WorkOrder.titreoeuvre.toLowerCase().includes(searchText.toLowerCase())  ;
                    });
                } else {
                    this.data = this.newField.filter(WorkOrder => {
                        return WorkOrder.Name.toLowerCase().includes(searchText.toLowerCase())
                            || WorkOrder.libchaine.toLowerCase().includes(searchText.toLowerCase())
                            || WorkOrder.typetravail.toLowerCase().includes(searchText.toLowerCase())
                            || WorkOrder.titreoeuvre.toLowerCase().includes(searchText.toLowerCase())  ;
                    });
                }
            } else {
                this.data = this.wOrderBackToBacklog.filter(WorkOrder => {
                    return WorkOrder.Name.toLowerCase().includes(searchText.toLowerCase())
                        || WorkOrder.libchaine.toLowerCase().includes(searchText.toLowerCase())
                        || WorkOrder.typetravail.toLowerCase().includes(searchText.toLowerCase())
                        || WorkOrder.titreoeuvre.toLowerCase().includes(searchText.toLowerCase())  ;                        
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
    public open
    
    btnClickSlide(){

        if(this.togglebtnslide.element.classList.contains('e-active')){
            // this.togglebtnslide.content = 'BackLog'
            this.open = false
            this.sidebar.hide();
            this.sidebar.position ='Right'
            this.sidebar.animate =false
            this.sidebar.locale = 'fr-CH'
          
            this.scheduleObj.refreshEvents()
        
        }
        else{
            // this.togglebtnslide.content = '';
            this.open = true
            this.sidebar.show();
            this.sidebar.position ='Right'
            this.sidebar.animate =false
            this.sidebar.locale = 'fr-CH'
            this.scheduleObj.refreshEvents()
        
           
        }
        console.log('slidebar',this.sidebar)
        console.log('button', this.togglebtnslide)
        console.log('scheduler element', this.scheduleObj)
        
    }

    /********************************** Remove Monteur *************************************/

    beforeopen(args: BeforeOpenCloseMenuEventArgs) {
        let targetNodeId: string = this.treeObjMonteur.selectedNodes[0];
        this.fieldMonteur['dataSource'].map(item => {
            if ( (item.codegroupe === this.currentCoordinateur.Groupe) ) {
                args.cancel = true;
                let targetNode: Element = document.querySelector(`[data-uid='${targetNodeId}']`);

                if (targetNode.classList.contains('remove')) {
                    this.contentmenutree.enableItems(['Supprimer'], true);
                }
            }
            this.monteurListe.map(itemliste => {
                if (targetNodeId == itemliste.CodeRessource.toString()) {
                    if(itemliste.codegroupe != 10){
                args.cancel = false;
                } }

            });
            
        });
       

    }
public elementDelete

    menuclick(args: MenuEventArgs) {
        let targetNodeId: string = this.treeObjMonteur.selectedNodes[0];
        for (let i = 0; i < this.monteurListe.length; i++) {
            let CodeRessource = this.monteurListe[i].CodeRessource;
            let CodeRessourceToString = CodeRessource.toString();
            if (CodeRessourceToString === targetNodeId) {
                if (args.item.text == 'Supprimer') {
                    this.treeObjMonteur.removeNodes([CodeRessourceToString]);
                   console.log('element supprimer',this.monteurListe[i]);
                   this.elementDelete = this.monteurListe[i]
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

      
        if (args.data.AzaIsPere ) {
                return;
             
        } else {

            this.colorStatut.forEach(statut =>{
                if(args.data.Statut === statut['Id'])
                {
                   couleur  = statut['Color']
                }
            })
            this.workOrderColor = couleur
           
              


            if (this.scheduleObj.currentView === 'MonthAgenda') {
                (args.element.firstChild as HTMLElement).style.borderLeftColor = this.workOrderColor;
                (args.element.firstChild as HTMLElement).style.marginLeft ='30px'
                args.element.style.borderLeftColor = this.workOrderColor;
                console.log('statut', args)
         
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
        // this.scheduleObj.dataBind();
        console.log(e.value)
   

    
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
    onChange(args: ChangeEventArgs): void {
   
    }
  


}