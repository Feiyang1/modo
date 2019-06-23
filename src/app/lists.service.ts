import { Injectable } from '@angular/core';
import { Observable, of, throwError, from, zip } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, switchMap } from 'rxjs/operators';
import { firestore } from 'firebase/app';
import { ItemType } from './search.service';

// TODO: rewrite "check, then write operations" with transaction
@Injectable({
  providedIn: 'root'
})
export class ListsService {

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }

  getLists(): Observable<ToDoList[]> {
    return this.afAuth.user.pipe(switchMap(user => {
      if (!user) {
        return throwError('not logged in');
      }

      return this.firestore.collection(`users/${user.uid}/lists`).valueChanges().pipe(map(querySnapshot => {
        const lists: ToDoList[] = [];
        querySnapshot.forEach(result => {
          lists.push(result as ToDoList);
        });
        return lists;
      }))
    }));
  }

  getListOnce(name: string): Observable<ToDoList> {
    return this.afAuth.user.pipe(switchMap(user => {
      if (!user) {
        return throwError('not logged in');
      }

      return this.firestore.doc(`users/${user.uid}/lists/${name}`).get().pipe(map(doc => doc.data() as ToDoList))
    }));
  }

  getList(name: string): Observable<ToDoList | null> {
    return this.afAuth.user.pipe(
      switchMap(user => {
        if (!user) {
          return throwError('not logged in');
        }

        return of(user);
      }),
      switchMap(user =>
        this.firestore.doc(`users/${user.uid}/lists/${name}`).valueChanges() as Observable<ToDoList | null>
      )
    );

  }

  addToList(listName: string, item: ToDoMovie | ToDoTv, itemType: ItemType): Observable<boolean> {

    return this.afAuth.user.pipe(switchMap(user => {
      if (!user) {
        return throwError('not logged in');
      }

      const docPath = `users/${user.uid}/lists/${listName}`;
      const arrayName = itemType === ItemType.MOVIE ? 'movies' : 'tvs';
      return this.listExists(user.uid, listName).pipe(switchMap(exists => {
        if (!exists) {
          return throwError('list does not exist');
        }
        // TODO: check if movie already exists using transaction
        return from(this.firestore.doc(docPath).update({
          [arrayName]: firestore.FieldValue.arrayUnion({
            ...item,
            watched: false
          })
        })).pipe(map(_ => true));
      }));
    }));
  }

  addList(name: string): Observable<boolean> {

    const newList: ToDoList = {
      name,
      movies: [],
      tvs: []
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


  // TODO: implement watching a tv
  updateItemWatchedState(listName: string, itemId: number, itemType: ItemType, watched: boolean): Observable<boolean> {
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

        const data: ToDoList = snapshot.data() as ToDoList;
        const movie = data.movies && data.movies.find((m) => m.id === itemId);

        if (!movie) {
          return throwError(`Movie ${itemId} doesn't exist in list ${listName}`);
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

  // TODO: implement deleting TV
  deleteItem(listName: string, itemId: number, itemType: ItemType): Observable<boolean> {
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

        const data: ToDoList = snapshot.data() as ToDoList;
        const movies = data.movies || [];
        return from(this.firestore.doc(docPath).update({
          movies: movies.filter(m => m.id !== itemId)
        }));
      }),
      map( _ => true)
    );
  }

  private listExists(uid: string, listName: string): Observable<boolean> {
    return this.firestore.doc(`users/${uid}/lists/${listName}`).get().pipe(map(doc => doc.exists));
  }

}

export interface ToDoList {
  name: string; // should be unique
  movies: ToDoMovie[];
  tvs: ToDoTv[];
}

export interface ToDoMovie {
  id: number; // tmdb id
  imdb_id: string; // imdb_id
  title: string;
  watched: boolean;
  watched_time?: number; // ms since 1970
}

export interface ToDoTv {
  id: number; // tmdb id
  name: string;
  // TODO: season watched, episode watched
  watched: boolean;
  watched_time?: number; // ms since 1970
}
