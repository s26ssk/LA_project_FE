import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../service/employee.service';
import { ConfirmMessages } from 'src/app/model/confirm-message.enum';

@Component({
  selector: 'app-adm003',
  templateUrl: './adm003.component.html',
  styleUrls: ['./adm003.component.css'],
})
export class ADM003Component implements OnInit {
  employeeDetail: any;

  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const savedEmployeeDetail = localStorage.getItem('employeeDetail');
    if (savedEmployeeDetail) {
      this.employeeDetail = JSON.parse(savedEmployeeDetail);
    } else {
      const state = history.state;
      if (state && state.employeeId) {
        this.getEmployeeDetail(state.employeeId);
      } else {
        this.router.navigate(['**']);
      }
    }
  }

  getEmployeeDetail(id: string): void {
    this.employeeService.getEmployeeDetail(id).subscribe({
      next: (response) => {
        this.employeeDetail = response;
        console.log(response);
        // Lưu lại employeeDetail vào localStorage
        localStorage.setItem(
          'employeeDetail',
          JSON.stringify(this.employeeDetail)
        );
      },
      error: (error) => {
        console.error(error);
        this.router.navigate(['**']);
      },
      complete: () => {
        console.log('complete');
      },
    });
  }

  deleteEmployee(): void {
    const employeeId = this.employeeDetail.employeeId;
    const isConfirmed = window.confirm('削除しますが、よろしいでしょうか。');
    if (isConfirmed) {
      this.employeeService.deleteEmployee(employeeId).subscribe({
        next: (response) => {
          if (response.code === '200') {
            localStorage.removeItem('employeeDetail');
            this.router.navigate(['/user/success'], {
              state: { message: ConfirmMessages.CONFIRM_DELETE },
            });
          }
        },
        error: (error) => {
          console.log(error);
          this.router.navigate(['**']);
        },
        complete: () => {
          console.log('complete');
        },
      });
    }
  }

  navigateToEditEmployee(): void {
    const employeeId = this.employeeDetail.employeeId;
    this.router.navigate(['/user/edit'], {
      state: { employeeId },
    });
  }
  goBack(): void {
    localStorage.removeItem('employeeDetail');
    this.router.navigate(['/user/list']);
  }
}
