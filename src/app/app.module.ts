import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { HomeComponent } from './home';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalModule, MsalRedirectComponent, MsalService } from '@azure/msal-angular';
import { environment } from '@environments/environment';
import { BrowserCacheLocation, IPublicClientApplication, InteractionType, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { AzureAdService } from './_services/azure-ad.service';
// authority: `https://login.microsoftonline.com/${environment.tenantName}.onmicrosoft.com/`,

const isIE=window.navigator.userAgent.indexOf('MSIE')>-1 || window.navigator.userAgent.indexOf('Trident/')>-1

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        MsalModule.forRoot(new PublicClientApplication
          (
            {
              auth:{
                clientId: environment.clientId,
                redirectUri:environment.redirectUrl,
                authority:`https://login.microsoftonline.com/${environment.tenantName}`
              },
              cache:
              {
                cacheLocation:'localStorage',
                storeAuthStateInCookie:isIE
              }
            }
          ),
          {
            interactionType:InteractionType.Redirect,
            authRequest:{
              scopes:['user.read']
            }
          },
          {
            interactionType:InteractionType.Redirect,
            protectedResourceMap:new Map(
              [
                ['https://graph.microsoft.com/v1.0/me',['user.Read']],
                ['localhost',['api://apiUri/api.scope']]
              ]
            )
          }
          )
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide:HTTP_INTERCEPTORS, useClass:MsalInterceptor, multi:true},
        MsalGuard,
        AzureAdService,
        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { };
