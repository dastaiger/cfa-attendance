import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AuthUser } from '../auth/authUser.model';
import { User } from './User.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  user = new BehaviorSubject<User>(null);

  createUser(name: string, id: string, email: string) {
    const usr = new User(email, id, name);
    this.http
      .put('https://cfa-attendance.firebaseio.com/users/' + id + '.json', usr)
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  getUser(id: string) {
    return this.http.get<User>(
      'https://cfa-attendance.firebaseio.com/users/' + id + '.json'
    );
  }
}
