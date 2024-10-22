import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './list/user-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  BsDatepickerConfig,
  BsDatepickerModule,
} from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ADM004Component } from './adm004/adm004.component';
import { ADM005Component } from './adm005/adm005.component';
import { Adm006Component } from './adm006/adm006.component';
import { ADM003Component } from './adm003/adm003.component';

@NgModule({
  declarations: [UserListComponent, ADM004Component, ADM005Component, Adm006Component, ADM003Component],
  imports: [
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    CommonModule,
    SharedModule,
    UsersRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [BsDatepickerConfig, DatePipe],
})
export class UsersModule {}
