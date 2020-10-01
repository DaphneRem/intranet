import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { DialogComponent, AnimationSettingsModel } from '@syncfusion/ej2-angular-popups';
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
// import { Input } from '@syncfusion/ej2-inputs';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { Internationalization } from '@syncfusion/ej2-base';
import { outputs } from '@syncfusion/ej2-angular-popups/src/tooltip/tooltip.component';
let instance: Internationalization = new Internationalization();
@Component({
  selector: 'app-multiselect-workorder',
  templateUrl: './multiselect-workorder.component.html',
  styleUrls: ['./multiselect-workorder.component.scss',
  '../../../../assets/icon/icofont/css/icofont.scss'
]
})

export class MultiselectWorkorderComponent implements OnInit {
  @Input() eventSelect: any
  
  @Output()  selectItemInMulutiselction = new EventEmitter<any>();
  @Output() deplacementMultipleEvent =  new EventEmitter<any>();
  @Output() clickBtnDeplacement =  new EventEmitter<any>();
  
  @ViewChild('DialogMultiSelect')
  public DialogMultiSelect: DialogComponent;
  @ViewChild('treeObjMultiSelect')
    public treeObjMultiSelect: TreeViewComponent;

    @ViewChild('grid')
    public grid: GridComponent;

  public clickDeplacementMultiple : boolean  = false;
 public cliqueComptEventMultiSelect : boolean = false;
 public showCloseIcon: boolean = true;
public width: string = '95%';
public animationSettings: AnimationSettingsModel = { effect: 'None' };
public targetModal: string = '.schedule';
public header: string
public data

//listview init 
public fields: Object = {
  dataSource: this.eventSelect,
 groupBy: 'AzaNumGroupe' ,
 id:'Id'
};

//list
  constructor() {

   }

  ngOnInit() {
    this.data = this.eventSelect

  }
  public dialogClose = (): void => {
    // document.getElementById('dlgbtn').style.display = '';
    console.log(this.DialogMultiSelect)
}
// On DialogMultiSelect open, 'Open' Button will be hidden
public dialogOpen = (): void => {
    // document.getElementById('dlgbtn').style.display = 'none';
    console.log(this.DialogMultiSelect)
}

// e-list-item
public confirmDlgBtnClick = (): void => {
    this.DialogMultiSelect.hide();
    console.log(this.DialogMultiSelect)
}
onCliqueComptEventSelect(){
  this.cliqueComptEventMultiSelect = true;
  this.clickDeplacementMultiple = false;
  this.width = '95%';
  this.header= 'Eléments Sélectionnés';
  console.log("compt click",  this.cliqueComptEventMultiSelect )
  console.log(this.DialogMultiSelect)

setTimeout(() => {
  this.DialogMultiSelect.show()
  console.log(this.DialogMultiSelect)
}, 100);

 

}
public numberOfEventSelect = 0
onselectItem(args){
  console.log(args)
  this.eventSelect = this.eventSelect.filter(item =>item.Id != args.data.Id)
  this.numberOfEventSelect = this.eventSelect.length
  this.selectItemInMulutiselction.emit(this.eventSelect)
}
onActionComplete(args){
  console.log('Action complete',args)


}
deplacementMultiple(){

  this.cliqueComptEventMultiSelect = false;
  this.width = '95%';
  this.header= 'Sélectionnez une date';
  this.clickDeplacementMultiple = true;

    setTimeout(() => {
      console.log(document.getElementsByClassName('.dialog-Class'))
      this.DialogMultiSelect.show()
      this.clickBtnDeplacement.emit()
      console.log(this.DialogMultiSelect)
    }, 100);
    
  

}
public format(value: Date): string {
  return instance.formatDate(value, { skeleton: 'yMd', type: 'date' });
}

changeDateFormat(date) {
  let newDate = new Date(date);
  return newDate;
}
onValueChange(args: any):void {
console.log(args);
this.deplacementMultipleEvent.emit(args);
this.DialogMultiSelect.hide();
}
}


