import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'modal-animation',
  templateUrl: './modal-animation.component.html',
  styleUrls: ['./modal-animation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalAnimationComponent implements OnInit {

  @Input() modalClass: string;
  @Input() contentClass: string;
  @Input() modalID: string;
  @Input() backDrop = false;

  constructor() { }

  ngOnInit() {
  console.log(this.modalID);
  }

  close(event) {
    document.querySelector('#' + event).classList.remove('md-show');
  }
}
