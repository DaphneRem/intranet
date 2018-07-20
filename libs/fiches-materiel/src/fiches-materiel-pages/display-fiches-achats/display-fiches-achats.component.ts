import {
  Component,
  OnInit,
  ViewContainerRef,
  AfterViewInit,
  ViewChild,
  ViewRef,
  TemplateRef
} from '@angular/core';

import { CustomIconBadge } from '@ab/custom-icons';

@Component({
  selector: 'display-fiches-achats',
  templateUrl: './display-fiches-achats.component.html',
  styleUrls: ['./display-fiches-achats.component.scss']
})
export class DisplayFichesAchatsComponent implements OnInit {


  // @ViewChild('vc', {read: ViewContainerRef}) vc: ViewContainerRef;

  // @ViewChild('tpl', {read: TemplateRef}) tpl: TemplateRef<any>;

  // childViewRef: ViewRef;
  // isLoading = false;


  public views = [
    {
      id: 0,
      name: 'Toutes'
    },
    {
      id: 1,
      name: 'Traitées'
    },
    {
      id: 2,
      name: 'Non traitées'
    }
  ];
  public currentView;
  public selectedView;
  public daysTableView = 3;
  public headerTableLinkExist = false;

  public icons = [];

  public fichesMaterielCreation: CustomIconBadge = {
    littleIcon: {
      circleColor: '#0EC93D',
      icon: 'icofont icofont-ui-add',
      iconSize: '1em',
      iconMargin: '6px'
    },
    bigIcon: {
      icon: 'icofont icofont-file-text',
      circleColor: '#999898'
    },
    link: '/creation'
  };
  public fichesMaterielView: CustomIconBadge = {
    littleIcon: {
      circleColor: '#3383FF',
      icon: 'icofont icofont-eye',
      iconSize: '1.5em',
      iconMargin: '2px'
    },
    bigIcon: {
      icon: 'icofont icofont-file-text',
      circleColor: '#999898'
    },
    link: '../material-sheets/my-material-sheets'
  };

  constructor() {}

  ngOnInit() {
    this.icons = [this.fichesMaterielCreation, this.fichesMaterielView];
    this.currentView = this.views[2];
    this.selectedView = this.views[2];
    // this.childViewRef = this.tpl.createEmbeddedView(null);
    // this.insertChildView();
  }

  select(view) {
    this.selectedView = view;
    console.log(this.selectedView);
  }

  submitView() {
    this.currentView = this.selectedView;
    alert(this.currentView.name);
    // this.reloadChildView();
  }

  // ngAfterViewInit() {
  //   this.childViewRef = this.tpl.createEmbeddedView(null);
  // }

  // insertChildView() {
  //   this.vc.insert(this.childViewRef);
  // }

  // removeChildView() {
  //   this.vc.detach();
  // }

  // reloadChildView() {
  //   this.removeChildView();
  //   this.isLoading = true;
  //   setTimeout(() => {
  //     this.insertChildView();
  //     this.isLoading = false;
  //   }, 1000);
  // }


}
