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

// class AddlistDialogComponent implements OnInit {
//   constructor(
//     public dialog: MatDialog,
//     private route: ActivatedRoute,
//     private router: Router
//   ) { }

//   ngOnInit() {
//   }

//   ngAfterViewInit() {
//     const itemId = this.route.parent!.snapshot.paramMap.get('id')!;
//     const type = this.route.snapshot.data['type']! as ItemType;
//     // open dialog async, otherwise we will get ExpressionChangedAfterItHasBeenCheckedError
//     setTimeout(() => {
//       const dialogRef = this.dialog.open(AddToListDialogComponent, {
//         data: {
//           itemId,
//           type
//         }
//       });

//       dialogRef.afterClosed().subscribe(() => this.afterDialogClose());
//     });
//   }

//   private afterDialogClose(): void {
//     this.router.navigate(['..'], { relativeTo: this.route });
//   }
// }
