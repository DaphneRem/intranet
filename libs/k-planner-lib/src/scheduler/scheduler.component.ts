import { Component, ViewChild } from '@angular/core';
import { extend, closest, remove, createElement, addClass } from '@syncfusion/ej2-base';
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

@Component({
    selector: 'scheduler',
    templateUrl: './scheduler.component.html',
    styleUrls: [
        './scheduler.component.scss',
        '../../../../assets/icon/icofont/css/icofont.scss'
    ]
})

export class SchedulerComponent   {

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
        // ej.Schedule.Locale["fr-FR"]=
        // {
        //     TODAY:"aujourd'hui"
        // }
        
     
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

    azaactionBegin(args: any) {
        if (args.requestType !== 'toolbarItemRendering') {
            console.log('****************************************** Custom action Begin function');
            console.log(args);
            console.log(this.timelineResourceDataOut);
            let bstartdifferent = this.isStartDifferent(args.data, this.timelineResourceDataOut);
            let benddifferent = this.isEndDifferent(args.data, this.timelineResourceDataOut);
            this.timelineResourceDataOut = this.eventSettings.dataSource as Object[];
            // let atimelineResourceData1 = this.deleteobject(args.data, this.timelineResourceDataOut);
            // atimelineResourceData1.push(args.data);
            this.eventSettings = {
                dataSource: <Object[]>extend(
                    // [], this.calculDateAll(atimelineResourceData1, true, args.data, bstartdifferent, benddifferent ), null, true
                    [], this.calculDateAll(this.timelineResourceDataOut, true, args.data, bstartdifferent, benddifferent), null, true

                )
            };
            // console.log('datasource:' + JSON.stringify(this.eventSettings.dataSource));
        }
    }

    /*********************** ACTION COMPLETE FUNCTION *********************/

    onActionComplete(e) {
        console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& On Action Complete Function');
        console.log(e);
        this.isTreeItemDropped = false;
        this.eventSettings = {
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
        atimelineResourceData: Object[], isUpdate: boolean, Objupdate: Object[], bstartdifferent: boolean, benddifferent: boolean
    ): Object[] {
        this.timelineResourceDataOut = this.calculDateGroup(
            atimelineResourceData, 100, isUpdate, Objupdate, bstartdifferent, benddifferent);
        this.timelineResourceDataOut = this.calculDateGroup(
            atimelineResourceData, 101, isUpdate, Objupdate, bstartdifferent, benddifferent);
        this.timelineResourceDataOut = this.calculDateGroup(
            atimelineResourceData, 102, isUpdate, Objupdate, bstartdifferent, benddifferent);
        this.timelineResourceDataOut = this.calculDateGroup(
            atimelineResourceData, 103, isUpdate, Objupdate, bstartdifferent, benddifferent);
        this.timelineResourceDataOut = this.calculDateGroup(
            atimelineResourceData, 104, isUpdate, Objupdate, bstartdifferent, benddifferent);
        this.timelineResourceDataOut = this.calculDateGroup(
            atimelineResourceData, 105, isUpdate, Objupdate, bstartdifferent, benddifferent);
        return this.timelineResourceDataOut;
    }

    getCountByAzaNumgroupe(objectin: Object[], column: string, value: any): number {
        let objectOut: Object[] = [];
        let cpt = 0;
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++getCountByAzaNumgroupe');
        for (let entry of objectin) {
            const properties = Object.getOwnPropertyNames(entry);
            for (let property of properties) {
                if (property === column) {
                    if ((entry[property] === value)) {
                        cpt = cpt + 1;
                    }
                }
            }
        }
        return cpt;
    }

    // GET MINIMUM DATE FROM GROUP
    getmindateNumgroupe(
        objectin: Object[], numgroupe: number, column: string, value: any, isUpdate: boolean, Objupdate: Object[], bstartdifferent: boolean
    ) {
        let objectOut: Object[] = [];
        let mindate: Date = new Date(2050, 3, 4, 0, 0);
        for (let entry of objectin) {
            const properties = Object.getOwnPropertyNames(entry);
            if (entry['AzaNumGroupe'] === value) {
                for (let property of properties) {
                    if (property === column) {
                        if (entry[property] < mindate) {
                            mindate = entry[property];
                        }
                    }
                }
            }
        }
        if (isUpdate) {
            if (bstartdifferent) {
                if (Objupdate != null) {
                    if (Objupdate['AzaNumGroupe'] === numgroupe) {
                        mindate = Objupdate[column];
                    }
                }
            }
        }
        return mindate;
    }

    // GET MAXIMUM DATE FROM GROUP
    getmaxdateNumgroupe(
        objectin: Object[], numgroupe: number, column: string, value: any, isUpdate: boolean, Objupdate: Object[], benddifferent: boolean
    ) {
        let objectOut: Object[] = [];
        let maxdate: Date = new Date(2000, 3, 5, 0, 0);
        for (let entry of objectin) {
            const properties = Object.getOwnPropertyNames(entry);
            if (entry['AzaNumGroupe'] === value) {
                for (let property of properties) {
                    if (property === column) {
                        if (entry[property] > maxdate) {
                            maxdate = entry[property];
                        }
                    }
                }
            }
        }
        if (isUpdate) {
            if (benddifferent) {
                if (Objupdate != null) {
                    if (Objupdate['AzaNumGroupe'] === numgroupe) {
                        maxdate = Objupdate[column];
                    }
                }
            }
        }
        return maxdate;
    }


    calcultimesforalljobs(timelineResourceDatain, numgroup: number, mindate: Date, maxdate: Date, Seconds_for_a_job) {
        let atimelineResourceDataout = timelineResourceDatain;
        let tempmindate = mindate;
        let tempmaxdate = maxdate;
        for (let entry of timelineResourceDatain) {
            if (entry.AzaNumGroupe === numgroup) {
                const properties = Object.getOwnPropertyNames(entry);
                if (entry['AzaIsPere'] === true) { // IF CONTAINER DISPLAY STARTTIME AND ENDTIME MAX
                    entry['StartTime'] = mindate;
                    entry['EndTime'] = maxdate;
                } else {
                    entry['StartTime'] = tempmindate;
                    let tempdate = new Date(tempmindate.getTime() + Seconds_for_a_job * 1000);
                    entry['EndTime'] = tempdate;
                    tempmindate = tempdate;
                }
            }
        }
        return atimelineResourceDataout;
    }

    calculDateGroup(
        atimelineResourceData: Object[], numGroup: number, isUpdate: boolean,
        Objupdate: Object[], bstartdifferent: boolean, benddifferent: boolean)
        : Object[] {
        let minDateGroup = this.getmindateNumgroupe(
            atimelineResourceData, numGroup, 'StartTime', numGroup, isUpdate, Objupdate, bstartdifferent
        );
        let maxdate = this.getmaxdateNumgroupe(
            atimelineResourceData, numGroup, 'EndTime', numGroup, isUpdate, Objupdate, benddifferent
        );

        let diff = maxdate.getTime() - minDateGroup.getTime();
        let Seconds_from_T1_to_T2 = diff / 1000;
        let Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
        let cpt = this.getCountByAzaNumgroupe(atimelineResourceData, 'AzaNumGroupe', numGroup);
        let Seconds_for_a_job = Seconds_Between_Dates / (cpt - 1);
        atimelineResourceData = this.calcultimesforalljobs(atimelineResourceData, numGroup, minDateGroup, maxdate, Seconds_for_a_job);
        this.timelineResourceDataOut = atimelineResourceData;
        return atimelineResourceData;
    }
    public monteurListe: MonteursData[] = [
        { Code: 1, Username: "Monteur 1", CodeSalle: null, IsRH: 1, NomSalle: "" },
        { Code: 2, Username: "Monteur 2", CodeSalle: null, IsRH: 1, NomSalle: "" },
        { Code: 3, Username: "Monteur 3", CodeSalle: null, IsRH: 1, NomSalle: "" },
        { Code: 4, Username: "Monteur 4", CodeSalle: null, IsRH: 1, NomSalle: "" },
        { Code: 5, Username: "Monteur 5", CodeSalle: null, IsRH: 1, NomSalle: "" },
    ];

    isStartDifferent(argsData: any, timelineResourceDataOut: Object[]): boolean {
        let objectOut: Object[] = timelineResourceDataOut;
        let isdiff: boolean = false;
        for (let i = 0; i < timelineResourceDataOut.length; i++) {
            if (argsData.Id === timelineResourceDataOut[i]['Id']) {
                if (argsData.StartTime === timelineResourceDataOut[i]['StartTime']) {
                    isdiff = false;
                    break;
                } else {
                    isdiff = true;
                    break;
                }
            }
        }
        return isdiff;
    }

    isEndDifferent(argsData: any, timelineResourceDataOut: Object[]): boolean {
        let objectOut: Object[] = timelineResourceDataOut;
        let isdiff: boolean = false;
        for (let i = 0; i < timelineResourceDataOut.length; i++) {
            if (argsData.Id === timelineResourceDataOut[i]['Id']) {
                if (argsData.EndTime === timelineResourceDataOut[i]['EndTime']) {
                    isdiff = false;
                    break;
                } else {
                    isdiff = true;
                    break;
                }
            }
        }
        return isdiff;
    }
  

    onSelect(value) {
        for (let i = 0; i < this.monteurListe.length; i++) {
            if (value) {
                if (value === this.monteurListe[i].Username) {
                this.fieldMonteur = { dataSource: this.dataMonteur.concat(this.monteurListe[i]), text: 'Username' };
                    this.dataMonteur.push(this.monteurListe[i]);

                }

            }
        }
        console.log(this.dataMonteur)
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




