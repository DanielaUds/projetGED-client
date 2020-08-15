import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RandomNumberComponent } from './containers/random-number/random-number.component';
import { AdministratorRoutingModule } from './administrator.routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NavBarComponent } from './containers/index/nav-bar/nav-bar.component';
import { LeftSideComponent } from './containers/index/left-side/left-side.component';
import { CreateFolderComponent } from './containers/create-folder/create-folder.component';
import { UpdateInfoComponent } from './containers/profil/update-infos/update-info.component';
import { PendingDocumentsComponent } from './containers/documents/pending-documents/pending-documents.component';
import { AcceptedDocumentsComponent } from './containers/documents/accepted-documents/accepted-documents.component';
import { ArchivedDocumentsComponent } from './containers/documents/archived-documents/archived-documents.component';
import { RejectedDocumentsComponent } from './containers/documents/rejected-documents/rejected-documents.component';
import { IndexComponent } from './containers/index/index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdministratorHomeComponent } from './containers/admin-home/admin-home.component';

@NgModule({
  declarations: [
    IndexComponent,
    RandomNumberComponent,
    UpdateInfoComponent,
    PendingDocumentsComponent,
    AcceptedDocumentsComponent,
    ArchivedDocumentsComponent,
    RejectedDocumentsComponent,
    NavBarComponent,
    LeftSideComponent,
    CreateFolderComponent,
    AdministratorHomeComponent,
  ],
  imports: [
    CommonModule,
    AdministratorRoutingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdministratorModule { }
