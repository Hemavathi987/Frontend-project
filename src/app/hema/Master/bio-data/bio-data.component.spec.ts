import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BioDataComponent } from './bio-data.component';

describe('BioDataComponent', () => {
  let component: BioDataComponent;
  let fixture: ComponentFixture<BioDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BioDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BioDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
