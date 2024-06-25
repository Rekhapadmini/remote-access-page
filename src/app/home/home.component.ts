import { Component } from '@angular/core';

import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { MsalService } from '@azure/msal-angular';
import { environment } from '@environments/environment';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    user: User | null;

    constructor(private accountService: AccountService, private authService:MsalService,) {
        this.user = this.accountService.userValue;
    }

    logoutAd()
    {
      this.authService.logoutRedirect({postLogoutRedirectUri:environment.postLogoutUrl});
    }
}
