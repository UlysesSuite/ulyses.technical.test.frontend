import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoScalingFormComponent } from './auto-scaling-form.component';

describe('AutoScalingFormComponent', () => {
  let component: AutoScalingFormComponent;
  let fixture: ComponentFixture<AutoScalingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoScalingFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AutoScalingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
