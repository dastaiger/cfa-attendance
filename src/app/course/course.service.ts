import { Injectable } from '@angular/core';
import { Course } from './course.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CoursesData } from './courseData.model';

@Injectable({
  providedIn: 'root',
})

// periodicly fetch data from Backend!
// implement a query to only fetch courses that are relevant (next 2 weeks?)
export class CourseService {
  coursesChanged = new Subject<Course[]>();
  private courseData: CoursesData = new CoursesData('', []);
  private courses: Course[] = [];

  error = null;

  constructor(private http: HttpClient) {}

  getCourses(): Course[] {
    console.log('return this courses: ' + this.courses);
    return this.courses;
  }

  // seedCourseDataToBackend is intendet to seed the Database with courses
  // only saves 1 ID the Arrey of courses with 250 elements, not as intended -> change the get method!
  seedCourseDataToBackend() {
    // create an 8am course for the next 250 days

    for (let _i = 1; _i < 250; _i++) {
      this.courses.push(
        new Course(new Date(2020, 5, _i, 8, 0, 0, 0), [''], '')
      );
    }
    this.storeCourses(this.courses);
  }

  createCourse(date: any, attendes: string[], respPerson: string) {
    this.courses.push(new Course(date, attendes, respPerson));
  }
  register2Course(username: string, courseDate: Date) {
    const index = this.courses.findIndex(
      (c) => c.date.toDateString() === courseDate.toDateString()
    );
    // c => console.log(c.date.toDateString() === courseDate.toDateString()));
    // console.log(index);
    // 'const sub = this.fetchCourse(this.courses[index]).subscribe(
    //     courseReq => {
    //       this.courses[this.courses[index].id] = courseReq;
    //       console.log("Updated Course!")
    //       console.log(courseReq)
    //     }
    //   );'
    // sub.unsubscribe();

    console.log('run fetchCourse');

    if (!this.courses[index].attende) {
      this.courses[index].attende = [];
    }
    this.courses[index].attende.push(username);
    console.log(
      'Pushed user: ' +
        username +
        ' to course with ID : ' +
        this.courses[index].id
    );
    this.coursesChanged.next(this.courses);
    this.updateCourse(this.courses[index]);
  }

  unregisterFromCourse(username: string, courseDate: Date) {
    const index = this.courses.findIndex(
      (c) => c.date.toDateString() === courseDate.toDateString()
    );
    if (index === -1) {
      alert('can not find this course!');
      return;
    }
    const userIndex = this.courses[index].attende.findIndex(
      (c) => c === username
    );

    if (index === -1) {
      alert('can not find this user in this course!');
      return;
    }
    if (userIndex === 0) {
      this.courses[index].attende[userIndex] = '';
    } else {
      this.courses[index].attende.splice(userIndex, 1);
    }

    this.coursesChanged.next(this.courses);
    this.updateCourse(this.courses[index]);
  }

  
  storeCourses(courses: Course[]) {
    const coursesData: Course[] = courses;
    // Send Http request
    this.http
      .post('https://cfa-attendance.firebaseio.com/courses.json', coursesData)
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  updateCourse(course: Course) {
    this.http
      .put(
        'https://cfa-attendance.firebaseio.com/courses/' +
          this.courseData.id +
          '/' +
          course.id +
          '/attende.json',
        course.attende
      )
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  fetchCourse(course: Course) {
    return this.http.get(
      'https://cfa-attendance.firebaseio.com/courses/' +
        this.courseData.id +
        '/' +
        course.id +
        '.json'
    );
  }

  fetchCourses() {
    console.log('start Fetching');
    this.http
      .get<{ [key: string]: Course[] }>(
        'https://cfa-attendance.firebaseio.com/courses.json'
      )
      .pipe(
        map((responseData) => {
          this.courseData = new CoursesData('', []);

          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              this.courseData.id = key;
              for (const i of responseData[key].keys()) {
                this.courseData.courses.push({
                  ...responseData[key][i],
                  id: i.toString(),
                });
              }
            }
          }
          for (let i = 0; i < this.courseData.courses.length; i++) {
            this.courseData.courses[i].date = new Date(
              this.courseData.courses[i].date
            );
            if (
              this.courseData.courses[i].attende &&
              this.courseData.courses[i].attende[0] === ''
            ) {
              this.courseData.courses[i].attende.splice(0, 1);
            }
          }

          return this.courseData.courses;
        })
      )
      .subscribe(
        (CourseArray) => {
          console.log('length of courseArray:' + CourseArray.length);
          this.courses = CourseArray;
          this.coursesChanged.next(this.courses.slice());
        },
        (error) => {
          this.error = error.error;
          console.log(error);
        }
      );
  }
}
