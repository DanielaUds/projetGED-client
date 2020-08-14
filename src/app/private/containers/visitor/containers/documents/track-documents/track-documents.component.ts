import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../../../../auth/services/auth.service';
import { config } from '../../../../../../config';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../../../../../services/notification.service';
import { Lang } from '../../../../../../services/config/lang';
import { InternationalizationService } from '../../../../../../services/features/internationalization.service';
import { FolderService } from './../../../services/folder.service';

@Component({
  selector: 'app-track-documents',
  templateUrl: './track-documents.component.html',
  styleUrls: ['./track-documents.component.css']
})
export class TrackDocumentsComponent implements OnInit {

  user = null;
  avatarPath = '';
  trackForm: FormGroup;
  translations: any = null;
  currentLanguage = Lang.currentLang;
  handleError: any = null;
  isLoading = false;
  isError = false;
  isSuccess = false;
  message = { title: '', content: '' };
  isSubmitted = false;
  track_id: string = '';
  tracked_folder = null;
  folderProgression = 0;
  progression = null;
  trackService = null;
  textColor = '';

  constructor(
    private authService: AuthService, 
    private formBuilder: FormBuilder,
    private internationalizationService: InternationalizationService,
    private notificationService: NotificationService,
    private router: Router,
    private folderService: FolderService) {}

  ngOnInit() {
    this.internationalizationService.changeLanguage(this.currentLanguage, (res) => { this.translations = res; });
    this.user = this.authService.getUserInfos();
    this.initAvatar();
  }

  initAvatar() {
    this.avatarPath = this.user.avatar ? config.apiUrl + '/' + this.user.avatar : '';
  }

  onSubmit() {
    this.isError = false;
    this.isSuccess = false;
    this.isLoading = false;
    this.isSubmitted = true;
    this.handleError = null;
    this.trackService = null;
    this.folderProgression = 0;
    if (this.track_id === null || this.track_id === '') {
      this.message.title = this.translations.FolderTrackingJS.Error;
      this.message.content = this.translations.FolderTrackingJS.FillTrackId;
      this.isError = true;
      this.notificationService.danger(this.message.content);
      return;
    }
    let result = parseInt(this.track_id);
    console.log(result);
    if(!result) {
      this.message.title = this.translations.FolderTrackingJS.Error;
      this.message.content = this.translations.FolderTrackingJS.WrongFill;
      this.isError = true;
      this.notificationService.danger(this.message.content);
      return;
    }
    this.track_id = result + '';
    const formData = new FormData();
    formData.append('track_id', this.track_id);
    formData.append('user_id', this.user.id);

    this.isLoading = true;
    this.folderService.getPourcentage(formData)
    .then(resp => { 
      console.log(resp);
      this.progression = resp;
      this.trackService = resp.service;
      this.folderProgression = Math.round(resp.data);
      this.message.title = this.translations.FolderTrackingJS.Success;
      this.message.content = this.translations.FolderTrackingJS.SuccessMessage;
      this.isSuccess = true;
      this.notificationService.success(this.message.content);
    })
    .catch(err => {
      this.isError = true;
      this.message.title = this.translations.FolderTrackingJS.Error;
      this.message.content = this.translations.FolderTrackingJS.ErrorMessage;
      this.isError = true;
      this.notificationService.danger(this.message.content);
    })
    .finally(() => {
      this.isLoading = false;
    });
  }

  computeBgProgressBar() {
    if(this.progression) {
      if(this.progression.status === 'REJECTED')
        return 'bg-danger';
      if(this.progression.status === 'ACCEPTED')
        return 'bg-primary';
      if(this.progression.status === 'FINISH')
        return 'bg-success';
      if(this.progression.status === 'PENDING')
        return 'bg-warning';
    }
    return 'bg-secondary';
  }
xy
  computeStatus() {
    if(this.progression) {
      if(this.progression.status === 'REJECTED') {
        this.textColor = 'text-danger';
        return 'a été rejeté';
      }
      if(this.progression.status === 'ACCEPTED') {
        this.textColor = 'text-primary';
        return 'en cours de traitement';
      }
      if(this.progression.status === 'FINISH') {
        this.textColor = 'text-success';
        return 'a terminé son traitement';
      }
      if(this.progression.status === 'PENDING') {
        this.textColor = 'text-warning'
        return 'est en attente de traitement';
      }     
    }
    return 'bg-secondary';
  }

  cancel() {
    this.isError = false;
    this.isSuccess = false;
    this.message = { title: '', content: '' };
  }

  displayUserLanguage() {
    if (this.user.language) {
      if (this.user.language === 'fr') {
        return 'Francais';
      } else if (this.user.language === 'en') {
        return 'Anglais';
      } else {
        return this.translations.FolderTrackingJS.Languages;
      }
    }
  }

  changeLanguage(value) {
    this.currentLanguage = value;
    this.internationalizationService.changeLanguage(this.currentLanguage, (res) => { this.translations = res; });
  }

}
