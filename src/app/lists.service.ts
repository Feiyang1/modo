import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError, from, zip } from 'rxjs';
import {
  Firestore, collection, collectionData, doc, docData,
  runTransaction, arrayUnion, deleteDoc, getDocs, writeBatch
} from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { map, switchMap } from 'rxjs/operators';
import { ItemType } from './search.service';
import { todoArrayName } from './util';

// TODO: delete a list, pagination
@Injectable({
  providedIn: 'root'
})
export class ListsService {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  constructor(
  ) { }

  getLists(): Observable<ToDoList[]> {
    return user(this.auth).pipe(switchMap(user => {
      if (!user) {
        return throwError('not logged in');
      }

      return collectionData(collection(this.firestore, `users/${user.uid}/lists`)).pipe(map(querySnapshot => {
        const lists: ToDoList[] = [];
        querySnapshot.forEach(result => {
          lists.push(result as ToDoList);
        });
        return lists;
      }))
    }));
  }

  getListOnce(name: string): Observable<ToDoList> {
    return user(this.auth).pipe(switchMap(user => {
      if (!user) {
        return throwError('not logged in');
      }

      return docData(doc(this.firestore, `users/${user.uid}/lists/${name}`)).pipe(map(doc => doc!.data() as ToDoList))
    }));
  }

  getList(name: string): Observable<ToDoList | null> {
    return user(this.auth).pipe(
      switchMap(user => {
        if (!user) {
          return throwError('not logged in');
        }

        return of(user);
      }),
      switchMap(user =>
        docData(doc(this.firestore, `users/${user.uid}/lists/${name}`)) as Observable<ToDoList | null>
      )
    );

  }

  addToList(listName: string, item: ToDoMovie | ToDoTv, itemType: ItemType): Observable<boolean> {

    return user(this.auth).pipe(
      switchMap(user => {
        if (!user) {
          return throwError('not logged in');
        }

        const docRef = doc(this.firestore, `users/${user.uid}/lists/${listName}`);
        const arrayName = todoArrayName(itemType);


        return from(runTransaction(this.firestore, async transaction => {

          const doc = await transaction.get(docRef);
          if (!doc.exists) {
            throw Error('list does not exist');
          }
          type a = typeof list[typeof arrayName]
          const list = doc.data() as ToDoList;
          if ((list[arrayName] as any[]).findIndex(it => it.id === item.id) !== -1) {
            throw Error(`Movie already exists in list ${listName}`);
          }

          transaction.update(docRef, {
            [arrayName]: arrayUnion({
              ...item,
              watched: false
            })
          });
        }));
      }),
      map(_ => true)
    );
  }

  addList(name: string): Observable<boolean> {

    const newList: ToDoList = {
      name,
      movies: [],
      tvs: []
    };

    return user(this.auth).pipe(
      switchMap(user => {
        if (!user) {
          return throwError('not logged in');
        }

        const docRef = doc(this.firestore, `users/${user.uid}/lists/${name}`);

        return from(
          runTransaction(this.firestore, async transaction => {
            const doc = await transaction.get(docRef);

            if (doc.exists()) {
              throw Error(`List ${name} already exists`);
            }
            transaction.set(docRef, newList);
          })
        );
      }),
      map(_ => true)
    );
  }

  deleteList(name: string): Observable<boolean> {
    return user(this.auth).pipe(
      switchMap(user => {
        if (!user) {
          return throwError('not logged in');
        }
        const docPath = `users/${user.uid}/lists/${name}`;

        // Firestore write promises don't resolve until they hit the server.
        // For offline to work correctly, we are not waiting for the promise to resolve before returning the control
        deleteDoc(doc(this.firestore, docPath)).then(
          (_res) => {
            // no op
          },
          (err) => {
            console.log('delete failed to server', err)
          }
        );

        return of(true);
      })
    );
  }

  // Not using transaction
  // TODO: watch a season/episode of a TV series
  updateItemWatchedState(itemId: number, itemType: ItemType, watched: boolean): Observable<boolean> {
    console.log('update movie watched')
    const arrayName = todoArrayName(itemType);

    return user(this.auth).pipe(
      switchMap(user => {
        if (!user) {
          return throwError('not logged in');
        }

        return of(user);
      }),
      switchMap(user =>
        getDocs(collection(this.firestore, `users/${user.uid}/lists`))
      ),
      switchMap(querySnapshot => {
        const batch = writeBatch(this.firestore);
        querySnapshot.forEach(result => {
          const list = result.data() as ToDoList;
          const item: ToDoMovie | ToDoTv = (list[arrayName] as any[]).find(item => item.id === itemId);

          // list doesn't have the movie
          if (!item) {
            return;
          }

          item.watched = watched;
          item.watched_time = Date.now();

          batch.update(result.ref, {
            [arrayName]: list[arrayName]
          });
        });

        return from(batch.commit());
      }),
      map(_ => true)
    );
  }

  deleteItem(listName: string, itemId: number, itemType: ItemType): Observable<boolean> {
    const arrayName = todoArrayName(itemType);
    return user(this.auth).pipe(
      switchMap(user => {
        if (!user) {
          return throwError('not logged in');
        }

        return of(user);
      }),
      switchMap(user => {
        const docRef = doc(this.firestore, `users/${user.uid}/lists/${listName}`);
        return from(
          runTransaction(this.firestore, async transaction => {
            const doc = await transaction.get(docRef);
            if (!doc.exists) {
              throw Error(`List ${listName} doesn't exist`);
            }

            const data = doc.data() as ToDoList;
            const items = data[arrayName] || [];

            transaction.update(
              docRef,
              {
                [arrayName]: Array.prototype.filter.call(items, m => m.id !== itemId)
              }
            )
          }));
      }),
      map(_ => true)
    );
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
