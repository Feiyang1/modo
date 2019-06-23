import { Injectable } from '@angular/core';
import { TmdbHttpClientService } from './tmdb-http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TvService {
  private baseUrl = 'https://api.themoviedb.org/3/tv';
  constructor(
    private http: TmdbHttpClientService
  ) { }

  getTv(id: string): Observable<TvDetail> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get(url) as Observable<TvDetail>;
  }
}

export interface TvDetail {
  id: number; // tmdb id
  name: string;
  overview: string;
  number_of_seasons: number;
  number_of_episodes: number;
  first_air_date: string;
  seasons: unknown[]; // TODO
  homepage?: string;
  poster_path: string;
}
