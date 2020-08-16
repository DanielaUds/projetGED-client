import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdministratorGuard implements CanActivate, CanLoad {

  private user = this.authService.getUserInfos();
  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    return this.canLoad();
  }

  canLoad() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/private/login']);
    }
    if (!this.isRole()) {
      const ui = {
        VISITOR: 'visitors',
        EMPLOYEE: 'employees',
        ADMINISTRATOR: 'administrators',
        SUPERADMIN: 'superadmins'
      };
      this.router.navigate(['/private/' + ui[this.user.job]]);
    }
    return this.authService.isLoggedIn();
  }

  isRole() {
    return this.user.job === 'ADMINISTRATOR';
  }
}
