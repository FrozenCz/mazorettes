import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefereeFormComponent } from './referee-form.component';

describe('RefereeFormComponent', () => {
  let component: RefereeFormComponent;
  let fixture: ComponentFixture<RefereeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefereeFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RefereeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
