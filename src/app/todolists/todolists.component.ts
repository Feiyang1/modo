import { Component, OnInit } from '@angular/core';
import { ListsService, ToDoMovieList } from '../lists.service';

@Component({
  selector: 'app-todolists',
  templateUrl: './todolists.component.html',
  styleUrls: ['./todolists.component.css']
})
export class TodolistsComponent implements OnInit {
  lists: ToDoMovieList[] = [];
  constructor(private listsService: ListsService) { }
  
  ngOnInit() {
    this.lists = this.listsService.getLists();
  }

  addList(): void {
    console.log('add a list');
  }

}
