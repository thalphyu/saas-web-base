import { CreateAnnouncemantRoutingModule } from './create-announcemant-routing.module';

describe('CreateAnnouncemantRoutingModule', () => {
  let createAnnouncemantRoutingModule: CreateAnnouncemantRoutingModule;

  beforeEach(() => {
    createAnnouncemantRoutingModule = new CreateAnnouncemantRoutingModule();
  });

  it('should create an instance', () => {
    expect(createAnnouncemantRoutingModule).toBeTruthy();
  });
});
