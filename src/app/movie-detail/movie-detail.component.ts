import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieDetail, MovieService } from '../movie.service';
import { ListsService } from '../lists.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  movie: MovieDetail;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private listsService: ListsService
  ) { }

  ngOnInit() {
    this.getMovieDetail();
  }

  private getMovieDetail(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.movieService.getMovie(id).subscribe(value => this.movie = value);
  }

  private addMovieToList(movie: MovieDetail): void {
    this.listsService.addToList('1', {
      id: movie.id,
      imdb_id: movie.imdb_id,
      title: movie.title
    });
  }
}
