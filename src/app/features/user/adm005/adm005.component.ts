import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../service/employee.service';
import { EmployeeRequest } from '../../../model/employee-request.model';
import { ConfirmMessages } from 'src/app/model/confirm-message.enum';
import { ErrorMessages } from 'src/app/model/error-messages.enum';
import { EmployeeEditRequest } from 'src/app/model/employee-edit-request.model';

@Component({
  selector: 'app-adm005',
  templateUrl: './adm005.component.html',
  styleUrls: ['./adm005.component.css'],
})
export class ADM005Component implements OnInit {
  employeeData: any; // Dữ liệu nhân viên
  errorMessage: string = ''; // Thông báo lỗi
  employeeId: string | undefined; // ID nhân viên
  isEditMode: boolean = false; // Chế độ chỉnh sửa

  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.initializeEmployeeData(); // Khởi tạo dữ liệu nhân viên khi component được khởi tạo
  }

  /**
   * Khởi tạo dữ liệu nhân viên từ sessionStorage hoặc trạng thái history
   */
  initializeEmployeeData(): void {
    const state = history.state;
    const data = sessionStorage.getItem('employeeData');
    if (state && state.employeeId) {
      this.employeeId = state.employeeId; // Lưu ID nhân viên
      this.isEditMode = state.isEditMode; // Lưu trạng thái chế độ chỉnh sửa
    }
    if (data) {
      this.employeeData = JSON.parse(data); // Khôi phục dữ liệu nhân viên từ sessionStorage
    } else {
      // Điều hướng đến trang thêm hoặc sửa nếu không có dữ liệu
      const redirectUrl = state.isEditMode ? '/user/edit' : '/user/add';
      this.router.navigate([redirectUrl]);
    }
  }

  /**
   * Đặt lại mật khẩu và điều hướng trở lại trang trước đó
   */
  resetPasswordsAndGoBack(): void {
    this.employeeData.employeeLoginPassword = ''; // Reset value mật khẩu ô input
    this.employeeData.employeeConfirmLoginPassword = ''; // Reset value mật khẩu xác nhận ô input
    sessionStorage.setItem('employeeData', JSON.stringify(this.employeeData)); // Lưu dữ liệu vào sessionStorage
    const state = history.state;
    const redirectUrl = state.isEditMode ? '/user/edit' : '/user/add';
    this.router.navigate([redirectUrl], {
      state: { isEditMode: this.isEditMode, employeeId: this.employeeId },
    });
  }

  /**
   * Lưu dữ liệu nhân viên
   */
  saveEmployee() {
    // Lấy state và check nếy là mode edit thì gọi updateEmployee từ service và cập nhập thông tin nhân viên
    const state = history.state;
    if (state.isEditMode) {
      // Tạo đối tượng employeeEditRequest để hứng dữ liệu nhân viên lưu trong session cho TH edit
      const employeeEditRequest: EmployeeEditRequest = {
        employeeId: this.employeeData.employeeId,
        employeeLoginId: this.employeeData.employeeLoginId,
        departmentId: this.employeeData.departmentId,
        employeeName: this.employeeData.employeeName,
        employeeNameKana: this.employeeData.employeeNameKana,
        employeeBirthDate: this.formatDate(this.employeeData.employeeBirthDate),
        employeeEmail: this.employeeData.employeeEmail,
        employeeTelephone: this.employeeData.employeeTelephone,
        employeeLoginPassword: this.employeeData.employeeConfirmLoginPassword,
        certifications: this.employeeData.certificationId
          ? [
              {
                certificationId: this.employeeData.certificationId,
                certificationStartDate: this.formatDate(
                  this.employeeData.certificationStartDate
                ),
                certificationEndDate: this.formatDate(
                  this.employeeData.certificationEndDate
                ),
                certificationScore: this.employeeData.certificationScore,
              },
            ]
          : [],
      };
      this.employeeService.updateEmployee(employeeEditRequest).subscribe({
        next: (response) => {
          if (response.code == 200) {
            this.router.navigate(['/user/success'], {
              state: { message: ConfirmMessages.CONFIRM_CHANGE },
            });
          } else {
            const message = this.getErrorMessage(response);
            this.errorMessage = message;
          }
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log('complete');
        },
      });
      // Nếu không phải mode edit thì sẽ gọi addEmployee từ service để thêm mới nhân viên
    } else {
      // Tạo đối tượng employeeRequest để hứng dữ liệu nhân viên lưu trong session cho TH add
      const employeeRequest: EmployeeRequest = {
        employeeLoginId: this.employeeData.employeeLoginId,
        departmentId: this.employeeData.departmentId,
        employeeName: this.employeeData.employeeName,
        employeeNameKana: this.employeeData.employeeNameKana,
        employeeBirthDate: this.formatDate(this.employeeData.employeeBirthDate),
        employeeEmail: this.employeeData.employeeEmail,
        employeeTelephone: this.employeeData.employeeTelephone,
        employeeLoginPassword: this.employeeData.employeeConfirmLoginPassword,
        certifications: this.employeeData.certificationId
          ? [
              {
                certificationId: this.employeeData.certificationId,
                certificationStartDate: this.formatDate(
                  this.employeeData.certificationStartDate
                ),
                certificationEndDate: this.formatDate(
                  this.employeeData.certificationEndDate
                ),
                certificationScore: this.employeeData.certificationScore,
              },
            ]
          : [],
      };
      this.employeeService.addEmployee(employeeRequest).subscribe({
        next: (response) => {
          if (response.code == 200) {
            this.router.navigate(['/user/success'], {
              state: { message: ConfirmMessages.CONFIRM_ADD },
            });
          } else {
            const message = this.getErrorMessage(response);
            this.errorMessage = message;
          }
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log('complete');
        },
      });
    }
  }

  /**
   * Định dạng ngày tháng từ chuỗi
   * @param dateString Chuỗi ngày tháng
   * @returns Ngày tháng đã được định dạng
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`; // Trả về định dạng ngày tháng YYYY/MM/DD
  }

  /**
   * Lấy thông báo lỗi phù hợp dựa trên mã lỗi và tham số trong response
   * @param errorResponse Đối tượng chứa mã lỗi và danh sách tham số
   * @returns Thông báo lỗi tương ứng hoặc thông báo lỗi hệ thống mặc định nếu không tìm thấy
   */
  getErrorMessage(errorResponse: any): string {
    // Xác định khóa trường tương ứng với tham số đầu tiên trong response
    let fieldKey = '';
    switch (errorResponse.params[0]) {
      case 'アカウント名':
        fieldKey = 'EMPLOYEE_LOGIN_ID';
        break;
      case '氏名':
        fieldKey = 'EMPLOYEE_NAME';
        break;
      case 'カタカナ氏名':
        fieldKey = 'EMPLOYEE_NAME_KANA';
        break;
      case '生年月日':
        fieldKey = 'EMPLOYEE_BIRTHDATE';
        break;
      case 'メールアドレス':
        fieldKey = 'EMPLOYEE_EMAIL';
        break;
      case '電話番号':
        fieldKey = 'EMPLOYEE_TELEPHONE';
        break;
      case 'パスワード':
        fieldKey = 'EMPLOYEE_PASSWORD';
        break;
      case 'グループ':
        fieldKey = 'DEPARTMENT_ID';
        break;
      case '資格交付日':
        fieldKey = 'CERTIFICATION_START_DATE';
        break;
      case '失効日':
        fieldKey = 'CERTIFICATION_END_DATE';
        break;
      case '点数':
        fieldKey = 'CERTIFICATION_SCORE';
        break;
      case '資格':
        fieldKey = 'CERTIFICATION_ID';
        break;
      default:
        fieldKey = '';
    }

    // Tìm khóa thông báo lỗi từ ErrorMessages dựa trên mã và khóa trường
    const errorMessageKey = Object.keys(ErrorMessages).find(
      (key) => key.startsWith(errorResponse.message) && key.includes(fieldKey)
    );

    const errorMessage = errorMessageKey
      ? (ErrorMessages as any)[errorMessageKey]
      : null;

    // Trả về thông báo lỗi nếu tìm thấy, ngược lại trả về lỗi hệ thống mặc định
    if (errorMessage) {
      return errorMessage;
    }

    return 'システムエラーが発生しました。';
  }
}
