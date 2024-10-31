import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-system-error',
  templateUrl: './system-error.component.html',
})
export class SystemErrorComponent implements OnInit {
  errorMessage: string = 'システムエラーが発生しました。'; // Khởi tạo với giá trị mặc định

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Lấy thông điệp từ data route
    this.route.data.subscribe((data) => {
      this.errorMessage = data['message'] || 'システムエラーが発生しました。'; // Sử dụng thông điệp mặc định nếu không có
    });
  }

  handleOkClick() {
    const accessToken = sessionStorage.getItem('access_token');

    if (accessToken) {
      this.router.navigate(['/user/list']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
