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
        PRIEST: 'priests',
        CATECHIST: 'catechists',
        CATECHUMEN: 'cathecumenes',
        PARISHIONER: 'parishionals',
        OTHER: 'others',
        SUPERADMIN: 'superadmins',
      };
      const user = this.authService.getUserInfos();
      this.router.navigate(['/' + ui[user.user_type]]);
    }
    return !this.authService.isLoggedIn();
  }
}
