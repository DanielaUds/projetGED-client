import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  isAuthenticated = false;
  translations: any = null;

  constructor(
    private authService: AuthService,
    private router: Router) {

    }

  ngOnInit() {
    console.log(this.authService.getUserInfos());
    this.isAuthenticated = this.authService.getUserInfos() ? true : false;
    this.router.navigate(['/private/visitors/workspace']);
  }

  logout() {
    this.authService.logout()
      .subscribe(success => {
        if (success) {
          this.router.navigate(['/private/login']);
        }
      });
  }

  goTo(url) {
    this.router.navigate(['/private/visitors']);
  }
}
