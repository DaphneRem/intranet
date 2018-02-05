import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']

})
export class AppComponent implements OnInit {
  @Output() verticalNavType: EventEmitter<string> = new EventEmitter<string>();
  constructor() { }

  title = 'app0';
  logo = 'logoABintranet';

  ngOnInit() {
    console.log(this.verticalNavType);
  }


}
