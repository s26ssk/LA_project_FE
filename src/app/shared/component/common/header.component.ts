import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  constructor(private router: Router, private viewport: ViewportScroller) {}

  logout() {
    sessionStorage.removeItem('access_token');
    this.router.navigate(['login']);
    return false;
  }
  top() {
    this.viewport.scrollToPosition([0, 0]);
  }
}
