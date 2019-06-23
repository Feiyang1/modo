import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieDetail, MovieService } from '../movie.service';
import { ListsService } from '../lists.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  movie$: Observable<MovieDetail>;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private listsService: ListsService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.movie$ = this.movieService.getMovie(id);
  }

  private addMovieToList(movie: MovieDetail): void {
    this.listsService.addToList('1', {
      id: movie.id,
      imdb_id: movie.imdb_id,
      title: movie.title
    });
  }
}
