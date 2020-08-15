import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../../../../../services/notification.service';
import { UserService } from '../../../../../../services/person/user.service';
import { InternationalizationService } from '../../../../../../services/features/internationalization.service';
import { Lang } from '../../../../../../services/config/lang';

@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.component.html',
  styleUrls: ['./update-info.component.css']
})
export class UpdateInfoComponent implements OnInit {

  registerForm: FormGroup;
  handleError: any = null;
  isLoading = false;
  isError = false;
  isSuccess = false;
  isSubmitted = false;
  file: File = null;
  message = { title: '', content: '' };
  user: any = null;
  avatarPath = '';
  avatarPreviewPath = '';

  // language
  currentLanguage = Lang.currentLang;
  translations: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private internationalizationService: InternationalizationService,
    private userService: UserService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.user = this.authService.getUserInfos();
    this.initAvatar();
    this.initForm();
    this.changeLanguage(this.currentLanguage);
  }

  initForm() {
    this.registerForm = this.formBuilder.group({
      first_name: [this.user.first_name? this.user.first_name: ''],
      last_name: [this.user.last_name? this.user.last_name: ''],
      birth_date: [this.user.birth_date? this.user.birth_date: ''],
      birth_place: [this.user.birth_place ? this.user.birth_place : ''],
      tel: [this.user.tel? this.user.tel: ''],
      email: [this.user.email? this.user.email: '', [Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/)]],
      language: [this.user.language ? this.user.language : ''],
      gender: [this.user.gender? this.user.gender: ''],
      files: [''],
      login: [this.user.login? this.user.login: ''],
      password: [this.user.password? this.user.password: ''],
      confirm_password: [this.user.password? this.user.password: ''],
    });
  }

  initAvatar() {
    this.avatarPath = this.user.avatar ? this.user.avatar : '';
    this.avatarPreviewPath = this.avatarPath;
  }

  onSelectfile(event) {
    this.file = event.target.files[0];
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

  computeMarriedStatus() {
    return (this.user.infos.is_married === '1') ? 'UpdatePersonnalInfo.Yes' : 'UpdatePersonnalInfo.No';
  }

  get form() {
    return this.registerForm.controls;
  }

  isValidPhonenumber(value) {
    return (/^\d{7,}$/).test(value.replace(/[\s()+\-\.]|ext/gi, ''));
  }

  onSubmit() {
    this.isError = false;
    this.isSuccess = false;
    this.isLoading = false;
    this.isSubmitted = true;

    console.log('user: ', this.user);
    if (!this.isValidPhonenumber(this.form.tel.value)) {
      this.message.title = 'Erreur'
      this.message.content = 'Le numero de telephone saisi est invalide, votre saisit ne respecte pas le format numeros de telephone. Exemple: 691971542';
      this.notificationService.danger(this.message.content);
      this.isError = true;
      return;
    }

    if(this.form.email.status === 'INVALID' && this.form.email.value) {
      this.message.title = 'Erreur'
      this.message.content = 'L\'adresse email saisie n\'est pas valide, votre saisit ne respecte pas le format des adresse email. Exemple: toto@gmail.com';
      this.notificationService.danger(this.message.content);
      this.isError = true;
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
        } else if (k === 'files') {
          formData.append(k, this.file);
        } else {
          formData.append(k + '', data[k].value);
        }
      }
    }
    this.userService.put(this.user.id, formData)
      .then(resp => {
        this.avatarPath = resp.avatar;
        this.user = resp;
        this.authService.storeUserInfos(this.user);
        this.message.title = 'Success'
        this.message.content = 'Vos informations personnelles ont ete mis a jour avec succes, vous pouvez poursuivre votre navigation en toute securite';
        this.notificationService.success(this.message.content);
        this.isSuccess = true;
        return;
      })
      .catch(err => {
        const errs = err.error.errors;
        console.log(err);
        this.handleError = errs;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  checkPassword() {
    return this.form.password.value === this.form.confirm_password.value;
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

}
