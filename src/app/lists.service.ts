import { Injectable } from '@angular/core';
import { Observable, of, throwError, from } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs/operators';

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
    name: 'my list',
    movies: DEFAULT_LIST
  }
];

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  constructor(private firestore: AngularFirestore) { }

  getLists(): Observable<ToDoMovieList[]> {
    return this.firestore.collection('lists').get().pipe(map(querySnapshot => {
      const lists: ToDoMovieList[] = [];
      querySnapshot.forEach(result => {
        lists.push(result.data() as ToDoMovieList);
      });
      return lists;
    }));
  }

  getList(name: string): ToDoMovieList | undefined {
    return LISTS.find(list => list.name === name);
  }

  addToList(listName: string, movie: { imdb_id: string, id: number, title: string }): Observable<boolean> {
    const list = LISTS.find(list => list.name === listName);

    // should not happen
    if (!list) {
      return throwError('list does not exist');
    }

    if (list.movies.find(m => m.id === movie.id)) {
      return throwError('movie already exists in the list');
    }

    list.movies.push({
      ...movie,
      watched: false
    });

    return of(true);
  }

  addList(name: string): Observable<boolean> {

    const newList: ToDoMovieList = {
      name,
      movies: []
    };

    const docPath = `lists/${name}`;
    return this.firestore.doc(docPath).get().pipe(switchMap(doc => {
      if (doc.exists) {
        return throwError(`List ${name} already exists`);
      }

      return from(this.firestore.doc(`lists/${name}`).set(newList)).pipe(map(_ => {
        return true;
      }));
    }));
  }

  updateMovieWatchedState(listName: string, movieId: number, watched: boolean): Observable<boolean> {
    const list = LISTS.find(list => list.name === listName);

    // should not happen
    if (!list) {
      return throwError(`list ${listName} does not exist`);
    }

    const movie = list.movies.find(movie => movie.id === movieId);

    // should nto happen
    if (!movie) {
      return throwError(`movie ${movieId} does not exist`);
    }

    movie.watched = watched;
    movie.watched_time = Date.now().toString();

    return of(true);
  }
}

export interface ToDoMovieList {
  name: string; // should be unique
  movies: ToDoMovie[];
}

export interface ToDoMovie {
  id: number; // tmdb id
  imdb_id: string; // imdb_id
  title: string;
  watched: boolean;
  watched_time?: string; // ms since 1970
}
