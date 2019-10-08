import { Component, OnInit } from '@angular/core';
import { CoordinateurService } from '../../services/coordinateur.service';
import { Store } from '@ngrx/store';
import { App } from 'apps/k-planner/src/app/+state/app.interfaces';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'mon-planning',
  templateUrl: './mon-planning.component.html',
  styleUrls: ['./mon-planning.component.scss'],
  providers: [
    Store,
    CoordinateurService

]
})
export class MonPlanningComponent implements OnInit {
public groupCoordinateur 
public itemCoordinateur
public isCoordinateurReady = true  
public notGotUsername = true
public user;
private onDestroy$: Subject<any> = new Subject();
  constructor( private coordinateurService: CoordinateurService,
               private store: Store<App>,) { 
                this.storeAppSubscription()
               }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.onDestroy$.next();
}
  storeAppSubscription() {
    this.store
    .pipe(takeUntil(this.onDestroy$))
        .subscribe(data => {
            console.log(data);
            this.user = data["app"].user;
            if(this.user.shortUserName != ""){
            this.getCoordinateurByUsername(this.user.shortUserName);
          }
            console.log(this.user);
        });
       
 
         
     
     
  

}
public errorUser
  getCoordinateurByUsername(Username) {

    this.coordinateurService.getCoordinateurByUsername(Username)
    .pipe(takeUntil(this.onDestroy$))
        .subscribe(item => {
            console.log('COORDINATEUR => ', item );     
            this.itemCoordinateur = item;
            this.groupCoordinateur = item.Groupe;
            console.log('COORDINATEUR GROUPE => ', this.groupCoordinateur  )
          
            this.isCoordinateurReady = true
            if(this.itemCoordinateur !== undefined){
            this.notGotUsername = false
          }
            console.log(' this.isCoordinateurReady => ',  this.isCoordinateurReady  );
  
            
        
          
        },error => {
          console.log("user not found")
          this.errorUser = true
          this.isCoordinateurReady = false
          console.log(' this.isCoordinateurReady => ',  this.isCoordinateurReady  );  
        });
   
    
}
}
