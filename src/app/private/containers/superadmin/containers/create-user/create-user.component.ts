import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../../../../services/notification.service';
import { InternationalizationService } from '../../../../../services/features/internationalization.service';
import { Lang } from '../../../../../services/config/lang';
import { UserService } from '../../../../../services/person/user.service'
import { ServiceService } from '../../services/service-service.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  registerForm: FormGroup;
  handleError: any = null;
  isLoading = false;
  isError = false;
  isSuccess = false;
  message = { title: '', content: '' };
  isSubmitted = false;
  file: File = null;
  user: any = null;
  services: any[] = [];

  // language
  currentLanguage = Lang.currentLang;
  translations: any = null;

  constructor(
    private router: Router,
    private internationalizationService: InternationalizationService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private serviceService: ServiceService) { }

  ngOnInit() {
    this.changeLanguage(this.currentLanguage);
    this.getServices();
    this.initForm();
  }

  getServices() {
    this.serviceService.get().then(
      resp => {
        this.services = resp;
      }
    )
    .catch(
      err => {
        this.notificationService.danger("Serveur indisponible pour l'instant veuillez reessayer plutard");
      }
    )
  }

  initForm() {
    this.registerForm = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      birth_date: [''],
      birth_place: [''],
      tel: [''],
      email: ['', [
        Validators.required,
        Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/)
      ]],
      language: [''],
      job: [''],
      service_id: [''],
      gender: ['', [Validators.required]],
    });
  }

  get form() {
    return this.registerForm.controls;
  }

  isValidPhonenumber(value) {
    return (/^\d{7,}$/).test(value.replace(/[\s()+\-\.]|ext/gi, ''));
  }

  checkPassword() {
    return this.form.password.value === this.form.confirm_password.value;
  }

  cancel() {
    this.isError = false;
    this.isSuccess = false;
    this.message = { title: '', content: '' };
  }

  onSubmit() {
    this.isError = false;
    this.isSuccess = false;
    this.isLoading = false;
    this.isSubmitted = true;
    this.handleError = null;

    if (this.registerForm.invalid) {
      this.message.title = 'Erreur'
      this.message.content = 'Formulaire mal remplit, veuillez completer les champs obligatoires';
      this.isError = true;
      this.notificationService.danger(this.message.content);
      return;
    }

    if (!this.isValidPhonenumber(this.form.tel.value)) {
      this.message.title = 'Erreur'
      this.message.content = 'Veuillez saisir un numero de telephone valide, vous pouvez vous inspirer de l\'exemple utilise dans le champ de saisit';
      this.isError = true;
      this.notificationService.danger(this.message.content);
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    const data = this.form;
    for (const k in data) {
      if (k) {
        if (data[k].value === true || data[k].value === false) {
          formData.append(k + '', data[k].value === true ? '1' : '0');
        } else if (k === 'avatar') {
          formData.append(k, this.file);
        } else {
          formData.append(k + '', data[k].value);
        }
      }
    }
    this.userService.createInternalUser(formData)
      .then(resp => {
        console.log(resp);
        this.message.title = 'Success'
        this.message.content = 'Le compte a ete cree avec success';
        this.isSuccess = true;
        this.notificationService.success(this.message.content);
      })
      .catch(err => {
        this.message.title = 'Erreur'
        this.message.content = 'Une erreur inconnue est survenue, veuillez verifier les informations saisis dans le formulaire';
        this.notificationService.danger(this.message.content);
        this.isError = true;
        const errs = err.error.errors;
        console.log(err);
        this.handleError = errs;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  goTo(url: string) {
    this.router.navigate([url]);
  }

  /* Reactive translation */
  changeLanguage(value) {
    this.currentLanguage = value;
    this.internationalizationService.changeLanguage(this.currentLanguage, (res) => { this.translations = res; });
  }

}
