import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ClientModel } from '../../models/client';
import { ClientService } from '../../services/client/client';

@Component({
  selector: 'page-user-info',
  templateUrl: 'user-info.html'
})
export class UserInfoPage {
  client: ClientModel;

  constructor(public navCtrl: NavController, public navParams: NavParams, private clientService: ClientService) {
    this.client = new ClientModel();
  }

  ionViewWillEnter() {
    let id = this.navParams.get('id');
    this.clientService.get(id).then(value => {
      this.client = value;
    });
  }
}
