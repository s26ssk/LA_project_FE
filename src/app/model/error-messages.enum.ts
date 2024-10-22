export enum ErrorMessages {
  // 1.1 Validate employeeLoginId
  ER001_EMPLOYEE_LOGIN_ID = '「アカウント名」を入力してください', // Trường hợp thiếu parameter
  ER006_EMPLOYEE_LOGIN_ID = '「アカウント名」を50桁以内で入力してください', // Độ dài quá 50 ký tự
  ER019_EMPLOYEE_LOGIN_ID = '「アカウント名」は(a-z, A-Z, 0-9 と _)の桁のみです。最初の桁は数字ではない。', // Không thỏa mãn điều kiện ký tự hợp lệ
  ER003_EMPLOYEE_LOGIN_ID = '「アカウント名」は既に存在しています。', // Đã tồn tại trong bảng

  // 1.2 Validate employeeName
  ER001_EMPLOYEE_NAME = '「氏名」を入力してください', // Thiếu hoặc rỗng
  ER006_EMPLOYEE_NAME = '「氏名」を125桁以内で入力してください', // Độ dài quá 125 ký tự

  // 1.3 Validate employeeNameKana
  ER001_EMPLOYEE_NAME_KANA = '「カタカナ氏名」を入力してください', // Thiếu hoặc rỗng
  ER006_EMPLOYEE_NAME_KANA = '「カタカナ氏名」を125桁以内で入力してください', // Độ dài quá 125 ký tự
  ER009_EMPLOYEE_NAME_KANA = '「カタカナ氏名」をカタカナで入力してください', // Không phải ký tự Katakana

  // 1.4 Validate employeeBirthDate
  ER001_EMPLOYEE_BIRTHDATE = '「生年月日」を入力してください', // Thiếu hoặc rỗng
  ER011_EMPLOYEE_BIRTHDATE = '「生年月日」は無効になっています。', // Không phải ngày hợp lệ
  ER005_EMPLOYEE_BIRTHDATE = '「生年月日」をyyyy/MM/dd形式で入力してください', // Không đúng định dạng yyyy/MM/dd

  // 1.5 Validate employeeEmail
  ER001_EMPLOYEE_EMAIL = '「メールアドレス」を入力してください', // Thiếu hoặc rỗng
  ER005_EMPLOYEE_EMAIL = '「メールアドレス」をメールアドレス形式で入力してください',
  ER006_EMPLOYEE_EMAIL = '「メールアドレス」を125桁以内で入力してください', // Độ dài quá 125 ký tự

  // 1.6 Validate employeeTelephone
  ER001_EMPLOYEE_TELEPHONE = '「電話番号」を入力してください', // Thiếu hoặc rỗng
  ER006_EMPLOYEE_TELEPHONE = '「電話番号」を50桁以内で入力してください', // Độ dài quá 50 ký tự
  ER008_EMPLOYEE_TELEPHONE = '「電話番号」に半角英数を入力してください', // Chứa ký tự ngoài ký tự 1 byte

  // 1.7 Validate employeeLoginPassword
  ER001_EMPLOYEE_PASSWORD = '「パスワード」を入力してください', // Thiếu hoặc rỗng
  ER007_EMPLOYEE_PASSWORD = '「パスワード」を8桁以上、50桁以内で入力してください', // Độ dài không hợp lệ
  ER001_EMPLOYEE_CONFIRM_LOGIN_PASSWORD = ' 「パスワード確認」を入力してください',
  ER0017_EMPLOYEE_CONFIRM_LOGIN_PASSWORD = ' 「パスワード確認」が不正です。',

  // 1.8 Validate departmentId
  ER002_DEPARTMENT_ID = '「グループ」を入力してください', // Thiếu parameter
  ER018_DEPARTMENT_ID = '「グループ」を半角で入力してください', // Không phải số nguyên dương
  ER004_DEPARTMENT_ID = '「グループ」は存在していません。', // Không tồn tại trong bảng

  // 1.9 Validate certifications
  ER001_CERTIFICATION_START_DATE = '「資格交付日」を入力してください',
  ER011_CERTIFICATION_START_DATE = '「資格交付日」は無効になっています。', // startDate: không phải ngày hợp lệ
  ER005_CERTIFICATION_START_DATE = '「資格交付日」をyyyy/MM/dd形式で入力してください', // startDate: không đúng định dạng yyyy/MM/dd

  ER001_CERTIFICATION_END_DATE = '「失効日」を入力してください', // endDate: thiếu hoặc rỗng
  ER011_CERTIFICATION_END_DATE = '「失効日」は無効になっています。', // endDate: không phải ngày hợp lệ
  ER005_CERTIFICATION_END_DATE = '「失効日」をyyyy/MM/dd形式で入力してください', // endDate: không đúng định dạng yyyy/MM/dd
  ER012_CERTIFICATION_END_BEFORE_START = '「失効日」は「資格交付日」より未来の日で入力してください。', // certificationEndDate < certificationStartDate

  ER001_CERTIFICATION_SCORE = '「点数」を入力してください', // score: thiếu hoặc rỗng
  ER018_CERTIFICATION_SCORE = '「点数」を半角で入力してください', // score: không phải số nguyên dương

  ER002_CERTIFICATION_ID = '「資格」を入力してください', // certificationId: thiếu hoặc rỗng
  ER018_CERTIFICATION_ID = '「資格」を半角で入力してください', // certificationId: không phải số nguyên dương
  ER004_CERTIFICATION_ID = '「資格」は存在していません。', // Không tồn tại trong bảng certifications
}
