import { Component, OnInit } from '@angular/core';
import { ToDoMovieList, ListsService } from '../lists.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../movie.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-add-to-list',
  templateUrl: './add-to-list.component.html',
  styleUrls: ['./add-to-list.component.css']
})
export class AddToListComponent implements OnInit {
  lists: ToDoMovieList[] = [];
  error: string | null = null
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private listsService: ListsService) { }

  ngOnInit() {
    this.lists = this.listsService.getLists()
  }

  add(listId: string) {
    const movieId = this.route.parent.snapshot.paramMap.get('id');
    this.movieService.getMovie(movieId).pipe(
      switchMap(movie => {
        return this.listsService.addToList(listId, { imdb_id: movie.imdb_id, id: movie.id, title: movie.title });
      })
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
