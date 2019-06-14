import { Injectable } from '@angular/core';
import { Observable, of, throwError, from } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, switchMap } from 'rxjs/operators';
import { firestore } from 'firebase/app';

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

// TODO: rewrite "check, then write operations" with transaction
@Injectable({
  providedIn: 'root'
})
export class ListsService {

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }

  getLists(): Observable<ToDoMovieList[]> {
    return this.afAuth.user.pipe(switchMap(user => {
      if (!user) {
        return throwError('not logged in');
      }

      return this.firestore.collection(`users/${user.uid}/lists`).valueChanges().pipe(map(querySnapshot => {
        const lists: ToDoMovieList[] = [];
        querySnapshot.forEach(result => {
          lists.push(result as ToDoMovieList);
        });
        return lists;
      }))
    }));
  }

  getListOnce(name: string): Observable<ToDoMovieList> {
    return this.afAuth.user.pipe(switchMap(user => {
      if(!user) {
        return throwError('not logged in');
      }

      return this.firestore.doc(`users/${user.uid}/lists/${name}`).get().pipe(map(doc => doc.data() as ToDoMovieList))
    }));
  }

  addToList(listName: string, movie: { imdb_id: string, id: number, title: string }): Observable<boolean> {

    return this.afAuth.user.pipe(switchMap(user => {
      if (!user) {
        return throwError('not logged in');
      }
      
      const docPath = `users/${user.uid}/lists/${listName}`;
      return this.listExists(user.uid, listName).pipe(switchMap(exists => {
        if (!exists) {
          return throwError('list does not exist');
        }
        // TODO: check if movie already exists using transaction
        return from(this.firestore.doc(docPath).update({
          movies: firestore.FieldValue.arrayUnion({
            ...movie,
            watched: false
          })
        })).pipe(map(_ => true));
      }));
    }));
  }

  addList(name: string): Observable<boolean> {

    const newList: ToDoMovieList = {
      name,
      movies: []
    };
    
    return this.afAuth.user.pipe(switchMap(user => {
      if(!user) {
        return throwError('not logged in');
      }

      const docPath = `users/${user.uid}/lists/${name}`;
      return this.listExists(user.uid, name).pipe(switchMap(exists => {
        if (exists) {
          return throwError(`List ${name} already exists`);
        }
  
        return from(this.firestore.doc(docPath).set(newList)).pipe(map(_ => {
          return true;
        }));
      }))
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

  private listExists(uid: string, listName: string): Observable<boolean> {
    return this.firestore.doc(`users/${uid}/lists/${listName}`).get().pipe(map(doc => doc.exists));
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
