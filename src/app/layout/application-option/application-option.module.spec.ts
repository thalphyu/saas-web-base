import { ApplicationOptionModule } from './application-option.module';

describe('ApplicationOptionModule', () => {
  let applicationOptionModule: ApplicationOptionModule;

  beforeEach(() => {
    applicationOptionModule = new ApplicationOptionModule();
  });

  it('should create an instance', () => {
    expect(applicationOptionModule).toBeTruthy();
  });
});
