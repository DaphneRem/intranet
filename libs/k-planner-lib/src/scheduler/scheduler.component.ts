import { Component,  ViewChild } from '@angular/core';
import { extend, closest, remove } from '@syncfusion/ej2-base';
import { hospitalData, waitingList } from '../datasource';
import {
  EventSettingsModel, View, GroupModel, WorkHoursModel,  ResourceDetails, ScheduleComponent, ActionEventArgs, CellClickEventArgs
} from '@syncfusion/ej2-angular-schedule';
import { DragAndDropEventArgs } from '@syncfusion/ej2-navigations';
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
@Component({
  selector: 'scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent  {

  title = 'syncfusion7';

  @ViewChild('scheduleObj')
  public scheduleObj: ScheduleComponent;
  @ViewChild('treeObj')
  public treeObj: TreeViewComponent;

  public isTreeItemDropped: boolean = false;
  public draggedItemId: string = '';
  public timelineResourceDataOut:Object[];

  public data: Object[] = <Object[]>extend([], hospitalData, null, true);
  public selectedDate: Date = new Date(2018, 7, 1);
  public currentView: View = 'TimelineDay';
  public workHours: WorkHoursModel = { start: '08:00', end: '18:00' };
  public departmentDataSource: Object[] = [
      { Text: 'REGIEA', Id: 1, Color: '#008eaa' },
      { Text: 'REGIEB', Id: 2, Color: '#008eaa' },
      { Text: 'REGIEC', Id: 3, Color: '#008eaa' },
      { Text: 'REGIED', Id: 4, Color: '#008eaa' }
  ];
//   public consultantDataSource: Object[] = [
//       { Text: 'global', Id: 1, GroupId: 1, Color: '#008eaa' },
//       { Text: 'detail', Id: 2, GroupId: 1, Color: '#008eaa' },
//       { Text: 'global', Id: 3, GroupId: 2, Color: '#008eaa' },

/*      { Text: 'Laura', Id: 5, GroupId: 1, Color: '#bbdc00' },
      { Text: 'Margaret', Id: 6, GroupId: 2, Color: '#9e5fff' }*/

  public group: GroupModel = { enableCompactView: false, resources: ['Departments', 'Consultants'] };
  public allowMultiple: Boolean = false;
  public eventSettings: EventSettingsModel = {
      dataSource: <Object[]>extend([], this.calculDateAll(this.data, false, null, false, false ), null, true ),
      fields: {
          subject: { title: 'Patient Name', name: 'Name' },
          startTime: { title: 'From', name: 'StartTime' },
          endTime: { title: 'To', name: 'EndTime' },
          description: { title: 'Reason', name: 'Description' }
      }
  };

  public field: Object = { dataSource: waitingList, id: 'Id', text: 'Name' };
  public allowDragAndDrop: boolean = true;

  

  getConsultantName(value: ResourceDetails): string {
      return (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField] as string;
  };

  getConsultantStatus(value: ResourceDetails): boolean {
      let resourceName: string =
          (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField] as string;
      if (resourceName === 'REGIEA' || resourceName === 'REGIE2'|| resourceName === 'REGIE3'|| resourceName === 'REGIE4') {
          return false;
      } else {
          return true;
      }
  };

  getConsultantImageName(value: ResourceDetails): string{
      return this.getConsultantName(value).toLowerCase();
  }

  onItemDrag(event: any): void {
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
      if (event.requestType === 'eventCreate' && this.isTreeItemDropped) {
          let treeViewdata: { [key: string]: Object }[] = this.treeObj.fields.dataSource as { [key: string]: Object }[];
          const filteredPeople: { [key: string]: Object }[] =
              treeViewdata.filter((item: any) => item.Id !== parseInt(this.draggedItemId, 10));
          this.treeObj.fields.dataSource = filteredPeople;
          this.treeObj.refresh();
          let elements: NodeListOf<HTMLElement> = document.querySelectorAll(".e-drag-item.treeview-external-drag") as NodeListOf<HTMLElement>;
          for (let i: number = 0; i < elements.length; i++) {
              remove(elements[i]);
          }
      }else{
        console.log(event.requestType);
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
                  let cellData: CellClickEventArgs = this.scheduleObj.getCellDetails(event.target);
                  let resourceDetails: ResourceDetails = this.scheduleObj.getResourcesByIndex(cellData.groupIndex);
                  let startDate=cellData.startTime;
                  let endDate=cellData.endTime;
                  let eventData: { [key: string]: Object } = {
                      Id:filteredData[0].Id,
                      Name: filteredData[0].Name,
                      StartTime: cellData.startTime,
                      EndTime: cellData.endTime,
                      IsAllDay: false,
                      Description: filteredData[0].Description,
                      DepartmentID: resourceDetails.resourceData.Id,
                      ConsultantID: resourceDetails.resourceData.Id,
                      AzaIsPere: true,
                      AzaNumGroupe:filteredData[0].AzaNumGroupe
                  };
                 
                  this.timelineResourceDataOut.push( eventData );//filteredData[0]
                //   intconsultant : Number;
                  let intconsultant= resourceDetails.resourceData.Id;  
                  for (var _i = 0; _i < 4; _i++) {
                    let cpt =(Number(filteredData[0].Id)+ _i + 100);
                    console.log("intconsultant:"+intconsultant);
                    if (intconsultant==1){
                      intconsultant=2;
                    }else{
                      intconsultant=intconsultant;
                    }
                    let tempData= {
                      Id:cpt,
                      Name: "PARTIE "+_i,
                      StartTime: startDate,
                      EndTime: endDate,
                      IsAllDay: cellData.isAllDay,
                      Description: filteredData[0].Description,
                      DepartmentID: resourceDetails.resourceData.Id,
                      ConsultantID: intconsultant,
                      AzaIsPere: false,
                      AzaNumGroupe:filteredData[0].AzaNumGroupe
                    };  
                    this.timelineResourceDataOut.push( tempData);
                  }

                  this.scheduleObj.openEditor(eventData, 'Add', true);
                  this.isTreeItemDropped = true;
                  this.draggedItemId = event.draggedNodeData.id as string;

                 
              }
          }
      }
  }


  getObjectByAzaNumgroupe(objectin :Object[], column:string, value:any){
    let objectOut:Object[]=[];
   // objectOut.clear();
   console.log('getObjectByAzaNumgroupe');
   for (let entry of objectin){
       console.log('2');
       const properties= Object.getOwnPropertyNames(entry);
       for (let property of properties){
           //if (property=="AzaNumGroupe"){
           if (property==column){
               if ((entry[property]==value)){
                   console.log('entry:'+entry);
                   objectOut.push(entry);
               }
           }
       }
   }
   
   return objectOut;
}

getCountByAzaNumgroupe(objectin :Object[], column:string, value:any):number{
   let objectOut:Object[]=[];
   let cpt=0;
  // objectOut.clear();
  console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++getCountByAzaNumgroupe');
  for (let entry of objectin){
      
      const properties= Object.getOwnPropertyNames(entry);
      for (let property of properties){
          //if (property=="AzaNumGroupe"){
          if (property==column){
              if ((entry[property]==value)){
                  
               cpt=cpt+1;
              }
          }
      }
  }
  
  return cpt;
}

public deleteobject(objectin :any, tabin:Object[]){
    let objectOut:Object[]=tabin;
   // objectOut.clear();
   console.log('deleteobject');
   //for (let entry of objectin){
       for (var i = 0; i < tabin.length; i++) {
       console.log('deleteobject :'+i);
       console.log('objectin.Id:'+objectin.Id);
       console.log('tabin[i]:'+tabin[i]["Id"]);
       //const properties= Object.getOwnPropertyNames(objectin[i]);
           
               if (objectin.Id==tabin[i]["Id"]){
                   console.log(' delete entry:'+objectin);
                   console.log(' delete entry:'+objectin.Id);
                   objectOut.splice(i, 1);
               }
   }
   
   return objectOut;
}
public isStartDifferent(objectin :any, tabin:Object[]):boolean{
   let objectOut:Object[]=tabin;
   let isdiff:boolean= false;
  // objectOut.clear();
  console.log('isStartDifferent');
  //for (let entry of objectin){
      for (var i = 0; i < tabin.length; i++) {
      console.log('isStartDifferent :'+i);
      console.log('objectin.Id:'+objectin.Id);
      console.log('tabin[i]:'+tabin[i]["Id"]);
      if (objectin.Id==tabin[i]["Id"]){
           if (objectin.StartTime==tabin[i]["StartTime"]){
               console.log('false');
               isdiff=false; 
               break;
           }else{
               console.log('true');
               isdiff=true;
               break;
           }
       }
  }
  return isdiff;
}
public isEndDifferent(objectin :any, tabin:Object[]):boolean{
let objectOut:Object[]=tabin;
let isdiff:boolean= false;
// objectOut.clear();
console.log('isStartDifferent');
//for (let entry of objectin){
  for (var i = 0; i < tabin.length; i++) {
  console.log('isStartDifferent :'+i);
  console.log('objectin.Id:'+objectin.Id);
  console.log('tabin[i]:'+tabin[i]["Id"]);
  if (objectin.Id==tabin[i]["Id"]){
       if (objectin.EndTime==tabin[i]["EndTime"]){
           isdiff=false;    
           break
       }else{
           isdiff=true;
           break
       }
   }
}

return isdiff;
}
public getmindateNumgroupe(objectin :Object[], numgroupe:number, column:string, value:any,isUpdate:boolean, Objupdate:Object[], bstartdifferent:boolean ){
   let objectOut:Object[]=[];
   let mindate:Date= new Date(2050, 3, 4, 0, 0)
  // objectOut.clear();
  console.log('getmindatemindateNumgroupe');
  for (let entry of objectin){
      console.log('entry');
      const properties= Object.getOwnPropertyNames(entry);
      if( entry["AzaNumGroupe"]==value){
      for (let property of properties){
          //if (property=="AzaNumGroupe"){
          if (property==column){
              
              if (entry[property]<mindate){
                  mindate=entry[property];
                  console.log('getmindate:'+mindate);
              }
          }
      }
   }
  }
  if (isUpdate) {
   console.log('isupdate:');
   if (bstartdifferent){
       console.log('istartdifferent');
   if (Objupdate !=null){
       console.log('Objupdate');
       if (Objupdate["AzaNumGroupe"]==numgroupe){
           console.log('Objupdate[column]< mindate');
           mindate =Objupdate[column]
       }
   }
}
  }
  return mindate;
}
public getmaxdateNumgroupe(objectin :Object[], numgroupe: number, column:string, value:any, isUpdate:boolean, Objupdate:Object[], benddifferent:boolean){
   let objectOut:Object[]=[];
   let maxdate:Date= new Date(2000, 3, 5, 0, 0)
  for (let entry of objectin){
      const properties= Object.getOwnPropertyNames(entry);
      if( entry["AzaNumGroupe"]==value){
      for (let property of properties){
          if (property==column){
              if (entry[property]>maxdate){
               maxdate=entry[property];
               console.log('getmaxdate:'+maxdate);
              }
          }
      }
   }
  }
  if (isUpdate) {
   if (benddifferent) {
   if (Objupdate !=null){
       if (Objupdate["AzaNumGroupe"]==numgroupe){
           maxdate =Objupdate[column]
       }
   }
}
  }
  
  return maxdate;
}
public calcultimesforalljobs(timelineResourceDatain,numgroup:number, mindate:Date, maxdate:Date, Seconds_for_a_job){
   let atimelineResourceDataout=timelineResourceDatain;
   let tempmindate=mindate;
   let tempmaxdate=maxdate;
   for (let entry of timelineResourceDatain){
       if (entry.AzaNumGroupe==numgroup){
           const properties= Object.getOwnPropertyNames(entry);
           if ( entry["AzaIsPere"]==true){
               console.log('is pere mindate:'+mindate);
               console.log('is pere maxdate:'+maxdate);
                   entry["StartTime"]=mindate;
                   entry["EndTime"]=maxdate;
               }else{
                   console.log('not is pere mindate:'+tempmindate);
                   console.log('not is pere maxdate:'+tempmaxdate);
                   entry["StartTime"]=tempmindate;
                   let tempdate=new Date(tempmindate.getTime()+Seconds_for_a_job*1000) ;
                   console.log('tempdate:'+tempdate);
                   entry["EndTime"]=tempdate;
                   tempmindate=tempdate;
               }
               
           }
       }
   
   return atimelineResourceDataout;

}
public calculDateGroup(atimelineResourceData:Object[], numGroup:number, isUpdate:boolean, Objupdate:Object[], bstartdifferent:boolean, benddifferent:boolean):Object[] {
   //atimelineResourceData=this.getObjectByAzaNumgroupe(atimelineResourceData, "AzaNumGroupe", 100);
   //atimelineResourceData=atimelineResourceData.concat( this.getObjectByAzaNumgroupe(atimelineResourceData, "AzaNumGroupe", 101));
   console.log('calculDateGroup:'+JSON.stringify(atimelineResourceData));
   let mindate=this.getmindateNumgroupe(atimelineResourceData, numGroup,  "StartTime", numGroup, isUpdate, Objupdate, bstartdifferent);
   let maxdate=this.getmaxdateNumgroupe(atimelineResourceData, numGroup,  "EndTime", numGroup, isUpdate, Objupdate, benddifferent);
   console.log('calculDateGroup mindate:'+mindate);
   console.log('calculDateGroup maxdate:'+maxdate);
   var dif = maxdate.getTime() - mindate.getTime();
   var Seconds_from_T1_to_T2 = dif / 1000;
   var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
   var cpt=this.getCountByAzaNumgroupe(atimelineResourceData,  "AzaNumGroupe", numGroup);
   console.log('calculDateGroup cpt:'+cpt)    ;
   var Seconds_for_a_job = Seconds_Between_Dates / (cpt-1);
   console.log('avant calcul mindate  '+mindate+'-maxdate '+ maxdate+'-Seconds_for_a_job '+ Seconds_for_a_job )    ;
   atimelineResourceData=this.calcultimesforalljobs(atimelineResourceData, numGroup, mindate, maxdate, Seconds_for_a_job );
   console.log(atimelineResourceData);
   this.timelineResourceDataOut=atimelineResourceData;
   return atimelineResourceData;
}
public calculDateAll(atimelineResourceData:Object[],  isUpdate:boolean, Objupdate:Object[], bstartdifferent:boolean, benddifferent:boolean):Object[]{
   //let atimelineResourceDatatemp=this.getObjectByAzaNumgroupe(atimelineResourceData, "AzaNumGroupe", 100);
   //atimelineResourceData=atimelineResourceDatatemp.concat( this.getObjectByAzaNumgroupe(atimelineResourceData, "AzaNumGroupe", 101));
  //atimelineResourceData=this.timelineResourceDataOut;
   this.timelineResourceDataOut=this.calculDateGroup(atimelineResourceData, 100, isUpdate, Objupdate, bstartdifferent, benddifferent);
   this.timelineResourceDataOut=this.calculDateGroup(atimelineResourceData, 101, isUpdate, Objupdate, bstartdifferent, benddifferent);
   this.timelineResourceDataOut=this.calculDateGroup(atimelineResourceData, 102, isUpdate, Objupdate, bstartdifferent, benddifferent);
  this.timelineResourceDataOut=this.calculDateGroup(atimelineResourceData, 103, isUpdate, Objupdate, bstartdifferent, benddifferent);
   this.timelineResourceDataOut=this.calculDateGroup(atimelineResourceData, 104, isUpdate, Objupdate, bstartdifferent, benddifferent);
   this.timelineResourceDataOut=this.calculDateGroup(atimelineResourceData, 105, isUpdate, Objupdate, bstartdifferent, benddifferent);
  return this.timelineResourceDataOut;




}
public azaactionBegin(args: any) { 
  //let  adatasource= this.eventSettings.dataSource;
  //adatasource.push(args) ;
  if (args.requestType!="toolbarItemRendering"){
      console.log('********************************************************************************actionBegin');
      console.log(''+args);
      console.log(''+this.timelineResourceDataOut);
      let bstartdifferent=this.isStartDifferent(args.data, this.timelineResourceDataOut);
      console.log('bstartdifferent:'+bstartdifferent);
      let benddifferent =this.isEndDifferent(args.data, this.timelineResourceDataOut); 
      console.log('benddifferent:'+bstartdifferent);
      this.timelineResourceDataOut=this.eventSettings.dataSource as Object[];
      console.log('timelineResourceDataOut:'+JSON.stringify( this.timelineResourceDataOut));
      let atimelineResourceData1 =this.deleteobject(args.data,this.timelineResourceDataOut);
      console.log('splice:'+atimelineResourceData1);
      atimelineResourceData1.push(args.data);
      console.log('push:'+JSON.stringify(atimelineResourceData1));
      this.eventSettings ={
       dataSource:<Object[]>extend([], this.calculDateAll(atimelineResourceData1, true,args.data, bstartdifferent, benddifferent ), null, true)
   };
  console.log('datasource:'+JSON.stringify(this.eventSettings.dataSource));
}

}
public onActionComplete() {
  this.eventSettings ={
    dataSource:<Object[]>extend([], this.calculDateAll(this.timelineResourceDataOut, false, null, false, false ), null, true )
};
}


}
