import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ADM003Component } from './adm003.component';

describe('ADM003Component', () => {
  let component: ADM003Component;
  let fixture: ComponentFixture<ADM003Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ADM003Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ADM003Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
