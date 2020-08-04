import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './containers/index/index.component';
import { OtherGuard } from '../auth/guards/other.guard';
import { SuperadminGuard } from '../auth/guards/superadmin.guard';
import { LoginComponent } from '../auth/containers/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
        // canActivate: [AuthGuard] /* */
      },
      {
        path: 'superadmins',
        loadChildren:
          () => import('./containers/superadmin/superadmin.module').then(m => m.SuperadminModule),
        canActivate: [SuperadminGuard],
        canLoad: [SuperadminGuard] /* */
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
export class PrivateRoutingModule { }
