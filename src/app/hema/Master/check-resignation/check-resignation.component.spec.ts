import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckResignationComponent } from './check-resignation.component';

describe('CheckResignationComponent', () => {
  let component: CheckResignationComponent;
  let fixture: ComponentFixture<CheckResignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckResignationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckResignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
