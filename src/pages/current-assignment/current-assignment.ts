import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
declare var google: any;

import { UserInfoPage } from '../user-info/user-info';

@Component({
    selector: 'page-current-assignment',
    templateUrl: 'current-assignment.html'
})
export class CurrentAssignmentPage {
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    currentPositionMarker: any;
    userPositionMarker: any;

    constructor(public navCtrl: NavController) {
    }

    ionViewWillEnter() {
        this.loadMap();
        this.setupCurrentPositionTracking();
        this.setupUserPositionMarker();
    }

    loadMap() {
        let location = new google.maps.LatLng(-34.41341, -58.55984);
        this.map = new google.maps.Map(this.mapElement.nativeElement,
        {
            center: location,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false
        });
    }

    setupCurrentPositionTracking() {
        Geolocation.getCurrentPosition().then(position => {
            //let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            let latLng =  new google.maps.LatLng(-34.404687, -58.520250);
            this.currentPositionMarker = new google.maps.Marker({
                position: latLng,
                map: this.map,
                icon: 'assets/img/location.png',
                optimized: false,
                visible: true,
                title: 'I might be here'
            });
            this.fitBounds();
        });
        Geolocation.watchPosition().subscribe(position => {
            //let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            //this.currentPositionMarker.setPosition(latLng);
        });
    }

    setupUserPositionMarker() {
        let location = new google.maps.LatLng(-34.41341, -58.55984);
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

    endAssignment() {
        this.navCtrl.pop();
    }

    userInfo() {
      this.navCtrl.push(UserInfoPage);
    }

}
