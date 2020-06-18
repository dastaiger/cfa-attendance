import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Course } from '../course/course.model';
import { CourseService } from '../course/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit, OnDestroy {
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;

  @ViewChild('f', { static: true }) form: NgForm;
  @ViewChild('schedule', { static: false })
  title = 'cfa-attendance';
  subCS: Subscription;
  subAuthUser: Subscription;
  subUser: Subscription;
  error = null;

  weeksCourses: Course[];
  thisweek = [];
  weekStartDate: Date;
  startDate = new Date();

  courses: Course[];
  dateParam: number;

  // data fetching in process?
  isFetching = false;

  // date = new Date();
  // day = this.date.getDay();
  // year = this.date.getFullYear();
  // calWeek = new DatePipe('de').transform(this.date, 'w');

  username: string;

  constructor(
    private cs: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Date good doku,

  // getDate for the Day of the month as reverence
  // getDay to adjust to weekdays, getMonth + Year to reference.
  // Use SetDate to clearn the hours etc.?

  ngOnInit() {
    console.log('schedule NGInit started');
    this.isFetching = true;
    this.subAuthUser = this.authService.user.subscribe((user) => {
      if (!user.name) {
        this.subUser = this.userService.getUser(user.id).subscribe((data) => {
          console.log('UserData:' + data);
        });
      }
      this.username = user.name;
    });
    this.cs.fetchCourses();

    this.route.paramMap.subscribe((params) => {
      this.dateParam = +params.get('date');

      if (this.dateParam === 0) {
        const cw = this.getWeekOfYear(new Date());
        this.router.navigate([cw], { relativeTo: this.route });
      }

      // calender Week start at 1 not 0
      const cw = new Date(2020, 0, -7 + this.dateParam * 7, 0, 0, 0, 0);

      this.weekStartDate = this.getMonday(cw);

      this.setThisWeekArray();
      if (Array.isArray(this.courses) && this.courses.length > 0) {
        this.weeksCourses = this.coursesThisWeek();
      }

      // this.weeksCourses = this.coursesThisWeek();
    });

    this.subCS = this.cs.coursesChanged.subscribe((courses: Course[]) => {
      this.isFetching = true;
      this.courses = courses;
      console.log('courses lenght: ' + courses.length);
      this.weeksCourses = this.coursesThisWeek();
      console.log('thisWeeksCourses lenght: ' + this.weeksCourses.length);
      this.isFetching = false;
    });

    this.setThisWeekArray();
    // console.log("this weeks courses start with:" +this.weeksCourses[0].date);
  }

  ngOnDestroy() {
    this.subAuthUser.unsubscribe();
    this.subCS.unsubscribe();
  }

  coursesThisWeek(): Course[] {
    // check if there are courses between StartDate and startDate + 4 Days (in ms)
    const start = new Date(this.weekStartDate);
    return this.courses
      .filter(
        (course) =>
          start.getTime() <= course.date.getTime() &&
          start.getTime() + 5 * 24 * 3600 * 1000 >= course.date.getTime()
      )
      .slice();
  }

  onSubmit(form: NgForm) {
    Object.keys(form.value).forEach((courseDate) => {
      if (form.value[courseDate] === true) {
        this.cs.register2Course(this.username, new Date(courseDate));
      }
    });

    console.log(form);
  }

  register(day: Date) {
    this.cs.register2Course(this.username, new Date(day));
  }

  onDelete(course: Course, user: string) {
    if (user) {
      if (user !== this.username) {
        console.log(user);
        this.error = 'You can not remove other Users!';
        return;
      } else {
        this.cs.unregisterFromCourse(user, course.date);
      }
    }
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
      this.thisweek.push(new Date(startDate.setDate(dayInMonth + _i)));
    }
  }

  // find the first day of the week
  getMonday(d: Date) {
    d = new Date(d);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  getWeekOfYear(date) {
    const dayNumber = (date.getUTCDay() + 6) % 7;
    const target = new Date(date.valueOf());

    target.setUTCDate(target.getUTCDate() - dayNumber + 3);
    const firstThursday = target.valueOf();
    target.setUTCMonth(0, 1);

    if (target.getUTCDay() !== 4) {
      target.setUTCMonth(0, 1 + ((4 - target.getUTCDay() + 7) % 7));
    }

    return (
      Math.ceil((firstThursday - target.valueOf()) / (7 * 24 * 3600 * 1000)) + 1
    );
  }

  onHandleError() {
    this.error = null;
  }
}
