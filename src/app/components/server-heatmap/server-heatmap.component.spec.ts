import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerHeatmapComponent } from './server-heatmap.component';

describe('ServerHeatmapComponent', () => {
  let component: ServerHeatmapComponent;
  let fixture: ComponentFixture<ServerHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerHeatmapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServerHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
