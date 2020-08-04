import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateRoutingModule } from './private.routing.module';
import { IndexComponent } from './containers/index/index.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from '../auth/containers/login/login.component';
import { NavBarComponent } from './containers/index/nav-bar/nav-bar.component';

@NgModule({
  declarations: [
    IndexComponent, LoginComponent, NavBarComponent
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ]
})
export class PrivateModule { }
