import { Component, OnInit } from '@angular/core';
import { ToDoList, ListsService, ToDoMovie, ToDoTv } from '../lists.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../movie.service';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TvService } from '../tv.service';
import { ItemType } from '../search.service';

@Component({
  selector: 'app-add-to-list',
  templateUrl: './add-to-list.component.html',
  styleUrls: ['./add-to-list.component.css']
})
export class AddToListComponent implements OnInit {
  lists$: Observable<ToDoList[]>;
  error: string | null = null
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private tvService: TvService,
    private listsService: ListsService
  ) { }

  ngOnInit() {
    this.lists$ = this.listsService.getLists()
  }

  add(listName: string) {
    const itemId = this.route.parent!.snapshot.paramMap.get('id')!;
    const type = this.route.snapshot.data['type']! as ItemType;

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
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      error => {
        this.error = JSON.stringify(error);
      });
  }

  cancel() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

}
