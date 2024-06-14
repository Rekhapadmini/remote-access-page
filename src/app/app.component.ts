import { Component, Inject } from '@angular/core';

import { AccountService } from './_services';
import { User } from './_models';
import { Subject } from 'rxjs/internal/Subject';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AzureAdService } from './_services/azure-ad.service';
import { environment } from 'src/environments/environment';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { filter, takeUntil } from 'rxjs';

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent {
    user?: User | null;

    isUserLoggedIn:boolean=false;
    userName?:string='';
    private readonly _destroy=new Subject<void>();

    constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig:MsalGuardConfiguration,
    private accountService: AccountService,
    private msalBroadCastService:MsalBroadcastService,
    private authService:MsalService,
    private azureAdSerice:AzureAdService) {
        this.accountService.user.subscribe(x => this.user = x);
    }
    ngOnInit(): void {
      this.msalBroadCastService.inProgress$.pipe
      (filter((interactionStatus:InteractionStatus)=>
      interactionStatus==InteractionStatus.None),
      takeUntil(this._destroy))
      .subscribe(x=>
        {
          this.isUserLoggedIn=this.authService.instance.getAllAccounts().length>0;

          if(this.isUserLoggedIn)
          {
            this.userName = this.authService.instance.getAllAccounts()[0].name;
          }
          this.azureAdSerice.isUserLoggedIn.next(this.isUserLoggedIn);
        })
    }
    ngOnDestroy(): void {
     this._destroy.next(undefined);
     this._destroy.complete();
    }
    loginAd()
    {
      if(this.msalGuardConfig.authRequest)
      {
        this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest)
      }
      else
      {
        this.authService.loginRedirect();
      }
    }
    logoutAd()
    {
      this.authService.logoutRedirect({postLogoutRedirectUri:environment.postLogoutUrl});
    }
    logout() {
        this.accountService.logout();
    }
}
