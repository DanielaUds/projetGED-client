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
  selector: 'app-treated-documents',
  templateUrl: './treated-documents.component.html',
  styleUrls: ['./treated-documents.component.css']
})
export class TreatedDocumentsComponent implements OnInit {

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
    this.getService();
  }

  initAvatar() {
    this.avatarPath = this.user.avatar ? config.apiUrl + '/' + this.user.avatar : '';
  }

  getService() {
    this.folderService.getListFoldersFinish(this.user.service_id, this.user)
      .then((resp) => {
        this.data = resp;
        console.log('treated folders: ', resp);
      })
      .catch((err) => {
        console.log(err);
        this.notificationService.danger("Serveur indisponible veuillez verifier votre connexion a internet");
      })

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
    this.router.navigate(['/private/administrators/documents/details-page/' + item.id]);
  }

  public delete(item: any) {
    return;
  }

  changeLanguage(value) {
    this.currentLanguage = value;
    this.internationalizationService.changeLanguage(this.currentLanguage, (res) => { this.translations = res; });
  }

}
