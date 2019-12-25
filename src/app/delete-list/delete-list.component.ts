import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListsService } from '../lists.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface DialogData {
  route: ActivatedRoute;
}
@Component({
  selector: 'app-delete-list',
  templateUrl: './delete-list.component.html',
  styleUrls: ['./delete-list.component.css']
})
export class DeleteListComponent implements OnInit {
  listName: string;
  error: string;

  constructor(
    private listsService: ListsService,
    public dialogRef: MatDialogRef<DeleteListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    this.listName = this.data.route.snapshot.paramMap.get('name') || '';
  }

  deleteList() {
    this.listsService.deleteList(this.listName).subscribe(
      (_success) => {
        this.dialogRef.close();
      },
      (error) => {
        this.error = JSON.stringify(error);
      });
  }

  cancel() {
    this.dialogRef.close();
  }

}
