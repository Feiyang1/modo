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
  constructor(private listsService: ListsService, private route: ActivatedRoute) { }
  
  ngOnInit() {
    this.lists$ = this.listsService.getLists();
  }

  isListChildView(): boolean {
    const childView = this.route.children[0];
    return childView && childView.snapshot.routeConfig!.path === 'list/:name';
  }
}
