import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieDetail, MovieService } from '../movie.service';
import { ListsService } from '../lists.service';
import { Observable } from 'rxjs';
import { posterPath } from '../util';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  movie$: Observable<MovieDetail>;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.movie$ = this.movieService.getMovie(id);
  }

  posterPath(movie: MovieDetail) {
    return posterPath(movie.poster_path);
  }
}
