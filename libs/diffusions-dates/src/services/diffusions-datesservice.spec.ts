import { TestBed, inject } from '@angular/core/testing';

import { DatesDiffusionsService } from './diffusions-dates.service';

describe('DatesDiffusionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatesDiffusionsService]
    });
  });

  it('should be created', inject([DatesDiffusionsService], (service: DatesDiffusionsService) => {
    expect(service).toBeTruthy();
  }));
});
