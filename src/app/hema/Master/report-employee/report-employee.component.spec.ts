import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportEmployeeComponent } from './report-employee.component';

describe('ReportEmployeeComponent', () => {
  let component: ReportEmployeeComponent;
  let fixture: ComponentFixture<ReportEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
