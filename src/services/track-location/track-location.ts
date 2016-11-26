import { Injectable } from '@angular/core';
import { BackgroundGeolocation, Geoposition, Geolocation } from 'ionic-native';
import { Platform } from 'ionic-angular';

@Injectable()
export class TrackLocationService {
  BgConfig = {
    desiredAccuracy: 100,
    stationaryRadius: 100,
    distanceFilter: 10,
    interval: 5000,
    notificationTitle: 'Rscue center - en servicio',
    notificationText: 'Rastrando la ubicación actual',
    maxLocations: 10
  };
  FgConfig = {
    frequency: 3000,
    enableHighAccuracy: true
  };
  watch: any;

  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      BackgroundGeolocation.configure((location) => {
        console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
      }, (err) => console.log(err), this.BgConfig);

    });
  }

  startTracking() {
    this.platform.ready().then(() => {
      BackgroundGeolocation.start();
      this.watch = Geolocation.watchPosition(this.FgConfig).subscribe(this.getPosition);
    });
  }

  getPosition(location: Geoposition) {
    console.log('ForeGroundGeolocation:  ' + location.coords.latitude + ',' + location.coords.longitude);
  }

  stopTracking() {
    this.platform.ready().then(() => {
      BackgroundGeolocation.stop();
      this.watch.unsubscribe();
    });
  }
}
