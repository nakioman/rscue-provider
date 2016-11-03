import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';

import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { NewAssignmentPage } from '../pages/new-assignment/new-assignment';
import { CurrentAssignmentPage } from '../pages/current-assignment/current-assignment';
import { UserInfoPage } from '../pages/user-info/user-info';

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
  providers: []
})
export class AppModule {}
