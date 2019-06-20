import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListsService, ToDoMovie, ToDoMovieList } from '../lists.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  list$: Observable<ToDoMovieList | null>;

  constructor(
    private route: ActivatedRoute,
    private listsService: ListsService
  ) { }

  ngOnInit() {
    // subscribe to params change
    this.route.params.subscribe(params => {
      const name = params.name;
      this.list$ = this.listsService.getList(name);
    });
  }

  toggleWatch(id: number, watched: boolean) {
    const listName = this.route.snapshot.paramMap.get('name')!;
    this.listsService.updateMovieWatchedState(listName, id, watched).subscribe(
      _success => {
        // do what?
      },
      _error => {
        // report error
      });
  }

}
