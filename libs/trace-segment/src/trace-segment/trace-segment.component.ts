import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'trace-segment',
  templateUrl: './trace-segment.component.html',
  styleUrls: ['./trace-segment.component.scss']
})
export class TraceSegmentComponent implements OnInit {

  public supportSegmentData;
  public dataReady: boolean;

  public title = 'details fichier';
  public file = {
    idSupport: '',
    numSegment: 0,
    exist: false,
    autoPath : false,
    error : false,
    errorMessage: ''
  };
  public myEvent;
  constructor( 
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit() {
   console.log(this.route.snapshot.children.length);
   this.checkFilling();
   console.log(this.file.autoPath);
  }


  checkFilling() {
    if (this.route.snapshot.children.length) {
      this.file.autoPath = true;
    } else {
      this.file.autoPath = false;
    }
  }

}



