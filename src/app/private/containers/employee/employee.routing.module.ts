import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RandomNumberComponent } from './containers/random-number/random-number.component';
import { UpdateInfoComponent } from './containers/update-infos/update-info.component';
import { CreateFolderComponent } from './containers/create-folder/create-folder.component';
import { IndexComponent } from './containers/index/index.component';

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
        path: 'create-folder',
        component: CreateFolderComponent,
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
export class EmployeeRoutingModule { }
