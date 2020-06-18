import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CourseComponent } from './course/course.component';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { CourseService } from './course/course.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ScheduleComponent } from './schedule/schedule.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthComponent } from './auth/auth.component';
import { UserComponent } from './user/user.component';
import { HeaderComponent } from './header/header.component';
import { AlertComponent } from './shared/alert/alert.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NwbAllModule } from '@wizishop/ng-wizi-bulma';
import { AuthInterceptorService } from './auth/auth-intercepter.service';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    CourseComponent,
    ScheduleComponent,
    DropdownDirective,
    AuthComponent,
    UserComponent,
    HeaderComponent,
    AlertComponent,
    LoadingSpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    NwbAllModule,
    BrowserAnimationsModule,
  ],
  providers: [
    CourseService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
