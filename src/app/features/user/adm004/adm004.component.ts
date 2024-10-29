import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Certification } from 'src/app/model/certification.dto';
import { Department } from 'src/app/model/department.dto';
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
  departments: Department[] = [];
  certifications: Certification[] = [];
  employeeId: string | undefined;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private certificationService: CertificationService,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  @ViewChild('employeeLoginId', { static: true })
  employeeLoginId!: ElementRef;

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
    this.getDepartments();
    this.getCertifications();
    this.restoreFormData();
    this.setFocusToEmployeeLoginId();
    this.employeeForm.get('certificationId')?.valueChanges.subscribe(() => {
      this.toggleCertificationFields();
    });
    this.toggleCertificationFields();
  }
  setFocusToEmployeeLoginId(): void {
    if (this.employeeLoginId) {
      this.employeeLoginId.nativeElement.focus();
    }
  }
  checkEditMode(): void {
    const state = history.state;
    if (state && state.employeeId) {
      this.employeeId = state.employeeId;
      this.isEditMode = state.isEditMode;
    }
    if (this.employeeId) {
      const employeeData = sessionStorage.getItem('employeeData');

      if (employeeData) {
        this.employeeForm.patchValue(JSON.parse(employeeData));
      } else {
        this.getEmployeeById(this.employeeId);
      }
      this.employeeForm.valueChanges.subscribe((value) => {
        sessionStorage.setItem('employeeData', JSON.stringify(value));
        this.checkValidation();
      });

      this.isEditMode = true;
    } else {
      this.initializeForm();
    }
  }

  initializeForm(): void {
    this.employeeForm = this.fb.group(
      {
        employeeName: ['', [Validators.required, Validators.maxLength(125)]],
        employeeBirthDate: ['', [Validators.required]],
        employeeEmail: [
          '',
          [
            Validators.required,
            Validators.maxLength(125),
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            ),
          ],
        ],
        employeeTelephone: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern(/^[0-9]+$/),
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
        certificationStartDate: [{ value: '', disable: true }],
        certificationEndDate: [{ value: '', disable: true }],
        certificationScore: [{ value: '', disable: true }],
      },
      {
        validators: [
          this.passwordMatchValidator,
          this.dateOrderValidator,
          this.positiveIntegerValidator,
        ],
      }
    );

    this.employeeForm
      .get('employeeConfirmLoginPassword')
      ?.valueChanges.subscribe(() => {
        this.employeeForm.setValidators([this.passwordMatchValidator]);
      });
    this.employeeForm
      .get('employeeLoginPassword')
      ?.valueChanges.subscribe(() => {
        this.employeeForm
          .get('employeeConfirmLoginPassword')
          ?.updateValueAndValidity();

        const validationErrors = this.passwordMatchValidator(this.employeeForm);
        if (validationErrors) {
          this.employeeForm.get('employeeConfirmLoginPassword')?.setErrors({
            ...this.employeeForm.get('employeeConfirmLoginPassword')?.errors,
            ...validationErrors,
          });
        }
      });
    this.employeeForm
      .get('certificationStartDate')
      ?.valueChanges.subscribe(() => {
        this.employeeForm.get('certificationEndDate')?.updateValueAndValidity();

        const validationErrors = this.dateOrderValidator(this.employeeForm);
        if (validationErrors) {
          this.employeeForm.get('certificationEndDate')?.setErrors({
            ...this.employeeForm.get('certificationEndDate')?.errors,
            ...validationErrors,
          });
        }
      });

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
        this.router.navigate(['**']);
      },
      complete: () => {
        console.log('complete');
      },
    });
  }

  patchFormWithEmployeeData(employee: any): void {
    const hasCertification =
      employee.certifications && employee.certifications.length > 0;

    this.employeeForm.patchValue({
      employeeName: employee.employeeName,
      employeeBirthDate: new Date(employee.employeeBirthDate),
      employeeEmail: employee.employeeEmail,
      employeeTelephone: employee.employeeTelephone,
      employeeNameKana: employee.employeeNameKana,
      employeeLoginId: employee.employeeLoginId,
      departmentId: employee.departmentId,

      certificationId: hasCertification
        ? employee.certifications[0].certificationId
        : '',
      certificationStartDate: hasCertification
        ? employee.certifications[0]?.certificationStartDate || ''
        : '',
      certificationEndDate: hasCertification
        ? employee.certifications[0]?.certificationEndDate || ''
        : '',
      certificationScore: hasCertification
        ? employee.certifications[0]?.certificationScore || ''
        : '',
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
        pattern: ErrorMessages.ER005_EMPLOYEE_EMAIL,
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
      },
      certificationEndDate: {
        required: ErrorMessages.ER001_CERTIFICATION_END_DATE,
        dateInvalid: ErrorMessages.ER012_CERTIFICATION_END_BEFORE_START,
      },
      certificationScore: {
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

          if (errors['required']) {
            errorMessages.push(messages['required']);
          }

          Object.keys(errors).forEach((errorKey) => {
            if (messages[errorKey] && errorKey !== 'required') {
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

    if (password !== confirmPassword) {
      control
        .get('employeeConfirmLoginPassword')
        ?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  dateOrderValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('certificationStartDate')?.value;
    const endDate = control.get('certificationEndDate')?.value;

    if (endDate < startDate) {
      control.get('certificationEndDate')?.setErrors({ dateInvalid: true });
      return { dateInvalid: true };
    } else {
    }

    return null;
  }

  positiveIntegerValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.get('certificationScore')?.value;

    if (control.get('certificationScore')?.hasError('required')) {
      return null;
    }

    if (!Number.isInteger(+value) || +value <= 0) {
      control
        .get('certificationScore')
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
    const certificationScoreControl =
      this.employeeForm.get('certificationScore');

    if (certificationId === '') {
      certificationStartDateControl?.disable();
      certificationEndDateControl?.disable();
      certificationScoreControl?.disable();

      certificationStartDateControl?.reset();
      certificationEndDateControl?.reset();
      certificationScoreControl?.reset();

      certificationStartDateControl?.clearValidators();
      certificationEndDateControl?.clearValidators();
      certificationScoreControl?.clearValidators();
      this.employeeForm.clearValidators();
    } else {
      certificationStartDateControl?.enable();
      certificationEndDateControl?.enable();
      certificationScoreControl?.enable();

      certificationStartDateControl?.setValidators([Validators.required]);
      certificationEndDateControl?.setValidators([Validators.required]);
      certificationScoreControl?.setValidators([Validators.required]);
      this.employeeForm.setValidators([
        this.dateOrderValidator,
        this.positiveIntegerValidator,
      ]);
      this.checkValidation();
    }

    certificationStartDateControl?.updateValueAndValidity();
    certificationEndDateControl?.updateValueAndValidity();
    const validationErrors = this.dateOrderValidator(this.employeeForm);
    if (validationErrors) {
      certificationEndDateControl?.setErrors({
        ...certificationEndDateControl?.errors,
        ...validationErrors,
      });
    }
    certificationScoreControl?.updateValueAndValidity();
  }
  backButton(): void {
    const state = history.state;

    if (state && state.employeeId) {
      this.router.navigate(['user/detail']);
    } else {
      this.router.navigate(['user/list']);
    }
  }

  saveEmployeeData() {
    const password = this.employeeForm.get('employeeLoginPassword')?.value;
    const confirmPassword = this.employeeForm.get(
      'employeeConfirmLoginPassword'
    )?.value;

    if (this.employeeId) {
      if (password || confirmPassword) {
        this.employeeForm
          .get('employeeLoginPassword')
          ?.setValidators([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(50),
          ]);
        this.employeeForm
          .get('employeeConfirmLoginPassword')
          ?.setValidators([Validators.required]);
        this.employeeForm.setValidators([this.passwordMatchValidator]);
      } else {
        this.employeeForm.get('employeeLoginPassword')?.clearValidators();
        this.employeeForm
          .get('employeeConfirmLoginPassword')
          ?.clearValidators();
      }
    } else {
      this.employeeForm
        .get('employeeLoginPassword')
        ?.setValidators([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(50),
        ]);
      this.employeeForm
        .get('employeeConfirmLoginPassword')
        ?.setValidators([Validators.required]);
      this.employeeForm.setValidators([this.passwordMatchValidator]);
    }

    this.employeeForm.get('employeeLoginPassword')?.updateValueAndValidity();
    this.employeeForm
      .get('employeeConfirmLoginPassword')
      ?.updateValueAndValidity();
    this.toggleCertificationFields();

    if (this.employeeForm.valid) {
      sessionStorage.setItem(
        'employeeData',
        JSON.stringify(this.employeeForm.value)
      );
      this.findDepartmentName();
      this.findCertificationName();
      this.router.navigate(['user/confirm-employee'], {
        state: { isEditMode: this.isEditMode, employeeId: this.employeeId },
      });
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }
}
