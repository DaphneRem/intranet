import { Component,  ViewChild, OnInit } from '@angular/core';
import { extend, closest, remove, createElement, addClass, L10n, loadCldr } from '@syncfusion/ej2-base';
import { hospitalData, waitingList } from '../datasource';
import { HospitalData } from '../models/hospital-data';
import { TabComponent,  SelectEventArgs } from '@syncfusion/ej2-angular-navigations';

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
} from '@syncfusion/ej2-angular-schedule';
import { DragAndDropEventArgs } from '@syncfusion/ej2-navigations';
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
import { MatDialog } from '@angular/material';

import { WorkorderDetailsModalComponent } from '../workorder-details-modal/workorder-details-modal.component';
import { MonteursData } from '../models/monteurs-data';
import { monteurs } from '../data/monteur';
import { ButtonComponent } from '@syncfusion/ej2-angular-buttons';
import { element } from 'protractor';
import { SalleService } from '../services/salle.service';
import { PlanningContainersService } from '../services/planningContainers.service';
import { MonteursService } from '../services/monteurs.service';
import { renderComponentOrTemplate, text } from '@angular/core/src/render3/instructions';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';
import { identifierModuleUrl } from '@angular/compiler';

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
        PlanningContainersService,
        MonteursService
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

    /******** SCHEDULER INIT *******/
    public selectedDate: Date = new Date();
    //   public selectedDate: Date =new Date(2018, 7, 1);
    public monteurDataSource
    public data: HospitalData[] = <HospitalData[]>extend([], hospitalData, null, true);
    public dataMonteur: MonteursData[] = <MonteursData[]>extend([], this.monteurDataSource, null, true);
    public currentView: View = 'TimelineDay';
    public workHours: WorkHoursModel = { start: '08:00', end: '18:00' };
    public cssClass: string = 'custom';
    // ROWS INIT
  

    // BACKLOG INIT
    public headerText: Object = [{ 'text': 'WorkOrder' }, { 'text': 'Operateur' }];

    public isTreeItemDropped: boolean = false;
    public draggedItemId: string = '';
    public timelineResourceDataOut;

    public group: GroupModel = { enableCompactView: false, resources: ['Departments'] };
    public allowMultiple: Boolean = false;
    public filteredData: Object;

    public field: Object = { dataSource: waitingList, id: 'Id', text: 'Name', description: 'Description' };
    public fieldMonteur: Object 

    public allowDragAndDrop: boolean = true;
    public cancelObjectModal = false;
 public salleDataSource
 public containersPlanning

 public departmentDataSource: Object[] = [];
    // EDIT EVENT CONFIG
    public eventSettings: EventSettingsModel = {
        dataSource: <Object[]>extend([], this.calculDateAll(this.data, false, null, false, false), null, true),
        fields: {
            subject: { title: 'Patient Name', name: 'Name' },
            startTime: { title: 'From', name: 'StartTime' },
            endTime: { title: 'To', name: 'EndTime' },
            description: { title: 'description', name: 'Description' }
        }
    };
  

    constructor(public dialog: MatDialog, 
        private salleService:SalleService,
        private planningContainersService:PlanningContainersService,
        private monteursService:MonteursService,
        ) {}
    ngOnInit() {
        console.log(this.scheduleObj);
        this.getSalle();
        this.getMonteur();
        this.getContainer()
    }
   

    getSalle(){
       this.salleService
       .getSalle()
       .subscribe(donnees=> {
            this.salleDataSource = donnees;
            this.salleDataSource.map(item=>{
                this.departmentDataSource.push({

                   Text:item.NomSalle,
                   Id:item.CodeSalle,
                    
                })
            })
            
            console.log("regie",this.departmentDataSource)
            })
      
    }
    fieldMonteurArray: object[]=[]
    getMonteur(){
        this.monteursService
        .getMonteur()
        .subscribe(donnees=> {

            this.monteurDataSource = donnees
            this.fieldMonteur={
                dataSource:this.monteurDataSource,
                id: 'CodeRessource',
                text:'Username'
            }
       
            console.log("fieldmonteur:",  this.fieldMonteur)

        })




            console.log("monteur:",  this.monteurDataSource)
        }
           
            
           
    
    getContainer(){
        this.planningContainersService
        .getPlanningContainers()
        .subscribe(donnees=> {
             this.containersPlanning = donnees;
             console.log("container",this.containersPlanning)
             })
       
     }

    onPopupOpen(args) { // open container modal and display workorder list
        console.log(this.timelineResourceDataOut);
        let workOrders = [];
        args.element.hidden = false;
        console.log(args.type);
        console.log(args);
        if (this.cancelObjectModal) {
            args.cancel = true;
        }
        if (args.data.hasOwnProperty('AzaIsPere') && args.type !== 'Editor') {
            if (args.data.AzaIsPere) {
                console.log('is PERE');
                console.log(this.data);
                console.log(this.timelineResourceDataOut);
                this.timelineResourceDataOut.map(item => {
                    if (item.AzaNumGroupe === args.data.AzaNumGroupe && item.AzaIsPere === false) {
                        workOrders.push(item);
                    }
                });
                console.log(workOrders);
                let row: HTMLElement = createElement('div', {
                    className: 'e-sub-object-list'
                });
                console.log(row);
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
                    row.innerHTML += `<div id='id${i}' style='background-color: ${colorRegie};'>${workOrders[i].Name}</div>`;
                    console.log(i);
                    console.log(row.children[i]);
                }
                for (let e = 0; e < workOrders.length; e++) {
                    let child = document.getElementById(`id${e}`);
                    child.addEventListener('click', () => {
                        console.log('id' + e);
                        console.log(args.cancel);
                        args.cancel = true;
                        console.log('args', args);
                        args.element.hidden = true;

                        this.openDialog(args, args.data, workOrders[e], this.departmentDataSource);

                    });
                }
            }
        }
        if (args.data.name === 'cellClick') {
            console.log('cell click');
        }
    }

    openDialog(args, object, subObject, categories): void { // open workorder modal from container list
        let containerModal = document.getElementsByClassName('cdk-overlay-container');
        console.log(containerModal);
        for (let i = 0; i < containerModal.length; i++) {
            containerModal[i].classList.remove('hidden');
        }
        let category;
        categories.map(item => {
            if (object.DepartmentID === item.Id) {
                category = item;
            }

        });
        console.log(categories);
        console.log('category', category);
        const dialogRef = this.dialog.open(WorkorderDetailsModalComponent, {
            width: '365px',
            data: {
                workorder: subObject,
                regie: category
            }
        });
        console.log('openDialogSubObject function');
        console.log(this.cancelObjectModal);
    }

    /****************** DRAG AND DROP  ******************/

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

    onTreeDragStop(event: DragAndDropEventArgs): void {
        let treeElement = closest(event.target, '.e-treeview');
        if (!treeElement) {
            event.cancel = true;
            let scheduleElement: Element = <Element>closest(event.target, '.e-content-wrap');
            if (scheduleElement) { // IF EMPLACEMENT EST VIDE
                let treeviewData: { [key: string]: Object }[] =
                    this.treeObj.fields.dataSource as { [key: string]: Object }[];
                console.log(treeviewData);
                console.log(event);
                console.log(event.draggedNodeData.id);
                if (event.target.classList.contains('e-work-cells')) {
                    const filteredData: { [key: string]: Object }[] =
                        treeviewData.filter((item: any) => item.Id === parseInt(event.draggedNodeData.id as string, 10));
                    console.log('filtered data ___________________');
                    console.log(filteredData);
                    let cellData: CellClickEventArgs = this.scheduleObj.getCellDetails(event.target);
                    let resourceDetails: ResourceDetails = this.scheduleObj.getResourcesByIndex(cellData.groupIndex);
                    let containerData = { // DISPLAY DATA FOR CONTAINER
                        Id: filteredData[0].Id,
                        Name: 'Title',
                        StartTime: cellData.startTime,
                        EndTime: cellData.endTime,
                        IsAllDay: false,
                        DepartmentID: resourceDetails.resourceData.Id,
                        ConsultantID: resourceDetails.resourceData.Id,
                        AzaIsPere: true,
                        AzaNumGroupe: filteredData[0].AzaNumGroupe,
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
                        AzaNumGroupe: filteredData[0].AzaNumGroupe
                    };
                    this.timelineResourceDataOut.push(containerData);
                    this.timelineResourceDataOut.push(eventData);
                    this.scheduleObj.openEditor(containerData, 'Add', true);
                    this.isTreeItemDropped = true;
                    this.draggedItemId = event.draggedNodeData.id as string;
                    console.log(this.draggedItemId);
                    let newData = this.field['dataSource'].filter(item => {
                            if (+item.Id !== +this.draggedItemId) {
                                return item;
                            }
                        }
                    );
                    console.log(newData);
                    this.field['dataSource'] = newData;
                    this.treeObj.fields.dataSource = this.field['dataSource'];
                    console.log(this.field['dataSource']);
                    console.log(this.data);
                } else {  // IF EMPLACEMENT EST DEJA PRIS PAR UN CONTENEUR
                    console.log('event.target.classList.contains(\'e-work-cells\') ====> FALSE');
                    if (event.target.id) {
                        console.log(event.target.id);
                        console.log(this.timelineResourceDataOut);
                        let indexContainerEvent = this.findIndexEventById(event.target.id);
                        let containerSelected = this.timelineResourceDataOut[indexContainerEvent];
                        console.log(indexContainerEvent);
                        console.log(containerSelected);
                        const filteredDataW =
                            treeviewData.filter((item: any) => item.Id === parseInt(event.draggedNodeData.id as string, 10));
                        console.log(filteredDataW);
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
                            AzaNumGroupe: containerSelected.AzaNumGroupe
                        };
                        this.timelineResourceDataOut.push(newEventData);
                        console.log(this.timelineResourceDataOut);
                        // this.scheduleObj.openEditor(newEventData, 'Add', true);
                        this.isTreeItemDropped = true;
                        this.draggedItemId = event.draggedNodeData.id as string;
                            let nData = this.field['dataSource'].filter(item => {
                                if (+item.Id !== +this.draggedItemId) {
                                    return item;
                                }
                            }
                        );
                        console.log(nData);
                        this.field['dataSource'] = nData;
                        this.treeObj.fields.dataSource = this.field['dataSource'];
                        console.log(this.field['dataSource']);
                        console.log(this.data);
                        this.onActionComplete('e');
                    }
                }
            }
        }
    }


    /********************************* DRAG AND DROP MONTEUR************** */

    findIndexEventById(id) {
        let selectedEvent;
        let indexEvent;
        this.timelineResourceDataOut.forEach(item => {
            if ((item.Id === +id) && (item.AzaIsPere)) {
                console.log(item);
                selectedEvent = item;
                indexEvent = this.timelineResourceDataOut.indexOf(item);
            }
        });
        return indexEvent;
    }
    onTreeDragStopMonteur(event: DragAndDropEventArgs): void {
        console.log(event);
        console.log(event.event.timeStamp);
        console.log(event.target);
        console.log(this.treeObjMonteur);
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
                console.log(treeviewData);
                console.log(event);
                console.log(event.draggedNodeData.id);
                console.log(this.timelineResourceDataOut);
                const filteredData: { [key: string]: Object }[] =
                    treeviewData.filter((item: any) => item.CodeRessource === parseInt(event.draggedNodeData.id as string, 10));
                if (event.target.classList.contains('e-work-cells')) {
                    console.log('emplacement libre');

                    console.log('filtered data ___________________');
                    console.log(filteredData);
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
                    };
                    // let eventData = { // DISPLAY DATA FOR EVENT
                    //     Id: filteredData[0].Id,
                    //     Name: filteredData[0].Name,
                    //     StartTime: cellData.startTime,
                    //     EndTime: cellData.endTime,
                    //     IsAllDay: false,
                    //     Description: filteredData[0].Description,
                    //     DepartmentID: resourceDetails.resourceData.Id,
                    //     ConsultantID: resourceDetails.resourceData.Id,
                    //     AzaIsPere: false,
                    //     AzaNumGroupe: filteredData[0].AzaNumGroupe
                    // };
                    this.timelineResourceDataOut.push(containerData); // filteredData[0]

                    // this.timelineResourceDataOut.push(containerData);
                    this.scheduleObj.openEditor(containerData, 'Add', true);
                    this.isTreeItemDropped = true;
                    this.draggedItemId = event.draggedNodeData.id as string;
                    console.log(this.data);
                } else { // Emplacement déjà pris par un event (container)
                    console.log('emplacement déjà attribué');
                    console.log(event.target.id);
                    console.log(this.timelineResourceDataOut);
                    const filteredData: { [key: string]: Object }[] =
                        treeviewData.filter((item: any) => item.CodeRessource === parseInt(event.draggedNodeData.id as string, 10));
                    if (event.target.classList.contains('e-work-cells')) {
                        console.log('emplacement libre');
                        console.log('filtered data ___________________');
                        console.log(filteredData);
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
                        };
                        this.timelineResourceDataOut.push(containerData); // filteredData[0]
                        this.scheduleObj.openEditor(containerData, 'Add', true);
                        this.isTreeItemDropped = true;
                        this.draggedItemId = event.draggedNodeData.id as string;
                        console.log(this.data);
                    } else { // Emplacement déjà pris par un event (container)
                        console.log('emplacement déjà attribué');
                        let indexContainerEvent = this.findIndexEventById(event.target.id);
                        this.timelineResourceDataOut[indexContainerEvent]['Operateur'] = filteredData[0].Username;
                        this.isTreeItemDropped = true;
                        this.onActionComplete('e');
                }
            }
        }
    }}

 

    /*********************** ACTION BEGIN FUNCTION *********************/

    onActionBegin(event: ActionEventArgs): void {
        console.log('action Begin');
        console.log(event);
        console.log(this.isTreeItemDropped);
        // if (event.requestType === 'eventChange' && event.data.AzaIsPere) {
        //     console.log('event change action');
        // }
        // if (event.requestType === 'eventChange' && !event.data.AzaIsPere) {
        //     console.log('is not pere');
        // }
        if (((event.requestType === 'eventCreate') || (event.requestType === 'eventCreated')) && !this.isTreeItemDropped) { // CREATE CONTAINER ON CELL WITHOUT EVENT CLICK
            event.data[0]['AzaIsPere'] = true;
        }
        if (event.requestType === 'eventRemove') {
            console.log('ààààààààààààààààààààààààààààààààààààààààààà');
        }
        if (event.requestType === 'eventCreate' && this.isTreeItemDropped) { // FUNCTION FROM TEMPLATE => Call when workodre is drag and drop from backlog to create container
            console.log('function from template: onActionBegin()');
            let treeViewdata: { [key: string]: Object }[] = this.treeObj.fields.dataSource as { [key: string]: Object }[];
            const filteredPeople: { [key: string]: Object }[] =
                treeViewdata.filter((item: any) => item.Id !== parseInt(this.draggedItemId, 10));
            this.treeObj.fields.dataSource = filteredPeople;
            let elements: NodeListOf<HTMLElement> =
                document.querySelectorAll('.e-drag-item.treeview-external-drag') as NodeListOf<HTMLElement>;
            for (let i: number = 0; i < elements.length; i++) {
                remove(elements[i]);
            }
        } else { // CUSTOM FUNCTION
            console.log(event.requestType);
            console.log('custom function: onActionBegin()');
            this.azaactionBegin(event);
        }
    }

    azaactionBegin(args: any) { // CUSTOM ACTION BEGIN
        if (args.requestType === 'eventRemove') { // CUSTOM ACTION REMOVE 
            this.deleteEvent(args);
        } else if ((args.requestType !== 'toolbarItemRendering') && (args.data['AzaIsPere'])) {
            console.log(args.data['AzaIsPere']);
            console.log('event Change !');
            console.log('==> Custom action Begin function : azaactionBegin(args: any)');
            console.log(args);
            console.log(this.timelineResourceDataOut);
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
            let id = Math.floor((Math.random() * 100) + 1);
            let containerData = { // DISPLAY DATA FOR CONTAINER
                Id: id,
                Name: data.Name,
                StartTime: data.StartTime,
                EndTime: data.EndTime,
                IsAllDay: false,
                DepartmentID: data.DepartmentID,
                ConsultantID: data.DepartmentID,
                AzaIsPere: true,
                AzaNumGroupe: id
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
        console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& On Action Complete Function');
        console.log(e);
            this.isTreeItemDropped = false;
            this.eventSettings = { // Réinitialise les events affichés dans le scheduler
                dataSource: <Object[]>extend(
                    [], this.calculDateAll(this.timelineResourceDataOut, false, null, false, false), null, true
                )
            };
            this.treeObj.fields = this.field;
            console.log('this is new data :');
            console.log(this.timelineResourceDataOut);
            console.log('this is new fieds :');
            console.log(this.treeObj.fields);
    }

    /************************ DELETE ********************/

    deleteEvent(args: any) {
        console.log('delete function');
        let data = args.data[0];
        console.log('removveeeeeeeeeeeeeeeeeeeeeeeeeee');
        console.log(data);
        if (data['AzaIsPere']) { // REMOVE CONTAINER
            console.log('is pere');
            this.timelineResourceDataOut.forEach(item => { // GARDER CETTE FONCTION POUR LA SUITE
                if ((+data.AzaNumGroupe === +item.AzaNumGroupe) && !item.AzaIsPere) {
                    if (!this.field['dataSource'].includes(item)) {
                        console.log(item);
                        this.field['dataSource'].push(item);
                    }
                }
            });
            console.log(this.field);
            this.timelineResourceDataOut = this.timelineResourceDataOut.filter(item => {
                if (+data.AzaNumGroupe !== +item.AzaNumGroupe) {
                    return item;
                }
            });
            console.log(this.field['dataSource']);
            console.log(this.treeObj.fields);
            this.eventSettings = {
                dataSource: <Object[]>extend(
                    // [], this.calculDateAll(atimelineResourceData1, true, args.data, bstartdifferent, benddifferent ), null, true
                    [], this.timelineResourceDataOut, null, true
                )
            };
        } else { // REMOVE WORKORDER
            console.log('is NOT pere');
            console.log(data);
            let newGroup = [];
            let selectedItem;
            let pere;
            this.timelineResourceDataOut.forEach(item => {
                if (+item.Id === +data.Id && item.Name === data.Name) {
                    selectedItem = item;
                }
            });
            console.log(selectedItem);
            this.timelineResourceDataOut = this.timelineResourceDataOut.filter(item => {
                console.log(item);
                if ((+data.Id !== +item.Id) || (+data.Id === +item.Id && item.AzaIsPere)) {
                    return item;
                }
            });
            console.log(this.timelineResourceDataOut);
            this.timelineResourceDataOut.forEach(item => {
                if (+data.AzaNumGroupe === +item.AzaNumGroupe) {
                    newGroup.push(item);
                    if (item.AzaIsPere) {
                    pere = item;
                    }
                }
                });
            this.field['dataSource'].push(selectedItem);
            let startDifferent = this.checkDiffExistById(pere, this.timelineResourceDataOut, 'StartTime', 'StartTime');
            let endDifferent = this.checkDiffExistById(pere, this.timelineResourceDataOut, 'EndTime', 'EndTime');
            this.eventSettings = {
                dataSource: <Object[]>extend(
                    [], this.calculDateAll(this.timelineResourceDataOut, true, pere, startDifferent, endDifferent), null, true
                )
            };
        }
    }


    /************************ DATES CALCUL ********************/

    calculDateAll(
        atimelineResourceData: Object[], needUpdate: boolean, itemToUpdate: Object[], startDifferent: boolean, endDifferent: boolean
    ): Object[] {
        // CALL ONINT => this.calculDateAll(this.data, false, null, false, false )
        // CALL ONRESIZE => this.calculDateAll(this.timelineResourceDataOut, true, args.data, startDifferent, endDifferent), null, true;
        console.log(needUpdate);
        let groupe = [], i;
        for (i = 0; i < atimelineResourceData.length; i++) {
            if (!groupe.includes(atimelineResourceData[i]['AzaNumGroupe'])) {
                groupe.push(atimelineResourceData[i]['AzaNumGroupe']);
            }
        }
        groupe.forEach(item => {
            console.log(item);
            this.timelineResourceDataOut = this.calculDateGroup(atimelineResourceData, +item, needUpdate, itemToUpdate, startDifferent, endDifferent);
        });
        console.log(groupe);
        return this.timelineResourceDataOut;
    }

    calculDateGroup(
        atimelineResourceData: Object[], numGroup: number, needUpdate: boolean,
        itemToUpdate: Object[], startDifferent: boolean, endDifferent: boolean)
    : Object[] {
        console.log('calcul date groupr function');
        let minDateGroup = this.getMinMaxNumgroupe(
            atimelineResourceData, numGroup, 'StartTime', needUpdate, itemToUpdate
        );
        let maxDateGroup = this.getMinMaxNumgroupe(
            atimelineResourceData, numGroup, 'EndTime', needUpdate, itemToUpdate
        );
        let diffMinMax = +maxDateGroup - +minDateGroup;
        console.log(diffMinMax);
        let Seconds_from_T1_to_T2 = diffMinMax / 1000;
        console.log(Seconds_from_T1_to_T2);
        let Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
        console.log(Seconds_Between_Dates);
        let countWorkorderSameGroup = this.getCountWorkOrderByGroup(atimelineResourceData, 'AzaNumGroupe', +numGroup);
        let Seconds_for_a_job = Seconds_Between_Dates / countWorkorderSameGroup;
        atimelineResourceData = this.calcultimesforalljobs(atimelineResourceData, numGroup, minDateGroup, maxDateGroup, Seconds_for_a_job);
        this.timelineResourceDataOut = atimelineResourceData;
        return atimelineResourceData;
    }

    getCountWorkOrderByGroup(objectin: Object[], property: string, numGroup: number): number {
        console.log('check count workorder same group');
        let countWorkorderSameGroup = 0;
        objectin.forEach(item => {
            if (item[property] === numGroup) {
                if (!item['AzaIsPere']) {
                    countWorkorderSameGroup++;
                }
            }
        });
        console.log(countWorkorderSameGroup);
        return countWorkorderSameGroup;
    }

// GET MINIMUM DATE FROM GROUP
    getMinMaxNumgroupe(
        atimelineResourceData, numGroup: number, timePosition: string, isUpdate: boolean, Objupdate: Object[]
    ) {
        let mindate;
        let maxDate;
        let regie: number;
        let arrayDatesGroup = [];
        atimelineResourceData.forEach(item => {
            if (+item.AzaNumGroupe === numGroup) {
                arrayDatesGroup.push(+item[timePosition]);
                if (item.AzaIsPere) {
                    console.log(item);
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
        console.log(min);
        console.log(new Date(min));       
        console.log(arrayDatesGroup);
        mindate = new Date(min);
        maxDate = new Date(max);
        if (timePosition === 'StartTime') {
            if (isUpdate) {
                console.log('isUpdate');
                if (Objupdate != null) {
                    if (+Objupdate['AzaNumGroupe'] === numGroup) {
                        mindate = Objupdate[timePosition];
                    }
                }
            } else {
                console.log('not update for startTime');
            }
            console.log(mindate);
            return mindate;
        } else if (timePosition === 'EndTime') {
            if (isUpdate) {
                if (Objupdate != null) {
                    if (+Objupdate['AzaNumGroupe'] === numGroup) {
                        maxDate = Objupdate[timePosition];
                    }
                }
            } else {
                console.log('not update for endTime');
            }
            console.log(maxDate);
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

    public monteurListe:MonteursData[] = [
        { CodeRessource: 1, Username: 'Monteur 1', CodeSalle: null, IsRH: 1, NomSalle: '' },
        { CodeRessource: 2, Username: 'Monteur 2', CodeSalle: null, IsRH: 1, NomSalle: '' },
        { CodeRessource: 3, Username: 'Monteur 3', CodeSalle: null, IsRH: 1, NomSalle: '' },
        { CodeRessource: 4, Username: 'Monteur 4', CodeSalle: null, IsRH: 1, NomSalle: '' },
        { CodeRessource: 5, Username: 'Monteur 5', CodeSalle: null, IsRH: 1, NomSalle: '' },
    ];


    // filterMonteurs(value:string){
    //     this.dataMonteur = this.dataMonteur.filter (monteurs => {
    //       return monteurs.Username === value;
          
    //     });
     
    //     }
  

    onSelect(value) {
        for (let i = 0; i < this.monteurListe.length; i++) {
            if (value) {
                if (value === this.monteurListe[i].Username) {
                this.fieldMonteur = { dataSource: this.monteurDataSource.concat(this.monteurListe[i]), text: 'Username' };
                    this.monteurDataSource.push(this.monteurListe[i]);

                }
            }


        }
        let codeToString = CodeRessource.toString()
        const that = this;
        let target
        setTimeout(() => {
       

            if (document.querySelectorAll('.monteurs').length >= this.dataMonteur.length) {
                target =document.getElementById('a'+codeToString)
                let targetUsername=document.querySelector(".Monteur")
                console.log("target", target)
                console.log("target username", targetUsername)
                targetUsername.innerHTML = username + `<button  class="float-right" style="border:none; height:20px;"  > btn <i class="icofont icofont-close float-right" ></i> </button>`
                
                // document.getElementById('a'+codeToString).onclick=function(){
                //     console.log("monteur suprimé")

                //    }

            }
              console.log(this.dataMonteur)
        }    
    }


    getBorder(value) {
        for (let i = 0; i < this.monteurListe.length; i++) {

            if (value === this.monteurListe[i].Username) {
                return 'red 2px solid'
            }


        }
    }




    onRenderCell(args: RenderCellEventArgs): void {

        if (args.elementType === 'emptyCells' && args.element.classList.contains('e-resource-left-td')) {
            let target: HTMLElement = args.element.querySelector('.e-resource-text') as HTMLElement;
            target.innerHTML = `<button id="btn"  class="btn btn-inverse btn-outline-inverse regie" style="padding:0; border:none" onclick="${this.displayRegies()}" iconCss="e-btn-sb-icons e-play-icon"> Voir Autres Régies </button>`;
        }
        // document.getElementById('btn').onclick = function () {
        //     console.log("ajout regie")
        // }

        }
    

    displayRegies() {
        console.log('aaa')
    }

    

    onFilter(  searchText: string) { 
    

        if (!searchText) {
            // console.log('searchText', typeof searchText,searchText)
            return this.filteredData=this.fieldMonteur;
         
        } 
           this.filteredData = this.fieldMonteur['dataSource'].filtre((item: any) => item.Username.toLowerCase().includes(searchText)) ;
            // console.log('filtredData', this.filteredData)
           console.log('aaaaaa',this.filteredData)
       
           

       
    }



    

        getData(searchText:string){
            if(!searchText)
            {
                console.log('fieldMonteur', this.fieldMonteur)
                return this.fieldMonteur
               
            }
            if(searchText){
                console.log('filteredData' , this.filteredData)
                return this.filteredData
                
            }

        }
   

        

}




