import { Component, OnInit, Inject } from '@angular/core';
import { ToDoList, ListsService, ToDoMovie, ToDoTv } from '../lists.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../movie.service';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TvService } from '../tv.service';
import { ItemType } from '../search.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  itemId: string;
  type: ItemType;
}
@Component({
  selector: 'app-add-to-list',
  template: ''
})
export class AddToListDialogComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const itemId = this.route.parent!.snapshot.paramMap.get('id')!;
    const type = this.route.snapshot.data['type']! as ItemType;
    // open dialog async, otherwise we will get ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      const dialogRef = this.dialog.open(AddToListComponent, {
        data: {
          itemId,
          type
        }
      });

      dialogRef.afterClosed().subscribe(() => this.afterDialogClose());
    });
  }

  private afterDialogClose(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}

@Component({
  selector: 'app-add-to-list-dialog',
  templateUrl: './add-to-list.component.html',
  styleUrls: ['./add-to-list.component.css']
})
export class AddToListComponent {
  lists: ToDoList[];
  error: string | null = null
  selected: string;
  constructor(
    private movieService: MovieService,
    private tvService: TvService,
    private listsService: ListsService,
    public dialogRef: MatDialogRef<AddToListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    this.listsService.getLists().subscribe((lists) => {
      this.lists = lists;
      this.selected = lists[0] && lists[0].name;
    })
  }

  add(listName: string) {
    const itemId = this.data.itemId;
    const type = this.data.type;

    let todoItem$: Observable<ToDoMovie | ToDoTv>;
    if (type === ItemType.MOVIE) {
      todoItem$ = this.movieService.getMovie(itemId).pipe(
        map(movie => ({
          imdb_id: movie.imdb_id,
          id: movie.id,
          title: movie.title,
          watched: false
        }))
      );
    } else { // Adding a TV
      todoItem$ = this.tvService.getTv(itemId).pipe(
        map(tv => ({
          id: tv.id,
          name: tv.name,
          watched: false
        }))
      );
    }

    todoItem$.pipe(
      switchMap(item => this.listsService.addToList(
        listName,
        item,
        type
      ))
    ).subscribe(
      _success => {
        this.dialogRef.close();
      },
      error => {
        this.error = JSON.stringify(error);
      });
  }

  cancel() {
    this.dialogRef.close();
  }
}
