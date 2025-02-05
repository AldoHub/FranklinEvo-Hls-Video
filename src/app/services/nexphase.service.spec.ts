import { TestBed } from '@angular/core/testing';

import { NexphaseService } from './nexphase.service';

describe('NexphaseService', () => {
  let service: NexphaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NexphaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
