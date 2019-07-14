import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListsService } from '../lists.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-delete-list',
  templateUrl: './delete-list.component.html',
  styleUrls: ['./delete-list.component.css']
})
export class DeleteListComponent implements OnInit {
  listName: string;
  error: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listsService: ListsService
  ) { }

  ngOnInit() {
    this.listName = this.route.snapshot.paramMap.get('name') || '';
  }

  deleteList() {
    this.listsService.deleteList(this.listName).subscribe(
      (_success) => {
        this.router.navigate(['mylists']);
      },
      (error) => {
        this.error = JSON.stringify(error);
      });
  }

  cancel() {
    this.router.navigate(['mylists']);
  }

}
