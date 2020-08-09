import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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
  translations: any = null;
  currentLanguage = Lang.currentLang;
  handleError: any = null;
  isLoading = false;
  isError = false;
  isSuccess = false;
  message = { title: '', content: '' };
  isSubmitted = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private internationalizationService: InternationalizationService,
    private notificationService: NotificationService,
    private router: Router) {}

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
    this.isError = false;
    this.isSuccess = false;
    this.isLoading = false;
    this.isSubmitted = true;
    this.handleError = null;

    if (this.f.invalid) {
      this.message.title = 'Erreur'
      this.message.content = this.translations.Login.AllFieldsAreRequired;
      this.isError = true;
      this.notificationService.danger(this.message.content);
      return;
    }

    this.isLoading = true;
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
          this.message.title = 'Success'
          this.message.content = this.translations.Login.ConnectedWithSuccess;
          this.isSuccess = true;
          this.notificationService.success(this.message.content);
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
          this.isLoading = false;
        } else {
          this.message.title = 'Erreur'
          this.message.content = this.translations.Login.ErrorIncorrectLoginOrPwd;
          this.isError = true;
          this.notificationService.danger(this.message.content);
          this.isLoading = false;
        }
      });
  }

  cancel() {
    this.isError = false;
    this.isSuccess = false;
    this.message = { title: '', content: '' };
  }

  goTo(url: string) {
    this.router.navigate([url]);
  }

  changeLanguage(value) {
    this.currentLanguage = value;
    this.internationalizationService.changeLanguage(this.currentLanguage, (res) => { this.translations = res; });
  }
}
