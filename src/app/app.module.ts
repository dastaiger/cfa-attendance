import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CourseComponent } from './course/course.component';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { CourseService } from './course/course.service';
import { HttpClientModule } from '@angular/common/http';
import { ScheduleComponent } from './schedule/schedule.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    CourseComponent,
    ScheduleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [CourseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
