import { AnnouncemantRoutingModule } from './announcemant-routing.module';

describe('AnnouncemantRoutingModule', () => {
  let announcemantRoutingModule: AnnouncemantRoutingModule;

  beforeEach(() => {
    announcemantRoutingModule = new AnnouncemantRoutingModule();
  });

  it('should create an instance', () => {
    expect(announcemantRoutingModule).toBeTruthy();
  });
});
