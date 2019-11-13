import { Injectable } from '@angular/core';
import { MsalService} from '@azure/msal-angular';
import { Client } from '@microsoft/microsoft-graph-client';
import { OAuthSettings } from './../../../../../.privates-url';
import { UserMSAL } from './user-msal';
import { OnPremisesSamAccountName } from './on-premises-sam-account-name';

// @Injectable({
//   providedIn: 'root'
// }
@Injectable()
export class AuthService {

  public authenticated: boolean;
  public userMSAL: UserMSAL;
  public samaccountname: OnPremisesSamAccountName;
  public user;

  constructor(private msalService: MsalService) {

    this.authenticated = this.msalService.getUser() != null;
    this.getAccessToken();
    this.userMSAL = this.msalService.getUser();
    // this.getUser().then((user) => {this.userMSAL= user;});
  }

  // Prompt the userMSALto sign in and
  // grant consent to the requested permission scopes
  async signIn(): Promise<void> {
    let result = await this.msalService.loginRedirect(OAuthSettings.scopes)
      // .catch((reason) => {
      //   console.log('Login failed', JSON.stringify(reason, null, 2))
      //   //this.alertsService.add('Login failed', JSON.stringify(reason, null, 2));
      // });

    if (result) {
      this.authenticated = true;
      // this.userMSAL = await this.getUser();
    }
  }

  // Sign out
  signOut(): void {
    this.msalService.logout();
    this.userMSAL= null;
    this.authenticated = false;
  }

  // Silently request an access token
  async getAccessToken(): Promise<string> {
    let result = await this.msalService.acquireTokenSilent(OAuthSettings.scopes)
      .catch((reason) => {
      //  this.alertsService.add('Get token failed', JSON.stringify(reason, null, 2));
      console.log('Get token failed', JSON.stringify(reason, null, 2));
      });

    return result;
  }

  // async getonPremisesSamAccountName(graphClient:Client): Promise<OnPremisesSamAccountName> {
  //   try {
  //     let result =
  //     graphClient.api('/me/')
  //       .select('onPremisesSamAccountName')
  //       .get();
  //     return result;
  //   } catch (error) {
  //     console.log('Could not get events', JSON.stringify(error, null, 2));
  //    // this.alertsService.add('Could not get events', JSON.stringify(error, null, 2));
  //   }
  // }

  // private async getUser(): Promise<User> {
  //   if (!this.authenticated) return null;

  //   let graphClient = Client.init({
  //     // Initialize the Graph client with an auth
  //     // provider that requests the token from the
  //     // auth service
  //     authProvider: async(done) => {
  //       let token = await this.getAccessToken()
  //         .catch((reason) => {
  //           done(reason, null);
  //         })

  //       if (token)
  //       {
  //         done(null, token);
  //       } else {
  //         done('Could not get an access token', null);
  //       }
  //     }
  //   });

  //   this.samaccountname = await this.getonPremisesSamAccountName(graphClient);
  //   // Get the userMSALfrom Graph (GET /me)
  //   let graphuserMSAL= await graphClient.api('/me').get();
  //   let userMSAL= new User();
  //   user.samaccountname=this.samaccountname.onPremisesSamAccountName;
  //   user.displayName = graphUser.displayName;
  //   // Prefer the mail property, but fall back to userPrincipalName
  //   user.email = graphUser.mail || graphUser.userPrincipalName;

  //   console.log('graphClient => ', graphClient);
  //   return user;
  // }

}
