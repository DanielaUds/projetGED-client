import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../auth/services/auth.service';
import { config } from '../../../../../config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visitor-home',
  templateUrl: './visitor-home.component.html',
  styleUrls: ['./visitor-home.component.css']
})
export class VisitorHomeComponent implements OnInit {

  user = null;
  avatarPath = '';

  constructor(
    private authService: AuthService, 
    private router: Router) {}

  ngOnInit() {
    this.user = this.authService.getUserInfos();
    this.initAvatar();
  }

  initAvatar() {
    this.avatarPath = this.user.avatar ? config.apiUrl + '/' + this.user.avatar : '';
  }

  displayUserLanguage() {
    if (this.user.language) {
      if (this.user.language === 'fr') {
        return 'Francais';
      } else if (this.user.language === 'en') {
        return 'Anglais';
      } else {
        return 'Langue inconnue';
      }
    }
  }

}
