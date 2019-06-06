import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addlist',
  templateUrl: './addlist.component.html',
  styleUrls: ['./addlist.component.css']
})
export class AddlistComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  cancel() {
    this.router.navigate(['']);
  }

  add(listName: string) {
    console.log('new list name is ', listName);
  }

}
