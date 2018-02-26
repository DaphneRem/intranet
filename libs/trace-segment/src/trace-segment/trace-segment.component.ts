import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { SupportSegment } from '../models/support-segment';
import { SupportSegmentService } from '../services/support-segment.service';

@Component({
  selector: 'trace-segment',
  templateUrl: './trace-segment.component.html',
  styleUrls: ['./trace-segment.component.scss'],
  providers: [
    SupportSegmentService
  ]
})
export class TraceSegmentComponent implements OnInit {

  public supportSegmentData;
  public automaticFilling;
  public file = {
    idSupport: '',
    numSegment: 0
  };
  public title = 'details fichier';
  public supportExist: boolean;
  public dataReady;
  constructor(
    private route: ActivatedRoute,
    private supportSegmentService: SupportSegmentService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    console.log(this.route.snapshot.children);
    console.log(this.supportExist);
    this.checkCurrentRoute();
  }

  checkCurrentRoute() {
  this.checkFilling();
  }


  checkFilling() {
    if (this.route.snapshot.children.length) {
      this.automaticFilling = true;
      this.file.idSupport = this.route.snapshot.children[0].params.idSupport;
      this.file.numSegment = +this.route.snapshot.children[0].params.numSegment;
      this.supportExist = true;
      this.getSupportSegment();
    } else {
      this.automaticFilling = false;
      this.file.idSupport = '';
      this.file.numSegment = 0;
    }
  }

  checkRouteExist() {
    console.log(this.supportSegmentData);
    this.supportSegmentService
      .getSupportSegment(this.file.idSupport, this.file.numSegment)
      .subscribe((data) => {
        this.supportSegmentData = data;
        if (Object.keys(this.supportSegmentData).length) {
            this.supportExist = true;
            this.supportSegmentData = data[0] ;
            this.router.navigate([`/detail-file/support/${this.file.idSupport}/seg/${this.file.numSegment}`]);
            this.dataReady = true;
            this.title = '';
            this.automaticFilling = false;
        } else {
          this.supportExist = false;
          this.router.navigate(['../../', 'detail-file']);
          this.file.idSupport = '';
          this.file.numSegment = 0;
          this.dataReady = false;
        }
      });
  }

  getSupportSegment(): void {
    this.dataReady = false;
    this.supportSegmentService
      .getSupportSegment(this.file.idSupport, this.file.numSegment)
      .subscribe((data) => {
        this.supportSegmentData = data[0] ;
        this.dataReady = true;
        console.log(data);
        // if (Object.keys(this.supportSegmentData).length) {
        //     this.supportExist = true;
        // } else {
        //   this.supportExist = false;
        // }
      });
  }
}



