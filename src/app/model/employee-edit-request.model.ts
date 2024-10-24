export interface EmployeeEditRequest {
  employeeId: string;
  employeeLoginId: string;
  departmentId: string;
  employeeName: string;
  employeeNameKana: string;
  employeeBirthDate: string;
  employeeEmail: string;
  employeeTelephone: string;
  employeeLoginPassword: string;
  certifications: CertificationRequest[];
}

export interface CertificationRequest {
  certificationId: string;
  certificationStartDate: string;
  certificationEndDate: string;
  certificationScore: number;
}
