import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { isUndefined } from 'util';

@Component({
  selector: 'sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent implements OnInit {

public subTitle = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
  ) {

    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(() => {
        let currentRoute = this.route.root;
        do {
          const childrenRoutes = currentRoute.children;
          currentRoute = null;
          childrenRoutes.forEach(routes => {
            if (routes.outlet === 'primary') {
              this.subTitle = routes.snapshot.data.title;
              currentRoute = routes;
            }
          });
        } while (currentRoute);
        if (this.subTitle !== undefined ) {
          this.titleService.setTitle(this.subTitle);
        }
      });
  }

  ngOnInit() {
  }

}
