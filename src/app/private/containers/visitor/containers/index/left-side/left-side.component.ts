import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { MessageService } from '../../../../../../services/message.service';
import { NotificationService } from '../../../../../../services/notification.service';
declare var $;
@Component({
  selector: 'app-left-side',
  templateUrl: './left-side.component.html',
  styleUrls: ['./left-side.component.scss']
})
export class LeftSideComponent implements OnInit {

  isAuthenticated = false;
  subscription: Subscription;
  translations: any = null;
  activeMenu: any = {
    menu0: 1,
    menu1: 1,
    menu2: 1,
    menu3: 1,
    menu4: 1,
    menu5: 1,
    menu6: 1,
    menu7: 1,
    menu8: 1,
    menu9: 1
  };

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private router: Router) {
    }

  showChildren(parent) {
    const uls = $(parent);
    if (!uls.hasClass('mm-show')) {
       uls.addClass('mm-show');
    } else {
      uls.removeClass('mm-show');
    }
  }
  ngOnInit() {
    console.log('Load data for component');
  }

  logout() {
    console.log('make logout here');
  }

  changeLanguage(value) {
    console.log('change language !');
  }

  goTo(component) {
    this.router.navigate(['/private/superadmins/' + component]);
  }

}
