import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CourseService } from './course/course.service';

import { Course } from './course/course.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { faDumbbell } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from './auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'cfa-attendance';
  subCS: Subscription;

  faDumbbell = faDumbbell;
  error = null;

  // data fetching in process?
  isFetching = false;

  // date = new Date();
  // day = this.date.getDay();
  // year = this.date.getFullYear();
  // calWeek = new DatePipe('de').transform(this.date, 'w');

  username = '';

  constructor(private authService: AuthService) {}

  // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Date good doku,

  // getDate for the Day of the month as reverence
  // getDay to adjust to weekdays, getMonth + Year to reference.
  // Use SetDate to clearn the hours etc.?

  ngOnInit() {
    this.authService.autoLogin();
    this.authService.user.pipe(take(1)).subscribe((user) => {
      this.username = user.name;
      console.log('Auto Login got this username:' + user.name);
    });
    // this.router.navigate(['/course', cw]);
  }

  ngOnDestroy() {
    this.subCS.unsubscribe();
  }
}
