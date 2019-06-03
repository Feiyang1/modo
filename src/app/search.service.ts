import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }

  getMovies(options: MovieSearchOptions): Movie[] {
    return [
      {
        title: 'Mad max',
        release_date: '2015-05-13'
      },
      {
        title: 'Finding dory',
        release_date: '2016-06-16'
      }
    ];
  }

  getTVs(options: TVSearchOptions) {

  }

  getPeople(options: SearchOptions) {

  }

  getAll(options: SearchOptions) {

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
}