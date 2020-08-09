import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorHomeComponent } from './containers/visitor-home/visitor-home.component';
import { VisitorRoutingModule } from './visitor.routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NavBarComponent } from './containers/index/nav-bar/nav-bar.component';
import { LeftSideComponent } from './containers/index/left-side/left-side.component';
import { IndexComponent } from './containers/index/index.component';
import { UpdateInfoComponent } from './containers/profil/update-infos/update-info.component';
import { PendingDocumentsComponent } from './containers/documents/pending-documents/pending-documents.component';
import { AcceptedDocumentsComponent } from './containers/documents/accepted-documents/accepted-documents.component';
import { ArchivedDocumentsComponent } from './containers/documents/archived-documents/archived-documents.component';
import { RejectedDocumentsComponent } from './containers/documents/rejected-documents/rejected-documents.component';
import { TrackDocumentsComponent } from './containers/documents/track-documents/track-documents.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    IndexComponent,
    VisitorHomeComponent,
    UpdateInfoComponent,
    PendingDocumentsComponent,
    AcceptedDocumentsComponent,
    ArchivedDocumentsComponent,
    RejectedDocumentsComponent,
    TrackDocumentsComponent,
    NavBarComponent,
    LeftSideComponent
  ],
  imports: [
    CommonModule,
    VisitorRoutingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class VisitorModule { }
