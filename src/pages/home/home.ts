import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth';
import { TrackLocationService } from '../../services/track-location/track-location';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public auth: AuthService, private trackLocation: TrackLocationService) {
  }

  toggleInService() {
    this.auth.profile.inService = !this.auth.profile.inService;
    if (this.auth.profile.inService) {
      this.trackLocation.startTracking();
    } else {
      this.trackLocation.stopTracking();
    }
  }
}
