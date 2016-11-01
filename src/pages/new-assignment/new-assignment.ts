import { Component, ViewChild, ElementRef } from '@angular/core';
import { ViewController, Platform } from 'ionic-angular';
declare var google;

@Component({
    selector: 'page-new-assignment',
    templateUrl: 'new-assignment.html'
})
export class NewAssignmentPage {
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    providerLocationMarker: any;
    countdown: number = 60;

    constructor(public viewCtrl: ViewController, public platform: Platform) {
        this.platform.registerBackButtonAction(() => {
            this.cancel();
        });
    }

    ionViewDidLeave() {
        if (this.providerLocationMarker) {
            this.providerLocationMarker.setMap(null);
            this.providerLocationMarker = null;
        }
    }

    ionViewWillEnter() {
        this.loadMap();                
    }

    ionViewDidEnter() {
        setInterval(() => {
            if (this.countdown > 0) {
                this.countdown--;
            } else {
                //this.viewCtrl.dismiss();
            }
        }, 1000);
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
        this.setUserLocationMarker();              
    }

    setUserLocationMarker() {
        let location = new google.maps.LatLng(-34.41341, -58.55984);
        this.providerLocationMarker = new google.maps.Marker({
            map: this.map,
            position: location
        })
        this.map.setCenter(this.providerLocationMarker.getPosition());
    }

    cancel() {
        this.viewCtrl.dismiss();
    }
}
