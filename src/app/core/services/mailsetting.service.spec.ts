import { TestBed, inject } from '@angular/core/testing';

import { MailsettingService } from './mailsetting.service';

describe('MailsettingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MailsettingService]
    });
  });

  it('should be created', inject([MailsettingService], (service: MailsettingService) => {
    expect(service).toBeTruthy();
  }));
});
