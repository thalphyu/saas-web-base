import { AnnouncemantModule } from './announcemant.module';

describe('AnnouncemantModule', () => {
  let announcemantModule: AnnouncemantModule;

  beforeEach(() => {
    announcemantModule = new AnnouncemantModule();
  });

  it('should create an instance', () => {
    expect(announcemantModule).toBeTruthy();
  });
});
