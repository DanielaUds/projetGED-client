import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { InternationalizationService } from '../../../../../../services/features/internationalization.service';
declare var $;
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  isAuthenticated = false;
  translations: any = null;
  currentLanguage = 'fr';
  user: any = null;

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private internationalizationService: InternationalizationService,
    private router: Router) { }


  ngOnInit() {
    this.user = this.authService.getUserInfos();
    console.log(this.user);
  }

  logout() {
    this.authService.logout()
      .subscribe(success => {
        if (success) {
          this.router.navigate(['/private/login']);
        }
      });
  }

  changeState() {
    const button = $('#app-container-truth');
    if (!button.hasClass('closed-sidebar')) {
      button.addClass('closed-sidebar');
    } else {
      button.removeClass('closed-sidebar');
    }
  }

  showUserFirstAndLastName() {
    return this.user.first_name.split(' ')[0] + ' ' + this.user.last_name.split(' ')[0];
  }

  gotToHome() {
    this.router.navigate(['/private/employees/']);
  }

  /* Reactive translation */
  changeLanguage(value) {
    this.currentLanguage = value;
    this.internationalizationService.changeLanguage(this.currentLanguage, (res) => { this.translations = res; });
  }

}
