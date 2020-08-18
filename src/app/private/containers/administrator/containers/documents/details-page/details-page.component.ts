import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { NotificationService } from '../../../../../../services/notification.service';
import { FolderService } from '../../../services/folder.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.css']
})
export class DetailsPageComponent implements OnInit {

  randomNumber: Observable<number>;
  folder = null;
  data: any[] = [];

  loading = false;
  isError = false;
  isSuccess = false;
  message = { title: '', content: '' };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private folderService: FolderService) {}

  ngOnInit() {
    const folder_id = +this.route.snapshot.paramMap.get('id');
    this.getFolder(folder_id);
  }

  getFolder(folder_id: number) {
      this.folderService.detailsPageFolder(folder_id).then(
      resp => {
        this.data = resp;
        this.folder = resp;
        console.log(resp);
        this.notificationService.success('dossier chargé');
      }
    ).catch(
      err => {
        console.log(err);
        this.notificationService.danger('Serveur indisponible');
      }
    )
  }

  public back() {
    this.router.navigate(['/private/administrators/documents/accepted-documents']);
  }

  rejectFolder(item: any){
    this.folderService.rejectFolderByService(item.activity_instance_id)
      .then((resp) => {
        console.log('Dossier rejete',resp);
      })
      .catch((err) => {
        console.log(err);
        this.notificationService.danger("Serveur indisponible veuillez verifier votre connexion a internet");
      })
  }

  
  approuvedFolder(item: any){
    console.log(item.id);
    this.folderService.approuvedFolderByService(item.activity_instance_id)
      .then((resp) => {
        console.log('Dossier Approuve',resp);
        this.message.title = 'Succes'
        this.message.content = 'Vous avez approuvez le dossier. La description du dossier choisi que vous venez de signer est la suivante: ' + 'item.description + a present commencer le traitement du dossier dans votre service';
        this.notificationService.success(this.message.content);
        this.isSuccess = true;
      })
      .catch((err) => {
        console.log(err);
        this.notificationService.danger("Serveur indisponible veuillez verifier votre connexion a internet");
      })
  }



}
