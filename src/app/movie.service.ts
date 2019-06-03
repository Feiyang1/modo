import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TmdbHttpClientService } from './tmdb-http-client.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private baseUrl = 'https://api.themoviedb.org/3/movie'
  constructor(
    private http: TmdbHttpClientService
  ) { }

  getMovie(id: string): Observable<MovieDetail> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get(url) as Observable<MovieDetail>;
  }
}

// TODO: add more properties
export interface MovieDetail {
  id: string; // tmdb id
  title: string;
  overview: string;
  release_date: string;
  homepage?: string;
  production_companies: unknown[];
  cast: unknown[]
}