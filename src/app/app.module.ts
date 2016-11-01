import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { Ionic2RatingModule } from 'ionic2-rating';
import { NewAssignmentPage } from '../pages/new-assignment/new-assignment';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    NewAssignmentPage
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
    NewAssignmentPage
  ],
  providers: []
})
export class AppModule {}
