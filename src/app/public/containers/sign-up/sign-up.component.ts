import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';
import { InternationalizationService } from '../../../services/features/internationalization.service';
import { Lang } from '../../../services/config/lang';
import { UserService } from '../../../services/person/user.service'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  registerForm: FormGroup;
  handleError: any = null;
  isLoading = false;
  isError = false;
  isSuccess = false;
  message = { title: '', content: '' };
  isSubmitted = false;
  file: File = null;
  user: any = null;
  avatarPath = '';
  avatarPreviewPath = '';

  // language
  currentLanguage = Lang.currentLang;
  translations: any = null;

  constructor(
    private router: Router,
    private internationalizationService: InternationalizationService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private userService: UserService) { }

  ngOnInit() {
    this.changeLanguage(this.currentLanguage);
    this.initForm();
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
      gender: ['', [Validators.required]],
      avatar: [''],
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]],
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

  onSelectfile(event) {
    this.file = event.target.files[0];
    console.log(event.target.files[0]);
    this.previewAvatar();
  }

  previewAvatar() {
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.avatarPreviewPath = reader.result as string;
    };
  }

  chooseFile() {
    document.getElementById('my_file').click();
  }

  computeFileName() {
    if (this.file.name.length > 15) {
      return this.file.name.substr(0, 20) + '  ...';
    } else {
      return this.file.name;
    }
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

    if(!this.checkPassword()) {
      this.message.title = 'Erreur'
      this.message.content = 'Les mots de passes saisit ne correspondent pas veuillez reessaye !';
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
    formData.append('job', 'VISITOR');
    this.userService.post(formData)
      .then(resp => {
        console.log(resp);
        this.message.title = 'Success'
        this.message.content = 'Votre compte a ete cree avec success, veuillez vous connectez pour acceder a votre espace prive';
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
