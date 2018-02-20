import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { isUndefined } from 'util';

@Component({
  selector: 'sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent implements OnInit {
  @Input() tableView: boolean;
  @Input() link: string;
  @Input() goBack: boolean;

  public changeView = false;
  public subTitle = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
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
        if (this.subTitle !== undefined) {
          this.titleService.setTitle(this.subTitle);
        }
      });
  }

  ngOnInit() {
    if (this.subTitle === 'Numérisation') {
      this.changeView = true;
    }
  }

}
