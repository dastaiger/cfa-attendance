import { Component, OnInit } from '@angular/core';
import { Course } from './course.model';
import { DatePipe } from '@angular/common';
import { CourseService } from './course.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent  {
course: Course;
courses: Course[];

  constructor(private cs: CourseService) { }

  seedCourses() {
    this.cs.seedCourseDataToBackend();
  }
}
