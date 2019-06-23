import { Component, OnInit } from '@angular/core';
import { ListsService, ToDoList } from '../lists.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-todolists',
  templateUrl: './todolists.component.html',
  styleUrls: ['./todolists.component.css']
})
export class TodolistsComponent implements OnInit {
  lists$: Observable<ToDoList[]>;
  constructor(private listsService: ListsService, public route: ActivatedRoute) { }
  
  ngOnInit() {
    this.lists$ = this.listsService.getLists();
  }
}
