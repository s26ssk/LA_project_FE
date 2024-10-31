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
  employeeForm!: FormGroup; // Khai báo form để quản lý thông tin nhân viên
  departments: Department[] = []; // Danh sách phòng ban
  certifications: Certification[] = []; // Danh sách chứng chỉ
  employeeId: string | undefined; // ID của nhân viên được chỉnh sửa
  isEditMode: boolean = false; // Kiểm tra chế độ chỉnh sửa

  constructor(
    private fb: FormBuilder,
    private certificationService: CertificationService,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  @ViewChild('employeeLoginId', { static: true })
  employeeLoginId!: ElementRef; // Tham chiếu đến phần tử input cho employeeLoginId

  ngOnInit(): void {
    this.initializeForm(); // Khởi tạo form
    this.checkEditMode(); // Kiểm tra xem có ở chế độ chỉnh sửa không
    this.getDepartments(); // Lấy danh sách phòng ban
    this.getCertifications(); // Lấy danh sách chứng chỉ
    this.restoreFormData(); // Khôi phục dữ liệu form từ sessionStorage
    this.setFocusToEmployeeLoginId(); // Đặt con trỏ chuột vào trường employeeLoginId
    this.employeeForm.get('certificationId')?.valueChanges.subscribe(() => {
      this.toggleCertificationFields(); // Điều chỉnh các trường chứng chỉ khi có sự thay đổi
    });
    this.toggleCertificationFields(); // Gọi để thiết lập trạng thái các trường chứng chỉ ban đầu
  }

  /**
   * Đặt con trỏ vào trường employeeLoginId
   */
  setFocusToEmployeeLoginId(): void {
    if (this.employeeLoginId) {
      this.employeeLoginId.nativeElement.focus();
    }
  }

  /**
   * Kiểm tra chế độ edit của form dựa trên trạng thái từ history
   */
  checkEditMode(): void {
    const state = history.state; // Lấy trạng thái từ history
    if (state && state.employeeId) {
      this.employeeId = state.employeeId; // Lưu ID nhân viên
      this.isEditMode = state.isEditMode; // Lưu trạng thái chế độ chỉnh sửa
    }
    if (this.employeeId) {
      const employeeData = sessionStorage.getItem('employeeData'); // Lấy dữ liệu nhân viên từ sessionStorage

      if (employeeData) {
        this.employeeForm.patchValue(JSON.parse(employeeData)); // Khôi phục dữ liệu vào form
      } else {
        this.getEmployeeById(this.employeeId); // Lấy dữ liệu nhân viên từ server
      }
      this.employeeForm.valueChanges.subscribe((value) => {
        sessionStorage.setItem('employeeData', JSON.stringify(value)); // Lưu dữ liệu vào sessionStorage khi có sự thay đổi
        this.checkValidation(); // Kiểm tra tính hợp lệ của form
      });

      this.isEditMode = true; // Đặt chế độ chỉnh sửa
    } else {
      this.initializeForm(); // Khởi tạo form nếu không có ID nhân viên
    }
  }

  /**
   * Khởi tạo form với các trường và validator
   */
  initializeForm(): void {
    this.employeeForm = this.fb.group(
      {
        employeeId: this.employeeId,
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
          this.passwordMatchValidator, // Kiểm tra mật khẩu xác nhận
          this.dateOrderValidator, // Kiểm tra thứ tự ngày
          this.positiveIntegerValidator, // Kiểm tra số nguyên dương
        ],
      }
    );

    // Đăng ký các thay đổi giá trị cho trường employeeConfirmLoginPassword
    this.employeeForm
      .get('employeeConfirmLoginPassword')
      ?.valueChanges.subscribe(() => {
        this.employeeForm.setValidators([this.passwordMatchValidator]);
      });

    // Đăng ký các thay đổi giá trị cho trường employeeLoginPassword
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

    // Đăng ký các thay đổi giá trị cho trường certificationStartDate
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
      sessionStorage.setItem('employeeData', JSON.stringify(value)); // Lưu dữ liệu vào sessionStorage khi có thay đổi
      this.checkValidation(); // Kiểm tra tính hợp lệ của form
    });
  }

  /**
   * Lấy thông tin chi tiết của employee từ EmployeeService
   * @param id EmployeeId muốn lấy thông tin
   */
  getEmployeeById(id: string): void {
    this.employeeService.getEmployeeDetail(id).subscribe({
      next: (response) => {
        this.patchFormWithEmployeeData(response); // Cập nhật form với dữ liệu nhân viên
      },
      error: (error) => {
        console.log(error);
        this.router.navigate(['system-error']); // Chuyển hướng đến trang lỗi
      },
      complete: () => {
        console.log('complete');
      },
    });
  }

  /**
   * Cập nhật giá trị cho form nhân viên bằng dữ liệu từ đối tượng employee
   * @param employee Đối tượng nhân viên chứa thông tin cần cập nhật
   */
  patchFormWithEmployeeData(employee: any): void {
    // Kiểm tra xem nhân viên có chứng nhận hay không
    const hasCertification =
      employee.certifications && employee.certifications.length > 0;

    // Cập nhật các giá trị trong form dựa trên dữ liệu của nhân viên
    this.employeeForm.patchValue({
      employeeId: employee.employeeId,
      employeeName: employee.employeeName, // Tên nhân viên
      employeeBirthDate: new Date(employee.employeeBirthDate), // Ngày sinh nhân viên
      employeeEmail: employee.employeeEmail, // Email nhân viên
      employeeTelephone: employee.employeeTelephone, // Số điện thoại nhân viên
      employeeNameKana: employee.employeeNameKana, // Tên Kana của nhân viên
      employeeLoginId: employee.employeeLoginId, // ID đăng nhập của nhân viên
      departmentId: employee.departmentId, // ID phòng ban của nhân viên

      certificationId: hasCertification
        ? employee.certifications[0].certificationId // ID chứng nhận nếu có
        : '',
      certificationStartDate: hasCertification
        ? employee.certifications[0]?.certificationStartDate || '' // Ngày bắt đầu chứng nhận nếu có
        : '',
      certificationEndDate: hasCertification
        ? employee.certifications[0]?.certificationEndDate || '' // Ngày kết thúc chứng nhận nếu có
        : '',
      certificationScore: hasCertification
        ? employee.certifications[0]?.certificationScore || '' // Điểm chứng nhận nếu có
        : '',
    });
  }

  /**
   * Kiểm tra và cập nhật thông báo lỗi cho các trường trong form nhân viên
   */
  checkValidation() {
    const form = this.employeeForm; // Lấy form nhân viên

    // Định nghĩa ánh xạ các thông báo lỗi cho từng trường
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

    // Duyệt qua các trường trong ánh xạ kiểm tra
    Object.keys(validationMapping).forEach((field) => {
      const control = form.get(field); // Lấy control tương ứng với trường
      if (control?.touched && control.invalid) {
        // Kiểm tra nếu control đã được chạm và không hợp lệ
        const errors = control.errors; // Lấy các lỗi hiện tại
        if (errors) {
          const messages = validationMapping[field]; // Lấy thông báo lỗi tương ứng
          const errorMessages: string[] = []; // Khởi tạo mảng chứa thông báo lỗi

          // Kiểm tra lỗi bắt buộc và thêm thông báo nếu có
          if (errors['required']) {
            errorMessages.push(messages['required']);
          }

          // Duyệt qua các lỗi và thêm thông báo tương ứng
          Object.keys(errors).forEach((errorKey) => {
            if (messages[errorKey] && errorKey !== 'required') {
              errorMessages.push(messages[errorKey]);
            }
          });

          // Cập nhật lỗi cho control với thông báo lỗi mới
          control.setErrors({ ...errors, message: errorMessages });
        }
      }
    });
  }

  /**
   * Lấy thông báo lỗi cho trường cụ thể trong form nhân viên
   * @param controlName Tên trường cần lấy thông báo lỗi
   * @returns Thông báo lỗi nếu có, ngược lại trả về chuỗi rỗng
   */
  getErrorMessage(controlName: string): string {
    const control = this.employeeForm.get(controlName);
    if (control?.errors) {
      const message = control.errors['message'] || '';
      return message;
    }
    return '';
  }

  /**
   * Lấy danh sách các phòng ban từ DepartmentService
   */
  getDepartments() {
    this.departmentService.getAllDepartments().subscribe({
      // Gọi phương thức để lấy tất cả phòng ban
      next: (response) => {
        this.departments = response.departments; // Gán danh sách phòng ban nhận được
        this.findDepartmentName(); // Tìm kiếm tên phòng ban
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
   * Lấy danh sách các chứng nhận từ CertificationService
   */
  getCertifications() {
    this.certificationService.getAllCertifications().subscribe({
      // Gọi phương thức để lấy tất cả chứng nhận
      next: (response) => {
        this.certifications = response.certifications; // Gán danh sách chứng nhận nhận được
        this.findCertificationName(); // Tìm kiếm tên chứng nhận
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
   * Tìm kiếm tên phòng ban dựa trên departmentId
   */
  findDepartmentName(): void {
    const departmentId = this.employeeForm.get('departmentId')?.value; // Lấy departmentId từ form
    // Duyệt qua danh sách phòng ban
    this.departments.forEach((department: any) => {
      // Nếu departmentId khớp cập nhật tên phòng ban vào form
      if (department.departmentId == departmentId) {
        this.employeeForm.patchValue({
          departmentName: department.departmentName,
        });
      }
    });
  }

  /**
   * Tìm kiếm tên chứng nhận dựa trên certificationId
   */
  findCertificationName(): void {
    const certificationId = this.employeeForm.get('certificationId')?.value; // Lấy certificationId từ form
    // Duyệt qua danh sách chứng nhận
    this.certifications.forEach((certification: any) => {
      // Nếu certificationId khớp cập nhật tên chứng nhận vào form
      if (certification.certificationId == certificationId) {
        this.employeeForm.patchValue({
          certificationName: certification.certificationName,
        });
      }
    });
  }

  /**
   * Khôi phục dữ liệu từ sessionStorage vào form
   */
  restoreFormData() {
    const savedData = sessionStorage.getItem('employeeData'); // Lấy dữ liệu đã lưu trong sessionStorage
    if (savedData) {
      const parsedData = JSON.parse(savedData); // Phân tích cú pháp dữ liệu JSON
      if (parsedData.employeeBirthDate) {
        parsedData.employeeBirthDate = this.convertStringToDate(
          // Chuyển đổi chuỗi thành đối tượng Date
          parsedData.employeeBirthDate
        );
      }
      if (parsedData.certificationStartDate) {
        parsedData.certificationStartDate = this.convertStringToDate(
          // Chuyển đổi chuỗi thành đối tượng Date
          parsedData.certificationStartDate
        );
      }
      if (parsedData.certificationEndDate) {
        parsedData.certificationEndDate = this.convertStringToDate(
          // Chuyển đổi chuỗi thành đối tượng Date
          parsedData.certificationEndDate
        );
      }
      this.employeeForm.patchValue(parsedData); // Cập nhật form với dữ liệu đã khôi phục
    }
  }

  /**
   * Chuyển đổi chuỗi ngày tháng thành đối tượng Date
   * @param dateString Chuỗi ngày tháng cần chuyển đổi
   * @returns Đối tượng Date
   */
  convertStringToDate(dateString: string): Date {
    return new Date(Date.parse(dateString)); // Chuyển đổi chuỗi thành đối tượng Date
  }

  /**
   * Kiểm tra sự trùng khớp của mật khẩu và mật khẩu xác nhận
   * @param control Đối tượng AbstractControl chứa các trường mật khẩu
   * @returns ValidationErrors nếu có lỗi, ngược lại trả về null
   */
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('employeeLoginPassword')?.value; // Lấy giá trị mật khẩu
    const confirmPassword = control.get('employeeConfirmLoginPassword')?.value; // Lấy giá trị mật khẩu xác nhận

    if (password !== confirmPassword) {
      // Nếu mật khẩu và mật khẩu xác nhận không khớp
      control
        .get('employeeConfirmLoginPassword')
        ?.setErrors({ passwordMismatch: true }); // Thiết lập lỗi không khớp mật khẩu
      return { passwordMismatch: true };
    }

    return null;
  }

  /**
   * Kiểm tra thứ tự ngày giữa ngày bắt đầu và ngày kết thúc
   * @param control Đối tượng AbstractControl chứa các trường ngày
   * @returns ValidationErrors nếu có lỗi, ngược lại trả về null
   */
  dateOrderValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('certificationStartDate')?.value; // Lấy giá trị ngày bắt đầu
    const endDate = control.get('certificationEndDate')?.value; // Lấy giá trị ngày kết thúc

    if (endDate < startDate) {
      // Nếu ngày kết thúc nhỏ hơn ngày bắt đầu
      control.get('certificationEndDate')?.setErrors({ dateInvalid: true }); // Thiết lập lỗi ngày không hợp lệ
      return { dateInvalid: true };
    } else {
      // Không cần xử lý gì nếu ngày hợp lệ
    }

    return null;
  }

  /**
   * Kiểm tra xem giá trị có phải là số nguyên dương hay không
   * @param control Đối tượng AbstractControl chứa trường cần kiểm tra
   * @returns ValidationErrors nếu có lỗi, ngược lại trả về null
   */
  positiveIntegerValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.get('certificationScore')?.value; // Lấy giá trị của certificationScore

    if (control.get('certificationScore')?.hasError('required')) {
      // Nếu trường là bắt buộc và không có giá trị
      return null;
    }

    if (!Number.isInteger(+value) || +value <= 0) {
      // Kiểm tra nếu giá trị không phải là số nguyên hoặc không dương
      control
        .get('certificationScore')
        ?.setErrors({ notPositiveInteger: true }); // Thiết lập lỗi không phải số nguyên dương
      return { notPositiveInteger: true };
    }

    return null;
  }

  /**
   * Bật hoặc tắt các trường liên quan đến chứng nhận dựa trên ID chứng nhận
   */
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
    // Thiết lập lỗi cho trường ngày kết thúc nếu có lỗi
    if (validationErrors) {
      certificationEndDateControl?.setErrors({
        ...certificationEndDateControl?.errors,
        ...validationErrors,
      });
    }
    certificationScoreControl?.updateValueAndValidity();
  }

  /**
   * Xử lý sự kiện nhấn nút quay lại
   */
  backButton(): void {
    const state = history.state;

    if (state && state.employeeId) {
      this.router.navigate(['user/detail']);
    } else {
      this.router.navigate(['user/list']);
    }
  }

  /**
   * Lưu dữ liệu nhân viên cho ADM005
   */
  saveEmployeeData() {
    const password = this.employeeForm.get('employeeLoginPassword')?.value;
    const confirmPassword = this.employeeForm.get(
      'employeeConfirmLoginPassword'
    )?.value;
    // Nếu có ID nhân viên
    if (this.employeeId) {
      // Nếu có mật khẩu hoặc xác nhận mật khẩu thiết lập validator cho mật khẩu
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
        this.employeeForm.setValidators([this.passwordMatchValidator]); // Thiết lập validator kiểm tra sự khớp mật khẩu
        // Nếu không có mật khẩu, xóa validators
      } else {
        this.employeeForm.get('employeeLoginPassword')?.clearValidators();
        this.employeeForm
          .get('employeeConfirmLoginPassword')
          ?.clearValidators();
      }
      // Nếu không có ID nhân viên, thiết lập validators cho mật khẩu
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

    // Cập nhật tính hợp lệ của các trường mật khẩu
    this.employeeForm.get('employeeLoginPassword')?.updateValueAndValidity();
    this.employeeForm
      .get('employeeConfirmLoginPassword')
      ?.updateValueAndValidity();
    this.toggleCertificationFields(); // Gọi hàm để điều chỉnh các trường chứng chỉ
    // Nếu form hợp lệ
    if (this.employeeForm.valid) {
      sessionStorage.setItem(
        'employeeData',
        JSON.stringify(this.employeeForm.value) // Lưu dữ liệu vào sessionStorage
      );
      this.findDepartmentName(); // Tìm tên phòng ban
      this.findCertificationName(); // Tìm tên chứng chỉ
      this.router.navigate(['user/confirm-employee'], {
        state: { isEditMode: this.isEditMode, employeeId: this.employeeId }, // Điều hướng đến trang xác nhận nhân viên
      });
    } else {
      this.employeeForm.markAllAsTouched(); // Đánh dấu tất cả trường là đã chạm
    }
  }
}
