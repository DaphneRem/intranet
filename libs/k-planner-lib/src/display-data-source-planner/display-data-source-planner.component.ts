import { Component, OnInit, ViewChild,Input, Output, EventEmitter } from '@angular/core';
import { MultiSelectComponent } from '@syncfusion/ej2-angular-dropdowns';
import { DataManager, ReturnOption, Query } from '@syncfusion/ej2-data';
import { inputs } from '@syncfusion/ej2-angular-dropdowns/src/auto-complete/autocomplete.component';


@Component({
  selector: 'display-data-source-planner',
  templateUrl: './display-data-source-planner.component.html',
  styleUrls: ['./display-data-source-planner.component.scss']
})
export class DisplayDataSourcePlannerComponent implements OnInit {
  @ViewChild('checkbox')
  public mulObj: MultiSelectComponent;

@Input()  dataSource : any ;
@Input()  checkFields;
@Input()  placeholderRegie;
@Input()  changeDataSource;
@Output()  selectChipsClose = new EventEmitter<any>() ;
@Output()  resultSearch = new EventEmitter<any>() ;

public popwidth = '300px';
public CheckBox = 'CheckBox';
  constructor() { }

  ngOnInit() {
  }
  public resultFilterRegie = []
  public clickClose : boolean =  false 
  onChange(event) {
      console.log(event)
      console.log(this.mulObj)
   

      if (event.target.className == "e-chips-close e-close-hooker") {
        this.clickClose = true //output
        this.selectChipsClose.emit(this.clickClose)
        this.selectChipsClose.emit(this.mulObj.value)
        console.log(this.mulObj)
          this.resultFilterRegie = []
          this.newArraySearch=[]
      }

  }
  onOpen(event){
      console.log(event)
      console.log(this.dataSource)
      this.clickClose = false
      this.mulObj.filterType = "Contains"
      // this.mulObj.selectAllText ="Tout sélectionner"
      // this.mulObj.unSelectAllText = "Tout désélectionner"
      this.mulObj.noRecordsTemplate = " Aucune régie trouvée"
  }

  public selectRegie = false
  public numberOfClick =0
  onClose(event?) {
    
          if (this.resultFilterRegie.length > 0) {
              // this.departmentDataSource=[];
              // this.departmentDataSource = this.resultFilterRegie; //output
              

              this.resultSearch.emit(this.resultFilterRegie)
          
          }   
      
    
      console.log("click valider",event)
    
  }
  public newArraySearch =[]
  onSelectMul(event) {
      console.log(event)
      let regie = []
      regie.push(event.itemData)
  
      this.newArraySearch.push(event.itemData)
      this.resultFilterRegie =  this.newArraySearch
  

      // this.resultFilterRegie =  [...new Map( regie.map(item => [item[key], item])).values()]
      // this.resultFilterRegie = [...new Set([...this.resultFilterRegie])] 
     
      console.log(this.resultFilterRegie)
   
  }

  onFiltring(event) {
      console.log(event)
      console.log(this.mulObj)
      let e = new DataManager(this.dataSource).executeQuery(new Query().
          search(event.text, ['Text', 'libelletype'], null, true, true)).then((e: ReturnOption) => {
              
              if ((e.result as any).length > 0) {
               
                  this.mulObj['dataSource'] = e.result as any
              }

          })
      if (event.text = "" ) {
          this.mulObj['dataSource'] = this.dataSource as any
      }
  }

  onRemoveRegieList(event) {
      console.log(event)
      this.resultFilterRegie = this.resultFilterRegie.filter(item => {
          console.log(item , event.itemData)
      return  item != event.itemData})
      console.log(this.resultFilterRegie)
  }
}
