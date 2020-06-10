import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Course } from '../course/course.model';
import { CourseService } from '../course/course.service';
import { ActivatedRoute } from '@angular/router';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit, OnDestroy {

  faAngleLeft = faAngleLeft;
  faAngleRight= faAngleRight;


  @ViewChild('f', {static: true}) form: NgForm;
  @ViewChild('schedule', {static: false})

  title = 'cfa-attendance';
  subCS: Subscription;


  error = null;

  weeksCourses: Course[];
  thisweek = [];
  weekStartDate: Date;
  startDate = new Date();

  courses: Course[]
  dateParam : number;
  

  // data fetching in process?
  isFetching = false;

  // date = new Date();
  // day = this.date.getDay();
  // year = this.date.getFullYear();
  // calWeek = new DatePipe('de').transform(this.date, 'w');

  username: string;

  constructor(private cs: CourseService, private route: ActivatedRoute) { }

// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Date good doku,

  // getDate for the Day of the month as reverence
  // getDay to adjust to weekdays, getMonth + Year to reference.
  // Use SetDate to clearn the hours etc.?

  ngOnInit() {
   
    this.isFetching = true;
    this.cs.fetchCourses();

    this.route.paramMap.subscribe(params => {
      this.dateParam = +params.get('date')

      
      // calender Week start at 1 not 0
      const cw = new Date(2020,0, (-7 + this.dateParam  * 7  ), 0,0,0,0 )
      
      this.weekStartDate = this.getMonday(cw);
      
      this.setThisWeekArray();
      if (Array.isArray(this.courses) && this.courses.length > 0) {
        this.weeksCourses = this.coursesThisWeek();
        
      }
      
      // this.weeksCourses = this.coursesThisWeek();
 
      },
    );

    this.subCS = this.cs.coursesChanged.subscribe(
      (courses: Course[]) => {
        
        this.isFetching = true;
        this.courses = courses;
        this.weeksCourses = this.coursesThisWeek();
        this.isFetching = false;
       
      });

    this.setThisWeekArray();
    // console.log("this weeks courses start with:" +this.weeksCourses[0].date);
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
   
  }

  // sets the thisweek array to day monday - Friday to loop over in the HTML Template.a
  // i guess this could be done better but works for now.
  setThisWeekArray() {
    this.thisweek = [];
    const startDate = new Date(this.weekStartDate);
    startDate.setHours(8, 0, 0, 0);
    const dayInMonth = startDate.getDate();

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
