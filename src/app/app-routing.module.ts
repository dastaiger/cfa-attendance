import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseComponent } from './course/course.component';
import { AppComponent } from './app.component';
import { ScheduleComponent } from './schedule/schedule.component';


const routes: Routes = [
  { path: 'debug', component: CourseComponent },
  { path: 'course/:date', component: ScheduleComponent },
  { path: '""',   component: AppComponent, pathMatch: 'full' },
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
