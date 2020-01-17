import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

import { Store } from '@ngrx/store';

import { AppRightsService } from '../rights-app/app-rights.service';
import { UserInAppRights } from '../rights-app/user-in-app-rights';

@Injectable()
export class CanActivateApp implements CanActivate {

    constructor(
        // private store: Store<App>,
        private router: Router,
        private authService: AuthService,
        private appRightsService: AppRightsService
    ) { }

    public globalStore;
    public emailUser;

    canActivate() {
        console.log('AppGuard');
        console.log('this.authService.authenticated in canActivateApp => ', this.authService.authenticated);
        this.emailUser = this.authService.userMSAL.displayableId;
        return this.appRightsService
            .getRightsByAppAndUser('fichemateriel', this.emailUser)
            .map(data => {
                console.log('data user right in app by email => ', data);
                if ((data.Droits.hasOwnProperty('CONSULTATION') && data.Droits['CONSULTATION']) && (this.authService.authenticated)) {
                    return true;
                } else {
                    // this.router.navigateByUrl('material-sheets/all'); // redirect to 
                    return false;
                }
            });
        // this.store.subscribe(data => (this.globalStore = data));

    }

}
