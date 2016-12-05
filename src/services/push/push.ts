import { Injectable } from '@angular/core';
import { Push } from 'ionic-native';
import { AuthHttp } from 'angular2-jwt';
import { Platform, AlertController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../auth/auth';
import { NewAssignmentPage } from '../../pages/new-assignment/new-assignment';

@Injectable()
export class PushNotificationsService {
  constructor(private authHttp: AuthHttp, private platform: Platform, private storage: Storage,
    private alertCtrl: AlertController, private authService: AuthService, private modalCtrl: ModalController) { }

  init() {
    if (this.platform.is('cordova')) {
      let push = Push.init({
        android: {
          sound: true,
          senderID: FCM_SENDER_ID,
          iconColor: '#149339'
        }
      });
      push.on('registration', response => {
        this.storage.get('deviceId').then(value => {
          if (value !== response.registrationId) {
            this.authHttp.put(`${API_URL}worker/${this.authService.profile.id}/registerdevice`, { deviceId: response.registrationId }).subscribe(() => {
              this.storage.set('deviceId', response.registrationId);
            }, () => {
              let errorAlert = this.alertCtrl.create({
                enableBackdropDismiss: true,
                buttons: [{ text: 'Aceptar' }],
                title: 'Error',
                message: 'No es posible contactar con el servidor de google, las notificaciones no estarán disponibles'
              });
              errorAlert.present();
            });
          }
        });
      });
      push.on('notification', data => {
        let modal = this.modalCtrl.create(NewAssignmentPage, { id: data.additionalData['assignmentId'] }, { enableBackdropDismiss: false });
        modal.present();
      });
    }
  }
}
