import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './containers/index/index.component';
import { SuperadminGuard } from '../auth/guards/superadmin.guard';
import { EmployeeGuard } from '../auth/guards/employee.guard';
import { VisitorGuard } from '../auth/guards/visitor.guard';
import { AdministratorGuard } from '../auth/guards/administrator.guard';
import { LoginComponent } from '../auth/containers/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'superadmins',
        loadChildren:
          () => import('./containers/superadmin/superadmin.module').then(m => m.SuperadminModule),
        canActivate: [SuperadminGuard],
        canLoad: [SuperadminGuard] /* */
      },
      {
        path: 'employees',
        loadChildren:
          () => import('./containers/employee/employee.module').then(m => m.EmployeeModule),
        canActivate: [EmployeeGuard],
        canLoad: [EmployeeGuard] /* */
      },
      {
        path: 'visitors',
        loadChildren:
          () => import('./containers/visitor/visitor.module').then(m => m.VisitorModule),
        canActivate: [VisitorGuard],
        canLoad: [VisitorGuard] /* */
      },
      {
        path: 'administrators',
        loadChildren:
          () => import('./containers/administrator/administrator.module').then(m => m.AdministratorModule),
        canActivate: [AdministratorGuard],
        canLoad: [AdministratorGuard] /* */
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
