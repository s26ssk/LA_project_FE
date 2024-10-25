import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Department } from 'src/app/model/department.dto';
import { Employee } from 'src/app/model/employee.dto';
import { DepartmentService } from 'src/app/service/department.service';
import { EmployeeService } from 'src/app/service/employee.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent {
  searchForm: FormGroup;
  employees: Employee[] = [];
  departments: Department[] = [];
  totalRecords: number = 0;
  pageSize: number = 5;
  currentPage: number = 1;
  totalPages: number = 0;
  ordEmployeeName: 'asc' | 'desc' | null = null;
  ordCertificationName: 'asc' | 'desc' | null = null;
  ordEndDate: 'asc' | 'desc' | null = null;
  pageNumbers: number[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) {
    this.searchForm = this.fb.group({
      employee_name: ['', [Validators.maxLength(125)]],
      department_id: [''],
    });
  }

  @ViewChild('employeeNameInput', { static: true })
  employeeNameInput!: ElementRef;
  setFocusToEmployeeName(): void {
    if (this.employeeNameInput) {
      this.employeeNameInput.nativeElement.focus();
    }
  }

  ngOnInit(): void {
    this.clearEmployeeData();
    this.setFocusToEmployeeName();
    this.getDepartments();
    this.getEmployees();
    localStorage.removeItem('employeeDetail');
  }
  clearEmployeeData() {
    sessionStorage.removeItem('employeeData');
  }
  getDepartments() {
    this.departmentService.getAllDepartments().subscribe({
      next: (response) => {
        this.departments = response.departments;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('complete');
      },
    });
  }

  getEmployees() {
    if (this.searchForm.invalid) {
      return;
    }

    this.employeeService
      .getEmployees(
        this.searchForm.value,
        this.currentPage - 1,
        this.pageSize,
        this.ordEmployeeName,
        this.ordCertificationName,
        this.ordEndDate
      )
      .subscribe({
        next: (response) => {
          this.employees = response.employees;

          this.totalRecords = response.totalRecords;
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
          this.updatePagination();
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log('complete');
        },
      });
  }

  searchEmployees() {
    this.currentPage = 1;
    this.getEmployees();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getEmployees();
  }

  updatePagination() {
    this.pageNumbers = [];

    if (this.totalPages <= 1) {
      return;
    }

    const prevPage = this.currentPage - 1;
    const nextPage = this.currentPage + 1;

    if (this.currentPage > 3) {
      this.pageNumbers.push(1);
      this.pageNumbers.push(-1);
    } else if (this.currentPage === 3) {
      this.pageNumbers.push(1);
    }

    if (prevPage >= 1) this.pageNumbers.push(prevPage);

    this.pageNumbers.push(this.currentPage);

    if (nextPage <= this.totalPages) this.pageNumbers.push(nextPage);

    if (this.currentPage < this.totalPages - 2) {
      this.pageNumbers.push(-1);
      this.pageNumbers.push(this.totalPages);
    } else if (this.currentPage === this.totalPages - 2) {
      this.pageNumbers.push(this.totalPages);
    }
  }

  sortByEmployeeName() {
    this.ordCertificationName = null;
    this.ordEndDate = null;
    this.ordEmployeeName = this.ordEmployeeName === 'asc' ? 'desc' : 'asc';
    this.getEmployees();
  }

  sortByCertificationName() {
    this.ordEmployeeName = null;
    this.ordEndDate = null;
    this.ordCertificationName =
      this.ordCertificationName === 'asc' ? 'desc' : 'asc';
    this.getEmployees();
  }

  sortByEndDate() {
    this.ordEmployeeName = null;
    this.ordCertificationName = null;
    this.ordEndDate = this.ordEndDate === 'asc' ? 'desc' : 'asc';
    this.getEmployees();
  }
}
