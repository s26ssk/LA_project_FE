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
  searchForm: FormGroup; // FormGroup để quản lý trạng thái của form tìm kiếm
  employees: Employee[] = []; // Mảng lưu trữ danh sách nhân viên
  departments: Department[] = []; // Mảng lưu trữ danh sách phòng ban
  totalRecords: number = 0; // Tổng số bản ghi trong danh sách nhân viên
  pageSize: number = 5; // Số lượng bản ghi trên mỗi trang
  currentPage: number = 1; // Trang hiện tại
  totalPages: number = 0; // Tổng số trang
  ordEmployeeName: 'asc' | 'desc' | null = null; // Key sắp xếp theo tên nhân viên
  ordCertificationName: 'asc' | 'desc' | null = null; // Key sắp xếp theo tên chứng chỉ
  ordEndDate: 'asc' | 'desc' | null = null; // Key sắp xếp theo ngày kết thúc
  pageNumbers: number[] = []; // Mảng lưu trữ số trang để hiển thị phân trang

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) {
    // Khởi tạo form tìm kiếm với các trường và xác thực
    this.searchForm = this.fb.group({
      employee_name: ['', [Validators.maxLength(125)]],
      department_id: [''],
    });
  }

  // Sử dụng ViewChild để truy cập vào phần tử DOM với selector là 'employeeNameInput'
  @ViewChild('employeeNameInput', { static: true })
  employeeNameInput!: ElementRef;

  ngOnInit(): void {
    this.clearEmployeeData(); // Xóa dữ liệu nhân viên khỏi sessionStorage và localStorage
    this.setFocusToEmployeeName(); // Thiết lập tiêu điểm cho trường tìm kiếm tên nhân viên
    this.getDepartments(); // Lấy danh sách phòng ban
    this.getEmployees(); // Lấy danh sách nhân viên
  }

  /**
   * Thiết lập con trỏ cho trường employeeNameInput
   */
  setFocusToEmployeeName(): void {
    if (this.employeeNameInput) {
      this.employeeNameInput.nativeElement.focus();
    }
  }

  /**
   * Xóa dữ liệu nhân viên khỏi sessionStorage và localStorage
   */
  clearEmployeeData() {
    sessionStorage.removeItem('employeeData');
    localStorage.removeItem('employeeDetail');
  }

  /**
   * Lấy danh sách tất cả các phòng ban từ dịch vụ phòng ban
   */
  getDepartments() {
    this.departmentService.getAllDepartments().subscribe({
      next: (response) => {
        this.departments = response.departments; // Lưu danh sách phòng ban vào biến departments
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('complete');
      },
    });
  }

  /**
   * Lấy danh sách nhân viên theo các điều kiện tìm kiếm
   */
  getEmployees() {
    if (this.searchForm.invalid) {
      return;
    }

    this.employeeService
      .getEmployees(
        this.searchForm.value, // Lấy giá trị từ form tìm kiếm
        this.currentPage - 1, // Trang hiện tại (giảm 1 vì trang bắt đầu từ 0)
        this.pageSize, // Kích thước trang
        this.ordEmployeeName, // Điều kiện sắp xếp theo tên nhân viên
        this.ordCertificationName, // Điều kiện sắp xếp theo tên chứng chỉ
        this.ordEndDate // Điều kiện sắp xếp theo ngày kết thúc
      )
      .subscribe({
        next: (response) => {
          this.employees = response.employees; // Lưu danh sách nhân viên vào biến employees

          this.totalRecords = response.totalRecords; // Lưu tổng số bản ghi
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize); // Tính tổng số trang
          this.updatePagination(); // Cập nhật phân trang
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log('complete');
        },
      });
  }

  /**
   * Tìm kiếm nhân viên theo điều kiện tìm kiếm hiện tại
   */
  searchEmployees() {
    this.currentPage = 1;
    this.getEmployees();
  }

  /**
   * Xử lý sự thay đổi trang
   * @param page Trang mới để hiển thị
   */
  onPageChange(page: number) {
    this.currentPage = page;
    this.getEmployees();
  }

  /**
   * Cập nhật số trang hiển thị trên phân trang
   */
  updatePagination() {
    this.pageNumbers = []; // Xóa mảng số trang hiện tại

    if (this.totalPages <= 1) {
      return; // Nếu chỉ có một trang, dừng lại
    }

    const prevPage = this.currentPage - 1; // Trang trước trang hiện tại
    const nextPage = this.currentPage + 1; // Trang tiếp theo trang hiện tại

    // Xử lý số trang hiển thị
    if (this.currentPage > 3) {
      this.pageNumbers.push(1); // Thêm trang đầu tiên
      this.pageNumbers.push(-1); // Thêm dấu ba chấm
    } else if (this.currentPage === 3) {
      this.pageNumbers.push(1); // Thêm trang đầu tiên nếu trang hiện tại là 3
    }

    if (prevPage >= 1) this.pageNumbers.push(prevPage); // Thêm trang trước nếu có

    this.pageNumbers.push(this.currentPage); // Thêm trang hiện tại

    if (nextPage <= this.totalPages) this.pageNumbers.push(nextPage); // Thêm trang tiếp theo nếu có

    // Xử lý việc hiển thị trang cuối
    if (this.currentPage < this.totalPages - 2) {
      this.pageNumbers.push(-1); // Thêm dấu ba chấm
      this.pageNumbers.push(this.totalPages); // Thêm trang cuối cùng
    } else if (this.currentPage === this.totalPages - 2) {
      this.pageNumbers.push(this.totalPages); // Thêm trang cuối cùng nếu trang hiện tại là trang kế cuối
    }
  }

  /**
   * Sắp xếp danh sách nhân viên theo tên
   */
  sortByEmployeeName() {
    this.ordCertificationName = null; // Đặt lại điều kiện sắp xếp tên chứng chỉ
    this.ordEndDate = null; // Đặt lại điều kiện sắp xếp ngày kết thúc
    this.ordEmployeeName = this.ordEmployeeName === 'asc' ? 'desc' : 'asc'; // Đổi chiều sắp xếp
    this.getEmployees(); // Gọi hàm lấy nhân viên
  }

  /**
   * Sắp xếp danh sách nhân viên theo tên chứng chỉ
   */
  sortByCertificationName() {
    this.ordEmployeeName = null; // Đặt lại điều kiện sắp xếp tên nhân viên
    this.ordEndDate = null; // Đặt lại điều kiện sắp xếp ngày kết thúc
    this.ordCertificationName =
      this.ordCertificationName === 'asc' ? 'desc' : 'asc'; // Đổi chiều sắp xếp
    this.getEmployees(); // Gọi hàm lấy nhân viên
  }

  /**
   * Sắp xếp danh sách nhân viên theo ngày kết thúc
   */
  sortByEndDate() {
    this.ordEmployeeName = null; // Đặt lại điều kiện sắp xếp tên nhân viên
    this.ordCertificationName = null; // Đặt lại điều kiện sắp xếp tên chứng chỉ
    this.ordEndDate = this.ordEndDate === 'asc' ? 'desc' : 'asc'; // Đổi chiều sắp xếp
    this.getEmployees(); // Gọi hàm lấy nhân viên
  }
}
