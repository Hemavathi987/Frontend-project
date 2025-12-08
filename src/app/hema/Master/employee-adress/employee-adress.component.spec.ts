import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAdressComponent } from './employee-adress.component';

describe('EmployeeAdressComponent', () => {
  let component: EmployeeAdressComponent;
  let fixture: ComponentFixture<EmployeeAdressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeAdressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeAdressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
