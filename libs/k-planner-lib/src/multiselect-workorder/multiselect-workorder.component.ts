import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { DialogComponent, AnimationSettingsModel } from '@syncfusion/ej2-angular-popups';
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
// import { Input } from '@syncfusion/ej2-inputs';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { Internationalization } from '@syncfusion/ej2-base';
let instance: Internationalization = new Internationalization();
@Component({
  selector: 'app-multiselect-workorder',
  templateUrl: './multiselect-workorder.component.html',
  styleUrls: ['./multiselect-workorder.component.scss']
})

export class MultiselectWorkorderComponent implements OnInit {
  @Input() eventSelect: any

  @Output()  selectItemInMulutiselction = new EventEmitter<any>()
  @ViewChild('DialogMultiSelect')
  public DialogMultiSelect: DialogComponent;
  @ViewChild('treeObjMultiSelect')
    public treeObjMultiSelect: TreeViewComponent;

    @ViewChild('grid')
    public grid: GridComponent;


 public cliqueComptEventMultiSelect : Boolean = false;
 public showCloseIcon: Boolean = true;
public width: string = '90%';
public animationSettings: AnimationSettingsModel = { effect: 'None' };
public targetModal: string = '.schedule';
public header: string = 'Eléments Sélectionnés';
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
  console.log("compt click",  this.cliqueComptEventMultiSelect )
  console.log(this.DialogMultiSelect)


  this.DialogMultiSelect.show()
  console.log(this.DialogMultiSelect)
 

}

onselectItem(args){
  console.log(args)
  this.eventSelect = this.eventSelect.filter(item =>item.Id != args.data.Id)
  this.selectItemInMulutiselction.emit(this.eventSelect)
}
onActionComplete(args){
  console.log('Action complete',args)
  

}

public format(value: Date): string {
  return instance.formatDate(value, { skeleton: 'yMd', type: 'date' });
}

changeDateFormat(date) {
  let newDate = new Date(date);
  return newDate;
}

}


