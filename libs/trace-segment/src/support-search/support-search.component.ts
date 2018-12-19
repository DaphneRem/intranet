import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

import { SupportSegment } from '../models/support-segment';
import { SupportSegmentService } from '../services/support-segment.service';

import { Store } from '@ngrx/store';

import { LastSearch, LastSearchState } from './+state/support-search.interfaces';
import { lastSearchInitialState } from './+state/support-search.init';

@Component({
  selector: 'support-search',
  templateUrl: './support-search.component.html',
  styleUrls: ['./support-search.component.scss'],
  providers: [
    SupportSegmentService,
    Store
  ]
})
export class SupportSearchComponent implements OnInit {
  @Input() file;

  public supportSegmentData;
  public dataReady: boolean;
  public title: string;
  public segmentTitle: string;
  public oeuvreTitle: string;
  public errorMessageNoData = 'Les données sont momentanément indisponibles, veuillez essayer ultérieurement.';
  public error = {
      statut: false,
      message: ''
  };
  public search = {
    statut : false,
    idSupport : '',
    numSegment : 0
  };

  constructor(
    private route: ActivatedRoute,
    private supportSegmentService: SupportSegmentService,
    private location: Location,
    private router: Router,
    private store: Store<LastSearchState>
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        // trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        // if you need to scroll back to top, here is the right place
        window.scrollTo(0, 0);
      }
    });
    store.select('lastSearch').subscribe((lastSearch: any) => {
      this.searchStore = lastSearch;
    });


  }
    searchStore: LastSearch;

  ngOnInit() {
    console.log(this.file.autoPath);
    console.log(this.route.snapshot.children);
    console.log(this.file.exist);
    this.checkCurrentRoute(); // define autoPath statut
    console.log(this.searchStore);
  }

// define autoPath statut
  checkCurrentRoute() {
    if (this.route.snapshot.children.length) { // auto path
      this.file.autoPath = true;
      this.file.idSupport = this.route.snapshot.children[0].params.idSupport;
      this.file.numSegment = +this.route.snapshot.children[0].params.numSegment;
      this.file.exist = true;
      // if auto path, do data request with params route elements
      this.getSupportSegment();

    }
    // else { // manual path
    //   this.file.autoPath = false;
    //   this.file.idSupport = '';
    //   this.file.numSegment = 0;
    //   this.file.exist = false;
    // }
  }

  checkRouteExist(            ) { // onclick button submit
    console.log(this.supportSegmentData);
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
    this.dataReady = false;
    this.error.statut = false;
  console.log(this.file.idSupport + this.file.numSegment);
    this.search.statut = true;
    this.supportSegmentService
      .getSupportSegment(this.file.idSupport, this.file.numSegment)
      .subscribe(
        (data) => {
          this.supportSegmentData = data;
          console.log(this.supportSegmentData);
          if (this.supportSegmentData === 0) { // body request is undefine (service return 0)
            console.log('ok c bn');
            this.error.statut = true;
            this.error.message = this.errorMessageNoData; // display custom message for unavailable data
                // this.file.error = true;
                // this.file.errorMessage = this.errorMessageNoData;
            this.store.dispatch({ type: 'ERROR_SEARCH', payload: { idSupport: this.file.idSupport, numSeg: this.file.numSegment} });
            console.log(this.router.routeReuseStrategy);          }
          if (Object.keys(this.supportSegmentData).length) {
              this.file.exist = true;
              this.router.navigate([`../../detail-file/support/${this.file.idSupport}/seg/${this.file.numSegment}`]);
              this.dataReady = true;
              this.file.autoPath = false;
              this.title = this.supportSegmentData.titreseg;
              this.store.dispatch({ type: 'NO_ERROR_SEARCH', payload: { idSupport: this.file.idSupport, numSeg: this.file.numSegment} });

          } else {
            this.store.dispatch({ type: 'ERROR_SEARCH', payload: { idSupport: this.file.idSupport, numSeg: this.file.numSegment} });
            this.supportNoExist();

          }
        }
    );
  }
  newSearch() {
    this.router.navigate(['../../', 'detail-file']);
    this.file.idSupport = '';
    this.file.numSegment = 0;
    this.dataReady = false;
  }
  supportNoExist() {
    this.file.exist = false;
    this.search.idSupport = this.file.idSupport;
    this.search.numSegment = this.file.numSegment;
    this.router.navigate(['../../', 'detail-file']);
    this.file.idSupport = '';
    this.file.numSegment = 0;
    this.dataReady = false;
  }

  getSupportSegment(): void { // check url
    this.dataReady = false;
    this.supportSegmentService
      .getSupportSegment(this.file.idSupport, this.file.numSegment)
      .subscribe((data) => {
        this.supportSegmentData = data ;
        this.dataReady = true;
        console.log(this.supportSegmentData);
          if (this.supportSegmentData === 0) { // body request is undefine (service return 0)
            this.error.statut = true;
            this.error.message = this.errorMessageNoData;
            this.search.statut = true;
            this.store.dispatch({ type: 'ERROR_SEARCH', payload: { idSupport: this.file.idSupport, numSeg: this.file.numSegment} });

          }
          if (Object.keys(this.supportSegmentData).length) {
              this.file.exist = true;
              this.segmentTitle = this.supportSegmentData.titreseg;
              this.oeuvreTitle = this.supportSegmentData.titreoeuvre;
              this.store.dispatch({ type: 'NO_ERROR_SEARCH', payload: { idSupport: this.file.idSupport, numSeg: this.file.numSegment} });
          } else {
            this.file.exist = false;
            this.store.dispatch({ type: 'ERROR_SEARCH', payload: { idSupport: this.file.idSupport, numSeg: this.file.numSegment} });
          }
        }
    );
  }
}
