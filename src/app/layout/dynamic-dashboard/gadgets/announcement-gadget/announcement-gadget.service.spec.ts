import { TestBed } from '@angular/core/testing';

import { AnnouncementGadgetService } from './announcement-gadget.service';

describe('AnnouncementGadgetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnnouncementGadgetService = TestBed.get(AnnouncementGadgetService);
    expect(service).toBeTruthy();
  });
});
