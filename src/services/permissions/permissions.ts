import { Injectable } from '@angular/core';
import { Diagnostic } from 'ionic-native';
import { Platform, AlertController } from 'ionic-angular';

@Injectable()
export class PermissionsService {
  private onDevice: boolean;

  constructor(private platform: Platform, private alertCtrl: AlertController) {
    this.onDevice = this.platform.is('cordova');
  }

  setupLocationPermisions(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.platform.ready().then(() => {
        if (this.onDevice) {
          Diagnostic.requestLocationAuthorization().then(status => {
            if (status === Diagnostic.permissionStatus.DENIED || status === Diagnostic.permissionStatus.DENIED_ALWAYS) {
              this.showMissingLocationPermissionAlert();
              resolve(false);
            } else {
              resolve(true);
            }
          }).catch(err => reject(err));
        } else {
          resolve(true);
        }
      });
    });
  }

  showMissingLocationPermissionAlert() {
    let connectivityAlert = this.alertCtrl.create({
      enableBackdropDismiss: false,
      title: 'Permisos de ubicación',
      message: 'Necesita activar los permisos de ubicación para poder utilizar la aplicación'
    });
    connectivityAlert.present();
  }
}
