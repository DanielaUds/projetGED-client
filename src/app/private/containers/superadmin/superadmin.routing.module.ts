import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './containers/index/index.component';
import { CreateUserComponent } from './containers/create-user/create-user.component';
import { RandomNumberComponent } from './containers/random-number/random-number.component';


const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      {
        path: 'random-number',
        component: RandomNumberComponent,
      },
      {
        path: 'create-user',
        component: CreateUserComponent,
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
export class SuperadminRoutingModule { }
