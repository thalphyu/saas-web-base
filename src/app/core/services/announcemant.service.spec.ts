import { TestBed, inject } from '@angular/core/testing';

import { AnnouncemantService } from './announcemant.service';

describe('AnnouncemantService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnnouncemantService]
    });
  });

  it('should be created', inject([AnnouncemantService], (service: AnnouncemantService) => {
    expect(service).toBeTruthy();
  }));
});
