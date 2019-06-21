import { Injectable } from '@angular/core';
import { Observable, of, throwError, from, zip } from 'rxjs';
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
      if (!user) {
        return throwError('not logged in');
      }

      return this.firestore.doc(`users/${user.uid}/lists/${name}`).get().pipe(map(doc => doc.data() as ToDoMovieList))
    }));
  }

  getList(name: string): Observable<ToDoMovieList | null> {
    return this.afAuth.user.pipe(
      switchMap(user => {
        if (!user) {
          return throwError('not logged in');
        }

        return of(user);
      }),
      switchMap(user =>
        this.firestore.doc(`users/${user.uid}/lists/${name}`).valueChanges() as Observable<ToDoMovieList | null>
      )
    );

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
      if (!user) {
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
    console.log('update movie watched')
    let docPath = '';
    return this.afAuth.user.pipe(
      switchMap(user => {
        if (!user) {
          return throwError('not logged in');
        }

        return of(user);
      }),
      switchMap((user) => {
        docPath = `users/${user.uid}/lists/${listName}`;
        return this.firestore.doc(docPath).get();
      }),
      switchMap(snapshot => {
        if (!snapshot.exists) {
          return throwError(`List ${listName} doesn't exist`);
        }

        const data: ToDoMovieList = snapshot.data() as ToDoMovieList;
        const movie = data.movies && data.movies.find((m) => m.id === movieId);

        if (!movie) {
          return throwError(`Movie ${movieId} doesn't exist in list ${listName}`);
        }

        movie.watched = watched;
        movie.watched_time = Date.now();

        return of(data.movies);
      }),
      switchMap(updatedMovies =>
        from(this.firestore.doc(docPath).update({
          movies: updatedMovies
        }))
      ),
      map(_ => true)
    );
  }

  deleteMovie(listName: string, movieId: number): Observable<boolean> {
    let docPath = '';
    return this.afAuth.user.pipe(
      switchMap(user => {
        if (!user) {
          return throwError('not logged in');
        }

        return of(user);
      }),
      switchMap(user => {
        docPath = `users/${user.uid}/lists/${listName}`;
        return this.firestore.doc(docPath).get();
      }),
      switchMap(snapshot => {
        if (!snapshot.exists) {
          return throwError(`List ${listName} doesn't exist`);
        }

        const data: ToDoMovieList = snapshot.data() as ToDoMovieList;
        const movies = data.movies || [];
        return from(this.firestore.doc(docPath).update({
          movies: movies.filter(m => m.id !== movieId)
        }));
      }),
      map( _ => true)
    );
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
  watched_time?: number; // ms since 1970
}
