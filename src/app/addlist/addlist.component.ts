import { Component, OnInit } from '@angular/core';
import { ListsService } from '../lists.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-addlist',
  templateUrl: './addlist.component.html',
  styleUrls: ['./addlist.component.css']
})
export class AddlistComponent implements OnInit {
  error: string;
  constructor(
    private listsService: ListsService,
    public dialogRef: MatDialogRef<AddlistComponent>
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }

  add(listName: string) {
    this.listsService.addList(listName).subscribe(
      _success => {
        this.dialogRef.close();
      },
      error => {
        this.error = error;
      });
  }

}
