import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListsService, ToDoMovie } from '../lists.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  todoMovies: ToDoMovie[] = [];

  constructor(
    private route: ActivatedRoute,
    private listsService: ListsService
  ) { }

  ngOnInit() {
    // subscribe to params change
    this.route.params.subscribe(params => {
      const id = params.id;
      const list = this.listsService.getList(id);

      // should always be true
      if (list) {
        this.todoMovies = list.movies;
      }
    });
  }

}
