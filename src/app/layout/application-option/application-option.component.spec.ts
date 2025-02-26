import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApplicationOptionComponent } from './application-option.component';

describe('ApplicationOptionComponent', () => {
  let component: ApplicationOptionComponent;
  let fixture: ComponentFixture<ApplicationOptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
