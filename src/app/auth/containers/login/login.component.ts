import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { MessageService } from '../../../services/message.service';
import { NotificationService } from '../../../services/notification.service';
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
          VISITOR: 'visitors',
          EMPLOYEE: 'employees',
          ADMINISTRATOR: 'administrators',
          SUPERADMIN: 'superadmins'
        };
        const user = this.authService.getUserInfos();
        if (success) {
          this.notificationService.success(this.translations.Login.ConnectedWithSuccess);
          switch(user.job) {
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
          this.notificationService.danger(this.translations.Login.ErrorIncorrectLoginOrPwd);
        }
      });
  }

  goTo(url: string) {
    this.router.navigate([url]);
  }

  changeLanguage(value) {
    this.currentLanguage = value;
    this.internationalizationService.changeLanguage(this.currentLanguage, (res) => { this.translations = res; });
  }
}
