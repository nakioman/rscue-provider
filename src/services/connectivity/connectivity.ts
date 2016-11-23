import { Injectable } from '@angular/core';
import { Network } from 'ionic-native';
import { Platform, AlertController, Alert } from 'ionic-angular';

declare var Connection;

@Injectable()
export class ConnectivityService {
  private onDevice: boolean;

  constructor(private platform: Platform, private alertCtrl: AlertController) {
    this.onDevice = this.platform.is('cordova');
  }

  public isOnline(): boolean {
    if (this.onDevice && Network.connection) {
      return Network.connection !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }

  public isOffline(): boolean {
    if (this.onDevice && Network.connection) {
      return Network.connection === Connection.NONE;
    } else {
      return !navigator.onLine;
    }
  }

  public setupConnectivityHandler() {
    var connectivityAlert: Alert;
    let onOnline = () => {
      connectivityAlert.dismiss();
    };
    let onOffline = () => {
      connectivityAlert = this.alertCtrl.create({
        enableBackdropDismiss: false,
        title: 'Sin conexión',
        message: 'Necesita conexión a internet para poder utilizar la aplicación'
      });
      connectivityAlert.present();
    };
    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);
  }
}
