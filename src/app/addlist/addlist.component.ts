import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListsService } from '../lists.service';

@Component({
  selector: 'app-addlist',
  templateUrl: './addlist.component.html',
  styleUrls: ['./addlist.component.css']
})
export class AddlistComponent implements OnInit {
  error: string;
  constructor(
    private router: Router,
    private listsService: ListsService
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.router.navigate(['']);
  }

  add(listName: string) {
    this.listsService.addList(listName).subscribe(
      _success => {
        this.router.navigate(['']);
      },
      error => {
        this.error = error;
      });
  }

}