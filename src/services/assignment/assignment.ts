import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { AssignmentModel } from '../../models/assignment';

@Injectable()
export class AssignmentService {
  constructor(private authHttp: AuthHttp) { }

  public get(id: string): Promise<AssignmentModel> {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${API_URL}assignment/${id}`).subscribe(value => {
        resolve(value.json());
      }, err => reject(err));
    });
  }

  public setStatus(id: string, status: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${API_URL}assignment/${id}/status/${status}`, null).subscribe(res => {
        resolve();
      }, err => reject(err));
    });
  }
}
