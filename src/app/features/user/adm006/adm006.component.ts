import { Component } from '@angular/core';

@Component({
  selector: 'app-adm006',
  templateUrl: './adm006.component.html',
  styleUrls: ['./adm006.component.css'],
})
export class Adm006Component {
  message: string | null = null;

  constructor() {}

  ngOnInit(): void {
    const state = history.state;
    this.message = state.message;
  }
}
