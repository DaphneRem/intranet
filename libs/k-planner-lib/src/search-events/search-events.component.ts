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
  providers: [
    ContainersService,
    WorkOrderService,
    SalleService]
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
    private containersService: ContainersService,
    private workorderService: WorkOrderService,
    private salleService: SalleService,
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
  search(searchString, ['Name','Operateur','typetravail','titreoeuvre','libtypeWO', 'titreepisode','numepisode','libchaine', 'Commentaire_Planning','StartTime','EndTime'], null, true, true)).then((e: ReturnOption) => {
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
           
 public  dataContainersByRessourceStartDateEndDate
public salleDataSource
 getSalleByGroup(idGroup, start, end) {
  this.timelineRessourceData ==[]
  this.salleService
      .getGroupSalle(idGroup)
      
      .subscribe(donnees => {
          //   .then(donnees => {

        
          this.salleDataSource = donnees;
         
          console.log('salles group result : ', this.salleDataSource);
          this.salleDataSource.map(item => {

              let indexSalle = this.salleDataSource.indexOf(item);
              this.getContainersByRessourceStartDateEndDate(
                  item.CodeRessource,
                  start,
                  end,
                  item.CodeSalle,
                  indexSalle,
                  idGroup
              );



          });       
      })


}

  getContainersByRessourceStartDateEndDate(coderessource, datedebut, datefin, codeSalle, indexSalle, idGroup) {


    // console.log('CALL getContainersByRessourceStartDateEndDate() with codeRegie : ', coderessource, ' / dateDebut : ', datedebut, ' / dateFin : ', datefin);
    this.timelineRessourceData ==[]
    let debut = moment(datedebut).format('YYYY-MM-DD').toString();
    let fin = moment(datefin).format('YYYY-MM-DD').toString();


    // console.log('******************************** this.lastSalleCall ===> ', this.lastSalleCall);
    // console.log('debut =>', debut);
    // console.log('fin =>', fin);

    // console.log('coderessource salle => ', coderessource);
    this.containersService
        .getContainersByRessourceStartDateEndDate(coderessource, debut, fin)
        .subscribe(res => {
            //   .then(res => {

            this.dataContainersByRessourceStartDateEndDate = res;
            // console.log('container present in regie : ',  this.dataContainersByRessourceStartDateEndDate);
            // console.log('debut =>', debut);
            // console.log('fin =>', fin);
            // console.log('coderessource salle => ', coderessource);
            // console.log("res ===>", res)

            if (res.length > 0) {
            
                this.dataContainersByRessourceStartDateEndDate.map(data => {
                    // console.log("data ===>", data)
                  
                    let dateDebut = moment(data.DateDebutTheo).format('DD/MM/YYYY').toString();
                    let dateFin = moment(data.DateFinTheo).format('DD/MM/YYYY').toString();
                    //   let arrName = data.UserEnvoi.split('-');
                    let initiales
                    if (data.UserEnvoi != null) {
                        initiales = data.UserEnvoi.slice(-1) + data.UserEnvoi.slice(0, 1);
                    } else {
                        initiales = ''
                    }
                    //  console.log(initiales,"&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
                 let Event={
                        Id: data.Id_Planning_Container,
                        Name: (data.Titre === null || typeof (data.Titre) === 'undefined') ? 'Titre' : data.Titre,
                        StartTime: dateDebut,
                        EndTime: dateFin,
                        CodeRessourceSalle: coderessource,
                        Container: true,
                        numGroup: data.Id_Planning_Container,
                        Description: data.Commentaire_Planning,
                        Operateur: data.LibelleRessourceOperateur === null ? '' : data.LibelleRessourceOperateur,
                        coordinateurCreate: (initiales === null || typeof (initiales) === 'undefined') ? '' : initiales,
                        AzaIsPere: true,
                        AzaNumGroupe: data.Id_Planning_Container,
                        DepartmentID: coderessource,
                        ConsultantID: 2,
                        DepartmentName: '',
                        IsAllDay: false,
                        Commentaire: data.Commentaire,
                        Commentaire_Planning: data.Commentaire_Planning,
                        IsReadonly: false,
                        isTempsReel: 0,
                        CodeRessourceCoordinateur: data.CodeRessourceCoordinateur,
                        CodeRessourceOperateur:data.CodeRessourceOperateur
                    }
                    // this.timelineRessourceData.push(Event);
                    // this.lastTimelineResourceDataOut.push(Event)
                  
              
                    // console.log(   this.lastTimelineResourceDataOut ,"this.lastTimelineResourceDataOut ====>>")
                    let index = this.dataContainersByRessourceStartDateEndDate.indexOf(data);
                    let length = this.dataContainersByRessourceStartDateEndDate.length;

                    // console.log('--------------------------------------------------index  length => ', index, length);
                    this.getWorkorderByContainerId(data.Id_Planning_Container, coderessource, index, length, indexSalle, debut, fin, data.LibelleRessourceOperateur);





                });
              
            
            } 
            
                

            
     

        });


}
public WorkorderByContainerId
getWorkorderByContainerId(id, coderessource, index, containerArrayLength, indexSalle, debut, fin, Operateur) {
  console.log('CALL getWorkorderByContainerId() with idContainer : ', id);
  // console.log('--------------------------------------------------indexSalle => ', indexSalle);
  // console.log('id container to check workorder => ', id)

  // console.log('index => ', indexSalle);
  // console.log('containerArrayLength => ', containerArrayLength);

  this.workorderService
      .getWorkOrderByContainerId(id)
      .subscribe(res => {
          //   .then(res => {

          // console.log('response workorder for container : ', res);
          this.WorkorderByContainerId = res;
         
          // console.log('this.WorkorderByContainerId.length => ', this.WorkorderByContainerId.length);
          let libelleStatut
          if (this.WorkorderByContainerId.length > 0) {
              this.WorkorderByContainerId.map(data => {
                  let StartTime = moment(data.DateDebutTheo, moment.defaultFormat).toDate(),
                      EndTime = moment(data.DateFinTheo, moment.defaultFormat).toDate(),
                      dateDebut = StartTime,
                      dateFin = EndTime,
                      StartTimeReel = moment(data.DateDebut, moment.defaultFormat).toDate(),
                      EndTimeReel = moment(data.DateFin, moment.defaultFormat).toDate()


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
                      coordinateurCreate: data.UserEnvoi,
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
                      Commentaire_Planning_rtf:data.Commentaire_Planning,
                      IdGenerationWO: data.IdGenerationWO,
                      isTempsReel: 0,
                      IsReadonly: false,
                      Id_Planning_Events_TempsReel: 0,
                      titreepisode: data.titreepisode,
                      DateDebutReel:StartTimeReel ,
                      DateFinReel:EndTimeReel ,
                      libelleStatut: libelleStatut,
                      CodeRessourceCoordinateur: data.CodeRessourceCoordinateur,
                      CodeRessourceOperateur:data.CodeRessourceOperateur

                  }


                  // this.timelineRessourceData.push(newWorkorderEvent);
                  console.log(   this.timelineRessourceData)
                                   
              
       
           });
          
    
          }

        });
     
      }
  

    }
