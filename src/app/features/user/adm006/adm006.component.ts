import { Component } from '@angular/core';

@Component({
  selector: 'app-adm006',
  templateUrl: './adm006.component.html',
  styleUrls: ['./adm006.component.css'],
})
export class Adm006Component {
  message: string | null = null; // Biến lưu trữ thông điệp để hiển thị trong template.

  constructor() {}

  ngOnInit(): void {
    // Lấy state từ history
    const state = history.state;
    // Gán message từ state vào biến message.
    this.message = state.message;
  }
}
