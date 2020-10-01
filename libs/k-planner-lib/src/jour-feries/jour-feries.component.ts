import { Component, OnInit } from '@angular/core';
import { addClass } from '@syncfusion/ej2-base';

@Component({
  selector: 'jour-feries',
  templateUrl: './jour-feries.component.html',
  styleUrls: ['./jour-feries.component.scss']
})
export class JourFeriesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  getJourFerier(args,element){
    console.log("******jour ferier ****", )

    if (args === 10) {
        // let span: HTMLElement;
        //  span = document.createElement('span');
        //  span.setAttribute('class', 'e-icons highlight');
         addClass([element.children[0]], ['special']);
          // element.setAttribute('title', 'Birthday !');

        //  element.appendChild(span);
         console.log(element)
         console.log(document.getElementsByClassName('.special'))
     }
     if (args === 15) {
        //  let span: HTMLElement;
        //  span = document.createElement('span');
        //  span.setAttribute('class', 'e-icons highlight');
         addClass([element], ['special']);
          // element.setAttribute('title', 'Farewell !');
 
        //  element.appendChild(span);
     }
     if (args === 20) {
        // let span: HTMLElement;
        //  span = document.createElement('span');
        //  span.setAttribute('class', 'e-icons highlight');
         addClass([element], ['special']);
        //  element.setAttribute('title', 'Vacation !');
      
        // element.appendChild(span);
     }
}
}
