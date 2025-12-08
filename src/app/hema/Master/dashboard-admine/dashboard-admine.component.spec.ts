import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAdmineComponent } from './dashboard-admine.component';

describe('DashboardAdmineComponent', () => {
  let component: DashboardAdmineComponent;
  let fixture: ComponentFixture<DashboardAdmineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAdmineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardAdmineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
