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
  allFolders: any[] = [];
  pendingFolders: any[] = [];
  treatedFolders: any[] = [];
  onWorkingFolders: any[] = [];
  rejectedFolders: any[] = [];

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
    this.getUserFolders();
    this.initAvatar();
  }

  initAvatar() {
    this.avatarPath = this.user.avatar ? config.apiUrl + '/' + this.user.avatar : '';
  }

  getUserFolders() {
    let user_id = this.user ? this.user.id : null;
    if(user_id) {
      this.folderService.getUserFolders(user_id)
      .then((resp) => {
        this.allFolders = resp;
        if(this.allFolders && this.allFolders.length > 0) 
          this.filterFolders();
        console.log(this.allFolders);
        this.notificationService.success(this.translations.FolderTrackingJS.Notif1);
      })
      .catch((err) => {
        console.log(err);
        this.notificationService.danger(this.translations.FolderTrackingJS.Notif2);
      });
    } else {
      this.notificationService.danger(this.translations.FolderTrackingJS.Notif3);
      this.router.navigate(['/private/login']);
    }
  }

  filterFolders() {
    this.pendingFolders = this.allFolders.filter((folder) => folder.status === 'PENDING');
    this.onWorkingFolders = this.allFolders.filter((folder) => folder.status === 'ACCEPTED');
    this.treatedFolders = this.allFolders.filter((folder) => folder.status === 'ARCHIVED');
    this.rejectedFolders = this.allFolders.filter((folder) => folder.status === 'REJECTED');
    console.log('Dossiers en attente: ', this.pendingFolders);
    console.log('Dossiers acceptes: ', this.onWorkingFolders);
    console.log('Dossiers Archives: ', this.treatedFolders);
    console.log('Dossiers rejetes: ', this.rejectedFolders);
  }

  onSubmit() {
    this.isError = false;
    this.isSuccess = false;
    this.isLoading = false;
    this.isSubmitted = true;
    this.handleError = null;
    if (this.track_id === null || this.track_id === '') {
      this.message.title = this.translations.FolderTrackingJS.Error;
      this.message.content = 'Vous devez saisir le numero du dossier si vous souhaitez tracker un de vos dossiers';
      this.isError = true;
      this.notificationService.danger(this.message.content);
      return;
    }
    let result = parseInt(this.track_id);
    console.log(result);
    if(!result) {
      this.message.title = 'Erreur'
      this.message.content = 'L\'identifiant du dossier que vous souhaitez tracker est un nombre. Veuillez saisir un nombre';
      this.isError = true;
      this.notificationService.danger(this.message.content);
      return;
    }
    this.track_id = result + '';
    this.isLoading = true;
    this.folderService.findByTrackId(this.track_id)
    .then(resp => { 
      console.log(resp);
      this.tracked_folder = resp;
      this.message.title = 'Success'
      this.message.content = 'Nous avons pu retrouver votre dossier, vous pouvez a present consulter son etat d\avancement consulter l\'evolution';
      this.isSuccess = true;
      this.notificationService.success(this.message.content);
    })
    .catch(err => {
      this.isError = true;
      this.message.title = 'Erreur'
      this.message.content = 'Nous n\'avons pas reussi a retrouver votre dossier. Ceci peut etre du au fait que le numero du dossier sois incorrect ou un probleme de connexion a internet. Veuillez verifier ces parametres puis reessayer ';
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

  changeLanguage(value) {
    this.currentLanguage = value;
    this.internationalizationService.changeLanguage(this.currentLanguage, (res) => { this.translations = res; });
  }

}
