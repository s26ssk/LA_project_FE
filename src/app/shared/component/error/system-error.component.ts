import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-system-error',
  templateUrl: './system-error.component.html',
})
export class SystemErrorComponent {
  constructor(private router: Router) {}

  handleOkClick() {
    const accessToken = sessionStorage.getItem('access_token');

    if (accessToken) {
      this.router.navigate(['/user/list']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
