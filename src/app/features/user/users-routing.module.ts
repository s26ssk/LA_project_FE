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
  { path: 'user', redirectTo: 'user/list', pathMatch: 'full' }, // Chuyển hướng đường dẫn mặc định

  // Đường dẫn đến màn hình ADM002
  {
    path: 'user/list',
    component: UserListComponent,
    canActivate: [AuthorizeGuard],
  },

  // Đường dẫn đến màn hình ADM004 mode add
  {
    path: 'user/add',
    component: ADM004Component,
    canActivate: [AuthorizeGuard],
  },

  // Đường dẫn đến màn hình ADM005
  {
    path: 'user/confirm-employee',
    component: ADM005Component,
    canActivate: [AuthorizeGuard],
  },

  // Đường dẫn đến màn hình ADM006
  {
    path: 'user/success',
    component: Adm006Component,
    canActivate: [AuthorizeGuard],
  },

  // Đường dẫn đến màn hình ADM003
  {
    path: 'user/detail',
    component: ADM003Component,
    canActivate: [AuthorizeGuard],
  },

  // Đường dẫn đến màn hình ADM004 mode edit
  {
    path: 'user/edit',
    component: ADM004Component,
    canActivate: [AuthorizeGuard],
  },

  // Route không hợp lệ - Page Not Found
  {
    path: 'page-not-found',
    component: SystemErrorComponent,
    data: { message: 'ページが見つかりません。' },
  },

  // Route để xử lý lỗi hệ thống
  {
    path: 'system-error',
    component: SystemErrorComponent,
    data: { message: 'システムエラーが発生しました。' },
  },

  // Route không xác định
  { path: '**', redirectTo: 'page-not-found' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
