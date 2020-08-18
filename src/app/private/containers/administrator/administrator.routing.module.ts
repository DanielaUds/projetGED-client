import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RandomNumberComponent } from './containers/random-number/random-number.component';
import { UpdateInfoComponent } from './containers/profil/update-infos/update-info.component';
import { PendingDocumentsComponent } from './containers/documents/pending-documents/pending-documents.component';
import { AcceptedDocumentsComponent } from './containers/documents/accepted-documents/accepted-documents.component';
import { TreatedDocumentsComponent } from './containers/documents/treated-documents/treated-documents.component';
import { RejectedDocumentsComponent } from './containers/documents/rejected-documents/rejected-documents.component';
import { DetailsPageComponent } from './containers/documents/details-page/details-page.component';
import { IndexComponent } from './containers/index/index.component';
import { AdministratorHomeComponent } from './containers/admin-home/admin-home.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      {
        path: 'workspace',
        component: AdministratorHomeComponent,
      },
      {
        path: 'profil',
        children: [
          {
            path: 'modify-my-informations',
            component: UpdateInfoComponent,
          },
        ]
      },
      {
        path: 'random-number',
        component: RandomNumberComponent,
      },
      {
        path: 'documents',
        children: [
          {
            path: 'pending-documents',
            component: PendingDocumentsComponent
          },
          {
            path: 'details-page/:id',
            component: DetailsPageComponent
          },
          {
            path: 'accepted-documents',
            component: AcceptedDocumentsComponent
          },
          {
            path: 'rejected-documents',
            component: RejectedDocumentsComponent
          },
          {
            path: 'archived-documents',
            component: TreatedDocumentsComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AdministratorRoutingModule { }
