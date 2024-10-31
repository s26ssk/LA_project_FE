/**
 * Copyright(C) 2024  Luvina
 * ADM003Component.ts, 21/10/2024 KhanhNV
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../service/employee.service';
import { ConfirmMessages } from 'src/app/model/confirm-message.enum';

@Component({
  selector: 'app-adm003',
  templateUrl: './adm003.component.html',
  styleUrls: ['./adm003.component.css'],
})

/**
 * Component xử lý các chức năng của màn hình ADM003
 */
export class ADM003Component implements OnInit {
  employeeDetail: any; // Biến lưu trữ thông tin chi tiết nhân viên

  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadEmployeeDetail();
  }

  /**
   * Tải thông tin chi tiết của nhân viên từ localStorage hoặc state
   */
  loadEmployeeDetail(): void {
    const savedEmployeeDetail = localStorage.getItem('employeeDetail'); // Lấy thông tin từ localStorage
    if (savedEmployeeDetail) {
      this.employeeDetail = JSON.parse(savedEmployeeDetail); // Phân tích dữ liệu JSON
    } else {
      const state = history.state; // Lấy trạng thái từ lịch sử
      if (state && state.employeeId) {
        this.getEmployeeDetail(state.employeeId); // Lấy thông tin nhân viên nếu có ID
      } else {
        this.router.navigate(['system-error']); // Điều hướng đến trang không tìm thấy nếu không có ID
      }
    }
  }

  /**
   * Lấy thông tin chi tiết của nhân viên từ dịch vụ nhân viên
   * @param id ID của nhân viên muốn lấy thông tin
   */
  getEmployeeDetail(id: string): void {
    this.employeeService.getEmployeeDetail(id).subscribe({
      next: (response) => {
        this.employeeDetail = response; // Lưu trữ thông tin chi tiết nhân viên
        localStorage.setItem(
          'employeeDetail',
          JSON.stringify(this.employeeDetail) // Lưu thông tin vào localStorage
        );
      },
      error: (error) => {
        console.error(error);
        this.router.navigate(['system-error']); // Điều hướng đến trang không tìm thấy
      },
      complete: () => {
        console.log('complete');
      },
    });
  }

  /**
   * Xóa thông tin nhân viên
   */
  deleteEmployee(): void {
    const employeeId = this.employeeDetail.employeeId; // Lấy ID của nhân viên
    const isConfirmed = window.confirm('削除しますが、よろしいでしょうか。'); // Xác nhận xóa
    if (isConfirmed) {
      this.employeeService.deleteEmployee(employeeId).subscribe({
        next: (response) => {
          if (response.code === '200') {
            localStorage.removeItem('employeeDetail'); // Xóa thông tin nhân viên khỏi localStorage
            this.router.navigate(['/user/success'], {
              state: { message: ConfirmMessages.CONFIRM_DELETE }, // Chuyển đến trang thành công với thông báo
            });
          }
        },
        error: (error) => {
          console.log(error); // Ghi log lỗi nếu có
          this.router.navigate(['system-error']); // Điều hướng đến trang không tìm thấy
        },
        complete: () => {
          console.log('complete'); // Ghi log khi hoàn thành
        },
      });
    }
  }

  /**
   * Điều hướng đến trang chỉnh sửa thông tin nhân viên
   */
  navigateToEditEmployee(): void {
    const employeeId = this.employeeDetail.employeeId; // Lấy ID của nhân viên
    this.router.navigate(['/user/edit'], {
      state: { employeeId }, // Chuyển ID đến trang chỉnh sửa
    });
  }

  /**
   * Quay lại trang danh sách nhân viên
   */
  goBack(): void {
    localStorage.removeItem('employeeDetail'); // Xóa thông tin nhân viên khỏi localStorage
    this.router.navigate(['/user/list']); // Điều hướng đến trang danh sách
  }
}
