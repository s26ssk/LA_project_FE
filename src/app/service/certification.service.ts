import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/app-constants';

@Injectable({
  providedIn: 'root',
})
export class CertificationService {
  private apiUrl = AppConstants.BASE_URL_API + '/certifications'; // URL API cho các yêu cầu liên quan đến chứng chỉ

  constructor(private http: HttpClient) {}

  // Phương thức để lấy tất cả chứng chỉ
  getAllCertifications(): Observable<any> {
    return this.http.get(this.apiUrl); // Gửi yêu cầu GET đến API và trả về Observable
  }
}
