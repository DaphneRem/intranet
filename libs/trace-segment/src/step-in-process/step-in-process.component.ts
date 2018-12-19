import { Component, OnInit, Input, HostListener } from "@angular/core";

@Component({
  selector: 'step-in-process',
  templateUrl: './step-in-process.component.html',
  styleUrls: [
    './step-in-process.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class StepInProcessComponent implements OnInit {
  @Input() file;

  public newInnerWidth;
  public step = {
    inProgress: {
      valid: true,
      active: true,
      activeRoundColor: 'bc-c-blue',
      activeTextColor: 'c-blue'
    },
    karina: {
      valid: false,
      active: false,
      activeRoundColor: 'bc-c-yellow',
      activeTextColor: 'c-yellow'
    },
    kai: {
      valid: false,
      active: false,
      activeRoundColor: 'bc-c-pink',
      activeTextColor: 'c-pink'
    },
    completed: {
      valid: false,
      active: false,
      activeRoundColor: 'bc-c-green',
      activeTextColor: 'c-green'
    },
  };

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerWidth = event.target.innerWidth;
    console.log(this.newInnerWidth);
  }
  constructor() { }

  ngOnInit() {
    this.newInnerWidth = window.innerWidth;
    // TODO : get data to service and display step active to this.step
  }


/******** display style class ********/
  displayStepRoundClass(step) {
    if (step.active) {
      return step.activeRoundColor;
    } if (step.valid) {
      return 'bc-c-green';
    } else {
      return 'disabled';
    }
  }

  displayStepTextClass(step) {
    if (step.active) {
      return step.activeTextColor ;
    } if (step.valid) {
      return 'c-green';
    } else {
      return 'disabled';
    }
  }
/*********************************/

}
