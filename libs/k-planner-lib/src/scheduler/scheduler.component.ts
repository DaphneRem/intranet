import { Component,  ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { App, User } from '../../../../apps/k-planner/src/app/+state/app.interfaces';

// Syncfusion Imports
// Synfucion Bases
import { extend, closest, remove, createElement, addClass, L10n, loadCldr, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DragAndDropEventArgs, BeforeOpenCloseMenuEventArgs, MenuEventArgs, Item } from '@syncfusion/ej2-navigations';
import { DropDownList } from '@syncfusion/ej2-dropdowns';

// Syncfusion Angular
import { ButtonComponent, ChangeEventArgs } from '@syncfusion/ej2-angular-buttons';
import { TabComponent,  SelectEventArgs, TreeViewComponent,  MenuItemModel, ContextMenuComponent } from '@syncfusion/ej2-angular-navigations';
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
    ActionBaseArgs
} from '@syncfusion/ej2-angular-schedule';

// Locale Data Imports
import { hospitalData, waitingList } from '../datasource';

// Models Imports
import { HospitalData } from '../models/hospital-data';
import { ContainerKP } from '../models/container';
import { Workorder } from '../models/workorder';

// Components Imports
import { WorkorderDetailsModalComponent } from '../workorder-details-modal/workorder-details-modal.component';
import { MonteursData } from '../models/monteurs-data';

// import { monteurs } from '../data/monteur';
import { element } from 'protractor';
import { SalleService } from '../services/salle.service';
import { ContainersService } from '../services/containers.service';
import { MonteursService } from '../services/monteurs.service';
import { renderComponentOrTemplate, text } from '@angular/core/src/render3/instructions';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { identifierModuleUrl } from '@angular/compiler';
import { dropDownBaseClasses } from '@syncfusion/ej2-angular-dropdowns';

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
        ContainersService,
        MonteursService,
        Store
    ]
})

export class SchedulerComponent implements OnInit {

    @ViewChild('scheduleObj')
    public scheduleObj: ScheduleComponent;
    @ViewChild('treeObj')
    public treeObj: TreeViewComponent;
    @ViewChild('treeObjMonteur')
    public treeObjMonteur: TreeViewComponent;
    @ViewChild('toggleBtn')
    public toggleBtn: ButtonComponent;
    @ViewChild('element')
    public tabInstance: TabComponent;
    @ViewChild ('contentmenutree') 
    public contentmenutree: ContextMenuComponent;





    /******** STORE *******/
    public user: User;

    /******** SCHEDULER INIT *******/
    public selectedDate: Date = new Date();
    public data: HospitalData[] = <HospitalData[]>extend([], hospitalData, null, true);
    public currentView: View = 'TimelineDay';
    public workHours: WorkHoursModel = { start: '08:00', end: '18:00' };
    public cssClass: string = 'custom';

    // BACKLOGS INIT
    public headerText: Object = [{ 'text': 'WorkOrder' }, { 'text': 'Operateur' }];
    public menuItems: MenuItemModel[] = [
        { text: 'Supprimer',
          iconCss: 'e-icons delete', }
    ];
    
    public monteurDataSource  : MonteursData[];
    public timelineResourceDataOut;
    public dataMonteur: MonteursData[] = <MonteursData[]>extend([], this.monteurDataSource, null, true);
    public field: Object = { dataSource: waitingList, id: 'Id', text: 'Name', description: 'Description' };
    public fieldMonteur: Object;
    public isClicked: boolean = false;
    public allowDragAndDrop: boolean = true;
    public isTreeItemDropped: boolean = false;
    public draggedItemId: string = '';

    public group: GroupModel = { enableCompactView: false, resources: ['Departments'] };
    public allowMultiple: Boolean = false;
    public filteredData: Object;

    public cancelObjectModal = false;
    public salleDataSource;
    public containersPlanning;
    public departmentDataSource: Object[] = [];
    public departmentDataSourceAll: Object[] = [];
    public departmentGroupDataSource: Object[] = [];
    allRegies :Object[]=[]
    public idExisting = [];
    public lastRandomId;
    public fieldArray= this.field['dataSource']

    // Editor
    public drowDownMonteurs;

    // EDIT EVENT CONFIG
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
    public drowDownOperateurList;

    public monteurListe: MonteursData[] = [];

    constructor(
        public dialog: MatDialog,
        private salleService: SalleService,
        private containersService: ContainersService,
        private monteursService: MonteursService,
        private store: Store<App>
        ) {}

    ngOnInit() {
        console.log(this.eventSettings);
        this.storeAppSubscription();
        console.log(this.store);
        console.log(this.scheduleObj);
        this.getSalle();
        this.getMonteur();
        this.getAllContainer();
        this.getContainersByRessource(118);
        console.log(this.selectedDate);
        this.getContainersByRessourceStartDateEndDate(118, this.selectedDate, this.selectedDate);
    }

    storeAppSubscription() {
        this.store.subscribe(data => {
            console.log(data);
            this.user = data['app'].user;
            console.log(this.user);
        });
    }



    onEventClick(ActionEventArgs) {
        console.log('event clicked !!!!!!!!!!!');
    }

/******************************* API REQUEST *****************************/ 
    getSalle() {

        if(this.isClicked){
          
            this.toggleBtn.iconCss='e-play-icon'
            this.salleService
            .getSalle()
            .subscribe(donnees => {
                this.salleDataSource = donnees;
                this.salleDataSource.map(item => {
              if(item.codegroupe != 3){
                    this.departmentDataSourceAll.push({
                        Text: item.NomSalle,
                        Id: item.CodeSalle,
                        Color:'#f9920b'
                    });
                }
                    // console.log('regie', this.departmentDataSource)
                });
         console.log(' this.departmentDataSourceAll', this.departmentDataSourceAll)
         this.allRegies=this.departmentGroupDataSource.concat(this.departmentDataSourceAll)
         console.log(' this.allRegies', this.allRegies)
         this.departmentDataSource= this.allRegies
         console.log(' this.departmentDataSource', this.departmentDataSource)
            });
            
           
     
     
     
        } 
            if(!this.isClicked){
                this.toggleBtn.content='Voir autres Régies'
            this.salleService
                .getGroupSalle(3)
                .subscribe(donnees => {
                    this.salleDataSource = donnees;
                    console.log('donee', donnees);
                    this.salleDataSource.map(item => {
                        this.departmentGroupDataSource.push({

                            Text: item.NomSalle,
                            Id: item.CodeSalle,

                        })
                       
                    })
                
                }
                )

                this.departmentDataSource=this.departmentGroupDataSource
                
                console.log('regie departmentDataSource', this.departmentGroupDataSource);
         
      
            }
         


    }
    codegroupe
    getMonteur() {
        let monteurDataSource
        this.monteursService
            .getMonteur()
            .subscribe(donnees => {
                monteurDataSource = donnees;
                monteurDataSource.map(item => {
                    if (item.codegroupe !== 3) {

                        this.monteurListe.push(item)
                         this.codegroupe= item.codegroupe
                    }
                })

             
            });

        this.monteursService
            .getGroupMonteur(3)
            .subscribe(donnees => {
                console.log('donnees', donnees)
                this.monteurDataSource = donnees;
                
                   
                this.fieldMonteur = {
                    dataSource: this.monteurDataSource,
                    id: 'CodeRessource',
                    text: 'Username'
                }

            
    
         
         
        })
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

    getContainersByRessourceStartDateEndDate(coderessource, datedebut, datefin) {
        let debut = datedebut.toISOString()
        let fin = datefin.toISOString()
        this.containersService
            .getContainersByRessourceStartDateEndDate(coderessource, debut, fin)
            .subscribe( data => {
                console.log('container by ressource, startDate and endDate');
            });
    }


/*************************************************************************/
/*************************** UTILITY FUNCTIONS ***************************/
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

    onPopupOpen(args) { // open container modal and display workorder list
        let workOrders = [];
        console.log(args);
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
                    row.innerHTML += `<div id='id${i}' style='background-color: #000000;'>${workOrders[i].Name}</div>`;
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
            console.log('cell click');
        }
        if ((args.type === 'Editor') && (args.data.hasOwnProperty('AzaIsPere')) ) {
            console.log('Editor');
            console.log(args.data.Operateur);
            // if (!args.data.hasOwnProperty('Operateur')) {
            //     console.log('args.data.Operateur not wet Exist');
            //     args.data['Operateur'] = '';
            // }
           if (!args.element.querySelector('.custom-field-row')) { // dblclick container
            console.log('FIRST CALL TO EDITOR : DROWDOWNLIST CREATION');
                let row: HTMLElement = createElement('div', { className: 'custom-field-row' });
                let formElement: HTMLElement = <HTMLElement>args.element.querySelector('.e-schedule-form');
                formElement.firstChild.insertBefore(row, args.element.querySelector('.e-resources-row'));
                let container: HTMLElement = createElement('div', { className: 'custom-field-container' });
                let inputEle: HTMLInputElement = createElement('input', {
                    className: 'e-field', attrs: { name: 'Operateur' }
                }) as HTMLInputElement;
                container.appendChild(inputEle);
                row.appendChild(container);

                this.drowDownMonteurs = this.monteurDataSource.map(item => {
                    return { text: item.Username, value: item.CodeRessource };
                });
                console.log(this.drowDownMonteurs);
                this.drowDownMonteurs.unshift({ text: 'Aucun Opérateur', value: 0});
                this.drowDownOperateurList = new DropDownList({
                    dataSource: this.drowDownMonteurs,
                    fields: { text: 'text', value: 'text' },
                    value: args.data.Operateur,
                    floatLabelType: 'Always', placeholder: 'Opérateur'
                });
                console.log(this.drowDownOperateurList);
                console.log(this.drowDownOperateurList.value);
                console.log(args);
                console.log(args);
                this.drowDownOperateurList.appendTo(inputEle);
                inputEle.setAttribute('name', 'Operateur');
                console.log(inputEle);
                console.log(args.data.Operateur);
                args.data.Operateur = this.drowDownOperateurList.value;
            } else {
                this.drowDownOperateurList.value = args.data.Operateur;
                console.log('-------------------------> else : ', this.drowDownOperateurList.value);
            }
            // console.log(this.drowDownOperateurList);
            // console.log(this.drowDownOperateurList.value);
            // console.log(args);
            // if ('Operateur' in args.data) {
            //     console.log('If : args.data.Operateur');
            //     args.data.Operateur = this.drowDownOperateurList['typedString'];
            // } else {
            //     console.log('ELSE : args.data.Operateur');
            //     args.data['Operateur'] = this.drowDownOperateurList['typedString'];
            // }
            // console.log(args);
        }
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
                regie: category
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
                    };
                    this.timelineResourceDataOut.push(containerData);
                    this.timelineResourceDataOut.push(eventData);
                    this.scheduleObj.openEditor(containerData, 'Add', true);
                    this.isTreeItemDropped = true;
                    this.draggedItemId = event.draggedNodeData.id as string;
                    let newData = this.field['dataSource'].filter(item => {
                            if (+item.Id !== +this.draggedItemId) {
                                return item;
                            }
                        }
                    );
                    this.field['dataSource'] = newData;
                    this.treeObj.fields.dataSource = this.field['dataSource'];
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
                            Operateur: ''
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
                    this.timelineResourceDataOut.push(containerData); // filteredData[0]
                    this.scheduleObj.openEditor(containerData, 'Add', true);
                    this.isTreeItemDropped = true;
                    this.draggedItemId = event.draggedNodeData.id as string;
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
                        this.draggedItemId = event.draggedNodeData.id as string;
                    } else { // Emplacement déjà pris par un event (container)
                        console.log(event);
                        let indexContainerEvent = this.findIndexEventById(event.target.id);
                        this.timelineResourceDataOut[indexContainerEvent]['Operateur'] = filteredData[0].Username;
                        this.isTreeItemDropped = true;
                        this.onActionComplete('e');
                    }
                }
            }
        }
    }

/*************************************************************************/

/*********************** ACTION BEGIN FUNCTION *********************/

    onActionBegin(event: ActionEventArgs): void {
        console.log('onActionBegin()');
        console.log(event);
        console.log(this.isTreeItemDropped);
        // if (event.requestType === 'eventChange' && event.data.AzaIsPere) {
        //     console.log('event change action');
        // }
        // if (event.requestType === 'eventChange' && !event.data.AzaIsPere) {
        //     console.log('is not pere');
        // }
        if (event.requestType === 'eventCreate') {
            console.log('eventCreate');
            console.log(event.requestType);
        }
        if (((event.requestType === 'eventCreate') || (event.requestType === 'eventCreated')) && !this.isTreeItemDropped) { 
            // CREATE CONTAINER ON CELL WITHOUT EVENT CLICK
            event.data[0]['AzaIsPere'] = true;
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
        } else { // CUSTOM FUNCTION
            console.log('customActionBegin()');
            this.customActionBegin(event);
        }
        // console.log('customActionBegin()');
        // this.customActionBegin(event);
    }

    customActionBegin(args: any) { // CUSTOM ACTION BEGIN
        if (args.requestType === 'eventRemove') { // CUSTOM ACTION REMOVE 
            this.deleteEvent(args);
        } else if ((args.requestType !== 'toolbarItemRendering') && (args.data['AzaIsPere'])) {
            let startDifferent = this.checkDiffExistById(args.data, this.timelineResourceDataOut, 'StartTime', 'StartTime');
            let endDifferent = this.checkDiffExistById(args.data, this.timelineResourceDataOut, 'EndTime', 'EndTime');
            this.timelineResourceDataOut = this.eventSettings.dataSource as Object[]; // refresh dataSource
            this.eventSettings = {
                dataSource: <Object[]>extend(
                    [], this.calculDateAll(this.timelineResourceDataOut, true, args.data, startDifferent, endDifferent), null, true

                )
            };
        } else if (args.requestType === 'eventCreate') { // ADD EMPTY CONTAINER
            let data = args.data[0];
            this.randomId();
            console.log('last Random id : ', this.lastRandomId);
            let containerData = { // DISPLAY DATA FOR CONTAINER
                Id: this.lastRandomId,
                Name: data.Name,
                StartTime: data.StartTime,
                EndTime: data.EndTime,
                IsAllDay: false,
                DepartmentID: data.DepartmentID,
                ConsultantID: data.DepartmentID,
                AzaIsPere: true,
                AzaNumGroupe: this.lastRandomId,
                coordinateurCreate: this.user.initials,
                Operateur: ''
            };
            this.timelineResourceDataOut.push(containerData);
            this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                dataSource: <Object[]>extend(
                    [], this.timelineResourceDataOut, null, true
                )
            };
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
            this.isTreeItemDropped = false;
            this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                dataSource: <Object[]>extend(
                    [], this.calculDateAll(this.timelineResourceDataOut, false, null, false, false), null, true
                )
            };
            this.treeObj.fields = this.field;
    }

    /************************ DELETE ********************/

    deleteEvent(args: any) {
        let data = args.data[0];
        if (data['AzaIsPere']) { // REMOVE CONTAINER
            this.timelineResourceDataOut.forEach(item => { // GARDER CETTE FONCTION POUR LA SUITE
                if ((+data.AzaNumGroupe === +item.AzaNumGroupe) && !item.AzaIsPere) {
                    if (!this.field['dataSource'].includes(item)) {
                       this.backToBacklog(item);
                    }
                }
            });
            this.timelineResourceDataOut = this.timelineResourceDataOut.filter(item => {
                if (+data.AzaNumGroupe !== +item.AzaNumGroupe) {
                    return item;
                }
            });
            this.eventSettings = {
                dataSource: <Object[]>extend(
                    [], this.timelineResourceDataOut, null, true
                )
            };
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
        };
        this.field['dataSource'].push(newWorkorderForList);
        let targetNodeId: string = this.treeObj.selectedNodes[0];
        let nodeId: string = 'tree_' + newWorkorderForList.Id;
        this.treeObj.addNodes([newWorkorderForList], targetNodeId, null); // TreeViewComponent
    }


    /************************ DATES CALCUL ********************/

    calculDateAll(
        atimelineResourceData: Object[], needUpdate: boolean, itemToUpdate: Object[], startDifferent: boolean, endDifferent: boolean
    ): Object[] {
        // CALL ONINT => this.calculDateAll(this.data, false, null, false, false )
        // CALL ONRESIZE => this.calculDateAll(this.timelineResourceDataOut, true, args.data, startDifferent, endDifferent), null, true;
        let groupe = [], i;
        for (i = 0; i < atimelineResourceData.length; i++) {
            if (!groupe.includes(atimelineResourceData[i]['AzaNumGroupe'])) {
                groupe.push(atimelineResourceData[i]['AzaNumGroupe']);
            }
        }
        groupe.forEach(item => {
            this.timelineResourceDataOut = this.calculDateGroup(atimelineResourceData, +item, needUpdate, itemToUpdate, startDifferent, endDifferent);
        });
        console.log('all AzaNumGroup present on planning :', groupe);
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
            console.log('min date for groupe', mindate.toISOString());
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
            console.log('ma date for groupe', maxDate.toISOString());
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
filtermonteurListeArray
addMonteur
    onSelect(value) {
    let monteurListArray 
        for (let i = 0; i < this.monteurListe.length; i++) {
         
                if (value === this.monteurListe[i].Username  ) {  
                  monteurListArray=this.fieldMonteur['dataSource'].concat(this.fieldMonteur['dataSource'].unshift( this.monteurListe[i]))
                  monteurListArray.pop()
                  this.fieldMonteur = { dataSource: monteurListArray , text: 'Username' };
                  console.log('monteurListArray',monteurListArray)   
         this.filtermonteurListeArray = monteurListArray
                console.log(  this.fieldMonteur)
                this.addMonteur=true
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


    getBorder(value) {
        if(value){
        for (let i = 0; i < this.monteurListe.length; i++) {
            if (value === this.monteurListe[i].Username) {
                return 'red 2px solid';
            }
        }
    }}
    
/********** Filter Monteur  *********/



    onFilter(searchText: string, tabIndex) {

        if (tabIndex == 1) {
            if (!searchText) {
                console.log('searchText', typeof searchText, searchText)

                this.treeObjMonteur.fields['dataSource'] = this.fieldMonteur['dataSource']
            }
            if(!this.addMonteur){
                this.dataMonteur = this.monteurDataSource.filter(monteurs => {
                    return monteurs.Username.toLowerCase().includes(searchText)
    
                })
    
            } else {
                this.dataMonteur = this.filtermonteurListeArray.filter(monteurs => {
                    return monteurs.Username.toLowerCase().includes(searchText)
    
                })
    
            }

           

            this.fieldMonteur['dataSource'] = this.dataMonteur;
            this.treeObjMonteur.fields['dataSource'] = this.fieldMonteur['dataSource']

            console.log('monteur datasource', this.monteurDataSource)
            console.log('filteredData', this.fieldMonteur);
            console.log('filteredData', this.dataMonteur);

            console.log(tabIndex);
        }
        if (tabIndex == 0) {

            this.data = this.fieldArray.filter(WorkOrder => {
                return WorkOrder.Name.toLowerCase().includes(searchText)
                    || WorkOrder.Description.toLowerCase().includes(searchText)
                


            })

            this.field['dataSource'] = this.data;
            this.treeObj.fields['dataSource'] = this.field['dataSource']

            console.log('fieldArray', this.fieldArray);
            console.log('field', this.field);
            console.log('Data', this.data);
        }



    }


/**************************************************** Add Regies ************************************************************ *********/


//  onRenderCell(args: RenderCellEventArgs) {
//     let btn;
//         if (args.elementType === 'emptyCells' && args.element.classList.contains('e-resource-left-td')) {
//             let target: HTMLElement = args.element.querySelector('.e-resource-text') as HTMLElement;
//             target.innerHTML =
//                 `  `;
        
//         }
//         // btn = document.getElementById('btn');
//         // btn.addEventListener('click', () => this.displayRegies());
//         // document.getElementById('btn').onclick = this.displayRegies
//     }
count:number=0

    displayRegies() {
   
        // this.isClicked = true;


        console.log('AllRegie', this.allRegies)
        this.isClicked = !this.isClicked
        console.log(this.isClicked, 'isclickeddddd');


        if (this.isClicked) {
            this.toggleBtn.content='Voir mes Régies  '
            if (this.count == 0 || this.allRegies.length == 0) {

                this.getSalle()

                this.count = this.count + 1
                console.log(this.count)
            }
            else {
                
                this.departmentDataSource = this.allRegies
                console.log('2eme click')
            }
        }
        else {

            this.toggleBtn.content='Voir autres Régies'
            this.departmentDataSource = this.departmentGroupDataSource
            console.log('faux')
        }
        
     
    }

    /*******************************************************Remove Monteur *********************************************************************/

    beforeopen(args: BeforeOpenCloseMenuEventArgs) {
      
        let targetNodeId: string = this.treeObjMonteur.selectedNodes[0];
        this.fieldMonteur['dataSource'].map(item => {
        
            if ( (item.codegroupe === 3) ) {
                args.cancel = true;
                let targetNode: Element = document.querySelector('[data-uid='' + item.CodeRessource + '']');
                  console.log('targetNode',targetNode)
                if (targetNode.classList.contains('remove')) {
                    this.contentmenutree.enableItems(['Supprimer'], true);
                }
            } 
                this.monteurListe.map(item=>{
                    if(targetNodeId == item.CodeRessource.toString()){
                  
                    args.cancel = false;
                   }
                })
                      
        })

        console.log('args', args)
        console.log('targetNodeId', targetNodeId)

    }

    menuclick(args: MenuEventArgs) {


        let targetNodeId: string = this.treeObjMonteur.selectedNodes[0];
        for (let i = 0; i < this.monteurListe.length; i++) {
            let CodeRessource = this.monteurListe[i].CodeRessource;
            let CodeRessourceToString = CodeRessource.toString()

            if (CodeRessourceToString === targetNodeId) {
                if (args.item.text == 'Supprimer') {
                    this.treeObjMonteur.removeNodes([CodeRessourceToString]);
                    //  this.monteurDataSource= this.treeObjMonteur['groupedData']
               
                }
                console.log( this.treeObjMonteur)
            }  
           
        }
       
        this.fieldArray= this.treeObjMonteur['groupedData'] 
        
   
        this.fieldMonteur['dataSource']=this.fieldArray[0]

    
        console.log( this.fieldArray[0])
        console.log( this.monteurDataSource,'fieldMonteur')
    }
    // onRenderCell(args: RenderCellEventArgs): void {
    //     let btn;
    //     let that = this;
    //     if (args.elementType === 'emptyCells' && args.element.classList.contains('e-resource-left-td')) {
    //         let target: HTMLElement = args.element.querySelector('.e-resource-text') as HTMLElement;
    //         target.innerHTML =
    //             `<input  type='button' id='btn' value='Voir Autres Régies'
    //             class='btn btn-inverse btn-outline-inverse regie' style='padding:0;
    //             border:none' iconCss='e-btn-sb-icons e-play-icon'>  `;
    //     }

    //     btn = document.getElementById('btn');
    //     btn.addEventListener('click', (e: Event) => this.displayRegies());
    //     // document.getElementById('btn').onclick = this.displayRegies
    // }

    // displayRegies() {
    //     this.isClicked = true;
    //     console.log(this.isClicked, 'isclickeddddd');
    // }

}




