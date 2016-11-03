import { Component } from '@angular/core';
import { NativePageTransitions, TransitionOptions } from 'ionic-native';
import { Platform } from 'ionic-angular';

import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tabHomeRoot: any = HomePage;

  constructor(public platform: Platform) {
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

  
}