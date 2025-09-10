import { TestBed } from '@angular/core/testing';

import { AdrCallService } from './adr-call.service';

describe('AdrCallService', () => {
  let service: AdrCallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdrCallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
