import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../service/employee.service';
import { EmployeeRequest } from '../../../model/employee-request.model';
import { ConfirmMessages } from 'src/app/model/confirm-message.enum';

@Component({
  selector: 'app-adm005',
  templateUrl: './adm005.component.html',
  styleUrls: ['./adm005.component.css'],
})
export class ADM005Component implements OnInit {
  employeeData: any;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const data = sessionStorage.getItem('employeeData');
    if (data) {
      this.employeeData = JSON.parse(data);
    } else {
      this.router.navigate(['/user/add']);
    }
  }
  resetPasswordsAndGoBack(): void {
    this.employeeData.employeeLoginPassword = '';
    this.employeeData.employeeConfirmLoginPassword = '';
    sessionStorage.setItem('employeeData', JSON.stringify(this.employeeData));
    this.router.navigate(['/user/add']);
  }

  saveEmployee() {
    const employeeRequest: EmployeeRequest = {
      employeeLoginId: this.employeeData.employeeLoginId,
      departmentId: this.employeeData.departmentId,
      employeeName: this.employeeData.employeeName,
      employeeNameKana: this.employeeData.employeeNameKana,
      employeeBirthDate: this.formatDate(this.employeeData.employeeBirthDate),
      employeeEmail: this.employeeData.employeeEmail,
      employeeTelephone: this.employeeData.employeeTelephone,
      employeeLoginPassword: this.employeeData.employeeConfirmLoginPassword,
      certifications: this.employeeData.certificationId
        ? [
            {
              certificationId: this.employeeData.certificationId,
              certificationStartDate: this.formatDate(
                this.employeeData.certificationStartDate
              ),
              certificationEndDate: this.formatDate(
                this.employeeData.certificationEndDate
              ),
              certificationScore: this.employeeData.certificationScore,
            },
          ]
        : [],
    };

    this.employeeService.addEmployee(employeeRequest).subscribe({
      next: (response) => {
        if (response.code == 200) {
          this.router.navigate(['/user/success'], {
            state: { message: ConfirmMessages.CONFIRM_ADD },
          });
        } else {
          this.errorMessage = `[${response.params.join(
            ', '
          )}] は既に存在しています。`;
          console.log(response);
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('complete');
      },
    });
  }
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }
}
