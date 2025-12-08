import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisionComponent } from './comparision.component';

describe('ComparisionComponent', () => {
  let component: ComparisionComponent;
  let fixture: ComponentFixture<ComparisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComparisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
