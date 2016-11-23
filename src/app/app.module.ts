import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { NewAssignmentPage } from '../pages/new-assignment/new-assignment';
import { CurrentAssignmentPage } from '../pages/current-assignment/current-assignment';
import { UserInfoPage } from '../pages/user-info/user-info';

import { ConnectivityService } from '../services/connectivity/connectivity';
import { PermissionsService } from '../services/permissions/permissions';
import { AuthService } from '../services/auth/auth';

let storage = new Storage();

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    headerPrefix: 'Authorization',
    noJwtError: true,
    globalHeaders: [{ 'Accept': 'application/json' }],
    tokenGetter: (() => storage.get('id_token')),
  }), http);
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    NewAssignmentPage,
    CurrentAssignmentPage,
    UserInfoPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    Ionic2RatingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    NewAssignmentPage,
    CurrentAssignmentPage,
    UserInfoPage
  ],
  // Here we tell the Angular ErrorHandling class
  // that it should be using the IonicErrorHandler class for any errors
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    },
    Storage,
    AuthService,
    ConnectivityService,
    PermissionsService,
  ]
})
export class AppModule { }
