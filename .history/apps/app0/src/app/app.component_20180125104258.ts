import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']

})
export class AppComponent implements OnInit {

  constructor() { }

  title = 'app0';
  logo = 'logoABintranet';

  ngOnInit() {
  }

  onNotify(message: string): void {
    alert(message);
  }

}
