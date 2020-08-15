import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { NotificationService } from '../../../../../services/notification.service';
import { Lang } from '../../../../../services/config/lang';
import { InternationalizationService } from '../../../../../services/features/internationalization.service';
import { FolderService } from '../../services/folder.service';
import { UserService } from '../../../../../services/person/user.service'

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdministratorHomeComponent implements OnInit {

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
    private internationalizationService: InternationalizationService,
    private notificationService: NotificationService,
    private router: Router,
    private folderService: FolderService,
    private userService: UserService) {}

  ngOnInit() {
    this.internationalizationService.changeLanguage(this.currentLanguage, (res) => { this.translations = res; });
    this.user = this.authService.getUserInfos();
    this.avatarPath = this.user.avatar;
    this.getUserFolders();
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
      })
      .catch((err) => {
        console.log(err);
        this.notificationService.danger(this.translations.VisitorHome.ServerUnavailable);
      });
    } else {
      this.notificationService.danger("Votre session a expiree veuillez vous connecter");
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

  gotToDoc(url) {
    this.router.navigate(['private/visitors/documents' + url]);
  }

  goTo(url) {
    this.router.navigate([url]);
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
