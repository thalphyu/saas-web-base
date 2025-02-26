import { EmployeeSetupModule } from './employee-setup.module';

describe('EmployeeSetupModule', () => {
  let employeeSetupModule: EmployeeSetupModule;

  beforeEach(() => {
    employeeSetupModule = new EmployeeSetupModule();
  });

  it('should create an instance', () => {
    expect(employeeSetupModule).toBeTruthy();
  });
});
