import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent implements OnInit {
  @Input() goBack: boolean;
  @Input() changeView: boolean;

  @Input() link: string;
  @Input() tableView: boolean;
  @Input() title: string;

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
  }

}
