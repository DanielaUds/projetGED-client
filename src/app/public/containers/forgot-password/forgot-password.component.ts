import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';
import { InternationalizationService } from '../../../services/features/internationalization.service';
import { Lang } from '../../../services/config/lang';
import { ForgotPasswordService } from '../../services/forgot-password.service'



@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  form: FormGroup;
  handleError: any = null;
  isLoading = false;
  isError = false;
  isSuccess = false;
  message = { title: '', content: '' };
  isSubmitted = false;
  user: any = null;

  // language
  currentLanguage = Lang.currentLang;
  translations: any = null;

  constructor(
    private router: Router,
    private internationalizationService: InternationalizationService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private forgotPasswordService: ForgotPasswordService ) { }

  ngOnInit() {
    this.changeLanguage(this.currentLanguage);
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/)
      ]]
    });
  }

  get f() {
    return this.form.controls;
  }
 

  onSubmit() {
    this.isError = false;
    this.isSuccess = false;
    this.isLoading = false;
    this.isSubmitted = true;

    if (this.form.invalid) {
      this.message.title = 'Erreur'
      this.message.content = 'Formulaire mal remplit, veuillez completer les champs obligatoires';
      this.isError = true;
      this.notificationService.danger(this.message.content);
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    formData.append('email', this.f.email.value);
    
    this.forgotPasswordService.post(formData)
      .then(resp => {
        console.log(resp);
        this.message.title = 'Success'
        this.message.content = 'Votre mot de passe a ete reinitialisee avec success, veuillez cliquer sur le lien ci-dessous pour vous connecter et acceder a votre espace prive';
        this.isSuccess = true;
        this.notificationService.success(this.message.content);
      })
      .catch(err => {
        this.isError = true;
        const errs = err.error.errors;
        this.handleError = errs;
        this.message.title = 'Erreur'
        this.message.content = 'Nous n\'avons pas reussi a reinitialiser votre mot de passe. Ceci peut etre du au fait que votre adresse e-mail soit incorrecte ou un probleme de connexion a internet. Veuillez reessayer ';
        this.isError = true;
        this.notificationService.danger(this.message.content);

      })
      .finally(() => {
        this.isLoading = false;
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

  /* Reactive translation */
  changeLanguage(value) {
    this.currentLanguage = value;
    this.internationalizationService.changeLanguage(this.currentLanguage, (res) => { this.translations = res; });
  }
  goToo(url: string) {
    this.router.navigate([url]);
  }
}
