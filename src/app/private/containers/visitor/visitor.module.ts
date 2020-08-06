import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorHomeComponent } from './containers/visitor-home/visitor-home.component';
import { VisitorRoutingModule } from './visitor.routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NavBarComponent } from './containers/index/nav-bar/nav-bar.component';
import { LeftSideComponent } from './containers/index/left-side/left-side.component';
import { IndexComponent } from './containers/index/index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    IndexComponent,
    VisitorHomeComponent,
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
