import { TestBed } from '@angular/core/testing';

import { KiteHistoricDataService } from './kite-historic-data.service';

describe('KiteHistoricDataService', () => {
  let service: KiteHistoricDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KiteHistoricDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
