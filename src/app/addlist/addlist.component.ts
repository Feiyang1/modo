import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ListsService } from '../lists.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

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

@Component({
  selector: 'app-addlist-dialog',
  template: ''
})
export class AddlistDialogComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // open dialog async, otherwise we will get ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      const dialogRef = this.dialog.open(AddlistComponent);
      dialogRef.afterClosed().subscribe(() => this.afterDialogClose());
    });
  }

  private afterDialogClose(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
