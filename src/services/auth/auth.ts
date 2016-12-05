import { Storage } from '@ionic/storage';
import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import Auth0 from 'auth0-js';
import Auth0Lock from 'auth0-lock';
import { ProfileModel } from '../../models/profile';
import { AlertController, ModalController, Platform } from 'ionic-angular';
import { Splashscreen } from 'ionic-native';

@Injectable()
export class AuthService {

  jwtHelper: JwtHelper = new JwtHelper();
  auth0 = new Auth0({ clientID: AUTH0_CLIENT_ID, domain: AUTH0_DOMAIN, callbackURL: null });
  lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
    autoclose: false,
    language: 'es',
    closable: false,
    allowSignUp: false,
    auth: {
      redirect: false,
      params: {
        scope: 'openid offline_access',
      },
    }
  });
  refreshSubscription: any;
  auth0User: Object;
  zoneImpl: NgZone;
  idToken: string;
  profile: ProfileModel;
  profileLoaded: EventEmitter<boolean>;

  constructor(public authHttp: AuthHttp, zone: NgZone, private storage: Storage,
    private alertCtrl: AlertController, private modalCtrl: ModalController, private platform: Platform) {
    this.zoneImpl = zone;
    this.profileLoaded = new EventEmitter<boolean>();
    this.lock.on('authenticated', authResult => {
      this.storage.set('id_token', authResult.idToken);
      this.idToken = authResult.idToken;

      this.lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          // Handle error
          console.log(error);
          return;
        }

        profile.user_metadata = profile.user_metadata || {};
        this.storage.set('auth0User', JSON.stringify(profile));
        this.auth0User = profile;
        this.setupProfile().then(() => this.lock.hide()).catch(() => this.lock.hide());
      });

      this.storage.set('refresh_token', authResult.refreshToken);
      this.zoneImpl.run(() => this.auth0User = authResult.profile);
      // Schedule a token refresh
      this.scheduleRefresh();
    });
  }

  public initialize(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.get('auth0User').then(profile => {
        this.auth0User = JSON.parse(profile);
        this.storage.get('id_token').then(token => {
          this.idToken = token;
          if (!this.authenticated()) {
            this.getNewJwt().then(() => {
              if (!this.authenticated()) {
                this.login().then(() => resolve()).catch(err => reject(err));
              } else {
                // Schedule a token refresh
                this.scheduleRefresh();
                this.setupProfile().then(() => resolve()).catch(err => reject(err));
              }
            }).catch(() => {
              this.login().then(() => resolve()).catch(err => reject(err));
            });
          } else {
            // Schedule a token refresh
            this.scheduleRefresh();
            this.setupProfile().then(() => resolve()).catch(err => reject(err));
          }
        });
      }).catch(error => {
        reject(error);
        console.log(error);
      });
    });
    // Check if there is a profile saved in local storage
  }

  public authenticated() {
    return tokenNotExpired('id_token', this.idToken);
  }

  public login(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.lock.show();
      resolve();
      if (Splashscreen) {
        Splashscreen.hide();
      }
    });
  }

  public scheduleRefresh() {
    // If the user is authenticated, use the token stream
    // provided by angular2-jwt and flatMap the token

    let source = Observable.of(this.idToken).flatMap(
      token => {
        // The delay to generate in this case is the difference
        // between the expiry time and the issued at time
        let jwtIat = this.jwtHelper.decodeToken(token).iat;
        let jwtExp = this.jwtHelper.decodeToken(token).exp;
        let iat = new Date(0);
        let exp = new Date(0);

        let delay = (exp.setUTCSeconds(jwtExp) - iat.setUTCSeconds(jwtIat));

        return Observable.interval(delay);
      });

    this.refreshSubscription = source.subscribe(() => {
      this.getNewJwt();
    });
  }

  public unscheduleRefresh() {
    // Unsubscribe fromt the refresh
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  public getNewJwt(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Get a new JWT from Auth0 using the refresh token saved
      // in local storage
      this.storage.get('refresh_token').then(token => {
        this.auth0.refreshToken(token, (err, delegationRequest) => {
          if (err) {
            reject(err);
          } else {
            this.storage.set('id_token', delegationRequest.id_token);
            this.idToken = delegationRequest.id_token;
            resolve();
          }
        });
      }).catch(error => {
        console.log(error);
        reject(error);
      });
    });
  }

  public startupTokenRefresh() {
    // If the user is authenticated, use the token stream
    // provided by angular2-jwt and flatMap the token
    if (this.authenticated()) {
      let source = Observable.of(this.idToken).flatMap(
        token => {
          // Get the expiry time to generate
          // a delay in milliseconds
          let now: number = new Date().valueOf();
          let jwtExp: number = this.jwtHelper.decodeToken(token).exp;
          let exp: Date = new Date(0);
          exp.setUTCSeconds(jwtExp);
          let delay: number = exp.valueOf() - now;

          // Use the delay in a timer to
          // run the refresh at the proper time
          return Observable.timer(delay);
        });

      // Once the delay time from above is
      // reached, get a new JWT and schedule
      // additional refreshes
      source.subscribe(() => {
        this.getNewJwt();
        this.scheduleRefresh();
      });
    }
  }

  getProfile(workerId: string): Promise<ProfileModel> {
    return new Promise((resolve, reject) => {
      this.authHttp.get(API_URL + 'worker/' + workerId).subscribe(data => {
        this.profile = data.json();
        this.profile.inService = this.profile.status === 'Idle';
        resolve(this.profile);
      }, err => reject(err));
    });
  }

  updateProfile(profile: ProfileModel): Promise<ProfileModel> {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${API_URL}worker/${profile.id}`, profile).subscribe(data => {
      }, err => reject(err));
    });
  }

  setupProfile(): Promise<any> {
    return new Promise((resolve, reject) => {
      let clientId = this.auth0User['user_id'];
      this.getProfile(clientId).then(() => {
        this.getAvatar().then(() => {
          this.profileLoaded.emit(true);
          resolve();
        });
      }).catch(err => {
        let errorAlert = this.alertCtrl.create({
          enableBackdropDismiss: false,
          title: 'Error',
          message: 'No es posible conectarse al servidor, por favor reinicie la aplicación y asegúrese de tener internet'
        });
        errorAlert.present();
        reject(err);
      });
    });
  }

  getAvatar(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.profile.avatarUri) {
        if (this.profile.avatarUri.indexOf('http://') === 0 || this.profile.avatarUri.indexOf('https://') === 0) {
          this.profile.imageBase64 = this.profile.avatarUri;
        } else {
          this.profile.imageBase64 = 'assets/img/nobody.jpg';
        }
      } else {
        this.profile.imageBase64 = 'assets/img/nobody.jpg';
      }
      resolve();
    });
  }
}
