import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterbyemployeeComponent } from './filterbyemployee.component';

describe('FilterbyemployeeComponent', () => {
  let component: FilterbyemployeeComponent;
  let fixture: ComponentFixture<FilterbyemployeeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterbyemployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterbyemployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
