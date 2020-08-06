import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from '../../../services/message.service';
import { NotificationService } from './../../../services/notification.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  isAuthenticated = false;
  subscription: Subscription;
  translations: any = null;
  user: any = null;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private router: Router) {
    }

  ngOnInit() {
   this.user = this.authService.getUserInfos();
    console.log(this.user);
    this.isAuthenticated = this.user ? true : false;

    const ui = {
      VISITOR: 'visitors',
      EMPLOYEE: 'employees',
      ADMINISTRATOR: 'administrators',
      SUPERADMIN: 'superadmins'
    };
    if (this.user && this.user.job) {
      switch(this.user.job) {
        case 'VISITOR': 
          this.router.navigate(['/private/' + ui.VISITOR]);
          break;
        case 'EMPLOYEE': 
          this.router.navigate(['/private/' + ui.EMPLOYEE]);
          break;
        case 'ADMINISTRATOR': 
          console.log('Admin')
          this.router.navigate(['/private/' + ui.ADMINISTRATOR]);
          break;
        case 'SUPERADMIN': 
          this.router.navigate(['/private/' + ui.SUPERADMIN]);
          break;
      }
    } else {
      this.router.navigate(['/private/login']);
    }
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
    this.router.navigate(['/private/parishionals']);
  }
}
