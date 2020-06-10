import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CourseService } from './course/course.service';

import { Course } from './course/course.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { faDumbbell } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
 
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

  username: string;

  constructor(private cs: CourseService, private router: Router) { }

// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Date good doku,

  // getDate for the Day of the month as reverence
  // getDay to adjust to weekdays, getMonth + Year to reference.
  // Use SetDate to clearn the hours etc.?

  ngOnInit() {
    let cw = this.getWeekOfYear(new Date());
    
    this.router.navigate(['/course', cw]);
  }

    

    ngOnDestroy() {
      this.subCS.unsubscribe();
    }

    
    getWeekOfYear(date) {
          let dayNumber = (date.getUTCDay() + 6) % 7;
          let target = new Date(date.valueOf());
          
      
          target.setUTCDate(target.getUTCDate() - dayNumber + 3);
          let firstThursday = target.valueOf();
          target.setUTCMonth(0, 1);
      
          if (target.getUTCDay() !== 4) {
              target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7);
          }
      
          return Math.ceil((firstThursday - target.valueOf()) /  (7 * 24 * 3600 * 1000)) + 1;
      }

  


}
