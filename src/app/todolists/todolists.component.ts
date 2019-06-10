import { Component, OnInit } from '@angular/core';
import { ListsService, ToDoMovieList } from '../lists.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todolists',
  templateUrl: './todolists.component.html',
  styleUrls: ['./todolists.component.css']
})
export class TodolistsComponent implements OnInit {
  lists$: Observable<ToDoMovieList[]>;
  constructor(private listsService: ListsService) { }
  
  ngOnInit() {
    this.lists$ = this.listsService.getLists();
  }
}
