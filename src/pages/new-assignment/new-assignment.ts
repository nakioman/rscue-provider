import { Component, ViewChild, ElementRef } from '@angular/core';
import { ViewController, Platform, NavController, NavParams } from 'ionic-angular';
declare var google;
import { CurrentAssignmentPage } from '../current-assignment/current-assignment';
import { AssignmentModel } from '../../models/assignment';
import { AssignmentService } from '../../services/assignment/assignment';
import { AuthService } from '../../services/auth/auth';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-new-assignment',
  templateUrl: 'new-assignment.html'
})
export class NewAssignmentPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  userLocationMarker: any;
  countdown: number = 60;
  assignment: AssignmentModel;
  intervalId: number;

  constructor(public viewCtrl: ViewController, public platform: Platform, public navCtrl: NavController,
    private navParams: NavParams, private assignmentService: AssignmentService, private auth: AuthService,
    private storage: Storage) {
    this.platform.registerBackButtonAction(() => {
      this.cancel();
    });
    this.assignment = new AssignmentModel();
  }

  ionViewDidLeave() {
    clearInterval(this.intervalId);
    if (this.userLocationMarker) {
      this.userLocationMarker.setMap(null);
      this.userLocationMarker = null;
    }
  }

  ionViewWillEnter() {
    this.assignmentService.get(this.navParams.get('id')).then(value => {
      this.assignment = value;
      this.loadMap();
    });
  }

  ionViewDidEnter() {
    this.intervalId = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.assignmentService.setStatus(this.assignment.id, 'Cancelled');
        this.viewCtrl.dismiss();
      }
    }, 1000);
  }

  loadMap() {
    let location = new google.maps.LatLng(this.assignment.latitude, this.assignment.longitude);
    this.map = new google.maps.Map(this.mapElement.nativeElement,
      {
        center: location,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false
      });
    this.setUserLocationMarker();
  }

  setUserLocationMarker() {
    let location = new google.maps.LatLng(this.assignment.latitude, this.assignment.longitude);
    this.userLocationMarker = new google.maps.Marker({
      map: this.map,
      position: location
    })
    this.map.setCenter(this.userLocationMarker.getPosition());
  }

  cancel() {
    this.assignmentService.setStatus(this.assignment.id, 'Cancelled');
    this.viewCtrl.dismiss('cancel');
  }

  accept() {
    this.assignmentService.setStatus(this.assignment.id, 'InProgress').then(() => {
      this.storage.set('assignmentId', this.assignment.id);
      this.auth.profile.status = 'Working';
      this.auth.updateProfile(this.auth.profile);
      this.navCtrl.setRoot(CurrentAssignmentPage);
      this.viewCtrl.dismiss('accept');
    });
  }
}
