import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { faIdCard } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private dsService: DataStorageService,
    private authService: AuthService
  ) {}
  public isMenuCollapsed = true;
  isAuthenticated = false;
  private userSub: Subscription;

  faIdCard = faIdCard;

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !user ? false : true;
      // this.isAuthenticated = !!user;
      console.log(!!user);
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
  onSaveData() {
    // this.dsService.storeRecipes();
  }

  onFetchData() {
    // this.dsService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
