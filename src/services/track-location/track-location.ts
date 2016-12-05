import { Injectable } from '@angular/core';
import { BackgroundGeolocation, Geoposition, Geolocation } from 'ionic-native';
import { Platform } from 'ionic-angular';
import { AuthService } from '../auth/auth';
import { LocationModel } from '../../models/location';

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

  constructor(private platform: Platform, private auth: AuthService) {
    this.platform.ready().then(() => {
      BackgroundGeolocation.configure((location) => {
        let model: LocationModel = { longitude: location.longitude, latitude: location.latitude };
        this.auth.authHttp.put(`${API_URL}worker/${this.auth.auth0User['user_id']}/location`, model).subscribe();
      }, (err) => console.log(err), this.BgConfig);

    });
  }

  startTracking() {
    this.platform.ready().then(() => {
      BackgroundGeolocation.start();
      this.watch = Geolocation.watchPosition(this.FgConfig).subscribe((location: Geoposition) => {
        let model: LocationModel = { longitude: location.coords.longitude, latitude: location.coords.latitude };
        this.auth.authHttp.put(`${API_URL}worker/${this.auth.auth0User['user_id']}/location`, model).subscribe();
      });
    });
  }

  stopTracking() {
    this.platform.ready().then(() => {
      BackgroundGeolocation.stop();
      this.watch.unsubscribe();
    });
  }
}
