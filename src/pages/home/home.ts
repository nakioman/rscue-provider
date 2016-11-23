import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public auth: AuthService) {
  }

  openModal() {
  }
}
