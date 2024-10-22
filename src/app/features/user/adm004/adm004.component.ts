import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorMessages } from 'src/app/model/error-messages.enum';
import { CertificationService } from 'src/app/service/certification.service';
import { DepartmentService } from 'src/app/service/department.service';
import { EmployeeService } from 'src/app/service/employee.service';

@Component({
  selector: 'app-adm004',
  templateUrl: './adm004.component.html',
  styleUrls: ['./adm004.component.css'],
})
export class ADM004Component {
  employeeForm!: FormGroup;
  departments: any[] = [];
  certifications: any[] = [];
  employeeId: string | undefined;

  constructor(
    private fb: FormBuilder,
    private certificationService: CertificationService,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    const state = history.state;
    if (state && state.employeeId) {
      this.employeeId = state.employeeId;
    }
    if (this.employeeId) {
      this.getEmployeeById(this.employeeId);
    } else {
      this.initializeForm();
    }

    this.getDepartments();
    this.getCertifications();
    this.restoreFormData();
    this.employeeForm.get('certificationId')?.valueChanges.subscribe(() => {
      this.toggleCertificationFields();
    });
  }

  initializeForm(): void {
    this.employeeForm = this.fb.group(
      {
        employeeName: ['', [Validators.required, Validators.maxLength(125)]],
        employeeBirthDate: ['', [Validators.required]],
        employeeEmail: [
          '',
          [Validators.required, Validators.email, Validators.maxLength(125)],
        ],
        employeeTelephone: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern(/^0[1-9][0-9]{8}$/),
          ],
        ],
        employeeNameKana: [
          '',
          [
            Validators.required,
            Validators.maxLength(125),
            Validators.pattern(/^[\uFF61-\uFF9F]+$/),
          ],
        ],
        employeeLoginId: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern(/^(?![0-9])[a-zA-Z0-9_]*$/),
          ],
        ],
        employeeLoginPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(50),
          ],
        ],
        employeeConfirmLoginPassword: ['', [Validators.required]],
        departmentId: ['', [Validators.required]],
        departmentName: [''],
        certificationId: [''],
        certificationName: [''],
        certificationStartDate: [''],
        certificationEndDate: [''],
        employeeCertificationScore: [''],
      },
      {
        validators: [
          this.passwordMatchValidator,
          this.dateOrderValidator,
          this.positiveIntegerValidator,
        ],
      }
    );

    this.employeeForm.valueChanges.subscribe((value) => {
      sessionStorage.setItem('employeeData', JSON.stringify(value));
      this.checkValidation();
    });
  }
  getEmployeeById(id: string): void {
    this.employeeService.getEmployeeDetail(id).subscribe({
      next: (response) => {
        this.patchFormWithEmployeeData(response);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('complete');
      },
    });
  }

  patchFormWithEmployeeData(employee: any): void {
    this.employeeForm.patchValue({
      employeeName: employee.employeeName,
      employeeBirthDate: new Date(employee.employeeBirthDate),
      employeeEmail: employee.employeeEmail,
      employeeTelephone: employee.employeeTelephone,
      employeeNameKana: employee.employeeNameKana,
      employeeLoginId: employee.employeeLoginId,
      departmentId: employee.departmentId,
      certificationId: employee.certifications?.[0].certificationId,
      certificationStartDate: employee.certifications?.[0]?.startDate || '',
      certificationEndDate: employee.certifications?.[0]?.endDate || '',
      employeeCertificationScore: employee.certifications?.[0]?.score || '',
    });
  }

  checkValidation() {
    const form = this.employeeForm;

    const validationMapping: { [key: string]: { [key: string]: string } } = {
      employeeName: {
        required: ErrorMessages.ER001_EMPLOYEE_NAME,
        maxlength: ErrorMessages.ER006_EMPLOYEE_NAME,
      },
      employeeBirthDate: {
        required: ErrorMessages.ER001_EMPLOYEE_BIRTHDATE,
        invalidDateFormat: ErrorMessages.ER005_EMPLOYEE_BIRTHDATE,
      },
      employeeEmail: {
        required: ErrorMessages.ER001_EMPLOYEE_EMAIL,
        maxlength: ErrorMessages.ER006_EMPLOYEE_EMAIL,
        email: ErrorMessages.ER005_EMPLOYEE_EMAIL,
      },
      employeeTelephone: {
        required: ErrorMessages.ER001_EMPLOYEE_TELEPHONE,
        maxlength: ErrorMessages.ER006_EMPLOYEE_TELEPHONE,
        pattern: ErrorMessages.ER008_EMPLOYEE_TELEPHONE,
      },
      employeeNameKana: {
        required: ErrorMessages.ER001_EMPLOYEE_NAME_KANA,
        maxlength: ErrorMessages.ER006_EMPLOYEE_NAME_KANA,
        pattern: ErrorMessages.ER009_EMPLOYEE_NAME_KANA,
      },
      employeeLoginId: {
        required: ErrorMessages.ER001_EMPLOYEE_LOGIN_ID,
        maxlength: ErrorMessages.ER006_EMPLOYEE_LOGIN_ID,
        pattern: ErrorMessages.ER019_EMPLOYEE_LOGIN_ID,
      },
      employeeLoginPassword: {
        required: ErrorMessages.ER001_EMPLOYEE_PASSWORD,
        minlength: ErrorMessages.ER007_EMPLOYEE_PASSWORD,
        maxlength: ErrorMessages.ER007_EMPLOYEE_PASSWORD,
      },
      employeeConfirmLoginPassword: {
        required: ErrorMessages.ER001_EMPLOYEE_CONFIRM_LOGIN_PASSWORD,
        passwordMismatch: ErrorMessages.ER0017_EMPLOYEE_CONFIRM_LOGIN_PASSWORD,
      },
      departmentId: {
        required: ErrorMessages.ER002_DEPARTMENT_ID,
      },
      certificationId: {
        required: ErrorMessages.ER002_CERTIFICATION_ID,
      },
      certificationStartDate: {
        required: ErrorMessages.ER001_CERTIFICATION_START_DATE,
        invalidDateFormat: ErrorMessages.ER005_CERTIFICATION_START_DATE,
      },
      certificationEndDate: {
        required: ErrorMessages.ER001_CERTIFICATION_END_DATE,
        dateInvalid: ErrorMessages.ER012_CERTIFICATION_END_BEFORE_START,
      },
      employeeCertificationScore: {
        required: ErrorMessages.ER001_CERTIFICATION_SCORE,
        notPositiveInteger: ErrorMessages.ER018_CERTIFICATION_SCORE,
      },
    };

    Object.keys(validationMapping).forEach((field) => {
      const control = form.get(field);
      if (control?.touched && control.invalid) {
        const errors = control.errors;
        if (errors) {
          const messages = validationMapping[field];
          const errorMessages: string[] = [];

          Object.keys(errors).forEach((errorKey) => {
            if (messages[errorKey]) {
              errorMessages.push(messages[errorKey]);
            }
          });
          control.setErrors({ ...errors, message: errorMessages });
        }
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.employeeForm.get(controlName);
    if (control?.errors) {
      const message = control.errors['message'] || '';
      return message;
    }
    return '';
  }

  getDepartments() {
    this.departmentService.getAllDepartments().subscribe({
      next: (response) => {
        this.departments = response.departments;
        this.findDepartmentName();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('complete');
      },
    });
  }

  getCertifications() {
    this.certificationService.getAllCertifications().subscribe({
      next: (response) => {
        this.certifications = response.certifications;
        this.findCertificationName();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('complete');
      },
    });
  }

  findDepartmentName(): void {
    const departmentId = this.employeeForm.get('departmentId')?.value;

    this.departments.forEach((department: any) => {
      if (department.departmentId == departmentId) {
        this.employeeForm.patchValue({
          departmentName: department.departmentName,
        });
      }
    });
  }

  findCertificationName(): void {
    const certificationId = this.employeeForm.get('certificationId')?.value;
    this.certifications.forEach((certification: any) => {
      if (certification.certificationId == certificationId) {
        this.employeeForm.patchValue({
          certificationName: certification.certificationName,
        });
      }
    });
  }

  restoreFormData() {
    const savedData = sessionStorage.getItem('employeeData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData.employeeBirthDate) {
        parsedData.employeeBirthDate = this.convertStringToDate(
          parsedData.employeeBirthDate
        );
      }
      if (parsedData.certificationStartDate) {
        parsedData.certificationStartDate = this.convertStringToDate(
          parsedData.certificationStartDate
        );
      }
      if (parsedData.certificationEndDate) {
        parsedData.certificationEndDate = this.convertStringToDate(
          parsedData.certificationEndDate
        );
      }
      this.employeeForm.patchValue(parsedData);
    }
  }
  convertStringToDate(dateString: string): Date {
    return new Date(Date.parse(dateString));
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('employeeLoginPassword')?.value;
    const confirmPassword = control.get('employeeConfirmLoginPassword')?.value;

    if (password === confirmPassword) {
      control.get('employeeConfirmLoginPassword')?.setErrors(null);
      return null;
    } else {
      control
        .get('employeeConfirmLoginPassword')
        ?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
  }

  dateOrderValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('certificationStartDate')?.value;
    const endDate = control.get('certificationEndDate')?.value;

    if (endDate < startDate) {
      control.get('certificationEndDate')?.setErrors({ dateInvalid: true });
      return { dateInvalid: true };
    }

    return null;
  }

  positiveIntegerValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.get('employeeCertificationScore')?.value;

    if (!Number.isInteger(+value) || +value <= 0) {
      control
        .get('employeeCertificationScore')
        ?.setErrors({ notPositiveInteger: true });
      return { notPositiveInteger: true };
    }

    return null;
  }

  toggleCertificationFields(): void {
    const certificationId = this.employeeForm.get('certificationId')?.value;
    const certificationStartDateControl = this.employeeForm.get(
      'certificationStartDate'
    );
    const certificationEndDateControl = this.employeeForm.get(
      'certificationEndDate'
    );
    const employeeCertificationScoreControl = this.employeeForm.get(
      'employeeCertificationScore'
    );

    if (certificationId === '') {
      certificationStartDateControl?.disable();
      certificationEndDateControl?.disable();
      employeeCertificationScoreControl?.disable();

      certificationStartDateControl?.clearValidators();
      certificationEndDateControl?.clearValidators();
      employeeCertificationScoreControl?.clearValidators();
    } else {
      certificationStartDateControl?.enable();
      certificationEndDateControl?.enable();
      employeeCertificationScoreControl?.enable();

      certificationStartDateControl?.setValidators([Validators.required]);
      certificationEndDateControl?.setValidators([Validators.required]);
      employeeCertificationScoreControl?.setValidators([Validators.required]);

      this.checkValidation();
    }

    certificationStartDateControl?.updateValueAndValidity();
    certificationEndDateControl?.updateValueAndValidity();
    employeeCertificationScoreControl?.updateValueAndValidity();
  }

  saveEmployeeData() {
    if (
      this.employeeForm.get('certificationId')?.value == '' ||
      this.employeeForm.valid
    ) {
      sessionStorage.setItem(
        'employeeData',
        JSON.stringify(this.employeeForm.value)
      );
      this.findDepartmentName();
      this.findCertificationName();
      this.router.navigate(['user/confirm-employee']);
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }
}
