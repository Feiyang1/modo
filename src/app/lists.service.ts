import { Injectable } from '@angular/core';

const DEFAULT_LIST: ToDoMovie[] = [{
  id: 9659,
  title: "Mad Max",
  watched: false
}, {
  id: 76341,
  title: "Mad Max: Fury Road",
  watched: false
}
];

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  constructor() { }

  getLists(): ToDoMovieList[] {
    return [{
      id: '1',
      name: 'my list',
      movies: DEFAULT_LIST
    }];
  }

  getList(id: string): ToDoMovie[] {
    return DEFAULT_LIST;
  }

  addToList(id: string, movie: { id: number, title: string }): void {
    DEFAULT_LIST.push({
      ...movie,
      watched: false
    });
  }
}

export interface ToDoMovieList {
  id: string;
  name: string;
  movies: ToDoMovie[];
}

export interface ToDoMovie {
  id: number; // tmdb id
  title: string;
  watched: boolean;
  watched_time?: string;
}
