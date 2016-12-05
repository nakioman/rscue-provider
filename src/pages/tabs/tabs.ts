import { Component, ViewChild } from '@angular/core';
import { NativePageTransitions, TransitionOptions } from 'ionic-native';
import { Platform, Tabs, Tab } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { CurrentAssignmentPage } from '../current-assignment/current-assignment';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild("tabs") tabs: Tabs;
  @ViewChild("homeTab") homeTab: Tab;
  @ViewChild("currentAssignmentTab") currentAssignmentTab: Tab;

  // this tells the tabs component which Pages
  // should be each tab's root Page
  tabHomeRoot: any = HomePage;
  tabCurrentAssignmentpage: any = CurrentAssignmentPage;

  constructor(public platform: Platform, private storage: Storage) {
  }

  transitionPage() {
    if (!this.platform.is('core')) {
      let options: TransitionOptions = {
        direction: 'up',
        duration: 500,
        slowdownfactor: 3,
        slidePixels: 20,
        iosdelay: 100,
        androiddelay: 150,
        winphonedelay: 250,
        fixedPixelsTop: 0,
        fixedPixelsBottom: 60
      };
      NativePageTransitions.slide(options);
    }
  }

  ionViewWillEnter() {
    this.platform.ready().then(() => {
      this.setRootPage();
    });
  }

  private setRootPage() {
    this.storage.set('assignmentId', '58455b761d553000013e2307');
    this.storage.get('assignmentId').then(value => {
      if (value) {
        this.homeTab.show = false;
        this.currentAssignmentTab.show = true;
        this.tabs.select(1);
      }
    });
  }


}
