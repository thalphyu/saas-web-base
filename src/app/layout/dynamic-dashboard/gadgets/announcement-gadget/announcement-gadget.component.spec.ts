import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnnouncementGadgetComponent } from './announcement-gadget.component';

describe('AnnouncementGadgetComponent', () => {
  let component: AnnouncementGadgetComponent;
  let fixture: ComponentFixture<AnnouncementGadgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnouncementGadgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementGadgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
