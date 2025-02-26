import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeSetupComponent } from './employee-setup.component';

describe('EmployeeSetupComponent', () => {
  let component: EmployeeSetupComponent;
  let fixture: ComponentFixture<EmployeeSetupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
