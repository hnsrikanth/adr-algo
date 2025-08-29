import { TestBed } from '@angular/core/testing';

import { AdrService } from './adr.service';

describe('AdrService', () => {
  let service: AdrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
