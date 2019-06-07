import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

const DEFAULT_LIST: ToDoMovie[] = [{
  id: 9659,
  imdb_id: 'test1',
  title: "Mad Max",
  watched: false
}, {
  id: 76341,
  imdb_id: 'test2',
  title: "Mad Max: Fury Road",
  watched: false
}];

const LISTS = [
  {
    id: '1',
    name: 'my list',
    movies: DEFAULT_LIST
  }
];

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  constructor() { }

  getLists(): ToDoMovieList[] {
    return LISTS;
  }

  getList(id: string): ToDoMovieList | undefined {
    return LISTS.find(list => list.id === id);
  }

  addToList(id: string, movie: { imdb_id: string, id: number, title: string }): void {
    DEFAULT_LIST.push({
      ...movie,
      watched: false
    });
  }

  addList(name: string): Observable<boolean> {
    if (LISTS.find(list => list.name === name)) {
      return of(false);
    };

    const newList: ToDoMovieList = {
      id: `${Math.floor(Math.random()*10000)}`,
      name,
      movies: []
    };

    LISTS.push(newList);
    return of(true);
  }
}

export interface ToDoMovieList {
  id: string;
  name: string;
  movies: ToDoMovie[];
}

export interface ToDoMovie {
  id: number; // tmdb id
  imdb_id: string; // imdb_id
  title: string;
  watched: boolean;
  watched_time?: string;
}
