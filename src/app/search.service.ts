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
  private allSearchUrl = 'https://api.themoviedb.org/3/search/multi';
  constructor(private http: TmdbHttpClientService) { }

  getMovies(options: MovieSearchOptions): Observable<SearchResultItem[]> {

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
        map(value => {
          // TODO: pagination
          return ((value as any).results as []).map(movie => ({
            type: ItemType.MOVIE,
            result: movie
          }));
        }),
        catchError(this.handleError('getMovies', []))
      ) as Observable<SearchResultItem[]>;
  }

  getTVs(options: TVSearchOptions): void {

  }

  getPeople(options: SearchOptions): void {

  }

  getAll(options: SearchOptions): Observable<SearchResult> {
    if (!options.query) {
      return of(GET_ALL_EMPTY_RESPONSE);
    }

    const params = new HttpParams({
      fromObject: {
        query: options.query,
        page: (options.page && String(options.page)) || '1'
      }
    });

    return this.http.get(this.allSearchUrl, {
      params
    }).pipe(
      map(value => {
        (value as any).results = ((value as any).results as []).map(result => {

          let type = ItemType.UNKNOWN;
          switch ((result as any).media_type) {
            case 'tv':
              type = ItemType.TV;
              break;
            case 'movie':
              type = ItemType.MOVIE;
              break;
            case 'person':
              type = ItemType.TV
          }

          return {
            type,
            result
          };
        });
        return value as SearchResult;
      }),
      catchError(this.handleError('getAll', GET_ALL_EMPTY_RESPONSE))
    );
  }

  handleError<T>(operation: string, result: T)
    : (error: unknown) => Observable<T> {
    return (error: unknown): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result);
    };
  }
}

const GET_ALL_EMPTY_RESPONSE = {
  page: 1,
  total_pages: 1,
  total_results: 0,
  results: []
};

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
  id: number; // tmdb id
}

export interface Tv {
  name: string;
  id: number; // tmdb id
  first_air_date: string;
}

export interface Person {

}

export interface SearchResult {
  page: number;
  total_pages: number;
  total_results: number;
  results: SearchResultItem[];
}
export interface SearchResultItem {
  type: ItemType,
  result: Movie | Tv | Person
}

export const enum ItemType {
  TV = 'TV',
  MOVIE = 'MOVIE',
  PERSON = 'PERSON',
  UNKNOWN = 'UNKNOWN'
}