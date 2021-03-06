import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';

import { ConnectivityService } from '../services/connectivity/connectivity';
import { AuthService } from '../services/auth/auth';
import { PushNotificationsService } from '../services/push/push';
import { TrackLocationService } from '../services/track-location/track-location';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform, private connectivityService: ConnectivityService, private authService: AuthService,
    private pushService: PushNotificationsService, private trackLocation: TrackLocationService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.backgroundColorByHexString('008d4c');
      StatusBar.overlaysWebView(false);
      this.connectivityService.setupConnectivityHandler();
      this.authService.profileLoaded.subscribe(() => {
        this.pushService.init();
        this.setupTracking();
        this.hideSplashScreen();
      });
      this.authService.initialize().catch((err) => {
          this.hideSplashScreen();
        });
    });
  }

  setupTracking() {
    if (this.authService.profile.inService) {
      this.trackLocation.startTracking();
    }
  }

  private hideSplashScreen() {
    if (Splashscreen) {
      setTimeout(() => {
        Splashscreen.hide();
      }, 100);
    }
  }

}
