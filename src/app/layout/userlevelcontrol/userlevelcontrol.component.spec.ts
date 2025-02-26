import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserlevelcontrolComponent } from './userlevelcontrol.component';

describe('UserlevelcontrolComponent', () => {
  let component: UserlevelcontrolComponent;
  let fixture: ComponentFixture<UserlevelcontrolComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserlevelcontrolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserlevelcontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
