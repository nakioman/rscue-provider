import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController, Tabs, Platform } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
declare var google: any;
import { UserInfoPage } from '../user-info/user-info';
import { AssignmentModel } from '../../models/assignment';
import { AssignmentService } from '../../services/assignment/assignment';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-current-assignment',
  templateUrl: 'current-assignment.html'
})
export class CurrentAssignmentPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  currentPositionMarker: any;
  userPositionMarker: any;
  assignment: AssignmentModel;


  constructor(public navCtrl: NavController, private storage: Storage, private assignmentService: AssignmentService,
    private alertCtrl: AlertController, private platform: Platform) {
    this.assignment = new AssignmentModel();
  }

  ionViewWillEnter() {
    this.platform.ready().then(() => {
      this.storage.get('assignmentId').then(value => {
        if (value) {
          this.assignmentService.get(value).then(value => {
            this.assignment = value;
            this.loadMap();
          });
        }
      });
    });
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
    this.setupCurrentPositionTracking();
    this.setupUserPositionMarker();
  }

  setupCurrentPositionTracking() {
    Geolocation.getCurrentPosition({ enableHighAccuracy: true, maximumAge: 15000 }).then(position => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.currentPositionMarker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        icon: 'assets/img/location.png',
        optimized: false,
        visible: true,
        title: 'I might be here'
      });
      this.fitBounds();
    }).catch((err) => {
      console.log(err);
    });
    Geolocation.watchPosition().subscribe(position => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.currentPositionMarker.setPosition(latLng);
    });
  }

  setupUserPositionMarker() {
    let location = new google.maps.LatLng(this.assignment.latitude, this.assignment.longitude);
    this.userPositionMarker = new google.maps.Marker({
      position: location,
      map: this.map
    });
    this.fitBounds();
  }

  fitBounds() {
    let bounds = new google.maps.LatLngBounds();
    if (this.currentPositionMarker) {
      bounds.extend(this.currentPositionMarker.getPosition());
    }
    if (this.userPositionMarker) {
      bounds.extend(this.userPositionMarker.getPosition());
    }
    this.map.fitBounds(bounds);
  }

  cancelAssignment() {
    let alert = this.alertCtrl.create({
      title: 'Cancelar misión',
      message: 'Esta seguro de cancelar la misión?',
      buttons: [{
        text: 'No',
        role: 'cancel'
      },
      {
        text: 'Si',
        handler: () => {
          this.assignmentService.setStatus(this.assignment.id, 'Cancelled');
          this.storage.remove('assignmentId');
          this.setupHomeTab();
        }
      }]
    });
    alert.present();
  }

  endAssignment() {
    this.navCtrl.pop();
  }

  userInfo() {
    this.navCtrl.push(UserInfoPage, { id: this.assignment.clientId });
  }

  setupHomeTab() {
    let tabs: Tabs = this.navCtrl.parent;
    tabs.getByIndex(0).show = true;
    tabs.getByIndex(1).show = false;
    tabs.select(0);
  }

}
