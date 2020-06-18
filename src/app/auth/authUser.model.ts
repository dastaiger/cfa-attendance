export class AuthUser {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date,
    public name: string
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      console.log(new Date() + ' > ' + this._tokenExpirationDate);
      return null;
    }
    return this._token;
  }
}
