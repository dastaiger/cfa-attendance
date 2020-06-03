import { Injectable } from '@angular/core';
import { Course } from './course.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})




export class CourseService {
  coursesChanged = new Subject<Course[]>();

   private courses: Course[] = [
    new Course(new Date("Fri Dec 08 2019 07:44:57"), ["FitGuy"], "FitGuy")
   ];

constructor( ) { }

getCourse(date: any): Course {
   return this.courses[0];
  }
  getCourses(): Course[] {
    return this.courses;
   }

createCourseData(){
  for (let _i = 1; _i < 32; _i++) {
    this.courses.push( new Course( new Date(2020, 5, _i,8,0,0,0),[]));
    this.coursesChanged.next(this.courses);
  }
}

createCourse(date: any, attendes: string[], respPerson: string) {
  this.courses.push(new Course(date, attendes, respPerson));
}
register2Course(username: string, courseDate: Date) {
  
  const index = this.courses.findIndex(c => c.date.toDateString() === courseDate.toDateString());
  // c => console.log(c.date.toDateString() === courseDate.toDateString())
  console.log(index)
  this.courses[index].attende.push(username);
  console.log("Pushed user: "+ username +" to course index: " + index);
  this.coursesChanged.next(this.courses);

}

unregisterFromCourse(username: string, courseDate: Date){
  const index = this.courses.findIndex(c => c.date.toDateString() === courseDate.toDateString());
  if (index === -1) {
    alert("can not find this course!")
    return;
  }
  const userIndex = this.courses[index].attende.findIndex(c => c === username);
  this.courses[index].attende.splice(userIndex, 1);
  if (index === -1) {
    alert("can not find this user in this course!")
    return;
  }
}


}
