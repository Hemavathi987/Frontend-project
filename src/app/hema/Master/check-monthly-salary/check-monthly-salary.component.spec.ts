import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckMonthlySalaryComponent } from './check-monthly-salary.component';

describe('CheckMonthlySalaryComponent', () => {
  let component: CheckMonthlySalaryComponent;
  let fixture: ComponentFixture<CheckMonthlySalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckMonthlySalaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckMonthlySalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
