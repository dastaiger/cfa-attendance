import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CourseService } from './course/course.service';
import { DatePipe } from '@angular/common';
import { Course } from './course/course.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  @ViewChild('f', {static: true}) form: NgForm;
  title = 'cfa-attendance';
  subCS: Subscription;

  weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  weeksCourses: Course[];
  thisweek = [];
  weekStartDate = this.getMonday(new Date());

  courses: Course[];

  date = new Date();
    day = this.date.getDay();
     // gets day of month
    year = this.date.getFullYear();

    calWeek = new DatePipe('de').transform(this.date, 'w');

  username: string;

  constructor(private cs: CourseService) { }

// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Date good doku,

  // getDate for the Day of the month as reverence
  // getDay to adjust to weekdays, getMonth + Year to reference.
  // Use SetDate to clearn the hours etc.?

  ngOnInit() {

    this.subCS = this.cs.coursesChanged.subscribe(
      (courses: Course[]) => {
        this.courses = courses;
        this.weeksCourses = this.coursesThisWeek();
      }
    );
   this.cs.createCourseData();
    this.courses = this.cs.getCourses();
    this.findWeek();

    
    }


    ngOnDestroy() {
      this.subCS.unsubscribe();
    }

    coursesThisWeek(): Course[]{
      // check if Month is equal + if the dates are in the same week as the start week (monday  to friday +4)
      return this.courses.filter(course => (
        ( (this.weekStartDate.getMonth() === course.date.getMonth()) && 
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

  findWeek() {
    
    const startDate = this.getMonday(new Date());

    startDate.setHours(8, 0, 0, 0);

    const dayInMonth = startDate.getDate();

    console.log('Monday was:' + startDate);


    // fill the current week (only 5 Days, Mo - Fr)
    for (let _i = 0; _i < 5; _i++) {
      this.thisweek.push( new Date( startDate.setDate(dayInMonth + _i  ) ));
   }
  }


   getMonday(d: Date) {
    d = new Date(d);
    let day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }





}
