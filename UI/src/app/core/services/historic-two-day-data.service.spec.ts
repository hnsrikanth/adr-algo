import { TestBed } from '@angular/core/testing';

import { HistoricTwoDayDataService } from './historic-two-day-data.service';

describe('HistoricTwoDayDataService', () => {
  let service: HistoricTwoDayDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoricTwoDayDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
