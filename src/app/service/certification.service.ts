import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/app-constants';

@Injectable({
  providedIn: 'root',
})
export class CertificationService {
  private apiUrl = AppConstants.BASE_URL_API + '/certifications';

  constructor(private http: HttpClient) {}

  getAllCertifications(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
