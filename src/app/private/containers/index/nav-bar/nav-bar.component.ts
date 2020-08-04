import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../../auth/services/auth.service';
import { MessageService } from '../../../../services/message.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  isAuthenticated = false;
  subscription: Subscription;
  translations: any = null;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private router: Router) {
      this.subscription = this.messageService.getMessage().subscribe(message => {
        const data = JSON.parse(message.text);
        if (data.code === 'new-translation') {
          this.translations = data.data;
        }
        console.log( this.translations );
      });
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

}
