import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { MessageService } from '../../../services/message.service';
import { NotificationService } from '../../../services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Lang } from '../../../services/config/lang';
import { InternationalizationService } from '../../../services/features/internationalization.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  subscription: Subscription;
  translations: any = null;
  currentLanguage = Lang.currentLang;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private internationalizationService: InternationalizationService,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.internationalizationService.changeLanguage(this.currentLanguage, (res) => { this.translations = res; });
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    if (this.f.invalid) {
      this.notificationService.danger(this.translations.Login.AllFieldsAreRequired);
    }

    this.authService
      .login({
        login: this.f.login.value,
        password: this.f.password.value
      })
      .subscribe(success => {
        const ui = {
          PRIEST: 'priests',
          CATECHIST: 'catechists',
          CATECHUMEN: 'cathecumenes',
          PARISHIONAL: 'parishionals',
          OTHER: 'others',
          SUPERADMIN: 'superadmins'
        };
        const user = this.authService.getUserInfos();
        if (success) {
          this.notificationService.success(this.translations.Login.ConnectedWithSuccess);
          this.router.navigate(['/private/' + ui.PARISHIONAL]);
        } else {
          this.notificationService.danger(this.translations.Login.ErrorIncorrectLoginOrPwd);
        }
      });
  }

  changeLanguage(value) {
    this.currentLanguage = value;
    this.internationalizationService.changeLanguage(this.currentLanguage, (res) => { this.translations = res; });
  }
}
