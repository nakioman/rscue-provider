import { Injectable } from '@angular/core';
import { ClientModel } from '../../models/client';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class ClientService {
  constructor(private authHttp: AuthHttp) { }

  get(value: string): Promise<ClientModel> {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${API_URL}client/${value}`).subscribe(data => {
        resolve(data.json());
      }, err => reject(err));
    });
  }
}
