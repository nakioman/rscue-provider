import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  rate:number = 3;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
}
