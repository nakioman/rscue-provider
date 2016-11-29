export class ProfileModel {
  public name: string;
  public lastName: string;
  public avatarUri: string;
  public email: string;
  public phoneNumber: string;
  public id: string;
  public imageBase64: string;
  public inService: boolean;
  public status: string;

  constructor() {
    this.imageBase64 = 'assets/img/nobody.jpg';
  }
}
