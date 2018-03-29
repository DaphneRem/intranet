import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'root-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() footerTitle: string;

  constructor() { }

  ngOnInit() {
  }

}
