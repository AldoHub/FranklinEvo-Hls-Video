import { TestBed } from '@angular/core/testing';

import { SplitscreenService } from './splitscreen.service';

describe('SplitscreenService', () => {
  let service: SplitscreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SplitscreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
