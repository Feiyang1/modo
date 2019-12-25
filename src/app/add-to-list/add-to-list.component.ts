import { Component, Inject } from '@angular/core';
import { ToDoList, ListsService, ToDoMovie, ToDoTv } from '../lists.service';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../movie.service';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TvService } from '../tv.service';
import { ItemType } from '../search.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  route: ActivatedRoute;
}

@Component({
  selector: 'app-add-to-list',
  templateUrl: './add-to-list.component.html',
  styleUrls: ['./add-to-list.component.css']
})
export class AddToListComponent {
  lists: ToDoList[];
  error: string | null = null
  selected: string;
  itemId!: string;
  itemType!: ItemType;
  constructor(
    private movieService: MovieService,
    private tvService: TvService,
    private listsService: ListsService,
    public dialogRef: MatDialogRef<AddToListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.itemId = data.route.parent!.snapshot.paramMap.get('id')!;
    this.itemType = data.route.snapshot.data['type']! as ItemType;
   }

  ngOnInit() {
    this.listsService.getLists().subscribe((lists) => {
      this.lists = lists;
      this.selected = lists[0] && lists[0].name;
    })
  }

  add(listName: string) {
    const itemId = this.itemId;
    const type = this.itemType;

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
