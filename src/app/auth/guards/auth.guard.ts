import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    if (this.authService.isLoggedIn()) {
      const ui = {
        VISITOR: 'visitors',
        EMPLOYEE: 'employees',
        ADMINISTRATOR: 'administrators',
        SUPERADMIN: 'superadmins'
      };
      const user = this.authService.getUserInfos();
      this.router.navigate(['/' + ui[user.job]]);
    }
    return !this.authService.isLoggedIn();
  }
}
