import { TestBed, inject } from '@angular/core/testing';

import { IngestPurgeService } from './ingest-purge.service';

describe('IngestPurgeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IngestPurgeService]
    });
  });

  it('should be created', inject([IngestPurgeService], (service: IngestPurgeService) => {
    expect(service).toBeTruthy();
  }));
});
