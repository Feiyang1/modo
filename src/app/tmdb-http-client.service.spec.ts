import { TestBed } from '@angular/core/testing';

import { TmdbHttpClientService } from './tmdb-http-client.service';

describe('TmdbHttpClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TmdbHttpClientService = TestBed.get(TmdbHttpClientService);
    expect(service).toBeTruthy();
  });
});
