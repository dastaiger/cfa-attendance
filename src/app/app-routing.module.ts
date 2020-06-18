import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseComponent } from './course/course.component';
import { AppComponent } from './app.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { UserComponent } from './user/user.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'debug', component: CourseComponent },
  {
    path: 'course',
    component: ScheduleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'course/:date',
    component: ScheduleComponent,
    canActivate: [AuthGuard],
  },

  { path: 'user/:id', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthComponent },
  { path: 'login', component: AuthComponent },
  { path: 'signup', component: AuthComponent },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/course', pathMatch: 'full' },
  // { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
