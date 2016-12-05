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
    let profile = this.auth.profile;
    if (this.auth.profile.inService) {
      this.trackLocation.startTracking();
      profile.status = 'Idle';
    } else {
      this.trackLocation.stopTracking();
      profile.status = 'Offline';
    }
    this.auth.updateProfile(profile);
  }
}
