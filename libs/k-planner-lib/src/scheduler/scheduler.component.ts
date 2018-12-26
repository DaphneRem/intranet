import { Component,  ViewChild, Inject } from '@angular/core';
import { extend, closest, remove, createElement } from '@syncfusion/ej2-base';
import { hospitalData, waitingList } from '../datasource';
import { HospitalData } from '../models/hospital-data';
import {
  PopupOpenEventArgs,
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
import { TreeViewComponent,TabComponent } from '@syncfusion/ej2-angular-navigations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { WorkorderDetailsModalComponent } from '../workorder-details-modal/workorder-details-modal.component';


@Component({
  selector: 'scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})

export class SchedulerComponent {

    @ViewChild('scheduleObj')
    public scheduleObj: ScheduleComponent;
    @ViewChild('treeObj')
    public treeObj: TreeViewComponent;

/******** SCHEDULER INIT *******/
    public selectedDate: Date = new Date();
    //   public selectedDate: Date =new Date(2018, 7, 1);
    public data: HospitalData[] = <HospitalData[]>extend([], hospitalData, null, true);
    public currentView: View = 'TimelineDay';
    public workHours: WorkHoursModel = { start: '08:00', end: '18:00' };

// ROWS INIT
    public departmentDataSource: Object[] = [
        { Text: 'REGIEA', Id: 1, Color: '#008eaa' },
        { Text: 'REGIEB', Id: 2, Color: '#008eaa' },
        { Text: 'REGIEC', Id: 3, Color: '#008eaa' },
        { Text: 'REGIED', Id: 4, Color: '#008eaa' }
    ];

// BACKLOG INIT
    public headerText: Object = [{ 'text': 'WorkOrder' }, { 'text': 'Monteur' }];

    public isTreeItemDropped: boolean = false;
    public draggedItemId: string = '';
    public timelineResourceDataOut: Object[];

    public group: GroupModel = { enableCompactView: false, resources: ['Departments', 'Consultants'] };
    public allowMultiple: Boolean = false;

    public field: Object = { dataSource: waitingList, id: 'Id', text: 'Name' };
    public allowDragAndDrop: boolean = true;
    public cancelObjectModal = false;

// EDIT EVENT CONFIG
    public eventSettings: EventSettingsModel = {
        dataSource: <Object[]>extend([], this.calculDateAll(this.data, false, null, false, false ), null, true ),
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
                        console.log(args);
                        this.openDialog(args, args.data, workOrders[e], this.departmentDataSource);
                    });
                }
              }
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
        console.log(category);
        const dialogRef = this.dialog.open(WorkorderDetailsModalComponent, {
          width: '365px',
          data : {
            workorder: object,
            regie: category
          }
        });
        console.log('openDialogSubObject function');
        console.log(this.cancelObjectModal);
    }

    // NOT USED
    // getConsultantName(value: ResourceDetails): string {
    //     return (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField] as string;
    // };

    // NOT USED
    // getConsultantStatus(value: ResourceDetails): boolean {
    //     let resourceName: string =
    //         (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField] as string;
    //     if (resourceName === 'REGIEA' || resourceName === 'REGIE2'|| resourceName === 'REGIE3'|| resourceName === 'REGIE4') {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // };

    // NOT USED
    // getConsultantImageName(value: ResourceDetails): string{
    //     return this.getConsultantName(value).toLowerCase();
    // }

/****************** DRAG AND DROP  ******************/

    onItemDrag(event: any): void { // FUCNTION FROM TEMPLATE
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

    onActionBegin(event: ActionEventArgs): void {
        if (event.requestType === 'eventCreate' && this.isTreeItemDropped) { // FUNCTION FROM TEMPLATE
            console.log('function from template: onActionBegin()');
            let treeViewdata: { [key: string]: Object }[] = this.treeObj.fields.dataSource as { [key: string]: Object }[];
            const filteredPeople: { [key: string]: Object }[] =
                treeViewdata.filter((item: any) => item.Id !== parseInt(this.draggedItemId, 10));
            this.treeObj.fields.dataSource = filteredPeople;
            this.treeObj.refresh();
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

    onTreeDragStop(event: DragAndDropEventArgs): void {
        let treeElement: Element = <Element>closest(event.target, '.e-treeview');
        if (!treeElement) {
            event.cancel = true;
            let scheduleElement: Element = <Element>closest(event.target, '.e-content-wrap');
            if (scheduleElement) {
                let treeviewData: { [key: string]: Object }[] =
                    this.treeObj.fields.dataSource as { [key: string]: Object }[];
                if (event.target.classList.contains('e-work-cells')) {
                    const filteredData: { [key: string]: Object }[] =
                        treeviewData.filter((item: any) => item.Id === parseInt(event.draggedNodeData.id as string, 10));
                        console.log(filteredData);
                    let cellData: CellClickEventArgs = this.scheduleObj.getCellDetails(event.target);
                    let resourceDetails: ResourceDetails = this.scheduleObj.getResourcesByIndex(cellData.groupIndex);
                    let startDate = cellData.startTime;
                    let endDate = cellData.endTime;
                    let eventData: { [key: string]: Object } = {
                        Id: filteredData[0].Id,
                        Name: filteredData[0].Name,
                        StartTime: cellData.startTime,
                        EndTime: cellData.endTime,
                        IsAllDay: false,
                        Description: filteredData[0].Description,
                        DepartmentID: resourceDetails.resourceData.Id,
                        ConsultantID: resourceDetails.resourceData.Id,
                        AzaIsPere: true,
                        AzaNumGroupe: filteredData[0].AzaNumGroupe
                    };
                    this.timelineResourceDataOut.push( eventData ); // filteredData[0]
                //   intconsultant : Number;
                    let intconsultant = resourceDetails.resourceData.Id;
                    for (let _i = 0; _i < 4; _i++) {
                        let cpt = (Number(filteredData[0].Id) + _i + 100);
                        console.log('intconsultant:' + intconsultant);
                        if (intconsultant === 1) {
                            intconsultant = 2;
                        } else {
                            intconsultant = intconsultant;
                        }
                        let tempData = {
                            Id: cpt,
                            Name: 'PARTIE ' + _i,
                            StartTime: startDate,
                            EndTime: endDate,
                            IsAllDay: cellData.isAllDay,
                            Description: filteredData[0].Description,
                            DepartmentID: resourceDetails.resourceData.Id,
                            ConsultantID: intconsultant,
                            AzaIsPere: false,
                            AzaNumGroupe: filteredData[0].AzaNumGroupe
                        };
                        this.timelineResourceDataOut.push(tempData);
                    }
                    this.scheduleObj.openEditor(eventData, 'Add', true);
                    this.isTreeItemDropped = true;
                    this.draggedItemId = event.draggedNodeData.id as string;
                }
            }
        }
    }
/****************************************************/


    // NOT USED
    // getObjectByAzaNumgroupe(objectin: Object[], column:string, value:any){
    //     let objectOut:Object[] = [];
    //     // objectOut.clear();
    //     console.log('getObjectByAzaNumgroupe');
    //     for (let entry of objectin) {
    //         console.log('2');
    //         const properties = Object.getOwnPropertyNames(entry);
    //         for (let property of properties) {
    //             //if (property=='AzaNumGroupe'){
    //             if (property == column) {
    //                 if ((entry[property] == value)){
    //                     console.log('entry:' + entry);
    //                     objectOut.push(entry);
    //                 }
    //             }
    //         }
    //     }
    //     return objectOut;
    // }

/************************ CALCUL ********************/

    getCountByAzaNumgroupe(objectin: Object[], column: string, value: any): number {
       let objectOut: Object[] = [];
       let cpt = 0;
        // objectOut.clear();
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++getCountByAzaNumgroupe');
        for (let entry of objectin) {
            const properties = Object.getOwnPropertyNames(entry);
            for (let property of properties){
                // if (property == 'AzaNumGroupe') {
                if (property === column) {
                    if ((entry[property] === value)) {
                    cpt = cpt + 1;
                    }
                }
            }
        }
        return cpt;
    }

/************************ DELETE ********************/

    deleteobject(objectin: any, tabin: Object[]) {
        let objectOut: Object[] = tabin;
        // objectOut.clear();
        console.log('deleteobject');
        // for (let entry of objectin){
        for (let i = 0; i < tabin.length; i++) {
           console.log('deleteobject :' + i);
           console.log('objectin.Id:' + objectin.Id);
           console.log('tabin[i]:' + tabin[i]['Id']);
           // const properties= Object.getOwnPropertyNames(objectin[i]);

            if (objectin.Id === tabin[i]['Id']) {
                console.log(' delete entry:' + objectin);
                console.log(' delete entry:' + objectin.Id);
                objectOut.splice(i, 1);
            }
        }
       return objectOut;
    }


    isStartDifferent(objectin: any, tabin: Object[]): boolean {
       let objectOut: Object[] = tabin;
       let isdiff: boolean = false;
      // objectOut.clear();
      console.log('isStartDifferent');
      // for (let entry of objectin){
          for (let i = 0; i < tabin.length; i++) {
          console.log('isStartDifferent :' + i);
          console.log('objectin.Id:' + objectin.Id);
          console.log('tabin[i]:' + tabin[i]['Id']);
          if (objectin.Id === tabin[i]['Id']) {
               if (objectin.StartTime === tabin[i]['StartTime']) {
                   console.log('false');
                   isdiff = false;
                   break;
               } else {
                   console.log('true');
                   isdiff = true;
                   break;
               }
           }
        }
        return isdiff;
    }

    isEndDifferent(objectin: any, tabin: Object[]): boolean {
        let objectOut: Object[] = tabin;
        let isdiff: boolean = false;
        // objectOut.clear();
        console.log('isStartDifferent');
        // for (let entry of objectin){
          for (let i = 0; i < tabin.length; i++) {
          console.log('isStartDifferent :' + i);
          console.log('objectin.Id:' + objectin.Id);
          console.log('tabin[i]:' + tabin[i]['Id']);
          if (objectin.Id === tabin[i]['Id']) {
               if (objectin.EndTime === tabin[i]['EndTime']) {
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


/************************ DATES CALCUL ********************/

// GET MINIMUM DATE FROM GROUP
    getmindateNumgroupe(
        objectin: Object[], numgroupe: number, column: string, value: any,isUpdate: boolean, Objupdate: Object[], bstartdifferent: boolean
    ) {
        let objectOut: Object[] = [];
        let mindate: Date = new Date(2050, 3, 4, 0, 0);
        // objectOut.clear();
        console.log('getmindatemindateNumgroupe');
        for (let entry of objectin) {
            console.log('entry');
            const properties = Object.getOwnPropertyNames(entry);
            if ( entry['AzaNumGroupe'] === value) {
                for (let property of properties) {
                    //if (property=='AzaNumGroupe'){
                    if (property === column) {
                        if (entry[property] < mindate) {
                            mindate = entry[property];
                            console.log('getmindate:' + mindate);
                        }
                    }
                }
           }
        }
        if (isUpdate) {
            console.log('isupdate:');
            if (bstartdifferent) {
                console.log('istartdifferent');
                if (Objupdate !== null) {
                    console.log('Objupdate');
                    if (Objupdate['AzaNumGroupe'] === numgroupe) {
                        console.log('Objupdate[column]< mindate');
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
            if ( entry['AzaNumGroupe'] === value) {
                for (let property of properties) {
                    if (property === column) {
                        if (entry[property] > maxdate) {
                        maxdate = entry[property];
                        console.log('getmaxdate:' + maxdate);
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
                if ( entry['AzaIsPere'] === true) {
                    console.log('is pere mindate:' + mindate);
                    console.log('is pere maxdate:' + maxdate);
                        entry['StartTime'] = mindate;
                        entry['EndTime'] = maxdate;
                    } else {
                        console.log('not is pere mindate:' + tempmindate);
                        console.log('not is pere maxdate:' + tempmaxdate);
                        entry['StartTime'] = tempmindate;
                        let tempdate = new Date(tempmindate.getTime() + Seconds_for_a_job * 1000) ;
                        console.log('tempdate:' + tempdate);
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
            // atimelineResourceData=this.getObjectByAzaNumgroupe(atimelineResourceData, 'AzaNumGroupe', 100);
            // atimelineResourceData=atimelineResourceData.concat(this.getObjectByAzaNumgroupe(atimelineResourceData, 'AzaNumGroupe', 101));
            // console.log('calculDateGroup:' + JSON.stringify(atimelineResourceData));
            console.log('calculDateGroup function call');
            let mindate = this.getmindateNumgroupe(
                atimelineResourceData, numGroup,  'StartTime', numGroup, isUpdate, Objupdate, bstartdifferent
            );
            let maxdate = this.getmaxdateNumgroupe(
                atimelineResourceData, numGroup,  'EndTime', numGroup, isUpdate, Objupdate, benddifferent
            );
            console.log('calculDateGroup mindate:' + mindate);
            console.log('calculDateGroup maxdate:' + maxdate);
            let diff = maxdate.getTime() - mindate.getTime();
            let Seconds_from_T1_to_T2 = diff / 1000;
            let Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
            let cpt = this.getCountByAzaNumgroupe(atimelineResourceData,  'AzaNumGroupe', numGroup);
            console.log('calculDateGroup cpt:' + cpt);
            let Seconds_for_a_job = Seconds_Between_Dates / (cpt - 1);
            console.log('avant calcul mindate  ' + mindate + '-maxdate ' + maxdate + '-Seconds_for_a_job ' + Seconds_for_a_job );
            atimelineResourceData = this.calcultimesforalljobs(atimelineResourceData, numGroup, mindate, maxdate, Seconds_for_a_job );
            // console.log(atimelineResourceData);
            this.timelineResourceDataOut = atimelineResourceData;
            return atimelineResourceData;
    }

    calculDateAll(
        atimelineResourceData: Object[], isUpdate: boolean, Objupdate: Object[], bstartdifferent: boolean, benddifferent: boolean
    ): Object[] {
       // let atimelineResourceDatatemp=this.getObjectByAzaNumgroupe(atimelineResourceData, 'AzaNumGroupe', 100);
       // atimelineResourceData=atimelineResourceDatatemp.concat( this.getObjectByAzaNumgroupe(atimelineResourceData, 'AzaNumGroupe', 101));
      // atimelineResourceData=this.timelineResourceDataOut;
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

    azaactionBegin(args: any) {
      // let  adatasource= this.eventSettings.dataSource;
      // adatasource.push(args) ;
        if (args.requestType !== 'toolbarItemRendering') {
            console.log('********************************************************************************actionBegin');
            console.log('args = ' + args);
            console.log('this.timelineResourceDataOut' + this.timelineResourceDataOut);
            let bstartdifferent = this.isStartDifferent(args.data, this.timelineResourceDataOut);
            console.log('bstartdifferent:' + bstartdifferent);
            let benddifferent = this.isEndDifferent(args.data, this.timelineResourceDataOut);
            console.log('benddifferent:' + bstartdifferent);
            this.timelineResourceDataOut = this.eventSettings.dataSource as Object[];
            console.log('timelineResourceDataOut:' + JSON.stringify( this.timelineResourceDataOut));
            let atimelineResourceData1 = this.deleteobject(args.data, this.timelineResourceDataOut);
            console.log('splice:' + atimelineResourceData1);
            atimelineResourceData1.push(args.data);
            console.log('push:' + JSON.stringify(atimelineResourceData1));
            this.eventSettings = {
                dataSource: <Object[]>extend(
                    [], this.calculDateAll(atimelineResourceData1, true, args.data, bstartdifferent, benddifferent ), null, true
                )
            };
            console.log('datasource:' + JSON.stringify(this.eventSettings.dataSource));
        }
    }

    onActionComplete() {
        this.eventSettings = {
            dataSource: <Object[]>extend(
                [], this.calculDateAll(this.timelineResourceDataOut, false, null, false, false ), null, true
            )
        };
    }

}
