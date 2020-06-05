import { Course } from './course.model';


export class CoursesData {
    public id: string;
    public courses: Course[];

    constructor(id: string, courses: Course[]){
        this.id = id;
        this.courses = courses;
    }
}
