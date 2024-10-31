import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/app-constants';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiUrl = AppConstants.BASE_URL_API + '/departments'; // URL API cho các yêu cầu liên quan đến phòng ban

  constructor(private http: HttpClient) {}

  // Phương thức để lấy tất cả phòng ban
  getAllDepartments(): Observable<any> {
    return this.http.get(this.apiUrl); // Gửi yêu cầu GET đến API và trả về Observable
  }
}
