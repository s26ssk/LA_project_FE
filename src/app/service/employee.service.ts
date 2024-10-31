import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/app-constants';
import { EmployeeRequest } from '../model/employee-request.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = AppConstants.BASE_URL_API + '/employees'; // URL API cho các yêu cầu liên quan đến nhân viên

  constructor(private http: HttpClient) {}

  getEmployees(
    searchParams: any, // Tham số tìm kiếm
    page: number, // Số trang hiện tại
    size: number, // Kích thước trang
    ordEmployeeName: 'asc' | 'desc' | null, // Thứ tự sắp xếp theo tên nhân viên
    ordCertificationName: 'asc' | 'desc' | null, // Thứ tự sắp xếp theo tên chứng chỉ
    ordEndDate: 'asc' | 'desc' | null // Thứ tự sắp xếp theo ngày kết thúc
  ): Observable<any> {
    // Khởi tạo các tham số truy vấn
    let params = new HttpParams()
      .set('offset', String(page * size)) // Tính toán offset cho phân trang
      .set('limit', String(size)); // Thiết lập giới hạn số lượng bản ghi trả về

    // Thiết lập các tham số tìm kiếm nếu có
    if (searchParams.employee_name) {
      params = params.set('employee_name', searchParams.employee_name); // Thêm tham số tên nhân viên
    }

    if (searchParams.department_id) {
      params = params.set('department_id', String(searchParams.department_id)); // Thêm tham số ID phòng ban
    }

    // Thiết lập thứ tự sắp xếp nếu có
    if (ordEmployeeName) {
      params = params.set('ord_employee_name', ordEmployeeName); // Thêm tham số sắp xếp theo tên nhân viên
    }

    if (ordCertificationName) {
      params = params.set('ord_certification_name', ordCertificationName); // Thêm tham số sắp xếp theo tên chứng chỉ
    }

    if (ordEndDate) {
      params = params.set('ord_end_date', ordEndDate); // Thêm tham số sắp xếp theo ngày kết thúc
    }

    return this.http.get(this.apiUrl, { params }); // Gửi yêu cầu GET đến API và trả về Observable
  }

  // Phương thức để thêm một nhân viên mới
  addEmployee(employeeRequest: EmployeeRequest): Observable<any> {
    return this.http.post(this.apiUrl, employeeRequest); // Gửi yêu cầu POST với dữ liệu nhân viên
  }

  // Phương thức để lấy thông tin chi tiết của một nhân viên theo ID
  getEmployeeDetail(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`); // Gửi yêu cầu GET đến API với ID nhân viên
  }

  // Phương thức để xóa một nhân viên theo ID
  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`); // Gửi yêu cầu DELETE đến API với ID nhân viên
  }

  // Phương thức để cập nhật thông tin một nhân viên
  updateEmployee(employeeRequest: EmployeeRequest): Observable<any> {
    return this.http.put(this.apiUrl, employeeRequest); // Gửi yêu cầu PUT với dữ liệu nhân viên
  }
}
