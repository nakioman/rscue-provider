import { Injectable } from '@angular/core';
import { ClientModel } from '../../models/client';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class ClientService {
  client: ClientModel;

  constructor(private authHttp: AuthHttp) { }

  get(value: string): Promise<ClientModel> {
    return new Promise((resolve, reject) => {
      if (this.client) {
        resolve(this.client);
      } else {
        this.authHttp.get(`${API_URL}client/${value}`).subscribe(data => {
          this.client = data.json();
          resolve(this.client);
        }, err => reject(err));
      }
    });
  }
}
