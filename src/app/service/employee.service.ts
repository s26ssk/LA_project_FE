import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/app-constants';
import { EmployeeRequest } from '../model/employee-request.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = AppConstants.BASE_URL_API + '/employees';

  constructor(private http: HttpClient) {}

  getEmployees(
    searchParams: any,
    page: number,
    size: number,
    ordEmployeeName: 'asc' | 'desc' | null,
    ordCertificationName: 'asc' | 'desc' | null,
    ordEndDate: 'asc' | 'desc' | null
  ): Observable<any> {
    let params = new HttpParams()
      .set('offset', String(page * size))
      .set('limit', String(size));

    if (searchParams.employee_name) {
      params = params.set('employee_name', searchParams.employee_name);
    }

    if (searchParams.department_id) {
      params = params.set('department_id', String(searchParams.department_id));
    }

    if (ordEmployeeName) {
      params = params.set('ord_employee_name', ordEmployeeName);
    }

    if (ordCertificationName) {
      params = params.set('ord_certification_name', ordCertificationName);
    }

    if (ordEndDate) {
      params = params.set('ord_end_date', ordEndDate);
    }

    return this.http.get(this.apiUrl, { params });
  }

  addEmployee(employeeRequest: EmployeeRequest): Observable<any> {
    return this.http.post(this.apiUrl, employeeRequest);
  }
  getEmployeeDetail(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  updateEmployee(
    id: string,
    employeeRequest: EmployeeRequest
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, employeeRequest);
  }
}
