import { Component } from '@angular/core';
import { ModalController, NavParams } from 'ionic-angular';

import { NewAssignmentPage } from '../new-assignment/new-assignment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  rate:number = 3;
  
  constructor(public modalCtrl: ModalController, public navParams: NavParams) {
  }

  openModal() {
    let modal = this.modalCtrl.create(NewAssignmentPage);
    modal.present();
  }
}
