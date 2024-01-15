import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListsService, ToDoList, ToDoMovie, ToDoTv } from '../lists.service';
import { Observable } from 'rxjs';
import { routeParams$, routeParams } from '../util';
import { ItemType } from '../search.service';
import { map } from 'rxjs/operators';
import { Visibility } from '../list-container/list-container.misc';

// TV list or Movie list
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  list$: Observable<ToDoList | null>;
  type: ItemType = ItemType.UNKNOWN;

  constructor(
    private route: ActivatedRoute,
    private listsService: ListsService
  ) { }

  ngOnInit() {
    // subscribe to params change
    routeParams$(this.route).subscribe(params => {
      const { name, type, visibility } = params;
      this.type = type === 'movies' ? ItemType.MOVIE : ItemType.TV;
      this.list$ = this.listsService.getList(name).pipe(map(list => {

        if (visibility === Visibility.All || list == null) {
          return list;
        }

        const showWatched = visibility === Visibility.Watched;
        const filteredList = { ...list };
        filteredList.movies = filteredList.movies.filter((movie: ToDoMovie) => movie.watched === showWatched);
        filteredList.tvs = filteredList.tvs.filter((tv: ToDoTv) => tv.watched === showWatched);
        console.log(visibility, filteredList, params)
        return filteredList;
      }));
    });
  }

  updateWatched(id: number, watched: boolean) {
    this.listsService.updateItemWatchedState(id, this.type, watched).subscribe(
      _success => {
        // do what?
      },
      _error => {
        // report error
        console.log(_error);
      });
  }

  deleteItem(id: number) {
    this.listsService.deleteItem(this.getListName(), id, this.type).subscribe(
      _success => {
        // do what?
      },
      _error => {
        // report error
      }
    );
  }

  private getListName() {
    return routeParams(this.route)['name'];
  }

  isMovieList(): boolean {
    return this.type === ItemType.MOVIE;
  }

}
