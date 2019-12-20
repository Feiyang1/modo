import { Component, OnInit, Input } from '@angular/core';
import { ToDoList } from '../lists.service';

@Component({
  selector: 'app-todolists-item',
  templateUrl: './todolists-item.component.html',
  styleUrls: ['./todolists-item.component.css']
})
export class TodolistsItemComponent implements OnInit {
  @Input() list: ToDoList;
  listSummaryWidth: string | null = null;

  constructor() {
  }

  ngOnInit() {
  }

  // TODO swipe to delete
  private onPan(event) {
    console.log('panning!', event)
  }
}
