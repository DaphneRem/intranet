import { Component, OnInit, Input, ViewChild, EventEmitter, Output} from '@angular/core';
import { EJ2Instance } from '@syncfusion/ej2-schedule';
import { Grid } from '@syncfusion/ej2-grids';
import { DataManager, ReturnOption, Query, Predicate, } from '@syncfusion/ej2-data';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { addClass, removeClass } from '@syncfusion/ej2-base';
import { AnimationSettingsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import * as moment from 'moment';
import { ContainersService } from '../services/containers.service';
import { WorkOrderService } from '../services/workOrder.service';
import { SalleService } from '../services/salle.service';
import { ListViewComponent, ListView } from '@syncfusion/ej2-angular-lists';
import { registerEvents } from '@syncfusion/ej2-angular-base';

@Component({
  selector: 'search-events',
  templateUrl: './search-events.component.html',
  styleUrls: ['./search-events.component.scss'],

})

export class SearchEventsComponent implements OnInit {
@Input() timelineRessourceData ;
@Input() scheduleObj;
@Input() IdGroupe
@Input() regie
@Output()  selectItemInGrid = new EventEmitter<any>();

@ViewChild('grid')
public grid: GridComponent;
@ViewChild('DialogSearchEvent')
public DialogSearchEvent: any;
@ViewChild('listview')
public listview :any
  constructor(

  ) { }

  ngOnInit() {
    let startofMonth = moment().startOf('week').toDate()
    let endofMonth = moment().endOf('week').add(1, 'd').toDate();
  //  this.getSalleByGroup(this.IdGroupe,startofMonth,endofMonth )
  }

  public resultSearch :any = [];
  public search : boolean = false;
  public showCloseIcon: Boolean = true;
  public width: string = '100%';
  public animationSettings: AnimationSettingsModel = { effect: 'None' };
  public targetModal: string = '.control-section';
  public header: string = 'Events existant ';
  // public timelineRessourceData = [];
  public fields: Object = {
    dataSource: this.resultSearch,
   groupBy: 'AzaNumGroupe' ,
   id:'Id'
  };


public searchEvent 
  globalSearch(args: KeyboardEvent): void {
    console.log(args)
    let searchString: string = (args.target as HTMLInputElement).value;
    console.log(searchString)
    console.log(this.timelineRessourceData)
    if (searchString !== '') {
      this.searchEvent = args
     console.log(this.regie)
//      let newDataSource = []
// for(let i =0; i<this.timelineRessourceData.length-1;i++){
//   console.log(this.timelineRessourceData[i].CodeRessourceSalle)
//                    for(let j= 0; i<this.regie.length-1;j++){
//                      console.log(this.regie[j].Id)
//                      let codeRessource = this.regie[j].Id
//                              if(this.timelineRessourceData[i].CodeRessourceSalle === codeRessource){
//                               newDataSource.push(this.timelineRessourceData[i])
//                              }

//                    }
// }
//      console.log(newDataSource,"newDataSource ===>")
    //  console.log(this.DialogSearchEvent)
    
    //   //
      // setTimeout(() => {
      console.log(this.timelineRessourceData)
        this.dataManagerFilter(searchString)
      // }, 1000);
         
     
    } else {
      this.showSearchEvents('hide');
    }
  }


dataManagerFilter(searchString){
  new DataManager(this.timelineRessourceData).executeQuery(new Query().
  search(searchString, ['Name','Operateur','coordinateurCreate','typetravail','titreoeuvre','libtypeWO', 'titreepisode','numepisode','libchaine', 'Commentaire_Planning','StartTime','EndTime',''], null, true, true)).then((e: ReturnOption) => {
      console.log(e.result)
      this.resultSearch = e.result
    if ((e.result as any).length > 0) {
      setTimeout(() => {
        this.DialogSearchEvent.element.style.display ='block'
        this.DialogSearchEvent.show()
        let elementListView = document.getElementById('e-list-item')
        console.log(elementListView)
      }, 1000);
   
   
      // this.showSearchEvents('show', e.result);
      this.search= true
    } else {
      this.showSearchEvents('hide');
      this.search = false
    }
  });
}
 showSearchEvents(type: string, data?: Object): void {
    if (type === 'show') {
    
      // if (document.getElementById('grid').classList.contains('e-grid')) {
      //   let gridObj: Grid = (document.querySelector('#grid') as EJ2Instance).ej2_instances[0] as Grid;
      //   gridObj.dataSource = data;
      //   console.log(gridObj)
      //   gridObj.dataBind();
      // } else {
      //   let gridObj: Grid = new Grid({
      //     dataSource: data,
      //     height: 505,
      //     width: 'auto',
      //     allowSelection:true,
      //     // allowPaging:true,
      //     rowHeight:20,

      //     // pageSettings:{ pageSizes: true, pageCount: 4 },
          
      //     rowSelected:this.selectItemGrid,
          
          
      //     columns: [
      //       { field: 'Name', headerText: 'Titre',width:20 },
      //       { field: 'Operateur', headerText: 'Opérateur',width:20 },

      //       { field: 'libtypeWO', headerText: 'Type de travail',width:20 },
      //       { field: 'titreepisode', headerText: 'Titre episode',width:20,},
      //       { field: 'numepisode', headerText: 'Numéro épisode',width:20 },

      //       { field: 'libchaine', headerText: 'Chaine',width:20 },
      //       { field: 'Commentaire_Planning', headerText: 'Description',width:20 },

      //       { field: 'StartTime', headerText: 'Date debut',width:20, format: { type: 'dateTime', format: 'd/M/y hh:mm ' } },
      //       { field: 'EndTime', headerText: 'Date Fin',width:20, format: { type: 'dateTime', format: 'd/M/y hh:mm ' } },
      //     ]
      //   });
      //   console.log(gridObj)
     
        // gridObj.appendTo(document.querySelector('#grid') as HTMLElement);
        // this.scheduleObj.element.style.display = 'none';
      //}
    } else {
      this.dialogClose()
      // this.DialogSearchEvent.hide();
      // this.timelineRessourceData= []
      // let gridObj: Object[] = (document.querySelector('#grid') as EJ2Instance).ej2_instances;
      // if (gridObj && gridObj.length > 0 && !(gridObj[0] as Grid).isDestroyed) {
      //   (gridObj[0] as Grid).destroy();
       
      //}
     // this.scheduleObj.element.style.display = 'block';
    }
  }

  public dialogClose = (): void => {
    this.DialogSearchEvent.element.style.display ='none'
    console.log(this.DialogSearchEvent)
 
    console.log(this.searchEvent)
    this.searchEvent.target.value = ''
 
}
// On DialogSearchEvent open, 'dialog'  will be display
public dialogOpen = (): void => {

    console.log(this.DialogSearchEvent)
   
}



  dataBound(event){


    console.log(event)
    this.selectItemGrid(event.data)
    
    // this.scheduleObj.element.style.display = 'block';
    // console.log(this.scheduleObj);

    
    
   
  }
  selectItemGrid(data){
    console.log("call seletItemGrid ==> ",data)
    this.selectItemInGrid.emit(data.data)
    this.dialogClose()
   
    console.log(this.scheduleObj)
  }
  // let startofDay = moment().toDate()
  // let endofDay = moment().add(1, 'd').toDate();
  changeDateFormat(date) {
    let newDate = new Date(date);
    return newDate;
  }
}