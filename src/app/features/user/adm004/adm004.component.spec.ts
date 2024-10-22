import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ADM004Component } from './adm004.component';

describe('ADM004Component', () => {
  let component: ADM004Component;
  let fixture: ComponentFixture<ADM004Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ADM004Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ADM004Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
