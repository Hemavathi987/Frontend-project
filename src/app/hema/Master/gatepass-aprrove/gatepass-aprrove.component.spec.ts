import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatepassAprroveComponent } from './gatepass-aprrove.component';

describe('GatepassAprroveComponent', () => {
  let component: GatepassAprroveComponent;
  let fixture: ComponentFixture<GatepassAprroveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatepassAprroveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GatepassAprroveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
