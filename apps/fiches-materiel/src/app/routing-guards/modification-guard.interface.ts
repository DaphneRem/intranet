import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

import { AppRightsService } from '../rights-app/app-rights.service';
import { UserInAppRights } from '../rights-app/user-in-app-rights';

@Injectable()
export class CanActivateModification implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService,
        private appRightsService: AppRightsService
    ) {}

    public emailUser;

  canActivate() {
    console.log('ModificationGuard');
    console.log('this.authService.authenticated in canActivateModification => ', this.authService.authenticated)
    this.emailUser = this.authService.userMSAL.displayableId;
    return this.appRightsService
        .getRightsByAppAndUser('fichemateriel', this.emailUser)
        .map(data => {
            console.log('data user right in app by email => ', data);
            if ((data.Droits['MODIFICATION']) && (this.authService.authenticated)) {
                return true;
            } else {
                this.router.navigateByUrl('material-sheets/all');
                return false;
            }
        });

  }
}
