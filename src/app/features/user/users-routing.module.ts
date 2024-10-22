import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemErrorComponent } from 'src/app/shared/component/error/system-error.component';
import { UserListComponent } from './list/user-list.component';
import { AuthorizeGuard } from '../../shared/auth/authorize.guard';
import { ADM004Component } from './adm004/adm004.component';
import { ADM005Component } from './adm005/adm005.component';
import { Adm006Component } from './adm006/adm006.component';
import { ADM003Component } from './adm003/adm003.component';

const routes: Routes = [
  { path: 'user', redirectTo: 'user/list', pathMatch: 'full' },
  {
    path: 'user/list',
    component: UserListComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: 'user/add',
    component: ADM004Component,
    canActivate: [AuthorizeGuard],
  },
  {
    path: 'user/confirm-employee',
    component: ADM005Component,
    canActivate: [AuthorizeGuard],
  },
  {
    path: 'user/success',
    component: Adm006Component,
    canActivate: [AuthorizeGuard],
  },
  {
    path: 'user/detail',
    component: ADM003Component,
    canActivate: [AuthorizeGuard],
  },
  {
    path: 'user/edit',
    component: ADM004Component,
    canActivate: [AuthorizeGuard],
  },
  { path: '**', component: SystemErrorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
