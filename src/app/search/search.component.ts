import { Component, OnInit } from '@angular/core';
import { Movie, SearchService } from '../search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private movies: Movie[] = [];
  constructor(private searchService: SearchService) { }

  ngOnInit() {
    this.searchService.getMovies({
      query: 'Mad Max'
    }).subscribe((movies: Movie[]) => this.movies = movies);
  }

}
