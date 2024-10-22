import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ADM005Component } from './adm005.component';

describe('ADM005Component', () => {
  let component: ADM005Component;
  let fixture: ComponentFixture<ADM005Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ADM005Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ADM005Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
