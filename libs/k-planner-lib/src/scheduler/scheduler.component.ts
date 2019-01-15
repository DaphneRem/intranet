import { Component,  ViewChild, OnInit } from '@angular/core';
import { extend, closest, remove, createElement, addClass, L10n, loadCldr } from '@syncfusion/ej2-base';
import { hospitalData, waitingList } from '../datasource';
import { HospitalData } from '../models/hospital-data';
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
import { DragAndDropEventArgs, NodeCheckEventArgs } from '@syncfusion/ej2-navigations';
import { TreeViewComponent, NodeKeyPressEventArgs, NodeClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { MatDialog } from '@angular/material';

import { WorkorderDetailsModalComponent } from '../workorder-details-modal/workorder-details-modal.component';
import { MonteursData } from '../models/monteurs-data';
import { monteurs } from '../data/monteur';
import { ButtonComponent } from '@syncfusion/ej2-angular-buttons';

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
    /******** SCHEDULER INIT *******/
    public selectedDate: Date = new Date();
    //   public selectedDate: Date =new Date(2018, 7, 1);
    public data: HospitalData[] = <HospitalData[]>extend([], hospitalData, null, true);
    public dataMonteur: MonteursData[] = <MonteursData[]>extend([], monteurs, null, true);
    public currentView: View = 'TimelineDay';
    public workHours: WorkHoursModel = { start: '08:00', end: '18:00' };
    public cssClass: string = "custom"
    // ROWS INIT
    public departmentDataSource: Object[] = [

        { Text: 'REGIEA', Id: 1, Color: '#008eaa' },
        { Text: 'REGIEB', Id: 2, Color: '#008eaa' },
        { Text: 'REGIEC', Id: 3, Color: '#008eaa' },
        { Text: 'REGIED', Id: 4, Color: '#008eaa' },
        { Text: 'REGIEE', Id: 5, Color: '#008eaa' }

    ];

    // BACKLOG INIT
    public headerText: Object = [{ 'text': 'WorkOrder' }, { 'text': 'Operateur' }];

    public isTreeItemDropped: boolean = false;
    public draggedItemId: string = '';
    public timelineResourceDataOut;

    public group: GroupModel = { enableCompactView: false, resources: ['Departments'] };
    public allowMultiple: Boolean = false;
    public filteredData  : Object 

    public field: Object = { dataSource: waitingList, id: 'Id', text: 'Name', description: 'Description' };
    public fieldMonteur: Object = { dataSource: monteurs, id: 'Code', text: 'Username' };

    public allowDragAndDrop: boolean = true;
    public cancelObjectModal = false;

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

    constructor(public dialog: MatDialog) {
        // ej.Schedule.Locale['fr-FR']=
        // {
        //     TODAY:'aujourd'hui'
        // }
        
     
    }
    ngOnInit() {
        console.log(this.scheduleObj);
    }

    onPopupOpen(args) { // open container modal and display workorder list
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
                this.data.map(item => {
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
                    row.innerHTML += `<div id='id${i}'>${workOrders[i].Name}</div>`;
                    console.log(i);
                    console.log(row.children[i]);
                }
                for (let e = 0; e < workOrders.length; e++) {
                    let child = document.getElementById(`id${e}`);
                    child.addEventListener('click', () => {
                        console.log('id' + e);
                        console.log(args.cancel);
                        args.cancel = true;
                        console.log("args", args);
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
        console.log("category", category);
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

    onItemDrag(event: any): void { // FUCNTION FROM TEMPLATE
        // console.log('onItemDrag');
        // console.log(event)
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
        console.log(event);
        console.log(this.treeObj);
        let treeElement = closest(event.target, '.e-treeview');
        if (!treeElement) {
            event.cancel = true;
            let scheduleElement: Element = <Element>closest(event.target, '.e-content-wrap');
            if (scheduleElement) {
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
                    console.log(this.data);
                }

            }
        }
    }


    /********************************* DRAG AND DROP MONTEUR************** */
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
                        treeviewData.filter((item: any) => item.Code === parseInt(event.draggedNodeData.id as string, 10));
                if (event.target.classList.contains('e-work-cells')) {
                    console.log('emplacement libre');

                        console.log('filtered data ___________________');
                        console.log(filteredData);
                    let cellData: CellClickEventArgs = this.scheduleObj.getCellDetails(event.target);
                    let resourceDetails: ResourceDetails = this.scheduleObj.getResourcesByIndex(cellData.groupIndex);
                    let containerData = { // DISPLAY DATA FOR CONTAINER
                        Id: filteredData[0].Code,
                        Name: 'Title',
                        StartTime: cellData.startTime,
                        EndTime: cellData.endTime,
                        IsAllDay: false,
                        DepartmentID: resourceDetails.resourceData.Id,
                        ConsultantID: resourceDetails.resourceData.Id,
                        AzaIsPere: true,
                        AzaNumGroupe: filteredData[0].Code,
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
                    let indexContainerEvent = this.findIndexEventById(event.target.id);
                    this.timelineResourceDataOut[indexContainerEvent]['Operateur'] = filteredData[0].Username;
                    // Operateur: filteredData[0].Username,
                    console.log(indexContainerEvent);
                    console.log(this.timelineResourceDataOut[indexContainerEvent]);
                    this.scheduleObj.openEditor( this.timelineResourceDataOut[indexContainerEvent], 'Add', true);
                    this.isTreeItemDropped = true;
                }
            }
        }
    }

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
        if (event.requestType === 'eventCreate' && !this.isTreeItemDropped) { // CREATE CONTAINER ON CELL WITHOUT EVENT CLICK
            event.data[0]['AzaIsPere'] = true;
        }
        if (event.requestType === 'eventCreate' && this.isTreeItemDropped) { // FUNCTION FROM TEMPLATE
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
        if (args.requestType !== 'toolbarItemRendering') {
            console.log('event Change !');
            console.log('==> Custom action Begin function : azaactionBegin(args: any)');
            console.log(args);
            console.log(this.timelineResourceDataOut);
            let startDifferent = this.checkDiffExistById(args.data, this.timelineResourceDataOut, 'StartTime', 'StartTime');
            let endDifferent = this.checkDiffExistById(args.data, this.timelineResourceDataOut, 'EndTime', 'EndTime');
            this.timelineResourceDataOut = this.eventSettings.dataSource as Object[]; // refresh dataSource
            // let atimelineResourceData1 = this.deleteobject(args.data, this.timelineResourceDataOut);
            // atimelineResourceData1.push(args.data);
            this.eventSettings = {
                dataSource: <Object[]>extend(
                    // [], this.calculDateAll(atimelineResourceData1, true, args.data, bstartdifferent, benddifferent ), null, true
                    [], this.calculDateAll(this.timelineResourceDataOut, true, args.data, startDifferent, endDifferent), null, true

                )
            };
            // console.log('datasource:' + JSON.stringify(this.eventSettings.dataSource));
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
    }

    /************************ DELETE ********************/

    deleteobject(argsData: any, timelineResourceDataOut: Object[]) {
        //     let objectOut: Object[] = timelineResourceDataOut;
        //     for (let i = 0; i < timelineResourceDataOut.length; i++) {
        //         if (argsData.Id === timelineResourceDataOut[i]['Id']) {
        //             // objectOut.splice(i, 1);
        //         }
        //     }
        //    return objectOut;
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
        { Code: 1, Username: 'Monteur 1', CodeSalle: null, IsRH: 1, NomSalle: '' },
        { Code: 2, Username: 'Monteur 2', CodeSalle: null, IsRH: 1, NomSalle: '' },
        { Code: 3, Username: 'Monteur 3', CodeSalle: null, IsRH: 1, NomSalle: '' },
        { Code: 4, Username: 'Monteur 4', CodeSalle: null, IsRH: 1, NomSalle: '' },
        { Code: 5, Username: 'Monteur 5', CodeSalle: null, IsRH: 1, NomSalle: '' },
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
                this.fieldMonteur = { dataSource: this.dataMonteur.concat(this.monteurListe[i]), text: 'Username' };
                    this.dataMonteur.push(this.monteurListe[i]);

                }

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
            target.innerHTML = `<button #toggleBtn  id="btn" ejs-button class="btn btn-inverse btn-outline-inverse regie" style="padding:0; border:none" onclick="${this.displayRegies()}" iconCss="e-btn-sb-icons e-play-icon"> Voir Autres Régies </button>`;
        }
        document.getElementById('btn').onclick = function() {
            console.log("ajout regie")
         } 
        
    }
    displayRegies(){
     
    }
   
    onFilter(  searchText: string) { 
    

        if (!searchText) {
            // console.log("searchText", typeof searchText,searchText)
            return this.filteredData=this.fieldMonteur;
         
        } 
           this.filteredData= this.fieldMonteur.dataSource.filtre((item: any) => item.Username.toLowerCase().includes(searchText)) ;
            // console.log("filtredData", this.filteredData)
           console.log("aaaaaa",this.filteredData)

        
           

       
    }



    

        getData(searchText:string){
            if(!searchText)
            {
                console.log("fieldMonteur", this.fieldMonteur)
                return this.fieldMonteur
               
            }
            if(searchText){
                console.log("filteredData" , this.filteredData)
                return this.filteredData
                
            }

        }
        public editing(args: NodeCheckEventArgs) {
            //check whether node is root node or not
            console.log(args.node,"args node")
            if (args.node.parentNode.parentNode.nodeName !== "LI") {
                args.cancel = true;
            }
    };


    nodeSelected (args) {
        console.log(args.nodeData," Node Selected");
      }
}




