import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TmdbHttpClientService } from './tmdb-http-client.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private movieSearchUrl = 'https://api.themoviedb.org/3/search/movie';
  constructor(private http: TmdbHttpClientService) { }

  getMovies(options: MovieSearchOptions): Observable<Movie[]> {

    if (!options.query) {
      return of([]);
    }

    const params = new HttpParams({
      fromObject: {
        query: options.query
      }
    });

    return this.http
      .get(this.movieSearchUrl, {
        params
      })
      .pipe(
        map<any, Movie[]>(value => value.results),
        catchError(this.handleError('getMovies', []))
      ) as Observable<Movie[]>;
  }

  getTVs(options: TVSearchOptions): void {

  }

  getPeople(options: SearchOptions): void {

  }

  getAll(options: SearchOptions): void {

  }

  handleError(operation: string, result: unknown)
    : (error: unknown) => Observable<unknown> {
    return (error: unknown): Observable<unknown> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result);
    };
  }
}

interface SearchOptions {
  query: string;
  page?: number; // default to 1
}

interface MovieSearchOptions extends SearchOptions {
  release_year?: number;
}

interface TVSearchOptions extends SearchOptions {
  first_air_year?: number;
}

export interface Movie {
  title: string;
  release_date: string;
  id: string; // tmdb id
}