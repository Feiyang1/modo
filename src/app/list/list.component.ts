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
    const id = this.route.snapshot.paramMap.get('id');
    this.todoMovies = this.listsService.getList(id);
  }

}
