import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListsService, ToDoList } from '../lists.service';
import { Observable } from 'rxjs';
import { routeParams$, routeParams } from '../util';
import { ItemType } from '../search.service';

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
      const name = params.name;
      this.type = params.type === 'movies' ? ItemType.MOVIE : ItemType.TV;
      this.list$ = this.listsService.getList(name);
    });
  }

  toggleWatch(id: number, watched: boolean) {
    this.listsService.updateItemWatchedState(this.getListName(), id, this.type, watched).subscribe(
      _success => {
        // do what?
      },
      _error => {
        // report error
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
