import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KKKKKKComponent } from './kkkkkk.component';

describe('KKKKKKComponent', () => {
  let component: KKKKKKComponent;
  let fixture: ComponentFixture<KKKKKKComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KKKKKKComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KKKKKKComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
