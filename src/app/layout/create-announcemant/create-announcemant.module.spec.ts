import { CreateAnnouncemantModule } from './create-announcemant.module';

describe('CreateAnnouncemantModule', () => {
  let createAnnouncemantModule: CreateAnnouncemantModule;

  beforeEach(() => {
    createAnnouncemantModule = new CreateAnnouncemantModule();
  });

  it('should create an instance', () => {
    expect(createAnnouncemantModule).toBeTruthy();
  });
});
