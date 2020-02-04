import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

import { Store } from '@ngrx/store';
import { App } from '../+state/app.interfaces';

import { AppRightsService } from '../rights-app/app-rights.service';
import { UserInAppRights } from '../rights-app/user-in-app-rights';

@Injectable()
export class CanActivateApp implements CanActivate {

    constructor(
        private appStore: Store<App>,
        private router: Router,
        private authService: AuthService,
        private appRightsService: AppRightsService
    ) { }

    public globalStore;
    public emailUser;

    canActivate() {
        console.log('AppGuard');
        this.appStore.subscribe(data => (this.globalStore = data));
        console.log('this.authService.authenticated in canActivateApp => ', this.authService.authenticated);
        this.emailUser = this.authService.userMSAL.displayableId;
        return this.appRightsService
            .getRightsByAppAndUser('fichemateriel', this.emailUser)
            .map(data => {
                console.log('data user right in app by email => ', data);
                if ((data.Droits.hasOwnProperty('CONSULTATION') && data.Droits['CONSULTATION']) && (this.authService.authenticated)) {
                    console.log('data.Droits.CONSULTATION exist and true => ');
                    this.appStore.dispatch({
                        type: 'ADD_USER_RIGHTS',
                        payload: {
                            user: {
                                rights: {
                                    modification: data.Droits['MODIFICATION'],
                                    consultation: data.Droits['CONSULTATION'],
                                    presse: data.Droits['PRESSE']
                                }
                            }
                        }
                    });
                    return true;
                } else {
                    console.log('data.Droits.CONSULTATION not exist');
                    this.router.navigateByUrl('/access-denied');
                    return false;
                }
            });
        // this.store.subscribe(data => (this.globalStore = data));

    }

}
