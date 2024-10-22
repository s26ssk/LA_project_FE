import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adm006Component } from './adm006.component';

describe('Adm006Component', () => {
  let component: Adm006Component;
  let fixture: ComponentFixture<Adm006Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Adm006Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adm006Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
