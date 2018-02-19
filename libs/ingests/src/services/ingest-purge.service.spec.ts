import { TestBed, inject } from '@angular/core/testing';

import { IngestPurgeService } from './ingest-purge';

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
