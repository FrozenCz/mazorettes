import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeesLineupComponent } from './attendees-lineup.component';

describe('AttendeesLineupComponent', () => {
  let component: AttendeesLineupComponent;
  let fixture: ComponentFixture<AttendeesLineupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendeesLineupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttendeesLineupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
