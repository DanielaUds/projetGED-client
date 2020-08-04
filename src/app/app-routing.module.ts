import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'private' },
  {
    path: 'private',
    loadChildren:
      () => import('./private/private.module').then(m => m.PrivateModule),
  },
  {
    path: 'public',
    loadChildren:
      () => import('./public/public.module').then(m => m.PublicModule),
  }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
