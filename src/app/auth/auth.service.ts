import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthResponseDate } from './authResponseDate';
import { catchError, tap, take } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { AuthUser } from './authUser.model';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}
  tokenExpirationTimer: any;

  user = new BehaviorSubject<AuthUser>(null);

  signup(email: string, pw: string, name: string) {
    return this.http
      .post<AuthResponseDate>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDkIceXFvpTXINUMtQNJK_EBV6q0Ww84As',
        {
          email,
          password: pw,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resp) => {
          this.handleAuth(
            resp.email,
            resp.localId,
            resp.idToken,
            +resp.expiresIn,
            name
          );
          this.userService.createUser(name, resp.localId, resp.email);
        })
      );
  }

  login(email: string, pw: string) {
    return this.http
      .post<AuthResponseDate>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDkIceXFvpTXINUMtQNJK_EBV6q0Ww84As',
        {
          email,
          password: pw,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resp) => {
          this.handleAuth(
            resp.email,
            resp.localId,
            resp.idToken,
            +resp.expiresIn
          );
        })
      );
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    console.log(errorRes);
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email is already registered';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Entered PW was wrong';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Email is not found!';
        break;
    }
    return throwError(errorMessage);
  }

  private handleAuth(
    email: string,
    localID: string,
    token: string,
    expireIn: number,
    name?: string
  ) {
    const expDate = new Date(new Date().getTime() + +expireIn * 1000);

    const newUser = new AuthUser(email, localID, token, expDate, name);
    console.log('user next ' + name);
    this.user.next(newUser);

    if (!name) {
      this.userService
        .getUser(localID)
        .pipe(take(1))
        .subscribe((user) => {
          const newUser = new AuthUser(
            email,
            localID,
            token,
            expDate,
            user.name
          );
          console.log('user next with user.name updateed: ' + user.name);
          this.user.next(newUser);

          localStorage.setItem('userData', JSON.stringify(newUser));
        });
    }
    
   // this.user.next(newUser);

    localStorage.setItem('userData', JSON.stringify(newUser));
    this.autoLogout(expireIn * 1000);
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
      name: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new AuthUser(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate),
      userData.name
    );

    if (loadedUser.token) {
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
      this.user.next(loadedUser);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuraction: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuraction);
  }
}
