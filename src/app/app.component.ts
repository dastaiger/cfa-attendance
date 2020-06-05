import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CourseService } from './course/course.service';

import { Course } from './course/course.model';
import { Subscription } from 'rxjs';
import { isString } from 'util';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  @ViewChild('f', {static: true}) form: NgForm;
  @ViewChild('schedule', {static: false})

  title = 'cfa-attendance';
  subCS: Subscription;


  error = null;

  weeksCourses: Course[];
  thisweek = [];
  weekStartDate = this.getMonday(new Date());

  courses: Course[];



  // data fetching in process?
  isFetching = false;

  // date = new Date();
  // day = this.date.getDay();
  // year = this.date.getFullYear();
  // calWeek = new DatePipe('de').transform(this.date, 'w');

  username: string;

  constructor(private cs: CourseService) { }

// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Date good doku,

  // getDate for the Day of the month as reverence
  // getDay to adjust to weekdays, getMonth + Year to reference.
  // Use SetDate to clearn the hours etc.?

  ngOnInit() {
    this.isFetching = true;
    this.cs.fetchCourses();
    this.subCS = this.cs.coursesChanged.subscribe(
      (courses: Course[]) => {
        console.log("this is the start date:" + this.weekStartDate)
        console.log("course Changed!")
        this.isFetching = true;
        this.courses = courses;
        this.weeksCourses = this.coursesThisWeek();
        this.isFetching = false;
        console.log("This weeks courses are: " + this.weeksCourses[0].attende)
      }
    );

    this.setThisWeekArray();
    console.log("this weeks courses are:" +this.weeksCourses)
   
    }


    ngOnDestroy() {
      this.subCS.unsubscribe();
    }

    coursesThisWeek(): Course[]{
      // check if Month is equal + if the dates are in the same week as the start week (monday  to friday +4)
      return this.courses.filter(course => ((
           (this.weekStartDate.getMonth() === course.date.getMonth()) && 
        (this.weekStartDate.getDate() <= course.date.getDate()) && 
         ((this.weekStartDate.getDate() + 4)  >=  course.date.getDate()))));
    }


  onSubmit(form: NgForm) {
    this.username = form.value.username;
    Object.keys(form.value).forEach( courseDate => {
      if (form.value[courseDate] === true) {
        this.cs.register2Course(this.username, new Date(courseDate));

      }
    });
    
    console.log(form);
  }

  onDelete(course: Course, user: string) {
    this.cs.unregisterFromCourse(user, course.date);
    console.log('try to delete:' +user)
  }

  // sets the thisweek array to day monday - Friday to loop over in the HTML Template.a
  // i guess this could be done better but works for now.
  setThisWeekArray() {
    const startDate = this.weekStartDate;
    startDate.setHours(8, 0, 0, 0);
    const dayInMonth = startDate.getDate();

    console.log('Monday was:' + startDate);

    // fill the current week (only 5 Days, Mo - Fr)
    for (let _i = 0; _i < 5; _i++) {
      this.thisweek.push( new Date( startDate.setDate(dayInMonth + _i  ) ));
   }
  }

  // find the first day of the week
   getMonday(d: Date) {
    d = new Date(d);
    let day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }





}
