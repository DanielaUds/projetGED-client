import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../../../../auth/services/auth.service';
import { config } from '../../../../../../config';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../../../services/notification.service';
import { Lang } from '../../../../../../services/config/lang';
import { InternationalizationService } from '../../../../../../services/features/internationalization.service';
import { FolderService } from '../../../services/folder.service';
import { parseDate } from 'src/app/helpers/date.parser';

@Component({
  selector: 'app-accepted-documents',
  templateUrl: './accepted-documents.component.html',
  styleUrls: ['./accepted-documents.component.css']
})
export class AcceptedDocumentsComponent implements OnInit {

  user = null;
  avatarPath = '';
  translations: any = null;
  currentLanguage = Lang.currentLang;
  handleError: any = null;
  loading = false;
  isError = false;
  isSuccess = false;
  message = { title: '', content: '' };
  data: any[] = [];
  parser = parseDate;

  constructor(
    private authService: AuthService, 
    private internationalizationService: InternationalizationService,
    private notificationService: NotificationService,
    private router: Router,
    private folderService: FolderService) {}

  ngOnInit() {
    this.internationalizationService.changeLanguage(this.currentLanguage, (res) => { this.translations = res; });
    this.user = this.authService.getUserInfos();
    this.initAvatar();
    this.getFolders();
  }

  initAvatar() {
    this.avatarPath = this.user.avatar ? config.apiUrl + '/' + this.user.avatar : '';
  }

  getFolders() {
    let user_id = this.user ? this.user.id : null;
    if(user_id) {
      this.loading = true;
      this.folderService.getUserAcceptedFolders(user_id)
      .then((resp) => {
        this.data = resp;
        console.log(resp);
      })
      .catch((err) => {
        console.log(err);
        this.notificationService.danger("Serveur indisponible veuillez verifier votre connexion a internet");
      })
      .finally( () => {
        this.loading = false;
      });
    } else {
      this.notificationService.danger("Votre session a expiree veuillez vous connecter");
      this.router.navigate(['/private/login']);
    }
  }

  cancel() {
    this.isError = false;
    this.isSuccess = false;
    this.message = { title: '', content: '' };
  }

  public display(str: string) {
    return str.length > 20 ? str.substr(0, 17) + '...': str;
  }

  public details(item: any) {
    return;
  }

  public delete(item: any) {
    return;
  }

  changeLanguage(value) {
    this.currentLanguage = value;
    this.internationalizationService.changeLanguage(this.currentLanguage, (res) => { this.translations = res; });
  }

}
