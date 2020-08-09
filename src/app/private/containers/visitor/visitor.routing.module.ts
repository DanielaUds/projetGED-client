import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitorHomeComponent } from './containers/visitor-home/visitor-home.component';
import { UpdateInfoComponent } from './containers/profil/update-infos/update-info.component';
import { PendingDocumentsComponent } from './containers/documents/pending-documents/pending-documents.component';
import { AcceptedDocumentsComponent } from './containers/documents/accepted-documents/accepted-documents.component';
import { ArchivedDocumentsComponent } from './containers/documents/archived-documents/archived-documents.component';
import { RejectedDocumentsComponent } from './containers/documents/rejected-documents/rejected-documents.component';
import { TrackDocumentsComponent } from './containers/documents/track-documents/track-documents.component';
import { IndexComponent } from './containers/index/index.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      {
        path: 'workspace',
        component: VisitorHomeComponent,
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
        path: 'documents',
        children: [
          {
            path: 'pending-documents',
            component: PendingDocumentsComponent
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
            component: ArchivedDocumentsComponent
          },
          {
            path: 'track-documents',
            component: TrackDocumentsComponent
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
export class VisitorRoutingModule { }
