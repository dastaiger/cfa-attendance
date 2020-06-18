import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { AuthResponseDate } from './authResponseDate';
import {
  Router,
  ActivatedRouteSnapshot,
  ActivatedRoute,
} from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error = null;
  email: string;

  alertSub: Subscription;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const url: string = this.route.snapshot.url.join('');
    if (url === 'login') {
      this.isLoginMode = true;
    } else {
      this.isLoginMode = false;
    }
    console.log('Login? ' + this.isLoginMode);
  }

  ngOnDestroy() {
    if (this.alertSub) {
      this.alertSub.unsubscribe();
    }
  }
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    // just another validation that should not be neccessary.
    if (!form.valid) {
      return;
    }
    const name = form.value.name;
    const email = form.value.email;
    const pw = form.value.password;

    let authObs: Observable<AuthResponseDate>;

    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, pw);
    } else {
      authObs = this.authService.signup(email, pw, name);
    }

    authObs.subscribe(
      (respData) => {
        this.isLoading = false;
        const didroute = this.router.navigate(['/course']);
      },
      (errorMessage) => {
        // this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

  // private showErrorAlert(errorMessage: string) {
  //   this.error = errorMessage;
  //   const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
  //     AlertComponent
  //   );
  //   const hostViewContainerRef = this.alertHost.viewContainerRef;
  //   hostViewContainerRef.clear();

  //   const componenRef = hostViewContainerRef.createComponent(alertCmpFactory);
  //   componenRef.instance.message = errorMessage;

  //   this.alertSub = componenRef.instance.closed.subscribe(() => {

  //     this.alertSub.unsubscribe();
  //     hostViewContainerRef.clear();
  //   });
  // }
}
