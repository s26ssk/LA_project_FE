import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/app-constants';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiUrl = AppConstants.BASE_URL_API + '/departments';

  constructor(private http: HttpClient) {}

  getAllDepartments(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
